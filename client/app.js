const username = document.getElementById('username');
const pwd = document.getElementById('password');
const captcha = document.getElementById('captcha');
const captchaId = document.getElementById('captchaId');
const loginBtn = document.getElementById('login');
const scrapeBtn = document.getElementById('scrape');

let captchaInput;

// Making the Socket io the connection
const socket = io.connect('http://localhost:4000');

scrapeBtn.addEventListener('click', scrape);

function scrape() {
  console.log('Scraping...');
  $('#scrape').fadeOut(200, () => {
    $('#loader').fadeIn();
  });

  socket.emit('scrape', 'New scrape call', (data) => {
    if (data.status) {
      // Get the instance ID from the scrape callback object(data)
      const instance = data.instance;
      const imgUrl = '../server/images/' + instance + '.png';
      console.log(path);
      // Create the DOM img element
      var imgNode = document.createElement('img');
      imgNode.setAttribute('href', imgUrl);

      captchaId.appendChild(imgNode);

      captchaId.append();

      $('#loader').fadeOut(100, () => {
        $('#form').fadeIn();
      });

      loginBtn.addEventListener('click', login);

      function login() {
        socket.emit('login', 'login');
      }
    }
    console.log('inside emit callback');
  });
  // Add loader here
  // call scrape from back-end
  // after its done, hide loader
  // show form with the captcha from the back-end(?? YIKES)
}
