export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'calendar', icon: '📆', label: 'Calendario' },
    { id: 'workout', icon: '🏋🏻‍♀️', label: 'Rutina' },
    { id: 'habits', icon: '🎯', label: 'Hábitos' },
    { id: 'journal', icon: '📖', label: 'Diario' },
    { id: 'cals', icon: '🥚', label: 'Buscar' }
  ]

  return (
    <nav className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around p-3 pb-4 z-10">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          onClick={() => setActiveTab(tab.id)} 
          className={`flex flex-col items-center w-full py-1 ${activeTab === tab.id ? 'text-emerald-400 scale-110 transition-transform' : 'text-slate-500'}`}
        >
          <span className="text-xl mb-1">{tab.icon}</span>
        </button>
      ))}
    </nav>
  )
}