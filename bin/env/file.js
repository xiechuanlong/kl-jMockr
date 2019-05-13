const fs = require('fs') 
const path = require('path') 

// 判断文件或者文件夹是否存在
function fileOrDir(path){
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if(err){
                resolve(false);
            }else{
                if(stats && stats.isDirectory()){
                    resolve({isDirectory: true, isFile: false});
                } else if(stats){     
                    resolve({isDirectory: false, isFile: true});
                }
            }
        })
    })
}

// 文件写入内容
function writeFile(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if(err) {
                reject()
            } else {
                resolve()
            }
        })
    })
}

// 文件读取内容
function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path,(err, data) => {
            if(err) {
                reject()
            } else {
                resolve(data.toString())
            }
        })
    })
}


module.exports = {
    fileOrDir,
    writeFile,
    readFile
}
