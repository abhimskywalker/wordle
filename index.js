'use strict'

let grid = document.getElementById('grid')

let randomIndex = Math.floor(Math.random()*wordList.length)
let secret = wordList[randomIndex]
// let secret = 'horse'
console.log(secret)

let attempts = []
let currentAttempt = ''
let gameStatus = ''

buildGrid()
updateGrid()
window.addEventListener('keydown', handleKeyDown)

function handleKeyDown(e) {
	if (gameStatus) return
	let letter = e.key.toLowerCase()
	console.log(letter)
	if (letter === 'enter') {
		if (currentAttempt.length < 5) {
			return
		}
		if (attempts.includes(currentAttempt)) {
			alert('Already tried')
			return
		}
		if (!wordList.includes(currentAttempt)) {
			alert('Invalid word')
			return
		}
		attempts.push(currentAttempt)
		if (currentAttempt === secret) {
			updateGameStatus('won')
		}
		else if (attempts.length === 6) {
			updateGameStatus('lost')
		}
		currentAttempt = ''
	} else if (letter === 'backspace') {
		currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1)
	} else if (/[a-z]/.test(letter) && letter.length === 1) {
		if (currentAttempt.length < 5) {
			currentAttempt += letter
		}
	}
	updateGrid()
}

function updateGameStatus(status) {
	gameStatus = status
	let gameStatusDiv = document.getElementById('gameStatus')
	gameStatusDiv.textContent = 'You ' + gameStatus
}

function buildGrid() {
	for (let i=0; i<6; i++){
		let row = document.createElement('div')
		row.className = 'row'
		for (let j=0; j<5; j++){
			let cell = document.createElement('div')
			cell.className = 'cell'
			cell.textContent = ''
			row.appendChild(cell)
		}
		grid.appendChild(row)
	}
}

function updateGrid() {
	let row = grid.firstChild
	for (let attempt of attempts) {
		drawAttempt(row, attempt, false)
		row = row.nextSibling
	}
	if (!gameStatus) drawAttempt(row, currentAttempt, true)	
}

function drawAttempt(row, attempt, isCurrent) {
	if (isCurrent) {
		for (let cell of row.children) {
			cell.textContent = 'X'
			// cell.innerHTML = '<div style="opacity: 0">X</div>'
			cell.style.border = '2px solid #3a3a3c'
			// cell.style.opacity = '0'
		}
	}
	// let cell = row.firstChild
	for (let i=0; i<5; i++) {
		let cell = row.children[i]
		cell.textContent = attempt[i]
		if (!isCurrent) cell.style.backgroundColor = getBgColor(attempt[i], i)
		else if (attempt[i]) cell.style.border = '2px solid #565758'
		// cell = cell.nextSibling
	}
}

function getBgColor(letter, index) {
	if (secret.indexOf(letter) === -1) return '#3a3a3c';
	else if (secret[index] === letter) return '#538d4e';
	else return '#b59f3a';
}

