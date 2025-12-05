<?php

namespace App\Controller;

use App\Repository\UserPostTreeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/user-post-trees', name: 'api_post_trees')]
final class UserPostTreeController extends AbstractController
{
   #[Route('', name: 'api_posts_tree', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserPostTreeController'],
        summary: 'Muestra todos los like leaf de posts.'
    )]
    public function index(UserPostTreeRepository $leaves, SerializerInterface $serializer): JsonResponse
    {
        $all = $leaves->findAll();

        return new JsonResponse(
            $serializer->serialize($all, 'json', ['groups' => 'postTrees']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }
}
