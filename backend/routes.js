const express = require("express");
const db = require("./db");

const router = express.Router();

/*
EXTRACT ACTION ITEMS
*/
router.post("/extract", (req, res) => {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ error: "Transcript required" });
  }

  try {
    const lines = transcript
      .split(/[.\n]/)
      .map((l) => l.trim())
      .filter((l) => l.toLowerCase().includes("will"));

    db.prepare("DELETE FROM actions").run();

    const result = db
      .prepare("INSERT INTO transcripts(text) VALUES(?)")
      .run(transcript);

    const transcriptId = result.lastInsertRowid;

    lines.forEach((line) => {
      db.prepare(
        "INSERT INTO actions(task, owner, due_date, transcript_id) VALUES(?,?,?,?)"
      ).run(
        line,
        line.split(" ")[0],
        "unknown",
        transcriptId
      );
    });

    const rows = db
      .prepare("SELECT * FROM actions WHERE transcript_id = ?")
      .all(transcriptId);

    res.json({ result: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Extraction failed" });
  }
});

/*
GET ACTIONS
*/
router.get("/actions", (req, res) => {
  const rows = db
    .prepare("SELECT * FROM actions ORDER BY id DESC")
    .all();

  res.json(rows);
});

/*
ADD ACTION
*/
router.post("/actions", (req, res) => {
  const { task, owner, due_date } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Task required" });
  }

  db.prepare(
    "INSERT INTO actions(task, owner, due_date) VALUES(?,?,?)"
  ).run(task, owner || "unknown", due_date || "unknown");

  res.json({ success: true });
});

/*
EDIT ACTION
*/
router.put("/actions/:id", (req, res) => {
  const { task, owner, due_date } = req.body;

  db.prepare(
    "UPDATE actions SET task=?, owner=?, due_date=? WHERE id=?"
  ).run(task, owner, due_date, req.params.id);

  res.json({ success: true });
});

/*
DELETE ACTION
*/
router.delete("/actions/:id", (req, res) => {
  db.prepare(
    "DELETE FROM actions WHERE id=?"
  ).run(req.params.id);

  res.json({ success: true });
});

/*
MARK DONE
*/
router.patch("/actions/:id/done", (req, res) => {
  db.prepare(
    "UPDATE actions SET done=1 WHERE id=?"
  ).run(req.params.id);

  res.json({ success: true });
});

/*
TRANSCRIPT HISTORY
*/
router.get("/transcripts", (req, res) => {
  const rows = db
    .prepare(
      "SELECT * FROM transcripts ORDER BY created_at DESC LIMIT 5"
    )
    .all();

  res.json(rows);
});

/*
STATUS
*/
router.get("/status", (req, res) => {
  res.json({
    backend: "ok",
    database: "connected",
    llm: "rule-based-extraction",
  });
});

module.exports = router;
