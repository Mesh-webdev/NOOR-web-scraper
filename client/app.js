const body = document.body;
const username = document.getElementById('username');
const pwd = document.getElementById('password');
const captcha = document.getElementById('captcha');
const captchaId = document.getElementById('captchaId');
const loginBtn = document.getElementById('login');
const scrapeBtn = document.getElementById('scrape');
const themeToggleBtn = document.getElementById('theme-toggle');

//$('.form').hide();
$('#scrape').hide();

let captchaInput;

// Making the Socket io the connection
const socket = io.connect('http://localhost:4000');

scrapeBtn.addEventListener('click', scrape);
themeToggleBtn.addEventListener('click', themeToggle);

function scrape() {
  console.log('Scraping...');
  $('#scrape').fadeOut(200, () => {
    $('#loader').fadeIn();
  });

  socket.emit('scrape', 'New scrape call', (data) => {
    if (data.status) {
      // Get the instance ID from the scrape callback object(data)
      $('#loader').fadeOut(100, () => {
        // Should show that the script has finished and captcha is found
        // with a check mark
        // then show the form
        // better ux
        $('.form').fadeIn();
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

function themeToggle() {

  if ($('body').attr('class') == 'light') {
    themeToggleBtn.value = 'Light mode'
    $('body').removeClass('light')
    $('body').addClass('dark')
  } else {
    themeToggleBtn.value = 'Dark mode'
    $('body').removeClass('dark')
    $('body').addClass('light')
  }

}