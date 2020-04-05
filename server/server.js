// Server imports =========
const express = require('express');
const socket = require('socket.io');
const scrape = require('./scrape');
const router = require('./routes/routes');
// ========================

const path = require('path');


// App
const app = express();
const server = app.listen('4000', () => {
    console.log('Listening to port 4000');
    console.log(path.dirname(require.main.filename).trim().toString());
})

// Static files
app.use(express.static('../client'))

// Socket setup
const io = socket(server)

// Router middleware
app.use('/api', router)

// IO connection 
io.on('connection', (socket) => {
    let page;
    console.log('New socket opened: ' + socket.id);

    socket.on('scrape', async (data, fn) => {
        console.log(data);
        script = await (await scrape.Scrape(socket.id));
        page = script.page;
        _log = script.logArr;
        fn({
            status: true,
            instance: socket.id,
            log: _log
        })

    })

    socket.on('login', (data) => {

        scrape.login(page, data)
            .then((username) => {
                socket.emit('loggedOn', username)
            })
            .catch((err) => {
                console.log(err);
            })
    })

})