import { useState } from "react"

export default function HabitsLogger({ dailyData, onUpdateData }) {
    return (
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-5">
            <h3 className="text-emerald-400 font-semibold text-lg mb-2">Hábitos Diarios</h3>

            <div>
                <label className="block text-slate-400 text-sm mb-1 ml-1">Peso (kg)</label>
                <input
                    type="number"
                    step="0.1"
                    value={dailyData.weight || ''}
                    onChange={(e) => onUpdateData('weight', e.target.value)}
                    placeholder="Ingresar peso..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
                />
            </div>

            <div>
                <label className="block text-slate-400 text-sm mb-1 ml-1">Sueño (hrs)</label>
                <input
                    type="number"
                    step="0.5"
                    value={dailyData.sleep || ''}
                    onChange={(e) => onUpdateData('sleep', e.target.value)}
                    placeholder="Horas dormidas..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
                />
            </div>

            <div>
                <label className="block text-slate-400 text-sm mb-1 ml-1">Lectura</label>
                <button
                    type="button"
                    onClick={() => onUpdateData('reading30min', !dailyData.reading30min)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center ${
                        dailyData.reading30min
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : 'bg-slate-950 border-slate-700 text-slate-400'
                    }`}
                >
                    <span className="font-medium text-sm">¿Leíste 30 min hoy?</span>
                    <span className="text-lg">{dailyData.reading30min ? '✅' : '❌'}</span>
                </button>
            </div>
        </div>
    )
}