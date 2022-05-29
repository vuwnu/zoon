class ZoonURLInput extends HTMLElement {
  connectedCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const source = this.getAttribute('src');
    const key = this.getAttribute('key');
    const queryValue = urlParams.get(key);

    let fetchme;

    if (queryValue === null ) {
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

class ZoonInsert extends HTMLElement {
  connectedCallback() {
    const output = $q('z-insert');
    const input = $q(this.getAttribute('input'));

    while (input.childNodes.length > 0) {
      output.appendChild(input.childNodes[0]);
    }
    input.remove();
  }
}

class ZoonCards extends HTMLElement {
  connectedCallback() {
    let tmpl = $q('#' + this.getAttribute('tmpl'));
    this.attachShadow({mode: 'open'}).append(tmpl.content.cloneNode(true));
    let jsonsrc = this.getAttribute('json')

    fetch(jsonsrc)
      .then(response => response.json())
      .then(data => window[this.getAttribute('name')] = data)
      .catch(console.error);
  }
}
