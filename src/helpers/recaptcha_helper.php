<?php
/**
 * reCAPTCHA v3 + Honeypot spam protection helper
 */

function verify_recaptcha($token, $secret_key) {
    if (empty($token) || empty($secret_key)) {
        return false;
    }

    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $data = [
        'secret' => $secret_key,
        'response' => $token
    ];

    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
            'timeout' => 10
        ]
    ];

    $context = stream_context_create($options);
    $result = @file_get_contents($url, false, $context);

    if ($result === false) {
        error_log("reCAPTCHA verification failed: could not reach Google servers");
        return false;
    }

    $response = json_decode($result, true);

    if (!$response['success'] || ($response['score'] ?? 0) < 0.5) {
        error_log("reCAPTCHA failed: " . json_encode($response));
        return false;
    }

    return true;
}

function check_honeypot($field_value) {
    return empty($field_value);
}

function get_recaptcha_keys() {
    $env_file = __DIR__ . '/../../.env.php';
    if (file_exists($env_file)) {
        $env = require $env_file;
        return [
            'site_key' => $env['RECAPTCHA_SITE_KEY'] ?? '',
            'secret_key' => $env['RECAPTCHA_SECRET_KEY'] ?? ''
        ];
    }
    return ['site_key' => '', 'secret_key' => ''];
}
