export interface FormModel {

}
export abstract class BaseEditorForm<T extends FormModel> {
    /**
     *
     */
    protected constructor() {}
    public model: T;
    public feature(feature: any) {
        if (feature != null) {
            var coordinates = feature.getGeometry().getCoordinates();
            this.overlay.setPosition(coordinates);
        }
    }
    public overlay: any;
    save() {
        this.overlay.setPosition(undefined);
    }
    dismiss() {
        this.overlay.setPosition(undefined);
    }
}
