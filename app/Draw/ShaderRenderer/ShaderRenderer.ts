export  { ShaderRenderer };

import * as Util from "./../../Util/Util";
import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

import { Renderer } from "./../Renderer";
import { ShaderManager } from "./ShaderManager";
import { ShaderProgram, GraphicDrawMode } from "./ShaderProgram";
import { ShaderUniformPackage } from "./ShaderUniformPackage";

class ShaderRenderer extends Renderer
{
    private _PushedID:string;
    private _GridSize:number;
    private _GridVertices:any;
    private _ImageVertices:any;
    private _ImageUV:any;
    protected _Globals:ShaderUniformPackage;
    protected _Manager:ShaderManager;
    public get Manager():ShaderManager { return this._Manager; }
    public set Manager(value:ShaderManager) { this._Manager = value; }
    public constructor(Old?:ShaderRenderer, Canvas?:HTMLCanvasElement)
    {
        super(Old);
        if(Old != null)
        {
            super();
            this._PushedID = Old._PushedID;
            this._Globals = Old._Globals.Copy();
            this._GridSize = Old._GridSize;
        }
        else
        {
            super();
            this._PushedID = "";
            this._Globals = new ShaderUniformPackage();
            this._GridSize = 1;
            this._Globals.SetDefinition("CameraPosition", 3 * 4, "vec3");
            this._Globals.SetDefinition("Projection", 16 * 4, "mat4");
            this._Globals.SetDefinition("ModelView", 16 * 4, "mat4");
        }
    }
    public Copy() : ShaderRenderer
    {
        let New:ShaderRenderer = new ShaderRenderer(this);
        return New;
    }
    public SetSize(Size:Math.Vertex)
    {
        // Override;
        this._Size = Size;
        this.SetViewport(this._Size);
    }
    public SetUpShader(ID:string, ShaderCodes:string[]) : void
    {
        // Virtual
        this._Manager.AddShader(ID);
        this._Manager.ActivateShader(ID);
        this._Manager.Active.Attributes.SetDefinition("V_Vertex", 3 * 4, "vec3");
        if(ShaderCodes[1].indexOf("F_Normal") != -1) this._Manager.Active.Attributes.SetDefinition("V_Normal", 3 * 4, "vec3");
        if(ShaderCodes[1].indexOf("F_TextureUV") != -1) this._Manager.Active.Attributes.SetDefinition("V_TextureUV", 2 * 4, "vec2");
        this._Manager.CompileShader(ID, ShaderCodes[0], ShaderCodes[1], ShaderCodes[2], ShaderCodes[3], ShaderCodes[4]);
    }
    public RefreshActiveShader(Name:string, OldValue:string, NewValue:string) : void
    {
        // Virtual
        let Replaced:string = OldValue + "/*" + Name + "/*";
        let ReplaceWith:string = NewValue + "/*" + Name + "/*";
        if(this._Manager.Active.VertexShaderCode != null) this._Manager.Active.VertexShaderCode.replace(Replaced, ReplaceWith);
        if(this._Manager.Active.FragmentShaderCode != null) this._Manager.Active.FragmentShaderCode.replace(Replaced, ReplaceWith);
        if(this._Manager.Active.GeometryShaderCode != null) this._Manager.Active.GeometryShaderCode.replace(Replaced, ReplaceWith);
        if(this._Manager.Active.TessellationControlCode != null) this._Manager.Active.TessellationControlCode.replace(Replaced, ReplaceWith);
        if(this._Manager.Active.TessellationEvaluationCode != null) this._Manager.Active.TessellationEvaluationCode.replace(Replaced, ReplaceWith);
        this._Manager.Active.ReCompile();
    }
    public SetSurface(Color:number[]) : void
    {
        // Override
        if(!this._Manager.Active.Uniforms.Exists("Color")) this._Manager.Active.Uniforms.SetDefinition("Color", 4 * 4, "vec4");
        this._Manager.Active.Uniforms.SetData("Color", Color);
        if(!this._Globals.Exists("Color")) this._Manager.Active.Uniforms.SetDefinition("Color", 4 * 4, "vec4");
        this._Globals.SetData("Color", Color);
    }
    public IsMaterialReady(ID:string) : boolean
    {
        // Override
        return this._Manager.ShaderExists(ID);
    }
    public SetMaterial(MaterialData:any[], Update:boolean) : void
    {
        // Override
        let ShaderData:string[] = MaterialData[0];
        if(!this._Manager.ShaderExists(ShaderData[0]) || Update) this.SetUpShader(ShaderData[0], [ShaderData[1], ShaderData[2], ShaderData[3], ShaderData[4], ShaderData[5]]);
        this._Manager.ActivateShader(ShaderData[0]);
        if(MaterialData[2] != null)
        {
            let TextureNumber:number = MaterialData[1];
            let Textures:ArrayBuffer = MaterialData[2];
            this._Manager.Active.Textures.SetData(TextureNumber, Textures);
        } 
    }
    public UpdateMaterial() : void
    {
        // Override
        this._Manager.Active.Uniforms.Update(this._Globals);
    }
    public SetProjectionMatrix(Matrix:number[]) : void
    {
        // Override
        this._Globals.SetData("Projection", Matrix);
    }
    public SetModelViewMatrix(Matrix:number[]) : void
    {
        // Override
        this._Globals.SetData("ModelView", Matrix);
    }
    public SetCameraPosition(CameraPosition:Math.Vertex) : void
    {
        // Override
        this._Globals.SetData("CameraPosition", CameraPosition.ToArray());
    }
    public Render2DGrid() : void
    {
        // Override
        if (!this.IsMaterialReady("Grid2D"))
        {
            let Vertex2D:string = "";
            let Fragment2D:string = "";
            this.SetMaterial([["Grid2D", Vertex2D, Fragment2D, null, null, null ], null, null ], true);
        }
        else this.SetMaterial([["Grid2D", null, null, null, null, null ], null, null ], false);
        this.UpdateMaterial();
        let GridWidth:number = 100;
        if (this._GridSize == -1)
        {
            let Vertices:Math.Vertex[] = [];
            for (let i = -10; i <= 10; i++)
            {
                for (let j = -10; j <= 10; j++)
                {
                    Vertices.push(new Math.Vertex(GridWidth * +i, GridWidth * j, 0));
                    Vertices.push(new Math.Vertex(GridWidth * -i, GridWidth * j, 0));
                    Vertices.push(new Math.Vertex(GridWidth * i, GridWidth * +j, 0));
                    Vertices.push(new Math.Vertex(GridWidth * i, GridWidth * -j, 0));
                }
            }
            Vertices.push(new Math.Vertex(-50, -50, 0));
            Vertices.push(new Math.Vertex(50, -50, 0));
            Vertices.push(new Math.Vertex(50, -50, 0));
            Vertices.push(new Math.Vertex(50, 50, 0));
            Vertices.push(new Math.Vertex(50, 50, 0));
            Vertices.push(new Math.Vertex(-50, 50, 0));
            Vertices.push(new Math.Vertex(-50, 50, 0));
            Vertices.push(new Math.Vertex(-50, -50, 0));
            this._GridSize = Vertices.length;
            //this._GridVertices = Util.Converter.ConvertVerticesToByteArray(Vertices, 3);
        }
        this.SetSurface([0.3,0.3,0.3,1]);
        this._Manager.Active.Attributes.SetData("V_Vertex", this._GridSize * 3 * 4, this._GridVertices);
        this._Manager.Active.Uniforms.SetData("Index", -1);
        this._Manager.SetDrawMode(GraphicDrawMode.Lines);
        this._Manager.Draw();
    }
    public RenderImage(ID:string, Textures:string[], CurrentIndex:number, Update:boolean) : void
    {
        // Override
        if (!this.IsMaterialReady(ID))
        {
            this._Manager.ActivateShader("2D");
            this.SetMaterial([[ID, this._Manager.Active.VertexShaderCode, this._Manager.Active.FragmentShaderCode, null, null, null ], null, null ], true);
        }
        this.UpdateMaterial();
        if (this._ImageVertices == null)
        {
            let Vertices:Math.Vertex[] = [];
            Vertices.push(new Math.Vertex(0, 0, 0));
            Vertices.push(new Math.Vertex(1, 0, 0));
            Vertices.push(new Math.Vertex(0, 1, 0));
            Vertices.push(new Math.Vertex(0, 1, 0));
            Vertices.push(new Math.Vertex(1, 0, 0));
            Vertices.push(new Math.Vertex(1, 1, 0));
            this._ImageVertices = Util.Convert.VerticesToByteArray(Vertices, 3);
            let UV:Math.Vertex[] = [];
            UV.push(new Math.Vertex(0, 0, 0));
            UV.push(new Math.Vertex(1, 0, 0));
            UV.push(new Math.Vertex(0, 1, 0));
            UV.push(new Math.Vertex(0, 1, 0));
            UV.push(new Math.Vertex(1, 0, 0));
            UV.push(new Math.Vertex(1, 1, 0));
            this._ImageUV = Util.Convert.VerticesToByteArray(UV, 2);
        }
        this._Manager.Active.Attributes.SetData("V_Vertex", 6 * 3 * 4, this._ImageVertices);
        this._Manager.Active.Attributes.SetData("V_TextureUV", 6 * 2 * 4, this._ImageUV);
        if (!this._Manager.Active.Uniforms.Exists("Index")) this._Manager.Active.Uniforms.SetDefinition("Index", 4, "int");
        this._Manager.Active.Uniforms.SetData("Index", CurrentIndex);
        this._Manager.SetDrawMode(GraphicDrawMode.Triangles);
        this._Manager.Draw();
    }
    public PushPreferences() : void
    {
        // Override
        this._PushedID = this._Manager.Active.ShaderID;
    }
    public PopPreferences() : void
    {
        // Override
        if (this._PushedID != "") this._Manager.ActivateShader(this._PushedID);
    }
    public CurrentShader() : ShaderProgram
    {
        // Virtual
        return this._Manager.Active;
    }
    public static PackTextures(Textures:string[], CallBack:Function):ArrayBuffer
    {
        return null;
        //return Data.ImageContainer.LoadArray(Textures, CallBack);
    }

    protected SetViewport(Size:Math.Vertex) : void { /*Virtual*/ }
}