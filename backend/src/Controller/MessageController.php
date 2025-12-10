<?php

namespace App\Controller;

use App\Entity\Conversation;
use App\Entity\Message;
use App\Repository\ConversationRepository;
use App\Repository\MessageRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use OpenApi\Attributes as OA;

#[Route('/api/messages', name: 'api_messages_')]
final class MessageController extends AbstractController
{
    #[Route('/conversations/{userId<\d+>}', name: 'user_conversations', methods: ['GET'])]
    #[OA\Get(
        tags: ['MessageController'],
        summary: 'Get all conversations for a user'
    )]
    public function getUserConversations(
        int $userId,
        UserRepository $userRepo,
        ConversationRepository $conversationRepo,
        MessageRepository $messageRepo,
        SerializerInterface $serializer
    ): JsonResponse {
        $user = $userRepo->find($userId);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $conversations = $conversationRepo->findUserConversations($userId);

        // Enrich conversations with last message and other user info
        $conversationsData = [];
        foreach ($conversations as $conversation) {
            $otherUser = $conversation->getOtherUser($user);
            $lastMessage = $messageRepo->findLastMessage($conversation->getId());

            $conversationsData[] = [
                'id' => $conversation->getId(),
                'other_user' => [
                    'id' => $otherUser->getId(),
                    'username' => $otherUser->getUsername(),
                    'photo_url' => $otherUser->getPhotoURL(),
                ],
                'last_message' => $lastMessage ? [
                    'content' => $lastMessage->getContent(),
                    'created_at' => $lastMessage->getCreatedAt()->format('Y-m-d H:i:s'),
                    'sender_id' => $lastMessage->getSender()->getId(),
                    'is_read' => $lastMessage->isRead(),
                ] : null,
                'last_message_at' => $conversation->getLastMessageAt()?->format('Y-m-d H:i:s'),
                'created_at' => $conversation->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }

        return new JsonResponse($conversationsData, JsonResponse::HTTP_OK);
    }

    #[Route('/conversation/{conversationId<\d+>}', name: 'conversation_messages', methods: ['GET'])]
    #[OA\Get(
        tags: ['MessageController'],
        summary: 'Get all messages in a conversation'
    )]
    public function getConversationMessages(
        int $conversationId,
        ConversationRepository $conversationRepo,
        MessageRepository $messageRepo,
        SerializerInterface $serializer
    ): JsonResponse {
        $conversation = $conversationRepo->find($conversationId);
        if (!$conversation) {
            return new JsonResponse(['error' => 'Conversation not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $messages = $messageRepo->findByConversation($conversationId);

        return new JsonResponse(
            $serializer->serialize($messages, 'json', ['groups' => 'message']),
            JsonResponse::HTTP_OK,
            [],
            true
        );
    }

    #[Route('/send', name: 'send_message', methods: ['POST'])]
    #[OA\Post(
        tags: ['MessageController'],
        summary: 'Send a new message',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                properties: [
                    new OA\Property(property: 'sender_id', type: 'integer', example: 1),
                    new OA\Property(property: 'receiver_id', type: 'integer', example: 2),
                    new OA\Property(property: 'content', type: 'string', example: 'Hello!')
                ]
            )
        )
    )]
    public function sendMessage(
        Request $request,
        UserRepository $userRepo,
        ConversationRepository $conversationRepo,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator,
        SerializerInterface $serializer
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['sender_id']) || !isset($data['receiver_id']) || !isset($data['content'])) {
            return new JsonResponse(
                ['error' => 'sender_id, receiver_id, and content are required'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $sender = $userRepo->find($data['sender_id']);
        $receiver = $userRepo->find($data['receiver_id']);

        if (!$sender || !$receiver) {
            return new JsonResponse(['error' => 'Sender or receiver not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($sender->getId() === $receiver->getId()) {
            return new JsonResponse(['error' => 'Cannot send message to yourself'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Find or create conversation
        $conversation = $conversationRepo->findConversationBetweenUsers($sender->getId(), $receiver->getId());

        if (!$conversation) {
            $conversation = new Conversation();
            $conversation->setUser1($sender);
            $conversation->setUser2($receiver);
            $conversation->setCreatedAt(new \DateTimeImmutable());
            $conversation->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->persist($conversation);
        }

        // Create message
        $message = new Message();
        $message->setConversation($conversation);
        $message->setSender($sender);
        $message->setContent($data['content']);
        $message->setIsRead(false);
        $message->setCreatedAt(new \DateTimeImmutable());
        $message->setUpdatedAt(new \DateTimeImmutable());

        // Validate message
        $errors = $validator->validate($message);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Update conversation last message time
        $conversation->setLastMessageAt(new \DateTime());
        $conversation->setUpdatedAt(new \DateTimeImmutable());

        $entityManager->persist($message);
        $entityManager->flush();

        return new JsonResponse(
            $serializer->serialize($message, 'json', ['groups' => 'message']),
            JsonResponse::HTTP_CREATED,
            [],
            true
        );
    }

    #[Route('/{messageId<\d+>}/read', name: 'mark_read', methods: ['PUT'])]
    #[OA\Put(
        tags: ['MessageController'],
        summary: 'Mark a message as read'
    )]
    public function markAsRead(
        int $messageId,
        MessageRepository $messageRepo,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $message = $messageRepo->find($messageId);

        if (!$message) {
            return new JsonResponse(['error' => 'Message not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        if (!$message->isRead()) {
            $message->setIsRead(true);
            $message->setReadAt(new \DateTime());
            $message->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->flush();
        }

        return new JsonResponse(['message' => 'Message marked as read'], JsonResponse::HTTP_OK);
    }

    #[Route('/conversation-with/{userId<\d+>}/{otherUserId<\d+>}', name: 'get_or_create_conversation', methods: ['GET'])]
    #[OA\Get(
        tags: ['MessageController'],
        summary: 'Get or create a conversation between two users'
    )]
    public function getOrCreateConversation(
        int $userId,
        int $otherUserId,
        UserRepository $userRepo,
        ConversationRepository $conversationRepo,
        MessageRepository $messageRepo,
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer
    ): JsonResponse {
        $user = $userRepo->find($userId);
        $otherUser = $userRepo->find($otherUserId);

        if (!$user || !$otherUser) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($userId === $otherUserId) {
            return new JsonResponse(['error' => 'Cannot create conversation with yourself'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Find existing conversation
        $conversation = $conversationRepo->findConversationBetweenUsers($userId, $otherUserId);

        // Create new conversation if it doesn't exist
        if (!$conversation) {
            $conversation = new Conversation();
            $conversation->setUser1($user);
            $conversation->setUser2($otherUser);
            $conversation->setCreatedAt(new \DateTimeImmutable());
            $conversation->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->persist($conversation);
            $entityManager->flush();

            return new JsonResponse([
                'conversation_id' => $conversation->getId(),
                'messages' => [],
                'other_user' => [
                    'id' => $otherUser->getId(),
                    'username' => $otherUser->getUsername(),
                    'photo_url' => $otherUser->getPhotoURL(),
                ],
                'created' => true,
            ], JsonResponse::HTTP_CREATED);
        }

        // Get messages for existing conversation
        $messages = $messageRepo->findByConversation($conversation->getId());

        return new JsonResponse([
            'conversation_id' => $conversation->getId(),
            'messages' => json_decode($serializer->serialize($messages, 'json', ['groups' => 'message']), true),
            'other_user' => [
                'id' => $otherUser->getId(),
                'username' => $otherUser->getUsername(),
                'photo_url' => $otherUser->getPhotoURL(),
            ],
            'created' => false,
        ], JsonResponse::HTTP_OK);
    }
}
