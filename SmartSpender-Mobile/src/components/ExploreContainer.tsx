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
  IonCheckbox,
  IonGrid,
  IonRow,
  IonCol,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import { cloudUploadOutline, checkmarkSharp } from "ionicons/icons";
import { navigate } from "react-router"; // Importez navigate depuis le bon emplacement
import "./ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS

const AddCategoryPage: React.FC = () => {
  const [isPublic, setIsPublic] = useState(false);
  const [nomCategorie, setNomCategorie] = useState("");
  const [possedeFournisseurDepense, setPossedeFournisseurDepense] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const togglePossede = () => {
    setPossedeFournisseurDepense((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomCategorie.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    const formdata = new FormData();
    if (file) {
      formdata.append("image", file);
    }
    formdata.append("nomCategorie", nomCategorie);
    formdata.append(
      "possedeFournisseurDepense",
      possedeFournisseurDepense.toString()
    );
    formdata.append("isPublic", isPublic.toString());
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const [file, setFile] = useState<File | undefined>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Ajout d'une Catégorie dépense</IonTitle>
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
                    borderRadius: "15px", // Arrondir les coins
                  }}
                  mode="md"
                  labelPlacement="floating"
                  label={"­ Nom de la catégorie:"}
                  value={nomCategorie}
                  onIonChange={(e) => setNomCategorie(e.detail.value!)}
                  color="success"
                />
              </IonItem>
              <IonItem lines="none">
                <IonLabel>Possède fournisseur de dépenses</IonLabel>
                <IonCheckbox
                  color="success"
                  checked={possedeFournisseurDepense}
                  onIonChange={togglePossede}
                />
              </IonItem>
              <IonItem lines="none">
                <IonLabel position="stacked">Importer une image</IonLabel>
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

export default AddCategoryPage;
