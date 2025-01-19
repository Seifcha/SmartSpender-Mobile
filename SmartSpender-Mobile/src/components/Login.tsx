import React, { useRef, useState, useEffect } from "react";
import login from "../../public/login.png";
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
  IonFabButton,
  IonFab,
  IonText,
  IonButton,
} from "@ionic/react";
import {
  arrowForwardOutline,
  add,
  warning,
  document,
  globe,
  colorPalette,
  chevronUpCircle,
} from "ionicons/icons";
import { Link, useHistory } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Login: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth(); // Récupérez le jeton d'accès à partir du contexte d'authentification

  const [isPublic, setIsPublic] = useState(false);
  const history = useHistory();
  const [userEmail, setUserEmail] = useState("");
  const [mdp, setMdp] = useState("");
  useState(false);
  const [errMsg, setErrMsg] = useState("");
  const userRef = useRef();
  const errRef = useRef();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userEmail.trim()) {
      setErrMsg("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const response = await axiosPrivate.post(
        "http://:9001/auth",
        JSON.stringify({ userEmail, mdp }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("long_duration_username", userEmail);
      console.log(response.data);
      console.log("succeeded");
      setUserEmail("");
      setErrMsg("");
      history.push("/home");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Pas de réponse");
      } else if (err.response?.status === 400) {
        setErrMsg("Pas d'Email ou Mot de passe ");
      } else if (err.response?.status === 401) {
        setErrMsg("Non-autorisé");
      } else {
        setErrMsg("Erreur lors de la connexion");
      }
      errRef.current.focus();
    }
  };
  return (
    <IonPage>
      <IonContent className="ion-padding" scrollX={true} scrollY={false}>
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
                    marginBottom: "2.7vh",
                  }}
                />
                <IonText
                  className="ion-justify-content-center" // Utilisez className au lieu de class
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.8em", // Augmenter la taille du texte
                    fontStyle: "italic",
                    textAlign: "center", // Centrer le texte
                    marginTop: "2.5vh",
                  }}
                >
                  Bienvenue de nouveau à <br /> Smart-Spender !
                </IonText>
                <p
                  style={{ color: "red" }}
                  ref={errRef}
                  className={errMsg ? "errmsg" : "offscreen"}
                  aria-live="assertive"
                >
                  {errMsg}
                </p>
              </div>
              <IonItem className="ion-margin-top">
                <IonInput
                  style={{
                    borderRadius: "1.5vh",
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
              <IonItem className="ion-margin-top">
                <IonInput
                  style={{
                    borderRadius: "1.5vh",
                  }}
                  mode="md"
                  labelPlacement="floating"
                  label="Mot de passe:"
                  type="password"
                  color="success"
                  className="input"
                  value={mdp}
                  onIonChange={(e) => setMdp(e.detail.value!)}
                />
              </IonItem>

              <div style={{ textAlign: "end", marginTop: "2.7vh" }}>
                <Link
                  style={{ color: "white", textDecoration: "none" }}
                  to={`/forgot-password`}
                >
                  Mot de passe oublié
                </Link>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        style={{ marginBottom: "5vh", marginRight: "3.2vh" }}
        onClick={handleSubmit}
      >
        <IonFabButton color="success" className="ion-fab-buttonn">
          <IonIcon icon={arrowForwardOutline} />
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default Login;
