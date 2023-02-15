import * as views from './views.js';
import * as model from './model.js';
import { showPassword } from './helpers.js';
const showErrorMessage = message =>
  views.openModal({
    markup: views.errorMessageMarkup(message),
  });
const showSuccessMessage = message =>
  views.openModal({
    markup: views.successMessageMarkup(message),
  });
/**
 * validate username in the database
 * @param {Object} e node where the event occurred
 * @returns
 */
export const usernameHandler = async e => {
  const enteredUsername = e.target.closest('input[name=username]');
  if (!enteredUsername) return;
  const feedbackEl = enteredUsername.parentElement.querySelector('.feedback');
  if (!feedbackEl) return;
  // check availability
  if (enteredUsername.value === '') return;
  const exists = await model.checkUsername(enteredUsername.value);
  feedbackEl.innerHTML = exists ? 'username already used' : '';
};
/**
 * Validate if two passwords match
 * @returns
 */
export const passwordsHandler = function () {
  const passEl = this.querySelector('input[name=password]');
  const passConfirmEl = this.querySelector('input[name=confirm_password]');
  if (!passEl || !passConfirmEl) return;

  const passFeedback = passEl.parentElement.querySelector('.feedback');
  const passConfirmFeedback =
    passConfirmEl.parentElement.querySelector('.feedback');

  if (!passFeedback || !passConfirmFeedback) return;

  passFeedback.innerHTML = passConfirmFeedback.innerHTML =
    passEl.value === passConfirmEl.value ? '' : 'passwords does not match';
};
/**
 * Update user handler
 * @param {Object} e
 */
export const updateUserHandler = async function (e) {
  e.preventDefault();
  views.renderSpinner();
  const formData = Object.fromEntries(new FormData(this));

  try {
    await model.updateUser(formData);
    await views.renderDashboard(model.state);
    if (localStorage.getItem('logged'));
    localStorage.setItem('logged', JSON.stringify(model.state.logged));
    views.removeSpinner();
    showSuccessMessage('data was saved');
  } catch (error) {
    views.removeSpinner();
    showErrorMessage(error.message);
  }
};
const changePasswordHandler = async function (e) {
  e.preventDefault();
  const formData = new FormData(this.querySelector('form'));
  const pass = formData.get('password');
  const passConfirm = formData.get('confirm_password');

  if (pass !== passConfirm) return;

  try {
    views.renderSpinner();
    const isUpdate = await model.updatePassword(pass);
    if (!isUpdate) throw new Error();
    localStorage.removeItem('logged');
    model.state.logged = false;
    await views.renderPage(model.state.template);
    views.removeSpinner();
    showSuccessMessage('Password has been updated');
  } catch (error) {
    showErrorMessage(error.message);
  }
};
export const validatePasswordHandler = async function (e) {
  e.preventDefault();
  views.renderSpinner();
  const formData = new FormData(this);
  const enteredPassword = formData.get('password');

  try {
    await model.validatePassword(enteredPassword);
    views.removeSpinner();
    views.openModal({
      markup: views.changePasswordMarkup(),
      events: [
        {
          name: 'submit',
          handler: changePasswordHandler,
        },
        {
          name: 'change',
          handler: showPassword,
        },
        {
          name: 'input',
          handler: passwordsHandler,
        },
      ],
    });

    // clean input tag
    this.querySelector('input').value = '';
  } catch (error) {
    views.removeSpinner();
    showErrorMessage(error.message);
  }
};
export const deleteAccountHandler = async function (e) {
  e.preventDefault();
  views.renderSpinner();
  try {
    await model.deleteAccount(model.state.logged);
    localStorage.removeItem('logged');
    views.renderPage(model.state.template);
    views.removeSpinner();
    showSuccessMessage('Your account was successfully deleted');
  } catch (error) {
    showErrorMessage(error.message);
  }
};
/**
 * Handles login action, validate inputs and send data
 * to database
 * @param {Object} e data from the submitted form
 */
