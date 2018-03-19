export { Border }

import * as Math from "./../Mathematics/Mathematics";

class Border
{
    private _Width:number;
    private _Radius:number;
    private _Color:Math.Color;
    public get Width():number { return this._Width; }
    public set Width(value:number) { this._Width = value; }
    public get Radius():number { return this._Radius; }
    public set Radius(value:number) { this._Radius = value; }
    public get Color():Math.Color { return this._Color; }
    public set Color(value:Math.Color) { this._Color = value; }
    public constructor(Old?:Border, Width?:number, Color?:Math.Color)
    {
        if(Old)
        {
            this._Width = Old._Width;
            this._Color = Old._Color.Copy();
            this._Radius = Old._Radius;
        }
        else
        {
            if(Width) this._Width = Width;
            else this._Width = 1;
            if(Color) this._Color = Color;
            else this._Color = Math.Color.White;
            this._Radius = 0;
        }
    }
    public Copy() : Border
    {
        return new Border(this);
    }
    public Apply(Element:HTMLElement)
    {
        Element.style.borderWidth = this._Width.toString();
        Element.style.borderRadius = this._Radius.toString();
        Element.style.borderColor = this._Color.ToString();
    }
}