import * as Math from "./engineer-math";

export class EventPackage
{
    Closing:Function[];
    KeyPress:Function[];
    KeyDown:Function[];
    KeyUp:Function[];
    Load:Function[];
    MouseClick:Function[];
    MouseDown:Function[];
    MouseUp:Function[];
    MouseMove:Function[];
    MouseWheel:Function[];
    RenderFrame:Function[];
    Resize:Function[];
    TimeTick:Function[];
    OperationProgress:Function[];
    OperationFinished:Function[];
    SpriteSetAnimationComplete:Function[];
    constructor(Old?:EventPackage)
    Copy() : EventPackage
    Invoke(EventName:string, CurrentGame:Game, Args) : boolean
    InvokeEvents(Events:Function[], CurrentGame:Game, Args) : boolean
}

export enum MouseButton 
{
    Left,
    Middle,
    Right
}

export enum SceneObjectType
{
    Undefined = "Undefined",
    Drawn = "Drawn",
    Script = "Script",
    Sound = "Sound",
    Other = "Other"
}

export class SceneObject
{
    ID:string;
    Name:string;
    Type:SceneObjectType;
    Events:EventPackage;
    Data:any;
    constructor(Old?:SceneObject)
    Copy() : SceneObject
    Serialize() : any
    Deserialize(Data:any) : void
}

export enum MaterialNodeValueType
{
    Int = "int",
    Bool = "bool",
    Float = "float",
    Vector2 = "vec2",
    Vector3 = "vec3",
    Vector4 = "vec4"
}

export class MaterialNodeValue
{
    ID:string;
    Name:string;
    OriginID:string;
    ParentName:string;
    Editable:boolean;
    Type:MaterialNodeValueType;
    InputTarget:MaterialNodeValue;
    Value:any;
    constructor(Old?:MaterialNodeValue)
    Copy() : MaterialNodeValue
    Serialize() : any
    Deserialize(Data:any) : void
}

export class MaterialNode
{
    ID:string;
    Name:string;
    FunctionID:string;
    Values:MaterialNodeValue[];
    Inputs:MaterialNodeValue[];
    Outputs:MaterialNodeValue[];
    constructor(Old?:MaterialNode)
    Copy() : MaterialNode
    Serialize() : any
    Deserialize(Data:any) : void
    AddValue(NodeValue: MaterialNodeValue) : void
    AddInput(NodeValue: MaterialNodeValue) : void
    AddOutput(NodeValue: MaterialNodeValue) : void
}

export class MaterialNodePool
{
    Pool: { [key: string]:MaterialNode; };
    constructor()
}

export class Material
{
    ID:string;
    Name:string;
    Nodes:MaterialNode[];
    constructor(Old?:Material)
    Copy() : Material
    Serialize() : any
    Deserialize(Data:any) : void
    AddNode(Node:MaterialNode) : void
    FindNodeByName(Name:string) : MaterialNode
    FindNodeByFunction(Function:string) : MaterialNode
}

export enum DrawObjectType
{
    Undefined = "Undefined",
    Image = "Image",
    Sprite = "Sprite",
    Tile = "Tile",
    Light = "Light"
}

export class DrawObject extends SceneObject
{
    Modified:boolean;
    Fixed:boolean;
    Active:boolean;
    Paint:Math.Color;
    DrawType:DrawObjectType;
    Trans:Math.Transformation;
    constructor(Old?:DrawObject)
    Copy() : DrawObject
    Serialize() : any
    Deserialize(Data) : void
}

export class LightAttenuation
{
    Constant:number;
    Linear:number;
    Quadratic:number;
    constructor(Old?:LightAttenuation, Constant?:number, Linear?:number, Quadratic?:number);
}

export class Light extends DrawObject
{
    Intensity:number;
    Attenuation:LightAttenuation;
    constructor(Old?:Light);
}

export enum ImageObjectMaterialType
{
    Default = "Default",
    Lit = "Lit",
    NormalLit = "NormalLit",
    Custom = "Custom",
    Shader = "Shader"
}

