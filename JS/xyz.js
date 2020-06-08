// XYZ.js

/*
- XYZ SETUP STAGE

declare variables
setup XYZConsole
load XYZConfig.json
setup custom elements

- PAGE BUILD STAGE

set title
insert page content into layout
define custom elements

*/

let layout

// Custom logging function
function XYZConsole(text) {
  // Log types
  let log = 'color:#888;font-size:20px;'
  let warn = 'color:#e00000;font-size:20px;background-color:red;'
  // Styling the XYZ tag
  let xCSS = 'color:rgb(203, 63, 80);font-size:20px;'
  let yCSS = 'color:rgb(119, 215, 103);font-size:20px;'
  let zCSS = 'color:rgb(37, 105, 195);font-size:20px;'
  // XYZ tag at the start of a message
  let xyzTag = '%c[%cX%cY%cZ%c] %s'
  // Sending the message to the log
  let type = log;

  console.log(xyzTag, type, xCSS, yCSS, zCSS, type, text);
}


let xyzConfig
fetch('/XYZ_Config.json')
  .then(response => response.json())
  .then(data => xyzConfig = data)
  .then(() => console.log(xyzConfig))
  .catch(console.error);

function SetXYZVariables() {
    for (var key in xyzConfig) {
        window[key] = xyzConfig[key];
    }
    XYZConsole('config file parsed')
}

// XYZ Time
class XYZTime extends HTMLElement {
  connectedCallback() {
    let date = new Date(this.getAttribute('datetime') || Date.now());
    this.innerHTML = new Intl.DateTimeFormat("default", {
      year: this.getAttribute('year') || undefined,
      month: this.getAttribute('month') || undefined,
      day: this.getAttribute('day') || undefined,
      hour: this.getAttribute('hour') || undefined,
      minute: this.getAttribute('minute') || undefined,
      second: this.getAttribute('second') || undefined,
      timeZoneName: this.getAttribute('time-zone-name') || undefined,
    }).format(date);
  }
}
// XYZ Variable
class XYZVariable extends HTMLElement {
  connectedCallback() {
    this.innerHTML = window[this.innerHTML] || "";
  }
}
// XYZ Navbar
class XYZNavbar extends HTMLElement {
  connectedCallback() {
    // Sets active page in navbar
    let current_location = location.pathname;
    if (current_location === "/") return;
    let nav_items = document.querySelector("xyz-nav").getElementsByTagName("a");
    for (let i = 0, len = nav_items.length; i < len; i++) {
      if (nav_items[i].getAttribute("href").indexOf(current_location) !== -1) {
        nav_items[i].className = "currentPage";
      }
    }
  }
}

function defineElements() {
  // Defining all custom elements
  customElements.define("xyz-time", XYZTime); // Time Element
  customElements.define("xyz-v", XYZVariable); // Variable Element
  customElements.define("xyz-nav", XYZNavbar); // Navbar Element
}

// <--- Initialisation Functions -->

// Set Page Title
function setTitle() {
  if (pageName !== undefined) {
    document.title = siteName + ' | ' + pageName;
    XYZConsole('Title set');
  } else {
    return;
  }
}

function setContent() {
  var newParent = document.querySelector('main');
  var oldParent = document.getElementById('XYZContent');

  while (oldParent.childNodes.length > 0) {
    newParent.appendChild(oldParent.childNodes[0]);
  }
  oldParent.remove();
}

// Build page
function XYZLoadLayout(url) {
  let xyzBody = document.querySelector('body')
  let xyzHead = document.querySelector('head')

  fetch('/assets/html/head.html')
    .catch((err) => {
      XYZConsole('Error fetching head')
    })
    .then(response => response.text())
    .then(text => {
      xyzHead.insertAdjacentHTML('beforeend', text)
    })

  if (layout === undefined) {
    currentLayout = "default"
    fetch(url + 'default.html')
      .catch((err) => {
        XYZConsole('Error fetching layout')
      })
      .then(response => response.text())
      .then(text => {
        xyzBody.insertAdjacentHTML('beforeend', text)
      })
    XYZConsole('Layout = default');
  } else {
    currentLayout = layout
    fetch(url + layout + '.html')
      .catch((err) => {
        XYZConsole('Error fetching layout')
      })
      .then(response => response.text())
      .then(text => {
        xyzBody.insertAdjacentHTML('beforeend', text)
      })
    XYZConsole('Layout = ' + layout);
  }

  XYZConsole('Page succesfully built');
}

// Text loader
function loadPage(url, output) {
  fetch(url)
    .then(response => response.text())
    .then(text => {
      document.querySelector(output).innerHTML = text
    })
    .catch((err) => {
      document.querySelector(output).innerHTML = "Can’t access " + url + " response. Blocked by browser?"
    });
}


var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let d = new Date();

// Sets active class on current page in navbar
function setNavigation() {
  let current_location = location.pathname;
  if (current_location === "/") return;
  let nav_items = document.querySelector("nav").getElementsByTagName("a");
  for (let i = 0, len = nav_items.length; i < len; i++) {
    if (nav_items[i].getAttribute("href").indexOf(current_location) !== -1) {
      nav_items[i].className = "currentPage";
    }
  }
}


// //SearchParams Test
// const params = new URLSearchParams(window.location.search);
//
// //Iterate the search parameters.
// for (const param of params) {
//   console.log(param);
//   document.getElementById("js-param").innerHTML = 'Welcome to my website, ' + param[1] + '!';
// }

// function XYZLoadIn() {
//   var xyzmain = document.querySelector('main');
//   xyzmain.style.display = "none";
//   setTimeout(() => {
//     xyzmain.style.display = "flex";
//   }, 500);
// }




// Actions to take once DOM has loaded
// These take place after the main content of the page has been loaded in
window.addEventListener('DOMContentLoaded', (event) => {
  setTitle();
  SetXYZVariables();
  XYZLoadLayout('/assets/html/layouts/');

  setTimeout(() => {
    setContent();
    defineElements(); //Function to define all custom elements
  }, 100);

  XYZConsole(`XYZ.JS has loaded for ${siteName}`);
});
