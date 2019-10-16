/*globals THREE */
(() => {
  var dom = document.querySelector('canvas'),
  width = window.innerWidth,
  height = window.innerHeight,
  mp = Math.PI,
  renderer,
  ctrl,
  scene,
  camera,
  clock = new THREE.Clock(),
  mixer,
  y = 6,
  z = 20,
  reqRet,
  rad = function(r){return r * (Math.PI / 180);};



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

  var init = function(){
    renderer = new THREE.WebGLRenderer({
      canvas:dom
    });
    renderer.setSize(width,height);
    renderer.setPixelRatio(window.devicePixelRatio);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60,width / height,1,10000);
    camera.position.set(0, y, z);


    //ライト
    var light_1 = new THREE.DirectionalLight(0xffffff,1);
    var light_2 = new THREE.AmbientLight(0xffffff,1);
    scene.add(light_2);
    light_1.position.set(0,10,20);
    // scene.add(light_1);

    var helper = new THREE.DirectionalLightHelper(light_1);
    scene.add(helper);

    //OrbitControls
    ctrl = new THREE.OrbitControls(camera,dom);
    // ctrl.autoRotate = true;
    // ctrl.enableZoom = false;
    // ctrl.enablePan = false;

    //背景色
    renderer.setClearColor(0x000000, 1.0);

    // clock = new THREE.Clock();


    var cen;
    var loader = new THREE.ColladaLoader();
    loader.load(
      './data/simple.dae',
      function(d){
        cen = d.scene;
        mixer = new THREE.AnimationMixer(cen);
        mixer.clipAction(d.animations[0]).play();

        cen.rotation.z = rad(-30);

        scene.add(cen);
      });


      load();
    };
    //init fnc

    //毎秒描画
    var load = function(){
      ctrl.update();

      if(mixer !== undefined){
        mixer.update(clock.getDelta());
      }
      renderer.render(scene,camera);
      requestAnimationFrame(load);
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
