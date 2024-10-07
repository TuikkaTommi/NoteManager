// Get required HTML-elements into variables
const modal = document.getElementById('modal');
const form = document.getElementById('new-note-form');
const formOpenBtn = document.getElementById('form-open-btn');
const formCloseBtn = document.getElementById('form-close-btn');
const submitBtn = document.getElementById('submit');
const notification = document.getElementById('notification');
const titleError = document.getElementById('title-error');
const descError = document.getElementById('desc-error');
const submitError = document.getElementById('submit-error');
const noteList = document.getElementById('note-list');
const noteLoadingIndicator = document.getElementById('notes-loading');
const noteLoadingError = document.getElementById('notes-error');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const logoutBtn = document.getElementById('logout-btn');
const welcomeMessage = document.getElementById('welcome');

// Get user info from localstorage. If info missing, logout
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
if (!token || !user) {
  logout();
}
welcomeMessage.textContent = `Welcome ${user}!`;

const serverBaseUrl = 'http://localhost:3000/notes';

function openEditForm(id) {
  console.log(`Opening edit-form for note with id ${id}`);

  const form = document.getElementById(`edit-form-${id}`);
  form.style.display = 'flex';

  const textContainer = document.getElementById(`text-container-${id}`);
  textContainer.style.display = 'none';

  const submitBtn = document.getElementById(`submit-edit-btn-${id}`);
  const cancelBtn = document.getElementById(`cancel-edit-btn-${id}`);

  submitBtn.style.display = 'block';
  cancelBtn.style.display = 'block';

  const deleteBtn = document.getElementById(`delete-btn-${id}`);
  const editBtn = document.getElementById(`edit-btn-${id}`);
  deleteBtn.style.display = 'none';
  editBtn.style.display = 'none';
}

function closeEditForm(id, oldTitle, oldDescription) {
  console.log(`Closing edit-form for note with id ${id}`);

  const form = document.getElementById(`edit-form-${id}`);
  form.style.display = 'none';

  const titleInput = document.getElementById(`edit-title-input-${id}`);
  titleInput.value = oldTitle;

  const descriptionTextarea = document.getElementById(
    `edit-description-input-${id}`
  );
  descriptionTextarea.value = oldDescription;

  const textContainer = document.getElementById(`text-container-${id}`);
  textContainer.style.display = 'block';

  const submitBtn = document.getElementById(`submit-edit-btn-${id}`);
  const cancelBtn = document.getElementById(`cancel-edit-btn-${id}`);

  submitBtn.style.display = 'none';
  cancelBtn.style.display = 'none';

  const deleteBtn = document.getElementById(`delete-btn-${id}`);
  const editBtn = document.getElementById(`edit-btn-${id}`);
  deleteBtn.style.display = 'block';
  editBtn.style.display = 'block';
}

