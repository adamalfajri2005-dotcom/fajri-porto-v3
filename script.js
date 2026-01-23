// --- 00. DEVELOPER SIGNATURE ---
console.log(
  "%c  ADAM ALFAJRI  \n%c  VISUAL THINKER  ",
  "color: black; background: #ff3300; font-size: 24px; font-weight: bold; padding: 10px; border-radius: 4px;",
  "color: #ff3300; background: #050505; font-size: 16px; padding: 5px; border: 1px solid #ff3300; border-radius: 4px;",
);
console.log(
  "%cLooking at the code? Let's cook something together: adamalfajri2005@gmail.com 👨‍🍳",
  "color: #888; font-family: monospace; font-size: 12px; margin-top: 5px;",
);

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// --- 0. INITIALIZE SMOOTH SCROLL (LENIS) ---
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothTouch: false, // Touchscreen normal aja biar ga berat
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sambungin Lenis ke GSAP
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- 0.1 GLOBAL REVEAL ANIMATION (AWWWARDS STYLE) ---
// Target semua elemen penting biar munculnya smooth dari bawah
const revealElements = document.querySelectorAll(
  ".section-title, .section-label, .about-text p, .project-card, .process-item",
);

revealElements.forEach((element) => {
  gsap.fromTo(
    element,
    {
      y: 50,
      opacity: 0,
    },
    {
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
    },
  );
});

// --- 1. CUSTOM CURSOR LOGIC (DESKTOP ONLY) ---
if (window.matchMedia("(min-width: 768px)").matches) {
  const cursor = document.getElementById("cursor");
  const hoverables = document.querySelectorAll(".hoverable");

  document.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.1,
      ease: "power2.out",
    });
  });

  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hovered"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hovered"));
  });
}

// --- 2. LOADING SCREEN (SHUTTER EFFECT) ---
const loaderText = document.getElementById("loader-text");
let progress = 0;

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

  // Animasi Hero Text Muncul
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

// --- 6. COMPACT MENU TOGGLE ---
const menuPanel = document.getElementById("menu-panel");
const menuBtnText = document.getElementById("menu-btn-text");
let isMenuOpen = false;

function toggleMenu() {
  if (!isMenuOpen) {
    // BUKA MENU
    menuPanel.classList.add("active");
    if (menuBtnText) {
      menuBtnText.innerText = "CLOSE";
      menuBtnText.dataset.value = "CLOSE";
    }
    isMenuOpen = true;
  } else {
    // TUTUP MENU
    menuPanel.classList.remove("active");
    if (menuBtnText) {
      menuBtnText.innerText = "MENU";
      menuBtnText.dataset.value = "MENU";
    }
    isMenuOpen = false;
  }
}

// Fitur Tambahan: Klik di luar menu buat nutup otomatis
document.addEventListener("click", (e) => {
  // Cek apakah kliknya BUKAN di dalam menu DAN BUKAN di tombol menu
  if (
    isMenuOpen &&
    !menuPanel.contains(e.target) &&
    !e.target.closest(".menu-btn")
  ) {
    toggleMenu();
  }
});

// =========================================
// ENGINEER CARD REVEAL (THE CENTER UNVEIL)
// =========================================

const engineerCard = document.querySelector(".engineer-card");

if (engineerCard) {
  gsap.fromTo(
    engineerCard,
    {
      // STATE AWAL (SEBELUM MUNCUL)
      clipPath: "inset(0% 50% 0% 50%)", // Tertutup rapat di tengah (Kiri 50%, Kanan 50%)
      scale: 0.9, // Agak kecil (mundur)
      autoAlpha: 0, // Transparan
      y: 50, // Turun dikit (muncul dari bawah)
    },
    {
      // STATE AKHIR (MUNCUL FULL)
      clipPath: "inset(0% 0% 0% 0%)", // Terbuka full
      scale: 1, // Ukuran normal
      autoAlpha: 1, // Jelas
      y: 0, // Posisi normal
      ease: "power3.out", // Easing smooth mahal
      scrollTrigger: {
        trigger: engineerCard,
        start: "top 85%", // Mulai pas card-nya nongol dikit
        end: "top 40%", // Selesai pas card di tengah layar
        scrub: 1, // Animasi ngikutin jempol scroll (Maju-Mundur)
      },
    },
  );
}

// --- 9. COPY TO CLIPBOARD FEATURE ---
const copyBtn = document.getElementById("copyBtn");
const toast = document.getElementById("toast");

if (copyBtn && toast) {
  copyBtn.addEventListener("click", () => {
    const email = copyBtn.getAttribute("data-email");

    navigator.clipboard.writeText(email).then(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";

      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(100px)";
      }, 2500);
    });
  });
}

// =========================================
// INSPECTOR DRAWER LOGIC
// =========================================
function openDrawer(projectId) {
  const drawer = document.getElementById("project-drawer");
  const allContents = document.querySelectorAll(".drawer-content");

  // 1. Umpetin semua konten dulu
  allContents.forEach((el) => el.classList.add("hidden"));

  // 2. Munculin konten yang dipilih
  const targetContent = document.getElementById("content-" + projectId);
  if (targetContent) {
    targetContent.classList.remove("hidden");
  }

  // 3. Buka Drawernya (Slide-in)
  drawer.classList.add("open");

  // 4. Stop scroll body biar fokus di drawer
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  const drawer = document.getElementById("project-drawer");

  // 1. Tutup Drawer
  drawer.classList.remove("open");

  // 2. Balikin scroll body
  document.body.style.overflow = "auto";
}

