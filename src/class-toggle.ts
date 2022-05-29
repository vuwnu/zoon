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
