<?php

namespace App\Controller;

use App\Repository\CommunityRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

 #[Route('/api/community', name: 'api_community_')]
final class CommunityController extends AbstractController
{
    
    #[Route('', name: 'app_community')]
    public function index(CommunityRepository $community, SerializerInterface $serializer): JsonResponse
    {
     $all = $community->findAll();

        return new JsonResponse(
            $serializer->serialize($all, 'json', ['groups' => 'community']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

      //🚪GET /api/movies/{id} → Obtener una película por ID🚪
        #[Route('/{id<\d+>}', name: 'show', methods: ['GET'])]
        public function show(int $id, CommunityRepository $communities, SerializerInterface $serializer): JsonResponse
        {
            $community = $communities->find($id);
            if (!$community) {
                return new JsonResponse(['error' => 'community not found'], JsonResponse::HTTP_NOT_FOUND);
            }

            return new JsonResponse(
                $serializer->serialize($community, 'json', ['groups' => 'community']),
                JsonResponse::HTTP_OK,
                [],
                true
            );
        }
}
