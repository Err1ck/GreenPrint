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

}
