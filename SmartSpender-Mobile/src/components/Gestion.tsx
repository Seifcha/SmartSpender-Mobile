import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonItem,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import {
  shuffleOutline,
  trendingDownOutline,
  arrowForward,
  arrowBack,
  cashOutline,
  caretForwardOutline,
  trendingUpOutline,
} from "ionicons/icons";
import React from "react";
import transfert from "../../public/iconeSS.png";
import Menu from "./Menu";
import { Link } from "react-router-dom";
const Gestion: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ textAlign: "center" }}>Espace gestion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className="ion-padding"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {" "}
                <Link
                  style={{ color: "white", textDecoration: "none" }}
                  to={`/categories-depenses`}
                >
                  <IonButton
                    color="light"
                    size="large"
                    fill="solid"
                    shape="round"
                    expand="block"
                    style={{
                      borderRadius: "18px",
                      width: "100%",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      maxWidth: "400px",
                    }}
                    className="ion-text-wrap"
                  >
                    <div style={{ marginRight: "0.7vh" }}>
                      Mes catégories et sous-catégories de dépense
                    </div>
                  </IonButton>
                </Link>
                <Link
                  style={{ color: "white", textDecoration: "none" }}
                  to={`/categories-revenus`}
                >
                  <IonButton
                    color="light"
                    size="large"
                    fill="solid"
                    shape="round"
                    expand="block"
                    style={{
                      borderRadius: "18px",
                      width: "100%",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      maxWidth: "400px",
                    }}
                    className="ion-text-wrap"
                  >
                    <div style={{ marginRight: "0.7vh" }}>
                      Mes catégories de revenu
                    </div>
                  </IonButton>
                </Link>
                <Link
                  style={{ color: "white", textDecoration: "none" }}
                  to={`/fournisseurs`}
                >
                  <IonButton
                    color="light"
                    size="large"
                    fill="solid"
                    shape="round"
                    expand="block"
                    style={{
                      borderRadius: "18px",
                      width: "100%",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      maxWidth: "400px",
                    }}
                    className="ion-text-wrap"
                  >
                    <div style={{ marginRight: "0.7vh" }}>Mes fournisseurs</div>
                  </IonButton>
                </Link>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Link
                  style={{ color: "white", textDecoration: "none" }}
                  to={`/comptes`}
                >
                  <IonButton
                    color="light"
                    size="large"
                    fill="solid"
                    shape="round"
                    expand="block"
                    style={{
                      borderRadius: "18px",
                      width: "100%",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      maxWidth: "400px",
                    }}
                    className="ion-text-wrap"
                  >
                    <div style={{ marginRight: "0.7vh" }}>Mes comptes</div>
                  </IonButton>
                </Link>
                <Link
                  style={{ color: "white", textDecoration: "none" }}
                  to={`/cartes`}
                >
                  <IonButton
                    color="light"
                    size="large"
                    fill="solid"
                    shape="round"
                    expand="block"
                    style={{
                      borderRadius: "18px",
                      width: "100%",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      maxWidth: "400px",
                    }}
                    className="ion-text-wrap"
                  >
                    <div style={{ marginRight: "0.7vh" }}>Mes cartes</div>
                  </IonButton>
                </Link>
                <Link
                  style={{ color: "white", textDecoration: "none" }}
                  to={`/seuils`}
                >
                  <IonButton
                    color="light"
                    size="large"
                    fill="solid"
                    shape="round"
                    expand="block"
                    style={{
                      borderRadius: "18px",
                      width: "100%",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      maxWidth: "400px",
                    }}
                    className="ion-text-wrap"
                  >
                    <div style={{ marginRight: "0.7vh" }}>les seuils</div>
                  </IonButton>
                </Link>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <Menu />
    </IonPage>
  );
};

export default Gestion;
