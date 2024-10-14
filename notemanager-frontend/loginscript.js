const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const creationBtn = document.getElementById('creation-btn');

const usernameError = document.getElementById('username-error');
const passwordError = document.getElementById('password-error');
const loginError = document.getElementById('login-error');
const creationError = document.getElementById('creation-error');
const userAlreadyExistsError = document.getElementById('user-already-exists');
const captchaError = document.getElementById('captcha-error');
const creationNotification = document.getElementById('creation-notification');

const loginUrl = 'http://localhost:3000/login';
const creationUrl = 'http://localhost:3000/users';
const captchaUrl = 'http://localhost:3000/captcha';

// Load stored theme on page load
const theme = localStorage.getItem('theme');
if (theme) {
  document.querySelector('html').setAttribute('data-theme', theme);
  console.log(`Loaded theme ${theme} from localstorage`);
}

// Function to reset notifications and errors in the form
function resetNotifications() {
  usernameError.style.display = 'none';
  passwordError.style.display = 'none';
  loginError.style.display = 'none';
  creationError.style.display = 'none';
  userAlreadyExistsError.style.display = 'none';
  captchaError.style.display = 'none';
  creationNotification.style.display = 'none';
}

// Function that validates captcha, and then proceeds with login/registration
async function validateCaptcha(captchaToken) {
  try {
    const captchaResponse = await fetch(captchaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: captchaToken }),
    });

    console.log(captchaResponse);
    if (!captchaResponse.ok) {
      console.log('Captcha failed');
      return false;
    } else {
      console.log('Captcha success');
      return true;
    }

    // submitLogin();
  } catch (error) {
    console.log(error);
  }
}

// Function that handles login-communication with server
async function postLogin(formDataAsObj) {
  const body = formDataAsObj;
  console.log('Body in postData()-function:', JSON.stringify(body));
  try {
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.log('Error, response was:', await response.json());
      return false;
    } else {
      const responseAsJson = await response.json();
      // console.log(responseAsJson);
      return responseAsJson;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Function that handles submitting login-form
async function submitLogin(captchaToken) {
  console.log(captchaToken);
  const isCaptchaValid = await validateCaptcha(captchaToken);

  if (!isCaptchaValid) {
    console.log('Captcha invalid, cancelling...');
    captchaError.style.display = 'block';
    return;
  }

  const formData = new FormData(loginForm);
  const formDataAsObj = Object.fromEntries(formData);

  // Validate that username and password exists, then submit.
  if (!formDataAsObj.username.trim()) {
    usernameError.style.display = 'block';
    return;
  } else if (!formDataAsObj.password.trim()) {
    passwordError.style.display = 'block';
    return;
  } else {
    loginBtn.textContent = 'Loading...';
    loginBtn.disabled = true;

    console.log(formDataAsObj);
    console.log('Form submitted');

    const loginResponse = await postLogin(formDataAsObj);
    console.log('Response from login:', loginResponse);

    if (!loginResponse) {
      loginError.style.display = 'block';
      loginBtn.textContent = 'Login';
      loginBtn.disabled = false;
    } else {
      loginBtn.textContent = 'Login';
      loginBtn.disabled = false;
      localStorage.setItem('token', loginResponse.token);
      localStorage.setItem('user', loginResponse.username);
      window.location.href = '/notes.html';
    }
  }
}

// Function that handles creation-communication with server
async function postCreation(formDataAsObj) {
  const body = formDataAsObj;
  console.log('Body in postData()-function:', JSON.stringify(body));
  try {
    const response = await fetch(creationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const responseAsJson = await response.json();
      if (responseAsJson.message === 'User already exists') {
        return responseAsJson.message;
      }
      console.log('Error, response was:', responseAsJson.message);
      return false;
    } else {
      // console.log(responseAsJson);
      return response;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Fucntion to handle submit of account creation form
async function submitCreation(captchaToken) {
  console.log(captchaToken);
  const isCaptchaValid = await validateCaptcha(captchaToken);

  if (!isCaptchaValid) {
    console.log('Captcha invalid, cancelling...');
    captchaError.style.display = 'block';
    return;
  }

  const formData = new FormData(loginForm);
  const formDataAsObj = Object.fromEntries(formData);

  // Validate that username and password exists, then submit.
  if (!formDataAsObj.username.trim()) {
    usernameError.style.display = 'block';
    return;
  } else if (!formDataAsObj.password.trim()) {
    passwordError.style.display = 'block';
    return;
  } else {
    loginBtn.textContent = 'Loading...';
    loginBtn.disabled = true;

    console.log(formDataAsObj);
    console.log('Form submitted');

    const creationResponse = await postCreation(formDataAsObj);
    console.log('Response from registration:', creationResponse);

    if (!creationResponse) {
      creationError.style.display = 'block';
    } else if (creationResponse === 'User already exists') {
      userAlreadyExistsError.style.display = 'block';
    } else {
      creationNotification.style.display = 'block';
      console.log('Account created');
    }
    loginBtn.textContent = 'Create account';
    loginBtn.disabled = false;
  }
}

// Switch the form to account creation
function switchToCreation() {
  resetNotifications();
  console.log('Switching to account creation');
  const h2 = document.getElementById('account-h2');
  h2.innerText = 'Create account';

  loginBtn.style.display = 'none';
  creationBtn.style.display = 'block';

  // loginBtn.innerText = 'Create account';
  // loginBtn['data-callback'] = submitCreation;
  // loginBtn.onclick = submitCreation;

  const link = document.getElementById('account-link');
  link.href = 'javascript:switchToSignin()';
  link.innerText = 'Sign in';
}

// Switch the form to sign in
function switchToSignin() {
  resetNotifications();
  console.log('Switching to sign in');
  const h2 = document.getElementById('account-h2');
  h2.innerText = 'Sign in';

  creationBtn.style.display = 'none';
  loginBtn.style.display = 'block';

  // loginBtn.innerText = 'Sign in';
  // loginBtn.onclick = submitLogin;

  const link = document.getElementById('account-link');
  link.href = 'javascript:switchToCreation()';
  link.innerText = 'Create account';

  creationNotification.style.display = 'none';
}
