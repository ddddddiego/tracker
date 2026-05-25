import { useState, useEffect } from 'react'

export default function JournalLogger({ dailyData, onUpdateData }) {
  // Estado local para manejar el texto que estás escribiendo
  const [note, setNote] = useState(dailyData.journal || '')
  // Estado para mostrar el mensaje de confirmación
  const [showSaved, setShowSaved] = useState(false)

  // Esto asegura que si cambias de día en el calendario, el texto se actualice correctamente
  useEffect(() => {
    setNote(dailyData.journal || '')
  }, [dailyData.journal])

  const handleSave = () => {
    // Aquí es donde realmente se guarda en el "cerebro" de la app
    onUpdateData('journal', note)
    
    // Mostramos el feedback visual
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 2000)
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white tracking-tight">Diario</h2>
        
        {/* Mensaje de confirmación temporal */}
        {showSaved && (
          <span className="text-emerald-400 text-sm font-medium animate-pulse">
            ¡Guardado! ✅
          </span>
        )}
      </div>
      
      <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 transition-all flex flex-col">
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="¿Cómo te sentiste hoy? ¿Alguna molestia o récord personal en el entrenamiento?"
          className="w-full bg-transparent p-4 text-white resize-none min-h-[250px] focus:outline-none placeholder:text-slate-600"
        ></textarea>
        
        {/* Contenedor del botón */}
        <div className="p-2 flex justify-end border-t border-slate-800/50 mt-2">
          <button 
            onClick={handleSave}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 px-6 rounded-lg transition-colors text-sm"
          >
            Guardar nota
          </button>
        </div>
      </div>
    </div>
  )
}