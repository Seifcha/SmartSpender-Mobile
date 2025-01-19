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
  IonCardHeader,
  IonCheckbox,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import { cloudUploadOutline, checkmarkSharp } from "ionicons/icons";
import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS
import axios from "axios";
import { axiosPrivate } from "../../api/axios";
const EditCategorieDepense: React.FC = () => {
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

  const [imageHidden, setImageHidden] = useState(false); // State to manage whether the image should be hidden or not
  const { id } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [values, setValues] = useState({
    nomCategorie: "",
    image: null,
    isPublic: false,
    possedeFournisseurDepense: false,
  });

  const [categoriesFournisseur, setCategoriesFournisseur] = useState([]);
  const [
    idCategoriesFournisseurSelectionnes,
    setIdCategoriesFournisseurSelectionnes,
  ] = useState([]);

  useEffect(() => {
    axiosPrivate
      .get(`/categorie-depense/${id}`)
      .then((res) => {
        const data = res.data;
        setValues({
          ...values,
          nomCategorie: data.nomCategorie,
          possedeFournisseurDepense: data.possedeFournisseurDepenseInt,
          image: data.image,
          isPublic: data.isPublicInt ? true : false,
        });
      })
      .catch((err) => console.log(err));

    axiosPrivate.get("/categories-fournisseurs").then((res) => {
      const data = res.data;
      setCategoriesFournisseur(data);
    });

    axiosPrivate.get(`/categories-depense-fournisseur/${id}`).then((res) => {
      const data = res.data;
      // setCategoriesDepenseFournisseurSelectionnes(data);
      // Ajouter les IdCategoriesFournisseurs des CategoriesDepenseFournisseurSelectionnes à l'array idCategoriesFournisseurSelectionnes
      const selectedIds = data.map(
        (categorie) => categorie.idCategorieFournisseur
      );
      setIdCategoriesFournisseurSelectionnes(selectedIds);
    });
  }, []);

  const handleChange = (categorieId, isChecked) => {
    if (isChecked) {
      setIdCategoriesFournisseurSelectionnes((prevSelections) => [
        ...prevSelections,
        categorieId,
      ]);
    } else {
      setIdCategoriesFournisseurSelectionnes((prevSelections) =>
        prevSelections.filter((id) => id !== categorieId)
      );
    }
    idCategoriesFournisseurSelectionnes.map((id) => console.log(id));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValues((prevValues) => ({
        ...prevValues,
        image: file,
      }));
      // Hide the image when a new file is selected
      setImageHidden(true);
    }
  };
  const togglePublic = () => {
    setValues((prevValues) => ({
      ...prevValues,
      isPublic: !prevValues.isPublic,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nomCategorie, isPublic, image, possedeFournisseurDepense } = values;

    if (!image || !nomCategorie.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append("image", image);
      formdata.append("nomCategorie", nomCategorie);
      formdata.append("isPublic", isPublic.toString());
      formdata.append("possedeFournisseurDepense", possedeFournisseurDepense);
      console.log("state public", isPublic);
      // Convertir l'array en chaîne JSON
      const idCategoriesJSON = JSON.stringify(
        idCategoriesFournisseurSelectionnes
      );
      formdata.append("idCategoriesFournisseurSelected", idCategoriesJSON);
      await axiosPrivate.put(`/categories-depenses/${id}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Modification réussie");
      setValues({
        nomCategorie: "",
        possedeFournisseurDepense: false,
        image: null,
        isPublic: false,
      });

      setErrorMessage("");
      history.push("/categories-depenses");
      ("/categories-depenses");
    } catch (error) {
      console.error("Erreur lors de la modification de la catégorie", error);
      setErrorMessage(
        "Une erreur s'est produite lors de la modification de la catégorie. Veuillez réessayer."
      );
    }
  };
  const getImageSrc = (imageData, mimetype) => {
    const base64Prefix = `data:${mimetype};base64,`;
    return base64Prefix + imageData;
  };

  useEffect(() => {
    // Vérifier si au moins une case à cocher est cochée
    const anyCheckboxChecked = idCategoriesFournisseurSelectionnes.length > 0;

    // Mettre à jour possedeFournisseurDepense en fonction de la sélection des cases à cocher
    setValues((prevValues) => ({
      ...prevValues,
      possedeFournisseurDepense: anyCheckboxChecked,
    }));
  }, [idCategoriesFournisseurSelectionnes]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/categories-depenses" />
          </IonButtons>
          <IonTitle>Modifier une Catégorie dépense</IonTitle>
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
                  checked={values.isPublic}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      isPublic: e.detail.checked,
                    }))
                  }
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
                  color="success"
                  value={values.nomCategorie}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      nomCategorie: e.target.value,
                    }))
                  }
                />
              </IonItem>

              <IonItem lines="none">
                {!imageHidden && (
                  <div>
                    <p>Ancienne image:</p>
                    <img
                      src={getImageSrc(values.image, values.mimetype)}
                      alt="Image"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        marginRight: "10px",
                      }}
                    />
                  </div>
                )}

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
                    onIonChange={(e) =>
                      setValues((prevValues) => ({
                        ...prevValues,
                        possedeFournisseurDepense: e.target.checked,
                      }))
                    }
                    checked={values.possedeFournisseurDepense}
                  >
                    Possède fournisseur depense
                  </IonCheckbox>
                </IonItem>
                {values.possedeFournisseurDepense && (
                  <div>
                    <IonLabel className="form-label">
                      Choisir les catégories de fournisseurs
                    </IonLabel>
                    {categoriesFournisseur.map((categorie, index) => (
                      <IonItem key={index}>
                        <IonCheckbox
                          value={categorie.IdCategorieFournisseur}
                          color="medium"
                          id={`categorie${index}`} // unique id for each checkbox
                          checked={idCategoriesFournisseurSelectionnes.includes(
                            categorie.IdCategorieFournisseur
                          )}
                          onIonChange={(e) =>
                            handleChange(
                              categorie.IdCategorieFournisseur,
                              e.target.checked
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
            Modifier
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default EditCategorieDepense;
