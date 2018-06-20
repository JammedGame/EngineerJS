import * as Math from "./engineer-math";

export class EventPackage
{
    constructor(Old?:EventPackage)
    Copy() : EventPackage
    Invoke(EventName:string, CurrentGame:Game, Args) : boolean
    InvokeEvents(Events:Function[], CurrentGame:Game, Args) : boolean
}

export class SceneEventPackage extends EventPackage
{
    WireTouchEvents:boolean;
    Load:Function[];
    Switch:Function[];
    Leave:Function[];
    Resize:Function[];
    Update:Function[];
    KeyPress:Function[];
    KeyDown:Function[];
    KeyUp:Function[];
    Click:Function[];
    MouseDown:Function[];
    MouseUp:Function[];
    MouseMove:Function[];
    MouseWheel:Function[];
    TouchStart:Function[];
    TouchEnd:Function[];
    TouchMove:Function[];
    LoadProgress:Function[];
    LoadComplete:Function[];
    constructor(Old?:SceneEventPackage)
    Copy() : SceneEventPackage
}

export class ImageObjectEventPackage extends EventPackage
{
    Click:Function[];
    MouseDown:Function[];
    MouseUp:Function[];
    TouchStart:Function[];
    TouchEnd:Function[];
    constructor(Old?:SceneEventPackage)
    Copy() : ImageObjectEventPackage
}

export class SpriteEventPackage extends ImageObjectEventPackage
{
    SetComplete:Function[];
    constructor(Old?:SpriteEventPackage)
    Copy() : SpriteEventPackage
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
    Control = "Control",
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
    OnAttach(Args:any) : void
    OnRemove(Args:any) : void
    OnSwitch() : void
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

export enum MaterialType
{
    Default = "Default",
    Lit = "Lit",
    Phong = "Phong",
    Toon = "Toon",
    Custom = "Custom",
    Shader = "Shader"
}

export enum MaterialInputType
{
    Integer = "i",
    Float = "f",
    Vector2 = "v2",
    Vector3 = "v3",
    Vector4 = "v4",
    Texture = "tv"
}

export class MaterialInput
{
    ID:string;
    Type:MaterialInputType;
    constructor(Old?:MaterialInput, ID?:string, Type?:MaterialInputType)
    Copy() : MaterialInput
}

export class ShaderCode
{
    Vertex:string;
    Fragment:string;
    constructor(Old?:ShaderCode, Vertex?:string, Fragment?:string)
    Copy() : ShaderCode
}

export enum TextureSamplingType
{
    Linear = "Linear",
    Nearest = "Nearest"
}

export class Material
{
    ID:string;
    Name:string;
    Type:MaterialType;
    Nodes:MaterialNode[];
    Inputs:MaterialInput[];
    Shaders:ShaderCode;
    Sampling:TextureSamplingType;
    constructor(Old?:Material)
    Copy() : Material
    Serialize() : any
    Deserialize(Data:any) : void
    AddNode(Node:MaterialNode) : void
    RegisterInput(ID:string, Type:MaterialInputType) : boolean
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
    Position:Math.Vertex;
    Size:Math.Vertex;
    Collision:Math.CollisionValue;
    constructor(Old?:DrawObject)
    Copy() : DrawObject
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
    Radius:number;
    Intensity:number;
    Attenuation:LightAttenuation;
    constructor(Old?:Light);
}

export class ImageObject extends DrawObject
{
    // Abstract
    Index: number;
    Images: string[];
    NormalMaps: string[];
    SpecularMaps: string[];
    FlipX:boolean;
    FlipY:boolean;
    RepeatX:number;
    RepeatY:number;
    AmbientColor:Math.Color;
    Material:Material;
    Collection:ImageCollection;
    NormalCollection:ImageCollection;
    SpecularCollection:ImageCollection;
    Events:ImageObjectEventPackage;
    constructor(Old?:ImageObject)
    Copy() : ImageObject
}

export class ImageCollection
{
    ID:string;
    Origin:string;
    Images:string[];
    constructor(Old?:ImageCollection, Images?:string[])
    Copy() : ImageCollection
    Serialize() : any
    Deserialize(Data:any) : void
}

export class SpriteSet extends ImageCollection
{
    Name:string;
    Seed:number;
    constructor(Old?:SpriteSet, Images?:string[], Name?:string)
    Copy() : SpriteSet
}

export class SpriteSetCollection extends ImageCollection
{
    SpriteSets:SpriteSet[];
    constructor(Old?:SpriteSetCollection, SpriteSets?:SpriteSet[])
    Copy() : SpriteSetCollection
}

export class Sprite extends ImageObject
{
    CurrentIndex:number;
    CurrentSpriteSet:number;
    BackUpSpriteSet:number;
    SpriteSets:SpriteSet[];
    NormalSets:SpriteSet[];
    SubSprites:Sprite[];
    Events:SpriteEventPackage;
    Collection:SpriteSetCollection;
    NormalCollection:SpriteSetCollection;
    SpecularCollection:SpriteSetCollection;
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
}

export class Tile extends ImageObject
{
    SubTiles:Tile[];
    constructor(Old?:Tile)
    Copy() : Tile
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
    Events:SceneEventPackage;
    Objects:SceneObject[];
    Lights:Light[];
    DrawObjects:DrawObject[];
    SoundObjects:SoundObject[];
    Data:any;
    constructor(Old?:Scene)
    Copy() : Scene
    Attach(Object:SceneObject) : void
    Remove(Object:SceneObject) : void
    FindByData(Key:string, Data?:any) : SceneObject[]
    FindByType(Type:SceneObjectType) : SceneObject[]
    FindByDrawType(Type:DrawObjectType) : DrawObject[]
    FindColliders(Tags:string[]) : DrawObject[]
    FindActiveByDrawType(Type:DrawObjectType) : DrawObject[]
    Serialize() : any
    Deserialize(Data:any) : void
}

export class Scene2D extends Scene
{
    Trans:Math.Transformation;
    Sprites:Sprite[]
    constructor(Old?:Scene2D)
    Copy() : Scene2D
}

export class Game
{
    Name:string;
    Scenes:Scene[];
    Assets:SceneObject[];
    Data:any;
    constructor(Name?:string)
    Copy() : Game
    Attach(Scene:Scene) : void
    Contains(Name:string)
    Remove(Scene:Scene) : void
    RemoveByName(SceneName:string) : void
    GetScenesWithData(Key:string, Data?:any) : any[]
}

export enum Quality
{
    Low = 1,
    Medium = 2,
    High = 4,
}

export class Settings
{
    static Version:string;
    static LibPath:string;
    static Graphics:Quality;
    static IgnoreUICSS:boolean;
    static GlobalFontScale:number;
    static GlobalFontFamily:string;
}

export as namespace Engine;