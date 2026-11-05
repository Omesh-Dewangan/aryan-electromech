# Aryan Electromech website and admin

Laravel 13, Inertia React, TypeScript and Tailwind power the public website and the client-friendly admin area.

## Start locally

1. Open XAMPP Control Panel and start **MySQL**. Apache is not needed when using Laravel's development server.
2. In `laravel-app/.env`, set the database values below. The default XAMPP root account has no password unless you changed it.

```dotenv
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=aryan_electromech
DB_USERNAME=root
DB_PASSWORD=
```

3. Create the database in phpMyAdmin (http://localhost/phpmyadmin) named `aryan_electromech`, or run this from PowerShell:

```powershell
C:\xampp\mysql\bin\mysql.exe -h 127.0.0.1 -P 3306 -u root -e "CREATE DATABASE IF NOT EXISTS aryan_electromech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

4. From the `laravel-app` folder, run:

```powershell
php artisan config:clear
php artisan migrate --seed
php artisan admin:create
```

`admin:create` asks for your name, email and a private password (12 or more characters). No shared/default admin password is created.

5. In one terminal run `php artisan serve`; in another run `npm run dev`. Open http://127.0.0.1:8000.

## Admin guide

Open **http://127.0.0.1:8000/admin/login** and sign in with the account you created. The left menu is organized by the website sections:

- **Dashboard** shows enquiry totals and recent requests.
- **Homepage** edits hero and About text and replaces their images.
- **Products** adds, edits, sorts, shows/hides and removes catalogue items, including product photos.
- **Services**, **Industries** and **Process** manage the matching website lists.
- **Enquiries** lets you call the client and track each request as New, Contacted or Closed.
- **Contact & branding** updates company/contact information, WhatsApp, map, and the header logo.

Uploaded website images are served from `public/uploads` through a dedicated upload disk. This works in XAMPP on Windows without requiring symlink permissions. Existing assets in `public/images` remain available.

## Development checks

```powershell
npx tsc --noEmit
npm run build
php artisan route:list
```
