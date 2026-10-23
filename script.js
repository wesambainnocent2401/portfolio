// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Supabase setup ----------
// 1. Go to supabase.com > your project > Settings > API
// 2. Paste your Project URL and your "anon public" key below.
//    (The anon key is safe to put in front-end code, as long as
//     Row Level Security is ON and only allows INSERT.)
const SUPABASE_URL = "PASTE_YOUR_PROJECT_URL_HERE";
const SUPABASE_ANON_KEY = "PASTE_YOUR_ANON_PUBLIC_KEY_HERE";

const supabaseReady =
  SUPABASE_URL.startsWith("https://") && !SUPABASE_ANON_KEY.startsWith("PASTE");

const db = supabaseReady
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ---------- Contact form ----------
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const sendBtn = document.getElementById("send-btn");

function showStatus(text, type) {
  statusEl.textContent = text;
  statusEl.className = type; // "ok" or "err"
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  // Spam trap: bots fill this hidden field, people don't
  if (form.website.value) return;

  if (!name || !email || !message) {
    showStatus("Please fill in your name, email and message.", "err");
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showStatus("That email address doesn't look right. Check it and try again.", "err");
    return;
  }
  if (!db) {
    showStatus("The message box isn't connected yet. Please email me directly instead.", "err");
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  const { error } = await db.from("messages").insert({ name, email, message });

  sendBtn.disabled = false;
  sendBtn.textContent = "Send message";

  if (error) {
    console.error(error);
    showStatus("Your message didn't send. Please try again or email me directly.", "err");
  } else {
    form.reset();
    showStatus("Message sent. Thank you, I'll reply by email.", "ok");
  }
});
