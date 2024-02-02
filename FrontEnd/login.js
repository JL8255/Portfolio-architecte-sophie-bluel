//---------- Fonction raccourcie de console.log -----------------------------------------------------------
function c (exemple) {
    console.log(exemple)
}

//---------- Vérification des erreurs de saisie -----------------------------------------------------------

document.getElementById('formatEmail').innerText=""
const baliseEmail = document.getElementById('email');
baliseEmail.addEventListener('change', (event) => {
    const saisieEmail = event.target.value;
        let regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
        if (regex.test(saisieEmail.trim()) === false) {
            console.log("format e-mail invalide")
            document.getElementById('formatEmail').innerText="Format E-mail incorrecte !";
        } else {
            document.getElementById('formatEmail').innerText="";
        }
});

//---------- Récupération des info saisies dans le forulaire id et mdp lors du click sur envoyer ----------


//--> déclaration des variables à grande portée
const form = document.getElementById('login_form');

form.addEventListener("submit", async (event) => {
    // On empêche le comportement par défaut
    event.preventDefault();

    // On récupère les deux champs email et password pour constituer la charge utile
    const message = document.getElementById("message");
    const emailValue = document.getElementById("email").value;
    const passwordValue = document.getElementById("password").value;
    const chargeUtile = {
        email: emailValue,
        password: passwordValue
    };
    // On lance la requête au serveur
    await fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(chargeUtile)
    })
    .then((connexion) => {
        switch (connexion.status) {
            case 200:
                //--> si identifiant valides : déclarations des variables et stockage dans le localstorage pour conservation de l'id pendant 24H
                const dateConnexion = Date.parse(new Date());
                const tokenConnexion = connexion.token;
                const elementConnexion = {"date": dateConnexion, "token": tokenConnexion};
                window.localStorage.setItem("token", JSON.stringify(elementConnexion));
                //--> message à l'utilisateur et redirection vers la page index.html après 1s d'attente
                console.log(connexion.status+" = "+"Connected");
                message.innerHTML=`<p style="color:green">Connexion réussie !</p>`;
                setTimeout(() => {document.location.href="index.html"}, 1000);
                break
            case 401:
                console.log(connexion.status+" = "+"Not Authorized");
                message.innerHTML=`
                    <p>Mot de passe incorrect</p>
                    <p>Veuillez rééssayer ou</p>
                    <a href="index.html">Retourner sur la page principale ?</a>
                    `;
                break
            case 404:
                console.log(connexion.status+" = "+"User not found");
                message.innerHTML= `
                    <p>E-mail ou Mot de passe incorrect ! Vous n'avez pas pu être identifié.</p>
                    <p>Veuillez réésayer ou</p>
                    <a href="index.html">Retourner sur la page principale ?</a>
                    `;
                break
            default:
                console.log(connexion.status+" = "+"Default Not Authorised");
                message.innerHTML=`
                    <p>Connexion non autorisée</p>
                    <p>Veuillez rééssayer ou</p>
                    <a href="index.html">Retourner sur la page principale ?</a>
                    `;
        }
    })
});
