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
    <div id="terminal-container">
      <iframe id="terminal-iframe" src="" loading="lazy"></iframe>
    </div>
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
      iframe.src =
        btn.dataset.url ||
        "https://octave-env.happyisland-2e46231f.eastus.azurecontainerapps.io";
      iframeLoaded = true;
    }
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



  function closeTerminal() {
    iframe.src = "";
    iframeLoaded = false;
    hide();
  }

  closeBtn.addEventListener("click", closeTerminal);
  if (minimizeBtn) {
    minimizeBtn.addEventListener("click", hide);
  }

  const header = overlay.querySelector("#terminal-header");
  let offsetX = 0;
  let offsetY = 0;
  let isDown = false;

  header.addEventListener("pointerdown", function (e) {
    isDown = true;
    offsetX = overlay.offsetLeft - e.clientX;
    offsetY = overlay.offsetTop - e.clientY;
    header.classList.add("grabbing");
    document.body.classList.add("no-select");
  });
  document.addEventListener("pointerup", function () {
    isDown = false;
    header.classList.remove("grabbing");
    document.body.classList.remove("no-select");
  });
  document.addEventListener("pointermove", function (e) {
    if (!isDown) return;
    overlay.style.left = e.clientX + offsetX + "px";
    overlay.style.top = e.clientY + offsetY + "px";
  });

  /* Resizable split panels removed */
});
