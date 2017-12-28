export { LitTile }

import { DrawObjectLightType } from "./DrawObject";
import { Tile, TileCollection } from "./Tile";

class LitTile extends Tile
{
    private _NormalCollection:TileCollection;
    public get NormalCollection():TileCollection { return this._NormalCollection; }
    public set NormalCollection(value:TileCollection) { this._NormalCollection = value; }
    public constructor(Old?:LitTile)
    {
        super(Old);
        this._LightType = DrawObjectLightType.Lit;
        if(Old != null)
        {
            this._NormalCollection = Old._NormalCollection;
        }
        else
        {
            this._NormalCollection = new TileCollection(null, []);
        }
    }
    public GetNormalTiles(Set:number) : string[]
    {
        if(!this._NormalCollection) return [];
        return this._NormalCollection.Images;
    }
}