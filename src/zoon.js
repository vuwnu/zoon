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


// Site Handlers ELEMs
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
  attributeChangedCallback(name, oldValue, newValue) {
    this.run();
  }
  static get observedAttributes() {
    return ['title', 'prepend', 'append'];
  }
}

// Input ELEMs

class Z_URL_Input extends HTMLElement {
  connectedCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const source = this.getAttribute('src');
    const key = this.getAttribute('key');
    const queryValue = urlParams.get(key);

    let fetchme;

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
        nav_items[i].classList.add("current-page");
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
    let tag = this.getAttribute('tag');
    this.innerHTML = `<a href="https://zoon.vuw.nu">Zoon</a>`;
  }
}

class ZoonHTMLQuery extends HTMLElement {
  connectedCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const source = this.getAttribute('src');
    const key = this.getAttribute('key');
    const queryValue = urlParams.get(key);
    let fetchme;

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
  render() {
    let json = window[this.getAttribute('src')]

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

    this.innerHTML = table;
    zoon.log('z-table', '#2fc4de', `Built table`);
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
    return ['src'];
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

class ZoonClassToggle extends HTMLElement {
  connectedCallback() {
    this.firstClass = this.getAttribute('1')
    this.secondClass = this.getAttribute('2')
    this.input = this.getAttribute('input')
    this.target = $q('#' + this.getAttribute('target'));

    this.setup();

    this.addEventListener('click', function() {
      this.run();
    }, false);
  }
  setup() {
    if (window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.target.classList.add(`lightswitch-off`);
    } else {
      this.target.classList.add(`lightswitch-on`);
    }
  }
  run() {
    if (this.target.classList.contains(`lightswitch-off`)) {
      this.target.classList.remove(`lightswitch-off`);
      this.target.classList.add(`lightswitch-on`);
    } else {
      this.target.classList.remove(`lightswitch-on`);
      this.target.classList.add(`lightswitch-off`);
    }
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

    zoon.log('z-object', '#de2f7d', `Created an object with the name ${objectName}`);
  }
}

class ZoonButton extends HTMLElement {
  setup() {
    this.actiom = this.getAttribute('action')
    this.target = this.getAttribute('target')

    this.addEventListener('click', function() {
      this.run();
    }, false);
  }
  run() {
    console.log('button pressed');
    let target = $q(this.target);
    // target.window[this.getAttribute('action')]
  }
  connectedCallback() {
    if (!this.rendered) {
      this.setup();
      this.rendered = true;
    }
  }
  update() {
    this.actiom = this.getAttribute('action')
    this.target = this.getAttribute('target')
  }
  attributeChangedCallback(name, oldValue, newValue) {
    this.update();
  }
  static get observedAttributes() {
    return ['action', 'target'];
  }
}

class ZoonSpeech extends HTMLElement {
  run() {
    // Create a SpeechSynthesisUtterance using the string from the input attribute
    let msg = new SpeechSynthesisUtterance(this.text)
    // Get list of voices available
    let voices = window.speechSynthesis.getVoices()
    // Select voice
    msg.voice = voices[0];
    msg.pitch = this.pitch;
    msg.rate = this.rate;
    // Run speech audio
    window.speechSynthesis.speak(msg)
  }
  update() {
    this.text = this.getAttribute('input')
    this.voice = this.getAttribute('voice')
    this.pitch = this.getAttribute('pitch')
    this.rate = this.getAttribute('rate')
  }
  connectedCallback() {
    this.update();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    this.update();
  }
  static get observedAttributes() {
    return ['input', 'voice', 'pitch', 'rate'];
  }
}

// Defining all custom elements
function defineElements() {
  // Site handler elements
  customElements.define("zoon-logo", ZoonLogo);
  customElements.define("z-title", ZoonTitle);
  customElements.define("z-frame", ZoonFrame);
  customElements.define("z-speech", ZoonSpeech);

  customElements.define("z-data", ZoonData);
  customElements.define("z-object", ZoonObject);
  customElements.define("z-time", ZoonTime);
  customElements.define("z-clock", ZoonClock);
  customElements.define("z-nav", ZoonNavbar);
  customElements.define("z-insert", ZoonInsert);

  customElements.define("z-html", ZoonHTML);
  customElements.define("z-html-query", ZoonHTMLQuery);
  customElements.define("z-html-path", ZoonHTMLPath);

  customElements.define("z-template", ZoonTemplate);
  customElements.define("z-cards", ZoonCards);
  customElements.define("z-table", ZoonTable);
  customElements.define("z-class-toggle", ZoonClassToggle);

  setTimeout(() => {
    customElements.define("z-var", ZoonVariable);
  }, 100);

}

// Setup stuff
(function () {
  // Setup link to CSS styling for elements
  const link = document.createElement('link');
  link.href = 'https://cdn.jsdelivr.net/gh/vuwnu/zoon@master/dist/zoon.min.css';
  link.rel = "stylesheet";
  document.head.append(link);
})();

//// INITIALISATION
window.addEventListener('load', (event) => {
  setTimeout(() => {
    defineElements();
  }, 100);
});
