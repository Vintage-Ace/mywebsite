const widget_container = document.getElementById("widget-container");
const stores = document.getElementsByClassName("store"); // gets every element that has the class store
const score_element = document.getElementById("score");
let score = 5;
let super_gompei_count = 0;

function changeScore(amount) { // parameter
    score += amount;
    score_element.innerHTML = "Score: " + score; //tells user score

    // Update the stores to block buying expensive boxes
    for (let store of stores) {
        let cost = parseInt(store.getAttribute("cost")); //turns the cost attribut into an integer

        if (score < cost) {
            store.setAttribute("broke", ""); // dont got nuff money
        } else {
            store.removeAttribute("broke");
        }
    }
}
function buy(store) { // get item
    const cost = parseInt(store.getAttribute("cost")); 

    if (score < cost) {
        return; // do nothing with function
    }

    changeScore(-cost); //-cost is the amount the score is changed by

    // If Super-Gompei already exists
    const superGompei = document.querySelector("#widget-container #super-gompei")?.parentElement; // hastag specifies it's an id
    if (store.getAttribute("name") === "Super-Gompei" && superGompei) {
        superGompei.setAttribute("reap", (parseInt(superGompei.getAttribute("reap")) + 100));
        super_gompei_count += 1;
        document.body.style = "--gompei-count: " + super_gompei_count + ";"
        return;
    }
    

    const widget = store.firstElementChild.cloneNode(true);
    widget.onclick = () => { // clicking widget from HTML, calling function
        harvest(widget);
    }
    console.log(store)
    widget_container.appendChild(widget);

    if (widget.getAttribute("auto") == 'true') {
        widget.setAttribute("harvesting", "");
        setup_end_harvest(widget);
    }
}

function setup_end_harvest(widget) {
    setTimeout(() => {
        // Remove the harvesting flag
        widget.removeAttribute("harvesting");
        // If automatic, start again
        if (widget.getAttribute("auto") == 'true') { //start harvesting if their is an auto in the HTML
            harvest(widget);
        }
    }, parseFloat(widget.getAttribute("cooldown")) * 1000); //parseFloat: timeout we need, Timeout wan'ts miliseconds and parse is seconds (hence the multiplication)
} // cooldown is in html

function harvest(widget) {
    // Only run if currently not harvesting
    if (widget.hasAttribute("harvesting")) return;
    // Set harvesting flag
    widget.setAttribute("harvesting", "");

    // If manual, collect points now
    changeScore(parseInt(widget.getAttribute("reap"))); //reap is how much you get from the widget
    showPoint(widget);

    setup_end_harvest(widget);
}


function showPoint(widget) {
    let number = document.createElement("span");
    number.className = "point";
    number.innerHTML = "+" + widget.getAttribute("reap");
    number.onanimationend = () => {
        widget.removeChild(number);
    }
    widget.appendChild(number);
}

changeScore(0);