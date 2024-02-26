'use strict';
import styles from '!!raw-loader!./D6BusinessMap.css';
import Display from './Display';
import DataLoader from './DataLoader';
import testData from './test-data.json';
import logo from '../assets/logo2.png';
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

        // Adding styles
        const appStyles = document.createElement('style');
        appStyles.textContent = styles;
        this.shadowRoot.appendChild(appStyles);

        // Creating app wrapper
        this.appWrapper = document.createElement('section');
        this.appWrapper.id = 'app-wrapper';
        shadow.appendChild(this.appWrapper);

        // create navtools
        this.nav = document.createElement('section');
        this.nav.id = 'd6-map-nav';
        this.filterBtn = document.createElement('cod-button');
        this.filterBtn.setAttribute('data-label', '');
        this.filterBtn.setAttribute('data-size', 'lg');
        this.filterBtn.setAttribute('data-img', '');
        this.filterBtn.setAttribute('data-img-alt', '');
        this.filterBtn.setAttribute('data-shape', 'square');
        this.filterBtn.setAttribute('data-nav-value', 'filters');
        this.filterBtn.setAttribute('data-icon', 'house-fill');
        this.filterBtn.setAttribute('data-icon-size', 'medium');
        this.filterBtn.setAttribute('data-aria-label', 'Filters');
        this.filterBtn.setAttribute('data-extra-classes', 'icon-center');
        this.filterBtn.setAttribute('data-background-color', 'primary');
        this.filterBtn.setAttribute('data-primary', true);
        this.filterBtn.addEventListener('click', (ev) => {
            let app = document.getElementsByTagName('d6-business-map');
            app[0].setAttribute('data-app-state', 'active-filters');
        });
        this.nav.appendChild(this.filterBtn);

        this.LayerBtn = document.createElement('cod-button');
        this.LayerBtn.setAttribute('data-label', '');
        this.LayerBtn.setAttribute('data-size', 'lg');
        this.LayerBtn.setAttribute('data-img', '');
        this.LayerBtn.setAttribute('data-img-alt', '');
        this.LayerBtn.setAttribute('data-shape', 'square');
        this.LayerBtn.setAttribute('data-nav-value', 'layers');
        this.LayerBtn.setAttribute('data-icon', 'check-circle-fill');
        this.LayerBtn.setAttribute('data-icon-size', 'medium');
        this.LayerBtn.setAttribute('data-aria-label', 'Layers');
        this.LayerBtn.setAttribute('data-extra-classes', 'icon-center');
        this.LayerBtn.setAttribute('data-background-color', 'primary');
        this.LayerBtn.setAttribute('data-primary', true);
        this.LayerBtn.addEventListener('click', (ev) => {
            let app = document.getElementsByTagName('d6-business-map');
            app[0].setAttribute('data-app-state', 'active-layers');
        });
        this.nav.appendChild(this.LayerBtn);

        this.infoBtn = document.createElement('cod-button');
        this.infoBtn.setAttribute('data-label', '');
        this.infoBtn.setAttribute('data-size', 'lg');
        this.infoBtn.setAttribute('data-img', '');
        this.infoBtn.setAttribute('data-img-alt', '');
        this.infoBtn.setAttribute('data-shape', 'square');
        this.infoBtn.setAttribute('data-nav-value', 'info');
        this.infoBtn.setAttribute('data-icon', 'exclamation-circle-fill');
        this.infoBtn.setAttribute('data-icon-size', 'medium');
        this.infoBtn.setAttribute('data-aria-label', 'Information');
        this.infoBtn.setAttribute('data-extra-classes', 'icon-center');
        this.infoBtn.setAttribute('data-background-color', 'primary');
        this.infoBtn.setAttribute('data-primary', true);
        this.infoBtn.addEventListener('click', (ev) => {
            let app = document.getElementsByTagName('d6-business-map');
            app[0].setAttribute('data-app-state', 'active-info');
        });
        this.nav.appendChild(this.infoBtn);
        shadow.appendChild(this.nav);

        // create panel component
        this.panel = document.createElement('cod-offcanvas');
        this.panel.id = 'd6-map-panel';
        this.panelHeader = document.createElement('cod-offcanvas-header');
        this.panelLogo = document.createElement('img');
        this.panelLogo.style.width = '6em';
        this.panelLogo.style.position = 'relative';
        this.panelLogo.style.left = '8em';
        this.panelLogo.src = logo;
        this.panelHeader.appendChild(this.panelLogo);

        this.panelBody = document.createElement('cod-offcanvas-body');
        this.panelContent = document.createElement('article');
        this.panelContent.innerHTML = ``;
        this.panelBody.appendChild(this.panelContent);

        this.panel.appendChild(this.panelHeader);
        this.panel.appendChild(this.panelBody);
        shadow.appendChild(this.panel);

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
                console.log(tempData.properties);
                this.panelContent.innerHTML = `
                    <p style="background-color:#745DA8;color:#fff" class="fs-3 fw-bold text-center">${tempData.properties.business_name}</p>
                    <p><strong>Address:</strong> ${tempData.properties.address}
                    <p><strong>Amenities</strong></p>
                    <p><cod-icon data-icon="house" data-size="small"></cod-icon> <cod-icon data-icon="calendar" data-size="small"></cod-icon> </p>
                `;
                this.panel.setAttribute('data-show', 'true');
                break;

            case 'active-filters':
                this.panelContent.innerHTML = `
                    <p style="background-color:#745DA8;color:#fff" class="fs-3 fw-bold text-center">Data Filters</p>
                    <p><strong>By ownership:</strong></p>
                    <cod-form-check data-id="council-district" data-name="council-district" data-value="council-district" data-type="checkbox" data-btn-color="undefined" data-checked="undefined" data-label="Council District"></cod-form-check>
                    <cod-form-check data-id="neighborhoods" data-name="neighborhoods" data-value="neighborhoods" data-type="checkbox" data-btn-color="undefined" data-checked="undefined" data-label="Neighborhoods"></cod-form-check>
                    <cod-form-check data-id="police-precincts" data-name="police-precincts" data-value="police-precincts" data-type="checkbox" data-btn-color="undefined" data-checked="undefined" data-label="Police Precincts"></cod-form-check>
                    <cod-form-check data-id="zip-codes" data-name="zip-codes" data-value="zip-codes" data-type="checkbox" data-btn-color="undefined" data-checked="undefined" data-label="Zip Codes"></cod-form-check>

                    <p><strong>By service:</strong></p>
                    <cod-form-check data-id="council-district" data-name="council-district" data-value="council-district" data-type="checkbox" data-btn-color="undefined" data-checked="undefined" data-label="Council District"></cod-form-check>
                    <cod-form-check data-id="neighborhoods" data-name="neighborhoods" data-value="neighborhoods" data-type="checkbox" data-btn-color="undefined" data-checked="undefined" data-label="Neighborhoods"></cod-form-check>
                    <cod-form-check data-id="police-precincts" data-name="police-precincts" data-value="police-precincts" data-type="checkbox" data-btn-color="undefined" data-checked="undefined" data-label="Police Precincts"></cod-form-check>
                    <cod-form-check data-id="zip-codes" data-name="zip-codes" data-value="zip-codes" data-type="checkbox" data-btn-color="undefined" data-checked="undefined" data-label="Zip Codes"></cod-form-check>
                `;
                this.panel.setAttribute('data-show', 'true');
                break;

            case 'active-layers':
                this.panelContent.innerHTML = `
                    <p style="background-color:#745DA8;color:#fff" class="fs-3 fw-bold text-center">Boundaries</p>
                    <cod-form-check data-id="council-district" data-name="council-district" data-value="council-district" data-type="checkbox" data-btn-color="undefined" data-checked="undefined" data-label="Council District"></cod-form-check>
                    <cod-form-check data-id="neighborhoods" data-name="neighborhoods" data-value="neighborhoods" data-type="checkbox" data-btn-color="undefined" data-checked="undefined" data-label="Neighborhoods"></cod-form-check>
                    <cod-form-check data-id="police-precincts" data-name="police-precincts" data-value="police-precincts" data-type="checkbox" data-btn-color="undefined" data-checked="undefined" data-label="Police Precincts"></cod-form-check>
                    <cod-form-check data-id="zip-codes" data-name="zip-codes" data-value="zip-codes" data-type="checkbox" data-btn-color="undefined" data-checked="undefined" data-label="Zip Codes"></cod-form-check>
                `;
                this.panel.setAttribute('data-show', 'true');
                break;

            case 'active-info':
                this.panelContent.innerHTML = `
                    <p style="background-color:#745DA8;color:#fff" class="fs-3 fw-bold text-center">Informantion</p>
                    <p><cod-icon data-icon="house" data-size="small"></cod-icon> Wifi</p>
                    <p><cod-icon data-icon="house" data-size="small"></cod-icon> Wifi</p>
                    <p><cod-icon data-icon="house" data-size="small"></cod-icon> Wifi</p>
                    <p><cod-icon data-icon="house" data-size="small"></cod-icon> Wifi</p>
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
