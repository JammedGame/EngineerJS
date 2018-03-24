export  { EventPackage };

import { Game } from "./../Game/Game";

class EventPackage
{
    protected _Data:any;
    public constructor(Old?:EventPackage)
    {
        this._Data = {};
        if(Old != null)
        {
            for(let key of Object.keys(Old._Data))
            {
                this._Data[key] = [];
                for(let i in Old._Data[key])
                {
                    this._Data[key].push(Old._Data[key][i]);
                }
            }
        }
    }
    public Copy() : EventPackage
    {
        return new EventPackage(this);
    }
    public Invoke(EventName:string, CurrentGame:Game, Args) : boolean
    {
        let EventsList:Function[] = this._Data[EventName];
        return this.InvokeEvents(EventsList, CurrentGame, Args);
    }
    private InvokeEvents(Events:Function[], CurrentGame:Game, Args) : boolean
    {
        if(Events.length == 0) return false;
        let Handled:boolean = false;
        for(let i = 0; i < Events.length; i++)
        {
            Handled = Handled || Events[i](CurrentGame, Args);
        }
        return Handled;
    }
}