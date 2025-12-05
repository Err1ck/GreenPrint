<?php

namespace App\Entity;

use App\Entity\Trait\TimestampableTrait;
use App\Repository\UserPostReplyLeafRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserPostReplyLeafRepository::class)]
#[ORM\Table(name: 'user_replies_leaves')]
class UserPostReplyLeaf
{

    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: "user_id", referencedColumnName: "id", onDelete: "CASCADE", nullable: false)]
    #[Groups(['replyLeaves'])]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: PostReply::class)]
    #[ORM\JoinColumn(name: "post_reply_id", referencedColumnName: "id", onDelete: "CASCADE", nullable: false)]
    #[Groups(['replyLeaves'])]
    private ?PostReply $reply = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getReply(): ?PostReply
    {
        return $this->reply;
    }

    public function setReply(PostReply $reply): static
    {
        $this->reply = $reply;
        return $this;
    }
}
