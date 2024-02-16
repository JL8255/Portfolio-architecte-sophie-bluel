//---------- DECLARATION DES VARIABLES A LONGUE PORTEE ----------------------------------------------------

let token = null
let connexion = null
const messageEmail = document.getElementById('messageEmail')
const messagePassword = document.getElementById('messagePassword')
const messageConnexion = document.getElementById('messageConnexion')
const baliseEmail = document.getElementById('email');
const balisePassword = document.getElementById('password');
const boutonFormulaire = document.getElementById('login_form');

// Initialisation
messageConnexion.innerHTML='<a href="#" style="color: black">Mot de passe oublié ?</a>'

//---------- DEFINITION DE LA METHODE ---------------------------------------------------------------------

async function Login() {    // POST REQUEST API : Demande de connexion au serveur et récupération du token si les identifiants sont reconnus
    const emailValue = baliseEmail.value;
    const passwordValue = balisePassword.value;
    const chargeUtile = {
        email: emailValue,
        password: passwordValue
    };
    console.log("Connection request sent to the server.")
    const reponse_l = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(chargeUtile),

    });
    connexion = await reponse_l.json();

    //Reset messages avant l'analyse de réponse et éventuel nouveau message
    messageEmail.innerHTML = null
    messagePassword.innerHTML = null

    switch(reponse_l.status) {
        case 200:
            const dateConnexion = Date.parse(new Date());
            console.log("Connection request at : "+
            Math.floor((dateConnexion+3600000)/3600000)%24+"h "+
            Math.floor((dateConnexion+3600000)/60000)%60+"m "+
            Math.floor((dateConnexion+3600000)/1000)%60+
            "s")
            token = connexion.token;
            const elementConnexion = {"date": dateConnexion, "token": token};
            window.localStorage.setItem("token", JSON.stringify(elementConnexion));
            console.log(reponse_l.status+': "Connected" Connexion réussie.');
            messageConnexion.innerHTML= `
                <p>Connexion réussie.</p>
                <p> Redirection vers la page d'accueil...</p>
                `;
            setTimeout(() => {document.location.href="index.html"}, 1000);
            break
        case 401:
            console.error(reponse_l.status+': "Not Authorized" Incorrect password ! Read the message on the page and change the password.');
            messagePassword.innerHTML= `
                <p>Mot de passe incorrect ! Vous n'avez pas pu être identifié. Veuillez réésayer ou</p>
                <a href="index.html">Retourner sur la page principale ?</a>
                `;
            break
        case 404:
            console.error(reponse_l.status+': "User Not Found" Incorrect user e-mail! Read the message on the page and change the e-mail');
            messageEmail.innerHTML= `
                <p>Nom d'utilisateur introuvable ! Vous n'avez pas pu être identifié. Veuillez réésayer ou</p>
                <a href="index.html">Retourner sur la page principale ?</a>
                `;
            break
        default: break
    }
}

//---------- GESTION DES EVENEMENTS -----------------------------------------------------------------------

baliseEmail.addEventListener('change', (event) => { // Au changement de saisie de l'e-mail, vérifie le format
    const saisieEmail = event.target.value;
        let regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        if (regex.test(saisieEmail.trim()) === false) {
            console.error("Incorrect e-mail format")
            messageEmail.innerText="Format E-mail incorrect !";
        } else {
            messageEmail.innerText="";
            console.log("Correct e-mail format.")
        }
});  // Pas de code pour vérifier format de MDP. Sera à vérifier lors de la création du MDP
boutonFormulaire.addEventListener("submit", async (event) => {  // Appel de la fonction Login quand on presse le bouton "envoyer"
    event.preventDefault();
    Login();
})
