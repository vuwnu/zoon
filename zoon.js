let z = {

  set: {
    script(src) {
      let script = document.createElement('script');
      script.src = src;
      document.head.append(script);
    },
    css(src) {
      let link = document.createElement('link');
      link.href = src;
      link.rel = "stylesheet";
      document.head.append(link);
    },
    json(src) {
      fetch(src + '.json')
      .then(response => response.json())
      .then(data => zdata = data)
      .catch(console.error);
    },
    theme() {
      const element = $q('html');

      if (zdata.theme === undefined) {
        element.classList.add(`default`);
      } else if (zdata.theme === "none") {
        return;
      } else {
        element.classList.add(`${zdata.theme}`)
      }
    },
    design() {
      const element = $q('body');

      if (zdata.design != undefined) {
        element.classList.add(`use-layout`);
        element.classList.add(`${zdata.design}`);
      }
    },
    title() {
      if (zdata.pageName !== undefined) {
        document.title = `${zdata.pageName} - ${zdata.siteName}`;
        zoon.log('Title set');
      } else {
        return;
      }
    },
    head() {
      let zoonHead = $q('head')

      // Inserts HEAD file
      fetch('/assets/html/head.html')
      .catch((err) => {
        zoon.log('Error fetching head')
      })
      .then(response => response.text())
      .then(text => {
        zoonHead.insertAdjacentHTML('beforeend', text)
      })
    },
    layout(url) {
      let currentLayout
      let layout = zdata.layout;
      let zoonBody = $q('body')

      // Inserts Layout file
      if (layout === undefined) {
        currentLayout = "default"
        fetch(url + 'default.html')
        .catch((err) => {
          zoon.log('Error fetching layout')
        })
        .then(response => response.text())
        .then(text => {
          zoonBody.insertAdjacentHTML('beforeend', text)
        })
        zoon.log('Layout = default');
      } else {
        currentLayout = layout
        fetch(url + layout + '.html')
        .catch((err) => {
          zoon.log('Error fetching layout')
        })
        .then(response => response.text())
        .then(text => {
          zoonBody.insertAdjacentHTML('beforeend', text)
        })
        zoon.log('Layout = ' + layout);
      }
    },
  },

  pull_json(src) {
    let json_data
    fetch(src)
    .then(response => response.json())
    .then(data => json_data = data)
    .catch(console.error);
    zoon.log(json_data)
    return json_data;
  },

  pageBuild() {
    z.set.theme();
    z.set.design();
    z.set.title();
    if (zdata.layout !== "0") {
      z.set.layout('/assets/html/layouts/');
    }
    zoon.log('Page succesfully built');
  },

  update(id, path) {
    let entity = $q('#pageSelect').value;
    $q(id).setAttribute('src', path + entity);
  },

  loadPage(page) {
    $q('z-html').setAttribute('src', page);
  }
}

let zoon = {
  log(element, color, text) {
    const font_size = 'font-size:15px;'
    // Styles
    const logSTYLE = `color:#888;${font_size}`
    const tagSTYLE = `color:#ab4cef;${font_size}`
    const elemSTYLE = `color:${color};${font_size}`
    // Layout
    const zoonTag = `%c[zoon] %c[${element}] %c%s`
    //
    console.log(zoonTag, tagSTYLE, elemSTYLE, logSTYLE, text);
  }
}

let zdata

// Functions
const $q = document.querySelector.bind(document);
const $qa = (css, parent = document) => Array.from(parent.querySelectorAll(css));

// CUSTOM ELEMENTS
class ZoonData extends HTMLElement {
  connectedCallback() {
    let self = this;
    let str = this.innerHTML;

    str = str.replace(/(\n)+/g, '", "').replace(/( = )+/g, '":"').slice(0, -3).slice(2);
    str = `{${str}}`

    let finalString = JSON.parse(str);
    Object.assign(zdata, finalString)
    console.log(finalString);
    self.remove();
  }
}

