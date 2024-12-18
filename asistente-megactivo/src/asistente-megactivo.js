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

	createRenderRoot() {
	  return this; // Evita la creación del shadow DOM
	}

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
			answer: { type: Array },
			question: { type: String },
			loading: { type: Boolean }
		};
	}

	constructor() {
		super();
		this.answer = [];
		this.question = "";
		this.loading = false;
	}

	async _onClickOpenai() {
		if (this.question.trim()) {
			this._clearResponse();
			this._toggleLoadingState(true);
			await this.procesarAI(1, this.question);
			this._toggleLoadingState(false);
		}
	}

	async _onClickGemini() {
		if (this.question.trim()) {
			this._clearResponse();
			this._toggleLoadingState(true);
			await this.procesarAI(0, this.question);
			this._toggleLoadingState(false);
		}
	}

	async procesarAI(agente, prompt) {
		let myprompt = prompt;

		try {
			const response = await fetch("https://megactivo-ec6z.onrender.com", {
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
				const textResponse = JSON.stringify(data.bot);
				console.log('correcto: ', textResponse);
				this.answer.push(myprompt);
				this.answer.push(textResponse);
				this.requestUpdate();

				const parsedData = textResponse.trim();
				this._updateResponseOutput(parsedData);
				return parsedData;
			} else {
				const err = await response.text();
				console.log('error something went wrong', err);
				return false;
			}
		} catch (error) {
			console.log('Error en la solicitud:', error);
		}
	}

	_clearResponse() {
		const responseOutput = this.querySelector("#responseOutput");
		if (responseOutput) {
			responseOutput.value = "";
		}
	}

	_toggleLoadingState(isLoading) {
		this.loading = isLoading;
		const buttons = this.querySelectorAll("button");
		buttons.forEach(button => button.disabled = isLoading);
		const loadingGif = this.querySelector(".loading-gif");
		if (loadingGif) {
			loadingGif.style.display = isLoading ? "block" : "none";
		}
	}

	_updateResponseOutput(text) {
		const responseOutput = this.querySelector("#responseOutput");
		if (responseOutput) {
			responseOutput.value = text;
		}
	}

	render() {
		return html`
			<div class="container mt-5">
				<div class="row justify-content-center">
					<div class="col-md-6">
					<h1 class="text-center mb-4">Ingresa tu pregunta</h1>

					<form>
						<div class="mb-3">
						<label for="questionInput" class="form-label">Pregunta</label>
						<input
							class="form-control"
							id="userPrompt"
							rows="5"
							placeholder="Escribe tu pregunta aquí..."
							style="resize: none; overflow-y: auto;"
							@input="${e => this.question = e.target.value}">
						</div>

						<div class="d-flex justify-content-between">
						<button type="button" @click=${this._onClickGemini} class="btn btn-primary">Gemini</button>
						<img style="max-height: 20px; display: none;" src="https://i.gifer.com/ZKZg.gif" class="loading-gif" alt="Cargando...">
						<button type="button" @click=${this._onClickOpenai} class="btn btn-success">OpenAI</button>
						</div>
					</form>

					<div class="mt-4">
						<label for="responseOutput" class="form-label">Respuesta</label>
						<textarea
						class="form-control"
						id="responseOutput"
						rows="5"
						placeholder="Aquí se mostrará la respuesta..."
						style="resize: none; overflow-y: auto;"
						readonly>
						</textarea>
					</div>
					</div>
				</div>
			</div>
	  	`;
	}
}

customElements.define('asistente-megactivo', AsistenteMegactivo);