<?php

namespace App\Controller;

use App\Entity\Community;
use App\Repository\CommunityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

#[Route('/api/community', name: 'api_community_')]
final class CommunityController extends AbstractController
{

    #[Route('', name: 'app_community', methods: ['GET'])]
    #[OA\Get(
        tags: ['CommunityController'],
        summary: 'Lista todas las comunidades.'
    )]
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
    #[OA\Get(
        tags: ['CommunityController'],
        summary: 'Muestra la comunidad por la ID dada.'
    )]
    public function show(int $id, CommunityRepository $communities, SerializerInterface $serializer): JsonResponse
    {
        $community = $communities->find($id);
        if (!$community) {
            return new JsonResponse(['error' => 'Comunidad no encontrada.'], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse(
            $serializer->serialize($community, 'json', ['groups' => 'community']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }


    //🚪GET /api/movies/{id} → Obtener una película por ID🚪
    #[Route('/{id<\d+>}/edit', name: 'edit', methods: ['PUT'])]
    #[OA\Put(
        tags: ['CommunityController'],
        summary: 'Edita la comunidad por la ID dada.'
    )]
    public function edit(int $id, Request $request, CommunityRepository $communities, SerializerInterface $serializer, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        $community = $communities->find($id);

        if (!$community) {
            return new JsonResponse(['error' => 'Comunidad no encontrada.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if ($data === null) {
            return new JsonResponse(
                ['error' => 'Invalid JSON data'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        if (isset($data['name'])) {
            $community->setName($data['name']);
        }
        if (isset($data['photo_url'])) {
            $community->setPhotoURL($data['photo_url']);
        }
        if (isset($data['banner_url'])) {
            $community->setBannerURL($data['banner_url']);
        }

      $errors = $validator->validate($community);

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

        $entityManager->flush();

        return new JsonResponse(
            // Podemos retornar el obj
            $serializer->serialize($community, 'json', ['groups' => 'community']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/create', name: 'community_create', methods: ['POST'])]
    #[OA\Post(
        tags: ['CommunityController'],
        summary: 'Crea una comunidad.'
    )]
    public function create(Request $request, CommunityRepository $communities, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {

        $community = new Community();

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $community->setName($data['name']);
        } else {
            return new JsonResponse(
                ['error' => 'La comunidad necesita un campo name.'],
                JsonResponse::HTTP_NOT_ACCEPTABLE
            );
        }

        if (isset($data['photo_url'])) {
            $community->setPhotoURL($data['photo_url']);
        }
        if (isset($data['banner_url'])) {
            $community->setBannerURL($data['banner_url']);
        }

        $community->setMemberCount(0);
        $community->setFollowerCount(0);

        $community->setCreatedAt(new \DateTimeImmutable());
        $community->setUpdatedAt(new \DateTimeImmutable());

        // 4. Validar la entidad antes de guardar
        $errors = $validator->validate($community);

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

        $entityManager->persist($community);

        $entityManager->flush();

        return new JsonResponse(
            ['message' => "La comunidad ha sido creada."],
            JsonResponse::HTTP_OK,
            [],
        );
    }

    #[Route('/{id<\d+>}/delete', name: 'community_delete', methods: ['DELETE'])]
    #[OA\Delete(
        tags: ['CommunityController'],
        summary: 'Elimina la comunidad por la ID dada.'
    )]
    public function destroy(int $id, Request $request, CommunityRepository $communities, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {

        $community = $communities->find($id);

        if (!$community) {
            return new JsonResponse(['error' => 'Comunidad no encontrada.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager->remove($community);

        $entityManager->flush();

        return new JsonResponse(
            ['message' => "La comunidad ha sido eliminada."],
            JsonResponse::HTTP_OK,
            [],
        );
    }
}
