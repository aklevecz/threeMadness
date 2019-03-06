
let camera, scene, renderer, mat, sphere
let materialShader
function initContent(scene, camera, renderer) {
    scene.background = new THREE.Color( 0xcccccc )

    mat = new THREE.MeshLambertMaterial({
        color: "green",
        transparent: true,
        opacity: 0.5
    })

    mat.onBeforeCompile = (shader) => {
        // add time unifrom to structure
        shader.uniforms.time = { value:0 }
        shader.vertexShader = `uniform float time;
                                ` + shader.vertexShader

        const token = '#include <begin_vertex>'
        const customTransform = `
            vec3 transformed = vec3(position);
            transformed.x = position.x + sin(position.y*10.0 + time*10.0) * 0.1;
        `

        shader.vertexShader = shader.vertexShader.replace(token,customTransform)
        materialShader = shader
    }

    sphere = new THREE.Mesh(new THREE.SphereGeometry(2,16,32), mat)
    sphere.position.z = -5
    sphere.position.y =0
    scene.add(sphere)

    const light = new THREE.DirectionalLight( 0xFFFFFF, 1.0)
    light.position.set( 1,1,1 ).normalize()
    scene.add(light)
    scene.add(new THREE.AmbientLight(0xFFFFFF,0.3))
}
function render(time) {
    if(materialShader) materialShader.uniforms.time.value = time / 1000
    renderer.render( scene,camera )
}

function initScene(){
    const container = document.createElement( 'div')
    document.body.appendChild(container)
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 50)
    renderer = new THREE.WebGLRenderer( {antialias:true} )
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, window.innerHeight)
    container.appendChild( renderer.domElement )

    initContent(scene,camera,renderer)

    window.addEventListener( 'resize', ()=>{
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        }, false );

    THREE.DefaultLoadingManager.onStart = (url, loaded, total) => {
        console.log(`loading ${url}.  loaded ${loaded} of ${total}`)
    }
    THREE.DefaultLoadingManager.onLoad = () => {
        console.log(`loading complete`)
        console.log("really setting it up now")
        $('#loading-indicator').style.display = 'none'
        $('#click-to-play').style.display = 'block'
        const overlay = $('#overlay')
        $("#click-to-play").addEventListener('click',()=>{
            overlay.style.visibility = 'hidden'
            if($('#enter-vr'))  $('#enter-vr').removeAttribute('disabled')
        })
    }
    THREE.DefaultLoadingManager.onProgress = (url, loaded, total) => {
        console.log(`prog ${url}.  loaded ${loaded} of ${total}`)
        $("#progress").setAttribute('value',100*(loaded/total))
    }
    THREE.DefaultLoadingManager.onError = (url) => {
        console.log(`error loading ${url}`)
    }
}
initScene()
renderer.setAnimationLoop(render)



















// console.log(GPUParticleSystem)
// const scene = new THREE.Scene()
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
// const light = new THREE.AmbientLight(0x404040)
// scene.add(light)
// const renderer = new THREE.WebGLRenderer()
// renderer.setSize( window.innerWidth, window.innerHeight )
// document.body.appendChild( renderer.domElement )

// const rand = (min,max) => min + Math.random() * (max-min)

// function setupScene() {
//    const options = {
//        maxParticles: 10000,
//        position: new THREE.Vector3(0,5,-5),
//        positionRandomness: 0.0,
//        baseVelocity: new THREE.Vector3(0.0, -1.0, 0.0),
//        velocity: new THREE.Vector3(0.0, -0.5, 0.0),
//        velocityRandomness: 1.0,
//        acceleration: new THREE.Vector3(0.0,0.0,0.0),
//        color: new THREE.Color(1.0, 1.0, 1.0),
//        endColor: new THREE.Color(1.0,1.0,1.0),
//        colorRandomness: 0.0,
//        lifetime: 30.0,
//        size: 20,
//        sizeRandomness: 30.0,
//        particleSpriteTexture
//    }
// }
// setupScene()
// time = 1
// function animate() {
//     mesh.material.uniforms.time.value = time/1000
//     time++
//     mesh.geometry.verticesNeedUpdate = true
//      renderer.render( scene, camera );
//      requestAnimationFrame(animate)
// }
// animate()
