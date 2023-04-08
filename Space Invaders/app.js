function play(){
  const grid = document.querySelector('.grid')

  const resultsDisplay = document.querySelector('.results')
  let results = 0
  resultsDisplay.innerText = `Score: ${results}`

  let currentShooterIndex = 202
  let width = 15
  let direction = 1
  let invadersId
  let goingRight = true
  let aliensRemoved = []

  // create grid squares for character movement and add to grid
  for (let i = 0; i < 225; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
  }

  // select just added squares
  const squares = Array.from(document.querySelectorAll('.grid div'))

  // ======================================================== Add Aliens

  // create 3 rows of 10 aliens
  const alienInvaders = [
      0,1,2,3,4,5,6,7,8,9,
      15,16,17,18,19,20,21,22,23,24,
      30,31,32,33,34,35,36,37,38,39
    ]
    
    // function to add aliens to board
    function draw() {
      for (let i = 0; i < alienInvaders.length; i++) {
        if(!aliensRemoved.includes(i)) {
          squares[alienInvaders[i]].classList.add('invader')
        }
      }
    }
    
    // add invaders to screen
    draw()


  // ======================================================== Add Player

  // add player to screen
  squares[currentShooterIndex].classList.add('shooter')

  // move player
  function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter')
    if(squares[currentShooterIndex].classList.contains('invader', 'shooter')) return;
    switch(e.key) {
      case 'ArrowLeft':
        if (currentShooterIndex % width !== 0) currentShooterIndex -=1
        break
      case 'ArrowRight' :
        if (currentShooterIndex % width < width -1) currentShooterIndex +=1
        break
    }
    squares[currentShooterIndex].classList.add('shooter')
  }

  // player shoot
  function shoot(e) {
      let laserId
      let currentLaserIndex = currentShooterIndex
      // fire laser
      function moveLaser() {
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')
    
        if (squares[currentLaserIndex].classList.contains('invader')) {
          squares[currentLaserIndex].classList.remove('laser')
          squares[currentLaserIndex].classList.remove('invader')
          squares[currentLaserIndex].classList.add('boom')
    
          setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 300)
          clearInterval(laserId)
    
          const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
          aliensRemoved.push(alienRemoved)
          results++
          resultsDisplay.innerText = `Score: ${results}`
        }
    
      }
      // keydown listener
      switch(e.key) {
        case 'ArrowUp':
          laserId = setInterval(moveLaser, 100)
      }
    }

  // add player keydown listener
  document.addEventListener('keydown', moveShooter)

  // ======================================================== Invader Actions

  // for moving aliens... remove from previous position on board
  function remove() {
      for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
      }
    }

  function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1
    remove()

    // alien directional movement
    if (rightEdge && goingRight) {
      for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += width +1
        direction = -1
        goingRight = false
      }
    }

    if(leftEdge && !goingRight) {
      for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += width -1
        direction = 1
        goingRight = true
      }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += direction
    }

    // redraw aliens in new position
    draw()

    //============================== if Game Over

    // Continue Message
    function playAgain(msg){
      const gameOverText = `${msg.toUpperCase()}\nYour final score is: ${results}\n\nPlay Again?`;
      if(confirm(gameOverText) == true){
        grid.innerHTML = "";
        results = 0
        resultsDisplay.innerText = `Score: ${results}`
          play();
      } else {
        grid.innerHTML = "<div style='width:100%;text-align:center;font-size:48px'>Thanks for Playing!</div>"
      }
    }

    // ============ Various Game Over Scenarios

    // if aliens catch player... game over
    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
      clearInterval(invadersId)
      playAgain('GAME OVER');
    }

    // if aliens reach the ground... game over
    for (let i = 0; i < alienInvaders.length; i++) {
      if(alienInvaders[i] > (squares.length)) {
        clearInterval(invadersId)
        playAgain('GAME OVER');
      }
    }

    // if all aliens are gone... you win, and game over.
    if (aliensRemoved.length === alienInvaders.length) {
      clearInterval(invadersId)
      playAgain('YOU WIN');
    }
  }


  invadersId = setInterval(moveInvaders, 600)

  document.addEventListener('keydown', shoot)
}

if(confirm('Space Invaders\n\nStart Game?') == true){
    play();
} else {
  grid.innerHTML = "<div style='width:100%;text-align:center;font-size:48px'>Refresh Page to Start Again!ß</div>"
}


