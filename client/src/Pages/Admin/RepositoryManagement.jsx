import { useState } from "react";
import Sidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function RepositoryManagement() {
  const [resourceTypes, setResourceTypes] = useState([ "PDF"]);
  const [subjects, setSubjects] = useState(["Math", "Science"]);
  const [levels, setLevels] = useState(["Class 1", "Class 2"]);
  const [languages, setLanguages] = useState(["English", "Hindi"]);
  const [categories, setCategories] = useState(["school education"]);

  const [newValue, setNewValue] = useState("");
  const [activeField, setActiveField] = useState("");

  const addValue = (type) => {
    if (!newValue.trim()) return;
    if (type === "resource") setResourceTypes([...resourceTypes, newValue]);
    if (type === "subject") setSubjects([...subjects, newValue]);
    if (type === "level") setLevels([...levels, newValue]);
    if (type === "language") setLanguages([...languages, newValue]);
    if (type === "category") setCategories([...categories, newValue]);
    setNewValue("");
  };

  return (
  <div className="flex">
    
      <Sidebar />

   
    
      <div className="ml-64 flex-1 bg-[#0f1017] min-h-screen p-6 text-white">
         <AdminNavbar />
      <h1 className="text-2xl font-bold mb-6">📚 Repository Management</h1>

      {/* Resource Types */}
      <div className="mb-6 bg-[#1e1f29] p-4 rounded-lg">
        <h2 className="text-xl mb-2 font-semibold">Resource Types</h2>
        <ul className="list-disc ml-6 mb-2">
          {resourceTypes.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            type="text"
            value={activeField === "resource" ? newValue : ""}
            onChange={(e) => {
              setActiveField("resource");
              setNewValue(e.target.value);
            }}
            placeholder="Add new type"
            className="p-2 rounded text-black flex-1"
          />
          <button
            onClick={() => addValue("resource")}
            className="bg-blue-600 px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Subjects */}
      <div className="mb-6 bg-[#1e1f29] p-4 rounded-lg">
        <h2 className="text-xl mb-2 font-semibold">Subjects</h2>
        <ul className="list-disc ml-6 mb-2">
          {subjects.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            type="text"
            value={activeField === "subject" ? newValue : ""}
            onChange={(e) => {
              setActiveField("subject");
              setNewValue(e.target.value);
            }}
            placeholder="Add new subject"
            className="p-2 rounded text-black flex-1"
          />
          <button
            onClick={() => addValue("subject")}
            className="bg-green-600 px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Levels */}
      <div className="mb-6 bg-[#1e1f29] p-4 rounded-lg">
        <h2 className="text-xl mb-2 font-semibold">Education Levels</h2>
        <ul className="list-disc ml-6 mb-2">
          {levels.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            type="text"
            value={activeField === "level" ? newValue : ""}
            onChange={(e) => {
              setActiveField("level");
              setNewValue(e.target.value);
            }}
            placeholder="Add new level"
            className="p-2 rounded text-black flex-1"
          />
          <button
            onClick={() => addValue("level")}
            className="bg-purple-600 px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Languages */}
      <div className="mb-6 bg-[#1e1f29] p-4 rounded-lg">
        <h2 className="text-xl mb-2 font-semibold">Languages</h2>
        <ul className="list-disc ml-6 mb-2">
          {languages.map((lang, i) => (
            <li key={i}>{lang}</li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            type="text"
            value={activeField === "language" ? newValue : ""}
            onChange={(e) => {
              setActiveField("language");
              setNewValue(e.target.value);
            }}
            placeholder="Add new language"
            className="p-2 rounded text-black flex-1"
          />
          <button
            onClick={() => addValue("language")}
            className="bg-yellow-600 px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6 bg-[#1e1f29] p-4 rounded-lg">
        <h2 className="text-xl mb-2 font-semibold">Categories</h2>
        <ul className="list-disc ml-6 mb-2">
          {categories.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            type="text"
            value={activeField === "category" ? newValue : ""}
            onChange={(e) => {
              setActiveField("category");
              setNewValue(e.target.value);
            }}
            placeholder="Add new category"
            className="p-2 rounded text-black flex-1"
          />
          <button
            onClick={() => addValue("category")}
            className="bg-red-600 px-3 py-1 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
     </div>
  );
}
