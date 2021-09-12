const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const divResultado = document.querySelector("#resultado");

const objBusqueda = {
    moneda: "",
    criptomoneda: "",
} 

document.addEventListener("DOMContentLoaded", () =>{
    consultarCriptomonedas();

    formulario.addEventListener("submit", submitFormulario);
    criptomonedasSelect.addEventListener("change", leerValor);
    monedaSelect.addEventListener("change", leerValor);
});

async function consultarCriptomonedas(){
    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

    try{
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await resultado.Data;
        selectCriptomonedas(criptomonedas);
    }catch(error){
        console.log(error);
    }
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach( cripto => {
        const { CoinInfo: { FullName, Name } } = cripto;
        
        const option = document.createElement("option");
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option)
    })
}

function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e){
    e.preventDefault();

    //Validar
    const { moneda, criptomoneda } = objBusqueda;
    
    if(moneda === "" || criptomoneda === ""){
        mostrarAlerta("Ambos campos son obligatorios");
        return;
    }

    //Consultar la API con los resultados
    consultarApi();
}

function mostrarAlerta(mensaje){

    const existeError = document.querySelector(".error");
    
    if(!existeError){
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("error");
    
        //Mensaje de error
        divMensaje.textContent = mensaje;
    
        formulario.appendChild(divMensaje);
    
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

async function consultarApi(){
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    try{
        const respuesta = await fetch(url);
        const cotizacion = await respuesta.json();
        mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda])

    }catch(error){
        console.log(error);
    }
}

function mostrarCotizacion(cotizacion){
    limpiarHTML()

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement("p");
    precio.classList.add("precio");
    precio.innerHTML = `El precio es de: <span>${PRICE}</span>`;

    const precioAlto = document.createElement("p");
    precioAlto.innerHTML = `Precio mas alto del dia: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement("p");
    precioBajo.innerHTML = `Precio mas bajo del dia: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement("p");
    ultimasHoras.innerHTML = `Precio ultima 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaAcualizacion = document.createElement("p");
    ultimaAcualizacion.innerHTML = `Ultima actualización: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaAcualizacion);

}

function limpiarHTML(){
    while(divResultado.firstChild){
        divResultado.removeChild(divResultado.firstChild)
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    divResultado.appendChild(spinner);
}