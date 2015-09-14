var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

var map = new Array(15);
for(i = 0 ; i <15 ; i++){
	map[i] = new Array(15);
}
for(var i=0 ; i<15 ; i++){
		for(var j=0 ; j<15 ; j++){
			map[i][j] = 0;
		}
}
var player = true;
//var box = document.getElementsByClassName('box');
var nBox = 225;
var playBox  = 15;
var clients = [];
var players = [];
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
function checkDraw(){
	for(var i = 0 ; i<playBox ;i++){
		for(var j = 0 ; j<playBox ; j++){
			if(map[i][j] == 0) return false;
		}
	}
	return true;
}
function fillMap(position){
	if(map[Math.floor(position/playBox)][position%playBox] == 0){
		map[Math.floor(position/playBox)][position%playBox] = (player ? -1 : 1);
		player = !player;
	}
}
function isGameEnd() {
	return checkRow() || checkCol() || checkCornor() || checkDraw();
}
function gameEnd(){
	
	for(var i=0 ; i<15 ; i++){
		for(var j=0 ; j<15 ; j++){
			map[i][j] = 0;
		}
	}
	
	players = [];
	io.emit('gameend',player);
	player = true;
}
function gameStart(){
	for (var i = 0, len = players.length; i < len; i++) {
		console.log("id" + i + " : " + players[i]);
		io.to(players[i]).emit('canplay', ((i % 2 == 0) ? "red" : "blue"));
	}
}
function prepare(socket){
	if(players.length == 0)
		players.push(socket.id);
	else if(players.length == 1){
		players.push(socket.id);
		gameStart();
	}
}
function isPlayerTurn(id){
	var index = players.indexOf(id);
	return index != player;
}
function isPlayer(id) {
	var index = players.indexOf(id);
	return index >= 0; // hard code
}
io.on('connection',function(socket){
	//console.log(socket.id);
	clients.push(socket.id);
	socket.on('update',function(position){
		if (isPlayerTurn(socket.id) && isPlayer(socket.id)) {
			fillMap(position);
			io.emit('fillcolor',map);
			if (isGameEnd()) gameEnd();
			else io.emit('turn',player);
		}
	});
	socket.on('disconnect', function() {
		console.log('***[disconnected : ' + socket.id + ']');
		var index = clients.indexOf(socket.id);
		clients.splice(index, 1);
		if (isPlayer(socket.id)) {
			gameEnd();
			console.log('game should end');
		}
	});
	socket.on('join',function(username){
		socket.username = username;
		console.log(username + ' join game');
		prepare(socket);
	});
	socket.on('regame',function(){
		prepare(socket);
		io.emit('fillcolor', map);
	});
	socket.on('chat message',function(massage){
		massage  = socket.username + ": " + massage;
		console.log(massage);
		io.emit('chat massage',massage);
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});