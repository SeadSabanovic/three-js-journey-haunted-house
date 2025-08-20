import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader()

// Floor
const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg')
const floorColorTexture = textureLoader.load('./floor/aerial_rocks_04_1k/aerial_rocks_04_diff_1k.jpg')
const floorARMTexture = textureLoader.load('./floor/aerial_rocks_04_1k/aerial_rocks_04_arm_1k.jpg')
const floorNormalTexture = textureLoader.load('./floor/aerial_rocks_04_1k/aerial_rocks_04_nor_gl_1k.jpg')
const floorDisplacementTexture = textureLoader.load('./floor/aerial_rocks_04_1k/aerial_rocks_04_disp_1k.jpg')

floorColorTexture.colorSpace = THREE.SRGBColorSpace
floorColorTexture.repeat.set(8, 8)
floorARMTexture.repeat.set(8, 8)
floorNormalTexture.repeat.set(8, 8)
floorDisplacementTexture.repeat.set(8, 8)
floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

// Walls
const wallColorTexture = textureLoader.load('./wall/mossy_brick_diff_1k.jpg')
const wallARMTexture = textureLoader.load('./wall/mossy_brick_arm_1k.jpg')
const wallNormalTexture = textureLoader.load('./wall/mossy_brick_nor_gl_1k.jpg')

wallColorTexture.colorSpace = THREE.SRGBColorSpace

/**
 * House
 */
// Temporary sphere
const house = new THREE.Group()
scene.add(house)

// Add axes helper to visualize XYZ coordinates
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial(
        {
            map: wallColorTexture,
            aoMap: wallARMTexture,
            roughnessMap: wallARMTexture,
            metalnessMap: wallARMTexture,
            normalMap: wallNormalTexture,
            
        }
    )
)
walls.position.y = 1.25
house.add(walls)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial(
        {
            map: floorColorTexture,
            transparent: true,
            alphaMap: floorAlphaTexture,
            map: floorColorTexture,
            aoMap: floorARMTexture,
            roughnessMap: floorARMTexture,
            metalnessMap: floorARMTexture,
            normalMap: floorNormalTexture,
            displacementMap: floorDisplacementTexture,
            displacementScale: 0.3,
            displacementBias: -0.1,
        }
    )
)
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial()
)
roof.position.y = 2.5 + .75
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2),
    new THREE.MeshStandardMaterial({ color: 'red' })
)
door.position.y = 1
door.position.z = 2.001
house.add(door)

// Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial()

for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 4
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    const y = Math.random() * 0.4

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)

    grave.position.x = x
    grave.position.z = z
    grave.position.y = y

    grave.rotation.x = (Math.random() * 0.5) - 0.25
    grave.rotation.y = (Math.random() * 0.5) - 0.25
    grave.rotation.z = (Math.random() * 0.5) - 0.25

    grave.scale.setScalar(Math.random() * 0.5 + 0.5)

    graves.add(grave)
}





/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ff7a7a', 0.1)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ff7a7a', .3)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// GUI Controls for Lights
const lightsFolder = gui.addFolder('Lights')

// Ambient Light Controls
const ambientFolder = lightsFolder.addFolder('Ambient Light')
ambientFolder.add(ambientLight, 'intensity', 0, 2, 0.01).name('Intensity')
ambientFolder.addColor(ambientLight, 'color').name('Color')

// Directional Light Controls
const directionalFolder = lightsFolder.addFolder('Directional Light')
directionalFolder.add(directionalLight, 'intensity', 0, 5, 0.01).name('Intensity')
directionalFolder.add(directionalLight.position, 'x', -10, 10, 0.1).name('X Position')
directionalFolder.add(directionalLight.position, 'y', -10, 10, 0.1).name('Y Position')
directionalFolder.add(directionalLight.position, 'z', -10, 10, 0.1).name('Z Position')
directionalFolder.addColor(directionalLight, 'color').name('Color')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()