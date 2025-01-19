import React from "react";
import {
  IonFooter,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonText,
} from "@ionic/react";
import {
  homeOutline,
  notificationsOutline,
  personCircleOutline,
  colorWandOutline,
  gridOutline,
  sparklesOutline,
} from "ionicons/icons";
import { NavLink } from "react-router-dom";

const BottomToolbar: React.FC = () => {
  return (
    <IonFooter>
      <IonToolbar>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.3vh",
          }}
        >
          <IonButtons>
            <NavLink
              to="/home"
              style={{ color: "white", textDecoration: "none" }}
            >
              <IonButton className="ion-color-light">
                <IonIcon icon={homeOutline} />
                <IonText style={{ fontSize: "0.6rem", marginTop: "0.3rem" }}>
                  Accueil
                </IonText>
              </IonButton>
            </NavLink>
          </IonButtons>
          <IonButtons>
            <NavLink
              to="/prediction"
              style={{ color: "white", textDecoration: "none" }}
            >
              <IonButton className="ion-color-light">
                <IonIcon icon={sparklesOutline} />
                <IonText style={{ fontSize: "0.6rem", marginTop: "0.3rem" }}>
                  Prédiction
                </IonText>
              </IonButton>
            </NavLink>
          </IonButtons>
          <IonButtons>
            <NavLink
              to="/gestions"
              style={{ color: "white", textDecoration: "none" }}
            >
              <IonButton className="ion-color-light">
                <IonIcon icon={gridOutline} />
                <IonText style={{ fontSize: "0.6rem", marginTop: "0.3rem" }}>
                  Gestion
                </IonText>
              </IonButton>
            </NavLink>
          </IonButtons>
          <IonButtons>
            <NavLink
              to={`/edit-profil`}
              style={{ color: "white", textDecoration: "none" }}
            >
              <IonButton className="ion-color-light">
                <IonIcon icon={personCircleOutline} />
                <IonText style={{ fontSize: "0.6rem", marginTop: "0.3rem" }}>
                  Profil
                </IonText>
              </IonButton>
            </NavLink>
          </IonButtons>
        </div>
      </IonToolbar>
    </IonFooter>
  );
};

export default BottomToolbar;
