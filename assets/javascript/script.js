/* --- --- --- GLOBAL VARIABLES --- --- --- */

var gameState = 'joinGame';

var currentName = '';

var currentSelection = '';


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



/* --- --- --- GLOBAL FUNCTION --- --- --- */

// To Draw Needed Elements to Screen
function drawScreen(){

	switch(gameState){

	//draw joinGame screen
		case 'joinGame':

	//clear main panel

	//create, append #join-button
		
		break;

	//draw rpsSelect screen
		case 'rpsSelect':

		//clear main panel

		//create, append RPS buttons

		break;

	//draw results screen
		case 'results':

		//clear main panel

		//display selections

		//display Win / Lose / Tie

		// set five second timer, then

		// set gameState to rpsSelect, drawScreen

	}


}

/* --- --- --- MAIN LOGIC --- --- --- */


//on page load

//drawScreen


/* --- --- --- EVENT HANDLERS --- --- --- */


//when Join button clicked

$(document).on('click', '#join-button', function(event){

	console.log('join');
//check db; if playerOne empty, then playerName = playerOne

//else if playerTwo empty, become playerTwo

//else say Game is Full

//set gameState to RPS select, drawScreen()

});


$(document).on('click', '#new-game-button', function(event){

	console.log('restart')

// set all counters to 0

// reset counters, players in db

// set gameState = joinGame, drawScreen()

});


$(document).on('click', '.rps-selector', function(event){

	console.log('selected ' +$(this).attr('data-name'));

	// set player choice in db to correct choice

	// if both player choices are set,

		// do comparison

		// update 'last selected' in db for both

		// update W/L in db

		// increment rounds in db

});


//event listener for rounds in db

	//on change
		
		//gameState = results, drawscreen


/* --- --- --- PSEUDO / NOTES

On Page Load:

* prompt for name
* check database for other player
* give RPS options
	wait for second player
* show results





On "Restart Game":
	reset counters in db
	set 



Game Modes:

Join Game

RPS Choice

Results






*/