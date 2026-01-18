/* js/script.js - Updated for V3 */

gsap.registerPlugin(ScrollTrigger);

// --- 1. CURSOR CUSTOM (TETAP DIPAKE) ---
const cursor = document.getElementById("cursor");
if (cursor) {
  document.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
    });
  });

  // Nambahin logic biar tombol baru (.hoverable) bisa trigger cursor
  const updateHoverTargets = () => {
    const hoverTargets = document.querySelectorAll(
      ".hoverable, a, .btn, .card__link",
    );
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
      el.addEventListener("mouseleave", () =>
        cursor.classList.remove("hovered"),
      );
    });
  };
  updateHoverTargets();
}

// --- 2. SCRAMBLE TEXT EFFECT (TETAP DIPAKE) ---
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const scrambleElements = document.querySelectorAll(".scramble-hover");
if (scrambleElements.length > 0) {
  scrambleElements.forEach((item) => {
    item.onmouseover = (event) => {
      let iteration = 0;
      clearInterval(item.interval);
      item.interval = setInterval(() => {
        event.target.innerText = event.target.innerText
          .split("")
          .map((letter, index) => {
            if (index < iteration) return event.target.dataset.value[index];
            return letters[Math.floor(Math.random() * 26)];
          })
          .join("");
        if (iteration >= event.target.dataset.value.length) {
          clearInterval(item.interval);
        }
        iteration += 1 / 3;
      }, 30);
    };
  });
}

// --- 3. LOADER / PRELOADER (DIMODIFIKASI) ---
const loaderText = document.getElementById("loader-text");
if (loaderText) {
  let count = 0;
  const interval = setInterval(() => {
    count++;
    loaderText.innerText = count + "%";

    // Kalau sudah 100%
    if (count === 100) {
      clearInterval(interval);

      // Ilangin teks angka
      gsap.to(loaderText, { opacity: 0, duration: 0.5 });

      // Animasi tirai (shutter) kebuka
      gsap.to(".blind", {
        scaleY: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power4.inOut",
        onComplete: () => {
          const shutter = document.getElementById("shutter");
          if (shutter) shutter.style.display = "none";

          // --- INI BARU: Panggil animasi hero setelah loading kelar ---
          initReveal();
        },
      });
    }
  }, 15); // Kecepatan loading
}

// --- 4. SMOOTH SCROLL (LENIS) (TETAP DIPAKE) ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const smoothWrapper = document.getElementById("smooth-wrapper");
if (smoothWrapper) {
  let skew = 0;
  lenis.on("scroll", (e) => {
    skew = e.velocity * 0.1;
  });
  gsap.ticker.add(() => {
    gsap.to("#smooth-content", {
      skewY: skew,
      duration: 0.8,
      ease: "power3.out",
    });
  });
}

// --- 5. MENU OVERLAY (TETAP DIPAKE) ---
const menuOverlay = document.getElementById("menu-overlay");
if (menuOverlay) {
  let menuOpen = false;
  const menuTl = gsap.timeline({ paused: true });
  menuTl.to("#menu-overlay", { y: "0%", duration: 0.8, ease: "power4.inOut" });

  window.toggleMenu = function () {
    const btnText = document.getElementById("menu-btn-text");
    if (!menuOpen) {
      menuTl.play();
      if (btnText) {
        btnText.innerText = "CLOSE";
        btnText.dataset.value = "CLOSE";
      }
    } else {
      menuTl.reverse();
      if (btnText) {
        btnText.innerText = "MENU";
        btnText.dataset.value = "MENU";
      }
    }
    menuOpen = !menuOpen;
  };
}

// --- 6. HOVER IMAGE REVEAL (TETAP DIPAKE BUAT LIST EXPERIENCE) ---
// (Hanya jalan di desktop > 768px)
const revealImg = document.getElementById("reveal-img");
const expRows = document.querySelectorAll(".exp-row");

if (
  revealImg &&
  expRows.length > 0 &&
  window.matchMedia("(min-width: 768px)").matches
) {
  document.addEventListener("mousemove", (e) => {
    gsap.to(revealImg, {
      x: e.clientX + 30,
      y: e.clientY - 150,
      duration: 0.5,
      ease: "power3.out",
    });
  });
  expRows.forEach((row) => {
    row.addEventListener("mouseenter", () => {
      const imgSource = row.getAttribute("data-img");
      if (imgSource) {
        revealImg.src = imgSource;
        gsap.to(revealImg, {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
        });
      }
    });
    row.addEventListener("mouseleave", () => {
      gsap.to(revealImg, { opacity: 0, scale: 0.8, duration: 0.3 });
    });
  });
}

// --- 7. NEW REVEAL SYSTEM (INI BARU BRO) ---
// Fungsinya buat animasiin elemen yang punya atribut 'data-reveal'
const initReveal = () => {
  if (!("IntersectionObserver" in window)) return;

  const options = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.reveal * 100 || 0; // Baca delay dari data-reveal="1" dst

        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Targetin semua elemen Hero & Project baru
  document
    .querySelectorAll(
      ".hero__title, .hero__subtitle, .hero__actions, .hero__visual, .project-item",
    )
    .forEach((el) => {
      observer.observe(el);
    });
};

// Panggil initReveal kalau gak ada preloader (fallback)
if (!loaderText) {
  initReveal();
}
