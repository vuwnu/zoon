class ZoonClock extends HTMLElement {
	rendered: boolean;

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
