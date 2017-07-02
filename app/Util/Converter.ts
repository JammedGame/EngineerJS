export  { Converter };

import * as Data from "./../Data/Data"
import * as Math from "./../Mathematics/Mathematics";

class Converter
{
    public static ConvertVerticesToByteArray(Vertices:Math.Vertex[], Relevant:number) : ArrayBuffer
    {
        let NewArrayBuffer:ArrayBuffer = new ArrayBuffer(Vertices.length * Relevant * 4);
        let Stream = new Data.DataStream(NewArrayBuffer, 0, Data.DataStream.LITTLE_ENDIAN);
        for(let i = 0; i < Vertices.length; i++)
        {
            Stream.writeFloat32Array([Vertices[i].X]);
            if(Relevant > 1) Stream.writeFloat32Array([Vertices[i].Y]);
            else if(Relevant > 2) Stream.writeFloat32Array([Vertices[i].Z]);
        }
        return NewArrayBuffer;
    }
    public static ConvertNumberArrayToByteArray(Array:number[]) : ArrayBuffer
    {
        let NewArrayBuffer:ArrayBuffer = new ArrayBuffer(Array.length * 4);
        let Stream = new Data.DataStream(NewArrayBuffer, 0, Data.DataStream.LITTLE_ENDIAN);
        Stream.writeFloat32Array(Array);
        return NewArrayBuffer;
    }
}