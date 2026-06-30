// ============ SISTEMA DE GEOLOCALIZACIÓN Y TIEMPO DE ESPERA ============
// Este archivo contiene coordenadas de sucursales, comunas y cálculos de distancia

// Coordenadas de sucursales de la Clínica Bienestar (distribución nacional)
const sucursales = [
    { id: 1,  nombre: 'Consultorio Bienestar - Iquique',       latitud: -20.2136, longitud: -70.1533, region: 'Tarapacá' },
    { id: 2,  nombre: 'Consultorio Bienestar - Antofagasta',   latitud: -23.6345, longitud: -70.4000, region: 'Antofagasta' },
    { id: 3,  nombre: 'Consultorio Bienestar - Copiapó',       latitud: -27.3668, longitud: -70.3320, region: 'Atacama' },
    { id: 4,  nombre: 'Consultorio Bienestar - La Serena',     latitud: -29.9037, longitud: -71.5521, region: 'Coquimbo' },
    { id: 5,  nombre: 'Consultorio Bienestar - Coquimbo',      latitud: -29.9533, longitud: -71.3424, region: 'Coquimbo' },
    { id: 6,  nombre: 'Consultorio Bienestar - Ovalle',        latitud: -30.5969, longitud: -71.2004, region: 'Coquimbo' },
    { id: 7,  nombre: 'Consultorio Bienestar - Valparaíso',    latitud: -33.0458, longitud: -71.6197, region: 'Valparaíso' },
    { id: 8,  nombre: 'Consultorio Bienestar - Viña del Mar',  latitud: -33.0273, longitud: -71.5545, region: 'Valparaíso' },
    { id: 9,  nombre: 'Consultorio Centro - Las Condes',       latitud: -33.4243, longitud: -70.5647, region: 'Metropolitana' },
    { id: 10, nombre: 'Consultorio Sur - Puente Alto',         latitud: -33.6107, longitud: -70.5688, region: 'Metropolitana' },
    { id: 11, nombre: 'Consultorio Oriente - Ñuñoa',           latitud: -33.4409, longitud: -70.5934, region: 'Metropolitana' },
    { id: 12, nombre: 'Consultorio Norte - Renca',             latitud: -33.4061, longitud: -70.6883, region: 'Metropolitana' },
    { id: 13, nombre: 'Consultorio Poniente - Maipú',          latitud: -33.5095, longitud: -70.7597, region: 'Metropolitana' },
    { id: 14, nombre: 'Consultorio Bienestar - Rancagua',      latitud: -34.1708, longitud: -70.7444, region: "O'Higgins" },
    { id: 15, nombre: 'Consultorio Bienestar - Talca',         latitud: -35.4264, longitud: -71.6669, region: 'Maule' },
    { id: 16, nombre: 'Consultorio Bienestar - Chillán',       latitud: -36.6067, longitud: -72.1034, region: 'Ñuble' },
    { id: 17, nombre: 'Consultorio Bienestar - Concepción',    latitud: -36.8201, longitud: -73.0445, region: 'Biobío' },
    { id: 18, nombre: 'Consultorio Bienestar - Temuco',        latitud: -38.7383, longitud: -72.5898, region: 'Araucanía' },
    { id: 19, nombre: 'Consultorio Bienestar - Valdivia',      latitud: -39.8142, longitud: -73.2456, region: 'Los Ríos' },
    { id: 20, nombre: 'Consultorio Bienestar - Puerto Montt',  latitud: -41.3265, longitud: -72.9418, region: 'Los Lagos' },
    { id: 21, nombre: 'Consultorio Bienestar - Coyhaique',     latitud: -45.5752, longitud: -72.0662, region: 'Aysén' },
    { id: 22, nombre: 'Consultorio Bienestar - Punta Arenas',  latitud: -53.1638, longitud: -70.9181, region: 'Magallanes' }
];