export const loginHandler = async e => {
  e.preventDefault();
  const form = document.querySelector('.sign_in');
  const formData = new FormData(form);
  const invalid = document.querySelector('.error__message');
  try {
    // get response from database
    await model.getUser(formData);
    // get all users
    await model.getAllUsers();
    // clean invalid
    invalid.innerHTML = '';
    // close modal
    views.modal.hide();
    // render spinner
    views.renderSpinner();
    // render dashboard
    views.renderDashboard({
      logged: model.state.logged,
      users: model.state.users,
    });
    // render spinner
    views.removeSpinner();
    // save in local storage logged user
    localStorage.setItem('logged', JSON.stringify(model.state.logged));
  } catch (error) {
    console.error(error.message);
    invalid.innerHTML = 'Wrong credentials';
  }
};
/**
 * Handles all events occurred in the side bar of the dashboard
 * @param {Object} e element where the event occurred
 * @returns void
 */
export const sidebarHandler = async e => {
  const actionEl = e.target.closest('[data-tab-action]');
  const keyEl = e.target.closest('[data-tab-key]');

  if (!actionEl || !keyEl) return;
  // remove active class from tab
  document.querySelector('.list-group-item.active').classList.remove('active');
  // add active class clicked tab
  keyEl.classList.add('active');
  // select right side of sidebar
  const sidebarOrigin = document.querySelector('#sidebar_origin');
  // select key and action
  const key = keyEl.dataset.tabKey;
  const action = actionEl.dataset.tabAction;
  // clean right side of sidebar on action different than view
  action === 'view' && (sidebarOrigin.innerHTML = '');
  // check key to work with tab
  switch (key) {
    case 'account_details':
      views.renderAccountDetails(model.state.logged);
      break;
    case 'users':
      action === 'view' && (await views.renderUsers(model.state.users));
      break;
    case 'preview':
      action === 'view' && (await views.renderPage(model.state.template));
      break;
    case 'logout':
      localStorage.removeItem('logged');
      window.location.reload();
      break;
    default:
      views.renderChangePart(key);
      break;
  }
};
export const submitChangeHomeHandler = async function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  model.state.template.hero.title = formData.get('title');
  model.state.template.hero.subtitle = formData.get('subtitle');
  try {
    views.renderSpinner();
    // send to database
    await model.updateTemplate(model.state.template);
    await views.renderChangePart('home');
    views.removeSpinner();
    showSuccessMessage('Data was saved');
  } catch (error) {
    views.removeSpinner();
    showErrorMessage('Something went wrong, try again');
  }
};
export const submitChangeAboutHandler = async function (e) {
  e.preventDefault();
  const formData = new FormData(this);
  model.state.template.about.title = formData.get('title');
  model.state.template.about.subtitle = formData.get('content');
  const uploadedImage = formData.get('image');
  try {
    views.renderSpinner();
    /// check if image was changed
    if (uploadedImage.name !== '') {
      // update template
      model.state.template.about.image = uploadedImage.name;
      const fileData = new FormData();
      fileData.append('image', uploadedImage);
      await model.moveFile(fileData);
    }
    // send to database
    await model.updateTemplate(model.state.template);
    await views.renderChangePart('about');
    views.removeSpinner();
    showSuccessMessage('Data was saved');
  } catch (error) {
    views.removeSpinner();
    showErrorMessage('Something went wrong, try again');
  }
};
export const submitChangeServiceHandler = async function (e) {
  e.preventDefault();
  const form = document.querySelector('form[id=services]');
  const itemKey = form.dataset.itemKey;
  const formData = new FormData(form);
  // update services
  const itemToChange = model.state.template.services.find(
    service => service.id === itemKey
  );
  if (!itemToChange) return;
  itemToChange.icon =
    formData.get('icon') !== '' ? formData.get('icon') : itemToChange.icon;
  itemToChange.title = formData.get('title');
  itemToChange.content = formData.get('content');
  try {
    views.renderSpinner();
    // send to database
    await model.updateTemplate(model.state.template);
    await views.renderChangePart('services');
    views.removeSpinner();
    showSuccessMessage('Data was saved');
  } catch (error) {
    views.removeSpinner();
    showErrorMessage('Something went wrong, try again');
  }
};
export const submitChangeFeaturesHandler = async function (e) {
  e.preventDefault();
  const form = document.querySelector('form[id=features]');
  const itemKey = form.dataset.itemKey;
  const formData = new FormData(form);
  // update features
  const itemToChange = model.state.template.features.find(
    feature => feature.id === itemKey
  );
  if (!itemToChange) return;
  itemToChange.icon =
    formData.get('icon') !== '' ? formData.get('icon') : itemToChange.icon;
  itemToChange.title = formData.get('title');
  itemToChange.content = formData.get('content');
  try {
    views.renderSpinner();
    // send to database
    await model.updateTemplate(model.state.template);
    await views.renderChangePart('features');
    views.removeSpinner();
    showSuccessMessage('Data was saved');
  } catch (error) {
    views.removeSpinner();
    showErrorMessage('Something went wrong, try again');
  }
};
export const submitChangeTestimonialsHandler = async function (e) {
  e.preventDefault();
  const form = document.querySelector('form[id=testimonials]');
  const itemKey = form.dataset.itemKey;
  const formData = new FormData(form);
  // update testimonials
  const itemToChange = model.state.template.testimonials.find(
    testimonial => testimonial.id === itemKey
  );
  if (!itemToChange) return;
  itemToChange.author = formData.get('author');
  itemToChange.content = formData.get('content');
  try {
    views.renderSpinner();
    // send to database
    await model.updateTemplate(model.state.template);
    await views.renderChangePart('testimonials');
    views.removeSpinner();
    showSuccessMessage('Data was saved');
  } catch (error) {
    views.removeSpinner();
    showErrorMessage('Something went wrong, try again');
  }
};
/**
 * Handles when a new user is being created, validate
 * user inputs and send data to database.
 * @param {Object} e data from the submitted form
 * @returns void
 */
