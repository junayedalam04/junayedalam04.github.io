/* =====================================================
   THEME TOGGLE: how it works
   1. The theme is just a class on <html>. Class "dark" = dark mode.
      No class = light mode. style.css reads that class (":root.dark")
      and swaps all the color variables at once.
   2. On load we pick the theme in this order:
        a) the visitor's saved choice (localStorage), if they ever clicked the toggle
        b) otherwise the operating system preference (prefers-color-scheme)
   3. Clicking the toggle flips the class and saves the choice,
      so it overrides the system setting from then on.
   4. If the visitor has never chosen, the site follows the system live
      (for example when their phone switches to dark at sunset).
   ===================================================== */

const STORAGE_KEY = "theme";
const root = document.documentElement;
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

// Read the saved choice ("light", "dark", or null). try/catch covers blocked storage.
function getSavedTheme() {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}

// Put the theme on the page: toggles the "dark" class on <html>
// and keeps the button's accessible label in sync.
function applyTheme(theme) {
  root.classList.toggle("dark", theme === "dark");
  const button = document.getElementById("theme-toggle");
  if (button) {
    button.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
}

// Runs immediately (this file loads in <head>), so the first paint already has the right theme.
applyTheme(getSavedTheme() || (systemDark.matches ? "dark" : "light"));

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("theme-toggle");

  // Re-apply once the button exists so its label is correct.
  applyTheme(root.classList.contains("dark") ? "dark" : "light");

  // Click: flip the theme, save it, and briefly enable the CSS color transition.
  button.addEventListener("click", () => {
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.add("theme-anim");
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* storage blocked: toggle still works */ }
    setTimeout(() => root.classList.remove("theme-anim"), 400);
  });

  // Follow the system theme live, but only while the visitor has no saved choice.
  systemDark.addEventListener("change", (event) => {
    if (!getSavedTheme()) applyTheme(event.matches ? "dark" : "light");
  });

  // Footer: keep the copyright year current.
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
