const fs = require("node:fs")
const path = require("node:path")
const archIndex = []

async function scanDisk(dir) {
    try{
        const files = fs.readdirSync(dir)

        for(const file of files){
            const allPath = path.join(dir, file)
            const stat = fs.statSync(allPath)

            if(stat.isDirectory()){
                scanDisk(allPath)
            }else{
                archIndex.push({
                    name: file,
                    path: allPath
                })
            }
        }
    }catch (e){}
}
module.exports = {scanDisk, archIndex }