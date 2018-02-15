export  { TileMap };

import * as Engine from "./../Engine/Engine";
import * as Math from "./../Mathematics/Mathematics";

import { Log } from "./Log";
import { Image } from "./../Data/Image";

class TileMap
{
    private _ImagePath:string;
    private _Image:Image;
    private _Tiles:Engine.Tile[];
    private _Images:Image[];
    public get Tiles():Engine.Tile[] { return this._Tiles; }
    public set Tiles(value:Engine.Tile[]) { this._Tiles = value; }
    public constructor()
    {
        this._Tiles = [];
    }
    public GenerateTile(ImagePath:string) : Engine.Tile
    {
        let Paths:string[] = [];
        this._ImagePath = ImagePath;
        for (let i = 0; i < this._Tiles.length; i++)
        {
            Paths.push(this._Tiles[i].Collection.Images[this._Tiles[i].Index]);
        }
        return this.LoadImages(Paths, 0).bind(this)
        .then(this.ScaleImages.bind(this))
        .then(this.CreateImage.bind(this))
        .then(this.DrawImages.bind(this))
        .then(this.SaveImage.bind(this))
        .then(function()
        {
            let Collection = new Engine.ImageCollection(null, [this._ImagePath]);
            let NewTile:Engine.Tile = new Engine.Tile();
            NewTile.Collection = Collection;
            NewTile.Index = 0;
            NewTile.Trans.Scale = new Math.Vertex(this._Image.Width, this._Image.Height, 1);
            return NewTile;
        }
        .bind(this));
    }
    private LoadImages(Paths:string[], Index:number) : any
    {
        let NewImage = new Image();
        return NewImage.Load(Paths[Index])
        .then( function()
        {
            this._Images.push(NewImage);
            Index++;
            if (Index < Paths.length)
            {
                return this.LoadImages(Paths, Index);
            }
        }
        .bind(this))
        .catch( function(Error)
        {
            Log.Error(Error);
        });
    }
    private ScaleImages() : void
    {
        for(let i = 0; i < this._Images.length; i++)
        {
            this._Images[i].Resize(this._Tiles[i].Trans.Scale.X, this._Tiles[i].Trans.Scale.Y);
        }
    }
    private CreateImage() : void
    {
        this._Image = this._Images[0].Copy();
        this._Image.Resize(1,1);
        this._Image.SetPixel(Math.Color.Empty, 0, 0);
        let MaxSize:Math.Vertex = new Math.Vertex(0,0);
        for(let i = 0; i < this._Tiles.length; i++)
        {
            if(this._Tiles[i].Trans.Translation.X + this._Tiles[i].Trans.Scale.X > MaxSize.X) MaxSize.X = this._Tiles[i].Trans.Translation.X + this._Tiles[i].Trans.Scale.X;
            if(this._Tiles[i].Trans.Translation.Y + this._Tiles[i].Trans.Scale.Y > MaxSize.Y) MaxSize.Y = this._Tiles[i].Trans.Translation.Y + this._Tiles[i].Trans.Scale.Y;
        }
        this._Image.Resize(MaxSize.X, MaxSize.Y);
    }
    private DrawImages() : void
    {
        for(let i = 0; i < this._Images.length; i++)
        {
            this._Image.DrawImage(this._Images[i], this._Tiles[i].Trans.Translation.X, this._Tiles[i].Trans.Translation.Y);
        }
    }
    private SaveImage() : any
    {
        return this._Image.Save(this._ImagePath);
    }
}