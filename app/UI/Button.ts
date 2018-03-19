export { Button }

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
        this.Events.Connect(this.Element);
    }
}