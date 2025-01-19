import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonRefresherContent,
  IonRefresher,
  IonFab,
  IonFabButton,
} from "@ionic/react";
import {
  add,
  eyeOutline,
  globe,
  colorPalette,
  chevronUpCircle,
} from "ionicons/icons";
import { createOutline } from "ionicons/icons";
import axios from "axios";
import Menu from "../Menu";
import Loading from "../Loading";
import { Link, useHistory } from "react-router-dom";
import DeleteDepense from "./DeleteDepense";
import moment from "moment";

const HomeCompte: React.FC = () => {
  const history = useHistory();

  const dateFormat = (date) => {
    moment.locale();
    return moment(date).format("YYYY/MM/DD");
  };
  const [loading, setLoading] = useState(true); // État pour indiquer si le chargement est en cours ou non
  useEffect(() => {
    fetchData();

    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 7418526); // Refresh every 0.75s

    // return () => clearInterval(intervalId);
  }, []);
  const [depenses, setDepenses] = useState([]);

  // let userEmail;
  // useEffect(() => {
  //   userEmail = localStorage.getItem("userEmail");
  //   if (!userEmail) {
  //     // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
  //     history.push("/login");
  //   }
  // }, []);

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

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://:9001/depenses/${userEmail}`);

      setDepenses(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(depenses);
  // console.log(categories.isPublicInt);
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://:9001/depense/${id}`);
      setDepenses(depenses.filter((depense: any) => depense.idDepense !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  let i = 0;
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" />
            </IonButtons>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Liste des dépenses</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={fetchData}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <Loading />
        ) : (
          <IonList>
            {depenses.map((depense) => (
              <div
                key={depense.idDepense}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.3 vh",
                }}
              >
                <IonItem style={{ flex: "1" }}>
                  <IonLabel
                    style={{
                      marginLeft: "1.2vh",
                      padding: "8px", // Ajustez la valeur du padding selon vos besoins
                      maxWidth: "100px", // Pour ajuster la largeur en fonction du contenu
                      height: "fit-content", // Pour ajuster la hauteur en fonction du contenu
                      boxShadow:
                        "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    {depense.montant} DT
                  </IonLabel>
                  {"­  "}
                  <IonLabel style={{ marginLeft: "1.2vh" }}>
                    {dateFormat(depense.dateDepense)}
                  </IonLabel>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "auto",
                    }}
                  >
                    <Link to={`/view-depense/${depense.idDepense}/`}>
                      <IonIcon color="success" icon={eyeOutline} />
                    </Link>
                    &nbsp;
                    <DeleteDepense
                      id={depense.idDepense}
                      onDelete={handleDelete}
                    />
                  </div>
                </IonItem>
              </div>
            ))}
          </IonList>
        )}
      </IonContent>

      <IonFab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        style={{ bottom: "8vh", right: "2.5vh" }}
      >
        <Link to={"/create-depense"}>
          <IonFabButton color="success">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </Link>
      </IonFab>
      <Menu />
    </IonPage>
  );
};

export default HomeCompte;
