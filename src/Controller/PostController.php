<?php

namespace App\Controller;

use App\Entity\Post;
use App\Entity\UserPostLeaf;
use App\Entity\UserRepost;
use App\Repository\PostRepository;
use App\Repository\UserPostLeafRepository;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

#[Route('/api/posts', name: 'api_posts_')]
final class PostController extends AbstractController
{

    #[Route('', name: 'api_posts_list', methods: ['GET'])]
    #[OA\Get(
        tags: ['PostController'],
        summary: 'Muestra todos los posts.'
    )]
    public function index(PostRepository $postsRepository, SerializerInterface $serializer): JsonResponse
    {
        $all = $postsRepository->findAll();

        return new JsonResponse(
            $serializer->serialize($all, 'json', ['groups' => 'post']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[OA\Get(
        tags: ['PostController'],
        summary: 'Muestra el post por ID dada por URL.'
    )]
    #[Route('/{id<\d+>}', name: 'api_post_show', methods: ['GET'])]
    public function show(int $id, PostRepository $postRepository, SerializerInterface $serializer): JsonResponse
    {
        $post = $postRepository->find($id);

        if (!$post) {
            return new JsonResponse(
                ['error' => 'No existe este post.'],
                JsonResponse::HTTP_NOT_ACCEPTABLE
            );
        }

        return new JsonResponse(
            $serializer->serialize($post, 'json', ['groups' => 'post']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[OA\Delete(
        tags: ['PostController'],
        summary: 'Borra el post dado por id URL.'
    )]
    #[Route('/{id<\d+>}/delete', name: 'api_post_destroy', methods: ['DELETE'])]
    public function destroy(int $id, PostRepository $postRepository, SerializerInterface $serializer, EntityManagerInterface $entityManager): JsonResponse
    {
        $post = $postRepository->find($id);

        if (!$post) {
            return new JsonResponse(
                ['error' => 'No existe este post.'],
                JsonResponse::HTTP_NOT_ACCEPTABLE
            );
        }

        $entityManager->remove($post);

        $entityManager->flush();

        return new JsonResponse(
            ['message' => 'El post se ha borrado correctamente.'],
            JsonResponse::HTTP_OK
        );
    }

    #[Route('/create', name: 'api_posts_create', methods: ['POST'])]
    #[OA\Post(
        tags: ['PostController'],
        summary: 'Crea un nuevo post.',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                properties: [
                    new OA\Property(property: 'user', type: 'int', example: '1 (user_id)'),
                    new OA\Property(property: 'content', type: 'string', example: 'Lorem ipsum...'),
                    new OA\Property(property: 'image', type: 'string', example: 'path/img'),
                ]
            )
        ),
    )]
    public function create(Request $request, UserRepository $users, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {

        $post = new Post();

        $data = json_decode($request->getContent(), true);

        if (isset($data['user'])) {

            $user = $users->find($data['user']);

            if (!$user) {
                return new JsonResponse(
                    ['error' => 'Usuario no encontrado.'],
                    JsonResponse::HTTP_NOT_FOUND
                );
            }

            $post->setUser($user);
        } else {
            return new JsonResponse(
                ['error' => 'El post necesita el campo: user (user_id).'],
                JsonResponse::HTTP_NOT_ACCEPTABLE
            );
        }

        if (isset($data['image'])) {
            $post->setImage($data['image']);
        }

        if (isset($data['content'])) {
            $post->setContent($data['content']);
        } else {
            return new JsonResponse(
                ['error' => 'El post necesita el campo: content.'],
                JsonResponse::HTTP_NOT_ACCEPTABLE
            );
        }

        $post->setLeaf(0);

        $post->setCreatedAt(new \DateTimeImmutable());
        $post->setUpdatedAt(new \DateTimeImmutable());

        // 4. Validar la entidad antes de guardar
        $errors = $validator->validate($post);

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

        $entityManager->persist($post);

        $entityManager->flush();

        return new JsonResponse(
            ['message' => "El post ha sido creado."],
            JsonResponse::HTTP_OK,
            [],
        );
    }


    #[Route('/{id<\d+>}/edit', name: 'api_posts_edit', methods: ['PUT'])]
    #[OA\Put(
        tags: ['PostController'],
        summary: 'Edita el post dado ID.',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                properties: [
                    new OA\Property(property: 'content', type: 'string', example: 'Lorem ipsum...'),
                    new OA\Property(property: 'image', type: 'string', example: 'path/img'),
                ]
            )
        ),
    )]
    public function edit(int $id, Request $request, UserRepository $users, PostRepository $posts, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {

        $data = json_decode($request->getContent(), true);

        $post = $posts->find($id);

        if (!$post) {
            return new JsonResponse(
                ['error' => 'El post no existe.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        if (isset($data['image'])) {
            $post->setImage($data['image']);
        }

        if (isset($data['content'])) {
            $post->setContent($data['content']);
        }

        $post->setUpdatedAt(new \DateTimeImmutable());

        // 4. Validar la entidad antes de guardar
        $errors = $validator->validate($post);

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
            ['message' => "El post ha sido editado."],
            JsonResponse::HTTP_OK,
            [],
        );
    }



    #[Route('/{id<\d+>}/like-leaf', name: 'post_user_liked_leaf', methods: ['POST'])]
    #[OA\Post(
        tags: ['PostController'],
        summary: 'Darle like (leaf) al post. ID de la URL -> post.'
    )]
    public function likePostLeaf(int $id, Request $request, PostRepository $posts, UserRepository $users, UserPostLeafRepository $likeLeafs, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {
        $post = $posts->find($id);

        if (!$post) {
            return new JsonResponse(
                ['error' => 'Post no encontrado.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['user'])) {
            return new JsonResponse(
                ['error' => 'El post necesita el campo: user (user_id).'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user = $users->find($data['user']);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usario no encontrado.'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $existingLikeLeaf = $likeLeafs->findOneBy([
            'user' => $user,
            'post' => $post
        ]);

        if ($existingLikeLeaf) {
            return new JsonResponse(
                ['error' => 'Ya has dado like (leaf) a este post.'],
                JsonResponse::HTTP_CONFLICT
            );
        }

        $postLikeLeaf = new UserPostLeaf();
        $postLikeLeaf->setUser($user);
        $postLikeLeaf->setPost($post);
        $postLikeLeaf->setCreatedAt(new \DateTimeImmutable());
        $postLikeLeaf->setUpdatedAt(new \DateTimeImmutable());

        // ⚠️ Deberías validar $follow, no $user
        $errors = $validator->validate($postLikeLeaf);

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

        $entityManager->persist($postLikeLeaf);
        $entityManager->flush();

        return new JsonResponse(
            ['message' => "Se ha dado el like (leaf) al post correctamente."],
            JsonResponse::HTTP_CREATED, // 201 es más apropiado para creación
        );
    }

    #[Route('/{id<\d+>}/unlike-leaf', name: 'post_user_unliked_leaf', methods: ['DELETE'])]
    #[OA\Delete(
        tags: ['PostController'],
        summary: 'Quitar like (leaf) al post. ID de la URL -> post.'
    )]
    public function unlikePostLeaf(int $id, Request $request, PostRepository $posts, UserRepository $users, UserPostLeafRepository $likeLeafs, EntityManagerInterface $entityManager, SerializerInterface $serializer, ValidatorInterface $validator): JsonResponse
    {

        $post = $posts->find($id);

        if (!$post) {
            return new JsonResponse(
                ['error' => 'Post no encotrado.'],
                JsonResponse::HTTP_NOT_FOUND,
            );
        }

        $data = json_decode($request->getContent(), true);

        $user = $users->find($data['user']);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encotrado.'],
                JsonResponse::HTTP_NOT_FOUND,
            );
        }

        $likedPost = $likeLeafs->findBy(['user' => $user, 'post' => $post]);

        $entityManager->remove($post);

        $entityManager->flush();


        return new JsonResponse(
            ['message' => "Se ha quitado el like (leaf) al post correctamente."],
            JsonResponse::HTTP_OK, // 201 es más apropiado para creación
        );
    }

    #[Route('/{id<\d+>}/repost', name: 'post_user_repost', methods: ['POST'])]
    #[OA\Post(
        tags: ['PostController'],
        summary: 'Hacer repost del post. ID de la URL -> post.'
    )]
    public function repost(int $id, Request $request, PostRepository $posts, UserRepository $users, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        $post = $posts->find($id);

        if (!$post) {
            return new JsonResponse(
                ['error' => 'Post no encontrado.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['user'])) {
            return new JsonResponse(
                ['error' => 'La petición necesita el campo: user (user_id).'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user = $users->find($data['user']);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado.'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $repostRepository = $entityManager->getRepository(UserRepost::class);
        $existingRepost = $repostRepository->findOneBy([
            'user' => $user,
            'post' => $post
        ]);

        if ($existingRepost) {
            return new JsonResponse(
                ['error' => 'Ya has hecho repost de este post.'],
                JsonResponse::HTTP_CONFLICT
            );
        }

        $repost = new UserRepost();
        $repost->setUser($user);
        $repost->setPost($post);
        $repost->setCreatedAt(new \DateTimeImmutable());
        $repost->setUpdatedAt(new \DateTimeImmutable());

        $errors = $validator->validate($repost);

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

        $entityManager->persist($repost);
        $entityManager->flush();

        return new JsonResponse(
            ['message' => "Se ha hecho repost correctamente."],
            JsonResponse::HTTP_CREATED,
        );
    }

    #[Route('/{id<\d+>}/unrepost', name: 'post_user_unrepost', methods: ['DELETE'])]
    #[OA\Delete(
        tags: ['PostController'],
        summary: 'Quitar repost del post. ID de la URL -> post.'
    )]
    public function unrepost(int $id, Request $request, PostRepository $posts, UserRepository $users, EntityManagerInterface $entityManager): JsonResponse
    {
        $post = $posts->find($id);

        if (!$post) {
            return new JsonResponse(
                ['error' => 'Post no encontrado.'],
                JsonResponse::HTTP_NOT_FOUND,
            );
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['user'])) {
            return new JsonResponse(
                ['error' => 'La petición necesita el campo: user (user_id).'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user = $users->find($data['user']);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado.'],
                JsonResponse::HTTP_NOT_FOUND,
            );
        }

        $repostRepository = $entityManager->getRepository(UserRepost::class);
        $repost = $repostRepository->findOneBy(['user' => $user, 'post' => $post]);

        if (!$repost) {
            return new JsonResponse(
                ['error' => 'No has hecho repost de este post.'],
                JsonResponse::HTTP_NOT_FOUND,
            );
        }

        $entityManager->remove($repost);
        $entityManager->flush();

        return new JsonResponse(
            ['message' => "Se ha quitado el repost correctamente."],
            JsonResponse::HTTP_OK,
        );
    }
}
