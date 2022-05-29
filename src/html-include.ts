customElements.define("html-include", class extends HTMLElement {
  constructor() {
    super()
      .attachShadow({ mode: "open" })
      .innerHTML =
      "<style>" +
      "*{font-size:200%}" +
      "span{width:4rem;display:inline-block;text-align:center}" +
      "button{width:4rem;height:4rem;border:none;border-radius:10px;background-color:seagreen;color:white}" +
      "</style>" +
      "<button onclick=this.getRootNode().host.dec()>-</button>" +
      "<span>0</span>" +
      "<button onclick=this.getRootNode().host.inc()>+</button>";
    this.count = 0;
  }

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
);

customElements.define("html-include-query", class extends HTMLElement {

  connectedCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const source = this.getAttribute('src');
    const key = this.getAttribute('key');
    const queryValue = urlParams.get(key);
    let fetchme;

    if (queryValue === null) {
      return;
    } else {
      fetchme = source + queryValue + '.html'
      fetch(fetchme)
        .then(response => response.text())
        .then(text => {
          this.innerHTML = text
        });
    }

    console.log(`query is ${queryValue}`);
  }

}
);



customElements.define("html-include-path", class extends HTMLElement {

  rendered: boolean;

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

    console.log(`page is ${pathValue}`);
  }

  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }

}
);
