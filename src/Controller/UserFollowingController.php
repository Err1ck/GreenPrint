<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserFollows;
use App\Repository\UserFollowsRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

#[Route('/api/user_follows', name: 'api_user_follows_')]
final class UserFollowingController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserFollowingController'],
        summary: 'Muestra todos los follows de los usuarios.'
    )]
    public function index(UserFollowsRepository $follows, SerializerInterface $serializer): JsonResponse
    {

        $all = $follows->findAll();

        return new JsonResponse(
            $serializer->serialize($all, 'json', ['groups' => 'follows']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/{id<\d+>}', name: 'user_show_following', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserFollowingController'],
        summary: 'Muestra todos los follows del usuario dado por URL.'
    )]
    public function show(int $id, Request $request, UserRepository $users, UserFollowsRepository $follows, SerializerInterface $serializer): JsonResponse
    {
        // Verificar que el usuario existe
        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Buscar todos los follows donde user_id = $id
        $userFollows = $follows->findBy(['user' => $user]);

        if (empty($userFollows)) {
            return new JsonResponse(
                ['message' => 'Este usuario no sigue a nadie'],
                JsonResponse::HTTP_OK
            );
        }

        return new JsonResponse(
            $serializer->serialize($userFollows, 'json', ['groups' => 'follows']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/{id<\d+>}/follow', name: 'user_follow', methods: ['POST'])]
    #[OA\Post(
        tags: ['UserFollowingController'],
        summary: 'Seguir usuario. ID de la URL -> tu usuario / ID pasado por JS -> usuario a seguir.'
    )]
    public function follow(int $id, Request $request, UserRepository $users, UserFollowsRepository $followEntity, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {
        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'User not found'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $data = json_decode($request->getContent(), true);

        // ✅ Declarar antes del if
        if (!isset($data['following_user_id'])) {
            return new JsonResponse(
                ['error' => 'following_user_id es requerido'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user_to_followId = $data['following_user_id'];

        if ($id === $user_to_followId) {
            return new JsonResponse(
                ['error' => 'No puedes seguirte a ti mismo'],
                JsonResponse::HTTP_NOT_ACCEPTABLE
            );
        }

        $user_to_follow = $users->find($user_to_followId);

        if (!$user_to_follow) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $existingFollow = $followEntity->findOneBy([
            'user' => $user,
            'followingUser' => $user_to_follow
        ]);

        if ($existingFollow) {
            return new JsonResponse(
                ['error' => 'Ya sigues a este usuario'],
                JsonResponse::HTTP_CONFLICT
            );
        }

        $follow = new UserFollows();
        $follow->setUser($user);
        $follow->setFollowingUser($user_to_follow);
        $follow->setCreatedAt(new \DateTimeImmutable());
        $follow->setUpdatedAt(new \DateTimeImmutable());

        // ⚠️ Deberías validar $follow, no $user
        $errors = $validator->validate($follow);

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

        $entityManager->persist($follow);
        $entityManager->flush();

        return new JsonResponse(
            ['message' => "El usuario $id ha empezado a seguir al usuario $user_to_followId."],
            JsonResponse::HTTP_CREATED, // 201 es más apropiado para creación
        );
    }

    #[Route('/{id<\d+>}/unfollow', name: 'user_unfollow', methods: ['DELETE'])]
    #[OA\Delete(
        tags: ['UserFollowingController'],
        summary: 'Dejar de seguir usuario. ID de la URL -> tu usuario / ID pasado por JS -> usuario a dejar de seguir.'
    )]
    public function unfollow(int $id, Request $request, UserRepository $users, UserFollowsRepository $followEntity, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {

        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'User not found'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['following_user_id'])) {

            if ($id === $data['following_user_id']) {
                return new JsonResponse(
                    ['error' => 'No puedes dejar de seguirte a ti mismo'],
                    JsonResponse::HTTP_NOT_ACCEPTABLE
                );
            }

            $user_to_unfollow = $users->find($data['following_user_id']);
            $user_to_unfollowId = $data['following_user_id'] ?? null; // solo para mostrar en el return

            if (!$user_to_unfollow) {
                return new JsonResponse(
                    ['error' => 'User not found'],
                    JsonResponse::HTTP_NOT_FOUND
                );
            } else {

                $followColumn = $followEntity->findOneBy(['user' => $user, 'followingUser' => $user_to_unfollow]);

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

                $entityManager->remove($followColumn);

                $entityManager->flush();
            }
        }

        return new JsonResponse(
            ['message' => "El usuario $id ha dejado de seguir al usuario $user_to_unfollowId."],
            JsonResponse::HTTP_OK,
            [],
        );
    }
}
