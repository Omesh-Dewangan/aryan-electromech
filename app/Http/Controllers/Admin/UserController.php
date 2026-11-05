<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('admin/users/index', [
            'users' => User::query()->where('is_admin', true)->orderBy('name')->get(['id', 'name', 'email', 'created_at']),
            'currentUserId' => (int) $request->user()->getKey(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:12', 'confirmed'],
        ], [
            'password.confirmed' => 'The passwords do not match.',
            'password.min' => 'Use at least 12 characters for the password.',
        ]);

        User::query()->create([
            'name' => trim($data['name']),
            'email' => mb_strtolower(trim($data['email'])),
            'password' => Hash::make($data['password']),
            'is_admin' => true,
        ]);

        return back()->with('success', 'Admin user created. They can now sign in with that email and password.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        if (! $user->is_admin) {
            abort(404);
        }

        if ((int) $request->user()->getKey() === (int) $user->getKey()) {
            return back()->with('error', 'You cannot remove the account you are currently using.');
        }

        $removed = DB::transaction(function () use ($user): bool {
            $admins = User::query()->where('is_admin', true)->lockForUpdate()->get(['id']);
            if ($admins->count() <= 1) {
                return false;
            }

            $user->delete();

            return true;
        });

        return $removed
            ? back()->with('success', 'Admin user removed.')
            : back()->with('error', 'Keep at least one admin account so the website can still be managed.');
    }
}
