import { FeatureService } from './../common/feature.service';
import * as ol from 'openlayers';
import { Injectable } from '@angular/core';
// declare var $;
interface Map<T> {
    [key: string]: T;
}

module app {
    export var CustomInteraction = function(opt_options) {


    }
    /// so on and so forth
 }
 interface PointerOptions {
    handleDownEvent?: ((event: ol.MapBrowserPointerEvent) => boolean);
    handleDragEvent?: ((event: ol.MapBrowserPointerEvent) => boolean);
    handleEvent?: ((event: ol.MapBrowserPointerEvent) => boolean);
    handleMoveEvent?: ((event: ol.MapBrowserPointerEvent) => boolean);
    handleUpEvent?: ((event: ol.MapBrowserPointerEvent) => boolean);
}

export class DragEvantHandler {
    
    handleDownEvent = function(evt) {
        var map = evt.map;
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature) {
              return feature;
            });
        if (feature) {
          this.coordinate_ = evt.coordinate;
          this.feature_ = feature;
        }
        return !!feature;
      };


      /**
       * @param {ol.MapBrowserEvent} evt Map browser event.
       */
      handleDragEvent = function(evt) {
        var deltaX = evt.coordinate[0] - this.coordinate_[0];
        var deltaY = evt.coordinate[1] - this.coordinate_[1];

        var geometry = this.feature_.getGeometry();
        geometry.translate(deltaX, deltaY);

        this.coordinate_[0] = evt.coordinate[0];
        this.coordinate_[1] = evt.coordinate[1];
      };


      /**
       * @param {ol.MapBrowserEvent} evt Event.
       */
      handleMoveEvent = function(evt) {
        if (this.cursor_) {
          var map = evt.map;
          var feature = map.forEachFeatureAtPixel(evt.pixel,
              function(feature) {
                return feature;
              });
          var element = evt.map.getTargetElement();
          if (feature) {
            if (element.style.cursor != this.cursor_) {
              this.previousCursor_ = element.style.cursor;
              element.style.cursor = this.cursor_;
            }
          } else if (this.previousCursor_ !== undefined) {
            element.style.cursor = this.previousCursor_;
            this.previousCursor_ = undefined;
          }
        }
      };
      handleUpEvent = function() {
        this.coordinate_ = null;
        this.feature_ = null;
        return false;
      };
}

export class CustomInteraction extends ol.interaction.Pointer {
    constructor() {
        super(new DragEvantHandler());
   }
}

@Injectable({
    providedIn: 'root'
})
export class ActionCompose {
    public dirty: Map<any> = {};
    public modify: ol.interaction.Modify;
    public select: ol.interaction.Select;
    public draw: ol.interaction.Draw;

    constructor(public vectorSource: ol.source.Vector,
        private featureService: FeatureService,
        private type: string = 'Polygon') {

        this.draw = new ol.interaction.Draw({
            source: this.vectorSource,
            type: this.type
        });
        this.select = new ol.interaction.Select();
        this.modify = new ol.interaction.Modify({
            features: this.selected
        });
        this.select.setActive(false);
        this.modify.setActive(false);
    }

    public get selected(): any {
        return this.select.getFeatures()
    }

    public set addInteractions(map: any) {
        map.addInteraction(new CustomInteraction());
        // map.addInteraction(this.draw);
        map.addInteraction(this.select);
        // map.addInteraction(this.modify);
    }

    public addEventHandler() {
        this.selected.on('add', (evt) => {
            var feature = evt.element;
            feature.on('change', (evt) => {
                this.dirty[evt.target.getId()] = true;
            });
        });
        this.selected.on('remove', (evt) => {
            var feature = evt.element;
            var fid = feature.getId();
            if (this.dirty[fid] === true) {
                this.featureService.updateFeatures(feature);
            }
        })
        this.draw.on('drawend', (evt) => {
            this.featureService.addFeatures(evt.feature);
        })
    }
}
