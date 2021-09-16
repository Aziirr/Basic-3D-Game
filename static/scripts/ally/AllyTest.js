class AllyTest extends THREE.Object3D {

    constructor() {
        super()
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 10),
            new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true})
        );
        this.ally = true
        this.clicked = false
        this.mesh.rotation.y = 1
        let axes = new THREE.AxesHelper(10)
        this.mesh.add(axes)
        this.add(this.mesh)
        this.mesh.position.y = 5
        this.position.x = 100

    }

}
