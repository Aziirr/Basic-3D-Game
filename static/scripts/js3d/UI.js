class UI {
    constructor() {
        this.changeLightIntensity()
        this.changeLightHeight()
    }

    changeLightIntensity() {
        document.getElementById("light_intensity").addEventListener("input", function () {
            for (const element of main3d.lights) {
                element.intensity = this.value
            }
            main3d.renderer.render(main3d.scene, main3d.camera)
        })
    }

    changeLightHeight() {
        document.getElementById("light_height").addEventListener("input", function () {
            for (const element of main3d.lights) {
                element.position.y = this.value
            }
            main3d.renderer.render(main3d.scene, main3d.camera)
        })
    }
}