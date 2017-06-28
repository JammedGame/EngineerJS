export  { Game };

class Game
{
    private _Name:string;
    public get Name():string { return this._Name; }
    public set Name(value) { this._Name = value; }
    public constructor()
    {
    }
    public Copy(G:Game) : void
    {
        this._Name = G._Name;
    }
}