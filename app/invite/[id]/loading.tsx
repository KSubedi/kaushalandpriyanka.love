export default function Loading() {
  return (
    <main className="min-h-screen bg-white font-inter relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-white to-amber-50/50" />
        <div className="absolute inset-0 bg-[url('/mandala-pattern.png')] bg-repeat-space opacity-[0.05] mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-tl from-red-100/10 via-transparent to-amber-100/10" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 text-red-500">
                <div className="w-12 h-12 rounded-full bg-red-500/50 animate-pulse" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-12 bg-amber-100/50 rounded-lg animate-pulse mx-auto max-w-[300px]" />
              <div className="h-6 bg-gray-100/50 rounded-lg animate-pulse mx-auto max-w-[400px]" />
            </div>
          </div>

          <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-100">
            <div className="w-full max-w-md mx-auto space-y-6">
              <div className="h-12 bg-white/50 rounded-xl animate-pulse" />
              <div className="h-12 bg-white/50 rounded-xl animate-pulse" />
              <div className="h-12 bg-white/50 rounded-xl animate-pulse" />
              <div className="h-12 bg-red-100/50 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
