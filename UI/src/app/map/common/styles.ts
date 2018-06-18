import * as ol from 'openlayers';

export class Styles {

    public static style = new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255,0,0,0.1)'
        }),
        stroke: new ol.style.Stroke({
          color: '#319FD3',
          width: 1
        }),
        text: new ol.style.Text({
          font: '12px Calibri,sans-serif',
          fill: new ol.style.Fill({
            color: '#000'
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 3
          })
        })
      });

      

    public static styles = [
        /* We are using two different styles for the polygons:
         *  - The first style is for the polygons themselves.
         *  - The second style is to draw the vertices of the polygons.
         *    In a custom `geometry` function the vertices of a polygon are
         *    returned as `MultiPoint` geometry, which will be used to render
         *    the style.
         */
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'blue',
            width: 3
          }),
          fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
          })
        }),
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({
              color: 'orange'
            })
          }),
          geometry: function(feature) {
            // return the coordinates of the first ring of the polygon
            var coordinates = feature.getGeometry().getCoordinates()[0];
            return new ol.geom.MultiPoint(coordinates);
          }
        })
      ];
    
}
