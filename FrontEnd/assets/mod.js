//---------- DECLARATION DES VARIABLES A LONGUE PORTEE ET IMPORTATIONS DE FONCTIONS ---------------

import {recoveryWorks, recoveryCategories, generateGallery} from './index.js'; 

let idImage = null
let nomImage = null
let inputURL = document.getElementById('fileImg')
let inputTitre = document.getElementById('titre')
let inputCategorie= document.getElementById('categorie')
const modeEdition = document.getElementById('modeEdition')
const boutonModifier = document.getElementById('modifier')
const modal = document.getElementById('modal')
const baliseForm = document.getElementById('formModal')
const baliseTitre = document.getElementById('titlemodal')
const boutonAjouter = document.getElementById('button-modal')
const baliseContentModal = document.getElementById("contentmodal-js")
const boutonRetour = document.getElementById('js-previous-modal')
const boutonFermer = document.getElementById('js-modal-close')
const divBoutonModal = document.getElementById('content-modalButton')
const boutonValider = document.getElementById('buttonValider')
const messageFormat = document.getElementById('messageFormat')
const messageSize = document.getElementById('messageSize')
const messageSent = document.getElementById('messageSent')
const baliseImage = document.getElementById('contentLabelFileImage')
const image = document.getElementById("image");

//---------- DEFINITION DES METHODES --------------------------------------------------------------

async function generatePicture() {  // GET REQUEST API : Extrait les images de la galerie des travaux pour les afficher dans la modale
    const modalImg = await recoveryWorks()
    baliseContentModal.innerHTML = ""; //vide le contenu gallery
    for (let i=0; i < modalImg.length; i++) {
        const baliseA = document.createElement("a");
        baliseA.href = "#";
        baliseA.id = modalImg[i].id 
        baliseA.className = "content-modalImg";
        const baliseI = document.createElement("i");
        baliseI.className = "fa-solid fa-trash-can"
        const baliseImg = document.createElement("img");
        baliseImg.src = modalImg[i].imageUrl;
        baliseImg.alt = modalImg[i].title;
            baliseContentModal.appendChild(baliseA);
            baliseA.appendChild(baliseImg);
            baliseA.appendChild(baliseI);
        document.getElementById(`${modalImg[i].id}`).addEventListener('click', () => {
            idImage = modalImg[i].id;
            nomImage = modalImg[i].title;
            setTimeout(() => {confirmeDeleteImage()}, 50);
        })
    }
}
async function deleteImg(idImage) {     // DELETE REQUEST API : Supprime l'image cliquée de la galerie des travaux
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
            const works = await recoveryWorks()
            await generateGallery(works)
            await generatePicture()
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
async function createWork() {   // POST REQUEST API : Dépose sur le serveur une nouvelle image
    const chargeUtile = new FormData();
        chargeUtile.append("image", inputURL.files[0]);
        chargeUtile.append("title", inputTitre.value);
        chargeUtile.append("category", inputCategorie.selectedIndex);
    console.log('"Send a new work" request sent to the server.');
    consoleLogInputsAddImage()
    const token = JSON.parse(window.localStorage.getItem("token")).token
    const reponse_I = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: chargeUtile,
    });
    switch(reponse_I.status) {
        case 201:
            console.log(201,': Created')
            messageSent.innerHTML = '<i class="fa-regular fa-thumbs-up"></i>L\'image a était envoyée avec succès. Elle fait maintenant partie de votre galerie.'
            messageSent.style = "color:green"
            setTimeout( async () => {
                const works = await recoveryWorks()
                await generateGallery(works)
                openModal()
            }, 1000)
            break
        case 401:
            console.log(401,': Unauthorized')
            messageSent.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>L\'image n\'a pas pu être déposée ! Vous n\'étes pas autorisé, veuillez vous reconnecter.'
            baliseForm.reset()
            baliseImage.style = "display:flex"
            document.getElementById('image').style = "display:none"
            boutonValider.style = "background-color: #A7A7A7"
            break
        case 400:
        case 500:
        default:
            messageSent.innerText = '<i class="fa-solid fa-triangle-exclamation"></i>L\'image n\'a pas pu être déposée ! Une erreur inattendue s\'est produite.'
            baliseForm.reset()
            baliseImage.style = "display:flex"
            document.getElementById('image').style = "display:none"
            boutonValider.style = "background-color: #A7A7A7"
            break
    }
}
function consoleLogInputsAddImage() {   // Affichage des contrôles des inputs pour la création d'un work
    class valeursInput {
        constructor(URL, Titre, Catégorie) {
            this.imageURL = (inputURL.files);
            this.Titre = inputTitre.value;
            this.Catégorie = inputCategorie.value;
        }
    }
    const input = new valeursInput(inputURL.files, inputTitre.value, inputCategorie.value);
    console.table(input);
    console.log("Control conditions submit image = ", (inputURL.files).length !== 0 && inputTitre.value !== "" && inputCategorie.value !== "");
}
function stopPropagation(element) {     // Evite de fermer la modale quand on click dans le corps de celle-ci
    element.stopPropagation()
}
function confirmeDeleteImage() {    // Demande de confirmation avant l'appel de fonction deleteImg
    if (confirm('Voulez-vous vraiment supprimer l\'image id n°'+idImage+' intitulée "'+ nomImage +'" de la galerie ?')) {
        deleteImg(idImage);
    }
}
async function loadCategorieButton() {      // Charge la liste des catégories depuis l'API pour à insérer dans le select option
    document.getElementById("categorie").innerHTML='<option value=""></option>' // Vide la liste d'option et en ajoute une vide pour la sélection par défaut.
    const categories = await recoveryCategories();
    for (let i=0; i < categories.length; i++) {
        const baliseOption = document.createElement("option");
            baliseOption.value = categories[i].name
            baliseOption.innerText = categories[i].name
        const InputCat = document.getElementById("categorie")
        InputCat.appendChild(baliseOption);
    }
    console.log("Loaded categories : ",categories)
}
function loadMiniature() {   // charge la miniature de l'image si le format et la taille sont bons
    const fileImg = document.getElementById('fileImg')
    messageFormat.innerText =''
    messageSize.innerText =''
    messageSent.innerHTML =''
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
        messageFormat.innerHTML ='<i class="fa-solid fa-triangle-exclamation"></i>Le format du fichier n\'est pas valide, veuillez choisir un fichier de type .jpg/.jpeg ou .png'
    };
    if(pictureSize > 4194304) { // ! size s'exprime en octets donc : 4 mo = 4 096 ko = 4 194 304 o
        console.error('File size too large ! File not loaded. Choose a file smaller than ',4,'mo.')
        fileImg.value =''    // Vide le contenu de l'input
        messageSize.innerHTML ='<i class="fa-solid fa-triangle-exclamation"></i>La taille du fichier est trop importante, veuillez choisir un fichier de taille inférieure à 4mo.'
    };
    if(pictureType === "image/png" || pictureType === "image/jpg" || pictureType === "image/jpeg" && pictureSize <= 4194304) {
            console.log('Picture size and format checked.')
            const file = document.getElementById('fileImg')
            const [picture] = file.files
            image.src = URL.createObjectURL(picture)
            image.alt = "nouvelle image"
            image.removeAttribute('style')
            // Masque les éléments dans la fenêtre label pour que seule la miniature s'affiche
            baliseImage.style = "display:none"
    }
}
async function createFormAddImage() {     // Développe le formulaire d'entrées d'un nouvelle image
    baliseContentModal.style = "display:none";
    baliseImage.style = "display:flex"
    image.style = "display:none"
    baliseForm.style = "display:flex";
    boutonRetour.style = "display:flex";
    baliseForm.reset();
    messageFormat.innerText =''
    messageSize.innerText =''
    messageSent.innerHTML =''
    baliseTitre.innertext = "";
    baliseTitre.innerText = "Ajouter une photo";
    divBoutonModal.style = "display:none";
    boutonValider.style = "background-color: #A7A7A7";
    messageSent.innerHTML = "";
    await loadCategorieButton();
}
function closeModal(element) {     // Ferme la modale
    //element.preventDefault()
    modal.setAttribute("aria-hidden", "true");
    window.setTimeout(function() {
        modal.style = "display:none";
        baliseForm.style = "display:none";
        baliseForm.reset();
    },200)
}
async function openModal() {      // Ouvre la modale
    baliseContentModal.style = "display:flex";
    boutonRetour.style = "display:none";
    baliseForm.style = "display:none";
    baliseTitre.innerText = "Galerie photo";
    await generatePicture();
    modal.setAttribute("aria-hidden", "false");
    modal.style = "display:flex";
    divBoutonModal.style = "display:flex";
}

