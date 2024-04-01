'use strict';
import styles from '!!raw-loader!./D6BusinessMap.css';
import Display from './Display';
import DataLoader from './DataLoader';
import layers from './layers.json';
import mainData from './test-data.json';
import logo from '../assets/logo2.png';
// import Map from './Map';
customElements.define('app-display', Display);
customElements.define('app-data-loader', DataLoader);
// customElements.define('app-map', Map);

export default class D6BusinessMap extends HTMLElement {
    static get observedAttributes() {
        return ['data-app-state', 'data-parcel-id', 'data-map-state', 'data-active-boundaries', 'data-active-filters'];
    }

    constructor() {
        // Always call super first in constructor
        super();

        // Create a shadow root
        const shadow = this.attachShadow({ mode: 'open' });

        // Create result section
        const app = document.getElementsByTagName('d6-business-map');
        let tempState = app[0].getAttribute('data-app-state');

        this.mainData = {"name":"d6","data":"https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/council_surveyed_businesses/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token="};
        this.layers = layers;

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
        this.filterBtn.setAttribute('data-icon', 'funnel');
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
        this.LayerBtn.setAttribute('data-icon', 'bounding-box');
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
        this.infoBtn.setAttribute('data-icon', 'exclamation-circle');
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
        let tempMainData = {"id":"schools","layers":[{"name":"data-points","type":"circle","radius":10,"color":"#004445","active":true,"sort":10,"source":"data-points"}],"source":this.mainData.data,};
        this.map = document.createElement('cod-map');
        this.map.id = 'd6-map';
        this.map.setAttribute('data-parent-component', 'd6-business-map');
        this.map.setAttribute('data-map-mode', 'map-panel');
        this.map.setAttribute('data-center', "-83.103111,42.31103400000001");
        this.map.setAttribute('data-zoom', "11.5");
        this.map.setAttribute('data-map-data', JSON.stringify(tempMainData));
        this.map.setAttribute('data-map-layers', JSON.stringify(this.layers.layers));
        this.map.setAttribute('data-location', this.getAttribute('data-location'));
        this.map.setAttribute('data-map-state', 'init');
        app[0].setAttribute('data-active-boundaries', 'coucil-district-6-lines');
        this.appWrapper.appendChild(this.map);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`App - attribute: ${name}, old: ${oldValue}, new: ${newValue}`);
        switch (name) {
            case 'data-active-filters':
                const newFilters = newValue.split(',');
                let url= this.buildQuery(newFilters);
                console.log(url);
                const app = this;
                fetch(url)
                .then((resp) => resp.json()) // Transform the data into json
                .then(function (data) {
                    console.log(data);
                    (app.map.map.getSource('data-points')) ? app.map.map.getSource('data-points').setData(data) : 0;
                }).catch(err => {
                // console.log(err);
                });
                break;

            case 'data-active-boundaries':
                const oldBoundaries = oldValue.split(',');
                const newBoundaries = newValue.split(',');
                let boundariesDiff;
                if(newBoundaries.length > oldBoundaries.length){
                    boundariesDiff = this.arrayDifference(newBoundaries, oldBoundaries);
                    this.changeVisibility(boundariesDiff, 'visible', this.map);
                }else{
                    boundariesDiff = this.arrayDifference(oldBoundaries, newBoundaries);
                    this.changeVisibility(boundariesDiff, 'none', this.map);
                }
                break;
        
            default:
                this.loadApp(this);
                break;
        }
        
    }

    arrayDifference(arr1, arr2) {
        const difference = [];
     
        for (let i = 0; i < arr1.length; i++) {
            if (arr2.indexOf(arr1[i]) === -1) {
                difference.push(arr1[i]);
            }
        }
     
        return difference;
    }

    buildQuery(filters){
        console.log(filters)
        let tmpWhere = [];
        filters.forEach(filter => {
            switch (filter) {
                case 'is_asian_owned':
                    tmpWhere.push('is_asian_owned%3D1');
                    break;
            
                case 'is_black_owned':
                    tmpWhere.push('is_black_owned%3D1');
                    break;

                case 'has_clinic_community_health_ser':
                    tmpWhere.push('has_clinic_community_health_ser%3D1');
                    break;
                default:
                    break;
            }
        });
        tmpWhere = tmpWhere.join('+AND+');
        (tmpWhere === '') ? tmpWhere = '1%3D1' : 0;
        return `https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/council_surveyed_businesses/FeatureServer/0/query?where=${tmpWhere}&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=`;
        
    }

    changeVisibility(layers, visibility, _map){
        console.log(layers);
        console.log(visibility);
        layers.forEach(layer => {
          _map.map.setLayoutProperty(layer, "visibility", visibility);
        });
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

    updateBoundaries(ev){
        console.log(ev.target.formCheck.checked);
        const app = document.getElementsByTagName('d6-business-map');
        let boundaries = (app[0].getAttribute('data-active-boundaries') === null) ? '' : app[0].getAttribute('data-active-boundaries');
        let tempBoundaries = boundaries.split(',');
        boundaries = [];
        if(ev.target.formCheck.checked){
            boundaries = tempBoundaries;
            boundaries.push(ev.target.formCheck.value);
        }else{
            let multiLayers = ev.target.formCheck.value.split(',');
            tempBoundaries.forEach((boundary) => {
                (multiLayers.includes(boundary)) ? 0 : boundaries.push(boundary);
            });
        }
        boundaries = boundaries.join(',');
        app[0].setAttribute('data-active-boundaries', boundaries);
    }

    updateMainData(ev){
        console.log(ev.target.formCheck.checked);
        const app = document.getElementsByTagName('d6-business-map');
        let filters = (app[0].getAttribute('data-active-filters') === null) ? '' : app[0].getAttribute('data-active-filters');
        let tempFilters = filters.split(',');
        filters = [];
        if(ev.target.formCheck.checked){
            filters = tempFilters;
            filters.push(ev.target.formCheck.value);
        }else{
            let multiLayers = ev.target.formCheck.value.split(',');
            tempFilters.forEach((filter) => {
                (multiLayers.includes(filter)) ? 0 : filters.push(filter);
            });
        }
        filters = filters.join(',');
        app[0].setAttribute('data-active-filters', filters);
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
                    ${(tempData.properties.profit_or_nonprofit) ? `<p><strong>Business Type:</strong> ${tempData.properties.profit_or_nonprofit}</p>` : ``}

                    <p><strong>Business Owner Demographics:</strong></p>
                    <ul>
                    ${(tempData.properties.is_asian_owned) ? `<li><strong>Asian Owned:</strong> Yes</li>` : `<li><strong>Asian Owned:</strong> No</li>`}
                    ${(tempData.properties.is_black_owned) ? `<li><strong>Black Owned:</strong> Yes</li>` : `<li><strong>Black Owned:</strong> No</li>`}
                    ${(tempData.properties.is_lgbtq_owned) ? `<li><strong>LGBTQ Owned:</strong> Yes</li>` : `<li><strong>LGBTQ Owned:</strong> No</li>`}
                    ${(tempData.properties.is_indigenous_owned) ? `<li><strong>Indigenous Owned:</strong> Yes</li>` : `<li><strong>Indigenous Owned:</strong> No</li>`}
                    ${(tempData.properties.is_middle_eastern_owned) ? `<li><strong>Middle Eastern Owned:</strong> Yes</li>` : `<li><strong>Middle Eastern Owned:</strong> No</li>`}
                    ${(tempData.properties.is_veteran_owned) ? `<li><strong>Veteran Owned:</strong> Yes</li>` : `<li><strong>Veteran Owned:</strong> No</li>`}
                    ${(tempData.properties.is_minority_owned) ? `<li><strong>Minority Owned:</strong> Yes</li>` : `<li><strong>Minority Owned:</strong> No</li>`}
                    ${(tempData.properties.is_woman_owned) ? `<li><strong>Woman Owned:</strong> Yes</li>` : `<li><strong>Woman Owned:</strong> No</li>`}
                    </ul>

                    <p><strong>Service:</strong></p>
                    <ul>
                    ${(tempData.properties.has_clinic_community_health_ser) ? `<li><strong>Community Health:</strong> Yes</li>` : `<li><strong>Community Health:</strong> No</li>`}
                    ${(tempData.properties.has_dental_service) ? `<li><strong>Dental:</strong> Yes</li>` : `<li><strong>Dental:</strong> No</li>`}
                    ${(tempData.properties.has_emergency_urgent_care_servi) ? `<li><strong>Urgen Care:</strong> Yes</li>` : `<li><strong>Urgent Care:</strong> No</li>`}
                    ${(tempData.properties.has_family_health_service) ? `<li><strong>Family Health:</strong> Yes</li>` : `<li><strong>Family Health:</strong> No</li>`}
                    ${(tempData.properties.has_mental_health_service) ? `<li><strong>Mental Health:</strong> Yes</li>` : `<li><strong>Mental Health:</strong> No</li>`}
                    ${(tempData.properties.has_pediatric_service) ? `<li><strong>Pediatrics:</strong> Yes</li>` : `<li><strong>Pediatrics:</strong> No</li>`}
                    ${(tempData.properties.has_primary_care_service) ? `<li><strong>Primary Care:</strong> Yes</li>` : `<li><strong>Primary Care:</strong> No</li>`}
                    ${(tempData.properties.has_sexual_health_service) ? `<li><strong>Sexual Health:</strong> Yes</li>` : `<li><strong>Sexual Health:</strong> No</li>`}
                    ${(tempData.properties.has_specialist_service) ? `<li><strong>Specialist:</strong> Yes</li>` : `<li><strong>Specialist:</strong> No</li>`}
                    ${(tempData.properties.has_other_health_service) ? `<li><strong>Other Health Services:</strong> Yes</li>` : `<li><strong>Other Health Services:</strong> No</li>`}
                    </ul>

                    <p><strong>Amenities:</strong></p>
                    <p>
                    ${(tempData.properties.is_public_transit_accessible) ? `<cod-icon data-icon="bus-front" data-size="small"></cod-icon>` : ``}
                    ${(tempData.properties.is_ada_accessible) ? `<cod-icon data-icon="universal-access-circle" data-size="small"></cod-icon>` : ``} 
                    ${(tempData.properties.has_bike_rack) ? `<cod-icon data-icon="bicycle" data-size="small"></cod-icon>` : ``} 
                    ${(tempData.properties.has_parking_lot) ? `<cod-icon data-icon="p-circle-fill" data-size="small"></cod-icon>` : ``} 
                    ${(tempData.properties.is_cash_only) ? `<cod-icon data-icon="cash" data-size="small"></cod-icon>` : ``} 
                    ${(tempData.properties.has_free_wifi) ? `<cod-icon data-icon="wifi" data-size="small"></cod-icon>` : ``} 
                    ${(tempData.properties.has_gender_neutral_bathrooms) ? `<cod-icon data-icon="toilet" data-size="small"></cod-icon>` : ``} 
                    ${(tempData.properties.has_rental_space) ? `<cod-icon data-icon="building" data-size="small"></cod-icon>` : ``} 
                    </p>
                `;
                this.panel.setAttribute('data-show', 'true');
                break;

            case 'active-filters':
                this.panelContent.innerHTML = '';
                const titleFilters = document.createElement('p');
                titleFilters.innerText = 'Data Filters';
                titleFilters.style.backgroundColor = '#745DA8';
                titleFilters.style.color = '#fff';
                titleFilters.className = 'fs-3 fw-bold text-center';

                const ownershipSection = document.createElement('p');
                ownershipSection.innerText = 'By ownership:';
                ownershipSection.style.fontWeight ='bold';

                const ownershipFilterCheckboxes = document.createElement('cod-form-check-group');
                ownershipFilterCheckboxes.setAttribute('data-type', 'checkbox');

                const asianOwnedCheckbox = document.createElement('cod-form-check');
                asianOwnedCheckbox.setAttribute('data-checked', 'false');
                asianOwnedCheckbox.setAttribute('data-id', 'asian-owned');
                asianOwnedCheckbox.setAttribute('data-name', 'data-filters');
                asianOwnedCheckbox.setAttribute('data-value', 'is_asian_owned');
                asianOwnedCheckbox.setAttribute('data-type', 'checkbox');
                asianOwnedCheckbox.setAttribute('data-label', 'Asian Owned');
                asianOwnedCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });

                const blackOwnedCheckbox = document.createElement('cod-form-check');
                blackOwnedCheckbox.setAttribute('data-checked', 'false');
                blackOwnedCheckbox.setAttribute('data-id', 'black-owned');
                blackOwnedCheckbox.setAttribute('data-name', 'data-filters');
                blackOwnedCheckbox.setAttribute('data-value', 'is_black_owned');
                blackOwnedCheckbox.setAttribute('data-type', 'checkbox');
                blackOwnedCheckbox.setAttribute('data-label', 'Back Owned');
                blackOwnedCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });

                const servicesSection = document.createElement('p');
                servicesSection.innerText = 'By services:';
                servicesSection.style.fontWeight ='bold';

                const servicesFilterCheckboxes = document.createElement('cod-form-check-group');
                servicesFilterCheckboxes.setAttribute('data-type', 'checkbox');

                const communityHealthCheckbox = document.createElement('cod-form-check');
                communityHealthCheckbox.setAttribute('data-checked', 'false');
                communityHealthCheckbox.setAttribute('data-id', 'community-health');
                communityHealthCheckbox.setAttribute('data-name', 'data-filters');
                communityHealthCheckbox.setAttribute('data-value', 'has_clinic_community_health_ser');
                communityHealthCheckbox.setAttribute('data-type', 'checkbox');
                communityHealthCheckbox.setAttribute('data-label', 'Community Health');
                communityHealthCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });

                this.panelContent.appendChild(titleFilters);
                this.panelContent.appendChild(ownershipSection);
                ownershipFilterCheckboxes.appendChild(asianOwnedCheckbox);
                ownershipFilterCheckboxes.appendChild(blackOwnedCheckbox);
                this.panelContent.appendChild(ownershipFilterCheckboxes);
                this.panelContent.appendChild(servicesSection);
                servicesFilterCheckboxes.appendChild(communityHealthCheckbox)
                this.panelContent.appendChild(servicesFilterCheckboxes);

                this.panel.setAttribute('data-show', 'true');
                break;

            case 'active-layers':
                this.panelContent.innerHTML = '';
                const title = document.createElement('p');
                title.innerText = 'Boundaries';
                title.style.backgroundColor = '#745DA8';
                title.style.color = '#fff';
                title.className = 'fs-3 fw-bold text-center';

                const layerCheckboxes = document.createElement('cod-form-check-group');
                layerCheckboxes.setAttribute('data-type', 'checkbox');

                // const councilCheckbox = document.createElement('cod-form-check');
                // councilCheckbox.setAttribute('data-checked', 'true');
                // councilCheckbox.setAttribute('data-id', 'council-district');
                // councilCheckbox.setAttribute('data-name', 'map-layer');
                // councilCheckbox.setAttribute('data-value', 'coucil-district-6-lines');
                // councilCheckbox.setAttribute('data-type', 'checkbox');
                // councilCheckbox.setAttribute('data-label', 'Council District');
                // councilCheckbox.addEventListener('change', (ev) => {
                //     console.log(ev.target.formCheck.checked);
                //     this.updateBoundaries(ev);
                // });

                const neighborhoodCheckbox = document.createElement('cod-form-check');
                neighborhoodCheckbox.setAttribute('data-id', 'neighborhoods');
                neighborhoodCheckbox.setAttribute('data-name', 'map-layer');
                neighborhoodCheckbox.setAttribute('data-value', 'neighborhoods-lines,neighborhoods-fill,neighborhood-labels');
                neighborhoodCheckbox.setAttribute('data-type', 'checkbox');
                neighborhoodCheckbox.setAttribute('data-label', 'Neighborhoods');neighborhoodCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateBoundaries(ev);
                });

                const policePrecinctsCheckbox = document.createElement('cod-form-check');
                policePrecinctsCheckbox.setAttribute('data-id', 'police-precincts');
                policePrecinctsCheckbox.setAttribute('data-name', 'map-layer');
                policePrecinctsCheckbox.setAttribute('data-value', 'police-precincts-lines,police-precincts-fill');
                policePrecinctsCheckbox.setAttribute('data-type', 'checkbox');
                policePrecinctsCheckbox.setAttribute('data-label', 'Police Precincts');policePrecinctsCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateBoundaries(ev);
                });

                const zipCodesCheckbox = document.createElement('cod-form-check');
                zipCodesCheckbox.setAttribute('data-id', 'zip-codes')
                zipCodesCheckbox.setAttribute('data-name', 'map-layer');
                zipCodesCheckbox.setAttribute('data-value', 'zip-codes-lines,zip-codes-fill');
                zipCodesCheckbox.setAttribute('data-type', 'checkbox');
                zipCodesCheckbox.setAttribute('data-label', 'Zip Codes');
                zipCodesCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateBoundaries(ev);
                });

                this.panelContent.appendChild(title);
                // layerCheckboxes.appendChild(councilCheckbox);
                layerCheckboxes.appendChild(neighborhoodCheckbox);
                layerCheckboxes.appendChild(policePrecinctsCheckbox);
                layerCheckboxes.appendChild(zipCodesCheckbox);
                this.panelContent.appendChild(layerCheckboxes);

                this.panel.setAttribute('data-show', 'true');
                break;

            case 'active-info':
                const lngLabel = document.createElement('label');
                lngLabel.className = 'fw-bold';
                lngLabel.htmlFor = 'language-selector';
                lngLabel.innerText = 'Select Language';
                const lngSelector = document.createElement('cod-form-select');
                lngSelector.setAttribute('data-id', 'language-selector');
                lngSelector.setAttribute('data-aria-label', 'Select language');
                lngSelector.innerHTML = `
                    <option value="">Select language</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="bn">বাংলা</option>
                    <option value="ar">عربي</option>
                `;
                lngSelector.addEventListener('change', (ev) => {
                    console.log(ev.target);
                });
                this.panelContent.innerHTML = `
                    <p style="background-color:#745DA8;color:#fff" class="fs-3 fw-bold text-center">Informantion</p>
                    <p><strong>Icon Descriptions</strong></p>
                    <p><cod-icon data-icon="bus-front" data-size="small"></cod-icon> Public transit accessible</p>
                    <p><cod-icon data-icon="universal-access-circle" data-size="small"></cod-icon> ADA accessible</p>
                    <p><cod-icon data-icon="bicycle" data-size="small"></cod-icon> Bike rack</p>
                    <p><cod-icon data-icon="p-circle" data-size="small"></cod-icon> Parking lot</p>
                    <p><cod-icon data-icon="cash" data-size="small"></cod-icon> Cash only</p>
                    <p><cod-icon data-icon="wifi" data-size="small"></cod-icon> Free WiFi</p>
                    <p><cod-icon data-icon="building" data-size="small"></cod-icon> Rental space</p>
                `;
                this.panelContent.appendChild(lngLabel);
                this.panelContent.appendChild(lngSelector);
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
