// Déclaration des variables
let messageEmail = document.getElementById('messageEmail')
let messagePassword = document.getElementById('messagePassword')
let messageConnexion = document.getElementById('messageConnexion')
let baliseEmail = document.getElementById('email');
let balisePassword = document.getElementById('email');
let boutonFormulaire = document.getElementById('login_form');
let connexion = null

// Initialisation
messageConnexion.innerHTML='<a href="#" style="color: black">Mot de passe oublié ?</a>'

//---------- Vérification des erreurs de saisie -----------------------------------------------------------

//--> Format Email
baliseEmail.addEventListener('click', (event) => {
    messageEmail.innerHTML = null
});
baliseEmail.addEventListener('change', (event) => {
    const saisieEmail = event.target.value;
        let regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        if (regex.test(saisieEmail.trim()) === false) {
            console.log("format e-mail incorrect")
            messageEmail.innerText="Format E-mail incorrect !";
        } else {
            messageEmail.innerText="";
        }
});

//--> Format Mdp
balisePassword.addEventListener('click', (event) => {
    messagePassword.innerHTML = null
});

//---------- Récupération des info saisies dans le forulaire id et mdp lors du click sur envoyer ----------

//--> Définition de la fonction requète serveur et analyse de la réponse
async function Login(chargeUtile) {
    const reponse_l = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(chargeUtile),

    });
    connexion = await reponse_l.json();
    console.log(connexion)

    //Analyse réponse
    switch(reponse_l.status) {
        case 200:
            console.log(reponse_l.status+': "Connected" Connexion réussie.');
            messageConnexion.innerHTML= `
                <p>Connexion réussie.</p>
                <p> Redirection vers la page d'accueil...</p>
                `;
            //--> si identifiant valides : déclarations des variables et stockage dans le localstorage pour conservation de l'id pendant 24H
            const dateConnexion = Date.parse(new Date());
            const tokenConnexion = connexion.token;
            const elementConnexion = {"date": dateConnexion, "token": tokenConnexion};
            window.localStorage.setItem("token", JSON.stringify(elementConnexion));
            //--> message à l'utilisateur et redirection vers la page index.html après 1s d'attente
            setTimeout(() => {document.location.href="index.html"}, 1000);
            break
        case 401:
            console.log(reponse_l.status+': "Not Authorized" Mot de passe incorrect !');
            messagePassword.innerHTML= `
                <p>Mot de passe incorrect ! Vous n'avez pas pu être identifié.</p>
                <p>Veuillez réésayer ou</p>
                <a href="index.html">Retourner sur la page principale ?</a>
                `;
            break
        case 404:
            console.log(reponse_l.status+': "User Not Found" Nom d\'utilisateur introuvable !');
            messageEmail.innerHTML= `
                <p>Nom d'utilisateur introuvable ! Vous n'avez pas pu être identifié.</p>
                <p>Veuillez réésayer ou</p>
                <a href="index.html">Retourner sur la page principale ?</a>
                `;
            break
        default: break
    }
    
}

//--> On met un déclancheur sur le bouton "envoyer"
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
    Login(chargeUtile); // Appel de la fonction serveur
})
