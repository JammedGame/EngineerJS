export  { Tile, TileCollection };

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

import { ImageObject } from "./ImageObject";
import { DrawObject, DrawObjectType } from "./DrawObject";

class Tile extends ImageObject
{
    private _Index:number;
    private _Collection:TileCollection;
    private _NormalCollection:TileCollection;
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
    public get Collection():TileCollection { return this._Collection; }
    public set Collection(value:TileCollection) { this._Collection = value; }
    public get NormalCollection():TileCollection { return this._NormalCollection; }
    public set NormalCollection(value:TileCollection) { this._NormalCollection = value; }
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
            this._Collection = new TileCollection();
            this._NormalCollection = new TileCollection();
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
        this._Collection.Deserialize(Data.Collection);
        for(let i in Data.SubTiles)
        {
            let ST:Tile = new Tile();
            ST.Deserialize(Data.SubTiles[i]);
        }
    }
}
class TileCollection
{
    private _ID:string;
    private _Images:string[];
    public get ID():string { return this._ID; }
    public get Images():string[] { return this._Images; }
    public set Images(value:string[]) { this._Images = value; }
    public constructor(Old?:TileCollection, Images?:string[])
    {
        if(Old != null)
        {
            this._ID = Data.Uuid.Create();
            this._Images = Old._Images;
        }
        else
        {
            this._ID = Data.Uuid.Create();
            if(Images) this._Images = Images;
            else this._Images = [];
        }
    }
    public Copy() : TileCollection
    {
        return new TileCollection(this);
    }
    public Serialize() : any
    {
        let TC =
        {
            ID: this._ID,
            Images: this._Images
        };
        return TC;
    }
    public Deserialize(Data) : void
    {
        this._ID = Data.ID;
        this._Images = Data.Images;
    }
}