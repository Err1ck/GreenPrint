<?php

namespace App\Repository;

use App\Entity\Hashtag;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Hashtag>
 */
class HashtagRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Hashtag::class);
    }

    /**
     * Get trending hashtags ordered by count
     * @return Hashtag[]
     */
    public function findTrending(int $limit = 5): array
    {
        return $this->createQueryBuilder('h')
            ->orderBy('h.count', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
