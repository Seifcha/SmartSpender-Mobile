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
  IonNote,
  IonCheckbox,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Importez le hook useAuth
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { cloudUploadOutline, checkmarkSharp } from "ionicons/icons";
import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS
// import axios from "axios";

const AddCategorieRevenu: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth(); // Récupérez le jeton d'accès à partir du contexte d'authentification

  const [isPublic, setIsPublic] = useState(false);
  const history = useHistory();
  const [nomCategorie, setNomCategorie] = useState("");
  useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [IdCategorieFournisseur, setIdCategorieFournisseur] = useState([]);
  const [categoriesFournisseurs, setCategoriesFournisseurs] = useState([]);
  const [possedeFournisseurRevenu, setPossedeFournisseurRevenu] =
    useState(false);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  useEffect(() => {
    // Charger les catégories de dépenses depuis l'API
    axiosPrivate
      .get("/categories-fournisseurs")
      .then((response) => {
        setCategoriesFournisseurs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories de fournisseur:", error);
      });
  }, []);

  const [userEmail, setUserEmail] = useState(null);

  const checkUserLoggedIn = () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      history.push("/login");
    } else {
      setUserEmail(email);
    }
  };

  useEffect(() => {
    checkUserLoggedIn(); // Vérification initiale lors du montage du composant

    const interval = setInterval(() => {
      checkUserLoggedIn(); // Vérification périodique
    }, 300); // Rafraîchir toutes les 0.3 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
  }, [history]);

  const handleCategorieFournisseurChange = (e, categoryId) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      // Add the category ID to the state if it's checked
      setIdCategorieFournisseur([...IdCategorieFournisseur, categoryId]);
    } else {
      // Remove the category ID from the state if it's unchecked
      setIdCategorieFournisseur(
        IdCategorieFournisseur.filter((id) => id !== categoryId)
      );
    }
  };

  const togglePossede = () => {
    setPossedeFournisseurRevenu((prev) => !prev);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nomCategorie.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }
    let possedeFournisseur = possedeFournisseurRevenu;
    if (possedeFournisseurRevenu && IdCategorieFournisseur.length === 0) {
      possedeFournisseur = false;
    }
    let formData = new FormData();
    if (file) {
      formData.append("image", file);
    }
    formData.append("nomCategorie", nomCategorie);

    formData.append("userEmail", userEmail);

    formData.append("isPublic", isPublic);
    formData.append("IdCategorieFournisseur", IdCategorieFournisseur);
    formData.append("possedeFournisseurRevenu", possedeFournisseur);
    console.log(possedeFournisseur);
    console.log(IdCategorieFournisseur);
    try {
      const response = await axiosPrivate.post(
        "/categories-revenus",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      console.log("succeeded");
      console.log(isPublic, nomCategorie);
      setNomCategorie("");
      setErrorMessage("");
      setPossedeFournisseurRevenu(false);

      history.push("/categories-revenus");
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
            <IonBackButton defaultHref="/categories-revenus" />
          </IonButtons>
          <IonTitle>Ajouter une catégorie revenu</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={true} className="ion-padding">
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
                  label={"­ Nom de la catégorie:"}
                  value={nomCategorie}
                  onIonChange={(e) => setNomCategorie(e.detail.value!)}
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
              <div>
                <IonItem>
                  <IonCheckbox
                    color="success"
                    onIonChange={togglePossede}
                    checked={possedeFournisseurRevenu}
                  >
                    Possède fournisseur revenu
                  </IonCheckbox>
                </IonItem>
                {possedeFournisseurRevenu && (
                  <div>
                    <IonLabel className="form-label">
                      Choisir les catégories de fournisseurs
                    </IonLabel>
                    {categoriesFournisseurs.map((categorie, index) => (
                      <IonItem key={index}>
                        <IonCheckbox
                          value={categorie.IdCategorieFournisseur}
                          color="medium"
                          id={`categorie${index}`} // unique id for each checkbox
                          checked={IdCategorieFournisseur.includes(
                            categorie.IdCategorieFournisseur
                          )}
                          onIonChange={(e) =>
                            handleCategorieFournisseurChange(
                              e,
                              categorie.IdCategorieFournisseur
                            )
                          }
                        >
                          {categorie.nomCategorie}
                        </IonCheckbox>
                      </IonItem>
                    ))}
                  </div>
                )}
              </div>
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

export default AddCategorieRevenu;