// Coordenadas de comunas principales de Chile
const comunasChile = {
    'Arica': { latitud: -18.4782, longitud: -70.2968 },
    'Camarones': { latitud: -19.0223, longitud: -69.5794 },
    'Putre': { latitud: -17.2168, longitud: -69.5545 },
    'General Lagos': { latitud: -17.1193, longitud: -69.7068 },
    'Iquique': { latitud: -20.2136, longitud: -70.1533 },
    'Alto Hospicio': { latitud: -20.3068, longitud: -70.1431 },
    'Pozo Almonte': { latitud: -20.2428, longitud: -69.7595 },
    'Colchane': { latitud: -19.0939, longitud: -68.0234 },
    'Huara': { latitud: -20.1166, longitud: -69.7530 },
    'Camiña': { latitud: -19.2750, longitud: -69.6083 },
    'Antofagasta': { latitud: -23.6345, longitud: -70.4000 },
    'Mejillones': { latitud: -23.1054, longitud: -70.4527 },
    'Sierra Gorda': { latitud: -23.5922, longitud: -70.3758 },
    'Calama': { latitud: -22.4645, longitud: -68.2023 },
    'Ollagüe': { latitud: -22.4667, longitud: -68.2000 },
    'San Pedro de Atacama': { latitud: -22.9117, longitud: -68.2047 },
    'Copiapó': { latitud: -27.3668, longitud: -70.3320 },
    'Canela': { latitud: -27.6500, longitud: -70.9667 },
    'Tierra Amarilla': { latitud: -28.2500, longitud: -70.9333 },
    'Vallenar': { latitud: -28.5711, longitud: -70.7577 },
    'Alto del Carmen': { latitud: -28.8500, longitud: -70.6333 },
    'Freirina': { latitud: -28.8667, longitud: -70.1500 },
    'Huasco': { latitud: -28.4667, longitud: -71.2167 },
    'La Serena': { latitud: -29.9037, longitud: -71.5521 },
    'Coquimbo': { latitud: -29.9533, longitud: -71.3424 },
    'La Higuera': { latitud: -29.7667, longitud: -71.6167 },
    'Paiguano': { latitud: -29.7500, longitud: -71.1167 },
    'Andacollo': { latitud: -30.2500, longitud: -71.3333 },
    'Ovalle': { latitud: -30.5969, longitud: -71.2004 },
    'Combarbalá': { latitud: -30.8000, longitud: -71.0500 },
    'Monte Patria': { latitud: -30.7333, longitud: -70.8667 },
    'Punitaqui': { latitud: -30.9167, longitud: -71.3667 },
    'Illapel': { latitud: -31.8259, longitud: -71.1733 },
    'Salamanca': { latitud: -31.7622, longitud: -71.3808 },
    'Los Vilos': { latitud: -31.9008, longitud: -71.5168 },
    'Valparaíso': { latitud: -33.0458, longitud: -71.6197 },
    'Viña del Mar': { latitud: -33.0273, longitud: -71.5545 },
    'Concón': { latitud: -32.9720, longitud: -71.5443 },
    'Quintero': { latitud: -32.7848, longitud: -71.5538 },
    'Puchuncaví': { latitud: -32.9395, longitud: -71.4442 },
    'Limache': { latitud: -33.0344, longitud: -71.2662 },
    'Olmué': { latitud: -33.0099, longitud: -71.3568 },
    'Quilpué': { latitud: -33.0414, longitud: -71.4409 },
    'Villa Alemana': { latitud: -33.0533, longitud: -71.4294 },
    'La Calera': { latitud: -32.7681, longitud: -71.2253 },
    'Quillota': { latitud: -32.8873, longitud: -71.2595 },
    'La Cruz': { latitud: -32.6163, longitud: -71.3567 },
    'Nogales': { latitud: -32.8667, longitud: -71.5500 },
    'Santiago': { latitud: -33.4489, longitud: -70.6693 },
    'Las Condes': { latitud: -33.4243, longitud: -70.5647 },
    'Lo Barnechea': { latitud: -33.3764, longitud: -70.5105 },
    'Vitacura': { latitud: -33.3930, longitud: -70.6145 },
    'Providencia': { latitud: -33.4396, longitud: -70.6083 },
    'Ñuñoa': { latitud: -33.4409, longitud: -70.5934 },
    'La Florida': { latitud: -33.5095, longitud: -70.5541 },
    'San Bernardo': { latitud: -33.7525, longitud: -70.7115 },
    'Puente Alto': { latitud: -33.6107, longitud: -70.5688 },
    'La Pintana': { latitud: -33.6331, longitud: -70.6268 },
    'Maipú': { latitud: -33.5095, longitud: -70.7597 },
    'Estación Central': { latitud: -33.4948, longitud: -70.6972 },
    'Renca': { latitud: -33.4061, longitud: -70.6883 },
    'Quilicura': { latitud: -33.3620, longitud: -70.6969 },
    'Conchalí': { latitud: -33.4099, longitud: -70.6569 },
    'Independencia': { latitud: -33.3920, longitud: -70.6497 },
    'Recoleta': { latitud: -33.4152, longitud: -70.6247 },
    'San Joaquín': { latitud: -33.5264, longitud: -70.6441 },
    'Macul': { latitud: -33.5041, longitud: -70.5847 },
    'Peñalolén': { latitud: -33.5010, longitud: -70.5503 },
    'La Granja': { latitud: -33.5867, longitud: -70.5900 },
    'Cerro Navia': { latitud: -33.4614, longitud: -70.7400 },
    'El Bosque': { latitud: -33.5580, longitud: -70.6900 },
    'Pudahuel': { latitud: -33.3861, longitud: -70.7681 },
    'Lo Prado': { latitud: -33.4430, longitud: -70.7186 },
    'Lo Espejo': { latitud: -33.5206, longitud: -70.7236 },
    'San Ramón': { latitud: -33.5556, longitud: -70.6292 },
    'San Miguel': { latitud: -33.5317, longitud: -70.6342 },
    'La Cisterna': { latitud: -33.5506, longitud: -70.6856 },
    'Pedro Aguirre Cerda': { latitud: -33.5573, longitud: -70.6608 },
    'Quinta Normal': { latitud: -33.4431, longitud: -70.7013 },
    'Valparaíso': { latitud: -33.0458, longitud: -71.6197 },
    'Curicó': { latitud: -34.9770, longitud: -71.2387 },
    'Talca': { latitud: -35.4264, longitud: -71.6669 },
    'Concepción': { latitud: -36.8201, longitud: -73.0445 },
    'Temuco': { latitud: -38.7383, longitud: -72.5898 },
    'Pucón': { latitud: -39.3089, longitud: -71.9453 },
    'Villarrica': { latitud: -39.2838, longitud: -71.9618 },
    'Valdivia': { latitud: -39.8142, longitud: -73.2456 },
    'Osorno': { latitud: -40.5744, longitud: -72.5342 },
    'Puerto Varas': { latitud: -41.3200, longitud: -72.3744 },
    'Puerto Montt': { latitud: -41.3265, longitud: -72.9418 },
    'Castro': { latitud: -42.4814, longitud: -73.7687 },
    'Punta Arenas': { latitud: -53.1638, longitud: -70.9181 }
};

