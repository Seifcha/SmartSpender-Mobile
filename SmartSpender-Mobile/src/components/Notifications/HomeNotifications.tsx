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
  IonNote,
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
import moment from "moment";
import "moment/locale/fr";
import { axiosPrivate } from "../../api/axios";

const HomeCategorieDepense: React.FC = () => {
  const dateFormat = (date) => {
    moment.locale("fr");
    return moment(date).startOf("hour").fromNow();
  };
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  let userEmail;

  const checkUserLoggedIn = () => {
    userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      history.push("/login");
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
    fetchData();
  }, [history]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://:9001/notifications/${userEmail}`
      );
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://:9001/categories-depenses/${id}`);
      setCategories(
        categories.filter((categorie) => categorie.idNotification !== id)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleItemClick = async (id) => {
    try {
      const response = await axiosPrivate.put(`/notifications${id}`);
      console.log("succeeded");
    } catch (error) {
      console.error("Error adding categorie", error);
    }

    history.push(`notification${id}`);
  };

  const handleRefresh = (event) => {
    fetchData().then(() => {
      event.detail.complete();
    });
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
          <IonTitle>Notifications</IonTitle>
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
                key={categorie.idNotification}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.3 vh",
                }}
              >
                <IonItem style={{ flex: "1" }} className="ion-margin-top">
                  <IonAvatar
                    slot="start"
                    onClick={() =>
                      handleItemClick(`${categorie.idNotification}`)
                    }
                  >
                    {categorie.image === null ? (
                      <img alt="Embedded image" src={iconeSS} />
                    ) : (
                      <img
                        alt="Embedded image"
                        src={getImageSrc(categorie.image, categorie.mimetype)}
                      />
                    )}
                  </IonAvatar>
                  <div style={{ marginLeft: "1.2vh", flex: "1" }}>
                    <IonLabel
                      onClick={() =>
                        handleItemClick(`/${categorie.idNotification}`)
                      }
                    >
                      <h2
                        style={{
                          fontSize: "1.2em",
                          fontWeight: "bold",
                          color: "#dddddd",
                          marginBottom: "0.2vh",
                        }}
                      >
                        {categorie.nomFournisseur != null
                          ? categorie.nomFournisseur
                          : `SmartSpender`}
                      </h2>
                    </IonLabel>
                    <IonLabel
                      onClick={() =>
                        handleItemClick(`/${categorie.idNotification}`)
                      }
                    >
                      <h3
                        style={{
                          fontSize: "1em",
                          // fontWeight: "bold",
                          color: "#cbcbcb",
                          marginBottom: "0.2vh",
                        }}
                      >
                        {categorie.title}
                      </h3>
                    </IonLabel>
                  </div>

                  <p
                    style={{ fontSize: "0.8em", color: "#808080" }}
                    onClick={() =>
                      handleItemClick(`/${categorie.idNotification}`)
                    }
                  >
                    {dateFormat(categorie.createdAt)}
                  </p>
                  <div
                    onClick={() =>
                      handleItemClick(`/${categorie.idNotification}`)
                    }
                  >
                    {categorie.vu === 1 ? (
                      <>
                        <div className="circleswrap">
                          <div className="circlediv">
                            <div className="circle">
                              <div id="animateddiv1">
                                <IonBadge
                                  fill="clear"
                                  style={{ marginLeft: "auto" }}
                                >
                                  ­{" "}
                                </IonBadge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "auto",
                        }}
                      >
                        <IonNote>­ Vu</IonNote>
                        &nbsp;
                      </div>
                    )}
                  </div>
                </IonItem>
              </div>
            ))}
          </IonList>
        )}
      </IonContent>

      <Menu />
    </IonPage>
  );
};

export default HomeCategorieDepense;
