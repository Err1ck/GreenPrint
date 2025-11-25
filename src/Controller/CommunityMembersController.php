<?php

namespace App\Controller;

use App\Entity\CommunityMembers;
use App\Repository\CommunityMembersRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/community_members', name: 'api_community_members')]
final class CommunityMembersController extends AbstractController
{

    #[Route('', name: 'app_community_members', methods: ['GET'])]
    #[OA\Get(
        tags: ['CommunityMembersController'],
        summary: 'Lista todas las comunidades.'
    )]
    public function index(CommunityMembersRepository $community, SerializerInterface $serializer): JsonResponse
    {
        $all = $community->findAll();

        return new JsonResponse(
            $serializer->serialize($all, 'json', ['groups' => 'member']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }







}
