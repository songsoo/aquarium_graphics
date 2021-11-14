window.onload = function init()
{
	var request;
	var requestStatus = true;
	var fish;
	var speed = 0.05;
	var mixers = [];
	var scene;
	var camera;
	var up,
    down,
    left,
    right;
	var clock = new THREE.Clock();
	
	const canvas = document.getElementById("gl-canvas");

	const renderer = new THREE.WebGLRenderer({canvas});

	function explainStart() {
		var mixer;
		var action;
	
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.01, 1000);
        camera.position.x = 5;

		/*
		Set Light
		*/
        scene.add(new THREE.AmbientLight(0x555555));

        light = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.position.set(5, 3, 0);
        scene.add(light);

		/*
		Load my fish model and set default
		Animate fish
		*/
        const loader = new THREE.GLTFLoader();
        loader.load('./model/scene.gltf', function (gltf) {
            fish = gltf.scene;
            fish.scale.set(0.1, 0.1, 0.1);
            gltf.scene.name = 'fish';

            mixer = new THREE.AnimationMixer(fish);
            action = mixer.clipAction(gltf.animations[0]);
            action.play();

            scene.add(gltf.scene);
            mixers.push(mixer);
        }, undefined, function (error) {
            console.error(error);
        });

		/*
		Set background Image
		*/
        background = createExBackground(120, 180);
        background.position.x -= 80;
        background.name = 'background';
        scene.add(background);

		/*
		Set orbit control and disable to move camera
		*/
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.update();
        controls.enabled = false;

    }

	document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
	
	document.getElementById('explainButton').addEventListener('click', function () {
		explainStart()
		right = false;
		left = false;
		down = false;
		up = false;
		requestStatus = true;
        renderEx();
    });
	
	function keyDownHandler(e) {
        if (e.keyCode == 39) {
            right = true;
        }
        if (e.keyCode == 37) {
            left = true;
        }
        if (e.keyCode == 38) {
            down = true;
        }
        if (e.keyCode == 40) {
            up = true;
        }
    }
    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            right = false;
        }
        if (e.keyCode == 37) {
            left = false;
        }
        if (e.keyCode == 38) {
            down = false;
            fishRotateBack('x');
        }
        if (e.keyCode == 40) {
            up = false;
            fishRotateBack('x');
        }
    }
	
	function fishMove() {

        if (fish) {
            if (right == true) {
                if (fish.position.z > -2.95 + fish.scale.x * 3) {
                    fish.position.z = fish.position.z - speed;
                }
            }
            if (left == true) {
                if (fish.position.z < 2.95 - fish.scale.x * 3) {
                    fish.position.z = fish.position.z + speed;
                }
            }
            if (up == true) {
                if (fish.position.y > -2.2 + fish.scale.x * 3) {
                    fish.position.y = fish.position.y - speed;
                }
            }
            if (down == true) {
                if (fish.position.y < 2.2 - fish.scale.x * 3) {
                    fish.position.y = fish.position.y + speed;
                }
            }
        }

    }
	
	function fishRotate() {
        if (fish) {
            if (right == true) {
                fish.rotation.y = 0
            }
            if (left == true) {
                fish.rotation.y = 3
            }
            if (up == true) {
                if (fish.rotation.y == 0) {
                    fish.rotation.x = -0.3
                } else if (fish.rotation.y == 3) {
                    fish.rotation.x = 0.3
                }
            }
            if (down == true) {
                if (fish.rotation.y == 0) {
                    fish.rotation.x = 0.3
                } else if (fish.rotation.y == 3) {
                    fish.rotation.x = -0.3
                }
            }
        }
    }
	
	function fishRotateBack(i) {
        if (fish) {
            if (i == 'x') {
                fish.rotation.x = 0;
            }
        }
    }
	
	function Animate() {
        for (var i = 0; i < mixers.length; i++) {
            if (mixers[i]) {
                var delta = clock.getDelta();
                mixers[i].update(delta);
            }
        }
    }
	
	function createExBackground(radius, segments) {
        const loader = new THREE.TextureLoader();
        return new THREE.Mesh(
            new THREE.BoxGeometry(radius, radius, segments),
            new THREE.MeshBasicMaterial({
                map: loader.load('./images/exBackGround.jpg'),
                side: THREE.BackSide
            }));
    }
	
	function renderEx() {
		fishMove();
        fishRotate();
		Animate();
		request = requestAnimationFrame(renderEx);
		renderer.render(scene, camera);	
  }

}