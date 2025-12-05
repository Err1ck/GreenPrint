<?php

namespace App\DataFixtures;

use App\Entity\Community;
use App\Entity\CommunityFollows;
use App\Entity\CommunityMembers;
use App\Entity\Post;
use App\Entity\PostReply;
use App\Entity\Transaction;
use App\Entity\User;
use App\Entity\UserFollows;
use App\Entity\UserPostLeaf;
use App\Entity\UserPostReplyLeaf;
use App\Entity\UserPostReplyTree;
use App\Entity\UserPostTree;
use App\Entity\UserRepost;
use App\Entity\Wallet;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        // ==================
        // 1. CREAR USUARIOS
        // ==================
        $users = [];

        // Usuario admin
        $admin = new User();
        $admin->setEmail('admin@example.com');
        $admin->setUsername('admin');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setFollowerCount(0);
        $admin->setLeafCoins(1000);
        $admin->setTreeCoins(500);
        $admin->setBiography('Administrador del sistema');
        $admin->setCreatedAt(new \DateTimeImmutable());
        $admin->setUpdatedAt(new \DateTimeImmutable());
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123'));
        $manager->persist($admin);
        $users[] = $admin;

        // Usuarios normales
        for ($i = 0; $i < 20; $i++) {
            $user = new User();
            $user->setEmail($faker->unique()->email);
            $user->setUsername($faker->unique()->userName);
            $user->setRoles(['ROLE_USER']);
            $user->setFollowerCount($faker->numberBetween(0, 500));
            $user->setLeafCoins($faker->numberBetween(0, 5000));
            $user->setTreeCoins($faker->numberBetween(0, 2000));
            // $user->setBiography($faker->optional()->sentence(10));
            $user->setCreatedAt(new \DateTimeImmutable('-' . $faker->numberBetween(1, 365) . ' days'));
            $user->setUpdatedAt(new \DateTimeImmutable());
            $user->setPassword($this->passwordHasher->hashPassword($user, 'password123'));

            $manager->persist($user);
            $users[] = $user;
        }

        $manager->flush();

        // =====================
        // 2. CREAR COMUNIDADES
        // =====================
        $communities = [];
        for ($i = 0; $i < 10; $i++) {
            $community = new Community();
            $community->setName($faker->unique()->company);
            $community->setFollowerCount($faker->numberBetween(10, 1000));
            $community->setMemberCount($faker->numberBetween(5, 50));
            // $community->setBiography($faker->paragraph(3));
            $community->setPhotoURL($faker->imageUrl(200, 200, 'business'));
            $community->setBannerURL($faker->imageUrl(1200, 400, 'business'));
            $community->setCreatedAt(new \DateTimeImmutable('-' . $faker->numberBetween(30, 365) . ' days'));
            $community->setUpdatedAt(new \DateTimeImmutable());

            // Crear wallet para la comunidad
            $wallet = new Wallet();
            $wallet->setOwnerType('community');
            $wallet->setOwnerId($i + 1); // Temporal, se actualizará después
            $wallet->setLeafCoinsUser('0.00');
            $wallet->setTreeCoinsCommunity((string)$faker->randomFloat(2, 100, 10000));
            $manager->persist($wallet);

            $manager->persist($community);
            $communities[] = $community;
        }

        $manager->flush();

        // =======================
        // 3. ASIGNAR USUARIOS A COMUNIDADES
        // =======================
        foreach ($users as $index => $user) {
            if ($index > 0 && $faker->boolean(70)) { // 70% de probabilidad
                $user->setCommunity($faker->randomElement($communities));
            }
        }

        $manager->flush();

        // =====================
        // 4. CREAR USER FOLLOWS
        // =====================
        $createdFollows = [];
        $attempts = 0;
        $maxAttempts = 100;

        while (count($createdFollows) < 50 && $attempts < $maxAttempts) {
            $follower = $faker->randomElement($users);
            $following = $faker->randomElement($users);

            $followKey = $follower->getId() . '-' . $following->getId();

            if ($follower->getId() !== $following->getId() && !in_array($followKey, $createdFollows)) {
                $userFollow = new UserFollows();
                $userFollow->setUser($follower);
                $userFollow->setFollowingUser($following);
                $userFollow->setCreatedAt(new \DateTimeImmutable('-' . $faker->numberBetween(1, 180) . ' days'));
                $userFollow->setUpdatedAt(new \DateTimeImmutable());

                $manager->persist($userFollow);
                $createdFollows[] = $followKey;
            }

            $attempts++;
        }

        $manager->flush();

        // ===========================
        // 5. CREAR COMMUNITY FOLLOWS
        // ===========================
        $createdCommunityFollows = [];
        $attempts = 0;
        $maxAttempts = 80;

        while (count($createdCommunityFollows) < 40 && $attempts < $maxAttempts) {
            $user = $faker->randomElement($users);
            $community = $faker->randomElement($communities);

            $followKey = $user->getId() . '-' . $community->getId();

            if (!in_array($followKey, $createdCommunityFollows)) {
                $communityFollow = new CommunityFollows();
                $communityFollow->setUser($user);
                $communityFollow->setCommunity($community);
                $communityFollow->setCreatedAt(new \DateTimeImmutable('-' . $faker->numberBetween(1, 180) . ' days'));
                $communityFollow->setUpdatedAt(new \DateTimeImmutable());

                $manager->persist($communityFollow);
                $createdCommunityFollows[] = $followKey;
            }

            $attempts++;
        }

        $manager->flush();

        // ===========================
        // 6. CREAR COMMUNITY MEMBERS
        // ===========================
        for ($i = 0; $i < 30; $i++) {
            $communityMember = new CommunityMembers();
            $communityMember->setUser($faker->randomElement($users));
            $communityMember->setCommunity($faker->randomElement($communities));
            $communityMember->setCreatedAt(new \DateTimeImmutable('-' . $faker->numberBetween(1, 180) . ' days'));
            $communityMember->setUpdatedAt(new \DateTimeImmutable());

            $manager->persist($communityMember);
        }

        $manager->flush();

        // ===============
        // 7. CREAR POSTS
        // ===============
        $posts = [];
        for ($i = 0; $i < 50; $i++) {
            $post = new Post();
            $post->setUser($faker->randomElement($users));
            $post->setLeaf($faker->numberBetween(0, 500));
            $post->setImage($faker->boolean(60) ? $faker->imageUrl(640, 480, 'nature') : null);
            $post->setContent($faker->paragraph($faker->numberBetween(1, 5)));
            $post->setCreatedAt(new \DateTimeImmutable('-' . $faker->numberBetween(1, 90) . ' days'));
            $post->setUpdatedAt(new \DateTimeImmutable());

            $manager->persist($post);
            $posts[] = $post;
        }

        $manager->flush();

       // ====================
