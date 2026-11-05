import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import {
  DoubleSide,
  MathUtils,
  SRGBColorSpace,
  TextureLoader,
  VSMShadowMap,
  type Group,
} from 'three';

const PANEL_WIDTH = 1.24;
const PANEL_HEIGHT = 1.748;
const PANEL_RATIO = PANEL_WIDTH / PANEL_HEIGHT;
const DRAG_DISTANCE = 260;
const SHADOW_MAP_SIZE = 1024;

type FlapName = 'left' | 'right';

interface DragState {
  flap: FlapName;
  startX: number;
  startProgress: number;
  lastX: number;
  lastTime: number;
}

export interface TriFoldInvitationHandle {
  resetView: () => void;
  openFlaps: () => void;
  closeFlaps: () => void;
  toggleFlaps: () => void;
}

interface TriFoldInvitationProps {
  className?: string;
  onOpenStateChange?: (isOpen: boolean) => void;
}

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

interface InvitationSceneProps {
  leftProgress: React.MutableRefObject<number>;
  rightProgress: React.MutableRefObject<number>;
  leftTarget: React.MutableRefObject<number>;
  rightTarget: React.MutableRefObject<number>;
  tilt: React.MutableRefObject<{ x: number; y: number }>;
}

const InvitationScene: React.FC<InvitationSceneProps> = ({
  leftProgress,
  rightProgress,
  leftTarget,
  rightTarget,
  tilt,
}) => {
  const textures = useLoader(TextureLoader, [
    '/design/Inside_Left_panel.jpg',
    '/design/Inside_Middle_panel.jpg',
    '/design/Inside_Right_panel.jpg',
    '/design/Outside_Left_panel.jpg',
    '/design/Outside_Middle_panel.jpg',
    '/design/Outside_Right_panel.jpg',
  ]);
  const sceneRef = useRef<Group>(null);
  const leftCoverRef = useRef<Group>(null);
  const rightCoverRef = useRef<Group>(null);
  const { gl } = useThree();

  useEffect(() => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = VSMShadowMap;
    textures.forEach((texture) => {
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
      texture.needsUpdate = true;
    });
  }, [gl, textures]);

  useFrame((_, delta) => {
    leftProgress.current = MathUtils.damp(
      leftProgress.current,
      leftTarget.current,
      11,
      delta,
    );
    rightProgress.current = MathUtils.damp(
      rightProgress.current,
      rightTarget.current,
      11,
      delta,
    );

    if (leftCoverRef.current) {
      leftCoverRef.current.rotation.y =
        Math.PI * (1 - leftProgress.current);
    }
    if (rightCoverRef.current) {
      rightCoverRef.current.rotation.y =
        -Math.PI * (1 - rightProgress.current);
    }
    if (sceneRef.current) {
      sceneRef.current.rotation.x = MathUtils.damp(
        sceneRef.current.rotation.x,
        tilt.current.x,
        5,
        delta,
      );
      sceneRef.current.rotation.y = MathUtils.damp(
        sceneRef.current.rotation.y,
        tilt.current.y,
        5,
        delta,
      );
    }
  });

  const paperMaterial = {
    roughness: 0.82,
    metalness: 0.08,
    side: DoubleSide,
  } as const;

  return (
    <>
      {/* Clean Studio Lighting */}
      <ambientLight intensity={0.85} color="#ffffff" />
      <directionalLight
        castShadow
        color="#ffffff"
        intensity={1.4}
        position={[4, 8, 6]}
        target-position={[0, 0, 0]}
        shadow-bias={-0.00006}
        shadow-normalBias={0.008}
        shadow-radius={3}
        shadow-mapSize={[SHADOW_MAP_SIZE, SHADOW_MAP_SIZE]}
        shadow-camera-left={-3.1}
        shadow-camera-right={3.1}
        shadow-camera-top={2.5}
        shadow-camera-bottom={-2.5}
        shadow-camera-near={0.1}
        shadow-camera-far={12}
      />

      <group ref={sceneRef}>
        {/* Invisible shadow receiver blending into dark background */}
        <mesh position={[0, 0, -0.12]} receiveShadow>
          <planeGeometry args={[6.5, 4.2]} />
          <shadowMaterial opacity={0.35} />
        </mesh>

        {/* Center Panel (Inside Middle & Outside Middle) */}
        <mesh position={[0, 0, 0]} receiveShadow renderOrder={1}>
          <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]} />
          <meshStandardMaterial map={textures[1]} {...paperMaterial} />
        </mesh>
        <mesh
          position={[0, 0, -0.012]}
          rotation={[0, Math.PI, 0]}
          receiveShadow
          renderOrder={1}
        >
          <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]} />
          <meshStandardMaterial map={textures[4]} {...paperMaterial} />
        </mesh>

        {/* Left Flap */}
        <group
          ref={leftCoverRef}
          position={[-PANEL_WIDTH / 2, 0, 0.008]}
          rotation={[0, Math.PI, 0]}
        >
          <mesh
            position={[-PANEL_WIDTH / 2, 0, 0]}
            castShadow
            receiveShadow
            renderOrder={3}
          >
            <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]} />
            <meshStandardMaterial
              map={textures[0]}
              {...paperMaterial}
              side={DoubleSide}
            />
          </mesh>
          <mesh
            position={[-PANEL_WIDTH / 2, 0, -0.012]}
            rotation={[0, Math.PI, 0]}
            castShadow
            receiveShadow
            renderOrder={3}
          >
            <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]} />
            <meshStandardMaterial map={textures[3]} {...paperMaterial} />
          </mesh>
        </group>

        {/* Right Flap */}
        <group
          ref={rightCoverRef}
          position={[PANEL_WIDTH / 2, 0, 0.004]}
          rotation={[0, -Math.PI, 0]}
        >
          <mesh
            position={[PANEL_WIDTH / 2, 0, 0]}
            castShadow
            receiveShadow
            renderOrder={2}
          >
            <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]} />
            <meshStandardMaterial map={textures[2]} {...paperMaterial} />
          </mesh>
          <mesh
            position={[PANEL_WIDTH / 2, 0, -0.012]}
            rotation={[0, Math.PI, 0]}
            castShadow
            receiveShadow
            renderOrder={2}
          >
            <planeGeometry args={[PANEL_WIDTH, PANEL_HEIGHT]} />
            <meshStandardMaterial map={textures[5]} {...paperMaterial} />
          </mesh>
        </group>
      </group>
    </>
  );
};

