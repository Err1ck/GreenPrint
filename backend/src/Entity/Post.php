<?php

namespace App\Entity;

use App\Entity\Trait\TimestampableTrait;
use App\Repository\PostRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PostRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ORM\Table(name: 'posts')]
class Post
{
    use TimestampableTrait;
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['post', 'reply', 'postTrees', 'replyLeaves', 'replyTrees'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user_id', nullable: false)]
    #[Groups(['post'])]
    private ?User $user = null;

    #[ORM\Column]
    #[Groups(['post'])]
    private ?int $leaf = 0;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['post'])]
    private ?string $image = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['post'])]
    private ?string $content = null;

    // public function __construct()
    // {
    //     $this->leaf = '';
    //     $this->fecha_publicacion = new \DateTime();
    // }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLeaf(): ?int
    {
        return $this->leaf;
    }

    public function setLeaf(?int $leaf): static
    {
        $this->leaf = $leaf;
        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;
        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;
        return $this;
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
}