export  { Color };

class Color
{
    public R:number;
    public G:number;
    public B:number;
    public A:number;
    public constructor()
    {
        this.R = 255;
        this.G = 255;
        this.B = 255;
        this.A = 255;
    }
    public Copy():Color
    {
        return Color.FromRGBA(this.R, this.G, this.B, this.A);
    }
    public ToArray() : number[]
    {
        return [(this.R * 1.0 + 1) / 256, (this.G * 1.0 + 1) / 256, (this.B * 1.0 + 1) / 256, (this.A * 1.0 + 1) / 256];
    }
    public static FromRGBA(R:number, G:number, B:number, A:number):Color
    {
        let New:Color = new Color();
        New.R = R;
        New.G = G;
        New.B = B;
        New.A = A;
        return New;
    }
    public Serialize() : any
    {
        let C = 
        {
            R: this.R,
            G: this.G,
            B: this.B,
            A: this.A
        };
        return C;
    }
    public Deserialize(Data:any) : void
    {
        this.R = Data.R;
        this.G = Data.G;
        this.B = Data.B;
        this.A = Data.A;
    }
    /// TODO
    /// Add some static basic colors for easy creation.
    public static Empty = Color.FromRGBA(0,0,0,0);
    public static Black = Color.FromRGBA(0,0,0,255);
    public static White = Color.FromRGBA(255,255,255,255);
}