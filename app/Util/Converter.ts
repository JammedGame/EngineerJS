export  { Converter };

import * as Data from "./../Data/Data"
import * as Math from "./../Mathematics/Mathematics";

class Converter
{
    public static ConvertVerticesToByteArray(Vertices:Math.Vertex[], Relevant:number) : Float32Array
    {
        let NewArrayBuffer:number[] = [];
        for(let i = 0; i < Vertices.length; i++)
        {
            NewArrayBuffer.push(Vertices[i].X);
            if(Relevant > 1) NewArrayBuffer.push(Vertices[i].Y);
            else if(Relevant > 2) NewArrayBuffer.push(Vertices[i].Z);
        }
        return new Float32Array(NewArrayBuffer);
    }
}