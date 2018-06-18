import {
    Map, MapBrowserEvent, MapEvent, render, ObjectEvent, control,
    interaction, View, extent, MapOptions
} from 'openlayers';
import {
    ol, olx
} from 'openlayers';

export interface IMapBuilder {
    controls?: (ol.Collection<ol.control.Control> | ol.control.Control[]);
    pixelRatio?: number;
    interactions?: (ol.Collection<ol.interaction.Interaction> | ol.interaction.Interaction[]);
    keyboardEventTarget?: (Element | Document | string);
    layers?: (ol.layer.Base[] | ol.Collection<ol.layer.Base>);
    loadTilesWhileAnimating?: boolean;
    loadTilesWhileInteracting?: boolean;
    logo?: (boolean | string | olx.LogoOptions | Element);
    overlays?: (ol.Collection<ol.Overlay> | ol.Overlay[]);
    renderer?: (ol.RendererType | (ol.RendererType | string)[] | string);
    target?: (Element | string);
    view?: ol.View;
    GetResult(): Map;
}

// this.map = new ol.Map({
//     interactions: ol.interaction.defaults().extend([this.draw, this.select, this.modify]),
//     layers: [
//         new ol.layer.Image({
//             source: new ol.source.ImageStatic({
//                 attributions: [
//                     new ol.Attribution({
//                         html: '&copy; <a href="http://xkcd.com/license.html">xkcd</a>'
//                     })
//                 ],
//                 url: 'http://imgs.xkcd.com/comics/online_communities.png',
//                 projection: this.projection,
//                 imageExtent: this.extent
//             })
//         }),
//         this.vectorLayer
//     ],
//     target: 'map',
//     view: new ol.View({
//         projection: this.projection,
//         center: ol.extent.getCenter(this.extent),
//         zoom: 2,
//         maxZoom: 8
//     })
// });


// export class ImageSourceMapBuilder implements IMapBuilder {
//     public imageUrl: string;
//     private _extent = [0, 0, 1024, 968];
//     private _projection = new ol.proj.Projection({
//         code: 'xkcd-image',
//         units: 'pixels',
//         extent: this._extent
//     });

//     public GetResult(): Map {
//         return new ol.Map({
//             layers: [
//                 new ol.layer.Image({
//                     source: new ol.source.ImageStatic({
//                         attributions: [
//                             new ol.Attribution({
//                                 html: '&copy; <a href="http://xkcd.com/license.html">xkcd</a>'
//                             })
//                         ],
//                         url: this.imageUrl,// 'http://imgs.xkcd.com/comics/online_communities.png',
//                         projection: this._projection,
//                         imageExtent: this._extent
//                     })
//                 }),
//             ],
//             target: 'map',
//             view: new ol.View({
//                 projection: this._projection,
//                 center: ol.extent.getCenter(this._extent),
//                 zoom: 2,
//                 maxZoom: 8
//             })
//         });
//     }
// }

// export class MapBuilder {

//     /**
//      *
//      */
//     constructor(private mapBuilder: IMapBuilder) {

//     }
//     public addInteraction(interaction: interaction.Interaction): Map {
//         let map = this.mapBuilder.GetResult();
//         return map.addInteraction;
//     }
// }
