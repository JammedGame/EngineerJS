export { Panel }

import { Settings } from "./../Engine/Settings";
import { Control } from "./Control";

class Panel extends Control
{
    private _Children:Control[];
    public get Children():Control[] { return this._Children; }
    public constructor(Old?:Panel)
    {
        super(Old);
        this._Children = [];
        if(Old)
        {
            for(let i in Old._Children)
            {
                this._Children.push(Old._Children[i].Copy())
            }
        }
        else
        {
            
        }
    }
    public Copy() : Panel
    {
        return new Panel(this);
    }
    public Update() : void
    {
        super.Update();
        if(!this.Element) return;
        for(let i in this._Children)
        {
            this._Children[i].Offset = this.Position;
            this._Children[i].Update();
        }
    }
    protected Create() : void
    {
        super.Create();
        this.Element.className += " panel";
        for(let i in this._Children)
        {
            this._Children[i].Update();
            this.Element.appendChild(this._Children[i].Element);
        }
    }
    public Attach(Child:Control) : void
    {
        this._Children.push(Child);
    }
    public OnAttach(Args:any) : void
    {
        // Override
        for(let i in this._Children) Args.Scene.Attach(this._Children[i]);
    }
    public OnRemove(Args:any) : void
    {
        // Override
        for(let i in this._Children) Args.Scene.Remove(this._Children[i]);
    }
    public OnToggle(Value:boolean) : void
    {
        // Override
        for(let i in this._Children) this._Children[i].Active = Value;
    }
}