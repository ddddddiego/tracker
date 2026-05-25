export default function CalendarView({ trackerData, selectedDate, setSelectedDate, currentDayData, setActiveTab }) {
  const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']
  
  const getCalendarDays = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    let startOffset = firstDayOfMonth.getDay() - 1;
    if (startOffset === -1) startOffset = 6; 

    const days = [];
    for (let i = 0; i < 35; i++) {
      const current = new Date(year, month, 1 - startOffset + i);
      const localDate = new Date(current.getTime() - (current.getTimezoneOffset() * 60000))
                          .toISOString()
                          .split('T')[0];
      days.push(localDate);
    }
    return days;
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-white tracking-tight">Calendario</h2>
      
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg">
        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-slate-500">
          {daysOfWeek.map(day => <div key={day}>{day}</div>)}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date) => {
            const dayData = trackerData[date]
            const hasWorkout = dayData?.workout?.length > 0
            const hasHabits = dayData && (dayData.weight || dayData.sleep || dayData.reading30min)
            const isSelected = date === selectedDate

            let bgColor = 'bg-slate-950 text-slate-700 hover:bg-slate-800'
            if (hasWorkout && hasHabits) bgColor = 'bg-emerald-500 text-slate-950 font-bold'
            else if (hasWorkout) bgColor = 'bg-emerald-900/60 text-emerald-400 border-emerald-800'
            else if (hasHabits) bgColor = 'bg-slate-800 text-slate-300 border-slate-700'

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

      <div className="space-y-4">
        {currentDayData.workout?.length > 0 && (
          <button 
            onClick={() => setActiveTab('workout')} 
            className="w-full text-left bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm hover:bg-slate-800/80 transition-colors cursor-pointer group"
          >
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm text-slate-400 uppercase tracking-wider font-bold">Entrenamiento</h4>
                <span className="text-slate-500 text-xs group-hover:text-emerald-400 transition-colors">Ver detalle →</span>
            </div>
            <p className="text-emerald-400 font-bold text-lg">{currentDayData.routineName || 'Rutina sin nombre'}</p>
            <p className="text-sm text-slate-300">{currentDayData.workout.length} series registradas</p>
          </button>
        )}

        {(currentDayData.weight || currentDayData.sleep || currentDayData.reading30min) && (
          <button onClick={() => setActiveTab('habits')} className="w-full text-left bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm hover:bg-slate-800/80 transition-colors cursor-pointer group">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm text-slate-400 uppercase tracking-wider font-bold">Hábitos</h4>
              <span className="text-slate-500 text-xs group-hover:text-emerald-400 transition-colors">Editar →</span>
            </div>
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
          </button>
        )}

        {currentDayData.journal && (
          <button onClick={() => setActiveTab('journal')} className="w-full bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center shadow-sm hover:bg-slate-800/80 transition-colors cursor-pointer">
            <div className="text-left">
              <h4 className="text-xs text-slate-400 uppercase tracking-wider font-bold">Diario</h4>
              <p className="text-sm text-slate-300 mt-1">Hay una nota registrada para hoy.</p>
            </div>
            <span className="bg-slate-950 text-emerald-400 font-medium text-xs px-3 py-2 rounded-xl border border-slate-800">Leer</span>
          </button>
        )}
      </div>
    </div>
  )
}