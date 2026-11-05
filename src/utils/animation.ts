/**
 * Animation Pattern directly from prompt:
 * All sections use a reusable fadeUp helper with staggered delays:
 * const fadeUp = (delay: number) => ({
 *   initial: { opacity: 0, y: 20 },
 *   whileInView: { opacity: 1, y: 0 },
 *   viewport: { once: true, margin: "-100px" },
 *   transition: { duration: 0.6, delay, ease: "easeOut" },
 * });
 */
export const fadeUp = (delay: number = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});
