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

import { useHistory } from "react-router-dom";

import { cloudUploadOutline, checkmarkSharp } from "ionicons/icons";
import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS
import axios from "axios";
import { axiosPrivate } from "../../api/axios";

const AddSeuil: React.FC = () => {
  const [sousCategories, setSousCategories] = useState([]);

  const [loading, setLoading] = useState(true); // État pour indiquer si le chargement est en cours ou non
  const [seuilBool, setSeuilBool] = useState(false);
  const [categories, setCategories] = useState([]);
  const getImageSrc = (imageData, mimetype) => {
    const base64Prefix = `data:${mimetype};base64,`;
    return base64Prefix + imageData;
  };
  const [periode, setPeriode] = useState("");

  const [categorieOuSousCategorie, setCategorieOuSousCategorie] = useState("");
  const history = useHistory();
  let userEmail;

  // Vérifier si le userEmail est présent dans le localStorage
  if (localStorage.getItem("userEmail")) {
    userEmail = localStorage.getItem("userEmail");
  }
  const [montant, setMontant] = useState(null);
  useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [categorieParente, setCategorieParente] = useState(0);

  const handleCategoryChange = (e) => {
    setCategorieParente(e.detail.value);
  };

  useEffect(() => {
    fetchData2();

    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 7418526); // Refresh every 0.75s

    // return () => clearInterval(intervalId);
  }, [categorieParente]);
  const fetchData2 = async () => {
    try {
      const response = await axios.get(
        `http://:9001/sous-categories-depenses/${userEmail}/${categorieParente}`
      );
      console.log(response.data);
      setSousCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://:9001/categories-depenses/${userEmail}`
      );
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();

    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 7418526); // Refresh every 0.75s

    // return () => clearInterval(intervalId);
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const [idCategorieOuSousCategorie, setIdCategorieOuSousCategorie] =
    useState(null);

  const handleOptionChange = (event: CustomEvent) => {
    setCategorieOuSousCategorie(event.detail.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.post(
        `/seuilDepense/${userEmail}`,
        {
          periode: periode,
          categorieOuSousCategorie: categorieOuSousCategorie,
          idCategorieOuSousCategorie: idCategorieOuSousCategorie,
          montant: montant,
        },
        {
          headers: {
            "Content-Type": "application/json", // Définir le type de contenu comme JSON
          },
        }
      );
      console.log(response.data);
      console.log("succeeded");
      setMontant("");
      setCategories([]);
      setPeriode("");
      setCategorieParente(0);
      setIdCategorieOuSousCategorie(null);
      setCategorieOuSousCategorie("");
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
          <IonTitle>Définir seuil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={true} className="ion-padding" fullScreen={true}>
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
                    margin: "auto",
                  }}
                  type="number"
                  placeholder="Seuil"
                  mode="md"
                  labelPlacement="floating"
                  label={"­ Seuil:"}
                  value={montant}
                  onIonChange={(e) => setMontant(e.detail.value!)}
                  color="success"
                />
                <IonNote slot="end">Dinars</IonNote>
              </IonItem>
              <IonList>
                <IonItem>
                  <IonLabel>Choisir la durée :</IonLabel>
                  <IonSelect
                    color="success"
                    placeholder="Sélectionner la durée"
                    onIonChange={(e) => setPeriode(e.detail.value)}
                  >
                    <IonSelectOption value="mois">Pour un mois</IonSelectOption>
                    <IonSelectOption value="3mois">Pour 3 mois</IonSelectOption>
                    <IonSelectOption value="6mois">Pour 6 mois</IonSelectOption>
                    <IonSelectOption value="an">Pour une année</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonList>
              <IonItem lines="none" style={{ justifyContent: "flex-end" }}>
                <IonRadioGroup
                  slot="start"
                  value={categorieOuSousCategorie}
                  onIonChange={handleOptionChange}
                >
                  <IonRadio
                    value="sousCategorie"
                    aria-label="Custom checkbox"
                    slot="end"
                  >
                    Seuil sur sous catégories
                  </IonRadio>
                  <IonRadio
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      flex: 1,
                    }}
                    slot="end"
                    value="categorie"
                    aria-label="Custom checkbox that is checked"
                  >
                    Seuil sur catégories
                  </IonRadio>
                </IonRadioGroup>
              </IonItem>
            </IonCardContent>
          </IonCard>

          {categorieOuSousCategorie === "categorie" && (
            <IonCard>
              <IonCardContent>
                <div>
                  <p>Choisir une catégorie :</p>
                  {loading ? (
                    <Loading />
                  ) : (
                    <IonList>
                      {categories.map((categorie) => (
                        <div
                          key={categorie.IdCategorie}
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
                                  categorie.image,
                                  categorie.mimetype
                                )}
                              />
                            </IonAvatar>
                            <IonLabel style={{ marginLeft: "1.2vh" }}>
                              {categorie.nomCategorie}
                            </IonLabel>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "auto",
                              }}
                            >
                              <IonRadioGroup
                                value={idCategorieOuSousCategorie}
                                onIonChange={(e) =>
                                  setIdCategorieOuSousCategorie(e.detail.value)
                                }
                              >
                                <IonRadio
                                  value={categorie.IdCategorie}
                                  aria-label="Custom checkbox"
                                  slot="end"
                                />
                              </IonRadioGroup>
                              &nbsp;
                            </div>
                          </IonItem>
                        </div>
                      ))}
                    </IonList>
                  )}
                </div>
              </IonCardContent>
            </IonCard>
          )}

          {categorieOuSousCategorie === "sousCategorie" && (
            <>
              <IonCard>
                <IonCardContent>
                  <div>
                    <p>Choisir la catégorie parente :</p>
                    {loading ? (
                      <Loading />
                    ) : (
                      <IonList>
                        {categories.map((categorie) => (
                          <div
                            key={categorie.IdCategorie}
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
                                    categorie.image,
                                    categorie.mimetype
                                  )}
                                />
                              </IonAvatar>
                              <IonLabel style={{ marginLeft: "1.2vh" }}>
                                {categorie.nomCategorie}
                              </IonLabel>
                              <IonRadioGroup
                                value={categorieParente}
                                onIonChange={(e) => handleCategoryChange(e)}
                              >
                                <IonRadio
                                  value={categorie.IdCategorie}
                                  aria-label="Custom checkbox"
                                  slot="end"
                                />
                              </IonRadioGroup>
                            </IonItem>
                          </div>
                        ))}
                      </IonList>
                    )}
                  </div>
                </IonCardContent>
              </IonCard>
              {categorieParente && (
                <IonCard>
                  <IonCardContent>
                    <div>
                      <p>Choisir une sous-catégorie :</p>
                      {loading ? (
                        <Loading />
                      ) : (
                        <IonList>
                          {sousCategories.map((sousCategorie) => (
                            <div
                              key={sousCategorie.IdSousCategorie}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: "5px",
                              }}
                            >
                              <IonItem style={{ flex: "1" }}>
                                <IonAvatar slot="start">
                                  <img
                                    alt="Embedded image"
                                    src={getImageSrc(
                                      sousCategorie.image,
                                      sousCategorie.mimetype
                                    )}
                                  />
                                </IonAvatar>
                                <IonLabel style={{ marginLeft: "10px" }}>
                                  {sousCategorie.nomSousCategorie}
                                </IonLabel>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginLeft: "auto",
                                  }}
                                >
                                  <IonRadioGroup
                                    slot="start"
                                    value={idCategorieOuSousCategorie}
                                    onIonChange={(e) =>
                                      setIdCategorieOuSousCategorie(
                                        e.detail.value
                                      )
                                    }
                                  >
                                    <IonRadio
                                      value={sousCategorie.IdSousCategorie}
                                      aria-label="Custom checkbox"
                                      slot="end"
                                    ></IonRadio>
                                  </IonRadioGroup>
                                  &nbsp;
                                </div>
                              </IonItem>
                            </div>
                          ))}
                        </IonList>
                      )}
                    </div>
                  </IonCardContent>
                </IonCard>
              )}
            </>
          )}

          <IonButton
            color="success"
            size="large"
            fill="solid"
            shape="round"
            expand="block"
            className="add-button"
            onClick={handleSubmit}
            style={{ marginBottom: "16px" }}
            disabled={
              (categorieParente && !idCategorieOuSousCategorie) ||
              !idCategorieOuSousCategorie
            }
          >
            <IonIcon slot="end" icon={checkmarkSharp} />
            Définir
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AddSeuil;
