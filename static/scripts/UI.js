class UI {
    constructor() {
        this.wall = true
        this.enemy = false
        this.treasure = false
        this.light = false
        this.saveLevel()
        this.selectType()
    }

    saveLevel() {
        let button = document.getElementById("level_save")
        button.addEventListener("click", function () {
            let level = {
                selected_hexs: board.get_level(),
                level_size: document.getElementById("level").value
            }
            fetch("/save_level", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(level)
            })

        })
    }

    loadLevel(_3d) {
        let load_latest = confirm("Czy chcesz wczytać ostatni zapis")
        if (load_latest) {
            async function loadLatest() {
                let response = await fetch("/load_latest", {
                    method: "POST"
                })
                let data = await response.json()
                if (!_3d)
                    ui.createLoadedLevel(data)
                else {
                    fetch("/save_3d", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(data)
                    })
                    window.location.href = "/game.html"
                }
            }

            loadLatest()
        } else {
            async function loadCustomList() {
                let response = await fetch("/load_custom_list", {
                    method: "POST",
                })
                let data = await response.json()
                document.getElementById("level_select_div").style.display = "block"
                let select = document.getElementById("level_select")
                select.innerHTML = ""
                for (const element of data) {
                    let option = document.createElement("option")
                    option.value = element._id
                    option.label = element.date_formatted;
                    select.appendChild(option);
                }
                let cancel = document.createElement("button")
                cancel.id = "cancel"
                cancel.innerHTML = "ANULUJ"
                cancel.addEventListener("click", function () {
                    document.getElementById("level_select_div").style.display = "none"
                    document.getElementById("cancel").remove()
                })
                document.getElementById("level_select_div").appendChild(cancel)
                document.getElementById("level_submit").addEventListener("click", () => {
                    document.getElementById("level_select_div").style.display = "none"
                    let choosen_id = {id: select.value}

                    async function loadCustomLevel() {
                        let response = await fetch("/load_custom_level", {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify(choosen_id)
                        })
                        let data = await response.json()
                        if (!_3d)
                            ui.createLoadedLevel(data)
                        else {
                            window.location.href = "/game.html";
                        }
                    }

                    loadCustomLevel()
                })
            }

            loadCustomList()
        }
    }

    selectType() {
        let btn_wall = document.getElementById("btn_wall")
        let btn_enemy = document.getElementById("btn_enemy")
        let btn_treasure = document.getElementById("btn_treasure")
        let btn_light = document.getElementById("btn_light")
        let btn_3d = document.getElementById("btn_3d")
        btn_wall.addEventListener("click", () => {
            this.wall = false
            this.enemy = false
            this.treasure = false
            this.light = false
        })
        btn_enemy.addEventListener("click", () => {
            this.wall = false
            this.enemy = true
            this.treasure = false
            this.light = false
        })
        btn_treasure.addEventListener("click", () => {
            this.wall = false
            this.enemy = false
            this.treasure = true
            this.light = false
        })
        btn_light.addEventListener("click", () => {
            this.wall = false
            this.enemy = false
            this.treasure = false
            this.light = true
        })
        document.getElementById("level_load").addEventListener("click", () => {
            this.loadLevel(false)
        })
        btn_3d.addEventListener("click", () => {
            this.loadLevel(true)
        })
        document.getElementById("btn_movement").addEventListener("click", () => {
            document.location.href = "/player.html"
        })
        document.getElementById("btn_ally").addEventListener("click", () => {
            document.location.href = "/ally.html"
        })
        document.getElementById("btn_hex").addEventListener("click",()=>{
            document.location.href = "/hex.html"
        })
    }

    createLoadedLevel(data) {
        document.getElementById("right").innerHTML = ""
        document.getElementById("level").value = data[0].data.level_size
        board.generateLevel(data[0].data.level_size)
        board.level = data[0].data.selected_hexs
        let changes_div = document.getElementById("changes")
        changes_div.innerHTML = ""
        for (const element of board.level) {
            let current_div = document.getElementById(element.y + "_" + element.x)
            let arrow_div = document.createElement("div");
            arrow_div.innerHTML = element.dir_out
            arrow_div.classList.add("rotate_" + element.dir_out)
            arrow_div.style.left = current_div.style.left
            arrow_div.style.top = current_div.style.top
            arrow_div.classList.add("arrow_div");
            current_div.appendChild(arrow_div);
            let new_font = document.createElement("font")
            new_font.id = "change_" + element.y + "_" + element.x
            new_font.innerHTML = board.formatJSON(element)
            new_font.classList.add("changes_item")
            changes_div.appendChild(new_font)
        }
    }

}
