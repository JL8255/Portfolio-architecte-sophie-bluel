//---------- DECLARATION DES VARIABLES A LONGUE PORTEE ----------------------------------------------------------

const baliseLogin = document.getElementById("logout");
const baliseMessageLogout = document.getElementById("messagelogout");
const baliseModeEdition = document.getElementById("modeEdition");
const baliseModifier = document.getElementById("modifier");

//--> Récupération des travaux depuis le Backend
const reponse_w = await fetch("http://localhost:5678/api/works");
const works = await reponse_w.json();

//--> Récupération des catégories depuis le Backend
const reponse_c = await fetch("http://localhost:5678/api/categories");
const categories = await reponse_c.json();
/*      ==> Autre méthode pour récupérer la liste des catégories avec la fonction map et l'objet Set :
        const mapcategories = works.map(work => work.category);
        console.log(mapcategories)
        const monSet = new Set();
        mapcategories.forEach((element) => monSet.add(element));
        console.log(monSet)
*/

//---------- DEFINITIONS DES METHODES ----------------------------------------------------------------------------

// Fonction de connexion de l'utilisateur
function pressLogin() {
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
// Fonction de déconnexion de l'utilisateur
function pressLogout() {
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
// Fonction de vérification Si l'utilisateur est connecté : vérification de la validité du token
function loginVerification () {
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
// Fonction permettant de générer la galerie des travaux
export async function generateGallery(works) {

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
    console.log("Regenerated gallery")
};
// Fonction permettant la création des boutons type radio des catégories récupérées
function generateFiltre(categories) {
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
//----------------------------------------------------------------------------------------------------------------

// Vérification de cennexion de l'utilisateur : S'il n'y a un token, on vérifie sa validdité.
loginVerification()
//--> Appel de la methode pour le 1er affichage
generateGallery(works);
//--> Appel de la methode pour l'affichage des boutons
generateFiltre(categories);
// sélection du bouton "Tous" par défaut
const baliseInputTous = document.getElementById("Tous").checked = true;

// Ecouteur d'événement sur les boutons radio et appel de la methode pour filtrer
const boutonFiltrer = document.querySelector("#Ul-filtre");
boutonFiltrer.addEventListener("change", function () {
    let boutonRadio = document.querySelectorAll('input[name="lienfiltre"]')
    for (let i = 0; i < boutonRadio.length; i++) {
        if (boutonRadio[i].checked) {
            var boutonChecked = boutonRadio[i].value;
            break
        }
    }
    const worksFiltres = works.filter(function (work) {
        return work.category.name === boutonChecked;
    });
        if (boutonChecked === "Tous") {
            console.log('Button "Tous" checked. the gallery will be completely regenerated -->');
            generateGallery(works)
        } else {
        console.log('Button "'+boutonChecked+'" checked. The gallery will be filtered and regenerated -->');    
        generateGallery(worksFiltres)
        };
    document.location.href="#portfolio";
});