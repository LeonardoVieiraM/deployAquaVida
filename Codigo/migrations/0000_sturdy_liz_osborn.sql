CREATE TABLE `cliente` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cnpj` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`endereco` text,
	`representante_id` integer,
	FOREIGN KEY (`representante_id`) REFERENCES `representante`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pedidos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`status` text NOT NULL,
	`description` text,
	`cliente_id` integer,
	`gerente_id` integer,
	`servico_id` integer,
	FOREIGN KEY (`cliente_id`) REFERENCES `cliente`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`gerente_id`) REFERENCES `gerente`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`servico_id`) REFERENCES `servico`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contrato` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date_emission` integer DEFAULT (CURRENT_TIMESTAMP),
	`date_expire` integer NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`cliente_id` integer,
	`descricao` text,
	`nome` text,
	FOREIGN KEY (`cliente_id`) REFERENCES `cliente`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `gerente` (
    `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    `user_id` text NOT NULL, 
    `name` text NOT NULL,
    `estado` text NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `representante` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`email` text,
	`cpf` text NOT NULL,
	`gerente_id` integer,
	FOREIGN KEY (`gerente_id`) REFERENCES `gerente`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `servico` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `servico_to_contrato` (
	`servico_id` integer NOT NULL,
	`contrato_id` integer NOT NULL,
	`status` text,
	FOREIGN KEY (`servico_id`) REFERENCES `servico`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contrato_id`) REFERENCES `contrato`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `servico_to_pedido` (
	`servico_id` integer NOT NULL,
	`pedido_id` integer,
	FOREIGN KEY (`servico_id`) REFERENCES `servico`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`tipo` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `template` (
	`servico_id` integer PRIMARY KEY NOT NULL,
	`descricao` text,
	FOREIGN KEY (`servico_id`) REFERENCES `servico`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `relatorio` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`descricao` text,
	`nome` text,
	`contrato_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`contrato_id`) REFERENCES `contrato`(`id`) ON UPDATE no action ON DELETE no action
);
