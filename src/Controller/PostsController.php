<?php

namespace App\Controller;

use App\Entity\Posts;
use App\Form\PostsType;
use App\Repository\PostsRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Serializer\SerializerInterface;

final class PostsController extends AbstractController
{
    /**
     * Obtiene todos los posts en formato JSON
     * URL: http://127.0.0.1:8000/api/posts
     */
    #[Route('/api/posts', name: 'api_posts_list', methods: ['GET'])]
    public function index(PostsRepository $postsRepository, SerializerInterface $serializer): JsonResponse
    {
        $all = $postsRepository->findAll();

        return new JsonResponse(
            $serializer->serialize($all, 'json', ['groups' => 'posts']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    /**
     * Formulario para registrar un nuevo post
     * URL: http://127.0.0.1:8000/registrar-posts
     */
    #[Route('/registrar-posts', name: 'RegistrarPosts', methods: ['GET', 'POST'])]
    public function registrar(Request $request, EntityManagerInterface $em): Response
    {
        $post = new Posts();
        $form = $this->createForm(PostsType::class, $post);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Verifica que el usuario esté autenticado
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
            
            // Asigna el usuario actual al post
            $user = $this->getUser();
            $post->setUser($user);

            // Guarda el post en la base de datos
            $em->persist($post);
            $em->flush();

            // Mensaje de confirmación
            $this->addFlash('success', 'Post creado correctamente');

            // Redirige a la lista de posts (cambia 'api_posts_list' si quieres otra ruta)
            return $this->redirectToRoute('/home');
        }

        return $this->render('posts/index.html.twig', [
            'form' => $form,
        ]);
    }
}