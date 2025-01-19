import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import React from "react";
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/*NOTIFICATION*/
import OneSignal from "onesignal-cordova-plugin";

import AddCategorieDepense from "./components/CategorieDepense/AddCategorieDepense";
import EditCategorieDepense from "./components/CategorieDepense/EditCategorieDepense";
import AddFournisseur from "./components/Fournisseur/AddFournisseur";
import AddCategorieRevenu from "./components/CategorieRevenu/AddCategorieRevenu";
import AddSousCategorieDepense from "./components/SousCategorieDepense/AddSousCategorieDepense";
import AddSeuil from "./components/Seuil/AddSeuil";
import HomeFournisseur from "./components/Fournisseur/Home";
import EditFournisseur from "./components/Fournisseur/EditFournisseur";
import HomeCategorieRevenu from "./components/CategorieRevenu/Home";
import EditCategorieRevenu from "./components/CategorieRevenu/EditCategorieRevenu";
import Login from "./components/Login";
import HomeSousCategorieDepense from "./components/SousCategorieDepense/Home";
import EditSousCateogrieDepense from "./components/SousCategorieDepense/EditSousCategorieDepense";
import Accueil from "./components/Accueil";
import Register from "./components/Register";
import AddDepense from "./components/Depenses/AddDepense";
import AddCompte from "./components/Comptes/AddCompte";
import AddCarte from "./components/Cartes/AddCarte";
import AddRevenu from "./components/Revenus/AddRevenu";
import HomeCategorieDepense from "./components/CategorieDepense/HomeCategorieDepense";
import Home from "./components/Home";
import Gestion from "./components/Gestion";
import EditCarte from "./components/Cartes/EditCarte";
import EditCompte from "./components/Comptes/EditCompte";
import HomeCarte from "./components/Cartes/HomeCarte";
import HomeCompte from "./components/Comptes/HomeCompte";
import AddTransfert from "./components/Transfert/AddTransfert";
import EditProfil from "./components/EditProfil";
import HomeSeuil from "./components/Seuil/HomeSeuil";
import HomeDepense from "./components/Depenses/HomeDepense";
import AjouterDep from "./components/Depenses/AjouterDep";
import ViewDepense from "./components/Depenses/ViewDepense";
import Prediction from "./Predictions/Prediction";
import HomeRevenu from "./components/Revenus/HomeRevenu";
import AjouterRev from "./components/Revenus/AjouterRev";
import ViewRevenu from "./components/Revenus/ViewRevenu";
import HomeTransfert from "./components/Transfert/HomeTransfert";
import ViewTransfert from "./components/Transfert/ViewTransfert";
import ForgotPassword from "./components/ForgotPassword";
import CodeValidation from "./components/Validation";
import ResetPassword from "./components/ResetPassword";
import HomeNotifications from "./components/Notifications/HomeNotifications";
import ViewNotification from "./components/Notifications/ViewNotification";
// import Register from "./pages/Register";
// import Menu from "./pages/Menu";

