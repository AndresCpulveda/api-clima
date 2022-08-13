//Variables
  //Selectores
    const contenedor = document.querySelector('.container');
    const resultado = document.querySelector('#resultado');
    const formulario = document.querySelector('#formulario');

window.addEventListener('load',() => {
  formulario.addEventListener('submit', buscarClima)
})

//Funciones
  function buscarClima(e) {
    e.preventDefault()
    //Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;
    if(ciudad == '' || pais == '') {
      mostrarError('Todos los campos son obligatorios')
      return;
    }
    //Consultar API geocoding
    const idApi = '87a91c91bf5ea0f6581d9a0670329374'
    consultarGeoCoding(ciudad, pais, idApi)
  }

  function mostrarError(mensaje) {
    const activeAlert = document.querySelector('.active-alert');
    if(!activeAlert) {
      const alert = document.createElement('div');
      alert.classList.add('active-alert', 'border-2', 'w-2/3', 'mx-auto', 'my-5', 'p-3', 'rounded-md', 'border-red-700', 'font-bold', 'text-red-700', 'bg-red-200', 'uppercase', 'text-center')
      alert.textContent = mensaje;
      contenedor.append(alert);
      setTimeout(() => {
        if(activeAlert){
          activeAlert.remove();
        }
      }, 3000);
    }
  }

  function consultarGeoCoding(ciudad, pais, apiKey) {
    mostrarSpinner();
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${pais}&appid=${apiKey}`
    fetch(url)
      .then( respuesta => respuesta.json())
      .then( datos => {
        console.log(datos);
        if(datos.length > 0) {
          const lat = datos[0].lat;
          const lon = datos[0].lon;
          consultarClima(lat, lon, apiKey)
        }else{
          mostrarError('La ciudad no fue encontrada')
        }
      });
  }

  function consultarClima(lat, lon, apiKey) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    fetch(url)
    .then( respuesta => respuesta.json())
    .then( datos => {
      if(datos.cod == 200) {
        mostrarClima(datos)
      }else{
        mostrarError('La ciudad no fue encontrada')
      }
    });
  }

  function mostrarClima(datos) {
    limpiarHTML()
    const { main: {temp, temp_max, temp_min}} = datos;
    const div = document.createElement('div');
    div.classList.add('text-center', 'text-white');
    const locacion = document.createElement('p')
    locacion.classList.add('font-bold', 'mt-3', 'text-2xl')
    locacion.textContent = `Clima en ${datos.name}:`
    const tempActual = document.createElement('h3')
    tempActual.classList.add('text-5xl', 'font-bold', 'm-none')
    tempActual.textContent = `${temp} ºC`
    const maxTemp = document.createElement('p')
    maxTemp.classList.add('text-lg', 'mb-1')
    maxTemp.textContent = `Max: ${temp_max} ºC`
    const minTemp = document.createElement('p')
    minTemp.classList.add('text-lg', 'mb-1')
    minTemp.textContent = `Max: ${temp_min} ºC`

    div.append(locacion, tempActual, maxTemp, minTemp)
    resultado.append(div);
  }

  function limpiarHTML() {
    while(resultado.firstChild) {
      resultado.removeChild(resultado.firstChild)
    }
  }

  function mostrarSpinner() {
    limpiarHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('sk-fading-circle');

    spinner.innerHTML = `
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
    `
    resultado.append(spinner)
  }