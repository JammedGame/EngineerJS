export  { Tile, TileCollection };

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

import { DrawObject, DrawObjectType } from "./DrawObject";

class Tile extends DrawObject
{
    private _Modified:boolean;
    private _Index:number;
    private _Collection:TileCollection;
    private _Paint:Math.Color;
    private _SubTiles:Tile[];
    public get Modified():boolean { return this._Modified; }
    public set Modified(value:boolean) { this._Modified = value; }
    public get Index():number { return this._Index; }
    public set Index(value:number)
    {
        this._Modified = true;
        if(this._Collection.Images.length > value) this._Index = value;
        else this._Index = 0;
    }
    public get Paint():Math.Color { return this._Paint; }
    public set Paint(value:Math.Color) { this._Paint = value; }
    public get Collection():TileCollection { return this._Collection; }
    public set Collection(value:TileCollection) { this._Collection = value; }
    public get SubTiles():Tile[] { return this._SubTiles; }
    public set SubTiles(value:Tile[]) { this._SubTiles = value; }
    public constructor(Old?:Tile)
    {
        super(Old);
        this.DrawType = DrawObjectType.Tile;
        if(Old != null)
        {
            this._Modified = false;
            this._Index = Old._Index;
            this._Collection = Old._Collection;
            this._Paint = Old._Paint;
        }
        else
        {
            this._Modified = false;
            this._Index = -1;
            this._Collection = new TileCollection();
            this._Paint = Math.Color.FromRGBA(255, 255, 255, 255);
        }
    }
    public Copy() : Tile
    {
        return new Tile(this);
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
}