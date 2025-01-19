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
} from "@ionic/react";
import React from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import Login from "./Login";
import intro from "../../public/image.png";
import "./intro.css";
import login from "../../public/login.png";

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

const SwiperButtonNext = ({ children }: any) => {
  const swiper = useSwiper();
  return (
    <IonFab
      slot="fixed"
      vertical="bottom"
      horizontal="end"
      style={{ marginBottom: "45px", marginRight: "20px" }}
      onClick={() => swiper.slideNext()}
    >
      {children}
      <IonFabButton color="success" className="ion-fab-buttonn">
        <IonIcon icon={arrowForwardOutline} />
      </IonFabButton>
    </IonFab>
  );
};
//
const Register: React.FC = () => {
  return (
    <IonPage>
      <IonContent>
        <Swiper>
          <SwiperSlide>
            <IonPage>
              <IonContent className="ion-padding" scrollY={true}>
                <IonGrid fixed>
                  <IonRow className="ion-justify-content-center">
                    <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                      <div
                        className="ion-text-center ion-padding"
                        style={{ height: "70%" }}
                      >
                        <img
                          src={login}
                          alt="smartspender Logo"
                          style={{
                            width: "85%",
                            borderRadius: "18%",
                            marginBottom: "25px",
                          }}
                        />
                        <IonText
                          className="ion-justify-content-center" // Utilisez className au lieu de class
                          style={{
                            fontWeight: "bold",
                            fontSize: "1.8em", // Augmenter la taille du texte
                            fontStyle: "italic",
                            textAlign: "center", // Centrer le texte
                            marginTop: "25px",
                          }}
                        >
                          Bienvenue de nouveau à <br /> Smart-Spender !
                        </IonText>
                      </div>
                      <IonItem className="ion-margin-top">
                        <IonInput
                          style={{
                            borderRadius: "15px",
                          }}
                          mode="md"
                          type="email"
                          labelPlacement="floating"
                          label="E-mail:"
                          placeholder="exemple@email.com"
                          color="success"
                          className="input"
                        />
                      </IonItem>
                      <IonItem className="ion-margin-top">
                        <IonInput
                          style={{
                            borderRadius: "15px",
                          }}
                          mode="md"
                          labelPlacement="floating"
                          label="Mot de passe:"
                          type="password"
                          color="success"
                          className="input"
                        />
                      </IonItem>

                      <div style={{ textAlign: "end", marginTop: "20px" }}>
                        <Link
                          style={{ color: "white", textDecoration: "none" }}
                          to={`/home`}
                        >
                          Mot de passe oublié
                        </Link>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonContent>
              <SwiperButtonNext></SwiperButtonNext>
            </IonPage>
          </SwiperSlide>

          <SwiperSlide>
            <IonPage>
              <IonContent className="ion-padding" scrollY={true}>
                <IonGrid fixed>
                  <IonRow className="ion-justify-content-center">
                    <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                      <div
                        className="ion-text-center ion-padding"
                        style={{ height: "70%" }}
                      >
                        <img
                          src={login}
                          alt="smartspender Logo"
                          style={{
                            width: "85%",
                            borderRadius: "18%",
                            marginBottom: "25px",
                          }}
                        />
                        <IonText
                          className="ion-justify-content-center" // Utilisez className au lieu de class
                          style={{
                            fontWeight: "bold",
                            fontSize: "1.8em", // Augmenter la taille du texte
                            fontStyle: "italic",
                            textAlign: "center", // Centrer le texte
                            marginTop: "25px",
                          }}
                        >
                          Bienvenue de nouveau à <br /> Smart-Spender !
                        </IonText>
                      </div>
                      <IonItem className="ion-margin-top">
                        <IonInput
                          style={{
                            borderRadius: "15px",
                          }}
                          mode="md"
                          type="email"
                          labelPlacement="floating"
                          label="E-mail:"
                          placeholder="exemple@email.com"
                          color="success"
                          className="input"
                        />
                      </IonItem>
                      <IonItem className="ion-margin-top">
                        <IonInput
                          style={{
                            borderRadius: "15px",
                          }}
                          mode="md"
                          labelPlacement="floating"
                          label="Mot de passe:"
                          type="password"
                          color="success"
                          className="input"
                        />
                      </IonItem>

                      <div style={{ textAlign: "end", marginTop: "20px" }}>
                        <Link
                          style={{ color: "white", textDecoration: "none" }}
                          to={`/home`}
                        >
                          Mot de passe oublié
                        </Link>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonContent>
              <SwiperButtonNext></SwiperButtonNext>
            </IonPage>
          </SwiperSlide>
          <SwiperSlide>
            <IonPage>
              <IonContent className="ion-padding" scrollY={true}>
                <IonGrid fixed>
                  <IonRow className="ion-justify-content-center">
                    <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                      <div
                        className="ion-text-center ion-padding"
                        style={{ height: "70%" }}
                      >
                        <img
                          src={login}
                          alt="smartspender Logo"
                          style={{
                            width: "85%",
                            borderRadius: "18%",
                            marginBottom: "25px",
                          }}
                        />
                        <IonText
                          className="ion-justify-content-center" // Utilisez className au lieu de class
                          style={{
                            fontWeight: "bold",
                            fontSize: "1.8em", // Augmenter la taille du texte
                            fontStyle: "italic",
                            textAlign: "center", // Centrer le texte
                            marginTop: "25px",
                          }}
                        >
                          Bienvenue de nouveau à <br /> Smart-Spender !
                        </IonText>
                      </div>
                      <IonItem className="ion-margin-top">
                        <IonInput
                          style={{
                            borderRadius: "15px",
                          }}
                          mode="md"
                          type="email"
                          labelPlacement="floating"
                          label="E-mail:"
                          placeholder="exemple@email.com"
                          color="success"
                          className="input"
                        />
                      </IonItem>
                      <IonItem className="ion-margin-top">
                        <IonInput
                          style={{
                            borderRadius: "15px",
                          }}
                          mode="md"
                          labelPlacement="floating"
                          label="Mot de passe:"
                          type="password"
                          color="success"
                          className="input"
                        />
                      </IonItem>

                      <div style={{ textAlign: "end", marginTop: "20px" }}>
                        <Link
                          style={{ color: "white", textDecoration: "none" }}
                          to={`/home`}
                        >
                          Mot de passe oublié
                        </Link>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonContent>
              <SwiperButtonNext></SwiperButtonNext>
            </IonPage>
          </SwiperSlide>
          <SwiperSlide>
            <IonPage>
              <IonContent className="ion-padding" scrollY={true}>
                <IonGrid fixed>
                  <IonRow className="ion-justify-content-center">
                    <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                      <div
                        className="ion-text-center ion-padding"
                        style={{ height: "70%" }}
                      >
                        <img
                          src={login}
                          alt="smartspender Logo"
                          style={{
                            width: "85%",
                            borderRadius: "18%",
                            marginBottom: "25px",
                          }}
                        />
                        <IonText
                          className="ion-justify-content-center" // Utilisez className au lieu de class
                          style={{
                            fontWeight: "bold",
                            fontSize: "1.8em", // Augmenter la taille du texte
                            fontStyle: "italic",
                            textAlign: "center", // Centrer le texte
                            marginTop: "25px",
                          }}
                        >
                          Bienvenue de nouveau à <br /> Smart-Spender !
                        </IonText>
                      </div>
                      <IonItem className="ion-margin-top">
                        <IonInput
                          style={{
                            borderRadius: "15px",
                          }}
                          mode="md"
                          type="email"
                          labelPlacement="floating"
                          label="E-mail:"
                          placeholder="exemple@email.com"
                          color="success"
                          className="input"
                        />
                      </IonItem>
                      <IonItem className="ion-margin-top">
                        <IonInput
                          style={{
                            borderRadius: "15px",
                          }}
                          mode="md"
                          labelPlacement="floating"
                          label="Mot de passe:"
                          type="password"
                          color="success"
                          className="input"
                        />
                      </IonItem>

                      <div style={{ textAlign: "end", marginTop: "20px" }}>
                        <Link
                          style={{ color: "white", textDecoration: "none" }}
                          to={`/home`}
                        >
                          Mot de passe oublié
                        </Link>
                      </div>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonContent>
              <SwiperButtonNext></SwiperButtonNext>
            </IonPage>
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default Register;
