import { useState, useEffect } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import CalendarView from './components/CalendarView'
import WorkoutLogger from './components/WorkoutLogger'
import HabitsLogger from './components/HabitsLogger'
import JournalLogger from './components/JournalLogger'
import FoodSearch from './components/FoodSearcher'
import MealsLogger from './components/MealsLogger'
import { supabase } from './supabaseClient'

export default function App() {
  const [activeTab, setActiveTab] = useState('calendar')
  
  // Manejo de fechas local
  const getLocalToday = () => {
    const d = new Date();
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  }
  
  const [selectedDate, setSelectedDate] = useState(getLocalToday())
  
  // Objeto base para evitar errores de datos faltantes
  const defaultDayState = { routineName: '', workout: [], meals: [], calorieGoal: 1800, sleep: '', weight: '', reading30min: false, journal: '' }
  
  const [trackerData, setTrackerData] = useState({
    [getLocalToday()]: defaultDayState
  })
  
  const [knownExercises, setKnownExercises] = useState(['Press Inclinado DB', 'RDL'])

  // 1. CARGAR DATOS DESDE SUPABASE AL ABRIR LA APP
  useEffect(() => {
    const fetchAllLogs = async () => {
      try {
        const { data, error } = await supabase.from('daily_logs').select('*')
        if (error) throw error

        if (data && data.length > 0) {
          const formattedData = {}
          data.forEach(row => {
            formattedData[row.date] = {
              routineName: row.routine_name || '',
              workout: row.workout || [],
              meals: row.meals || [],
              calorieGoal: row.calorie_goal || 1800,
              sleep: row.sleep || '',
              weight: row.weight || '',
              reading30min: row.reading30min || false,
              journal: row.journal || ''
            }
          })
          // Mezclamos los datos de la nube con el estado inicial
          setTrackerData(prev => ({ ...prev, ...formattedData }))
        }
      } catch (error) {
        console.error('Error cargando datos:', error.message)
      }
    }
    
    fetchAllLogs()
  }, [])

  // 2. FUNCIÓN PARA ENVIAR DATOS A LA NUBE
  const saveToSupabase = async (date, data) => {
    try {
      const { error } = await supabase
        .from('daily_logs')
        .upsert({
          date: date,
          weight: data.weight ? parseFloat(data.weight) : null,
          sleep: data.sleep ? parseFloat(data.sleep) : null,
          reading30min: !!data.reading30min,
          journal: data.journal || '',
          calorie_goal: data.calorieGoal ? parseInt(data.calorieGoal) : 1800,
          routine_name: data.routineName || '',
          workout: data.workout || [],
          meals: data.meals || [],
          updated_at: new Date().toISOString()
        }, { onConflict: 'date' })

      if (error) throw error
    } catch (error) {
      console.error('Error guardando en Supabase:', error.message)
    }
  }

  // 3. FUNCIÓN CENTRALIZADA: Actualiza React y Supabase
  const handleUpdateData = (field, value) => {
    setTrackerData(prev => {
      const currentDayData = prev[selectedDate] || defaultDayState
      const updatedDay = { ...currentDayData, [field]: value }
      
      // Enviamos a la nube de inmediato
      saveToSupabase(selectedDate, updatedDay)
      
      return { ...prev, [selectedDate]: updatedDay }
    })
  }

  // 4. FUNCIONES ADAPTADAS DEL GYM
  const handleSaveSet = (newSet) => {
    setTrackerData(prev => {
      const currentDayData = prev[selectedDate] || defaultDayState
      const updatedDay = { 
        ...currentDayData, 
        workout: [...currentDayData.workout, newSet] 
      }
      
      saveToSupabase(selectedDate, updatedDay)
      return { ...prev, [selectedDate]: updatedDay }
    })

    if (!knownExercises.includes(newSet.exercise)) {
      setKnownExercises([...knownExercises, newSet.exercise])
    }
  }

  const handleRoutineNameChange = (name) => {
    handleUpdateData('routineName', name)
  }

  // Datos del día actual que pasaremos a los componentes
  const currentDayData = trackerData[selectedDate] || defaultDayState

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-24 font-sans">
      <Header selectedDate={selectedDate} />

      <main className="p-4 max-w-md mx-auto">
        {activeTab === 'calendar' && (
          <CalendarView 
            trackerData={trackerData}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            currentDayData={currentDayData}
            setActiveTab={setActiveTab}
          />
        )}
        
        {activeTab === 'workout' && (
          <WorkoutLogger 
            onSaveSet={handleSaveSet}
            routineName={currentDayData.routineName}
            setRoutineName={handleRoutineNameChange}
            knownExercises={knownExercises}
            workoutHistory={currentDayData.workout}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsLogger 
            dailyData={currentDayData} 
            onUpdateData={handleUpdateData} 
          />
        )}

        {activeTab === 'journal' && (
          <JournalLogger 
            dailyData={currentDayData} 
            onUpdateData={handleUpdateData} 
          />
        )}

        {activeTab === 'cals' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Buscador</h2>
            <FoodSearch />
          </div>
        )}

        {activeTab === 'meals' && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Nutrición</h2>
            <MealsLogger
              dailyData={currentDayData}
              onUpdateData={handleUpdateData} 
            />
          </div>
        )}
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
