class Player {

    constructor() {

        this.container = new THREE.Object3D()
        let geometry = new THREE.BoxGeometry(10, 10, 10);
        let material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        });
        this.player = new THREE.Mesh(geometry, material); // player sześcian
        this.player.position.y = 5
        this.container.add(this.player) // kontener w którym jest player

        this.axes = new THREE.AxesHelper(15) // osie konieczne do kontroli kierunku ruchu

        this.player.add(this.axes)
    }


    //funkcja zwracająca cały kontener

    getPlayerCont() {
        return this.container
    }

    //funkcja zwracająca playera czyli sam sześcian

    getPlayerMesh() {
        return this.player
    }

}