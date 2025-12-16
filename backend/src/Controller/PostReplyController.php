<?php

namespace App\Controller;

use App\Entity\PostReply;
use App\Entity\UserPostReplyLeaf;
use App\Entity\Notification;
use App\Repository\PostReplyRepository;
use App\Repository\PostRepository;
use App\Repository\UserPostReplyLeafRepository;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

#[Route('/api/replies', name: 'api_replies_')]
final class PostReplyController extends AbstractController
{
    #[Route('', name: 'api_replies_list', methods: ['GET'])]
    #[OA\Get(
        tags: ['PostReplyController'],
        summary: 'Muestra todas las respuestas.'
    )]
    public function index(PostReplyRepository $repliesRepository, SerializerInterface $serializer): JsonResponse
    {
        $all = $repliesRepository->findAll();

        return new JsonResponse(
            $serializer->serialize($all, 'json', ['groups' => 'reply']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[OA\Get(
        tags: ['PostReplyController'],
        summary: 'Muestra la respuesta por ID dada por URL.'
    )]
    #[Route('/{id<\d+>}', name: 'api_reply_show', methods: ['GET'])]
    public function show(int $id, PostReplyRepository $replyRepository, SerializerInterface $serializer): JsonResponse
    {
        $reply = $replyRepository->find($id);

        if (!$reply) {
            return new JsonResponse(
                ['error' => 'No existe esta respuesta.'],
                JsonResponse::HTTP_NOT_ACCEPTABLE
            );
        }

        return new JsonResponse(
            $serializer->serialize($reply, 'json', ['groups' => 'reply']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[OA\Delete(
        tags: ['PostReplyController'],
        summary: 'Borra la respuesta dada por id URL.'
    )]
    #[Route('/{id<\d+>}/destroy', name: 'api_reply_destroy', methods: ['DELETE'])]
    public function destroy(int $id, PostReplyRepository $replyRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $reply = $replyRepository->find($id);

        if (!$reply) {
            return new JsonResponse(
                ['error' => 'No existe esta respuesta.'],
                JsonResponse::HTTP_NOT_ACCEPTABLE
            );
        }

        $entityManager->remove($reply);
        $entityManager->flush();

        return new JsonResponse(
            ['message' => 'La respuesta se ha borrado correctamente.'],
            JsonResponse::HTTP_OK
        );
    }

    #[Route('/create', name: 'api_replies_create', methods: ['POST'])]
    #[OA\Post(
        tags: ['PostReplyController'],
        summary: 'Crea una nueva respuesta a un post.',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                properties: [
                    new OA\Property(property: 'user', type: 'int', example: '1 (user_id)'),
                    new OA\Property(property: 'post', type: 'int', example: '1 (post_id)'),
                    new OA\Property(property: 'content', type: 'string', example: 'Lorem ipsum...'),
                    new OA\Property(property: 'image', type: 'string', example: 'path/img'),
                ]
            )
        ),
    )]
    public function create(Request $request, UserRepository $users, PostRepository $posts, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        $reply = new PostReply();

        $data = json_decode($request->getContent(), true);

        if (isset($data['user'])) {
            $user = $users->find($data['user']);

            if (!$user) {
                return new JsonResponse(
                    ['error' => 'Usuario no encontrado.'],
                    JsonResponse::HTTP_NOT_FOUND
                );
            }

            $reply->setUser($user);
        } else {
            return new JsonResponse(
                ['error' => 'La respuesta necesita el campo: user (user_id).'],
                JsonResponse::HTTP_NOT_ACCEPTABLE
            );
        }

        if (isset($data['post'])) {
            $post = $posts->find($data['post']);

            if (!$post) {
                return new JsonResponse(
                    ['error' => 'Post no encontrado.'],
                    JsonResponse::HTTP_NOT_FOUND
                );
            }

            $reply->setPost($post);
        } else {
            return new JsonResponse(
                ['error' => 'La respuesta necesita el campo: post (post_id).'],
                JsonResponse::HTTP_NOT_ACCEPTABLE
            );
        }

        if (isset($data['image'])) {
            $reply->setImage($data['image']);
        }

        if (isset($data['content'])) {
            $reply->setContent($data['content']);
        } else {
            return new JsonResponse(
                ['error' => 'La respuesta necesita el campo: content.'],
                JsonResponse::HTTP_NOT_ACCEPTABLE
            );
        }

        $reply->setLeaf(0);
        $reply->setCreatedAt(new \DateTimeImmutable());
        $reply->setUpdatedAt(new \DateTimeImmutable());

        $errors = $validator->validate($reply);

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

        $entityManager->persist($reply);
        $entityManager->flush();

        // Crear notificación para el autor del post (si no es el mismo usuario)
        $postAuthor = $post->getUser();
        if ($postAuthor && $postAuthor->getId() !== $user->getId()) {
            $notification = new Notification();
            $notification->setUser($postAuthor);
            $notification->setActor($user);
            $notification->setPost($post);
            $notification->setType('reply');
            $notification->setMessage($user->getUsername() . ' ha respondido a tu post');
            $notification->setIsRead(false);
            $notification->setCreatedAt(new \DateTimeImmutable());
            $notification->setUpdatedAt(new \DateTimeImmutable());

            $entityManager->persist($notification);
            $entityManager->flush();
        }

        return new JsonResponse(
            ['message' => "La respuesta ha sido creada."],
            JsonResponse::HTTP_OK,
            [],
        );
    }

    #[Route('/{id<\d+>}/edit', name: 'api_replies_edit', methods: ['PUT'])]
    #[OA\Put(
        tags: ['PostReplyController'],
        summary: 'Edita la respuesta dado ID.',
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
    public function edit(int $id, Request $request, PostReplyRepository $replies, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $reply = $replies->find($id);

        if (!$reply) {
            return new JsonResponse(
                ['error' => 'La respuesta no existe.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        if (isset($data['image'])) {
            $reply->setImage($data['image']);
        }

        if (isset($data['content'])) {
            $reply->setContent($data['content']);
        }

        $reply->setUpdatedAt(new \DateTimeImmutable());

        $errors = $validator->validate($reply);

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
            ['message' => "La respuesta ha sido editada."],
            JsonResponse::HTTP_OK,
            [],
        );
    }

    #[Route('/{id<\d+>}/like-leaf', name: 'reply_user_liked_leaf', methods: ['POST'])]
    #[OA\Post(
        tags: ['PostReplyController'],
        summary: 'Darle like (leaf) a la respuesta. ID de la URL -> reply.'
    )]
    public function likeReplyLeaf(int $id, Request $request, PostReplyRepository $replies, UserRepository $users, UserPostReplyLeafRepository $likeLeafs, EntityManagerInterface $entityManager, ValidatorInterface $validator): JsonResponse
    {
        $reply = $replies->find($id);

        if (!$reply) {
            return new JsonResponse(
                ['error' => 'Respuesta no encontrada.'],
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

        $existingLikeLeaf = $likeLeafs->findOneBy([
            'user' => $user,
            'reply' => $reply
        ]);

        if ($existingLikeLeaf) {
            return new JsonResponse(
                ['error' => 'Ya has dado like (leaf) a esta respuesta.'],
                JsonResponse::HTTP_CONFLICT
            );
        }

        $replyLikeLeaf = new UserPostReplyLeaf();
        $replyLikeLeaf->setUser($user);
        $replyLikeLeaf->setReply($reply);
        $replyLikeLeaf->setCreatedAt(new \DateTimeImmutable());
        $replyLikeLeaf->setUpdatedAt(new \DateTimeImmutable());

        $errors = $validator->validate($replyLikeLeaf);

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

        // Incrementar contador en la respuesta
        $reply->setLeaf($reply->getLeaf() + 1);

        $entityManager->persist($replyLikeLeaf);
        $entityManager->flush();

        return new JsonResponse(
            [
                'message' => "Se ha dado el like (leaf) a la respuesta correctamente.",
                'leaf_count' => $reply->getLeaf()
            ],
            JsonResponse::HTTP_CREATED,
        );
    }

    #[Route('/{id<\d+>}/unlike-leaf', name: 'reply_user_unliked_leaf', methods: ['DELETE'])]
    #[OA\Delete(
        tags: ['PostReplyController'],
        summary: 'Quitar like (leaf) a la respuesta. ID de la URL -> reply.'
    )]
    public function unlikeReplyLeaf(int $id, Request $request, PostReplyRepository $replies, UserRepository $users, UserPostReplyLeafRepository $likeLeafs, EntityManagerInterface $entityManager): JsonResponse
    {
        $reply = $replies->find($id);

        if (!$reply) {
            return new JsonResponse(
                ['error' => 'Respuesta no encontrada.'],
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

        $likedReply = $likeLeafs->findOneBy(['user' => $user, 'reply' => $reply]);

        if (!$likedReply) {
            return new JsonResponse(
                ['error' => 'No has dado like a esta respuesta.'],
                JsonResponse::HTTP_NOT_FOUND,
            );
        }

        // Decrementar contador en la respuesta
        $reply->setLeaf(max(0, $reply->getLeaf() - 1));

        $entityManager->remove($likedReply);
        $entityManager->flush();

        return new JsonResponse(
            [
                'message' => "Se ha quitado el like (leaf) a la respuesta correctamente.",
                'leaf_count' => $reply->getLeaf()
            ],
            JsonResponse::HTTP_OK,
        );
    }
}