export { Material }

import * as Data from "./../../Data/Data";

import { MaterialNode } from "./MaterialNode";
import { MaterialNodeValue } from "./MaterialNodeValue";

class Material
{
    private _ID:string;
    private _Name:string;
    private _Nodes:MaterialNode[];
    public get ID():string { return this._ID; }
    public get Name():string { return this._Name; }
    public set Name(value:string) { this._Name = value; }
    public get Nodes():MaterialNode[] { return this._Nodes; }
    public constructor(Old?:Material)
    {
        if(Old != null)
        {
            this._ID = Data.Uuid.Create();
            this._Name = Old._Name;
            this._Nodes = [];
            for(let i in Old._Nodes) this._Nodes.push(Old._Nodes[i].Copy());
            this.CloneConnections(Old);
        }
        else
        {
            this._ID = Data.Uuid.Create();
            this._Name = this._ID;
            this._Nodes = [];
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
}