CREATE TABLE workflows (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  enabled BOOLEAN DEFAULT true,
  nodes JSONB,          -- stores array of nodes
  connections JSONB     -- stores edges/connections
)

-- Webhooks
CREATE TABLE webhooks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  path VARCHAR(255) NOT NULL,
  header JSONB,
  secret VARCHAR(255),
  workflow_id INT REFERENCES workflows(id) ON DELETE CASCADE
)

-- Credentials
CREATE TABLE credentials (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  platform VARCHAR(255) NOT NULL,
  data JSONB NOT NULL
)
