export interface FormModel {

}
export abstract class BaseEditorForm<T extends FormModel> {
    public model: T;
    public overlay: any;
    public featureItem: any;
    abstract  onSave(item: T) : void ;
    abstract  onDismiss(item: T): void ;
        
    public feature(feature: any) {
        if (feature != null) {
            var coordinates = feature.getGeometry().getCoordinates();
            this.overlay.setPosition(coordinates);
            this.featureItem = feature;
        }
    }
     save() {
        if(this.onSave) {
            this.onSave(this.model);
        }
        this.overlay.setPosition(undefined);
    }
     dismiss() {
        if(this.onSave) {
            this.onDismiss(this.model);
        }
        this.overlay.setPosition(undefined);
    }
}
