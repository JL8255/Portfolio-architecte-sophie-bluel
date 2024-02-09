//---------- Gestion de l'affichage de la modale sur clic du lien "modifier" --------------------

// Déclaration des variables
const focussableSelector= "button, a, input, textarea, select" // défini tout ce qui est focussable
let modal = null
let focussables = []
let focusPrecedent = null
const modal1 = document.getElementById('modal1')
const modal2 = document.getElementById('modal2')
const boutonModifier = document.getElementById('modifier')
const boutonModeEdition = document.getElementById('modeEdition')
const messageFormat = document.getElementById('messageFormat')
const messageSize = document.getElementById('messageSize')
const boutonValiderImage = document.getElementById('formModal2')
const inputTitre = document.getElementById('titre')
const inputCategorie = document.getElementById('categorie')

//--> fonction qui permet de déplacer le focus dans la modale en appuyant sur Tab ou Shift+Tab

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

//--> Pour éviter que la modale se ferme quand on click dans le corps de la modale
function stopPropagation(element) {
    element.stopPropagation()   // Evite la propagation du click de fermeture sur le contenu de la modale
}

//--> Définition des fonctions d'ouverture et fermeture des modales

function openModal1() {
    modal1.removeAttribute('aria-hidden')
    modal1.style = "display:flex"
    modal = document.getElementById('modal1')
    focussables = Array.from(modal1.querySelectorAll(focussableSelector))
    focussables[0].focus()                              // permet de mettre le 1er élément en focus par défaut
    console.log('Modal "1" opened successfully')
}

function closeModal1() {
    modal1.getAttribute('aria-hidden', 'true')
    modal1.style = "display:none"
    console.log('Modal "1" closed successfully')
}

function openModal2() {
    inputTitre.value=''
    inputCategorie.value=''
    messageFormat.innerText =''
    messageSize.innerText =''
    closeModal1()
    modal2.removeAttribute('aria-hidden')
    modal2.style = "display:flex"
    modal = document.getElementById('modal2')
    focussables = Array.from(modal2.querySelectorAll(focussableSelector))
    focussables[0].focus()
    console.log('Modal "2" opened successfully')
}

function closeModal2() {
    inputTitre.value=''
    inputCategorie.value=''
    messageFormat.innerText =''
    messageSize.innerText =''
    modal2.getAttribute('aria-hidden', 'true')
    modal2.style = "display:none"
    const image = document.getElementById("image");
    image.src = "#"
    image.style = "display:none"
    console.log('Modal "2" closed successfully')
}

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

//---------- Gestion de l'affichage de la galerie des photos dans la modale -------------------------------------

//--> Récupération des travaux depuis le Backend

const reponse_w = await fetch("http://localhost:5678/api/works");
const modalImg = await reponse_w.json();

//--> Fonction pour (Re)générer la galerie des photos

//Création du contenu HTML dans contentmodal-js
//--> Codage de la methode
function generatePicture(modalImg) {
    document.getElementById("contentmodal-js").innerHTML = '' //vide le contenu gallery
    for (let i=0; i < modalImg.length; i++) {
        const baliseDiv = document.createElement("button");
        baliseDiv.className = "content-modalImg";
        const baliseI = document.createElement("i");
        baliseI.className = "fa-solid fa-trash-can"
        baliseI.id = [i]
        const baliseImg = document.createElement("img");
        baliseImg.id = [i];
        baliseImg.src = modalImg[i].imageUrl;
        baliseImg.alt = modalImg[i].title;
            let sectionCard = document.getElementById("contentmodal-js");
            sectionCard.appendChild(baliseDiv);
            baliseDiv.appendChild(baliseImg);
            baliseDiv.appendChild(baliseI);
    }
    console.log("Regenerated modal pictures gallery")
};
//--> Appel de la methode pour le 1er affichage
generatePicture(modalImg);

//---------- Suppression de travaux dans la modale --------------------------------------------------

//--> On récupére l'Id de l'objet à supprimer

let id = null

const idElementToDelete = function (element) {
    id = document.querySelector(element.target.getAttribute('id'))
}

const buttonTrash = document.querySelectorAll('.fa-trash-can')
//console.log(buttonTrash)
buttonTrash.forEach( element => {
    element.addEventListener('click', (event) => {
        event.preventDefault();
        const idImage = parseInt(event.target.id);
        console.log(idImage);
        console.log('Request to delete image "'+idImage+'"');
        const token = JSON.parse(window.localStorage.getItem("token")).token
        fetch(`http://localhost:5678/api/works/${idImage}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        .then((response) => {
            switch(response.ok) {
                case 200:
                    const sectionGallery = document.getElementById(idImage)
                    sectionGallery.remove()
                    console.log("Deleted Item "+idImage)
                    break
                case 401:
                    console.log("Unauthorized")
                    break
                case 500:
                    console.log("Unexpected Behaviour")
                    break
                default:
                    console.log("Default : Unexpected Behaviour")
            }

        })
    })
})

//---------- Ajout d'une photo dans la modale --------------------------------------------------

//--> Création de la liste des catégories dans l'input select
const reponse_c = await fetch("http://localhost:5678/api/categories");
const categories = await reponse_c.json();

for (let i=0; i < categories.length; i++) {
    const baliseOption = document.createElement("option");
        baliseOption.value = categories[i].name
        baliseOption.innerText = categories[i].name

    let InputCat = document.getElementById("categorie");
    InputCat.appendChild(baliseOption);
}

//--> Définition de la fonction permettant la prévisualisation de la miniature si l'extention est bonne
function previewPicture(file) {
    const image = document.getElementById("image");
    const [picture] = file.files
    image.src = URL.createObjectURL(picture)
    image.alt = "nouvelle image"
    image.removeAttribute('style')
}

//--> Prévisualisation de la miniature avec l'événement "change"
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
        console.error('Incorrect picture format ! File not loaded. Please choose "png" or "jpg".')
        fileImg.value =''
        messageFormat.innerText ='Le format du fichier n\'est pas valide, veuillez choisir un fichier de type .jpg ou .png'
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
            const sectionContent = document.getElementById('contentLabelFileImage')
            sectionContent.style = "display:none"
    }
})

//--> Définition de la function d'envoie de la nouvelle image au serveur pour stockage permanent


// Ecouteur d'événement sur le bouton "valider" pour envoyer la photo
boutonValiderImage.addEventListener("submit", async (event) => {
    // On empêche le comportement par défaut
    event.preventDefault();
    console.log("Envoyer")
})