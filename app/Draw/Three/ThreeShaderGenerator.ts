export { ThreeShaderGenerator }

import * as Math from "./../../Mathematics/Mathematics";
import * as Engine from "./../../Engine/Engine";

import { ThreeNodeShaders } from "./ThreeNodeShaders";

class ThreeShaderGenerator
{
    private static _Passed:Engine.MaterialNode[];
    public static GenerateFragment(Material:Engine.Material) : string
    {
        ThreeShaderGenerator._Passed = [];
        let Code = ThreeNodeShaders.Single.Pool;
        let Shader:string = "";
        Shader += Code["FragmentHeader"];
        Shader = ThreeShaderGenerator.NodePass(Shader, Material.FindNodeByFunction("Output"), Material);
        Shader += Code["FragmentFooter"];
        return Shader;
    }
    private static NodePass(Shader:string, Node:Engine.MaterialNode, Material:Engine.Material) : string
    {
        if(ThreeShaderGenerator._Passed.indexOf(Node) != -1) return Shader;
        ThreeShaderGenerator._Passed.push(Node);
        let Code:string = ThreeNodeShaders.Single.Pool;
        let NodeCode:string = Code[Node.FunctionID];
        for(let i in Node.Inputs)
        {
            if(Node.Inputs[i].InputTarget)
            {
                Shader = ThreeShaderGenerator.NodePass(Shader, Material.FindNodeByName(Node.Inputs[i].InputTarget.ParentName), Material);
                NodeCode = this.ReplaceAll(NodeCode, "<"+Node.Inputs[i].Name.toUpperCase()+">", Node.Inputs[i].InputTarget.ParentName + "_" + Node.Inputs[i].InputTarget.Name);
            }
            else NodeCode = this.ReplaceAll(NodeCode, "<"+Node.Inputs[i].Name.toUpperCase()+">", ThreeShaderGenerator.CreateValue(Node.Inputs[i]));
        }
        for(let i in Node.Values)
        {
            NodeCode = this.ReplaceAll(NodeCode, "<"+Node.Values[i].Name.toUpperCase()+">", ThreeShaderGenerator.CreateValue(Node.Values[i]));
        }
        for(let i in Node.Outputs)
        {
            NodeCode = this.ReplaceAll(NodeCode, "<"+Node.Outputs[i].Name.toUpperCase()+">", Node.Name + "_" + Node.Outputs[i].Name);
        }
        Shader += NodeCode;
        return Shader;
    }
    private static ReplaceAll(Value:string, Val1:string, Val2:string) : string
    {
        while(Value.indexOf(Val1) != -1) Value = Value.replace(Val1, Val2);
        return Value;
    }
    private static CreateValue(NodeValue:Engine.MaterialNodeValue) : string
    {
        if(NodeValue.Type == Engine.MaterialNodeValueType.Bool)
        {
            if(NodeValue.Value) return "1";
            else return "0";
        }
        if(NodeValue.Type == Engine.MaterialNodeValueType.Int || NodeValue.Type == Engine.MaterialNodeValueType.Float)
        {
            return NodeValue.Value.toString();
        }
        if(NodeValue.Type == Engine.MaterialNodeValueType.Vector2)
        {
            let VVal:Math.Vertex = <Math.Vertex>NodeValue.Value;
            return "vec2(" + VVal.X + "," + VVal.Y + ")";
        }
        if(NodeValue.Type == Engine.MaterialNodeValueType.Vector3)
        {
            let VVal:Math.Vertex = <Math.Vertex>NodeValue.Value;
            return "vec3(" + VVal.X + "," + VVal.Y + "," + VVal.Z + ")";
        }
        if(NodeValue.Type == Engine.MaterialNodeValueType.Vector4)
        {
            let CVal:Math.Color = <Math.Color>NodeValue.Value;
            return "vec4(" + this.RToV(CVal.R) + "," + this.RToV(CVal.G) + "," + this.RToV(CVal.B) + "," + this.RToV(CVal.A) + ")";
        }
    }
    private static RToV(Value:number) : number
    {
        return Value / 255;
    }
}