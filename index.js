const app = require('express')();

app.get('', (req, res) => {
    res.send("GENIEOUZ!")
});

app.listen(8080, () => {
    console.log(`Server runing in http://localhost:8080`)
});