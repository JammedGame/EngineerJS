#version 400
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