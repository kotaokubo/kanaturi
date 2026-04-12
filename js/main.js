document.addEventListener("DOMContentLoaded", function () {
  var hamburger = document.querySelector(".hamburger");
  var navMenu = document.querySelector(".nav-menu");
  var overlay = document.querySelector(".nav-overlay");

  function closeMenu() {
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    navMenu.classList.remove("open");
    if (overlay) overlay.classList.remove("open");
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      var isOpen = navMenu.classList.contains("open");
      if (isOpen) {
        closeMenu();
      } else {
        hamburger.classList.add("active");
        hamburger.setAttribute("aria-expanded", "true");
        navMenu.classList.add("open");
        if (overlay) overlay.classList.add("open");
      }
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    if (overlay) {
      overlay.addEventListener("click", closeMenu);
    }
  }

  // Back to top button
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
