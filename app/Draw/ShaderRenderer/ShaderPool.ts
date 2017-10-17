export  { ShaderPool };

class ShaderPool
{
    public constructor(Old?:ShaderPool)
    {
        if(Old != null)
        {
            this.Vertex = {};
            this.Fragment = {};
        }
        else
        {
            this.Vertex = {};
            this.Fragment = {};
        }
    }
    public Copy() : ShaderPool
    {
        return new ShaderPool(this);
    }
    public Vertex: { [key: string]:string; };
    public Fragment: { [key: string]:string; };
}