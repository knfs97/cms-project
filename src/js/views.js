import * as handler from './controller.js';
import {
  showPassword,
  initPlugins,
  openInputFile,
  uploadImage,
} from './helpers.js';
import { state } from './model.js';
import {
  DEFAULT_USER_IMAGE,
  SITE_IDENTITY_PATH,
  UPLOADS_PATH,
} from './config.js';
export const origin = document.getElementById('origin');
export const modal = new bootstrap.Modal(
  document.querySelector('#dynamic_modal')
);
const preloader = document.querySelector('.page-loading');

/**
 * Render a bootstrap modal with customize markup and events
 * @param {Object[]} config fields: markup, events: name, handler
 */
export const openModal = config => {
  // get modal body
  const body = modal._element.querySelector('.modal-body');
  // create div
  const div = document.createElement('div');
  div.innerHTML = config.markup;
  // insert markup
  body.innerHTML = '';
  body.insertAdjacentElement('afterbegin', div);
  // add callback
  if (config.events) {
    config.events.forEach(event => {
      div.addEventListener(event.name, event.handler);
    });
  }
  modal.show();
};
export const renderSpinner = () => preloader.classList.add('active');
export const removeSpinner = () => preloader.classList.remove('active');
export const checkUserImage = imageName => {
  return imageName !== DEFAULT_USER_IMAGE
    ? UPLOADS_PATH + imageName
    : SITE_IDENTITY_PATH + DEFAULT_USER_IMAGE;
};
export const renderHeader = async parentEl => {
  const loginBtn = `
  <button class="btn btn-primary py-2 px-3" id="login"><i class="bx bx-log-in-circle fs-4 lh-1 me-1"></i>Login</button>
  `;
  const dashBoardBtn = `
  <button class="btn btn-primary py-2 px-3" id="dashboard"><i class="bx bxs-dashboard fs-4 lh-1 me-1"></i>Dashboard</button>
  `;
  const markup = `
  <header class="header navbar navbar-expand-lg navbar-dark position-absolute navbar-sticky">
      <div class="container px-3">
        <a href="index.html" class="navbar-brand pe-3">
          <img src="assets/site-identity/logo.png" class="pe-2" width="47" alt="logo">CMS
        </a>
        <div id="navbarNav" class="offcanvas offcanvas-end bg-dark">
          <div class="offcanvas-header border-bottom border-light">
            <h5 class="offcanvas-title text-white">Menu</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 justify-content-center">
              <li class="nav-item">
                <a href="#home" class="nav-link active" aria-current="page">Home</a>
              </li>
              <li class="nav-item">
                <a href="#about" class="nav-link">About</a>
              </li>
              <li class="nav-item">
                <a href="#services" class="nav-link">Services</a>
              </li>
              <li class="nav-item">
                <a href="#features" class="nav-link">Features</a>
              </li>
              <li class="nav-item">
                <a href="#testimonials" class="nav-link">Testimonials</a>
              </li>
              <li class="nav-item">
                <a href="#contact" class="nav-link">Contact</a>
              </li>
              <li class="nav-item ms-lg-5 mt-2 mt-lg-0">
                ${state.logged ? dashBoardBtn : loginBtn}
              </li>
            </ul>
          </div>
        </div>
        <button type="button" class="navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </header>
  `;
  parentEl.insertAdjacentHTML('beforeend', markup);

  const loginFormMarkup = `
    <form autocomplete="off" role="tabpanel" method="POST" class="sign_in">
      <div class="row">
        <div class="col-12 mb-3">
          <label for="login" class="form-label">Username</label>
          <input class="form-control" name="username" type="text" placeholder="Username" required>
        </div>
        <div class="col-12 mb-3">
          <label class="form-label" for="pass1">Password</label>
          <div class="password-toggle">
            <input class="form-control password_input" name="password" type="password" required>
            <label class="password-toggle-btn">
              <input class="password-toggle-check" type="checkbox"><span class="password-toggle-indicator"></span>
            </label>
          </div>
        </div>
        <div class="text-center">
          <button class="btn btn-primary shadow-primary w-50" type="submit">Sign in</button>
        </div>
      </div>
      
    </form>`;
  // set up login button
  const btn = document.querySelector('#login');
  if (btn) {
    btn.addEventListener(
      'click',
      openModal.bind(null, {
        markup: loginFormMarkup,
        events: [
          { name: 'submit', handler: handler.loginHandler },
          { name: 'change', handler: showPassword },
        ],
      })
    );
    return;
  }
  const btnDashboard = document.querySelector('#dashboard');
  const renderDashboardOptions = {
    logged: state.logged,
    users: state.users,
  };
  btnDashboard.addEventListener('click', () =>
    renderDashboard(renderDashboardOptions)
  );
};
export const renderHero = async (data, parentEl) => {
  const markup = `
  <section class="position-relative overflow-hidden" id="home">
    <div class="position-relative bg-dark zindex-4 pt-lg-3 pt-xl-5">
      <div class="container zindex-5 pt-5">
        <div class="row justify-content-center text-center pt-4 pb-sm-2 py-lg-5">
          <div class="col-xl-8 col-lg-9 col-md-10 py-5">
            <h1 class="display-5 text-light pt-sm-2 pb-1 pb-sm-3 mb-3">${data.title}</h1>
            <p class="fs-lg text-light opacity-70 pb-2 pb-sm-0 mb-4 mb-sm-5">${data.subtitle}</p>
            <a href="#contact" class="btn btn-primary shadow-primary btn-lg">Get early access</a>
          </div>
        </div>
      </div>
      <div div class="d-flex position-absolute top-100 start-0 w-100 overflow-hidden mt-n4 mt-sm-n1"    style="color: var(--si-dark);">
        <div class="position-relative start-50 translate-middle-x flex-shrink-0" style="width: 3788px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="3788" height="144" viewBox="0 0 3788 144">
            <path fill="currentColor" d="M0,0h3788.7c-525,90.2-1181.7,143.9-1894.3,143.9S525,90.2,0,0z" />
          </svg>
        </div>
      </div>
      <div class="d-none d-lg-block" style="height: 300px;"></div>
      <div class="d-none d-md-block d-lg-none" style="height: 150px;"></div>
    </div>
    <div class="position-relative zindex-5 mx-auto" style="max-width: 1250px; transform: translateZ(-100px);">
      <div class="d-none d-lg-block" style="margin-top: -300px;"></div>
      <div class="d-none d-md-block d-lg-none" style="margin-top: -150px;"></div>

      <div class="tilt-3d" data-tilt data-tilt-full-page-listening data-tilt-max="12"   data-tilt-perspective="1200">
        <img src="assets/site-identity/home.png" alt="Dashboard">
        <div class="tilt-3d-inner position-absolute top-0 start-0 w-100 h-100">
          <img src="assets/site-identity/home-layer.png" alt="Cards">
        </div>
      </div>
    </div>
    <div class="position-absolute top-0 start-0 w-100 h-100" style="background-color: rgba(255,255,255,.05);"></div>
  </section>
  `;
  parentEl.insertAdjacentHTML('beforeend', markup);
};
export const renderAbout = async (data, parentEl) => {
  const markup = `
  <section class="container pt-5 mt-2 mt-md-4 mt-lg-5 mb-5" id="about">
    <div class="row pt-xl-3">
      <div class="col-md-5 text-center text-md-start pb-5">
        <h1 class="mb-4">${data.title}</h1>
        <p class="fs-lg pb-lg-3 mb-4">${data.content}</p>
        <a href="about-v2.html" class="btn btn-primary shadow-primary btn-lg">More About Us</a>
      </div>
      <div class="col-xl-6 col-md-7 offset-xl-1 pb-4 pb-sm-3 pb-lg-0 mb-4 mb-sm-5 mb-lg-0">
        <img src="assets/uploads/${data.image}" class="rounded-3 shadow-sm" alt="Image">
      </div>
    </div>
  </section>
  `;
  parentEl.insertAdjacentHTML('beforeend', markup);
};
export const renderServices = async (data, parentEl) => {
  const markup = `
  <section class="bg-secondary pb-md-2 pb-lg-5" id="services">
    <div class="d-none d-lg-block" style="margin-top: -60px; padding-top: 60px;"></div>
    <div class="container pb-4 pt-5">
      <h2 class="h1 text-center text-md-start mb-lg-4 pt-1 pt-md-4">Our Services</h2>
      <div class="row align-items-center pb-5 mb-lg-2">
        <div class="col-md-8 text-center text-md-start">
          <p class="fs-lg text-muted mb-md-0">We are focused on helping brands grow through digital transformation services. We bring real solutions to each client’s problems through a deep understanding of their market, solution, and vision.</p>
        </div>
      </div>
      <div class="row row-cols-1 row-cols-md-2 services_body">
      </div>
    </div>
  </section>
  `;
  parentEl.insertAdjacentHTML('beforeend', markup);

  // insert each service
  const servicesElBody = document.querySelector('.services_body');
  data.forEach(service => {
    const markup = `
    <div class="col py-4 my-2 my-sm-3">
      <div class="card card-hover h-100 border-0 shadow-sm text-decoration-none pt-5 px-sm-3 px-md-0 px-lg-3 pb-sm-3 pb-md-0 pb-lg-3 me-xl-2">
        <div class="card-body pt-3">
          <div class="d-inline-block bg-primary shadow-primary rounded-3 position-absolute top-0  translate-middle-y p-3">
           <i class="bx ${service.icon} text-light fs-2"></i>
          </div>
          <h2 class="h4 d-inline-flex align-items-center">
            ${service.title}
          </h2>
          <p class="fs-sm text-body mb-0">${service.content}</p>
        </div>
      </div>
    </div>`;
    servicesElBody.insertAdjacentHTML('beforeend', markup);
  });
};
export const renderFeatures = async (data, parentEl) => {
  const markup = `
    <section id="features" class="container pt-2 pt-lg-2 pt-xl-5 pb-3 pb-xl-5 mt-n2 mt-sm-0 mb-2 mb-md-4  mb-lg-5">
    <div class="row pb-xl-3">
      <div class="col-lg-5 d-none d-lg-block">
        <div class="position-relative mx-auto mb-5 m-md-0" style="max-width: 526px;">
          <img src="assets/site-identity/phone.png" class="d-block" alt="Device">
          <div class="rellax d-block position-absolute top-0 end-0 w-100 mt-md-4 me-md-n5" alt="App Screen" data-rellax-percentage="0.5" data-rellax-vertical-scroll-axis="xy" data-rellax-horizontal-speed="0.6" data-rellax-vertical-speed="-0.6" data-disable-parallax-down="md" style="transform: translate3d(-96px, -8px, 0px);">
            <img src="assets/site-identity/screen.png">
          </div>
        </div>
      </div>
      <div class="col-lg-7">
        <h2 class="h1 text-center text-md-start mb-4">App Features</h2>
        <p class="fs-lg text-muted text-center text-md-start mb-4 mb-xl-5">Lorem ipsum dolor sit amet,  consectetur
          adipiscing elit. Proin volutpat mollis egestas. Nam luctus facilisis ultrices. Pellentesque   volutpat ligula
          est. Mattis fermentum, at nec lacus.</p>
        <div class="row pt-2 pt-sm-3 pt-xl-2 features_body">
        </div>
      </div>
    </div>
  </section>
  `;
  parentEl.insertAdjacentHTML('beforeend', markup);

  // insert each service
  const featuresBody = document.querySelector('.features_body');
  data.forEach(feature => {
    const markup = `
    <div class="col-12 col-lg-5 pb-2 pb-xl-4">
      <div class="d-flex align-items-start pe-xl-3">
        <div class="d-table bg-secondary rounded-3 flex-shrink-0 p-3 mb-3">
          <i class="bx ${feature.icon} text-primary fs-2"></i>
        </div>
        <div class="ps-4 ps-sm-3 ps-md-4">
          <h3 class="h5 pb-1 mb-2">${feature.title}</h3>
          <p class="mb-0">
            ${feature.content}
          </p>
        </div>
      </div>
    </div>`;
    featuresBody.insertAdjacentHTML('beforeend', markup);
  });
};
export const renderTestimonials = async (data, parentEl) => {
  const markup = `
    <section class="container pt-md-5 pb-5" id="testimonials">
      <div class="row">
        <div class="col-md-5">
          <div class="card h-100 border-0 overflow-hidden px-md-4">
            <span class="bg-gradient-primary position-absolute top-0 start-0 w-100 h-100 opacity-10 d-none d-md-block"></span>
            <div class="card-body d-flex flex-column align-items-center justify-content-center    position-relative zindex-2 p-0 pb-2 p-lg-4">
              <h2 class="h1 text-center text-md-start p-lg-2">Testimonials</h2>
              <h6 class="text-muted text-center text-md-start">What our customer think about us</h6>
            </div>
          </div>
        </div>
        <div class="col-md-7">
          <div class="card border-0 shadow-sm p-4 p-xxl-5">
            <div class="d-flex justify-content-between pb-4 mb-2">
              <span class="btn btn-icon btn-primary btn-lg shadow-primary pe-none">
                <i class="bx bxs-quote-left"></i>
              </span>
              <div class="d-flex">
                <button type="button" id="testimonials-prev" class="btn btn-prev btn-icon btn-sm me-2">
                  <i class="bx bx-chevron-left"></i>
                </button>
                <button type="button" id="testimonials-next" class="btn btn-next btn-icon btn-sm ms-2">
                  <i class="bx bx-chevron-right"></i>
                </button>
              </div>
            </div>

            <div class="swiper mx-0 mb-md-n2 mb-xxl-n3">
              <div class="swiper-wrapper">
                
              </div>
                
              <div class="swiper-pagination position-relative mt-5"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
  parentEl.insertAdjacentHTML('beforeend', markup);

  // insert each service
  const testimonialsBody = document.querySelector('.swiper-wrapper');
  data.forEach(testimonial => {
    const markup = `
    <div class="swiper-slide h-auto">
      <figure class="card h-100 position-relative border-0 bg-transparent">
        <blockquote class="card-body p-0 mb-0">
          <p class="fs-lg mb-0">${testimonial.content}</p>
        </blockquote>
        <figcaption class="card-footer border-0 d-flex align-items-center w-100 pb-2">
          <div class="ps-3">
            <h6 class="fw-semibold lh-base mb-0">${testimonial.author}</h6>
          </div>
        </figcaption>
      </figure>
    </div>`;
    testimonialsBody.insertAdjacentHTML('beforeend', markup);
  });
};
export const renderContact = async parentEl => {
  const markup = `
  <section class="position-relative bg-secondary pt-5 mb-5" id="contact">
    <div class="container position-relative zindex-2 pt-5">
      <div class="row">
      <div class="col-xl-4 col-lg-5 pb-4 pb-sm-5 mb-2 mb-sm-0">
        <div class="pe-lg-4 pe-xl-0">
          <h1 class="pb-3 pb-md-4 mb-lg-5">Contact Us</h1>
          <div class="d-flex align-items-start pb-3 mb-sm-1 mb-md-3">
            <div class="bg-light text-primary rounded-circle flex-shrink-0 fs-3 lh-1 p-3">
              <i class="bx bx-envelope"></i>
            </div>
            <div class="ps-3 ps-sm-4">
              <h2 class="h4 pb-1 mb-2">Email us</h2>
              <p class="mb-2">mail@mail.de</p>
            </div>
          </div>
          <div class="d-flex align-items-start pb-3 mb-sm-1 mb-md-3">
            <div class="bg-light text-primary rounded-circle flex-shrink-0 fs-3 lh-1 p-3">
              <i class="bx bx-map"></i>
            </div>
            <div class="ps-3 ps-sm-4">
              <h2 class="h4 pb-1 mb-2">Location</h2>
              <p class="mb-2">La esquina de tu casa</p>
            </div>
          </div>
          <div class="d-flex align-items-start pb-3 mb-sm-1 mb-md-3">
            <div class="bg-light text-primary rounded-circle flex-shrink-0 fs-3 lh-1 p-3">
              <i class="bx bx-phone"></i>
            </div>
            <div class="ps-3 ps-sm-4">
              <h2 class="h4 pb-1 mb-2">Phone</h2>
              <p class="mb-2">(514)-215-5489</p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-6 col-lg-7 offset-xl-2">
        <div class="card border-light shadow-lg py-3 position-relative">
          <div class="d-flex justify-content-center pt-3 position-absolute w-100 social_media_body" style="top: -2.5rem">
          <a href="#" class="btn btn-icon btn-primary btn-facebook rounded-circle mx-2">
          <i class="bx bxl-facebook"></i>
        </a>
        <a href="#" class="btn btn-icon btn-primary btn-instagram rounded-circle mx-2">
          <i class="bx bxl-instagram"></i>
        </a>
        <a href="#" class="btn btn-icon btn-primary btn-google rounded-circle mx-2">
          <i class="bx bxl-google"></i>
        </a>
        <a href="#" class="btn btn-icon btn-primary btn-tiktok rounded-circle mx-2">
          <i class="bx bxl-tiktok"></i>
        </a>
        <a href="#" class="btn btn-icon btn-primary btn-linkedin rounded-circle mx-2">
          <i class="bx bxl-linkedin"></i>
        </a>
          </div>
          <div class="card-body position-relative zindex-2  p-sm-4 p-md-5">
            <h2 class="card-title pb-3 mb-4 text-center">Get Online Consultation</h2>
            <form class="row g-4 needs-validation" novalidate>
              <div class="col-12">
                <label for="fn" class="form-label fs-base">Full name</label>
                <input type="text" class="form-control form-control-lg" id="fn" required>
                <div class="invalid-feedback">Please enter your full name!</div>
              </div>
              <div class="col-12">
                <label for="email" class="form-label fs-base">Email address</label>
                <input type="email" class="form-control form-control-lg" id="email" required>
                <div class="invalid-feedback">Please provide a valid email address!</div>
              </div>
              <div class="col-12">
                <label for="specialist" class="form-label fs-base">Specialist</label>
                <select class="form-select form-select-lg" id="specialist" required>
                  <option value="" selected disabled>Choose a specialist</option>
                  <option value="Therapist">Therapist</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="Gynecologist">Gynecologist</option>
                  <option value="Surgeon">Surgeon</option>
                </select>
                <div class="invalid-feedback">Choose a specialist from the list!</div>
              </div>
              <div class="col-sm-6">
                <label for="date" class="form-label fs-base">Date</label>
                <input type="text" class="form-control form-control-lg" id="date" data-format='{"date": true, "datePattern": ["m", "d"]}' placeholder="mm/dd" required>
                <div class="invalid-feedback">Enter a date!</div>
              </div>
              <div class="col-sm-6">
                <label for="time" class="form-label fs-base">Time</label>
                <input type="text" class="form-control form-control-lg" id="time" data-format='{"time": true, "timePattern": ["h", "m"]}' placeholder="hh:mm" required>
                <div class="invalid-feedback">Enter a time!</div>
              </div>
              <div class="col-12 pt-2 pt-sm-3 text-center">
                <button type="button" class="btn btn-lg btn-primary w-100 w-sm-auto">Make an appointment</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="position-absolute bottom-0 start-0 w-100 bg-light" style="height: 8rem;"></div>
</section>
  `;
  parentEl.insertAdjacentHTML('beforeend', markup);
};
const renderSidebar = async (data, parentEl) => {
  const userImage = checkUserImage(data.image);
  // clean parent element
  const markup = `
  <section class="container-fluid">
  <div class="row">
    <aside class="col-lg-3 px-4 border-end">
      <div class="position-sticky top-0 pb-5">
        <div class="text-center pt-5">
          <div class="d-table position-relative mx-auto mt-2 mt-lg-4 pt-5 mb-3">
            <img src="${userImage}" class="d-block" width="120" alt="user_image">
            <button type="button"
              class="btn btn-icon btn-light bg-white btn-sm border rounded-circle shadow-sm position-absolute bottom-0 end-0 mt-4"
              data-bs-toggle="tooltip" data-bs-placement="bottom" title="Change picture" id="change_user_image">
              <i class="bx bx-refresh"></i>
            </button>
          </div>
          <h2 class="h5 mb-1">${data.name}</h2>
          <p class="mb-3 pb-3">${data.email}</p>
          <button type="button" class="btn btn-secondary d-md-none mt-n2 mb-3" data-bs-toggle="collapse"
            data-bs-target="#options">
            <i class="bx bxs-user-detail fs-xl me-2"></i>
            Options
            <i class="bx bx-chevron-down fs-lg ms-1"></i>
          </button>
          <div id="options" class="list-group list-group-flush collapse d-md-block">
            <div class="list-group-item list-group-item-action d-flex align-items-center"
              data-tab-key="account_details" data-tab-action="view">
              <div class="col-1">
                <i class="bx bx-cog fs-xl opacity-60 me-2"></i>
              </div>
              <div class="col-11 d-flex justify-content-start">
                Account Details
              </div>
            </div>
            <div class="list-group-item list-group-item-action d-flex align-items-center active"
              data-tab-action="view" data-tab-key="users">
              <div class="col-1">
                <i class="bx bx-user fs-xl opacity-60 me-2"></i>
              </div>
              <div class="col-9 d-flex justify-content-start">
                Users
              </div>
              <div class="col-2">
                <i class='bx bx-user-plus bg-light shadow-light shadow-lg px-3 rounded-3 text-primary fs-4 create_user'
                  data-tab-action="create"></i>
              </div>
            </div>
            <div class="list-group-item list-group-item-action d-flex align-items-center" data-tab-action="view"
              data-tab-key="preview">
              <div class="col-1">
                <i class="bx bx-show fs-xl opacity-60 me-2"></i>
              </div>
              <div class="col-11 d-flex justify-content-start">
                Preview
              </div>
            </div>
            <div class="btn-group dropdown w-100">
              <button type="button" class="list-group-item list-group-item-action dropdown-toggle"
                data-bs-toggle="dropdown" aria-has-popup="true" aria-expanded="false" style="text-align: start;">
                <i class='bx bx-collection'></i>
                Page parts
              </button>
              <div class="dropdown-menu my-1 w-100">
                <div class="list-group-item list-group-item-action d-flex align-items-center" data-tab-action="view" data-tab-key="home">
                  <div class="col-1">
                    <i class="bx bx-home fs-xl opacity-60 me-2"></i>
                  </div>
                  <div class="col-12 d-flex justify-content-start">
                    Home
                  </div>
                </div>
                <div class="list-group-item list-group-item-action d-flex align-items-center" data-tab-action="view" data-tab-key="about">
                  <div class="col-1">
                    <i class="bx bx-user-pin fs-xl opacity-60 me-2"></i>
                  </div>
                  <div class="col-12 d-flex justify-content-start">
                    About
                  </div>
                </div>
                <div class="list-group-item list-group-item-action d-flex align-items-center" data-tab-action="view" data-tab-key="services">
                  <div class="col-1">
                    <i class="bx bx-wrench fs-xl opacity-60 me-2"></i>
                  </div>
                  <div class="col-12 d-flex justify-content-start">
                    Services
                  </div>
                </div>
                <div class="list-group-item list-group-item-action d-flex align-items-center" data-tab-action="view" data-tab-key="features">
                  <div class="col-1">
                    <i class="bx bx-diamond fs-xl opacity-60 me-2"></i>
                  </div>
                  <div class="col-12 d-flex justify-content-start">
                    Features
                  </div>
                </div>
                <div class="list-group-item list-group-item-action d-flex align-items-center" data-tab-action="view"
                  data-tab-key="testimonials">
                  <div class="col-1">
                    <i class="bx bx-message-alt-detail fs-xl opacity-60 me-2"></i>
                  </div>
                  <div class="col-12 d-flex justify-content-start">
                    Testimonials
                  </div>
                </div>
              </div>
            </div>
            <div class="list-group-item list-group-item-action d-flex align-items-center" data-tab-action="view" data-tab-key="logout">
              <div class="col-1">
                <i class="bx bx-log-out-circle fs-xl opacity-60 me-2"></i>
              </div>
              <div class="col-11 d-flex justify-content-start">
                Sign Out
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
    <div class="col-lg-9 mb-2 mb-lg-4 pt-5 mt-5 rounded-3" id="sidebar_origin"></div>
  </div>
</section>
  `;
  // clean parent
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('beforeend', markup);

  // add event listener to handler tabs
  const options = document.querySelector('#options');
  options.addEventListener('click', handler.sidebarHandler);
  const change_image_button = document.querySelector('#change_user_image');
  const popUpImage = checkUserImage(state.logged.image);
  const changeImageMarkup = `
  <form>
    <div class="mb-5 text-center position-relative">
      <img src="${popUpImage}" class="btn" alt="change_image" style="width: 15rem;">
      <input hidden class="form-control" name="image" type="file" accept="image/png, image/gif, image/jpeg">
      <div class="form-text">Click image to change your profile picture</div>
      <p class="feedback badge bg-opacity-10 w-100 start-0 py-2 text-danger bg-danger position-absolute"></p>
    </div>
    <div class="mt-4 text-center">
      <button type="submit" class="btn btn-primary">Change</button>
    </div>
  </form>`;
  change_image_button.addEventListener(
    'click',
    openModal.bind(this, {
      markup: changeImageMarkup,
      events: [
        {
          name: 'submit',
          handler: handler.changeProfileImageHandler,
        },
        {
          name: 'click',
          handler: openInputFile,
        },
        {
          name: 'change',
          handler: uploadImage,
        },
      ],
    })
  );
  // to add new user
  setCreateUser();
};
export const errorMessageMarkup = message => {
  return `
  <div>
    <p class="text-center text-danger">${message}</p>
    <hr class="py-3">
    <div class="text-center">
      <button type="button" class="btn btn-danger" data-bs-dismiss="modal">OK</button>
    </div>
  </div>`;
};
export const successMessageMarkup = message => {
  return `
  <div>
    <p class="text-center text-success">${message}</p>
    <hr class="py-3">
    <div class="text-center">
      <button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
    </div>
  </div>`;
};
export const renderUsers = async data => {
  const parentEl = document.querySelector('#sidebar_origin');
  parentEl.innerHTML = '';
  const markup = `
  <div class="ps-md-3 ps-lg-4 mt-md-2 pt-md-4 pb-md-2 users_wrapper">
    <div class="d-sm-flex align-items-center justify-content-start pt-xl-1 mb-3 pb-3">
      <h1 class="h2 mb-sm-0">Users</h1>
    </div>
  </div>`;
  // insert right side of the sidebar
  parentEl.insertAdjacentHTML('afterbegin', markup);
  data.forEach(user => {
    const userImage = checkUserImage(user.image);
    const userMarkup = `
    <div class="card border-0 shadow-lg overflow-hidden mb-4" >
      <div class="row g-0 ps-2">
        <div class="col-sm-2 bg-repeat-0 bg-position-center bg-size-contain" style="background-image: url(${userImage});"></div>
        <div class="col-sm-10">
          <div class="card-body">
            <h2 class="h4 pb-1 mb-2">
              ${user.name}
            </h2>
            <p class="mb-4 mb-lg-5">${user.email}</p>
            <div class="d-flex">
              <button type="button" class="btn btn-outline-danger px-3 px-lg-4">
                <i class="bx bx-trash-alt fs-xl me-xl-2"></i>
                <span class="d-none d-xl-inline">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
    const userWrapper = document.querySelector('.users_wrapper');
    userWrapper.insertAdjacentHTML('beforeend', userMarkup);
  });
};
export const renderDashboard = async data => {
  // render sidebar
  await renderSidebar(data.logged, origin);
  // render all users as default
  await renderUsers(data.users, origin);
};
export const setCreateUser = () => {
  const markup = `
  <form class="needs-validation" id="create_user">
  <div class="row">
    <div class="col-12 position-relative" style="margin-bottom: 2rem;">
      <label for="username" class="form-label">Username</label>
        <input class="form-control" type="text" name="username" placeholder="Username" required>
        <p class="feedback badge mb-0 bg-opacity-10 py-2 text-danger bg-danger position-absolute"></p>
      </div>
  </div>
  <div class="col-12" style="margin-bottom: 2rem;">
    <label for="name" class="form-label">Name</label>
    <input class="form-control" type="text" name="name" placeholder="Name" required>
  </div>
  <div class="col-12" style="margin-bottom: 2rem;">
    <label for="email" class="form-label">Email</label>
    <input class="form-control" type="email" name="email" placeholder="Email"  required>
  </div>
  <div class="col-12" style="margin-bottom: 2rem;">
    <label class="form-label" for="password">Password</label>
    <div class="password-toggle position-relative">
      <input class="form-control password_input" name="password" type="password" required>
      <label class="password-toggle-btn">
        <input class="password-toggle-check" type="checkbox"><span class="password-toggle-indicator"></span>
      </label>
      <p class="feedback badge bg-opacity-10 py-2 text-danger bg-danger position-absolute"></p>
    </div>
  </div>
  <div class="col-12" style="margin-bottom: 2rem;">
    <label class="form-label" for="confirm_password">Confirm password</label>
    <div class="password-toggle position-relative">
      <input class="form-control password_input" name="confirm_password" type="password" required>
      <label class="password-toggle-btn">
        <input class="password-toggle-check" type="checkbox"><span class="password-toggle-indicator"></span>
      </label>
      <p class="feedback badge bg-opacity-10 py-2 text-danger bg-danger position-absolute"></p>
    </div>
  </div>
  <div class="col-12 text-center pt-2" style="margin-bottom: 2rem;">
    <button class="btn btn-primary" type="submit">Create</button>
  </div>
</form>
  `;
  // add action listeners to buttons in sidebar
  const createUserEl = document.querySelector('.create_user');

  createUserEl.addEventListener(
    'click',
    openModal.bind(this, {
      markup,
      events: [
        {
          name: 'focusout',
          handler: handler.usernameHandler,
        },
        {
          name: 'input',
          handler: handler.passwordsHandler,
        },
        {
          name: 'change',
          handler: showPassword,
        },
        {
          name: 'submit',
          handler: handler.submitNewUserHandler,
        },
      ],
    })
  );
};
export const renderAccountDetails = data => {
  const parentEl = document.querySelector('#sidebar_origin');
  const markup = `
  <div class="container px-5 mt-md-2 py-md-4">
  <h1 class="h2 pt-xl-1 pb-3">Account Details</h1>
  <form method="POST" class="p-4 shadow-lg rounded-4 shadow-primary mb-4 update_user">
    <h2 class="h5 text-primary mb-4">Basic info</h2>
    <div class="row pb-2">
      <div class="col-12 mb-4">
        <label for="name" class="form-label">Name</label>
        <input class="form-control" type="text" value="${data.name}" name="name" required>
      </div>
      <div class="col-12 mb-4">
        <label for="email" class="form-label">Email</label>
        <input class="form-control" type="email" value="${data.email}" name="email" required>
      </div>
    </div>
    <div class="text-start">
      <button class="btn btn-secondary" type="submit">Update</button>
    </div>
  </form>
  <form method="POST" class="p-4 shadow-lg rounded-4 shadow-primary mb-4 update_password">
    <h2 class="h5 text-primary mb-4">Security</h2>
    <div class="row">
      <div class="col-12">
        <label class="form-label" for="password">Current Password</label>
        <div class="password-toggle position-relative">
          <input class="form-control password_input" name="password" type="password" required>
          <label class="password-toggle-btn">
            <input class="password-toggle-check" type="checkbox"><span class="password-toggle-indicator"></span>
          </label>
        </div>
      </div>
    </div>
    <div class="text-start pt-2">
      <button type="submit" class="btn btn-success">Validate</button>
    </div>
  </form>

  <form method="POST" class="shadow-lg rounded-4 shadow-primary p-4 delete_account">
    <h2 class="h5 text-primary">Delete account</h2>
    <input type="checkbox" class="form-check-input" required>
    <label for="delete-account" class="form-check-label fs-base">Yes, I want to delete my account</label>
    <div class="text-start pt-2">
      <button type="submit" class="btn btn-danger">Delete</button>
    </div>
  </form>
</div>
  `;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);

  // add submit listeners
  const updateInfoForm = parentEl.querySelector('.update_user');
  const updatePasswordForm = parentEl.querySelector('.update_password');
  const deleteAccountForm = parentEl.querySelector('.delete_account');
  updateInfoForm.addEventListener('submit', handler.updateUserHandler);
  updatePasswordForm.addEventListener(
    'submit',
    handler.validatePasswordHandler
  );
  deleteAccountForm.addEventListener('submit', handler.deleteAccountHandler);
  document
    .querySelector('.password-toggle-check')
    .addEventListener('change', showPassword);
};
export const changePasswordMarkup = () =>
  `
  <form class="row">
    <div class="col-12" style="margin-bottom: 2rem;">
      <label class="form-label" for="password">Password</label>
      <div class="password-toggle position-relative">
        <input class="form-control password_input" name="password" type="password" required>
        <label class="password-toggle-btn">
          <input class="password-toggle-check" type="checkbox"><span class="password-toggle-indicator"></span>
        </label>
        <p class="feedback badge bg-opacity-10 py-2 text-danger bg-danger position-absolute"></p>
      </div>
    </div>
    <div class="col-12" style="margin-bottom: 2rem;">
      <label class="form-label" for="confirm_password">Confirm password</label>
      <div class="password-toggle position-relative">
        <input class="form-control password_input" name="confirm_password" type="password" required>
        <label class="password-toggle-btn">
          <input class="password-toggle-check" type="checkbox"><span class="password-toggle-indicator"></span>
        </label>
        <p class="feedback badge bg-opacity-10 py-2 text-danger bg-danger position-absolute"></p>
      </div>
    </div>
    <div class="col-12 text-center">
      <button type="submit" class="btn btn-primary">Change</button>
    </div>
  </form>`;