//---------- GESTION EVENEMENTIELLE DE LA MODALE --------------------------------------------------

modeEdition.addEventListener('click', openModal)
boutonModifier.addEventListener('click', openModal)

modal.addEventListener('click', closeModal)
modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
boutonRetour.addEventListener('click', openModal)
boutonFermer.addEventListener('click', closeModal)
boutonAjouter.addEventListener('click', createFormAddImage)

baliseForm.reset()

baliseForm.addEventListener("submit", (event) => {  // Renvoi à la fonction de POST une nouvelle image en appuyany sur le bouton "Valider"
    event.preventDefault();
    createWork();
})
baliseForm.addEventListener('change', () => {   // Change la couleur du bouton "Valider" si tout les champs sont complété
    if ((inputURL.files).length !== 0 && inputTitre.value !== "" && inputCategorie.value !== "") {
        boutonValider.style = "background-color: #1D6154"
    } else {
        messageSent.innerHTML = ""
        boutonValider.style = "background-color: #A7A7A7"
}})
window.addEventListener('keydown', function (event) {   //  Evénement sur "Esc" et "²" 
    if (event.key === "Escape" || event.key === "Esc") {
        console.log("Escape pressed --> request close modal.")
        closeModal(event) // Echappe ferme la modale
    }
    if (event.key === "²") {
        consoleLogInputsAddImage() // ² affiche le contenu des inputs nouvelle image
    }
})

inputURL.addEventListener('change', loadMiniature) // Appel de la focntion d'affichage de la miniature au changement de l'inputURL