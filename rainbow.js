let angle = 0

function onframe() {
    console.log("hello world")
    angle += 1
    document.body.style="background-color: hsl(" + angle + "deg,100%, 50%);--rotation: "+ angle +"deg"
    requestAnimationFrame(onframe)
}

onframe()