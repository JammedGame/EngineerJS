export  { MaterialNodeValue };

import * as Math from "./../../Mathematics/Mathematics";

import { MaterialNodeValueHolder } from "./MaterialNodeValueHolder";

class MaterialNodeValue
{
    private _Name:string;
    private _Value:MaterialNodeValueHolder;
    private _InputTarget:MaterialNodeValue;
    private _OutputTargets:MaterialNodeValue[];
    public get Name():string { return this._Name; }
    public set Name(value:string) { this._Name = value; }
    public get Value():MaterialNodeValueHolder { return this._Value; }
    public set Value(value:MaterialNodeValueHolder) { this._Value = value; }
    public get InputTarget():MaterialNodeValue { return this._InputTarget; }
    public set InputTarget(value:MaterialNodeValue) { this._InputTarget = value; }
    public get OutputTargets():MaterialNodeValue[] { return this._OutputTargets; }
    public set OutputTargets(value:MaterialNodeValue[]) { this._OutputTargets = value; }
    public constructor(Old?:MaterialNodeValue, Name?:string)
    {
        if(Old)
        {
            this._Name = Old._Name;
            this._Value = Old._Value.Copy();
            this._InputTarget = null;
            this._OutputTargets = [];
        }
        else
        {
            if(Name) this._Name = Name;
            else this._Name = "Nameless";
            this._Value = new MaterialNodeValueHolder();
            this._InputTarget = null;
            this._OutputTargets = [];
        }
    }
    public Copy() : MaterialNodeValue
    {
        return new MaterialNodeValue(this);
    }
}
