/**
 * Zerlegt den Textinhalt von `el` in `<span class="word">`-Elemente
 * (vorhandene `<br />`-Zeilenumbrüche bleiben erhalten) und animiert sie
 * beim Scrollen von `opacity: 0.15` auf `1`.
 *
 * Desktop (>= 1024px): Pin + Scroll-Scrub via GSAP ScrollTrigger
 * (analog welance.com) – die Wörter färben sich während des Scrollens
 * durch eine 200vh-Wrapper-Zone sequenziell ein.
 *
 * Mobile (< 1024px): einmaliges, gestaffeltes Fade-in via
 * IntersectionObserver beim ersten Eintritt in den Viewport.
 *
 * Respektiert `prefers-reduced-motion: reduce` (Wörter sofort sichtbar,
 * kein Pin, kein Observer).
 */
export function initWordReveal(el: HTMLElement): void {
  const words = wrapWords(el);
  if (words.length === 0) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    words.forEach((word) => {
      word.style.opacity = "1";
    });
    return;
  }

  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

  if (isDesktop) {
    void initDesktopScrub(el, words);
  } else {
    initMobileStagger(el, words);
  }
}

function wrapWords(el: HTMLElement): HTMLSpanElement[] {
  const words: HTMLSpanElement[] = [];

  Array.from(el.childNodes).forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE) return;

    const text = node.textContent ?? "";
    const fragment = document.createDocumentFragment();

    text.split(/(\s+)/).forEach((part) => {
      if (part.length === 0) return;

      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(part));
        return;
      }

      const span = document.createElement("span");
      span.className = "word";
      span.style.opacity = "0.15";
      span.textContent = part;
      fragment.appendChild(span);
      words.push(span);
    });

    node.replaceWith(fragment);
  });

  return words;
}

async function initDesktopScrub(
  el: HTMLElement,
  words: HTMLSpanElement[],
): Promise<void> {
  const { default: gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);

  const wrapper = document.createElement("div");
  wrapper.style.height = "200vh";
  wrapper.style.position = "relative";

  el.parentElement?.insertBefore(wrapper, el);
  wrapper.appendChild(el);

  el.style.position = "sticky";
  el.style.top = "50%";
  el.style.transform = "translateY(-50%)";

  gsap.to(words, {
    opacity: 1,
    stagger: 1 / words.length,
    ease: "none",
    scrollTrigger: {
      trigger: wrapper,
      start: "top top",
      end: "+=100%",
      scrub: true,
    },
  });
}

function initMobileStagger(
  el: HTMLElement,
  words: HTMLSpanElement[],
  staggerMs = 30,
): void {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        words.forEach((word, i) => {
          const delay = i * staggerMs;
          word.style.transition = `opacity 0.4s ease ${delay}ms`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              word.style.opacity = "1";
            });
          });
        });

        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.2 },
  );

  observer.observe(el);
}
