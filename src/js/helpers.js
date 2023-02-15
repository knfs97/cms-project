import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
/**
 * Function to send/get data to/from database, this function can be used in APIs as well
 * @param {String} url To send/get data
 * @param {Object} uploadData Object which first property is the action to be done in DB (CRUD) and second is the data to be handled
 * @returns A promise since is a async function with the fullfil/rejected response
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          body:
            uploadData.action !== 'move'
              ? JSON.stringify(uploadData)
              : uploadData.data,
        })
      : fetch(url);

    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const hexToRgb = function (hex) {
  return [
    ('0x' + hex[1] + hex[2]) | 0,
    ('0x' + hex[3] + hex[4]) | 0,
    ('0x' + hex[5] + hex[6]) | 0,
  ];
};

////////////////////////
// tel inputs handlers
export const isNumericInput = event => {
  const key = event.keyCode;
  return (
    (key >= 48 && key <= 57) || // Allow number line
    (key >= 96 && key <= 105) // Allow number pad
  );
};

export const isModifierKey = event => {
  const key = event.keyCode;
  return (
    event.shiftKey === true ||
    key === 35 ||
    key === 36 || // Allow Shift, Home, End
    key === 8 ||
    key === 9 ||
    key === 13 ||
    key === 46 || // Allow Backspace, Tab, Enter, Delete
    (key > 36 && key < 41) || // Allow left, up, right, down
    // Allow Ctrl/Command + A,C,V,X,Z
    ((event.ctrlKey === true || event.metaKey === true) &&
      (key === 65 || key === 67 || key === 86 || key === 88 || key === 90))
  );
};

export const enforceFormat = event => {
  // Input must be of a valid number format or a modifier key, and not longer than ten digits
  if (!isNumericInput(event) && !isModifierKey(event)) event.preventDefault();
};

export const formatToPhone = event => {
  if (isModifierKey(event)) return;

  const input = event.target.value.replace(/\D/g, '').substring(0, 10); // First ten digits of input only
  const areaCode = input.substring(0, 3);
  const middle = input.substring(3, 6);
  const last = input.substring(6, 10);

  if (input.length > 6) {
    event.target.value = `(${areaCode}) ${middle} - ${last}`;
  } else if (input.length > 3) {
    event.target.value = `(${areaCode}) ${middle}`;
  } else if (input.length > 0) {
    event.target.value = `(${areaCode}`;
  }
};

export const initPlugins = () => {
  // plugin options
  const swiperOptions = {
    spaceBetween: 24,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      prevEl: '#testimonials-prev',
      nextEl: '#testimonials-next',
    },
  };
  const rellaxOptions = {
    speed: 100,
    center: false,
    wrapper: null,
    round: true,
    vertical: true,
    horizontal: false,
  };
  const tiltOption = {
    max: 25,
    speed: 500,
  };
  // swiper for testimonilas
  const swiper = new Swiper('.swiper', swiperOptions);
  // rellax for features section
  const rellax = new Rellax('.rellax', rellaxOptions);
  // tilt for image in the banner
  VanillaTilt.init(document.querySelector('.tilt-3d'), tiltOption);
};

export const showPassword = function (e) {
  const checkbox = e.target.closest('input[type="checkbox"]');
  if (!checkbox) return;
  const passwordEl = checkbox
    .closest('.password-toggle')
    ?.querySelector('.password_input');
  if (!passwordEl) return;
  passwordEl.setAttribute('type', `${checkbox.checked ? 'text' : 'password'}`);
};
export const openInputFile = function (e) {
  const imgEl = e.target.closest('img');
  if (!imgEl) return;
  this.querySelector('input[type=file]').click();
};
export const uploadImage = function (e) {
  const fileEl = e.target.closest('input[type=file]');
  if (!fileEl) return;
  const imgEl = this.querySelector('img');
  imgEl.src = URL.createObjectURL(fileEl.files[0]);
};
