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
const EditCategorieDepense: React.FC = () => {
  let userEmail;

  // Vérifier si le userEmail est présent dans le localStorage
  if (localStorage.getItem("userEmail")) {
    userEmail = localStorage.getItem("userEmail");
  }
  const [isPublic, setIsPublic] = useState(false);
  const handleToggleChange = () => {
    // Toggle the state
    setIsPublic(!isPublic);
  };
  const [imageHidden, setImageHidden] = useState(false); // State to manage whether the image should be hidden or not
  const [values, setValues] = useState({
    nomSousCategorie: "",
    image: null,
  });
  const history = useHistory();

  const { id } = useParams();
  const { idCategorie } = useParams();

  useEffect(() => {
    axios
      .get(`http://:9001/sous-categorie-depense/${id}`)
      .then((res) => {
        const data = res.data;
        const isPublicc = data.isPublicInt == 1 ? true : false;
        setValues({
          ...values,
          nomSousCategorie: data.nomSousCategorie,
          image: data.image, // Assurez-vous que l'image est gérée correctement
        });
        if (isPublicc) {
          setIsPublic(true);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const [errorMessage, setErrorMessage] = useState("");
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
  // const togglePublic = () => {
  //   setValues((prevValues) => ({
  //     ...prevValues,
  //     isPublic: !prevValues.isPublic,
  //   }));
  //   console.log(values.isPublic);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nomSousCategorie, image } = values;

    if (!image || !nomSousCategorie.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const formdata = new FormData();
      formdata.append("image", image);
      formdata.append("nomSousCategorie", nomSousCategorie);
      formdata.append("isPublic", isPublic);

      await axios.put(`http://:9001/sous-categorie-depense/${id}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Modification réussie");
      setValues({
        nomSousCategorie: "",
        image: null,
      });
      console.log(isPublic);
      setErrorMessage("");
      history.push(`/sous-categories/${idCategorie}`);
    } catch (error) {
      console.error("Erreur lors de la modification de la catégorie", error);
      setErrorMessage(
        "Une erreur s'est produite lors de la modification de la catégorie. Veuillez réessayer."
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
            <IonBackButton defaultHref={`/sous-categories/${idCategorie}`} />
          </IonButtons>
          <IonTitle style={{ textAlign: "center" }}>
            Modifier une sous catégorie dépense
          </IonTitle>
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
                  onIonChange={handleToggleChange}
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
                  color="success"
                  value={values.nomSousCategorie}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      nomSousCategorie: e.target.value,
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
