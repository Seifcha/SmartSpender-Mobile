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
import React from "react";
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
import AddRevenu from "./AddRevenu";

//
const Register: React.FC = () => {
  let userEmail;

  // Vérifier si le userEmail est présent dans le localStorage
  if (localStorage.getItem("userEmail")) {
    userEmail = localStorage.getItem("userEmail");
  }
  return (
    <IonPage>
      <IonContent>
        <AddRevenu />
      </IonContent>
    </IonPage>
  );
};

export default Register;
