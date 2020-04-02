// Scraping imports =========
const puppeteer = require('puppeteer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
// ========================
const datetime = new Date();

// Global status of the script
const scriptStatus = {
    status: true,
    message: 'Successfully ran the script'
}

// Main scrape function
async function Scrape() {
    // 1- Check internet 
    await checkInternet();
    // 2-
    // 3-

}

async function checkInternet() {
    let maxCount = 10;
    let checkedCount = 0;
    let isNotConnected = true;
    // 0- log(): script has begun
    log("Script has begun")
    // 1- check internet connection
    log("Checking internet connectivity")
    try {
        let internetCheck = await dnsLookup();
        log("Internet connected")
    } catch (error) {
        // repeating the connectivity test for 'maxCount' amount of times
        // while is checking if the times we check is less the the set max
        // and checking the boolean value of isNotConnected
        // if the awaited checkInternet() resolved, the isNotConnected is set to false
        while (checkedCount < maxCount && isNotConnected) {
            let internetCheck = await dnsLookup()
                .then(() => {
                    isNotConnected = false;
                })
                .catch(() => {
                    log("Checking internet connectivity #" + checkedCount)
                });
            checkedCount++
        }
        // if isNotConnected hasnt been set to false, there is no internet connection
        if (isNotConnected) {
            scriptStatus.status = false
            scriptStatus.message = "Script failed, No internet connection"
            log(scriptStatus.message)
            return false;
        }
    }
}

function dnsLookup() {
    let count = 0;
    return new Promise((resolve, reject) => {
        require('dns').lookup('google.com', (err) => {
            if (err && err.code == "ENOTFOUND") {
                reject();
            } else {
                resolve();
            }
        });
    })
}


function log(msg) {
    console.log('[' + datetime + ']' + ': -- ' + msg);
}

module.exports = {
    Scrape
}