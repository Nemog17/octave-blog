document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("terminal-button");
  if (!btn) return;

  const overlay = document.createElement("div");
  overlay.id = "terminal-window";
  overlay.innerHTML = `
    <div id="terminal-header">
      <span>Terminal</span>
      <div>
        <button id="terminal-minimize" aria-label="Minimize terminal">–</button>
        <button id="terminal-close" aria-label="Close terminal">×</button>
      </div>
    </div>
    <iframe id="terminal-iframe" src="" loading="lazy"></iframe>
  `;
  document.body.appendChild(overlay);

  const iframe = overlay.querySelector("#terminal-iframe");
  const closeBtn = overlay.querySelector("#terminal-close");
  const minimizeBtn = overlay.querySelector("#terminal-minimize");

  overlay.style.display = "none";
  let iframeLoaded = false;

  function show() {
    overlay.style.display = "block";
    if (!iframeLoaded) {
      iframe.src = btn.dataset.url || "https://docker-octave-test.happyisland-2e46231f.eastus.azurecontainerapps.io";
      iframeLoaded = true;
    }
    overlay.classList.remove("minimized");
    requestAnimationFrame(() => overlay.classList.add("show"));
  }

  function hide() {
    overlay.classList.remove("show");
    overlay.classList.add("minimized"
