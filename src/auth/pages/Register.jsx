import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import * as CANNON from "cannon-es";
import { useAuth } from "../hooks/useHook";
import { useNavigate } from "react-router";

const keychainConfig = [
  {
    text: "DEV",
    color: "#3b82f6",
    shape: "box",
    textColor: "#ffffff",
    spawnAngle: 200,
  },
  {
    text: "DESIGN",
    color: "#FF2C79",
    shape: "cylinder",
    textColor: "#ffffff",
    spawnAngle: 235,
  },
  {
    text: "CSS",
    color: "#10b981",
    shape: "capsule",
    textColor: "#ffffff",
    spawnAngle: 270,
  },
  {
    text: "JS",
    color: "#EDFF2C",
    shape: "hexagon",
    textColor: "#000000",
    spawnAngle: 305,
  },
  {
    text: "NEXT.JS",
    color: "#ffffff",
    shape: "octahedron",
    textColor: "#000000",
    spawnAngle: 340,
  },
];

const params = {
  forceMultiplier: 3.0,
  glassTransmission: 1.0,
  glassRoughness: 0.15,
  glassThickness: 0.8,
  glassIor: 1.5,
  ringColor: "#d4d4d8",
  ambientLight: 0.5,
};

const GROUP_RING = 1,
  GROUP_KEYCHAIN = 2,
  GROUP_SMALL_RING = 4,
  GROUP_DUMMY = 8;

