<?php

namespace App\Repository;

use App\Entity\Notification;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Notification>
 */
class NotificationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Notification::class);
    }

    /**
     * Encuentra todas las notificaciones de un usuario ordenadas por fecha
     */
    public function findByUser(User $user): array
    {
        return $this->createQueryBuilder('n')
            ->where('n.user = :user')
            ->setParameter('user', $user)
            ->orderBy('n.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Cuenta las notificaciones no leídas de un usuario
     */
    public function countUnreadByUser(User $user): int
    {
        return $this->createQueryBuilder('n')
            ->select('COUNT(n.id)')
            ->where('n.user = :user')
            ->andWhere('n.is_read = :isRead')
            ->setParameter('user', $user)
            ->setParameter('isRead', false)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Marca todas las notificaciones de un usuario como leídas
     */
    public function markAllAsReadByUser(User $user): int
    {
        return $this->createQueryBuilder('n')
            ->update()
            ->set('n.is_read', ':isRead')
            ->set('n.updatedAt', ':updatedAt')
            ->where('n.user = :user')
            ->andWhere('n.is_read = :currentRead')
            ->setParameter('isRead', true)
            ->setParameter('currentRead', false)
            ->setParameter('user', $user)
            ->setParameter('updatedAt', new \DateTimeImmutable())
            ->getQuery()
            ->execute();
    }
}
