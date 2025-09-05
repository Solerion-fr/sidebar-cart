const openBtn = document.getElementById("open-sidebar");
const closeBtn = document.getElementById("close-sidebar");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

function openSidebar() {
  sidebar.classList.remove("translate-x-full");
  overlay.classList.remove("hidden");
  requestAnimationFrame(() => overlay.classList.add("opacity-100"));
}

function closeSidebar() {
  sidebar.classList.add("translate-x-full");
  overlay.classList.remove("opacity-100");
  overlay.classList.add("opacity-0");

  overlay.addEventListener(
    "transitionend",
    () => {
      if (overlay.classList.contains("opacity-0")) {
        overlay.classList.add("hidden");
      }
    },
    { once: true }
  );
}


openBtn.addEventListener("click", openSidebar);
closeBtn.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);