// Function to submit edits to server
async function submitEdit(id) {
  const formData = new FormData(document.getElementById(`edit-form-${id}`));
  const formDataAsObj = Object.fromEntries(formData);
  console.log(formDataAsObj);

  try {
    const response = await fetch(`${serverBaseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataAsObj),
    });

    if (!response.ok) {
      console.log('Error updating note');
    } else {
      console.log(`Updated note with id ${id}`);
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
}

// Funtion to display fetched notes in DOM
function showNotes(notes) {
  if (notes.length > 0) {
    notes.forEach((note) => {
      const listItem = document.createElement('li');
      listItem.id = `note-${note.id}`;

      const textContainer = document.createElement('div');
      textContainer.id = `text-container-${note.id}`;
      textContainer.classList.add('text-container');

      const editForm = document.createElement('form');
      editForm.id = `edit-form-${note.id}`;
      editForm.classList.add('edit-form');
      editForm.style.display = 'none';

      // Create an input element for the title inside edit-form
      const titleInput = document.createElement('input');
      titleInput.id = `edit-title-input-${note.id}`;
      titleInput.value = note.title;
      titleInput.name = 'title';
      titleInput.placeholder = 'Title';
      editForm.appendChild(titleInput);

      // Create a textarea for the description inside edit-form
      const descriptionTextarea = document.createElement('textarea');
      descriptionTextarea.id = `edit-description-input-${note.id}`;
      descriptionTextarea.name = 'description';
      descriptionTextarea.rows = 3;
      descriptionTextarea.cols = 36;
      descriptionTextarea.maxLength = 108;
      descriptionTextarea.value = note.description;

      editForm.appendChild(descriptionTextarea);

      // Create a dropdown-select for priority inside edit-form
      const prioritySelect = document.createElement('select');
      prioritySelect.id = `edit-priority-input-${note.id}`;
      prioritySelect.name = 'priority';

      const priorityLabel = document.createElement('label');
      priorityLabel.htmlFor = prioritySelect.id;
      priorityLabel.innerText = 'Priority:';

      const options = [
        { priority: 'Low', value: 1 },
        { priority: 'Medium', value: 2 },
        { priority: 'High', value: 3 },
      ];

      options.forEach((opt) => {
        let isSelected = false;
        if (opt.value === note.priority) {
          isSelected = true;
        }
        const optionElem = new Option(
          opt.priority,
          opt.value,
          false,
          isSelected
        );
        prioritySelect.add(optionElem);
      });

      editForm.appendChild(priorityLabel);
      editForm.appendChild(prioritySelect);

      const titleElem = document.createElement('h3');
      titleElem.textContent = note.title;
      titleElem.classList.add(`priority${note.priority}`);
      const descriptionElem = document.createElement('p');
      descriptionElem.textContent = note.description;

      textContainer.appendChild(titleElem);
      textContainer.appendChild(descriptionElem);

      const btnContainer = document.createElement('div');
      btnContainer.classList.add('btn-container');

      const editBtn = document.createElement('button');
      editBtn.id = `edit-btn-${note.id}`;
      editBtn.classList.add('fa');
      editBtn.classList.add('fa-pencil');
      editBtn.classList.add('green-btn');
      editBtn.title = 'Edit note';

      editBtn.addEventListener('click', () => openEditForm(note.id));

      const deleteBtn = document.createElement('button');
      deleteBtn.id = `delete-btn-${note.id}`;
      deleteBtn.classList.add('fa');
      deleteBtn.classList.add('fa-trash');
      deleteBtn.title = 'Delete note';

      deleteBtn.addEventListener('click', () => deleteNote(note.id));

      const submitEditBtn = document.createElement('button');
      submitEditBtn.id = `submit-edit-btn-${note.id}`;
      submitEditBtn.classList.add('green-btn');
      submitEditBtn.textContent = 'Submit';
      submitEditBtn.title = 'Submit edit';
      submitEditBtn.style.display = 'none';

      submitEditBtn.addEventListener('click', () => submitEdit(note.id));

      const cancelEditBtn = document.createElement('button');
      cancelEditBtn.id = `cancel-edit-btn-${note.id}`;
      cancelEditBtn.textContent = 'Cancel';
      cancelEditBtn.title = 'Cancel edit';
      cancelEditBtn.style.display = 'none';

      cancelEditBtn.addEventListener('click', () =>
        closeEditForm(note.id, note.title, note.description)
      );

      btnContainer.appendChild(editBtn);
      btnContainer.appendChild(deleteBtn);
      btnContainer.appendChild(submitEditBtn);
      btnContainer.appendChild(cancelEditBtn);

      listItem.appendChild(textContainer);
      listItem.appendChild(editForm);
      listItem.appendChild(btnContainer);
      noteList.appendChild(listItem);
    });
  } else {
    noteList.textContent = 'No notes yet';
  }

  noteLoadingIndicator.style.display = 'none';
}

// Function to fetch notes from server
async function fetchNotes() {
  noteLoadingIndicator.style.display = 'block';
  try {
    const response = await fetch(`${serverBaseUrl}`, {
      headers: {
        Authorization: token,
      },
    });
    const responseAsJson = await response.json();

    if (!response.ok) {
      console.log('Error, response status:', responseAsJson);
    } else {
      console.log('Received notes:', responseAsJson);
      showNotes(responseAsJson);
    }
  } catch (err) {
    console.log(err.message);
    noteLoadingError.style.display = 'block';
    noteLoadingIndicator.style.display = 'none';
  }
}

// Call the function immediately when page loads
fetchNotes();

function openForm() {
  console.log('Opening form...');
  modal.style.display = 'block';
  notification.style.display = 'none';
}

function closeForm() {
  console.log('Closing form...');
  modal.style.display = 'none';
  titleError.style.display = 'none';
  descError.style.display = 'none';
  submitError.style.display = 'none';
  form.reset();
}

// Submit new note
async function submit(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const formDataAsObj = Object.fromEntries(formData);

  // Validate that title and description exists, then submit. Failed validation displays error-messages
  if (!formDataAsObj.title.trim() || !formDataAsObj.description.trim()) {
    if (!formDataAsObj.title.trim()) {
      titleError.style.display = 'block';
    }
    if (!formDataAsObj.description.trim()) {
      descError.style.display = 'block';
    }
  } else {
    submitBtn.textContent = 'Loading...';
    submitBtn.disabled = true;

    console.log(formDataAsObj);
    console.log('Form submitted');

    const postSuccess = await postData(formDataAsObj);
    // console.log('Was posting successful:', postSuccess);

    if (postSuccess) {
      closeForm();
      submitBtn.textContent = 'Submit';
      submitBtn.disabled = false;
      notification.style.display = 'block';
      location.reload();
    } else {
      submitError.style.display = 'block';
      submitBtn.textContent = 'Submit';
    }
  }
}

// Function that posts a new note to backend
async function postData(formDataAsObj) {
  const body = formDataAsObj;
  console.log('Body in postData()-function:', JSON.stringify(body));
  try {
    const response = await fetch(serverBaseUrl, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.log('Error, response was:', await response.json());
      return false;
    } else {
      console.log(response);
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

// Function to delete a note
async function deleteNote(id) {
  console.log(`Trying to delete note with id ${id}`);

  if (window.confirm('Do you want to delete this note?')) {
    try {
      const response = await fetch(`${serverBaseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token,
        },
      });

      if (!response.ok) {
        console.log('Error, response:', response);
        alert('Error deleting note');
      } else {
        console.log(response);
        location.reload();
      }
    } catch (err) {
      console.log(err);
      console.log('Error deleting note');
    }
  }
}

function logout() {
  console.log('Logging out');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

// Load stored theme on page load
const theme = localStorage.getItem('theme');
if (theme) {
  document.querySelector('html').setAttribute('data-theme', theme);
  console.log(`Loaded theme ${theme} from localstorage`);
}

function toggleTheme() {
  currentTheme = document.querySelector('html').getAttribute('data-theme');
  console.log('Toggling theme from', currentTheme);
  if (currentTheme === 'light') {
    document.querySelector('html').setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.querySelector('html').setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
}

// Add required eventlisteners to elements
formOpenBtn.addEventListener('click', openForm);
formCloseBtn.addEventListener('click', closeForm);
modal.addEventListener('click', closeForm);
themeToggleBtn.addEventListener('click', toggleTheme);
logoutBtn.addEventListener('click', logout);

// Stop the click from the modal backdround-element from propagating to the form itself
form.addEventListener('click', (e) => e.stopPropagation());
submitBtn.addEventListener('click', (e) => submit(e));
