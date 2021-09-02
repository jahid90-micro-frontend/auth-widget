import React from 'react';
import ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';

import App from './App';

export class AuthApp extends HTMLElement {

    connectedCallback() {

        console.log('mf-auth connected');
        this.attachShadow({ mode: 'open' });
        this.render();

    }

    disconnectedCallback() {

        console.log('mf-auth disconnected');

    }

    render() {

        const template = document.querySelector('template#mf-auth-css');
        if (template) {
            const templateContent = document.importNode(template, true);
            this.shadowRoot?.appendChild(templateContent);
        }

        const $appRoot = document.createElement('div');
        $appRoot.id = 'auth-app-root';
        this.shadowRoot?.appendChild($appRoot);

        ReactDOM.render(<App />, $appRoot);

    }

}
