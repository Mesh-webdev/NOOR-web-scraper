// Server imports =========
const express = require('express');
const cors = require('cors');
// ========================

const scrape = require('./scrape');


const app = express();
app.use(cors());


app.listen(3000, async () => {
    console.log('Listening on 3000!');
    await scrape.Scrape();
    console.log("Done");
});



//Importing routes
const routes = require('./routes/routes');


//Routes middlewares
app.use('/api', routes);