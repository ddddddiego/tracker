export default function JournalLogger({ dailyData, onUpdateData }) {
    return (
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-emerald-400 font-semibold text-lg mb-2"></h3>
            
            <div>
                <label className="block text-slate-400 text-sm mb-3 ml-1">
                    ¿Cómo te sentiste hoy?
                </label>
                
                <textarea
                    value={dailyData.journal || ''}
                    onChange={(e) => onUpdateData('journal', e.target.value)}
                    placeholder="Escribe algo..."
                    className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none leading-relaxed"
                />
            </div>
            
            {/* Pequeño indicador visual de guardado automático */}
            <div className="flex justify-end pr-2">
                <span className="text-xs text-slate-500 italic">
                    Se guarda automáticamente al escribir.
                </span>
            </div>
        </div>
    )
}