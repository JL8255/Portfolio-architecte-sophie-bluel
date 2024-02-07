//---------- Gestion de l'affichage de la modale sur clic du lien "modifier" --------------------

//--> fonction qui permet de déplacer le focus dans la modale en appuyant sur Tab ou Shift+Tab
const focussableSelector= "button, a, input, textarea, i" // défini tout ce qui est focussable
let focussables = []
let focusPrecedent = null
let modal1 = null
let modal2 = null

const focusModal = function (element) {
    element.preventDefault()
    let index = focussables.findIndex(f => f === modal1.querySelector(':focus')) // retourne l'index de l'élément focus
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
}

//--> Pour éviter que la modale se ferme quand on click dessus
function stopPropagation(element) {
    element.stopPropagation() //pour éviter la propagation du click de fermeture sur le contenu de la modale
}
function openModal1() {
    modal1 = document.getElementById('modal1')
    modal1.removeAttribute('aria-hidden')
    modal1.style = "display:flex"
    modal1.addEventListener('click', closeModal1)
    modal1.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    modal1.querySelector('.js-modal1-close').addEventListener('click', closeModal1)
    modal1.querySelector('#boutonAjouterPhoto').addEventListener('click', openModal2)
    focussables = Array.from(modal1.querySelectorAll(focussableSelector))
    focusPrecedent = document.querySelector('focus') // Récupère l'élément focus avant l'ouverture de la modale
    focussables[0].focus() // permet de mettre le 1er élément en focus par défaut
}

function closeModal1() {
    modal1 = document.getElementById('modal1')
    modal1.getAttribute('aria-hidden', 'true')
    modal1.style = "display:none"
    modal1.removeEventListener('click', closeModal1)
    modal1.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal1.querySelector('.js-modal1-close').removeEventListener('click', closeModal1)
}

function openModal2() {
    closeModal1()
    modal2 = document.getElementById('modal2')
    modal2.removeAttribute('aria-hidden')
    modal2.style = "display:flex"
    modal2.addEventListener('click', closeModal2)
    modal2.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    modal2.querySelector('.js-modal2-close').addEventListener('click', closeModal2)
    modal2.querySelector('.js-previous-modal').addEventListener('click', openModal1)
    modal2.querySelector('.js-previous-modal').addEventListener('click', closeModal2)
    focussables = Array.from(modal2.querySelectorAll(focussableSelector))
    focusPrecedent = document.querySelector('focus') // Récupère l'élément focus avant l'ouverture de la modale
    focussables[0].focus() // permet de mettre le 1er élément en focus par défaut
}

function closeModal2() {
    modal2 = document.getElementById('modal2')
    modal2.getAttribute('aria-hidden', 'true')
    modal2.style = "display:none"
    const image = document.getElementById("image");
    image.src = "#"
    image.style = "display:none"
    modal2.removeEventListener('click', closeModal2)
    modal2.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal2.querySelector('.js-modal2-close').removeEventListener('click', closeModal2)
    modal2.querySelector('.js-previous-modal').removeEventListener('click', closeModal2)
    modal2.querySelector('.js-previous-modal').removeEventListener('click', openModal1)
    
}

const clickModal1 = document.getElementById('modifier')
clickModal1.addEventListener('click', openModal1)

//---------- Gestion de l'affichage de la galerie des photos dans la modale -------------------------------------

//--> Récupération des travaux depuis le Backend

const reponse_w = await fetch("http://localhost:5678/api/works");
const modalImg = await reponse_w.json();

//--> Fonction pour (Re)générer la galerie des photos

//Création du contenu HTML dans contentmodal
//--> Codage de la methode
function generatePicture(modalImg) {
    document.getElementById("contentmodal").innerHTML = '' //vide le contenu gallery
    for (let i=0; i < modalImg.length; i++) {
        const baliseDiv = document.createElement("div");
        baliseDiv.className = "content-modalImg";
        const baliseI = document.createElement("i");
        baliseI.className = "fa-solid fa-trash-can"
        baliseI.id = [i]
        const baliseImg = document.createElement("img");
        baliseImg.id = [i];
        baliseImg.src = modalImg[i].imageUrl;
        baliseImg.alt = modalImg[i].title;
            let sectionCard = document.getElementById("contentmodal");
            sectionCard.appendChild(baliseDiv);
            baliseDiv.appendChild(baliseImg);
            baliseDiv.appendChild(baliseI);
    }
    console.log("the modal gallery has been (re)generated")
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
            methode: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        .then((response) => {
            switch(response.ok) {
                case 200:
                    const sectionGallery = document.getElementById(idImage)
                    sectionGallery.remove()
                    console.log("Item "+idImage+"has been deleted")
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

    /*var ext = getExtension(picture).toLowerCase();
    if(ext == "png" || ext == "jpg") {
        console.log("format image ok")
    } else {console.log("format image incorrect")}

    image.src = URL.createObjectURL(picture)
    image.alt = "nouvelle image"
    image.removeAttribute('style')*/
}

//--> Prévisualisation de la miniature avec l'événement "change"
const fileImg = document.getElementById('fileImg')
fileImg.addEventListener('change', () => {
previewPicture(fileImg)
const sectionContent = document.getElementById('contentLabelFileImage')
sectionContent.style = "display:none"
})
