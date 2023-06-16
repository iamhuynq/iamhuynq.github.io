var lazyLoadInstance = new LazyLoad({});

lightGallery(document.getElementById("gallery-videos-demo"), {
  plugins: [lgVideo],
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
