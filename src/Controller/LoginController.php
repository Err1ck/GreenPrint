<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use OpenApi\Attributes as OA;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class LoginController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    #[OA\Post(
        tags: ['LoginController'],
        summary: 'Login usuarios.',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'test@gmail.com'),
                    new OA\Property(property: 'password', type: 'string', example: '*****'),
                ]
            )
        ),
    )]
    // public function login(Request $request, AuthenticationUtils $authenticationUtils): JsonResponse
    // {
    //     // Si el usuario ya está autenticado
    //     $user = $this->getUser();
    //     if ($user instanceof User) {
    //         return $this->json([
    //             'message' => 'Ya estás autenticado',
    //             'user' => [
    //                 'id' => $user->getId(),
    //                 'email' => $user->getUserIdentifier(),
    //                 'roles' => $user->getRoles()
    //             ]
    //         ]);
    //     }

    //     // Obtener el error de login si existe
    //     $error = $authenticationUtils->getLastAuthenticationError();

    //     if ($error) {
    //         return $this->json([
    //             'message' => 'Credenciales inválidas',
    //             'error' => $error->getMessageKey()
    //         ], Response::HTTP_UNAUTHORIZED);
    //     }

    //     // Si llegamos aquí sin error y sin usuario, es una petición inicial
    //     $data = json_decode($request->getContent(), true);

    //     if (!isset($data['email']) || !isset($data['password'])) {
    //         return $this->json([
    //             'message' => 'Email y password son requeridos'
    //         ], Response::HTTP_BAD_REQUEST);
    //     }


    //     $token = \Firebase\JWT\JWT::encode($payload, 'SECRET_KEY', 'HS256');

    //     // El proceso de autenticación real lo maneja Symfony Security
    //     // Este endpoint principalmente maneja las respuestas
    //     return $this->json([
    //         'message' => 'Procesando login...'
    //     ]);
    // }
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request, 
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse
    {
        // Decodificar los datos JSON del request
        $data = json_decode($request->getContent(), true);
        
        // Validar que existan email y password
        if (!$data || !isset($data['email']) || !isset($data['password'])) {
            return $this->json([
                'message' => 'Email y password son requeridos'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Buscar el usuario por email
        $user = $userRepository->findOneBy(['email' => $data['email']]);
        
        if (!$user) {
            return $this->json([
                'message' => 'Credenciales inválidas'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Verificar la contraseña usando el password hasher de Symfony
        if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
            return $this->json([
                'message' => 'Credenciales inválidas'
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Crear el payload del JWT
        $payload = [
            'user_id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'iat' => time(), // Issued at (fecha de creación)
            'exp' => time() + 3600 // Expira en 1 hora
        ];

        // Generar el token JWT
        // IMPORTANTE: Cambia 'SECRET_KEY' por una clave segura en tu .env
        $token = \Firebase\JWT\JWT::encode($payload, $_ENV['JWT_SECRET'] ?? 'SECRET_KEY', 'HS256');

        // Retornar el token y los datos del usuario
        return $this->json([
            'token' => $token,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles()
            ]
        ]);
    }
    
    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    #[OA\Post(
        tags: ['LoginController'],
        summary: 'Logout.',
    )]
    public function logout(): void
    {
        // Este método puede estar vacío - será interceptado por el firewall
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    #[Route('/api/logout/success', name: 'api_logout_success')]
    public function logoutSuccess(): JsonResponse
    {
        return $this->json([
            'message' => 'Logout exitoso'
        ], Response::HTTP_OK);
    }

    #[Route('/api/user', name: 'api_current_user', methods: ['GET'])]
        #[OA\Get(
        tags: ['LoginController'],
        summary: 'Obtener usuario actual.',
    )]
    public function currentUser(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json([
                'message' => 'No autenticado'
            ], Response::HTTP_UNAUTHORIZED);
        }

        return $this->json([
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getUserIdentifier(),
                'roles' => $user->getRoles()
            ]
        ]);
    }
}