export const submitNewUserHandler = async function (e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(this.querySelector('form')));
  const invalids = [...this.querySelectorAll('.feedback')];
  // check if there is errors
  const isInvalids = invalids.filter(invalid => invalid.innerHTML !== '');
  // invalids messages return
  if (isInvalids.length !== 0) return;

  try {
    // render spinner
    views.renderSpinner();
    // send data to db
    await model.createUser(formData);
    // get users again from db
    await model.getAllUsers();
    // render users
    await views.renderUsers(model.state.users);
    // remove spinner
    views.removeSpinner();
    // show success message
    showSuccessMessage('User was created');
  } catch (error) {
    showErrorMessage(error.message);
  }
};
export const changeProfileImageHandler = async function (e) {
  e.preventDefault();
  const enteredImage = this.querySelector('input[type=file]');
  const feedback = this.querySelector('.feedback');
  if (enteredImage.files.length === 0) {
    feedback.innerHTML = 'Please select an image first';
    return;
  }
  views.renderSpinner();
  // clean feedback element
  feedback.innerHTML = '';
  // send data to database
  const fileData = new FormData();
  fileData.append('image', enteredImage.files[0]);
  try {
    // call function to change it
    const isChange = await model.changeProfileImage(fileData);
    // check if image was changed
    if (!isChange) throw new Error('Image was not changed');
    // change in local storage and users
    if (localStorage.getItem('logged'))
      localStorage.setItem('logged', JSON.stringify(model.state.logged));
    // render dashboard
    await views.renderDashboard(model.state);
    // remove spinner
    views.removeSpinner();
    // show success message
    showSuccessMessage('Your image was changed');
  } catch (error) {
    showErrorMessage(error.message);
    // remove spinner
    views.removeSpinner();
  }
};
const init = async () => {
  // get active template
  await model.getTemplate();
  // check if user is logged
  if (!localStorage.getItem('logged')) {
    await views.renderPage(model.state.template);
    // remove spinner
    views.removeSpinner();
    return;
  }
  // get logged users from localStorage
  model.state.logged = JSON.parse(localStorage.getItem('logged'));
  // get all users
  await model.getAllUsers();
  // render dashboard
  views.renderDashboard({
    logged: model.state.logged,
    users: model.state.users,
  });
  // remove spinner
  views.removeSpinner();
};
init();
