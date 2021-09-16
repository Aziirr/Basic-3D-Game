class Door3d {
    constructor() {
        return this.init()

    }

    init() {
        let radius = settings.radius
        let container = new THREE.Object3D() // kontener na obiekty 3D
        let wall_length = radius
        let posx = 1 / 2 * Math.sin(30.3) * -wall_length
        let geometry = new THREE.BoxGeometry(wall_length / 8, 8, 1);
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

        for (let i = 0; i < 2; i++) {
            let side = wall.clone()
            side.position.x = posx
            posx += wall_length / 8
            container.add(side)
        }

        return container
    }

}