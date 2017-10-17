export { GLSLShaders }

class GLSLShaders
{
    public static Vertex2D : string = 
       `#version 300 es
        uniform mat4 ModelView;
        uniform mat4 Projection;
        in vec3 V_Vertex;
        in vec2 V_TextureUV;
        out vec3 F_Vertex;
        out vec2 F_TextureUV;

        void main()
        {
            F_Vertex = V_Vertex;
            F_TextureUV = V_TextureUV;
            gl_Position = Projection * ModelView * vec4(V_Vertex, 1);
        }
        `;
    public static Fragment2D : string = 
       `#version 300 es
        precision highp float;
        precision highp int;
        precision highp sampler2DArray;
        uniform int Index;
        uniform vec4 Color;
        uniform mat4 ModelView;
        uniform mat4 Projection;
        uniform sampler2DArray Textures;
        in vec3 F_Vertex;
        in vec2 F_TextureUV;
        out vec4 FinalColor;

        void main()
        {
            FinalColor = Color;
        }
        `;
}
/*
if(Index == -1)
            {
                FinalColor = Color;
            }
            else
            {
                FinalColor  = texture(Textures, vec3(F_TextureUV,Index));
            }
*/