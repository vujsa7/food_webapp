/*const data = {
    type: "Feature",
    properties: {
        name: "Coors Field",
        amenity: "Baseball Stadium",
        popupContent: "This is where the Rockies play!"
    },
    geometry: {
        type: "Point",
        coordinates: [19.851034904208003, 45.25167402417134]
    }
  };*/

var mapViewComponent = {
    data() {
        return {
        /*    mapData: {
                type: "Feature",
                properties: {
                    name: "Coors Field",
                    amenity: "Baseball Stadium",
                    popupContent: "This is where the Rockies play!"
                },
                geometry: {
                    type: "Point",
                    coordinates: [19.851034904208003, 45.25167402417134]
                }
            }*/
        }
    },
    props:[
        'restaurant'
    ],
    mounted() {
        const data = {
            type: "Feature",
            properties: {
                name: "Coors Field",
                amenity: "Baseball Stadium",
                popupContent: "This is where the Rockies play!"
            },
            geometry: {
                type: "Point",
                coordinates: [this.restaurant.location.longitude, this.restaurant.location.latitude]
            }
          }

        const feature = new ol.format.GeoJSON().readFeature(data, {
            // this is required since GeoJSON uses latitude/longitude,
            // but the map is rendered using “Web Mercator”
            featureProjection: 'EPSG:3857'
        });

        // a new vector layer is created with the feature
        const vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [feature],
            }),
        })
        // this is where we create the OpenLayers map
        new ol.Map({
            // the map will be created using the 'map-root' ref
            target: this.$refs.mapRoot,
            layers: [
                // adding a background tiled layer
                new ol.layer.Tile({
                    source: new ol.source.OSM() // tiles are served by OpenStreetMap
                }),
                vectorLayer
            ],

            // the map view will initially show the whole world
            view: new ol.View({
                zoom: 0,
                center: [0, 0],
                constrainResolution: true
            }),
        })
    },
    template:
        `
    <div ref="mapRoot"
       class="map">
    </div>
    `
}