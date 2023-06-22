// import './style.css'
import gsap from 'gsap'
import '../sass/main.scss'
import getRandomInt from './utils/getRandomNumber'
import getPlayers from './api'
import party from 'party-js'

async function fetchPlayer(card) {
  const result = await getPlayers()

  card.player1 = result.player1
  card.player2 = result.player2
  // console.log(card)
  populatePlayerData(card, result)
}

function populatePlayerData(card, result) {
  const player1Image = card.element.querySelector('.player_img_1')
  const player2Image = card.element.querySelector('.player_img_2')

  const player1Name = card.element.querySelector('.name_1')
  const player2Name = card.element.querySelector('.name_2')

  const player1Match = card.element.querySelector('.match_value_1')
  const player2Match = card.element.querySelector('.match_value_2')

  const player1Run = card.element.querySelector('.run_value_1')
  const player2Run = card.element.querySelector('.run_value_2')

  const player1SR = card.element.querySelector('.sr_value_1')
  const player2SR = card.element.querySelector('.sr_value_2')

  const player1Average = card.element.querySelector('.avg_value_1')
  const player2Average = card.element.querySelector('.avg_value_2')

  const player1Ball = card.element.querySelector('.ball_value_1')
  const player2Ball = card.element.querySelector('.ball_value_2')

  const player1Wicket = card.element.querySelector('.wicket_value_1')
  const player2Wicket = card.element.querySelector('.wicket_value_2')

  const player1Economy = card.element.querySelector('.economy_value_1')
  const player2Economy = card.element.querySelector('.economy_value_2')

  const player1BowlingAvg = card.element.querySelector('.bowlingAvg_value_1')
  const player2BowlingAvg = card.element.querySelector('.bowlingAvg_value_2')

  player1Image.src = result.player1.img
  player2Image.src = result.player2.img

  player1Name.textContent = `${result.player1.name} ${result.player1.country}`
  player2Name.textContent = `${result.player2.name} ${result.player2.country}`

  player1Match.textContent = result.player1.batting.Matches
  player2Match.textContent = result.player2.batting.Matches

  player1Run.textContent = result.player1.batting.Runs
  player2Run.textContent = result.player2.batting.Runs

  player1SR.textContent = result.player1.batting.StrikeRate
  player2SR.textContent = result.player2.batting.StrikeRate

  player1Average.textContent = result.player1.batting.Average
  player2Average.textContent = result.player2.batting.Average

  player1Ball.textContent = result.player1.bowling.Balls
  player2Ball.textContent = result.player2.bowling.Balls

  player1Wicket.textContent = result.player1.bowling.Wickets
  player2Wicket.textContent = result.player2.bowling.Wickets

  player1Economy.textContent = result.player1.bowling.Economy
  player2Economy.textContent = result.player2.bowling.Economy

  player1BowlingAvg.textContent = result.player1.bowling.BowlingAverage
  player2BowlingAvg.textContent = result.player2.bowling.BowlingAverage
}

////////      SlideShow    ////////////

// @ts-ignore
const cardsElement = [...document.querySelectorAll('.card')]
const playerTemplate = document.querySelector('#player-card')
const score = document.querySelector('.total')
const circle = document.querySelector('.circle2')
const resultText = document.querySelector('.result__text')

let points = 0

let zCounter = 1000
const cards = []

// set the cards
cardsElement.forEach((card, index) => {
  console.log('Card Number', index + 1)
  card.style.zIndex = String(zCounter)

  const cardId = crypto.randomUUID()
  cards.push({
    index,
    id: cardId,
    element: card,
    isFlippable: index === 0,
    // change later /////////////////////////////
    // isFlippable: true,
    isClicked: false,
  })
  card.dataset.id = cardId
  zCounter--
})

// populate html
cards.forEach((card, index) => {
  if (index === 0 || index === 6) return

  const playerClone = playerTemplate.content.cloneNode(true)
  const mysteryPlayerBtn = playerClone.querySelectorAll('.player_2_data')
  mysteryPlayerBtn.forEach(button => button.classList.add('hidden'))

  card.element.appendChild(playerClone)
})

for (let i = 1; i < 6; i++) {
  fetchPlayer(cards[i])
}

// console.log(cards)
function calculatePoint(selectedStat, player1Stat, player2Stat) {
  if (player1Stat === '-' && player2Stat === '-') return true
  if (player1Stat === '-') return false
  if (player2Stat === '-') return true

  if (selectedStat === 'Economy' || selectedStat === 'BowlingAverage') {
    return parseFloat(player1Stat) <= parseFloat(player2Stat)
  } else return parseFloat(player1Stat) >= parseFloat(player2Stat)
}

