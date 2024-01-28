//---------- Récupération des travaux depuis le Backend ------------------------------------------

const reponse_w = await fetch("http://localhost:5678/api/works");
const works = await reponse_w.json();
