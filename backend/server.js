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

app.use(bodyParser.json());
app.use(cors());

let lastEmergencyRefill = 0;
const twentyFourHours = 24 * 3600000;

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

app.put('/everyday-refill/', async (req, res) => {
    try {
        await refillService.everydayRefill();
        res.sendStatus(200);
    } catch (e) {
        console.log(e);

        // res.statusMessage = e.message;
        // res.status(e.code).end();

        res.status(e.code).end(e.message);
    }
});

app.put('/urgent-refill/', async (req, res) => {
    try {
        await refillService.urgentRefill();
        res.json({
            urgentRefillTimeout: refillService.urgentRefillInProgress()
        });
    } catch (e) {
        console.log(e);

        // res.statusMessage = e.message;
        // res.status(e.code).end();

        res.status(e.code).end(e.message);
    }
});

app.delete('/urgent-refill/', async (req, res) => {
    try {
        await refillService.cancelUrgentRefill();
        res.sendStatus(200);
    } catch (e) {
        console.log(e);

        // res.statusMessage = e.message;
        // res.status(e.code).end();

        res.status(e.code).end(e.message);
    }
});


app.get('/timeouts/', async (req, res) => {
    try {
        res.json({
            urgentRefillTimeout: refillService.urgentRefillInProgress()
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

emailService.sendStartMessageAsync();
