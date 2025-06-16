document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("terminal-button");
  if (!btn) return;

  const overlay = document.createElement("div");
  overlay.id = "terminal-window";
  overlay.innerHTML = `
    <div id="terminal-header">
      <span>Terminal</span>
      <button id="terminal-close" aria-label="Close terminal">×</button>
    </div>
    <iframe id="terminal-iframe" src="" loading="lazy"></iframe>
  `;
  document.body.appendChild(overlay);

  const iframe = overlay.querySelector("#terminal-iframe");
  const closeBtn = overlay.querySelector("#terminal-close");

  overlay.style.display = "none";
  const originalSrc = btn.dataset.url || "https://terminal.example.dev";
  iframe.src = originalSrc;

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    if (!iframe.src) iframe.src = originalSrc;
    overlay.style.display = "block";
  });

  closeBtn.addEventListener("click", function () {
    overlay.style.display = "none";
    iframe.src = ""; // reset session
  });

  const header = overlay.querySelector("#terminal-header");
  let offsetX = 0;
  let offsetY = 0;
  let isDown = false;

  header.addEventListener("mousedown", function (e) {
    isDown = true;
    offsetX = overlay.offsetLeft - e.clientX;
    offsetY = overlay.offsetTop - e.clientY;
    header.classList.add("grabbing");
  });
  document.addEventListener("mouseup", function () {
    isDown = false;
    header.classList.remove("grabbing");
  });
  let rafId = null;
  let latestX = 0;
  let latestY = 0;

  document.addEventListener("mousemove", function (e) {
    if (!isDown) return;
    latestX = e.clientX + offsetX;
    latestY = e.clientY + offsetY;
    if (!rafId) {
      rafId = requestAnimationFrame(function () {
        overlay.style.left = latestX + "px";
        overlay.style.top = latestY + "px";
        rafId = null;
      });
    }
  });
});
