// var Player=import('./classes/player.js');

var baraja = [];
var central = [];
let j = 0;
var contador=0;
const pl='sergio';
var local='';
var visitante='';

$(document).ready(function() {

	$.ajax({
		url: '/empezar',
		method: 'post',
		success: function(res, textStatus, xhr) {

			central=res.center;
			baraja=res.baraja;
			// console.log('jugador 1');
			console.log(res);
            // console.log(res.jugador1._name);
			if(res.jugador1._name == pl){
				local=res.jugador1;
				visitante=res.jugador2;
			}

            baraja = res.bar;
			cuantasCartas(baraja);
			$("#cartasUsuarioL").append(addCartas(local._hand, "usuarioL"));
			$("#cartasUsuarioV").append(addCartas(visitante._hand, "usuarioV"));
			$("#tapete").append(addCartas(central, "central"));

            $("#tapete img").on("click",function(event){
                selecCenter(event);
            });

            $("#cartasUsuarioL img").on("click",function(event){
                selectCart(event);
            });

            $('#botD').on("click",function(){
            	dejar(local,visitante);
			});

            $('#botR').on("click",function(){
            	recoger(local,visitante);
			});

            desbloqDejar();
            desbloqRecoger();

            if(local._carts) $('#cart1').text(local._carts.length);
            else $('#cart1').text(0);

            if (local._points) $('#esc1').text(local._points);
            else $('#esc1').text(0);

            if (visitante._carts) $('#cart2').text(visitante._carts.length);
            else $('#cart2').text(0);

            if(visitante._points) $('#esc2').text(visitante._points);
            else $('#esc2').text(0);

		}
	});

});

/**
 * Dibujar las cartas en el tablero
 * @param cartas array
 * @param tipo lado
 * @returns {string}
 */
function addCartas(cartas, tipo) {
    var naipes = "";
    // console.log('addCartas');
    // console.log(cartas);

	if(!cartas){
		return naipes;
	}

	if (tipo==="usuarioL"){
		if (cartas.length == 1){
			var c=cartas[0];
            let val = c.valor;
            let pal = c.palo;
            naipes += "<img src='img/" + pal + "/" + val + ".jpg' alt='" + val + "-" + pal + "'/>";
		}else{
            for (let c of cartas) {
                let val = c.valor;
                let pal = c.palo;
                naipes += "<img src='img/" + pal + "/" + val + ".jpg' alt='" + val + "-" + pal + "'/>";
            }
		}

	}else if (tipo==="usuarioV"){
        if (cartas.length == 1){
            var c=cartas[0];
            let val = c.valor;
            let pal = c.palo;
            naipes += "<img src='../img/naipes.PNG' class='barajaOculta' alt='" + val + "-" + pal + "' />";
        }else{
            for (let c of cartas) {
                let val = c.valor;
                let pal = c.palo;
                naipes += "<img src='../img/naipes.PNG' class='barajaOculta' alt='" + val + "-" + pal + "' />";
            }
		}

	}else if(tipo==="central"){
        if (cartas.length == 1){
            var c=cartas[0];
            let val = c.valor;
            let pal = c.palo;
            naipes += "<img src='img/" + pal + "/" + val + ".jpg' alt='" + val + "-" + pal + "'/>";
        }else{
            for (let c of cartas) {
                let val = c.valor;
                let pal = c.palo;
                naipes += "<img src='img/" + pal + "/" + val + ".jpg' alt='" + val + "-" + pal + "' class=''/>";
            }
		}

	}	
	return naipes;
}

/**
 * Seleccionar carta del jugador
 * @param e event
 */
function selectCart(e){
	var l=$(e.target).siblings('img').length;

	if ($(e.target)[0].className == 'selectcart'){
        $(e.target).removeClass('selectcart');
        setTimeout(function () {
            contar();
            desbloqDejar();
        },0)

    }else {
        $(e.target).addClass('selectcart');
        setTimeout(function () {
            contar();
            desbloqDejar();
        },0)

    }

	for(var i=0; i<l; i++){
		if($(e.target).siblings('img')[i].className == 'selectcart'){

			var img=$(e.target).siblings('img')[i];
			$(img).removeClass('selectcart');
		}
	}
}

/**
 * Seleccionar cartas centrales
 * @param e event
 */
function selecCenter(e){

    if ($(e.target)[0].className == 'selectcart'){
        $(e.target).removeClass('selectcart');
        setTimeout(function () {
            contar();
        },0)

    }else {
        $(e.target).addClass('selectcart');
        setTimeout(function () {
            contar();
        },0)
    }

}

/**
 * contar cartas seleccionadas
 */
function contar(){
	contador=0;
	var seleccionadas=$('.selectcart');
	if(seleccionadas.length!=0){
        for(let car of seleccionadas){
            var valor=recogerValorCarta(car.getAttribute('alt'));
            contador+=valor;
        }
        desbloqRecoger(contador);
        $("#pts1").text(contador);
	}else {
		$("#pts1").text(0);
	}

}

