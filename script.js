/* =========================================
   WESAMBA INNOCENT - PORTFOLIO JAVASCRIPT
========================================= */


/* =========================================
   SUPABASE CONFIGURATION
   The publishable key is designed for frontend use.
   Keep Row Level Security enabled in Supabase.
========================================= */

const SUPABASE_URL = "https://ifewunkywpkaikhbobbv.supabase.co";

const SUPABASE_ANON_KEY =
  "sb_publishable_a4a59bPWDdw8DexIQ6VpKw_QNb-MVAy";

let db = null;


function initializeSupabase() {

  if (!window.supabase) {
    console.error("Supabase library was not loaded.");
    return false;
  }

  try {
    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return true;
  } catch (error) {
    console.error("Supabase initialization failed:", error);
    return false;
  }

}

initializeSupabase();


/* =========================================
   FOOTER YEAR
========================================= */

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = document.querySelectorAll(".site-nav a");


if (menuToggle && siteNav) {

  menuToggle.addEventListener("click", () => {

    const isOpen = siteNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));

  });


  navLinks.forEach((link) => {

    link.addEventListener("click", () => {

      siteNav.classList.remove("open");

      menuToggle.setAttribute("aria-expanded", "false");

    });

  });


  document.addEventListener("click", (event) => {

    const clickedInsideMenu =
      siteNav.contains(event.target) ||
      menuToggle.contains(event.target);

    if (!clickedInsideMenu) {

      siteNav.classList.remove("open");

      menuToggle.setAttribute("aria-expanded", "false");

    }

  });

}


/* =========================================
   THEME TOGGLE
========================================= */

const themeToggle = document.getElementById("theme-toggle");


function updateThemeButton() {

  if (!themeToggle) return;

  const isLight = document.body.classList.contains("light-theme");

  const icon = themeToggle.querySelector(".theme-icon");

  if (icon) {
    icon.textContent = isLight ? "☾" : "☀";
  }

  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark theme" : "Switch to light theme"
  );

}


function loadSavedTheme() {

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("portfolio-theme");
  } catch (error) {
    savedTheme = null;
  }

  document.body.classList.toggle("light-theme", savedTheme === "light");

  updateThemeButton();

}

loadSavedTheme();


if (themeToggle) {

  themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    const isLight = document.body.classList.contains("light-theme");

    try {
      localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
    } catch (error) {
      // Storage unavailable (private mode); the theme still switches.
    }

    updateThemeButton();

  });

}


/* =========================================
   ACTIVE NAVIGATION
========================================= */

const sections = document.querySelectorAll("main section[id]");


if ("IntersectionObserver" in window) {

  const sectionObserver = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          const currentId = entry.target.id;

          navLinks.forEach((link) => {

            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${currentId}`
            );

          });

        }

      });

    },
    { threshold: 0.35 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

}


/* =========================================
   CONTACT FORM
========================================= */

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const sendButton = document.getElementById("send-btn");

const sendButtonDefaultHTML = sendButton ? sendButton.innerHTML : "";


// type: "success" | "error" | "" (neutral)
function showStatus(message, type) {

  if (!formStatus) return;

  formStatus.textContent = message;

  if (type === "success") {
    formStatus.className = "ok";
  } else if (type === "error") {
    formStatus.className = "err";
  } else {
    formStatus.className = "";
  }

}


function setSubmitting(isSubmitting) {

  if (!sendButton) return;

  sendButton.disabled = isSubmitting;

  sendButton.innerHTML = isSubmitting
    ? "Sending..."
    : sendButtonDefaultHTML;

}


if (contactForm) {

  contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    showStatus("", "");

    // Basic bot filtering (hidden field must stay empty).
    const websiteField = contactForm.elements["website"];

    if (websiteField && websiteField.value.trim() !== "") {
      showStatus("Unable to submit this message.", "error");
      return;
    }


    const name = contactForm.elements["name"].value.trim();
    const email = contactForm.elements["email"].value.trim();
    const message = contactForm.elements["message"].value.trim();


    if (!name || !email || !message) {
      showStatus("Please complete all the required fields.", "error");
      return;
    }


    if (name.length > 100 || email.length > 254 || message.length > 3000) {
      showStatus("One or more fields exceed the allowed length.", "error");
      return;
    }


    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showStatus("Please enter a valid email address.", "error");
      return;
    }


    if (!db) {
      showStatus(
        "The message service is currently unavailable. Please email me directly.",
        "error"
      );
      return;
    }


    setSubmitting(true);


    try {

      const { error } = await db
        .from("messages")
        .insert([{ name: name, email: email, message: message }]);

      if (error) {
        console.error("Supabase submission error:", error);
        throw error;
      }

      showStatus("Your message has been sent successfully. Thank you!", "success");

      contactForm.reset();

    } catch (error) {

      console.error("Contact form error:", error);

      showStatus(
        "Sorry, your message could not be sent. Please try again or email me directly.",
        "error"
      );

    } finally {

      setSubmitting(false);

    }

  });

}


/* =========================================
   CONSOLE MESSAGE
========================================= */

console.log(
  "%cWelcome to Wesamba's Portfolio!",
  "color: #4388ff; font-size: 18px; font-weight: bold;"
);

console.log(
  "%cThanks for checking out the code.",
  "color: #9ba9c0; font-size: 12px;"
);
