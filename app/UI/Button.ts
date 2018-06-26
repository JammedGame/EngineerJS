export { Button }

import * as Math from "./../Mathematics/Mathematics";

import { Label } from "./Label";
import { Settings } from "./../Engine/Settings";

import { ControlEventPackage } from "./ControlEventPackage";

class Button extends Label
{
    public get Events():ControlEventPackage { return <ControlEventPackage>this._Events; }
    public constructor(Old?:Button, Text?:string)
    {
        super(Old, Text);
        if(Old)
        {

        }
        else
        {
            this.BackColor = Math.Color.FromRGBA(127,127,127,255);
            this._Events = new ControlEventPackage();
        }
    }
    public Copy() : Button
    {
        return new Button(this);
    }
    public Update() : void
    {
        super.Update();
        if(Settings.IgnoreUICSS)
        {
            this.Element.style.cursor = "pointer";
        }
    }
    protected Create() : void
    {
        super.Create();
        this.Element.className += " button";
        this.Events.Connect(this, this.Element);
        this.Events.MouseEnter.push(this.OnMouseEnter.bind(this));
        this.Events.MouseLeave.push(this.OnMouseLeave.bind(this));
    }
    private OnMouseEnter(Event) : void
    {
        if(Settings.IgnoreUICSS)
        {
            this.Element.style.backgroundColor = this.BackColor.Copy().Lighten().ToString();
        }
    }
    private OnMouseLeave(Event) : void
    {
        if(Settings.IgnoreUICSS)
        {
            this.Element.style.backgroundColor = this.BackColor.ToString();
        }
    }
}