!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},r=(new Error).stack;r&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[r]="4986da08-ece6-4af6-8d8a-e9c405d1c26a",e._sentryDebugIdIdentifier="sentry-dbid-4986da08-ece6-4af6-8d8a-e9c405d1c26a")}catch(e){}}();var _global="undefined"!==typeof window?window:"undefined"!==typeof global?global:"undefined"!==typeof self?self:{};_global.SENTRY_RELEASE={id:"6a12a01afc7486f34126765cd1b0bdab52f53965"},(self.webpackChunkd6_business_directory=self.webpackChunkd6_business_directory||[]).push([[432],{160:(e,r,n)=>{n.d(r,{c:()=>l});function t(e,r,n){void 0===n&&(n={});var t={type:"Feature"};return(0===n.id||n.id)&&(t.id=n.id),n.bbox&&(t.bbox=n.bbox),t.properties=r||{},t.geometry=e,t}function o(e,r,n){if(void 0===n&&(n={}),!e)throw new Error("coordinates is required");if(!Array.isArray(e))throw new Error("coordinates must be an Array");if(e.length<2)throw new Error("coordinates must be at least 2 numbers long");if(!i(e[0])||!i(e[1]))throw new Error("coordinates must contain numbers");return t({type:"Point",coordinates:e},r,n)}function i(e){return!isNaN(e)&&null!==e&&!Array.isArray(e)}function a(e,r,n){if(null!==e)for(var t,o,i,l,s,f,u,d,c=0,g=0,y=e.type,b="FeatureCollection"===y,w="Feature"===y,h=b?e.features.length:1,p=0;p<h;p++){s=(d=!!(u=b?e.features[p].geometry:w?e.geometry:e)&&"GeometryCollection"===u.type)?u.geometries.length:1;for(var m=0;m<s;m++){var k=0,v=0;if(null!==(l=d?u.geometries[m]:u)){f=l.coordinates;var _=l.type;switch(c=!n||"Polygon"!==_&&"MultiPolygon"!==_?0:1,_){case null:break;case"Point":if(!1===r(f,g,p,k,v))return!1;g++,k++;break;case"LineString":case"MultiPoint":for(t=0;t<f.length;t++){if(!1===r(f[t],g,p,k,v))return!1;g++,"MultiPoint"===_&&k++}"LineString"===_&&k++;break;case"Polygon":case"MultiLineString":for(t=0;t<f.length;t++){for(o=0;o<f[t].length-c;o++){if(!1===r(f[t][o],g,p,k,v))return!1;g++}"MultiLineString"===_&&k++,"Polygon"===_&&v++}"Polygon"===_&&k++;break;case"MultiPolygon":for(t=0;t<f.length;t++){for(v=0,o=0;o<f[t].length;o++){for(i=0;i<f[t][o].length-c;i++){if(!1===r(f[t][o][i],g,p,k,v))return!1;g++}v++}k++}break;case"GeometryCollection":for(t=0;t<l.geometries.length;t++)if(!1===a(l.geometries[t],r,n))return!1;break;default:throw new Error("Unknown Geometry Type")}}}}}const l=function(e,r){void 0===r&&(r={});var n=0,t=0,i=0;return a(e,(function(e){n+=e[0],t+=e[1],i++}),!0),o([n/i,t/i],r.properties)}}}]);
//# sourceMappingURL=vendors.turf.js.map