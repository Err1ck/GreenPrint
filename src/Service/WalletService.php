<?php

namespace App\Service;

use App\Entity\Wallet;
use App\Entity\Transaction;
use App\Repository\WalletRepository;
use Doctrine\ORM\EntityManagerInterface;

class WalletService
{
    public function __construct(
        private EntityManagerInterface $em,
        private WalletRepository $walletRepo
    ) {}

    /**
     * Obtener o crear wallet para un usuario o comunidad
     */
    public function getWallet(string $ownerType, int $ownerId): Wallet
    {
        $wallet = $this->walletRepo->findByOwner($ownerType, $ownerId);

        if (!$wallet) {
            $wallet = new Wallet();
            $wallet->setOwnerType($ownerType);
            $wallet->setOwnerId($ownerId);
            $this->em->persist($wallet);
            $this->em->flush();
        }

        return $wallet;
    }

    /**
     * Añadir Leaf Coins a la wallet de un usuario
     */
    public function addLeafCoinsToUser(Wallet $userWallet, float $amount, string $origin, ?int $originId = null): void
    {
        $userWallet->setLeafCoinsUser(number_format((float)$userWallet->getLeafCoinsUser() + $amount, 2, '.', ''));

        $transaction = new Transaction();
        $transaction->setWallet($userWallet);
        $transaction->setAmount(number_format($amount, 2, '.', ''));
        $transaction->setType("earn_leaf");
        $transaction->setOrigin($origin);
        $transaction->setOriginId($originId);

        $this->em->persist($transaction);
        $this->em->flush();
    }

    /**
     * Añadir Tree Coins a la wallet de la comunidad
     */
    public function addTreeCoinsToCommunity(Wallet $communityWallet, float $amount, string $origin, ?int $originId = null): void
    {
        $communityWallet->setTreeCoinsCommunity(number_format((float)$communityWallet->getTreeCoinsCommunity() + $amount, 2, '.', ''));

        $transaction = new Transaction();
        $transaction->setWallet($communityWallet);
        $transaction->setAmount(number_format($amount, 2, '.', ''));
        $transaction->setType("earn_tree");
        $transaction->setOrigin($origin);
        $transaction->setOriginId($originId);

        $this->em->persist($transaction);
        $this->em->flush();
    }

    /**
     * Transferir monedas de un usuario a la comunidad (Tree Coins)
     */
    public function contributeToCommunity(Wallet $userWallet, Wallet $communityWallet, float $amount): void
    {
        $userBalance = (float)$userWallet->getLeafCoinsUser();
        if ($userBalance < $amount) {
            throw new \Exception("Saldo insuficiente en Leaf Coins");
        }

        // Restar al usuario
        $userWallet->setLeafCoinsUser(number_format($userBalance - $amount, 2, '.', ''));

        // Sumar a la comunidad
        $communityWallet->setTreeCoinsCommunity(number_format((float)$communityWallet->getTreeCoinsCommunity() + $amount, 2, '.', ''));

        // Registrar transacciones
        $tUser = new Transaction();
        $tUser->setWallet($userWallet)
            ->setAmount(number_format($amount, 2, '.', ''))
            ->setType("donation_leaf")
            ->setOrigin("user_to_community");

        $tCommunity = new Transaction();
        $tCommunity->setWallet($communityWallet)
            ->setAmount(number_format($amount, 2, '.', ''))
            ->setType("receive_tree")
            ->setOrigin("user_to_community");

        $this->em->persist($tUser);
        $this->em->persist($tCommunity);
        $this->em->flush();
    }
}
