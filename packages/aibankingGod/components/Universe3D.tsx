import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { SovereignNode, SovereignGraphOutput } from '../types/security';

interface Universe3DProps {
  graphData: SovereignGraphOutput;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
}

const NodeMesh: React.FC<{
  id: string;
  node: SovereignNode;
  position: [number, number, number];
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ id, node, position, isSelected, onSelect }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.01;
      if (isSelected) {
        mesh.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 5) * 0.1);
      } else {
        mesh.current.scale.setScalar(1);
      }
    }
  });

  const color = useMemo(() => {
    if (node.Type.includes('Control')) return '#60a5fa'; // Blue
    if (node.Type.includes('Financial')) return '#34d399'; // Emerald
    if (node.Type.includes('Auditor')) return '#f87171'; // Red
    return '#a78bfa'; // Purple
  }, [node.Type]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh
        ref={mesh}
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 2 : 0.5}
          metalness={0.8}
          roughness={0.2}
        />
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {node.Name}
        </Text>
      </mesh>
    </Float>
  );
};

const EdgeLine: React.FC<{ start: [number, number, number]; end: [number, number, number] }> = ({ start, end }) => {
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    // @ts-ignore
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="#ffffff" opacity={0.2} transparent />
    </line>
  );
};

const Universe3D: React.FC<Universe3DProps> = ({ graphData, selectedNodeId, onSelectNode }) => {
  const nodePositions = useMemo(() => {
    const positions: Record<string, [number, number, number]> = {};
    const keys = Object.keys(graphData.Nodes);
    keys.forEach((id, i) => {
      const phi = Math.acos(-1 + (2 * i) / keys.length);
      const theta = Math.sqrt(keys.length * Math.PI) * phi;
      const radius = 8;
      positions[id] = [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      ];
    });
    return positions;
  }, [graphData.Nodes]);

  return (
    <div className="h-[500px] w-full bg-black rounded-3xl overflow-hidden border border-purple-500/20">
      <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {Object.entries(graphData.Nodes).map(([id, node]) => (
          <NodeMesh
            key={id}
            id={id}
            node={node}
            position={nodePositions[id]}
            isSelected={selectedNodeId === id}
            onSelect={onSelectNode}
          />
        ))}

        {graphData.Edges.map((edge, i) => {
          const start = nodePositions[edge.source];
          const end = nodePositions[edge.target];
          if (start && end) {
            return <EdgeLine key={i} start={start} end={end} />;
          }
          return null;
        })}

        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  );
};

export default Universe3D;
