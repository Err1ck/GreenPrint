<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig');
    }

    #[Route('/home', name: 'app_home')]
    public function home(): Response
    {
        return $this->render('home/home.html.twig');
    }
    #[Route('/cartera', name: 'app_cartera')]
    public function cartera(): Response
    {
        return $this->render('home/cartera.html.twig');
    }
    #[Route('/comunidades', name: 'app_comunidades')]
    public function comunidades(): Response
    {
        return $this->render('home/comunidades.html.twig');
    }
    #[Route('/loginTest', name: 'app_loginTest')]
    public function loginTest(): Response
    {
        return $this->render('home/loginTest.html.twig');
    }
    #[Route('/perfil', name: 'app_perfil')]
    public function perfil(): Response
    {
        return $this->render('home/perfil.html.twig');
    }
    #[Route('/tendencias', name: 'app_tendencias')]
    public function tendencias(): Response
    {
        return $this->render('home/tendencias.html.twig');
    }
}
