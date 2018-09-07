// JavaScript Document

// Whack a Mole Game

// This code is based on code found at
// https://javascript30.com


//pop-up message
const introBox = $('#hide-me');
const closeBox= $('.close');
const inputUsername = $('#username');
const btnSubmit = $('#submit');
const output = $('#output');

const btnGameLevel = $('#level-easy, #level-hard');
const gameBox= $('#hide');


btnSubmit.on('click', getFormValues);

function getFormValues(e){

	//perevent the browser from submitting the form using e.prevent default 
	e.preventDefault();

	//get the user entered values from the formusing the .value property...
	const username = inputUsername.val();
	console.log(username);
	introBox.hide();
	alert('Choose your Difficulty...');
	output.html(`Hello, ${username}! `);
}

closeBox.on('click', closeMsg);

function closeMsg(e){
	introBox.hide();
	alert('Choose your Difficulty...');
  output.html(`Hello, Player! `);
}
//end of pop-up message


//game code
class hitBalls {
	
	// Properties used to initialize our
	// Whack-a-Mole Game
	constructor(startButton, boxes, scoreOut, gameTimeLength, peepTimeMin, peepTimeMax){		
		// Game HTML Elements
		this.btnStart = startButton;
		this.boxes = boxes;
		this.scoreOut = scoreOut;
		
		// Game Images
		this.boxImgSrc = 'images/Pink_Ball.png';
		this.boxBonkedImg = new Image();
		this.boxBonkedImg.src = 'images/Blue_Ball.png';
		
		// Game Parameters
		this.gameTime = gameTimeLength;
		this.minPeepTime = peepTimeMin;
		this.maxPeepTime = peepTimeMax;
		this.numOfBoxes = this.boxes.length;
		
		// Game State Variables
		this.prevBoxNumber = null;
		this.timeUp = false;
		this.timeDown = false;
		this.score = 0;
		this.gameTimer = null;
		this.peepTimer = null;
		this.upOrDown = 'down';	

		this.seconds = (this.gameTime / 1000);

	}

	init(){
		console.log('running...');
		this.score = 0;
		this.scoreOut.text(this.score);
		this.timeUp = false;
		this.timeDown = false;
		this.prevBoxNumber = null;
		this.btnStart.text('Stop Game');
		this.peep();
		this.gameTimer = setTimeout(() => {
			console.log('Game Over...');
			this.btnStart.text('Start Game');
			this.timeUp = true;
			this.timeDown = true;
			console.log(this.boxes.children());
			this.boxes.children().removeClass('show');
			console.log(this.boxes.children());
		}, this.gameTime);
		
		const that = this;

		function countdown() {
    	
	    function tick() {
	        var counter = document.getElementById("counter");
	        that.seconds--;
	        counter.innerHTML = (that.seconds < 10 ? "0" : "")  + String(that.seconds) + " SEC";
	        if( that.seconds > 0 ) {
	            setTimeout(tick, 1000);
	        } else {
	        	 output.html(`Game Over!`);
	        }
	    }
      tick();
	  }
    countdown();	
   
	}


	
	stop(){
		console.log('Game Stopped...');
		this.btnStart.text('Start Game');
		this.timeUp = true;
		this.timeDown = true;
		this.boxes.removeClass('show');
		//this.boxes.removeClass('up');
		clearInterval(this.peepTimer);
		clearInterval(this.gameTimer);
	}
	
	peep(){

		  const time = this._randomTime(this.minPeepTime, this.maxPeepTime);
    	const box = this._randomBox(this.boxes);
    	//ball.addClass('down');
    	//ball.addClass('up');
    	this.peepTimer = setTimeout(() => {

    		if(this.upOrDown == 'down'){
    			this.boxes.children('img').removeClass('show');
    			box.children('.top').addClass('show');
      		this.upOrDown = 'up';
      		if(this.timeUp === false){
						this.peep();
					} 
				 }else{
				 	this.boxes.children('img').removeClass('show');
    			box.children('.bottom').addClass('show');
    			this.upOrDown = 'down';
	    			if(this.timeDown === false){
							this.peep();
						}
    		  }

    		  if(this.seconds === 0){
    		  	console.log('Seconds to zero...');
    		  	this.boxes.children().removeClass('show');
    		  }

    	}, time); 

   
	}
	
	bonk(box) {
		console.log('you hit the ball');
		console.log(box);
		console.log(this.boxBonkedImg.src);
		box.children().attr('src', this.boxBonkedImg.src)
				.end()
				.removeClass('show')
		    .addClass('bonked')
		    .one('transitionend', () => {
					box.children().attr('src', this.boxImgSrc);
					box.removeClass('bonked');
			});
		  this.score++;
    	this.scoreOut.text(this.score);
    	
	}
		// Utility functions
	
	// generate a random time to determine how long
	// the moles stay up
	_randomTime(min, max){
		return Math.round(Math.random() * (max - min) + min);
	}
	
	// randomly selects one of the moles to display
	_randomBox(boxes) {
    	const idx = Math.floor(Math.random() * this.numOfBoxes);
    	const box = boxes.eq(idx);
    	if (idx === this.prevBoxNumber) {
      		console.log('...same ball...try again...');
      		return this._randomBox(boxes);
    	}
		this.prevBoxNumber = idx;
			console.log(idx);
    	return box;
	}	

	
}

// Get a new instance of the Whack A Mole
// class
// Parameters:
// 1. Start Button
// 2. Mole Image
// 3. Score out
// 4. Game Time Length (ms)
// 5. Peep Time Min (ms)
// 6. Peep Time Max (ms)


//const hba = new hitballs($('#btn-start'), $('.ball-pic'), $('#score-out'),20000, 100, 2500 );

const hba = new hitBalls($('#btn-start'), $('.box'), $('#score-out'), 20000, 1000, 2000);

btnGameLevel.on('click', function(){

	gameBox.slideUp("slow");
	if($(this).data('level') === 'Hard'){
		hba.minPeepTime = 800;
		hba.maxPeepTime = 1200;		
 		//hba = new hitBalls($('#btn-start'), $('.ball-pic'), $('#score-out'), 17000, 1000, 2000);
 }

});

// Game Event Handlers
hba.btnStart.click(function(){
	
	if(hba.btnStart.text() === 'Start Game'){
		hba.init();
	}else{
		hba.stop();
	}

});



hba.boxes.click(function(){
	
	if($(this).hasClass('bonked')){
		return;
	}
	
	hba.bonk( $(this) );
	console.log($(this));

});




