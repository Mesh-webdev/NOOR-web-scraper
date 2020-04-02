const router = require('express').Router();
const scrape = require('../scrape');
const crypto = require('crypto');

//GET test
router.get('/get', (req, res) => {
    res.send("Get test")
})

//POST test
router.post('/post', (req, res) => {
    res.send("POST test")
})

//GET scrape
router.get('/scrape', async (req, res) => {
    const script = await scrape.Scrape(sessionId = crypto.randomBytes(16).toString('hex'));
    if (script)
        res.send("Success")
    else
        res.send("Failed")

    console.log("Done");
})

module.exports = router;