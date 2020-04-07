const router = require('express').Router();
const scrape = require('../scrape');
const crypto = require('crypto');
const path = require('path');

//GET test
router.get('/get', (req, res) => {
    res.send("Get test")
})

//POST test
router.post('/post', (req, res) => {
    res.send("POST test")
})


//GET image
router.get('/image/:id', (req, res) => {
    id = req.params.id;
    imageAbsolutePath = path.join(__dirname, '..', '\\images', id + ".png")
    res.sendFile(imageAbsolutePath)
    // res.sendFile(__dirname);

})

module.exports = router;