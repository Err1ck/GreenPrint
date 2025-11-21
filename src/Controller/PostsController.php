<?php

namespace App\Controller;

use App\Entity\Posts;
use App\Form\PostsType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;

final class PostsController extends AbstractController
{
    #[Route('/Registrar-Posts', name: 'RegistrarPosts')]
    public function index(Request $request, EntityManagerInterface $em): Response
    {
        $post = new Posts();
        $form = $this->createForm(PostsType::class, $post);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
            $user = $this->getUser();
            $post->setUser($user);

            $em->persist($post);
            $em->flush();

            return $this->redirectToRoute('/home');
        }

        return $this->render('posts/index.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}