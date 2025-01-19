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
import moment from "moment";

import { Link, useHistory } from "react-router-dom";
import DeleteSeuil from "./DeleteSeuil";
const HomeSeuil: React.FC = () => {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(true); // État pour indiquer si le chargement est en cours ou non
  const [categories, setCategories] = useState({});
  const dateFormat = (date) => {
    moment.locale();
    return moment(date).endOf("day").fromNow();
  };
  useEffect(() => {
    fetchData();
    fetchCategorie();
    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 7418526); // Refresh every 0.75s

    // return () => clearInterval(intervalId);
  }, []);
  const [seuils, setSeuils] = useState([]);

  let userEmail;

  // Vérifier si le userEmail est présent dans le localStorage
  if (localStorage.getItem("userEmail")) {
    userEmail = localStorage.getItem("userEmail");
  }
  const fetchCategorie = async () => {
    try {
      const response = await axiosPrivate.get(
        `/categories-depenses/${userEmail}`
      );
      const categorieMap = {};
      response.data.forEach((categorie) => {
        console.log(categorie);
        categorieMap[categorie.IdCategorie] = categorie;
      });
      setCategories(categorieMap);
    } catch (error) {
      console.error("Error fetching categorie:", error);
    }
  };
  const getImageSrc = (imageData, mimetype) => {
    const base64Prefix = `data:${mimetype};base64,`;
    return base64Prefix + imageData;
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://:9001/seuilDepense/${userEmail}`
      );
      setSeuils(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching seuil:", error);
    }
  };
  console.log(seuils);

  const history = useHistory();
  // console.log(categories.isPublicInt);
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://:9001/seuil/${id}`);
      setSeuils(seuils.filter((seuil) => seuil.idSeuil !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const getCategorieName = (categorieId) => {
    return categories[categorieId]
      ? categories[categorieId].nomCategorie
      : "Aucune";
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
          <IonTitle>Liste des seuils</IonTitle>
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
            {seuils.map((seuil) => (
              <div
                key={seuil.idSeuil}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.3 vh",
                }}
              >
                <IonItem style={{ flex: "1" }}>
                  <IonLabel style={{ marginLeft: "1.2vh" }}>
                    {seuil.nomCategorieOuSousCategorie}
                  </IonLabel>
                  <IonLabel style={{ marginLeft: "1.2vh" }}>
                    {seuil.sommeMontants} / {seuil.montantSeuil}
                  </IonLabel>
                  <IonLabel style={{ marginLeft: "1.2vh" }}>
                    {dateFormat(seuil.dateFin)}
                  </IonLabel>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    &nbsp;
                    <DeleteSeuil id={seuil.idSeuil} onDelete={handleDelete} />
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
        <Link to={`/create-seuil`}>
          <IonFabButton color="success">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </Link>
      </IonFab>
      <Menu />
    </IonPage>
  );
};

export default HomeSeuil;
