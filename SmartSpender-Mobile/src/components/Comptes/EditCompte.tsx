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
import { useHistory, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Importez le hook useAuth
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { cloudUploadOutline, checkmarkSharp } from "ionicons/icons";
import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS
import axios from "axios";

const EditCompte: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();

  const { id } = useParams();

  const [values, setValues] = useState({
    nomCompte: "",
    solde: null,
    creditLign: null,
    iban: "",
    typeCompte: "",
    status: "",
    tauxInteret: null,
  });
  const history = useHistory();
  let userEmail;

  const checkUserLoggedIn = () => {
    userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
      history.push("/login");
    }
  };

  useEffect(() => {
    checkUserLoggedIn(); // Vérification initiale lors du montage du composant

    const interval = setInterval(() => {
      checkUserLoggedIn(); // Vérification périodique
    }, 30); // Rafraîchir toutes les 0.3 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
  }, [history]); // Utilisation de useEffect avec history comme dépendance pour écouter les changements de route

  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      axios.get(`http://:9001/compte/${id}`).then((res) => {
        const data = res.data;
        setValues({
          ...values,
          nomCompte: data.nomCompte,
          solde: data.solde,
          creditLign: data.creditLign,
          status: data.status,
          iban: data.iban,
          tauxInteret: data.tauxInteret,
          typeCompte: data.typeCompte,
        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      values.typeCompte === "compte_credit" &&
      (values.tauxInteret < 0 || values.tauxInteret > 100)
    ) {
      setErrorMessage("Le taux d'intérêt doit être compris entre 0 et 100.");
      return;
    }
    const { nomCompte, solde, iban, typeCompte, status, creditLign } = values;
    if (!nomCompte.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    let formData = new FormData();

    formData.append("solde", values.solde);
    formData.append("iban", values.iban);
    formData.append("status", values.status);
    formData.append("creditLign", values.creditLign);
    formData.append("nomCompte", values.nomCompte);
    formData.append("userEmail", values.userEmail);
    formData.append("tauxInteret", values.tauxInteret);

    try {
      const response = await axiosPrivate.put(`/compte/${id}`, formData, {});
      console.log("succeeded");
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
            <IonBackButton defaultHref="/comptes" />
          </IonButtons>
          <IonTitle>Modifier un compte</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={false} className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center"></IonRow>

          <IonCard>
            <IonCardContent>
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
                  value={values.nomCompte}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      nomCompte: e.target.value,
                    }))
                  }
                  color="success"
                />
              </IonItem>

              {values.typeCompte !== "wallet_cash" && (
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
                    value={values.iban}
                    onIonChange={(e) =>
                      setValues((prevValues) => ({
                        ...prevValues,
                        iban: e.target.value,
                      }))
                    }
                    color="success"
                  />
                </IonItem>
              )}
              {values.typeCompte !== "wallet_cash" && (
                <IonList>
                  <IonItem className="ion-margin-top">
                    <IonLabel>Status</IonLabel>
                    <IonSelect
                      color="success"
                      placeholder="Sélectionner le status"
                      value={values.status}
                      onIonChange={(e) =>
                        setValues((prevValues) => ({
                          ...prevValues,
                          status: e.target.value,
                        }))
                      }
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
                  value={values.solde}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      solde: e.target.value,
                    }))
                  }
                  color="success"
                />
                <IonNote slot="end">Dinars</IonNote>
              </IonItem>

              {values.typeCompte === "compte_credit" && (
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
                    value={values.creditLign}
                    onIonChange={(e) =>
                      setValues((prevValues) => ({
                        ...prevValues,
                        creditLign: e.target.value,
                      }))
                    }
                  />
                  <IonNote slot="end">Dinars</IonNote>
                </IonItem>
              )}

              {values.typeCompte === "compte_credit" && (
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
                    value={values.tauxInteret}
                    onIonChange={(e) =>
                      setValues((prevValues) => ({
                        ...prevValues,
                        tauxInteret: e.target.value,
                      }))
                    }
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
          >
            <IonIcon slot="end" icon={checkmarkSharp} />
            Modifier
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default EditCompte;
