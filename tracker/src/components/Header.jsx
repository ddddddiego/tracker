export default function Header({ selectedDate }) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white tracking-tight">Mi Tracker</h1>
      <span className="text-emerald-400 text-sm font-mono">{selectedDate}</span>
    </header>
  )
}