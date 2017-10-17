export  { RenderEnableCap, Renderer };

import * as Math from "./../Mathematics/Mathematics";

enum RenderEnableCap
{
    Depth
}
class Renderer
{
    protected _Size;
    public constructor(Old?:Renderer, Canvas?:HTMLCanvasElement)
    {
        if(Old != null)
        {
            this._Size = Old._Size;
        }
        else
        {
            this._Size = new Math.Vertex(100,100,0);
        }
    }
    public Copy() : Renderer
    {
        let New:Renderer = new Renderer(this);
        return New;
    }
    public SetSize(Size:Math.Vertex)
    {
        // Virtual
        this._Size = Size;
    }
    public SetDepth(Value:boolean)
    {
        this.Toggle(RenderEnableCap.Depth, Value);
    }
    public Clear(Color:Math.Color) : void { /*Virtual*/ }
    public SetColor(Color:Math.Color) : void { /*Virtual*/ }

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

    protected Toggle(Preference:RenderEnableCap, Value:boolean) : void { /*Virtual*/ }
    protected ClearColor(Color:number[]) : void { /*Virtual*/ }
}