export { ThreeBasicShaders }

class ThreeBasicShaders
{
    public static Vertex2D : string = `
        varying vec2 vUv;
        uniform float repeatx;
        uniform float repeaty;
        void main()
        {
            vUv  = vec2((1.0 - uv.x)*repeatx, uv.y*repeaty);
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `;
    public static LitVertex2D : string = `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main()
        {
            vUv  = vec2(1.0 - uv.x, uv.y);
            vec4 pos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            vPosition = pos.xyz;
			gl_Position = pos;
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
    public static DefaultHeader : string = `
        uniform int index;
        uniform vec4 color;
        uniform sampler2D texture;
        uniform sampler2D normalMap;
        uniform float intensities[8];
        uniform vec3 locations[8];
        uniform vec3 attenuations[8];
        uniform vec4 lightColors[8];
        uniform vec3 lightDirection[8];
        uniform float lightParameters[8];
        uniform int lightTypes[8];
        uniform vec4 ambient;

        varying vec2 vUv;
        varying vec3 vPosition;

        #define MAX_LIGHTS 8 

        void main()
        {
        `;
    public static DefaultFooter : string = `
            gl_FragColor = finalColor;
        }
        `;
    public static ColorCalculation : string = `
            vec4 finalColor = color;
            if(index != -1)
            {
                finalColor = color * texture2D(texture, vUv);
            }
        `;
    public static LightCalculation : string = `
            vec3 SurfacePosition = vPosition;
            vec3 finalLight = ambient.rgb;
            for(int i = 0; i < MAX_LIGHTS; i++)
            {
                if(intensities[i] > 0.0)
                {
                    vec3 lightLocation = locations[i];
                    vec3 distance = lightLocation - SurfacePosition;
                    distance = vec3(distance.x * 16.0 / 9.0, distance.y, 0);
                    float distanceToLight = length(distance) * 10.0;
                    float currentAttenuation = 1.0 / (attenuations[i].x + attenuations[i].y * distanceToLight + attenuations[i].z * distanceToLight * distanceToLight);
                    currentAttenuation = intensities[i] * currentAttenuation;
                    finalLight = vec3(finalLight + currentAttenuation * lightColors[i].rgb);
                }
            }
            finalColor = vec4(finalLight * finalColor.rgb, finalColor.a);
        `;
    public static LightNormalCalculation : string = `
            vec3 SurfacePosition = vPosition;
            vec3 finalLight = ambient.rgb;
            for(int i = 0; i < MAX_LIGHTS; i++)
            {
                if(intensities[i] > 0.0)
                {
                    vec3 lightLocation = locations[i];
                    vec3 distance = lightLocation - SurfacePosition;
                    vec3 surfaceToCamera = normalize(SurfacePosition - lightLocation);
                    distance = vec3(distance.x * 16.0 / 9.0, distance.y, 0);
                    float distanceToLight = length(distance) * 10.0;
                    float currentAttenuation = 1.0 / (attenuations[i].x + attenuations[i].y * distanceToLight + attenuations[i].z * distanceToLight * distanceToLight);
                    vec4 normalCoded = texture2D(normalMap, vUv);
                    vec3 normal = normalize(vec3(normalCoded.x * 2.0 - 1.0, normalCoded.y * 2.0 - 1.0, normalCoded.z * 2.0 - 1.0));
                    float shot = length(surfaceToCamera - normal);
                    currentAttenuation = intensities[i] * currentAttenuation * shot;
                    finalLight = vec3(finalLight + currentAttenuation * lightColors[i].rgb);
                }
            }
            finalColor = vec4(finalLight * finalColor.rgb, finalColor.a);
        `;
    public static PostProcessMignola : string = `
            vec3 SurfacePosition = vPosition;
            float finalLight = 0.0;
            for(int i = 0; i < MAX_LIGHTS; i++)
            {
                if(intensities[i] > 0.0)
                {
                    vec3 lightLocation = locations[i];
                    vec3 distance = lightLocation - SurfacePosition;
                    vec3 surfaceToCamera = normalize(SurfacePosition - lightLocation);
                    distance = vec3(distance.x * 16.0 / 9.0, distance.y, 0);
                    float distanceToLight = length(distance) * 10.0;
                    float currentAttenuation = 1.0 / (attenuations[i].x + attenuations[i].y * distanceToLight + attenuations[i].z * distanceToLight * distanceToLight);
                    vec4 normalCoded = texture2D(normalMap, vUv);
                    vec3 normal = normalize(vec3(normalCoded.x * 2.0 - 1.0, normalCoded.y * 2.0 - 1.0, normalCoded.z * 2.0 - 1.0));
                    float shot = length(surfaceToCamera - normal);
                    finalLight = intensities[i] * currentAttenuation * shot * shot * shot;
                }
            }
            if(finalLight > 0.9) finalColor = vec4(3.0 * finalColor.rgb, finalColor.a);
            else if(finalLight > 0.7)finalColor = vec4(2.0 * finalColor.rgb, finalColor.a);
            else finalColor = vec4(1.0 * finalColor.rgb, finalColor.a);
        `;
    public static get LitFragment2D() : string { return this.DefaultHeader + this.ColorCalculation + this.LightCalculation + this.DefaultFooter; }
    public static get LitNormalFragment2D() : string { return this.DefaultHeader + this.ColorCalculation + this.LightNormalCalculation + this.DefaultFooter; }
}