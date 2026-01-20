const express = require('express')
const cors = require('cors')
const {scanDisk, archIndex} = require("./indice")

const app = express()
app.use(cors())

console.log("Indexando archivos...")
scanDisk("D:/")
console.log("Indexados:", archIndex.lenght)

app.get("/buscando", (req, res) =>{
    const q = (req.query.q || "").toLowerCase()

    const results = archIndex.filter(f =>
        f.name.toLowerCase().includes(q)
    )
    res.json(results)
})

app.listen(3000, ()=>
    console.log("Backend en http://localhost:3000")
)