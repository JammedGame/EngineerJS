export { Material, MaterialType, TextureSamplingType }

import * as Data from "./../../Data/Data";

import { ShaderCode } from "./ShaderCode";
import { MaterialNode } from "./MaterialNode";
import { MaterialNodeValue } from "./MaterialNodeValue";
import { MaterialInput, MaterialInputType } from "./MaterialInput";

enum MaterialType
{
    Default = "Default",
    Lit = "Lit",
    Phong = "Phong",
    Toon = "Toon",
    Custom = "Custom",
    Shader = "Shader"
}
enum TextureSamplingType
{
    Linear = "Linear",
    Nearest = "Nearest"
}
class Material
{
    private _ID:string;
    private _Name:string;
    private _Type:MaterialType;
    private _Nodes:MaterialNode[];
    private _Inputs:MaterialInput[];
    private _Shaders:ShaderCode;
    private _Sampling:TextureSamplingType;
    public get ID():string { return this._ID; }
    public get Name():string { return this._Name; }
    public set Name(value:string) { this._Name = value; }
    public get Type():MaterialType { return this._Type; }
    public set Type(value:MaterialType) { this._Type = value; }
    public get Nodes():MaterialNode[] { return this._Nodes; }
    public get Inputs():MaterialInput[] { return this._Inputs; }
    public get Shaders():ShaderCode { return this._Shaders; }
    public get Sampling():TextureSamplingType { return this._Sampling; }
    public set Sampling(value:TextureSamplingType) { this._Sampling = value; }
    public constructor(Old?:Material)
    {
        if(Old != null)
        {
            this._ID = Data.Uuid.Create();
            this._Name = Old._Name;
            this._Type = Old._Type;
            this._Nodes = [];
            for(let i in Old._Nodes) this._Nodes.push(Old._Nodes[i].Copy());
            this._Inputs = [];
            for(let i in Old._Inputs) this._Inputs.push(Old._Inputs[i].Copy());
            this._Shaders = Old._Shaders.Copy();
            this._Sampling = Old._Sampling;
            this.CloneConnections(Old);
        }
        else
        {
            this._ID = Data.Uuid.Create();
            this._Name = this._ID;
            this._Type = MaterialType.Default;
            this._Nodes = [];
            this._Inputs = [];
            this._Shaders = new ShaderCode();
            this._Sampling = TextureSamplingType.Nearest;
        }
    }
    public Copy() : Material
    {
        return new Material(this);
    }
    public AddNode(Node:MaterialNode) : void
    {
        while(!this.CheckNameAvailable(Node.Name))
        {
            Node.Name = this.BumpName(Node.Name);
        }
        this._Nodes.push(Node);
    }
    public RegisterInput(ID:string, Type:MaterialInputType) : boolean
    {
        for(let i in this._Inputs) if(this._Inputs[i].ID == ID) return false;
        this._Inputs.push(new MaterialInput(null, ID, Type));
        return true;
    }
    public FindNodeByName(Name:string) : MaterialNode
    {
        for(let i in this.Nodes)
        {
            if(this.Nodes[i].FunctionID == Name) return this.Nodes[i];
        }
    }
    public FindNodeByFunction(Function:string) : MaterialNode
    {
        for(let i in this.Nodes)
        {
            if(this.Nodes[i].FunctionID == Function) return this.Nodes[i];
        }
    }
    private CheckNameAvailable(Name:string) : boolean
    {
        for(let i in this._Nodes)
        {
            if(this._Nodes[i].Name == Name) return false;
        }
        return true;
    }
    private BumpName(Name:string) : string
    {
        let Match = Name.match(/_\d+/);
        if(Name.endsWith(Match[0]))
        {
            let NumString:string = Match[0];
            NumString = NumString.slice(1);
            let Value:number = parseInt(NumString);
            return Name.replace("_" + Value, "_" + (Value+1));
        }
        return Name + "_1";
    }
    private CloneConnections(Old:Material) : void
    {
        for(let i = 0; i < this._Nodes.length; i++)
        {
            for(let j = 0; j < this._Nodes[i].Inputs.length; j++)
            {
                if(Old._Nodes[i].Inputs[j].InputTarget)
                {
                    this._Nodes[i].Inputs[j].InputTarget = this.FindNodeOutputByOrigin(Old._Nodes[i].Inputs[j].InputTarget.OriginID);
                }
            }
        }
    }
    private DeserializeCloneConnections(Old:any) : void
    {
        for(let i = 0; i < this._Nodes.length; i++)
        {
            for(let j = 0; j < this._Nodes[i].Inputs.length; j++)
            {
                if(Old.Nodes[i].Inputs[j].InputTarget != "None")
                {
                    this._Nodes[i].Inputs[j].InputTarget = this.FindNodeOutputByOrigin(Old.Nodes[i].Inputs[j].InputTarge);
                }
            }
        }
    }
    private FindNodeOutputByOrigin(ID:string) : MaterialNodeValue
    {
        for(let i = 0; i < this._Nodes.length; i++)
        {
            for(let j = 0; j < this._Nodes[i].Inputs.length; j++)
            {
                if(ID == this._Nodes[i].Outputs[j].OriginID)
                {
                    return this._Nodes[i].Outputs[j];
                }
            }
        }
    }
    public Serialize() : any
    {
        // Virtual
        let M =
        {
            ID: this._ID,
            Name: this._Name,
            Nodes: []
        };
        for(let i in this._Nodes)
        {
            M.Nodes.push(this._Nodes[i].Serialize());
        }
        return M;
    }
    public Deserialize(Data:any) : void
    {
        // Virtual
        this._ID = Data.ID;
        this._Name = Data.Name;
        this._Nodes = [];
        for(let i in Data.Nodes)
        {
            let MN:MaterialNode = new MaterialNode();
            MN.Deserialize(Data.Nodes[i]);
            this._Nodes.push(MN);
        }
        this.DeserializeCloneConnections(Data);
    }
}