const app = require('express')();
const fs = require('fs');
const promisify = require('util').promisify;
const resolve = require("path").resolve;

app.get('', async (req, res) => {
    const path = resolve('videos', "myfile.mp4");
    // const stat = await fs.stat(path);
    const video = fs.createReadStream(path);
    fs.stat(path, (err, stat) => {

        // Handle file not found
        if (err !== null && err.code === 'ENOENT') {
            res.sendStatus(404);
        }
    
        const fileSize = stat.size
        const range = req.headers.range
    
        if (range) {
    
            const parts = range.replace(/bytes=/, "").split("-");
    
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
            
            const chunksize = (end-start)+1;
            const file = fs.createReadStream(path, {start, end});
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head);
            fs.createReadStream(path).pipe(res);
        }
    });


});

app.listen(8080, () => {
    console.log(`Server runing in http://localhost:8080`)
});