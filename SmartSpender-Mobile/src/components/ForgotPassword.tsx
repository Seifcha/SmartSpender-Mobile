import React, { useState } from "react";
import forgot from "../../public/forgot.png";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonCol,
  IonRow,
  IonGrid,
  IonIcon,
  IonButton,
  IonBackButton,
  IonButtons,
  IonText,
} from "@ionic/react";
import { checkmarkSharp } from "ionicons/icons";
import axios from "axios";
import { useHistory } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const history = useHistory();
  const [userEmail, setUserEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Vérifier si l'e-mail existe dans la base de données
      const emailExistsResponse = await axios.post(
        "http://:9001/check-email-exists",
        { email: userEmail },
        { withCredentials: true }
      );

      if (!emailExistsResponse.data.exists) {
        setErrorMessage("Adresse e-mail introuvable.");
        return;
      }

      // Appeler l'API pour générer et stocker le code de réinitialisation
      const resetResponse = await axios.post(
        "http://:9001/forgot-password",
        { email: userEmail },
        { withCredentials: true }
      );

      if (resetResponse.data.Status === "Success") {
        const { token, id } = resetResponse.data;
        console.log("token ", token);
        console.log("userId ", id);
        history.push(`/code-validation/${id}/${token}`);
      } else {
        setErrorMessage(
          "Erreur lors de la génération du code de réinitialisation."
        );
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Erreur lors de la demande de réinitialisation.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref />
          </IonButtons>
          <IonTitle style={{ textAlign: "center" }}>
            Mot de passe oublié
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" scrollY={true}>
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <div
                className="ion-text-center ion-padding"
                style={{ height: "70%" }}
              >
                <img
                  src={forgot}
                  alt="smartspender Logo"
                  style={{
                    width: "85%",
                    borderRadius: "18%",
                    marginBottom: "25px",
                  }}
                />
                <IonText
                  className="ion-justify-content-center"
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.8em",
                    textAlign: "center",
                    marginTop: "25px",
                  }}
                >
                  Mot de passe oublié ?
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
                  value={userEmail}
                  onIonChange={(e) => setUserEmail(e.detail.value!)}
                />
              </IonItem>

              <IonButton
                onClick={handleSubmit}
                className="ion-margin-top"
                color="success"
                size="large"
                fill="solid"
                shape="round"
                expand="block"
                style={{ marginBottom: "16px" }}
              >
                <IonIcon slot="end" icon={checkmarkSharp} />
                Envoyer
              </IonButton>

              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPassword;
