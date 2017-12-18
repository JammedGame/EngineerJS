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
    public static Empty =       Color.FromRGBA(0,0,0,0);
    public static Black =       Color.FromRGBA(0,0,0,255);
    public static White =       Color.FromRGBA(255,255,255,255);
    public static Aqua =        Color.FromRGBA(0,255,255,255);
    public static Teal =        Color.FromRGBA(0,128,255,255);
    public static Blue =        Color.FromRGBA(0,0,255,255);
    public static Navy =        Color.FromRGBA(0,0,128,255);
    public static Yellow =      Color.FromRGBA(255,255,0,255);
    public static Olive =       Color.FromRGBA(128,128,0,255);
    public static Lime =        Color.FromRGBA(0,255,0,255);
    public static Green =       Color.FromRGBA(0,128,0,255);
    public static Fuchsia =     Color.FromRGBA(255,0,255,255);
    public static Purple =      Color.FromRGBA(128,0,128,255);
    public static Red =         Color.FromRGBA(255,0,0,255);
    public static Maroon =      Color.FromRGBA(128,0,0,255);
    public static FromString( ColorString:string ) : Color
    {
        let R = 0;
        let G = 0;
        let B = 0;
        let A = 255;
        if( ColorString.indexOf('#') === 0 )
        {
            ColorString = ColorString.substr(1);
            if(ColorString.length == 3)
            {
                R = parseInt(ColorString[0]+ColorString[0], 16);
                G = parseInt(ColorString[1]+ColorString[1], 16);
                B = parseInt(ColorString[2]+ColorString[2], 16);
            }
            else
            {
                R = parseInt(ColorString.substr(0,2), 16);
                G = parseInt(ColorString.substr(2,2), 16);
                B = parseInt(ColorString.substr(4,2), 16);
            }
            return Color.FromRGBA(R,G,B,255);
        }
        else if( ColorString.indexOf('rgb') === 0 )
        {
            let RGBA = ColorString.match(/\d+(\.\d+)?/g);
            R = parseInt(RGBA[0]);
            G = parseInt(RGBA[1]);
            B = parseInt(RGBA[2]);
            if(RGBA.length > 3) A = parseFloat(RGBA[3]) * 256 - 1;
            else A = 255;
            if(A < 0) A = 0;
            return Color.FromRGBA(R,G,B,A);
        }
        else if (ColorString.toUpperCase() == "EMPTY") return Color.Empty;
        else if (ColorString.toUpperCase() == "BLACK") return Color.Black;
        else if (ColorString.toUpperCase() == "WHITE") return Color.White;
        else if (ColorString.toUpperCase() == "AQUA") return Color.Aqua;
        else if (ColorString.toUpperCase() == "TEAL") return Color.Teal;
        else if (ColorString.toUpperCase() == "BLUE") return Color.Blue;
        else if (ColorString.toUpperCase() == "NAVY") return Color.Navy;
        else if (ColorString.toUpperCase() == "YELLOW") return Color.Yellow;
        else if (ColorString.toUpperCase() == "OLIVE") return Color.Olive;
        else if (ColorString.toUpperCase() == "LIME") return Color.Lime;
        else if (ColorString.toUpperCase() == "GREEN") return Color.Green;
        else if (ColorString.toUpperCase() == "FUCHSIA") return Color.Fuchsia;
        else if (ColorString.toUpperCase() == "PURPLE") return Color.Purple;
        else if (ColorString.toUpperCase() == "RED") return Color.Red;
        else if (ColorString.toUpperCase() == "MAROON") return Color.Maroon;
        else return Color.Empty;
    }
}