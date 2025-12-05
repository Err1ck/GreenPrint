<?php

namespace App\Entity;

use App\Entity\Trait\TimestampableTrait;
use App\Repository\PostReplyRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PostReplyRepository::class)]
#[ORM\Table(name: 'post_replies')]
#[ORM\UniqueConstraint(columns: ['user_id', 'post_id'])]
class PostReply
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['reply'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user_id', nullable: false)]
    #[Groups(['reply'])]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: Post::class)]
    #[ORM\JoinColumn(name: "post_id", referencedColumnName: "id", onDelete: "CASCADE", nullable: false)]
    #[Groups(['reply'])]
    private ?Post $post = null;

    #[ORM\Column]
    #[Groups(['reply'])]
    private ?int $leaf = 0;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['reply'])]
    private ?string $image = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['reply'])]
    private ?string $content = null;

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

    public function getPost(): ?Post
    {
        return $this->post;
    }

    public function setPost(Post $post): static
    {
        $this->post = $post;
        return $this;
    }
}
