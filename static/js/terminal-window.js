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
  iframe.src = btn.dataset.url || "https://docker-octave-test.happyisland-2e46231f.eastus.azurecontainerapps.io";

  function show() {
    overlay.style.display = "block";
    overlay.classList.remove("minimized");
    requestAnimationFrame(() => overlay.classList.add("show"));
  }

  function hide() {
    overlay.classList.remove("show");
    overlay.classList.add("minimized");
  }

  overlay.addEventListener("transitionend", function () {
    if (!overlay.classList.contains("show")) {
      overlay.style.display = "none";
      overlay.classList.remove("minimized");
    }
  });

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    show();
  });

  closeBtn.addEventListener("click", hide);
  if (minimizeBtn) {
    minimizeBtn.addEventListener("click", hide);
  }

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
  document.addEventListener("mousemove", function (e) {
    if (!isDown) return;
    overlay.style.left = e.clientX + offsetX + "px";
    overlay.style.top = e.clientY + offsetY + "px";
  });
});
