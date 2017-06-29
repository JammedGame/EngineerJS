export  { Game };

class Game
{
    private _Name:string;
    public get Name():string { return this._Name; }
    public set Name(value:string) { this._Name = value; }
    public constructor()
    {
    }
    public Copy() : Game
    {
        let New:Game = new Game();
        New._Name = this._Name;
        return New;
    }
}