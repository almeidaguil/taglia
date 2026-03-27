import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

interface ModelViewerProps {
  stlBlob: Blob | null
  className?: string
}

interface SceneRefs {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  mesh: THREE.Mesh | null
}

function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a1a)
  return scene
}

function addLights(scene: THREE.Scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
  dirLight.position.set(100, 200, 100)
  scene.add(dirLight)

  const fillLight = new THREE.DirectionalLight(0x8888ff, 0.4)
  fillLight.position.set(-100, -50, -100)
  scene.add(fillLight)
}

function createRenderer(canvas: HTMLCanvasElement) {
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(w, h)
  renderer.setPixelRatio(window.devicePixelRatio)
  return renderer
}

function createCamera(aspect: number) {
  const camera = new THREE.PerspectiveCamera(45, aspect || 1, 0.1, 2000)
  camera.position.set(0, 80, 200)
  return camera
}

function createControls(
  camera: THREE.PerspectiveCamera,
  canvas: HTMLCanvasElement,
) {
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 20
  controls.maxDistance = 800
  return controls
}

function fitCameraToMesh(
  mesh: THREE.Mesh,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
) {
  const box = new THREE.Box3().setFromObject(mesh)
  const boxCenter = new THREE.Vector3()
  const boxSize = new THREE.Vector3()
  box.getCenter(boxCenter)
  box.getSize(boxSize)

  const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z)
  const fov = camera.fov * (Math.PI / 180)
  const dist = (maxDim / (2 * Math.tan(fov / 2))) * 2.5

  camera.position.set(
    boxCenter.x + dist * 0.3,
    boxCenter.y + dist * 0.5,
    boxCenter.z + dist,
  )
  camera.lookAt(boxCenter)
  controls.target.copy(boxCenter)
  controls.update()
}

function parseAndAddMesh(buffer: ArrayBuffer, refs: SceneRefs) {
  const geometry = new STLLoader().parse(buffer)
  const pos = geometry.attributes.position
  if (!pos || pos.count === 0) {
    console.warn('[viewer] empty geometry')
    geometry.dispose()
    return
  }

  geometry.computeBoundingBox()
  geometry.computeVertexNormals()

  const center = new THREE.Vector3()
  geometry.boundingBox!.getCenter(center)
  geometry.translate(-center.x, -center.y, -geometry.boundingBox!.min.z)

  const material = new THREE.MeshPhongMaterial({
    color: 0x6d9eeb,
    specular: 0x111111,
    shininess: 30,
    side: THREE.DoubleSide,
  })

  const mesh = new THREE.Mesh(geometry, material)
  refs.scene.add(mesh)
  refs.mesh = mesh

  fitCameraToMesh(mesh, refs.camera, refs.controls)
  refs.renderer.render(refs.scene, refs.camera)
}

function initSceneRefs(canvas: HTMLCanvasElement): SceneRefs {
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  console.log('[viewer] init dimensions:', w, h)

  const scene = createScene()
  addLights(scene)
  scene.add(new THREE.GridHelper(300, 30, 0x333333, 0x222222))

  const camera = createCamera(w / h)
  const renderer = createRenderer(canvas)
  const controls = createControls(camera, canvas)

  return { renderer, scene, camera, controls, mesh: null }
}

function removeMesh(refs: SceneRefs) {
  if (!refs.mesh) return
  refs.scene.remove(refs.mesh)
  refs.mesh.geometry.dispose()
  refs.mesh = null
}

function useInitScene(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  refsRef: React.MutableRefObject<SceneRefs | null>,
) {
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const refs = initSceneRefs(canvas)
    refsRef.current = refs

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate)
      refs.controls.update()
      refs.renderer.render(refs.scene, refs.camera)
    }
    animate()

    const onResize = () => {
      if (!canvasRef.current) return
      const rw = canvasRef.current.clientWidth
      const rh = canvasRef.current.clientHeight
      refs.camera.aspect = rw / rh
      refs.camera.updateProjectionMatrix()
      refs.renderer.setSize(rw, rh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', onResize)
      refs.controls.dispose()
      refs.renderer.dispose()
      refsRef.current = null
    }
  }, [canvasRef, refsRef])
}

function useLoadStl(
  stlBlob: Blob | null,
  refsRef: React.MutableRefObject<SceneRefs | null>,
) {
  useEffect(() => {
    if (!stlBlob || !refsRef.current) return
    removeMesh(refsRef.current)

    stlBlob.arrayBuffer().then((buffer) => {
      if (!refsRef.current) return
      parseAndAddMesh(buffer, refsRef.current)
    })
  }, [stlBlob, refsRef])
}

export function ModelViewer({ stlBlob, className }: ModelViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const refsRef = useRef<SceneRefs | null>(null)

  useInitScene(canvasRef, refsRef)
  useLoadStl(stlBlob, refsRef)

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 360,
        display: 'block',
      }}
    />
  )
}
