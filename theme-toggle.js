/* ============================================================
   PRINCE HOME MADE CAKES AND CHOCOLATES
   theme-toggle.js — Dark / Light Mode Toggle
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'prince-cakes-theme';
  const html         = document.documentElement;
  const themeToggle  = document.getElementById('themeToggle');
  const toggleThumb  = document.getElementById('toggleThumb');

  // ─── Apply theme ──────────────────────────────────────────
  function applyTheme(theme, animate) {
    if (animate) {
      document.body.classList.add('theme-transitioning');
      setTimeout(() => document.body.classList.remove('theme-transitioning'), 600);
    }
    html.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.checked = theme === 'dark';
    if (toggleThumb) toggleThumb.textContent = theme === 'dark' ? '🌙' : '☀️';
    // Update ARIA
    if (themeToggle) themeToggle.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
  }

  // ─── Saved preference ─────────────────────────────────────
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemDark ? 'dark' : 'light');
  applyTheme(initialTheme, false);

  // ─── Toggle handler ───────────────────────────────────────
  function handleToggle() {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next, true);
    localStorage.setItem(STORAGE_KEY, next);
  }

  if (themeToggle) themeToggle.addEventListener('change', handleToggle);

  // ─── System preference change ─────────────────────────────
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light', true);
      }
    });
  }

  // Expose for other scripts
  window.ThemeToggle = { applyTheme };
})();
