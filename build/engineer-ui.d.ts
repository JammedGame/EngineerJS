import * as Math from "./engineer-math";
import * as Engine from "./engineer-engine";

export class Border
{
    Width:number;
    Radius:number;
    Color:Math.Color;
    constructor(Old?:Border, Width?:number, Color?:Math.Color)
    Copy() : Border
    Apply(Element:HTMLElement)
}

export class ControlEventPackage extends Engine.EventPackage
{
    Click:Function[];
    MouseEnter:Function[];
    MouseLeave:Function[];
    constructor(Old?:ControlEventPackage)
    Copy() : ControlEventPackage
    Connect(Element:HTMLElement) : void
}

export class Control extends Engine.SceneObject
{
    Active:boolean;
    Position:Math.Vertex;
    Size:Math.Vertex;
    ForeColor:Math.Color;
    BackColor:Math.Color;
    Border:Border;
    Element:HTMLElement;
    constructor(Old?:Control)
    Copy() : Control
    Update() : void
}

export enum TextAlign
{
    Left = "left",
    Right = "right",
    Center = "center"
}

export class Label extends Control
{
    Text:string;
    Font:string;
    TextSize:number;
    Padding:number;
    TextAlign:TextAlign;
    constructor(Old?:Label, Text?:string)
    Copy() : Label
}

export class Button extends Label
{
    Events:ControlEventPackage;
    constructor(Old?:Button, Text?:string)
    Copy() : Button
}

export class Panel extends Control
{
    Children:Control[];
    constructor(Old?:Panel)
    Copy() : Panel
    Attach(Child:Control) : void
}