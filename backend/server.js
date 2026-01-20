const express = require('express')
const cors = require('cors')
const {scanDisk, archIndex} = require("./indice")

const app = express()
app.use(cors())

console.log("Indexando archivos...")
scanDisk("D:/")
console.log("Indexando en background...")
// Nota: corregimos 'length' y evitamos bloquear la salida del proceso con un log incorrecto
setTimeout(() => console.log("Indexados:", archIndex.length), 2000)

// Endpoint expuesto como /search para coincidir con el frontend
app.get("/search", (req, res) =>{
    const q = (req.query.q || "").toLowerCase()

    const results = archIndex.filter(f =>
        f.name.toLowerCase().includes(q)
    )
    res.json(results)
})

app.listen(3000, ()=>
    console.log("Backend en http://localhost:3000")
)