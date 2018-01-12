export { ThreeShaderGenerator }

import * as Math from "./../../Mathematics/Mathematics";
import * as Engine from "./../../Engine/Engine";

import { ThreeNodeShaders } from "./ThreeNodeShaders";

class ThreeShaderGenerator
{
    public static GenerateFragment(Material:Engine.Material) : string
    {
        let Code = ThreeNodeShaders.Single.Pool;
        let Shader:string = "";
        Shader += Code["FragmentHeader"];
        Shader = ThreeShaderGenerator.NodePass(Shader, Material.FindNodeByFunction("Output"), Material);
        Shader += Code["FragmentFooter"];
        console.log(Shader);
        return Shader;
    }
    private static NodePass(Shader:string, Node:Engine.MaterialNode, Material:Engine.Material) : string
    {
        let Code:string = ThreeNodeShaders.Single.Pool;
        let NodeCode:string = Code[Node.FunctionID];
        for(let i in Node.Inputs)
        {
            if(Node.Inputs[i].InputTarget)
            {
                Shader = ThreeShaderGenerator.NodePass(Shader, Material.FindNodeByName(Node.Inputs[i].InputTarget.ParentName), Material);
                NodeCode.replace("<"+Node.Inputs[i].Name.toUpperCase()+">", Node.Inputs[i].InputTarget.ParentName + "_" + Node.Inputs[i].InputTarget.Name);
            }
            else NodeCode.replace("<"+Node.Inputs[i].Name.toUpperCase()+">", ThreeShaderGenerator.CreateValue(Node.Inputs[i]));
        }
        for(let i in Node.Values)
        {
            NodeCode.replace("<"+Node.Values[i].Name.toUpperCase()+">", ThreeShaderGenerator.CreateValue(Node.Values[i]));
        }
        for(let i in Node.Outputs)
        {
            NodeCode.replace("<"+Node.Outputs[i].Name.toUpperCase()+">", Node.Name + "_" + Node.Outputs[i].Name);
        }
        Shader += NodeCode;
        return Shader;
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
            return "vec4(" + CVal.R + "," + CVal.G + "," + CVal.B + "," + CVal.A + ")";
        }
    }
}