import * as Engine from "./engineer-engine";

export class Uuid
{
    static Create() : string
}

export class Reader
{
    static ReadFile(FilePath:string, Callback:Function): string
}

export class Serialization
{
    static CleanData(Data:any) : any
    static DeserializeSceneObject(Data) : Engine.SceneObject
}

export as namespace Data;