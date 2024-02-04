//---------- Gestion de l'affichage de la modale sur clic du lien "modifier" --------------------

let modal = null
const focussableSelector= "button, a, input, textarea" // défini tout ce qui est focussable
let focussables = []
let focusPrecedent = null

//--> fonction qui "ouvre" la modale
const openModal = function (element) {
    element.preventDefault()
    modal = document.querySelector(element.target.getAttribute('href'))
    focussables = Array.from(modal.querySelectorAll(focussableSelector))
    focusPrecedent = document.querySelector('focus') // Récupère l'élément focus avant l'ouverture de la modale
    focussables[0].focus() // permet de mettre le 1er élément en focus par défaut
    modal.style.display = null
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

//--> fonction qui ferme la modale
const closeModal = function (element) {
    if (modal === null) return
    if (focusPrecedent !== null) focusPrecedent.focus() // Redonne le focus au dernier focus avant ouverture de la modale (par défaut le nav perd le focus)
    element.preventDefault()
    window.setTimeout(function() {
        modal.style.display = "none";
        modal = null;
    }, 500) //permet de retarder la fermeture pour avoir une animation
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
}

//--> Pour éviter que la modale se ferme quand on click dessus
const stopPropagation = function(element) {
    element.stopPropagation() //pour éviter la propagation du click de fermeture sur le contenu de la modale
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

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

}

//--> Ecouteur d'événement sur la touche clavier préssée
window.addEventListener('keydown', function (element) {
    if (element.key === "Escape" || element.key === "Esc") {
        closeModal(element) // Echappe ferme la modale
    }
    if (element.key === "Tab" && modal !== null) {
        focusModal(element) // Tabulation ou shift+Tab déplace le focus sur l'index suivant ou précèdent
    }
})



//---------- Gestion de l'affichage de la galerie des photos -------------------------------------

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
        const baliseImg = document.createElement("img");
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
