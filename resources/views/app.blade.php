<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('app.name', 'XpressUTC') }}</title>
        
        <!-- Favicon -->
        <link rel="icon" type="image/png" href="{{ asset('images/UTC_LOGO.png') }}">
        <link rel="shortcut icon" type="image/png" href="{{ asset('images/UTC_LOGO.png') }}">
        <link rel="apple-touch-icon" href="{{ asset('images/UTC_LOGO.png') }}">
        
        <!-- Preconnect para Google Fonts - mejora el performance -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <!-- Google Fonts con display=swap para mejor performance -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
        <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet"></noscript>
        
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body>
        @inertia
    </body>
</html>
