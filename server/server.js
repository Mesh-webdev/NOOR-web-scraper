// Server imports =========
const express = require('express');
const cors = require('cors');
// ========================

// Scraping imports =========
const puppeteer = require('puppeteer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
// ========================

const app = express();

app.listen(3000, () => {
    console.log('Listening on 3000!');
});