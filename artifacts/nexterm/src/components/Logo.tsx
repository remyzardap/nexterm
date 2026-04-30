export function NexTermLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D9FF" />
          <stop offset="100%" stopColor="#A259FF" />
        </linearGradient>
      </defs>
      <path d="M12 8L6 20L12 32" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M28 8L34 20L28 32" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M18 28L22 12" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function NexTermWordmark({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <NexTermLogo className="w-8 h-8" />
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em', color: '#E8ECF1' }}>
        NexTerm
      </span>
    </div>
  );
}
