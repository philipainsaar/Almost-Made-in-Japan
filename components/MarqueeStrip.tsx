export function MarqueeStrip({ children, tone = 'blue' }: { children: React.ReactNode; tone?: 'blue' | 'pink' }) {
  return (
    <div className={`marquee-strip ${tone}`}>
      <div>
        <span>{children}</span>
        <span>{children}</span>
      </div>
    </div>
  );
}
