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
  IonList,
  IonNote,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import moment from "moment";

import { useParams, useHistory } from "react-router-dom";
import { cloudUploadOutline, checkmarkSharp } from "ionicons/icons";
import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS
import axios from "axios";
import { axiosPrivate } from "../../api/axios";
const ViewRevenu: React.FC = () => {
  let userEmail;

  // Vérifier si le userEmail est présent dans le localStorage
  if (localStorage.getItem("userEmail")) {
    userEmail = localStorage.getItem("userEmail");
  }
  const dateFormat = (date) => {
    moment.locale();
    return moment(date).format("YYYY/MM/DD");
  };

  const [imageHidden, setImageHidden] = useState(false); // State to manage whether the image should be hidden or not
  const [values, setValues] = useState({
    createdAt: "",
    montant: null,
    dateRevenu: null,
    recurrente: "",
    recurrenceOption: "",
    description: "",
    transactions: [{ moyen: "", nomCompte: "", amount: 0 }],
    nomCategorie: "",
    nomFournisseur: "",
  });
  const history = useHistory();

  const { id } = useParams();

  useEffect(() => {
    fetchData();
    fetchData2();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://:9001/revenu/${id}`);
      const data = res.data;
      console.log(data);
      setValues((prevValues) => ({
        ...prevValues,
        createdAt: data.createdAt,
        dateRevenu: data.dateRevenu,
        recurrente: data.recurrente,
        recurrenceOption: data.recurrenceOption,
        description: data.description,
        montant: data.montant,
        nomCategorie: data.nomCategorie,
        nomFournisseur: data.nomFournisseur,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("General error:", error.message);
      }
    }
  };

  const fetchData2 = async () => {
    try {
      const res = await axios.get(`http://:9001/transactionss/${id}`);
      console.log(res.data);
      setValues((prevValues) => ({
        ...prevValues,
        transactions: res.data,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response) {
        console.error("Response error:", error.response.data);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("General error:", error.message);
      }
    }
  };

  // Ajoutez id comme dépendance pour que l'effet se réexécute lorsque id change

  // useEffect(() => {
  //   async () => {
  //     try {
  //       axios
  //         .get(`http://:9001/categorie-revenu/${id}`)
  //         .then((res) => {
  //           const data = res.data;
  //           setValues({
  //             ...values,
  //             nomCategorie: data.nomCategorie,
  //           });
  //         });
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  // });
  // useEffect(() => {
  //   async () => {
  //     try {
  //       axios
  //         .get(`http://:9001/sous-categorie/${id}`)
  //         .then((res) => {
  //           const data = res.data;
  //           setValues({
  //             ...values,
  //             nomSousCategorie: data.nomSousCategorie, // a faire dans son propre state
  //           });
  //         });
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  // });
  console.log(values.nomCategorie);
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
  const togglePublic = () => {
    setValues((prevValues) => ({
      ...prevValues,
      isPublic: !prevValues.isPublic,
    }));
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
            <IonBackButton defaultHref="/revenus" />
          </IonButtons>
          <IonTitle>Consulter un revenu</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={true} className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center"></IonRow>

          <IonCard>
            <IonCardContent>
              <IonItem>
                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                  color="success"
                >
                  Récurrent
                </IonLabel>

                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                >
                  {values.recurrente === true ? "  Oui" : "  Non"}
                </IonLabel>
              </IonItem>

              {values.recurrente === true && (
                <IonItem>
                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                    color="success"
                  >
                    Récurrence
                  </IonLabel>

                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                  >
                    {" "}
                    Chaque ­­{values.recurrenceOption}
                  </IonLabel>
                </IonItem>
              )}

              {values.description != "" && (
                <IonItem>
                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                    color="success"
                  >
                    Description
                  </IonLabel>

                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                  >
                    {values.description}
                  </IonLabel>
                </IonItem>
              )}
              <IonItem>
                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                  color="success"
                >
                  Date de déclaration
                </IonLabel>

                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                >
                  {" "}
                  ­­{dateFormat(values.createdAt)}
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                  color="success"
                >
                  Date de revenu
                </IonLabel>

                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                >
                  {" "}
                  ­­{dateFormat(values.dateRevenu)}
                </IonLabel>
              </IonItem>
              {values.nomCategorie != null && (
                <IonItem>
                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                    color="success"
                  >
                    Catégorie de revenu
                  </IonLabel>

                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                  >
                    {values.nomCategorie}
                  </IonLabel>
                </IonItem>
              )}

              {values.nomFournisseur != null && (
                <IonItem>
                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                    color="success"
                  >
                    Fournisseur
                  </IonLabel>

                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                  >
                    {values.nomFournisseur}
                  </IonLabel>
                </IonItem>
              )}

              <IonItem>
                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                  color="success"
                >
                  Montant total entré
                </IonLabel>

                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                >
                  {values.montant} Dinars
                </IonLabel>
              </IonItem>
              <IonItem className="ion-margin-top">
                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                    color: "#cbcbcb",
                  }}
                  mode="md"
                  labelPlacement="floating"
                >
                  {" "}
                  <strong> Les transactions réalisées : </strong>
                </IonLabel>
              </IonItem>
              {/** */}
              <IonList>
                {values.transactions.map((transaction, index) => (
                  <div key={index}>
                    <h4 style={{ color: "gray", textAlign: "center" }}>
                      Transaction {index + 1}
                    </h4>
                    <IonItem>
                      <IonLabel
                        style={{
                          borderRadius: "15px",
                          textAlign: "center",
                        }}
                        mode="md"
                        labelPlacement="floating"
                        color="success"
                      >
                        Montant
                      </IonLabel>

                      <IonLabel
                        style={{
                          borderRadius: "15px",
                          textAlign: "center",
                        }}
                        mode="md"
                        labelPlacement="floating"
                      >
                        {transaction.amount} Dinars
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel
                        style={{
                          borderRadius: "15px",
                          textAlign: "center",
                        }}
                        mode="md"
                        labelPlacement="floating"
                        color="success"
                      >
                        Mode de revenu
                      </IonLabel>

                      <IonLabel
                        style={{
                          borderRadius: "15px",
                          textAlign: "center",
                        }}
                        mode="md"
                        labelPlacement="floating"
                      >
                        {transaction.moyen}
                      </IonLabel>
                    </IonItem>

                    <IonItem>
                      <IonLabel
                        style={{
                          borderRadius: "15px",
                          textAlign: "center",
                        }}
                        mode="md"
                        labelPlacement="floating"
                        color="success"
                      >
                        Compte utilisé
                      </IonLabel>

                      <IonLabel
                        style={{
                          borderRadius: "15px",
                          textAlign: "center",
                        }}
                        mode="md"
                        labelPlacement="floating"
                      >
                        {transaction.nomCompte}
                      </IonLabel>
                    </IonItem>
                  </div>
                ))}
              </IonList>

              {/** */}
            </IonCardContent>
          </IonCard>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ViewRevenu;
