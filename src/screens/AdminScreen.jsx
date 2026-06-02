import { useState } from "react";
import { createArticle } from "../services/articlesApi.js";

export function AdminScreen({ onNavigate }) {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    body: "",
    category: "General Law",
    source_name: "",
    source_url: "",
    image_url: "",
  });

  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const publishArticle = async () => {
    setMessage("Publishing...");

    const result = await createArticle({
      ...form,
      status: "approved",
    });

    if (!result.success) {
      setMessage("Could not publish article.");
      return;
    }

    setMessage("Article published.");

    setForm({
      title: "",
      subtitle: "",
      body: "",
      category: "General Law",
      source_name: "",
      source_url: "",
      image_url: "",
    });
  };

  return (
    <div style={{ height: "100%", padding: 20, overflowY: "auto" }}>
      <button onClick={() => onNavigate("profile")}>← Back</button>

      <h1>Admin</h1>
      <p style={{ color: "var(--muted)", fontSize: 13 }}>
        Publish articles to LexLegis.
      </p>

      <input placeholder="Title" value={form.title} onChange={(e) => updateField("title", e.target.value)} />
      <input placeholder="Subtitle" value={form.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} />

      <select value={form.category} onChange={(e) => updateField("category", e.target.value)}>
        <option>General Law</option>
        <option>Corporate</option>
        <option>Direct Tax</option>
        <option>Indirect Tax</option>
      </select>

      <textarea placeholder="Body" value={form.body} onChange={(e) => updateField("body", e.target.value)} />

      <input placeholder="Source Name" value={form.source_name} onChange={(e) => updateField("source_name", e.target.value)} />
      <input placeholder="Source URL" value={form.source_url} onChange={(e) => updateField("source_url", e.target.value)} />
      <input placeholder="Image URL" value={form.image_url} onChange={(e) => updateField("image_url", e.target.value)} />

      <button onClick={publishArticle}>
        Publish Article
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}