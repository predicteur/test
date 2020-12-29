// JavaScript source code

function gridColor(val, min, max) {
    return colors[Math.max(Math.min(Math.floor((val - min) / (max - min) * ncolor), ncolor - 1), 0)];
}
function gridStyle(feature) {
    let min = 0.0, max = 1.0;
    return { fillColor: gridColor(feature.properties.value, min, max),
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
        '<b>' + 'valeur : ' + feature.properties.value + '</b>' +
        '</div>' );
}
function gridLegend() {
    let div = L.DomUtil.create("div", "legend");
    div.innerHTML =
        '<b>Concentration polluant</b><br>NO2<br>' + '<small>ppm</small><br>'
    for (let i = ncolor - 1; i > 0; i--) {
        let i1 = i + 1;
        div.innerHTML +=
            '<i style="background-color: ' + colors[i] + '"></i>' +
            i + ' - ' + i1 + '<br>';
    }
    return div;
}
// affichage des cartes
//colorbrewer2.org/?type=sequential&scheme=OrRd&n=9
let ncolor = 9;
let colors = ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'];
let valJson = {};
let map = L.map("map").setView([43.5, 5], 9);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    { attribution: '&copy; <a href="http://' + 'www.openstreetmap.org/copyright">OpenStreetMap</a>' }
).addTo(map);
let layers = L.layerGroup().addTo(map);
L.marker([43.5, 5]).addTo(layers);
fetch("json/geojson_petit.json")
    .then(function (response) { return response.json(); })
    .then(function (data) {
        valJson = data;
        L.geoJSON(data, { style: gridStyle, onEachFeature: gridPopup }).addTo(layers);
    })
let legend = L.control({ position: "topright" });
legend.onAdd = gridLegend;
legend.addTo(map);
