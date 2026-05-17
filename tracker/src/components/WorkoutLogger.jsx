import { useState } from 'react'

export default function WorkoutLogger({ onSaveSet, routineName, setRoutineName, knownExercises }) {
    const [exercise, setExercise] = useState('')
    const [reps, setReps] = useState('')
    const [weight, setWeight] = useState('')

    const handleAddSet = (e) => {
        e.preventDefault()
        onSaveSet({ exercise, weight, reps })
        setWeight('')
        setReps('')
    }

    return (
        <div className="bg-slate-900 p-5 rounded-2xl shadow-lg border border-slate-800">
            <h3 className="text-emerald-400 font-semibold mb-4 text-lg">Registrar Serie</h3>

            <form onSubmit={handleAddSet} className="space-y-4">
                {/* Nombre Rutina */}
                <div>
                    <label className="block text-slate-400 text-sm mb-1 ml-1">Rutina de hoy</label>
                    <input
                        type="text"
                        value={routineName}
                        onChange={(e) => setRoutineName(e.target.value)}
                        placeholder="Enfoque de hoy"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-all font-semibold"
                    />
                </div>

                <hr className="border-slate-800" />

                {/* Campo de Ejercicio con Autocompletado */}
                <div>
                    <label className="block text-slate-400 text-sm mb-1 ml-1">Ejercicio</label>
                    <input
                        list="exercise-history"
                        type="text"
                        value={exercise}
                        onChange={(e) => setExercise(e.target.value)}
                        placeholder="Ingresa un ejercicio..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                        required
                    />
                    <datalist id="exercise-history">
                        {knownExercises.map((ex, i) => (
                            <option key={i} value={ex} />
                        ))}
                    </datalist>
                </div>

                {/* Peso y Reps */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-slate-400 text-sm mb-1 ml-1">Peso (kg)</label>
                        <input
                            type="number"
                            step="0.5"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder=""
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-all text-center text-lg"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-slate-400 text-sm mb-1 ml-1">Reps</label>
                        <input
                            type="number"
                            value={reps}
                            onChange={(e) => setReps(e.target.value)}
                            placeholder=""
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500 transition-all text-center text-lg"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition-colors mt-2"
                >
                    Agregar Serie
                </button>
            </form>
        </div>
    )
}