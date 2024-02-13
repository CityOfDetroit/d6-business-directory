'use strict';
import Geocoder from './Geocoder';
import NavigationTools from './NavigationTools';
customElements.define('app-geocoder', Geocoder);
customElements.define('app-nav-tools', NavigationTools);
export default class Display extends HTMLElement {

  constructor() {
    // Always call super first in constructor
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
    <cod-offcanvas data-id="offcanvasExample" data-show="true">
    <cod-offcanvas-header>
      <h5>Offcanvas</h5>
    </cod-offcanvas-header>
    <cod-offcanvas-body>
      <p>
        Some text as placeholder. In real life you can have the elements you
        have chosen. Like, text, images, lists, etc.
      </p>
    </cod-offcanvas-body>
  </cod-offcanvas>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log(`Display - attribute: ${name}, old: ${oldValue}, new: ${newValue}`);
    if (newValue == 'data-panel-data') {
      this.clearDisplay(this);
    }
    if (name == 'data-pagination'){
      this.clearDisplay(this);
    }
    this.loadDisplay(this);
  }

  clearDisplay(display) {
    const shadow = display.shadowRoot;
    while (shadow.firstChild) {
      shadow.removeChild(shadow.firstChild);
    }
  }

  formatDate(value) {
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const tempDate = new Date(value);
    return `${month[tempDate.getMonth()]} ${tempDate.getDate()}, ${tempDate.getFullYear()}`;
  }

  printInfo(display) {
    let divContents = display.buildDataSection(display);
    let a = window.open('', '', 'height=500, width=500');
    a.document.write('<html>');
    a.document.write('<head><style>@media print {.noprint { visibility: hidden;} p.data-block-title{border-bottom: 1px solid;} .data-block-title button { display: none; } body { column-count: 2;} .data-block {     -webkit-column-break-inside: avoid; page-break-inside: avoid; break-inside: avoid; } }</style></head>');
    a.document.write('<body >');
    a.document.write(divContents.children[1].innerHTML);
    a.document.write('</body>');
    a.document.close();
    a.print();
  }

