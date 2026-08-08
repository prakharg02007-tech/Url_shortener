import { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Geometry } from 'ogl';

const OglWaves = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Initialize OGL Renderer
    const renderer = new Renderer({ alpha: true, antialias: true });
    const gl = renderer.gl;

    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';

    containerRef.current.appendChild(gl.canvas);

    // 2. Setup Scene Hierarchy
    const scene = new Transform();
    const camera = new Camera(gl, { fov: 45 });
    camera.position.set(0, 3, 8);
    camera.lookAt([0, 0, 0]);

    // 3. Create Grid Geometry (Vertices for lines)
    const size = 10;
    const subdivisions = 60;
    const positions = [];
    const indices = [];

    // Generate vertices in a grid layout
    for (let i = 0; i <= subdivisions; i++) {
      const z = (i / subdivisions - 0.5) * size;
      for (let j = 0; j <= subdivisions; j++) {
        const x = (j / subdivisions - 0.5) * size;
        positions.push(x, 0, z);
      }
    }

    // Connect vertices with line indices (rows and columns)
    for (let i = 0; i < subdivisions; i++) {
      for (let j = 0; j < subdivisions; j++) {
        const current = i * (subdivisions + 1) + j;
        const nextRow = (i + 1) * (subdivisions + 1) + j;
        const nextCol = current + 1;

        indices.push(current, nextCol);
        indices.push(current, nextRow);
      }
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array(positions) },
      index: { data: new Uint16Array(indices) },
    });

    // 4. Shaders (Handles real-time mathematical wave movement)
    const vertex = `
      attribute vec3 position;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      uniform float uTime;
      varying vec3 vPosition;

      void main() {
        vec3 pos = position;
        // Mathematical formula generating 3D line waves
        pos.y = sin(pos.x * 1.5 + uTime) * 0.3 + cos(pos.z * 1.5 + uTime) * 0.3;
        vPosition = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragment = `
      precision highp float;
      varying vec3 vPosition;
      void main() {
        // Subtle blue/cyan glow gradient based on wave height
        gl_FragColor = vec4(0.0, 0.5 + vPosition.y * 0.5, 1.0, 0.4);
      }
    `;

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
    });

    // Render as WebGL lines instead of solid triangles
    const mesh = new Mesh(gl, { mode: gl.LINES, geometry, program });
    mesh.setParent(scene);

    // 5. Responsive Resize Handler
    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
    };
    window.addEventListener('resize', resize);
    resize();

    // 6. Animation Frame Loop
    let animationId;
    const update = (t) => {
      animationId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001; // Pass time into shader
      mesh.rotation.y = t * 0.0001;            // Slow, hypnotic rotation
      renderer.render({ scene, camera });
    };
    animationId = requestAnimationFrame(update);

    // 7. Cleanup to prevent browser memory leaks
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#0a0a16'
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden'
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default OglWaves;