<?php

namespace App\Entity;

use App\Entity\Trait\TimestampableTrait;
use App\Repository\CommunityRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CommunityRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Community
{

    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['community', 'member'])]
    private ?int $id = null;
 
    #[ORM\Column(length:255, nullable: true)]
    #[Groups(['community', 'member'])]
    private ?string $name = null;

    #[ORM\Column]
    #[Groups(['community'])]
    private ?int $follower_count = null;

    #[ORM\Column]
    #[Groups(['community'])]
    private ?int $member_count = null;

        /**
     * @var string profile photo url
     */
    #[ORM\Column(length: 180, nullable: true)]
    #[Groups(['community'])]
    private ?string $photo_url = null;

    /**
     * @var string banner photo url
     */
    #[ORM\Column(length: 180, nullable: true)]
    #[Groups(['community'])]
    private ?string $banner_url = null;

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
    public function getPhotoURL(): ?string
    {
        return $this->photo_url;
    }

    public function setPhotoURL(string $photo_url): static
    {
        $this->photo_url = $photo_url;
        return $this;
    }

    public function getBannerURL(): ?string
    {
        return $this->banner_url;
    }

    public function setBannerURL(string $banner_url): static
    {
        $this->banner_url = $banner_url;
        return $this;
    }


}
