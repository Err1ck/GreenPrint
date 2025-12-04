<?php

namespace App\Controller;

use App\Repository\UserPostReplyLeafRepository;
use App\Repository\UserPostTreeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/user-post-replies-leaves', name: 'api_post_replies_leaves')]
final class UserPostReplyLeafController extends AbstractController
{
   #[Route('', name: 'api_post_reply_leaf', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserPostReplyLeafController'],
        summary: 'Muestra todos los like leaf de replies.'
    )]
    public function index(UserPostReplyLeafRepository $leaves, SerializerInterface $serializer): JsonResponse
    {
        $all = $leaves->findAll();

        return new JsonResponse(
            $serializer->serialize($all, 'json', ['groups' => 'replyLeaves']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }
}
