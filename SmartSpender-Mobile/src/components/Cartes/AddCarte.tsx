import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonLabel,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonList,
  IonGrid,
  IonRow,
  IonBackButton,
  IonButtons,
  IonSelect,
  IonDatetime,
  IonModal,
  IonDatetimeButton,
  IonSelectOption,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { checkmarkSharp } from "ionicons/icons";
import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS

const AddCategorieDepense: React.FC = () => {
  const currentDate = new Date().toISOString();
  const [dateExpiration, setDateExpiration] = useState(currentDate);
  const [userEmail, setUserEmail] = useState<string | null>(null); // Utiliser useState pour gérer userEmail

  const axiosPrivate = useAxiosPrivate();
  const [typeCarte, setTypeCarte] = useState("");
  const [numCarte, setNumCarte] = useState("");
  const [compteOptions, setCompteOptions] = useState([]);
  const [compteId, setCompteId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();

  const handleDateChange = (event) => {
    setDateExpiration(event.detail.value);
  };

  const checkUserLoggedIn = () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      history.push("/login");
    } else {
      setUserEmail(email); // Mettre à jour l'état de userEmail
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
    const interval = setInterval(() => {
      checkUserLoggedIn();
    }, 300); // Rafraîchir toutes les 0.3 secondes

    return () => clearInterval(interval);
  }, [history]);

  useEffect(() => {
    if (typeCarte && userEmail) {
      axiosPrivate
        .get(`/comptes/${typeCarte}/${userEmail}`)
        .then((response) => {
          setCompteOptions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching categories de dépenses:", error);
        });
    }
  }, [typeCarte, userEmail]);

  const handleTypeCarteChange = (e) => {
    setTypeCarte(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!numCarte.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    let formData = new FormData();
    formData.append("userEmail", userEmail!);
    formData.append("numCarte", numCarte);
    formData.append("typeCarte", typeCarte);
    formData.append("dateExpiration", dateExpiration);
    formData.append("idCompte", compteId);

    try {
      const response = await axiosPrivate.post("/ajouter-carte", formData);
      console.log(response.data);
      setCompteId("");
      setDateExpiration("");
      setNumCarte("");
      setTypeCarte("");
      setErrorMessage("");
      history.push("/cartes");
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
            <IonBackButton defaultHref="/cartes" />
          </IonButtons>
          <IonTitle>Ajouter une carte</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={true} className="ion-padding">
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
                  type="text"
                  labelPlacement="floating"
                  label={"­ N° carte:"}
                  value={numCarte}
                  onIonChange={(e) => setNumCarte(e.detail.value!)}
                  color="success"
                />
              </IonItem>
              <IonList>
                <IonItem className="ion-margin-top">
                  <IonLabel>Type de carte</IonLabel>
                  <IonSelect
                    color="success"
                    placeholder="Sélectionner le type"
                    value={typeCarte}
                    onIonChange={(e) => handleTypeCarteChange(e)}
                  >
                    <IonSelectOption value="débit">Débit</IonSelectOption>
                    <IonSelectOption value="crédit">Crédit</IonSelectOption>
                    <IonSelectOption value="prépayée">Prépayée</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonList>
              <IonLabel>Date d'éxpiration:</IonLabel>
              <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
              <IonModal keepContentsMounted={true} color="success">
                <IonDatetime
                  color="success"
                  id="datetime"
                  presentation="date"
                  value={dateExpiration}
                  onIonChange={handleDateChange}
                  formatOptions={{
                    date: {
                      weekday: "short",
                      month: "long",
                      day: "2-digit",
                    },
                    time: {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  }}
                ></IonDatetime>
              </IonModal>
              <IonItem>
                <IonLabel>Compte associé</IonLabel>
                <IonSelect
                  color="success"
                  placeholder="Sélectionner le compte"
                  value={compteId}
                  onIonChange={(e) => setCompteId(e.detail.value)}
                >
                  {compteOptions.map((option) => (
                    <IonSelectOption
                      key={option.idCompte}
                      value={option.idCompte}
                    >
                      {option.nomCompte}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonCardContent>
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
            Ajouter
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AddCategorieDepense;
