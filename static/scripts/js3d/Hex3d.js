class Hex3D {

    constructor(doors1, doors2) {
        this.doors1 = doors1
        this.doors2 = doors2
        return this.init()

    }

    init() {
        let radius = settings.radius
        let posx = 0
        let posz = 0
        let angle = 0
        let container = new THREE.Object3D() // kontener na obiekty 3D
        let geometry = new THREE.BoxGeometry(11 / 10 * radius, 8, 1);
        let materials = [];
        for (let i = 0; i < 6; i++) {
            materials.push(new THREE.MeshPhongMaterial({
                specular: 0xffffff,
                shininess: 50,
                side: THREE.DoubleSide,
                map: new THREE.TextureLoader().load(settings.material_wall)
            }));
        }
        materials.forEach(element => {
            element.map.magFilter = THREE.NearestFilter;
        });
        let wall = new THREE.Mesh(geometry, materials); // prostopadłościan - ściana hex-a
        for (let i = 0; i < 6; i++) {
            let side
            if (i == this.doors1 || i == this.doors2)
                side = new Door3d()
            else
                side = wall.clone()
            posx = radius * Math.cos(angle)
            posz = radius * Math.sin(angle)
            side.position.x = posx      // punkt na okręgu, do obliczenia
            side.position.z = posz   // punkt na okręgu, do obliczenia
            side.position.y = 0
            side.lookAt(container.position)    // nakierowanie ściany na środek kontenera 3D
            container.add(side)
            angle += Math.PI / 3
        }
        container.rotation.y = Math.PI / 2 

        return container
    }

}