export  { SceneType, Scene };

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

enum SceneType
{
    Scene2D,
    Scene3D
}
class Scene
{
    private _ID:string;
    private _Name:string;
    private _Type:SceneType;
    private _BackColor:Math.Color;
    public get ID():string { return this._ID; }
    public get Name():string { return this._Name; }
    public set Name(value:string) { this._Name = value; }
    public get Type():SceneType { return this._Type; }
    public set Type(value:SceneType) { this._Type = value; }
    public get BackColor():Math.Color { return this._BackColor; }
    public set BackColor(value:Math.Color) { this._BackColor = value; }
    public constructor(Old?:Scene)
    {
        if(Old != null)
        {
            this._ID = Data.Uuid.Create();
            this._Name = Old._Name;
            this._BackColor = Old._BackColor;
        }
        else
        {
            this._ID = Data.Uuid.Create();
            this._Name = this._ID;
            this._BackColor = Math.Color.FromRGBA(40,40,40,255);
        }
        
    }
    public Copy() : Scene
    {
        let New:Scene = new Scene(this);
        return New;
    }
}