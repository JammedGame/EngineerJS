export { ControlEventPackage }

import * as Runner from "./../Runner/Runner";
import * as Engine from "./../Engine/Engine";

class ControlEventPackage extends Engine.EventPackage
{
    public get Click() : Function[] { return this._Data["Click"]; }
    public constructor(Old?:ControlEventPackage)
    {
        super(Old);
        if(Old)
        {

        }
        else
        {
            this._Data["Click"] = [];
        }
    }
    public Copy() : ControlEventPackage
    {
        return new ControlEventPackage(this);
    }
    public Connect(Element:HTMLElement) : void
    {
        Element.addEventListener("mousedown", this.OnClick.bind(this));
    }
    private PackEventArgs(Event) : any
    {
        let Args:any = 
        {
            ID: 0,
            Ctrl:Event.ctrlKey,
            Alt:Event.altKey,
            Shift:Event.shiftKey,
            MouseButton:<Engine.MouseButton>Event.button,
            UnscaledLocation: {X:Event.offsetX, Y:Event.offsetY},
            Location:{X:Event.offsetX, Y:Event.offsetY},
            Delta:Event.wheelDelta,
            KeyCode:Event.keyCode,
            Width:window.innerWidth,
            Height:window.innerHeight
        }
        if(Event.identifier) Args.ID = Event.identifier;
        return Args;
    }
    private OnClick(Event) : void
    {
        this.Invoke("Click", Runner.Runner.Current.Game, this.PackEventArgs(Event));
    }
}