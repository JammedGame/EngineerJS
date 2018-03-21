export { Label, TextAlign }

import { Settings } from "./../Engine/Settings";
import { Control } from "./Control";

enum TextAlign
{
    Left = "left",
    Right = "right",
    Center = "center"
}

class Label extends Control
{
    private _Text:string;
    private _Padding:number;
    private _TextAlign:TextAlign;
    private _TextElement:HTMLElement;
    public get Text():string { return this._Text; }
    public set Text(value:string) { this._Text = value; }
    public get Padding():number { return this._Padding; }
    public set Padding(value:number) { this._Padding = value; }
    public get TextAlign():TextAlign { return this._TextAlign; }
    public set TextAlign(value:TextAlign) { this._TextAlign = value; }
    public constructor(Old?:Label, Text?:string)
    {
        super(Old);
        if(Old)
        {
            this._Text = Old._Text;
            this._Padding = Old._Padding;
            this._TextAlign = Old._TextAlign;
        }
        else
        {
            if(Text) this._Text = Text;
            else this._Text = "";
            this._Padding = 5;
            this._TextAlign = TextAlign.Center;
        }
    }
    public Copy() : Label
    {
        return new Label(this);
    }
    public Update() : void
    {
        super.Update();
        if(Settings.IgnoreUICSS)
        {
            this.Element.style.textAlign = this._TextAlign;
            this.Element.style.padding = this._Padding + "px";
        }
        this._TextElement.innerText = this._Text;
    }
    protected Create() : void
    {
        super.Create();
        this.Element.className += " label";
        this._TextElement = <HTMLParagraphElement>(document.createElement('p'));
        this._TextElement.className = "text";
        this.Element.appendChild(this._TextElement);
    }
}