<?php

namespace App\Repository;

use App\Entity\Transaction;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class TransactionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Transaction::class);
    }

    /**
     * Obtener últimas transacciones de un wallet
     */
    public function findRecentByWallet(int $walletId, int $limit = 20): array
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.wallet = :walletId')
            ->setParameter('walletId', $walletId)
            ->orderBy('t.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}
