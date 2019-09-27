/*globals THREE */
(() => {
    var dom = document.querySelector('canvas'),
    width = window.innerWidth,
    height = window.innerHeight,
    mp = Math.PI,
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

    var renderer = new THREE.WebGLRenderer({
        canvas:dom
    });
    renderer.setSize(width,height);
    renderer.setPixelRatio(window.devicePixelRatio);

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(60,width / height,1,10000);
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
    var ctrl = new THREE.OrbitControls(camera,dom);
    // ctrl.autoRotate = true;
    // ctrl.enableZoom = false;
    // ctrl.enablePan = false;

    //背景色
    renderer.setClearColor(0x000000, 1.0);

    var cen;
    var loader = new THREE.ColladaLoader();
    loader.load(
      './data/simple.dae',
      function(collada){
        cen = collada.scene;
        scene.add(cen);
      });

    //毎秒描画
    var load = function(){
        ctrl.update();
        renderer.render(scene,camera);
        requestAnimationFrame(load);
    };
    load();


    $(window).on('resize',function(){
        var w = window.innerWidth,
        h = window.innerHeight;
        renderer.setSize(w,h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
})();
