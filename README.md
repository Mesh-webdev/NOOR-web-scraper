# NOOR-web-scraper
NOOR web-scraper is a tool to scrape the login functionally of https://noor.moe.gov.sa/NOOR/. it utilizes the puppeteer scraping tool from Google, and allows the user to scrape the captcha image, then proceeds to login and scrape the logged in username.

--- Steps
1. User enters the website.

2. Back-end Nodejs & expressJS serve the static files(The front-end).

3. On website load(on connection). Socket.io opens a uniquely identified socket(socket.id) between the front-end and the back-end.

4. User clicks the scrap button, the front-end will emit a 'scrape' event with a callback within the opened socket.

5. The back-end is listening and waiting for the 'scrape' event to emit, and when it does. it calls the scraping script with the socket.id(every step is logged).

   - Check internet connectivity of the backend
   - Check if the directory if /images/ is available to save the scraped images and if not create one.
   - Launch an instance of chromium, navigate to the page and scrape the captcha image.
   - With a successful run, an image with the name of the unique socket.id will be saved
   - The script will return the page instance and the array of log lines. 
  
6. Back-end will use the event 'scrape' callback function to send back a payload to the front-end; the socket.id and the array of logged steps.

7. With a successful callback, the front-end check if the payload is available.

8. if yes, the front-end will send a GET request to the backend with the received socket.id.

9. Backend will respond with the uniquely named *socket.id*.png image.

10. The front-end will show the form & and the unique captcha image associated with the current instance.

11. User fills the form and submits. on submission, the front-end will emit a new event 'login'.

12. The back-end is listening and waiting for the 'login' event to emit, and when it does. it starts the logging-in script.

13. With a successful run, the backend will emit a 'loggedOn' event with a payload(logged in username) to the front-end.

14. The front-end is listening and waiting for the 'loggedOn' event to emit, and when it does. it hides the loader and shows the welcome message with the logged-in username

