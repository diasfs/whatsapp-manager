const dotenv = require('dotenv');

dotenv.config();

const express = require('express');
const cors = require('cors');
const WapiRouter = require('./routes/wapi.js');


app = express();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }))
app.use(cors());





app.use((err, req, res, next) => {
    if (err) {
        console.error(err.stack);
        if (req.Whatsapp) {
            console.log(req.Whatsapp);
        }
        return res.status(500).json({
            error: err.message
        })
    }
    next();
})


app.use('/wapi', WapiRouter);
app.use('/', WapiRouter);



const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`listen on ${HOST}:${PORT}`);
});