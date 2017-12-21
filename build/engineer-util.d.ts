import * as Math from "./engineer-math";
import * as Engine from "./engineer-engine"

export class BufferUtil
{
    static Append(Buffer1:ArrayBuffer, Buffer2:ArrayBuffer);
}

export class CollisionUtil
{
    static Check(Object1:Engine.DrawObject, Object2:Engine.DrawObject)
    static CreateColliderObject(Object:Engine.DrawObject) : Math.ColliderObject
    static CalculateObjectCollisions(Type:string, Object:Engine.DrawObject, Colliders:Engine.DrawObject[])
}

export class Convert
{
    static VerticesToByteArray(Vertices:Math.Vertex[], Relevant:number) : Float32Array
    static DrawObjectToCollider(Object:Engine.DrawObject) : Math.ColliderObject
}

export class Log
{
    static LogPrint:boolean;
    static LogInfo:boolean;
    static LogError:boolean;
    static LogWarning:boolean;
    static LogEvent:boolean;
    static Print(Message:any) : void
    static Info(Message:any) : void
    static Error(Message:any) : void
    static Warning(Message:any) : void
    static Event(Message:any) : void
}

export class SceneObjectUtil
{
    static CreateSprite(Name?:string, Images?:string[], Position?:Math.Vertex, Size?:Math.Vertex) : Engine.Sprite
    static CreateTile(Name?:string, Images?:string[], Position?:Math.Vertex, Size?:Math.Vertex) : Engine.Tile
}