const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get("/success/:id", (req, res) => {
    const uri = `https://trank-web-client.vercel.app/shop?order_id=${req.params.id}`;
    res.redirect(uri);
    
    console.log(req.params.id);
    console.log(req.query);
});

app.listen({port: 8080}, () => {
    console.log("Servidor corriendo en el 8080");
});

