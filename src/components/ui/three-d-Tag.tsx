/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";
import * as THREE from "three";
import { memo, useEffect, useRef, useState } from "react";
import { Canvas, extend, useThree, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  type RapierRigidBody,
  RigidBody,
  type RigidBodyProps,
  useRopeJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useIsMobile } from "@/hooks/use-mobile";

extend({ MeshLineGeometry, MeshLineMaterial });
useGLTF.preload(
  "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb",
);
useTexture.preload(
  "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg",
);

interface Text3DProps {
  image: string;
  onDoubleClick: () => void;
}

export default function Tag3d({ image, onDoubleClick }: Text3DProps) {
  const isMobile = useIsMobile();
  return (
    <Canvas
      camera={{ position: [0, 0, isMobile ? 24 : 25], fov: 25 }}
      dpr={[1, 2]} // Ensures consistent resolution
      style={{ width: "100%", height: "100%", touchAction: "none" }}
    >
      <ambientLight intensity={Math.PI} />
      <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
        <Band image={image} onDoubleClick={onDoubleClick} isMobile={isMobile} />
      </Physics>
      <Environment blur={0.75}>
        <color attach="background" args={["black"]} />
        <Lightformer
          intensity={2}
          color="white"
          position={[0, -1, 5]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[-1, -1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[1, 1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={10}
          color="white"
          position={[-10, 0, 14]}
          rotation={[0, Math.PI / 2, Math.PI / 3]}
          scale={[100, 10, 1]}
        />
      </Environment>
    </Canvas>
  );
}

const Band = memo(
  ({
    maxSpeed = 50,
    minSpeed = 10,
    image,
    onDoubleClick,
    isMobile
  }: {
    maxSpeed?: number;
    minSpeed?: number;
    image: string;
    onDoubleClick: () => void;
    isMobile: boolean;
  }) => {
    const band = useRef<THREE.Mesh>(null),
      fixed = useRef<RapierRigidBody | null>(null),
      j1 = useRef<RapierRigidBody | null>(null),
      j2 = useRef<RapierRigidBody | null>(null),
      j3 = useRef<RapierRigidBody | null>(null),
      card = useRef<RapierRigidBody | null>(null);
    const vec = new THREE.Vector3(),
      ang = new THREE.Vector3(),
      rot = new THREE.Vector3(),
      dir = new THREE.Vector3();
    const segmentProps: RigidBodyProps = {
      type: "dynamic",
      canSleep: true,
      colliders: false,
      angularDamping: 2,
      linearDamping: 2,
    };
    const { nodes, materials } = useGLTF(
      "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb",
    );
    const texture = useTexture(
      "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg",
    );

    const imageTexture = useTexture(image);

    imageTexture.anisotropy = 16;
    imageTexture.wrapS = THREE.ClampToEdgeWrapping;
    imageTexture.wrapT = THREE.ClampToEdgeWrapping;
    imageTexture.flipY = false;
    imageTexture.repeat.set(1.9, 1.3); // Scale to fit (modify if needed)
    imageTexture.offset.set(0, 0);

    const { width, height } = useThree((state) => state.size);
    const [curve] = useState(
      () =>
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
        ]),
    );
    const [dragged, drag] = useState<THREE.Vector3 | boolean>(false);
    const [hovered, hover] = useState(false);

    useRopeJoint(fixed , j1, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]) // prettier-ignore
    useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.41, 0]]) // prettier-ignore

    useEffect(() => {
      if (hovered) {
        document.body.style.cursor = dragged ? "grabbing" : "grab";
        return () => void (document.body.style.cursor = "auto");
      }
    }, [hovered, dragged]);

    useFrame((state, delta) => {
      if (dragged) {
        vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
        dir.copy(vec).sub(state.camera.position).normalize();
        vec.add(dir.multiplyScalar(state.camera.position.length()));
        [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
        card.current?.setNextKinematicTranslation({
          x: vec.x - (dragged as THREE.Vector3).x,
          y: vec.y - (dragged as THREE.Vector3).y,
          z: vec.z - (dragged as THREE.Vector3).z,
        });
      }
      if (fixed.current) {
        // Fix most of the jitter when over pulling the card
        [j1, j2].forEach((ref) => {
          if (!(ref.current! as any).lerped)
            (ref.current! as any).lerped = new THREE.Vector3().copy(
              ref.current!.translation(),
            );
          const clampedDistance = Math.max(
            0.1,
            Math.min(
              1,
              (ref.current! as any).lerped.distanceTo(ref.current!.translation()),
            ),
          );
          (ref.current! as any).lerped.lerp(
            ref.current!.translation(),
            delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
          );
        });
        // Calculate catmul curve
        curve.points[0]!.copy(j3.current!.translation());
        curve.points[1]!.copy((j2.current! as any).lerped);
        curve.points[2]!.copy((j1.current! as any).lerped);
        curve.points[3]!.copy(fixed.current.translation());
        (band.current! as any).geometry.setPoints(curve.getPoints(100));
        // Tilt it back towards the screen
        ang.copy(card.current!.angvel());
        rot.copy(card.current!.rotation());
        card.current!.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
      }
    });

    curve.curveType = "chordal";
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    const lastClickTime = useRef(0);

    const handlePointerDown = () => {
      const currentTime = Date.now();
      const timeDifference = currentTime - lastClickTime.current;

      if (timeDifference < 300) {
        onDoubleClick();
        lastClickTime.current = 0;
      } else {
        lastClickTime.current = currentTime;
      }
    };

    return (
      <>
        <group position={[0, 6, 0]}>
          <RigidBody ref={fixed} {...segmentProps} type="fixed" />
          <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
            <BallCollider args={[0.1]} />
          </RigidBody>
          <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
            <BallCollider args={[0.1]} />
          </RigidBody>
          <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
            <BallCollider args={[0.1]} />
          </RigidBody>
          <RigidBody
            position={[2, 0, 0]}
            ref={card}
            {...segmentProps}
            type={dragged ? "kinematicPosition" : "dynamic"}
          >
            <CuboidCollider args={[0.8, 1.125, 0.01]} />
            <group
              scale={isMobile ? 1.5 : 2}
              position={[0, isMobile ? -0.32 : -0.9, -0.05]}
              onPointerOver={() => hover(true)}
              onPointerOut={() => hover(false)}
              onPointerUp={(e) => (
                (e.target! as any).releasePointerCapture(e.pointerId), drag(false)
              )}
              onPointerDown={(e) => (
                (e.target! as any).setPointerCapture(e.pointerId),
                drag(
                  new THREE.Vector3()
                    .copy(e.point)
                    .sub(vec.copy(card.current!.translation())),
                )
              )}
            >
              <mesh
                onPointerDown={handlePointerDown}
                geometry={(nodes.card! as any).geometry}
              >
                <meshPhysicalMaterial
                  map={imageTexture}
                  map-anisotropy={16}
                  clearcoat={1}
                  clearcoatRoughness={0.15}
                  roughness={0.2}
                  metalness={0.5}
                  toneMapped={false}
                />
              </mesh>
              <mesh
                geometry={(nodes.clip! as any).geometry}
                material={materials.metal}
                material-roughness={0.3}
              />
              <mesh
                geometry={(nodes.clamp! as any).geometry}
                material={materials.metal}
              />
            </group>
          </RigidBody>
        </group>
        <mesh ref={band}>
          <meshLineGeometry />
          <meshLineMaterial
            color="white"
            depthTest={false}
            resolution={[width, Math.floor(height / (isMobile ? 10 : 5))]}
            useMap
            map={texture}
            repeat={[-3, 1]}
            lineWidth={1}
          />
        </mesh>
      </>
    );
  },
  (prev, next) => prev.image === next.image && prev.isMobile === next.isMobile,
);

Band.displayName = "Band";
