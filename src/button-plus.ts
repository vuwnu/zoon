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
