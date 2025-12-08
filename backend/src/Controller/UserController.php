<?php

namespace App\Controller;

use App\Entity\CommunityFollows;
use App\Entity\CommunityMembers;
use App\Entity\User;
use App\Entity\UserFollows;
use App\Repository\CommunityFollowsRepository;
use App\Repository\CommunityMembersRepository;
use App\Repository\CommunityRepository;
use App\Repository\PostRepository;
use App\Repository\UserFollowsRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

#[Route('/api/users', name: 'api_users_')]
final class UserController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserController'],
        summary: 'Lista todos los usuarios.'
    )]
    public function index(UserRepository $users, UserFollowsRepository $followsRepo, SerializerInterface $serializer): JsonResponse
    {

        $all = $users->findAll();

        // Calcular contadores para cada usuario
        foreach ($all as $user) {
            $followerCount = $followsRepo->count(['followingUser' => $user]);
            $user->setFollowerCount($followerCount);

            $followingCount = $followsRepo->count(['user' => $user]);
            $user->setFollowingCount($followingCount);
        }

        return new JsonResponse(
            $serializer->serialize($all, 'json', ['groups' => 'user']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    //🚪GET /api/movies/{id} → Obtener una película por ID🚪
    #[Route('/{id<\d+>}', name: 'show', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserController'],
        summary: 'Muestra el usuario por la ID dada.'
    )]
    public function show(int $id, UserRepository $users, UserFollowsRepository $followsRepo, SerializerInterface $serializer): JsonResponse
    {
        $user = $users->find($id);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Calcular dinámicamente el número de seguidores
        $followerCount = $followsRepo->count(['followingUser' => $user]);
        $user->setFollowerCount($followerCount);

        // Calcular dinámicamente el número de usuarios que sigue
        $followingCount = $followsRepo->count(['user' => $user]);
        $user->setFollowingCount($followingCount);

        return new JsonResponse(
            $serializer->serialize($user, 'json', ['groups' => 'user']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/{id<\d+>}/edit', name: 'user_edit', methods: ['PUT'])]
    #[OA\Put(
        tags: ['UserController'],
        summary: 'Edita el usario por la ID dada.',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                properties: [
                    new OA\Property(property: 'username', type: 'string', example: 'Gordinxi'),
                    new OA\Property(property: 'biography', type: 'string', example: 'Lorem ipsum...'),
                    new OA\Property(property: 'photo_url', type: 'string', example: 'path/img'),
                    new OA\Property(property: 'banner_url', type: 'string', example: 'path/img')
                ]
            )
        ),
    )]
    public function edit(int $id, Request $request, UserRepository $users, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {
        // 1. Buscar el usuario en la base de datos
        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'User not found'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // 2. Obtener los datos JSON del request
        $data = json_decode($request->getContent(), true);

        if ($data === null) {
            return new JsonResponse(
                ['error' => 'Invalid JSON data'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        // 3. Actualizar solo los campos permitidos que vengan en el request
        if (isset($data['username'])) {
            $user->setUsername($data['username']);
        }

        if (isset($data['biography'])) {
            $user->setBiography($data['biography']);
        }

        if (isset($data['photo_url'])) {
            $user->setPhotoURL($data['photo_url']);
        }

        if (isset($data['banner_url'])) {
            $user->setBannerURL($data['banner_url']);
        }

        // 4. Validar la entidad antes de guardar
        $errors = $validator->validate($user);

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

        // 5. Persistir los cambios en la base de datos
        $entityManager->flush();

        // 6. Devolver el usuario actualizado
        return new JsonResponse(
            $serializer->serialize($user, 'json', ['groups' => 'user']),
            JsonResponse::HTTP_OK,
            [],
            true // Indica que ya está serializado
        );
    }


    #[Route('/{id<\d+>}/destroy', name: 'user_destroy', methods: ['DELETE'])]
    #[OA\Delete(
        tags: ['UserController'],
        summary: 'Elimina el usario por la ID dada.'
    )]
    public function destroy(int $id, UserRepository $users, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {

        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'User not found'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // enitity manager para usar métodos sobre la DB
        $entityManager->remove($user); // eliminar usuario

        $entityManager->flush(); // updatear db

        return new JsonResponse(
            ['message' => 'Usuario eliminado correctamente.'],
            JsonResponse::HTTP_OK,
            [],
        );
    }


    #[Route('/{id<\d+>}/follow', name: 'user_follow', methods: ['POST'])]
    #[OA\Post(
        tags: ['UserController'],
        summary: 'Seguir usuario. ID de la URL -> tu usuario / ID pasado por JS -> usuario a seguir.'
    )]
    public function follow(int $id, Request $request, UserRepository $users, UserFollowsRepository $followEntity, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
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
        if (!isset($data['following_user_id'])) {
            return new JsonResponse(
                ['error' => 'following_user_id es requerido'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user_to_followId = $data['following_user_id'];

        if ($id === $user_to_followId) {
            return new JsonResponse(
                ['error' => 'No puedes seguirte a ti mismo'],
                JsonResponse::HTTP_NOT_ACCEPTABLE
            );
        }

        $user_to_follow = $users->find($user_to_followId);

        if (!$user_to_follow) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $existingFollow = $followEntity->findOneBy([
            'user' => $user,
            'followingUser' => $user_to_follow
        ]);

        if ($existingFollow) {
            return new JsonResponse(
                ['error' => 'Ya sigues a este usuario'],
                JsonResponse::HTTP_CONFLICT
            );
        }

        $follow = new UserFollows();
        $follow->setUser($user);
        $follow->setFollowingUser($user_to_follow);
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
            ['message' => "El usuario $id ha empezado a seguir al usuario $user_to_followId."],
            JsonResponse::HTTP_CREATED, // 201 es más apropiado para creación
        );
    }

    #[Route('/{id<\d+>}/unfollow', name: 'user_unfollow', methods: ['DELETE'])]
    #[OA\Delete(
        tags: ['UserController'],
        summary: 'Dejar de seguir usuario. ID de la URL -> tu usuario / ID pasado por JS -> usuario a dejar de seguir.'
    )]
    public function unfollow(int $id, Request $request, UserRepository $users, UserFollowsRepository $followEntity, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {

        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'User not found'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['following_user_id'])) {

            if ($id === $data['following_user_id']) {
                return new JsonResponse(
                    ['error' => 'No puedes dejar de seguirte a ti mismo'],
                    JsonResponse::HTTP_NOT_ACCEPTABLE
                );
            }

            $user_to_unfollow = $users->find($data['following_user_id']);
            $user_to_unfollowId = $data['following_user_id'] ?? null; // solo para mostrar en el return

            if (!$user_to_unfollow) {
                return new JsonResponse(
                    ['error' => 'User not found'],
                    JsonResponse::HTTP_NOT_FOUND
                );
            } else {

                $followColumn = $followEntity->findOneBy(['user' => $user, 'followingUser' => $user_to_unfollow]);

                // 4. Validar la entidad antes de guardar
                $errors = $validator->validate($user);

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

                $entityManager->remove($followColumn);

                $entityManager->flush();
            }
        }

        return new JsonResponse(
            ['message' => "El usuario $id ha dejado de seguir al usuario $user_to_unfollowId."],
            JsonResponse::HTTP_OK,
            [],
        );
    }

    #[Route('/{id<\d+>}/follow-community', name: 'user_follow_community', methods: ['POST'])]
    #[OA\Post(
        tags: ['UserController'],
        summary: 'Seguir comunidad. ID de la URL -> tu usuario / ID pasado por JS -> comunidad a seguir.'
    )]
    public function followCommunity(int $id, Request $request, UserRepository $users, CommunityRepository $communities, CommunityFollowsRepository $followEntity, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {
        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado'],
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

        $community_to_follow = $communities->find($community_id);

        if (!$community_to_follow) {
            return new JsonResponse(
                ['error' => 'Comunidad no encontrada'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $existingFollow = $followEntity->findOneBy([
            'user' => $user,
            'community' => $community_to_follow
        ]);

        if ($existingFollow) {
            return new JsonResponse(
                ['error' => 'Ya sigues esta comunidad.'],
                JsonResponse::HTTP_CONFLICT
            );
        }

        $follow = new CommunityFollows();
        $follow->setUser($user);
        $follow->setCommunity($community_to_follow);
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
            ['message' => "El usuario $id ha empezado a seguir a la comunidad $community_id."],
            JsonResponse::HTTP_CREATED, // 201 es más apropiado para creación
        );
    }

    #[Route('/{id<\d+>}/unfollow-community', name: 'user_unfollow_community', methods: ['DELETE'])]
    #[OA\Delete(
        tags: ['UserController'],
        summary: 'Dejar de seguir comunidad. ID de la URL -> tu usuario / ID pasado por JS -> comunidad a dejar de seguir.'
    )]
    public function unfollowCommunity(int $id, Request $request, UserRepository $users, CommunityRepository $communities, CommunityFollowsRepository $followEntity, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['community_id'])) {
            return new JsonResponse(
                ['error' => 'community_id es requerido'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $community_id = $data['community_id'];
        $community = $communities->find($community_id);

        if (!$community) {
            return new JsonResponse(
                ['error' => 'Comunidad no encontrada'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $existingFollow = $followEntity->findOneBy([
            'user' => $user,
            'community' => $community
        ]);

        if (!$existingFollow) {
            return new JsonResponse(
                ['error' => 'No sigues esta comunidad.'],
                JsonResponse::HTTP_CONFLICT
            );
        }

        $entityManager->remove($existingFollow);
        $entityManager->flush();

        return new JsonResponse(
            ['message' => "El usuario $id ha dejado de seguir a la comunidad $community_id."],
            JsonResponse::HTTP_OK
        );
    }

    #[Route('/{id<\d+>}/join', name: 'user_join_community', methods: ['POST'])]
    #[OA\Post(
        tags: ['UserController'],
        summary: 'Unirse a una comundad. ID de la URL -> tu usuario / ID pasado por JS -> usuario a seguir.'
    )]
    public function join(int $id, Request $request, UserRepository $users, CommunityRepository $communities,  CommunityMembersRepository $communityMembersRepository, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
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

        $community_to_join = $communities->find($community_id);

        if (!$community_to_join) {
            return new JsonResponse(
                ['error' => 'Comunidad no encontrada'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $existingMember = $communityMembersRepository->findOneBy([
            'user' => $user,
            'community' => $community_to_join
        ]);

        if ($existingMember) {
            return new JsonResponse(
                ['error' => 'Ya formas parte de esta comunidd'],
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
            ['message' => "El usuario $id ahora es miembro de la comunidad $community_id."],
            JsonResponse::HTTP_CREATED, // 201 es más apropiado para creación
        );
    }

    #[Route('/{id<\d+>}/leave', name: 'user_leave_community', methods: ['DELETE'])]
    #[OA\Delete(
        tags: ['UserController'],
        summary: 'Dejar una comundad. ID de la URL -> tu usuario / ID pasado por JS -> usuario a seguir.'
    )]
    public function leave(int $id, Request $request, UserRepository $users, CommunityRepository $communities,  CommunityMembersRepository $communityMembersRepository, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
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

        $community_to_join = $communities->find($community_id);

        if (!$community_to_join) {
            return new JsonResponse(
                ['error' => 'Comunidad no encontrada'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $membership = $communityMembersRepository->findOneBy(['user' => $user->getId(), 'community' => $community_to_join->getId()]);

        if (!$membership) {
            return new JsonResponse(
                ['error' => 'No formas parte de esta comunidad.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $entityManager->remove($membership);

        $entityManager->flush();

        return new JsonResponse(
            ['message' => "El usuario $id ha empezado dejado de ser miembro de la comunidad $community_id."],
            JsonResponse::HTTP_CREATED, // 201 es más apropiado para creación
        );
    }

    #[Route('/{id<\d+>}/communities', name: 'user_show_communities', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserController'],
        summary: 'Muestra todas las comunidades el cual el usuario dado por URL es miembro.'
    )]
    public function showCommunities(int $id, Request $request, UserRepository $users, CommunityMembersRepository $members, SerializerInterface $serializer): JsonResponse
    {
        // Verificar que el usuario existe
        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Buscar todos los follows donde user_id = $id
        $userMemberships = $members->findBy(['user' => $user]);

        if (empty($userMemberships)) {
            return new JsonResponse(
                ['message' => 'Este usuario no es miembro de ninguna comunidad.'],
                JsonResponse::HTTP_OK
            );
        }

        return new JsonResponse(
            $serializer->serialize($userMemberships, 'json', ['groups' => 'member']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/{id<\d+>}/followed-communities', name: 'user_show_followed_communities', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserController'],
        summary: 'Muestra todas las comunidades que el usuario sigue (follows).'
    )]
    public function showFollowedCommunities(int $id, Request $request, UserRepository $users, CommunityFollowsRepository $follows, SerializerInterface $serializer): JsonResponse
    {
        // Verificar que el usuario existe
        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Buscar todos los follows donde user_id = $id
        $userFollows = $follows->findBy(['user' => $user]);

        if (empty($userFollows)) {
            return new JsonResponse(
                [],
                JsonResponse::HTTP_OK
            );
        }

        return new JsonResponse(
            $serializer->serialize($userFollows, 'json', ['groups' => 'getCommunityFollowers']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/{id<\d+>}/following', name: 'user_show_following', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserController'],
        summary: 'Muestra todos los follows del usuario dado por URL.'
    )]
    public function showFollowing(int $id, Request $request, UserRepository $users, UserFollowsRepository $follows, SerializerInterface $serializer): JsonResponse
    {
        // Verificar que el usuario existe
        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Buscar todos los follows donde user_id = $id
        $userFollows = $follows->findBy(['user' => $user]);

        if (empty($userFollows)) {
            return new JsonResponse(
                ['message' => 'Este usuario no sigue a nadie.'],
                JsonResponse::HTTP_OK
            );
        }

        return new JsonResponse(
            $serializer->serialize($userFollows, 'json', ['groups' => 'getFollowing']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/{id<\d+>}/followers', name: 'user_show_followers', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserController'],
        summary: 'Muestra todos los followers del usuario dado por URL.'
    )]
    public function showFollowers(int $id, Request $request, UserRepository $users, UserFollowsRepository $follows, SerializerInterface $serializer): JsonResponse
    {
        // Verificar que el usuario existe
        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Buscar todos los follows donde user_id = $id
        $userFollows = $follows->findBy(['followingUser' => $user]);

        if (empty($userFollows)) {
            return new JsonResponse(
                ['message' => 'Nadie sigue a este usuario.'],
                JsonResponse::HTTP_OK
            );
        }

        return new JsonResponse(
            $serializer->serialize($userFollows, 'json', ['groups' => 'getFollowers']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/followers', name: 'users_get_all_followers_list', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserController'],
        summary: 'Muestra todos los follows de TODOS los usuarios.'
    )]
    public function getAllFollowerList(UserFollowsRepository $follows, SerializerInterface $serializer): JsonResponse
    {

        $all = $follows->findAll();

        if (!$all) {
            return new JsonResponse(
                ['error' => 'Todavía nadie sigue a nadie.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        return new JsonResponse(
            $serializer->serialize($all, 'json', ['groups' => 'follows']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }
    #[Route('/{id<\d+>}/posts', methods: ['GET'])]
    #[OA\Get(
        tags: ['UserController'],
        summary: 'Lista todos los posts por usuario id dada.'
    )]
    public function showPosts(int $id, UserRepository $users, PostRepository $posts, SerializerInterface $serializer): JsonResponse
    {

        $user = $users->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $userPosts = $posts->findBy(['user' => $user]);

        if (!$userPosts) {
            return new JsonResponse(
                ['error' => 'Este usuario aún no ha subido ningún post.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        return new JsonResponse(
            $serializer->serialize($userPosts, 'json', ['groups' => 'post']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }
}
