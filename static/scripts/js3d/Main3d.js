class Main3D {
    constructor() {
        this.init()
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            45,    // kąt patrzenia kamery (FOV - field of view)
            16 / 9,    // proporcje widoku, powinny odpowiadać proporcjom naszego ekranu przeglądarki
            0.1,    // minimalna renderowana odległość
            10000    // maksymalna renderowana odległość od kamery
        );
        this.renderer = new THREE.WebGLRenderer(
            {antialias: true}
        );
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xffffff);
        document.getElementById("root").appendChild(this.renderer.domElement);
        // this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // // let axesHelper = new THREE.AxesHelper(1000);
        // // this.scene.add(axesHelper);
        // this.controls.addEventListener("change", () => {
        //     this.renderer.render(this.scene, this.camera)
        // })
        let geometry = new THREE.PlaneGeometry(2 * settings.radius * 200, 2 * settings.radius * 200, 200, 200);
        let material = new THREE.MeshPhongMaterial({
            specular: 0xffffff,
            shininess: 10,
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load(settings.material_floor)

        })
        material.map.magFilter = THREE.NearestFilter;
        material.map.wrapS = THREE.RepeatWrapping;
        material.map.wrapT = THREE.RepeatWrapping;
        material.map.repeat.set(settings.radius * 100, settings.radius * 100);
        let plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = Math.PI / 2
        plane.position.x = -20
        plane.position.y = 0
        plane.position.z = -20
        this.scene.add(plane)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.lights = []
        this.allies = []
        this.raycaster = new THREE.Raycaster();
        this.loadLevel()
        this.mouse_vector = new THREE.Vector2()
        this.distance = 0
        this.renderer.render(this.scene, this.camera)
        this.all_allies = []
        this.mouse_down = false
        this.mouseover()
        this.render()
        this.ring = new Ring()
        this.last_hightlighed = null
    }

    loadLevel() {
        async function loadData() {
            let response = await fetch("/load_3d", {
                method: "POST"
            })
            let data = await response.json()
            data = main3d.refactorData(data.data)
            main3d.generateLevel(data)
        }

        loadData()
    }

    generateLevel(data) {
        let radius = settings.radius
        let level_size = parseInt(data.level_size)
        let selected_hexs = data.selected_hexs
        let xpos = 0;
        let zpos = 0;
        for (let y = 0; y < level_size; y++) {
            for (let x = 0; x < level_size; x++) {
                let hex_exists = selected_hexs.find(element => element.x == x && element.y == y)
                if (hex_exists) {
                    let hex = new Hex3D(hex_exists.dir_in, hex_exists.dir_out)
                    hex.position.z = x % 2 === 1 ? zpos + radius : zpos
                    hex.position.x = xpos
                    this.scene.add(hex)
                    if (x == selected_hexs[0].x && y == selected_hexs[0].y) {
                        this.player = new Model()
                        this.player.loadModel(function (modeldata) {
                            main3d.scene.add(modeldata) // data to obiekt kontenera zwrócony z Model.js
                        })
                        this.player.getPlayerCont().position.x = xpos
                        this.player.getPlayerCont().position.z = x % 2 === 1 ? zpos + radius : zpos
                        this.camera.position.x = this.player.getPlayerCont().position.x
                        this.camera.position.z = this.player.getPlayerCont().position.z + 10
                        this.camera.position.y = this.player.getPlayerCont().position.y + 10
                        this.camera.lookAt(this.player.getPlayerCont().position)
                        this.clickToMove()
                    }
                    if (hex_exists.type === "treasure") {
                        let treasure = new Treasure()
                        treasure.position.x = xpos
                        treasure.position.y = 0.75
                        treasure.position.z = x % 2 === 1 ? zpos + radius : zpos
                        this.scene.add(treasure)
                    } else if (hex_exists.type === "light") {
                        let light = new Light()
                        light.position.x = xpos
                        light.position.y = 5
                        light.position.z = x % 2 === 1 ? zpos + radius : zpos
                        this.lights.push(light)
                        this.scene.add(light)
                    } else if (hex_exists.type === "enemy") {
                        let ally = new Ally()
                        ally.loadModel(function (modeldata) {
                            main3d.scene.add(modeldata) // data to obiekt kontenera zwrócony z Model.js
                        })
                        ally.position.x = xpos
                        ally.position.z = x % 2 === 1 ? zpos + radius : zpos
                        this.all_allies.push(ally)
                    }
                }
                xpos += 2 * radius - 1
            }
            xpos = 0
            zpos += 2 * radius
        }
        this.renderer.render(this.scene, this.camera)
    }

    refactorData(data) {
        let array = data.selected_hexs
        array.forEach((element, index) => {
            if (index !== 0) {
                element.dir_in = array[index - 1].dir_out - 3 < 0 ? parseInt(array[index - 1].dir_out) + 3 : parseInt(array[index - 1].dir_out) - 3
            }
        })
        array[0].dir_in = null
        array[array.length - 1].dir_out = null
        data.selected_hexs = array
        return data
    }

    clickToMove() {
        let canvas = document.getElementById("root").children[0]
        canvas.addEventListener("mouseup", () => {
            this.mouse_down = false
        })
        canvas.addEventListener("mousedown", event => {
            this.mouse_down = true
            move(event)
        })
        canvas.addEventListener("mousemove", event => {
            if (this.mouse_down)
                move(event)
        })

        let move = event => {
            this.clickedVect = new THREE.Vector3(0, 0, 0);
            this.directionVect = new THREE.Vector3(0, 0, 0);
            this.mouse_vector.x = (event.offsetX / canvas.width) * 2 - 1
            this.mouse_vector.y = -(event.offsetY / canvas.height) * 2 + 1
            this.raycaster.setFromCamera(this.mouse_vector, this.camera)
            this.intersects = this.raycaster.intersectObjects(this.scene.children, true)
            if (this.intersects.length > 0) {
                if (this.intersects[0].object.parent.ally && event.type === "mousedown") {
                    if (!this.intersects[0].object.parent.clicked) {
                        this.intersects[0].object.parent.remove(this.ring)
                        this.allies.push(this.intersects[0].object.parent)
                        let allies_counter = this.allies.length
                        this.intersects[0].object.parent.clicked = true
                        if (allies_counter === 1)
                            this.allies[0].clickedVect = this.player.getPlayerCont().position
                        else
                            this.allies[allies_counter - 1].clickedVect = this.allies[allies_counter - 2].position
                        this.allies[allies_counter - 1].directionVect = this.allies[allies_counter - 1].clickedVect.clone().sub(this.allies[allies_counter - 1].position).normalize()
                        this.allies[allies_counter - 1].join_distance = this.allies[allies_counter - 1].position.clone().distanceTo(this.allies[allies_counter - 1].clickedVect)
                        this.allies[allies_counter - 1].angle = Math.atan2(
                            this.allies[allies_counter - 1].position.clone().x - this.allies[allies_counter - 1].clickedVect.x,
                            this.allies[allies_counter - 1].position.clone().z - this.allies[allies_counter - 1].clickedVect.z
                        )
                        this.allies[allies_counter - 1].meshModel.rotation.y = this.angle - Math.PI / 2

                    }
                } else {
                    if (this.sphere)
                        this.scene.remove(this.sphere)
                    this.clickedVect = this.intersects[0].point
                    this.clickedVect.y = 0
                    this.directionVect = this.clickedVect.clone().sub(this.player.getPlayerCont().position).normalize() // sub - > odejmij pozycję playera od pozycji kliknięcia
                    let geometry = new THREE.SphereGeometry(0.03, 32, 32);
                    let material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
                    this.sphere = new THREE.Mesh(geometry, material);
                    this.sphere.position.x = this.clickedVect.x
                    this.sphere.position.z = this.clickedVect.z
                    this.scene.add(this.sphere);
                    this.distance = this.player.getPlayerCont().position.clone().distanceTo(this.clickedVect)
                    this.angle = Math.atan2(
                        this.player.getPlayerCont().position.clone().x - this.clickedVect.x,
                        this.player.getPlayerCont().position.clone().z - this.clickedVect.z
                    )
                    this.player.getPlayerMesh().rotation.y = this.angle - Math.PI / 2
                }
            }
        }
    }

    mouseover() {
        let highlight = event => {
            this.mouse_vector.x = (event.offsetX / canvas.width) * 2 - 1
            this.mouse_vector.y = -(event.offsetY / canvas.height) * 2 + 1
            this.raycaster.setFromCamera(this.mouse_vector, this.camera)
            this.intersects = this.raycaster.intersectObjects(this.scene.children, true)
            if (this.intersects.length > 0) {
                if (this.intersects[0].object.parent.ally && !this.intersects[0].object.parent.clicked) {
                    this.intersects[0].object.parent.add(this.ring)
                    this.last_hightlighed = this.intersects[0].object.parent
                }
                else if(this.last_hightlighed){
                    this.last_hightlighed.remove(this.ring)
                    this.last_hightlighed = null
                }
            }
        }
        let canvas = document.getElementById("root").children[0]
        canvas.addEventListener("mousemove", event => {
            highlight(event)

        })
    }


    render() {

        let main3d = this

        function render() {


            // w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
            // np zmieniająca się wartość rotacji obiektu
            if (main3d.sphere) {
                if (main3d.distance > 0) {
                    main3d.allies.forEach((element, index) => {
                        if (index === 0)
                            element.clickedVect = main3d.player.getPlayerCont().position
                        else
                            element.clickedVect = main3d.allies[index - 1].position
                        element.directionVect = element.clickedVect.clone().sub(element.position).normalize()
                        element.distance = element.position.clone().distanceTo(element.clickedVect)
                        element.angle = Math.atan2(
                            element.position.clone().x - element.clickedVect.x,
                            element.position.clone().z - element.clickedVect.z,
                        )
                        element.children[0].rotation.y = element.angle - Math.PI / 2
                        if (element.distance > 1.5) {
                            element.translateOnAxis(element.directionVect, 0.1)
                        }
                        element.is_running = true
                        element.setAnimation("run")
                    })
                    main3d.player.getPlayerCont().translateOnAxis(main3d.directionVect, 0.1)
                    main3d.distance -= 0.1
                    main3d.camera.position.x = main3d.player.getPlayerCont().position.x
                    main3d.camera.position.z = main3d.player.getPlayerCont().position.z + 10
                    main3d.camera.position.y = main3d.player.getPlayerCont().position.y + 10
                    main3d.camera.lookAt(main3d.player.getPlayerCont().position)
                    main3d.player.setAnimationRun()
                    main3d.player.delta = main3d.player.clock.getDelta();
                    main3d.player.updateModel()

                } else {
                    main3d.player.getPlayerCont().position.y = 0
                    main3d.player.setAnimationStand()
                    main3d.player.delta = main3d.player.clock.getDelta();
                    main3d.player.updateModel()
                    for (const element of main3d.allies) {
                        element.is_running = false
                    }
                }
                main3d.allies.forEach((element, index) => {
                    if (element.join_distance > 1.5) {
                        element.setAnimation("run")
                        element.is_running = true
                        element.translateOnAxis(element.directionVect, 0.1)
                        element.join_distance -= 0.1
                    }
                })
            }
            for (const element of main3d.all_allies) {
                if (!element.is_running)
                    element.setAnimation("stand")
                element.updateModel()
            }
            if (main3d.ring) {
                main3d.ring.rotation.z += 0.01
            }
            // wykonywanie funkcji bez końca, ok 60 fps jeśli pozwala na to wydajność maszyny

            requestAnimationFrame(render);

            // potwierdzenie w konsoli, że render się wykonuje

            //ciągłe renderowanie / wyświetlanie widoku sceny naszą kamerą
            main3d.renderer.render(main3d.scene, main3d.camera)
        }

        render();

    }
}