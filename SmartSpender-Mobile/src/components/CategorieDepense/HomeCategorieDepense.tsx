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
import DeleteCategorieDepense from "./DeleteCategorieDepense";
const HomeCategorieDepense: React.FC = () => {
  const history = useHistory();

  const [loading, setLoading] = useState(true); // État pour indiquer si le chargement est en cours ou non
  useEffect(() => {
    fetchData();

    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 7418526); // Refresh every 0.75s

    // return () => clearInterval(intervalId);
  }, []);
  const [categories, setCategories] = useState([]);
  const getImageSrc = (imageData, mimetype) => {
    const base64Prefix = `data:${mimetype};base64,`;
    return base64Prefix + imageData;
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
  // console.log(categories.isPublicInt);
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://:9001/categories-depenses/${id}`);
      setCategories(
        categories.filter((categorie) => categorie.IdCategorie !== id)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  const handleItemClick = (route) => {
    history.push(`sous-categories${route}`); // Redirige vers la route spécifiée
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
          <IonTitle>Liste des Catégories de Dépenses</IonTitle>
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
            {categories.map((categorie) => (
              <div
                key={categorie.IdCategorie}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.3 vh",
                }}
              >
                <IonItem style={{ flex: "1" }}>
                  <IonAvatar
                    slot="start"
                    onClick={() => handleItemClick(`/${categorie.IdCategorie}`)}
                  >
                    <img
                      alt="Embedded image"
                      src={getImageSrc(categorie.image, categorie.mimetype)}
                    />
                  </IonAvatar>
                  <IonLabel
                    style={{ marginLeft: "1.2vh" }}
                    onClick={() => handleItemClick(`/${categorie.IdCategorie}`)}
                  >
                    {categorie.nomCategorie}
                  </IonLabel>

                  {categorie.validated === 1 ? (
                    <IonBadge
                      fill="clear"
                      color="medium"
                      style={{ marginLeft: "auto" }}
                    >
                      PUBLIQUE
                    </IonBadge>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "auto",
                      }}
                    >
                      <Link
                        to={`/edit-categorie-depense/${categorie.IdCategorie}`}
                      >
                        <IonIcon color="success" icon={createOutline} />
                      </Link>
                      &nbsp;
                      <DeleteCategorieDepense
                        id={categorie.IdCategorie}
                        onDelete={handleDelete}
                      />
                    </div>
                  )}
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
        <Link to={`/create-categorie-depense`}>
          <IonFabButton color="success">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </Link>
      </IonFab>
      <Menu />
    </IonPage>
  );
};

export default HomeCategorieDepense;
