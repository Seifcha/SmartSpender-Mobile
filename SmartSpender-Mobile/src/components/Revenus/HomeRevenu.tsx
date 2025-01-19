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
  refresh,
} from "ionicons/icons";
import {
  eyeOutline,
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
import DeleteRevenu from "./DeleteRevenu";
import moment from "moment";

const HomeRevenu: React.FC = () => {
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
  const [revenus, setRevenus] = useState([]);

  let userEmail;

  // Vérifier si le userEmail est présent dans le localStorage
  if (localStorage.getItem("userEmail")) {
    userEmail = localStorage.getItem("userEmail");
  }
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://:9001/revenus/${userEmail}`);
      setRevenus(response.data);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const history = useHistory();
  // console.log(categories.isPublicInt);
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://:9001/revenu/${id}`);
      setRevenus(revenus.filter((depense: any) => depense.idRevenu !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  const handleItemClick = (route) => {
    history.push(`view-revenu${route}`); // Redirige vers la route spécifiée
  };
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
          <IonTitle>Liste des Revenus</IonTitle>
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
            {revenus.map((revenu) => (
              <div
                key={revenu.idRevenu}
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
                    {revenu.montant} DT
                  </IonLabel>
                  {"­  "}
                  <IonLabel style={{ marginLeft: "1.2vh" }}>
                    {dateFormat(revenu.dateRevenu)}
                  </IonLabel>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "auto",
                    }}
                  >
                    <Link to={`/view-revenu/${revenu.idRevenu}/`}>
                      <IonIcon color="success" icon={eyeOutline} />
                    </Link>
                    &nbsp;
                    <DeleteRevenu
                      id={revenu.idRevenu}
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
        <Link to={`/create-revenu`}>
          <IonFabButton color="success">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </Link>
      </IonFab>
      <Menu />
    </IonPage>
  );
};

export default HomeRevenu;
