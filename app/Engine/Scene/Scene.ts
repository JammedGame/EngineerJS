export  { SceneType, Scene };

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

import { SceneObject } from "./SceneObject";

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
    private _Objects:SceneObject[];
    public get ID():string { return this._ID; }
    public get Name():string { return this._Name; }
    public set Name(value:string) { this._Name = value; }
    public get Type():SceneType { return this._Type; }
    public set Type(value:SceneType) { this._Type = value; }
    public get BackColor():Math.Color { return this._BackColor; }
    public set BackColor(value:Math.Color) { this._BackColor = value; }
    public get Objects():SceneObject[] { return this._Objects; }
    public set Objects(value:SceneObject[]) { this._Objects = value; }
    public Data: { [key: string]:any; } = {};
    public constructor(Old?:Scene)
    {
        if(Old != null)
        {
            this._ID = Data.Uuid.Create();
            this._Name = Old._Name;
            this._BackColor = Old._BackColor;
            this._Objects = [];
            for(let i = 0; i < Old._Objects.length; i++) this._Objects.push(Old._Objects[i].Copy());
        }
        else
        {
            this._ID = Data.Uuid.Create();
            this._Name = this._ID;
            this._BackColor = Math.Color.FromRGBA(40,40,40,255);
            this._Objects = [];
        }
        
    }
    public Copy() : Scene
    {
        let New:Scene = new Scene(this);
        return New;
    }
    public AddSceneObject(Object:SceneObject) : void
    {
        this._Data[Object.ID] = Object;
        this._Objects.push(Object);
    }
}