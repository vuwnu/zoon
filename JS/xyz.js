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

let XYZ = {

  cnsl: {

    log(text) {
      // Log types
      let log = 'color:#888;font-size:15px;'
      let warn = 'color:#e00000;font-size:20px;background-color:red;'
      // Styling the XYZ tag
      let xCSS = 'color:rgb(203, 63, 80);font-size:15px;'
      let yCSS = 'color:rgb(119, 215, 103);font-size:15px;'
      let zCSS = 'color:rgb(37, 105, 195);font-size:15px;'
      // XYZ tag at the start of a message
      let xyzTag = '%c[%cX%cY%cZ%c] %s'
      // Sending the message to the log
      let type = log;
      console.log(xyzTag, type, xCSS, yCSS, zCSS, type, text);
    },

    help() {
      XYZ.cnsl.log(`this is a help command :)`)
    }

  },

  init: {

    loadXYZdata() {
      fetch('/XYZdata.json')
        .then(response => response.json())
        .then(data => XYZdata = data)
        .catch(console.error);
    },

    setContent() {
      var newParent = document.querySelector('main');
      var oldParent = document.querySelector('#XYZContent');

      while (oldParent.childNodes.length > 0) {
        newParent.appendChild(oldParent.childNodes[0]);
      }
      oldParent.remove();
    },

    XYZLoadLayout(url) {
      let layout = XYZdata.layout;
      let xyzBody = document.querySelector('body')
      let xyzHead = document.querySelector('head')

      // Inserts HEAD file
      fetch('/assets/html/head.html')
        .catch((err) => {
          XYZ.cnsl.log('Error fetching head')
        })
        .then(response => response.text())
        .then(text => {
          xyzHead.insertAdjacentHTML('beforeend', text)
        })

      // Inserts Layout file
      if (layout === undefined) {
        currentLayout = "default"
        fetch(url + 'default.html')
          .catch((err) => {
            XYZ.cnsl.log('Error fetching layout')
          })
          .then(response => response.text())
          .then(text => {
            xyzBody.insertAdjacentHTML('beforeend', text)
          })
        XYZ.cnsl.log('Layout = default');
      } else {
        currentLayout = layout
        fetch(url + layout + '.html')
          .catch((err) => {
            XYZ.cnsl.log('Error fetching layout')
          })
          .then(response => response.text())
          .then(text => {
            xyzBody.insertAdjacentHTML('beforeend', text)
          })
        XYZ.cnsl.log('Layout = ' + layout);
      }
      XYZ.cnsl.log('Page succesfully built');
    },

    setSiteTheme() {
      var element = document.querySelector('html');
      if (XYZdata.theme === undefined) {
        element.classList.add(`default-theme`);
      } else {
        element.classList.add(`${XYZdata.theme}`)
      }
    },

    mergeData() {
      Object.assign(XYZdata, p);
      delete p;
    },

    setTitle() {
      if (XYZdata.pageName !== undefined) {
        document.title = XYZdata.siteName + ' | ' + XYZdata.pageName;
        XYZ.cnsl.log('Title set');
      } else {
        return;
      }
    }

  }

}
XYZ.init.loadXYZdata();

//// CUSTOM ELEMENTS
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
class XYZVariable extends HTMLElement {
  connectedCallback() {
    let variable = this.getAttribute('var')
    this.innerHTML = XYZdata[variable] || "";
  }
}
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
class XYZLogo extends HTMLElement {
  connectedCallback() {
    let xyzlogo = `<a href="https://xyz.vayn.work"><span>X</span><span>Y</span><span>Z</span></a>`
    this.innerHTML = xyzlogo;
  }
}
// Defining all custom elements
function defineElements() {
  customElements.define("xyz-time", XYZTime); // Time Element
  customElements.define("xyz-v", XYZVariable); // Variable Element
  customElements.define("xyz-nav", XYZNavbar); // Navbar Element
  customElements.define("xyz-logo", XYZLogo); // Logo Element
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

// //SearchParams Test
// const params = new URLSearchParams(window.location.search);
//
// //Iterate the search parameters.
// for (const param of params) {
//   console.log(param);
// }

//// INITIALISATION
window.addEventListener('DOMContentLoaded', (event) => {

  setTimeout(() => {
    defineElements(); //Function to define all custom elements
    XYZ.init.mergeData(); //Combines page data into XYZdata object
    XYZ.init.setSiteTheme();
    XYZ.init.setTitle();
  }, 100);

  setTimeout(() => {
    XYZ.init.XYZLoadLayout('/assets/html/layouts/');
  }, 150);

  setTimeout(() => {
    XYZ.init.setContent();
    XYZ.cnsl.log(`XYZ.JS has loaded for ${XYZdata.siteName}`);
  }, 400);

});
