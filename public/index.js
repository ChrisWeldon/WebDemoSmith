
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var camera, controls, scene, renderer, stats;
init();
animate();
function init() {
  var objloader = new THREE.OBJLoader();
  var matloader = new THREE.MaterialLoader();
  var len_multiplier = 0
  for(var i = 0; i<10; i++){

    objloader.load(
      // resource URL
      'assets/dial_mtl.obj',
      // called when resource is loaded
      function ( object ) {
        console.log(object)
        object.position.z = object.position.z + 1.15*len_multiplier - 1.15*4
        console.log(object.position.z)
        object.updateMatrix();
        object.matrixAutoUpdate = false
        scene.add(object)
        len_multiplier++
      },
      // called when loading is in progresses
      function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

        console.log( 'An error happened' );

      }
    );
  }

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 500;
  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  controls.keys = [ 65, 83, 68 ];
  controls.addEventListener( 'change', render );
  // world
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xcccccc );
  scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );
  var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
  var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
  /*for ( var i = 0; i < 500; i ++ ) {
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = ( Math.random() - 0.5 ) * 1000;
    mesh.position.y = ( Math.random() - 0.5 ) * 1000;
    mesh.position.z = ( Math.random() - 0.5 ) * 1000;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    scene.add( mesh );
  }*/
  // lights
  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 1, 1, 1 );
  scene.add( light );
  var light = new THREE.DirectionalLight( 0x002288 );
  light.position.set( -1, -1, -1 );
  scene.add( light );
  var light = new THREE.AmbientLight( 0x222222 );
  scene.add( light );
  // renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  stats = new Stats();
  document.body.appendChild( stats.dom );
  //
  window.addEventListener( 'resize', onWindowResize, false );
  //
  render();

}



function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  controls.handleResize();
  render();
}
function animate() {
  requestAnimationFrame( animate );
  controls.update();
}
function render() {
  renderer.render( scene, camera );
  stats.update();
}
