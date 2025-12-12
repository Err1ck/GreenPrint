<?php

namespace App\Entity;

use App\Entity\Trait\TimestampableTrait;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
#[ORM\Table(name: 'community_members')]
class CommunityMembers
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['member', 'getMembers', 'getAllCommunityFollowers'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['member', 'getMembers', 'getAllCommunityFollowers'])]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Community::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['member', 'getAllCommunityFollowers', 'community'])]
    private ?Community $community = null;

    #[ORM\Column(type: 'string', length: 20, nullable: false, options: ['default' => 'member'])]
    #[Groups(['member', 'getMembers', 'getAllCommunityFollowers', 'community'])]
    private string $role = 'member';

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

    public function getCommunity(): ?Community
    {
        return $this->community;
    }

    public function setCommunity(Community $community): static
    {
        $this->community = $community;
        return $this;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    public function setRole(string $role): static
    {
        $this->role = $role;
        return $this;
    }
}
