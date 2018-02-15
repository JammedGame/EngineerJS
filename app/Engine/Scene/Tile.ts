export  { Tile };

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

import { ImageObject } from "./ImageObject";
import { ImageCollection } from "./ImageCollection";
import { DrawObject, DrawObjectType } from "./DrawObject";

class Tile extends ImageObject
{
    private _Index:number;
    private _Collection:ImageCollection;
    private _NormalCollection:ImageCollection;
    private _SubTiles:Tile[];
    public get Index():number { /*Override*/ return this._Index; }
    public set Index(value:number)
    {
        if(this._Collection.Images.length > value) this._Index = value;
        else this._Index = 0;
        this.Modified = true;
    }
    public get Images() : string[] { /* Override */ return this._Collection.Images; }
    public get NormalMaps() : string[] { /* Override */ return this._NormalCollection.Images; }
    public get Collection():ImageCollection { return this._Collection; }
    public set Collection(value:ImageCollection) { this._Collection = value; }
    public get NormalCollection():ImageCollection { return this._NormalCollection; }
    public set NormalCollection(value:ImageCollection) { this._NormalCollection = value; }
    public get SubTiles():Tile[] { return this._SubTiles; }
    public set SubTiles(value:Tile[]) { this._SubTiles = value; }
    public constructor(Old?:Tile)
    {
        super(Old);
        this.DrawType = DrawObjectType.Tile;
        if(Old != null)
        {
            this._Index = Old._Index;
            this._Collection = Old._Collection;
            this._NormalCollection = Old._NormalCollection;
        }
        else
        {
            this._Index = -1;
            this._Collection = new ImageCollection();
            this._NormalCollection = new ImageCollection();
        }
    }
    public Copy() : Tile
    {
        return new Tile(this);
    }
    public Serialize() : any
    {
        // Override
        let T = super.Serialize();
        T.Index = this._Index;
        T.Collection = this._Collection.Serialize();
        T.SubTiles = [];
        for(let i in this._SubTiles)
        {
            T.SubTiles.push(this._SubTiles[i].Serialize());
        }
        return T;
    }
    public Deserialize(Data) : void
    {
        // Override
        super.Deserialize(Data);
        this._Index = Data.Index;
        this._Collection.Deserialize(Data.Collection);
        for(let i in Data.SubTiles)
        {
            let ST:Tile = new Tile();
            ST.Deserialize(Data.SubTiles[i]);
        }
    }
}