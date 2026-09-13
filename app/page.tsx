// File: app/page.tsx
export default function HomePage() {
  return (
    <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface border border-line rounded-full shadow-xs text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold tracking-wider">SYSTEM ONLINE // PHASE 1 VERIFIED</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif italic text-ink">
          Nhut Nguyen — Visual Archive
        </h1>
        <p className="font-sans text-sm text-muted max-w-md mx-auto">
          Tailwind v4 tokens, CSS variable fonts, and clean server boundary active.
        </p>
      </div>
    </main>
  );
}