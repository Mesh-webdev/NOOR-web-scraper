const router = require('express').Router();

//GET test
router.get('/get', (req, res) => {
    res.send("Get test")
})

//POST test
router.post('/post', (req, res) => {
    res.send("POST test")
})

//GET scrape
router.get('/scrape', (req, res) => {
    res.send("Scrape")
})

module.exports = router;