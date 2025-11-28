<?php

namespace App\Entity;

use App\Entity\Trait\TimestampableTrait;
use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user', 'follows', 'member', 'getFollowers', 'getFollowing' , 'getMembers', 'getCommunityFollowers', 'getAllCommunityFollowers', 'post'])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Groups(['user'])]
    private ?string $email = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['user', 'follows', 'member', 'getFollowers', 'getFollowing', 'getMembers', 'getCommunityFollowers', 'getAllCommunityFollowers', 'post'])]
    private ?string $username = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    #[Groups(['user'])]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    /**
     * @var int Seguidores
     */
    #[ORM\Column]
    #[Groups(['user'])]
    private ?int $follower_count = 0;

    /**
     * @var string Biografia del perfil usuario
     */
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user'])]
    private ?string $biography = null;

    /**
     * @var int Monedas usuario
     */
    #[ORM\Column]
    #[Groups(['user'])]
    private ?int $leaf_coins_user = 0;

    /**
     * @var int Monedas comunidad
     */
    #[ORM\Column]
    #[Groups(['user'])]
    private ?int $tree_coins_community = 0;

    /**
     * Relación con Community
     */
    #[ORM\ManyToOne(targetEntity: Community::class, inversedBy: 'users')]
    #[ORM\JoinColumn(name: 'community_id', referencedColumnName: 'id', nullable: true)]
    #[Groups(['user'])]
    private ?Community $community = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static 
    {
        $this->username = $username;    
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
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

    public function getBiography(): ?string
    {
        return $this->biography;
    }

    public function setBiography(string $biography): static
    {
        $this->biography = $biography;
        return $this;
    }

    public function getLeafCoins(): ?int
    {
        return $this->leaf_coins_user;
    }

    public function setLeafCoins(int $leaf_coins_user): static
    {
        $this->leaf_coins_user = $leaf_coins_user;
        return $this;
    }

    public function getTreeCoins(): ?int
    {
        return $this->tree_coins_community;
    }

    public function setTreeCoins(int $tree_coins_community): static
    {
        $this->tree_coins_community = $tree_coins_community;
        return $this;
    }

    public function getCommunity(): ?Community
    {
        return $this->community;
    }

    public function setCommunity(?Community $community): static
    {
        $this->community = $community;
        return $this;
    }

    /**
     * Ensure the session doesn't contain actual password hashes by CRC32C-hashing them, as supported since Symfony 7.3.
     */
    public function __serialize(): array
    {
        $data = (array) $this;
        $data["\0" . self::class . "\0password"] = hash('crc32c', $this->password);
        return $data;
    }

    #[\Deprecated]
    public function eraseCredentials(): void
    {
        // @deprecated, to be removed when upgrading to Symfony 8
    }
}