// Déclaration des variables
let messageEmail = document.getElementById('messageEmail')
let messagePassword = document.getElementById('messagePassword')
let messageConnexion = document.getElementById('messageConnexion')
let baliseEmail = document.getElementById('email');
let balisePassword = document.getElementById('password');
let connexion = null
let token = null

// Initialisation
messageConnexion.innerHTML='<a href="#" style="color: black">Mot de passe oublié ?</a>'

//---------- Vérification des erreurs de saisie -----------------------------------------------------------

//--> Format Email
baliseEmail.addEventListener('change', (event) => {
    const saisieEmail = event.target.value;
        let regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        if (regex.test(saisieEmail.trim()) === false) {
            console.error("Incorrect e-mail format")
            messageEmail.innerText="Format E-mail incorrect !";
        } else {
            messageEmail.innerText="";
            console.log("Correct e-mail format.")
        }
});

//--> Format Mdp, Rien à faire ici. Un Regexp sera défini lors de la création de celui-ci.

//---------- Récupération des info saisies dans le forulaire id et mdp lors du click sur envoyer ----------

//--> Définition de la fonction requête serveur et analyse de la réponse
async function Login(chargeUtile) {
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

    //Analyse réponse
    switch(reponse_l.status) {
        case 200:
            //--> si identifiant valides : déclarations des variables et stockage dans le localstorage pour conservation de l'id pendant 24H
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
            //--> message à l'utilisateur et redirection vers la page index.html après 1s d'attente
            setTimeout(() => {document.location.href="index.html"}, 1000);
            break
        case 401:
            console.error(reponse_l.status+': "Not Authorized" Incorrect password ! Read the message on the page and change the password.');
            messagePassword.innerHTML= `
                <p>Mot de passe incorrect ! Vous n'avez pas pu être identifié.</p>
                <p>Veuillez réésayer ou</p>
                <a href="index.html">Retourner sur la page principale ?</a>
                `;
            break
        case 404:
            console.error(reponse_l.status+': "User Not Found" Incorrect user e-mail! Read the message on the page and change the e-mail');
            messageEmail.innerHTML= `
                <p>Nom d'utilisateur introuvable ! Vous n'avez pas pu être identifié.</p>
                <p>Veuillez réésayer ou</p>
                <a href="index.html">Retourner sur la page principale ?</a>
                `;
            break
        default: break
    }
}

//--> On met un déclancheur sur le bouton "envoyer" pour soumettre la requête au serveur
const boutonFormulaire = document.getElementById('login_form');
boutonFormulaire.addEventListener("submit", async (event) => {
    // On empêche le comportement par défaut
    event.preventDefault();
    // On récupère les deux champs email et password pour constituer la charge utile
    const emailValue = baliseEmail.value;
    const passwordValue = balisePassword.value;
    const chargeUtile = {
        email: emailValue,
        password: passwordValue
    };
    console.log("Connection request sent to the server.")
    Login(chargeUtile); // Appel de la fonction serveur
})
