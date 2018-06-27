import { StyleDecorator } from './../services/style-decorator';
import { Actions, UpdateFeatureAction, AddFeatureAction, ChangeMapModeAction, ChangeFeatureTypeModeAction, OpenAddDialogFeatureAction, DrawFeatureAction } from './../common/actions';
import { ActionsBusService } from './../services/actions-bus.service';
import { FeatureService } from '../services/feature.service';
import * as ol from 'openlayers';
import { Injectable, EventEmitter } from '@angular/core';
import { interval } from 'rxjs';


export interface Map<T> {
    [key: string]: T;
}
export type FeatureTypes = 'Point' | 'Polygon';

export interface DrawFeatureMode {
    type: FeatureTypes;
    feature: any;
}

module app {
    export var CustomInteraction = function (opt_options) { }
}
interface PointerOptions {
    handleDownEvent?: ((event: ol.MapBrowserPointerEvent) => boolean);
    handleDragEvent?: ((event: ol.MapBrowserPointerEvent) => boolean);
    handleEvent?: ((event: ol.MapBrowserPointerEvent) => boolean);
    handleMoveEvent?: ((event: ol.MapBrowserPointerEvent) => boolean);
    handleUpEvent?: ((event: ol.MapBrowserPointerEvent) => boolean);
}

export class DragEvantHandler {

    handleDownEvent = function (evt) {
        var map = evt.map;
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function (feature) {
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
    handleDragEvent = function (evt) {
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
    handleMoveEvent = function (evt) {
        if (this.cursor_) {
            var map = evt.map;
            var feature = map.forEachFeatureAtPixel(evt.pixel,
                function (feature) {
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
    handleUpEvent = function () {
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
    public selectDoubleClick: ol.interaction.Select;
    public customDragEvantHandlerInteraction: ol.interaction.Pointer;
    public draw: ol.interaction.Draw;
    public map: any;
    public nextMap: EventEmitter<any> = new EventEmitter<any>(true);

    private _featureType: string;
    vectorLayer: any;
    public get featureType(): string {
        return this._featureType;
    }
    public set featureType(featureType: string) {
        if (this._featureType != featureType) {
            this._featureType = featureType;
            if (this.map != null) {
                this.map.removeInteraction(this.draw);
                this.addDrawInteraction();
                this.setMode(this._selectedMode);
            }
        }
    }

    private _vectorSource: any;
    private get vectorSource(): any {
        return this._vectorSource;
    }
    private set vectorSource(vectorSource: any) {
        this._vectorSource = vectorSource;
    }

    public setVectorSource(vectorSource: any) {
        this.vectorSource = vectorSource;
    }

    public get selectedFeature(): any {
        return this.select.getFeatures()
    }

    setVectorLayer(vectorLayer: any): any {
        this.vectorLayer = vectorLayer;
    }
    public lastFeatureIndex: number;

    constructor(private featureService: FeatureService,
        public actionsBusService: ActionsBusService, public styleDecorator: StyleDecorator) {
        this.actionsBusService.of(ChangeFeatureTypeModeAction).subscribe(action => {
            this.featureType = action.payload;
        });
        this.actionsBusService.of(ChangeMapModeAction).subscribe(action => {
            this.setMode(action.payload)
        });
        const source = interval(100);
        source.subscribe(val => {
            if (this._vectorSource != null) {
                var features = this._vectorSource.getFeatures();
                if(features.length > 0) {
                    let featuresOfPoints = features.filter(item => item.getGeometry().getType() == "Point")
                    let random = Math.floor(Math.random() * featuresOfPoints.length);
                    let f = featuresOfPoints[random];
                    if(f != null && f.setStyle != null) {
                        //
                        f.setStyle(this.styleDecorator.getFeatureStyle(f, { color : 'red'}))
                        if (this.lastFeatureIndex) {
                            let p = featuresOfPoints[this.lastFeatureIndex];
                            p.setStyle(this.styleDecorator.getFeatureStyle(p))
        
                        }
                        this.lastFeatureIndex = random;
                    }
                }
            }
        })
    }

    public setMap(map: any) {
        this.map = map;
    }

    private _selectedMode: string;
    public setMode(selectedMode: string) {
        if (selectedMode === 'DRAW') {
            this.addDrawInteraction();
        } else {
            this.addModifyInteraction();
            this.addSelectEventHandler();
        }
        this.addSelectDoubleClick();
        this._selectedMode = selectedMode;
    }

    public addModifyInteraction() {
        this.map.removeInteraction(this.draw);
        this.select = new ol.interaction.Select();
        this.customDragEvantHandlerInteraction = new CustomInteraction();
        this.map.addInteraction(this.select);
        this.map.addInteraction(this.customDragEvantHandlerInteraction);
        this.modify = new ol.interaction.Modify({
            features: this.selectedFeature,
            deleteCondition: function (event) {
                return ol.events.condition.shiftKeyOnly(event) &&
                    ol.events.condition.singleClick(event);
            }
        });
        this.map.addInteraction(this.modify);
    }

    public addSelectDoubleClick() {
        this.selectDoubleClick = new ol.interaction.Select({
            condition: ol.events.condition.doubleClick
        });
        this.selectDoubleClick.on('select', (env) => {
            if (env.selected.length !== 0) {
                let feature = env.selected[0]
                let featureType = feature.getGeometry().getType();
                if (featureType == "Polygon") {
                    this.nextMap.emit(feature);
                    this._vectorSource.clear()
                    this.select.getFeatures().clear();
                }
            }
        })
        this.map.addInteraction(this.selectDoubleClick);
    }

    public addDrawInteraction() {
        this.map.removeInteraction(this.customDragEvantHandlerInteraction);
        this.map.removeInteraction(this.select);
        this.map.removeInteraction(this.modify);
        this.draw = new ol.interaction.Draw({
            source: this.vectorSource,
            type: this.featureType
        });
        this.map.addInteraction(this.draw);
        this.draw.on('drawend', (evt) => {
            this.actionsBusService.publish(new DrawFeatureAction({ type: this.featureType, feature: evt.feature }));
        })
    }

    public addSelectEventHandler() {
        this.select.on('select', (evt) => {
            //this.featureService.selectedFeature$.next(this.select.getFeatures())
        })
        this.selectedFeature.on('add', (evt) => {
            var feature = evt.element;
            feature.on('change', (evt) => {
                this.dirty[evt.target.getId()] = true;
            });
        });
        this.selectedFeature.on('remove', (evt) => {
            var feature = evt.element;
            var fid = feature.getId();
            if (this.dirty[fid] === true) {
                //this.actionsBusService.publish(new UpdateFeatureAction(feature));
                //this.featureService.updateFeatures(feature);
            }
        })
    }
}
