export { GLSLShaders }

class GLSLShaders
{
    public static Vertex2D : string = 
       `#version 300 es
        precision highp float;
        precision highp int;
        uniform mat4 ModelView;
        uniform mat4 Projection;
        layout(location = 0)    in vec3 V_Vertex;

        void main()
        {
            vec4 T = ModelView * Projection * vec4(V_Vertex, 1);
            gl_Position = Projection * ModelView * vec4(V_Vertex, 1);
        }
        `;
    public static Fragment2D : string = 
       `#version 300 es
        precision highp float;
        precision highp int;
        uniform vec4 Color;
        layout(location = 0)  out vec4 FinalColor;

        void main()
        {
            FinalColor = Color;
        }
        `;
}
/*
gl_Position = Projection * ModelView * vec4(V_Vertex, 1);
if(Index == -1)
            {
                FinalColor = Color;
            }
            else
            {
                FinalColor  = texture(Textures, vec3(F_TextureUV,Index));
            }
*/