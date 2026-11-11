"use strict";
(() => {
 const body = document.body;
 const sizeButton = document.getElementById("text-size-control");
 const contrastButton = document.getElementById("contrast-control");
 const aloudButton = document.getElementById("read-aloud-control");
 const stateKey = "biblical-world-atlas-display-v1";
 function setButton(button, active) {
  if (button) button.setAttribute("aria-pressed", String(Boolean(active)));
 }
 function readState() {
  try { const stored = JSON.parse(localStorage.getItem(stateKey) || "{}"); return stored && typeof stored === "object" ? stored : {}; }
  catch (error) { return {}; }
 }
 const preferences = readState();
 body.classList.toggle("large-type", preferences.largeType === true);
 body.classList.toggle("high-contrast", preferences.highContrast === true);
 setButton(sizeButton, body.classList.contains("large-type"));
 setButton(contrastButton, body.classList.contains("high-contrast"));
 function persist() {
  try { localStorage.setItem(stateKey, JSON.stringify({
   largeType: body.classList.contains("large-type"),
   highContrast: body.classList.contains("high-contrast")
  })); } catch (error) {}
 }
 if (sizeButton) sizeButton.addEventListener("click", () => {
  body.classList.toggle("large-type");
  setButton(sizeButton, body.classList.contains("large-type"));
  persist();
 });
 if (contrastButton) contrastButton.addEventListener("click", () => {
  body.classList.toggle("high-contrast");
  setButton(contrastButton, body.classList.contains("high-contrast"));
  persist();
 });
 document.querySelectorAll("[data-quick-query]").forEach(link => {
  link.addEventListener("click", event => {
   if (typeof window.searchFor !== "function") return;
   event.preventDefault();
   window.searchFor(link.dataset.quickQuery || "");
  });
 });
 if (aloudButton) {
  const speechAvailable = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  if (!speechAvailable) {
   aloudButton.disabled = true;
   aloudButton.title = "Speech playback is not supported in this browser";
  } else {
   let speaking = false;
   function resetReadAloud() {
    speaking = false;
    aloudButton.textContent = "◖)) Read Aloud";
    setButton(aloudButton, false);
   }
   aloudButton.setAttribute("aria-pressed", "false");
   aloudButton.addEventListener("click", () => {
    if (speaking) { window.speechSynthesis.cancel(); resetReadAloud(); return; }
    window.speechSynthesis.cancel();
    const title = document.getElementById("hero-title")?.textContent || "Biblical World Atlas";
    const intro = document.querySelector(".hero .intro")?.textContent || "";
    const verse = document.querySelector(".hero .scripture")?.textContent || "";
    const message = new SpeechSynthesisUtterance([title, intro, verse].join(". "));
    message.lang = "en-US";
    message.rate = 0.92;
    message.onend = resetReadAloud;
    message.onerror = resetReadAloud;
    speaking = true;
    aloudButton.textContent = "◼ Stop Reading";
    setButton(aloudButton, true);
    window.speechSynthesis.speak(message);
   });
   window.addEventListener("pagehide", () => window.speechSynthesis.cancel());
  }
 }
})();