function seleccionarModo(modo) {
    document.getElementById('seleccionModo').style.display = 'none';

    if (modo === 'manual') {
        document.getElementById('inicio').style.display = 'block';
    } else if (modo === 'csv') {
        document.getElementById('calculo').style.display = 'block';
    }
}

function volverAlInicio() {
    document.getElementById('seleccionModo').style.display = 'block';
    document.getElementById('inicio').style.display = 'none';
    document.getElementById('calculo').style.display = 'none';
    document.getElementById('graficos').style.display = 'none';
}

function mostrarConsejos() {
    const tipo = prompt("¿Sobre qué quieres consejos? (electricidad, agua, oficina, limpieza)").toLowerCase();
    const consejos = {
        electricidad: ["Usa bombillas LED", "Desconecta dispositivos en stand-by", "Aprovecha la luz natural"],
        agua: ["Repara fugas", "Instala perlizadores", "Dúchate en vez de bañarte"],
        oficina: ["Digitaliza documentos", "Reutiliza papel", "Compra materiales reciclados"],
        limpieza: ["Usa productos ecológicos", "Evita químicos agresivos", "Dosifica correctamente"]
    };
    alert(consejos[tipo]?.join("\n- ") || "Opción no reconocida.");
}

function calcularConsumos() {
    const consumos = {
        electrico: (parseFloat(document.getElementById('consumoElectrico').value) || 0) * 12,
        agua: (parseFloat(document.getElementById('consumoAgua').value) || 0) * 12,
        oficina: (parseFloat(document.getElementById('consumoOficina').value) || 0) * 12,
        limpieza: (parseFloat(document.getElementById('consumoLimpieza').value) || 0) * 12
    };

    actualizarResultados(consumos);
    darConsejosInteligentes(consumos);
}

function procesarCSV() {
    const file = document.getElementById('csvFile').files[0];
    if (!file) {
        alert("Selecciona un archivo CSV");
        return;
    }

    const lector = new FileReader();
    lector.onload = function (e) {
        const filas = e.target.result.trim().split("\n").map(linea => linea.split(","));
        const tbody = document.getElementById("tablaResultados").querySelector("tbody");
        tbody.innerHTML = "";

        let totales = { electrico: 0, agua: 0, oficina: 0, limpieza: 0 };

        filas.slice(1).forEach(fila => {
            const [fecha, electrico, agua, oficina, limpieza] = fila;
            totales.electrico += parseFloat(electrico) || 0;
            totales.agua += parseFloat(agua) || 0;
            totales.oficina += parseFloat(oficina) || 0;
            totales.limpieza += parseFloat(limpieza) || 0;

            const filaHTML = `
                <tr>
                    <td>${fecha}</td>
                    <td>${parseFloat(electrico).toFixed(2)} kWh</td>
                    <td>${parseFloat(agua).toFixed(2)} litros</td>
                    <td>${parseFloat(oficina).toFixed(2)} unidades</td>
                    <td>${parseFloat(limpieza).toFixed(2)} unidades</td>
                </tr>`;
            tbody.insertAdjacentHTML("beforeend", filaHTML);
        });

        actualizarResultados(totales);
        darConsejosInteligentes(totales);
        preguntarSiQuiereGraficos(totales);
    };

    lector.readAsText(file);
}

function actualizarResultados(consumos) {
    const lista = document.getElementById('listaResultados');
    lista.innerHTML = `
        <li>Consumo eléctrico anual: ${consumos.electrico.toFixed(2)} kWh</li>
        <li>Consumo de agua anual: ${consumos.agua.toFixed(2)} litros</li>
        <li>Consumibles de oficina anual: ${consumos.oficina.toFixed(2)} unidades</li>
        <li>Productos de limpieza anual: ${consumos.limpieza.toFixed(2)} unidades</li>
    `;
    actualizarNuevoEstilo(consumos);
}

function actualizarNuevoEstilo(consumos) {
    const lista = document.getElementById('nuevaListaResultados');
    lista.innerHTML = `
        <li>🔌 Consumo eléctrico anual: ${consumos.electrico.toFixed(2)} kWh</li>
        <li>🚰 Consumo de agua anual: ${consumos.agua.toFixed(2)} litros</li>
        <li>📒 Consumibles de oficina anual: ${consumos.oficina.toFixed(2)} unidades</li>
        <li>🧴 Productos de limpieza anual: ${consumos.limpieza.toFixed(2)} unidades</li>
    `;
}

function darConsejosInteligentes(consumos) {
    let mensaje = "Consejos personalizados:\n";

    if (consumos.electrico > 5000) {
        mensaje += "- Instala paneles solares.\n- Revisa el aislamiento térmico.\n";
    } else if (consumos.electrico > 3000) {
        mensaje += "- Sustituye electrodomésticos antiguos por eficientes.\n";
    } else {
        mensaje += "- ¡Excelente eficiencia energética!\n";
    }

    if (consumos.agua > 40000) {
        mensaje += "- Revisa fugas y optimiza el uso de agua.\n";
    }

    alert(mensaje);
}

function preguntarSiQuiereGraficos(consumos) {
    if (confirm("¿Quieres ver gráficos de tus consumos?")) {
        generarGrafico(consumos);
    }
}

function generarGrafico(consumos) {
    const ctx = document.getElementById('graficoConsumos').getContext('2d');
    document.getElementById('graficos').style.display = 'block';

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Electricidad', 'Agua', 'Oficina', 'Limpieza'],
            datasets: [{
                label: 'Consumo Anual',
                data: [
                    consumos.electrico,
                    consumos.agua,
                    consumos.oficina,
                    consumos.limpieza
                ],
                backgroundColor: ['#ff5e62', '#00796b', '#ffca2c', '#6a1b9a']
            }]
        }
    });
}
