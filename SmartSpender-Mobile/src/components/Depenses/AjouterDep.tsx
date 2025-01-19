import {
  IonButton,
  IonContent,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonFabButton,
  IonIcon,
  IonFab,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";

import {
  arrowForwardOutline,
  add,
  warning,
  document,
  globe,
  colorPalette,
  chevronUpCircle,
} from "ionicons/icons";
import { Link } from "react-router-dom";
import register from "../../public/Register.png";
import AddDepense from "./AddDepense";
import { useHistory } from "react-router-dom";

//
const Register: React.FC = () => {
  const history = useHistory();
  let userEmail;

  const checkUserLoggedIn = () => {
    userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
      history.push("/login");
    }
  };

  useEffect(() => {
    checkUserLoggedIn(); // Vérification initiale lors du montage du composant

    const interval = setInterval(() => {
      checkUserLoggedIn(); // Vérification périodique
    }, 30); // Rafraîchir toutes les 0.3 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
  }, [history]); // Utilisation de useEffect avec history comme dépendance pour écouter les changements de route

  return (
    <IonPage>
      <IonContent>
        <AddDepense />
      </IonContent>
    </IonPage>
  );
};

export default Register;
