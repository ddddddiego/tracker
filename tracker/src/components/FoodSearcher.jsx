import { useState, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

// SUB-COMPONENTE: Aísla la cámara para evitar que un error rompa toda la pestaña
function ScannerComponent({ onScan }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 150 } },
      false // Poner en true si necesitas ver logs detallados en la consola
    )

    scanner.render(
      (decodedText) => {
        scanner.clear() // Apaga la cámara apenas detecta el código
        onScan(decodedText)
      },
      (error) => {
        // La cámara arroja errores constantemente en cada fotograma que no detecta nada. Es normal.
      }
    )

    // Limpieza de seguridad si cambias de pestaña
    return () => {
      scanner.clear().catch(e => console.error("Error al limpiar cámara:", e))
    }
  }, [])

  // Fondo claro forzado para que los botones negros que inyecta la librería se vean
  return (
    <div id="qr-reader" className="w-full bg-slate-200 text-slate-900 rounded-lg overflow-hidden border-2 border-emerald-500"></div>
  )
}

export default function FoodSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const parseNutrients = (product) => {
    if (!product || !product.nutriments) return null
    return {
      id: product._id,
      name: product.product_name || 'Producto desconocido',
      brand: product.brands ? product.brands.split(',')[0] : 'Genérico',
      kcal: Math.round(product.nutriments['energy-kcal_100g'] || 0),
      protein: Math.round(product.nutriments.proteins_100g || 0),
      carbs: Math.round(product.nutriments.carbohydrates_100g || 0)
    }
  }

  // Ejecuta ambas búsquedas (texto o cámara) desde una misma función para evitar código repetido
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

      // Filtramos para evitar productos vacíos o sin calorías
      const validProducts = rawProducts
        .map(p => parseNutrients(p))
        .filter(p => p !== null && p.kcal > 0) 

      if (validProducts.length > 0) {
        setResults(validProducts)
      } else {
        setError('El producto fue encontrado, pero la base de datos no tiene sus calorías registradas.')
      }
    } catch (err) {
      console.error(err)
      setError('No se encontraron resultados o hubo un error de conexión.')
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

  return (
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Base de Datos</h3>
        
        <button
          onClick={() => setIsScanning(!isScanning)}
          className={`text-xs font-bold px-3 py-2 rounded-lg border transition-colors ${
            isScanning 
              ? 'bg-rose-950/40 text-rose-400 border-rose-800' 
              : 'bg-slate-950 text-emerald-400 border-slate-800 hover:bg-slate-800'
          }`}
        >
          {isScanning ? '🚫 Cancelar' : '📷 Código de Barras'}
        </button>
      </div>

      {isScanning && (
        <div className="animate-fade-in mb-4">
          <ScannerComponent onScan={handleBarcodeScan} />
        </div>
      )}

      <form onSubmit={handleTextSearch} className="flex gap-2">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej. Avena, Pollo, Arroz..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-sm"
        />
        <button 
          type="submit" 
          disabled={loading || isScanning}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 rounded-lg transition-colors disabled:opacity-30"
        >
          {loading ? '...' : 'Buscar'}
        </button>
      </form>

      {error && (
        <p className="text-xs text-rose-400 bg-rose-950/20 p-3 rounded-lg border border-rose-900/40 text-center">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-3 mt-4">
          {results.map((product) => (
            <div key={product.id || Math.random()} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="text-sm font-bold text-white capitalize truncate max-w-[200px]">{product.name}</span>
                <span className="text-xs text-slate-500 truncate max-w-[100px]">{product.brand}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-900 rounded p-2 border border-slate-800/50">
                  <p className="text-slate-400 mb-1">Kcal</p>
                  <p className="text-emerald-400 font-mono font-bold">{product.kcal}</p>
                </div>
                <div className="bg-slate-900 rounded p-2 border border-slate-800/50">
                  <p className="text-slate-400 mb-1">Prot</p>
                  <p className="text-blue-400 font-mono font-bold">{product.protein}g</p>
                </div>
                <div className="bg-slate-900 rounded p-2 border border-slate-800/50">
                  <p className="text-slate-400 mb-1">Carbs</p>
                  <p className="text-amber-400 font-mono font-bold">{product.carbs}g</p>
                </div>
              </div>
              <p className="text-[10px] text-slate-600 text-right font-mono">*Por cada 100g</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}