import { AJAX } from './helpers.js';
import { FETCH_URL, DEFAULT_USER_IMAGE } from './config.js';
export const state = {};

const buildTemplate = data => {
  return {
    id: JSON.parse(data.id),
    hero: JSON.parse(data.hero),
    about: JSON.parse(data.about),
    services: JSON.parse(data.services),
    features: JSON.parse(data.features),
    testimonials: JSON.parse(data.testimonials),
  };
};
const buildUser = data => {
  return {
    username: data.username,
    email: data.email,
    name: data.name,
    image: data.image,
    role: data.role,
  };
};
export const getTemplate = async () => {
  try {
    // get response from database
    const [template] = await AJAX(FETCH_URL, {
      action: 'read',
      table: 'templates',
    });
    // check response data
    if (!template) throw new Error();
    // build state object with template
    state.template = buildTemplate(template);
  } catch (error) {
    console.error(error.message);
  }
};
export const getUser = async data => {
  try {
    const user = await AJAX(FETCH_URL, {
      action: 'login',
      username: data.get('username'),
      password: data.get('password'),
    });
    // check user before return
    if (!user) throw new Error('Error getting the user');
    state.logged = buildUser(user);
  } catch (error) {
    throw error;
  }
};
export const getAllUsers = async () => {
  try {
    const users = await AJAX(FETCH_URL, {
      action: 'read',
      table: 'users',
    });
    // check user before return
    if (!users) throw new Error('Error getting the user');
    const withoutLogged = users.filter(
      user => user.username !== state.logged.username
    );
    state.users = withoutLogged;
  } catch (error) {
    throw error;
  }
};
export const checkUsername = async username => {
  try {
    // get response from database
    const usernameExits = await AJAX(FETCH_URL, {
      action: 'read',
      table: 'users',
      column: 'username',
      id: username,
    });
    // check response data
    return usernameExits ? true : false;
  } catch (error) {
    console.error(error.message);
  }
};
export const createUser = async data => {
  const formattedUser = {
    username: data.username,
    password: data.password,
    name: data.name,
    email: data.email,
    image: DEFAULT_USER_IMAGE,
  };
  try {
    const response = await AJAX(FETCH_URL, {
      action: 'create',
      data: formattedUser,
      table: 'users',
    });
    if (!response) throw new Error('Something went wrong please try again');
    return response;
  } catch (error) {
    throw error;
  }
};
export const validatePassword = async password => {
  try {
    const isValid = await AJAX(FETCH_URL, {
      action: 'validate_password',
      data: password,
      table: 'users',
      column: 'username',
      id: state.logged.username,
    });
    // check user before return
    if (!isValid)
      throw new Error(
        'Password does not match with your current password, please try again'
      );
    return true;
  } catch (error) {
    throw error;
  }
};
export const updateUser = async data => {
  try {
    const updatedUser = await AJAX(FETCH_URL, {
      action: 'update',
      data,
      table: 'users',
      column: 'username',
      id: state.logged.username,
    });
    // check user before return
    if (!updatedUser) throw new Error('Error updating the user');
    state.logged.name = updatedUser.name;
    state.logged.email = updatedUser.email;
    state.logged.image = updatedUser.image;
  } catch (error) {
    throw error;
  }
};
export const updatePassword = async password => {
  try {
    const isUpdated = await AJAX(FETCH_URL, {
      action: 'update',
      data: {
        password,
      },
      table: 'users',
      column: 'username',
      id: state.logged.username,
    });
    // check user before return
    if (!isUpdated) throw new Error('Error updating password');
    return true;
  } catch (error) {
    throw error;
  }
};
export const deleteAccount = async username => {
  try {
    const isDeleted = await AJAX(FETCH_URL, {
      action: 'delete',
      table: 'users',
      column: 'username',
      id: state.logged.username,
    });
    // check user before return
    if (!isDeleted)
      throw new Error('Your account was not deleted, please try again');
    state.logged = false;
    return true;
  } catch (error) {
    throw error;
  }
};
export const changeProfileImage = async data => {
  try {
    const isChanged = await AJAX(FETCH_URL, {
      action: 'move',
      data,
      table: 'users',
      column: 'username',
      id: state.logged.username,
    });

    // check user before return
    if (!isChanged) throw new Error('Error changing image');
    const imageName = data.get('image').name;
    await updateUser({
      image: imageName,
    });
    return true;
  } catch (error) {
    throw error;
  }
};
export const updateTemplate = async data => {
  try {
    const isChanged = await AJAX(FETCH_URL, {
      action: 'update',
      data,
      table: 'templates',
      column: 'id',
      id: state.template.id,
    });

    // check user before return
    if (!isChanged) throw new Error('Error changing template');
    return true;
  } catch (error) {
    throw error;
  }
};

export const moveFile = async data => {
  try {
    const isMoved = await AJAX(FETCH_URL, {
      action: 'move',
      data,
    });
    // check user before return
    if (!isMoved) throw new Error('Error moving image');
    return true;
  } catch (error) {
    throw error;
  }
};
