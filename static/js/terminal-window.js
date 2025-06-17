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
  iframe.src = btn.dataset.url || "https://docker-octave-test.happyisland-2e46231f.eastus.azurecontainerapps.io";

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    overlay.style.display = "block";
  });

  closeBtn.addEventListener("click", function () {
    overlay.style.display = "none";
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
  document.addEventListener("mousemove", function (e) {
    if (!isDown) return;
    overlay.style.left = e.clientX + offsetX + "px";
    overlay.style.top = e.clientY + offsetY + "px";
  });
});