export default function Register() {
  const mountRef = useRef(null);
  const sceneDataRef = useRef({});
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [registered, setRegistered] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await handleRegister(form);
      setRegistered(true);
    } catch {
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Three.js scene ───────────────────────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const sd = sceneDataRef.current;
    sd.physicsObjects = [];
    sd.interactableMeshes = [];

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const lastMousePos = new THREE.Vector2();
    const clock = new THREE.Clock();

    const scene = new THREE.Scene();
    // ← transparent background so our CSS bg shows through
    scene.background = null;
    sd.scene = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, -1.0, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // fully transparent
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);
    sd.renderer = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, -1.0, 0);
    controls.enableZoom = false;
    controls.enablePan = false;

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    scene.add(new THREE.AmbientLight(0xffffff, params.ambientLight));
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const sharedGlassMaterial = new THREE.MeshPhysicalMaterial({
      metalness: 0.1,
      roughness: params.glassRoughness,
      transmission: params.glassTransmission,
      thickness: params.glassThickness,
      ior: params.glassIor,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.81, 0),
    });
    physicsWorld.broadphase = new CANNON.SAPBroadphase(physicsWorld);
    physicsWorld.solver.iterations = 50;

    const keychainMat = new CANNON.Material("keychain");
    physicsWorld.addContactMaterial(
      new CANNON.ContactMaterial(keychainMat, keychainMat, {
        friction: 0.1,
        restitution: 0.4,
        contactEquationStiffness: 1e9,
        contactEquationRelaxation: 3,
      }),
    );
    scene.userData.keychainMaterial = keychainMat;

    // Build ring
    function buildMainRing() {
      const ringRadius = 3.0,
        tubeRadius = 0.08,
        ringPosY = 4.0;
      const ringMesh = new THREE.Mesh(
        new THREE.TorusGeometry(ringRadius, tubeRadius, 32, 100),
        new THREE.MeshStandardMaterial({
          color: params.ringColor,
          metalness: 1.0,
          roughness: 0.2,
        }),
      );
      scene.add(ringMesh);

      const ringBody = new CANNON.Body({
        mass: 40.0,
        type: CANNON.Body.DYNAMIC,
        position: new CANNON.Vec3(0, ringPosY, 0),
        linearDamping: 0.1,
        angularDamping: 0.3,
      });
      for (let i = 0; i < 36; i++) {
        const angle = (i * 10 * Math.PI) / 180;
        const arcLen = (2 * Math.PI * ringRadius) / 36;
        const q = new CANNON.Quaternion();
        q.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), angle + Math.PI / 2);
        ringBody.addShape(
          new CANNON.Box(
            new CANNON.Vec3(arcLen * 0.55, tubeRadius * 1.5, tubeRadius * 1.5),
          ),
          new CANNON.Vec3(
            ringRadius * Math.cos(angle),
            ringRadius * Math.sin(angle),
            0,
          ),
          q,
        );
      }
      ringBody.collisionFilterGroup = GROUP_RING;
      ringBody.collisionFilterMask = GROUP_KEYCHAIN;
      physicsWorld.addBody(ringBody);

      const topPivot = new CANNON.Body({ mass: 0, type: CANNON.Body.STATIC });
      topPivot.position.set(0, ringPosY + ringRadius, 0);
      physicsWorld.addBody(topPivot);
      physicsWorld.addConstraint(
        new CANNON.PointToPointConstraint(
          ringBody,
          new CANNON.Vec3(0, ringRadius, 0),
          topPivot,
          new CANNON.Vec3(0, 0, 0),
        ),
      );

      sd.interactableMeshes.push(ringMesh);
      ringMesh.userData.physicsBody = ringBody;
      sd.physicsObjects.push({ mesh: ringMesh, body: ringBody });
      Object.assign(scene.userData, {
        ringBody,
        ringRadius,
        tubeRadius,
        ringPosY,
      });
    }

    function createTextTexture(text, textColor = "#ffffff") {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, 512, 256);
      ctx.font = 'bold 90px "Arial Black", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = textColor;
      ctx.fillText(text, 256, 128);
      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    }

    function buildKeychains() {
      const { ringRadius, tubeRadius, ringBody, ringPosY } = scene.userData;
      const smallRingRadius = 0.8;
      const trackRadius = ringRadius + smallRingRadius - tubeRadius;

      keychainConfig.forEach((skill) => {
        const angleRad = skill.spawnAngle * (Math.PI / 180);
        const attachX = trackRadius * Math.cos(angleRad);
        const attachY = trackRadius * Math.sin(angleRad);

        const dummyArm = new CANNON.Body({
          mass: 3.0,
          position: new CANNON.Vec3(0, ringPosY, 0),
          linearDamping: 0.01,
          angularDamping: 0.01,
        });
        dummyArm.addShape(new CANNON.Sphere(trackRadius));
        dummyArm.collisionFilterGroup = GROUP_DUMMY;
        dummyArm.collisionFilterMask = 0;
        dummyArm.quaternion.setFromAxisAngle(
          new CANNON.Vec3(0, 0, 1),
          angleRad,
        );
        physicsWorld.addBody(dummyArm);
        physicsWorld.addConstraint(
          new CANNON.HingeConstraint(ringBody, dummyArm, {
            pivotA: new CANNON.Vec3(0, 0, 0),
            axisA: new CANNON.Vec3(0, 0, 1),
            pivotB: new CANNON.Vec3(0, 0, 0),
            axisB: new CANNON.Vec3(0, 0, 1),
          }),
        );

        const holeMesh = new THREE.Mesh(
          new THREE.TorusGeometry(smallRingRadius, 0.03, 16, 64),
          new THREE.MeshStandardMaterial({
            color: "#d4d4d8",
            metalness: 1,
            roughness: 0.2,
          }),
        );
        scene.add(holeMesh);

        const smallRingPos = new CANNON.Vec3(attachX, attachY + ringPosY, 0);
        const tangent = new THREE.Vector3(
          -Math.sin(angleRad),
          Math.cos(angleRad),
          0,
        ).normalize();
        const radial = new THREE.Vector3(
          Math.cos(angleRad),
          Math.sin(angleRad),
          0,
        ).normalize();
        const localY = radial.clone().negate();
        const localX = new THREE.Vector3()
          .crossVectors(localY, tangent)
          .normalize();
        const smallRingQuat = new THREE.Quaternion().setFromRotationMatrix(
          new THREE.Matrix4().makeBasis(localX, localY, tangent),
        );

        const smallRingBody = new CANNON.Body({
          mass: 1.0,
          position: smallRingPos,
          shape: new CANNON.Sphere(smallRingRadius),
          linearDamping: 0.01,
          angularDamping: 0.2,
        });
        smallRingBody.collisionFilterGroup = GROUP_SMALL_RING;
        smallRingBody.collisionFilterMask = 0;
        smallRingBody.quaternion.set(
          smallRingQuat.x,
          smallRingQuat.y,
          smallRingQuat.z,
          smallRingQuat.w,
        );
        physicsWorld.addBody(smallRingBody);
        physicsWorld.addConstraint(
          new CANNON.PointToPointConstraint(
            dummyArm,
            new CANNON.Vec3(trackRadius, 0, 0),
            smallRingBody,
            new CANNON.Vec3(0, 0, 0),
          ),
        );

        sd.physicsObjects.push({
          mesh: holeMesh,
          body: smallRingBody,
          isSmallRing: true,
        });
        sd.interactableMeshes.push(holeMesh);
        holeMesh.userData.physicsBody = smallRingBody;

        const keychainGroup = new THREE.Group();
        scene.add(keychainGroup);
        const width = 2.4,
          height = 2.4,
          depth = 0.15;
        const shapePhysics = new CANNON.Box(
          new CANNON.Vec3(
            (width / 2) * 0.9,
            (height / 2) * 0.9,
            (depth / 2) * 1.5,
          ),
        );

        let geometry;
        switch (skill.shape) {
          case "box":
            geometry = new THREE.BoxGeometry(width, height, depth, 4, 4, 4);
            break;
          case "cylinder":
            geometry = new THREE.CylinderGeometry(
              width / 2,
              width / 2,
              depth,
              32,
            );
            geometry.rotateX(Math.PI / 2);
            break;
          case "capsule":
            geometry = new THREE.CapsuleGeometry(
              width / 2.5,
              height / 2,
              16,
              32,
            );
            geometry.scale(1, 1, depth / (2 * (width / 2.5)));
            break;
          case "hexagon":
            geometry = new THREE.CylinderGeometry(
              width / 2.2,
              width / 2.2,
              depth,
              6,
            );
            geometry.rotateX(Math.PI / 2);
            geometry.rotateZ(Math.PI / 6);
            break;
          case "octahedron":
            geometry = new THREE.OctahedronGeometry(width / 1.8, 1);
            geometry.scale(1, 1, depth / (2 * (width / 1.8)));
            break;
          default:
            geometry = new THREE.BoxGeometry(width, height, depth);
        }
        geometry.computeBoundingBox();
        const visualTopY = geometry.boundingBox.max.y;

        const mat = sharedGlassMaterial.clone();
        mat.color.set(skill.color);
        const glassMesh = new THREE.Mesh(geometry, mat);
        keychainGroup.add(glassMesh);
        sd.interactableMeshes.push(glassMesh);

        const textMat = new THREE.MeshBasicMaterial({
          map: createTextTexture(skill.text, skill.textColor),
          transparent: true,
          depthWrite: false,
        });
        const textFront = new THREE.Mesh(
          new THREE.PlaneGeometry(width * 1.2, width * 0.6),
          textMat,
        );
        textFront.position.z = depth / 2 + 0.01;
        keychainGroup.add(textFront);
        const textBack = new THREE.Mesh(
          new THREE.PlaneGeometry(width * 1.2, width * 0.6),
          textMat,
        );
        textBack.position.z = -(depth / 2) - 0.01;
        textBack.rotation.y = Math.PI;
        keychainGroup.add(textBack);

        const pivotA_local = new CANNON.Vec3(0, -smallRingRadius, 0);
        const pivotA_world = new THREE.Vector3(
          pivotA_local.x,
          pivotA_local.y,
          pivotA_local.z,
        )
          .applyQuaternion(smallRingQuat)
          .add(
            new THREE.Vector3(smallRingPos.x, smallRingPos.y, smallRingPos.z),
          );
        const pivotB_local = new CANNON.Vec3(0, visualTopY - 0.1, 0);
        const spawnPos = new CANNON.Vec3(
          pivotA_world.x - pivotB_local.x,
          pivotA_world.y - pivotB_local.y,
          pivotA_world.z - pivotB_local.z,
        );

        const keychainBody = new CANNON.Body({
          mass: 1.5,
          material: scene.userData.keychainMaterial,
          shape: shapePhysics,
          position: spawnPos,
          linearDamping: 0.3,
          angularDamping: 0.5,
        });
        keychainBody.collisionFilterGroup = GROUP_KEYCHAIN;
        keychainBody.collisionFilterMask = GROUP_KEYCHAIN | GROUP_RING;
        physicsWorld.addBody(keychainBody);
        physicsWorld.addConstraint(
          new CANNON.PointToPointConstraint(
            smallRingBody,
            pivotA_local,
            keychainBody,
            pivotB_local,
          ),
        );

        glassMesh.userData.physicsBody = keychainBody;
        sd.physicsObjects.push({ mesh: keychainGroup, body: keychainBody });
      });
    }

    buildMainRing();
    buildKeychains();

    function onMouseMove(e) {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      const velX = mouse.x - lastMousePos.x,
        velY = mouse.y - lastMousePos.y;
      lastMousePos.copy(mouse);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(sd.interactableMeshes, false);
      if (hits.length > 0) {
        const hit = hits[0],
          body = hit.object.userData.physicsBody;
        if (body) {
          const clamp = (v, m) => Math.max(Math.min(v, m), -m);
          const cVX = clamp(velX, 0.15),
            cVY = clamp(velY, 0.15);
          const forceMag = params.forceMultiplier * 4 * body.mass;
          const impulse = new CANNON.Vec3(
            cVX * forceMag,
            cVY * forceMag,
            -Math.abs(cVX + cVY) * forceMag * 0.8,
          );
          if (Math.abs(cVX) < 0.001 && Math.abs(cVY) < 0.001)
            impulse.set(
              (Math.random() - 0.5) * body.mass * 0.2,
              (Math.random() - 0.5) * body.mass * 0.2,
              -0.2 * body.mass,
            );
          body.applyImpulse(
            impulse,
            new CANNON.Vec3(hit.point.x, hit.point.y, hit.point.z),
          );
        }
      }
    }

    function onWindowResize() {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }

    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      physicsWorld.step(1 / 60, Math.min(clock.getDelta(), 0.1), 3);
      const ringBody = scene.userData.ringBody;
      sd.physicsObjects.forEach((obj) => {
        if (obj.isSmallRing && ringBody) {
          const localPos = ringBody.pointToLocalFrame(obj.body.position);
          const lt = new CANNON.Vec3(-localPos.y, localPos.x, 0);
          lt.normalize();
          const wt = ringBody.vectorToWorldFrame(lt);
          const cz = obj.body.quaternion.vmult(new CANNON.Vec3(0, 0, 1));
          const torque = cz.cross(wt);
          const av = obj.body.angularVelocity;
          obj.body.applyTorque(
            new CANNON.Vec3(
              torque.x * 20 - av.x * 2,
              torque.y * 20 - av.y * 2,
              torque.z * 20 - av.z * 2,
            ),
          );
        }
        obj.mesh.position.copy(obj.body.position);
        obj.mesh.quaternion.copy(obj.body.quaternion);
      });
      controls.update();
      renderer.render(scene, camera);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onWindowResize);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onWindowResize);
      renderer.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
    };
  }, []);

  if (registered) {
    return (
      <div className="login-root">
        <div style={{ margin: "auto", zIndex: 2, padding: "24px" }}>
          <div
            className="form-card"
            style={{ textAlign: "center", maxWidth: 380 }}
          >
            <div style={{ fontSize: 52, marginBottom: 16 }}>📧</div>
            <p className="form-eyebrow">Almost there</p>
            <h1 className="form-title">
              Check your
              <br />
              inbox
            </h1>
            <p className="form-sub">
              We sent a verification link to
              <br />
              <strong style={{ color: "#14b8a6" }}>{form.email}</strong>
            </p>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.25)",
                marginTop: 16,
                lineHeight: 1.6,
              }}
            >
              Click the link in the email to activate your account, then log in.
            </p>
            <a
              href="/login"
              className="submit-btn"
              style={{
                display: "block",
                marginTop: 24,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Go to Login →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .login-root {
          min-height: 100vh;
          width: 100%;
          background: #0C0C0C;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          position: relative;
          font-family: 'DM Sans', sans-serif;
        }

        /* subtle grid overlay */
        .login-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        /* glow blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .blob-teal  { width:380px;height:380px;background:rgba(20,184,166,0.12);top:-60px;right:35%; }
        .blob-blue  { width:320px;height:320px;background:rgba(59,130,246,0.10);bottom:-40px;right:38%; }
        .blob-pink  { width:260px;height:260px;background:rgba(255,44,121,0.08);top:30%;right:28%; }

        /* ── Three.js canvas pane ── */
        .canvas-pane {
          position: relative;
          z-index: 1;
          flex: 1 1 55%;
          height: 100vh;
        }

        /* ── Form pane ── */
        .form-pane {
          position: relative;
          z-index: 2;
          flex: 0 0 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 48px 48px 0;
        }

        .form-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 20px;
          padding: 40px 36px;
          backdrop-filter: blur(20px);
          box-shadow: 0 0 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .form-eyebrow {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #14b8a6;
          margin-bottom: 10px;
        }

        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #f4f4f5;
          margin-bottom: 6px;
          line-height: 1.15;
        }

        .form-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.38);
          margin-bottom: 32px;
        }

        .field-wrap { margin-bottom: 16px; }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 7px;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 11px 14px;
          font-size: 14px;
          color: #f4f4f5;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
        }
        .field-input::placeholder { color: rgba(255,255,255,0.2); }
        .field-input:focus {
          border-color: rgba(20,184,166,0.6);
          background: rgba(20,184,166,0.05);
          box-shadow: 0 0 0 3px rgba(20,184,166,0.12);
        }

        .error-msg {
          font-size: 12px;
          color: #f87171;
          margin-bottom: 16px;
          padding: 10px 12px;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2);
          border-radius: 8px;
        }

        .submit-btn {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #14b8a6, #3b82f6);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(20,184,166,0.25);
          margin-top: 8px;
          position: relative;
          overflow: hidden;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 6px 28px rgba(20,184,166,0.35); }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .divider-row {
          display: flex; align-items: center; gap: 12px;
          margin: 22px 0;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .divider-text { font-size: 11px; color: rgba(255,255,255,0.25); }

        .register-row {
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.35);
        }
        .register-link {
          color: #14b8a6;
          text-decoration: none;
          font-weight: 500;
          margin-left: 4px;
          transition: color 0.2s;
        }
        .register-link:hover { color: #5eead4; }

        /* spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        /* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .login-root {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
  }

  .canvas-pane {
    display: none;  /* ← hide 3D on mobile, too heavy */
  }

  .form-pane {
    flex: none;
    width: 100%;
    max-width: 420px;
    padding: 24px 20px;
  }

  .form-card {
    padding: 28px 24px;
  }

  .form-title {
    font-size: 22px;
  }

  .blob-teal  { width:200px;height:200px;top:-40px;right:10%; }
  .blob-blue  { width:180px;height:180px;bottom:-20px;right:5%; }
  .blob-pink  { width:150px;height:150px;top:40%;right:15%; }
}

