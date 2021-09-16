class Main {
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
        this.allies = []
        document.getElementById("root").appendChild(this.renderer.domElement);
        this.camera.position.set(50, 50, 50);
        let axesHelper = new THREE.AxesHelper(1000);
        this.scene.add(axesHelper);
        let geometry = new THREE.PlaneGeometry(400, 400, 200, 200);
        let material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x99aabb

        })
        let plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = Math.PI / 2
        this.scene.add(plane)
        this.renderer.render(this.scene, this.camera)
        let test_geometry = new THREE.BoxGeometry(10, 10, 10)
        let test_material = new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
        this.test = new Test(test_geometry, test_material)
        this.scene.add(this.test)
        this.ally = new AllyTest()
        this.scene.add(this.ally)
        this.raycaster = new THREE.Raycaster();
        this.mouse_vector = new THREE.Vector2()
        this.camera.position.x = this.test.getPlayerCont().position.x
        this.camera.position.z = this.test.getPlayerCont().position.z + 100
        this.camera.position.y = this.test.getPlayerCont().position.y + 100
        this.camera.lookAt(this.test.getPlayerCont().position)
        this.distance = 0
        this.mouse_down = false
        let canvas = document.getElementById("root").children[0]
        canvas.addEventListener("mousedown", event => {
            this.mouse_down = true
            move(event)
        })
        canvas.addEventListener("mouseup", event => {
            this.mouse_down = false
        })
        canvas.addEventListener("mousemove", event => {
                if (this.mouse_down)
                    move(event)
                })
        let move = event =>{
            this.clickedVect = new THREE.Vector3(0, 0, 0);
            this.directionVect = new THREE.Vector3(0, 0, 0);
            this.mouse_vector.x = (event.offsetX / canvas.width) * 2 - 1
            this.mouse_vector.y = -(event.offsetY / canvas.height) * 2 + 1
            this.raycaster.setFromCamera(this.mouse_vector, this.camera)
            this.intersects = this.raycaster.intersectObjects(this.scene.children, true)
            if (this.intersects.length > 0) {
                if (this.intersects[0].object.parent.ally) {
                    if (!this.intersects[0].object.parent.clicked) {
                        this.allies.push(this.intersects[0].object.parent)
                        this.intersects[0].object.parent.clicked = true
                        if (this.allies.length === 1) {
                            this.allies[0].clickedVect = this.test.getPlayerCont().position
                            this.allies[0].directionVect = this.allies[0].clickedVect.clone().sub(this.allies[0].position).normalize()
                            this.allies[0].join_distance = this.allies[0].position.clone().distanceTo(this.allies[0].clickedVect)
                            this.allies[0].angle = Math.atan2(
                                this.allies[0].position.clone().x - this.allies[0].clickedVect.x,
                                this.allies[0].position.clone().z - this.allies[0].clickedVect.z,
                            )
                            this.allies[0].mesh.rotation.y = this.angle - Math.PI
                        }
                    }
                } else {
                    if (this.sphere)
                        this.scene.remove(this.sphere)
                    this.clickedVect = this.intersects[0].point
                    this.directionVect = this.clickedVect.clone().sub(this.test.getPlayerCont().position).normalize() // sub - > odejmij pozycję playera od pozycji kliknięcia
                    let geometry = new THREE.SphereGeometry(2, 32, 32);
                    let material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
                    this.sphere = new THREE.Mesh(geometry, material);
                    this.sphere.position.x = this.clickedVect.x
                    this.sphere.position.z = this.clickedVect.z
                    this.scene.add(this.sphere);
                    this.distance = this.test.getPlayerCont().position.clone().distanceTo(this.clickedVect)
                    this.angle = Math.atan2(
                        this.test.getPlayerCont().position.clone().x - this.clickedVect.x,
                        this.test.getPlayerCont().position.clone().z - this.clickedVect.z
                    )
                    this.test.getPlayerMesh().rotation.y = this.angle - Math.PI
                }
            }
        }
        let main3d = this

        function render() {


            // w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
            // np zmieniająca się wartość rotacji obiektu
            if (main3d.sphere) {
                if (main3d.distance > 0) {
                    main3d.allies.forEach((element, index) => {
                        element.clickedVect = main3d.test.getPlayerCont().position
                        element.directionVect = element.clickedVect.clone().sub(element.position).normalize()
                        element.distance = element.position.clone().distanceTo(element.clickedVect)
                        element.angle = Math.atan2(
                            element.position.clone().x - element.clickedVect.x,
                            element.position.clone().z - element.clickedVect.z,
                        )
                        element.mesh.rotation.y = element.angle - Math.PI
                        if (element.distance > 10) {
                            element.translateOnAxis(element.directionVect, 2)
                        }
                    })
                    main3d.test.getPlayerCont().translateOnAxis(main3d.directionVect, 2)
                    main3d.distance -= 2
                    main3d.camera.position.x = main3d.test.getPlayerCont().position.x
                    main3d.camera.position.z = main3d.test.getPlayerCont().position.z + 100
                    main3d.camera.position.y = main3d.test.getPlayerCont().position.y + 100
                    main3d.camera.lookAt(main3d.test.getPlayerCont().position)
                }
                main3d.allies.forEach((element, index) => {
                    if (element.join_distance > 10) {
                        element.translateOnAxis(element.directionVect, 2)
                        element.join_distance -= 2
                    }
                })
            }

            // wykonywanie funkcji bez końca, ok 60 fps jeśli pozwala na to wydajność maszyny

            requestAnimationFrame(render);

            // potwierdzenie w konsoli, że render się wykonuje

            //ciągłe renderowanie / wyświetlanie widoku sceny naszą kamerą

            main3d.renderer.render(main3d.scene, main3d.camera);
        }

        render();
    }

}