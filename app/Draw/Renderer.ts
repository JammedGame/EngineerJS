export  { Renderer };

import * as Math from "./../Mathematics/Mathematics";

enum RenderEnableCap
{
    Depth
}
class Renderer
{
    private _RenderDestination:any;
    protected _LightsNumber:number;
    public get RendererDestination():any { return this._RenderDestination; }
    public set RendererDestination(value:any) { this._RenderDestination = value; }
    public constructor(Old?:Renderer)
    {
        if(Old != null)
        {
            this._LightsNumber = 0;
        }
        else
        {
            this._LightsNumber = 0;
        }
    }
    public Copy() : Renderer
    {
        let New:Renderer = new Renderer(this);
        return New;
    }
    public ResetLights() : void
    {
        this._LightsNumber = 0;
    }
    public SetViewport(Width:number, Heighyt:number) : void { /*Virtual*/ }
    public Clear() : void { /*Virtual*/ }
    public ClearColor(Color:number[]) : void { /*Virtual*/ }
    public SetSurface(Color:number[]) : void { /*Virtual*/ }
    public IsMaterialReady(ID:string) : boolean { return false; /*Virtual*/ }
    public SetMaterial(MaterialData:any[], Update:boolean) : void { /*Virtual*/ }
    public UpdateMaterial() : void { /*Virtual*/ }
    public SetProjectionMatrix(Matrix:number[]) { /*Virtual*/ }
    public SetModelViewMatrix(Matrix:number[]) { /*Virtual*/ }
    public SetCameraPosition(CameraPosition:Math.Vertex) { /*Virtual*/ }
    public SetViewLight(Index:number, LightParameters:Math.Vertex[]) : boolean { return false; /*Virtual*/ }
    public Render2DGrid() : void { /*Virtual*/ }
    public RenderSprite(ID:string, Textures:string[], CurrentIndex:number, Update:boolean) : void { /*Virtual*/ }
    public RenderGeometry(Vertices:Math.Vertex[], Normals:Math.Vertex[], TexCoords:Math.Vertex[], Faces:any[], Update:boolean) : void { /*Virtual*/ }
    public PushPreferences() : void { /*Virtual*/ }
    public PopPreferences() : void { /*Virtual*/ }
    public Toggle(Preference:RenderEnableCap, Value:boolean) : void { /*Virtual*/ }
}