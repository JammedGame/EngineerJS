export { CollisionResult }

class CollisionResult
{
    private _Collision:boolean;
    private _Top:boolean;
    private _Bottom:boolean;
    private _Left:boolean;
    private _Right:boolean;
    private _Colliders:any[];
    private _TopColliders:any[];
    private _BottomColliders:any[];
    private _LeftColliders:any[];
    private _RightColliders:any[];
    public get Collision():boolean { return this._Collision; }
    public set Collision(value:boolean) { this._Collision = value; }
    public get Top():boolean { return this._Top; }
    public set Top(value:boolean) { this._Top = value; }
    public get Bottom():boolean { return this._Bottom; }
    public set Bottom(value:boolean) { this._Bottom = value; }
    public get Left():boolean { return this._Left; }
    public set Left(value:boolean) { this._Left = value; }
    public get Right():boolean { return this._Right; }
    public set Right(value:boolean) { this._Right = value; }
    public get Colliders():any[] { return this._Colliders; }
    public set Colliders(value:any[]) { this._Colliders = value; }
    public get TopColliders():any[] { return this._TopColliders; }
    public set TopColliders(value:any[]) { this._TopColliders = value; }
    public get BottomColliders():any[] { return this._BottomColliders; }
    public set BottomColliders(value:any[]) { this._BottomColliders = value; }
    public get LeftColliders():any[] { return this._LeftColliders; }
    public set LeftColliders(value:any[]) { this._LeftColliders = value; }
    public get RightColliders():any[] { return this._RightColliders; }
    public set RightColliders(value:any[]) { this._RightColliders = value; }
    public constructor(Old?:CollisionResult)
    {
        if(Old)
        {
            this._Collision = Old._Collision;
            this._Top = Old._Top;
            this._Bottom = Old._Bottom;
            this._Left = Old._Left;
            this._Right = Old._Right;
            this._Colliders = [];
            for(let i in Old._Colliders) this._Colliders.push(Old._Colliders[i]);
            this._TopColliders = [];
            for(let i in Old._TopColliders) this._TopColliders.push(Old._TopColliders[i]);
            this._BottomColliders = [];
            for(let i in Old._BottomColliders) this._BottomColliders.push(Old._BottomColliders[i]);
            this._LeftColliders = [];
            for(let i in Old._LeftColliders) this._LeftColliders.push(Old._LeftColliders[i]);
            this._RightColliders = [];
            for(let i in Old._RightColliders) this._RightColliders.push(Old._RightColliders[i]);
        }
        else
        {
            this._Collision = false;
            this._Top = false;
            this._Bottom = false;
            this._Left = false;
            this._Right = false;
            this._Colliders = [];
            this._TopColliders = [];
            this._BottomColliders = [];
            this._LeftColliders = [];
            this._RightColliders = [];
        }
    }
    public Copy() : CollisionResult
    {
        return new CollisionResult(this);
    }
    public Revert() : void
    {
        let Store:boolean = this._Top;
        this._Top = this._Bottom;
        this._Bottom = Store;
        Store = this._Left;
        this._Left = this._Right;
        this._Right = Store;
        let StoreArray:any[] = this._TopColliders;
        this._TopColliders = this._BottomColliders;
        this._BottomColliders = StoreArray;
        StoreArray = this._LeftColliders;
        this._LeftColliders = this._RightColliders;
        this._RightColliders = StoreArray;
    }
    public Combine(Other:CollisionResult) : void
    {
        this._Collision = this._Collision || Other._Collision;
        this._Top = this._Top || Other._Top;
        this._Bottom = this._Bottom || Other._Bottom;
        this._Left = this._Left || Other._Left;
        this._Right = this._Right || Other._Right;
        for(let i in Other._Colliders) this._Colliders.push(Other._Colliders[i]);
        for(let i in Other._TopColliders) this._TopColliders.push(Other._TopColliders[i]);
        for(let i in Other._BottomColliders) this._BottomColliders.push(Other._BottomColliders[i]);
        for(let i in Other._LeftColliders) this._LeftColliders.push(Other._LeftColliders[i]);
        for(let i in Other._RightColliders) this._RightColliders.push(Other._RightColliders[i]);
    }
}