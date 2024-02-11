
//---------- Gestion de l'affichage de la gallery ----------------------------------------------------------------

//--> Récupération des travaux depuis le Backend

const reponse_w = await fetch("http://localhost:5678/api/works");
const works = await reponse_w.json();

//--> Fonction pour (Re)générer la gallery des works

// Définition de la fonction permettant de générer la galerie des travaux

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
    console.log("Regenerated gallery")
};
//--> Appel de la methode pour le 1er affichage
generateGallery(works);


//---------- Gestion de l'affichage des boutons de filtre et fonctionnement ---------------------------------------

//--> Récupération des catégories depuis le Backend

const reponse_c = await fetch("http://localhost:5678/api/categories");
const categories = await reponse_c.json();

        /* ==> Autre méthode pour récupérer la liste des catégories avec la fonction map et l'objet Set :
        const mapcategories = works.map(work => work.category);
        console.log(mapcategories)
        const monSet = new Set();
        mapcategories.forEach((element) => monSet.add(element));
        console.log(monSet)*/

//--> Création des boutons filtre selon les catégories récupérées

//--> insertion de "Tous" dans la liste des catégories
categories.unshift({ id: 0, name: "Tous" });

//Définition de la fonction permettant la création des boutons type radio des catégories récupérées
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
    }
console.log("Regenerated category buttons")
};
//--> Appel de la methode pour l'affichage des boutons
generateFiltre(categories);

//---------- Filtrage des travaux par catégorie sur pression d'un bouton

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

//---------- Vérifiction du status de connexion de l'utilisateur pour la gestion des éléments à afficher --------------------

//--> Récupération des balises à afficher ou pas
const baliseModeEdition = document.getElementById("modeEdition");
const baliseModifier = document.getElementById("modifier");

//--> Si l'utilisateur n'est pas connecté
if (window.localStorage.getItem("token") === null) {
    baliseModeEdition.style="display:none";
    baliseModifier.style="display:none";
    console.log("No token exists ! --> Edit mode hidden.");
};

//--> Si l'utilisateur est connecté : vérification de la validité du token
if (window.localStorage.getItem("token") !== null) {
    const token = JSON.parse(window.localStorage.getItem("token")).token;
    const dateConnected = JSON.parse(window.localStorage.getItem("token")).date;
    const dateNow = Date.parse(new Date())
    const tokenTimelaps = dateNow - dateConnected;
    
    if (tokenTimelaps > 86400000000) {
        window.localStorage.removeItem("token");
        baliseModeEdition.style="display:none";
        baliseModifier.style="display:none";
        console.log("token expired since : -"+
            Math.floor((tokenTimelaps)/3600000)%24+"h "+
            Math.floor((tokenTimelaps)/60000)%60+"m "+
            Math.floor((tokenTimelaps)/1000)%60+
            "s --> Token remove of localstorage ! Edit mode hidden.");
    } else {
        const baliseLogout = document.getElementById("logout");
        baliseLogout.innerText ="Logout";
        baliseLogout.href = "#";
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
        baliseModeEdition.style="display:flex";
        baliseModifier.style="display:inline";
    }
};

//L'utilisateur décide de se déconnecter : Login s'affiche lorsque l'utilisateur sur logout est le token est effacé
const baliseLogin = document.getElementById("logout")
baliseLogin.addEventListener("click", function () {
    if (window.localStorage.getItem("token") !== null) {
        window.localStorage.removeItem("token");
        baliseLogin.innerText = "";
        document.getElementById("messagelogout").innerText = "Déconnexion";
        setTimeout(() => {
            document.getElementById("messagelogout").innerText = "";
            baliseLogin.style = "color:black";
            baliseLogin.href = "./login.html";
            baliseLogin.innerText ="Login";
            baliseModeEdition.style="display:none";
            baliseModifier.style="display:none";
        }, 1000);
        console.log("Disconnect request. --> Token deleted ! = "+window.localStorage.getItem("token")+
            " --> Login link reappears in the navigation menu. And edit mode desactivated.")
    }
});
