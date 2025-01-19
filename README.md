# SmartSpender-Mobile
L'application mobile SmartSpender aide les utilisateurs tunisiens à gérer leurs finances personnelles avec une interface intuitive et des outils d'IA. Suivi des dépenses, définition de budgets et prédictions basées sur le machine learning optimisent la gestion financière et permettent d'atteindre leurs objectifs efficacement.

Développée par : **Seifeddine Chargui** et **Rami Zarraa**


# SmartSpender

SmartSpender est une application mobile conçue pour aider les utilisateurs tunisiens à mieux gérer leurs finances personnelles en prédisant leurs dépenses futures à l'aide de l'apprentissage automatique (ML). L'application collecte et analyse les données de dépenses des utilisateurs afin de fournir des prédictions précises sur leurs dépenses à venir, permettant ainsi une gestion proactive de leurs finances.

## Fonctionnalités

- **Suivi des Dépenses :** Suivi des dépenses des utilisateurs avec des catégories personnalisables.
- **Prédiction des Dépenses :** Utilisation de modèles d'apprentissage automatique "Prophet" pour prédire les dépenses futures en fonction de temps et des habitudes de consommation des utilisateurs.
- **Analyse des Habitudes Financières :** Visualisation des tendances de dépenses pour aider à mieux comprendre où l'argent est dépensé.
- **Recommandations Financières :** Conseils pour économiser de l'argent basés sur des publicité des fournisseurs.


### Modèle Utilisé
. **Prophet :** Un modèle de prévision des séries temporelles développé par Facebook, particulièrement adapté pour les séries temporelles avec des tendances saisonnières.

## Architecture de l'Application

- **Frontend :** Ionic + React.js pour le développement mobile, offrant une interface utilisateur fluide et interactive.
- **Backend :** Node.js + Express.js avec une base de données MySQL pour gérer les utilisateurs et les historiques de dépenses.
- **Modèle de Machine Learning :** Python(Flask).

## Installation

Pour installer et tester l'application localement sur android:

1. Clonez ce dépôt.
2. Installez les dépendances Ionic et React.
3. Exécutez:
   ```bash
   ionic cap run android --livereload --external --public --verbose
## Partie Web (administration)

Le dashboard Web se trouve dans le repository 'SmartSpender-Web' 
lien : https://github.com/Seifcha/SmartSpender-Web
