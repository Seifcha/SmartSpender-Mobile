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
  caretForwardOutline,
  ellipsisVerticalOutline,
  pricetagsOutline,
  ellipsisHorizontalOutline,
} from "ionicons/icons";
import Menu from "../Menu";
import Loading from "../Loading";
import axios from "axios";
import { useParams, useHistory, Link } from "react-router-dom";
import DeleteSousCategorieDepense from "./DeleteSousCateogrie";
const HomeSousCategorieDepense: React.FC = () => {
  const [loading, setLoading] = useState(true); // État pour indiquer si le chargement est en cours ou non
  useEffect(() => {
    fetchData();

    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 7418526); // Refresh every 0.75s

    // return () => clearInterval(intervalId);
  }, []);
  const { id } = useParams();
  const [sousCategories, setSousCategories] = useState([]);
  const getImageSrc = (imageData, mimetype) => {
    const base64Prefix = `data:${mimetype};base64,`;
    return base64Prefix + imageData;
  };
  let userEmail;

  // Vérifier si le userEmail est présent dans le localStorage
  if (localStorage.getItem("userEmail")) {
    userEmail = localStorage.getItem("userEmail");
  }
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://:9001/sous-categories-depenses/${userEmail}/${id}`
      );
      console.log(response.data);
      setSousCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(sousCategories.validated);
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://:9001/sous-categories-depenses/${id}`);
      setSousCategories(
        sousCategories.filter(
          (sousCategorie) => sousCategorie.IdSousCategorie !== id
        )
      );
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
              <IonBackButton defaultHref={`/categories-depenses`} />
            </IonButtons>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Les sous catégories de dépenses</IonTitle>
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
            {sousCategories.map((sousCategorie) => (
              <div
                key={sousCategorie.IdSousCategorie}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <IonItem style={{ flex: "1" }}>
                  <IonAvatar slot="start">
                    <img
                      alt="Embedded image"
                      src={getImageSrc(
                        sousCategorie.image,
                        sousCategorie.mimetype
                      )}
                    />
                  </IonAvatar>
                  <IonLabel style={{ marginLeft: "10px" }}>
                    {sousCategorie.nomSousCategorie}
                  </IonLabel>

                  {sousCategorie.validated === 1 ? (
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
                        to={`/edit-sous-categorie-depense/${id}/${sousCategorie.IdSousCategorie}`}
                      >
                        <IonIcon color="success" icon={createOutline} />
                      </Link>
                      &nbsp;
                      <DeleteSousCategorieDepense
                        id={sousCategorie.IdSousCategorie}
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
        style={{ bottom: "8vh", right: "25px" }}
      >
        <Link to={`/create-sous-categorie/${id}`}>
          <IonFabButton color="success">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </Link>
      </IonFab>
      <Menu />
    </IonPage>
  );
};

export default HomeSousCategorieDepense;
