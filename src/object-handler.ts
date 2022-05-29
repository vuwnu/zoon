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

    console.log(`Created an object with the name ${objectName}`);
  }
}