class ZoonFrame extends HTMLElement {
  render() {
    let frame = this.getAttribute('frame') || 'default';
    let url =  this.getAttribute('src') || '/assets/html/layouts/';
    let body = $q('body');
    let currentFrame, frameDOM;

    currentFrame = frame
    fetch(url + frame + '.html')
    .catch((err) => { zoon.log('Error fetching layout') })
    .then(response => response.text())
    .then(text => {
      frameDOM = text
      body.insertAdjacentHTML('beforeend', frameDOM)
    })
    zoon.log('z-frame', '#de922f', `Frame = ${frame}`);
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  static get observedAttributes() {
    return ['src', 'frame'];
  }

  disconnectedCallback() {
    frameDOM.remove();
  }
}

class ZoonTitle extends HTMLElement {
  run() {
    let titleAttr = this.getAttribute('title')
    document.title = titleAttr;
    zoon.log(`title set as ${titleAttr}`);
  }
  connectedCallback() {
    this.run();
  }
}

class ZoonTime extends HTMLElement {

  render() {
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

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }

  static get observedAttributes() {
    return ['datetime', 'year', 'month', 'day', 'hour', 'minute', 'second', 'time-zone-name'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

}

class ZoonClock extends HTMLElement {

  render() {
    this.innerHTML = `
    <z-time hour="numeric" minute="numeric" second="numeric">
    </z-time>
    `;

    this.timerElem = this.firstElementChild;
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
    this.timer = setInterval(() => this.update(), 1000);
  }

  update() {
    this.date = new Date();
    this.timerElem.setAttribute('datetime', this.date);
    this.dispatchEvent(new CustomEvent('tick', { detail: this.date }));
  }

  disconnectedCallback() {
    clearInterval(this.timer); // important to let the element be garbage-collected
  }

}

class ZoonVariable extends HTMLElement {
  render() {
    let object = this.getAttribute('object');
    this.innerHTML = zdata[this.getAttribute('var')] || "";
  }
  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }
}

class ZoonNavbar extends HTMLElement {
  connectedCallback() {
    this.setCurrentPage();
  }
  setCurrentPage() {
    let current_location = location.pathname;
    if (current_location === "/") return;
    let nav_items = this.getElementsByTagName("a");
    for (let i = 0, len = nav_items.length; i < len; i++) {
      if (nav_items[i].getAttribute("href").indexOf(current_location) !== -1) {
        nav_items[i].className = "current-page";
      }
    }
  }
  setupLinks() {
    let nav_items = this.getElementsByTagName("a");
    for (let i = 0, len = nav_items.length; i < len; i++) {
      if (nav_items[i].getAttribute("href").indexOf(current_location) !== -1) {
        nav_items[i].className = "current-page";
      }
    }
  }
}

class ZoonLogo extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<a href="https://zoon.vuw.nu">zoon</a>';
  }
}

class ZoonHTML extends HTMLElement {
  connectedCallback() {
    this.setFromSource();
  }
  setFromSource() {
    fetch(this.getAttribute('src'))
      .then(response => response.text())
      .then(text => {
        this.innerHTML = text
      });
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.hasAttribute('src')) {
      this.setFromSource();
    } else if (this.hasAttribute('key')) {
      this.setFromURL();
    }
  }
  static get observedAttributes() {
    return ['src'];
  }
}

class ZoonHTMLQuery extends HTMLElement {
  connectedCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const source = this.getAttribute('src');
    const key = this.getAttribute('key');

    const pathValue = window.location.pathname;
    const queryValue = urlParams.get(key);

    if (queryValue === null) {
      return;
    } else {
    fetch(source + queryValue)
      .then(response => response.text())
      .then(text => {
        this.innerHTML = text
      });
    }
  }
}

class ZoonHTMLPath extends HTMLElement {
  render() {

  }

  connectedCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const source = this.getAttribute('src');
    const key = this.getAttribute('key');

    const pathValue = window.location.pathname;
    const queryValue = urlParams.get(key);

    if (queryValue === null) {
      return;
    } else {
    fetch(source + queryValue)
      .then(response => response.text())
      .then(text => {
        this.innerHTML = text
      });
    }
  }
}

class ZoonInsert extends HTMLElement {
  connectedCallback() {
    const output = $q('z-insert');
    const input = $q(this.getAttribute('input'));

    while (input.childNodes.length > 0) {
      output.appendChild(input.childNodes[0]);
    }
    input.remove();
  }
}

class ZoonTable extends HTMLElement {
  connectedCallback() {
    let source = this.getAttribute('src');

    fetch(source)
      .then(response => response.text())
      .then(text => {
        this.innerHTML = text
      });
  }
}

