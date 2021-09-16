class GenerateBoard {
    constructor() {
        this.generateSelect();
        this.generateLevel(3);
        this.level = [];
    }

    generateSelect() {
        let select = document.getElementById("level")
        for (let i = 3; i < 99; i++) {
            let option = document.createElement("option")
            option.value = i.toString();
            option.label = i.toString();
            select.appendChild(option);
        }
        select.addEventListener("change", e => {
            this.generateLevel(select.value);
            this.level = [];
            document.getElementById("changes").innerHTML = ""
        })
    }

    generateLevel(level_number) {
        let main_div = document.getElementById("right");
        main_div.innerHTML = "";
        let top = 10;
        let left = 10;
        for (let i = 0; i < level_number; i++) {
            for (let j = 0; j < level_number; j++) {
                let hexa = document.createElement("div");
                hexa.classList.add("hexagon")
                hexa.style.top = j % 2 !== 0 ? top + 50 + "px" : top + "px";
                hexa.style.left = left + "px";
                hexa.id = i + "_" + j
                let this_class = this;
                hexa.addEventListener("click", function () {
                        this_class.hexClick(this)
                    }
                );
                left += 80;
                main_div.appendChild(hexa)
            }
            top += 100;
            left = 10;
        }
    }

    hexClick(clicked_div) {
        if (clicked_div.children.length === 0) {
            let arrow_div = document.createElement("div");
            arrow_div.innerHTML = "0"
            arrow_div.classList.add("rotate_0")
            arrow_div.style.left = clicked_div.style.left
            arrow_div.style.top = clicked_div.style.top
            arrow_div.classList.add("arrow_div");
            clicked_div.appendChild(arrow_div);
        } else {
            let dir = clicked_div.children[0]
            dir.classList.remove("rotate_" + dir.innerHTML)
            dir.innerHTML = parseInt(dir.innerHTML) === 5
                ?
                "0"
                :
                (parseInt(dir.innerHTML) + 1).toString();
            dir.classList.add("rotate_" + dir.innerHTML)
        }
        let temp_obj = {
            x: clicked_div.id.split("_")[1],
            y: clicked_div.id.split("_")[0],
            dir_out: clicked_div.children[0].innerHTML,
        }
        if (temp_obj.dir_out === "0")
            temp_obj.dir_in = "3"
        else if (temp_obj.dir_out === "1")
            temp_obj.dir_in = "4"
        else if (temp_obj.dir_out === "2")
            temp_obj.dir_in = "5"
        else if (temp_obj.dir_out === "3")
            temp_obj.dir_in = "0"
        else if (temp_obj.dir_out === "4")
            temp_obj.dir_in = "1"
        else
            temp_obj.dir_in = "2"
        if (ui.wall)
            temp_obj.type = "wall"
        else if (ui.enemy)
            temp_obj.type = "enemy"
        else if (ui.treasure)
            temp_obj.type = "treasure"
        else
            temp_obj.type = "light"
        let exists = this.level.findIndex(element => {
            return element.x === temp_obj.x && element.y === temp_obj.y
        })
        let changes_div = document.getElementById("changes")
        if (exists === -1) {
            this.level.push(temp_obj)
            let new_font = document.createElement("font")
            new_font.id = "change_" + temp_obj.y + "_" + temp_obj.x
            new_font.innerHTML = this.formatJSON(temp_obj)
            new_font.classList.add("changes_item")
            changes_div.appendChild(new_font)
        } else {
            this.level[exists] = temp_obj
            let font = document.getElementById("change_" + temp_obj.y + "_" + temp_obj.x)
            font.innerHTML = this.formatJSON(temp_obj)
            changes_div.appendChild(font)
        }


    }

    get_level() {
        return this.level
    }

    formatJSON(change_obj) {
        let final_data = ""
        for (const key in change_obj) {
            final_data += JSON.stringify(key) + " : " + JSON.stringify(change_obj[key]) + " ," + "<br>"
        }
        final_data += "<br>"
        return final_data
    }
}