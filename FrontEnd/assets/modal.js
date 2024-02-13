//---------- DECLARATION DES VARIABLES A LONGUE PORTEE ET IMPORTATIONS DE FONCTIONS -------------

import {generateGallery} from './index.js'; 
let modal = null
let focussables = []
let focusPrecedent = null
let idImage=""
let nomImage=""
const modal1 = document.getElementById('modal1')
const modal2 = document.getElementById('modal2')
const focussableSelector= "button, a, input, textarea, select" // défini tout ce qui est focussable
const boutonModifier = document.getElementById('modifier')
const boutonModeEdition = document.getElementById('modeEdition')
const messageFormat = document.getElementById('messageFormat')
const messageSize = document.getElementById('messageSize')
const contentLabelFileImage = document.getElementById('contentLabelFileImage')
const image = document.getElementById('image')
const inputURL = document.getElementById('fileImg')
const inputTitre = document.getElementById('titre')
const inputCategorie = document.getElementById('categorie')
const boutonValider = document.getElementById('modal2Button')
const formNewPic = document.getElementById('formModal2')

let reponse_w = await fetch("http://localhost:5678/api/works");
let modalImg = await reponse_w.json();

//---------- DEFINITION DES METHODES --------------------------------------------------------------

// Déplace le focus dans la modale en appuyant sur Tab ou Shift+Tab
const focusModal = function (element) {
    element.preventDefault()
    let index = focussables.findIndex(f => f === modal.querySelector(':focus')) // retourne l'index de l'élément focus
    if(element.shiftKey === true) {
        index--
    } else {
    index++
    }
    if (index >= focussables.length) {
        index = 0
    }
    if (index < 0) {
        index = focussables.length - 1
    } 
    focussables[index].focus()
    console.log("Focus on :",modal.querySelector(':focus'))
}
// Evite que la modale se ferme quand on click dans le corps de la modale
function stopPropagation(element) {
    element.stopPropagation()   // Evite la propagation du click de fermeture sur le contenu de la modale
}
// Définition des fonctions d'ouverture et fermeture des modales.
function openModal1() {
    modal1.removeAttribute('aria-hidden')
    modal1.style = "display:flex"
    modal = document.getElementById('modal1')
    focussables = Array.from(modal1.querySelectorAll(focussableSelector))
    focussables[0].focus()                              // permet de mettre le 1er élément en focus par défaut
    console.log('Modal "1" opened successfully')
}
async function closeModal1() {
    modal1.getAttribute('aria-hidden', 'true')
    modal1.style = "display:none"
    const reponse_w = await fetch("http://localhost:5678/api/works");
    const works = await reponse_w.json();
    generateGallery(works)
    console.log('Modal "1" closed successfully')
}
function openModal2() {
    closeModal1()
    formNewPic.reset()
    loadCategorieButton()
    changeColor()
    messageSize.innerText =''
    modal2.removeAttribute('aria-hidden')
    modal2.style = "display:flex"
    contentLabelFileImage.style = "display:flex"
    modal = document.getElementById('modal2')
    focussables = Array.from(modal2.querySelectorAll(focussableSelector))
    focussables[0].focus()
    console.log('Modal "2" opened successfully')
}
async function closeModal2() {
    formNewPic.reset()
    messageFormat.innerText =''
    messageSize.innerText =''
    modal2.getAttribute('aria-hidden', 'true')
    modal2.style = "display:none"
    const image = document.getElementById("image");
    image.style = "display:none"
    const reponse_w = await fetch("http://localhost:5678/api/works");
    const works = await reponse_w.json();
    generateGallery(works)
    generatePicture(works)
    console.log('Modal "2" closed successfully');
}
// Définition de la fonction permettant de générer la galerie des photos dans contentmodal-js.
async function generatePicture(modalImg) {
    document.getElementById("contentmodal-js").innerHTML = ""; //vide le contenu gallery
    for (let i=0; i < modalImg.length; i++) {
        const baliseDiv = document.createElement("button");
        baliseDiv.className = "content-modalImg";
        const baliseI = document.createElement("i");
        baliseI.className = "fa-solid fa-trash-can"
        //baliseI.id = modalImg[i].id; // Pour mettre le clic sur l'icône trash
        const baliseImg = document.createElement("img");
        baliseImg.id = modalImg[i].id; // Pour mettre le clic sur l'image entière
        baliseImg.src = modalImg[i].imageUrl;
        baliseImg.alt = modalImg[i].title;
            let sectionCard = document.getElementById("contentmodal-js");
            sectionCard.appendChild(baliseDiv);
            baliseDiv.appendChild(baliseImg);
            baliseDiv.appendChild(baliseI);
        document.getElementById(`${modalImg[i].id}`).addEventListener('click', () => {
            idImage = modalImg[i].id;
            nomImage = modalImg[i].title;
            confirmeDeleteImage();
        })
    }
    console.log("Regenerated modal pictures gallery")
    
};
// Message de demande de confirmation de suppression.
function confirmeDeleteImage() {
if (confirm('Voulez-vous vraiment supprimer l\'image id n°'+idImage+' intitulée "'+ nomImage +'" de la galerie ?')) {
    deleteImg(idImage);
}}
// Requête de suppression d'image au serveur.
async function deleteImg(idImage) {
    const token = JSON.parse(window.localStorage.getItem("token")).token
    const response_D = await fetch(`http://localhost:5678/api/works/${idImage}`, {
        method: "DELETE",
        headers: {
            'Content-Type':'application/json',
            "Authorization": `Bearer ${token}`,
        },
    })
    switch(response_D.status) {
        case 204:
            const sectionGallery = document.getElementById(idImage)
            sectionGallery.remove()
            console.log(200," : Deleted Item "+idImage)
            //recoveryImage(modalImg)
            reponse_w = await fetch("http://localhost:5678/api/works");
            modalImg = await reponse_w.json();
            generatePicture(modalImg)
            break
        case 401:
            console.log(401," : Unauthorized")
            break
        case 500:
            console.log(500," : Unexpected Behaviour")
            break
        default:
            console.log("Default : unknow error")
    }
}
// Création de la liste des catégories dans l'input select.
async function loadCategorieButton() {
document.getElementById("categorie").innerHTML='<option value=""></option>' // Vide la liste d'option et en ajoute une vide pour la sélection par défaut.
const reponse_c = await fetch("http://localhost:5678/api/categories");
const categories = await reponse_c.json();
for (let i=0; i < categories.length; i++) {
    const baliseOption = document.createElement("option");
        baliseOption.value = categories[i].name
        baliseOption.innerText = categories[i].name
    const InputCat = document.getElementById("categorie")
    InputCat.appendChild(baliseOption);
}
console.log("Loaded categories : ",categories)
}
// Prévisualisation de la miniature.
function previewPicture(file) {
    const image = document.getElementById("image");
    const [picture] = file.files
    image.src = URL.createObjectURL(picture)
    image.alt = "nouvelle image"
    image.removeAttribute('style')
}
// Change la couleur du bouton "Valider" avec l'événement "change".
function changeColor() {
    formNewPic.addEventListener('change', () => {
    if ((inputURL.files).length !== 0 && inputTitre.value !== "" && inputCategorie.value !== "") {
        boutonValider.style = "background-color: #1D6154"
    } else {
        boutonValider.style = "background-color: gray"
    }
})}
// Requête d'envoi de la nouvelle image au serveur pour stockage permanent.
async function createImg(chargeUtile) {
    const token = JSON.parse(window.localStorage.getItem("token")).token
    const reponse_I = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            accept: "application/json",
            //"Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        },
        body: chargeUtile,

    });
    //const loadResponse = await reponse_I.json();

    //Analyse réponse
    switch(reponse_I.status) {
        case 201:
            console.log(201,': Created')
            break
        case 400:
            console.log(400,': Bad Request')
            break
        case 401:
            console.log(401,': Unauthorized')
            break
        case 500:
            console.log(500,': Unexpected Error')
            break
        default: break
    }
    formNewPic.reset()
    contentLabelFileImage.style = "display:flex" // Re-affiche les éléments par défaut de l'input file image
    image.style = "display:none"
    boutonValider.style = "background-color: gray"
}

