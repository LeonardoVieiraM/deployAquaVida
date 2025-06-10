PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE `cliente` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`cnpj` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`endereco` text,
	`representante_id` integer,
	FOREIGN KEY (`representante_id`) REFERENCES `representante`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO cliente VALUES(1,'123456','cliente1','cliente1@hotmail.com','31110120, Colégio Batista, Belo Horizonte, Rua Álvaro Costa, , MG',1);
INSERT INTO cliente VALUES(2,'123456','cliente2','cliente2@hotmail.com','31110120, Colégio Batista, Belo Horizonte, Rua Álvaro Costa, , MG',1);
INSERT INTO cliente VALUES(3,'123456','cliente3','cliente3@hotmail.com','31110120, Colégio Batista, Belo Horizonte, Rua Álvaro Costa, , MG',2);
INSERT INTO cliente VALUES(4,'123456','cliente4','cliente4@hotmail.com','31110120, Colégio Batista, Belo Horizonte, Rua Álvaro Costa, , MG',3);
INSERT INTO cliente VALUES(5,'123456','cliente5','cliente5@hotmail.com','31110120, Colégio Batista, Belo Horizonte, Rua Álvaro Costa, , MG',4);
INSERT INTO cliente VALUES(6,'123456','cliente6','cliente6@hotmail.com','31110120, Colégio Batista, Belo Horizonte, Rua Álvaro Costa, , MG',5);
INSERT INTO cliente VALUES(7,'123456','cliente7','cliente7@hotmail.com','31110120, Colégio Batista, Belo Horizonte, Rua Álvaro Costa, , MG',6);
INSERT INTO cliente VALUES(8,'123456','cliente8','cliente8@hotmail.com','31110120, Colégio Batista, Belo Horizonte, Rua Álvaro Costa, , MG',7);
INSERT INTO cliente VALUES(9,'123456','cliente9','cliente9@hotmail.com','31110120, Colégio Batista, Belo Horizonte, Rua Álvaro Costa, , MG',8);
INSERT INTO cliente VALUES(10,'123456','cliente10','cliente10@hotmail.com','31110120, Colégio Batista, Belo Horizonte, Rua Álvaro Costa, , MG',9);
INSERT INTO cliente VALUES(11,'123456','cliente11','cliente11@hotmail.com','31110120, Colégio Batista, Belo Horizonte, Rua Álvaro Costa, , MG',10);
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
CREATE TABLE `contrato` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date_emission` integer DEFAULT (CURRENT_TIMESTAMP),
	`date_expire` integer NOT NULL,
	`updated_at` integer DEFAULT (CURRENT_TIMESTAMP),
	`cliente_id` integer,
	`descricao` text,
	`nome` text,
	`valor_pagamento` real DEFAULT 0 NOT NULL,
	`status_pagamento` text DEFAULT 'pendente',
	`mp_payment_id` text,
	FOREIGN KEY (`cliente_id`) REFERENCES `cliente`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO contrato VALUES(1,1745442408,1745971200,'2025-04-23 21:06:48',1,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato1',100.0,'pendente',NULL);
INSERT INTO contrato VALUES(2,1745442426,1746748800,'2025-04-23 21:07:06',2,'servico 1  aaa servico 1  bbb servico1  ccc <br><br> aaa  servico2  bbb <br><br>','contrato2',200.0,'pendente',NULL);
INSERT INTO contrato VALUES(3,1745442453,1747267200,'2025-04-23 21:07:33',3,'servico 1  aaa servico 1  bbb servico1  ccc <br><br> aaa  servico2  bbb <br><br>servico 1  aaa servico 1  bbb servico1  ccc <br><br> aaa  servico2  bbb <br><br>','contrato3',300.0,'pendente',NULL);
INSERT INTO contrato VALUES(4,1702609200,1702609200,'2025-05-22 20:06:45',4,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato4',1000.0,'pendente',NULL);
INSERT INTO contrato VALUES(5,1722913200,1722913200,'2025-05-22 20:06:45',5,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato5',1500.0,'pendente',NULL);
INSERT INTO contrato VALUES(6,1731639600,1731639600,'2025-05-22 20:06:45',6,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato6',1200.0,'pendente',NULL);
INSERT INTO contrato VALUES(7,1739415600,1739415600,'2025-05-22 20:06:45',7,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato7',2000.0,'pendente',NULL);
INSERT INTO contrato VALUES(8,1741921200,1741921200,'2025-05-22 20:06:45',8,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato8',3000.0,'pendente',NULL);
INSERT INTO contrato VALUES(9,1673492400,1673492400,'2025-05-22 20:06:45',9,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato9',2500.0,'pendente',NULL);
INSERT INTO contrato VALUES(10,1705546800,1705546800,'2025-05-22 20:06:45',10,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato10',800.0,'pendente',NULL);
INSERT INTO contrato VALUES(11,1731466800,1731466800,'2025-05-22 20:06:45',1,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato11',700.0,'pendente',NULL);
INSERT INTO contrato VALUES(12,1734663600,1734663600,'2025-05-22 20:06:45',1,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato12',500.0,'pendente',NULL);
INSERT INTO contrato VALUES(13,1741748400,1741748400,'2025-05-22 20:06:45',2,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato13',4000.0,'pendente',NULL);
INSERT INTO contrato VALUES(14,1746500400,1746500400,'2025-05-22 20:06:45',3,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato14',1250.0,'pendente',NULL);
INSERT INTO contrato VALUES(15,1726455600,1726455600,'2025-05-22 20:06:45',4,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato15',6500.0,'pendente',NULL);
INSERT INTO contrato VALUES(16,1727146800,1727146800,'2025-05-22 20:06:45',5,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato16',300.0,'pendente',NULL);
INSERT INTO contrato VALUES(17,1725937200,1725937200,'2025-05-22 20:06:45',6,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato17',4000.0,'pendente',NULL);
INSERT INTO contrato VALUES(18,1720494000,1720494000,'2025-05-22 20:06:45',7,'servico 1  aaa servico 1  bbb servico1  ccc <br><br>','contrato18',900.0,'pendente',NULL);
INSERT INTO contrato VALUES(19,1748460740,1749168000,'2025-05-28 19:32:20',1,'servico 1  aaaa servico 1  bbbbbbbbbbb servico1  ccccccccccc <br><br>','contratoaaaaaaaa',300.0,'pendente',NULL);
CREATE TABLE `gerente` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`estado` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO gerente VALUES(1,'4','gerente1','MG');
INSERT INTO gerente VALUES(2,'5','gerente2','SP');
INSERT INTO gerente VALUES(3,'jkv2bmcjucyhniqi','gerente3','RJ');
INSERT INTO gerente VALUES(4,'bjlfyckxr3louc5h','gerentesenha','SP');
CREATE TABLE `representante` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`email` text,
	`cpf` text NOT NULL,
	`gerente_id` integer,
	FOREIGN KEY (`gerente_id`) REFERENCES `gerente`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO representante VALUES(1,'representante1','representante1@hotmail.com','123456',1);
INSERT INTO representante VALUES(2,'representante2','representante2@hotmail.com','123456',2);
INSERT INTO representante VALUES(3,'representante3','representante3@hotmail.com','123456',1);
INSERT INTO representante VALUES(4,'representante4','representante4@hotmail.com','123456',1);
INSERT INTO representante VALUES(5,'representante5','representante5@hotmail.com','123456',1);
INSERT INTO representante VALUES(6,'representante6','representante6@hotmail.com','123456',1);
INSERT INTO representante VALUES(7,'representante7','representante7@hotmail.com','123456',1);
INSERT INTO representante VALUES(8,'representante8','representante8@hotmail.com','123456',1);
INSERT INTO representante VALUES(9,'representante9','representante9@hotmail.com','123456',1);
INSERT INTO representante VALUES(10,'representante10','representante10@hotmail.com','123456',1);
CREATE TABLE `servico` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL
);
INSERT INTO servico VALUES(1,'servico1','descricao servico1');
INSERT INTO servico VALUES(2,'servico2','descricao servico2');
INSERT INTO servico VALUES(3,'Análise de Qualidade da Água','Análise de Qualidade da Água');
INSERT INTO servico VALUES(4,'Instalação de Sistema de Filtragem','Instalação de Sistema de Filtragem');
INSERT INTO servico VALUES(5,'Manutenção Preventiva de Estação de Tratamento','Manutenção Preventiva de Estação de Tratamento');
INSERT INTO servico VALUES(6,'Tratamento de Água para Piscinas','Tratamento de Água para Piscinas');
INSERT INTO servico VALUES(7,'Desinfecção de Caixas d''Água','Desinfecção de Caixas d''Água');
INSERT INTO servico VALUES(8,'Análise de Controle de Legionella','Análise de Controle de Legionella');
INSERT INTO servico VALUES(9,'Osmose Reversa Industrial','Osmose Reversa Industrial');
INSERT INTO servico VALUES(10,'Suporte Técnico Especializado','Suporte Técnico Especializado');
INSERT INTO servico VALUES(11,'Consultoria em Gestão Hídrica','Consultoria em Gestão Hídrica');
INSERT INTO servico VALUES(12,'Tratamento de Efluentes','Tratamento de Efluentes');
CREATE TABLE `servico_to_contrato` (
	`servico_id` integer NOT NULL,
	`contrato_id` integer NOT NULL,
	`status` text,
	FOREIGN KEY (`servico_id`) REFERENCES `servico`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contrato_id`) REFERENCES `contrato`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO servico_to_contrato VALUES(1,1,'Em Andamento');
