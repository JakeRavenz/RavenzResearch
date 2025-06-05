// Utility to call your backend Google Translate API
export async function translateText(text, targetLang) {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, target: targetLang }),
  });
  if (!res.ok) throw new Error("Translation failed");
  const data = await res.json();
  return data.translation;
}
