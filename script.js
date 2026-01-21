// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// --- 1. CUSTOM CURSOR LOGIC ---
const cursor = document.getElementById("cursor");
const hoverables = document.querySelectorAll(".hoverable");

// Gerakin cursor ngikutin mouse
document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: "power2.out",
  });
});

// Efek Hover (Membesar)
hoverables.forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hovered"));
});

// --- 2. LOADING SCREEN (SHUTTER EFFECT) ---
const loaderText = document.getElementById("loader-text");
let progress = 0;

const loadingInterval = setInterval(() => {
  progress++;
  loaderText.innerText = progress + "%";

  if (progress === 100) {
    clearInterval(loadingInterval);
    startEntranceAnim();
  }
}, 20); // Kecepatan loading (makin kecil makin cepet)

function startEntranceAnim() {
  // Hilangkan teks loading
  gsap.to(loaderText, { opacity: 0, duration: 0.5 });

  // Tarik tirai ke atas
  gsap.to(".blind", {
    scaleY: 0,
    stagger: 0.1,
    duration: 1.2,
    ease: "power4.inOut",
    onComplete: () => {
      document.getElementById("shutter").style.display = "none";
    },
  });

  // Munculin elemen Hero
  gsap.to(".reveal-hero", {
    y: 0,
    opacity: 1,
    stagger: 0.1,
    duration: 1.5,
    delay: 0.5,
    ease: "power4.out",
  });
}

// --- 3. SCRAMBLE TEXT EFFECT (Hacker Text) ---
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const scrambleElements = document.querySelectorAll(".scramble-hover");

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

// --- 4. SMOOTH SCROLL (LENIS) ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Connect Lenis scroll to ScrollTrigger
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- 5. IMAGE REVEAL (EXPERIENCE SECTION) ---
const revealImg = document.getElementById("reveal-img");
const expRows = document.querySelectorAll(".exp-row");

// Cuma aktif di desktop (layar > 768px)
if (window.matchMedia("(min-width: 768px)").matches) {
  document.addEventListener("mousemove", (e) => {
    // Gambar ngikutin mouse tapi agak lambat (smooth)
    gsap.to(revealImg, {
      x: e.clientX + 50,
      y: e.clientY - 150,
      duration: 0.6,
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

// --- 6. MENU OVERLAY ---
let menuOpen = false;
const menuTl = gsap.timeline({ paused: true });

menuTl.to("#menu-overlay", {
  y: "0%",
  duration: 0.8,
  ease: "power4.inOut",
});

function toggleMenu() {
  const btnText = document.getElementById("menu-btn-text");
  if (!menuOpen) {
    menuTl.play();
    btnText.innerText = "CLOSE";
    btnText.dataset.value = "CLOSE";
  } else {
    menuTl.reverse();
    btnText.innerText = "MENU";
    btnText.dataset.value = "MENU";
  }
  menuOpen = !menuOpen;
}
