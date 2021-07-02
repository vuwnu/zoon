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
