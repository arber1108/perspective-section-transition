import React, { useRef } from 'react'
import { MeshTransmissionMaterial, useGLTF, Text } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { useScroll, useTransform } from 'framer-motion';

export default function Model() {
    const { nodes } = useGLTF("/medias/torrus.glb");
    const { viewport } = useThree()
    const torus = useRef(null);
    
    // Get scroll progress (0 to 1)
    const { scrollYProgress } = useScroll({
        target: { current: document.documentElement },
        offset: ['start start', 'end end']
    });
    
    // Map scroll progress to rotation (0 to 2π for a full rotation)
    const rotation = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 3]);
    
    useFrame(() => {
        if (torus.current) {
            // Update rotation based on scroll
            torus.current.rotation.x = rotation.get();
        }
    });

    const materialProps = useControls({
        thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
        roughness: { value: 0, min: 0, max: 1, step: 0.1 },
        transmission: {value: 1, min: 0, max: 1, step: 0.1},
        ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
        chromaticAberration: { value: 0.02, min: 0, max: 1},
        backside: { value: true},
    })
    
    return (
        <group scale={viewport.width / 3.75} >
            <Text  position={[0, 0, -1]} fontSize={0.5} color="white" anchorX="center" anchorY="middle">
                Arber Ademaj
            </Text>
            <mesh ref={torus} {...nodes.Torus002}>
                <MeshTransmissionMaterial {...materialProps}/>
            </mesh>
        </group>
    )
}
