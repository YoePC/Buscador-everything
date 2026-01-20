import { useEffect, useState } from "react";

function App(){
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])

  useEffect(()=>{
    if(query === ""){
      setResults([])
      return
    }

    fetch(`http://localhost:3000/search?q=${query}`)
      .then(res => res.json())
      .then(data => setResults(data))
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
      <p>Resultados: {results.length} </p>
      <div style={{maxHeight:400, overflowY: "auto"}}>
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