const CameraSetup: React.FC = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 7);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
};

export const TriFoldInvitation = forwardRef<
  TriFoldInvitationHandle,
  TriFoldInvitationProps
>(({ className = '', onOpenStateChange }, ref) => {
  const [dragging, setDragging] = useState<FlapName | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const leftProgress = useRef(0);
  const rightProgress = useRef(0);
  const leftTarget = useRef(0);
  const rightTarget = useRef(0);
  const tilt = useRef({ x: 0, y: 0 });

  useImperativeHandle(ref, () => ({
    resetView: () => {
      tilt.current = { x: 0, y: 0 };
      leftTarget.current = 0;
      rightTarget.current = 0;
      if (onOpenStateChange) onOpenStateChange(false);
    },
    openFlaps: () => {
      leftTarget.current = 1;
      rightTarget.current = 1;
      if (onOpenStateChange) onOpenStateChange(true);
    },
    closeFlaps: () => {
      leftTarget.current = 0;
      rightTarget.current = 0;
      if (onOpenStateChange) onOpenStateChange(false);
    },
    toggleFlaps: () => {
      const isCurrentlyOpen =
        leftTarget.current > 0.5 && rightTarget.current > 0.5;
      const nextTarget = isCurrentlyOpen ? 0 : 1;
      leftTarget.current = nextTarget;
      rightTarget.current = nextTarget;
      if (onOpenStateChange) onOpenStateChange(!isCurrentlyOpen);
    },
  }));

  const progressFor = (flap: FlapName) =>
    flap === 'left' ? leftProgress.current : rightProgress.current;
  const targetFor = (flap: FlapName) =>
    flap === 'left' ? leftTarget : rightTarget;

  const handlePointerDown = (flap: FlapName, clientX: number) => {
    const now = performance.now();
    const progress = progressFor(flap);
    dragRef.current = {
      flap,
      startX: clientX,
      startProgress: progress,
      lastX: clientX,
      lastTime: now,
    };
    targetFor(flap).current = progress;
    setDragging(flap);
  };

  const handleStagePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const flap =
      leftTarget.current < 0.5
        ? 'left'
        : rightTarget.current < 0.5
          ? 'right'
          : event.clientX <
              event.currentTarget.getBoundingClientRect().left +
                event.currentTarget.getBoundingClientRect().width / 2
            ? 'left'
            : 'right';
    handlePointerDown(flap, event.clientX);
  };

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const direction = drag.flap === 'left' ? -1 : 1;
      const progress = clamp(
        drag.startProgress +
          ((event.clientX - drag.startX) / DRAG_DISTANCE) * direction,
      );
      const progressRef =
        drag.flap === 'left' ? leftProgress : rightProgress;
      progressRef.current = progress;
      targetFor(drag.flap).current = progress;
      drag.lastX = event.clientX;
      drag.lastTime = performance.now();
    };

    const finishDrag = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const direction = drag.flap === 'left' ? -1 : 1;
      const elapsed = Math.max(performance.now() - drag.lastTime, 1);
      const velocity = ((event.clientX - drag.lastX) / elapsed) * direction;
      const currentProgress = targetFor(drag.flap).current;
      const target = currentProgress + velocity * 0.18 > 0.5 ? 1 : 0;
      targetFor(drag.flap).current = target;

      const isBothOpen =
        leftTarget.current > 0.5 && rightTarget.current > 0.5;
      if (onOpenStateChange) onOpenStateChange(isBothOpen);

      dragRef.current = null;
      setDragging(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', finishDrag);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', finishDrag);
    };
  }, [dragging, onOpenStateChange]);

  return (
    <div
      className={`tri-fold-invitation w-full h-full flex flex-col justify-center items-center ${className}`}
      aria-label="Interactive tri-fold graduation invitation"
    >
      <div
        className="tri-fold-stage w-full h-full flex items-center justify-center"
        onPointerMove={(event) => {
          if (dragging) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;
          tilt.current = { x: y * -0.07, y: x * 0.09 };
        }}
        onPointerLeave={() => {
          tilt.current = { x: 0, y: 0 };
        }}
      >
        <div
          className="tri-fold-paper max-w-[850px] w-[92%]"
          style={{
            aspectRatio: `${3 * PANEL_RATIO}`,
            filter: 'drop-shadow(0 20px 30px rgba(0, 30, 60, 0.18))',
          }}
        >
          <Canvas
            orthographic
            shadows={{ type: VSMShadowMap, autoUpdate: true }}
            camera={{
              position: [0, 0, 7],
              left: -1.98,
              right: 1.98,
              top: 0.98,
              bottom: -0.98,
              near: 0.1,
              far: 20,
            }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
            <CameraSetup />
            <InvitationScene
              leftProgress={leftProgress}
              rightProgress={rightProgress}
              leftTarget={leftTarget}
              rightTarget={rightTarget}
              tilt={tilt}
            />
          </Canvas>

          <div
            className="tri-fold-input-layer"
            onPointerDown={handleStagePointerDown}
            title="Kéo sang trái để mở cánh trái, kéo sang phải để mở cánh phải"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
});

TriFoldInvitation.displayName = 'TriFoldInvitation';
export default TriFoldInvitation;
