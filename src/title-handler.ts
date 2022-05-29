class ZoonTitle extends HTMLElement {
  run() {
    let main = this.getAttribute('title') || ""
    let prepend = this.getAttribute('prepend') || ""
    let append = this.getAttribute('append') || ""

    let titleFull = `${prepend}${main}${append}`

    document.title = titleFull;

    console.log(`title set as ${titleFull}`);
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
