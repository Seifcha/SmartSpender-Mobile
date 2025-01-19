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
import { Link, useHistory } from "react-router-dom";
import DeleteCompte from "./DeleteCompte";
const HomeCompte: React.FC = () => {
  const [loading, setLoading] = useState(true); // État pour indiquer si le chargement est en cours ou non
  useEffect(() => {
    fetchData();

    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 7418526); // Refresh every 0.75s

    // return () => clearInterval(intervalId);
  }, []);
  const [comptes, setComptes] = useState([]);

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

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://:9001/comptes/${userEmail}`);

      setComptes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // console.log(categories.isPublicInt);
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://:9001/compte/${id}`);
      setComptes(comptes.filter((compte: any) => compte.idCompte !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
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
          <IonTitle>Liste des comptes</IonTitle>
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
            {comptes.map((compte) => (
              <div
                key={compte.idCompte}
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
                      maxWidth: "130px", // Pour ajuster la largeur en fonction du contenu
                      height: "fit-content", // Pour ajuster la hauteur en fonction du contenu
                      boxShadow:
                        "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    {compte.solde} Dinars
                  </IonLabel>

                  <IonLabel style={{ marginLeft: "1.2vh" }}>
                    {compte.nomCompte}
                  </IonLabel>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "auto",
                    }}
                  >
                    <Link to={`/edit-compte/${compte.idCompte}`}>
                      <IonIcon color="success" icon={createOutline} />
                    </Link>
                    &nbsp;
                    <DeleteCompte
                      id={compte.idCompte}
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
        <Link to={`/create-compte`}>
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
