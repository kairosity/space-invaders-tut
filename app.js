document.addEventListener('DOMContentLoaded', () =>{
    const gridSquares = document.querySelectorAll('.grid div')
    const resultDisplay = document.querySelector('#result')
    let width = 15
    let currentShooterIndex = 202
    let currentInvaderIndex = 0
    let alienInvadersTakenDown = []
    let result = 0
    let direction = 1
    let invaderId

    //define the alien invaders
    const alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ]

    //draw the alien invaders
    // for each invader in the alienInvaders array - add that specific invader index to the currentInvaderIndex(starts at 0)
    //this will return a div on the grid. E.g. gridSquares[0 + 6] === gridSquares[6] == the 7th grid div. 
    //Then add an invader class to that div which will turn it purple.
    alienInvaders.forEach( invader => gridSquares[currentInvaderIndex + invader].classList.add('invader'))

    //draw the shooter
    gridSquares[currentShooterIndex].classList.add('shooter');

    //move the shooter along the line
    function moveShooter(e){
        gridSquares[currentShooterIndex].classList.remove('shooter')//undraw the shooter prior to moving her
        switch(e.keyCode){
            case 37:
                if(currentShooterIndex % width !==0) currentShooterIndex -=1 //to move left IF currentShooterIndex divides perfectly into 15 - the left hand grid runs 0,15,30,45 etc.. 
                break
            case 39:
                if(currentShooterIndex % width < width -1) currentShooterIndex +=1 // width-1 =14 SO to move right IF currentShooterIndex /15 leaves a remainder that is less than 14. the right hand grid divided by 15 runs 14,29,44 etc.. they all leave 14remainders when % 15.
                break
        }
        gridSquares[currentShooterIndex].classList.add('shooter');//redraw the shooter in new location.
    }

    document.addEventListener('keydown', moveShooter); //listens for anytime a key is pressed down to call the above func.

    //move the alien invaders

    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0; //find the left edge based on the left most invader [0]
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width-1; //right edge based on the very last invader in the index hitting the right wall.
        
        if((leftEdge && direction === -1) || (rightEdge && direction === 1)){ //if they are at either edge then move them down a full line width=15 grid spaces
            direction = width //direction is 15 - jump down a line.
        } else if (direction === width) { //if the direction is already 15 i.e. they have JUST jumped a line then...
            if(leftEdge) direction = 1 //if they are on the left edge - move them 1 square right
            else direction = -1 //if they are on the right edge - move them 1 square left.
        }
        for(let i=0; i<= alienInvaders.length -1; i++){ //loop over the alienInvaders array
            gridSquares[alienInvaders[i]].classList.remove('invader')//undraw each invader
        }
        for(let i=0; i<=alienInvaders.length-1; i++){//loop invaders again
            alienInvaders[i] += direction //move each invader the amount indicated by direction.
        }
        for(let i=0; i<= alienInvaders.length -1; i++){ //loop over the alienInvaders array
            if(!alienInvadersTakenDown.includes(i)){ //if the alien index is NOT in array of aliens taken down only THEN...
            gridSquares[alienInvaders[i]].classList.add('invader') //redraw them in their new location
            }
        }
        //decide a win
        if(alienInvadersTakenDown.length === alienInvaders.length){
            resultDisplay.textContent = 'You Win!';
            clearInterval(invaderId)
        }
    }

    //decide that game is over
    if(gridSquares[currentShooterIndex].classList.contains('invader', 'shooter')){ //if the aliens reach the square the shooter is in.
        resultDisplay.textContent = 'Game Over'
        gridSquares[currentShooterIndex].classList.add('boom') //add an explosion to div
        clearInterval(invaderId) //stop the timer
    }

    for(let i=0; i<= alienInvaders.length-1; i++ ){
        if(alienInvaders[i] > (gridSquares.length - (width-1))){//if any aliens in the last 15 squares of the grid then the game is over.
            resultDisplay.textContent = 'Game Over'
            clearInterval(invaderId)
        }
    }
    invaderId = setInterval(moveInvaders, 500);

    //shoot at aliens

    function shoot(e){
        let laserId
        let currentLaserIndex = currentShooterIndex

        //move the laser from the shooter to the alien Invader
        function moveLaser() {
            gridSquares[currentLaserIndex].classList.remove('laser') //undraw from current location
            currentLaserIndex -= width //move the laser straight up 1 row
            gridSquares[currentLaserIndex].classList.add('laser')
            if(gridSquares[currentLaserIndex].classList.contains('invader')){
                gridSquares[currentLaserIndex].classList.remove('laser')
                gridSquares[currentLaserIndex].classList.remove('invader')
                gridSquares[currentLaserIndex].classList.add('boom')

                setTimeout(() => gridSquares[currentLaserIndex].classList.remove('boom'), 250)
                clearInterval(laserId)

                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex)
                alienInvadersTakenDown.push(alienTakenDown)
                result++
                resultDisplay.textContent = result
            }
            if(currentLaserIndex < width) { //when the laser reaches the top of screen without hitting something if it's less than 15 i.e. in top row
                clearInterval(laserId)//stop it moving? 
                setTimeout(()=> gridSquares[currentLaserIndex].classList.remove('laser'), 100) //undraw the laser
            }
        }

        // document.addEventListener('keyup', e => { //listen for when a key is pressed  -this runs simultaneously with shoot? 
        //     if (e.keyCode === 32) { //if the spacebar is the key
        //         laserId = setInterval(moveLaser, 100) //start moving the laser up the rows at 100ms speed - finally setting the laserID var.
        //     }
        // })

        switch(e.keyCode) {
            case 32:
                laserId = setInterval(moveLaser, 100)
                break
        }
    }

    document.addEventListener('keyup', shoot);//run the function shoot when a key is pressed. 


})