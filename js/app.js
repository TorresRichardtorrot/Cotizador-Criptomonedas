const monedas = document.querySelector('#moneda')
const resultado = document.querySelector('#resultado')
const formulario = document.querySelector('#formulario')
const selectCripto = document.querySelector('#criptomonedas')

const objBusqueda = {
    moneda:'',
    criptomoneda:'',
}

const obtenerCripto = criptomoneda => new Promise(resolve=>{
    resolve(criptomoneda)
})

document.addEventListener('DOMContentLoaded',()=>{
    consultarCripto();

    monedas.addEventListener('change', obtenerValores)
    selectCripto.addEventListener('change',obtenerValores)
    formulario.addEventListener('submit', cotizar)
})

function consultarCripto(){
    //url del top list del Market cap API
    const url='https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    fetch(url)
        .then(respuesta => respuesta.json()) //consulta fue exitosa
        .then(resultado => obtenerCripto(resultado.Data)) //"Data" esta en la documentacion
        .then(criptomonedas => selectCriptomoneda(criptomonedas))
        .catch(error=>console.log(error))

}

function selectCriptomoneda(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {Name, FullName} = cripto.CoinInfo; //en la documentacion
        const option = document.createElement('option')
        option.textContent = FullName;
        option.value = Name;
        //insertar en html NECESITO
        selectCripto.appendChild(option)
    });
}
 
function obtenerValores(e){
    objBusqueda[e.target.name] = e.target.value
}

function cotizar(e){
    e.preventDefault();
    const {moneda, criptomoneda} = objBusqueda

    if(moneda === '' || criptomoneda === ''){
        mostrarError('Los campos mostrados son obligatorios')
        return
    }

    consultarAPI();
}

function mostrarError(mensaje){
    const divMensaje = document.createElement('div')
    divMensaje.classList.add('error')

    //mostrar mensaje de error

    divMensaje.textContent = mensaje

    //insertar en el html

    formulario.appendChild(divMensaje)

    setTimeout(() => {
        divMensaje.remove()
    } ,3000);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarResultado (cotizacion){
    limpiarHTML();

    const {CHANGEPCT24HOUR, PRICE, HIGHDAY, LOWDAY, LASTUPDATE} = cotizacion;

    const ul24Hora = document.createElement('p');
    ul24Hora.innerHTML = `<p> Variacion ultimas 24 hora: ${CHANGEPCT24HOUR} </p>`

    const precio = document.createElement('p');
    precio.innerHTML = `<p> El precio es: ${PRICE} </p>`

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p> El precio mas alto del dia es: ${HIGHDAY} </p>`

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p> El precio mas bajo del dia es: ${LOWDAY} </p>`

    const ulAct = document.createElement('p');
    ulAct.innerHTML = `<p> La ultima actualizacion fue: ${LASTUPDATE} </p>`

    resultado.appendChild(ul24Hora);
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ulAct);

    formulario.appendChild(resultado);
}

function mostrarSpinner (){
    limpiarHTML()

    const spinner = document.createElement('div')
    spinner.classList.add('spinner')

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>   
    `
    resultado.appendChild(spinner)
}

function consultarAPI(){
    const {moneda, criptomoneda} = objBusqueda;
    
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizar =>{
            mostrarResultado(cotizar.DISPLAY[criptomoneda][moneda])
        })
}