const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const ratingElement = document.getElementById('rating')  
const advertisementElement = document.getElementById('advertisement')  
const submitBtn = document.getElementById('submitBtn')  

let startTime, timerInterval
let timerStarted = false

quoteInputElement.addEventListener('input', () => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span')
  const arrayValue = quoteInputElement.value.split('')

  if (!timerStarted) {
    startTimer()
    timerStarted = true
  }

  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index]
    if (character == null) {
      characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct')
      characterSpan.classList.remove('incorrect')
    } else {
      characterSpan.classList.remove('correct')
      characterSpan.classList.add('incorrect')
    }
  })
})

function submitText() {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span')
  const arrayValue = quoteInputElement.value.split('')

  let correct = true
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index]
    if (character !== characterSpan.innerText) {
      correct = false
    }
  })

  if (correct) {
    advertisementElement.style.display = 'none'
    clearInterval(timerInterval)  
    const timeTaken = getTimerTime()
    const wordsTyped = arrayQuote.length / 5  
    const wpm = (wordsTyped / (timeTaken / 60)).toFixed(2)
    displayRating(wpm)
    renderNewQuote()
  } else {
    advertisementElement.style.display = 'block'
  }
}

submitBtn.addEventListener('click', submitText)

quoteInputElement.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    submitText()
  }
})

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then(response => response.json())
    .then(data => data.content)
}

async function renderNewQuote() {
  const quote = await getRandomQuote()
  quoteDisplayElement.innerHTML = ''
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    quoteDisplayElement.appendChild(characterSpan)
  })
  quoteInputElement.value = null
  timerStarted = false 
  timerElement.innerText = 0  
}

function startTimer() {
  startTime = new Date()
  timerInterval = setInterval(() => {
    timerElement.innerText = getTimerTime()
  }, 1000)
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000)
}

function displayRating(wpm) {
  let rating
  if (wpm > 80) {
    rating = 'Excellent'
  } else if (wpm > 60) {
    rating = 'Good'
  } else if (wpm > 40) {
    rating = 'Average'
  } else {
    rating = 'Below Average'
  }
  ratingElement.innerText = `WPM: ${wpm}, Rating: ${rating}`
}


renderNewQuote()
