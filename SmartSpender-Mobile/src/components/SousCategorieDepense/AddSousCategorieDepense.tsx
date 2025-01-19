import React, { useState } from "react";
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
  IonNote,
} from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";

import { cloudUploadOutline, checkmarkSharp } from "ionicons/icons";
import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS
import axios from "axios";

const AddSousCategorieDepense: React.FC = () => {
  const { id } = useParams(); // Déplacer l'utilisation de useParams ici
  const [isPublic, setIsPublic] = useState(false);
  const history = useHistory();
  // Extraction de l'ID de la catégorie depuis l'URL
  let userEmail;

  // Vérifier si le userEmail est présent dans le localStorage
  if (localStorage.getItem("userEmail")) {
    userEmail = localStorage.getItem("userEmail");
  }
  const [nomSousCategorie, setNomSousCategorie] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<File | undefined>();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomSousCategorie.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    let formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    formData.append("nomSousCategorie", nomSousCategorie);
    formData.append("userEmail", userEmail);
    formData.append("idCategorieDepense", id);
    formData.append("isPublic", isPublic.toString());

    try {
      const response = await axios.post(
        `http://:9001/sous-categories-depense/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      console.log("succeeded");
      console.log(isPublic, nomSousCategorie);
      setNomSousCategorie("");
      setErrorMessage("");
      history.push(`/sous-categories/${id}`); // Redirection vers la catégorie parente après succès de l'ajout
    } catch (error) {
      console.error("Error adding categorie", error);
      setErrorMessage(
        "Une erreur s'est produite lors de l'ajout de la sous catégorie. Veuillez réessayer."
      );
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={`/sous-categories/${id}`} />{" "}
            {/* Utilisation de l'ID de la catégorie dans le defaultHref */}
          </IonButtons>
          <IonTitle>Ajouter une sous catégorie dépense</IonTitle>
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
                  Publique
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
                  label={"­ Nom de la sous catégorie:"}
                  value={nomSousCategorie}
                  onIonChange={(e) => setNomSousCategorie(e.detail.value!)}
                  color="success"
                />
              </IonItem>

              <IonItem lines="none">
                <IonLabel position="stacked">Importer une image</IonLabel>
                <label className="file-input-label">
                  <IonButton color="medium" size="small">
                    <IonIcon icon={cloudUploadOutline} slot="start" />
                    Choisir une image
                  </IonButton>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="file-input"
                  />
                </label>
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

export default AddSousCategorieDepense;