export const renderChangePart = async templatePart => {
  const parentEl = document.querySelector('#sidebar_origin');
  parentEl.innerHTML = '';

  switch (templatePart) {
    case 'home':
      parentEl.insertAdjacentHTML(
        'beforeend',
        changeHomeMarkup(state.template.hero)
      );
      document
        .querySelector('#home')
        .addEventListener('submit', handler.submitChangeHomeHandler);
      break;
    case 'about':
      parentEl.insertAdjacentHTML(
        'beforeend',
        changeAboutMarkup(state.template.about)
      );
      const aboutForm = document.querySelector('#about');
      aboutForm.addEventListener('click', openInputFile);
      aboutForm.addEventListener('change', uploadImage);
      aboutForm.addEventListener('submit', handler.submitChangeAboutHandler);
      break;
    case 'services':
      repeaterPartMarkup(state.template.services, parentEl, 'services');
      const servicesContainer = document.querySelector(
        '[data-item-type=services]'
      );
      const onServiceClickHandler = e => {
        const clickedItem = e.target.closest('[data-item-key]');
        if (!clickedItem) return;
        openModal({
          markup: changeServiceForm(clickedItem.dataset.itemKey),
          events: [
            {
              name: 'submit',
              handler: handler.submitChangeServiceHandler,
            },
          ],
        });
      };
      servicesContainer.addEventListener('click', onServiceClickHandler);
      break;
    case 'features':
      repeaterPartMarkup(state.template.features, parentEl, 'features');
      const featuresContainer = document.querySelector(
        '[data-item-type=features]'
      );
      const onFeatureClickHandler = e => {
        const clickedItem = e.target.closest('[data-item-key]');
        if (!clickedItem) return;
        openModal({
          markup: changeFeaturesForm(clickedItem.dataset.itemKey),
          events: [
            {
              name: 'submit',
              handler: handler.submitChangeFeaturesHandler,
            },
          ],
        });
      };
      featuresContainer.addEventListener('click', onFeatureClickHandler);
      break;
    case 'testimonials':
      repeaterPartMarkup(state.template.testimonials, parentEl, 'testimonials');
      const testimonialContainer = document.querySelector(
        '[data-item-type=testimonials]'
      );
      const onTestimonialClickHandler = e => {
        const clickedItem = e.target.closest('[data-item-key]');
        if (!clickedItem) return;
        openModal({
          markup: changeTestimonialsForm(clickedItem.dataset.itemKey),
          events: [
            {
              name: 'submit',
              handler: handler.submitChangeTestimonialsHandler,
            },
          ],
        });
      };
      testimonialContainer.addEventListener('click', onTestimonialClickHandler);
      break;
    case 'contact':
  }
};
const changeHomeMarkup =
  data => `<form action="" id="home" class="p-4 shadow-lg rounded-4 shadow-primary mb-4">
<h2 class="h5 text-primary mb-4">Home</h2>
<div class="mb-4">
  <label for="title" class="form-label">Title</label>
  <input class="form-control" type="text" name="title" value="${data.title}" required>
</div>
<div class="mb-4">
  <label for="subtitle" class="form-label">Sub Title</label>
  <input class="form-control" type="text" name="subtitle" value="${data.subtitle}" required>
</div>
<div class="mb-4">
  <button type="submit" class="btn btn-primary"><i class='bx bx-edit me-2'></i>Change</button>
</div>
</form>`;
const changeAboutMarkup =
  data => `<form action="" id="about" class="p-4 shadow-lg rounded-4 shadow-primary mb-4">
  <h2 class="h5 text-primary mb-4">About</h2>
  <div class="mb-5 position-relative text-start">
    <img src="assets/uploads/${data.image}" class="rounded-3 shadow-sm" alt="about_image" width="300">
    <input hidden class="form-control" name="image" type="file" accept="image/png, image/gif, image/jpeg">
    <div class="form-text">Click image to change it</div>
    <p class="feedback badge bg-opacity-10 w-100 start-0 py-2 text-danger bg-danger position-absolute"></p>
  </div>
  <div class="mb-4">
    <label for="title" class="form-label">Title</label>
    <input class="form-control" type="text" name="title" value="${data.title}">
  </div>
  <div class="mb-4">
    <label for="content" class="form-label">Content</label>
    <textarea class="form-control" name="content" rows="5">${data.content}</textarea>
  </div>
  <div class="mb-4">
    <button type="submit" class="btn btn-primary"><i class='bx bx-edit me-2'></i>Change</button>
  </div>
</form>`;
const repeaterPartMarkup = (data, parentEl, partName) => {
  const markup = `
  <div class="p-4 shadow-lg rounded-4 shadow-primary mb-4 position-relative" data-item-type="${partName}">
    <h2 class="h5 text-primary mb-4 ">${partName}</h2>
    <div class="row all_items gy-3"></div>
  </div>
  `;
  parentEl.insertAdjacentHTML('beforeend', markup);
  const container = document.querySelector('.all_items');

  data.forEach(item => {
    const title = item.title ? item.title : item.author;
    const markup = `
    <div class="card border-0 shadow-sm" data-item-key="${item.id}">
  <div class="card-body">
    <h5 class="card-title">${title}</h5>
    <p class="card-text fs-sm">${item.content}</p>
    <button type="button" class="btn btn-primary me-2"><i class='bx bx-edit me-2'></i>Edit</button>
  </div>
  </div>
    `;
    container.insertAdjacentHTML('beforeend', markup);
  });
};
export const changeServiceForm = key => {
  const service = state.template.services.find(service => service.id === key);
  const markup = `<form action="" class="shadow-lg p-4 rounded-3" id="services" data-item-key="${service.id}">
<input type="text" hidden name="icon">
<div class="d-flex justify-content-start">
  <span class="align-items-center current_icon d-flex fs-4 justify-content-center mb-3 me-3 px-4 rounded-3 shadow-sm text-primary">
    <i class='bx ${service.icon}'></i>
  </span>
  <button type="button" class="btn btn-outline-secondary mb-3" data-bs-toggle="offcanvas"
    data-bs-target="#icons_modal">
    Select new icon
  </button>
</div>
<div class="mb-4">
  <label for="title" class="form-label">Title</label>
  <input class="form-control" type="text" name="title" value="${service.title}">
</div>
<div class="mb-4">
  <label for="content" class="form-label">Content</label>
  <textarea class="form-control" name="content" rows="5">${service.content}</textarea>
</div>
<div class="mb-4 text-center">
<button type="submit" class="btn btn-primary me-2"><i class='bx bx-edit me-2'></i>Edit</button>
</div>
</form>`;
  return markup;
};
export const changeFeaturesForm = key => {
  const feature = state.template.features.find(feature => feature.id === key);

  const markup = `<form action="" class="shadow-lg p-4 rounded-3" id="features" data-item-key="${feature.id}">
<input type="text" hidden name="icon">
<div class="d-flex justify-content-start">
  <span class="align-items-center current_icon d-flex fs-4 justify-content-center mb-3 me-3 px-4 rounded-3 shadow-sm text-primary">
    <i class='bx ${feature.icon}'></i>
  </span>
  <button type="button" class="btn btn-outline-secondary mb-3" data-bs-toggle="offcanvas"
    data-bs-target="#icons_modal">
    Select new icon
  </button>
</div>
<div class="mb-4">
  <label for="title" class="form-label">Title</label>
  <input class="form-control" type="text" name="title" value="${feature.title}">
</div>
<div class="mb-4">
  <label for="content" class="form-label">Content</label>
  <textarea class="form-control" name="content" rows="5">${feature.content}</textarea>
</div>
<div class="mb-4">
<button type="submit" class="btn btn-primary me-2"><i class='bx bx-edit me-2'></i>Edit</button>
</div>
</form>`;
  return markup;
};

export const changeTestimonialsForm = key => {
  const testimonial = state.template.testimonials.find(
    testimonial => testimonial.id === key
  );
  const markup = `<form action="" class="shadow-lg p-4 rounded-3" id="testimonials" data-item-key="${testimonial.id}">
  <div class="mb-4">
    <label for="title" class="form-label">Title</label>
    <input class="form-control" type="text" name="author" value="${testimonial.author}">
  </div>
  <div class="mb-4">
    <label for="content" class="form-label">Content</label>
    <textarea class="form-control" name="content" rows="5">${testimonial.content}</textarea>
  </div>
  <div class="mb-4">
  <button type="submit" class="btn btn-primary me-2"><i class='bx bx-edit me-2'></i>Edit</button>
  </div>
  </form>`;
  return markup;
};

// export const renderUser
export const renderPage = async data => {
  // clean origin
  origin.innerHTML = '';
  await renderHeader(origin);
  await renderHero(data.hero, origin);
  await renderAbout(data.about, origin);
  await renderServices(data.services, origin);
  await renderFeatures(data.features, origin);
  await renderTestimonials(data.testimonials, origin);
  await renderContact(origin);
  // init plugins
  initPlugins();
};
