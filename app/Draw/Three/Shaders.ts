export { ThreeJSShaders }

class ThreeJSShaders
{
    public static Vertex2D : string = `
        varying vec2 vUv;
        void main()
        {
            vUv  = vec2(1.0 - uv.x, uv.y);
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `;
    public static Fragment2D : string = `
        uniform int index;
        uniform vec4 color;
        uniform sampler2D texture;
        varying vec2 vUv;
        void main()
        {
            if(index == -1)
            {
                gl_FragColor = color;
            }
            else
            {
                gl_FragColor = color * texture2D(texture, vUv);
            }
        }
        `;
    public static LitVertex2D : string = `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying mat4 vModelView;
        varying mat4 vProjection;
        void main()
        {
            vUv  = vec2(1.0 - uv.x, uv.y);
            vPosition = (projectionMatrix * modelViewMatrix * vec4( position, 1.0 )).xyz;
            vModelView = modelViewMatrix;
            vProjection = projectionMatrix;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `;
    public static LitFragment2D : string = `
        
        uniform int index;
        uniform vec4 color;
        uniform sampler2D texture;
        uniform sampler2D normalMap;
        uniform float intensities[8];
        uniform vec3 locations[8];
        uniform vec3 attenuations[8];
        uniform vec4 lightColors[8];

        varying vec2 vUv;
        varying vec3 vPosition;
        varying mat4 vModelView;
        varying mat4 vProjection;

        #define MAX_LIGHTS 8 

        void main()
        {
            vec4 finalColor = color;
            if(index != -1)
            {
                finalColor = color * texture2D(texture, vUv);
            }
            vec3 SurfacePosition = vPosition;
            vec3 finalLight = vec3(0.3,0.3,0.3);
            for(int i = 0; i < MAX_LIGHTS; i++)
            {
                if(intensities[i] > 0.0)
                {
                    vec3 lightLocation = locations[i];
                    vec3 distance = lightLocation - SurfacePosition;
                    vec3 surfaceToCamera = normalize(SurfacePosition - lightLocation);
                    distance = vec3(distance.x * 16.0 / 9.0, distance.yz);
                    float distanceToLight = length(distance);
                    float currentAttenuation = 1.0 / (attenuations[i].y * distanceToLight);
                    vec4 normalCoded = texture2D(normalMap, vUv);
                    vec3 normal = normalize(vec3(normalCoded.x * 2.0 - 1.0, normalCoded.y * 2.0 - 1.0, normalCoded.z * 2.0 - 1.0));
                    float shot = length(surfaceToCamera - normal);
                    currentAttenuation = intensities[i] * currentAttenuation * shot;
                    finalLight = vec3(finalLight + currentAttenuation * lightColors[i].rgb);
                }
            }
            finalColor = vec4(finalLight * finalColor.rgb, finalColor.a);
            gl_FragColor = finalColor;
        }
        `;
}