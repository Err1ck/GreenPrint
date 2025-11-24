<?php

namespace App\Entity;

use App\Entity\Trait\TimestampableTrait;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'user_follows')]
#[ORM\UniqueConstraint(columns: ['user_id', 'following_user_id'])]
class UserFollows
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: "user_id", referencedColumnName: "id", onDelete: "CASCADE", nullable: false)]
    #[Groups(['follows'])]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: "following_user_id", referencedColumnName: "id", onDelete: "CASCADE", nullable: false)]
    #[Groups(['follows'])]
    private ?User $followingUser = null;

    public function getUser(): ?User
    {
        return $this->user;
    }
    public function setUser(User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getFollowingUser(): ?User
    {
        return $this->followingUser;
    }
    public function setFollowingUser(User $followingUser): static
    {
        $this->followingUser = $followingUser;
        return $this;
    }
}
