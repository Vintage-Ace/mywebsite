const BOARDS = [ //const makes board values  unchangable
    {
        cells: [
            ["O", "M", "E", "O", "W"], //this line is an array (with one row and five elements)
            ["Z", "B", "I", "L", "F"], // this is a 2d array
            ["O", "I", "E", "R", "E"],
            ["N", "R", "H", "S", "V"],
            ["N", "E", "T", "T", "E"]], //comma signals another array
        words: ["WOLF", "ZOMBIE", "NETHER", "STEVE", "IRON"]
    }, //also done here
    {
        cells: [
            ["N", "G", "E", "A", "S"],
            ["O", "V", "N", "K", "S"],
            ["M", "A", "T", "E", "T"],
            ["C", "E", "S", "N", "X"],
            ["P", "A", "Y", "G", "O"]],
        words: ["TASKS", "SPACE", "OXYGEN", "AMONG", "VENT"]
    },
    {
        cells: [
            ["O", "S", "E", "V", "L"],
            ["!", "I", "R", "W", "I"],
            ["C", "N", "D", "O", "S"],
            ["R", "S", "A", "I", "G"],
            ["U", "N", "H", "R", "N"]],
        words: ["SONIC!", "SHADOW", "SILVER", "RING", "RUN"]
    },
]


function make_cell_list() {
    let cells = Array.from(document.getElementById("cell-holder").children)
    let cell_board = []; // makes cells into an array that we can assign value to
    for (let index = 0; index < 5; index++) {
        cell_board.push(cells.slice(index * 5, index * 5 + 5))
    }
    return cell_board;
}

const CELLS = make_cell_list();
console.log(CELLS)

function setup_game(board) {
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            CELLS[y][x].innerHTML = board[y][x]
        }
    }
}

let board_number = 0 // this is is to select board number

setup_game(BOARDS[board_number].cells);
document.getElementById("words").innerHTML = "Words to spell: " + BOARDS[board_number].words.join(", ");

let selected_x = -1;
let selected_y = -1;

function select(x, y) {
let cell = CELLS[y][x]
if (cell.innerHTML.length > 0){
    if(selected_x >= 0 && selected_y >=0) {
        CELLS[selected_y][selected_x].classList.remove("selected")
    }
    selected_x = x;
    selected_y = y;
    cell.classList.add("selected")
    cellDetail.classList.add("selected")
}
}
function unselect(x, y) {
CELLS[y][x].classList.remove("selected");
selected_x = -1;
selected_y = -1;
}
function move(x, y) {
    CELLS[y][x].innerHTML = CELLS[selected_y][selected_x].innerHTML+ CELLS[y][x].innerHTML
    CELLS[selected_y][selected_x].innerHTML = " ";
    select(x, y)
}
function can_move(x, y) {
let is_next_to = Math.abs(selected_x - x) + Math.abs(selected_y - y) == 1;
return CELLS[y][x].innerHTML.length > 0 && is_next_to && selected_x >= 0 && selected_y >=0
}

function on_click(x,y) {
if(selected_x == x && selected_y == y) {
    unselect(x, y)
} else if (can_move(x, y)) {
    move(x, y)
} else {
select(x,y)
}
}

let angle = 0

function onframe() {
    console.log("hello world")
    angle += 1
    document.body.style="background-color: hsl(" + angle + "deg,100%, 50%);--rotation: "+ angle +"deg"
    requestAnimationFrame(onframe)
}

onframe()