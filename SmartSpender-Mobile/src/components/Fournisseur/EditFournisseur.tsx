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
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import { cloudUploadOutline, checkmarkSharp } from "ionicons/icons";
import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS
import axios from "axios";
import { axiosPrivate } from "../../api/axios";
const EditFournisseur: React.FC = () => {
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
  const [categoriesFournisseurs, setCategoriesFournisseurs] = useState([]);

  const [values, setValues] = useState({
    nom: "",
    logo: null,
    isPublic: false,
    phone: "",
    mail: "",
    categorieParentId: 0,
  });

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://:9001/Fournisseur/${id}`)
      .then((res) => {
        const data = res.data;
        setValues({
          ...values,
          nom: data.nom,
          logo: data.logo,
          phone: data.phone,
          mail: data.mail,
          isPublic: data.isPublicInt ? true : false,
          categorieParentId: data.idCategorieFournisseur,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  const [errorMessage, setErrorMessage] = useState("");
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValues((prevValues) => ({
        ...prevValues,
        logo: file,
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

  useEffect(() => {
    // Charger les catégories de dépenses depuis l'API
    axiosPrivate
      .get(`/categories-fournisseurs/`)
      .then((response) => {
        console.log(response.data);
        setCategoriesFournisseurs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories parentes de dépenses:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nom, isPublic, logo, phone, mail, categorieParentId } = values;

    if (!logo || !nom.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append("isPublic", isPublic.toString());

      formdata.append("logo", logo);
      formdata.append("nom", nom);
      formdata.append("mail", mail);
      formdata.append("phone", phone);
      formdata.append("idCategorieFournisseur", categorieParentId);

      await axios.put(`http://:9001/fournisseurs/${id}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Modification réussie");
      setValues({
        nom: "",
        email: "",
        phone: "",
        logo: null,
        categorieParentId: 0,
      });

      setErrorMessage("");
      history.push("/fournisseurs");
    } catch (error) {
      console.error("Erreur lors de la modification de du fournisseur", error);
      setErrorMessage(
        "Une erreur s'est produite lors de la modification du fournisseur. Veuillez réessayer."
      );
    }
  };
  const [file, setFile] = useState<File | undefined>();
  const getImageSrc = (imageData, mimetype) => {
    const base64Prefix = `data:${mimetype};base64,`;
    return base64Prefix + imageData;
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/fournisseurs" />
          </IonButtons>
          <IonTitle>Modifier un fournisseur</IonTitle>
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
                    textAlign: "center", // Centrer le texte horizontalement
                  }}
                  mode="md"
                  labelPlacement="floating"
                  label={"­ Nom du fournisseur:"}
                  value={values.nom}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      nom: e.target.value,
                    }))
                  }
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
                  value={values.phone}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      phone: e.target.value,
                    }))
                  }
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
                  label={"­ E-mail du fournisseur:"}
                  value={values.mail}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      phone: e.target.value,
                    }))
                  }
                  color="success"
                />
              </IonItem>

              <IonItem lines="none">
                {!imageHidden && (
                  <div>
                    <p>Ancienne image:</p>
                    <img
                      src={getImageSrc(values.logo, values.mimetype)}
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
                  value={values.categorieParentId}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      categorieParentId: e.target.value,
                    }))
                  }
                >
                  {
                    // Mapper les options uniquement si le tableau compteOptions contient des éléments
                    categoriesFournisseurs.map((categorie) => (
                      <IonSelectOption
                        key={categorie.IdCategorieFournisseur}
                        value={categorie.IdCategorieFournisseur}
                      >
                        {categorie.nomCategorie}
                      </IonSelectOption>
                    ))
                  }
                </IonSelect>
              </IonItem>
              <p style={{ color: "red", textAlign: "center" }}>
                {errorMessage}{" "}
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
            Modifier
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default EditFournisseur;
