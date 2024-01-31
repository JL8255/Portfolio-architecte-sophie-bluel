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
            console.log("format invalide")
            document.getElementById('format').innerText="Format E-mail incorrecte !";
        } else {
            document.getElementById('format').innerText="";
        }
});

//---------- Récupération des info saisies dans le forulaire id et mdp lors du click sur envoyer ----------


//--> déclaration des variables à grande portée
const form = document.getElementById('login_form');

form.addEventListener("submit", async (event) => {
    // On empêche le comportement par défaut
    event.preventDefault();

    // On récupère les deux champs email et password pour constituer la charge utile
    //const message = document.getElementById("message");
    const emailValue = document.getElementById("email");
    const passwordValue = document.getElementById("password");
    const chargeUtile = {
        email: emailValue,
        password: passwordValue
    };
    // On lance la requête au serveur
    fetch("http://localhost:5678/api/users/password", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(chargeUtile)
    })
    .then(tokenReponse => {
        window.localStorage.setItem("token",tokenReponse.token);
    })
    .catch(connexion => {
            switch (connexion) {
                case 200:
                    console.log("Connected")
                    message.innerHTML=`<p style="color:green">Connexion réussie !</p>`
                    setTimeout(() => {/*document.location.href="index.html"*/}, 1000);
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
                    break
                default:
                    console.log("Default Not Authorised")
                    message.innerHTML=`
                        <p>Connexion non autorisée</p>
                        <a href="index.html">Retourner sur la page principale ?</a>
                        `
                }
        });
});

//Vérification du token dans le localstorage

console.log(window.localStorage.getItem("token"));
