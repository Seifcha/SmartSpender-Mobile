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
} from "@ionic/react";
import { Link, useHistory } from "react-router-dom";
import React from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import Login from "./Login";
import intro from "../../public/image.png";
import "./intro.css";

interface ContainerProps {
  onFinish: () => void;
}

const SwiperButtonNext = ({ children }: any) => {
  const swiper = useSwiper();
  return (
    <IonButton
      size="large"
      fill="solid"
      shape="round"
      expand="block"
      className="add-button"
      color="success"
      style={{ width: "90%" }}
      onClick={() => swiper.slideNext()}
    >
      {children}
    </IonButton>
  );
};
//
const Intro: React.FC<ContainerProps> = ({ onFinish }) => {
  const history = useHistory();
  const handleStart = () => {
    // Utilisez history.push pour naviguer vers la nouvelle route
    history.push("/register");
  };
  return (
    <Swiper>
      <SwiperSlide>
        <IonGrid fixed>
          <IonRow
            className="ion-justify-content-center ion-align-items-center"
            style={{ height: "100%" }}
          >
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <div className="ion-text-center ion-padding">
                <IonCard
                  className="custom-card "
                  style={{ borderRadius: "4%" }}
                >
                  <IonCardContent>
                    <img
                      src={intro}
                      alt="intro Logo"
                      style={{
                        width: "100%",
                        borderRadius: "50%", // Utilisez 50% pour un cercle parfait
                        marginBottom: "25px",
                        marginTop: "25px", // Ajoutez un peu d'espace en haut de l'image
                      }}
                    />
                    <IonText
                      className="ion-text-center"
                      style={{
                        fontWeight: "bold",
                        fontSize: "1.8em",
                        fontStyle: "italic",
                        marginBottom: "15px",
                      }}
                    >
                      Smart-Spender
                    </IonText>
                    <p>
                      Révolutionnez votre gestion financière avec la première
                      application tunisienne conçue pour vous.
                    </p>
                  </IonCardContent>
                </IonCard>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "99%",
          }}
        >
          <SwiperButtonNext>Se connecter</SwiperButtonNext>
          {/* <Link
            to="/register"
            style={{
              textDecoration: "none",
              color: "black",
              width: "100%",
              marginLeft: "22px",
            }}
          > */}

          <IonButton
            size="large"
            fill="solid"
            shape="round"
            expand="block"
            className="add-button"
            color="dark"
            style={{ marginBottom: "30px", width: "90%" }}
            onClick={handleStart}
          >
            Commencer <br /> une nouvelle expérience
          </IonButton>
          {/* </Link> */}
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <Login />
      </SwiperSlide>
    </Swiper>
  );
};

export default Intro;
