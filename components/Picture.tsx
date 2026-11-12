import { asset } from "@/lib/asset";
import type { Photo } from "@/content/site";

/** One of the team's photographs, served at the right width. */
export default function Picture({
  photo,
  sizes,
  className = "",
  priority = false,
}: {
  photo: Photo;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const [small, large] = photo.w;
  const src = (w: number) => asset(`/photos/${photo.name}-${w}.webp`);
  return (
    <img
      className={className}
      src={src(large)}
      srcSet={`${src(small)} ${small}w, ${src(large)} ${large}w`}
      sizes={sizes}
      width={large}
      height={Math.round(large / photo.ratio)}
      alt={photo.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