export enum ImageObjectSamplingType
{
    Linear = "Linear",
    Nearest = "Nearest"
}

export class ImageObject extends DrawObject
{
    // Abstract
    Index: number;
    Images: string[];
    NormalMaps: string[];
    FlipX:boolean;
    FlipY:boolean;
    RepeatX:number;
    RepeatY:number;
    AmbientColor:Math.Color;
    Sampling:ImageObjectSamplingType;
    MaterialType:ImageObjectMaterialType;
    CustomMaterial:Material;
    CustomShader:any;
    constructor(Old?:ImageObject)
    Copy() : ImageObject
    Serialize() : any
    Deserialize(Data) : void
}

export class SpriteSet
{
    ID:string;
    Name:string;
    Seed:number;
    Sprites:string[];
    constructor(Old?:SpriteSet, Name?:string, Images?:string[])
    Copy() : SpriteSet
    Serialize() : any
    Deserialize(Data:any) : void
}

export class Sprite extends ImageObject
{
    CurrentIndex:number;
    CurrentSpriteSet:number;
    BackUpSpriteSet:number;
    SpriteSets:SpriteSet[];
    NormalSets:SpriteSet[];
    SubSprites:Sprite[];
    constructor(Old?:Sprite)
    Copy() : Sprite
    CollectiveList() : string[]
    RaiseIndex() : void
    SetSpriteSet(Index:number) : void
    UpdateSpriteSet(Index:number) : void
    SetSpriteSetByName(Name:string) : void
    UpdateSpriteSetByName(Name:string) : void
    GetSprites(Set:number) : string[]
    GetNormalSprites(Set:number) : string[]
    Serialize() : any
    Deserialize(Data:any) : void
}

export class TileCollection
{
    ID:string;
    Images:string[];
    constructor(Old?:TileCollection, Images?:string[])
    Copy() : TileCollection
    Serialize() : any
    Deserialize(Data) : void
}

export class Tile extends ImageObject
{
    Collection:TileCollection;
    NormalCollection:TileCollection;
    SubTiles:Tile[];
    constructor(Old?:Tile)
    Copy() : Tile
    Serialize() : any
    Deserialize(Data) : void
}

export class SoundObject extends SceneObject
{
    Autoplay:boolean;
    Looped:boolean;
    Volume:number;
    Url:string;
    constructor(Url:string, Old?:SoundObject)
    Copy() : SceneObject
    GenerateSound() : void
    Play() : void
    Serialize() : any
    Deserialize(Data) : void
}

export enum SceneType
{
    Scene2D = "Scene2D",
    Scene3D = "Scene3D"
}

export class Scene
{
    ID:string;
    Name:string;
    Type:SceneType;
    BackColor:Math.Color;
    Events:EventPackage;
    Objects:SceneObject[];
    Data:any;
    constructor(Old?:Scene)
    Copy() : Scene
    AddSceneObject(Object:SceneObject) : void
    RemoveSceneObject(Object:SceneObject) : void
    GetObjectsWithData(Key:string, Data?:any) : any[]
    Serialize() : any
    Deserialize(Data:any) : void
}

export class Scene2D extends Scene
{
    Trans:Math.Transformation;
    Sprites:Sprite[]
    constructor(Old?:Scene2D)
    Copy() : Scene2D
    AddSceneObject(Object:SceneObject) : void
    Serialize() : any
    Deserialize(Data:any) : void
}

export class Game
{
    Name:string;
    Scenes:Scene[];
    Assets:SceneObject[];
    Data:any;
    constructor(Name?:string)
    Copy() : Game
    UpdateName() : void
    AddScene(Scene:Scene) : void
    ContainsScene(Name:string)
    RemoveScene(Scene:Scene) : void
    RemoveSceneByName(SceneName:string) : void
    GetScenesWithData(Key:string, Data?:any) : any[]
}

export as namespace Engine;