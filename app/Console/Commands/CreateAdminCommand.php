<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateAdminCommand extends Command
{
    protected $signature = 'admin:create';

    protected $description = 'Create or update an administrator login';

    public function handle(): int
    {
        $name = $this->ask('Admin name');
        if (! is_string($name) || trim($name) === '') {
            $this->error('Name is required.');
            return self::FAILURE;
        }

        $email = Str::lower(trim((string) $this->ask('Admin email')));
        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Enter a valid email address.');
            return self::FAILURE;
        }

        $password = (string) $this->secret('Password (minimum 12 characters)');
        if (mb_strlen($password) < 12) {
            $this->error('Password must contain at least 12 characters.');
            return self::FAILURE;
        }

        $confirmedPassword = (string) $this->secret('Confirm password');
        if (! hash_equals($password, $confirmedPassword)) {
            $this->error('Passwords do not match.');
            return self::FAILURE;
        }

        User::query()->updateOrCreate(
            ['email' => $email],
            ['name' => trim($name), 'password' => Hash::make($password), 'is_admin' => true],
        );

        $this->info("Administrator {$email} is ready. Open /admin/login to sign in.");

        return self::SUCCESS;
    }
}
