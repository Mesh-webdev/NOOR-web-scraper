// Scraping imports =========
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
// ========================

// Global status of the script
const scriptStatus = {
    status: true,
    message: 'Script finished and was successful',
};
const selectors = {
    captcha: '#divGGchh',
    loginBtn: '#btnSubl',
    usernameInput: '#tbGn',
    pwdInput: '#tbGpr',
    captchaInput: '#tbGc',
    username: '.username'
};

let logArray = [];

// Main scrape function
async function Scrape(sessionId) {
    logArray = [];
    // TODO:
    // **** I SHOULD TRY CATCH THESE STEPS AND CHANGE THE SCRIPTSTATUS ACCORDINGLY ****
    //

    // 1- Check internet
    await checkInternet();
    // 2- Check directory
    await makeDir();
    // 3- Launch chromium, Navigate to the page and scrape the captcha
    const _page = await LaunchChromium(sessionId);
    log(sessionId + ' instance ' + scriptStatus.message);
    return {
        page: _page,
        logArr: logArray
    };
}

async function checkInternet() {
    let maxCount = 10;
    let checkedCount = 0;
    let isNotConnected = true;
    // 0- log(): script has begun
    log('Script has begun');
    // 1- check internet connection
    log('Checking internet connectivity');
    try {
        let internetCheck = await dnsLookup();
        log('Internet connected ✅');
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
                    log('Checking internet connectivity #' + checkedCount);
                });
            checkedCount++;
        }
        // if isNotConnected hasnt been set to false, there is no internet connection
        if (isNotConnected) {
            scriptStatus.status = false;
            scriptStatus.message = 'Script failed, No internet connection';
            log(scriptStatus.message);
            return false;
        }
    }
}

function dnsLookup() {
    let count = 0;
    return new Promise((resolve, reject) => {
        require('dns').lookup('google.com', (err) => {
            if (err && err.code == 'ENOTFOUND') {
                reject();
            } else {
                resolve();
            }
        });
    });
}

async function LaunchChromium(sessionId) {
    const siteDetails = {
        pageUrl: 'https://noor.moe.gov.sa/NOOR/',
    };

    return new Promise(async (resolve, reject) => {
        try {
            // OK
            log('Launching Chromium...');
            const browser = await puppeteer.launch({
                headless: false,
            });
            log('Launched Chromium successfully ✅');

            // trycatch for navigating the chromium
            try {
                // OK
                log('Navigating to the page');
                let page = await browser.newPage();
                await page.setUserAgent;
                page.goto(siteDetails.pageUrl);
                log('Waiting to Navigate...');
                await page
                    .waitForNavigation()
                    .catch((err) => {
                        log('Failed while waiting for navigation, Error: ', err);
                        reject();
                    })
                    .then(() => {
                        log('Successfully navigated to the page ✅');
                        //console.log(page);
                    });
                // trycatch for taking a screenshot
                try {
                    // OK
                    log('Waiting for the captcha to appear...');
                    const image = await page
                        .waitForSelector(selectors.captcha)
                        .catch((err) => {
                            log("Couldn't find the captcha within the page, Error: ", err);
                            reject();
                        })
                        .then(async (image) => {
                            log('Successfully located the captcha ✅');
                            log('Scraping the captcha...');
                            await image
                                .screenshot({
                                    path: 'images//' + sessionId + '.png',
                                })
                                .catch((err) => {
                                    log("Couldn't scrape the captcha, Error: ", err);
                                    reject();
                                })
                                .then(async () => {
                                    log('Successfully scraped the captcha ✅');
                                    // log("Closing the Chromium instance...")
                                    // await browser.close()
                                    //     .catch((err) => {
                                    //         log("Couldn't close the chromium instance, Error: ", err)
                                    //     })
                                    //     .then(() => {
                                    //         log("Successfully closed the Chromium instance.")
                                    //     })
                                    resolve(page);
                                });
                        });
                } catch (error) {}
            } catch (error) {
                // Rejection #2
                log('Unable to navigate to the page, Error: ', error);
                reject();
            }
        } catch (error) {
            // Rejection #1
            log('Failed to launch Chromium, Error: ', error);
            reject();
        }
    });
}

async function login(page, data) {
    return new Promise(async (resolve, reject) => {
        try {
            //Type username
            const usernameInput = await page.waitForSelector(selectors.usernameInput);
            usernameInput.type(data.username)
                .then(async () => {
                    console.log("Username typed");

                    // Then type password
                    const pwdInput = await page.waitForSelector(selectors.pwdInput)
                    pwdInput.type(data.password)
                        .then(async () => {
                            console.log("Password typed");

                            // Then type captcha
                            const captchaInput = await page.waitForSelector(selectors.captchaInput);
                            captchaInput.type(data.captcha)
                                .then(async () => {
                                    console.log('Captcha typed');
                                    const loginBtn = await page.waitForSelector(selectors.loginBtn);
                                    loginBtn.click();
                                    console.log('Clicked');
                                    await page.waitForNavigation()
                                        .then(async () => {
                                            console.log('Waited');
                                            console.log(page.url());
                                            await page.$eval(selectors.username, e => e.innerText)
                                                .then((username) => {
                                                    resolve(username);
                                                })
                                        })
                                })
                        })
                })
                .catch((err) => {
                    console.log(err);
                })

        } catch (error) {
            console.log('error: ' + error);
            reject(error);
        }
    });
}

async function makeDir() {
    return await new Promise((resolve, reject) => {
        let newPath =
            path.dirname(require.main.filename).trim().toString() + '\\images';
        log(
            "Checking if 'images' directory is available before scraping the captcha, and if not. creating a new one "
        );
        fs.mkdir(
            newPath, {
                recursive: true,
            },
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    log('Successfully checked, directory is created or available ✅');
                    resolve();
                }
            }
        );
    });
}

function log(msg) {
    const datetime = new Date();
    formattedDatetime = datetime.toLocaleString()
    let line = '[' + formattedDatetime + ']' + ': -- ' + msg;
    logArray.push(line)
    console.log(line);
}

module.exports = {
    Scrape,
    login,
};