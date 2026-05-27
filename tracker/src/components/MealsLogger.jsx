import { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

// SUB-COMPONENTE: Tu escáner aislado
function ScannerComponent({ onScan }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 150 } },
      false
    )

    scanner.render(
      (decodedText) => {
        scanner.clear()
        onScan(decodedText)
      },
      (error) => {} // Silenciamos los errores normales de fotogramas vacíos
    )

    return () => {
      scanner.clear().catch(e => console.error("Error al limpiar cámara:", e))
    }
  }, [onScan])

  return (
    <div id="qr-reader" className="w-full bg-slate-200 text-slate-900 rounded-lg overflow-hidden border-2 border-emerald-500"></div>
  )
}

export default function MealsLogger({ dailyData, onUpdateData }) {
    // 1. Estados de la Interfaz y Metas
    const [isEditingGoal, setIsEditingGoal] = useState(false)
    const [tempGoal, setTempGoal] = useState(dailyData.calorieGoal || 2500)
    
    // 2. Estados del Buscador / Escáner
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [isScanning, setIsScanning] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // 3. Estados del Formulario Manual
    const [foodName, setFoodName] = useState('')
    const [grams, setGrams] = useState('')
    const [calsPer100, setCalsPer100] = useState('')
    const [proteinPer100, setProteinPer100] = useState('')

    // Cálculos del día
    const mealsList = dailyData.meals || []
    const calorieGoal = dailyData.calorieGoal || 2500
    const totalCalsOfDay = mealsList.reduce((sum, meal) => sum + meal.cals, 0)
    const totalProteinOfDay = mealsList.reduce((sum, meal) => sum + meal.protein, 0)

    // Matemáticas de la barra circular
    const radius = 36
    const circumference = 2 * Math.PI * radius
    const percentage = calorieGoal > 0 ? Math.min((totalCalsOfDay / calorieGoal) * 100, 100) : 0
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    // --- LÓGICA DEL BUSCADOR ---
    const parseNutrients = (product) => {
        if (!product || !product.nutriments) return null
        return {
            id: product._id,
            name: product.product_name || 'Producto desconocido',
            brand: product.brands ? product.brands.split(',')[0] : 'Genérico',
            kcal: Math.round(product.nutriments['energy-kcal_100g'] || 0),
            protein: Math.round(product.nutriments.proteins_100g || 0),
        }
    }

    const executeSearch = async (url, isTextSearch) => {
        setLoading(true)
        setError(null)
        setResults([])

        try {
            const response = await fetch(url)
            const data = await response.json()

            let rawProducts = []
            if (isTextSearch) {
                rawProducts = data.products || []
            } else {
                if (data.status === 1) rawProducts = [data.product]
                else throw new Error('Código no registrado.')
            }

            const validProducts = rawProducts
                .map(p => parseNutrients(p))
                .filter(p => p !== null && p.kcal > 0) 

            if (validProducts.length > 0) {
                setResults(validProducts)
            } else {
                setError('Producto encontrado, pero sin calorías registradas.')
            }
        } catch (err) {
            setError('No se encontraron resultados o hubo un error.')
        } finally {
            setLoading(false)
        }
    }

    const handleTextSearch = (e) => {
        e.preventDefault()
        if (!query.trim()) return
        executeSearch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${query}&search_simple=1&action=process&json=1&page_size=5`, true)
    }

    const handleBarcodeScan = (barcode) => {
        setIsScanning(false)
        executeSearch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`, false)
    }

    // --- CONEXIÓN BUSCADOR -> FORMULARIO ---
    const handleSelectProduct = (product) => {
        setFoodName(`${product.name} (${product.brand})`)
        setCalsPer100(product.kcal)
        setProteinPer100(product.protein)
        setResults([]) // Ocultamos los resultados
        setQuery('') // Limpiamos la barra de búsqueda
    }

    // --- LÓGICA DE GUARDADO FINAL ---
    const handleAddFood = (e) => {
        e.preventDefault()

        const finalCals = (parseFloat(grams) / 100) * parseFloat(calsPer100)
        const finalProtein = (parseFloat(grams) / 100) * parseFloat(proteinPer100)

        const newMeal = {
            name: foodName,
            grams: parseFloat(grams),
            cals: finalCals,
            protein: finalProtein
        }
        
        onUpdateData('meals', [...mealsList, newMeal])

        // Limpieza de formulario
        setFoodName('')
        setGrams('')
        setCalsPer100('')
        setProteinPer100('')
    }

    return (
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-6 pb-20">
            
            {/* 1. RESUMEN Y BARRA CIRCULAR */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="relative flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                        <circle 
                            cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
                            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                            className={`${totalCalsOfDay > calorieGoal ? 'text-red-500' : 'text-emerald-400'} transition-all duration-1000 ease-out`} 
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-slate-200 font-bold text-lg leading-none">{totalCalsOfDay.toFixed(0)}</span>
                        <span className="text-slate-500 text-[10px] uppercase mt-1">kcal</span>
                    </div>
                </div>

                <div className="text-right flex-1 ml-4 space-y-3">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Meta Diaria</p>
                        {isEditingGoal ? (
                            <div className="flex justify-end gap-2">
                                <input type="number" value={tempGoal} onChange={(e) => setTempGoal(e.target.value)} className="w-20 bg-slate-900 border border-emerald-500 rounded p-1 text-slate-200 text-sm text-right focus:outline-none" />
                                <button onClick={() => { onUpdateData('calorieGoal', parseInt(tempGoal) || 2500); setIsEditingGoal(false) }} className="text-emerald-400 font-bold">✓</button>
                            </div>
                        ) : (
                            <div className="flex justify-end items-center gap-2 cursor-pointer group" onClick={() => setIsEditingGoal(true)}>
                                <p className="text-slate-200 font-mono text-lg">{calorieGoal} <span className="text-xs text-slate-500">kcal</span></p>
                                <span className="text-slate-600 group-hover:text-emerald-400 text-xs">✏️</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Proteína Total</p>
                        <p className="text-blue-400 font-mono text-xl">{totalProteinOfDay.toFixed(1)} <span className="text-sm text-slate-500">g</span></p>
                    </div>
                </div>
            </div>

            <hr className="border-slate-800" />

            {/* 2. HERRAMIENTAS DE BÚSQUEDA */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Buscar Alimento</h3>
                    <button onClick={() => setIsScanning(!isScanning)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${isScanning ? 'bg-red-950/40 text-red-400 border-red-800' : 'bg-slate-950 text-slate-300 border-slate-700 hover:bg-slate-800'}`}>
                        {isScanning ? '🚫 Cancelar' : '📷 Escanear'}
                    </button>
                </div>

                {isScanning && (
                    <div className="animate-fade-in mb-4">
                        <ScannerComponent onScan={handleBarcodeScan} />
                    </div>
                )}

                <form onSubmit={handleTextSearch} className="flex gap-2">
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ej. Avena, Pollo..." className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-emerald-500" />
                    <button type="submit" disabled={loading || isScanning} className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500 hover:text-slate-950 font-bold px-4 rounded-lg transition-colors disabled:opacity-30">
                        {loading ? '...' : 'Buscar'}
                    </button>
                </form>

                {error && <p className="text-xs text-red-400 text-center">{error}</p>}

                {/* RESULTADOS DE BÚSQUEDA */}
                {results.length > 0 && (
                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                        {results.map((product) => (
                            <button key={product.id || Math.random()} type="button" onClick={() => handleSelectProduct(product)} className="w-full text-left bg-slate-950 hover:bg-slate-800 p-3 rounded-lg border border-slate-800 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-bold text-slate-200 truncate pr-2">{product.name}</span>
                                    <span className="text-xs text-slate-500">{product.brand}</span>
                                </div>
                                <div className="flex gap-4 text-xs">
                                    <span className="text-emerald-400 font-mono">{product.kcal} kcal</span>
                                    <span className="text-blue-400 font-mono">{product.protein}g prot</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. FORMULARIO MANUAL (Se autocompleta con la búsqueda) */}
            <form onSubmit={handleAddFood} className="space-y-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                <div className="flex gap-3">
                    <div className="flex-[2]">
                        <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1 ml-1">Alimento</label>
                        <input type="text" value={foodName} onChange={e => setFoodName(e.target.value)} placeholder="Nombre..." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-emerald-500" required />
                    </div>
                    <div className="flex-1">
                        <label className="block text-emerald-500 text-[10px] uppercase font-bold mb-1 ml-1">Porción</label>
                        <input type="number" step="0.1" value={grams} onChange={e => setGrams(e.target.value)} placeholder="Gramos" className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl p-3 text-emerald-400 font-bold text-sm focus:outline-none focus:border-emerald-500" required />
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1 ml-1">Cals / 100g</label>
                        <input type="number" step="0.1" value={calsPer100} onChange={e => setCalsPer100(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-emerald-500" required />
                    </div>
                    <div className="flex-1">
                        <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1 ml-1">Prot / 100g</label>
                        <input type="number" step="0.1" value={proteinPer100} onChange={e => setProteinPer100(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-emerald-500" required />
                    </div>
                </div>

                <button type="submit" className="w-full bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl transition-transform active:scale-95 text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    + Registrar Comida
                </button>
            </form>

            {/* 4. LISTA DE COMIDAS GUARDADAS HOY */}
            {mealsList.length > 0 && (
                <div className="space-y-2 mt-4">
                    {mealsList.map((meal, index) => (
                        <div key={index} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800">
                            <div className="overflow-hidden pr-2">
                                <p className="text-slate-200 text-sm font-medium truncate">{meal.name}</p>
                                <p className="text-slate-500 text-xs">{meal.grams}g consumidos</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-emerald-400 font-mono text-sm">{meal.cals.toFixed(0)} kcal</p>
                                <p className="text-blue-400 font-mono text-xs">{meal.protein.toFixed(1)}g prot</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}