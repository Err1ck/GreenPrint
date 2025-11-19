<?php

namespace App\Entity;


use App\Repository\PostsRepository;
use App\Entity\User;
use DateTime;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

// #[ORM\Entity(repositoryClass: PostsRepository::class)]
// class Posts
// {
//     #[ORM\Id]
//     #[ORM\GeneratedValue]
//     #[ORM\Column]
//     private ?int $id = null;

//     #[ORM\Column(length: 255)]
//     private ?string $title = null;

//     #[ORM\Column(length: 255, nullable: true)]
//     private ?string $leaf = null;

//     #[ORM\Column(length: 255 , nullable: true)]
//     private ?string $photo = null;

//     #[ORM\Column]
//     private ?\DateTime $fecha_publicacion = null;

//     #[ORM\Column(type: Types::TEXT)]
//     private ?string $contenido = null;

//     #[ORM\ManyToOne(targetEntity: User::class)]
//     #[ORM\JoinColumn(nullable: false)]
//     private ?User $user = null;


//     // Constructor
//     public function __construct()
//     {
//         $this->leaf ='';
//         $this->fecha_publicacion = new \DateTime;
//     }


//     public function getId(): ?int
//     {
//         return $this->id;
//     }

//     public function setId(string $id): static
//     {
//         $this->id = $id;

//         return $this;
//     }

//     public function getTitle(): ?string
//     {
//         return $this->title;
//     }

//     public function setTitle(string $title): static
//     {
//         $this->title = $title;

//         return $this;
//     }

//     public function getLeaf(): ?string
//     {
//         return $this->leaf;
//     }

//     public function setLeaf(string $leaf): static
//     {
//         $this->leaf = $leaf;

//         return $this;
//     }

//     public function getphoto(): ?string
//     {
//         return $this->photo;
//     }

//     public function setphoto(string $photo): static
//     {
//         $this->photo = $photo;

//         return $this;
//     }

//     public function getFechaPublicacion(): ?\DateTime
//     {
//         return $this->fecha_publicacion;
//     }

//     public function setFechaPublicacion(\DateTime $fecha_publicacion): static
//     {
//         $this->fecha_publicacion = $fecha_publicacion;

//         return $this;
//     }

//     public function getContenido(): ?string
//     {
//         return $this->contenido;
//     }

//     public function setContenido(string $contenido): static
//     {
//         $this->contenido = $contenido;

//         return $this;
//     }

//     public function getUser(): ?User
//     {
//         return $this->user;
//     }

//     public function setUser(User $user): static
//     {
//         $this->user = $user;
//         return $this;
//     }


// }

