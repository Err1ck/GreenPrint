<?php

namespace App\Entity;

use App\Entity\Trait\TimestampableTrait;
use App\Repository\HashtagRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: HashtagRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Hashtag
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['hashtag', 'trending'])]
    private ?int $id = null;

    #[ORM\Column(length: 100, unique: true)]
    #[Groups(['hashtag', 'trending'])]
    private ?string $tag = null;

    #[ORM\Column]
    #[Groups(['hashtag', 'trending'])]
    private ?int $count = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTag(): ?string
    {
        return $this->tag;
    }

    public function setTag(string $tag): static
    {
        $this->tag = $tag;
        return $this;
    }

    public function getCount(): ?int
    {
        return $this->count;
    }

    public function setCount(int $count): static
    {
        $this->count = $count;
        return $this;
    }

    public function incrementCount(): static
    {
        $this->count++;
        return $this;
    }
}
