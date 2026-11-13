<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title inertia>{{ config('app.name', 'Aryan Electro Mech') }}</title>
        <meta name="description" content="Aryan Electro Mech manufactures and supplies electrical control panels and automation solutions in Raipur, Chhattisgarh.">
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="{{ config('app.name', 'Aryan Electro Mech') }}">
        <meta property="og:title" content="{{ config('app.name', 'Aryan Electro Mech') }} | Electrical Panels & Automation">
        <meta property="og:description" content="Electrical control panels and automation solutions, built for your plant in Raipur, Chhattisgarh.">
        <meta name="twitter:card" content="summary">
        <meta name="twitter:title" content="{{ config('app.name', 'Aryan Electro Mech') }} | Electrical Panels & Automation">
        <meta name="twitter:description" content="Electrical control panels and automation solutions, built for your plant in Raipur, Chhattisgarh.">
        @viteReactRefresh
        @vite('resources/js/app.tsx')
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
