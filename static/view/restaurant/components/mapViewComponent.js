var mapViewComponent = {
    data() {
        return {
            
        }
    },
    props:[
        'restaurant'
    ],
    mounted() {
        const data = {
            "type": "Feature",
            "properties": {
                "fill":"#000000",
                "stroke-width":"3",
                "fill-opacity":0.6,
                "title": "Restoran"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [this.restaurant.location.longitude, this.restaurant.location.latitude]
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
                zoom: 13,
                center: ol.proj.fromLonLat([this.restaurant.location.longitude, this.restaurant.location.latitude]),
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