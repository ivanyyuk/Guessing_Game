(function(){

$(document).ready(function() { 

	var playersGuess,
	    winningNumber, guesses = [], blinker; //blinker is for a setInterval function 
	
	
	
	/* **** Guessing Game Functions **** */
	
	// Generate the Winning Number
	
	function generateWinningNumber(){
		return Math.ceil(Math.random()*100);
	}
	
	// Fetch the Players Guess
	
	function playersGuessSubmission(event){
		event.preventDefault();
		
		playersGuess = +$('#textbox').val();
		$('#textbox').val('');

		
		
		if (playersGuess >=1 && playersGuess <=100)
			checkGuess();
		else
			writeMessage("You must pick a number between 1 and 100");

		//console.log(winningNumber,playersGuess,guesses);
	}



	/*So the closer you are to the number, the faster I want the message to blink.
	blinkTime is the param we pass to the flashingMessage function that determines
	how fast the message will blink. The closer we are the faster we blink.
	We also pass 3 classes for the colors. cold, warm , or hot. All of these have corresponding
	colors in the css file.
	*/	
	function colderOrHotter(){
	
		var distance = Math.abs(playersGuess - winningNumber);
		var blinkTime = distance * 10;

		//if this is the first guess 
		if (guesses.length <2){
			if (distance >30){
				flashMessage("COLD",'cold',blinkTime);
			} else if (distance <30 && distance >10){
				flashMessage("WARM", 'warm', blinkTime)
			} else if (distance <=10){
				flashMessage("HOT", 'hot', blinkTime);
			}
		} else {//here we just add 'ER' to the word and inform user if he is going towards or away from number 
			var oldDistance = Math.abs(guesses[guesses.length -2] - winningNumber);
			if(distance < 10 && distance < oldDistance)
				flashMessage("HOTTER", 'hot', blinkTime);
			else if(distance < oldDistance)
				flashMessage("WARMER", 'warm', blinkTime);
			else 
				flashMessage("COLDER", 'cold', blinkTime);
		}
	}
	
	//push our Guesses to an array 
	
	function pushGuess(){

		if(guesses.length === 0){
			guesses.push(playersGuess);
			writeGuessHistory(playersGuess);
		}
		else if (guesses.length>0 && !areThereDoubles()){
			guesses.push(playersGuess);
			writeGuessHistory(playersGuess);
		}
		else if (guesses.length > 0 && areThereDoubles())
			writeMessage("You already tried " + playersGuess + '.<br/>Try again.');
	}	

	//updates Guess history and number of guesses left
	//aslo ends the game in case of a loss
	function writeGuessHistory(guess){
		if (guesses.length==1){
			$('#guessSpan').show();
			$('#guessesLeft').show();
			}	

		var numLeft = 8 - guesses.length;

		$('#guessList').append('<li>' + guess + '</li>');
		$('#numLeft').text(numLeft);

		if(numLeft ===0){
			writeMessage("YOU LOSE!<br/> Answer was " + winningNumber + ".");
			guesses.pop();
			/*i put this pop() here so that the coldeOrHotter function wouldn't run in
			the checkGuess() function. this was a quick fix and not optimal but I got a little
			carried away with this program and it has become quite complicated*/
			askToPlayAgain();

		}
	}

	//checks for double guesses

	function areThereDoubles() { 
		for (var i in guesses){
				if (playersGuess == guesses[i]){
					//console.log(playersGuess, guesses[i],'true')
					return true;
			}
		}
		return false;
	}


	// Check if the Player's Guess is the winning number 

	function checkGuess(){
		//see comments in the 'else' statement below 
		var guessesLength = guesses.length;

		pushGuess();	
		//console.log(guesses)
		
		

		if (playersGuess == winningNumber){
			writeMessage("YOU WIN!");
			askToPlayAgain();
		}

		else {
			/*here i ran into a problem where in the pushGuess function, if I found a double,
			the message wouldn't display because it would go right back here and run colderOrHotter right away/
			so i had to put this here so that if the guesses array doesn't get anything pushed, this wouldn't run*/
			if(guessesLength < guesses.length)
			colderOrHotter();
		}
		
	}
	
	// I made this to provide 3 hints, randomlly chosen.
	
	function provideHint(event){
		event.preventDefault();

		//if hint hasn't been used yet
		if (! ( $('#hint').hasClass('clicked') ) ){
		var randomFrom0to1 = Math.floor(Math.random()*2),
			randomFrom0to2 = Math.floor(Math.random()*3);


		var oddOrEven = winningNumber % 2 === 0 ? "even" : "odd",
			numberBetween = winningNumber <= 50 ? "1 and 50" : "51 and 100";
		
		var	digitArray = winningNumber.toString().split('');
			digitHint = digitArray[randomFrom0to1];

		var hintArray = [];


		hintArray[0] = "The number is " + oddOrEven + ".";
		hintArray[1] = "The number is between " + numberBetween + "."
		hintArray[2] = digitArray.length > 1 ?  "One of the digits is " + digitHint + "." : 
												"The number is only one digit";


		writeMessage(hintArray[randomFrom0to2]);

		$('#hint').addClass('clicked');

	} else
		writeMessage("Sorry, only one hint per game.")


	}
	
	// Allow the "Player" to Play Again
	
	function playAgain(){
		$('#again').hide();
		guesses.length = 0;
		$('#hint').removeClass();
		$('#guessSpan').hide();
		$('#guessList').find('li').remove();
		$('#guessesLeft').hide();
		$('#numLeft').hide();
		startGame();
	}

	function writeMessage(str){
	
		clearInterval(blinker);
	
		$('#message').removeClass();
		$('#message').html(str).hide().fadeIn();

	}

	/*tried to set up a blinking message that flashes quicker 
	the closer you are to the number. I tinkered for a long time with this
	but there is still a little bit of an uneven delay in the beginning and 
	gets worse as the time interval gets bigger. (the COLDER you are)*/ 

	function flashMessage(str,cssClass,time){
		//this resets everything , each time we call this function
		clearInterval(blinker);
		$('#message').removeClass();
		$('#message').addClass(cssClass).text(str);
		
		/*I do this once out of the interval so that it appears quicker
		I put time*2.5 to kind of even it out with the bliner setInterval
		still not completely even in the beginning of the blinking, but close */

		$('#message').text(str).animate({'opacity': 0.1},time*2.5);
		$('#message').text(str).animate({'opacity' :1},time*2.5);

		/*I put the time*5 in after tinkering around for a while... it's the only way 
		I can have the YOU WIN message show right away. Any other time interval, I had 
		a very long delay when running clearInterval.*/
		blinker = setInterval(function() { 
		$('#message').text(str).animate({'opacity': 0.1},time);
		$('#message').text(str).animate({'opacity' :1},time);
		},time*5);

		
	}

	function startGame() {
		$('#gameBoard').slideDown();
		$('#start').hide();
		$('#textbox').focus();
		writeMessage("Pick a number");
		winningNumber = generateWinningNumber();
	}

	function askToPlayAgain(){
		setTimeout(function(){
			$('#gameBoard').slideUp();
			$('#again').fadeIn();
		}, 2500);
	}



/* **** Event Listeners/Handlers ****  */

	//START Button
	$('#start').on('click', startGame);

	//SUBMIT Button
	$('#submit').on('click', playersGuessSubmission); 
	
	//HINT Button
	$('#hint').on('click', provideHint);

	//PLAY AGAIN button
	$('#again').on('click', playAgain);

	//ENTER KEY
	$(document).keypress(function(event){
		if (event.which ==13){
			if($('#gameBoard').is(':visible'))
				playersGuessSubmission(event);
			else if ($('#again').is(':visible'))
				playAgain();
			else
				startGame();;
		}

	});
		
	
});

}());