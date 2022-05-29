customElements.define("s-counter", class extends HTMLElement {

  count: number;

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

  inc() {
    this.update(++this.count);
  }

  dec() {
    this.update(--this.count);
  }

  update(count: any) {
    this.shadowRoot.querySelector("span").innerHTML = count;
  }

}
);
