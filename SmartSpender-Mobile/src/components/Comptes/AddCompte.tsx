import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonToggle,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonCardHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonBackButton,
  IonButtons,
  IonNote,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Importez le hook useAuth
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { cloudUploadOutline, checkmarkSharp } from "ionicons/icons";
import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS
import axios from "axios";

const AddCategorieDepense: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const history = useHistory();
  const [userEmail, setUserEmail] = useState(""); // Définir userEmail comme un état réactif

  const checkUserLoggedIn = () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
      history.push("/login");
    } else {
      setUserEmail(email); // Mettre à jour l'état userEmail
    }
  };

  useEffect(() => {
    checkUserLoggedIn(); // Vérification initiale lors du montage du composant

    const interval = setInterval(() => {
      checkUserLoggedIn(); // Vérification périodique
    }, 300); // Rafraîchir toutes les 0.3 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
  }, [history]); // Utilisation de useEffect avec history comme dépendance pour écouter les changements de route

  const [nomCompte, setNomCompte] = useState("");
  const [iban, setIban] = useState("");
  const [typeCompte, setTypeCompte] = useState("");
  const [status, setStatus] = useState("");
  const [solde, setSolde] = useState(null);
  const [creditLign, setCreditLign] = useState(null);
  const [tauxInteret, setTauxInteret] = useState(null);
  useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<File | undefined>();

  const handleTypeCompteChange = (e) => {
    // Nouvelle valeur sélectionnée
    setTypeCompte(e.target.value);
    setIban("");
    setStatus("");
    setCreditLign(null);
    setTauxInteret(null);
  };

  const handleCreditLignChange = (value) => {
    setCreditLign(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      typeCompte === "compte_credit" &&
      (tauxInteret < 0 || tauxInteret > 100)
    ) {
      setErrorMessage("Le taux d'intérêt doit être compris entre 0 et 100.");
      return;
    }

    if (!nomCompte.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    let formData = new FormData();

    formData.append("solde", solde);
    formData.append("iban", iban);
    formData.append("typeCompte", typeCompte);
    formData.append("status", status);
    formData.append("creditLign", creditLign);
    formData.append("nomCompte", nomCompte);
    formData.append("userEmail", userEmail);
    formData.append("tauxInteret", tauxInteret);
    try {
      for (var key of formData.entries()) {
        console.log(key[0] + ", " + key[1]);
      }
      const response = await axiosPrivate.post("/ajouter-compte", formData);
      for (var key of formData.entries()) {
        console.log(key[0] + ", " + key[1]);
      }
      setCreditLign(null);
      setIban("");
      setSolde(null);
      setStatus("");
      setTypeCompte("");

      console.log("succeeded");
      setNomCompte("");
      setErrorMessage("");
      history.push("/comptes");
    } catch (error) {
      console.error("Error adding categorie", error);
      setErrorMessage(
        "Une erreur s'est produite lors de l'ajout de la catégorie. Veuillez réessayer."
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/comptes
            "
            />
          </IonButtons>
          <IonTitle>Ajouter un compte</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center"></IonRow>

          <IonCard>
            <IonCardContent>
              <IonList>
                <IonItem className="ion-margin-top">
                  <IonLabel>Type de compte</IonLabel>
                  <IonSelect
                    color="success"
                    placeholder="Sélectionner le type"
                    value={typeCompte}
                    onIonChange={(e) => handleTypeCompteChange(e)}
                  >
                    <IonSelectOption value="wallet_cash">
                      Wallet cash (Espèce)
                    </IonSelectOption>
                    <IonSelectOption value="compte_courant">
                      Compte courant
                    </IonSelectOption>
                    <IonSelectOption value="compte_epargne">
                      Compte d'épargne
                    </IonSelectOption>
                    <IonSelectOption value="compte_credit">
                      Compte crédit
                    </IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonList>
              <IonItem>
                <IonInput
                  style={{
                    boxShadow:
                      "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                  label={"­ Nom du compte:"}
                  value={nomCompte}
                  onIonChange={(e) => setNomCompte(e.detail.value!)}
                  color="success"
                />
              </IonItem>
              {typeCompte !== "wallet_cash" && (
                <IonItem className="ion-margin-top">
                  <IonInput
                    style={{
                      boxShadow:
                        "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                    label={"­ N° IBAN:"}
                    value={iban}
                    onIonChange={(e) => setIban(e.detail.value!)}
                    color="success"
                  />
                </IonItem>
              )}
              {typeCompte !== "wallet_cash" && (
                <IonList>
                  <IonItem className="ion-margin-top">
                    <IonLabel>Status</IonLabel>
                    <IonSelect
                      color="success"
                      placeholder="Sélectionner le status"
                      value={status}
                      onIonChange={(e) => setStatus(e.detail.value!)}
                    >
                      <IonSelectOption value="actif">Actif</IonSelectOption>
                      <IonSelectOption value="fermé">Fermé</IonSelectOption>
                      <IonSelectOption value="Gelé">Gelé</IonSelectOption>
                    </IonSelect>
                  </IonItem>
                </IonList>
              )}
              <IonItem className="ion-margin-top">
                <IonInput
                  style={{
                    boxShadow:
                      "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                  type="number"
                  label={"­ Solde:"}
                  value={solde}
                  onIonChange={(e) => setSolde(e.detail.value)}
                  color="success"
                />
                <IonNote slot="end">Dinars</IonNote>
              </IonItem>

              {(typeCompte === "compte_courant" ||
                typeCompte === "compte_credit") && (
                <IonItem className="ion-margin-top">
                  <IonInput
                    style={{
                      boxShadow:
                        "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                    type="number"
                    label={"­ Ligne de crédit:"}
                    color="success"
                    value={creditLign}
                    onIonChange={(e) => handleCreditLignChange(e.detail.value)}
                  />
                  <IonNote slot="end">Dinars</IonNote>
                </IonItem>
              )}
              {typeCompte === "compte_credit" && (
                <IonItem className="ion-margin-top">
                  <IonInput
                    style={{
                      boxShadow:
                        "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                    type="number"
                    label={"­ Taux d'intérêt:"}
                    value={tauxInteret}
                    onIonChange={(e) => setTauxInteret(e.detail.value)}
                    color="success"
                  />
                  <IonNote slot="end">%</IonNote>
                </IonItem>
              )}
            </IonCardContent>
            {errorMessage && (
              <IonNote color="danger" className="ion-padding-horizontal">
                {errorMessage}
              </IonNote>
            )}
          </IonCard>

          <IonButton
            color="success"
            size="large"
            fill="solid"
            shape="round"
            expand="block"
            className="add-button"
            onClick={handleSubmit}
            style={{ marginBottom: "16px" }}
            disabled={
              (typeCompte == "compte_credit" && !tauxInteret) ||
              (typeCompte == "compte_courant" && !creditLign) ||
              !solde
            }
          >
            <IonIcon slot="end" icon={checkmarkSharp} />
            Ajouter
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AddCategorieDepense;
