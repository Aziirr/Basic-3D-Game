class Ally extends THREE.Object3D {

    constructor() {
        super()
        this.mixer = null
        this.animations = []
        this.clock = new THREE.Clock();
        this.delta = null
        this.ally = true
        this.clicked = false
        this.meshModel = null
        this.is_running = false
    }

    loadModel(callback) {

        let modelMaterial = new THREE.MeshBasicMaterial(
            {
                map: new THREE.TextureLoader().load("images/model/r2d2.png"), // dowolny plik png, jpg
                morphTargets: true // ta własność odpowiada za możliwość animowania materiału modelu
            });
        let loader = new THREE.JSONLoader();
        loader.load("/images/model/r2d2.js", geometry => {

            this.meshModel = new THREE.Mesh(geometry, modelMaterial)
            this.meshModel.name = "Ally";
            this.meshModel.rotation.y = Math.PI / 2; // ustaw obrót modelu
            this.meshModel.position.y = 1; // ustaw pozycje modelu
            this.meshModel.scale.set(0.025, 0.025, 0.025); // ustaw skalę modelu
            this.add(this.meshModel)
            for (let i = 0; i < geometry.animations.length; i++) {
                this.animations.push(geometry.animations[i].name);
            }
            this.mixer = new THREE.AnimationMixer(this.meshModel)
            // zwrócenie kontenera

            callback(this);

        });
    }


    updateModel() {
        this.delta = this.clock.getDelta()
        if (this.mixer) {
            this.mixer.update(this.delta)
        }
    }

    setAnimation(animationName) {
        if (this.mixer) {
            if (animationName === "stand")
                this.mixer.clipAction("run").stop();
            else
                this.mixer.clipAction("stand").stop()
            this.mixer.clipAction(animationName).play();
        }
    }


}