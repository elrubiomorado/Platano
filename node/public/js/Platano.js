class Platano{

    pixeles = [];

    xMinima = 0;
    xMaxima = 0;
    yMinima = 0;
    yMaxima = 0;

    grados = 0;
    constructor(x, y){
        this.agregarPixel(x, y);
        this.xMinima = x;
        this.xMaxima = x;
        this.yMinima = y;
        this.yMaxima = y;
    }

    agregarPixel(x, y){
        this.pixeles.push({x:x, y:y});
        if(x  < this.xMinima){
            this.xMinima = x;
        }
        if(x > this.xMaxima){
            this.xMaxima = x;
        }
        //modo ternario
        this.yMinima = y < this.yMinima ? y : this.yMinima;
        this.yMaxima = y > this.yMaxima ? y : this.yMaxima;

    }
    estaCerca(x, y){
        //Revisar si esta dentro del rectangulo
		if (x >= this.xMinima && x <= this.xMaxima &&
			y >= this.yMinima && y <= this.yMaxima) {

			return true;
		}

		//Tomar la distancia en X y en Y hacia los ejes mas cercanos.
		//Sumamos esas distancias, y comparamos si es menor a algun numero (e.g. 50)
		var distX = 0;
		var distY = 0;

		if (x < this.xMinima) {
			distX = this.xMinima - x;
		}
		if (x > this.xMaxima) {
			distX = x - this.xMaxima;
		}
		if (y < this.yMinima) {
			distY = this.yMinima - y;
		}
		if (y > this.yMaxima) {
			distY = y - this.yMaxima;
		}

		var distancia = distX + distY;

		return distancia < 50;
    }

    dibujar(ctx){
        ctx.strokeStyle='#f00';
        ctx.lineWidth = 4;
        ctx.beginPath();
        let x = this.xMinima;
        let y = this.yMinima;
        let width = this.xMaxima - this.xMinima;
        let height = this.yMaxima - this.yMinima;
        ctx.rect(x, y, width, height);
        ctx.stroke();

        //dibujo en el centro
        let centroX = x + (width/2);
        let centroY = y + (height/2);
        ctx.beginPath();
        ctx.fillStyle='#00f';
        ctx.arc(centroX, centroY, 5, 0, 2*Math.PI);
        ctx.fill();
        
        let sumaYIzq = 0;
        let cuentaYIzq = 0;
        let sumaYDer = 0;
        let cuentaDer = 0;
        for(let p = 0; p < this.pixeles.length; p++){
            if(this.pixeles[p].x <= (x + (width*.1))){
                sumaYIzq += this.pixeles[p].y;
                cuentaYIzq++;
            }else if(this.pixeles[p].x >= (x + (width*.9))){
                sumaYDer += this.pixeles[p].y;
                cuentaDer++;
            }
        }

        //dibujo el punto de la orilla izquierda
        ctx.beginPath();
        ctx.fillStyle='#00f';
        ctx.arc(this.xMinima, (sumaYIzq/cuentaYIzq), 5, 0, 2*Math.PI);
        ctx.fill();

        //dibujo el punto de la orilla derecga
        ctx.beginPath();
        ctx.fillStyle='#00f';
        ctx.arc(this.xMaxima, (sumaYDer/cuentaDer), 5, 0, 2*Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(183, 0, 255, 1)';
        ctx.moveTo(this.xMinima, (sumaYIzq/cuentaYIzq));
        ctx.lineTo(this.xMaxima, (sumaYDer/cuentaDer));
        ctx.stroke();

        let diffY = (sumaYDer/cuentaDer) - (sumaYIzq/cuentaYIzq);
        let diffX = this.xMaxima - this.xMinima;

        let radianes = Math.atan(diffY / diffX);

        let grados  = radianes * (180/Math.PI);

        this.grados = Math.round(grados);

        
    }
}