const images = [
  { title: "Forest Stream",    category: "nature",  src: "https://picsum.photos/id/10/1200/900",   thumb: "https://picsum.photos/id/10/600/450"   },
  { title: "Mountain Lake",    category: "nature",  src: "https://picsum.photos/id/1015/1200/900", thumb: "https://picsum.photos/id/1015/600/450"  },
  { title: "Autumn Path",      category: "nature",  src: "https://picsum.photos/id/1035/1200/900", thumb: "https://picsum.photos/id/1035/600/450"  },
  { title: "Green Hills",      category: "nature",  src: "https://picsum.photos/id/137/1200/900",  thumb: "https://picsum.photos/id/137/600/450"   },
  { title: "Misty Valley",     category: "nature",  src: "https://picsum.photos/id/142/1200/900",  thumb: "https://picsum.photos/id/142/600/450"   },
  { title: "Wildflower Field", category: "nature",  src: "https://picsum.photos/id/155/1200/900",  thumb: "https://picsum.photos/id/155/600/450"   },
  { title: "City Skyline",     category: "cities",  src: "https://picsum.photos/id/1011/1200/900", thumb: "https://picsum.photos/id/1011/600/450"  },
  { title: "Urban Streets",    category: "cities",  src: "https://picsum.photos/id/1025/1200/900", thumb: "https://picsum.photos/id/1025/600/450"  },
  { title: "Downtown View",    category: "cities",  src: "https://picsum.photos/id/1043/1200/900", thumb: "https://picsum.photos/id/1043/600/450"  },
  { title: "Night Market",     category: "cities",  src: "https://picsum.photos/id/318/1200/900",  thumb: "https://picsum.photos/id/318/600/450"   },
  { title: "Bridge at Dusk",   category: "cities",  src: "https://picsum.photos/id/399/1200/900",  thumb: "https://picsum.photos/id/399/600/450"   },
  { title: "Cobblestone Lane", category: "cities",  src: "https://picsum.photos/id/433/1200/900",  thumb: "https://picsum.photos/id/433/600/450"   },
  { title: "Wild Lion",        category: "animals", src: "https://picsum.photos/id/582/1200/900",  thumb: "https://picsum.photos/id/582/600/450"   },
  { title: "Grazing Deer",     category: "animals", src: "https://picsum.photos/id/169/1200/900",  thumb: "https://picsum.photos/id/169/600/450"   },
  { title: "Forest Bird",      category: "animals", src: "https://picsum.photos/id/219/1200/900",  thumb: "https://picsum.photos/id/219/600/450"   },
  { title: "Roaming Horses",   category: "animals", src: "https://picsum.photos/id/240/1200/900",  thumb: "https://picsum.photos/id/240/600/450"   },
  { title: "Ocean Seagulls",   category: "animals", src: "https://picsum.photos/id/593/1200/900",  thumb: "https://picsum.photos/id/593/600/450"   },
  { title: "Mountain Goat",    category: "animals", src: "https://picsum.photos/id/659/1200/900",  thumb: "https://picsum.photos/id/659/600/450"   },
];

const CATEGORY_LABEL = { nature: "Nature", cities: "Cities", animals: "Animals" };

// ── Dynamic hero stats ───────────────────────────────────────
document.getElementById("statImages").textContent     = images.length;
document.getElementById("statCategories").textContent = new Set(images.map(i => i.category)).size;

// State
let currentFilter = "all";
let searchQuery   = "";
let lightboxIndex = -1;
let filtered      = [];

// Elements
const grid        = document.getElementById("galleryGrid");
const emptyState  = document.getElementById("emptyState");
const statsLabel  = document.getElementById("statsLabel");
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");
const lightbox    = document.getElementById("lightbox");
const lbImg       = document.getElementById("lbImg");
const lbTitle     = document.getElementById("lbTitle");
const lbBadge     = document.getElementById("lbBadge");
const lbCounter   = document.getElementById("lbCounter");

// ── Render ──────────────────────────────────────────────────
function renderGallery() {
  const q = searchQuery.trim().toLowerCase();

  filtered = images.filter(img => {
    const matchCat    = currentFilter === "all" || img.category === currentFilter;
    const matchSearch = !q || img.title.toLowerCase().includes(q) || img.category.includes(q);
    return matchCat && matchSearch;
  });

  grid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.style.display = "block";
    statsLabel.textContent   = "Showing 0 Images";
    return;
  }

  emptyState.style.display = "none";

  const catName = CATEGORY_LABEL[currentFilter];
  statsLabel.textContent = currentFilter === "all"
    ? `Showing ${filtered.length} Images`
    : `Showing ${filtered.length} ${catName} Images`;

  filtered.forEach((img, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${img.thumb}" alt="${img.title}" loading="lazy" />
      </div>
      <div class="card-info">
        <span class="card-title">${img.title}</span>
        <span class="badge badge-${img.category}">${CATEGORY_LABEL[img.category]}</span>
      </div>
    `;
    card.addEventListener("click", () => openLightbox(index));
    grid.appendChild(card);
  });
}

// ── Filters ─────────────────────────────────────────────────
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderGallery();
  });
});

// ── Search ───────────────────────────────────────────────────
searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  searchClear.style.display = searchQuery ? "block" : "none";
  renderGallery();
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchQuery       = "";
  searchClear.style.display = "none";
  renderGallery();
});

// ── Lightbox ─────────────────────────────────────────────────
function openLightbox(index) {
  lightboxIndex = index;
  showLightboxImage(false);
  lightbox.classList.add("open");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightboxIndex = -1;
}

function showLightboxImage(fade = true) {
  const img = filtered[lightboxIndex];

  if (fade) {
    lbImg.style.opacity = "0";
    setTimeout(() => {
      lbImg.src   = img.src;
      lbImg.alt   = img.title;
      lbImg.style.opacity = "1";
    }, 200);
  } else {
    lbImg.src = img.src;
    lbImg.alt = img.title;
    lbImg.style.opacity = "1";
  }

  lbTitle.textContent  = img.title;
  lbBadge.textContent  = CATEGORY_LABEL[img.category];
  lbBadge.className    = `badge badge-${img.category}`;
  lbCounter.textContent = `${lightboxIndex + 1} / ${filtered.length}`;
}

function nextImage() {
  lightboxIndex = (lightboxIndex + 1) % filtered.length;
  showLightboxImage(true);
}

function prevImage() {
  lightboxIndex = (lightboxIndex - 1 + filtered.length) % filtered.length;
  showLightboxImage(true);
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbNext").addEventListener("click", nextImage);
document.getElementById("lbPrev").addEventListener("click", prevImage);

lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

// ── Keyboard ─────────────────────────────────────────────────
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft")  prevImage();
  if (e.key === "Escape")     closeLightbox();
});

// ── Init ─────────────────────────────────────────────────────
renderGallery();
