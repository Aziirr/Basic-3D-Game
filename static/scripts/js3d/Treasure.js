class Treasure {
    constructor() {
        return this.init()
    }

    init() {
        let wall_length = 3
        let geometry = new THREE.BoxGeometry(wall_length / 2, wall_length, wall_length / 2);
        let materials = [];
        for (let i = 0; i < 6; i++) {
            materials.push(new THREE.MeshPhongMaterial({
                specular: 0xffffff,
                shininess: 50,
                side: THREE.DoubleSide,
                map: new THREE.TextureLoader().load(settings.material_doors)
            }));
        }
        materials.forEach(element => {
            element.map.magFilter = THREE.NearestFilter;
        });
        // prostopadłościan - ściana hex-a
        return new THREE.Mesh(geometry, materials)
    }

}