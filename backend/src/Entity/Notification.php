<?php

namespace App\Entity;

use App\Entity\Trait\TimestampableTrait;
use App\Repository\NotificationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: NotificationRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ORM\Table(name: 'notifications')]
class Notification
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['notification'])]
    private ?int $id = null;

    /**
     * @var User Usuario que recibe la notificación
     */
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', onDelete: 'CASCADE', nullable: false)]
    #[Groups(['notification'])]
    private ?User $user = null;

    /**
     * @var User Usuario que generó la notificación (quien hizo like, repost, etc.)
     */
    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'actor_id', referencedColumnName: 'id', onDelete: 'CASCADE', nullable: false)]
    #[Groups(['notification'])]
    private ?User $actor = null;

    /**
     * @var Post Post relacionado con la notificación (nullable)
     */
    #[ORM\ManyToOne(targetEntity: Post::class)]
    #[ORM\JoinColumn(name: 'post_id', referencedColumnName: 'id', onDelete: 'CASCADE', nullable: true)]
    #[Groups(['notification'])]
    private ?Post $post = null;

    /**
     * @var string Tipo de notificación: like_leaf, like_tree, repost, reply
     */
    #[ORM\Column(length: 50)]
    #[Groups(['notification'])]
    private ?string $type = null;

    /**
     * @var string Mensaje de la notificación
     */
    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['notification'])]
    private ?string $message = null;

    /**
     * @var bool Si la notificación ha sido leída
     */
    #[ORM\Column(type: 'boolean')]
    #[Groups(['notification'])]
    private bool $is_read = false;

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

    public function getActor(): ?User
    {
        return $this->actor;
    }

    public function setActor(User $actor): static
    {
        $this->actor = $actor;
        return $this;
    }

    public function getPost(): ?Post
    {
        return $this->post;
    }

    public function setPost(?Post $post): static
    {
        $this->post = $post;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;
        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;
        return $this;
    }

    public function isRead(): bool
    {
        return $this->is_read;
    }

    public function setIsRead(bool $is_read): static
    {
        $this->is_read = $is_read;
        return $this;
    }
}
