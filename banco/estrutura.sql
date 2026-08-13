-- Estrutura equivalente aos models Sequelize do projeto.
-- O backend cria essas tabelas automaticamente com sequelize.sync().
-- Este arquivo existe para documentar e permitir conferência manual da modelagem.

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  idade INTEGER NOT NULL CHECK (idade BETWEEN 16 AND 100),
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  texto TEXT NOT NULL,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS curtidas (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT curtidas_post_usuario_unico UNIQUE (post_id, usuario_id)
);

CREATE TABLE IF NOT EXISTS vagas (
  id INTEGER PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT NOT NULL,
  salario NUMERIC(10,2) NOT NULL,
  data_limite DATE NOT NULL
);
