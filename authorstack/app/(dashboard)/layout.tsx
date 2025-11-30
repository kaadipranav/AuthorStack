export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-paper">
      {/* Topbar - will be implemented with actual components */}
      <header className="sticky top-0 z-50 w-full border-b border-stroke bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
        <div className="container flex h-14 items-center">
          <div className="font-heading font-bold text-burgundy">AuthorStack</div>
          <div className="flex-1 mx-4">
            {/* Global search placeholder */}
          </div>
          <div className="flex items-center gap-4">
            {/* User menu placeholder */}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - will be implemented with actual components */}
        <aside className="hidden md:flex w-56 flex-col border-r border-stroke bg-surface">
          <nav className="flex-1 p-4 space-y-2">
            <div className="text-small text-muted-foreground">Navigation placeholder</div>
          </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Right insights rail - optional */}
        <aside className="hidden xl:flex w-72 flex-col border-l border-stroke bg-surface p-4">
          <div className="text-small text-muted-foreground">Insights rail placeholder</div>
        </aside>
      </div>
    </div>
  )
}
