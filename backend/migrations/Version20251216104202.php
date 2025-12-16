<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251216104202 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE community (id INT AUTO_INCREMENT NOT NULL, wallet_id INT DEFAULT NULL, name VARCHAR(255) DEFAULT NULL, biography VARCHAR(255) DEFAULT NULL, follower_count INT NOT NULL, member_count INT NOT NULL, photo_url VARCHAR(180) DEFAULT NULL, banner_url VARCHAR(180) DEFAULT NULL, admin_ids JSON DEFAULT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', UNIQUE INDEX UNIQ_1B604033712520F3 (wallet_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE community_follows (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, community_id INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_6FA6E320A76ED395 (user_id), INDEX IDX_6FA6E320FDA7B0BF (community_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE community_members (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, community_id INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_6165BBACA76ED395 (user_id), INDEX IDX_6165BBACFDA7B0BF (community_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE conversations (id INT AUTO_INCREMENT NOT NULL, user1_id INT NOT NULL, user2_id INT NOT NULL, last_message_at DATETIME DEFAULT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_C2521BF156AE248B (user1_id), INDEX IDX_C2521BF1441B8B65 (user2_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE hashtag (id INT AUTO_INCREMENT NOT NULL, tag VARCHAR(100) NOT NULL, count INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', UNIQUE INDEX UNIQ_5AB52A61389B783 (tag), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messages (id INT AUTO_INCREMENT NOT NULL, conversation_id INT NOT NULL, sender_id INT NOT NULL, content LONGTEXT NOT NULL, is_read TINYINT(1) NOT NULL, read_at DATETIME DEFAULT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_DB021E969AC0396 (conversation_id), INDEX IDX_DB021E96F624B39D (sender_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE notifications (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, actor_id INT NOT NULL, post_id INT DEFAULT NULL, community_id INT DEFAULT NULL, type VARCHAR(50) NOT NULL, message LONGTEXT NOT NULL, is_read TINYINT(1) NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_6000B0D3A76ED395 (user_id), INDEX IDX_6000B0D310DAF24A (actor_id), INDEX IDX_6000B0D34B89032C (post_id), INDEX IDX_6000B0D3FDA7B0BF (community_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE post_replies (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, post_id INT NOT NULL, leaf INT NOT NULL, reposts INT NOT NULL, image VARCHAR(255) DEFAULT NULL, content LONGTEXT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_9DE8D019A76ED395 (user_id), INDEX IDX_9DE8D0194B89032C (post_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE posts (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, community_id INT DEFAULT NULL, post_type VARCHAR(50) NOT NULL, leaf INT NOT NULL, tree INT NOT NULL, reposts INT NOT NULL, image VARCHAR(255) DEFAULT NULL, content LONGTEXT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_885DBAFAA76ED395 (user_id), INDEX IDX_885DBAFAFDA7B0BF (community_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE saved_posts (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, post_id INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_E58E61E3A76ED395 (user_id), INDEX IDX_E58E61E34B89032C (post_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE transaction (id INT AUTO_INCREMENT NOT NULL, wallet_id INT NOT NULL, amount NUMERIC(12, 2) NOT NULL, type VARCHAR(20) NOT NULL, origin VARCHAR(30) NOT NULL, origin_id INT DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_723705D1712520F3 (wallet_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, community_id INT DEFAULT NULL, email VARCHAR(180) NOT NULL, username VARCHAR(50) DEFAULT NULL, photo_url VARCHAR(180) DEFAULT NULL, banner_url VARCHAR(180) DEFAULT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, follower_count INT NOT NULL, following_count INT NOT NULL, biography VARCHAR(255) DEFAULT NULL, leaf_coins_user INT NOT NULL, tree_coins_community INT NOT NULL, is_private TINYINT(1) NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_8D93D649FDA7B0BF (community_id), UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_follows (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, following_user_id INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_136E9479A76ED395 (user_id), INDEX IDX_136E94791896F387 (following_user_id), UNIQUE INDEX UNIQ_136E9479A76ED3951896F387 (user_id, following_user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_post_leaves (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, post_id INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_47F80AFA76ED395 (user_id), INDEX IDX_47F80AF4B89032C (post_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_post_trees (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, post_id INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_A4A025A9A76ED395 (user_id), INDEX IDX_A4A025A94B89032C (post_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_replies_leaves (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, post_reply_id INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_3CA7D5B0A76ED395 (user_id), INDEX IDX_3CA7D5B035E3C7DE (post_reply_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_replies_trees (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, post_reply_id INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_A437FE0BA76ED395 (user_id), INDEX IDX_A437FE0B35E3C7DE (post_reply_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_reposts (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, post_id INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_A8D0D378A76ED395 (user_id), INDEX IDX_A8D0D3784B89032C (post_id), UNIQUE INDEX UNIQ_A8D0D378A76ED3954B89032C (user_id, post_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE wallet (id INT AUTO_INCREMENT NOT NULL, owner_type VARCHAR(20) NOT NULL, owner_id INT NOT NULL, leaf_coins_user NUMERIC(12, 2) NOT NULL, tree_coins_community NUMERIC(12, 2) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE community ADD CONSTRAINT FK_1B604033712520F3 FOREIGN KEY (wallet_id) REFERENCES wallet (id)');
        $this->addSql('ALTER TABLE community_follows ADD CONSTRAINT FK_6FA6E320A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE community_follows ADD CONSTRAINT FK_6FA6E320FDA7B0BF FOREIGN KEY (community_id) REFERENCES community (id)');
        $this->addSql('ALTER TABLE community_members ADD CONSTRAINT FK_6165BBACA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE community_members ADD CONSTRAINT FK_6165BBACFDA7B0BF FOREIGN KEY (community_id) REFERENCES community (id)');
        $this->addSql('ALTER TABLE conversations ADD CONSTRAINT FK_C2521BF156AE248B FOREIGN KEY (user1_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE conversations ADD CONSTRAINT FK_C2521BF1441B8B65 FOREIGN KEY (user2_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE messages ADD CONSTRAINT FK_DB021E969AC0396 FOREIGN KEY (conversation_id) REFERENCES conversations (id)');
        $this->addSql('ALTER TABLE messages ADD CONSTRAINT FK_DB021E96F624B39D FOREIGN KEY (sender_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE notifications ADD CONSTRAINT FK_6000B0D3A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE notifications ADD CONSTRAINT FK_6000B0D310DAF24A FOREIGN KEY (actor_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE notifications ADD CONSTRAINT FK_6000B0D34B89032C FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE notifications ADD CONSTRAINT FK_6000B0D3FDA7B0BF FOREIGN KEY (community_id) REFERENCES community (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE post_replies ADD CONSTRAINT FK_9DE8D019A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE post_replies ADD CONSTRAINT FK_9DE8D0194B89032C FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE posts ADD CONSTRAINT FK_885DBAFAA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE posts ADD CONSTRAINT FK_885DBAFAFDA7B0BF FOREIGN KEY (community_id) REFERENCES community (id)');
        $this->addSql('ALTER TABLE saved_posts ADD CONSTRAINT FK_E58E61E3A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE saved_posts ADD CONSTRAINT FK_E58E61E34B89032C FOREIGN KEY (post_id) REFERENCES posts (id)');
        $this->addSql('ALTER TABLE transaction ADD CONSTRAINT FK_723705D1712520F3 FOREIGN KEY (wallet_id) REFERENCES wallet (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649FDA7B0BF FOREIGN KEY (community_id) REFERENCES community (id)');
        $this->addSql('ALTER TABLE user_follows ADD CONSTRAINT FK_136E9479A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_follows ADD CONSTRAINT FK_136E94791896F387 FOREIGN KEY (following_user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_post_leaves ADD CONSTRAINT FK_47F80AFA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_post_leaves ADD CONSTRAINT FK_47F80AF4B89032C FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_post_trees ADD CONSTRAINT FK_A4A025A9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_post_trees ADD CONSTRAINT FK_A4A025A94B89032C FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_replies_leaves ADD CONSTRAINT FK_3CA7D5B0A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_replies_leaves ADD CONSTRAINT FK_3CA7D5B035E3C7DE FOREIGN KEY (post_reply_id) REFERENCES post_replies (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_replies_trees ADD CONSTRAINT FK_A437FE0BA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_replies_trees ADD CONSTRAINT FK_A437FE0B35E3C7DE FOREIGN KEY (post_reply_id) REFERENCES post_replies (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_reposts ADD CONSTRAINT FK_A8D0D378A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_reposts ADD CONSTRAINT FK_A8D0D3784B89032C FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE community DROP FOREIGN KEY FK_1B604033712520F3');
        $this->addSql('ALTER TABLE community_follows DROP FOREIGN KEY FK_6FA6E320A76ED395');
        $this->addSql('ALTER TABLE community_follows DROP FOREIGN KEY FK_6FA6E320FDA7B0BF');
        $this->addSql('ALTER TABLE community_members DROP FOREIGN KEY FK_6165BBACA76ED395');
        $this->addSql('ALTER TABLE community_members DROP FOREIGN KEY FK_6165BBACFDA7B0BF');
        $this->addSql('ALTER TABLE conversations DROP FOREIGN KEY FK_C2521BF156AE248B');
        $this->addSql('ALTER TABLE conversations DROP FOREIGN KEY FK_C2521BF1441B8B65');
        $this->addSql('ALTER TABLE messages DROP FOREIGN KEY FK_DB021E969AC0396');
        $this->addSql('ALTER TABLE messages DROP FOREIGN KEY FK_DB021E96F624B39D');
        $this->addSql('ALTER TABLE notifications DROP FOREIGN KEY FK_6000B0D3A76ED395');
        $this->addSql('ALTER TABLE notifications DROP FOREIGN KEY FK_6000B0D310DAF24A');
        $this->addSql('ALTER TABLE notifications DROP FOREIGN KEY FK_6000B0D34B89032C');
        $this->addSql('ALTER TABLE notifications DROP FOREIGN KEY FK_6000B0D3FDA7B0BF');
        $this->addSql('ALTER TABLE post_replies DROP FOREIGN KEY FK_9DE8D019A76ED395');
        $this->addSql('ALTER TABLE post_replies DROP FOREIGN KEY FK_9DE8D0194B89032C');
        $this->addSql('ALTER TABLE posts DROP FOREIGN KEY FK_885DBAFAA76ED395');
        $this->addSql('ALTER TABLE posts DROP FOREIGN KEY FK_885DBAFAFDA7B0BF');
        $this->addSql('ALTER TABLE saved_posts DROP FOREIGN KEY FK_E58E61E3A76ED395');
        $this->addSql('ALTER TABLE saved_posts DROP FOREIGN KEY FK_E58E61E34B89032C');
        $this->addSql('ALTER TABLE transaction DROP FOREIGN KEY FK_723705D1712520F3');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649FDA7B0BF');
        $this->addSql('ALTER TABLE user_follows DROP FOREIGN KEY FK_136E9479A76ED395');
        $this->addSql('ALTER TABLE user_follows DROP FOREIGN KEY FK_136E94791896F387');
        $this->addSql('ALTER TABLE user_post_leaves DROP FOREIGN KEY FK_47F80AFA76ED395');
        $this->addSql('ALTER TABLE user_post_leaves DROP FOREIGN KEY FK_47F80AF4B89032C');
        $this->addSql('ALTER TABLE user_post_trees DROP FOREIGN KEY FK_A4A025A9A76ED395');
        $this->addSql('ALTER TABLE user_post_trees DROP FOREIGN KEY FK_A4A025A94B89032C');
        $this->addSql('ALTER TABLE user_replies_leaves DROP FOREIGN KEY FK_3CA7D5B0A76ED395');
        $this->addSql('ALTER TABLE user_replies_leaves DROP FOREIGN KEY FK_3CA7D5B035E3C7DE');
        $this->addSql('ALTER TABLE user_replies_trees DROP FOREIGN KEY FK_A437FE0BA76ED395');
        $this->addSql('ALTER TABLE user_replies_trees DROP FOREIGN KEY FK_A437FE0B35E3C7DE');
        $this->addSql('ALTER TABLE user_reposts DROP FOREIGN KEY FK_A8D0D378A76ED395');
        $this->addSql('ALTER TABLE user_reposts DROP FOREIGN KEY FK_A8D0D3784B89032C');
        $this->addSql('DROP TABLE community');
        $this->addSql('DROP TABLE community_follows');
        $this->addSql('DROP TABLE community_members');
        $this->addSql('DROP TABLE conversations');
        $this->addSql('DROP TABLE hashtag');
        $this->addSql('DROP TABLE messages');
        $this->addSql('DROP TABLE notifications');
        $this->addSql('DROP TABLE post_replies');
        $this->addSql('DROP TABLE posts');
        $this->addSql('DROP TABLE saved_posts');
        $this->addSql('DROP TABLE transaction');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE user_follows');
        $this->addSql('DROP TABLE user_post_leaves');
        $this->addSql('DROP TABLE user_post_trees');
        $this->addSql('DROP TABLE user_replies_leaves');
        $this->addSql('DROP TABLE user_replies_trees');
        $this->addSql('DROP TABLE user_reposts');
        $this->addSql('DROP TABLE wallet');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