// 8. CREAR POST REPLIES
// ====================
$replies = [];
$createdReplies = [];
$attempts = 0;
$maxAttempts = 160;

while (count($replies) < 80 && $attempts < $maxAttempts) {
    $user = $faker->randomElement($users);
    $post = $faker->randomElement($posts);
    
    $replyKey = $user->getId() . '-' . $post->getId();
    
    if (!in_array($replyKey, $createdReplies)) {
        $reply = new PostReply();
        $reply->setUser($user);
        $reply->setPost($post);
        $reply->setLeaf($faker->numberBetween(0, 200));
        $reply->setImage($faker->boolean(30) ? $faker->imageUrl(640, 480) : null);
        $reply->setContent($faker->sentence($faker->numberBetween(5, 20)));
        $reply->setCreatedAt(new \DateTimeImmutable('-' . $faker->numberBetween(1, 60) . ' days'));
        $reply->setUpdatedAt(new \DateTimeImmutable());
        
        $manager->persist($reply);
        $replies[] = $reply;
        $createdReplies[] = $replyKey;
    }
    
    $attempts++;
}

$manager->flush();

        // =========================
        // 9. CREAR USER POST LEAVES (likes)
        // =========================
        for ($i = 0; $i < 100; $i++) {
            $userPostLeaf = new UserPostLeaf();
            $userPostLeaf->setUser($faker->randomElement($users));
            $userPostLeaf->setPost($faker->randomElement($posts));
            $userPostLeaf->setCreatedAt(new \DateTimeImmutable('-' . $faker->numberBetween(1, 60) . ' days'));
            $userPostLeaf->setUpdatedAt(new \DateTimeImmutable());

            $manager->persist($userPostLeaf);
        }

        $manager->flush();

        // ================================
        // 10. CREAR USER POST REPLY LEAVES
        // ================================
        for ($i = 0; $i < 80; $i++) {
            $userReplyLeaf = new UserPostReplyLeaf();
            $userReplyLeaf->setUser($faker->randomElement($users));
            $userReplyLeaf->setReply($faker->randomElement($replies));
            $userReplyLeaf->setCreatedAt(new \DateTimeImmutable('-' . $faker->numberBetween(1, 60) . ' days'));
            $userReplyLeaf->setUpdatedAt(new \DateTimeImmutable());

            $manager->persist($userReplyLeaf);
        }

        $manager->flush();

        // =========================
        // 11. CREAR USER POST TREES
        // =========================
        for ($i = 0; $i < 60; $i++) {
            $userPostTree = new UserPostTree();
            $userPostTree->setUser($faker->randomElement($users));
            $userPostTree->setPost($faker->randomElement($posts));
            $userPostTree->setCreatedAt(new \DateTimeImmutable('-' . $faker->numberBetween(1, 60) . ' days'));
            $userPostTree->setUpdatedAt(new \DateTimeImmutable());

            $manager->persist($userPostTree);
        }

        $manager->flush();

        // ================================
        // 12. CREAR USER POST REPLY TREES
        // ================================
        for ($i = 0; $i < 50; $i++) {
            $userReplyTree = new UserPostReplyTree();
            $userReplyTree->setUser($faker->randomElement($users));
            $userReplyTree->setReply($faker->randomElement($replies));
            $userReplyTree->setCreatedAt(new \DateTimeImmutable('-' . $faker->numberBetween(1, 60) . ' days'));
            $userReplyTree->setUpdatedAt(new \DateTimeImmutable());

            $manager->persist($userReplyTree);
        }

        $manager->flush();

       // ===================
