let zoon = {

  cnsl: {

    log(text) {
      const font_size = 'font-size:15px;'
      // Log types
      const log = 'color:#888;' + font_size
      // Styling the zoon tag
      const tag_color = 'color:#ab4cef;font-size:15px;'
      // zoon tag at the start of a message
      const zoonTag = '%c[zoon]%c %s'
      // Sending the message to the log
      console.log(zoonTag, tag_color, log, text);
    },

    help() {
      zoon.cnsl.log(`this is a help command :)`)
    },

    zdata() {
      for (const [key, value] of Object.entries(zdata)) {
        zoon.cnsl.log(`${key}: ${value}`);
      }
    }

  },

  init: {

    loadzdata() {
      fetch('/zdata.json')
        .then(response => response.json())
        .then(data => zdata = data)
        .catch(console.error);
    },

    zoonLoadLayout(url) {
      let layout = zdata.layout;
      let zoonBody = $q('body')
      let zoonHead = $q('head')

      // Inserts HEAD file
      fetch('/assets/html/head.html')
        .catch((err) => {
          zoon.cnsl.log('Error fetching head')
        })
        .then(response => response.text())
        .then(text => {
          zoonHead.insertAdjacentHTML('beforeend', text)
        })

      // Inserts Layout file
      if (layout === undefined) {
        currentLayout = "default"
        fetch(url + 'default.html')
          .catch((err) => {
            zoon.cnsl.log('Error fetching layout')
          })
          .then(response => response.text())
          .then(text => {
            zoonBody.insertAdjacentHTML('beforeend', text)
          })
        zoon.cnsl.log('Layout = default');
      } else {
        currentLayout = layout
        fetch(url + layout + '.html')
          .catch((err) => {
            zoon.cnsl.log('Error fetching layout')
          })
          .then(response => response.text())
          .then(text => {
            zoonBody.insertAdjacentHTML('beforeend', text)
          })
        zoon.cnsl.log('Layout = ' + layout);
      }


      zoon.cnsl.log('Page succesfully built');
    },

    setThemeAndLayout() {
      const element = $q('html');

      if (zdata.theme === undefined) {
        element.classList.add(`default`);
      } else {
        element.classList.add(`${zdata.theme}`)
      }

      if (zdata.layout === undefined) {
        element.classList.add(`default`);
      } else {
        element.classList.add(`${zdata.layout}`)
      }
    },

    mergeData() {
      Object.assign(zdata, p);
      delete p;
    },

    setTitle() {
      if (zdata.pageName !== undefined) {
        document.title = zdata.siteName + ' | ' + zdata.pageName;
        zoon.cnsl.log('Title set');
      } else {
        return;
      }
    }

  }

}
let z = {

  pull_json(src) {
    let json_data
    fetch(src)
      .then(response => response.json())
      .then(data => json_data = data)
      .catch(console.error);
    zoon.cnsl.log(json_data)
    return json_data;
  },

  update(id) {
    let entity = $q('#pageSelect').value;
    $q(id).setAttribute('src', '/assets/html/includes/' + entity);
    $q(id).connectedCallback();
  }
}

// Functions
const $q = document.querySelector.bind(document);
const $qa = (css, parent = document) =>
  Array.from(parent.querySelectorAll(css));
// const $a = getAttribute(document);

zoon.init.loadzdata();

//// CUSTOM ELEMENTS
class zoonTime extends HTMLElement {
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
class zoonVariable extends HTMLElement {
  connectedCallback() {
    let variable = this.getAttribute('var')
    this.innerHTML = zdata[variable] || "";
  }
}
class zoonNavbar extends HTMLElement {
  connectedCallback() {
    // Sets active page in navbar
    let current_location = location.pathname;
    if (current_location === "/") return;
    let nav_items = this.getElementsByTagName("a");
    for (let i = 0, len = nav_items.length; i < len; i++) {
      if (nav_items[i].getAttribute("href").indexOf(current_location) !== -1) {
        nav_items[i].className = "currentPage";
      }
    }
  }
}
class zoonLogo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<a href="https://zoon.vuw.nu">[zoon]</a>`;
  }
}

class zoonInclude extends HTMLElement {
  connectedCallback() {
    const source = this.getAttribute('src')

    fetch(source)
      .then(response => response.text())
      .then(text => {
        this.innerHTML = text
      });
  }
  static get observedAttributes() {
  return ['src'];
  }
}

class zoonQuery extends HTMLElement {
  connectedCallback() {
    const source = this.getAttribute('src')
    const key = this.getAttribute('key')
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(key)
    if (value === null) {
      return;
    } else {
    fetch(source + value)
      .then(response => response.text())
      .then(text => {
        this.innerHTML = text
      });
    }
  }
}

class zoonInsert extends HTMLElement {
  connectedCallback() {
    const output = $q('zoon-insert');
    const inputID = this.getAttribute('input');
    const input = $q(inputID);

    while (input.childNodes.length > 0) {
      output.appendChild(input.childNodes[0]);
    }
    input.remove();
  }
}

class zoonTable extends HTMLElement {
  connectedCallback() {
    let source = this.getAttribute('src');

    fetch(source)
      .then(response => response.text())
      .then(text => {
        this.innerHTML = text
      });
  }
}
class zoonData extends HTMLElement {
  connectedCallback() {
    let self = this;
    self.remove();
  }
}
class zoonCard extends HTMLElement {
  connectedCallback() {
    let source = this.getAttribute('src');
    let tmpl = $q('#' + source);

    this.attachShadow({mode: 'open'}).append(tmpl.content.cloneNode(true));
  }
}

// Defining all custom elements
function defineElements() {
  customElements.define("zoon-time", zoonTime);
  customElements.define("zoon-nav", zoonNavbar);
  customElements.define("zoon-logo", zoonLogo);
  customElements.define("zoon-query", zoonQuery);
  customElements.define("zoon-insert", zoonInsert);
  customElements.define("html-include", zoonInclude);
  customElements.define("z-data", zoonData);
  customElements.define("var-inc", zoonVariable);
  customElements.define("z-template", zoonCard);
}

// Text loader
function setHTML(url, output) {
  fetch("/assets/html/includes/" + url)
    .then(response => response.text())
    .then(text => {
      $q(output).innerHTML = text
    })
    .catch((err) => {
      $q(output).innerHTML = "Can’t access " + url + " response. Blocked by browser?"
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
    zoon.init.mergeData(); //Combines page data into zdata object
    defineElements(); //Function to define all custom elements
    zoon.init.setSiteTheme();
    zoon.init.setTitle();
    if (zdata.layout !== 0) {
      zoon.init.zoonLoadLayout('/assets/html/layouts/');
    } else {
      return;
    }
    zoon.cnsl.log(`zoon has loaded for ${zdata.siteName}`);
  }, 100);

});
