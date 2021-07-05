import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Mesh } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// FOG (color, near, far)
const fogColor = 'rgb(6, 44, 44)'
const fog = new THREE.Fog(fogColor, 1, 15)
scene.fog = fog


/**
 * Textures
 */
// Door Textures
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('textures/door/alpha.jpg')
const doorAoTexture = textureLoader.load('textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('textures/door/height.jpg')
const doorMetalnessTexture = textureLoader.load('textures/door/metalness.jpg')
const dooNormalTexture = textureLoader.load('textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('textures/door/roughness.jpg')

// Wall textures
const wallColorMap = textureLoader.load('/textures/bricks/color.jpg')
const wallAoMap = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const wallNormalMap = textureLoader.load('/textures/bricks/normal.jpg')
const wallRoughnessMap = textureLoader.load('/textures/bricks/roughness.jpg')

// Grass textures
const grassColorMap = textureLoader.load('/textures/grass/color.jpg')
const grassAoMap = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalMap = textureLoader.load('/textures/grass/normal.jpg')
const grassRouhnessMap = textureLoader.load('/textures/grass/roughness.jpg')

grassColorMap.repeat.set(8,8)
grassAoMap.repeat.set(8,8)
grassNormalMap.repeat.set(8,8)
grassRouhnessMap.repeat.set(8,8)

grassColorMap.wrapS = THREE.RepeatWrapping
grassAoMap.wrapS = THREE.RepeatWrapping
grassNormalMap.wrapS = THREE.RepeatWrapping
grassRouhnessMap.wrapS = THREE.RepeatWrapping

grassColorMap.wrapT = THREE.RepeatWrapping
grassAoMap.wrapT = THREE.RepeatWrapping
grassNormalMap.wrapT = THREE.RepeatWrapping
grassRouhnessMap.wrapT = THREE.RepeatWrapping


/**
 * House
 */
// House - Group
const house = new THREE.Group()
scene.add(house)
// House Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.8, 4),
    new THREE.MeshStandardMaterial({ 
        map: wallColorMap,
        aoMap: wallAoMap,
        roughnessMap: wallRoughnessMap,
        normalMap: wallNormalMap
     })
)
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)
walls.position.y = 2.8 * 0.5
house.add(walls)
// House - Roof
const roof = new Mesh(
    new THREE.ConeBufferGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45'})
)
roof.position.y = 1/2 + 2.8
// pi half of circle
roof.rotation.y = Math.PI * 0.25
house.add(roof)
// House - Door
const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2.5,2.5, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture, 
        aoMap: doorAoTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: dooNormalTexture,

    })
)
// map uv for ambient occlusion
door.geometry.setAttribute(
    'uv2', 
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.y = 1.13
door.position.z = 2.01
house.add(door)
/**
 * Bushes
 */
// Bushes - group
const bushes = new THREE.Group()
scene.add(bushes)
// Bushes - Base
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: "green"})

// Bushes - Objects
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(- 0.8, 0.2, 2.2)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(- 1, 0.05, 2.6)
bushes.add(bush1, bush2, bush3, bush4)

// Graves
const graves = new THREE.Group()
scene.add(graves)
// Graves - base
const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({ color: 'grey '})



const numberOfGraves = 50
for(let i=0; i < numberOfGraves; i++) {
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    const angle = Math.random() * Math.PI * 2 // random angle
    const radius = 4 + Math.random() * 6 // random radius
    const x = Math.cos(angle) * radius
    const z= Math.sin(angle) * radius
    grave.position.set(x, 0.3, z)
    grave.rotation.z = (Math.random() -0.5) * 0.4
    grave.rotation.y = (Math.random() -0.5) * 0.4

    graves.add(grave)
}

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorMap,
        aoMap: grassAoMap,
        roughnessMap: grassRouhnessMap,
        normalMap: grassNormalMap
    })
)
floor.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

// Door Light 
const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
console.log(doorLight)
doorLight.position.set(0, 2.2, 2.7)
house.add(doorLight)
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
renderer.setClearColor(fogColor)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()