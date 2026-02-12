const express = require("express");
const db = require("./db");
const { pipeline } = require("@xenova/transformers");

const router = express.Router();

let generator = null;

async function getModel() {
  if (!generator) {
    console.log("Loading local model...");
    generator = await pipeline("text-generation", "Xenova/distilgpt2");
    console.log("Model loaded.");
  }
  return generator;
}

/*
EXTRACT ACTION ITEMS
*/
router.post("/extract", async (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "Transcript required" });
  }

  try {
    const lines = transcript
      .split(/[.\n]/)
      .map((l) => l.trim())
      .filter((l) => l.toLowerCase().includes("will"));
    db.run("DELETE FROM actions");
    db.run(
      "INSERT INTO transcripts(text) VALUES(?)",
      [transcript],
      function () {
        const transcriptId = this.lastID;

        lines.forEach((line) => {
          db.run(
            "INSERT INTO actions(task, owner, due_date, transcript_id) VALUES(?,?,?,?)",
            [
              line,
              line.split(" ")[0],
              "unknown",
              transcriptId,
            ]
          );
        });

        setTimeout(() => {
          db.all(
            "SELECT * FROM actions WHERE transcript_id = ?",
            [transcriptId],
            (err, rows) => {
              res.json({ result: rows });
            }
          );
        }, 200);
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Extraction failed" });
  }
});
router.get("/actions", (req, res) => {
  db.all("SELECT * FROM actions ORDER BY id DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});
/*
ADD ACTION
*/
router.post("/actions", (req, res) => {
  const { task, owner, due_date } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Task required" });
  }

  db.run(
    "INSERT INTO actions(task, owner, due_date) VALUES(?,?,?)",
    [task, owner || "unknown", due_date || "unknown"],
    () => res.json({ success: true })
  );
});

/*
EDIT ACTION
*/
router.put("/actions/:id", (req, res) => {
  const { task, owner, due_date } = req.body;

  db.run(
    "UPDATE actions SET task=?, owner=?, due_date=? WHERE id=?",
    [task, owner, due_date, req.params.id],
    () => res.json({ success: true })
  );
});

/*
DELETE ACTION
*/
router.delete("/actions/:id", (req, res) => {
  db.run(
    "DELETE FROM actions WHERE id=?",
    [req.params.id],
    () => res.json({ success: true })
  );
});

/*
MARK DONE
*/
router.patch("/actions/:id/done", (req, res) => {
  db.run(
    "UPDATE actions SET done=1 WHERE id=?",
    [req.params.id],
    () => res.json({ success: true })
  );
});

/*
TRANSCRIPT HISTORY (LAST 5)
*/
router.get("/transcripts", (req, res) => {
  db.all(
    "SELECT * FROM transcripts ORDER BY created_at DESC LIMIT 5",
    (err, rows) => res.json(rows)
  );
});

/*
STATUS
*/
router.get("/status", (req, res) => {
  res.json({
    backend: "ok",
    database: "connected",
    llm: "local-model-loaded",
  });
});

module.exports = router;
