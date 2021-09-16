class Model {

    constructor() {
        this.container = new THREE.Object3D()
        this.mixer = null
        this.animations = []
        this.clock = new THREE.Clock();
        this.delta = null
        this.loadModel = function (callback) {

            let modelMaterial = new THREE.MeshBasicMaterial(
                {
                    map: new THREE.TextureLoader().load("images/model/boba.png"), // dowolny plik png, jpg
                    morphTargets: true // ta własność odpowiada za możliwość animowania materiału modelu
                });
            let loader = new THREE.JSONLoader();
            loader.load("/images/model/boba.js", geometry => {

                this.meshModel = new THREE.Mesh(geometry, modelMaterial)
                this.meshModel.name = "Player";
                this.meshModel.rotation.y = Math.PI / 2; // ustaw obrót modelu
                this.meshModel.position.y = 1.2; // ustaw pozycje modelu
                this.meshModel.scale.set(0.05, 0.05, 0.05); // ustaw skalę modelu

                this.container.add(this.meshModel)
                for (let i = 0; i < geometry.animations.length; i++) {
                    this.animations.push(geometry.animations[i].name);
                }
                this.mixer = new THREE.AnimationMixer(this.meshModel)
                // zwrócenie kontenera

                callback(this.container);

            });
        }
    }


    updateModel() {
        if (this.mixer) {
            this.mixer.update(this.delta)
        }
    }

//animowanie postaci

    setAnimationRun() {
        this.mixer.clipAction("stand").stop();
        this.mixer.clipAction("run").play();
    }
    setAnimationStand() {
        this.mixer.clipAction("run").stop();
        this.mixer.clipAction("stand").play();
    }

    getPlayerCont() {
        return this.container
    }

    getPlayerMesh() {
        return this.meshModel
    }

}