export { Label, TextAlign }

import * as Mathematics from "./../Mathematics/Mathematics";

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
    private _Font:string;
    private _Padding:number;
    private _TextSize:number;
    private _TextAlign:TextAlign;
    private _TextElement:HTMLElement;
    public get Text():string { return this._Text; }
    public set Text(value:string) { this._Text = value; }
    public get Font():string { return this._Font; }
    public set Font(value:string) { this._Font = value; }
    public get TextSize():number { return this._TextSize; }
    public set TextSize(value:number) { this._TextSize = value; }
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
            this._Font = Old._Font;
            this._TextSize = Old._TextSize;
            this._Padding = Old._Padding;
            this._TextAlign = Old._TextAlign;
        }
        else
        {
            if(Text) this._Text = Text;
            else this._Text = "";
            this._Font = Settings.GlobalFontFamily;
            this._Padding = 5;
            this._TextSize = 40;
            this._TextAlign = TextAlign.Center;
            this.Size = new Mathematics.Vertex(300,60);
            this.Position = new Mathematics.Vertex(960,540,0.1);
            this.ForeColor = Mathematics.Color.White;
            this.BackColor = Mathematics.Color.Empty;
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
            this.Element.style.fontFamily = this._Font;
            this.Element.style.fontSize = Math.floor(Settings.GlobalFontScale * this._Scale.Y * this._TextSize) + "px";
            this.Element.style.textAlign = this._TextAlign;
            this.Element.style.padding = Math.floor(this._Scale.Y * this._Padding) + "px";
            this.Element.style.overflow = "hidden";
        }
        this._TextElement.style.margin = "0px";
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