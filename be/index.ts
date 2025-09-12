import express from "express";
import pg from "pg";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "password",
  port: 5432,
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS workflows (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        enabled BOOLEAN DEFAULT true,
        nodes JSONB,
        connections JSONB
      );
      
      CREATE TABLE IF NOT EXISTS webhooks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        method VARCHAR(10) NOT NULL,
        path VARCHAR(255) NOT NULL,
        header JSONB,
        secret VARCHAR(255),
        workflow_id INT REFERENCES workflows(id) ON DELETE CASCADE
      );
      
      CREATE TABLE IF NOT EXISTS credentials (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        platform VARCHAR(255) NOT NULL,
        data JSONB NOT NULL
      );
    `);
    console.log("✅ Migration completed");
  } catch (err) {
    console.error("❌ Migration failed", err);
  } finally {
    client.release();
  }
}

migrate();

/**
 * Workflow APIs
 */
app.post("/workflow", async (req, res) => {
  const { title, enabled, nodes, connections } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO workflows (title, enabled, nodes, connections) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, enabled, JSON.stringify(nodes), JSON.stringify(connections)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create workflow" });
  }
});

app.get("/workflow", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM workflows");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch workflows" });
  }
});

app.get("/workflow/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM workflows WHERE id = $1", [
      id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch workflow" });
  }
});

app.put("/workflow/:id", async (req, res) => {
  const { id } = req.params;
  const { title, enabled, nodes, connections } = req.body;
  try {
    const result = await pool.query(
      "UPDATE workflows SET title=$1, enabled=$2, nodes=$3, connections=$4 WHERE id=$5 RETURNING *",
      [title, enabled, JSON.stringify(nodes), JSON.stringify(connections), id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update workflow" });
  }
});

/**
 * Credential APIs
 */
app.post("/credential", async (req, res) => {
  const { title, platform, data } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO credentials (title, platform, data) VALUES ($1, $2, $3) RETURNING *",
      [title, platform, JSON.stringify(data)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create credential" });
  }
});

app.delete("/credential/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM credentials WHERE id=$1", [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete credential" });
  }
});

/**
 * Webhook Handler (Dynamic)
 */
app.all("/webhook/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const webhook = await pool.query("SELECT * FROM webhooks WHERE id=$1", [
      id,
    ]);
    if (!webhook.rows.length) {
      return res.status(404).json({ error: "Webhook not found" });
    }
    // ⚡ Here you’d trigger the workflow execution engine
    res.json({ message: "Webhook received", data: req.body });
  } catch (err) {
    res.status(500).json({ error: "Webhook handler failed" });
  }
});

app.listen(4000, () => console.log("🚀 Server running on port 4000"));
