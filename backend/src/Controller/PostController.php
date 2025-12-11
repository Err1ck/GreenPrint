<?php

namespace App\Controller;

use App\Entity\Post;
use App\Entity\UserPostLeaf;
use App\Entity\UserPostTree;
use App\Entity\UserRepost;
use App\Repository\CommunityRepository;
use App\Repository\HashtagRepository;
use App\Repository\PostRepository;
use App\Repository\UserPostLeafRepository;
use App\Repository\UserPostTreeRepository;
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
    public function index(
        Request $request,
        PostRepository $postsRepository,
        UserRepository $userRepository,
        UserPostLeafRepository $likeLeafs,
        UserPostTreeRepository $likeTrees,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer
    ): JsonResponse {
        $all = $postsRepository->findBy(
            [],                 // criterios (vacío = todos los registros)
            ['createdAt' => 'DESC']  // orden
        );

        // Obtener user_id opcional de los query params
        $userId = $request->query->get('user_id');

        // Si hay user_id, incluir las interacciones del usuario
        if ($userId) {
            $user = $userRepository->find($userId);

            if ($user) {
                // Obtener todas las interacciones del usuario de una vez
                $postIds = array_map(fn($post) => $post->getId(), $all);

                // Consultas optimizadas para obtener todas las interacciones
                $userLeafLikes = $likeLeafs->createQueryBuilder('l')
                    ->where('l.user = :user')
                    ->andWhere('l.post IN (:posts)')
                    ->setParameter('user', $user)
                    ->setParameter('posts', $postIds)
                    ->getQuery()
                    ->getResult();

                $userTreeLikes = $likeTrees->createQueryBuilder('t')
                    ->where('t.user = :user')
                    ->andWhere('t.post IN (:posts)')
                    ->setParameter('user', $user)
                    ->setParameter('posts', $postIds)
                    ->getQuery()
                    ->getResult();

                $repostRepository = $entityManager->getRepository(UserRepost::class);
                $userReposts = $repostRepository->createQueryBuilder('r')
                    ->where('r.user = :user')
                    ->andWhere('r.post IN (:posts)')
                    ->setParameter('user', $user)
                    ->setParameter('posts', $postIds)
                    ->getQuery()
                    ->getResult();

                $savedPostsRepository = $entityManager->getRepository(\App\Entity\SavedPosts::class);
                $userSavedPosts = $savedPostsRepository->createQueryBuilder('s')
                    ->where('s.user = :user')
                    ->andWhere('s.post IN (:posts)')
                    ->setParameter('user', $user)
                    ->setParameter('posts', $postIds)
                    ->getQuery()
                    ->getResult();

                // Crear mapas para búsqueda rápida
                $leafLikesMap = [];
                foreach ($userLeafLikes as $like) {
                    $leafLikesMap[$like->getPost()->getId()] = true;
                }

                $treeLikesMap = [];
                foreach ($userTreeLikes as $like) {
                    $treeLikesMap[$like->getPost()->getId()] = true;
                }

                $repostsMap = [];
                foreach ($userReposts as $repost) {
                    $repostsMap[$repost->getPost()->getId()] = true;
                }

                $savedPostsMap = [];
                foreach ($userSavedPosts as $saved) {
                    $savedPostsMap[$saved->getPost()->getId()] = true;
                }

                // Serializar posts y agregar interacciones
                $postsData = json_decode($serializer->serialize($all, 'json', ['groups' => 'post']), true);

                // Obtener repositorio de replies
                $replyRepository = $entityManager->getRepository(\App\Entity\PostReply::class);

                foreach ($postsData as &$postData) {
                    $postId = $postData['id'];
                    $postData['user_interactions'] = [
                        'has_liked_leaf' => isset($leafLikesMap[$postId]),
                        'has_liked_tree' => isset($treeLikesMap[$postId]),
                        'has_reposted' => isset($repostsMap[$postId]),
                        'has_saved' => isset($savedPostsMap[$postId])
                    ];
                    // Agregar contador de replies
                    $postData['replies'] = $replyRepository->count(['post' => $postId]);
                }

                return new JsonResponse($postsData, JsonResponse::HTTP_OK);
            }
        }

        // Si no hay user_id o el usuario no existe, devolver posts sin interacciones pero con reply count
        $postsData = json_decode($serializer->serialize($all, 'json', ['groups' => 'post']), true);
        $replyRepository = $entityManager->getRepository(\App\Entity\PostReply::class);

        foreach ($postsData as &$postData) {
            $postData['replies'] = $replyRepository->count(['post' => $postData['id']]);
        }

        return new JsonResponse($postsData, JsonResponse::HTTP_OK);
    }

    #[OA\Get(
        tags: ['PostController'],
        summary: 'Muestra el post por ID dada por URL.'
    )]
    #[Route('/{id<\d+>}', name: 'api_post_show', methods: ['GET'])]
    public function show(
        int $id,
        Request $request,
        PostRepository $postRepository,
        UserRepository $userRepository,
        UserPostLeafRepository $likeLeafs,
        UserPostTreeRepository $likeTrees,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer
    ): JsonResponse {
        $post = $postRepository->find($id);

        if (!$post) {
            return new JsonResponse(
                ['error' => 'No existe este post.'],
                JsonResponse::HTTP_NOT_ACCEPTABLE
            );
        }

        // Obtener user_id opcional de los query params
        $userId = $request->query->get('user_id');

        // Si hay user_id, incluir las interacciones del usuario
        if ($userId) {
            $user = $userRepository->find($userId);

            if ($user) {
                // Verificar interacciones del usuario con este post
                $hasLikedLeaf = $likeLeafs->findOneBy(['user' => $user, 'post' => $post]) !== null;
                $hasLikedTree = $likeTrees->findOneBy(['user' => $user, 'post' => $post]) !== null;

                $repostRepository = $entityManager->getRepository(UserRepost::class);
                $hasReposted = $repostRepository->findOneBy(['user' => $user, 'post' => $post]) !== null;

                $savedPostsRepository = $entityManager->getRepository(\App\Entity\SavedPosts::class);
                $hasSaved = $savedPostsRepository->findOneBy(['user' => $user, 'post' => $post]) !== null;

                // Serializar post y agregar interacciones
                $postData = json_decode($serializer->serialize($post, 'json', ['groups' => 'post']), true);
                $postData['user_interactions'] = [
                    'has_liked_leaf' => $hasLikedLeaf,
                    'has_liked_tree' => $hasLikedTree,
                    'has_reposted' => $hasReposted,
                    'has_saved' => $hasSaved
                ];

                // Agregar contador de replies
                $replyRepository = $entityManager->getRepository(\App\Entity\PostReply::class);
                $postData['replies'] = $replyRepository->count(['post' => $post]);

                return new JsonResponse($postData, JsonResponse::HTTP_OK);
            }
        }

        // Si no hay user_id, devolver post sin interacciones pero con reply count
        $postData = json_decode($serializer->serialize($post, 'json', ['groups' => 'post']), true);
        $replyRepository = $entityManager->getRepository(\App\Entity\PostReply::class);
        $postData['replies'] = $replyRepository->count(['post' => $post]);

        return new JsonResponse($postData, JsonResponse::HTTP_OK);
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
                    new OA\Property(property: 'community', type: 'int', example: '1 (community_id)', nullable: true),
                    new OA\Property(property: 'postType', type: 'string', example: 'user or community'),
                    new OA\Property(property: 'content', type: 'string', example: 'Lorem ipsum...'),
                    new OA\Property(property: 'image', type: 'string', example: 'path/img'),
                ]
            )
        ),
    )]
    public function create(
        Request $request,
        UserRepository $users,
        CommunityRepository $communities,
        HashtagRepository $hashtagRepo,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        \App\Service\FileUploadService $fileUploadService
    ): JsonResponse {
        $post = new Post();

        // Detectar si es multipart/form-data o JSON
        $contentType = $request->headers->get('Content-Type');
        $isMultipart = str_contains($contentType ?? '', 'multipart/form-data');

        if ($isMultipart) {
            // Obtener datos del formulario
            $data = [
                'user' => $request->request->get('user'),
                'community' => $request->request->get('community'),
                'postType' => $request->request->get('postType'),
                'content' => $request->request->get('content'),
            ];
        } else {
            // Obtener datos del JSON (backward compatibility)
            $data = json_decode($request->getContent(), true);
        }

        // Validar y asignar usuario
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

        // Validar y asignar comunidad (si existe)
        if (isset($data['community'])) {
            $community = $communities->find($data['community']);

            if (!$community) {
                return new JsonResponse(
                    ['error' => 'Comunidad no encontrada.'],
                    JsonResponse::HTTP_NOT_FOUND
                );
            }

            $post->setCommunity($community);
            $post->setPostType('community'); // Establecer tipo automáticamente
        } else {
            // Si no hay comunidad, es un post de usuario
            $post->setPostType('user');
        }

        // Validar postType manual si se proporciona
        if (isset($data['postType'])) {
            $validTypes = ['user', 'community'];
            if (!in_array($data['postType'], $validTypes)) {
                return new JsonResponse(
                    ['error' => 'postType debe ser "user" o "community".'],
                    JsonResponse::HTTP_BAD_REQUEST
                );
            }
            $post->setPostType($data['postType']);
        }

        // Manejar imagen subida
        if ($isMultipart) {
            $imageFile = $request->files->get('image');
            if ($imageFile) {
                try {
                    $imagePath = $fileUploadService->upload($imageFile, 'posts');
                    $post->setImage($imagePath);
                } catch (\Exception $e) {
                    return new JsonResponse(
                        ['error' => $e->getMessage()],
                        JsonResponse::HTTP_BAD_REQUEST
                    );
                }
            } else {
                // Si no hay archivo de imagen, verificar si hay una URL de GIF
                $gifUrl = $request->request->get('gif_url');
                if ($gifUrl) {
                    $post->setImage($gifUrl);
                }
            }
        } else {
            // Asignar imagen si existe (backward compatibility para base64 u otras rutas)
            if (isset($data['image'])) {
                $post->setImage($data['image']);
            }
        }

        // Validar y asignar contenido
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

        // Validar la entidad antes de guardar
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

        // Extraer y guardar hashtags (no debe fallar la creación del post si hay error)
        try {
            $this->extractAndSaveHashtags($post->getContent(), $hashtagRepo, $entityManager);
        } catch (\Exception $e) {
            // Log el error pero no fallar la creación del post
            error_log("Error al procesar hashtags: " . $e->getMessage());
        }

        return new JsonResponse(
            ['message' => "El post ha sido creado.", 'post_id' => $post->getId()],
            JsonResponse::HTTP_CREATED,
        );
    }

    /**
     * Extrae hashtags del contenido y actualiza la tabla de hashtags
     */
    private function extractAndSaveHashtags(string $content, HashtagRepository $hashtagRepo, EntityManagerInterface $entityManager): void
    {
        // Regex para encontrar hashtags (#palabra)
        preg_match_all('/#(\w+)/u', $content, $matches);

        if (empty($matches[1])) {
            return;
        }

        $hashtags = array_unique($matches[1]); // Eliminar duplicados

        foreach ($hashtags as $tag) {
            $tag = strtolower($tag); // Normalizar a minúsculas

            // Buscar si el hashtag ya existe
            $hashtag = $hashtagRepo->findOneBy(['tag' => $tag]);

            if ($hashtag) {
                // Si existe, incrementar el contador
                $hashtag->incrementCount();
                $hashtag->setUpdatedAt(new \DateTimeImmutable());
            } else {
                // Si no existe, crear uno nuevo
                $hashtag = new \App\Entity\Hashtag();
                $hashtag->setTag($tag);
                $hashtag->setCount(1);
                $hashtag->setCreatedAt(new \DateTimeImmutable());
                $hashtag->setUpdatedAt(new \DateTimeImmutable());
                $entityManager->persist($hashtag);
            }
        }

        $entityManager->flush();
    }

    // Nuevo método para obtener posts de una comunidad
    #[Route('/community/{id<\d+>}', name: 'api_posts_by_community', methods: ['GET'])]
    #[OA\Get(
        tags: ['PostController'],
        summary: 'Obtiene todos los posts de una comunidad ordenados por fecha.'
    )]
    public function getPostsByCommunity(
        int $id,
        CommunityRepository $communityRepository,
        PostRepository $postRepository,
        SerializerInterface $serializer
    ): JsonResponse {
        $community = $communityRepository->find($id);

        if (!$community) {
            return new JsonResponse(
                ['error' => 'Comunidad no encontrada'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $posts = $postRepository->findBy(
            ['community' => $community],
            ['createdAt' => 'DESC']
        );

        return new JsonResponse(
            $serializer->serialize($posts, 'json', ['groups' => 'post']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }


    #[Route('/{id<\d+>}/edit', name: 'api_posts_edit', methods: ['PUT', 'POST'])]
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
    public function edit(
        int $id,
        Request $request,
        UserRepository $users,
        PostRepository $posts,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        \App\Service\FileUploadService $fileUploadService
    ): JsonResponse {

        $post = $posts->find($id);

        if (!$post) {
            return new JsonResponse(
                ['error' => 'El post no existe.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Detectar si es multipart/form-data o JSON
        $contentType = $request->headers->get('Content-Type');
        $isMultipart = str_contains($contentType ?? '', 'multipart/form-data');

        if ($isMultipart) {
            // Obtener datos del formulario
            $data = [
                'content' => $request->request->get('content'),
            ];

            // Manejar imagen subida
            $imageFile = $request->files->get('image');
            if ($imageFile) {
                try {
                    // Eliminar imagen anterior si existe
                    if ($post->getImage()) {
                        $fileUploadService->delete($post->getImage());
                    }

                    $imagePath = $fileUploadService->upload($imageFile, 'posts');
                    $post->setImage($imagePath);
                } catch (\Exception $e) {
                    return new JsonResponse(
                        ['error' => $e->getMessage()],
                        JsonResponse::HTTP_BAD_REQUEST
                    );
                }
            }
        } else {
            $data = json_decode($request->getContent(), true);

            if (isset($data['image'])) {
                $post->setImage($data['image']);
            }
        }

        if (isset($data['content'])) {
            $post->setContent($data['content']);
        }

        $post->setUpdatedAt(new \DateTimeImmutable());

        // Validar la entidad antes de guardar
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
    public function likePostLeaf(
        int $id,
        Request $request,
        PostRepository $posts,
        UserRepository $users,
        UserPostLeafRepository $likeLeafs,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
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
                ['error' => 'Usuario no encontrado.'],
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

        // Incrementar contador en el post
        $post->setLeaf($post->getLeaf() + 1);

        $entityManager->persist($postLikeLeaf);
        $entityManager->flush();

        return new JsonResponse(
            [
                'message' => 'Se ha dado el like (leaf) al post correctamente.',
                'leaf_count' => $post->getLeaf()
            ],
            JsonResponse::HTTP_CREATED
        );
    }

    #[Route('/{id<\d+>}/unlike-leaf', name: 'post_user_unliked_leaf', methods: ['DELETE'])]
    #[OA\Delete(
        tags: ['PostController'],
        summary: 'Quitar like (leaf) al post. ID de la URL -> post.'
    )]
    public function unlikePostLeaf(
        int $id,
        Request $request,
        PostRepository $posts,
        UserRepository $users,
        UserPostLeafRepository $likeLeafs,
        EntityManagerInterface $entityManager
    ): JsonResponse {
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
                ['error' => 'El campo user (user_id) es requerido.'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user = $users->find($data['user']);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $likedPost = $likeLeafs->findOneBy(['user' => $user, 'post' => $post]);

        if (!$likedPost) {
            return new JsonResponse(
                ['error' => 'No has dado like (leaf) a este post.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Decrementar contador en el post
        $post->setLeaf(max(0, $post->getLeaf() - 1));

        $entityManager->remove($likedPost);
        $entityManager->flush();

        return new JsonResponse(
            [
                'message' => 'Se ha quitado el like (leaf) al post correctamente.',
                'leaf_count' => $post->getLeaf()
            ],
            JsonResponse::HTTP_OK
        );
    }

    #[Route('/{id<\d+>}/like-tree', name: 'post_user_liked_tree', methods: ['POST'])]
    #[OA\Post(
        tags: ['PostController'],
        summary: 'Darle like (tree) al post de comunidad. ID de la URL -> post.'
    )]
    public function likePostTree(
        int $id,
        Request $request,
        PostRepository $posts,
        UserRepository $users,
        UserPostTreeRepository $likeTrees,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        $post = $posts->find($id);

        if (!$post) {
            return new JsonResponse(
                ['error' => 'Post no encontrado.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        if ($post->getPostType() !== 'community') {
            return new JsonResponse(
                ['error' => 'Solo los posts de comunidad pueden recibir likes de árbol.'],
                JsonResponse::HTTP_BAD_REQUEST
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
                ['error' => 'Usuario no encontrado.'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $existingLikeTree = $likeTrees->findOneBy([
            'user' => $user,
            'post' => $post
        ]);

        if ($existingLikeTree) {
            return new JsonResponse(
                ['error' => 'Ya has dado like (tree) a este post.'],
                JsonResponse::HTTP_CONFLICT
            );
        }

        $postLikeTree = new UserPostTree();
        $postLikeTree->setUser($user);
        $postLikeTree->setPost($post);
        $postLikeTree->setCreatedAt(new \DateTimeImmutable());
        $postLikeTree->setUpdatedAt(new \DateTimeImmutable());

        $errors = $validator->validate($postLikeTree);

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

        // Incrementar contador en el post
        $post->setTree($post->getTree() + 1);

        $entityManager->persist($postLikeTree);
        $entityManager->flush();

        return new JsonResponse(
            [
                'message' => 'Se ha dado el like (tree) al post correctamente.',
                'tree_count' => $post->getTree()
            ],
            JsonResponse::HTTP_CREATED
        );
    }

    #[Route('/{id<\d+>}/unlike-tree', name: 'post_user_unliked_tree', methods: ['DELETE'])]
    #[OA\Delete(
        tags: ['PostController'],
        summary: 'Quitar like (tree) al post. ID de la URL -> post.'
    )]
    public function unlikePostTree(
        int $id,
        Request $request,
        PostRepository $posts,
        UserRepository $users,
        UserPostTreeRepository $likeTrees,
        EntityManagerInterface $entityManager
    ): JsonResponse {
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
                ['error' => 'El campo user (user_id) es requerido.'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user = $users->find($data['user']);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $likedPost = $likeTrees->findOneBy(['user' => $user, 'post' => $post]);

        if (!$likedPost) {
            return new JsonResponse(
                ['error' => 'No has dado like (tree) a este post.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Decrementar contador en el post
        $post->setTree(max(0, $post->getTree() - 1));

        $entityManager->remove($likedPost);
        $entityManager->flush();

        return new JsonResponse(
            [
                'message' => 'Se ha quitado el like (tree) al post correctamente.',
                'tree_count' => $post->getTree()
            ],
            JsonResponse::HTTP_OK
        );
    }

    #[Route('/{id<\d+>}/repost', name: 'post_user_repost', methods: ['POST'])]
    #[OA\Post(
        tags: ['PostController'],
        summary: 'Hacer repost del post. ID de la URL -> post.'
    )]
    public function repost(
        int $id,
        Request $request,
        PostRepository $posts,
        UserRepository $users,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
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

        // Incrementar contador en el post
        $post->setReposts($post->getReposts() + 1);

        $entityManager->persist($repost);
        $entityManager->flush();

        return new JsonResponse(
            [
                'message' => 'Se ha hecho repost correctamente.',
                'repost_count' => $post->getReposts()
            ],
            JsonResponse::HTTP_CREATED
        );
    }

    #[Route('/{id<\d+>}/unrepost', name: 'post_user_unrepost', methods: ['DELETE'])]
    #[OA\Delete(
        tags: ['PostController'],
        summary: 'Quitar repost del post. ID de la URL -> post.'
    )]
    public function unrepost(
        int $id,
        Request $request,
        PostRepository $posts,
        UserRepository $users,
        EntityManagerInterface $entityManager
    ): JsonResponse {
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
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $repostRepository = $entityManager->getRepository(UserRepost::class);
        $repost = $repostRepository->findOneBy(['user' => $user, 'post' => $post]);

        if (!$repost) {
            return new JsonResponse(
                ['error' => 'No has hecho repost de este post.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Decrementar contador en el post
        $post->setReposts(max(0, $post->getReposts() - 1));

        $entityManager->remove($repost);
        $entityManager->flush();

        return new JsonResponse(
            [
                'message' => 'Se ha quitado el repost correctamente.',
                'repost_count' => $post->getReposts()
            ],
            JsonResponse::HTTP_OK
        );
    }

    #[Route('/{id<\d+>}/interactions', name: 'post_user_interactions', methods: ['GET'])]
    #[OA\Get(
        tags: ['PostController'],
        summary: 'Obtiene las interacciones del usuario actual con el post (likes y repost).'
    )]
    public function getUserInteractions(
        int $id,
        Request $request,
        PostRepository $posts,
        UserRepository $users,
        UserPostLeafRepository $likeLeafs,
        UserPostTreeRepository $likeTrees,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $post = $posts->find($id);

        if (!$post) {
            return new JsonResponse(
                ['error' => 'Post no encontrado.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Obtener user_id de los query params
        $userId = $request->query->get('user_id');

        if (!$userId) {
            return new JsonResponse(
                ['error' => 'El parámetro user_id es requerido.'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user = $users->find($userId);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Verificar interacciones
        $hasLikedLeaf = $likeLeafs->findOneBy(['user' => $user, 'post' => $post]) !== null;
        $hasLikedTree = $likeTrees->findOneBy(['user' => $user, 'post' => $post]) !== null;

        $repostRepository = $entityManager->getRepository(UserRepost::class);
        $hasReposted = $repostRepository->findOneBy(['user' => $user, 'post' => $post]) !== null;

        return new JsonResponse([
            'post_id' => $post->getId(),
            'user_id' => $user->getId(),
            'has_liked_leaf' => $hasLikedLeaf,
            'has_liked_tree' => $hasLikedTree,
            'has_reposted' => $hasReposted,
            'leaf_count' => $post->getLeaf(),
            'tree_count' => $post->getTree(),
            'repost_count' => $post->getReposts()
        ], JsonResponse::HTTP_OK);
    }
    #[Route('/{id<\d+>}/replies', name: 'api_post_replies', methods: ['GET'])]
    #[OA\Get(
        tags: ['PostController'],
        summary: 'Obtiene todas las respuestas de un post.'
    )]
    public function getReplies(
        int $id,
        Request $request,
        PostRepository $postRepository,
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer
    ): JsonResponse {
        $post = $postRepository->find($id);

        if (!$post) {
            return new JsonResponse(
                ['error' => 'Post no encontrado'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Obtener repositorio de replies
        $replyRepository = $entityManager->getRepository(\App\Entity\PostReply::class);

        // Obtener todas las respuestas del post
        $replies = $replyRepository->findBy(
            ['post' => $post],
            ['createdAt' => 'ASC']
        );

        // Obtener user_id opcional de los query params
        $userId = $request->query->get('user_id');

        // Si hay user_id, incluir las interacciones del usuario
        if ($userId) {
            $user = $userRepository->find($userId);

            if ($user) {
                // Obtener repositorio de likes de replies
                $replyLeafRepository = $entityManager->getRepository(\App\Entity\UserPostReplyLeaf::class);

                // Obtener IDs de replies
                $replyIds = array_map(fn($reply) => $reply->getId(), $replies);

                if (!empty($replyIds)) {
                    // Consulta optimizada para obtener todos los likes del usuario
                    $userReplyLikes = $replyLeafRepository->createQueryBuilder('l')
                        ->where('l.user = :user')
                        ->andWhere('l.reply IN (:replies)')
                        ->setParameter('user', $user)
                        ->setParameter('replies', $replyIds)
                        ->getQuery()
                        ->getResult();

                    // Crear mapa para búsqueda rápida
                    $likesMap = [];
                    foreach ($userReplyLikes as $like) {
                        $likesMap[$like->getReply()->getId()] = true;
                    }

                    // Serializar replies y agregar interacciones
                    $repliesData = json_decode($serializer->serialize($replies, 'json', ['groups' => 'reply']), true);

                    foreach ($repliesData as &$replyData) {
                        $replyId = $replyData['id'];
                        $replyData['user_interactions'] = [
                            'has_liked_leaf' => isset($likesMap[$replyId])
                        ];
                    }

                    return new JsonResponse($repliesData, JsonResponse::HTTP_OK);
                }
            }
        }

        // Si no hay user_id o el usuario no existe, devolver replies sin interacciones
        return new JsonResponse(
            $serializer->serialize($replies, 'json', ['groups' => 'reply']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    // En PostController.php
    #[Route('/user/{id<\d+>}', name: 'api_posts_by_user', methods: ['GET'])]
    #[OA\Get(
        tags: ['PostController'],
        summary: 'Obtiene todos los posts de un usuario ordenados por fecha.'
    )]
    public function getPostsByUser(
        int $id,
        Request $request,
        UserRepository $userRepository,
        PostRepository $postRepository,
        UserPostLeafRepository $likeLeafs,
        UserPostTreeRepository $likeTrees,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer
    ): JsonResponse {
        $user = $userRepository->find($id);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Obtener posts del usuario
        $posts = $postRepository->findBy(
            ['user' => $user],
            ['createdAt' => 'DESC']
        );

        // Obtener current_user_id opcional de los query params
        $currentUserId = $request->query->get('current_user_id');

        // Si hay current_user_id, incluir las interacciones del usuario actual
        if ($currentUserId) {
            $currentUser = $userRepository->find($currentUserId);

            if ($currentUser) {
                // Obtener todas las interacciones del usuario de una vez
                $postIds = array_map(fn($post) => $post->getId(), $posts);

                if (!empty($postIds)) {
                    // Consultas optimizadas para obtener todas las interacciones
                    $userLeafLikes = $likeLeafs->createQueryBuilder('l')
                        ->where('l.user = :user')
                        ->andWhere('l.post IN (:posts)')
                        ->setParameter('user', $currentUser)
                        ->setParameter('posts', $postIds)
                        ->getQuery()
                        ->getResult();

                    $userTreeLikes = $likeTrees->createQueryBuilder('t')
                        ->where('t.user = :user')
                        ->andWhere('t.post IN (:posts)')
                        ->setParameter('user', $currentUser)
                        ->setParameter('posts', $postIds)
                        ->getQuery()
                        ->getResult();

                    $repostRepository = $entityManager->getRepository(UserRepost::class);
                    $userReposts = $repostRepository->createQueryBuilder('r')
                        ->where('r.user = :user')
                        ->andWhere('r.post IN (:posts)')
                        ->setParameter('user', $currentUser)
                        ->setParameter('posts', $postIds)
                        ->getQuery()
                        ->getResult();

                    $savedPostsRepository = $entityManager->getRepository(\App\Entity\SavedPosts::class);
                    $userSavedPosts = $savedPostsRepository->createQueryBuilder('s')
                        ->where('s.user = :user')
                        ->andWhere('s.post IN (:posts)')
                        ->setParameter('user', $currentUser)
                        ->setParameter('posts', $postIds)
                        ->getQuery()
                        ->getResult();

                    // Crear mapas para búsqueda rápida
                    $leafLikesMap = [];
                    foreach ($userLeafLikes as $like) {
                        $leafLikesMap[$like->getPost()->getId()] = true;
                    }

                    $treeLikesMap = [];
                    foreach ($userTreeLikes as $like) {
                        $treeLikesMap[$like->getPost()->getId()] = true;
                    }

                    $repostsMap = [];
                    foreach ($userReposts as $repost) {
                        $repostsMap[$repost->getPost()->getId()] = true;
                    }

                    $savedPostsMap = [];
                    foreach ($userSavedPosts as $saved) {
                        $savedPostsMap[$saved->getPost()->getId()] = true;
                    }

                    // Serializar posts y agregar interacciones
                    $postsData = json_decode($serializer->serialize($posts, 'json', ['groups' => 'post']), true);

                    foreach ($postsData as &$postData) {
                        $postId = $postData['id'];
                        $postData['user_interactions'] = [
                            'has_liked_leaf' => isset($leafLikesMap[$postId]),
                            'has_liked_tree' => isset($treeLikesMap[$postId]),
                            'has_reposted' => isset($repostsMap[$postId]),
                            'has_saved' => isset($savedPostsMap[$postId])
                        ];
                    }

                    return new JsonResponse($postsData, JsonResponse::HTTP_OK);
                }
            }
        }

        return new JsonResponse(
            $serializer->serialize($posts, 'json', ['groups' => 'post']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }
}
