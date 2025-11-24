<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251124123200 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE community (id INT AUTO_INCREMENT NOT NULL, wallet_id INT DEFAULT NULL, name VARCHAR(255) DEFAULT NULL, follower_count INT NOT NULL, member_count INT NOT NULL, photo_url VARCHAR(180) DEFAULT NULL, banner_url VARCHAR(180) DEFAULT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', UNIQUE INDEX UNIQ_1B604033712520F3 (wallet_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE community_follows (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, community_id INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_6FA6E320A76ED395 (user_id), INDEX IDX_6FA6E320FDA7B0BF (community_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE community_members (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, community_id INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_6165BBACA76ED395 (user_id), INDEX IDX_6165BBACFDA7B0BF (community_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE posts (id INT AUTO_INCREMENT NOT NULL, username INT NOT NULL, title VARCHAR(255) NOT NULL, leaf VARCHAR(255) DEFAULT NULL, photo VARCHAR(255) DEFAULT NULL, fecha_publicacion DATETIME NOT NULL, contenido LONGTEXT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_885DBAFAF85E0677 (username), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE transaction (id INT AUTO_INCREMENT NOT NULL, wallet_id INT NOT NULL, amount NUMERIC(12, 2) NOT NULL, type VARCHAR(20) NOT NULL, origin VARCHAR(30) NOT NULL, origin_id INT DEFAULT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_723705D1712520F3 (wallet_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, community_id INT DEFAULT NULL, email VARCHAR(180) NOT NULL, username VARCHAR(50) DEFAULT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, follower_count INT NOT NULL, biography VARCHAR(255) DEFAULT NULL, leaf_coins_user INT NOT NULL, tree_coins_community INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_8D93D649FDA7B0BF (community_id), UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_follows (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, following_user_id INT NOT NULL, created_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_136E9479A76ED395 (user_id), INDEX IDX_136E94791896F387 (following_user_id), UNIQUE INDEX UNIQ_136E9479A76ED3951896F387 (user_id, following_user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE wallet (id INT AUTO_INCREMENT NOT NULL, owner_type VARCHAR(20) NOT NULL, owner_id INT NOT NULL, leaf_coins_user NUMERIC(12, 2) NOT NULL, tree_coins_community NUMERIC(12, 2) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', updated_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE community ADD CONSTRAINT FK_1B604033712520F3 FOREIGN KEY (wallet_id) REFERENCES wallet (id)');
        $this->addSql('ALTER TABLE community_follows ADD CONSTRAINT FK_6FA6E320A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE community_follows ADD CONSTRAINT FK_6FA6E320FDA7B0BF FOREIGN KEY (community_id) REFERENCES community (id)');
        $this->addSql('ALTER TABLE community_members ADD CONSTRAINT FK_6165BBACA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE community_members ADD CONSTRAINT FK_6165BBACFDA7B0BF FOREIGN KEY (community_id) REFERENCES community (id)');
        $this->addSql('ALTER TABLE posts ADD CONSTRAINT FK_885DBAFAF85E0677 FOREIGN KEY (username) REFERENCES user (id)');
        $this->addSql('ALTER TABLE transaction ADD CONSTRAINT FK_723705D1712520F3 FOREIGN KEY (wallet_id) REFERENCES wallet (id)');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649FDA7B0BF FOREIGN KEY (community_id) REFERENCES community (id)');
        $this->addSql('ALTER TABLE user_follows ADD CONSTRAINT FK_136E9479A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_follows ADD CONSTRAINT FK_136E94791896F387 FOREIGN KEY (following_user_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE community DROP FOREIGN KEY FK_1B604033712520F3');
        $this->addSql('ALTER TABLE community_follows DROP FOREIGN KEY FK_6FA6E320A76ED395');
        $this->addSql('ALTER TABLE community_follows DROP FOREIGN KEY FK_6FA6E320FDA7B0BF');
        $this->addSql('ALTER TABLE community_members DROP FOREIGN KEY FK_6165BBACA76ED395');
        $this->addSql('ALTER TABLE community_members DROP FOREIGN KEY FK_6165BBACFDA7B0BF');
        $this->addSql('ALTER TABLE posts DROP FOREIGN KEY FK_885DBAFAF85E0677');
        $this->addSql('ALTER TABLE transaction DROP FOREIGN KEY FK_723705D1712520F3');
        $this->addSql('ALTER TABLE user DROP FOREIGN KEY FK_8D93D649FDA7B0BF');
        $this->addSql('ALTER TABLE user_follows DROP FOREIGN KEY FK_136E9479A76ED395');
        $this->addSql('ALTER TABLE user_follows DROP FOREIGN KEY FK_136E94791896F387');
        $this->addSql('DROP TABLE community');
        $this->addSql('DROP TABLE community_follows');
        $this->addSql('DROP TABLE community_members');
        $this->addSql('DROP TABLE posts');
        $this->addSql('DROP TABLE transaction');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE user_follows');
        $this->addSql('DROP TABLE wallet');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
