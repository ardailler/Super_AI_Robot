<p align="center"><target="_blank" rel="noopener noreferrer"><img width="100" src="https://cdn.iconscout.com/icon/free/png-512/robot-97-415007.png" alt="Vue logo"></a></p>

<h2 align="center">Danny le robot explorateur</h2>

## Présentation 
<br>
Danny est un robot explorateur qui à pour but d'explorer et de cartographier des zones inconnues. 
Le robot est donc un arduino relié à plusieurs équipements , le robot communique avec un serveur web afin de prendre des décisions 
sur son déplacement mais envoie également ses observations de l'environnement pour la cartographie

## Robot 
Le robot est une carte arduino relié à plusieurs capteurs/actionneurs :
- **Boe Shield :** Actionneur arduino utilisé pour le déplacement , le Boe est composé de deux moteurs servo qui controllent les roues 
- **Capteur Ultrason :** Capteur arduino pour mesurer la distance entre le robot et le mur
- **Telephone :** Capteur pour la direction du robot ,  le telephone n'est pas directement relié à l'arduino .

<p align="center">
    <img width="320px" src="https://i.ibb.co/mX0NGYY/scheme.png">
</p>

Une fois les composants connectés les fonctionnalités suivant sont disponibles :
  - **Avancer / Tourner / Reculer**
  - **Récupérer la distance entre le robot et le mur** (retourne également l'avancement depuis le dernier appel)
  - **Récuper la direction du robot**
  
## Intelligence Artificelle

Pour les déplacements du robots nous avons utilisés un algorithme de DQN qui retourne une action en fonction d'un état. Plus de précision dans le dossier [AI](https://github.com/ardailler/Super_AI_Robot/tree/master/ai).

<p align="center">
    <img width="260px" src="https://upload.wikimedia.org/wikipedia/commons/9/96/Pytorch_logo.png">
</p>

## Application WEB

L'application web regroupe les informations de l'arduino et de l'IA  pour le controle du robot et la cartographie de l'espace. Plus de précision dans le dossier [Serveur](https://github.com/ardailler/Super_AI_Robot/tree/master/serveur).

<table>
  <tbody>
    <tr>
      <td align="center" valign="middle">
          <img width="150px" src="https://vuejs.org/images/logo.png">
      </td>
      <td align="center" valign="middle">
          <img width="150px" src="http://johnny-five.io/img/j5-logo.svg">
      </td>
      <td align="center" valign="middle">
          <img width="150px" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png">
      </td>
      <td align="center" valign="middle">
          <img width="150px" src="https://i.cloudup.com/zfY6lL7eFa-3000x3000.png">
      </td>
      <td align="center" valign="middle">
          <img width="150px" src="https://www.grafikart.fr/uploads/icons/socket-io.svg">
      </td>
      <td align="center" valign="middle">
          <img width="150px" src="https://android-js.github.io/img/icon.png">
      </td>
    </tr><tr></tr>
  </tbody>
</table>

L'application web est séparé en 3 partie distincts afin de faire fonctionner le robot, le backend, le frontend et l'application android.
Les 3 parties ont été développées en javascript.  

### Frontend  
_chemin : serveur/frontend_  
_installation : npm install_  
_exécution : npm run serve_  
Le frontend qui est un panneau administrateur à été développé à l'aide de _Vue.js_ il permet de s'authentifier afin d'avoir accès à la visualisation des salles scannées par le robot été authentifier avec le même compte.  
  
### Backend  
_chemin : serveur/backend_  
_installation : npm install_  
_exécution : npm start_  
Le backend qui est un serveur web javascript à été développé à l'aide d'_express.js_, il est au centre du fonctionnement de notre application. Le serveur communique en direct avec l'application Android et le panneau d'administration à l'aide de _sockets-io.js_, il récupères les actions du robot grâce à l'IA et gère les déplacements du robot à l'aide de _johnny-five.js_.  
  
**Routes** :  
Routes concernant l'authentification.  
`Post : /auth/register`  
_Paramètres : name, email, password_  
Création d'un nouvelle utilisateur qui pourra à la fois utiliser l'application Android et le panneau d'administration.  
`Post : /auth/login`  
_Paramètres : email, password_  
Authentification à un compte.  
`Get : /auth/user`  
_Authorization : token_  
Récupération des information de l'utilisateur connecté.  
`Post : /auth/logout`  
_Authorization : token_  
Déconnexion du token passé dans le _Header_.  
`Post : /auth/logoutall`  
_Authorization : token_  
Déconnexion de tout les tokens, et donc de tout les appareils.  
  
Routes concernant les salles.  
`Get : /salles/`  
_Authorization : token_  
Retourne toutes les salles de l'utilisateur connecté.  
`Post : /salles/`  
_Authorization : token_  
_Paramètres : name_  
Créé une nouvelle salle.  
`Delete : /salles/:id`  
_Authorization : token_  
Supprime la salle sélectionné.  
`Get : /salles/:id`  
_Authorization : token_  
Retourne les informations de la salle sélectionné.  
`Put : /salles/:id`  
_Authorization : token_  
_Paramètres : name, data_  
Met à jour les informations de la salle sélectionné.  
`Post : /salles/:id`  
_Authorization : token_  
_Paramètres : data_  
Ajoute une action dans la liste des actions du robots (actions que le robot à effectuer dans cette salle).  
  
### Application  
_chemin : serveur/app_  
_installation :_   
 - _npm install_  
 - _npm i -g androidjs-builder_  
  
_exécution : installer le .apk situé dans serveur/app/dist_  
_compilation : androidjs b_  
L'application Android est essentiel au fonctionnement du robot puisqu'elle permet de récupérer l'orientation (entre 0 et 360) du robot grâce à l'accéléromètre d'un smartphone Android, cette orientation est envoyé toutes les 30 millisecondes au serveur. Cette application est développé grâce _androidjs.js_ et _Vue.js_.  
