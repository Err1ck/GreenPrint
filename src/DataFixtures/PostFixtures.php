<?php

namespace App\DataFixtures;

use App\Entity\Post;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Faker\Factory as FakerFactory;

class PostFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {

        $faker = FakerFactory::create();

        // Crear un usuario para asociarlo a los posts
        $user = new User();
        $user->setUsername('admin');
        $user->setEmail('admin@example.com');
        $user->setPassword(
            $this->passwordHasher->hashPassword($user, 'password123')
        );

        $manager->persist($user);

        // Crear varios posts
        for ($i = 1; $i <= 10; $i++) {
            $post = new Post();
            $post->setUser($user);
            $post->setTitle("Título del post $i");
            $post->setLeaf($faker->numberBetween(0, 2000));
            $post->setImage("foto$i.jpg");
            $post->setContent("Contenido de ejemplo del post número $i");

            $manager->persist($post);
        }

        $manager->flush();
    }
}
