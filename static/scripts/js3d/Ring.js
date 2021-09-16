class Ring extends THREE.Mesh {
    constructor() {
        super() // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
        this.geometry = new THREE.RingGeometry(1, 1.2, 6)
        this.material = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide})
        this.position.y = 0.01
        this.position.z -= 0.5
        this.rotation.x = Math.PI / 2
    }
}
