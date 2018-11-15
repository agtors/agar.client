// Add 3 light on the scene
function setUpLight(scene) {
    let lightDirectional = new THREE.DirectionalLight( 0xffffff );
    lightDirectional.position.set(1, 1, 1);
    lightDirectional.castShadow = true
    scene.add(lightDirectional);

    let lightDirectional2 = new THREE.DirectionalLight(0x002288);
    lightDirectional2.position.set(-1, -1, -1);
    lightDirectional2.castShadow = true
    scene.add(lightDirectional2);

    let lightAmbient = new THREE.AmbientLight(0x222222, 1);
    scene.add(lightAmbient);
}
