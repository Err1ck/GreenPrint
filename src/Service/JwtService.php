<?php

namespace App\Service;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtService
{
    private string $secretKey;

    public function __construct()
    {
        $this->secretKey = $_ENV['JWT_SECRET'] ?? 'default_secret';
    }

    public function generateToken(array $payload, int $expMinutes = 60): string
    {
        $now = time();
        $exp = $now + ($expMinutes * 60);

        $token = [
            'iat' => $now,
            'exp' => $exp,
            'data' => $payload
        ];

        return JWT::encode($token, $this->secretKey, 'HS256');
    }

    public function validateToken(string $token): ?array
    {
        try {
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            return (array)$decoded->data;
        } catch (\Exception $e) {
            return null;
        }
    }
}
