let lecturas = [];

// ===== GRAFICA =====

const ctx = document.getElementById('graficaHumedad');

const grafica = new Chart(ctx, {

    type: 'line',

    data: {

        labels: [],

        datasets: [

{
    label: 'Humedad (%)',

    data: [],

    borderWidth: 3,

    borderColor: 'green',

    backgroundColor: 'rgba(0,128,0,0.1)',

    fill: false,

    tension: 0.4
},

{
    label: 'Nivel Agua (%)',

    data: [],

    borderWidth: 3,

    borderColor: 'blue',

    backgroundColor: 'rgba(0,0,255,0.1)',

    fill: false,

    tension: 0.4
},

{
    label: 'Caudal (L/min)',

    data: [],

    borderWidth: 3,

    borderColor: 'orange',

    backgroundColor: 'rgba(255,165,0,0.1)',

    fill: false,

    tension: 0.4
}

        ]}})

// ===== GENERAR LECTURA =====

function generarLectura() {

    let humedad = Math.floor(Math.random() * 100);

    let nivel = Math.floor(Math.random() * 100);

    let caudal = (Math.random() * 10).toFixed(2);

    let estado = "";

    if (humedad > 60) {

        estado = "Normal";

    } else if (humedad >= 40) {

        estado = "Advertencia";

    } else {

        estado = "Crítico";

    }

    document.getElementById("humedad").innerText =
        humedad + "%";

    document.getElementById("nivel").innerText =
        nivel + "%";

    document.getElementById("caudal").innerText =
        caudal + " L/min";

    let estadoElemento =
        document.getElementById("estado");

    estadoElemento.innerText = estado;

    if (estado === "Normal") {

        estadoElemento.style.color = "green";

    }
    else if (estado === "Advertencia") {

        estadoElemento.style.color = "orange";

    }
    else {

        estadoElemento.style.color = "red";

    }

    actualizarRecomendacion(humedad);

    let lectura = {

        fecha: new Date().toLocaleString(),

        humedad: humedad,

        nivelAgua: nivel,

        caudal: parseFloat(caudal),

        estado: estado

    };

    guardarLecturaAPI(lectura)
        .then(() => {

            cargarLecturasAPI();

        });

}
// ===== TABLA =====

function cargarTabla(){

    let tbody =
    document.getElementById("tbodyLecturas");

    tbody.innerHTML = "";

    lecturas.forEach((item,index)=>{

        tbody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${new Date(item.fechaRegistro).toLocaleString()}</td>

            <td>${item.humedad}%</td>

            <td>${item.nivelAgua}%</td>

            <td>${item.caudal}</td>

            <td>${item.estado}</td>

        </tr>

        `;

    });

}
// ===== METRICAS ====
function actualizarMetricas(){

    const total = lecturas.length;

    const sumaHumedad =
    lecturas.reduce((acc,x)=> acc + x.humedad,0);

    const sumaNivel =
    lecturas.reduce((acc,x)=> acc + x.nivel,0);

    const sumaCaudal =
    lecturas.reduce((acc,x)=> acc + parseFloat(x.caudal),0);

    document.getElementById("totalLecturas")
    .innerText = total;

    document.getElementById("promedioHumedad")
    .innerText = (sumaHumedad / total).toFixed(1) + "%";

    document.getElementById("promedioNivel")
    .innerText = (sumaNivel / total).toFixed(1) + "%";

    document.getElementById("promedioCaudal")
    .innerText = (sumaCaudal / total).toFixed(1);

}

// ===== GRAFICA =====

function actualizarGrafica(){

    grafica.data.labels =
    lecturas.map(item =>
        new Date(item.fechaRegistro)
        .toLocaleTimeString()
    );

    grafica.data.datasets[0].data =
    lecturas.map(item => item.humedad);

    grafica.data.datasets[1].data =
    lecturas.map(item => item.nivelAgua);

    grafica.data.datasets[2].data =
    lecturas.map(item => parseFloat(item.caudal));

    grafica.update();

}
//==== Recomendación=======
function actualizarRecomendacion(humedad) {

    let recomendacion =
        document.getElementById("recomendacion");

    if (humedad > 60) {

        recomendacion.innerHTML =
            "✅ Condición óptima del cultivo. No se requiere riego.";

        recomendacion.style.color =
            "#166534";

    }
    else if (humedad >= 40) {

        recomendacion.innerHTML =
            "⚠ Mantener monitoreo constante. Revisar estado del suelo.";

        recomendacion.style.color =
            "#92400e";

    }
    else {

        recomendacion.innerHTML =
            "🚨 Humedad crítica. Se recomienda realizar riego inmediato.";

        recomendacion.style.color =
            "#991b1b";

    }

}
// ====Actualizar metricas====

function actualizarMetricas(){

    let total = lecturas.length;

    if(total === 0) return;

    let sumaHumedad = 0;
    let sumaNivel = 0;
    let sumaCaudal = 0;

    lecturas.forEach(item => {

        sumaHumedad += item.humedad;

        sumaNivel += item.nivelAgua;

        sumaCaudal += parseFloat(item.caudal);

    });

    document.getElementById("totalLecturas").innerText = total;

    document.getElementById("promedioHumedad").innerText =
        (sumaHumedad / total).toFixed(1) + "%";

    document.getElementById("promedioNivel").innerText =
        (sumaNivel / total).toFixed(1) + "%";

    document.getElementById("promedioCaudal").innerText =
        (sumaCaudal / total).toFixed(2);

}

//====Guardar lectura api==============

async function guardarLecturaAPI(lectura){

    try{

        const respuesta = await fetch(
            "http://localhost:5214/api/Lecturas",
            {
                method: "POST",

                headers: {
                    "Content-Type":"application/json"
                },

                body: JSON.stringify(lectura)
            }
        );

        const data = await respuesta.json();

        console.log("Lectura guardada:", data);

    }
    catch(error){

        console.error(
            "Error guardando lectura:",
            error
        );

    }

}

//Cargarlecturasapi======

async function cargarLecturasAPI() {

    try {

        console.log("Entró a la API");

        const respuesta = await fetch(
            "http://localhost:5214/api/Lecturas"
        );

        const datos = await respuesta.json();

        console.log(datos);

        lecturas = datos;

        cargarTabla();

        actualizarGrafica();

        actualizarMetricas();

        actualizarContadores();

    }
    catch(error){

        console.error(error);

    }

}async function cargarLecturasAPI() {

    try {

        console.log("Entró a la API");

        const respuesta = await fetch(
            "http://localhost:5214/api/Lecturas"
        );

        const datos = await respuesta.json();

        console.log(datos);

        lecturas = datos;

        cargarTabla();

        actualizarGrafica();

        actualizarMetricas();

        actualizarContadores();

    }
    catch(error){

        console.error(error);

    }

}
function actualizarContadores(){

    let normales = lecturas.filter(
        x => x.estado === "Normal"
    ).length;

    let advertencias = lecturas.filter(
        x => x.estado === "Advertencia"
    ).length;

    let criticos = lecturas.filter(
        x => x.estado === "Crítico"
    ).length;

    document.getElementById(
        "contadorNormal"
    ).innerText = normales;

    document.getElementById(
        "contadorAdvertencia"
    ).innerText = advertencias;

    document.getElementById(
        "contadorCritico"
    ).innerText = criticos;

}
async function limpiarHistorial(){

    let confirmar = confirm(
        "¿Eliminar todas las lecturas?"
    );

    if(!confirmar){

        return;

    }

    await fetch(
        "http://localhost:5214/api/Lecturas",
        {
            method:"DELETE"
        }
    );

    cargarLecturasAPI();

}