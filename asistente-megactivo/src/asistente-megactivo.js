import { LitElement, html, css } from 'lit';


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_IMb7LynsdZLi1dpLIAU3Dfpo7NvXppc",
  authDomain: "asistentemegactivo-ia.firebaseapp.com",
  projectId: "asistentemegactivo-ia",
  storageBucket: "asistentemegactivo-ia.firebasestorage.app",
  messagingSenderId: "739393176887",
  appId: "1:739393176887:web:088874bb23b49f048846b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const logo = new URL('../assets/open-wc-logo.svg', import.meta.url).href;

class AsistenteMegactivo extends LitElement {



  static styles = css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--asistente-megactivo-background-color);
    }

    main {
      flex-grow: 1;
    }

    .logo {
      margin-top: 36px;
      animation: app-logo-spin infinite 20s linear;
    }

    @keyframes app-logo-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

static get properties() {
    return {
      respuesta: { type: Array },
    }
  }

  constructor() {
    super();
    this.respuesta = [];
  }

  render() {
    return html`
      <main>
        <button @click=${this._onClickGemini} part="button">
          gemini
        </button>
        <button @click=${this._onClickOpenai} part="button">
          openai
        </button>
        <div>
            ${this.respuesta.map((item) => html`<p>${item}</p>`)}
        </div>
      </main>
    `;
  }

  async _onClickOpenai() {
    let myanswer = this.procesarAI(1);
  }

  async _onClickGemini() {
    let myanswer = this.procesarAI(0);
  }

  async procesarAI(agente){
    // agente 0 es gemini y 1 es openai
    const mylyrics=['I will survive', 'I was in the circus', 'Mary danced well'];
    const myprompt = `
      I will provide you with an array of sentences or epressions in English.
      Please return an equivalent array but keep only the elements that are in future tense.
      ${JSON.stringify(mylyrics)}
    `;

    let response;
    response = await fetch("http://localhost:5000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: agente,
          prompt: myprompt
        }),
      });
    if (response.ok) {
      const data = await response.json();
      console.log('correcto: ',data.bot);
      this.respuesta.push(myprompt);
      this.respuesta.push(data.bot);
      this.requestUpdate(); // fuerza la actualización en pantalla
      const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'
      return parsedData;
    } else {
      const err = await response.text();
      //messageDiv.innerHTML = "Something went wrong"
      console.log('error something went wrong',err);
      //return err;
      return false;
    }
  }

}

customElements.define('asistente-megactivo', AsistenteMegactivo);