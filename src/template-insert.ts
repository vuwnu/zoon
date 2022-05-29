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
