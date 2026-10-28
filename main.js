/* ==========================================================
   Jimi Store — إعدادات المتجر (غيّر الرقم من هنا فقط)
   ========================================================== */
const STORE = {
  // الرقم بصيغة دولية بدون + أو أصفار (السودان: 249 + الرقم بدون الصفر الأول)
  waNumber: "249116583108",
  defaultMessage: "السلام عليكم، عندي استفسار من موقع Jimi Store",
};

const waUrl = (text) =>
  `https://wa.me/${STORE.waNumber}?text=${encodeURIComponent(text)}`;

/* ---------- روابط واتساب ---------- */
document.querySelectorAll("[data-wa]").forEach((el) => {
  el.href = waUrl(el.dataset.waText || STORE.defaultMessage);
  el.target = "_blank";
  el.rel = "noopener";
});

/* ---------- قائمة الموبايل ---------- */
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ---------- نموذج التواصل: يفتح واتساب برسالة جاهزة ---------- */
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const message = form.elements.message.value.trim();
    const text = `السلام عليكم، أنا ${name}.\n${message}`;
    window.open(waUrl(text), "_blank", "noopener");
  });
}

/* ---------- صفحة المنتجات: الفلترة ---------- */
const catalog = document.getElementById("catalog");
if (catalog) {
  const chips = document.querySelectorAll(".chip");
  const items = catalog.querySelectorAll(".product");
  const empty = document.getElementById("empty");

  const applyFilter = (color) => {
    let shown = 0;
    items.forEach((item) => {
      const match = color === "all" || item.dataset.color === color;
      item.hidden = !match;
      if (match) shown++;
    });
    chips.forEach((c) =>
      c.setAttribute("aria-pressed", String(c.dataset.filter === color))
    );
    empty.hidden = shown !== 0;
  };

  chips.forEach((chip) =>
    chip.addEventListener("click", () => applyFilter(chip.dataset.filter))
  );

  // يدعم الروابط مثل products.html?color=brown (من الصفحة الرئيسية)
  const wanted = new URLSearchParams(location.search).get("color");
  const valid = [...chips].some((c) => c.dataset.filter === wanted);
  applyFilter(valid ? wanted : "all");

  /* ---------- تكبير الصورة ---------- */
  const box = document.getElementById("lightbox");
  const boxImg = box.querySelector("img");
  const boxTitle = box.querySelector("[data-title]");
  const boxOrder = box.querySelector("[data-order]");

  catalog.querySelectorAll(".product-photo").forEach((btn) =>
    btn.addEventListener("click", () => {
      const card = btn.closest(".product");
      const img = btn.querySelector("img");
      boxImg.src = img.src;
      boxImg.alt = img.alt;
      boxTitle.textContent = card.querySelector("h3").textContent;
      boxOrder.href = card.querySelector(".btn").href;
      box.showModal();
    })
  );
  box.querySelector("[data-close]").addEventListener("click", () => box.close());
  box.addEventListener("click", (e) => {
    if (e.target === box) box.close();
  });
}
