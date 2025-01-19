import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonIcon,
  IonButton,
  IonBackButton,
  IonButtons,
  IonItem,
  IonSpinner,
  IonAvatar,
  IonLabel,
  IonList,
  IonInfiniteScroll,
  IonBadge,
  IonMenuButton,
  IonSearchbar,
  IonRefresherContent,
  IonRefresher,
  IonFab,
  IonFabButton,
  IonFabList,
  IonThumbnail,
  IonSkeletonText,
  IonListHeader,
  IonFooter,
} from "@ionic/react";
import {
  add,
  document,
  globe,
  colorPalette,
  chevronUpCircle,
} from "ionicons/icons";
import {
  createOutline,
  settingsOutline,
  notificationsOutline,
  homeOutline,
  caretForwardOutline,
  ellipsisVerticalOutline,
  pricetagsOutline,
  ellipsisHorizontalOutline,
} from "ionicons/icons";
import axios from "axios";
import Menu from "../Menu";
import Loading from "../Loading";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import { Link, useHistory } from "react-router-dom";
import DeleteCarte from "./DeleteCarte";
const HomeCarte: React.FC = () => {
  const history = useHistory();

  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(true); // État pour indiquer si le chargement est en cours ou non
  const [comptes, setComptes] = useState({});

  useEffect(() => {
    fetchData();
    fetchComptes();
    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 7418526); // Refresh every 0.75s

    // return () => clearInterval(intervalId);
  }, []);
  const [cartes, setCartes] = useState([]);

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

  const fetchComptes = async () => {
    try {
      const response = await axiosPrivate.get(`/comptes/${userEmail}`);
      const comptesMap = {};
      response.data.forEach((compte) => {
        console.log(compte);
        comptesMap[compte.idCompte] = compte;
      });
      setComptes(comptesMap);
    } catch (error) {
      console.error("Error fetching comptes:", error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://:9001/cartes/${userEmail}`);
      setCartes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // console.log(categories.isPublicInt);
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://:9001/carte/${id}`);
      setCartes(cartes.filter((carte) => carte.IdCarte !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const getCompteName = (compteId) => {
    return comptes[compteId] ? comptes[compteId].nomCompte : "Aucune";
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/gestions" />
            </IonButtons>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Liste des Cartes</IonTitle>
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
            {cartes.map((carte) => (
              <div
                key={carte.idCarte}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.3 vh",
                }}
              >
                <IonItem style={{ flex: "1" }}>
                  <IonLabel style={{ marginLeft: "1.2vh" }}>
                    {getCompteName(carte.idCompte)}
                  </IonLabel>
                  <IonLabel style={{ marginLeft: "1.2vh" }}>
                    {carte.numCarte}
                  </IonLabel>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "auto",
                    }}
                  >
                    <Link to={`/edit-carte/${carte.idCarte}`}>
                      <IonIcon color="success" icon={createOutline} />
                    </Link>
                    &nbsp;
                    <DeleteCarte id={carte.idCarte} onDelete={handleDelete} />
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
        <Link to={`/create-carte`}>
          <IonFabButton color="success">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </Link>
      </IonFab>
      <Menu />
    </IonPage>
  );
};

export default HomeCarte;
