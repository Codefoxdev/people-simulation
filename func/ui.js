let mouse = [];

function getMouseLocation() {
  console.log(mouse);
}

document.addEventListener("mousemove", (ev) => {
  mouse[0] = ev.pageX;
  mouse[1] = ev.pageY;
})