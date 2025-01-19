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
const ViewDepense: React.FC = () => {
  const history = useHistory();
  const dateFormat = (date) => {
    moment.locale();
    return moment(date).format("YYYY/MM/DD");
  };
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

  const [values, setValues] = useState({
    createdAt: "",
    montant: null,
    dateDepense: null,
    recurrente: "",
    recurrenceOption: "",
    description: "",
    transactions: [{ moyen: "", nomCompte: "", nomCarte: "", amount: 0 }],
    nomCategorie: "",
    nomSousCategorie: "",
    nomFournisseur: "",
  });

  const { id } = useParams();

  useEffect(() => {
    fetchData();
    fetchData2();

    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 7418526); // Refresh every 0.75s

    // return () => clearInterval(intervalId);
  }, []);
  const fetchData = async () => {
    try {
      axios.get(`http://:9001/depense/${id}`).then((res) => {
        const data = res.data;
        console.log(data);
        setValues({
          ...values,
          createdAt: data.createdAt,
          dateDepense: data.dateDepense,
          recurrente: data.recurrente,
          recurrenceOption: data.recurrenceOption,
          description: data.description,
          montant: data.montant,
          nomCategorie: data.nomCategorie,
          nomSousCategorie: data.nomSousCategorie,
          nomFournisseur: data.nomFournisseur,
        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData2 = async () => {
    try {
      const res = await axios.get(`http://:9001/transactions/${id}`);
      console.log(res.data);
      setValues((prevValues) => ({
        ...prevValues,
        transactions: res.data,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [errorMessage, setErrorMessage] = useState("");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/depenses" />
          </IonButtons>
          <IonTitle>Consulter une dépense</IonTitle>
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
                  Récurrente
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
                  Date de dépense
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
                  ­­{dateFormat(values.dateDepense)}
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
                    Catégorie de dépense
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
              {values.nomSousCategorie != null && (
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
                    Sous-catégorie
                  </IonLabel>

                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                  >
                    {values.nomSousCategorie}
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
                  Montant total sorti
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
                        Mode de paiement
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

                    {transaction.nomCarte != "" && (
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
                          Carte utilisé
                        </IonLabel>

                        <IonLabel
                          style={{
                            borderRadius: "15px",
                            textAlign: "center",
                          }}
                          mode="md"
                          labelPlacement="floating"
                        >
                          {transaction.nomCarte}
                        </IonLabel>
                      </IonItem>
                    )}
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

export default ViewDepense;
