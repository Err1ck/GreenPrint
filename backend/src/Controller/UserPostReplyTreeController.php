<?php

namespace App\Controller;

use App\Repository\UserPostReplyLeafRepository;
use App\Repository\UserPostReplyTreeRepository;
use App\Repository\UserPostTreeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/user-post-replies-trees', name: 'api_post_replies_trees')]
final class UserPostReplyTreeController extends AbstractController
{
   #[Route('', name: 'api_post_reply_tree', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserPostReplyTreeController'],
        summary: 'Muestra todos los like tree de replies.'
    )]
    public function index(UserPostReplyTreeRepository $leaves, SerializerInterface $serializer): JsonResponse
    {
        $all = $leaves->findAll();

        return new JsonResponse(
            $serializer->serialize($all, 'json', ['groups' => 'replyTrees']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }
}
