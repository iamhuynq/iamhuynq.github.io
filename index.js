AOS.init({
});

var lazyLoadInstance = new LazyLoad({
  threshold: 800,
});

const btn = document.getElementById("back-to-top");

window.onscroll = function () {
  var pageOffset =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (pageOffset > 450) {
    btn.classList.remove("invisible");
  } else btn.classList.add("invisible");
};

btn.addEventListener("click", function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

const signupBtn = document.getElementById("sign-up-btn");
const form = document.getElementById("sign-up-form");
const requiredInput = ["name", "phone", "email"];

signupBtn.addEventListener("click", function () {
  const formData = new FormData(form);
  const formProps = Object.fromEntries(formData);
  let isError = false;
  for (let index = 0; index <= 2; index++) {
    const name = requiredInput[index];
    const error = form.querySelectorAll(`span[data-name="${name}"]`);
    if (!formProps[name]) {
      if (error[0]) error[0].classList.remove("opacity-0");
      isError = true;
      break;
    } else {
      if (error[0]) error[0].classList.add("opacity-0");
    }
  }
  if (isError) return;
  fetch("contact.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      credentials: "same-origin",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify(formProps),
  })
    .then((data) => {})
    .then((txt) => {
      thankModal.classList.remove("hidden");
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => form.reset());
});

const thankModal = document.getElementById("thank-modal");

thankModal.addEventListener("click", function () {
  thankModal.classList.add("hidden");
});

const prepareCaption = document.querySelector(".prepareCaption");

const signUpNavigation = document.getElementById("sign-up-navigation");
signUpNavigation.addEventListener("click", function () {
  const y = form.getBoundingClientRect().top + window.scrollY - 100;
  window.scroll({
    top: y,
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      entry.target.classList.add("start");
    }
  });
});

observer.observe(document.getElementById("animation-section"));
observer.observe(document.getElementById("animation-section-mobile"));