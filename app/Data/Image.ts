export  { Image };

import * as Jimp from 'jimp';
import { Log } from "./../Util/Log";

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
    public Load(Path:string) : void
    {
        Jimp.read(Path)
        .then(function (Data)
        {
            this._Data = Data;
        })
        .catch(function (Error)
        {
            Log.Error(Error);
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
}