import React, { useEffect, useState } from "react";
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
  IonCardHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonBackButton,
  IonButtons,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { cloudUploadOutline, checkmarkSharp } from "ionicons/icons";
import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS
import axios from "axios";
import { axiosPrivate } from "../../api/axios";

const AddFournisseur: React.FC = () => {
  const [categorieParenteId, setCategorieParenteId] = useState("");
  const [categoriesFournisseurs, setCategoriesFournisseurs] = useState([]);
  const [phone, setPhone] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null); // Utiliser useState pour gérer userEmail
  const [mail, setMail] = useState("");
  const [nom, setNom] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<File | undefined>();

  const history = useHistory();

  const checkUserLoggedIn = () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
      history.push("/login");
    } else {
      setUserEmail(email); // Mettre à jour l'état de userEmail
    }
  };

  useEffect(() => {
    checkUserLoggedIn(); // Vérification initiale lors du montage du composant

    const interval = setInterval(() => {
      checkUserLoggedIn(); // Vérification périodique
    }, 300); // Rafraîchir toutes les 0.3 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
  }, [history]); // Utilisation de useEffect avec history comme dépendance pour écouter les changements de route

  useEffect(() => {
    // Charger les catégories de dépenses depuis l'API
    axiosPrivate
      .get("/categories-fournisseurs")
      .then((response) => {
        setCategoriesFournisseurs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories de fournisseurs:", error);
      });
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) {
      setErrorMessage("Veuillez remplir tous les champs nécessaires.");
      return;
    }

    let formData = new FormData();
    if (file) {
      formData.append("logo", file);
    }
    formData.append("nom", nom);
    formData.append("phone", phone);
    formData.append("isPublic", String(isPublic));
    formData.append("mail", mail);
    formData.append("userEmail", userEmail!); // Utiliser l'état userEmail
    formData.append("idCategorieFournisseur", categorieParenteId);

    try {
      const response = await axios.post(
        "http://:9001/ajouter-fournisseur",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      console.log("succeeded");
      setPhone("");
      setMail("");
      setCategorieParenteId("");
      setErrorMessage("");
      history.push("/fournisseurs");
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
            <IonBackButton defaultHref="/fournisseurs" />
          </IonButtons>
          <IonTitle>Ajouter un fournisseur</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={false} className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center"></IonRow>
          <IonCard>
            <IonCardContent>
              <IonItem lines="none" style={{ justifyContent: "flex-end" }}>
                <IonToggle
                  color="success"
                  checked={isPublic}
                  onIonChange={(e) => setIsPublic(e.detail.checked)}
                >
                  Public
                </IonToggle>
              </IonItem>
            </IonCardContent>
          </IonCard>

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
                  label={"­ Nom du fournisseur:"}
                  value={nom}
                  onIonChange={(e) => setNom(e.detail.value!)}
                  color="success"
                />
              </IonItem>

              <IonItem className="ion-margin-top">
                <IonInput
                  style={{
                    boxShadow:
                      "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  type="tel"
                  mode="md"
                  labelPlacement="floating"
                  label={"­ Téléphone du fournisseur:"}
                  value={phone}
                  onIonChange={(e) => setPhone(e.detail.value!)}
                  color="success"
                />
              </IonItem>

              <IonItem className="ion-margin-top">
                <IonInput
                  style={{
                    boxShadow:
                      "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  type="email"
                  mode="md"
                  labelPlacement="floating"
                  label={"­ E-mail du fournisseur:"}
                  value={mail}
                  onIonChange={(e) => setMail(e.detail.value!)}
                  color="success"
                />
              </IonItem>
              <IonItem lines="none">
                <IonLabel position="stacked">Importer le logo</IonLabel>
                <label className="file-input-label">
                  <IonButton color="medium" size="small">
                    <IonIcon icon={cloudUploadOutline} slot="start" />
                    Choisir un logo
                  </IonButton>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="file-input"
                  />
                </label>
              </IonItem>
              <IonItem>
                <IonLabel>Activité du fournisseur:</IonLabel>
                <IonSelect
                  color="success"
                  placeholder="Sélectionner l'activité"
                  onIonChange={(e) => setCategorieParenteId(e.detail.value)}
                >
                  {categoriesFournisseurs.map((categorie) => (
                    <IonSelectOption
                      key={categorie.IdCategorieFournisseur}
                      value={categorie.IdCategorieFournisseur}
                    >
                      {categorie.nomCategorie}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <p style={{ color: "red", textAlign: "center" }}>
                {errorMessage}
              </p>
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

export default AddFournisseur;
