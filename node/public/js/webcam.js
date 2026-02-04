

//Llamado a funciones
//Cuando cargue windows
window.onload = function(){
    MostrarCamara();

}

//Declaracion de variables
let video;
let canvas;

const ANCHOCAMARA = 720;
const ALTOCAMARA = 720;

const amarillo = {r: 255, g: 255, b: 0}; //color amarillo

const distanciaAceptableColor = 140; // variable de que tan cerca para considerar amarillo

let sensibilidadGiro = 1.3;

//Obtiene la camara
function MostrarCamara(){
    //Obtener dom
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    //Opciones para cargar la camara
    let opciones = {
        audio: false,
        video: {
            width: ANCHOCAMARA,
            height: ALTOCAMARA
        }
    };
    //Funcion para solicitar camara a navegador
    if(navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia(opciones).
            //promensa
            then(function(stream){
                video.srcObject = stream;
                procesarCamara();
            })
            .catch(function(erro){
                console.log('Hubo un error');
            });
    }else{
        console.log('No existe la funcion get user media')
    }
}

//Procesa la camara al canvas
function procesarCamara(){
    //Obtenemos el contexto del canvas en 2d
    let ctx = canvas.getContext('2d');
    //Pasamos del frame del video al canvas
    //           entrada x y witdh height salida hasta hasta
    ctx.drawImage(video, 0, 0, ANCHOCAMARA, ALTOCAMARA, 0, 0, canvas.width, canvas.height);

    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height); //Traeme todos los pixeles desde el x 0, y 0 hasta el total que mida

    let pixeles = imgData.data; //Extraemos los pixeles

    let platanos = [];

    for(let p = 0; p < pixeles.length; p+=4){
        let rojo = pixeles[p];
        let verde = pixeles[p+1];
        let azul = pixeles[p+2];
        let alpha = pixeles[p+3];

        // x = sqrt((x2-x1)2 + (y2-y1)2 + (z2-z1)2)  x2 = rojo rgb para dar al amarillo x1 = rojo actual y2 = verde para dar al amarillo y1 = verde actual z2 = azul para dar al amarillo z1 = azul actual
        let distancia = Math.sqrt(
            //Funcion para saber que tan lejos esta del amarillo
            Math.pow(amarillo.r - rojo, 2) + 
            Math.pow(amarillo.g - verde, 2) + 
            Math.pow(amarillo.b - azul, 2)
        );
        
        if ( distancia < distanciaAceptableColor){
            let y = Math.floor(p / 4 / canvas.width);
            let x = (p/4) % canvas.width;

            //Agrupacion
            if(platanos.length == 0){
                //Es mi primer platano
                let platano = new Platano(x,y);
                platanos.push(platano);
            }else{
                //revisar si esta cerca. Si lo esta, se unen
                //si no crea uno nuevo
                let encontrado = false;
                for(let pl = 0; pl < platanos.length; pl++){
                    if(platanos [pl].estaCerca(x,y)){
                        platanos[pl].agregarPixel(x,y);
                        encontrado = true;
                        break;
                    }
                }
                if(!encontrado){
                    let platano = new Platano(x,y);
                    platanos.push(platano);
                }
            }

        }

    }
    ctx.putImageData(imgData, 0, 0);

    platanos = unirPlatanos(platanos);

    let masGrande = null;
    let mayorTamano = -1;
    for (let pl = 0; pl < platanos.length; pl++){
        let width = platanos[pl].xMaxima - platanos[pl].xMinima;
        let height = platanos[pl].yMaxima - platanos[pl].yMinima;
        let area = width * height;

        if(area > 1500){
            if(masGrande === null || area > mayorTamano){
                masGrande = platanos[pl];
                mayorTamano = area;
            }
            //platanos[pl].dibujar(ctx);
        }
    }
    if(masGrande !== null){
        masGrande.dibujar(ctx);
        document.getElementById('info').innerHTML = masGrande.grados;
        let base = 270;
		let nuevosGrados = base + (masGrande.grados) * sensibilidadGiro;
		document.getElementById("carrito")
		    .style.transform="rotate(" + nuevosGrados + "deg)";
        let ancho = masGrande.xMaxima - masGrande.xMinima;
        enviarMovimiento(masGrande.grados, masGrande.yMinima, ancho);
    }
    setTimeout(procesarCamara, 20);
}

function unirPlatanos(platanos){
    let salir = false;
    for(let p1 = 0; p1 < platanos.length; p1++){
        for(let p2 = 0; p2 < platanos.length; p2++){
            if(p1 == p2) continue;
            let platano1 = platanos[p1];
            let platano2 = platanos[p2];

            //Intersectan?
			let intersectan = platano1.xMinima < platano2.xMaxima &&
				platano1.xMaxima > platano2.xMinima &&
			    platano1.yMinima < platano2.yMaxima && 
			    platano1.yMaxima > platano2.yMinima;
            
            if(intersectan){
                //pasar los pixeles del p2 al p1
                for(let p=0; p < platano2.pixeles.length; p++){
                    platano1.agregarPixel(
                        platano2.pixeles[p].x,
                        platano2.pixeles[p].y
                    );
                }
                platanos.splice(p2, 1);
                salir = true;
                break;
            }
        }
        if(salir){
            break;
        }
    }
    if(salir){
        return unirPlatanos(platanos);
    }else{
        //YA NO HUBO NADA
        return platanos;
    }
    
}

var ultimoUrl = null;
function enviarMovimiento(grados, yMinima, ancho){
    let movimiento = "0"; //0 = no hay mov. -1 mov izq, 1 mov der
	if (grados >= 18) {
		movimiento = "1";//derecha
	} else if (grados <= -18) {
		movimiento = "-1";//izquierda
	}

	let brincar = "0";
	if (yMinima <= 20) {
		brincar = "1";
	}

    let acelerar = '0';
    if(ancho >= 240){
        acelerar = '1';
    }
    let url = 'http://localhost:3000/?movimiento=' + movimiento + '&brincar=' + brincar + '&acelerar=' + acelerar;

    if(ultimoUrl === null || url !== ultimoUrl){
        ultimoUrl = url;
         $.get(url, function(response){
            console.log(response);
        });
    }
}







