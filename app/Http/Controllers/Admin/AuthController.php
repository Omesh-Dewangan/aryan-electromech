<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class AuthController extends Controller
{
    public function create(): InertiaResponse|RedirectResponse
    {
        if (Auth::user()?->is_admin) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('admin/auth/login');
    }

    public function store(Request $request, RateLimiter $limiter): RedirectResponse
    {
        $data = $request->validate([
            'login_id' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
        ]);
        $identifier = trim($data['login_id']);
        $key = 'admin-login:'.strtolower($identifier).'|'.$request->ip();

        if ($limiter->tooManyAttempts($key, 5)) {
            throw ValidationException::withMessages([
                'login_id' => 'Too many attempts. Try again in '.$limiter->availableIn($key).' seconds.',
            ]);
        }

        $credentials = ['password' => $data['password']];
        $authenticated = Auth::attempt(['login_id' => $identifier, ...$credentials], $request->boolean('remember'))
            || Auth::attempt(['email' => $identifier, ...$credentials], $request->boolean('remember'));

        if (! $authenticated || ! $request->user()?->is_admin) {
            Auth::logout();
            $limiter->hit($key, 60);
            throw ValidationException::withMessages(['login_id' => 'The Login ID/email or password is incorrect.']);
        }

        $limiter->clear($key);
        $request->session()->regenerate();
        User::query()->whereKey($request->user()->getKey())->increment('login_count', 1, [
            'last_login_at' => now(),
            'updated_at' => now(),
        ]);
        DB::table('admin_login_sessions')->insert([
            'user_id' => $request->user()->getKey(),
            'session_id' => $request->session()->getId(),
            'logged_in_at' => now(),
            'last_seen_at' => now(),
        ]);

        return redirect()->intended(route('admin.dashboard'));
    }

    public function heartbeat(Request $request): \Illuminate\Http\Response
    {
        DB::table('admin_login_sessions')
            ->where('user_id', $request->user()->getKey())
            ->where('session_id', $request->session()->getId())
            ->whereNull('logged_out_at')
            ->update(['last_seen_at' => now()]);

        return response()->noContent();
    }

    public function destroy(Request $request): RedirectResponse
    {
        DB::table('admin_login_sessions')
            ->where('user_id', $request->user()?->getKey())
            ->where('session_id', $request->session()->getId())
            ->whereNull('logged_out_at')
            ->update(['logged_out_at' => now(), 'last_seen_at' => now()]);

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
