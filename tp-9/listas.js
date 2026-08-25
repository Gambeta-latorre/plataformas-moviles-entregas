var listaNumerosEjemplo = [2,4,6,-1,5,-4,0];


/**
 * 01 - invertirLista
 */
function invertirLista(listaDeNumeros) {
    return listaDeNumeros.reverse();
}
console.log("invertirLista([2,3,4]): ", invertirLista([2,3,4]));


/**
 * 02 - sumarLista
 */
function sumarLista(listaDeNumeros) {
    var suma = 0;

    for (var i = 0; i < listaDeNumeros.length; i++) {
        suma = suma + listaDeNumeros[i];
    }

    return suma;
}
console.log("sumarLista([2,3,4]): ", sumarLista([2,3,4]));


/**
 * 03 - contarElementosLista
 */
function contarElementosLista(listaDeNumeros) {
    return listaDeNumeros.length;
}
console.log("contarElementosLista([2,3,4]): ", contarElementosLista([2,3,4]));


/**
 * 04 - calcularPromedio
 */
function calcularPromedio(listaDeNumeros) {
    var suma = sumarLista(listaDeNumeros);
    var cantidad = contarElementosLista(listaDeNumeros);

    return suma / cantidad;
}
console.log("calcularPromedio([2,3,4]): ", calcularPromedio([2,3,4]));
console.log("calcularPromedio(listaNumerosEjemplo): ", calcularPromedio(listaNumerosEjemplo));


/**
 * 05 - triplicarLista
 */
function triplicarLista(listaDeNumeros) {
    var listaNueva = [];

    for (var i = 0; i < listaDeNumeros.length; i++) {
        listaNueva.push(listaDeNumeros[i] * 3);
    }

    return listaNueva;
}
console.log("triplicarLista([1, 2, 3]): ", triplicarLista([1, 2, 3]));


/**
 * 06 - crearListaDeNumeros
 */
function crearListaDeNumeros(inicio, fin) {
    var lista = [];

    for (var i = inicio; i <= fin; i++) {
        lista.push(i);
    }

    return lista;
}
console.log("crearListaDeNumeros(2,5): ", crearListaDeNumeros(2,5));


/**
 * 07 - ordenarDeMayorAMenor
 */
function ordenarDeMayorAMenor(listaDeNumeros) {
    return listaDeNumeros.sort(function(a, b) {
        return b - a;
    });
}
console.log("ordenarDeMayorAMenor([2,3,4]): ", ordenarDeMayorAMenor([2,3,4]));
console.log("ordenarDeMayorAMenor(listaNumerosEjemplo): ", ordenarDeMayorAMenor(listaNumerosEjemplo));


/**
 * 08 - encontrarNumeroMayor
 */
function encontrarNumeroMayor(listaDeNumeros) {
    var mayor = listaDeNumeros[0];

    for (var i = 1; i < listaDeNumeros.length; i++) {
        if (listaDeNumeros[i] > mayor) {
            mayor = listaDeNumeros[i];
        }
    }

    return mayor;
}
console.log("encontrarNumeroMayor([2,3,4]): ", encontrarNumeroMayor([2,3,4]));
console.log("encontrarNumeroMayor(listaNumerosEjemplo): ", encontrarNumeroMayor(listaNumerosEjemplo));


/**
 * 09 - ordenarPalabrasPorLongitud
 */
function ordenarPalabrasPorLongitud(listaDePalabras) {
    return listaDePalabras.sort(function(a, b) {
        return a.length - b.length;
    });
}
console.log("ordenarPalabrasPorLongitud(['abc', 'a', 'ab']): ", ordenarPalabrasPorLongitud(['abc', 'a', 'ab']));


/**
 * 10 - encontrarPalabraMasCorta
 */
function encontrarPalabraMasCorta(listaDePalabras) {
    var palabraMasCorta = listaDePalabras[0];

    for (var i = 1; i < listaDePalabras.length; i++) {
        if (listaDePalabras[i].length < palabraMasCorta.length) {
            palabraMasCorta = listaDePalabras[i];
        }
    }

    return palabraMasCorta;
}
console.log("encontrarPalabraMasCorta(['abc', 'a', 'ab']): ", encontrarPalabraMasCorta(['abc', 'a', 'ab']));


/**
 * 11 - filtrarSoloPositivos
 */
function filtrarSoloPositivos(listaDeNumeros) {
    var listaPositivos = [];

    for (var i = 0; i < listaDeNumeros.length; i++) {
        if (listaDeNumeros[i] > 0) {
            listaPositivos.push(listaDeNumeros[i]);
        }
    }

    return listaPositivos;
}
console.log("filtrarSoloPositivos([1,-1,0]): ", filtrarSoloPositivos([1,-1,0]));
console.log("filtrarSoloPositivos(listaNumerosEjemplo): ", filtrarSoloPositivos(listaNumerosEjemplo));


/**
 * 12 - contarAprobados
 */
function contarAprobados(listaDeNotas) {
    var aprobados = 0;

    for (var i = 0; i < listaDeNotas.length; i++) {
        if (listaDeNotas[i] >= 6) {
            aprobados++;
        }
    }

    return aprobados;
}
console.log("contarAprobados([10, 4, 6, 7, 1, 9]): ", contarAprobados([10, 4, 6, 7, 1, 9]));


/**
 * 13 - filtrarSoloTruthy
 */
function filtrarSoloTruthy(listaDeValores) {
    var listaTruthy = [];

    for (var i = 0; i < listaDeValores.length; i++) {
        if (listaDeValores[i]) {
            listaTruthy.push(listaDeValores[i]);
        }
    }

    return listaTruthy;
}
console.log("filtrarSoloTruthy(): ", filtrarSoloTruthy(["Hola", "", null, 1, 0, -1, undefined, [], {}]));


/**
 * 14 - enumerarLista
 */
function enumerarLista(listaDePalabras) {
    if (listaDePalabras.length === 0) {
        return "";
    }

    if (listaDePalabras.length === 1) {
        return listaDePalabras[0] + ".";
    }

    var resultado = "";

    for (var i = 0; i < listaDePalabras.length - 1; i++) {
        resultado = resultado + listaDePalabras[i] + ", ";
    }

    resultado = resultado + "y " + listaDePalabras[listaDePalabras.length - 1] + ".";

    return resultado;
}
console.log("enumerarLista(): ", enumerarLista(["Han", "Leia", "Luke", "Yoda"]));
