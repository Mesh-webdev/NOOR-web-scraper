const body = document.body;
const username = document.getElementById('username');
const pwd = document.getElementById('password');
const captcha = document.getElementById('captcha');
const loginBtn = document.getElementById('login');
const scrapeBtn = document.getElementById('scrape');
const themeToggleBtn = document.getElementById('theme-toggle');
const captchaImg = document.getElementById('captcha-img');
const logBox = $('.log');

logBox.hide();
$('.form').hide();
$('.welcome').hide();
$('#success').hide();
// $('#scrape').hide();

// Check if page has been reloaded and clear the focus
if (window.performance.navigation.type > 0) {
  window.location.hash = '';
}

// Check theme type
const theme = localStorage.getItem('theme');
console.log(localStorage.getItem('theme'));
if (theme == 'light' || theme == 'dark') {
  if (theme == 'dark') {
    themeToggleBtn.value = 'Light mode';
    // DARK
    $('body').removeClass('light');
    $('body').addClass('dark');
  } else {
    // LIGHT
    themeToggleBtn.value = 'Dark mode';
    $('body').removeClass('dark');
    $('body').addClass('light');
  }
}

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
      fetchAndAppend(data.instance)
        .then(() => {
          // Get current time and format it for readability
          const datetime = new Date();
          formattedDatetime = datetime.toLocaleString();

          // Push the last line of the log array
          data.log.push(
            '[' + formattedDatetime + ']' + ': -- Waiting for user to login...'
          );

          // Loop through the log array and append each line
          for (var i = 0; i < data.log.length; i++) {
            let node = document.createElement('p');
            node.innerText = data.log[i];
            node.setAttribute('class', 'log-line');
            logBox.append(node);
          }

          // Hide the loader
          $('#loader').fadeOut(100, () => {
            // Show success animation and wait for 2sec
            $('#success').fadeIn(50, () => {
              setTimeout(() => {
                // After 2sec. Hide the success animation and
                // show the log and the form
                $('#success').fadeOut(100, () => {

                  // Set page focus on the form
                  scrollFocus();
                  logBox.slideDown();
                  $('.form').fadeIn();
                });
              }, 2000);
            });
          });
        })
        .catch();

      loginBtn.addEventListener('click', login);

      function login() {
        let loginInfo = {
          username: username.value,
          password: pwd.value,
          captcha: captcha.value,
        };
        $('.form').fadeOut(100, () => {
          socket.emit('login', loginInfo);
          $('#loader2').fadeIn();
        });
      }
    }
    console.log('inside emit callback');
  });

  socket.on('loggedOn', (data) => {
    $('#welcome-username').text('"' + data + '"');
    $('#loader2').slideUp(200, () => {
      $('.welcome').slideDown(300);
    });
    console.log(data);
  });
  // Add loader here
  // call scrape from back-end
  // after its done, hide loader
  // show form with the captcha from the back-end(?? YIKES)
}

function themeToggle() {
  if ($('body').attr('class') == 'light') {
    themeToggleBtn.value = 'Light mode';
    // DARK
    $('body').removeClass('light');
    $('body').addClass('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    // LIGHT
    themeToggleBtn.value = 'Dark mode';
    $('body').removeClass('dark');
    $('body').addClass('light');
    localStorage.setItem('theme', 'light');
  }
}

async function fetchAndAppend(id) {
  return new Promise((resolve, reject) => {
    try {
      fetch('http://localhost:4000/api/image/' + id).then((response) => {
        response.blob().then((image) => {
          captchaImg.setAttribute('src', URL.createObjectURL(image));
        });
      });
      resolve();
    } catch (error) {}
  });
}

function scrollFocus() {
  $('html, body').animate({
    scrollTop: $("#call-for-action").offset().top
  }, 850);
}