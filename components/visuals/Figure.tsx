/** Shared frame for produced diagrams: title, body, visible source caption. */
export default function Figure({
  title,
  caption,
  children,
}: {
  title?: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="not-prose my-8 border border-ink-200 bg-white">
      {title && (
        <div className="px-5 pt-5 sm:px-7 sm:pt-6">
          <p className="eyebrow">Diagram</p>
          <p className="display-serif text-lg sm:text-xl text-ink-900 mt-1">{title}</p>
        </div>
      )}
      <div className="px-5 py-5 sm:px-7 sm:py-6">{children}</div>
      <figcaption className="px-5 pb-5 sm:px-7 text-xs text-ink-500 font-light leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}
