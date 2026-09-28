(() => {
  const gallery = document.querySelector(".gallery");
  const viewport = gallery.querySelector(".screenshots");
  const scrollbar = gallery.querySelector(".gallery-scroll");

  const syncScrollbar = () => {
    const distance = viewport.scrollWidth - viewport.clientWidth;
    scrollbar.hidden = distance <= 1;
    scrollbar.value = distance > 0 ? String(100 * viewport.scrollLeft / distance) : "0";
    scrollbar.setAttribute("aria-valuetext", `${Math.round(Number(scrollbar.value))}%`);
    gallery.classList.toggle("has-scroll-control", distance > 1);
  };

  scrollbar.addEventListener("input", () => {
    const distance = viewport.scrollWidth - viewport.clientWidth;
    viewport.scrollLeft = distance * Number(scrollbar.value) / 100;
    scrollbar.setAttribute("aria-valuetext", `${Math.round(Number(scrollbar.value))}%`);
  });
  viewport.addEventListener("scroll", syncScrollbar, { passive: true });
  new ResizeObserver(syncScrollbar).observe(viewport);
  syncScrollbar();
})();
