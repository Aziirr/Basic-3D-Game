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
        document.getElementById("root").appendChild(this.renderer.domElement);
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set( 20, 20, 20 );
        this.controls.addEventListener("change", () => {
            this.renderer.render(this.scene, this.camera)
        })
        let sample_hex = new Hex3D(1, 4) // tutaj podajemy gdzie mają być przejścia, ściany są w zakresie 0-5
        this.scene.add(sample_hex)
        this.camera.lookAt(sample_hex)
        this.renderer.render(this.scene, this.camera)
        let main3d = this
        this.controls.update();
        main3d.renderer.render(main3d.scene, main3d.camera)
        function render() {

            // w tym miejscu ustalamy wszelkie zmiany w projekcie (obrót, skalę, położenie obiektów)
            // np zmieniająca się wartość rotacji obiektu

            // wykonywanie funkcji bez końca, ok 60 fps jeśli pozwala na to wydajność maszyny

            requestAnimationFrame(render);

            // potwierdzenie w konsoli, że render się wykonuje

            //ciągłe renderowanie / wyświetlanie widoku sceny naszą kamerą
            main3d.renderer.render(main3d.scene, main3d.camera)
        }

        render();
    }
}