<?php

// namespace App\DataFixtures;

// use App\Entity\User;
// use Doctrine\Bundle\FixturesBundle\Fixture;
// use Doctrine\Persistence\ObjectManager;
// use Faker\Factory;
// use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

// class UserFixtures extends Fixture
// {
//     private UserPasswordHasherInterface $passwordHasher;

//     public function __construct(UserPasswordHasherInterface $passwordHasher)
//     {
//         $this->passwordHasher = $passwordHasher;
//     }

//     public function load(ObjectManager $manager): void
//     {

//         $faker = Factory::create();

//         for ($i = 0; $i < 10; $i++) {
//             $user = new User();
//             $user->setEmail($faker->email);

//             // Asigna el rol de forma aleatoria
//             $roles = rand(0, 1) ? ['admin'] : ['user'];
//             $user->setRoles($roles);

//             $user->setFollowerCount($faker->numberBetween(0,2000));

//             $user->setUsername($faker->userName);
//             $user->setCreatedAt(new \DateTimeImmutable());
//             $user->setUpdatedAt(new \DateTimeImmutable());


//             $user->setPassword($this->passwordHasher->hashPassword($user, 'password123'));

//             $manager->persist($user);
//         }

//         $manager->flush();
//     }
// }