//---------- GESTION EVENEMENTIELLE DE LA MODALE ---------------------------------------------------

// 1er Affichage de la galerie d'image
generatePicture(modalImg);
// Ecouteur d'événement sur les balises cliquables des modales 1 et 2 et le bouton modifier de l'index avec appels de fonctions
boutonModeEdition.addEventListener('click', openModal1)
boutonModifier.addEventListener('click', openModal1)
modal1.addEventListener('click', closeModal1)
modal1.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
modal1.querySelector('.js-modal1-close').addEventListener('click', closeModal1)
modal1.querySelector('#boutonAjouterPhoto').addEventListener('click', openModal2)
modal2.addEventListener('click', closeModal2)
modal2.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
modal2.querySelector('.js-modal2-close').addEventListener('click', closeModal2)
modal2.querySelector('.js-previous-modal').addEventListener('click', closeModal2)
modal2.querySelector('.js-previous-modal').addEventListener('click', openModal1)

// Ecouteur d'événement sur la touche clavier préssée
window.addEventListener('keydown', function (event) {
    if (event.key === "Tab"/* && modal !== null*/) {
        console.log("TAB pressed")
        focusModal(event) // Tabulation ou shift+Tab déplace le focus sur l'index suivant ou précèdent
    }
    if (event.key === "Escape" || event.key === "Esc") {
        console.log("Escape pressed")
        switch(modal.id) {
            case "modal1": closeModal1(event); break // Echappe ferme la modale
            case "modal2": closeModal2(event); break // Echappe ferme la modale
            default: console.error("modal.id is not modal1 or modal2"); break
    }
}})
// Contrôle des "input" Affiche les "input" en tappant sur le clavier ²
window.addEventListener('keydown', function (event) {
    if (event.key === "²") {
        class valeursInput {
            constructor(URL, Titre, Catégorie) {
                this.URL = inputURL.files
                this.Titre = inputTitre.value
                this.Catégorie = inputCategorie.value
            }
        }
        const input = new valeursInput(inputURL.files,inputTitre.value,inputCategorie.valeur) 
        console.table(input)
        console.log("Control conditions submit image = ",(inputURL.files).length !== 0 && inputTitre.value !== "" && inputCategorie.value !== "")
    }
})
//  Au changement de l'input image : Contrôle de la taille et du format puis affichage de la miniature avec l'événement.
fileImg.addEventListener('change', () => {
    const fileImg = document.getElementById('fileImg')
    messageFormat.innerText =''
    messageSize.innerText =''
    const [picture] = fileImg.files
    const pictureType = picture.type
    const pictureSize = picture.size
    console.log('File upload request. Check of ... ',
        'Size =',Math.trunc(100*pictureSize/1048576)/100,'mo, ',
        'Format =',pictureType,'-->')
    // Vérification du format png ou (jpg/jpeg)
    if(pictureType !== "image/png" && pictureType !== "image/jpg" && pictureType !== "image/jpeg") {
        console.error('Incorrect picture format ! File not loaded. Please choose "png" or "jpg"/"jpeg".')
        fileImg.value =''
        messageFormat.innerText ='Le format du fichier n\'est pas valide, veuillez choisir un fichier de type .jpg/.jpeg ou .png'
    };
    if(pictureSize > 4194304) { // ! size s'exprime en octets donc : 4 mo = 4 096 ko = 4 194 304 o
        console.error('File size too large ! File not loaded. Choose a file smaller than ',4,'mo.')
        fileImg.value =''    // Vide le contenu de l'input
        messageSize.innerText ='La taille du fichier est trop importante, veuillez choisir un fichier de taille inférieure à 4mo.'
    };
    if(pictureType === "image/png" || pictureType === "image/jpg" || pictureType === "image/jpeg" && pictureSize <= 4194304) {
            console.log('Picture size and format checked.')
            previewPicture(fileImg)
            // Masque les éléments dans la fenêtre label pour que seule la miniature s'affiche
            contentLabelFileImage.style = "display:none"
    }
})
// Ecouteur d'événement sur le bouton "valider" pour envoyer la photo
formNewPic.addEventListener("submit", (event) => {
    // On empêche le comportement par défaut
    event.preventDefault();
    // On récupère les champs URL, titre et catégorie pour constituer la charge utile
    const chargeUtile = new FormData();
        chargeUtile.append("image", inputURL.files[0]);
        chargeUtile.append("title", inputTitre.value);
        chargeUtile.append("category", inputCategorie.selectedIndex);
    console.log('"Send a new work" request sent to the server.')
    console.log(chargeUtile)
    createImg(chargeUtile); // Appel de la fonction serveur
})
