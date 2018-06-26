export interface Action {
    name: string;
    payload: any;
}

export class AddFeatureAction implements Action {
    name: string = 'AddFeatureAction';
    constructor(public payload: any){ }
}

export class UpdateFeatureAction implements Action {
    name: string = 'UpdateFeatureAction';
    constructor(public payload: any){ }
}

export class RemoveFeatureAction  implements Action {
    name: string = 'RemoveFeatureAction';
    constructor(public payload: any){ }
}

export class ChangeMapModeAction implements Action  {
    name: string = 'ChangeMapModeAction';
    constructor(public payload: any){ }
}

export class ChangeFeatureTypeModeAction implements Action  {
    name: string = 'ChangeFeatureTypeModeAction';
    constructor(public payload: any){ }
}

export class ReinitializationOfMapAction implements Action  {
    name: string = 'ReinitializationOfMapAction';
    constructor(public payload: any){ }
}

export class DrawFeatureAction implements Action  {
    name: string = 'DrawFeatureAction';
    constructor(public payload: any){ }
}

export class ModifyFeatureAction implements Action  {
    name: string = 'ModifyFeatureAction';
    constructor(public payload: any){ }
}

export class OpenAddDialogFeatureAction implements Action  {
    name: string = 'OpenAddDialogFeatureAction';
    constructor(public payload: any){ }
}

export type Actions = AddFeatureAction | UpdateFeatureAction | RemoveFeatureAction | ChangeMapModeAction;
