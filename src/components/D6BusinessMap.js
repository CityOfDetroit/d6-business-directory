'use strict';
import Display from './Display';
import DataLoader from './DataLoader';
import testData from './test-data.json';
// import Map from './Map';
customElements.define('app-display', Display);
customElements.define('app-data-loader', DataLoader);
// customElements.define('app-map', Map);

export default class D6BusinessMap extends HTMLElement {
    static get observedAttributes() {
        return ['data-app-state', 'data-parcel-id', 'data-map-state'];
    }

    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        const shadow = this.attachShadow({ mode: 'open' });

        // Create result section
        const app = document.getElementsByTagName('d6-business-map');
        let tempState = app[0].getAttribute('data-app-state');

        this.testData = testData;

        this.appWrapper = document.createElement('section');
        this.appWrapper.id = 'app-wrapper';

        shadow.appendChild(this.appWrapper);

        // create panel component
        this.panel = document.createElement('cod-offcanvas');
        this.panel.id = 'd6-map-panel';
        this.panelHeader = document.createElement('cod-offcanvas-header');
        this.panelTitle = document.createElement('h5');
        this.panelTitle.innerText = 'Test Title';
        this.panelHeader.appendChild(this.panelTitle);

        this.panelBody = document.createElement('cod-offcanvas-body');
        this.panelContent = document.createElement('article');
        this.panelContent.innerHTML = `
        <p>
        Some text as placeholder. In real life you can have the elements you
        have chosen. Like, text, images, lists, etc.
      </p>
        `;
        this.panelBody.appendChild(this.panelContent);

        this.panel.appendChild(this.panelHeader);
        this.panel.appendChild(this.panelBody);
        this.appWrapper.appendChild(this.panel);

        // Create map component
        this.map = document.createElement('cod-map');
        this.map.id = 'd6-map';
        this.map.setAttribute('data-parent-component', 'd6-business-map');
        this.map.setAttribute('data-map-mode', 'map-panel');
        this.map.setAttribute('data-map-active-data', this.getAttribute('data-map-active-data'));
        this.map.setAttribute('data-map-data', JSON.stringify(this.testData));
        this. map.setAttribute('data-location', this.getAttribute('data-location'));
        this.map.setAttribute('data-map-state', 'init');
        this.appWrapper.appendChild(this.map);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`App - attribute: ${name}, old: ${oldValue}, new: ${newValue}`);
        this.loadApp(this);
    }

    clearApp(app) {
        console.log(app);
        const shadow = app.shadowRoot;
        while (shadow.firstChild) {
            shadow.removeChild(shadow.firstChild);
        }
    }

    clearPanel(app) {

    }

    loadApp(app) {
        console.log(app.getAttribute('data-app-state'));
        const shadow = app.shadowRoot;
        const appWrapper = document.createElement('div');
        appWrapper.id = 'app-wrapper';
        const dataLoader = document.createElement('app-data-loader');
        switch (app.getAttribute('data-app-state')) {
            case 'active-panel':
                let tempData = JSON.parse(this.getAttribute('data-panel-data'));
                this.panelTitle.innerText = tempData.properties.business_name;
                this.panelContent.innerHTML = `
                    <p><strong>Address:</strong> ${tempData.properties.street_number} ${tempData.properties.street_name}
                    <p><cod-icon data-icon="newspaper" data-size="small"></cod-icon> Information</p>
                    <p><cod-icon data-icon="house" data-size="small"></cod-icon> Home services<p>
                    <p><cod-icon data-icon="calendar" data-size="small"></cod-icon> Services</p>
                `;
                this.panel.setAttribute('data-show', 'true');
                break;

            case 'error':
                display.setAttribute('data-display-type', 'error');
                appWrapper.appendChild(display);
                break;

            case 'print':
                display.setAttribute('data-display-type', 'print');
                appWrapper.appendChild(display);
                break;

            default:
                break;
        }
        if (shadow.firstChild == null) {
            shadow.appendChild(appWrapper);
        }
    }
}