/**
 * Numero de cartas que quedan en la baraja
 * @param bara
 */
function cuantasCartas(bara){
    if(bara){
        var resto= bara.length - j;
        $('#ncarts').text(resto+" cartas");
    }else{
        $('#ncarts').text("0 cartas");
    }
}

/**
 * Recoger el valor de la carta
 * @param alt propiedad alt de la carta
 * @returns {int} valor
 */
function recogerValorCarta(alt){
	var separador=alt.split('-');
    return parseInt(separador[0]);
}

/**
 * Desbloquear boton dejar si carta del jugador es seleccionada
 */
function desbloqDejar(){
	var sele=$('#cartasUsuarioL .selectcart');
	if (sele.length!=0){
		$('#botD').attr('disabled', false);
	}else {
        $('#botD').attr('disabled', true);
	}
}

/**
 * Desbloquear boton recoger si contador = 15 y seleccionar carta en mano
 * @param con int
 */
function desbloqRecoger(con) {
    var sele=$('#cartasUsuarioL .selectcart');
    if(sele.length > 0 && con == 15){
        $('#botR').attr('disabled', false);
	}else{
        $('#botR').attr('disabled', true);
	}
}

/**
 * Dejar carta en el centro
 */
function dejar(player1,player2){
    // console.log('dejar player:');
    // console.log(player1);

    var sele=$('#cartasUsuarioL .selectcart').prevAll();
    $('#cartasUsuarioL .selectcart').remove();
    // var cartas=$('#cartasUsuarioL img');
    var ele=player1._hand.splice(sele.length,1);
    var carta=ele;
    desbloqDejar();

    if (carta.length==0){
    	carta=player1._hand.shift();
	}

    var parametros={
    	bar: baraja,
		j1:player1,
		j2:player2,
		cen:central,
		car:carta
	};

	$.ajax({
		url:'/dejar',
		method:'post',
		data: parametros,
		success:function (res, textStatus, xhr) {
            contador=0;
			console.log('dejar post:');
			console.log(res);

            $("#pts1").text(contador);

            if(res.jugador1._name == pl){
                local=res.jugador1;
                visitante=res.jugador2;
            }else if (res.jugador2._name == pl){
            	local=res.jugador2;
                visitante=res.jugador1;
			}

			central=res.center;
			baraja=res.bar;

            cuantasCartas(baraja);

            $("#cartasUsuarioL").empty();
            $("#cartasUsuarioV").empty();
            $("#tapete").empty();

            $("#cartasUsuarioL").append(addCartas(local._hand, "usuarioL"));
            $("#cartasUsuarioV").append(addCartas(visitante._hand, "usuarioV"));
            $("#tapete").append(addCartas(central, "central"));

            if(local._turn){

                $("#tapete img").on("click",function(event){
                    selecCenter(event);
                });

                $("#cartasUsuarioL img").on("click",function(event){
                    selectCart(event);
                });

			}else {
                setTimeout(function () {
                    dejar(visitante,local);
                },1000);

			}

            if(local._carts) $('#cart1').text(local._carts.length);
            else $('#cart1').text(0);

            if (local._points) $('#esc1').text(local._points);
            else $('#esc1').text(0);

            if (visitante._carts) $('#cart2').text(visitante._carts.length);
            else $('#cart2').text(0);

            if(visitante._points) $('#esc2').text(visitante._points);
            else $('#esc2').text(0);

            if (!local._hand && !visitante._hand){
                console.log('repartiendo cartas, central:');
                console.log(central);
                setTimeout(function () {
                    reparto(baraja,local,visitante,central);
                },500);

            }else console.log('continuemos');

        }
	});
}

/**
 * Recoger cartas cuando suman 15
 */
