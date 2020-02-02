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
    </tr><tr></tr>
  </tbody>
</table>
