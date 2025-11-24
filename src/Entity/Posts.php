<?php

namespace App\Entity;

use App\Entity\Trait\TimestampableTrait;
use App\Repository\PostsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PostsRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Posts
{
    use TimestampableTrait;
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['posts'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'username', nullable: false)]
    #[Groups(['posts'])]
    private ?User $user = null;

    #[ORM\Column(length: 255)]
    #[Groups(['posts'])]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['posts'])]
    private ?string $leaf = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['posts'])]
    private ?string $photo = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['posts'])]
    private ?\DateTimeInterface $fecha_publicacion = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['posts'])]
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