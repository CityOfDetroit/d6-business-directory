!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},r=(new Error).stack;r&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[r]="5aa8e105-cc52-47fc-bc08-d8ddbb085d76",e._sentryDebugIdIdentifier="sentry-dbid-5aa8e105-cc52-47fc-bc08-d8ddbb085d76")}catch(e){}}();var _global="undefined"!==typeof window?window:"undefined"!==typeof global?global:"undefined"!==typeof self?self:{};_global.SENTRY_RELEASE={id:"0165bd63c3d6805025e30c61956b57abf278c423"},(self.webpackChunkd6_business_directory=self.webpackChunkd6_business_directory||[]).push([[200],{827:function(e,r,t){!function(r,n){if("object"===typeof e.exports&&(e.exports=n(t(508))),"object"===typeof r.navigator){if(!r.Terraformer)throw new Error("Terraformer.ArcGIS requires the core Terraformer library. https://github.com/esri/Terraformer");r.Terraformer.ArcGIS=n(r.Terraformer)}}(this,(function(e){var r={};function t(e){var r,t,n,o,i=0,s=0,a=[];n=e.match(/((\+|\-)[^\+\-]+)/g),o=parseInt(n[0],32);for(var c=1;c<n.length;c+=2)i=r=parseInt(n[c],32)+i,s=t=parseInt(n[c+1],32)+s,a.push([r/o,t/o]);return a}function n(e){return function(e,r){for(var t=0;t<e.length;t++)if(e[t]!==r[t])return!1;return!0}(e[0],e[e.length-1])||e.push(e[0]),e}function o(e){var r={};for(var t in e)e.hasOwnProperty(t)&&(r[t]=e[t]);return r}function i(e){for(var r,t=0,n=0,o=e.length,i=e[n];n<o-1;n++)t+=((r=e[n+1])[0]-i[0])*(r[1]+i[1]),i=r;return t>=0}function s(e){var r=[],t=e.slice(0),o=n(t.shift().slice(0));if(o.length>=4){i(o)||o.reverse(),r.push(o);for(var s=0;s<t.length;s++){var a=n(t[s].slice(0));a.length>=4&&(i(a)&&a.reverse(),r.push(a))}}return r}function a(r,t){var n=e.Tools.arraysIntersectArrays(r,t),o=e.Tools.coordinatesContainPoint(r,t[0]);return!(n||!o)}function c(r,s){var u={};return(s=s||{}).idAttribute=s.idAttribute||void 0,!r.spatialReference||3857!==r.spatialReference.wkid&&102100!==r.spatialReference.wkid||(u.crs=e.MercatorCRS),"number"===typeof r.x&&"number"===typeof r.y&&(u.type="Point",u.coordinates=[r.x,r.y],(r.z||r.m)&&u.coordinates.push(r.z),r.m&&u.coordinates.push(r.m)),r.points&&(u.type="MultiPoint",u.coordinates=r.points.slice(0)),r.paths&&(1===r.paths.length?(u.type="LineString",u.coordinates=r.paths[0].slice(0)):(u.type="MultiLineString",u.coordinates=r.paths.slice(0))),r.rings&&(u=function(r){for(var t,o,s,c=[],u=[],f=0;f<r.length;f++){var l=n(r[f].slice(0));if(!(l.length<4))if(i(l)){var p=[l.slice().reverse()];c.push(p)}else u.push(l.slice().reverse())}for(var d=[];u.length;){s=u.pop();var y=!1;for(t=c.length-1;t>=0;t--)if(a(o=c[t][0],s)){c[t].push(s),y=!0;break}y||d.push(s)}for(;d.length;){s=d.pop();var b=!1;for(t=c.length-1;t>=0;t--)if(o=c[t][0],e.Tools.arraysIntersectArrays(o,s)){c[t].push(s),b=!0;break}b||c.push([s.reverse()])}return 1===c.length?{type:"Polygon",coordinates:c[0]}:{type:"MultiPolygon",coordinates:c}}(r.rings.slice(0))),"number"===typeof r.xmin&&"number"===typeof r.ymin&&"number"===typeof r.xmax&&"number"===typeof r.ymax&&(u.type="Polygon",u.coordinates=[[[r.xmax,r.ymax],[r.xmin,r.ymax],[r.xmin,r.ymin],[r.xmax,r.ymin],[r.xmax,r.ymax]]]),(r.compressedGeometry||r.geometry||r.attributes)&&(u.type="Feature",r.compressedGeometry&&(r.geometry={paths:[t(r.compressedGeometry)]}),u.geometry=r.geometry?c(r.geometry):null,u.properties=r.attributes?o(r.attributes):null,r.attributes&&(u.id=r.attributes[s.idAttribute]||r.attributes.OBJECTID||r.attributes.FID)),new e.Primitive(u)}function u(e,r){var t,n=(r=r||{}).idAttribute||"OBJECTID";t=r.sr?{wkid:r.sr}:e&&e.crs&&"urn:ogc:def:crs:OGC:1.3:CRS84"!=e.crs.properties.name?null:{wkid:4326};var i,a={};switch(e.type){case"Point":a.x=e.coordinates[0],a.y=e.coordinates[1],e.coordinates[2]&&(a.z=e.coordinates[2]),e.coordinates[3]&&(a.m=e.coordinates[3]),a.spatialReference=t;break;case"MultiPoint":a.points=e.coordinates.slice(0),a.spatialReference=t;break;case"LineString":a.paths=[e.coordinates.slice(0)],a.spatialReference=t;break;case"MultiLineString":a.paths=e.coordinates.slice(0),a.spatialReference=t;break;case"Polygon":a.rings=s(e.coordinates.slice(0)),a.spatialReference=t;break;case"MultiPolygon":a.rings=function(e){for(var r=[],t=0;t<e.length;t++)for(var n=s(e[t]),o=n.length-1;o>=0;o--){var i=n[o].slice(0);r.push(i)}return r}(e.coordinates.slice(0)),a.spatialReference=t;break;case"Feature":e.geometry&&(a.geometry=u(e.geometry,r)),a.attributes=e.properties?o(e.properties):{},e.id&&(a.attributes[n]=e.id);break;case"FeatureCollection":for(a=[],i=0;i<e.features.length;i++)a.push(u(e.features[i],r));break;case"GeometryCollection":for(a=[],i=0;i<e.geometries.length;i++)a.push(u(e.geometries[i],r))}return a}return r.parse=c,r.convert=u,r.toGeoJSON=c,r.fromGeoJSON=u,r.parseCompressedGeometry=function(r){return new e.LineString(t(r))},r}))}}]);
//# sourceMappingURL=vendors.terraformer-arcgis-parser.js.map