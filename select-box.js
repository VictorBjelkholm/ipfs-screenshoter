// Prototype for selecting a area of the page to capture instead of full
console.clear()

let dragging = false

let startX = 0
let startY = 0

let box = document.createElement('div')
box.style.backgroundColor = 'black'
box.style.position = 'absolute'
box.style.pointerEvents = 'none'
box.style.opacity = 0.5
box.style.zIndex = 10000000
console.log(box.style)
document.body.appendChild(box)

document.addEventListener('mousedown', (ev) => {
  dragging = true
  console.log('mouse down')
  startX = ev.clientX
  startY = ev.clientY
  box.style.top = ev.clientY + 'px'
  box.style.left = ev.clientX + 'px'
  box.style.width = '0px'
  box.style.height = '0px'
})

// Only supports going from the top-left to the bottom-right
document.addEventListener('mousemove', (ev) => {
  if (dragging) {
    console.log('mouse move')
    console.log(ev.clientX - startX)
    box.style.width = (ev.clientX - startX) + "px"
    box.style.height = (ev.clientY - startY) + "px"
  }
})

document.addEventListener('mouseup', () => {
  console.log('mouse up')
  dragging = false
})
