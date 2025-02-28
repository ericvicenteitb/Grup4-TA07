function procesarCSV() {
    const archivoInput = document.getElementById("csvFile");
    const archivo = archivoInput.files[0];

    if (!archivo) {
        alert("Por favor, selecciona un archivo CSV.");
        return;
    }

    const lector = new FileReader();
    lector.onload = function (evento) {
        const contenido = evento.target.result;
        const filas = contenido.split("\n");

        // Limpiar la tabla antes de agregar nuevos resultados
        const tablaResultados = document.getElementById("tablaResultados").getElementsByTagName('tbody')[0];
        tablaResultados.innerHTML = "";

        let consumoElectricoTotal = 0;
        let consumoAguaTotal = 0;
        let consumoOficinaTotal = 0;
        let consumoLimpiezaTotal = 0;

        // Recorrer las filas del archivo CSV
        filas.forEach(function (fila, index) {
            if (index === 0) return; // Salta la primera fila (encabezados)

            const datos = fila.split(",");
            if (datos.length >= 4) {
                // Extraer el mes y quitar la hora (suponiendo que la fecha y hora está en el formato 'Mes Año HH:MM:SS')
                const mes = datos[0].split(" ")[0]; // Solo obtener el mes (si el campo está en formato fecha + hora)
                
                const consumoElectrico = parseFloat(datos[1]);
                const consumoAgua = parseFloat(datos[2]);
                const consumoOficina = parseFloat(datos[3]);
                const consumoLimpieza = parseFloat(datos[4]);

                // Acumulando los valores para los cálculos anuales
                consumoElectricoTotal += consumoElectrico;
                consumoAguaTotal += consumoAgua;
                consumoOficinaTotal += consumoOficina;
                consumoLimpiezaTotal += consumoLimpieza;

                // Agregar la fila a la tabla
                const nuevaFila = tablaResultados.insertRow();
                nuevaFila.innerHTML = `
                    <td>${consumoElectrico} kWh</td>
                    <td>${consumoAgua} litros</td>
                    <td>${consumoOficina} unidades</td>
                    <td>${consumoLimpieza} unidades</td>
                `;
            }
        });

        // Calcular los totales anuales
        const consumoElectricoAnual = consumoElectricoTotal;
        const consumoAguaAnual = consumoAguaTotal;
        const consumoOficinaAnual = consumoOficinaTotal;
        const consumoLimpiezaAnual = consumoLimpiezaTotal;

        // Mostrar los resultados anuales
        const listaResultados = document.getElementById("listaResultados");
        listaResultados.innerHTML = `
            <li>Consumo eléctrico anual: ${consumoElectricoAnual} kWh</li>
            <li>Consumo de agua anual: ${consumoAguaAnual} litros</li>
            <li>Consumibles de oficina anuales: ${consumoOficinaAnual} unidades</li>
            <li>Productos de limpieza anuales: ${consumoLimpiezaAnual} unidades</li>
        `;
    };

    lector.readAsText(archivo);
}
