/* globals THREE Stats */
// import * as THREE from 'https://threejs.org/build/three.module.js';
//
// import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js';
//
// import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
// import { FBXLoader } from 'https://threejs.org/examples/jsm/loaders/FBXLoader.js';
(function(){

  (function(w,r){
    w['r'+r] = w['r'+r] ||
    w['webkitR'+r] ||
    w['mozR'+r] ||
    w['oR'+r] ||
    w['msR'+r] ||
    function(callback){w.setTimeout(callback,1000/60);};
  })(window,'equestAnimationFrame');

  (function(w,c){
    w['c'+c] = w['c'+c] ||
    w['webkitC'+c] ||
    w['mozC'+c] ||
    w['oC'+c] ||
    w['msC'+c] ||
    function(callback){w.clearTimeout(callback);};
  })(window,'ancelAnimationFrame');

  var dom,
  stats,
  mp = Math.PI,
  ctrl,
  camera,
  scene,
  renderer,
  light,
  clock = new THREE.Clock(),
  rad = function(r){return r * (Math.PI / 180);},
  mixer;


  var init = function() {

    dom = document.querySelector('canvas');

    renderer = new THREE.WebGLRenderer({ antialias: true,canvas:dom });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.shadowMap.enabled = true;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    scene.fog = new THREE.Fog( 0xa0a0a0, 200, 800 );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 200, 200, 300 );

    light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 100, 0 );
    scene.add( light );

    // light = new THREE.DirectionalLight( 0xffffff );
    light = new THREE.DirectionalLight( 0xffffff,0.6 );
    light.position.set( 0, 100, 200 );
    light.castShadow = true;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = - 100;
    light.shadow.camera.left = - 100;
    light.shadow.camera.right = 100;
    scene.add( light );

    // scene.add( new THREE.CameraHelper( light.shadow.camera ) );

    // ground
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 500, 500 ),
    new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = rad(-90);
    mesh.receiveShadow = true;
    scene.add( mesh );

    var grid = new THREE.GridHelper( 1000, 40, 0xff0000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );

    // model
    var mgt = new THREE.LoadingManager();
    mgt.onProgress = function(url,loaded,total){
      var per =  (loaded / total * 100) | 0;
      $('.loading div').html(per + '%');
      $('.loading span span').attr('style','width:'+per+'%;');
    };

    mgt.onLoad = function(){
      $('.loading').addClass('opacity');
    };

    var loader = new THREE.ColladaLoader(mgt);
    // var loader = new THREE.FBXLoader(mgt);
    loader.load(
      // 'bone_move.fbx',
      'data/simple.dae',
      function ( d ) {
        // mixer = new THREE.AnimationMixer( d );
        mixer = new THREE.AnimationMixer( d.scene );
        mixer.clipAction( d.animations[ 0 ] ).play();

        // d.traverse( function ( child ){
        d.scene.traverse( function ( child ){
          if ( child.isMesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        d.scene.scale.x = 16;
        d.scene.scale.y = 16;
        d.scene.scale.z = 16;

        d.scene.position.y = 78;

        scene.add( d.scene );
      }
    );

      ctrl = new THREE.OrbitControls( camera, renderer.domElement );
      ctrl.target.set( 0, 50, 0 );
      ctrl.enablePan = true;
      ctrl.update();

      // stats
      stats = new Stats();
      document.body.appendChild( stats.dom );

      load();

    };
    //init

    var load = function() {
      if(mixer !== undefined){
        mixer.update(clock.getDelta());
      }
      renderer.render( scene, camera );
      stats.update();
      requestAnimationFrame( load );
    };

    $(window).on('resize',function(){
      var w = window.innerWidth,
      h = window.innerHeight;
      renderer.setSize(w,h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });

    init();


  })();