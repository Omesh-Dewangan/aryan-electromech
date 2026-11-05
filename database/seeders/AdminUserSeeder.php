<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $name = trim((string) config('admin.name'));
        $email = mb_strtolower(trim((string) config('admin.email')));
        $password = (string) config('admin.password');

        if ($name === '' || ! filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($password) < 12) {
            throw new RuntimeException('Set ADMIN_NAME, a valid ADMIN_EMAIL, and an ADMIN_PASSWORD of at least 12 characters in the server .env before running this seeder.');
        }

        $existingUser = User::query()->where('email', $email)->first();

        if ($existingUser) {
            if (! $existingUser->is_admin) {
                throw new RuntimeException('The configured admin email already belongs to a non-admin user. Choose a different ADMIN_EMAIL.');
            }

            $this->command?->warn("Admin account {$email} already exists; its password was left unchanged.");

            return;
        }

        User::query()->create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'is_admin' => true,
        ]);

        $this->command?->info("Admin account {$email} created successfully.");
    }
}
