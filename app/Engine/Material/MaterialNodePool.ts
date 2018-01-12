export { MaterialNodePool }

import * as Math from "./../../Mathematics/Mathematics";

import { MaterialNode } from "./MaterialNode";
import { MaterialNodeValue, MaterialNodeValueType } from "./MaterialNodeValue";

class MaterialNodePool
{
    private _Pool: { [key: string]:MaterialNode; };
    public get Pool():any { return this._Pool; }
    public constructor()
    {
        this.Init();
    }
    private Init() : void
    {
        this._Pool = {};

        // Output

        let NMN:MaterialNode = new MaterialNode();
        NMN.Name = "Output";
        NMN.FunctionID = "Output";
        
        let NMNV:MaterialNodeValue = new MaterialNodeValue();
        NMNV.Name = "Color";
        NMNV.Value = Math.Color.White;
        NMNV.Editable = true;
        NMNV.Type = MaterialNodeValueType.Vector4;
        
        NMN.AddInput(NMNV);

        this._Pool["Output"] = NMN;

        // Color

        NMN = new MaterialNode();
        NMN.Name = "Color";
        NMN.FunctionID = "Color";

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Output";
        NMNV.Type = MaterialNodeValueType.Vector4;

        NMN.AddOutput(NMNV);

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Color";
        NMNV.Value = Math.Color.White;
        NMNV.Editable = true;
        NMNV.Type = MaterialNodeValueType.Vector4;

        NMN.AddInput(NMNV);

        this._Pool["Color"] = NMN;

        // InputColor

        NMN = new MaterialNode();
        NMN.Name = "InputColor";
        NMN.FunctionID = "InputColor";

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Output";
        NMNV.Type = MaterialNodeValueType.Vector4;

        NMN.AddOutput(NMNV);

        this._Pool["InputColor"] = NMN;

        // Texture

        NMN = new MaterialNode();
        NMN.Name = "Texture";
        NMN.FunctionID = "Texture";

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Output";
        NMNV.Type = MaterialNodeValueType.Vector4;

        NMN.AddOutput(NMNV);

        this._Pool["Texture"] = NMN;

        // NormalMap

        NMN = new MaterialNode();
        NMN.Name = "NormalMap";
        NMN.FunctionID = "NormalMap";

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Output";
        NMNV.Type = MaterialNodeValueType.Vector4;

        NMN.AddOutput(NMNV);

        this._Pool["NormalMap"] = NMN;

        // Light

        NMN = new MaterialNode();
        NMN.Name = "Light";
        NMN.FunctionID = "Light";

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Output";
        NMNV.Type = MaterialNodeValueType.Vector3;

        NMN.AddOutput(NMNV);

        this._Pool["Light"] = NMN;

        // BumpLight

        NMN = new MaterialNode();
        NMN.Name = "BumpLight";
        NMN.FunctionID = "BumpLight";

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Output";
        NMNV.Type = MaterialNodeValueType.Vector3;

        NMN.AddOutput(NMNV);

        this._Pool["BumpLight"] = NMN;

        // Diffuse

        NMN = new MaterialNode();
        NMN.Name = "Diffuse";
        NMN.FunctionID = "Diffuse";

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Output";
        NMNV.Type = MaterialNodeValueType.Vector3;

        NMN.AddOutput(NMNV);

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Color";
        NMNV.Value = Math.Color.White;
        NMNV.Editable = true;
        NMNV.Type = MaterialNodeValueType.Vector4;

        NMN.AddInput(NMNV);

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Light";
        NMNV.Value = Math.Color.White;
        NMNV.Editable = true;
        NMNV.Type = MaterialNodeValueType.Vector3;

        NMN.AddInput(NMNV);

        this._Pool["Diffuse"] = NMN;

        // Mignola

        NMN = new MaterialNode();
        NMN.Name = "Mignola";
        NMN.FunctionID = "Mignola";

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Output";
        NMNV.Type = MaterialNodeValueType.Vector4;

        NMN.AddOutput(NMNV);

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Color";
        NMNV.Value = Math.Color.White;
        NMNV.Editable = true;
        NMNV.Type = MaterialNodeValueType.Vector4;

        NMN.AddInput(NMNV);

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Map";
        NMNV.Value = Math.Color.White;
        NMNV.Editable = true;
        NMNV.Type = MaterialNodeValueType.Vector4;

        NMN.AddInput(NMNV);

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Upper_Limit";
        NMNV.Value = 0.75;
        NMNV.Editable = true;
        NMNV.Type = MaterialNodeValueType.Float;

        NMN.AddInput(NMNV);

        NMNV = new MaterialNodeValue();
        NMNV.Name = "Lower_Limit";
        NMNV.Value = 0.35;
        NMNV.Editable = true;
        NMNV.Type = MaterialNodeValueType.Float;

        NMN.AddInput(NMNV);

        this._Pool["Mignola"] = NMN;
    }
}