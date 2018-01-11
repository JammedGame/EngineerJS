export { Material }

import * as Data from "./../../Data/Data";

import { MaterialNode } from "./MaterialNode";

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
    private CloneConnections(Old:Material)
    {
        
    }
}