// =========================================
// POWER USER SHORTCUTS (KEYBOARD CONTROL)
// =========================================
document.addEventListener("keydown", (e) => {
  // 1. TOMBOL ESCAPE (Hukum Wajib UX: Escape = Keluar/Tutup)
  if (e.key === "Escape") {
    // Cek apakah Drawer lagi kebuka? Kalau iya, tutup.
    const drawer = document.getElementById("project-drawer");
    const menuPanel = document.getElementById("menu-panel"); // Asumsi lu pake menu panel yg tadi

    if (drawer.classList.contains("open")) {
      closeDrawer();
      console.log("CMD: DRAWER_CLOSED");
    } else if (menuPanel && menuPanel.classList.contains("active")) {
      // Tutup menu kalau ada fungsi tutup menu
      menuPanel.classList.remove("active");
    }
  }

  // 2. TOMBOL 'M' (Menu Toggle)
  // (Opsional: Kalau lu mau user bisa buka menu pake M)
  if (e.key === "m" || e.key === "M") {
    // Masukin logika buka menu lu di sini (contoh simulasi klik tombol menu)
    const menuBtn = document.querySelector(".menu-btn");
    if (menuBtn) menuBtn.click();
  }
});

// =========================================
// SCROLL SPY (SECTION TRACKING)
// =========================================
const sections = document.querySelectorAll("section"); // Pastiin section lu punya tag <section>
const navLinks = document.querySelectorAll(".menu-link"); // Link di menu lu

const observerOptions = {
  threshold: 0.3, // Trigger pas 30% section kelihatan
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // 1. Dapet ID section yang lagi aktif (misal: 'work')
      const currentId = entry.target.getAttribute("id");

      // 2. (Opsional) Update URL tanpa reload biar bisa dicopy
      // history.replaceState(null, null, `#${currentId}`);

      // 3. Highlight Menu (Kalau lu mau menu-nya nyala)
      // Logic: Cari link yang href-nya cocok sama id, kasih class active
      console.log("USER IS READING: " + currentId.toUpperCase());
    }
  });
}, observerOptions);

sections.forEach((section) => {
  observer.observe(section);
});

// =========================================
// OUTSIDE CLICK (UX SAFETY NET)
// =========================================
document.addEventListener("click", (e) => {
  const menuPanel = document.getElementById("menu-panel");
  const menuBtn = document.querySelector(".menu-btn"); // Tombol pemicu

  // Cek: Kalau menu lagi aktif...
  if (menuPanel && menuPanel.classList.contains("active")) {
    // ...DAN yang diklik BUKAN menu panel DAN BUKAN tombol menu
    if (!menuPanel.contains(e.target) && !menuBtn.contains(e.target)) {
      // Tutup Menu
      menuPanel.classList.remove("active");
    }
  }
});

// =========================================
// BLAST DOOR EFFECT (SCROLL REVEAL)
// =========================================

// Kita cek dulu elemennya ada ga
const blastDoor = document.querySelector(".blast-door");

if (blastDoor) {
  // Set state awal: TERTUTUP (Dipotong habis dari kanan)
  gsap.set(blastDoor, {
    clipPath: "inset(0 100% 0 0)", // Artinya: Kanan kepotong 100%
  });

  // Animasi Buka Tutup
  gsap.to(blastDoor, {
    clipPath: "inset(0 0% 0 0)", // Target: Kanan kepotong 0% (Kelihatan Full)
    ease: "none", // Gerakan linear ngikutin scroll (jangan pake elastic)
    scrollTrigger: {
      trigger: blastDoor,
      start: "top 85%", // Mulai buka pas elemen nongol dikit di bawah
      end: "center center", // Selesai buka pas elemen di tengah layar
      scrub: 1, // PENTING: Angka 1 bikin ada delay halus (smooth) pas nge-scrub
      // markers: true, // Hapus komen ini kalo mau liat garis debug
    },
  });
}

// =========================================
// HERO SPLIT SCROLL + DESC REVEAL
// =========================================
const wordLeft = document.querySelector(".word-left");
const wordRight = document.querySelector(".word-right");
const heroDesc = document.querySelector(".hero-reveal-desc"); // Ambil elemen deskripsi
const heroSection = document.querySelector(".hero-section");

if (wordLeft && wordRight && heroSection) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: heroSection,
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  });

  // 1. ADAM Geser Kiri
  tl.to(wordLeft, { xPercent: -60, autoAlpha: 0 }, 0);

  // 2. ALFAJRI Geser Kanan
  tl.to(wordRight, { xPercent: 60, autoAlpha: 0 }, 0);

  // 3. DESKRIPSI MUNCUL (Fade In + Turun dikit ke posisi normal)
  if (heroDesc) {
    tl.to(
      heroDesc,
      {
        autoAlpha: 1,
        y: "-50%", // Balik ke tengah vertikal
        scale: 1.1, // Zoom in dikit biar dramatis
        duration: 0.5,
      },
      0,
    ); // "0" biar barengan sama nama yg misah
  }
}
