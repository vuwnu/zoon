customElements.define("text-to-speech", class extends HTMLElement {

  voice: string;
  text: string;
  pitch: string;
  rate: string;

  run() {
    // Create a SpeechSynthesisUtterance using the string from the input attribute
    let msg = new SpeechSynthesisUtterance(this.text)
    // Get list of voices available
    let voices = window.speechSynthesis.getVoices()
    // Select voice
    msg.voice = voices[0];
    msg.pitch = parseInt(this.pitch, 10);
    msg.rate = parseInt(this.rate, 10);
    // Run speech audio
    window.speechSynthesis.speak(msg)
  }

  update() {
    this.text = this.getAttribute('input')
    this.voice = this.getAttribute('voice')
    this.pitch = this.getAttribute('pitch')
    this.rate = this.getAttribute('rate')
  }

  connectedCallback() {
    this.update();
  }

  attributeChangedCallback(name: any, oldValue: any, newValue: any) {
    this.update();
  }

  static get observedAttributes() {
    return ['input', 'voice', 'pitch', 'rate'];
  }

}

);
