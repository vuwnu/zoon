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
