import React, { useState, useEffect } from "react";
import iconeSS from "../../../public/iconeSS.png";

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
  IonText,
} from "@ionic/react";
import moment from "moment";

import { useParams, useHistory } from "react-router-dom";
import {
  cloudUploadOutline,
  checkmarkSharp,
  notifications,
} from "ionicons/icons";
import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS
import axios from "axios";
import { axiosPrivate } from "../../api/axios";
const ViewNotification: React.FC = () => {
  const history = useHistory();
  const dateFormat = (date) => {
    moment.locale();
    return moment(date).format("YYYY/MM/DD, à hh:mm:ss");
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
    }, 300); // Rafraîchir toutes les 0.3 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
  }, [history]); // Utilisation de useEffect avec history comme dépendance pour écouter les changements de route

  const [values, setValues] = useState({
    createdAt: "",
    fournisseur: "",
    title: "",
    body: "",
    logo: "",
    idDepense: 0,
    idRevenu: 0,
    type: "",
    mimetype: "",
  });

  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://:9001/notification/${id}`);
      const data = res.data;
      console.log(data);
      setValues({
        ...values,
        createdAt: data.createdAt,
        fournisseur: data.nomFournisseur,
        title: data.title,
        body: data.body,
        logo: data.image,
        idDepense: data.idDepense,
        idRevenu: data.idRevenu,
        type: data.type,
        mimetype: data.mimetype || "",
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getImageSrc = (imageData, mimetype) => {
    const base64Prefix = `data:${mimetype};base64,`;
    return base64Prefix + imageData;
  };

  useEffect(() => {
    checkUserLoggedIn(); // Vérification initiale lors du montage du composant

    const interval = setInterval(() => {
      checkUserLoggedIn(); // Vérification périodique
    }, 30); // Rafraîchir toutes les 0.3 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
  }, [history]); // Utilisation de useEffect avec history comme dépendance pour écouter les changements de route

  const [depense, setDepense] = useState({
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

  useEffect(() => {
    if (values.idDepense) {
      // Check if idDepense is not null
      fetchData1();
      fetchData2();
    }
  }, [values.idDepense]); // Dependency on idDepense

  const fetchData1 = async () => {
    try {
      const res = await axios.get(`http://:9001/depense/${values.idDepense}`);
      const data = res.data;
      console.log("bonoju", data);
      setDepense({
        ...depense,
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData2 = async () => {
    try {
      const res = await axios.get(
        `http://:9001/transactions/${values.idDepense}`
      );
      console.log(res.data);
      setDepense((prevValues) => ({
        ...prevValues,
        transactions: res.data,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [errorMessage, setErrorMessage] = useState("");
  const [revenu, setRevenu] = useState({
    createdAt: "",
    montant: null,
    dateRevenu: null,
    recurrent: "",
    recurrenceOption: "",
    description: "",
    transactions: [{ moyen: "", nomCompte: "", nomCarte: "", amount: 0 }],
    nomCategorie: "",
    nomSousCategorie: "",
    nomFournisseur: "",
  });

  useEffect(() => {
    if (values.idRevenu) {
      // Check if idRevenu is not null
      fetchData3();
      fetchData4();
    }
  }, [values.idRevenu]); // Dependency on idRevenu

  const fetchData3 = async () => {
    try {
      const res = await axios.get(`http://:9001/revenu/${values.idRevenu}`);
      const data = res.data;
      console.log("bonoju", data);
      setRevenu({
        ...revenu,
        createdAt: data.createdAt,
        dateRevenu: data.dateRevenu,
        recurrent: data.recurrent,
        recurrenceOption: data.recurrenceOption,
        description: data.description,
        montant: data.montant,
        nomCategorie: data.nomCategorie,
        nomSousCategorie: data.nomSousCategorie,
        nomFournisseur: data.nomFournisseur,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchData4 = async () => {
    try {
      const res = await axios.get(
        `http://:9001/transactions/${values.idRevenu}`
      );
      console.log(res.data);
      setRevenu((prevValues) => ({
        ...prevValues,
        transactions: res.data,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/Notifs" />
          </IonButtons>
          <IonTitle>Notification</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={true} className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center"></IonRow>

          <IonCard>
            <IonCardContent>
              <IonItem>
                <IonLabel
                  color="success"
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                >
                  <h2
                    style={{
                      fontSize: "1.3em",
                      fontWeight: "bold",
                      color: "#dddddd",
                      marginBottom: "0.2vh",
                    }}
                  >
                    {values.fournisseur != null
                      ? values.fournisseur
                      : `SmartSpender`}
                  </h2>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel
                  style={{
                    borderRadius: "15px",
                    // textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                >
                  <h2
                    style={{
                      fontSize: "1em",
                      fontWeight: "bold",
                      color: "#dddddd",
                      marginBottom: "0.2vh",
                    }}
                  >
                    {values.title}{" "}
                  </h2>
                </IonLabel>
              </IonItem>

              <IonItem>
                <IonLabel
                  style={{
                    borderRadius: "15px",
                    // textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                >
                  {values.body}
                </IonLabel>
              </IonItem>

              <IonLabel
                style={{
                  borderRadius: "15px",
                  // textAlign: "center",
                }}
                mode="md"
                labelPlacement="floating"
                color="success"
              >
                Réçue le :
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

              {values.idDepense != null && (
                <div>
                  {" "}
                  <IonButtons>
                    <IonButton color="primary">
                      Supprimer la récurrence
                    </IonButton>
                  </IonButtons>
                </div>
              )}
              {values.idRevenu != null && (
                <div>
                  {" "}
                  <IonButtons>
                    <IonButton
                      color="primary"
                      style={{ left: "50%", right: "50%" }}
                    >
                      Supprimer la récurrence
                    </IonButton>
                  </IonButtons>
                </div>
              )}
            </IonCardContent>
          </IonCard>
          {values.idRevenu != null && values.idRevenu != 0 && (
            <IonCard>
              <IonCardContent>
                <div>
                  <IonLabel>
                    <IonText
                      className="ion-justify-content-center ion-padding ion-center"
                      style={{
                        fontWeight: "bold",
                        fontSize: "1em",
                        fontStyle: "italic",
                        textAlign: "center",
                      }}
                    >
                      Voici les détails de la dépense :
                    </IonText>
                  </IonLabel>
                </div>
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
                    Oui
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
                    Chaque ­­{revenu.recurrenceOption}
                  </IonLabel>
                </IonItem>

                {revenu.description != "" && (
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
                      {revenu.description}
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
                    ­­{dateFormat(revenu.createdAt)}
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
                    ­­{dateFormat(revenu.dateRevenu)}
                  </IonLabel>
                </IonItem>
                {revenu.nomCategorie != null && (
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
                      {revenu.nomCategorie}
                    </IonLabel>
                  </IonItem>
                )}
                {revenu.nomSousCategorie != null && (
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
                      {revenu.nomSousCategorie}
                    </IonLabel>
                  </IonItem>
                )}
                {revenu.nomFournisseur != null && (
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
                      {revenu.nomFournisseur}
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
                    {revenu.montant} Dinars
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
                  {revenu.transactions.map((transaction, index) => (
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
          )}
          {values.idDepense != null && values.idDepense != 0 && (
            <IonCard>
              <IonCardContent>
                <div>
                  <IonLabel>
                    <IonText
                      className="ion-justify-content-center ion-padding ion-center"
                      style={{
                        fontWeight: "bold",
                        fontSize: "1em",
                        fontStyle: "italic",
                        textAlign: "center",
                      }}
                    >
                      Voici les détails de la dépense :
                    </IonText>
                  </IonLabel>
                </div>
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
                    Oui
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
                    Chaque ­­{depense.recurrenceOption}
                  </IonLabel>
                </IonItem>

                {depense.description != "" && (
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
                      {depense.description}
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
                    ­­{dateFormat(depense.createdAt)}
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
                    ­­{dateFormat(depense.dateDepense)}
                  </IonLabel>
                </IonItem>
                {depense.nomCategorie != null && (
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
                      {depense.nomCategorie}
                    </IonLabel>
                  </IonItem>
                )}
                {depense.nomSousCategorie != null && (
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
                      {depense.nomSousCategorie}
                    </IonLabel>
                  </IonItem>
                )}
                {depense.nomFournisseur != null && (
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
                      {depense.nomFournisseur}
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
                    {depense.montant} Dinars
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
                  {depense.transactions.map((transaction, index) => (
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
          )}

          <div className="ion-text-center ion-padding">
            {values.logo != null ? (
              <img
                alt="Embedded image"
                src={getImageSrc(values.logo, values.mimetype)}
                style={{
                  width: "50%",
                  borderRadius: "50%",
                  border: "solid",
                }}
              />
            ) : (
              <img
                alt="Embedded image"
                src={iconeSS}
                style={{
                  width: "50%",
                  borderRadius: "50%",
                  border: "solid",
                }}
              />
            )}
          </div>
        </IonGrid>
      </IonContent>{" "}
    </IonPage>
  );
};

export default ViewNotification;
