CREATE DATABASE magichub;
CREATE USER magicuser WITH PASSWORD 'magicpass';
GRANT ALL PRIVILEGES ON DATABASE magichub TO magicuser;

\c magichub;

CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE
);

INSERT INTO todos (text, completed) VALUES
('🐳 Learn Docker with KartikeyaSoft Cloud Lab', false),
('⚡ Cast your first server spell: nginx', false),
('📦 Build a custom server image for your app', false),
('🌐 Expose server ports with -p magic', false),
('🔁 Use docker-compose to orchestrate multi-server spells', false);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO magicuser;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO magicuser;
