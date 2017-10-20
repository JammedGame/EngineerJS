export  { Image };

import * as Jimp from 'jimp';
import { Log } from "./../Util/Log";
import { Color } from "./../Mathematics/Color";

class Image
{
    private _Data:any;
    public get Width():number
    {
        if(this._Data != null) return this._Data.bitmap.width;
        else return -1;
    }
    public get Height():number
    {
        if(this._Data != null) return this._Data.bitmap.height;
        else return -1;
    }
    public get RawData():any
    {
        if(this._Data != null) return this._Data.bitmap.data;
        else return -1;
    }
    public get Jimp():any { return this._Data; }
    public constructor(Old?:Image)
    {
        if(Old != null)
        {
            this._Data = Old._Data.clone();
        }
        else {}
    }
    public Copy() : Image
    {
        return new Image(this);
    }
    public Load(Path:string) : any
    {
        return new Promise((Resolve, Reject) =>
        {
            Jimp.read(Path)
            .then(function (Data)
            {
                this._Data = Data;
                Resolve();
            })
            .catch(function (Error)
            {
                Log.Error(Error);
                Reject(Error);
            });
        });
    }
    public Save(Path:string) : any
    {
        return new Promise((Resolve, Reject) =>
        {
            this._Data.write(Path)
            .then(function ()
            {
                Resolve();
            })
            .catch(function (Error)
            {
                Log.Error(Error);
                Reject(Error);
            });
        });
    }
    public FlipHorizontal() : void
    {
        this._Data.flip(true, false);
    }
    public FlipVertical() : void
    {
        this._Data.flip(false, true);
    }
    public DrawImage(Image:Image, X:number, Y:number) : void
    {
        this._Data.composite(Image.Jimp, X, Y);
    }
    public Resize(X:number, Y:number) : void
    {
        this._Data.resize(X,Y);
    }
    public GetPixel(X:number, Y:number) : any
    {
        return this._Data.getPixelColor(X,Y);
    }
    public SetPixel(Color:Color, X:number, Y:number) : void
    {
        return this._Data.setPixelColor(Jimp.rgbaToInt(Color.R, Color.G, Color.B, Color.A),X,Y);
    }
}