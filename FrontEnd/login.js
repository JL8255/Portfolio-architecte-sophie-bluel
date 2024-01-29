//---------- Fonction raccourcie de console.log -----------------------------------------------------------
function c (exemple) {
    console.log(exemple)
}

//---------- Vérification des erreurs de saisie -----------------------------------------------------------

document.getElementById('format').innerText=""
const baliseEmail = document.getElementById('email');
baliseEmail.addEventListener('change', (event) => {
    const saisieEmail = event.target.value;
        let regex = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]+");
        if (regex.test(saisieEmail) === false) {
            c("format invalide")
            document.getElementById('format').innerText="Format E-mail incorrecte !";
        } else {
            document.getElementById('format').innerText="";
        }
});

//---------- Récupération des info saisies dans le forulaire id et mdp lors du click sur envoyer ----------


//--> déclaration des variables à grande portée
const form = document.getElementById('login_form');
let tokenUser = ""

form.addEventListener("submit", async (event) => {
    // On empêche le comportement par défaut
    event.preventDefault();

    // On récupère les deux champs et on affiche leur valeur
    const message = document.getElementById("message");
    const email = new String(document.getElementById("email").value);
    const password = new String(document.getElementById("password").value);
    const connexion = await fetch(`http://localhost:5678/api/${email}/${password}`);
    c(connexion)
    switch (connexion.status) {
        case 200:
            console.log("Connected")
            message.innerHTML=`<p style="color:green">Connexion réussie !</p>`
            setTimeout(() => {document.location.href="index.html"}, 1000);
            tokenUser = connexion.token;
            break
        case 401:
            console.log("Not Authorized")
            message.innerHTML=`
                <p>Connexion non autorisée</p>
                <a href="index.html">Retourner sur la page principale ?</a>
                `
            break
        case 404:
            console.log("User not found")
            //document.getElementById("connexion").style="display:inline"
            message.innerHTML= `
                <p>E-mail ou Mot de passe incorrect ! Vous n'avez pas pu être identifié.</p>
                <p>Veuillez réésayer ou</p>
                <a href="index.html">Retourner sur la page principale ?</a>
                `
            tokenUser="nul"
            break
        default:
            console.log("Default Not Authorised")
            message.innerHTML=`
                <p>Connexion non autorisée</p>
                <a href="index.html">Retourner sur la page principale ?</a>
                `
    }
});