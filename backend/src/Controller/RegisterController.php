<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

class RegisterController extends AbstractController
{
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    #[OA\Post(
        tags: ['RegisterController'],
        summary: 'Registrar usuarios.',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                properties: [
                    new OA\Property(property: 'username', type: 'string', example: 'johndoe'),
                    new OA\Property(property: 'email', type: 'string', example: 'test@gmail.com'),
                    new OA\Property(property: 'password', type: 'string', example: '*****'),
                ]
            )
        ),
    )]
    public function register(
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email']) || !isset($data['password']) || !isset($data['username'])) {
            return $this->json([
                'message' => 'Email, username y password son requeridos'
            ], Response::HTTP_BAD_REQUEST);
        }


        // Verificar si el username ya existe (después de verificar email):
        $existingUsername = $entityManager->getRepository(User::class)
            ->findOneBy(['username' => $data['username']]);

        if ($existingUsername) {
            return $this->json([
                'message' => 'El nombre de usuario ya está registrado'
            ], Response::HTTP_BAD_REQUEST);
        }


        // Verificar si el usuario ya existe
        $existingUser = $entityManager->getRepository(User::class)
            ->findOneBy(['email' => $data['email']]);

        if ($existingUser) {
            return $this->json([
                'message' => 'El email ya está registrado'
            ], Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setUsername($data['username']);
        $user->setEmail($data['email']);
        $user->setRoles(['user']);

        // Hash del password
        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $data['password']
        );
        $user->setPassword($hashedPassword);

        // Establecer timestamps
        $user->setCreatedAt(new \DateTimeImmutable());
        $user->setUpdatedAt(new \DateTimeImmutable());

        // Validar
        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $errorsString = [];
            foreach ($errors as $error) {
                $errorsString[] = $error->getMessage();
            }
            return $this->json([
                'errors' => $errorsString
            ], Response::HTTP_BAD_REQUEST);
        }

        // Guardar
        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json([
            'message' => 'Usuario registrado exitosamente',
            // En la respuesta final, añadir username:
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s')
            ]
        ], Response::HTTP_CREATED);
    }
}
