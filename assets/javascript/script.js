/* --- --- --- GLOBAL VARIABLES --- --- --- */

var gameState = 'joinGame';

var currentName = 'Spectator';

var currentSelection = '';

var playerNumber = null;

var playerOneGuess = '';
var playerTwoGuess = '';

var config = {
	apiKey: "AIzaSyAFv-QDxJ7R061XotHbP0yWhvKdo5dkukU",
	authDomain: "rps-multiplayer-db.firebaseapp.com",
	databaseURL: "https://rps-multiplayer-db.firebaseio.com",
	projectId: "rps-multiplayer-db",
	storageBucket: "rps-multiplayer-db.appspot.com",
	messagingSenderId: "1005144939725"
};

firebase.initializeApp(config);

database = firebase.database();

playerObject = '';


/* --- --- --- GLOBAL FUNCTION --- --- --- */

// To Draw Needed Elements to Screen
function drawScreen(){

	switch(gameState){


	//draw joinGame screen
	case 'joinGame':

	break;


	//draw rpsSelect screen
	case 'rpsSelect':

		$('#join-panel').hide();

		console.log('RPS redraw')

		if(playerNumber === 1){

			$(".p1-button").css("opacity", 1);
			$(".p1-button").removeClass("btn-selected");
			$(".p2-button").css("opacity", .2);
			$(".p2-button").removeClass("btn-selected");
		}

		if(playerNumber === 2){

			$(".p2-button").css("opacity", 1);
			$(".p2-button").removeClass("btn-selected");
			$(".p1-button").css("opacity", .2);
			$(".p1-button").removeClass("btn-selected");
		}

		break;


	//draw results screen
	case 'results':

		database.ref().once("value", function(snapshot){

			$('#game-results').text(snapshot.val().result)

			if (playerNumber === 1){

				switch( playerTwoGuess){

					case 'rock':
						
						$('#p2-select-rock').addClass('btn-danger');

						break;

					case 'paper':
						
						$('#p2-select-paper').addClass('btn-danger');

						break;

					case 'scissors':
						
						$('#p2-select-scissors').addClass('btn-danger');
						
						break;
				}

			}

			if (playerNumber === 2){

				switch( playerOneGuess){

					case 'rock':
						
						$('#p1-select-rock').addClass('btn-danger');

						break;

					case 'paper':
						
						$('#p1-select-paper').addClass('btn-danger');

						break;

					case 'scissors':
						
						$('#p1-select-scissors').addClass('btn-danger');
						
						break;
				}


			}			

		});

		timerInterval = setTimeout(function(){

			$('#game-results').text('');

			$('.p1-button').removeClass('btn-danger');
			$('.p2-button').removeClass('btn-danger');
				
			database.ref('game-round').set(1);

		}, 3000 );

	}


}

//checks if both players are logged in and updates round in db

function checkIfReady(){

	database.ref().once("value", function(snapshot){

		if( snapshot.child('playerDbOne').val() !== null && snapshot.child('playerDbTwo').val() !== null ){
			console.log('EveryBodyready')
		}

		database.ref('game-round').set(1);

	});

}



//check if both players have a guess, if so perform the math
function checkIfGuessed(){

	database.ref().once("value", function(snapshot){

		if( snapshot.child('playerDbOne/guess').val() !== null && snapshot.child('playerDbTwo/guess').val() !== null ){
			console.log('EveryBody Guessed')
			database.ref('game-round').set(2);
		}

	});

}


//compare the guesses in dB, update W/L

function compareGuesses(){

	database.ref().once("value", function(snapshot){
		playerOneGuess = snapshot.child('playerDbOne/guess').val();
		playerTwoGuess = snapshot.child('playerDbTwo/guess').val();
		var bothGuesses = playerOneGuess + playerTwoGuess;

		console.log(bothGuesses);

		if( playerOneGuess === playerTwoGuess){
			database.ref('result').set('Tie!');

			if(playerNumber === 1){
				database.ref('playerDbOne/guess').set(null);		
			}

			if(playerNumber === 2){
				database.ref('playerDbTwo/guess').set(null);		
			}

		}

		else if ( bothGuesses === 'rockscissors' || bothGuesses === 'paperrock' || bothGuesses === 'scissorspaper'){
			console.log('Player One Wins')
			database.ref('result').set('Player 1 Wins!');

			if(playerNumber === 1){
				database.ref('playerDbOne/guess').set(null);
				database.ref('playerDbOne/wins').set(snapshot.child('playerDbOne/wins').val()+1)				
			}

			if(playerNumber === 2){
				database.ref('playerDbTwo/guess').set(null);
				database.ref('playerDbTwo/losses').set(snapshot.child('playerDbTwo/losses').val()+1)				
			}
		}
		
		else{
			console.log('Player Two Wins');
			database.ref('result').set('Player 2 Wins!');

			if(playerNumber === 1){
				database.ref('playerDbOne/guess').set(null);
				database.ref('playerDbOne/losses').set(snapshot.child('playerDbOne/losses').val()+1)		
			}

			if(playerNumber === 2){
				database.ref('playerDbTwo/guess').set(null);	
				database.ref('playerDbTwo/wins').set(snapshot.child('playerDbTwo/wins').val()+1)			
			}
		}

	});

	database.ref('game-round').set(3);
	
}


