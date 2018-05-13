
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var camera, controls, scene, renderer, stats;
var dials  = []
init();
animate();
function init() {
  var objloader = new THREE.OBJLoader();
  var len_multiplier = 0
  var geometry = new THREE.CubeGeometry( 1,1,1 );
  var material = new THREE.MeshPhongMaterial( { color: 0x00ffff} );
  for(var i = 0; i<10; i++){
    objloader.load(
      // resource URL
      'assets/dial_mtl.obj',
      // called when resource is loaded
      function ( object ) {
        mesh = new THREE.Mesh(geometry, material  )
        mesh.position.z = mesh.position.z + 1.15*len_multiplier - 1.15*4
        mesh. position.x = mesh.position.x + 6
        scene.add(mesh)
        dials.push(mesh)
        console.log(object)
        object.position.z = object.position.z + 1.15*len_multiplier - 1.15*4
        console.log(object.position.z)
        object.updateMatrix();
        object.matrixAutoUpdate = false
        scene.add(object)
        dials.push(object)
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
  camera.position.z = 15;
  controls = new THREE.TrackballControls( camera );
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = true;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  controls.keys = [ 65, 83, 68 ];
  controls.addEventListener( 'change', render );
  // world
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xcccccc );
  scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

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

  document.addEventListener( 'mousedown', onDocumentMouseDown );
  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('mouseup', onDocumentMouseUp);
  var intersects

  var isDragging = false;
  var previousMousePosition = {
    x: 0,
    y: 0
  };

  function onDocumentMouseDown( event ) {
      var previousMousePosition = {
        x: 0,
        y: 0
      };
      event.preventDefault();
      var mouse3D = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,-( event.clientY / window.innerHeight ) * 2 + 1,  0.5 );
      var raycaster =  new THREE.Raycaster();
      raycaster.setFromCamera( mouse3D, camera );
      intersects = raycaster.intersectObjects( dials );
      console.log(intersects)
      if ( intersects.length > 0 ) {
          isDragging = true
          controls.rotateSpeed = 0.0;
      }
      render();
  }

  function onDocumentMouseMove(event){
    event.preventDefault();

    var deltaMove = {
      x: event.offsetX-previousMousePosition.x,
      y: event.offsetY-previousMousePosition.y
    };
    if(isDragging) {
      console.log("Dragging")
      var deltaRotationQuaternion = new THREE.Quaternion()
      .setFromEuler(new THREE.Euler(
        0,//toRadians(deltaMove.y * 1),
        0,//toRadians(deltaMove.x * 1),
        toRadians((deltaMove.y-deltaMove.x)*1),
        'XYZ'
      ));

      intersects[0].object.quaternion.multiplyQuaternions(deltaRotationQuaternion, intersects[0].object.quaternion);
    }

    previousMousePosition = {
      x: event.offsetX,
      y: event.offsetY
    };

    render();
  }

  function onDocumentMouseUp( event ){
    intersects = []
    isDragging = false
    controls.rotateSpeed = 1.0;
    render();
  }

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

function toRadians(angle) {
	return angle * (Math.PI / 180);
}

function toDegrees(angle) {
	return angle * (180 / Math.PI);
}
