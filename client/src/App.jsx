// import { Routes, Route } from "react-router-dom";
// import Layout from "./pages/Layout";
// import { Toaster } from "react-hot-toast";
// import Dashboard from "./pages/Dashboard";
// import Projects from "./pages/Projects";
// import Team from "./pages/Team";
// import ProjectDetails from "./pages/ProjectDetails";
// import TaskDetails from "./pages/TaskDetails";

// const App = () => {
//     return (
//         <>
//             <Toaster />
//             <Routes>
//                 <Route path="/" element={<Layout />}>
//                     <Route index element={<Dashboard />} />
//                     <Route path="team" element={<Team />} />
//                     <Route path="projects" element={<Projects />} />
//                     <Route path="projectsDetail" element={<ProjectDetails />} />
//                     <Route path="taskDetails" element={<TaskDetails />} />
//                 </Route>
//             </Routes>
//         </>
//     );
// };

// export default App;


import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");

  const canAdd = text.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canAdd) return;

    setItems((prev) => [...prev, { id: Date.now(), label: text.trim() }]);
    setText(""); // clear input after adding
  };

  return (
    <div style={{ maxWidth: 520, margin: "3rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Add to List</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Type an item…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Item text"
          style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd" }}
        />
        <button
          type="submit"
          disabled={!canAdd}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #4f46e5",
            background: canAdd ? "#4f46e5" : "#a5b4fc",
            color: "white",
            cursor: canAdd ? "pointer" : "not-allowed",
          }}
        >
          Add
        </button>
        
      </form>

      <ul style={{ marginTop: 20, paddingLeft: 18 }}>
        {items.map((it) => (
          <li key={it.id} style={{ marginBottom: 8 }}>
            {it.label}
          </li>
        ))}
      </ul>
    </div>
  );
}


