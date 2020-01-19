
var mobile = {   //detectar dispositivo movil para ejecutar solo en PC
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
    return (mobile.Android() || mobile.BlackBerry() || mobile.iOS() || mobile.Opera() || mobile.Windows());
  }
};

var navegadores = { // detectar navegador utilizado
  chrome: function() {
    return navigator.userAgent.match(/Chrome/i);
  },
  firefox: function() {
    return navigator.userAgent.match(/Firefox/i);
  },
  opera: function() {
    return navigator.userAgent.match(/OPR/i);
  },
  edge: function() {
    return navigator.userAgent.match(/Edge/i);
  },
  safari: function() {
    return navigator.userAgent.match(/Safari/i);
  },
  detectar: function(){
    return (navegadores.chrome()||navegadores.firefox()||navegadores.opera()||navegadores.edge()||navegadores.safari());
  }
}

if(mobile.any()) {
var incompatibilidad=document.getElementById('progreso');
incompatibilidad.innerHTML='Sistema incompatible.';
}
else{

var primosArray = [];
/*if (localStorage.getItem('cifrasPrimos') !== null) {       Para obtener el archivo en localStorage del listado de numeros primos
  primosArray = JSON.parse(localStorage.getItem('cifrasPrimos')); el limite max de almacenamiento son 6mb. Al superar, colapsa por lo que se opto que solo se guarda como txt
} else { */
leer();
//}

var horaInicio = new Date(); //establecer horario de inicio de proceso
var hora = horaInicio.getHours();
var minutos = horaInicio.getMinutes();
var segundos = horaInicio.getSeconds();
var horarioInicioEstablecido = hora + ':' + minutos + ':' + segundos;
var horarioInicial = horarioInicioEstablecido.split(':');

function inicio() {
  var j, numero = 0,
    primos, resultado, insertPrimos, numeroPrimo, ultimoPrimo, link;


  j = 0;
  //  if (localStorage.getItem('numero') === null) {

  if (primosArray.length < 0 || primosArray == '') {
    numero = 0;
  } else {

    numero = parseInt(primosArray[primosArray.length - 1]) + 1;
  }
  /*} else {
    numero = localStorage.getItem('numero');
  }*/

  while (j <= 1000) {

    primo(numero);
    localStorage.setItem('numero', numero);
    numero++;
    j++;
  }

  ultimoPrimo = primosArray[primosArray.length - 1];
  //insertPrimos = document.getElementById('primosObtenidos');
  //insertPrimos.innerHTML = primosArray;
  numeroPrimo = document.getElementById('numeroPrimo');
  numeroPrimo.innerHTML = ultimoPrimo;
  link = document.getElementById('link');
  link.addEventListener('click', prepararBackup);

}

function primo(numero) {

  for (var i = 2; i < numero; i++) {

    if (numero % i === 0) {
      return false;
    }

  }
  if (numero > 1) {


    primosArray.push(numero);
    //localStorage.setItem('cifrasPrimos', JSON.stringify(primosArray));
    return numero;

  }
  return false;
}

function prepararBackup() {
  var textFileAsBlob = new Blob([primosArray], {
    type: 'text/plain'
  });

  var fileNameToSaveAs = "primos.txt";
  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  window.URL = window.URL || window.webkitURL;
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  document.body.appendChild(downloadLink); //para compatibilizar con firefox
  downloadLink.click();
  document.body.removeChild(downloadLink); //para compatibilizar con firefox
}

function backup() {
  prepararBackup();
  downloadLink.innerHTML = "link de descarga";
  downloadLink.onclick = destroyClickedElement;
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
}

function destroyClickedElement(event) {

  document.body.removeChild(event.target);
}

function leer() {
  var url = 'primos.txt';
  var solicitud = new XMLHttpRequest();
  solicitud.addEventListener('load', mostrar);
  solicitud.open('GET', url, false);
  solicitud.send(null);
}

function mostrar(evento) {
  var datos = evento.target;
  if (datos.status == 200) {
    primosArray = [];
    primosArray = datos.responseText;
    primosArray = primosArray.split(',');
    if (primosArray.length < 0 || primosArray == '') {
      primosArray = [];
    }
  }
}

function tiempoProcesado() {
  var tiempoProceso = document.getElementById('tiempo');
  tiempoProceso.innerHTML = tiempoTranscurrido();
}

function tiempoTranscurrido() {
  var horaActual = new Date();
  var hora = horaActual.getHours();
  var minutos = horaActual.getMinutes();
  var segundos = horaActual.getSeconds();
  var horarioFinalEstablecido = hora + ':' + minutos + ':' + segundos;
  var horarioFinal = horarioFinalEstablecido.split(':');
  var t1 = new Date();
  var t2 = new Date();
  t1.setHours(horarioInicial[0], horarioInicial[1], horarioInicial[2]);
  t2.setHours(horarioFinal[0], horarioFinal[1], horarioFinal[2]);
  t1.setHours(t2.getHours() - t1.getHours(), t2.getMinutes() - t1.getMinutes(), t2.getSeconds() - t1.getSeconds());

  var proceso = (t1.getHours() < 10 ? '0' : '') + t1.getHours() + ':' + (t1.getMinutes() < 10 ? '0' : '') + t1.getMinutes() + ':' + (t1.getSeconds() < 10 ? '0' : '') + t1.getSeconds();

  return proceso;
}

function precargar() {
  var barra = document.getElementsByTagName('progress')[0];
  var porcentaje = document.getElementById('porcentaje');
  var infoCarga = document.getElementById('infoCarga');
  infoCarga.innerHTML = "Inicializando precarga de datos<span class='animated flash'>...</span>";
  var cargaDatos = ["Analizando navegador<span class='animated flash'>...</span>", "Obteniendo backup<span class='animated flash'>...</span>", "Cargando datos en memoria<span class='animated flash'>...</span>"];
  var x = 0;

  intCarga = window.setInterval(function() {

    var porcentajeValor = barra.value += 25;
    porcentaje.innerHTML = porcentajeValor + '%';
    infoCarga.innerHTML = cargaDatos[x];
    x++;
    if (x > cargaDatos.length) {
      infoCarga.innerHTML = "Inicializando proceso<span class='animated flash'>...</span>";
    }
    if (x > 4) {
      porcentaje.innerHTML = '100%';
    }
  }, 3000);

}
window.setTimeout(function() {
  window.clearInterval(intCarga);
  inicializarProceso();
  var progreso = document.getElementById('progreso');
  var principal = document.getElementById('principal');
  var primosObtenidos = document.getElementById('primosObtenidos');
  var tiempoProceso = document.getElementById('tiempoProceso');
  var detalles = document.getElementById('detalles');
  var ultimoNumeroPrimo = document.getElementById('ultimoNumeroPrimo');
  var link = document.getElementById('link');
  progreso.classList.add('ocultar');
  principal.classList.add('mostrar');
  primosObtenidos.classList.add('mostrar');
  tiempoProceso.classList.add('mostrar');
  detalles.classList.add('mostrar');
  ultimoNumeroPrimo.classList.add('mostrar');
  link.classList.add('mostrar');
}, 20000);

function detectarNavegador(){
var navegador='';
var elemento=document.createElement('strong');
var elemento2= document.getElementsByTagName('h4')[0];
elemento2.appendChild(elemento);
if(navegadores.detectar()=='Chrome'){
  navegador = 'Se está ejecutando en Google Chrome. Navegador funciona correctamente.';
  console.log(navegador);
}else if(navegadores.detectar()=='Firefox'){
  navegador = 'Se está ejecutando en Firefox Mozilla. Este navegador no es óptimo.';
  elemento.innerHTML=navegador;
}else if(navegadores.detectar()=='Safari'){
  navegador = 'Se está ejecutando en Apple Safari. Navegador funciona correctamente.';
  console.log(navegador);
}else if(navegadores.detectar()=='OPR'){
  navegador = 'Se está ejecutando en Opera. Navegador funciona correctamente.';
  console.log(navegador);
}else if(navegadores.detectar()=='Edge'){
  navegador = 'Se está ejecutando en Microsoft Edge. Navegador funciona correctamente.';
  console.log(navegador);
}else{
  navegador = 'Se está ejecutando en un navegador desconocido. Este navegador no es óptimo.';
  elemento.innerHTML=navegador;
}
}

function inicializarProceso() {
  //tiempoProcesado();
  detectarNavegador();
  inicio();
  window.setInterval('tiempoProcesado()', 1000);
  window.setInterval('backup()', 3600000);
  window.setInterval('inicio()', 1000);
}

window.addEventListener('beforeunload', function (e) { //guarda antes de cerrar el navegador
  e.preventDefault();
  e.returnValue = '';
  prepararBackup();
});
}
window.addEventListener('load', precargar);
