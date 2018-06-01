export enum Axis { }
export const X: Axis;
export const Y: Axis;
export const Z: Axis;

export class Vertex
{
    X: number;
    Y: number;
    Z: number;
    constructor(X?:number, Y?:number, Z?:number)
    Copy() : Vertex
    Translate(V:Vertex) : Vertex
    Add(V:Vertex) : Vertex
    Substract(V:Vertex) : Vertex
    Scale(V: Vertex) : Vertex
    Scalar(Value:number) : Vertex
    RotateX(Angle:number) : Vertex
    RotateY(Angle:number) : Vertex
    RotateZ(Angle:number) : Vertex
    Length() : number
    Normalize() : Vertex
    Absolute() : Vertex
    ToArray() : number[]
    ToQuattroArray(W:number) : number[]
    Serialize() : any
    Deserialize(Data:any) : void
    static FromRGB(R:number, G:number, B:number) : Vertex
    static Cross(Left:Vertex, Right:Vertex) : Vertex
    static Distance(V1:Vertex, V2:Vertex) : number
    static CalculateAngle(V1:Vertex, V2:Vertex) : number
    static Angle(V1:Vertex, V2:Vertex) : number
}

export class Transformation
{
    Translation:Vertex;
    Rotation:Vertex;
    Scale:Vertex;
    constructor(Old?:Transformation)
    Copy():Transformation
    Serialize() : any
    Deserialize(Data) : void
}

export enum MatrixMode
{
    Projection,
    ModelView
}

export class Matrix
{
    Fields:number[];
    constructor(Fields?:number[])
    Copy() : Matrix
    Frustum(Left:number, Right:number, Bottom:number, Top:number, Near:number, Far:number) : Matrix
    Ortho(Left:number, Right:number, Bottom:number, Top:number, Near:number, Far:number) : Matrix
    Translate(X:number, Y:number, Z:number) : Matrix
    Scale(X:number, Y:number, Z:number) : Matrix
    Rotate(RotationAxis:Axis, Angle:number) : Matrix
    ToIdentity() : void
    static Multiply(M1:Matrix, M2:Matrix) : Matrix
    static CreateTranslate(X:number, Y:number, Z:number) : number[]
    static CreateScale(X:number, Y:number, Z:number) : number[]
    static CreateRotation(RotationAxis:Axis, Angle:number) : number[]
    static CreateEmpty() : number[]
    static CreateIdentity() : number[]
}

export class MatrixTransformer
{
    ProjectionMatrix:Matrix;
    ModelViewMatrix:Matrix;
    constructor()
    MatrixMode(Mode:MatrixMode) : void
    LoadMatrix(M:Matrix) : void
    LoadIdentity() : void
    PushMatrix() : void
    PopMatrix() : void
    MultMatrix(M:Matrix) : void
    Frustum(Left:number, Right:number, Bottom:number, Top:number, Near:number, Far:number) : void
    Ortho(Left:number, Right:number, Bottom:number, Top:number, Near:number, Far:number) : void
    Ortho2D(Left:number, Right:number, Bottom:number, Top:number) : void
    Translate(X:number, Y:number, Z:number) : void
    Scale(X:number, Y:number, Z:number) : void
    Rotate(Angle:number, X:number, Y:number, Z:number) : void
    Perspective(FieldOfView:number, Aspect:number, Near:number, Far:number) : void
    LookAt(Eye:Vertex, Target:Vertex, Up:Vertex) : void
    DefaultPerspective(Width:number, Height:number) : void
    DefaultView(Eye:Vertex, Target:Vertex) : void
    static TransformVertex(M:Matrix, ToTransform:Vertex) : Vertex
}

export class Color
{
    R:number;
    G:number;
    B:number;
    A:number;
    constructor()
    Copy():Color
    Lighten():Color
    Darken():Color
    ToArray() : number[]
    ToString() : string
    Serialize() : any
    Deserialize(Data:any) : void
    static Empty:Color;
    static Black:Color;
    static White:Color;
    static Aqua:Color;
    static Teal:Color;
    static Blue:Color;
    static Navy:Color;
    static Yellow:Color;
    static Olive:Color;
    static Lime:Color;
    static Green:Color;
    static Fuchsia:Color;
    static Purple:Color;
    static Red:Color;
    static Maroon:Color;
    static FromString( ColorString:string ) : Color
    static FromRGBA(R:number, G:number, B:number, A:number):Color
    static Blend(Color1:Color, Color2:Color, Ratio:number) : Color
}

export enum CollisionType
{
    Radius,
    Rectangular,
    Horizontal,
    Vertical
}

export class CollisionResult
{
    Collision:boolean;
    Top:boolean;
    Bottom:boolean;
    Left:boolean;
    Right:boolean;
    Front:boolean;
    Back:boolean;
    Colliders:any[];
    TopColliders:any[];
    BottomColliders:any[];
    LeftColliders:any[];
    RightColliders:any[];
    FrontColliders:any[];
    BackColliders:any[];
    Copy():CollisionResult;
    Revert():void
    Combine(Other:CollisionResult) : void
}

export class CollisionValue
{
    Active:boolean;
    Tags:string[];
    Scale:Vertex;
    Type:CollisionType;
    Result:CollisionResult;
    Specific:any;
    public constructor(Old?:CollisionValue)
    public Copy() : CollisionValue
    public Serialize() : any
    public Deserialize(Data) : void
}

export class ColliderObject
{
    Position:Vertex;
    Scale:Vertex;
    Type:CollisionType;
    Reference:any;
}

export class Collision
{
    static FocusOffset:number;
    static Check(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    static CheckRadius2DToRadius2D(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    static CheckRadius2DToRectangular2D(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    static CheckRadius2DToHorizontal2D(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    static CheckRadius2DToVertical2D(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    static CheckRectangular2DToRadius2D(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    static CheckRectangular2DToRectangular2D(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    static CheckRectangular2DToHorizontal2D(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    static CheckRectangular2DToVertical2D(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    static CheckRadius(Collider1:ColliderObject, Collider2:ColliderObject) : boolean
    static CheckRadiusToPoint(Collider:ColliderObject, Position:Vertex) : boolean
    static CheckRectangleToPoint(Collider:ColliderObject, Position:Vertex) : boolean
    static CheckRadiusToLineX(Collider:ColliderObject, X:number) : boolean
    static CheckRadiusToLineY(Collider:ColliderObject, Y:number) : boolean
    static CheckRectangleToLineX(Collider:ColliderObject, Position:Vertex) : boolean
    static GetCollisionCubic(Collider:ColliderObject, Position:Vertex) : CollisionResult
    static GetCollision4Way(Position1:Vertex, Position2:Vertex) : CollisionResult
    static GetCollision8Way(Position1:Vertex, Position2:Vertex) : CollisionResult
    static GetCollisionRectangularWay(Collider:ColliderObject, Position:Vertex) : CollisionResult
    static GetDefaultRectangularWay(Collider:ColliderObject, Position:Vertex) : CollisionResult
}

export class Random
{
    static Next(Min, Max) : number
}

export as namespace Math;