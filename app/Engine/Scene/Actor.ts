export  { Actor };

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";
import * as Materials from "./../Materials/Materials";

import { DrawObject, DrawObjectType } from "./DrawObject";

class Actor extends DrawObject
{
    private _ExternData:any;
    private _Geometries:Math.Geometry[];
    private _Materials:Materials.Material[];
    private _GeometryMaterialIndices:number[];
    public get ExternData():any { return this._ExternData; }
    public set ExternData(value:any) {this._ExternData = value;}
    public get Geometries():Math.Geometry[] { return this._Geometries; }
    public set Geometries(value:Math.Geometry[]) {this._Geometries = value;}
    public get Materials():Materials.Material[] { return this._Materials; }
    public set Materials(value:Materials.Material[]) {this._Materials = value;}
    public get GeometryMaterialIndices():number[] { return this._GeometryMaterialIndices; }
    public set GeometryMaterialIndices(value:number[]) {this._GeometryMaterialIndices = value;}
    public constructor(Old?:Actor)
    {
        super(Old);
        this.DrawType = DrawObjectType.Actor;
        if(Old)
        {
            this._Geometries = [];
            for(let i = 0; i < Old._Geometries.length; i++) this._Geometries.push(Old._Geometries[i].Copy());
            this._Materials = [];
            for(let i = 0; i < Old._Materials.length; i++) this._Materials.push(Old._Materials[i].Copy());
            this._GeometryMaterialIndices = Old._GeometryMaterialIndices.slice();
        }
        else
        {
            this._Geometries = [];
            this._Materials = [];
            this._GeometryMaterialIndices = [];
        }
    }
    public Copy() : Actor
    {
        return new Actor(this);
    }
}