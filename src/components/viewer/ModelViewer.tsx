import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

interface ModelViewerProps {
  stlBlob: Blob | null
  className?: string
}

export function ModelViewer({ stlBlob, className }: ModelViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const animFrameRef = useRef<number>(0)

  // initialize scene once — using persistent <canvas> avoids Strict Mode double-canvas issue
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.clientWidth
    const height = canvas.clientHeight
    console.log('[viewer] init dimensions:', width, height)

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1a1a)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height || 1, 0.1, 2000)
    camera.position.set(0, 80, 200)
    cameraRef.current = camera

    // Renderer — pass existing canvas element so React owns it
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(100, 200, 100)
    scene.add(dirLight)
    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.4)
    fillLight.position.set(-100, -50, -100)
    scene.add(fillLight)

    // Grid
    const grid = new THREE.GridHelper(300, 30, 0x333333, 0x222222)
    scene.add(grid)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 20
    controls.maxDistance = 800
    controlsRef.current = controls

    // Animate
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const onResize = () => {
      if (!canvasRef.current) return
      const w = canvasRef.current.clientWidth
      const h = canvasRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', onResize)
      controls.dispose()
      renderer.dispose()
      sceneRef.current = null
      cameraRef.current = null
      rendererRef.current = null
      controlsRef.current = null
    }
  }, [])

  // Load STL when blob changes
  useEffect(() => {
    if (!stlBlob) return

    const scene = sceneRef.current
    const camera = cameraRef.current
    if (!scene || !camera) return

    // Remove previous mesh
    if (meshRef.current) {
      scene.remove(meshRef.current)
      meshRef.current.geometry.dispose()
      meshRef.current = null
    }

    stlBlob.arrayBuffer().then((buffer) => {
      // Re-check after async in case component unmounted
      if (!sceneRef.current || !cameraRef.current) return

      const loader = new STLLoader()
      const geometry = loader.parse(buffer)

      if (!geometry.attributes.position || geometry.attributes.position.count === 0) {
        console.warn('[viewer] empty geometry')
        geometry.dispose()
        return
      }

      geometry.computeBoundingBox()
      geometry.computeVertexNormals()

      const bbox = geometry.boundingBox!
      const center = new THREE.Vector3()
      bbox.getCenter(center)
      geometry.translate(-center.x, -center.y, -bbox.min.z)

      const material = new THREE.MeshPhongMaterial({
        color: 0x6d9eeb,
        specular: 0x111111,
        shininess: 30,
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.Mesh(geometry, material)
      sceneRef.current.add(mesh)
      meshRef.current = mesh

      // Fit camera using world bounds of the placed mesh
      const box = new THREE.Box3().setFromObject(mesh)
      const boxCenter = new THREE.Vector3()
      const boxSize = new THREE.Vector3()
      box.getCenter(boxCenter)
      box.getSize(boxSize)
      const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z)
      const fov = cameraRef.current.fov * (Math.PI / 180)
      const dist = (maxDim / (2 * Math.tan(fov / 2))) * 2.5

      cameraRef.current.position.set(
        boxCenter.x + dist * 0.3,
        boxCenter.y + dist * 0.5,
        boxCenter.z + dist,
      )
      cameraRef.current.lookAt(boxCenter)

      if (controlsRef.current) {
        controlsRef.current.target.copy(boxCenter)
        controlsRef.current.update()
      }

      if (rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    })
  }, [stlBlob])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', minHeight: 360, display: 'block' }}
    />
  )
}
