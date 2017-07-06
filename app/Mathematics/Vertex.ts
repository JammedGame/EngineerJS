export  { Axis, Vertex };

enum Axis
{
    X, Y, Z
}
class Vertex
{
    public X: number;
    public Y: number;
    public Z: number;
    public constructor(X:number, Y:number, Z:number = 0)
    {
        this.X = X;
        this.Y = Y;
        this.Z = Z;
    }
    public Copy() : Vertex
    {
        let New:Vertex = new Vertex(this.X, this.Y, this.Z);
        return New;
    }
    public Translate(V:Vertex) : Vertex
    {
        this.X += V.X;
        this.Y += V.Y;
        this.Z += V.Z;
        return this;
    }
    public Scale(V: Vertex) : Vertex
    {
        this.X *= V.X;
        this.Y *= V.Y;
        this.Z *= V.Z;
        return this;
    }
    public Scalar(Value:number) : Vertex
    {
        this.X *= Value;
        this.Y *= Value;
        this.Z *= Value;
        return this;
    }
    public RotateX(Angle:number) : Vertex
    {
        let OY:number = this.Y;
        let OZ:number = this.Z;
        this.Y = Math.cos((Angle / 180) * Math.PI) * OY - Math.sin((Angle / 180) * Math.PI) * OZ;
        this.Z = Math.cos((Angle / 180) * Math.PI) * OZ + Math.sin((Angle / 180) * Math.PI) * OY;
        return this;
    }
    public RotateY(Angle:number) : Vertex
    {
        let OX:number = this.X;
        let OZ:number = this.Z;
        this.X = Math.cos((Angle / 180) * Math.PI) * OX + Math.sin((Angle / 180) * Math.PI) * OZ;
        this.Z = Math.cos((Angle / 180) * Math.PI) * OZ - Math.sin((Angle / 180) * Math.PI) * OX;
            return this;
    }
    public RotateZ(Angle:number) : Vertex
    {
        let OX:number = this.X;
        let OY:number = this.Y;
        this.X = Math.cos((Angle / 180) * Math.PI) * OX - Math.sin((Angle / 180) * Math.PI) * OY;
        this.Y = Math.cos((Angle / 180) * Math.PI) * OY + Math.sin((Angle / 180) * Math.PI) * OX;
        return this;
    }
    public Length() : number
    {
        return Math.sqrt(this.X * this.X + this.Y * this.Y + this.Z * this.Z);
    }
    public Normalize() : Vertex
    {
        let Divider:number = 1.0 / this.Length();
        this.Scalar(Divider);
        return this;
    }
    public ToArray() : number[]
    {
        return [this.X, this.Y, this.Z];
    }
    public ToQuattroArray(W:number) : number[]
    {
        return [this.X, this.Y, this.Z, W];
    }
    public static FromRGB(R:number, G:number, B:number) : Vertex
    {
        return new Vertex((R * 1.0 + 1) / 256, (G * 1.0 + 1) / 256, (B * 1.0 + 1) / 256);
    }
    public static Cross(Left:Vertex, Right:Vertex)
    {
        return new Vertex(Left.Y * Right.Z - Left.Z * Right.Y, Left.Z * Right.X - Left.X * Right.Z, Left.X * Right.Y - Left.Y * Right.X);
    }
}
