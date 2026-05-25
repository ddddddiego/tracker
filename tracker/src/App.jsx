import { useState } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import CalendarView from './components/CalendarView'
import WorkoutLogger from './components/WorkoutLogger'
import HabitsLogger from './components/HabitsLogger'
import JournalLogger from './components/JournalLogger'
import FoodSearch from './components/FoodSearcher'

export default function App() {
  const [activeTab, setActiveTab] = useState('calendar')
  
  // Manejo de fechas local
  const getLocalToday = () => {
    const d = new Date();
    return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  }
  
  const [selectedDate, setSelectedDate] = useState(getLocalToday())
  const [trackerData, setTrackerData] = useState({
    [getLocalToday()]: { routineName: '', workout: [], sleep: '', weight: '', reading30min: false, journal: '' }
  })
  
  const [knownExercises, setKnownExercises] = useState(['Press Inclinado DB', 'RDL'])

  const handleSaveSet = (newSet) => {
    setTrackerData(prev => {
      const currentDayData = prev[selectedDate] || { routineName: '', workout: [], sleep: '', weight: '', reading30min: false, journal: '' }
      return {
        ...prev,
        [selectedDate]: {
          ...currentDayData,
          workout: [...currentDayData.workout, newSet]
        }
      }
    })

    if (!knownExercises.includes(newSet.exercise)) {
      setKnownExercises([...knownExercises, newSet.exercise])
    }
  }

  const handleRoutineNameChange = (name) => {
    setTrackerData(prev => {
      const currentDayData = prev[selectedDate] || { routineName: '', workout: [], sleep: '', weight: '', reading30min: false, journal: '' }
      return { ...prev, [selectedDate]: { ...currentDayData, routineName: name } }
    })
  }

  const updateDailyData = (field, value) => {
    setTrackerData(prev => {
      const dayData = prev[selectedDate] || { routineName: '', workout: [], sleep: '', weight: '', reading30min: false, journal: '' }
      return { ...prev, [selectedDate]: { ...dayData, [field]: value } }
    })
  }

  const currentDayData = trackerData[selectedDate] || { routineName: '', workout: [], sleep: '', weight: '', reading30min: false, journal: '' }

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
          <HabitsLogger dailyData={currentDayData} onUpdateData={updateDailyData} />
        )}

        {activeTab === 'journal' && (
          <JournalLogger dailyData={currentDayData} onUpdateData={updateDailyData} />
        )}
      </main>
        {activeTab === 'cals' && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Nutrición</h2>
              <FoodSearch />
            </div>
          )}

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
