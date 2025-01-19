import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import axios from "axios";
import reset from "../../public/pwd.png";

import { code, checkmarkSharp } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const [errMsg, setErrMsg] = useState("");
  const history = useHistory();

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const { id, token } = useParams();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [pwd, matchPwd]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = PWD_REGEX.test(pwd);
    if (!v) {
      setErrMsg("entrée invalide");
      return;
    }
    try {
      const response = await axios.post(
        `http://:9001/reset-password/${id}/${token}`,
        { pwd }
      );
      // if (response.data.Status === "Success") {
      history.push("/login");
      // }
    } catch (error) {
      console.error("Erreur lors de la soumission des données :", error);
      setErrMsg("Une erreur s'est produite lors de la soumission des données.");
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/code" />
          </IonButtons>
          <IonTitle>Réinitialisez votre mot de passe</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <div className="ion-margin-top ion-text-center">
                <div
                  className="ion-text-center ion-padding ion-margin-top"
                  style={{ height: "70%" }}
                >
                  <img
                    src={reset}
                    alt="smartspender Logo"
                    style={{
                      width: "100%",
                      borderRadius: "10%",
                      marginBottom: "25px",
                    }}
                  />
                </div>
                <IonLabel
                  style={{ borderRadius: "15px" }}
                  mode="md"
                  type="number"
                >
                  Entrer votre nouveau mot de passe :
                </IonLabel>
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
                    value={pwd}
                    onIonChange={(e) => setPwd(e.detail.value!)}
                  />
                </IonItem>
                <p
                  className={
                    validMatch ? "instructions valid" : "instructions invalid"
                  }
                >
                  {!validMatch ? (
                    <>Les mots de passe ne correspondent pas.</>
                  ) : (
                    <>Correspondance du mot de passe.</>
                  )}
                </p>
                <IonItem className="ion-margin-top">
                  <IonInput
                    style={{
                      borderRadius: "15px",
                    }}
                    mode="md"
                    labelPlacement="floating"
                    label="Confirmer mot de passe:"
                    type="password"
                    color="success"
                    className="input"
                    onIonChange={(e) => setMatchPwd(e.detail.value!)}
                    value={matchPwd}
                    aria-invalid={validMatch ? "false" : "true"}
                  />
                </IonItem>
                <p
                  className={
                    validPwd ? "instructions valid" : "instructions invalid"
                  }
                >
                  {!validPwd && pwd ? (
                    <>
                      Doit comporter entre 8 et 24 caractères Inclureune lettre
                      majuscule, une lettre minuscule, un chiffre et un
                      caractère spécial parmi !, @, #, $, %.
                    </>
                  ) : (
                    <p style={{ color: "#6bd26b" }}>Mot de passe valide.</p>
                  )}
                </p>
              </div>
              <IonButton
                color="success"
                size="large"
                fill="solid"
                shape="round"
                expand="block"
                className="add-button"
                onClick={handleSubmit}
                style={{ marginBottom: "16px" }}
              >
                <IonIcon slot="end" icon={checkmarkSharp} />
                Changer
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ResetPassword;
