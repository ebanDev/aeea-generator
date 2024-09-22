import  { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";


const simulatorData = await fetch("https://www.service-public.fr/simulateur/calcul/AbonnementEleveEtudiantApprenti");
const simulatorHtml = await simulatorData.text();
const simulatorDom = new DOMParser().parseFromString(simulatorHtml, "text/html");

const departureStations = simulatorDom?.querySelectorAll("select[name='Origine'] option");
const departureStationsArray = Array.from(departureStations).map((station) => station.getAttribute("value"));

const filteredDepartureStationsArray = departureStationsArray.filter((station) => station !== "");

const encoder = new TextEncoder();
const data = encoder.encode(JSON.stringify(filteredDepartureStationsArray));

await Deno.writeFile("public/stations.json", data);