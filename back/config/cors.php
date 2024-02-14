<?php

/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 */
return [

    'allow_origins' => env('APP_ENV') === 'production' ? [env('APP_URL')] : ['*'],

    'allow_headers' => env('APP_ENV') === 'production' ? ['Content-Type', 'X-Auth-Token', 'Origin', 'Authorization'] : ['*'],

    'allow_methods' => env('APP_ENV') === 'production' ? ['GET', 'POST', 'PUT', 'DELETE'] : ['*'],

    'allow_credentials' => env('APP_ENV') === 'production' ? true : false,

    'expose_headers' => [],

    'max_age' => 0,

];
