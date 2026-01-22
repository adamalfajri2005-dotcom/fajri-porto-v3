// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// --- 1. CUSTOM CURSOR LOGIC (DESKTOP ONLY) ---
// Kita kasih "Satpam": Cuma jalan kalo layar lebar (> 768px)
if (window.matchMedia("(min-width: 768px)").matches) {
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
}

// --- 2. LOADING SCREEN (SHUTTER EFFECT) ---
const loaderText = document.getElementById("loader-text");
let progress = 0;

// Cek dulu elemennya ada ga (biar ga error)
if (loaderText) {
  const loadingInterval = setInterval(() => {
    progress++;
    loaderText.innerText = progress + "%";

    if (progress === 100) {
      clearInterval(loadingInterval);
      startEntranceAnim();
    }
  }, 20);
}

function startEntranceAnim() {
  gsap.to(loaderText, { opacity: 0, duration: 0.5 });
  gsap.to(".blind", {
    scaleY: 0,
    stagger: 0.1,
    duration: 1.2,
    ease: "power4.inOut",
    onComplete: () => {
      const shutter = document.getElementById("shutter");
      if (shutter) shutter.style.display = "none";
    },
  });
  gsap.to(".reveal-hero", {
    y: 0,
    opacity: 1,
    stagger: 0.1,
    duration: 1.5,
    delay: 0.5,
    ease: "power4.out",
  });
}

// --- 3. SCRAMBLE TEXT EFFECT ---
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const scrambleElements = document.querySelectorAll(".scramble-hover");

scrambleElements.forEach((item) => {
  // Di HP ganti jadi click event biar ga aneh, atau biarin mouseover tapi jarang kepake
  item.addEventListener("mouseover", (event) => {
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
  });
});

// --- 4. SMOOTH SCROLL (LENIS) ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  // Di HP kita bikin scrollnya normal aja biar ga berat
  smoothTouch: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- 5. IMAGE REVEAL (DESKTOP ONLY) ---
const revealImg = document.getElementById("reveal-img");
const expRows = document.querySelectorAll(".exp-row");

if (window.matchMedia("(min-width: 768px)").matches && revealImg) {
  document.addEventListener("mousemove", (e) => {
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

// --- 7. PROJECT REVEAL ANIMATION (AWWWARDS STYLE) ---
const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card) => {
  const imgWrapper = card.querySelector(".card-img-wrapper");
  const img = card.querySelector(".project-img");

  // Animasi 1: Tirai Terbuka (Clip Path)
  gsap.to(imgWrapper, {
    scrollTrigger: {
      trigger: card,
      start: "top 80%", // Mulai pas elemen masuk 80% layar
      end: "top 20%",
      toggleActions: "play none none reverse",
    },
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", // Buka full
    duration: 1.2,
    ease: "power4.inOut",
  });

  // Animasi 2: Gambar Zoom Out (Parallax halus)
  gsap.fromTo(
    img,
    { scale: 1.3 }, // Mulai dari agak nge-zoom
    {
      scale: 1, // Jadi normal pas scroll
      scrollTrigger: {
        trigger: card,
        start: "top 100%",
        end: "bottom 0%",
        scrub: true, // Gerak ngikutin scroll mouse
      },
      ease: "none",
    },
  );
});

function toggleMenu() {
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
}
