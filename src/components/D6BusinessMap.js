'use strict';
import styles from '!!raw-loader!./D6BusinessMap.css';
import Display from './Display';
import layers from './layers.json';
import languageText from './language-text.json';
import logo from '../assets/logo2.png';
import centroid from '@turf/centroid';

customElements.define('app-display', Display);

export default class D6BusinessMap extends HTMLElement {
    static get observedAttributes() {
        return ['data-app-state', 'data-parcel-id', 'data-map-state', 'data-active-boundaries', 'data-active-filters','data-language'];
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

        this.languageText = languageText;
        console.log(this.languageText);

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

        // create start screen
        this.startScreen = document.createElement('cod-modal');
        this.startScreen.setAttribute('data-id', 'd6-start-screen');
        this.startScreen.innerHTML = `
        <cod-modal-header data-extra-classes="bg-warning border-bottom-0">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Welcome to the D6 Business Directory</h1>
        </cod-modal-header>
        <cod-modal-body data-extra-classes="bg-warning">
        <p class="text-center">Some instructions here.</p>
        <ul>
            <li>Test 1</li>
            <li>Test 2</li>
            <li>Test 3</li>
        </ul>
        </cod-modal-body>
        <cod-modal-footer data-extra-classes="bg-warning border-top-0" data-button-extra-classes="btn-primary">
        </cod-modal-footer>
        `;

        shadow.appendChild(this.startScreen);

        this.startScreen.setAttribute('data-show', true);

        // Add label layers
        this.layers = this.createLabelLayers();

        console.log(this.layers);
        // Create map component
        let tempMainData = {"id":"d6-business","layers":[{"name":"data-points","type":"circle","radius":7,"color":"#745da8","active":true,"sort":10,"source":"data-points"}],"source":this.mainData.data,};
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

    createLabelLayers(){
        const layers = this.layers;
        let sources = ['neighborhoods','police-precincts','zip-codes'];
        layers.layers.forEach((layer) => {
            if(sources.includes(layer.name)){
                fetch(layer.source)
                .then((resp) => resp.json()) // Transform the data into json
                .then(function (data) {
                    let tmpLabelLayer = {"type":"FeatureCollection","crs":{"type":"name","properties":{"name":"EPSG:4326"}},"features":[]};
                    data.features.forEach((polygon) => {
                        let tmpCenter = centroid(polygon.geometry);
                        switch (layer.name) {
                            case 'neighborhoods':
                                tmpCenter.properties['name'] = (polygon.properties.nhood_name  == 'Central Southwest') ? 'Southwest' : polygon.properties.nhood_name;
                                tmpLabelLayer.features.push(tmpCenter);
                                break;

                            case 'police-precincts':
                                tmpCenter.properties['name'] = polygon.properties.name;
                                tmpLabelLayer.features.push(tmpCenter);
                                break;

                            case 'zip-codes':
                                tmpCenter.properties['name'] = polygon.properties.zipcode;
                                tmpLabelLayer.features.push(tmpCenter);
                                break;
                        
                            default:
                                break;
                        }
                        
                    });
                    switch (layer.name) {
                        case 'neighborhoods':
                            layers.layers[1].source = tmpLabelLayer;
                            break;

                        case 'police-precincts':
                            layers.layers[3].source = tmpLabelLayer;
                            break;

                        case 'zip-codes':
                            layers.layers[5].source = tmpLabelLayer;
                            break;
                    
                        default:
                            break;
                    }
                });
            }
        });
        return layers;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`App - attribute: ${name}, old: ${oldValue}, new: ${newValue}`);
        switch (name) {
            case 'data-active-filters':
                if(oldValue !== null){
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
                }
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
            
            case 'data-language':
                this.setAttribute('data-app-state', this.getAttribute('data-app-state'));
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

                case 'is_asian_owned':
                    tmpWhere.push('is_asian_owned%3D1');
                    break;

                case 'is_lgbtq_owned':
                    tmpWhere.push('is_lgbtq_owned%3D1');
                    break;

                case 'is_indigenous_owned':
                    tmpWhere.push('is_indigenous_owned%3D1');
                    break;

                case 'is_middle_eastern_owned':
                    tmpWhere.push('is_middle_eastern_owned%3D1');
                    break;

                case 'is_veteran_owned':
                    tmpWhere.push('is_veteran_owned%3D1');
                    break;

                case 'is_minority_owned':
                    tmpWhere.push('is_minority_owned%3D1');
                    break;

                case 'is_woman_owned':
                    tmpWhere.push('is_woman_owned%3D1');
                    break;

                case 'has_clinic_community_health_ser':
                    tmpWhere.push('has_clinic_community_health_ser%3D1');
                    break;

                case 'has_dental_service':
                    tmpWhere.push('has_dental_service%3D1');
                    break;

                case 'has_emergency_urgent_care_servi':
                    tmpWhere.push('has_emergency_urgent_care_servi%3D1');
                    break;

                case 'has_family_health_service':
                    tmpWhere.push('has_family_health_service%3D1');
                    break;

                case 'has_mental_health_service':
                    tmpWhere.push('has_mental_health_service%3D1');
                    break;

                case 'has_pediatric_service':
                    tmpWhere.push('has_pediatric_service%3D1');
                    break;

                case 'has_primary_care_service':
                    tmpWhere.push('has_primary_care_service%3D1');
                    break;

                case 'has_sexual_health_service':
                    tmpWhere.push('has_sexual_health_service%3D1');
                    break;

                case 'has_specialist_service':
                    tmpWhere.push('has_specialist_service%3D1');
                    break;

                case 'has_other_health_service':
                    tmpWhere.push('has_other_health_service%3D1');
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
        layers.forEach(layer => {
          _map.map.setLayoutProperty(layer, "visibility", visibility);
        });
    }

    clearApp(app) {
        const shadow = app.shadowRoot;
        while (shadow.firstChild) {
            shadow.removeChild(shadow.firstChild);
        }
    }

    clearPanel(app) {

    }

    updateBoundaries(ev){
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
        const shadow = app.shadowRoot;
        const appWrapper = document.createElement('div');
        appWrapper.id = 'app-wrapper';
        const currentLanguage = app.getAttribute('data-language');
        const currenBoundaries = app.getAttribute('data-active-boundaries').split(',');
        let currenFilters = [];
        (app.getAttribute('data-active-filters') != null) ? currenFilters = app.getAttribute('data-active-filters').split(',') : 0;
        switch (app.getAttribute('data-app-state')) {
            case 'start-screen':
                break;
            case 'active-panel':
                let tempData = JSON.parse(this.getAttribute('data-panel-data'));
                console.log(tempData.properties);
                this.panelContent.innerHTML = `
                    <p style="background-color:#745DA8;color:#fff" class="fs-3 fw-bold text-center">${tempData.properties.business_name}</p>
                    <p><strong>${this.languageText[currentLanguage]['panel'][0]}</strong> ${tempData.properties.address}
                    ${(tempData.properties.profit_or_nonprofit) ? `<p><strong>${this.languageText[currentLanguage]['panel'][1]}</strong> ${tempData.properties.profit_or_nonprofit}</p>` : ``}

                    <p><strong>${this.languageText[currentLanguage]['panel'][2]}</strong></p>
                    <ul>
                    ${(tempData.properties.is_asian_owned) ? `<li><strong>${this.languageText[currentLanguage]['panel'][3]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][3]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.is_black_owned) ? `<li><strong>${this.languageText[currentLanguage]['panel'][4]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][4]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.is_lgbtq_owned) ? `<li><strong>${this.languageText[currentLanguage]['panel'][5]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][5]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.is_indigenous_owned) ? `<li><strong>${this.languageText[currentLanguage]['panel'][6]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][6]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.is_middle_eastern_owned) ? `<li><strong>${this.languageText[currentLanguage]['panel'][7]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][7]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.is_veteran_owned) ? `<li><strong>${this.languageText[currentLanguage]['panel'][8]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][8]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.is_minority_owned) ? `<li><strong>${this.languageText[currentLanguage]['panel'][9]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][9]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.is_woman_owned) ? `<li><strong>${this.languageText[currentLanguage]['panel'][10]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][10]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    </ul>

                    <p><strong>${this.languageText[currentLanguage]['panel'][11]}</strong></p>
                    <ul>
                    ${(tempData.properties.has_clinic_community_health_ser) ? `<li><strong>${this.languageText[currentLanguage]['panel'][12]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][12]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.has_dental_service) ? `<li><strong>${this.languageText[currentLanguage]['panel'][13]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][13]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.has_emergency_urgent_care_servi) ? `<li><strong>${this.languageText[currentLanguage]['panel'][14]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][14]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.has_family_health_service) ? `<li><strong>${this.languageText[currentLanguage]['panel'][15]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][15]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.has_mental_health_service) ? `<li><strong>${this.languageText[currentLanguage]['panel'][16]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][16]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.has_pediatric_service) ? `<li><strong>${this.languageText[currentLanguage]['panel'][17]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][17]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.has_primary_care_service) ? `<li><strong>${this.languageText[currentLanguage]['panel'][18]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][18]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.has_sexual_health_service) ? `<li><strong>${this.languageText[currentLanguage]['panel'][19]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][19]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.has_specialist_service) ? `<li><strong>${this.languageText[currentLanguage]['panel'][20]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][20]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    ${(tempData.properties.has_other_health_service) ? `<li><strong>${this.languageText[currentLanguage]['panel'][21]}</strong> ${this.languageText[currentLanguage]['yes'][0]}</li>` : `<li><strong>${this.languageText[currentLanguage]['panel'][21]}</strong> ${this.languageText[currentLanguage]['no'][0]}</li>`}
                    </ul>

                    <p><strong>${this.languageText[currentLanguage]['panel'][22]}</strong></p>
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
                titleFilters.innerText = this.languageText[currentLanguage]['filters'][0];
                titleFilters.style.backgroundColor = '#745DA8';
                titleFilters.style.color = '#fff';
                titleFilters.className = 'fs-3 fw-bold text-center';

                const filterInstructions = document.createElement('p');
                filterInstructions.innerText = this.languageText[currentLanguage]['filters'][21];

                const ownershipSection = document.createElement('p');
                ownershipSection.innerText = this.languageText[currentLanguage]['filters'][1];
                ownershipSection.style.fontWeight ='bold';

                const ownershipFilterCheckboxes = document.createElement('section');

                const asianOwnedCheckbox = document.createElement('cod-form-check');
                asianOwnedCheckbox.setAttribute('data-checked', 'false');
                asianOwnedCheckbox.setAttribute('data-id', 'asian-owned');
                asianOwnedCheckbox.setAttribute('data-name', 'data-filters');
                asianOwnedCheckbox.setAttribute('data-value', 'is_asian_owned');
                (currenFilters.includes('is_asian_owned')) ? asianOwnedCheckbox.setAttribute('data-checked', true) : 0;
                asianOwnedCheckbox.setAttribute('data-type', 'checkbox');
                asianOwnedCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][2]);
                asianOwnedCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });

                const blackOwnedCheckbox = document.createElement('cod-form-check');
                blackOwnedCheckbox.setAttribute('data-checked', 'false');
                blackOwnedCheckbox.setAttribute('data-id', 'black-owned');
                blackOwnedCheckbox.setAttribute('data-name', 'data-filters');
                blackOwnedCheckbox.setAttribute('data-value', 'is_black_owned');
                (currenFilters.includes('is_black_owned')) ? blackOwnedCheckbox.setAttribute('data-checked', true) : 0;
                blackOwnedCheckbox.setAttribute('data-type', 'checkbox');
                blackOwnedCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][3]);
                blackOwnedCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });

                const lgbtqOwnedCheckbox = document.createElement('cod-form-check');
                lgbtqOwnedCheckbox.setAttribute('data-checked', 'false');
                lgbtqOwnedCheckbox.setAttribute('data-id', 'lgbtq-owned');
                lgbtqOwnedCheckbox.setAttribute('data-name', 'data-filters');
                lgbtqOwnedCheckbox.setAttribute('data-value', 'is_lgbtq_owned');
                (currenFilters.includes('is_lgbtq_owned')) ? lgbtqOwnedCheckbox.setAttribute('data-checked', true) : 0;
                lgbtqOwnedCheckbox.setAttribute('data-type', 'checkbox');
                lgbtqOwnedCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][4]);
                lgbtqOwnedCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });

                const indigenousOwnedCheckbox = document.createElement('cod-form-check');
                indigenousOwnedCheckbox.setAttribute('data-checked', 'false');
                indigenousOwnedCheckbox.setAttribute('data-id', 'indigenous-owned');
                indigenousOwnedCheckbox.setAttribute('data-name', 'data-filters');
                indigenousOwnedCheckbox.setAttribute('data-value', 'is_indigenous_owned');
                (currenFilters.includes('is_indigenous_owned')) ? indigenousOwnedCheckbox.setAttribute('data-checked', true) : 0;
                indigenousOwnedCheckbox.setAttribute('data-type', 'checkbox');
                indigenousOwnedCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][5]);
                indigenousOwnedCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });

                const middleEasternOwnedCheckbox = document.createElement('cod-form-check');
                middleEasternOwnedCheckbox.setAttribute('data-checked', 'false');
                middleEasternOwnedCheckbox.setAttribute('data-id', 'middle-eastern-owned');
                middleEasternOwnedCheckbox.setAttribute('data-name', 'data-filters');
                middleEasternOwnedCheckbox.setAttribute('data-value', 'is_middle_eastern_owned');
                (currenFilters.includes('is_middle_eastern_owned')) ? middleEasternOwnedCheckbox.setAttribute('data-checked', true) : 0;
                middleEasternOwnedCheckbox.setAttribute('data-type', 'checkbox');
                middleEasternOwnedCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][6]);
                middleEasternOwnedCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });

                const veteranOwnedCheckbox = document.createElement('cod-form-check');
                veteranOwnedCheckbox.setAttribute('data-checked', 'false');
                veteranOwnedCheckbox.setAttribute('data-id', 'veteran-owned');
                veteranOwnedCheckbox.setAttribute('data-name', 'data-filters');
                veteranOwnedCheckbox.setAttribute('data-value', 'is_veteran_owned');
                (currenFilters.includes('is_veteran_owned')) ? veteranOwnedCheckbox.setAttribute('data-checked', true) : 0;
                veteranOwnedCheckbox.setAttribute('data-type', 'checkbox');
                veteranOwnedCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][7]);
                veteranOwnedCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });  
                
                const minorityOwnedCheckbox = document.createElement('cod-form-check');
                minorityOwnedCheckbox.setAttribute('data-checked', 'false');
                minorityOwnedCheckbox.setAttribute('data-id', 'minority-owned');
                minorityOwnedCheckbox.setAttribute('data-name', 'data-filters');
                minorityOwnedCheckbox.setAttribute('data-value', 'is_minority_owned');
                (currenFilters.includes('is_minority_owned')) ? minorityOwnedCheckbox.setAttribute('data-checked', true) : 0;
                minorityOwnedCheckbox.setAttribute('data-type', 'checkbox');
                minorityOwnedCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][8]);
                minorityOwnedCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });  

                const womanOwnedCheckbox = document.createElement('cod-form-check');
                womanOwnedCheckbox.setAttribute('data-checked', 'false');
                womanOwnedCheckbox.setAttribute('data-id', 'minority-owned');
                womanOwnedCheckbox.setAttribute('data-name', 'data-filters');
                womanOwnedCheckbox.setAttribute('data-value', 'is_woman_owned');
                (currenFilters.includes('is_woman_owned')) ? womanOwnedCheckbox.setAttribute('data-checked', true) : 0;
                womanOwnedCheckbox.setAttribute('data-type', 'checkbox');
                womanOwnedCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][9]);
                womanOwnedCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                }); 

                const servicesSection = document.createElement('p');
                servicesSection.innerText = this.languageText[currentLanguage]['filters'][10];
                servicesSection.style.fontWeight ='bold';

                const servicesFilterCheckboxes = document.createElement('section');

                const communityHealthCheckbox = document.createElement('cod-form-check');
                communityHealthCheckbox.setAttribute('data-checked', 'false');
                communityHealthCheckbox.setAttribute('data-id', 'community-health');
                communityHealthCheckbox.setAttribute('data-name', 'data-filters');
                communityHealthCheckbox.setAttribute('data-value', 'has_clinic_community_health_ser');
                (currenFilters.includes('has_clinic_community_health_ser')) ? communityHealthCheckbox.setAttribute('data-checked', true) : 0;
                communityHealthCheckbox.setAttribute('data-type', 'checkbox');
                communityHealthCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][11]);
                communityHealthCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });

                const dentalCheckbox = document.createElement('cod-form-check');
                dentalCheckbox.setAttribute('data-checked', 'false');
                dentalCheckbox.setAttribute('data-id', 'dental');
                dentalCheckbox.setAttribute('data-name', 'data-filters');
                dentalCheckbox.setAttribute('data-value', 'has_dental_service');
                (currenFilters.includes('has_dental_service')) ? dentalCheckbox.setAttribute('data-checked', true) : 0;
                dentalCheckbox.setAttribute('data-type', 'checkbox');
                dentalCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][12]);
                dentalCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });

                const emergencyUrgentCareCheckbox = document.createElement('cod-form-check');
                emergencyUrgentCareCheckbox.setAttribute('data-checked', 'false');
                emergencyUrgentCareCheckbox.setAttribute('data-id', 'emergency-urgent-care');
                emergencyUrgentCareCheckbox.setAttribute('data-name', 'data-filters');
                emergencyUrgentCareCheckbox.setAttribute('data-value', 'has_emergency_urgent_care_servi');
                (currenFilters.includes('has_emergency_urgent_care_servi')) ? emergencyUrgentCareCheckbox.setAttribute('data-checked', true) : 0;
                emergencyUrgentCareCheckbox.setAttribute('data-type', 'checkbox');
                emergencyUrgentCareCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][13]);
                emergencyUrgentCareCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });

                const familyHealthCheckbox = document.createElement('cod-form-check');
                familyHealthCheckbox.setAttribute('data-checked', 'false');
                familyHealthCheckbox.setAttribute('data-id', 'family-health');
                familyHealthCheckbox.setAttribute('data-name', 'data-filters');
                familyHealthCheckbox.setAttribute('data-value', 'has_family_health_service');
                (currenFilters.includes('has_family_health_service')) ? familyHealthCheckbox.setAttribute('data-checked', true) : 0;
                familyHealthCheckbox.setAttribute('data-type', 'checkbox');
                familyHealthCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][14]);
                familyHealthCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });
                
                const mentalHealthCheckbox = document.createElement('cod-form-check');
                mentalHealthCheckbox.setAttribute('data-checked', 'false');
                mentalHealthCheckbox.setAttribute('data-id', 'mental-health');
                mentalHealthCheckbox.setAttribute('data-name', 'data-filters');
                mentalHealthCheckbox.setAttribute('data-value', 'has_mental_health_service');
                (currenFilters.includes('has_mental_health_service')) ? mentalHealthCheckbox.setAttribute('data-checked', true) : 0;
                mentalHealthCheckbox.setAttribute('data-type', 'checkbox');
                mentalHealthCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][15]);
                mentalHealthCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });  

                const pediatricCheckbox = document.createElement('cod-form-check');
                pediatricCheckbox.setAttribute('data-checked', 'false');
                pediatricCheckbox.setAttribute('data-id', 'pediatric');
                pediatricCheckbox.setAttribute('data-name', 'data-filters');
                pediatricCheckbox.setAttribute('data-value', 'has_pediatric_service');
                (currenFilters.includes('has_pediatric_service')) ? pediatricCheckbox.setAttribute('data-checked', true) : 0;
                pediatricCheckbox.setAttribute('data-type', 'checkbox');
                pediatricCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][16]);
                pediatricCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });  

                const primaryCareCheckbox = document.createElement('cod-form-check');
                primaryCareCheckbox.setAttribute('data-checked', 'false');
                primaryCareCheckbox.setAttribute('data-id', 'primary-care');
                primaryCareCheckbox.setAttribute('data-name', 'data-filters');
                primaryCareCheckbox.setAttribute('data-value', 'has_primary_care_service');
                (currenFilters.includes('has_primary_care_service')) ? primaryCareCheckbox.setAttribute('data-checked', true) : 0;
                primaryCareCheckbox.setAttribute('data-type', 'checkbox');
                primaryCareCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][17]);
                primaryCareCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });  
                   
                const sexualHealthCheckbox = document.createElement('cod-form-check');
                sexualHealthCheckbox.setAttribute('data-checked', 'false');
                sexualHealthCheckbox.setAttribute('data-id', 'sexual-health');
                sexualHealthCheckbox.setAttribute('data-name', 'data-filters');
                sexualHealthCheckbox.setAttribute('data-value', 'has_sexual_health_service');
                (currenFilters.includes('has_sexual_health_service')) ? sexualHealthCheckbox.setAttribute('data-checked', true) : 0;
                sexualHealthCheckbox.setAttribute('data-type', 'checkbox');
                sexualHealthCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][18]);
                sexualHealthCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });     

                const specialistCheckbox = document.createElement('cod-form-check');
                specialistCheckbox.setAttribute('data-checked', 'false');
                specialistCheckbox.setAttribute('data-id', 'specialist');
                specialistCheckbox.setAttribute('data-name', 'data-filters');
                specialistCheckbox.setAttribute('data-value', 'has_specialist_service');
                (currenFilters.includes('has_specialist_service')) ? specialistCheckbox.setAttribute('data-checked', true) : 0;
                specialistCheckbox.setAttribute('data-type', 'checkbox');
                specialistCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][19]);
                specialistCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });

                const otherHealthCheckbox = document.createElement('cod-form-check');
                otherHealthCheckbox.setAttribute('data-checked', 'false');
                otherHealthCheckbox.setAttribute('data-id', 'other-health');
                otherHealthCheckbox.setAttribute('data-name', 'data-filters');
                otherHealthCheckbox.setAttribute('data-value', 'has_other_health_service');
                (currenFilters.includes('has_other_health_service')) ? otherHealthCheckbox.setAttribute('data-checked', true) : 0;
                otherHealthCheckbox.setAttribute('data-type', 'checkbox');
                otherHealthCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['filters'][20]);
                otherHealthCheckbox.addEventListener('change', (ev) => {
                    console.log(ev.target.formCheck.checked);
                    this.updateMainData(ev);
                });

                this.panelContent.appendChild(titleFilters);
                this.panelContent.appendChild(filterInstructions);
                this.panelContent.appendChild(ownershipSection);
                ownershipFilterCheckboxes.appendChild(asianOwnedCheckbox);
                ownershipFilterCheckboxes.appendChild(blackOwnedCheckbox);
                ownershipFilterCheckboxes.appendChild(lgbtqOwnedCheckbox);
                ownershipFilterCheckboxes.appendChild(indigenousOwnedCheckbox);
                ownershipFilterCheckboxes.appendChild(middleEasternOwnedCheckbox);
                ownershipFilterCheckboxes.appendChild(veteranOwnedCheckbox);
                ownershipFilterCheckboxes.appendChild(minorityOwnedCheckbox);
                ownershipFilterCheckboxes.appendChild(womanOwnedCheckbox);
                this.panelContent.appendChild(ownershipFilterCheckboxes);
                this.panelContent.appendChild(servicesSection);
                servicesFilterCheckboxes.appendChild(communityHealthCheckbox);
                servicesFilterCheckboxes.appendChild(dentalCheckbox);
                servicesFilterCheckboxes.appendChild(emergencyUrgentCareCheckbox);
                servicesFilterCheckboxes.appendChild(familyHealthCheckbox);
                servicesFilterCheckboxes.appendChild(mentalHealthCheckbox);
                servicesFilterCheckboxes.appendChild(pediatricCheckbox);
                servicesFilterCheckboxes.appendChild(primaryCareCheckbox);
                servicesFilterCheckboxes.appendChild(sexualHealthCheckbox);
                servicesFilterCheckboxes.appendChild(specialistCheckbox);
                servicesFilterCheckboxes.appendChild(otherHealthCheckbox);
                this.panelContent.appendChild(servicesFilterCheckboxes);

                this.panel.setAttribute('data-show', 'true');
                break;

            case 'active-layers':
                this.panelContent.innerHTML = '';
                const title = document.createElement('p');
                title.innerText = this.languageText[currentLanguage]['boundaries'][0];
                title.style.backgroundColor = '#745DA8';
                title.style.color = '#fff';
                title.className = 'fs-3 fw-bold text-center';

                const layerCheckboxes = document.createElement('section');

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
                console.log(currenBoundaries.includes('neighborhoods-lines'));
                (currenBoundaries.includes('neighborhoods-lines')) ? neighborhoodCheckbox.setAttribute('data-checked', true) : 0;
                neighborhoodCheckbox.setAttribute('data-value', 'neighborhoods-lines,neighborhoods-fill,neighborhood-labels');
                neighborhoodCheckbox.setAttribute('data-type', 'checkbox');
                neighborhoodCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['boundaries'][1]);neighborhoodCheckbox.addEventListener('change', (ev) => {
                    this.updateBoundaries(ev);
                });

                const policePrecinctsCheckbox = document.createElement('cod-form-check');
                policePrecinctsCheckbox.setAttribute('data-id', 'police-precincts');
                policePrecinctsCheckbox.setAttribute('data-name', 'map-layer');
                console.log(currenBoundaries.includes('police-precincts-lines'));
                (currenBoundaries.includes('police-precincts-lines')) ? policePrecinctsCheckbox.setAttribute('data-checked', true) : 0;
                policePrecinctsCheckbox.setAttribute('data-value', 'police-precincts-lines,police-precincts-fill,police-precincts-labels');
                policePrecinctsCheckbox.setAttribute('data-type', 'checkbox');
                policePrecinctsCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['boundaries'][2]);policePrecinctsCheckbox.addEventListener('change', (ev) => {
                    this.updateBoundaries(ev);
                });

                const zipCodesCheckbox = document.createElement('cod-form-check');
                zipCodesCheckbox.setAttribute('data-id', 'zip-codes')
                zipCodesCheckbox.setAttribute('data-name', 'map-layer');
                (currenBoundaries.includes('zip-codes-lines')) ? zipCodesCheckbox.setAttribute('data-checked', true) : 0;
                zipCodesCheckbox.setAttribute('data-value', 'zip-codes-lines,zip-codes-fill,zip-codes-labels');
                zipCodesCheckbox.setAttribute('data-type', 'checkbox');
                zipCodesCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['boundaries'][3]);
                zipCodesCheckbox.addEventListener('change', (ev) => {
                    this.updateBoundaries(ev);
                });

                const cityFacilitiesCheckbox = document.createElement('cod-form-check');
                cityFacilitiesCheckbox.setAttribute('data-id', 'city-facilites')
                cityFacilitiesCheckbox.setAttribute('data-name', 'map-layer');
                (currenBoundaries.includes('city-facilities')) ? cityFacilitiesCheckbox.setAttribute('data-checked', true) : 0;
                cityFacilitiesCheckbox.setAttribute('data-value', 'city-facilities');
                cityFacilitiesCheckbox.setAttribute('data-type', 'checkbox');
                cityFacilitiesCheckbox.setAttribute('data-label', this.languageText[currentLanguage]['boundaries'][4]);
                cityFacilitiesCheckbox.addEventListener('change', (ev) => {
                    this.updateBoundaries(ev);
                });

                this.panelContent.appendChild(title);
                // layerCheckboxes.appendChild(councilCheckbox);
                layerCheckboxes.appendChild(neighborhoodCheckbox);
                layerCheckboxes.appendChild(policePrecinctsCheckbox);
                layerCheckboxes.appendChild(zipCodesCheckbox);
                layerCheckboxes.appendChild(cityFacilitiesCheckbox);
                this.panelContent.appendChild(layerCheckboxes);

                this.panel.setAttribute('data-show', 'true');
                break;

            case 'active-info':
                this.panelContent.innerHTML = '';
                const infoTitle = document.createElement('p');
                infoTitle.innerText = this.languageText[currentLanguage]['info'][0];
                infoTitle.style.backgroundColor = '#745DA8';
                infoTitle.style.color = '#fff';
                infoTitle.className = 'fs-3 fw-bold text-center';

                const lngLabel = document.createElement('label');
                lngLabel.className = 'fw-bold';
                lngLabel.htmlFor = 'language-selector';
                lngLabel.innerText = this.languageText[currentLanguage]['info'][9];
                const lngSelector = document.createElement('cod-form-select');
                lngSelector.setAttribute('data-id', 'language-selector');
                lngSelector.setAttribute('data-aria-label', this.languageText[currentLanguage]['info'][9]);
                lngSelector.innerHTML = `
                    <option value="">Select language</option>
                    <option value="en" ${(currentLanguage === 'en') ? 'selected' : ''}>English</option>
                    <option value="es" ${(currentLanguage === 'es') ? 'selected' : ''}>Español</option>
                    <option value="bn" ${(currentLanguage === 'bn') ? 'selected' : ''}>বাংলা</option>
                    <option value="ar" ${(currentLanguage === 'ar') ? 'selected' : ''}>عربي</option>
                `;
                const d6 = this;
                lngSelector.addEventListener('change', (ev) => {
                    const shadow = ev.target.shadowRoot;
                    d6.setAttribute('data-language', shadow.childNodes[1].value);
                });

                const iconLabels = document.createElement('article');
                iconLabels.innerHTML = `  
                <hr>
                <p><strong>${this.languageText[currentLanguage]['info'][1]}</strong></p>
                <p><cod-icon data-icon="bus-front" data-size="small"></cod-icon> ${this.languageText[currentLanguage]['info'][2]}</p>
                <p><cod-icon data-icon="universal-access-circle" data-size="small"></cod-icon> ${this.languageText[currentLanguage]['info'][3]}</p>
                <p><cod-icon data-icon="bicycle" data-size="small"></cod-icon> ${this.languageText[currentLanguage]['info'][4]}</p>
                <p><cod-icon data-icon="p-circle" data-size="small"></cod-icon> ${this.languageText[currentLanguage]['info'][5]}</p>
                <p><cod-icon data-icon="cash" data-size="small"></cod-icon> ${this.languageText[currentLanguage]['info'][6]}</p>
                <p><cod-icon data-icon="wifi" data-size="small"></cod-icon> ${this.languageText[currentLanguage]['info'][7]}</p>
                <p><cod-icon data-icon="building" data-size="small"></cod-icon> ${this.languageText[currentLanguage]['info'][8]}</p>
                `;

                this.panelContent.appendChild(infoTitle);
                this.panelContent.appendChild(lngLabel);
                this.panelContent.appendChild(lngSelector);
                this.panelContent.appendChild(iconLabels);
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
