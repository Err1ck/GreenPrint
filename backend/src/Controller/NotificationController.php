<?php

namespace App\Controller;

use App\Repository\NotificationRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use OpenApi\Attributes as OA;

#[Route('/api/notifications', name: 'api_notifications_')]
final class NotificationController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    #[OA\Get(
        tags: ['NotificationController'],
        summary: 'Obtiene todas las notificaciones del usuario.'
    )]
    public function index(
        Request $request,
        NotificationRepository $notificationRepository,
        UserRepository $userRepository
    ): JsonResponse {
        // Obtener user_id de los query params
        $userId = $request->query->get('user_id');

        if (!$userId) {
            return new JsonResponse(
                ['error' => 'El parámetro user_id es requerido.'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user = $userRepository->find($userId);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $notifications = $notificationRepository->findByUser($user);

        // Asegurar que $notifications es un array
        if (!is_array($notifications)) {
            $notifications = [];
        }

        // Serializar manualmente para evitar referencias circulares
        $notificationsData = [];
        foreach ($notifications as $notification) {
            $actor = $notification->getActor();
            $post = $notification->getPost();

            $notificationsData[] = [
                'id' => $notification->getId(),
                'type' => $notification->getType(),
                'message' => $notification->getMessage(),
                'is_read' => $notification->isRead(),
                'created_at' => $notification->getCreatedAt()->format('Y-m-d H:i:s'),
                'actor' => $actor ? [
                    'id' => $actor->getId(),
                    'username' => $actor->getUsername(),
                    'photo_url' => $actor->getPhotoURL(),
                ] : null,
                'post' => $post ? [
                    'id' => $post->getId(),
                ] : null,
            ];
        }

        return new JsonResponse($notificationsData, JsonResponse::HTTP_OK);
    }

    #[Route('/unread-count', name: 'unread_count', methods: ['GET'])]
    #[OA\Get(
        tags: ['NotificationController'],
        summary: 'Obtiene el número de notificaciones no leídas del usuario.'
    )]
    public function unreadCount(
        Request $request,
        NotificationRepository $notificationRepository,
        UserRepository $userRepository
    ): JsonResponse {
        $userId = $request->query->get('user_id');

        if (!$userId) {
            return new JsonResponse(
                ['error' => 'El parámetro user_id es requerido.'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user = $userRepository->find($userId);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $count = $notificationRepository->countUnreadByUser($user);

        return new JsonResponse(
            ['unread_count' => $count],
            JsonResponse::HTTP_OK
        );
    }

    #[Route('/{id<\d+>}/mark-read', name: 'mark_read', methods: ['PUT'])]
    #[OA\Put(
        tags: ['NotificationController'],
        summary: 'Marca una notificación como leída.'
    )]
    public function markAsRead(
        int $id,
        NotificationRepository $notificationRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $notification = $notificationRepository->find($id);

        if (!$notification) {
            return new JsonResponse(
                ['error' => 'Notificación no encontrada.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $notification->setIsRead(true);
        $notification->setUpdatedAt(new \DateTimeImmutable());
        $entityManager->flush();

        return new JsonResponse(
            ['message' => 'Notificación marcada como leída.'],
            JsonResponse::HTTP_OK
        );
    }

    #[Route('/mark-all-read', name: 'mark_all_read', methods: ['PUT'])]
    #[OA\Put(
        tags: ['NotificationController'],
        summary: 'Marca todas las notificaciones del usuario como leídas.'
    )]
    public function markAllAsRead(
        Request $request,
        NotificationRepository $notificationRepository,
        UserRepository $userRepository
    ): JsonResponse {
        $userId = $request->query->get('user_id');

        if (!$userId) {
            return new JsonResponse(
                ['error' => 'El parámetro user_id es requerido.'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $user = $userRepository->find($userId);

        if (!$user) {
            return new JsonResponse(
                ['error' => 'Usuario no encontrado.'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        $updatedCount = $notificationRepository->markAllAsReadByUser($user);

        return new JsonResponse(
            [
                'message' => 'Todas las notificaciones han sido marcadas como leídas.',
                'updated_count' => $updatedCount
            ],
            JsonResponse::HTTP_OK
        );
    }
}