INSERT INTO servico_to_contrato VALUES(1,2,'Pendente');
INSERT INTO servico_to_contrato VALUES(2,2,'Pendente');
INSERT INTO servico_to_contrato VALUES(1,3,'Pendente');
INSERT INTO servico_to_contrato VALUES(2,3,'Pendente');
INSERT INTO servico_to_contrato VALUES(1,3,'Pendente');
INSERT INTO servico_to_contrato VALUES(2,3,'Pendente');
INSERT INTO servico_to_contrato VALUES(1,19,'Pendente');
CREATE TABLE `servico_to_pedido` (
	`servico_id` integer NOT NULL,
	`pedido_id` integer,
	FOREIGN KEY (`servico_id`) REFERENCES `servico`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pedido_id`) REFERENCES `pedidos`(`id`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO session VALUES('ojgmjaw4fg4katz553stopjrxb4ezq77rxmuxgmd','4',1748970443);
INSERT INTO session VALUES('qd7dqsfw44s6vyl6ahd4f44jsqpyxm32cnimtjxc','4',1751303414);
INSERT INTO session VALUES('r37nkb34jymm3ypy4376dbrxjgcf2trjqbung3lz','4',1752016264);
INSERT INTO session VALUES('me2ox5d2ow6dkrwuzes22dhd2mpodncwjzyexl6c','4',1752016278);
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`tipo` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO user VALUES('1','cliente1','cliente1@hotmail.com','cliente','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('2','cliente2','cliente2@hotmail.com','cliente','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('3','cliente3','cliente3@hotmail.com','cliente','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('4','gerente1','gerente1@hotmail.com','gerente','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('5','gerente2','gerente2@hotmail.com','gerente','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('6','representante1','representante1@hotmail.com','representante','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('7','representante2','representante2@hotmail.com','representante','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('jkv2bmcjucyhniqi','gerente3','gerente3@hotmail.com','gerente','$argon2id$v=19$m=19456,t=2,p=1$xhSKd+nM7YGq5BRQwyErAg$5bSjFl8FtBsy67MKf5W0h0hkTWEXQy3lfDzX+nPxekE','2025-05-20 19:46:50');
INSERT INTO user VALUES('8','representante3','representante3@hotmail.com','representante','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('9','representante4','representante4@hotmail.com','representante','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('10','representante5','representante5@hotmail.com','representante','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('11','representante6','representante6@hotmail.com','representante','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('12','representante7','representante7@hotmail.com','representante','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('13','representante8','representante8@hotmail.com','representante','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('14','representante9','representante9@hotmail.com','representante','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('15','representante10','representante10@hotmail.com','representante','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('16','cliente4','cliente4@hotmail.com','cliente','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('17','cliente5','cliente5@hotmail.com','cliente','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('18','cliente6','cliente6@hotmail.com','cliente','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('19','cliente7','cliente7@hotmail.com','cliente','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('20','cliente8','cliente8@hotmail.com','cliente','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('21','cliente9','cliente9@hotmail.com','cliente','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('22','cliente10','cliente10@hotmail.com','cliente','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('23','cliente11','cliente11@hotmail.com','cliente','$argon2id$v=19$m=19456,t=2,p=1$aicG6lISXA962alqaFMUGg$CQyJIcwNVTTx1ihq6ZcX2+T0Nt/kXZdfcksjLTr5hbs','2025-04-23 20:58:02');
INSERT INTO user VALUES('bjlfyckxr3louc5h','gerentesenha','gerentesenha@hotmail.com','gerente','$argon2id$v=19$m=19456,t=2,p=1$S3RDTY48ulucaWRduN0jXA$8wSaLE+WwE5FOyiqH2IKEmlNgizj9c5sjc374spHjkg','2025-05-30 18:10:10');
CREATE TABLE `template` (
	`servico_id` integer PRIMARY KEY NOT NULL,
	`descricao` text,
	FOREIGN KEY (`servico_id`) REFERENCES `servico`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO template VALUES(1,'servico 1  {&} servico 1  {&} servico1  {&} ');
INSERT INTO template VALUES(2,' {&}  servico2  {&} ');
INSERT INTO template VALUES(3,'Realizamos coleta e análise da água do cliente {&} conforme padrões da portaria de potabilidade. Parâmetros analisados: pH {&}, turbidez {&} NTU, cloro residual {&} mg/L, coliformes totais e E. coli. Recomendações: {&}.');
INSERT INTO template VALUES(4,'Instalação do sistema de filtragem modelo {&} com capacidade de {&} litros/hora. Especificações técnicas: pré-filtro de sedimentos {&} micra, filtro de carvão ativado {&} e membrana de osmose reversa. Pressão de trabalho: {&} psi.');
INSERT INTO template VALUES(5,'Serviço de manutenção preventiva na ETA do cliente {&}. Realizada troca de filtros {&}, calibração de dosadoras de produtos químicos {&}, limpeza dos tanques de {&} e verificação dos parâmetros de qualidade. Próxima manutenção prevista para {&}.');
INSERT INTO template VALUES(6,'Tratamento completo para piscina de {&} m³ localizada em {&}. Níveis ajustados: pH {&}, cloro {&} ppm e alcalinidade {&} ppm. Aplicação de produto alguicida {&} e clarificante {&}. Frequência de manutenção: {&} vezes/semana.');
INSERT INTO template VALUES(7,'Higienização completa da caixa d''água de {&} litros localizada em {&}. Processo: esvaziamento, remoção mecânica de resíduos, aplicação de hipoclorito a {&}%, enxágue e análise microbiológica pós-serviço. Recomendações: {&}.');
INSERT INTO template VALUES(8,'Monitoramento de Legionella pneumophila no sistema de {&}. Pontos de coleta: {&}, {&} e {&}. Método analítico: {&}. Resultados: <{&}> UFC/100mL. Recomendações técnicas: {&}.');
INSERT INTO template VALUES(9,'Instalação de sistema de osmose reversa para processo industrial {&}. Capacidade: {&} m³/dia. Especificações: recuperação {&}%, rejeição de sais {&}%. Inclui pré-tratamento com {&} e pós-tratamento com {&}.');
INSERT INTO template VALUES(10,'Visita técnica para diagnóstico do sistema de tratamento no endereço {&}. Identificado {&}. Realizadas as seguintes intervenções: {&}. Recomendações para otimização: {&}.');
INSERT INTO template VALUES(11,'Auditoria hídrica na unidade {&}. Consumo médio: {&} m³/mês. Identificado potencial de redução de {&}% através de {&}. Proposto plano de ação com implementação de {&} e {&}. Payback estimado: {&} meses.');
INSERT INTO template VALUES(12,'Operação do sistema de tratamento de efluentes tipo {&} para cliente do ramo {&}. Carga tratada: {&} m³/dia. Parâmetros de saída: DBO {&} mg/L, DQO {&} mg/L, SST {&} mg/L. Recomendações: {&}.');
CREATE TABLE `relatorio` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`descricao` text,
	`nome` text,
	`contrato_id` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`contrato_id`) REFERENCES `contrato`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO relatorio VALUES(1,'descrição1','aaaa',1,'2025-05-28 17:30:16');
CREATE TABLE `evento` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`data` integer NOT NULL,
	`titulo` text NOT NULL,
	`local` text NOT NULL,
	`descricao` text,
	`representante_id` integer,
	`cliente_id` integer,
	FOREIGN KEY (`representante_id`) REFERENCES `representante`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cliente_id`) REFERENCES `cliente`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO evento VALUES(2,1748779200,'aaaa','31110120, Colégio Batista, Belo Horizonte, Rua Álvaro Costa, , MG','aa',1,2);
INSERT INTO evento VALUES(3,1748692800,'bbbbbb','Video conferência','aaa',1,1);
INSERT INTO evento VALUES(4,1748865600,'aaaa','Video conferência','bbbbbb',1,5);
INSERT INTO evento VALUES(7,1749146400,'encontro cliente1','Video conferência','aaaaaaaa',1,1);
CREATE TABLE `pix_payment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`payment_id` text NOT NULL,
	`status` text NOT NULL,
	`status_detail` text,
	`qr_code_base64` text NOT NULL,
	`qr_code` text NOT NULL,
	`contrato_id` integer NOT NULL,
	`amount` real NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	`updated_at` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))
);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('cliente',11);
INSERT INTO sqlite_sequence VALUES('gerente',4);
INSERT INTO sqlite_sequence VALUES('representante',10);
INSERT INTO sqlite_sequence VALUES('servico',12);
INSERT INTO sqlite_sequence VALUES('contrato',19);
INSERT INTO sqlite_sequence VALUES('relatorio',1);
INSERT INTO sqlite_sequence VALUES('evento',7);
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);
COMMIT;
