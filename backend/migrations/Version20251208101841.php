<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251208101841 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX UNIQ_9DE8D019A76ED3954B89032C ON post_replies');
        $this->addSql('ALTER TABLE post_replies ADD reposts INT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post_replies DROP reposts');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_9DE8D019A76ED3954B89032C ON post_replies (user_id, post_id)');
    }
}
