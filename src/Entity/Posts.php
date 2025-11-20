<?php

namespace App\Entity;

use App\Repository\PostsRepository;
use App\Entity\User;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PostsRepository::class)]
class Posts
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $username = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $leaf = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $photo = null;

    #[ORM\Column]
    private ?\DateTimeInterface $fecha_publicacion = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $contenido = null;

    public function __construct()
    {
        $this->leaf = '';
        $this->fecha_publicacion = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getLeaf(): ?string
    {
        return $this->leaf;
    }

    public function setLeaf(?string $leaf): static
    {
        $this->leaf = $leaf;
        return $this;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(?string $photo): static
    {
        $this->photo = $photo;
        return $this;
    }

    public function getFechaPublicacion(): ?\DateTimeInterface
    {
        return $this->fecha_publicacion;
    }

    public function setFechaPublicacion(\DateTimeInterface $fecha_publicacion): static
    {
        $this->fecha_publicacion = $fecha_publicacion;
        return $this;
    }

    public function getContenido(): ?string
    {
        return $this->contenido;
    }

    public function setContenido(string $contenido): static
    {
        $this->contenido = $contenido;
        return $this;
    }

    public function getUsername(): ?User
    {
        return $this->username;
    }

    public function setUseranme(User $username): static
    {
        $this->username = $username;
        return $this;
    }
}