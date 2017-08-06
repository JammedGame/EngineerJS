#version 400
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
	if(Index == -1)
	{
		FinalColor = Color;
	}
	else
	{
		FinalColor  = texture(Textures, vec3(F_TextureUV,Index));
	}
}