// 13. CREAR REPOSTS
// ===================
$createdReposts = [];
$attempts = 0;
$maxAttempts = 80;

while (count($createdReposts) < 40 && $attempts < $maxAttempts) {
    $user = $faker->randomElement($users);
    $post = $faker->randomElement($posts);
    
    $repostKey = $user->getId() . '-' . $post->getId();
    
    if (!in_array($repostKey, $createdReposts)) {
        $repost = new UserRepost();
        $repost->setUser($user);
        $repost->setPost($post);
        $repost->setCreatedAt(new \DateTimeImmutable('-' . $faker->numberBetween(1, 60) . ' days'));
        $repost->setUpdatedAt(new \DateTimeImmutable());
        
        $manager->persist($repost);
        $createdReposts[] = $repostKey;
    }
    
    $attempts++;
}

$manager->flush();

        // =======================
        // 14. CREAR WALLETS USERS
        // =======================
        foreach ($users as $index => $user) {
            $wallet = new Wallet();
            $wallet->setOwnerType('user');
            $wallet->setOwnerId($user->getId());
            $wallet->setLeafCoinsUser((string)$faker->randomFloat(2, 0, 5000));
            $wallet->setTreeCoinsCommunity((string)$faker->randomFloat(2, 0, 2000));

            $manager->persist($wallet);
        }

        $manager->flush();

        // =======================
        // 15. CREAR TRANSACTIONS
        // =======================
        $transactionTypes = ['earn_leaf', 'earn_tree', 'donation_leaf', 'donation_tree', 'receive_leaf', 'receive_tree'];
        $transactionOrigins = ['view', 'leaf', 'community_reward', 'user_donation', 'community_donation'];

        for ($i = 0; $i < 100; $i++) {
            $transaction = new Transaction();

            // Seleccionar un wallet aleatorio (user o community)
            $isUserWallet = $faker->boolean(70);
            if ($isUserWallet) {
                $randomUser = $faker->randomElement($users);
                $wallet = $manager->getRepository(Wallet::class)->findOneBy([
                    'ownerType' => 'user',
                    'ownerId' => $randomUser->getId()
                ]);
            } else {
                $randomCommunity = $faker->randomElement($communities);
                $wallet = $manager->getRepository(Wallet::class)->findOneBy([
                    'ownerType' => 'community',
                    'ownerId' => $randomCommunity->getId()
                ]);
            }

            if ($wallet) {
                $transaction->setWallet($wallet);
                $transaction->setAmount((string)$faker->randomFloat(2, 1, 500));
                $transaction->setType($faker->randomElement($transactionTypes));
                $transaction->setOrigin($faker->randomElement($transactionOrigins));
                $transaction->setOriginId($faker->optional()->numberBetween(1, 100));

                $manager->persist($transaction);
            }
        }

        $manager->flush();

        echo "✅ Fixtures cargadas exitosamente!\n";
        echo "📊 Datos creados:\n";
        echo "   - " . count($users) . " usuarios\n";
        echo "   - " . count($communities) . " comunidades\n";
        echo "   - " . count($posts) . " posts\n";
        echo "   - " . count($replies) . " replies\n";
        echo "   - 50 user follows\n";
        echo "   - 40 community follows\n";
        echo "   - 30 community members\n";
        echo "   - 100 post likes\n";
        echo "   - 80 reply likes\n";
        echo "   - 60 post trees\n";
        echo "   - 50 reply trees\n";
        echo "   - 40 reposts\n";
        echo "   - Wallets y transacciones\n";
    }
}
