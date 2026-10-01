/** "Grafish" printed in three drums: pink and blue passes slightly off register under black ink. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`wordmark ${className ?? ""}`}>
      <span data-pass="pink" aria-hidden="true">
        Grafish
      </span>
      <span data-pass="blue" aria-hidden="true">
        Grafish
      </span>
      <span data-pass="ink">Grafish</span>
    </span>
  );
}
