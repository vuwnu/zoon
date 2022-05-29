class ZoonLogo extends HTMLElement {
  connectedCallback() {
    let tag = this.getAttribute('tag');
    this.innerHTML = `<a href="https://zoon.vuw.nu">Zoon</a>`;
  }
}
  
