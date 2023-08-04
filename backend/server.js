require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const cors = require('cors')
const port = 8080
const http = require('http');
const server = http.createServer(app);
const emailService = require('./services/email-service');
const binanceService = require('./services/binance-service');
const walletService = require('./services/wallet-service');
const refillService = require('./services/refill-service');

const videoPath = "sample-mik.mp4";
const fs = require("fs");
let movie_mp4;

app.use(bodyParser.json());
app.use(cors());

let lastEmergencyRefill = 0;
const twentyFourHours = 24 * 3600000;

fs.readFile(videoPath, function (err, data) {
    if (err) {
        throw err;
    }

    movie_mp4 = data;
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/video", function (req, res) {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
    }

    const videoSize = movie_mp4.length;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    res.end(movie_mp4.slice(start, end + 1), "binary");
});

app.get("/bytes", function (req, res) {
    res.end(movie_mp4, "binary");
});

app.post("/video", function (req, res) {
    fs.readFile(videoPath, function (err, data) {
        if (err) {
            throw err;
        }

        movie_mp4 = data;
    });
});

app.get('/binance-card-balance/', async (req, res) => {
    try {
        const result = await binanceService.getBNBBalance();

        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.get('/binance-card-balance/pln', async (req, res) => {
    try {
        const result = await binanceService.getBNBBalance();

        res.json(result.balancePLN);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.get('/wallet/bnb/pln', async (req, res) => {
    try {
        const result = await walletService.getBNBBalance();

        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.get('/send-email-with-balance/', async (req, res) => {
    try {
        const balance = await binanceService.getBNBBalance();
        await emailService.sendBalanceEmailAsync(balance.balancePLN);

        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.put('/send-money-to-binance/', async (req, res) => {
    try {
        if (lastEmergencyRefill + twentyFourHours < Date.now()) {
            await walletService.sendMoneyToBinance(1);
            lastEmergencyRefill = Date.now();
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

// refillService.checkAndRefillBinanceAccount();
// emailService.sendStartMessage();
