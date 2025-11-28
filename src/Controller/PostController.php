<?php

namespace App\Controller;

use App\Entity\Post;
use App\Repository\PostRepository;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/posts', name: 'api_posts_')]
final class PostController extends AbstractController
{

    #[Route('', name: 'api_posts_list', methods: ['GET'])]
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

        if (isset($data['title'])) {
            $post->setTitle($data['title']);
        } else {
            return new JsonResponse(
                ['error' => 'El post necesita el campo: title.'],
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

        if (isset($data['title'])) {
            $post->setTitle($data['title']);
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
}