setupIonicReact({
  // mode: 'ios',
  // animated: false,
});
const OneSignalInit = () => {
  OneSignal.setApp("b3ccc606-22f2-4aa7-a04f-21b5157de59b");
  OneSignal.setNotificationOpendHandler(function (jsonData) {
    console.log("notificationOpenedCallback : " + JSON.stringify);
  });
};
const App: React.FC = () => {
  // OneSignalInit();
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route path="/code-validation/:id/:token">
            <CodeValidation />
          </Route>
          <Route path="/reset-password/:id/:token">
            <ResetPassword />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <PrivateRoute path="/home" component={Home}>
            <Home />
          </PrivateRoute>
          <PrivateRoute path="/gestions" component={Gestion}>
            <Gestion />
          </PrivateRoute>
          <PrivateRoute
            path="/categories-depenses"
            component={HomeCategorieDepense}
          >
            <HomeCategorieDepense />
          </PrivateRoute>
          <Route path="/login">
            <Login />
          </Route>
          <PrivateRoute
            exact
            path="/create-categorie-revenu"
            component={AddCategorieRevenu}
          >
            <AddCategorieRevenu />
          </PrivateRoute>
          <PrivateRoute exact path="/categories-revenus">
            <HomeCategorieRevenu />
          </PrivateRoute>
          <PrivateRoute exact path="/edit-categories-revenus/:id">
            <EditCategorieRevenu />
          </PrivateRoute>
          <PrivateRoute exact path="/create-fournisseur">
            <AddFournisseur />
          </PrivateRoute>
          <PrivateRoute exact path="/edit-fournisseur/:id">
            <EditFournisseur />
          </PrivateRoute>
          <PrivateRoute exact path="/create-categorie-depense">
            <AddCategorieDepense />
          </PrivateRoute>
          <PrivateRoute exact path="/edit-categorie-depense/:id">
            <EditCategorieDepense />
          </PrivateRoute>
          <PrivateRoute exact path="/create-sous-categorie/:id">
            <AddSousCategorieDepense />
          </PrivateRoute>
          <PrivateRoute exact path="/sous-categories/:id">
            <HomeSousCategorieDepense />
          </PrivateRoute>
          <PrivateRoute
            exact
            path="/edit-sous-categorie-depense/:idCategorie/:id"
          >
            <EditSousCateogrieDepense />
          </PrivateRoute>
          <PrivateRoute exact path="/create-depense">
            <AjouterDep />
          </PrivateRoute>
          <PrivateRoute exact path="/create-transfert">
            <AddTransfert />
          </PrivateRoute>
          <PrivateRoute exact path="/fournisseurs">
            <HomeFournisseur />
          </PrivateRoute>
          <PrivateRoute exact path="/create-seuil">
            <AddSeuil />
          </PrivateRoute>
          <PrivateRoute exact path="/seuils">
            <HomeSeuil />
          </PrivateRoute>
          <PrivateRoute exact path="/create-compte">
            <AddCompte />
          </PrivateRoute>
          <PrivateRoute exact path="/edit-compte/:id">
            <EditCompte />
          </PrivateRoute>
          <PrivateRoute exact path="/comptes">
            <HomeCompte />
          </PrivateRoute>
          <PrivateRoute exact path="/create-carte">
            <AddCarte />
          </PrivateRoute>
          <PrivateRoute exact path="/edit-carte/:id">
            <EditCarte />
          </PrivateRoute>
          <PrivateRoute exact path="/cartes">
            <HomeCarte />
          </PrivateRoute>
          <PrivateRoute exact path="/">
            <Accueil />
          </PrivateRoute>
          <PrivateRoute exact path="/create-revenu">
            <AjouterRev />
          </PrivateRoute>
          <PrivateRoute exact path="/revenus">
            <HomeRevenu />
          </PrivateRoute>
          <PrivateRoute exact path="/edit-profil">
            <EditProfil />
          </PrivateRoute>
          <PrivateRoute exact path="/depenses">
            <HomeDepense />
          </PrivateRoute>
          <PrivateRoute exact path="/view-depense/:id">
            <ViewDepense />
          </PrivateRoute>
          <PrivateRoute exact path="/view-revenu/:id">
            <ViewRevenu />
          </PrivateRoute>
          <PrivateRoute exact path="/transferts">
            <HomeTransfert />
          </PrivateRoute>
          <PrivateRoute exact path="/view-transfert/:id">
            <ViewTransfert />
          </PrivateRoute>
          <PrivateRoute exact path="/prediction">
            <Prediction />
          </PrivateRoute>
          <PrivateRoute exact path="/Notifs">
            <HomeNotifications />
          </PrivateRoute>
          <PrivateRoute exact path="/notification/:id">
            <ViewNotification />
          </PrivateRoute>
          {/* <Route component={Register} path="/register" exact /> */}
          {/* <Route component={Menu} path="/app" /> */}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
