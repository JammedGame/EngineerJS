export { Button }

import { Label } from "./Label";

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
    protected Create() : void
    {
        super.Create();
        this.Element.className += " button";
        this.Events.Connect(this.Element);
    }
}