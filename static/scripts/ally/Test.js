class Test extends THREE.Object3D {

    constructor() {
        super()
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 10),
            new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
        );
        this.mesh.position.y = 5
        let axes = new THREE.AxesHelper(10)
        this.mesh.add(axes)
        this.add(this.mesh)
    }

    getPlayerCont() {
        return this
    }

    getPlayerMesh() {
        return this.mesh
    }

}