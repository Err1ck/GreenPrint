<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

#[Route('/api/users', name: 'api_users_')]
final class UserController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserController'],
        summary: 'Lista todos los usuarios.'
    )]
    public function index(UserRepository $users, SerializerInterface $serializer): JsonResponse
    {

        $all = $users->findAll();

        return new JsonResponse(
            $serializer->serialize($all, 'json', ['groups' => 'user']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    //🚪GET /api/movies/{id} → Obtener una película por ID🚪
    #[Route('/{id<\d+>}', name: 'show', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserController'],
        summary: 'Muestra el usuario por la ID dada.'
    )]
    public function show(int $id, UserRepository $users, SerializerInterface $serializer): JsonResponse
    {
        $user = $users->find($id);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse(
            $serializer->serialize($user, 'json', ['groups' => 'user']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/{id<\d+>}/edit', name: 'user_edit', methods: ['PUT'])]
    #[OA\Put(
        tags: ['UserController'],
        summary: 'Edita el usario por la ID dada.'
    )]
    public function edit(int $id, Request $request, UserRepository $users, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {
        // 1. Buscar el usuario en la base de datos
        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'User not found'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // 2. Obtener los datos JSON del request
        $data = json_decode($request->getContent(), true);

        if ($data === null) {
            return new JsonResponse(
                ['error' => 'Invalid JSON data'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        // 3. Actualizar solo los campos permitidos que vengan en el request
        if (isset($data['username'])) {
            $user->setUsername($data['username']);
        }

        if (isset($data['biography'])) {
            $user->setBiography($data['biography']);
        }

        if (isset($data['photo_url'])) {
            $user->setPhotoURL($data['photo_url']);
        }

        if (isset($data['banner_url'])) {
            $user->setBannerURL($data['banner_url']);
        }

        // 4. Validar la entidad antes de guardar
        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }

            return new JsonResponse(
                ['errors' => $errorMessages],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        // 5. Persistir los cambios en la base de datos
        $entityManager->flush();

        // 6. Devolver el usuario actualizado
        return new JsonResponse(
            $serializer->serialize($user, 'json', ['groups' => 'user']),
            JsonResponse::HTTP_OK,
            [],
            true // Indica que ya está serializado
        );
    }


    #[Route('/{id<\d+>}/destroy', name: 'user_destroy', methods: ['DELETE'])]
    #[OA\Delete(
        tags: ['UserController'],
        summary: 'Elimina el usario por la ID dada.'
    )]
    public function destroy(int $id, UserRepository $users, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {

        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'User not found'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // enitity manager para usar métodos sobre la DB
        $entityManager->remove($user); // eliminar usuario

        $entityManager->flush(); // updatear db

        return new JsonResponse(
            ['message' => 'Usuario eliminado correctamente.'],
            JsonResponse::HTTP_OK,
            [],
        );
    }
}
