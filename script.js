var map = new Array(15);
for(i = 0 ; i <15 ; i++){
	map[i] = new Array(15);
}
var player = true;
var box = document.getElementsByClassName('box');
var nBox = box.length;
var playBox  = 15;
$(document).ready(function(){
	startGame();
	$(".box").click(changeColor);
});
function startGame(){
	$("span").removeClass();
	$("span").addClass('box');
	for(var i=0 ; i<15 ; i++){
		for(var j=0 ; j<15 ; j++){
			map[i][j] = 0;
		}
	}
	player = true;
	changeTurn();
}
function changeColor(e){
	if(!$(this).hasClass('box-red') && !$(this).hasClass('box-blue')) {
		$(this).addClass(function(){
			return "box box-" + (player? "red":"blue");
		});
		fillMap();
		player = !player;
		changeTurn();
		if(endGame()){
			if(!player)
			alert("red WIN");
			else alert("blue WIN");
			startGame();
		}
	}
}
function fillMap(){
	
	for (var i = 0; i < nBox; i++) {
		var colorBox = box[i].className.split(' ').pop();
		if(colorBox == "box-red"){
			map[Math.floor(i/playBox)][i%playBox] = -1;
		}
		else if(colorBox == "box-blue"){
			map[Math.floor(i/playBox)][i%playBox] = 1;	
		}
		
	}
}
function endGame(){
	return checkRow() || checkCol() || checkCornor();
}
function checkRow(){
	var c = 0;
	for(var i = 0 ; i<playBox ;i++){
		for(var j = 0 ; j<playBox-4 ; j++){
			if(map[i][j] == 1 || map[i][j] == -1){
				for(k = 1,c = 0 ; k <5 ; k++){
					if(map[i][j] == map[i][j+k]) c++;
				}
				if(c == 4)return true;
			}
		}
	}
}
function checkCol(){
	var c = 0;
	for(var i = 0 ; i<playBox-4 ;i++){
		for(var j = 0 ; j<playBox ; j++){
			if(map[i][j] == 1 || map[i][j] == -1){
				for(k = 1,c = 0 ; k <5 ; k++){
					if(map[i][j] == map[i+k][j]) c++;
				}
				if(c == 4)return true;
			}
		}
	}
}
function checkCornor(){
	for(var i = 0 ; i<playBox-4 ;i++){
		for(var j = 0 ; j<playBox-4 ; j++){
			if(map[i][j] == 1 || map[i][j] == -1){
				for(k = 1,c = 0 ; k <5 ; k++){
					if(map[i][j] == map[i+k][j+k]) c++;
				}
				if(c == 4)return true;
			}
		}
	}
	for(var i = 0 ; i<playBox ;i++){
		for(var j = 0 ; j<playBox ; j++){
			if(i+4 <15 && j-4 >=0 && (map[i][j] == 1 || map[i][j] == -1)){
				for(k = 1,c = 0 ; k <5 ; k++){
					if(map[i][j] == map[i+k][j-k]) c++;
				}
				if(c == 4)return true;
			}
		}
	}
}
function changeTurn(){
	$("h4").removeClass();
	if(player){
		$("h4").html("RED turn.");
		$("h4").addClass('red');
	}
	else{
		$("h4").html("BLUE turn.");
		$("h4").addClass('blue');		
	} 
}