/* --- --- --- STARTUP LOGIC --- --- --- */


/* --- --- --- EVENT HANDLERS --- --- --- */

//when Name Submit button clicked

$(document).on('click', '#name-submit', function(event){

	event.preventDefault();

	//initialize input name to value
	var nameInput = $('#name-input').val();

	currentName = nameInput;

	//clears form input
	$('#name-input').val('');

	console.log(nameInput);


	//get snapshot of db
	database.ref().once("value", function(snapshot) {

		
		//if player one not existing, create player one
		if( snapshot.child('playerDbOne').val() === null ){
			
			database.ref('playerDbOne').set({
				name: nameInput,
				wins: 0,
				losses: 0,
				guess: null,
				player: 1
			});

			playerObject = database.ref('playerDbOne');
			playerObject.onDisconnect().remove();

			$('#player-one-name').addClass('my-name');

			playerNumber = 1;

			//hide p2-button and remove rps-selector
			$(".p2-button").css("opacity", '.2');
			$(".p2-button").removeClass("rps-selector");

			
			checkIfReady();
			drawScreen();
		}

		//otherwise create player two
		else if( snapshot.child('playerDbTwo').val() === null ){
			
			database.ref('playerDbTwo').set({
				name: nameInput,
				wins: 0,
				losses: 0,
				player: 2,
				guess: null
			});

			playerObject = database.ref('playerDbTwo');
			playerObject.onDisconnect().remove();

			$('#player-two-name').addClass('my-name');

			playerNumber = 2;


			//hide p1-button and remove rps-selector
			$(".p1-button").css("opacity", '.2');
			$(".p1-button").removeClass("rps-selector");


			checkIfReady();
			drawScreen();
			
		}

		//otherwise alert that game is full
		else{
			alert('Game is currently full; try again later.');
		}

	});

});




$(document).on('click', '.rps-selector', function(event){

	console.log(currentName +' selected ' +$(this).attr('data-name'));

	// set player choice in db to correct choice

	if ( playerNumber === 1){

		$(".p1-button").css("opacity", '.2');
		$(this).addClass('btn-selected');
		$(this).css('opacity', '1');

		database.ref('playerDbOne').update({guess: $(this).attr('data-name') })

	}

	else if ( playerNumber === 2){

		$(".p2-button").css("opacity", '.2');
		$(this).addClass('btn-selected');
		$(this).css('opacity', '1');

		database.ref('playerDbTwo').update({guess: $(this).attr('data-name') })

	}

	checkIfGuessed();

});


//chat submit button
$(document).on('click', '#chat-submit', function(event){

	event.preventDefault();

	//initialize input name to value
	var chatInput = currentName +': ' +$('#chat-input').val();
	console.log(chatInput);

	$('#chat-input').val('');

	database.ref('chat-input/current').set(chatInput);

});


// draws playerNames to screen

database.ref().on("child_added", function(snapshot) {

	if (snapshot.val().player === 1){
		$('#player-one-name').text(snapshot.val().name)
	}

	if (snapshot.val().player === 2){
		$('#player-two-name').text(snapshot.val().name)
	}

});


//erases playernames on disconnect
database.ref().on("child_removed", function(snapshot) {

	console.log( snapshot.val().player);

	if (snapshot.val().player === 1){
		$('#player-one-name').text('Waiting...')
	}


	if (snapshot.val().player === 2){
		$('#player-two-name').text('Waiting...')
	}

	database.ref('game-round').set(0);

});


//watches game round
database.ref('game-round').on("value", function(snapshot){

	console.log(snapshot.val())

	if(snapshot.val() === 1 && playerNumber !== null){
		gameState = 'rpsSelect';
		drawScreen();
	}

	else if(snapshot.val() === 2 ){
		compareGuesses();
	}

	else if (snapshot.val() === 3 ){

		console.log('results screen:')
		gameState = 'results';
		drawScreen();
	}

})



//watchers for W/L

database.ref('playerDbOne/wins').on("value", function(snapshot){
	if(snapshot.val() !== null){
		$('#player-one-wins').text('Wins: '+snapshot.val());
	}
});

database.ref('playerDbOne/losses').on("value", function(snapshot){
	if(snapshot.val() !== null){
		$('#player-one-losses').text('Losses: '+snapshot.val());
	}
});

database.ref('playerDbTwo/wins').on("value", function(snapshot){
	if(snapshot.val() !== null){
		$('#player-two-wins').text('Wins: '+snapshot.val());
	}
});

database.ref('playerDbTwo/losses').on("value", function(snapshot){
	if(snapshot.val() !== null){
		$('#player-two-losses').text('Losses: '+snapshot.val());
	}
});


//watcher for chat

database.ref('chat-input').on("child_changed", function(snapshot){
	// if(snapshot.val() !== null){
		$('#chat-box').prepend('<p>' +snapshot.val() +'</p>');
	// }
});
