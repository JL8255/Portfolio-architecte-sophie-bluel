//---------- Récupération des travaux depuis le Backend ------------------------------------------

const reponse_w = await fetch("http://localhost:5678/api/works");
const works = await reponse_w.json();
//---------- Fonction raccourcie de console.log --------------------------------------------------
function c (exemple) {
    console.log(exemple)
}
//---------- Fonction pour (Re)générer la gallery des works --------------------------------------

//Création du contenu HTML
//--> Codage de la methode
function generateGallery(works) {
    document.querySelector(".gallery").innerHTML = '' //vide le contenu gallery
    for (let i=0; i < works.length; i++) {
        const baliseFigure = document.createElement("figure");
        const baliseImg = document.createElement("img");
        baliseImg.src = works[i].imageUrl;
        baliseImg.alt = works[i].title;
        const baliseFigcaption = document.createElement("figcaption");
        baliseFigcaption.innerText = works[i].title;
            let sectionCard = document.querySelector(".gallery");
            sectionCard.appendChild(baliseFigure);
            baliseFigure.appendChild(baliseImg);
            baliseFigure.appendChild(baliseFigcaption);
    }
};
//--> Appel de la methode pour le 1er affichage
generateGallery(works);

//---------- Récupération des catégories depuis le Backend ---------------------------------------

const reponse_c = await fetch("http://localhost:5678/api/categories");
const categories = await reponse_c.json();

/*Autre méthode pour récupérer la liste des catégories avec la fonction map et l'objet Set :
const mapcategories = works.map(work => work.category);
console.log(mapcategories)
const monSet = new Set();
mapcategories.forEach((element) => monSet.add(element));
console.log(monSet)*/
