export  { Image };

import { Log } from "./../Util/Log";
import { Color } from "./../Mathematics/Color";

class Image
{
    private _Data:any;
    public get Width():number
    {
        return -1;
    }
    public get Height():number
    {
        return -1;
    }
    public get RawData():any
    {
        return null;
    }
    public constructor(Old?:Image)
    {
        if(Old != null)
        {
            
        }
        else {}
    }
    public Copy() : Image
    {
        return new Image(this);
    }
    public Load(Path:string) : any
    {
        
    }
    public Save(Path:string) : any
    {
        
    }
    public FlipHorizontal() : void
    {
        
    }
    public FlipVertical() : void
    {
        
    }
    public DrawImage(Image:Image, X:number, Y:number) : void
    {
        
    }
    public Resize(X:number, Y:number) : void
    {
        
    }
    public GetPixel(X:number, Y:number) : any
    {
        
    }
    public SetPixel(Color:Color, X:number, Y:number) : void
    {
        
    }
}