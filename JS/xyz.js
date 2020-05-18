console.log("XYZ.js has loaded for " + siteName);

// Set Page Title
function setTitle() {
  let title = siteName + ' | ' + pageName;
  document.title = title
}

// Text loader
function loadPage(url, output) {
  fetch(url)
  .then(response => response.text())
  .then(text => {document.getElementById(output).innerHTML = text})
  .catch((err) => {document.getElementById(output).innerHTML = "Can’t access " + url + " response. Blocked by browser?"});
}

// Build page
function XYZBuildPage(url) {
  fetch(url + 'navbar.html')
  .then(response => response.text())
  .then(text => {
    document.querySelector('nav').innerHTML = text
  })

  fetch(url + 'header.html')
  .then(response => response.text())
  .then(text => {
    document.querySelector('header').innerHTML = text
  })

  fetch(url + 'footer.html')
  .then(response => response.text())
  .then(text => {
    document.querySelector('footer').innerHTML = text
  })
  // .catch((err) => {
  //   document.getElementById('nav').innerHTML = "Can’t access " + url + " response. Blocked by browser?"
  // });
}

//SearchParams Test
const params = new URLSearchParams(window.location.search);

//Iterate the search parameters.
for (const param of params) {
  console.log(param);
  document.getElementById("js-param").innerHTML = 'Welcome to my website, ' + param[1] + '!';
}

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let d = new Date();
document.getElementById("day").innerHTML = days[d.getDay()];

// Set Date
function setDate() {
  document.getElementById("year").innerHTML = d.getFullYear();
}

// Sets active class on current page in navbar
function setNavigation() {
  let current_location = location.pathname;
  if (current_location === "") return;
  let nav_items = document.querySelector("nav").getElementsByTagName("a");
  for (let i = 0, len = nav_items.length; i < len; i++)
  {
    if (nav_items[i].getAttribute("href").indexOf(current_location) !== -1)
    {
      nav_items[i].className = "currentPage";
    }
  }
}
