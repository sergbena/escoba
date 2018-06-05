'use strict';

const http= require('http');
const express=require("express");
const Body=require("body-parser");
const Path = require("path");

const numeros= [1,2,3,4,5,6,7,8,9,10];
const palos=["espadas","copas","oros","bastos"];

const Player=require('./public/js/classes/player.js');

const app=express();
const serv=http.createServer(app);

var baraja=[];
var centro=[];

app.use(Body.json());
app.use(Body.urlencoded({
	extended:true
}));
app.use(express.static(Path.join(__dirname,"public")));
//----------END POINTS---------------------

app.post('/empezar',function(req, res){

    var centro=[];

	var player1=new Player();
	player1.name='sergio';
	player1.points=0;
	player1.carts=[];

	var player2=new Player();
    player2.name='computer';
    player2.points=0;
    player2.carts=[];

    baraja=crearBaraja();

	turno(player1,player2);

	repartir(baraja,player1,player2);
	repartirCentro(centro);

	res.json({
		bar:baraja,
		jugador1:player1,
		jugador2:player2,
		center: centro
	});
});

app.post('/dejar',function (req,res) {
	var bara=req.body.bar;
	var play1=req.body.j1;
	var play2=req.body.j2;
	// var cent=req.body.cen;
	var carta=req.body.car[0];

	if(!req.body.cen) var cent=[];
	else var cent=req.body.cen;

	cent.push(carta);

    changeTurn(play1,play2);

    if (!play1._carts) play1._carts=[];
    if (!play2._carts) play2._carts=[];

	res.json({
		bar:bara,
		jugador1:play1,
		jugador2:play2,
		center:cent
	});
});

app.post('/sumar',function (req,res) {

	var bara=req.body.bar;
    var play1=req.body.j1;
    var play2=req.body.j2;
    var cent=req.body.cent;
    var carta=req.body.car;

    if(!req.body.cent){
    	console.log('escoba');
        var cent=[];
        var pun=play1._points;
		play1._points= parseInt(pun)+1;
	}
    else var cent=req.body.cent;

    for(let c of carta){
    	play1._carts.push(c);
	}

	changeTurn(play1,play2);

	play1._last=true;
	play2._last=false;

    res.json({
        bar:bara,
        jugador1:play1,
        jugador2:play2,
        center:cent
    });
});

app.post('/repartir',function (req,res) {

    var bara=req.body.bar;
    var play1=req.body.j1;
    var play2=req.body.j2;
    var cent=req.body.cent;

    if(bara){
        repartir(bara,play1,play2);
	}else {
    	finDeRonda(play1,play2,cent);
	}

    res.json({
        bar:bara,
        jugador1:play1,
        jugador2:play2,
        center:cent
    });
});

app.get('/puntuacion',function(req,res){

    var play1=req.body.j1;
    var play2=req.body.j2;

    res.json({
        jugador1:play1,
        jugador2:play2
    });
});

//------ESCUCHANDO------------
serv.listen(process.env.PORT || 4000, function(){
	console.log("escuchando en puerto "+4000);
});

//------FUNCIONES-------
/**
 * Crea la baraja de cartas
 * @returns {Array}
 */
function crearBaraja(){

	baraja=[];
	for(let v of numeros){
		for(let p of palos){
			var carta={
				valor:v,
				palo:p
			}
			baraja.push(carta);
		}
	}
	for(var i=0; i<3;i++){
        baraja=baraja.sort(function(){
            return Math.random()-0.5;
        });
	}

	return baraja;
}

/**
 * Decide quien es el primero en empezar
 * @param player1
 * @param player2
 */
function turno(player1,player2){

	let ran=Math.floor(Math.random()*2);

	if(ran == 0){
		player1.turn=true;
        player2.turn=false;
	} else if (ran == 1){
        player1.turn=false;
        player2.turn=true;
	}

}

/**
 * Cambiar turnos
 * @param player1 Player
 * @param player2 Player
 */
function changeTurn(player1,player2){
	if(player1._turn){
		player2._turn=true;
		player1._turn=false;
	}else{
        player2._turn=false;
        player1._turn=true;
	}
}

/**
 * repartir cartas entre los jugadores
 * @param baraja	array
 * @param player1	Player
 * @param player2	Player
 */
function repartir(baraja,player1,player2){

	player1._hand=[];
	player2._hand=[];

	for(var i=0; i<3;i++){
		var cartaP1=baraja.shift();
        player1._hand.push(cartaP1);

		var cartaP2=baraja.shift();
        player2._hand.push(cartaP2);
	}

}

/**
 * repartir cartas en el centro
 * @param centro	array
 */
function repartirCentro(centro){
    for(var h=0;h<4;h++){
        var cartaC=baraja.shift();
        centro.push(cartaC);
    }
}

function finDeRonda(jugador1,jugador2,centro){

	if(centro){
        if(jugador1._last){
            for(var c=0; c<centro.length; c++){
                var m=centro.shift();
                jugador1._carts.push(m);
            }
        }
        else if(jugador2._last){
            for(var c=0; c<centro.length; c++){
                var m=centro.shift();
                jugador2._carts.push(m);
            }
        }
	}

}