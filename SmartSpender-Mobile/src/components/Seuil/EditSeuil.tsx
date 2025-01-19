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
  IonGrid,
  IonRow,
  IonCol,
  IonBackButton,
  IonButtons,
  IonNote,
  IonRadio,
  IonRadioGroup,
  Link,
  IonAvatar,
  IonList,
  IonCheckbox,
  IonSelectOption,
  IonSelect,
} from "@ionic/react";
import Loading from "../Loading";
import axiosPrivate from "../../api/axios";
import { useHistory, useParams } from "react-router-dom";

import { cloudUploadOutline, checkmarkSharp } from "ionicons/icons";
import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS
import axios from "axios";

const EditSeuil: React.FC = () => {
  const { id } = useParams();
  const [values, setValues] = useState({
    categorieOuSousCategorie: "",
    montant: null,
    idCategorieOuSousCategorie: 0,
    periode: "",
  });

  useEffect(() => {
    axiosPrivate
      .get(`seuil/${id}/${userEmail}`)
      .then((res) => {
        const data = res.data;
        setValues({
          ...values,
          cateorieOuSousCategorie: data.categorieOuSousCategorie,
          montant: data.montant,
          idCategorieOuSousCategorie: data.idCategorieOuSousCategorie,
          periode: data.periode,
        });
      })
      .catch((err) => console.log("erreur dans get sueil by id "));
  });

  if (values.categorieOuSousCategorie === "categorie") {
    useEffect(() => {
      async () => {
        try {
          const response = await axios.get(
            `http://:9001/categories-depenses/${values.idCategorieOuSousCategorie}/${userEmail}`
          );
          setCategories(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    }, []);
  } else {
    useEffect(() => {
      async () => {
        try {
          const response = await axios.get(
            `http://:9001/sous-categories-depenses/${values.idCategorieOuSousCategorie}/${userEmail}`
          );
          console.log(response.data);
          setSousCategories(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    }, []);
  }

  const [sousCategories, setSousCategories] = useState([]);

  const [loading, setLoading] = useState(true); // État pour indiquer si le chargement est en cours ou non
  const [seuilBool, setSeuilBool] = useState(false);
  const [categories, setCategories] = useState([]);
  const getImageSrc = (imageData, mimetype) => {
    const base64Prefix = `data:${mimetype};base64,`;
    return base64Prefix + imageData;
  };
  const [duree, setDuree] = useState("");

  const [selectedOptions, setSelectedOption] = useState("");
  const history = useHistory();
  let userEmail;

  // Vérifier si le userEmail est présent dans le localStorage
  if (localStorage.getItem("userEmail")) {
    userEmail = localStorage.getItem("userEmail");
  }
  const [seuil, setSeuil] = useState(null);
  useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const [file, setFile] = useState<File | undefined>();

  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleOptionChange = (event: CustomEvent) => {
    setSelectedOption(event.detail.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append("seuil", seuil);

    // formData.append("surCategorie", surCategorie.toString());

    try {
      const response = await axios.post(
        "http://:9001/ajouter-seuil",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      console.log("succeeded");
      console.log(seuil);
      setSeuil("");
      setErrorMessage("");
      history.push("/seuils");
    } catch (error) {
      console.error("Error adding categorie", error);
      setErrorMessage(
        "Une erreur s'est produite lors de l'ajout de la catégorie. Veuillez réessayer."
      );
    }
  };

  return (
    // En attente de GET !!!
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/seuils" />
          </IonButtons>
          <IonTitle>Modifier une seuil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={true} className="ion-padding" fullScreen={true}>
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center"></IonRow>
          <IonCard>
            <IonCardContent>
              <IonItem>
                <IonLabel>
                  Seuil sur:{" "}
                  {values.categorieOuSousCategorie === "categorie" ? (
                    <IonList>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "0.3vh",
                        }}
                      >
                        <IonItem style={{ flex: "1" }}>
                          <IonAvatar slot="start">
                            <img
                              alt="Embedded image"
                              src={getImageSrc(
                                categories.image,
                                categories.mimetype
                              )}
                            />
                          </IonAvatar>
                          <IonLabel style={{ marginLeft: "1.2vh" }}>
                            {categories.nomCategorie}
                          </IonLabel>
                        </IonItem>
                      </div>
                    </IonList>
                  ) : (
                    <IonList>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "0.3vh",
                        }}
                      >
                        <IonItem style={{ flex: "1" }}>
                          <IonAvatar slot="start">
                            <img
                              alt="Embedded image"
                              src={getImageSrc(
                                sousCategories.image,
                                categories.mimetype
                              )}
                            />
                          </IonAvatar>
                          <IonLabel style={{ marginLeft: "1.2vh" }}>
                            {sousCategories.nomSousCategorie}
                          </IonLabel>
                        </IonItem>
                      </div>
                    </IonList>
                  )}
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonInput
                  style={{
                    boxShadow:
                      "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
                    borderRadius: "15px",
                    textAlign: "center",
                    margin: "auto",
                  }}
                  type="number"
                  placeholder="Seuil"
                  mode="md"
                  labelPlacement="floating"
                  label={"­ Seuil:"}
                  value={seuil}
                  onIonChange={(e) => setSeuil(e.detail.value!)}
                  color="success"
                />
                <IonNote slot="end">Dinars</IonNote>
              </IonItem>
              <IonList>
                <IonItem>
                  <IonLabel>Changer la durée :</IonLabel>
                  <IonSelect
                    color="success"
                    value={duree}
                    placeholder="Sélectionner la durée"
                    onIonChange={(e) => setDuree(e.detail.value)}
                  >
                    <IonSelectOption value="mois">Pour un mois</IonSelectOption>
                    <IonSelectOption value="3mois">Pour 3 mois</IonSelectOption>
                    <IonSelectOption value="6mois">Pour 6 mois</IonSelectOption>
                    <IonSelectOption value="an">Pour une année</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonList>
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
            Définir
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default EditSeuil;
