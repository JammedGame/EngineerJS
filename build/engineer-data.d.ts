import * as Engine from "./engineer-engine";

export class Uuid
{
    static Create() : string
}

export class HTTP
{
    static Get(Url:string) : Promise<any>
    static Delete(Url:string) : Promise<any>
    static Post(Url:string, Body?:Object) : Promise<any>
    static Update(Url:string, Body?:Object) : Promise<any>
}

export class Reader
{
    static Read(FilePath:string): Promise<any>
}

export class Serialization
{
    static CleanData(Data:any) : any
    static DeserializeSceneObject(Data) : Engine.SceneObject
}

export as namespace Data;