const loginBtn = document.getElementById('login-btn');
const loginForm = document.getElementById('login-form');
const usernameError = document.getElementById('username-error');
const passwordError = document.getElementById('password-error');
const loginError = document.getElementById('login-error');

const loginUrl = 'http://localhost:3000/login';

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

// Submit login details
async function submitLogin(e) {
  e.preventDefault();
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

loginBtn.addEventListener('click', (e) => submitLogin(e));

// Load stored theme on page load
const theme = localStorage.getItem('theme');
if (theme) {
  document.querySelector('html').setAttribute('data-theme', theme);
  console.log(`Loaded theme ${theme} from localstorage`);
}
