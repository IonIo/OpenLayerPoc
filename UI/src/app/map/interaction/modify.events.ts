import { Select, Pointer, Modify, Draw }  from 'ol/interaction';
import { Injectable, EventEmitter } from '@angular/core';
import { CustomDragEventInteraction } from './custom/drag-event-handler';

export interface Map<T> {
    [key: string]: T;
}

export class ModifyManager {

    private dirty: Map<any> = {};
    public onSelectEvent: EventEmitter<any> = new EventEmitter<any>(true);
    public onSelectDoubleClickEvent: EventEmitter<any> = new EventEmitter<any>(true);
    public onAddSelectedEvent: EventEmitter<any> = new EventEmitter<any>(true);
    public onRemoveSelectedEvent: EventEmitter<any> = new EventEmitter<any>(true);

    private onSelect = ((evt) => {

        const feature = evt.element;
        this.onSelectEvent.emit(feature);
       
    });

    private onSelectDoubleClick = ((env) => {

        if (env.selected.length !== 0) {

            let feature = env.selected[0]
            let featureType = feature.getGeometry().getType();
            
            if (featureType == "Polygon") {
                this.selectedFeature().clear();
                this.onSelectDoubleClickEvent.emit(feature);
            }
        }
    });

    private onAdd = ((evt) => {
        
        const feature = evt.element;
        this.onAddSelectedEvent.emit(feature);
       
        feature.on('change', (evt) => {
            this.dirty[evt.target.getId()] = true;
        });

    });
    private onRemove = ((evt) => {
        
        const feature = evt.element;
        const fid = feature.getId();

        if (this.dirty[fid] === true) {
            this.onRemoveSelectedEvent.emit(feature);
        }
    });

    private readonly select = new LiteEvent<Pointer>(Pointer);
    private readonly selectDoubleClick = new LiteEvent<Select>(Select);
    private readonly drawAndDrop = new LiteEvent<CustomDragEventInteraction>(CustomDragEventInteraction);

    public get selectedFeature(): any {
        return this.select.interactionInstance.getFeatures();
    }

    constructor(private map: any) {
        this.registerEvents();
        this.register();
    }

    registerEvents() {
        this.select.on('select', this.onSelect);
        this.selectDoubleClick.on('select', this.onSelectDoubleClick);
        this.selectedFeature.on('add', this.onAdd);
        this.selectedFeature.on('remove', this.onRemove);        
    }

    register() {
        this.map.addInteraction(this.select);
        this.map.addInteraction(this.selectDoubleClick);
        this.map.addInteraction(this.drawAndDrop);
    }

    destruct() {
        this.map.removeInteraction(this.select);
        this.map.removeInteraction(this.selectDoubleClick);
        this.map.removeInteraction(this.drawAndDrop);
    }
}