class ZoonTemplate extends HTMLElement {
  connectedCallback() {
    let tmpl = $q('#' + this.getAttribute('src'));

    this.attachShadow({ mode: 'open' }).append(tmpl.content.cloneNode(true));
  }
}

class ZoonCards extends HTMLElement {
  connectedCallback() {
    let tmpl = $q('#' + this.getAttribute('tmpl'));
    this.attachShadow({mode: 'open'}).append(tmpl.content.cloneNode(true));
    let jsonsrc = this.getAttribute('json')

    fetch(jsonsrc)
      .then(response => response.json())
      .then(data => window[this.getAttribute('name')] = data)
      .catch(console.error);
  }
}

class ZoonLightswitch extends HTMLElement {
  connectedCallback() {
    const on = this.getAttribute('on')
    const off = this.getAttribute('off')
    this.init();
    this.addEventListener('click', function() {
      this.toggle();
    }, false);
  }
  init() {
    const target = $q('#' + this.getAttribute('target'));
    if (window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches) {
      target.classList.add(`lightswitch-off`);
    } else {
      target.classList.add(`lightswitch-on`);
    }
  }
  toggle() {
    const target = $q('#' + this.getAttribute('target'));
    if (target.classList.contains(`lightswitch-off`)) {
      this.turnOn();
    } else {
      this.turnOff();
    }
  }
  turnOn() {
    target.classList.replace(`lightswitch-off`, `lightswitch-on`);
  }
  turnOff() {
    target.classList.replace(`lightswitch-on`, `lightswitch-off`);
  }
}

class ZoonObject extends HTMLElement {
  connectedCallback() {
    this.setupObject();
  }
  setupObject() {
    let src = this.getAttribute('src');

    fetch(src)
      .then(response => response.json())
      .then(data => window[this.getAttribute('name')] = data)
      .catch(console.error);
  }
}

class ZoonButton extends HTMLElement {
  render() {

  }
  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }
}

// Defining all custom elements
function defineElements() {
  // Site handler elements
  customElements.define("z-title", ZoonTitle);
  customElements.define("z-data", ZoonData);
  customElements.define("z-object", ZoonObject);
  customElements.define("z-time", ZoonTime);
  customElements.define("z-clock", ZoonClock);
  customElements.define("z-nav", ZoonNavbar);
  customElements.define("zoon-logo", ZoonLogo);
  customElements.define("z-insert", ZoonInsert);
  customElements.define("z-frame", ZoonFrame);

  customElements.define("z-html", ZoonHTML);
  customElements.define("z-html-query", ZoonHTMLQuery);
  customElements.define("z-html-path", ZoonHTMLPath);

  customElements.define("z-template", ZoonTemplate);
  customElements.define("z-cards", ZoonCards);
  customElements.define("z-lightswitch", ZoonLightswitch);

  setTimeout(() => {
    customElements.define("z-var", ZoonVariable);
  }, 100);

}

// Single Page Apps for GitHub Pages
// https://github.com/rafrex/spa-github-pages
// Copyright (c) 2016 Rafael Pedicini, licensed under the MIT License
// ----------------------------------------------------------------------
// This script checks to see if a redirect is present in the query string
// and converts it back into the correct url and adds it to the
// browser's history using window.history.replaceState(...),
// which won't cause the browser to attempt to load the new url.
// When the single page app is loaded further down in this file,
// the correct url will be waiting in the browser's history for
// the single page app to route accordingly.
(function(l) {
  if (l.search) {
    var q = {};
    l.search.slice(1).split('&').forEach(function(v) {
      var a = v.split('=');
      q[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&');
    });
    if (q.p !== undefined) {
      window.history.replaceState(null, null,
        l.pathname.slice(0, -1) + (q.p || '') +
        (q.q ? ('?' + q.q) : '') +
        l.hash
      );
    }
  }
}(window.location));

(function () {
  z.set.css('https://cdn.jsdelivr.net/gh/vuwnu/zoon@master/zoon.css');
  fetch('/zdata.json')
  .then(response => response.json())
  .then(data => zdata = data)
  .catch(console.error);
})();

function setup() {
  defineElements();
  z.pageBuild();
  zoon.log(`zoon has loaded for ${zdata.siteName}`);
}

//// INITIALISATION
window.addEventListener('load', (event) => {
  setTimeout(() => {
    setup();
  }, 100);
});
