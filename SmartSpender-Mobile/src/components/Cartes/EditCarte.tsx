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
  IonList,
  IonCardHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonBackButton,
  IonButtons,
  IonNote,
  IonSelect,
  IonDatetime,
  IonModal,
  IonDatetimeButton,
  IonSelectOption,
} from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Importez le hook useAuth
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { cloudUploadOutline, checkmarkSharp } from "ionicons/icons";
import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS
import axios from "axios";

const AddCategorieDepense: React.FC = () => {
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

  const { id } = useParams();
  const [values, setValues] = useState({
    numCarte: null,
    titulaire: "",
    typeCarte: "",
    dateExpiration: "",
    compteOption: "",
  });

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      axios.get(`http://:9001/carte/${id}`).then((res) => {
        const data = res.data;
        setValues({
          ...values,
          numCarte: data.numCarte,
          titulaire: data.titulaire,
          typeCarte: data.typeCarte,
          dateExpiration: data.dateExpiration,
          compteOption: data.compteOption,
        });
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const axiosPrivate = useAxiosPrivate();
  const [titulaire, setTitulaire] = useState("");
  const [typeCarte, setTypeCarte] = useState("");
  const [numCarte, setNumCarte] = useState("");
  const [dateExpiration, setDateExpiration] = useState("");
  const [compteOption, setCompteOption] = useState([]);
  useEffect(() => {
    // Charger les catégories de dépenses depuis l'API
    axiosPrivate
      .get(`/comptes/{id}`)
      .then((response) => {
        setCompteOption(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories de dépenses:", error);
      });
  }, []);

  const [errorMessage, setErrorMessage] = useState("");
  const handleDateChange = (event) => {
    const newDate = event.detail.value; // Obtenez la nouvelle date sélectionnée
    setValues((prevValues) => ({
      ...prevValues,
      dateExpiration: newDate, // Mettez à jour la date d'expiration dans le state values
    }));
  };

  const handleCompte = (e) => {
    setCompteOption(e);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { numCarte, typeCarte, titulaire, dateExpiration, compteOption } =
      values;
    if (!numCarte.trim()) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }

    let formData = new FormData();

    formData.append("userEmail", userEmail);
    formData.append("dateExpiration", dateExpiration);

    try {
      const response = await axiosPrivate.put(`/carte/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      console.log("succeeded");
      setErrorMessage("");
      history.push("/cartes");
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
            <IonBackButton defaultHref="cartes" />
          </IonButtons>
          <IonTitle>Modifier date d'éxpiration du carte</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={true} className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center"></IonRow>

          <IonCard>
            <IonCardContent>
              <IonItem>
                <IonLabel>Date d'éxpiration:</IonLabel>
                <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
                <IonModal keepContentsMounted={true} color="success">
                  <IonDatetime
                    color="success"
                    id="datetime"
                    presentation="date"
                    value={values.dateExpiration}
                    onIonChange={handleDateChange} // Utilisez handleDateChange pour gérer les changements de date
                    formatOptions={{
                      date: {
                        weekday: "short",
                        month: "long",
                        day: "2-digit",
                      },
                      time: {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    }}
                  ></IonDatetime>
                </IonModal>
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

export default AddCategorieDepense;
