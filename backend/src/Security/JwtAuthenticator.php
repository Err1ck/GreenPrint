<?php

namespace App\Security;

use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtAuthenticator extends AbstractAuthenticator
{
    private string $jwtSecret;

    public function __construct()
    {
        $this->jwtSecret = $_ENV['JWT_SECRET'] ?? 'default_secret';
    }

    public function supports(Request $request): bool
    {
        return $request->headers->has('Authorization');
    }

    public function authenticate(Request $request): SelfValidatingPassport
    {
        $token = str_replace('Bearer ', '', $request->headers->get('Authorization'));

        if (!$token) {
            throw new AuthenticationException('No se proporcionó un token');
        }

        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));

            // Accedemos al email correctamente
            $email = $decoded->email ?? null;
            if (!$email) {
                throw new AuthenticationException('Token sin email válido');
            }

            return new SelfValidatingPassport(
                new UserBadge($email)
            );
        } catch (\Exception $e) {
            throw new AuthenticationException('Token inválido o expirado: ' . $e->getMessage());
        }
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?JsonResponse
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        return new JsonResponse(['error' => $exception->getMessage()], JsonResponse::HTTP_UNAUTHORIZED);
    }
}
