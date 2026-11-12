<?php

use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\CollectionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EnquiryController;
use App\Http\Controllers\Admin\HomepageController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PublicEnquiryController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::post('/enquiries', [PublicEnquiryController::class, 'store'])->middleware('throttle:6,1')->name('enquiries.store');

Route::prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/login', [AdminAuthController::class, 'create'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'store'])->middleware('throttle:6,1')->name('login.store');

    Route::middleware('admin')->group(function (): void {
        Route::post('/logout', [AdminAuthController::class, 'destroy'])->name('logout');
        Route::post('/presence', [AdminAuthController::class, 'heartbeat'])->name('presence');
        Route::get('/', DashboardController::class)->name('dashboard');
        Route::get('/homepage', [HomepageController::class, 'edit'])->name('homepage.edit');
        Route::put('/homepage', [HomepageController::class, 'update'])->name('homepage.update');
        Route::get('/settings', [SettingsController::class, 'edit'])->name('settings.edit');
        Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');
        Route::get('/products', [ProductController::class, 'index'])->name('products.index');
        Route::post('/products', [ProductController::class, 'store'])->name('products.store');
        Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
        Route::get('/enquiries', [EnquiryController::class, 'index'])->name('enquiries.index');
        Route::patch('/enquiries/{enquiry}', [EnquiryController::class, 'update'])->name('enquiries.update');
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->whereNumber('user')->name('users.destroy');

        Route::get('/{resource}', [CollectionController::class, 'index'])
            ->whereIn('resource', ['services', 'industries', 'process'])->name('collections.index');
        Route::post('/{resource}', [CollectionController::class, 'store'])
            ->whereIn('resource', ['services', 'industries', 'process'])->name('collections.store');
        Route::put('/{resource}/{id}', [CollectionController::class, 'update'])
            ->whereIn('resource', ['services', 'industries', 'process'])->whereNumber('id')->name('collections.update');
        Route::delete('/{resource}/{id}', [CollectionController::class, 'destroy'])
            ->whereIn('resource', ['services', 'industries', 'process'])->whereNumber('id')->name('collections.destroy');
    });
});
