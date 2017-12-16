export  { SceneObjectType, SceneObject };

import * as Data from "./../../Data/Data";
import * as Mathematics from "./../../Mathematics/Mathematics";

import { EventPackage } from "./../Events/Events";

enum SceneObjectType
{
    Undefined,
    Drawn,
    Script,
    Sound,
    Other
}
class SceneObject
{
    private _ID:string;
    private _Name:string;
    private _Type:SceneObjectType;
    private _Events:EventPackage;
    public get ID():string { return this._ID; }
    public get Name():string { return this._Name; }
    public set Name(value:string) { this._Name = value; }
    public get Type():SceneObjectType { return this._Type; }
    public set Type(value:SceneObjectType) { this._Type = value; }
    public get Events():EventPackage { return this._Events; }
    public Data: { [key: string]:any; } = {};
    public constructor(Old?:SceneObject)
    {
        if(Old != null)
        {
            this._ID = Data.Uuid.Create();
            this._Name = Old._Name;
            this._Type = Old._Type
            this._Events = Old._Events.Copy();
        }
        else
        {
            this._ID = Data.Uuid.Create();
            this._Name = this._ID;
            this._Type = SceneObjectType.Undefined;
            this._Events = new EventPackage();
        }
    }
    public Copy() : SceneObject
    {
        return new SceneObject(this);
    }
    public Serialize() : any
    {
        // Virtual
        let SO =
        {
            ID: this._ID,
            Name: this._Name,
            Type: <number> this._Type,
            Data: this.SerializeData(this.Data)
        };
        return SO;
    }
    public SerializeData(Data:any)
    {
        let NewData = {};
        for(let key in Data)
        {
            if(key.startsWith("EDITOR_")) continue;
            if(key.startsWith("TOYBOX_")) continue;
            NewData[key] = Data;
        }
        return NewData;
    }
    public Deserialize(Data:any) : void
    {
        // Virtual
        this._ID = Data.ID;
        this._Name = Data.Name;
        this._Type = <SceneObjectType>Data.Type;
        this.Data = Data.Data;
    }
}