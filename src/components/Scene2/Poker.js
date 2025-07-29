import React, { useRef, Suspense } from 'react';
import { MeshTransmissionMaterial, useGLTF, Text } from "@react-three/drei";
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';

export default function Poker() {
    const { nodes, materials } = useGLTF("/medias/chip_style_1.glb");
    const chip = useRef(null);

    // Log the loaded nodes and materials for debugging
    React.useEffect(() => {
        console.log('Loaded nodes:', nodes);
        console.log('Loaded materials:', materials);
    }, [nodes, materials]);

    const materialProps = useControls({
        thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
        roughness: { value: 0.7, min: 0, max: 1, step: 0.1 },
        transmission: { value: 0.5, min: 0, max: 1, step: 0.1 },
        ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
        chromaticAberration: { value: 0.02, min: 0, max: 1 },
        backside: { value: true },
    });

    // Add some rotation animation
    useFrame(({ clock }) => {
        if (chip.current) {
            chip.current.rotation.y = clock.getElapsedTime() * 0.3;
        }
    });

    if (!nodes || !materials) {
        return <Text color="white">Loading model...</Text>;
    }

    // Try to find the main chip mesh in the loaded nodes
    const chipMesh = nodes.chip || nodes.chip_black_0 || nodes.chip_golden_0 || 
                    Object.values(nodes).find(node => node.isMesh);

    if (!chipMesh) {
        console.error('Could not find chip mesh in loaded nodes');
        return <Text color="red">Error: Could not load chip model</Text>;
    }

    return (
        <group ref={chip} scale={[0.5, 0.5, 0.5]} position={[0, 0, 0]}>
            <primitive 
                object={chipMesh.clone()} 
                dispose={null}
            >
                <MeshTransmissionMaterial {...materialProps} />
            </primitive>
        </group>
    );
}

// Preload the model
useGLTF.preload("/medias/chip_style_1.glb");