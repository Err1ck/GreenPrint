<?php

namespace App\Controller;

use App\Repository\UserPostLeafRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/user-post-leaves', name: 'api_post_leaves')]
final class UserPostLeafController extends AbstractController
{
  #[Route('', name: 'api_posts_list', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserPostLeafController'],
        summary: 'Muestra todos los posts.'
    )]
    public function index(UserPostLeafRepository $leaves, SerializerInterface $serializer): JsonResponse
    {
        $all = $leaves->findAll();

        return new JsonResponse(
            $serializer->serialize($all, 'json', ['groups' => 'postLeaves']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }
}
