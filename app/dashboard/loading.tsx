export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background flex">
      <aside className="hidden md:flex w-64 flex-col gap-4 p-6 bg-white dark:bg-accent border-r border-gray-100 dark:border-white/5">
        <div className="h-10 w-40 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
        <div className="space-y-2 mt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-full bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-accent border-b border-gray-100 dark:border-white/5 flex items-center px-6 gap-4">
          <div className="h-6 w-6 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />
          <div className="h-6 w-48 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <div className="h-10 w-64 bg-gray-200 dark:bg-white/10 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
