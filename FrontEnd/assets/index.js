//---------- DECLARATION DES VARIABLES A LONGUE PORTEE ----------------------------------------------------------

const baliseLogin = document.getElementById("logout");
const baliseMessageLogout = document.getElementById("messagelogout");
const baliseModeEdition = document.getElementById("modeEdition");
const baliseModifier = document.getElementById("modifier");
const gallery = document.querySelector(".gallery")

//---------- DEFINITIONS DES METHODES ----------------------------------------------------------------------------

export async function recoveryWorks() {    //   GET REQUEST API : Récupère la liste des travaux sur le serveur
    const reponseW = await fetch("http://localhost:5678/api/works")
    const reponseWJson = await reponseW.json()
    return reponseWJson
}; const works = await recoveryWorks()
export async function recoveryCategories() {    //   GET REQUEST API : Récupère la liste des catégories à partir de l'API
    const reponseC = await fetch("http://localhost:5678/api/categories")
    const reponseCJson = await reponseC.json()
    return reponseCJson
}; const categories = await recoveryCategories()
/*      ==> Autre méthode pour récupérer la liste des catégories avec la fonction map et l'objet Set :
        const mapcategories = works.map(work => work.category);
        console.log(mapcategories)
        const monSet = new Set();
        mapcategories.forEach((element) => monSet.add(element));
        console.log(monSet)
*/

function pressLogin() {     // Apporte les modifications du DOM suite à connexion réussie
    baliseLogin.innerText = "";
    baliseMessageLogout.innerText = "Connecté";
    baliseMessageLogout.style = "color: green";
    baliseLogin.addEventListener("click", pressLogout);
    setTimeout(() => {
        baliseMessageLogout.innerText = "";
        baliseLogin.innerText ="Logout";
        baliseMessageLogout.style = "color: red";
        baliseLogin.style = "color:black";
        baliseLogin.href = "#";
        baliseModeEdition.style="display:flex";
        baliseModifier.style="display:inline";
    }, 1000);
}
function pressLogout() {    // Apporte les modifications du DOM et efface le token suite à demande de déconnexion
    window.localStorage.removeItem("token");
    baliseLogin.innerText = "";
    baliseMessageLogout.innerText = "Déconnexion...";
    baliseLogin.removeEventListener("click", pressLogout);
    setTimeout(() => {
        baliseMessageLogout.innerText = "";
        baliseLogin.innerText ="Login";
        baliseLogin.style = "color:black";
        baliseLogin.href = "./login.html";
        baliseModeEdition.style="display:none";
        baliseModifier.style="display:none";
    }, 1000);
    console.log("Disconnect request. --> Token deleted ! = "+window.localStorage.getItem("token")+
        " --> Login link reappears in the navigation menu. And edit mode desactivated.")
}
function loginVerification () {     // Vérifie si l'utilisateur est connecté et appel les fonctions nécessaires
    if (window.localStorage.getItem("token") !== null) {
        const token = JSON.parse(window.localStorage.getItem("token")).token;
        const dateConnected = JSON.parse(window.localStorage.getItem("token")).date;
        const dateNow = Date.parse(new Date())
        const tokenTimelaps = dateNow - dateConnected;   // remplacer dateConnected par (dateConnected-86399995000) pour tester expiration au bout de 5s
        
        if (tokenTimelaps > 86400000000) {
            console.log("token expired since : -"+
                Math.floor((tokenTimelaps)/3600000)%24+"h "+
                Math.floor((tokenTimelaps)/60000)%60+"m "+
                Math.floor((tokenTimelaps)/1000)%60+
                "s --> Token remove of localstorage ! Edit mode hidden.");
            pressLogout()
        } else {
            console.log("A valid token exists since "+
                Math.floor(tokenTimelaps/3600000)%24+"h "+
                Math.floor(tokenTimelaps/60000)%60+"m "
                +Math.floor(tokenTimelaps/1000)%60+
                "s, expires in "+
                Math.floor((86400000000-tokenTimelaps)/3600000)%24+"h "
                +Math.floor((86400000000-tokenTimelaps)/60000)%60+"m "
                +Math.floor((86400000000-tokenTimelaps)/1000)%60+
                "s : token = "+token+
                " --> Logout link appears instead of the login link in the navigation menu. And edit mode displayed.");
            pressLogin()
        }
    } else {
        baliseModeEdition.style="display:none";
        baliseModifier.style="display:none";
        console.log("No token exists ! --> Edit mode hidden.");
    };
};
export async function generateGallery(works) {  // Affiche la liste des tarvaux dans la galerie
    gallery.innerHTML = '' //vide le contenu gallery
    for (let i=0; i < works.length; i++) {
        const baliseFigure = document.createElement("figure");
        const baliseImg = document.createElement("img");
        baliseImg.src = works[i].imageUrl;
        baliseImg.alt = works[i].title;
        const baliseFigcaption = document.createElement("figcaption");
        baliseFigcaption.innerText = works[i].title;
            gallery.appendChild(baliseFigure);
            baliseFigure.appendChild(baliseImg);
            baliseFigure.appendChild(baliseFigcaption);
    }
    console.log("Regenerated gallery")
};
function generateFiltre(categories) {   // Affiche les boutons radio des filtres
    //--> insertion de "Tous" dans la liste des catégories
    categories.unshift({ id: 0, name: "Tous" });
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
    }
console.log("Regenerated category buttons")
};

//---------- GESTION EVENEMENTIELLE -------------------------------------------------------------------------------

// Appel de fonction au chargement de la page
loginVerification()
generateGallery(works); 
generateFiltre(categories);

const baliseInputTous = document.getElementById("Tous").checked = true; // Focus sur le bouton "Tous"

const boutonFiltrer = document.querySelector("#Ul-filtre");
boutonFiltrer.addEventListener("change", function () {  // Regénére la galerie filtrée lors du changement de selection d'un bouton radio 
    let boutonRadio = document.querySelectorAll('input[name="lienfiltre"]')
    for (let i = 0; i < boutonRadio.length; i++) {
        if (boutonRadio[i].checked) {
            var boutonChecked = boutonRadio[i].value;
            break
        }
    }
    if (boutonChecked === "Tous") {
        console.log('Button "Tous" checked. the gallery will be completely regenerated -->');
        generateGallery(works)
    } else {
    const worksFiltres = works.filter(function (work) {
    return work.category.name === boutonChecked});
    console.log('Button "'+boutonChecked+'" checked. The gallery will be filtered and regenerated -->');    
    generateGallery(worksFiltres)
    };
    document.location.href="#portfolio";
});