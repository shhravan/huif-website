/**
 * The closing band's light: a still wash from the top-right corner, stone through a pale Marine tint into
 * Marine, under a still film grain. Decorative only.
 */
export default function FooterLight() {
  return (
    <div className="footer-light" aria-hidden="true">
      <div className="footer-light__wash" />
      <div className="footer-light__grain" />
    </div>
  );
}
