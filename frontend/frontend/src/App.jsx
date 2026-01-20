import { useEffect, useState, useRef } from "react";

function App(){
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)
  const controllerRef = useRef(null)

  useEffect(()=>{
    // manejar query vacía: limpiar estado y cancelar peticiones
    if(query === ""){
      if (controllerRef.current) {
        controllerRef.current.abort()
        controllerRef.current = null
      }
      // diferir las actualizaciones de estado para evitar renders encadenados dentro del effect
      setTimeout(() => {
        setResults([])
        setError(null)
        setLoading(false)
      }, 0)
      return
    }

    // debounce para evitar muchas peticiones al escribir
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      // indicar carga justo antes de iniciar la petición
      setLoading(true)
      setError(null)
      // cancelar petición previa si existe
      if (controllerRef.current) controllerRef.current.abort()
      const controller = new AbortController()
      controllerRef.current = controller

      fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        })
        .then(data => setResults(data))
        .catch(err => {
          if (err.name === 'AbortError') return // petición cancelada por nuevo query
          setError(err.message || String(err))
          setResults([])
        })
        .finally(() => {
          setLoading(false)
          controllerRef.current = null
        })
    }, 300)

    return () => {
      // limpiar debounce y cancelar petición cuando query cambie o componente se desmonte
      if (debounceRef.current) { clearTimeout(debounceRef.current); debounceRef.current = null }
      if (controllerRef.current) { controllerRef.current.abort(); controllerRef.current = null }
    }
  }, [query])

  return (
    <div style={{padding:20}}>
      <h2>Buscador Everything</h2>

      <input 
      type="text" 
      placeholder="Buscar archivos..." 
      value={query}  
      onChange={e => 
        setQuery(e.target.value)} 
      style={{width:"100%", padding: 10}} 
      />
      <p>Resultados: {results.length} {loading ? '(buscando...)' : ''}</p>
      {error && <div style={{color:'red'}}>Error: {error}</div>}
      <div style={{maxHeight:400, overflowY: "auto"}}>
        {results.length === 0 && !loading && !error && query !== '' && (
          <div style={{fontSize:14, color:'#666'}}>No se encontraron resultados</div>
        )}
        {results.map((file, i) =>(
          <div key={i} style={{fontSize: 14}}>
            {file.path}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;