function recoger(player1,player2) {
	var numeros=[];
	var cartas=[];

    var seleM=$('#cartasUsuarioL .selectcart').prevAll();
    $('#cartasUsuarioL .selectcart').remove();
    var ele=player1._hand.splice(seleM.length,1);
    player1._carts.push(ele[0]);

    var sele=$('#tapete .selectcart');
    var img=$('#tapete img');

    for (var i=0; i<img.length; i++){
    	for( let s of sele){
    		if (s == img[i]){
				numeros.push(i);
			}
		}
	}
	numeros=numeros.reverse();

	for(let n of numeros){
		console.log(n);
        var j=central.splice(n,1);
        cartas.push(j[0]);
	}

	desbloqDejar();
	desbloqRecoger();

    var parametros={
    	bar:baraja,
		j1:player1,
		j2:player2,
		cent:central,
		car:cartas
	};

    $.ajax({
		url:'/sumar',
		method:'post',
		data:parametros,
		success:function (res) {

            contador=0;

            console.log('sumar');
            console.log(res);

            $("#pts1").text(contador);

            if(res.jugador1._name == pl){
                local=res.jugador1;
                visitante=res.jugador2;
            }
            else{
                local=res.jugador2;
                visitante=res.jugador1;
            }

            central=res.center;
            baraja=res.bar;

            cuantasCartas(baraja);

            $("#cartasUsuarioL").empty();
            $("#cartasUsuarioV").empty();
            $("#tapete").empty();

            $("#cartasUsuarioL").append(addCartas(local._hand, "usuarioL"));
            $("#cartasUsuarioV").append(addCartas(visitante._hand, "usuarioV"));
            $("#tapete").append(addCartas(central, "central"));

            if(local._turn){

                $("#tapete img").on("click",function(event){
                    selecCenter(event);
                });

                $("#cartasUsuarioL img").on("click",function(event){
                    selectCart(event);
                });

            }else{

                setTimeout(function () {
                    dejar(visitante,local);
                },1000);

			}

			if(local._carts) $('#cart1').text(local._carts.length);
            else $('#cart1').text(0);

            if (local._points) $('#esc1').text(local._points);
            else $('#esc1').text(0);

            if (visitante._carts) $('#cart2').text(visitante._carts.length);
            else $('#cart2').text(0);

            if(visitante._points) $('#esc2').text(visitante._points);
            else $('#esc2').text(0);

            if (!local._hand && !visitante._hand){
                console.log('repartiendo cartas');
                reparto(baraja,local,visitante,central);
            }else console.log('continuemos');
        }
	})

}

function reparto(bara,player1,player2,centro) {
    console.log('reparto');

    var parametro={
      bar: bara,
      j1: player1,
      j2: player2,
      cent:centro
    };

    $.ajax({
        url:'/repartir',
        data:parametro,
        method:'post',
        success:function (res) {

            console.log(res);

            if(res.jugador1._name == pl){
                local=res.jugador1;
                visitante=res.jugador2;
            }else{
                local=res.jugador2;
                visitante=res.jugador1;
            }

            central=res.center;
            baraja=res.bar;

            cuantasCartas(baraja);

            // if(!local._hand && !visitante._hand && !baraja){
            //     console.log('Fin de partida');
            //     if(local._last){
            //         setTimeout(function () {
            //             finderonda(baraja,local,visitante,central);
            //         },500);
            //
            //     }else if(visitante._last){
            //         setTimeout(function () {
            //             finderonda(baraja,visitante,local,central);
            //         },500);
            //
            //     }
            // }

            $("#cartasUsuarioL").empty();
            $("#cartasUsuarioV").empty();
            $("#tapete").empty();

            $("#cartasUsuarioL").append(addCartas(local._hand, "usuarioL"));
            $("#cartasUsuarioV").append(addCartas(visitante._hand, "usuarioV"));
            $("#tapete").append(addCartas(central, "central"));

            if(local._turn){

                $("#tapete img").on("click",function(event){
                    selecCenter(event);
                });

                $("#cartasUsuarioL img").on("click",function(event){
                    selectCart(event);
                });

            }else{
                dejar(visitante,local);
            }

            if(local._carts) $('#cart1').text(local._carts.length);
            else $('#cart1').text(0);

            if (local._points) $('#esc1').text(local._points);
            else $('#esc1').text(0);

            if (visitante._carts) $('#cart2').text(visitante._carts.length);
            else $('#cart2').text(0);

            if(visitante._points) $('#esc2').text(visitante._points);
            else $('#esc2').text(0);

        }
    });

}

// function finderonda(bara,player1,player2,centro){
//
//     console.log('final de ronda');
//     var añadir=[];
//
//     // for(var i=0; i<centro.length;i++){
//     //     var carta=centro.shift();
//     //     añadir.push(carta);
//     // }
//
//     var parametro={
//         bar: bara,
//         j1: player1,
//         j2: player2,
//         cent:centro,
//         car:añadir
//     };
//
//     $.ajax({
//         url:'/final',
//         data:parametro,
//         method:'post',
//         success:function (res) {
//
//             contador=0;
//
//             $("#pts1").text(contador);
//
//             console.log('final de partida post');
//             console.log(res);
//
//             if(res.jugador1._name == pl){
//                 local=res.jugador1;
//                 visitante=res.jugador2;
//             }
//             else{
//                 local=res.jugador2;
//                 visitante=res.jugador1;
//             }
//
//             central=res.center;
//             baraja=res.bar;
//
//             cuantasCartas(baraja);
//
//             $("#cartasUsuarioL").empty();
//             $("#cartasUsuarioV").empty();
//             $("#tapete").empty();
//
//             $("#cartasUsuarioL").append(addCartas(local._hand, "usuarioL"));
//             $("#cartasUsuarioV").append(addCartas(visitante._hand, "usuarioV"));
//             $("#tapete").append(addCartas(central, "central"));
//         }
//     });
// }