<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserFollowsRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/user_follows', name: 'api_user_follows_')]
final class UserFollowingController extends AbstractController
{
    #[Route('', methods: ['GET'])]
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

    //🚪GET /api/movies/{id} → Obtener una película por ID🚪
    // #[Route('/{id<\d+>}', name: 'show', methods: ['GET'])]
    // public function show(int $id, UserRepository $users, SerializerInterface $serializer): JsonResponse
    // {
    //     $user = $users->find($id);
    //     if (!$user) {
    //         return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
    //     }

    //     return new JsonResponse(
    //         $serializer->serialize($user, 'json', ['groups' => 'user']),
    //         JsonResponse::HTTP_OK,
    //         [],
    //         true
    //     );
    // }
    
}
