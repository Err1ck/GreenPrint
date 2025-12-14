<?php

namespace App\Controller;

use App\Entity\Community;
use App\Repository\CommunityFollowsRepository;
use App\Repository\CommunityMembersRepository;
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

#[Route('/api/communities', name: 'api_community_')]
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
        summary: 'Edita la comunidad por la ID dada.',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'MyCommunity'),
                    new OA\Property(property: 'biography', type: 'string', example: 'Lorem ipsum...'),
                    new OA\Property(property: 'photo_url', type: 'string', example: 'path/img'),
                    new OA\Property(property: 'banner_url', type: 'string', example: 'path/img')
                ]
            )
        ),
    )]
    public function edit(int $id, Request $request, CommunityRepository $communities, SerializerInterface $serializer, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        $community = $communities->find($id);

        if (!$community) {
            return new JsonResponse(['error' => 'Comunidad no encontrada.'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Check if the current user is an admin of this community
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(
                ['error' => 'Debes estar autenticado para editar una comunidad.'],
                JsonResponse::HTTP_UNAUTHORIZED
            );
        }

        $adminIds = $community->getAdminIds();
        if (!in_array($user->getId(), $adminIds)) {
            return new JsonResponse(
                ['error' => 'No tienes permisos para editar esta comunidad.'],
                JsonResponse::HTTP_FORBIDDEN
            );
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

        if (isset($data['biography'])) {
            $community->setBiography($data['biography']);
        }

        // Process photo upload if provided
        if (isset($data['photo_data'])) {
            $photoResult = $this->processImageUpload($data['photo_data'], $community->getId(), 'photo');
            if ($photoResult['success']) {
                $community->setPhotoURL($photoResult['url']);
            } else {
                return new JsonResponse(
                    ['error' => $photoResult['error']],
                    JsonResponse::HTTP_BAD_REQUEST
                );
            }
        } elseif (isset($data['photo_url'])) {
            $community->setPhotoURL($data['photo_url']);
        }

        // Process banner upload if provided
        if (isset($data['banner_data'])) {
            $bannerResult = $this->processImageUpload($data['banner_data'], $community->getId(), 'banner');
            if ($bannerResult['success']) {
                $community->setBannerURL($bannerResult['url']);
            } else {
                return new JsonResponse(
                    ['error' => $bannerResult['error']],
                    JsonResponse::HTTP_BAD_REQUEST
                );
            }
        } elseif (isset($data['banner_url'])) {
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
        // Get the authenticated user
        $user = $this->getUser();
        
        if (!$user) {
            return new JsonResponse(
                ['error' => 'Debes estar autenticado para crear una comunidad.'],
                JsonResponse::HTTP_UNAUTHORIZED
            );
        }

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

        if (isset($data['biography'])) {
            $community->setBiography($data['biography']);
        }

        $community->setMemberCount(0);
        $community->setFollowerCount(0);
        
        // Initialize admin_ids with the creator's user ID
        $community->setAdminIds([$user->getId()]);

        $community->setCreatedAt(new \DateTimeImmutable());
        $community->setUpdatedAt(new \DateTimeImmutable());

        // Validar la entidad antes de guardar
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

        // Now we have the community ID, we can save images
        $communityId = $community->getId();

        // Process photo upload if provided
        if (isset($data['photo_data'])) {
            $photoResult = $this->processImageUpload($data['photo_data'], $communityId, 'photo');
            if ($photoResult['success']) {
                $community->setPhotoURL($photoResult['url']);
            } else {
                return new JsonResponse(
                    ['error' => $photoResult['error']],
                    JsonResponse::HTTP_BAD_REQUEST
                );
            }
        }

        // Process banner upload if provided
        if (isset($data['banner_data'])) {
            $bannerResult = $this->processImageUpload($data['banner_data'], $communityId, 'banner');
            if ($bannerResult['success']) {
                $community->setBannerURL($bannerResult['url']);
            } else {
                return new JsonResponse(
                    ['error' => $bannerResult['error']],
                    JsonResponse::HTTP_BAD_REQUEST
                );
            }
        }

        // Assign ROLE_COMMUNITY_ADMIN to the creator
        $userRoles = $user->getRoles();
        if (!in_array('ROLE_COMMUNITY_ADMIN', $userRoles)) {
            $currentRoles = $user->getRoles();
            // Filter out ROLE_USER as it's added automatically
            $currentRoles = array_filter($currentRoles, function($role) {
                return $role !== 'ROLE_USER';
            });
            $currentRoles[] = 'ROLE_COMMUNITY_ADMIN';
            $user->setRoles($currentRoles);
            $entityManager->persist($user);
        }

        $entityManager->flush();

        return new JsonResponse(
            [
                'message' => "La comunidad ha sido creada.",
                'community' => json_decode($serializer->serialize($community, 'json', ['groups' => 'community']), true),
                'user' => json_decode($serializer->serialize($user, 'json', ['groups' => 'user']), true)
            ],
            JsonResponse::HTTP_OK,
            [],
        );
    }

    /**
     * Process and save an uploaded image for a community
     */
    private function processImageUpload(string $imageData, int $communityId, string $imageType): array
    {
        // Validate and decode base64
        if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $matches)) {
            $imageExtension = $matches[1];
            $imageData = substr($imageData, strpos($imageData, ',') + 1);
            $imageData = base64_decode($imageData);

            if ($imageData === false) {
                return ['success' => false, 'error' => 'Error al decodificar la imagen'];
            }
        } else {
            return ['success' => false, 'error' => 'Formato de imagen inválido. Debe ser base64.'];
        }

        // Validate extension
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!in_array(strtolower($imageExtension), $allowedExtensions)) {
            return ['success' => false, 'error' => 'Tipo de archivo no permitido. Usa: jpg, png, gif, webp'];
        }

        // Validate size (5MB maximum)
        if (strlen($imageData) > 5 * 1024 * 1024) {
            return ['success' => false, 'error' => 'La imagen es demasiado grande. Máximo 5MB.'];
        }

        // Create community directory if it doesn't exist
        $uploadDir = __DIR__ . '/../../public/uploads/communities/' . $communityId;
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Delete old image if exists
        $pattern = $uploadDir . '/' . $imageType . '.*';
        foreach (glob($pattern) as $oldFile) {
            if (file_exists($oldFile)) {
                unlink($oldFile);
            }
        }

        // Generate filename and save
        $filename = $imageType . '.' . $imageExtension;
        $filepath = $uploadDir . '/' . $filename;

        if (file_put_contents($filepath, $imageData) === false) {
            return ['success' => false, 'error' => 'Error al guardar la imagen'];
        }

        // Generate public URL
        $publicUrl = '/uploads/communities/' . $communityId . '/' . $filename;

        return ['success' => true, 'url' => $publicUrl];
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

    #[Route('/{id<\d+>}/members', name: 'community_members', methods: ['GET'])]
    #[OA\Get(
        tags: ['CommunityController'],
        summary: 'Muestra los seguidores de la comunidad por la ID dada.'
    )]
    public function getMembers(int $id, Request $request, CommunityRepository $communities, CommunityMembersRepository $members, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {

        $community = $communities->find($id);

        if (!$community) {
            return new JsonResponse(['error' => 'Comunidad no encontrada.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $communityMembers = $members->findBy(['community' => $community->getId()]);

        if (!$communityMembers) {
            return new JsonResponse(['error' => 'Esta comunidad no tiene miembros.'], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse(
            // Podemos retornar el obj
            $serializer->serialize($communityMembers, 'json', ['groups' => 'getMembers']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }


    #[Route('/followers', name: 'community_followers_from_all_communities', methods: ['GET'])]
    #[OA\Get(
        tags: ['CommunityController'],
        summary: 'Muestra los seguidores de todos las comunidades.'
    )]
    public function getAllFollowers(CommunityRepository $communities, CommunityFollowsRepository $followers, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {

        $communityFollowers = $followers->findAll();

        if (!$communityFollowers) {
            return new JsonResponse(['error' => 'Todavía nadie sigue a ninguna comunidad.'], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse(
            // Podemos retornar el obj
            $serializer->serialize($communityFollowers, 'json', ['groups' => 'getAllCommunityFollowers']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/members', name: 'community_members_from_all_communities', methods: ['GET'])]
    #[OA\Get(
        tags: ['CommunityController'],
        summary: 'Muestra los miembros de todos las comunidades.'
    )]
    public function getAllMembers(CommunityMembersRepository $community, SerializerInterface $serializer): JsonResponse
    {
        $all = $community->findAll();

        if (!$all) {
            return new JsonResponse(['error' => 'Todavía nadie es miembro a ninguna comunidad.'], JsonResponse::HTTP_NOT_FOUND);
        };

        return new JsonResponse(
            $serializer->serialize($all, 'json', ['groups' => 'member']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/{id<\d+>}/followers', name: 'community_followers_', methods: ['GET'])]
    #[OA\Get(
        tags: ['CommunityController'],
        summary: 'Muestra los seguidores de la comunidad dada por URL.'
    )]
    public function getFollowers(int $id, CommunityRepository $communities, CommunityFollowsRepository $followers, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {

        $community = $communities->find($id);

        if (!$community) {
            return new JsonResponse(['error' => 'Comunidad no encontrada.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $communityFollowers = $followers->findBy(['community' => $community->getId()]);

        if (!$communityFollowers) {
            return new JsonResponse(['error' => 'Esta comunidad no tiene seguidores.'], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse(
            // Podemos retornar el obj
            $serializer->serialize($communityFollowers, 'json', ['groups' => 'getCommunityFollowers']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }
}
