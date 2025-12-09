<?php

namespace App\Controller;

use App\Repository\HashtagRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use OpenApi\Attributes as OA;

#[Route('/api/hashtags', name: 'api_hashtags_')]
final class HashtagController extends AbstractController
{
    #[Route('/trending', name: 'trending', methods: ['GET'])]
    #[OA\Get(
        tags: ['HashtagController'],
        summary: 'Obtiene los hashtags más populares (trending topics).'
    )]
    public function getTrending(
        HashtagRepository $hashtagRepo,
        SerializerInterface $serializer
    ): JsonResponse {
        // Obtener los top 5 hashtags más usados
        $trending = $hashtagRepo->findTrending(3);

        return new JsonResponse(
            $serializer->serialize($trending, 'json', ['groups' => 'trending']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }
}
