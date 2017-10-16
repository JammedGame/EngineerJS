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
    /// TODO
    /// Add some static basic colors for easy creation.
}