import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://meeting-action-items-tracker-ahhe.onrender.com";

function App() {
  const [transcript, setTranscript] = useState("");
  const [actions, setActions] = useState([]);
  const [history, setHistory] = useState([]);

  const [newTask, setNewTask] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const loadActions = async () => {
    const res = await axios.get(`${API}/actions`);
    setActions(res.data);
  };

  const loadHistory = async () => {
    const res = await axios.get(`${API}/transcripts`);
    setHistory(res.data);
  };

  const extract = async () => {
    await axios.post(`${API}/extract`, { transcript });
    loadActions();
    loadHistory();
  };

  const markDone = async (id) => {
    await axios.patch(`${API}/actions/${id}/done`);
    loadActions();
  };

  const deleteAction = async (id) => {
    await axios.delete(`${API}/actions/${id}`);
    loadActions();
  };

  const addAction = async () => {
    await axios.post(`${API}/actions`, {
      task: newTask,
      owner: newOwner,
    });
    setNewTask("");
    setNewOwner("");
    loadActions();
  };

  const editAction = async (a) => {
    const task = prompt("Edit task", a.task);
    const owner = prompt("Edit owner", a.owner);

    if (!task || !owner) return;

    await axios.put(`${API}/actions/${a.id}`, {
      task,
      owner,
      due_date: "unknown",
    });

    loadActions();
  };

  useEffect(() => {
    loadActions();
    loadHistory();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Meeting Action Items Tracker</h2>

      <div style={{ marginBottom: 15 }}>
        <button
          style={{ marginRight: 10 }}
          onClick={async () => {
            const res = await axios.get(`${API}/status`);
            alert(JSON.stringify(res.data, null, 2));
          }}
        >
          Check Status
        </button>

        <button onClick={extract}>Extract Action Items</button>
      </div>

      <textarea
        rows="6"
        cols="60"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Paste transcript..."
      />

      <br /><br />

      <h3>Add Action</h3>
      <input
        placeholder="Task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <input
        placeholder="Owner"
        value={newOwner}
        onChange={(e) => setNewOwner(e.target.value)}
      />
      <button onClick={addAction}>Add</button>

      <h3>Action Items</h3>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Task</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {actions.map((a) => (
            <tr key={a.id}>
              <td>{a.task}</td>
              <td>{a.owner}</td>
              <td>{a.done ? "Done" : "Open"}</td>
              <td>
                <button onClick={() => markDone(a.id)}>Done</button>
                <button onClick={() => editAction(a)}>Edit</button>
                <button onClick={() => deleteAction(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Last 5 Transcripts</h3>
      <ul>
        {history.map((t) => (
          <li key={t.id}>{t.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