  loadDisplay(display) {
    const shadow = display.shadowRoot;
    const displayWrapper = document.createElement('section');
    const geocoder = document.createElement('app-geocoder');
    const navTools = document.createElement('app-nav-tools');
    const app = document.getElementsByTagName('my-home-info');
    navTools.printInfo = display.printInfo;
    displayWrapper.id = 'display-wrapper';
    switch (this.getAttribute('data-display-type')) {
      case 'active-panel':
        console.log('loading panel');
        let data = JSON.parse(this.getAttribute('data-panel-data'));
        let panel = document.createElement('cod-offcanvas');
        panel.id = 'd6-map-panel';
        panel.setAttribute('data-show', 'true');
        let panelHeader = document.createElement('cod-offcanvas-header');
        let panelBody = document.createElement('cod-offcanvas-body');
        
        panelHeader.innerHTML = `<h5>${data.properties.business_name}`;
        panelBody.innerHTML = `
        <p><strong>Address:</strong> ${data.properties.address}</p>
        <p><strong>Phone:</strong> ${data.properties.business_phone_number}</p>
        <p><strong>Website:</strong> ${data.properties.business_phone_website}</p>
        `;
        panel.appendChild(panelHeader);
        panel.appendChild(panelBody);
        displayWrapper.appendChild(panel);
        shadow.appendChild(displayWrapper);
        console.log(panel);
        break;

      case 'active':
        shadow.appendChild(display.welcomeStyle);
        displayWrapper.appendChild(geocoder);
        shadow.appendChild(displayWrapper);
        break;

      case 'loading':
        const loader = document.createElement('cod-loader');
        loader.setAttribute('data-color', 'color-3');
        displayWrapper.appendChild(loader);
        shadow.appendChild(displayWrapper);
        break;

      case 'results':
        let parcelData = JSON.parse(app[0].getAttribute('data-parcel-id'));
        shadow.appendChild(display.resultsStyle);
        let resultsContainer = document.createElement('section');
        resultsContainer.className = 'results-container';
        resultsContainer.appendChild(navTools);
        let dataSetResults = document.createElement('article');
        dataSetResults.className = 'dataset-results';
        let addressBox = document.createElement('article');
        addressBox.className = 'result-address';
        addressBox.innerText = parcelData.address;
        dataSetResults.appendChild(addressBox);
        let results = display.buildDataSection(display);
        dataSetResults.appendChild(results);
        resultsContainer.appendChild(dataSetResults);
        displayWrapper.appendChild(resultsContainer);
        shadow.appendChild(displayWrapper);
        break;

      case 'error':
        let errorContainer = document.createElement('section');
        shadow.appendChild(display.resultsStyle);
        errorContainer.className = 'results-container';
        errorContainer.appendChild(navTools);
        let errorBox = document.createElement('article');
        errorBox.className = 'error-result';
        errorBox.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="70" viewBox="0 0 100 68">
          <g id="large">
            <path fill="none" stroke="#F44" d="M55.8 38.5l6.2-1.2c0-1.8-.1-3.5-.4-5.3l-6.3-.2c-.5-2-1.2-4-2.1-6l4.8-4c-.9-1.6-1.9-3-3-4.4l-5.6 3c-1.3-1.6-3-3-4.7-4.1l2-6A30 30 0 0 0 42 8l-3.3 5.4c-2-.7-4.2-1-6.2-1.2L31.3 6c-1.8 0-3.5.1-5.3.4l-.2 6.3c-2 .5-4 1.2-6 2.1l-4-4.8c-1.6.9-3 1.9-4.4 3l3 5.6c-1.6 1.3-3 3-4.1 4.7l-6-2A32.5 32.5 0 0 0 2 26l5.4 3.3c-.7 2-1 4.2-1.2 6.2L0 36.7c0 1.8.1 3.5.4 5.3l6.3.2c.5 2 1.2 4 2.1 6l-4.8 4c.9 1.6 1.9 3 3 4.4l5.6-3c1.4 1.6 3 3 4.7 4.1l-2 6A30.5 30.5 0 0 0 20 66l3.4-5.4c2 .7 4 1 6.1 1.2l1.2 6.2c1.8 0 3.5-.1 5.3-.4l.2-6.3c2-.5 4-1.2 6-2.1l4 4.8c1.6-.9 3-1.9 4.4-3l-3-5.6c1.6-1.3 3-3 4.1-4.7l6 2A32 32 0 0 0 60 48l-5.4-3.3c.7-2 1-4.2 1.2-6.2zm-13.5 4a12.5 12.5 0 1 1-22.6-11 12.5 12.5 0 0 1 22.6 11z"/>
            <animateTransform attributeName="transform" begin="0s" dur="3s" from="0 31 37" repeatCount="indefinite" to="360 31 37" type="rotate"/>
          </g>
          <g id="small">
            <path fill="none" stroke="#F44" d="M93 19.3l6-3c-.4-1.6-1-3.2-1.7-4.8L90.8 13c-.9-1.4-2-2.7-3.4-3.8l2.1-6.3A21.8 21.8 0 0 0 85 .7l-3.6 5.5c-1.7-.4-3.4-.5-5.1-.3l-3-5.9c-1.6.4-3.2 1-4.7 1.7L70 8c-1.5 1-2.8 2-3.9 3.5L60 9.4a20.6 20.6 0 0 0-2.2 4.6l5.5 3.6a15 15 0 0 0-.3 5.1l-5.9 3c.4 1.6 1 3.2 1.7 4.7L65 29c1 1.5 2.1 2.8 3.5 3.9l-2.1 6.3a21 21 0 0 0 4.5 2.2l3.6-5.6c1.7.4 3.5.5 5.2.3l2.9 5.9c1.6-.4 3.2-1 4.8-1.7L86 34c1.4-1 2.7-2.1 3.8-3.5l6.3 2.1a21.5 21.5 0 0 0 2.2-4.5l-5.6-3.6c.4-1.7.5-3.5.3-5.1zM84.5 24a7 7 0 1 1-12.8-6.2 7 7 0 0 1 12.8 6.2z"/>
            <animateTransform attributeName="transform" begin="0s" dur="2s" from="0 78 21" repeatCount="indefinite" to="-360 78 21" type="rotate"/>
          </g>
        </svg>
        <h3>No Information found on this address. Please close and try again.</h3>
        `;
        errorContainer.appendChild(errorBox);
        displayWrapper.appendChild(errorContainer);
        shadow.appendChild(displayWrapper);
        break;

      case 'print':
        let printParcelData = JSON.parse(app[0].getAttribute('data-parcel-id'));
        shadow.appendChild(display.resultsStyle);
        let printResultsContainer = document.createElement('section');
        printResultsContainer.className = 'results-container';
        printResultsContainer.appendChild(navTools);
        let printDataSetResults = document.createElement('article');
        printDataSetResults.className = 'dataset-results';
        let printAddressBox = document.createElement('article');
        printAddressBox.className = 'result-address';
        printAddressBox.innerText = printParcelData.address;
        printDataSetResults.appendChild(printAddressBox);
        let printResults = display.buildDataSection(display);
        printDataSetResults.appendChild(printResults);
        printResultsContainer.appendChild(printDataSetResults);
        displayWrapper.appendChild(printResultsContainer);
        shadow.appendChild(displayWrapper);
        display.printInfo(display);
        break;

      default:
        break;
    }
  }

}
