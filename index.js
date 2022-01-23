'use strict'

let grid = document.getElementById('grid')
let keyboard = document.getElementById('keyboard')
let keyboardButtons = new Map()

let randomIndex = Math.floor(Math.random()*wordList.length)
let secret = wordList[randomIndex]
console.log(secret)

let GREEN = '#538d4e';
let YELLOW = '#b59f3a';
let DARKGREY = '#3a3a3c';
let LIGHTGREY = '#565758';

let attempts = []
let currentAttempt = ''
let gameStatus = ''

buildGrid()
updateGrid()
buildKeyboard()
window.addEventListener('keydown', handleKeyDown)

function handleKeyDown(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) {
    return
  }
  handleKey(e.key)
}

function handleKey(key) {
	if (gameStatus) return
	let letter = key.toLowerCase()
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
		updateKeyboard()
	} else if (letter === 'backspace') {
		currentAttempt = currentAttempt.slice(0, currentAttempt.length - 1)
	} else if (/^[a-z]$/.test(letter)) {
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
	if (gameStatus === 'lost') {
		gameStatusDiv.insertAdjacentText('afterend','Answer: ' + secret)
	}
}

function buildKeyboard() {
	let keyboardRows = [
		'qwertyuiop'.split(''),
		'asdfghjkl'.split(''),
		['enter'].concat('zxcvbnm'.split('')).concat(['backspace'])
	]
	for (let keyboardRow of keyboardRows) {
		let row = document.createElement('div')
		for (let key of keyboardRow) {
			let button = document.createElement('button')
			button.className = 'button'
			button.textContent = key.toUpperCase()
			button.style.backgroundColor = LIGHTGREY
			button.onclick = (e) => handleKey(key)
			if (key.length === 1) keyboardButtons.set(key, [button, LIGHTGREY])
			row.appendChild(button)
		}
		keyboard.appendChild(row)
	}
}

function updateKeyColor(letter, color) {
	let [keyButton, keyColor] = keyboardButtons.get(letter)
	if (keyColor === GREEN || color === GREEN) {
		keyButton.style.backgroundColor = GREEN
	} else if (keyColor === YELLOW || color === YELLOW) {
		keyButton.style.backgroundColor = YELLOW
	}
	else keyButton.style.backgroundColor = DARKGREY
}

function updateKeyboard() {
	for (let attempt of attempts) {
		for (let i=0; i<5; i++) {
			updateKeyColor(attempt[i], getBgColor(attempt[i], i))
		}
	}
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
			cell.textContent = ''
			cell.style.border = '2px solid ' + DARKGREY
		}
	}
	for (let i=0; i<5; i++) {
		let cell = row.children[i]
		cell.textContent = attempt[i]
		if (!isCurrent) {
			cell.style.backgroundColor = getBgColor(attempt[i], i)
			cell.style.border = '2px solid ' + getBgColor(attempt[i], i)

		}
		else if (attempt[i]) {
			cell.style.border = '2px solid ' + LIGHTGREY
		}
	}
}

function getBgColor(letter, index) {
	if (secret.indexOf(letter) === -1) return DARKGREY;
	else if (secret[index] === letter) return GREEN;
	else return YELLOW;
}

