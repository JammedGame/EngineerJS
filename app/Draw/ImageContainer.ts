export  { ImageContainer };

import * as Math from "./../Mathematics/Mathematics"

class ImageContainer
{
    private _Data:HTMLImageElement;
    private _Canvas:HTMLCanvasElement;
    private _Context:any;
    public get Url():string { return this._Data.src; }
    public get Data():HTMLImageElement { return this._Data; }
    public get Drawn():string { return this._Canvas.toDataURL(); }
    public constructor(Old?:ImageContainer)
    {
        this._Data = null;
    }
    public Load(Path:string, Callback?:Function) : void
    {
        this._Data = new Image();
        this._Data.src = Path;
        this._Data.onload = Callback(this._Data);
    }
    public Create(Size:Math.Vertex) : void
    {
        this._Data = new Image();
        this._Data.width = Size.X;
        this._Data.height = Size.Y;
    }
    public DrawImage(Image:HTMLImageElement, Position:Math.Vertex, Size:Math.Vertex)
    {
        if(this._Canvas == null)
        {
            this._Canvas = document.createElement("canvas");
            this._Canvas.width = this._Data.width;
            this._Canvas.height = this._Data.height;
            this._Context = this._Canvas.getContext("2d");
        }
        this._Context.drawImage(Image, Position.X, Position.Y, Size.X, Size.Y);
    }
}