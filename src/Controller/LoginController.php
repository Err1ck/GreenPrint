<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use OpenApi\Attributes as OA;

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
    public function login(Request $request, AuthenticationUtils $authenticationUtils): JsonResponse
    {
        // Si el usuario ya está autenticado
        $user = $this->getUser();
        if ($user instanceof User) {
            return $this->json([
                'message' => 'Ya estás autenticado',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getUserIdentifier(),
                    'roles' => $user->getRoles()
                ]
            ]);
        }

        // Obtener el error de login si existe
        $error = $authenticationUtils->getLastAuthenticationError();

        if ($error) {
            return $this->json([
                'message' => 'Credenciales inválidas',
                'error' => $error->getMessageKey()
            ], Response::HTTP_UNAUTHORIZED);
        }

        // Si llegamos aquí sin error y sin usuario, es una petición inicial
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email']) || !isset($data['password'])) {
            return $this->json([
                'message' => 'Email y password son requeridos'
            ], Response::HTTP_BAD_REQUEST);
        }

        // El proceso de autenticación real lo maneja Symfony Security
        // Este endpoint principalmente maneja las respuestas
        return $this->json([
            'message' => 'Procesando login...'
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
