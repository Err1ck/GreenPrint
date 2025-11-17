<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// final class PostsController extends AbstractController
// {
//     #[Route('/Registrar-Posts', name: 'RegistrarPosts')]
//     public function index(Request $request)
//     {
//         $post = new Posts();
//         $form = $this->createForm(PostsType::class, $post);
//         $form->handleRequest($request);
//         if ($form->isSubmitted() && $form->isValid()) {

//         return $this->render('posts/index.html.twig', [
//             'controller_name' => 'PostsController',
//         ]);
//     }
// }
