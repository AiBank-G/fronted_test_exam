export default function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  const xInView = rect.x < window.innerWidth && rect.x + rect.width > 0;
  const yInView = rect.y < window.innerHeight && rect.y + rect.height > 0;
  return xInView && yInView;
}
