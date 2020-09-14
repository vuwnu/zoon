let z = {

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
  constructor() {
    super();
    this.setup();
  }

  setup() {
    if (!this.hasAttribute('frame'))
      this.setAttribute('frame', 'default');
    if (!this.hasAttribute('src'))
      this.setAttribute('src', '/frames/');
  }

  render() {
    let frameDOM, currentFrame, frame, url, body;

    body = $q('body');
    this.frame = this.getAttribute('frame');
    currentFrame = frame

    fetch(this.getAttribute('src') + this.getAttribute('frame') + '.html')
    .catch((err) => { zoon.log('Error fetching layout') })
    .then(response => response.text())
    .then(text => {
      this.text = text;
      body.insertAdjacentHTML('beforeend', this.text);
    })

    zoon.log('z-frame', '#de922f', `Frame set to ${this.frame}`);
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }

  static get observedAttributes() {
    return ['src', 'frame'];
  }

  // attributeChangedCallback(name, oldValue, newValue) {
  //   if (newValue == oldValue) {
  //     return;
  //   } else {
  //     this.render();
  //   }
  // }
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

class ZoonTitle extends HTMLElement {
  run() {
    let main = this.getAttribute('title') || ""
    let prepend = this.getAttribute('prepend') || ""
    let append = this.getAttribute('append') || ""

    let titleFull = `${prepend}${main}${append}`

    document.title = titleFull;

    zoon.log('z-title', '#2f84de', `title set as ${titleFull}`);
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

class ZoonHTMLQuery extends HTMLElement {
  connectedCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const source = this.getAttribute('src');
    const key = this.getAttribute('key');
    const queryValue = urlParams.get(key);

    if (queryValue === null ) {
      return;
    } else {
      fetchme = source + queryValue + '.html'
      fetch(fetchme)
      .then(response => response.text())
      .then(text => {
        this.innerHTML = text
      });
    }

    zoon.log('z-page', '#2fde45', `query is ${queryValue}`);
  }
}

class ZoonHTMLPath extends HTMLElement {
  render() {
    const urlParams = new URLSearchParams(window.location.search);
    const pathValue = window.location.pathname;
    const source = this.getAttribute('src');
    let fetchme

    if (pathValue === '/') {
      fetchme = source + '/home.html'
    } else {
      fetchme = source + pathValue + '.html'
    }

    fetch(fetchme)
    .then(response => response.text())
    .then(text => {
      this.innerHTML = text
    });

    zoon.log('z-page', '#2fde45', `page is ${pathValue}`);
  }
  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
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
    let json = this.getAttribute('src');

    let cols = Object.keys(json[0]);

    //Map over columns, make headers,join into string
    let headerRow = cols
      .map(col => `<th>${col}</th>`)
      .join("");

    //map over array of json objs, for each row(obj) map over column values,
    //and return a td with the value of that object for its column
    //take that array of tds and join them
    //then return a row of the tds
    //finally join all the rows together
    let rows = json
      .map(row => {
        let tds = cols.map(col => `<td>${row[col]}</td>`).join("");
        return `<tr>${tds}</tr>`;
      })
      .join("");

    //build the table
    const table = `
  	<table>
  		<thead>
  			<tr>${headerRow}</tr>
  		<thead>
  		<tbody>
  			${rows}
  		<tbody>
  	<table>`;

    return table;
    this.innerHTML = table;
    zoon.log('z-table', '#de2f7d', `Built table`);
  }
}

class ZoonTemplate extends HTMLElement {
  render() {
    let tmpl = $q('#' + this.getAttribute('src'));

    this.attachShadow({ mode: 'open' }).append(tmpl.content.cloneNode(true));
  }
  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }

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
    const objectName = this.getAttribute('name');
    const src = this.getAttribute('src');

    fetch(src)
      .then(response => response.json())
      .then(data => window[this.getAttribute('name')] = data)
      .catch(console.error);

    zoon.log('z-object', '#de2f7d', `Created an object called ${objectName}`);
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
  customElements.define("z-frame", ZoonFrame);

  customElements.define("z-data", ZoonData);
  customElements.define("z-object", ZoonObject);
  customElements.define("z-time", ZoonTime);
  customElements.define("z-clock", ZoonClock);
  customElements.define("z-nav", ZoonNavbar);
  customElements.define("zoon-logo", ZoonLogo);
  customElements.define("z-insert", ZoonInsert);

  customElements.define("z-html", ZoonHTML);
  customElements.define("z-html-query", ZoonHTMLQuery);
  customElements.define("z-html-path", ZoonHTMLPath);

  customElements.define("z-template", ZoonTemplate);
  customElements.define("z-cards", ZoonCards);
  customElements.define("z-table", ZoonTable);
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
  const link = document.createElement('link');
  link.href = 'https://cdn.jsdelivr.net/gh/vuwnu/zoon@master/dist/zoon.min.css';
  link.rel = "stylesheet";
  document.head.append(link);
  fetch('/zdata.json')
  .then(response => response.json())
  .then(data => zdata = data)
  .catch(console.error);
})();

//// INITIALISATION
window.addEventListener('load', (event) => {
  setTimeout(() => {
    defineElements();
  }, 100);
});
