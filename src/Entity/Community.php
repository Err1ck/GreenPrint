<?php

namespace App\Entity;

use App\Repository\CommunityRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CommunityRepository::class)]
class Community
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
 
    #[ORM\Column(length:255, nullable: true)]
    private ?int $name = null;

    #[ORM\Column]
    private ?int $follower_count = null;

    #[ORM\Column]
    private ?int $member_count = null;



    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }


    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getFollowerCount(): ?int
    {
        return $this->follower_count;
    }

    public function setFollowerCount(int $follower_count): static
    {
        $this->follower_count = $follower_count;

        return $this;
    }

    public function getMemberCount(): ?int
    {
        return $this->member_count;
    }

    public function setMemberCount(int $member_count): static
    {
        $this->member_count = $member_count;

        return $this;
    }


}
