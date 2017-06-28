export  { SceneType, Scene };

import * as Mathematics from "./../Mathematics/Mathematics";

enum SceneType
{
    Scene2D,
    Scene3D
}
class Scene
{
    private _ID:string;
    protected _Name:string;
    protected _Type:SceneType;
    protected _BackColor:Mathematics.Color;
    public get Name():string { return this._Name; }
    public set Name(value) { this._Name = value; }
    public constructor()
    {
    }
    public Copy(S:Scene) : void
    {
        this._Name = S._Name;
    }
}