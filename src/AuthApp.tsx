import React from 'react';
import ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';

import App from './App';

export class AuthApp extends HTMLElement {

    connectedCallback() {

        console.log('mf-auth connected');
        this.render();

    }

    disconnectedCallback() {

        console.log('mf-auth disconnected');

    }

    render() {

        ReactDOM.render(<App />, this);

    }

}
