
window.onload = function init() {

    var done = false;
    var enemy_fish = [];
    var j;
    var request;
    var requestStatus = true;
    var speed;
    var randomFishNum;
    var scene;
    var camera;
    var light;
    var fish;
    var controls;
    var mixers = [];
    var clock = new THREE.Clock();
	var fishColor = [];
	var fileName = ['./model/scene2.gltf','./model/scene3.gltf','./model/scene4.gltf','./model/scene5.gltf'];
    var music_BG;
	var music_die=[];
	var music_die_fileName = ['audio/die.mp3','audio/die2.wav','audio/die3.wav','audio/die4.mp3'];
	var up,
    down,
    left,
    right;
    var size;

	/*
	Load canvas and renderer
	*/
    const canvas = document.getElementById("gl-canvas");
    const renderer = new THREE.WebGLRenderer({
        canvas
    });
	
	
	/*
	Executed when the game is stared (restarted)
	*/
    function gameStart() {
		var mixer;
		var action;
		
		/*
		Set music and play background music with loop
		*/
		music_BG = new Audio('audio/background.wav');
		music_die = [new Audio('audio/die.mp3'),new Audio('audio/die2.wav'),new Audio('audio/die3.wav'),new Audio('audio/die4.mp3')];
		music_BG.play();
		music_BG.loop = true;
	
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
            fish.scale.set(0.05, 0.05, 0.05);
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
        background = createBackground(120, 180);
        background.position.x -= 80;
        background.name = 'background';
        scene.add(background);
		/*
		Set water filter
		*/
        waterCover = createWaterCover(0.5, 50, 180);
        waterCover.position.x += 1;
        waterCover.name = 'water';
        scene.add(waterCover);

		/*
		Set orbit control and disable to move camera
		*/
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.update();
        controls.enabled = false;

    }
	
	/*
	Add listener for keyboard up and down
	Add listener for startButton
	*/
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
	
    document.getElementById('startButton').addEventListener('click', function () {
        randomFishNumElem = document.getElementById("fishNum");
        speedElem = document.getElementById("speed");
        randomFishNum = randomFishNumElem.value;
        speed = speedElem.value / 1000;
        randomFishNumElem.disabled = true;
        speedElem.disabled = true;
        gameStart();
        resetGame();
        randomMake();
        render();
    });
	
	
	/*
	Reset game
	Initialize the setting
	*/
    function resetGame() {
        if (fish) {
            fish.position.set(0, 0, 0);
            fish.scale.set(0.05, 0.05, 0.05);
            while (enemy_fish.length != 0) {
                enemy_fish.pop();
            }
			mixers.splice(0,mixers.length);
            done = false;
            right = false;
            left = false;
            down = false;
            up = false;
            requestStatus = true;
        }
    }
	
	/*
	function to check whether the keyboard is pressed or not.
	*/
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

	/*
	Function that moves the fish depending on 
	whether the keyboard is pressed or not.
	*/
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
	/*
	Function that rotates the fish 
	according to the direction in which the keyboard is pressed.
	*/
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
	
	/*
	Function that when buttons on the top and bottom of the keyboard are removed, 
	it makes the fish look at the front again.
	*/
    function fishRotateBack(i) {
        if (fish) {
            if (i == 'x') {
                fish.rotation.x = 0;
            }
        }
    }
	/*
	function that create n fish
	*/
    function randomMake() {

        for (var i = 0; i < randomFishNum; i++) {
            j = 0;
            addRandomFish();
        }

    }
	
	/*
	function that creates enemy fish
	The size of the relative fish is proportional to the friendly fish.
	The color of the enemy fish is randomly determined, 
	and rainbow-colored fish are much less likely to appear.
	*/
	function addRandomFish() {
		var model;
		var scale;
        var direction = 0;
        const loader = new THREE.GLTFLoader();
		var index = getRandNum(0,32);
		index = Math.floor(index/10);
		var file = fileName[index];
        loader.load(file, function (gltf) {
            model = gltf.scene;
			scale = getRandNum(fish.scale.x * 40, fish.scale.x * 150) / 100;
            model.scale.set(scale, scale, scale);
            direction = getRandomDirection();
            model.position.set(0, getRandNum(-19, 19) / 10, 2.95 * direction);
            if (direction == -1) {
                model.rotation.y = 3;
                model.position.z += getRandNum(-100, 0) / 100;
            } else {
                model.position.z += getRandNum(0, 100) / 100;
            }
            var mixer = new THREE.AnimationMixer(model);
            var action = mixer.clipAction(gltf.animations[0]);
            action.play();
            var z = getRandNum(0, 10);
            model.name = 'enemy_fish' + j + " " + z;
            j++;
            enemy_fish.push(model);
			fishColor.push(fileName.indexOf(file));
            scene.add(model);
            mixers.push(mixer);
        }, undefined, function (error) {
            console.error(error);
        });
    }

	/*
	Function that moves enemy fish.
	The speed of the enemy fish is proportional to its size.
	*/
    function randomMove() {
        if (fish) {
            for (var i = 0; i < randomFishNum; i++) {
                if (enemy_fish[i]) {
                    if (enemy_fish[i].rotation.y == 0) {
                        enemy_fish[i].position.z -= enemy_fish[i].scale.x / 30
                    } else {
                        enemy_fish[i].position.z += enemy_fish[i].scale.x / 30
                    }
                }
            }
        }
    }

	/*
	Function that deletes enemy fish when it's out of a certain range.
	*/
    function deleteRandomAfterMove() {
        var deleted = false;
        if (fish) {
            for (var i = 0; i < randomFishNum; i++) {
                if (enemy_fish[i]) {
                    if (enemy_fish[i].position.z > 3.7 || enemy_fish[i].position.z < -3.7) {
                        var selectedObject = scene.getObjectByName(enemy_fish[i].name);
                        scene.remove(selectedObject);
                        fishColor.splice(i,1);
						enemy_fish.splice(i, 1);
						mixers.splice(i+1, 1);
                        deleted = true;
                    }
                }
            }
        }
		/*
		Add new enemy fish
		(enemy_fish.length < randomFishNum) --> Prevents increasing fishes beyond the set number.
		*/
        if (enemy_fish.length < randomFishNum && deleted) {
            addRandomFish();
        }
    }

	/*
	Function that gives random integer between given two numbers
	*/
    function getRandNum(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
	
	/*
	Function that returns 1 or -1 with same probability
	*/
    function getRandomDirection() {
        if (Math.random() > 0.5) {
            return 1;
        } else {
            return -1;
        }
    }
	
	/*
	Function that checks if my fish and enemy fish is bumped
	If they are bumped and my fish is same or bigger than enemy fish, eat that fish and increase fish size
	and play eating sound 
	If the enemy fish's color is rainbow, increasing size is larger than others
	If the enemy fish is bigger than my fish dies and finish the game
	*/
    function fishCollision() {
        var eat = false;
        if (fish) {
            for (var i = 0; i < randomFishNum; i++) {
                if (enemy_fish[i]) {
                    var selectedObject = scene.getObjectByName(enemy_fish[i].name);
                    var xx = enemy_fish[i].scale.x + fish.scale.x;
                    xx *= 2;
                    if (fish.position.z > enemy_fish[i].position.z - xx * 1.5 && fish.position.z < enemy_fish[i].position.z + xx * 1.5) {
                        if (fish.position.y > (enemy_fish[i].position.y - xx * 0.8) && fish.position.y < (enemy_fish[i].position.y + xx * 0.8)) {
                            if (fish.scale.x >= enemy_fish[i].scale.x) {
                                var music_eat = new Audio('audio/eat.mp3');
								music_eat.play();
								var selectedObject = scene.getObjectByName(enemy_fish[i].name);				
								
								if(fishColor[i]==3){
									console.log("hello");
									fish_size_up((enemy_fish[i].scale.x)*10);
								}else{
									fish_size_up(enemy_fish[i].scale.x);
								}
                                scene.remove(selectedObject);
								fishColor.splice(i, 1);
								
                                enemy_fish.splice(i, 1);
                                mixers.splice(i+1, 1);
								
                                eat = true;
                                sizeElem = document.getElementById("fishSize");
                                sizeElem.innerHTML = Math.floor(fish.scale.x * 10000 - 500);
                            } else {
								var index = getRandNum(0,3);
								music_die[index].play();
								music_BG.loop = false;
								music_BG.pause();
                                requestStatus = false;
                            }
                        }
                    }
                }
            }
        }
        if (enemy_fish.length < randomFishNum && eat) {
            addRandomFish();
        }
    }
	
	/*
	Function that increase my fish's size with given number
	*/
    function fish_size_up(eat_fish_size) {
        var fish_size = fish.scale.x;
        var scale_up = (eat_fish_size * 0.2) + 1;
        fish.scale.set(fish_size * scale_up, fish_size * scale_up, fish_size * scale_up);
    }
	
	/*
	Function that render program (loop)
	If my fish dies, finish the game.
	*/
    function render() {
        fishMove();
        fishRotate();
        randomMove();
        Animate();
        deleteRandomAfterMove();
        fishCollision();
        request = requestAnimationFrame(render);
        renderer.render(scene, camera);
        if (!requestStatus) {
	
            randomFishNumElem.disabled = false;
            speedElem.disabled = false;
            sizeElem = document.getElementById("fishSize");
            sizeElem.innerHTML = 0;
            cancelAnimationFrame(request);
            alert("died");
        }
    }

	/*
	Function that animate fishes
	*/
    function Animate() {
		var delta = clock.getDelta();
        for (var i = 0; i < mixers.length; i++) {
            if (mixers[i]) {
                mixers[i].update(delta);
            }
        }
    }
	/*
	Function that create Background boxgeometry
	*/
    function createBackground(radius, segments) {
        const loader = new THREE.TextureLoader();
        return new THREE.Mesh(
            new THREE.BoxGeometry(radius, radius, segments),
            new THREE.MeshBasicMaterial({
                map: loader.load('./images/background.png'),
                side: THREE.BackSide
            }));
    }
	/*
	Function that create water filter (boxgeometry)
	The filter is blue color and it is transparent 
	So it makes the screen look like it's in the water.
	*/
    function createWaterCover(x, y, z) {
        const loader = new THREE.TextureLoader();
        return new THREE.Mesh(
            new THREE.BoxGeometry(x, y, z),
            new THREE.MeshBasicMaterial({
                map: loader.load('./images/waterCover.png'),
                side: THREE.BackSide,
                opacity: 0.3,
                transparent: true
            }));
    }

}
