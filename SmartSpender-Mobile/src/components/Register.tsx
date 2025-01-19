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
import "swiper/css";
import Login from "./Login";
import intro from "../../public/image.png";
import "./intro.css";
import login from "../../public/login.png";
import CustomSwiper from "./CustomSwiper";

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

//
const Register: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Inscription</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <div className="ion-text-center ion-padding">
                <img
                  src={register}
                  alt="smartspender Logo"
                  style={{
                    width: "70%",
                    borderRadius: "18%",
                  }}
                />
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        <CustomSwiper />
      </IonContent>
    </IonPage>
  );
};

export default Register;
