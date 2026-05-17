import { useState } from 'react'
import WorkoutLogger from './components/WorkoutLogger'
import HabitsLogger from './components/HabitsLogger'
import JournalLogger from './components/JournalLogger'

export default function App() {
  // 1. ESTADO GLOBAL: El cerebro de tu app
  const [activeTab, setActiveTab] = useState('calendar')
  
  // Obtenemos la fecha de hoy en formato YYYY-MM-DD para usarla por defecto
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)

  // Aquí se guarda TODO ordenado por fecha
  const [trackerData, setTrackerData] = useState({
    [today]: { routineName: '', workout: [], sleep: '', journal: '' }
  })

  // Lista de ejercicios para el autocompletado (limpié los espacios vacíos)
  const [knownExercises, setKnownExercises] = useState([
    'Press Inclinado DB', 'RDL'
  ])

  // 2. FUNCIONES PARA GUARDAR DATOS
  const handleSaveSet = (newSet) => {
    setTrackerData(prev => {
      const currentDayData = prev[selectedDate] || { routineName: '', workout: [], sleep: '', journal: '' }
      return {
        ...prev,
        [selectedDate]: {
          ...currentDayData,
          workout: [...currentDayData.workout, newSet]
        }
      }
    })

    // Agregamos el ejercicio a la lista de autocompletado si es nuevo
    if (!knownExercises.includes(newSet.exercise)) {
      setKnownExercises([...knownExercises, newSet.exercise])
    }
  }

  const handleRoutineNameChange = (name) => {
    setTrackerData(prev => {
      const currentDayData = prev[selectedDate] || { routineName: '', workout: [], sleep: '', journal: '' }
      return { ...prev, [selectedDate]: { ...currentDayData, routineName: name } }
    })
  }

  // Obtenemos los datos del día seleccionado para mostrarlos
  const currentDayData = trackerData[selectedDate] || { routineName: '', workout: [], sleep: '', journal: '' }

  // 3. GENERAR EL CALENDARIO (Boceto visual)
  const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
  // Simulamos 35 cuadritos (5 semanas) para la grilla
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    // Lógica simplificada para generar fechas del mes actual
    const d = new Date()
    d.setDate(d.getDate() - 15 + i) 
    return d.toISOString().split('T')[0]
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-24 font-sans">
      
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white tracking-tight">Mi Tracker</h1>
        <span className="text-emerald-400 text-sm font-mono">{selectedDate}</span>
      </header>

      <main className="p-4 max-w-md mx-auto">
        
        {/* VISTA CALENDARIO */}
{/* VISTA CALENDARIO */}
        {activeTab === 'calendar' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Calendario</h2>
            
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg">
              {/* Encabezado de días */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-500">
                {daysOfWeek.map(day => <div key={day}>{day}</div>)}
              </div>
              
              {/* Grilla de cuadritos */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((date) => {
                  const dayData = trackerData[date]
                  
                  // Lógica para detectar qué se hizo en el día
                  const hasWorkout = dayData && dayData.workout && dayData.workout.length > 0
                  const hasHabits = dayData && (dayData.weight || dayData.sleep || dayData.reading30min)
                  const hasJournal = dayData && dayData.journal && dayData.journal.trim() !== ''
                  
                  const isSelected = date === selectedDate

                  // Lógica de colores según lo completado
                  let bgColor = 'bg-slate-950 text-slate-700 hover:bg-slate-800' // Vacío por defecto
                  
                  if (hasWorkout && hasHabits) {
                    bgColor = 'bg-emerald-500 text-slate-950 font-bold' // Hizo TODO (Verde brillante)
                  } else if (hasWorkout) {
                    bgColor = 'bg-emerald-900/60 text-emerald-400 border-emerald-800' // Solo pesas (Verde oscuro)
                  } else if (hasHabits) {
                    bgColor = 'bg-slate-800 text-slate-300 border-slate-700' // Solo hábitos (Gris azulado)
                  }

                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`aspect-square rounded-lg border flex items-center justify-center transition-all 
                        ${isSelected ? 'border-emerald-400 ring-2 ring-emerald-900/50 scale-105 z-10' : 'border-slate-800/50'} 
                        ${bgColor}`}
                    >
                      <span className="text-[10px]">{date.slice(-2)}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Resumen rápido del día seleccionado */}
            <div className="space-y-4">
              {/* Resumen de Rutina */}
              {currentDayData.workout && currentDayData.workout.length > 0 && (
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
                  <h4 className="text-sm text-slate-400 mb-2 uppercase tracking-wider font-bold">Entrenamiento</h4>
                  <p className="text-emerald-400 font-bold text-lg">{currentDayData.routineName || 'Rutina sin nombre'}</p>
                  <p className="text-sm text-slate-300">{currentDayData.workout.length} series registradas</p>
                </div>
              )}

              {/* Resumen de Hábitos */}
              {(currentDayData.weight || currentDayData.sleep || currentDayData.reading30min) && (
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
                  <h4 className="text-sm text-slate-400 mb-3 uppercase tracking-wider font-bold">Hábitos</h4>
                  <div className="space-y-2 text-sm text-slate-200">
                    {currentDayData.weight && (
                      <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                        <span className="text-slate-400">Peso corporal</span>
                        <span className="font-mono text-emerald-400">{currentDayData.weight} kg</span>
                      </div>
                    )}
                    {currentDayData.sleep && (
                      <div className="flex justify-between items-center border-b border-slate-800/50 pb-2">
                        <span className="text-slate-400">Sueño</span>
                        <span className="font-mono text-emerald-400">{currentDayData.sleep} hrs</span>
                      </div>
                    )}
                    {currentDayData.reading30min && (
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-slate-400">Lectura 30 min</span>
                        <span>✅</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* Tarjeta de vista previa del Diario en el Calendario */}
              {currentDayData.journal && (
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-sm">
                  <div>
                    <h4 className="text-xs text-slate-400 uppercase tracking-wider font-bold">Diario</h4>
                    <p className="text-sm text-slate-300 mt-1">Hay una nota registrada para hoy.</p>
                  </div>
                  
                  <button 
                    onClick={() => setActiveTab('journal')}
                    className="bg-slate-950 hover:bg-slate-800 text-emerald-400 font-medium text-xs px-3 py-2 rounded-xl border border-slate-800 transition-colors"
                  >
                    Leer
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VISTA RUTINA */}
        {activeTab === 'workout' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Registro</h2>
            
            <WorkoutLogger 
              onSaveSet={handleSaveSet}
              routineName={currentDayData.routineName}
              setRoutineName={handleRoutineNameChange}
              knownExercises={knownExercises}
            />

            {/* Historial de series del día */}
            {currentDayData.workout.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">Series guardadas</h3>
                
                {Object.entries(
                  currentDayData.workout.reduce((acc, set) => {
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
        )}

        {activeTab === 'habits' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Hábitos</h2>

            <HabitsLogger
              dailyData={currentDayData}
              onUpdateData={(field, value) => {
                setTrackerData(prev => {
                  const dayData = prev[selectedDate] || { routineName: '', workout: [], sleep: '', weight: '', reading30min: false, journal: '' }
                  return { ...prev, [selectedDate]: { ...dayData, [field]: value } }
                })
              }}
            />
          </div>
        )}

        {activeTab === 'journal' && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Diario</h2>
              <JournalLogger
                dailyData={currentDayData}
                onUpdateData={(field, value) => {
                  setTrackerData(prev => {
                    const dayData = prev[selectedDate] || { routineName: '', workout: [], sleep: '', weight: '', reading30min: false, journal: '' }
                    return { ...prev, [selectedDate]: { ...dayData, [field]: value } }
                  })
                }}
              />
            </div>
          )}

      </main>

      {/* BARRA DE NAVEGACIÓN */}
      <nav className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around p-3 pb-4 z-10">
        <button onClick={() => setActiveTab('calendar')} className={`flex flex-col items-center w-full py-1 ${activeTab === 'calendar' ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span className="text-sm font-medium">📆</span>
        </button>
        <button onClick={() => setActiveTab('workout')} className={`flex flex-col items-center w-full py-1 ${activeTab === 'workout' ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span className="text-sm font-medium">🏋🏻‍♀️</span>
        </button>
        <button onClick={() => setActiveTab('habits')} className={`flex flex-col items-center w-full py-1 ${activeTab === 'habits' ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span className="text-sm font-medium">🎯</span>
        </button>
        <button onClick={() => setActiveTab('journal')} className={`flex flex-col items-center w-full py-1 ${activeTab === 'journal' ? 'text-emerald-400' : 'text-slate-500'}`}>
          <span className="text-sm font-medium">📖</span>
        </button>
      </nav>

    </div>
  )
}