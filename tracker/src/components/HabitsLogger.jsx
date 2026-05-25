export default function HabitsLogger({ dailyData, onUpdateData }) {
  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-white tracking-tight">Hábitos</h2>

      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-6">
        <div>
          <label className="text-xs text-slate-400 font-bold mb-2 block">PESO CORPORAL (KG)</label>
          <input 
            type="number" 
            value={dailyData.weight || ''}
            onChange={(e) => onUpdateData('weight', e.target.value)}
            placeholder="Ej. 74.5"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-400 font-mono"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 font-bold mb-2 block">HORAS DE SUEÑO</label>
          <input 
            type="number" 
            value={dailyData.sleep || ''}
            onChange={(e) => onUpdateData('sleep', e.target.value)}
            placeholder="Ej. 8"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-400 font-mono"
          />
        </div>

        <div className="flex items-center justify-between bg-slate-950 border border-slate-800 p-4 rounded-lg">
          <div>
            <h4 className="text-sm font-bold text-slate-200">Lectura 30 min</h4>
            <p className="text-xs text-slate-500">¿Completaste tu sesión de hoy?</p>
          </div>
          <button 
            onClick={() => onUpdateData('reading30min', !dailyData.reading30min)}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${dailyData.reading30min ? 'bg-emerald-500' : 'bg-slate-800'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform absolute ${dailyData.reading30min ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>
    </div>
  )
}