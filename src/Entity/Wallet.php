<?php

namespace App\Entity;

use App\Repository\WalletRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: WalletRepository::class)]
class Wallet
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // Indica si el wallet pertenece a un usuario o a una comunidad
    #[ORM\Column(length: 20)]
    private ?string $ownerType = null; // "user" | "community"

    #[ORM\Column]
    private ?int $ownerId = null;

    // LEAF COINS: monedas personales del usuario
    #[ORM\Column(type: 'decimal', precision: 12, scale: 2)]
    private string $leafCoinsUser = '0.00';

    // TREE COINS: monedas de la comunidad, donde varios usuarios pueden aportar
    #[ORM\Column(type: 'decimal', precision: 12, scale: 2)]
    private string $treeCoinsCommunity = '0.00';

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    // --------------------
    // GETTERS & SETTERS
    // --------------------

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOwnerType(): ?string
    {
        return $this->ownerType;
    }

    public function setOwnerType(string $ownerType): self
    {
        $this->ownerType = $ownerType;
        return $this;
    }

    public function getOwnerId(): ?int
    {
        return $this->ownerId;
    }

    public function setOwnerId(int $ownerId): self
    {
        $this->ownerId = $ownerId;
        return $this;
    }

    public function getLeafCoinsUser(): string
    {
        return $this->leafCoinsUser;
    }

    public function setLeafCoinsUser(string $leafCoinsUser): self
    {
        $this->leafCoinsUser = $leafCoinsUser;
        return $this;
    }

    /**
     * Sumar monedas Leaf Coins al usuario
     */
    public function addLeafCoins(float $amount): self
    {
        $this->leafCoinsUser = number_format((float)$this->leafCoinsUser + $amount, 2, '.', '');
        return $this;
    }

    public function getTreeCoinsCommunity(): string
    {
        return $this->treeCoinsCommunity;
    }

    public function setTreeCoinsCommunity(string $treeCoinsCommunity): self
    {
        $this->treeCoinsCommunity = $treeCoinsCommunity;
        return $this;
    }

    /**
     * Sumar monedas Tree Coins a la comunidad
     */
    public function addTreeCoins(float $amount): self
    {
        $this->treeCoinsCommunity = number_format((float)$this->treeCoinsCommunity + $amount, 2, '.', '');
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }
}
