<?php

namespace App\Controller;

use App\Repository\TransactionRepository;
use App\Service\WalletService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/wallet')]
class WalletController extends AbstractController
{
    public function __construct(
        private WalletService $walletService,
        private TransactionRepository $transactionRepo
    ) {}

    /**
     * Obtener la wallet y transacciones del usuario
     * Se espera recibir userId en query params o request
     */
    #[Route('/me', name: 'wallet_me', methods: ['GET'])]
    public function myWallet(Request $request): JsonResponse
    {
        // Recibir userId desde request (query o body)
        $userId = $request->query->getInt('userId'); // GET /api/wallet/me?userId=1
        if (!$userId) {
            return $this->json(['error' => 'userId no proporcionado'], 400);
        }

        // Obtener o crear wallet del usuario
        $wallet = $this->walletService->getWallet('user', $userId);

        // Obtener transacciones del usuario (Leaf Coins y contribuciones)
        $transactions = $this->transactionRepo->findBy(
            ['wallet' => $wallet],
            ['createdAt' => 'DESC']
        );

        // Formatear transacciones para JSON
        $transactionData = array_map(function($t) {
            return [
                'id' => $t->getId(),
                'type' => $t->getType(),
                'amount' => $t->getAmount(),
                'origin' => $t->getOrigin(),
                'originId' => $t->getOriginId(),
                'createdAt' => $t->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }, $transactions);

        // Respuesta JSON
        return $this->json([
            'wallet' => [
                'leafCoins' => $wallet->getLeafCoinsUser(),
                'treeCoins' => $wallet->getTreeCoinsCommunity(),
            ],
            'transactions' => $transactionData,
        ]);
    }
}