@media (max-width: 400px) {
  .form-card { padding: 24px 16px; }
  .form-title { font-size: 20px; }
  .submit-btn { padding: 12px; font-size: 13px; }
}

      `}</style>

  <div className="login-root">
        {/* glow blobs */}
        <div className="blob blob-teal" />
        <div className="blob blob-blue" />
        <div className="blob blob-pink" />

        {/* Three.js canvas */}
        <div className="canvas-pane" ref={mountRef} />

        {/* Form */}
        <div className="form-pane">
          <div className="form-card">
            <p className="form-eyebrow">Get started</p>
            <h1 className="form-title">
              Create your
              <br />
              account
            </h1>
            <p className="form-sub">Continue where you left off</p>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field-wrap">
                <label className="field-label">Username</label>
                <input
                  className="field-input"
                  type="text"
                  name="username"
                  required
                  placeholder="your_username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>

              <div className="field-wrap">
                <label className="field-label">Email</label>
                <input
                  className="field-input"
                  type="text"
                  name="email"
                  required
                  placeholder="your_email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>

              <div className="field-wrap">
                <label className="field-label">Password</label>
                <input
                  className="field-input"
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>


              <button className="submit-btn" type="submit" disabled={loading}>
                {loading && <span className="spinner" />}
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>

            <div className="divider-row">
              <div className="divider-line" />
              <span className="divider-text">Already a member?</span>
              <div className="divider-line" />
            </div>

            <p className="register-row">
              Already have an Account ?
              <a href="/login" className="register-link">
                Login →
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
