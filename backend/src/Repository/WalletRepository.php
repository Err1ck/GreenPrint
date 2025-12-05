<?php

namespace App\Repository;

use App\Entity\Wallet;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class WalletRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Wallet::class);
    }

    /**
     * Buscar wallet por tipo y ownerId
     */
    public function findByOwner(string $ownerType, int $ownerId): ?Wallet
    {
        return $this->findOneBy([
            'ownerType' => $ownerType,
            'ownerId' => $ownerId,
        ]);
    }
}
