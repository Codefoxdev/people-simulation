let mouse = [];

function getMouseLocation() {
  console.log(mouse);
  navigator.clipboard.writeText(`[${mouse[0]},${mouse[1]}], \n`);
}

document.addEventListener("mousemove", (ev) => {
  mouse[0] = ev.pageX;
  mouse[1] = ev.pageY;
})

document.addEventListener("click", (ev) => {
  getMouseLocation();
})