// Handle Click
let zCounterClick = 100
cardsElement.forEach(card => {
  card.addEventListener('click', e => {
    const currentCardId = getCurrentCard()
    if (currentCardId !== card.dataset.id) return
    const jsCard = cards.find(item => item.id === currentCardId)
    console.log(jsCard)
    // if (jsCard.player1 == null) return
    if (jsCard.index !== 0 && jsCard.index !== 5 && jsCard.player1 == null)
      return

    if (e.target.matches('[data-user-player]') && !jsCard.isClicked) {
      const selectedStat = e.target.dataset.stat
      const selectedRole = e.target.dataset.role

      jsCard.isClicked = true

      const player1Stat = jsCard.player1[selectedRole][selectedStat]
      const player2Stat = jsCard.player2[selectedRole][selectedStat]

      console.log(player1Stat)
      console.log(player2Stat)
      if (calculatePoint(selectedStat, player1Stat, player2Stat)) {
        points++
        e.target.classList.add('correct-btn')

        party.confetti(e.target, {
          count: party.variation.range(40, 60),
        })
      } else {
        e.target.classList.add('wrong-btn')
        e.target.classList.add('shake')

        setTimeout(() => {
          e.target.classList.remove('shake')
        }, 500)
      }

      score.textContent = points
      const value = 630 - (630 * (points * 20)) / 100
      circle.dataset.score = value
      circle.style.setProperty('--score', value)
      // circle.style.setProperty('stroke-dashoffset', `${value}!important`)
      // circle.style.strokeDashoffset = `${value}!important`
      const player2Data = card.querySelectorAll('.player_2_data')
      player2Data.forEach(data => data.classList.remove('hidden'))

      jsCard.isFlippable = true
    }

    if (!jsCard.isFlippable || e.target.matches('[data-user-player]')) return
    // console.log(card.dataset.id)

    // const flipTimeline = gsap.timeline()
    // flipTimeline
    //   .set(card, {
    //     x: 0,
    //   })
    //   .to(card, {
    //     x: () => {
    //       if (Math.random() > 0.5) return '150%'
    //       return '-150%'
    //     },
    //   })
    //   .set(card, {
    //     zIndex: zCounterClick--,
    //   })
    //   .to(card, {
    //     x: 0,
    //   })

    const mediaQueryString = '(max-width: 600px)'
    const mediaQueryList = window.matchMedia(mediaQueryString)

    function updateFlipTiming(e) {
      if (e.matches) {
        const flipTimeline = gsap.timeline()
        flipTimeline
          .set(card, {
            x: 0,
          })
          .to(card, {
            x: () => {
              if (Math.random() > 0.5) return '150%'
              return '-150%'
            },
          })
          .set(card, {
            zIndex: zCounterClick--,
          })
          .to(card, {
            x: 0,
          })
          .duration(0.4)
      } else {
        const flipTimeline = gsap.timeline()
        flipTimeline
          .set(card, {
            x: 0,
          })
          .to(card, {
            x: () => {
              if (Math.random() > 0.5) return '150%'
              return '-150%'
            },
          })
          .set(card, {
            zIndex: zCounterClick--,
          })
          .to(card, {
            x: 0,
          })
      }
    }

    // Initial check
    updateFlipTiming(mediaQueryList)

    // Register event listener
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', updateFlipTiming)
    } else {
      mediaQueryList.addEventListener(updateFlipTiming)
    }

    if (jsCard.index === 5) {
      circle?.classList.add('rotation')
    }

    if (points === 0) {
      resultText.innerText = 'NEXT TIME 😢'
    } else if (points === 1) resultText.innerText = 'YOU CAN DO BETTER 😐'
    else if (points === 2) resultText.innerText = 'NICE JOB 😃'
    else if (points === 3) resultText.innerText = 'GREAT WORK 👏'
    else if (points === 4) resultText.innerText = 'ALMOST PERFECT 👐'
    else if (points === 5) resultText.innerText = 'PERFECTION 🐐'
  })
})

const loadTimeline = gsap.timeline()

loadTimeline.set(cardsElement, {
  rotation: () => getRandomInt(-5, 5),
})

function getCurrentCard() {
  let maxIndex = -100
  let maxCardId = ''
  cardsElement.forEach(card => {
    if (maxIndex <= Number(card.style.zIndex)) {
      maxIndex = Number(card.style.zIndex)
      maxCardId = card.dataset.id
    }
  })

  return maxCardId
}

const replayBtn = document.querySelector('.replay-btn')

replayBtn?.addEventListener('click', () => {
  window.location.reload()
})
