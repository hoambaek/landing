/** ObservationImageSection — Part B: Full-bleed image after Observation */

export default function ObservationImageSection() {
  return (
    <section className="s-obs-img reveal" aria-label="해저 숙성">
      <img
        src="/images/f2.webp"
        alt="해저 숙성"
        className="s-obs-img__photo"
        loading="lazy"
        decoding="async"
      />
    </section>
  );
}
