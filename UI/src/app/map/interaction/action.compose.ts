import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { DrawManager } from './draw.events';
import { StyleDecorator } from './../services/style-decorator';
import { Actions, UpdateFeatureAction, AddFeatureAction, ChangeMapModeAction, ChangeFeatureTypeModeAction, OpenAddDialogFeatureAction, DrawFeatureAction, RemoveFeatureAction, ModifyFeatureAction } from './../common/actions';
import { ActionsBusService } from './../services/actions-bus.service';
import { FeatureService } from '../services/feature.service';
import * as ol from 'openlayers';
import { Injectable, EventEmitter } from '@angular/core';
import { interval } from 'rxjs';
import { ModifyManager } from './modify.events';
import { CustomInteraction } from './custom/drag-event-handler';


export interface Map<T> {
    [key: string]: T;
}
export type FeatureTypes = 'Point' | 'Polygon';

export interface DrawFeatureMode {
    type: FeatureTypes;
    feature: any;
}


@Injectable({
    providedIn: 'root'
})
export class ActionCompose {
    public hubUrl = 'http://localhost:4251/alarm';
    public hubConnection = new HubConnectionBuilder()
        .withUrl(this.hubUrl)
        .configureLogging(LogLevel.Information)
        .build();



    public dirty: Map<any> = {};
    public modify: ol.interaction.Modify;
    public select: ol.interaction.Select;
    public selectDoubleClick: ol.interaction.Select;
    public customDragEvantHandlerInteraction: ol.interaction.Pointer;
    public draw: ol.interaction.Draw;
    public map: any;
    public nextMap: EventEmitter<any> = new EventEmitter<any>(true);

    // public modifyManager: ModifyManager;
    // public drawManager: DrawManager;

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

        this.hubConnection.on("Send", (data) => {
            debugger;
            const source = interval(350);
            let selectedFeaturesIds = JSON.parse(data);

            if (this._vectorSource != null) {
                var features = this._vectorSource.getFeatures();
                if (features.length > 0) {
                    var featuresOfPoints: [any] = features.filter(item => item.getGeometry().getType() == "Point" 
                    && selectedFeaturesIds.includes(item.getId()))
                };
                source.subscribe(val => {
                 featuresOfPoints.forEach(feature => {
                    if (feature != null && feature.setStyle != null) {
                        feature.setStyle(this.styleDecorator.getFeatureStyle(feature, { color: 'red' }))
                        setTimeout((feature) => {
                            feature.setStyle(this.styleDecorator.getFeatureStyle(feature))
                        }, 1000, feature);
                     }
                    })
                  })
            }
        });
                
           
        this.hubConnection.start();
    }

    public setMap(map: any, reinit?: boolean) {
        this.map = map;
        if (reinit) {
            this.setMode(this._selectedMode);
        }
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
            condition: evt => {
                // https://github.com/openlayers/openlayers/issues/6188
                if (!ol.events.condition.shiftKeyOnly(evt))
                    return true;
                let feature = this.vectorSource.getClosestFeatureToCoordinate(evt.coordinate);

                if (!feature)
                    return false;

                this.vectorSource.removeFeature(feature);
                this.actionsBusService.publish(new RemoveFeatureAction(feature));

                this.select.getFeatures().clear();

                return false;
            },
            deleteCondition: function (event) {
                return ol.events.condition.shiftKeyOnly(event) &&
                    ol.events.condition.singleClick(event);
            }
        });
        this.map.addInteraction(this.modify);
    }

    public addSelectDoubleClick() {
        //this.modifyManager.onSelectDoubleClickEvent
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
        // this.modifyManager.onSelectDoubleClickEvent.subscribe(feature => {
        //     //Add point feature
        //     if (this.featureType == "Point") {
        //         this.actionsBusService.publish(new DrawFeatureAction({ type: this.featureType, feature: feature }));
        //     } else {
        //         //Add polygon feature
        //         this.actionsBusService.publish(new AddFeatureAction(feature));
        //     }
        // })
        this.map.removeInteraction(this.customDragEvantHandlerInteraction);
        this.map.removeInteraction(this.select);
        this.map.removeInteraction(this.modify);
        this.map.removeInteraction(this.draw);
        this.draw = new ol.interaction.Draw({
            source: this.vectorSource,
            type: this.featureType
        });
        this.map.addInteraction(this.draw);
        this.draw.on('drawend', (evt) => {
            //Add point feature
            if (this.featureType == "Point") {
                this.actionsBusService.publish(new DrawFeatureAction({ type: this.featureType, feature: evt.feature }));
            } else {
                //Add polygon feature
                this.actionsBusService.publish(new AddFeatureAction(evt.feature));
            }
        })
    }

    public disposeInteractions() {
        this.map.removeInteraction(this.customDragEvantHandlerInteraction);
        this.map.removeInteraction(this.select);
        this.map.removeInteraction(this.modify);
        this.map.removeInteraction(this.selectDoubleClick);
        this.map.removeInteraction(this.draw);
        this.map = null;
    }

    public addSelectEventHandler() {
        this.select.on('select', (evt) => { });
        this.selectedFeature.on('add', (evt) => {

            const feature = evt.element;
            this.actionsBusService.publish(new ModifyFeatureAction({ type: feature.getGeometry().getType(), feature: evt.element }));

            feature.on('change', (evt) => {
                this.dirty[evt.target.getId()] = true;
            });
        });
        this.selectedFeature.on('remove', (evt) => {
            var feature = evt.element;
            var fid = feature.getId();
            if (this.dirty[fid] === true) {
                this.actionsBusService.publish(new UpdateFeatureAction(feature));
            }
        })
    }
}