// Método para calcular distancia entre dos coordenadas usando Haversine
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;
    
    return distancia;
}

// Método para calcular tiempo de espera basado en distancia
function calcularTiempoEspera(distanciaKm) {
    let tiempoMinimo, tiempoMaximo;

    if (distanciaKm < 3) {
        tiempoMinimo = 10; tiempoMaximo = 20;       // Mismo barrio
    } else if (distanciaKm < 8) {
        tiempoMinimo = 15; tiempoMaximo = 30;       // Misma ciudad, cerca
    } else if (distanciaKm < 20) {
        tiempoMinimo = 30; tiempoMaximo = 60;       // Misma ciudad, lejos
    } else if (distanciaKm < 50) {
        tiempoMinimo = 45; tiempoMaximo = 90;       // Ciudad vecina
    } else if (distanciaKm < 100) {
        tiempoMinimo = 60; tiempoMaximo = 120;      // Provincia cercana
    } else if (distanciaKm < 300) {
        tiempoMinimo = 120; tiempoMaximo = 240;     // Otra región
    } else {
        tiempoMinimo = 240; tiempoMaximo = 480;     // Muy lejos
    }

    return {
        minimo:    tiempoMinimo,
        maximo:    tiempoMaximo,
        promedio:  Math.round((tiempoMinimo + tiempoMaximo) / 2),
        distancia: Math.round(distanciaKm * 10) / 10
    };
}

// Método para encontrar la sucursal más cercana a una comuna
function encontrarSucursalMasCercana(nombreComuna) {
    const coordenasComuna = comunasChile[nombreComuna];
    
    if (!coordenasComuna) {
        return null;
    }
    
    let sucursalMasCercana = null;
    let distanciaMinima = Infinity;
    
    sucursales.forEach(sucursal => {
        const distancia = calcularDistancia(
            coordenasComuna.latitud,
            coordenasComuna.longitud,
            sucursal.latitud,
            sucursal.longitud
        );
        
        if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            sucursalMasCercana = sucursal;
        }
    });
    
    if (sucursalMasCercana) {
        const tiempoEspera = calcularTiempoEspera(distanciaMinima);
        return {
            sucursal: sucursalMasCercana,
            distancia: tiempoEspera.distancia,
            tiempoMinimo: tiempoEspera.minimo,
            tiempoMaximo: tiempoEspera.maximo,
            tiempoPromedio: tiempoEspera.promedio
        };
    }
    
    return null;
}

// Función para obtener todas las comunas ordenadas alfabéticamente
function obtenerComunasOrdenadas() {
    return Object.keys(comunasChile).sort();
}

// Función para mostrar información de la sucursal más cercana
function mostrarInfoSucursalMasCercana(nombreComuna) {
    const info = encontrarSucursalMasCercana(nombreComuna);
    
    if (!info) {
        return null;
    }
    
    return {
        sucursal: info.sucursal.nombre,
        distancia: `${info.distancia} km`,
        tiempoEsperaMin: info.tiempoMinimo,
        tiempoEsperaMax: info.tiempoMaximo,
        tiempoEsperaPromedio: info.tiempoPromedio
    };
}
