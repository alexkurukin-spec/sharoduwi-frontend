/**
 * Fly-to-cart (wow-фича №2 аддона): миниатюра «летит» в иконку корзины.
 * Чистый DOM + Web Animations API (без Canvas/клонирования React-дерева).
 * Иконка корзины должна иметь id="cart-icon". Уважает prefers-reduced-motion.
 */
export function flyToCart(fromEl: HTMLElement | null, imageSrc: string): void {
  if (typeof window === "undefined" || !fromEl) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const target = document.getElementById("cart-icon");
  if (!target) return;

  const from = fromEl.getBoundingClientRect();
  const to = target.getBoundingClientRect();

  const clone = document.createElement("img");
  clone.src = imageSrc;
  clone.style.cssText = `position:fixed;left:${from.left}px;top:${from.top}px;width:${from.width}px;height:${from.height}px;object-fit:cover;border-radius:12px;z-index:60;pointer-events:none;will-change:transform,opacity;`;
  document.body.appendChild(clone);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);

  const anim = clone.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 40}px) scale(0.6)`, opacity: 0.9, offset: 0.6 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.1)`, opacity: 0.2 },
    ],
    { duration: 650, easing: "cubic-bezier(0.5, 0, 0.75, 0)" },
  );

  anim.onfinish = () => {
    clone.remove();
    target.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
      { duration: 300, easing: "ease-out" },
    );
  };
}
