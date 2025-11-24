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



    #[Route('/{id<\d+>}/join', name: 'user_join_community', methods: ['POST'])]
    #[OA\Post(
        tags: ['CommunityMembersController'],
        summary: 'Unirse a una comundad. ID de la URL -> tu usuario / ID pasado por JS -> usuario a seguir.'
    )]
    public function join(int $id, Request $request, UserRepository $users, CommunityMembersRepository $followEntity, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
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
        if (!isset($data['community_id'])) {
            return new JsonResponse(
                ['error' => 'community_id es requerido'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $community_id = $data['community_id'];

        // if ($id === $community_id) {
        //     return new JsonResponse(
        //         ['error' => 'No puedes seguirte a ti mismo'],
        //         JsonResponse::HTTP_NOT_ACCEPTABLE
        //     );
        // }

        $community_to_join = $users->find($community_id);

        if (!$community_to_join) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $existingFollow = $followEntity->findOneBy([
            'user' => $user,
            'followingUser' => $community_to_join
        ]);

        if ($existingFollow) {
            return new JsonResponse(
                ['error' => 'Ya sigues a esta comunidd'],
                JsonResponse::HTTP_CONFLICT
            );
        }

        $follow = new CommunityMembers();
        $follow->setUser($user);
        $follow->setCommunity($community_to_join);
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
            ['message' => "El usuario $id ha empezado ahora es miembro de la comunidad $community_id."],
            JsonResponse::HTTP_CREATED, // 201 es más apropiado para creación
        );
    }






}
