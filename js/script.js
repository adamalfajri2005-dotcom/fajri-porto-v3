// ISI FILE: js/script.js

gsap.registerPlugin(ScrollTrigger);

// 1. SCRAMBLE TEXT
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
document.querySelectorAll(".scramble-hover").forEach((item) => {
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

// 2. SHUTTER LOADER (CLEAN)
let count = 0;
const loaderText = document.getElementById("loader-text");
const interval = setInterval(() => {
  count++;
  loaderText.innerText = count + "%";
  if (count === 100) {
    clearInterval(interval);
    gsap.to(loaderText, { opacity: 0, duration: 0.5 });
    gsap.to(".blind", {
      scaleY: 0,
      stagger: 0.1,
      duration: 1.2,
      ease: "power4.inOut",
      onComplete: () => {
        document.getElementById("shutter").style.display = "none";
      },
    });
    gsap.to(".reveal-hero", {
      y: 0,
      opacity: 1,
      stagger: 0.1,
      duration: 1.5,
      delay: 0.8,
      ease: "power4.out",
    });
  }
}, 15);

// 3. SMOOTH SCROLL (LENIS)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

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

// 4. MENU
let menuOpen = false;
const menuTl = gsap.timeline({ paused: true });
menuTl.to("#menu-overlay", { y: "0%", duration: 0.8, ease: "power4.inOut" });

function toggleMenu() {
  if (!menuOpen) {
    menuTl.play();
    document.getElementById("menu-btn-text").innerText = "CLOSE";
    document.getElementById("menu-btn-text").dataset.value = "CLOSE";
  } else {
    menuTl.reverse();
    document.getElementById("menu-btn-text").innerText = "MENU";
    document.getElementById("menu-btn-text").dataset.value = "MENU";
  }
  menuOpen = !menuOpen;
}

// 5. SILKY SMOOTH CARD STACK (THE FIX)
let cards = gsap.utils.toArray(".card-item");

cards.forEach((card, i) => {
  const innerImg = card.querySelector(".card-image");

  // Animasi Kartu Utama
  gsap.to(card, {
    scale: 0.9,
    opacity: 0.3,
    filter: "blur(10px)",
    ease: "none",
    scrollTrigger: {
      trigger: card,
      start: "top 15%",
      endTrigger: cards[cards.length - 1],
      end: "top 15%",
      scrub: 1.5,
      toggleActions: "restart none none reverse",
    },
  });

  // Animasi Parallax Gambar Dalam
  if (innerImg) {
    gsap.to(innerImg, {
      y: "-15%",
      ease: "none",
      scrollTrigger: {
        trigger: card,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
      },
    });
  }
});

// 6. HOVER IMAGE REVEAL
const expRows = document.querySelectorAll(".exp-row");
const revealImg = document.getElementById("reveal-img");

if (window.matchMedia("(min-width: 768px)").matches) {
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

// 7. CUSTOM CURSOR
const cursor = document.getElementById("cursor");
if (window.matchMedia("(min-width: 768px)").matches) {
  document.addEventListener("mousemove", (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
  });
  document.querySelectorAll(".hoverable, a").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hovered"));
  });
}
