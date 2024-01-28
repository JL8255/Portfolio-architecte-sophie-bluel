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

//---------- Création des boutons filtre selon les catégories récupérées -------------------------

//Création du contenu HTML
//--> insertion de "Tous" dans la liste des catégories
categories.unshift({ id: 0, name: "Tous" });

//--> Codage de la methode pour les boutons type radio des catégories récupérées
function generateFiltre(categories) {
    //Création balise ul
    const baliseUl = document.createElement("ul");
    baliseUl.id = "Ul-filtre";
    //création des balises li avec une boucle for
    for (let i=0; i < categories.length; i++) {
        const baliseLi = document.createElement("li");
            const baliseInput = document.createElement("input");
                baliseInput.id = categories[i].name;
                baliseInput.type = "radio";
                baliseInput.name = "lienfiltre"
                baliseInput.value = categories[i].name;
            const baliseLabel = document.createElement("label");
                baliseLabel.setAttribute("for",categories[i].name);
                const baliseSpan = document.createElement("span");
                    baliseSpan.innerText = categories[i].name;

        let sectionFiltre = document.querySelector(".filtre");
        sectionFiltre.appendChild(baliseUl)
        baliseUl.appendChild(baliseLi);
        baliseLi.appendChild(baliseInput);
        baliseLi.appendChild(baliseLabel);
        baliseLabel.appendChild(baliseSpan);
}};
//--> Appel de la methode pour le 1er affichage
generateFiltre(categories);
// sélection du bouton "Tous" par défaut
const baliseInputTous = document.getElementById("Tous").checked = true;

//---------- Création de la fonction de filtrage selon le bouton cliqué -------------------------

let boutonChecked = "";
const boutonFiltrer = document.querySelector("#Ul-filtre");
boutonFiltrer.addEventListener("click", function () {
    let boutonRadio = document.querySelectorAll('input[name="lienfiltre"]')
    for (let i = 0; i < boutonRadio.length; i++) {
        if (boutonRadio[i].checked) {
            boutonChecked = boutonRadio[i].value;
            break
        }
    }
    const worksFiltres = works.filter(function (work) {
        return work.category.name === boutonChecked;
    });
if (boutonChecked === "Tous") {
    generateGallery(works)
} else {
generateGallery(worksFiltres)};
});