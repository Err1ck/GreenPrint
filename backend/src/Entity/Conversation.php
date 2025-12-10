<?php

namespace App\Entity;

use App\Entity\Trait\TimestampableTrait;
use App\Repository\ConversationRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ConversationRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ORM\Table(name: 'conversations')]
class Conversation
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['conversation', 'message'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user1_id', nullable: false)]
    #[Groups(['conversation'])]
    private ?User $user1 = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user2_id', nullable: false)]
    #[Groups(['conversation'])]
    private ?User $user2 = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups(['conversation'])]
    private ?\DateTimeInterface $last_message_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser1(): ?User
    {
        return $this->user1;
    }

    public function setUser1(User $user1): static
    {
        $this->user1 = $user1;
        return $this;
    }

    public function getUser2(): ?User
    {
        return $this->user2;
    }

    public function setUser2(User $user2): static
    {
        $this->user2 = $user2;
        return $this;
    }

    public function getLastMessageAt(): ?\DateTimeInterface
    {
        return $this->last_message_at;
    }

    public function setLastMessageAt(?\DateTimeInterface $last_message_at): static
    {
        $this->last_message_at = $last_message_at;
        return $this;
    }

    /**
     * Get the other user in the conversation
     */
    public function getOtherUser(User $currentUser): ?User
    {
        if ($this->user1->getId() === $currentUser->getId()) {
            return $this->user2;
        }
        return $this->user1;
    }
}
