<?php

namespace App\Repository;

use App\Entity\Conversation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Conversation>
 */
class ConversationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Conversation::class);
    }

    /**
     * Find a conversation between two users
     */
    public function findConversationBetweenUsers(int $user1Id, int $user2Id): ?Conversation
    {
        return $this->createQueryBuilder('c')
            ->where('(c.user1 = :user1 AND c.user2 = :user2) OR (c.user1 = :user2 AND c.user2 = :user1)')
            ->setParameter('user1', $user1Id)
            ->setParameter('user2', $user2Id)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Find all conversations for a user, ordered by last message
     */
    public function findUserConversations(int $userId): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.user1 = :userId OR c.user2 = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('c.last_message_at', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
