// JavaScript source code

function gridColor(val) {
    return colors[Math.max(Math.min(Math.floor((val - min) / (max - min) * ncolor), ncolor - 1), 0)];
}
function gridStyle(feature) {
    return { fillColor: gridColor(feature.properties.value),
             weight: 0.05,
             opacity: 0.5,
             color: "black",
             fillOpacity: 0.5 };
}
function gridPopup(feature, layer) {
    layer.bindPopup(
        '<div class="popup">' +
        'top : ' + valJson.properties.top + '<br>' +
        'coordonnees : ' + feature.properties.gridcoord + '<br>' +
        '<b>' + 'valeur : ' + (feature.properties.value).toFixed(2) + '</b>' +
        '</div>' );
}
function gridLegend() {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML =
        '<b>Concentration polluant</b><br>' + valJson.properties.polluant + '<br>' + '<small>ppm</small><br>'
    for (let i = ncolor - 1; i >= 0; i--) {
        let seuilh = ((i + 1) / ncolor * (max - min) + min).toFixed(1);
        let seuilb = (i / ncolor * (max - min) + min).toFixed(1);
        div.innerHTML +=
            '<i style="background-color: ' + colors[i] + '"></i>' +
         seuilb + ' - ' + seuilh + '<br>';
    }
    return div;
}
//couleur : colorbrewer2.org/?type=sequential&scheme=OrRd&n=9
let ncolor = 9;
let colors = ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'];

// carte
let map = L.map("map").setView([43.5, 5], 9);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: '&copy; <a href="http://' + 'www.openstreetmap.org/copyright">OpenStreetMap</a>' }
).addTo(map);

// marqueurs et grille
let max = 1.0;
let min = 0.0;
let layers = L.layerGroup().addTo(map);
let legend = L.control({ position: "topright" });
let valJson = {};

L.marker([43.5, 5]).addTo(layers);
fetch("json/geojson_moyen.json")
    .then(function (response) { return response.json(); })
    .then(function (data) {
        valJson = data;
        max = valJson.properties.valmax;
        min = valJson.properties.valmin;
        L.geoJSON(data, { style: gridStyle, onEachFeature: gridPopup }).addTo(layers);
        legend.onAdd = gridLegend;
        legend.addTo(map);
    });

