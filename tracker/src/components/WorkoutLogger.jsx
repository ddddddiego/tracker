import { useState } from 'react'

export default function WorkoutLogger({ onSaveSet, routineName, setRoutineName, knownExercises, workoutHistory }) {
  const [exercise, setExercise] = useState('')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')

  const handleSave = (e) => {
    e.preventDefault()
    if (!exercise || !weight || !reps) return
    onSaveSet({ exercise, weight: Number(weight), reps: Number(reps) })
    setWeight('')
    setReps('')
    // Mantenemos el ejercicio seleccionado para agilizar el registro de la siguiente serie
  }

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-white tracking-tight">Registro</h2>
      
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
        <input 
          type="text" 
          placeholder="Nombre de la rutina (ej. Upper)" 
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white mb-4 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
        />

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 font-bold mb-1 block">EJERCICIO</label>
            <input 
              type="text" 
              list="exercises"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              placeholder="Ej. T-Bar Row"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            />
            <datalist id="exercises">
              {knownExercises.map(ex => <option key={ex} value={ex} />)}
            </datalist>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-slate-400 font-bold mb-1 block">PESO (KG)</label>
              <input 
                type="number" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-slate-400 font-bold mb-1 block">REPS</label>
              <input 
                type="number" 
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                placeholder="6-8"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-mono"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-lg transition-colors mt-2">
            Guardar Serie
          </button>
        </form>
      </div>

      {/* Historial de la rutina actual */}
      {workoutHistory && workoutHistory.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Series de hoy</h3>
          
          {Object.entries(
            workoutHistory.reduce((acc, set) => {
              if (!acc[set.exercise]) acc[set.exercise] = []
              acc[set.exercise].push(set)
              return acc
            }, {})
          ).map(([exerciseName, sets]) => (
            <div key={exerciseName} className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
              <div className="bg-slate-950/50 px-4 py-3 border-b border-slate-800">
                <h4 className="font-semibold text-slate-200">{exerciseName}</h4>
              </div>
              <div className="p-3 space-y-1">
                {sets.map((set, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-800/50 transition-colors">
                    <span className="text-sm text-slate-500 font-medium">Serie {index + 1}</span>
                    <div className="text-emerald-400 font-mono text-sm bg-slate-950/50 px-3 py-1 rounded-md border border-slate-800">
                      {set.weight}kg <span className="text-slate-600 px-1">×</span> {set.reps} reps
                    </div>
                  </div> 
                ))} 
              </div>                  
            </div>
          ))}
        </div>
      )}
    </div>
  )
}