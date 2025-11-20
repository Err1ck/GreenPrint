<?php

namespace App\Controller;

use App\Entity\Posts;
use App\Form\PostsType;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// final class PostsController extends AbstractController
// {
//     #[Route('/Registrar-Posts', name: 'RegistrarPosts')]
//     public function index(Request $request): Response
//     {
//         $post = new Posts();
//         $form = $this->createForm(PostsType::class, $post);
//         $form->handleRequest($request);

//         if ($form->isSubmitted() && $form->isValid()) {
//             $user = $this->getUser();
//             $post->setUser($user);

//             $em = $this->getDoctrine()->getManager();
//             $em->persist($post);
//             $em->flush();

//             return $this->redirectToRoute('dashboard');
//         }

//         return $this->render('posts/index.html.twig', [
//             'form' => $form->createView(),
//         ]);
//     }
// }