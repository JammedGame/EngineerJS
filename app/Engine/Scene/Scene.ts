export  { SceneType, Scene };

import * as Data from "./../../Data/Data";
import * as Util from "./../../Util/Util";
import * as Math from "./../../Mathematics/Mathematics";

import { SceneEventPackage } from "./../Events/SceneEventPackage";
import { SceneObject, SceneObjectType } from "./SceneObject";
import { SoundObject } from "./SoundObject";
import { DrawObject, DrawObjectType } from "./DrawObject";
import { Serialization } from "./../../Data/Serialization";
import { Light } from "./Light";

enum SceneType
{
    Scene2D = "Scene2D",
    Scene3D = "Scene3D"
}
class Scene
{
    private _ID:string;
    private _Name:string;
    private _Type:SceneType;
    private _BackColor:Math.Color;
    private _Events:SceneEventPackage;
    private _Objects:SceneObject[];
    public get ID():string { return this._ID; }
    public get Name():string { return this._Name; }
    public set Name(value:string) { this._Name = value; }
    public get Type():SceneType { return this._Type; }
    public set Type(value:SceneType) { this._Type = value; }
    public get BackColor():Math.Color { return this._BackColor; }
    public set BackColor(value:Math.Color) { this._BackColor = value; }
    public get Events():SceneEventPackage { return this._Events; }
    public get Objects():SceneObject[] { return this._Objects; }
    public set Objects(value:SceneObject[]) { this._Objects = value; }
    public get DrawnObjects() : DrawObject[]
    {
        return <DrawObject[]>this.FindByType(SceneObjectType.Drawn);
    }
    public get SoundObjects() : SoundObject[]
    {
        return <SoundObject[]>this.FindByType(SceneObjectType.Sound);
    }
    public get Lights() : Light[]
    {
        return <Light[]>this.FindByDrawType(DrawObjectType.Light);
    }
    public get ActiveLights() : Light[]
    {
        return <Light[]>this.FindActiveByDrawType(DrawObjectType.Light);
    }
    public Data: { [key: string]:any; } = {};
    public constructor(Old?:Scene)
    {
        if(Old != null)
        {
            this._ID = Data.Uuid.Create();
            this._Name = Old._Name;
            this._BackColor = Old._BackColor;
            this._Events = Old._Events.Copy();
            this._Objects = [];
            for(let i = 0; i < Old._Objects.length; i++) this._Objects.push(Old._Objects[i].Copy());
        }
        else
        {
            this._ID = Data.Uuid.Create();
            this._Name = this._ID;
            this._BackColor = Math.Color.FromRGBA(40,40,40,255);
            this._Events = new SceneEventPackage();
            this._Objects = [];
        }
    }
    public Copy() : Scene
    {
        return new Scene(this);
    }
    public Attach(Object:SceneObject) : void
    {
        // Virtual
        this.Data[Object.ID] = Object;
        this._Objects.push(Object);
        Object.OnAttach({Scene:this});
    }
    public Remove(Object:SceneObject) : void
    {
        // Virtual
        let Index:number = this._Objects.indexOf(Object);
        if(Index != -1)
        {
            Object.OnRemove({Scene:this});
            this._Objects.splice(Index, 1);
        }
        else Util.Log.Warning("Object " + Object.Name + "/" + Object.ID + " does not exist in scene " + this.Name + "/" + this.ID, {Objects:this._Objects, Object});
    }
    public FindByData(Key:string, Data?:any) : SceneObject[]
    {
        let Objects:SceneObject[] = [];
        for(let i = 0; i < this.Objects.length; i++)
        {
            if(this.Objects[i].Data[Key])
            {
                if(Data)
                {
                    if(this.Objects[i].Data[Key] == Data) Objects.push(this.Objects[i]);
                }
                else Objects.push(this.Objects[i]);
            }
        }
        return Objects;
    }
    public FindByType(Type:SceneObjectType) : SceneObject[]  
    {  
        let Objects:SceneObject[] = [];  
        for(let i = 0; i < this.Objects.length; i++)  
        {  
            if(this.Objects[i].Type == Type)  
            {  
                Objects.push(this.Objects[i]);  
            }    
        }  
        return Objects;  
    } 
    public FindByDrawType(Type:DrawObjectType) : DrawObject[]  
    {  
        let Objects:DrawObject[] = [];  
        for(let i = 0; i < this.Objects.length; i++)  
        {  
            if(this.Objects[i].Type == SceneObjectType.Drawn)  
            {  
                if((<DrawObject>this.Objects[i]).DrawType == Type)  
                {  
                    Objects.push(<DrawObject>this.Objects[i]);  
                }  
            }  
        }  
        return Objects;  
    }  
    public FindColliders(Tags:string[]) : DrawObject[]  
    {  
        let Objects:DrawObject[] = [];  
        for(let i = 0; i < this.Objects.length; i++)  
        {  
            if(this.Objects[i].Type == SceneObjectType.Drawn)  
            {  
                let Drawn:DrawObject = <DrawObject>this.Objects[i];
                if(Drawn.Collision.Active)  
                {  
                    if(Tags.length == 0) Objects.push(Drawn);
                    else for(let i in Tags)
                    {
                        if(Drawn.Data[Tags[i]])
                        {
                            Objects.push(Drawn);
                            break;
                        }
                    }
                }  
            }  
        }  
        return Objects;  
    }  
    public FindActiveByDrawType(Type:DrawObjectType) : DrawObject[]  
    {  
        let Objects:DrawObject[] = [];  
        for(let i = 0; i < this.Objects.length; i++)  
        {  
            if(this.Objects[i].Type == SceneObjectType.Drawn && (<DrawObject>this.Objects[i]).Active)  
            {  
                if((<DrawObject>this.Objects[i]).DrawType == Type)
                {  
                    Objects.push(<DrawObject>this.Objects[i]);  
                }  
            }  
        }  
        return Objects;  
    }
    public Composite(Chunk:Scene) : boolean
    {
        // Virtual
        return false;
    }
    public OnSwitch() : void
    {
        // Virtual
        let UIParent:HTMLElement = document.getElementById("ui-parent");
        if(UIParent) UIParent.innerHTML = "";
        for(let i in this._Objects) this._Objects[i].OnSwitch();
    }
    public OnResize(Args:any) : void
    {
        // Virtual
        for(let i in this._Objects) this._Objects[i].OnResize(Args);
    }
    public Serialize() : any
    {
        // Virtual
        let S =
        {
            ID: this._ID,
            Name: this._Name,
            Type: <string> this._Type,
            BackColor: this._BackColor.Serialize(),
            Objects: [],
            Data: {}
        };
        for(let i in this._Objects)
        {
            S.Objects.push(this._Objects[i].Serialize());
        }
        return S;
    }
    public Deserialize(Data:any) : void
    {
        // Virtual
        this._ID = Data.ID;
        this._Name = Data.Name;
        this._Type = <SceneType> Data.Type;
        this._BackColor.Deserialize(Data.BackColor);
        this._Objects = [];
        this.Data = Data.Data;
        for(let i in Data.Objects)
        {
            this.Attach(Serialization.DeserializeSceneObject(Data.Objects[i]));
        }
    }
}