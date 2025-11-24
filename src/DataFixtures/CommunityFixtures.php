<?php

namespace App\DataFixtures;

use App\Entity\Community;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory as FakerFactory;

class CommunityFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = FakerFactory::create();

        for ($i = 0; $i < 10; $i++) {
            $community = new Community();
            $community->setName($faker->name);

            $community->setFollowerCount($faker->numberBetween(0, 2000));
            $community->setMemberCount($faker->numberBetween(0, 2000));

            $community->setCreatedAt(new \DateTimeImmutable());
            $community->setUpdatedAt(new \DateTimeImmutable());

            $manager->persist($community);
        }
        $manager->flush();
    }
}
