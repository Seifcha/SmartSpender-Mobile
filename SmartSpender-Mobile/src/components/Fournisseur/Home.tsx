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
  IonButtons,
  IonAvatar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonMenuButton,
  IonRefresher,
  IonRefresherContent,
  IonBackButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner,
  IonBadge,
  IonFabButton,
  IonFab,
  IonThumbnail,
  IonSkeletonText,
  IonListHeader,
} from "@ionic/react";
import Menu from "../Menu";
import Loading from "../Loading";
import {
  add,
  document,
  globe,
  colorPalette,
  chevronUpCircle,
} from "ionicons/icons";
import DeleteFournisseur from "./DeleteFournisseur";
import {
  trashOutline,
  createOutline,
  caretForwardOutline,
} from "ionicons/icons";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
const HomeFournisseur: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [items, setItems] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filteredFournisseurs, setFilteredFournisseurs] = useState([]);
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

  useEffect(() => {
    fetchData();

    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 952000); // Refresh every 0.75s

    // return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://:9001/fournisseurss/${userEmail}`
      );
      setFournisseurs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    const filtered = fournisseurs.filter((fournisseur) =>
      fournisseur.nom.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredFournisseurs(filtered);
  }, [searchText, fournisseurs]);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://:9001/fournisseurs/${id}`);
      setFournisseurs(
        fournisseurs.filter((fournisseur) => fournisseur.IdFournisseur !== id)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };
  const getImageSrc = (imageData: string, mimetype: string) => {
    const base64Prefix = `data:${mimetype};base64,`;
    return base64Prefix + imageData;
  };

  const generateItems = () => {
    const newItems = Array.from({ length: 10 }).map(
      (_, index) => `Item ${items.length + index}`
    );
    setItems([...items, ...newItems]);
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/gestions" />
          </IonButtons>
          <IonTitle>Liste des fournisseurs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={fetchData}>
          <IonRefresherContent />
        </IonRefresher>

        {loading ? (
          <Loading />
        ) : (
          <>
            <IonList>
              {fournisseurs.map((fournisseur) => (
                <IonItem key={fournisseur.id}>
                  <IonAvatar slot="start">
                    <img
                      alt="Embedded image"
                      src={getImageSrc(fournisseur.logo, fournisseur.mimetype)}
                    />
                  </IonAvatar>
                  <IonLabel>{fournisseur.nom}</IonLabel>
                  {fournisseur.valide ? (
                    <IonBadge
                      fill="clear"
                      color="medium"
                      style={{ marginLeft: "auto" }}
                    >
                      PUBLIC
                    </IonBadge>
                  ) : (
                    <>
                      <Link
                        to={`/edit-fournisseur/${fournisseur.IdFournisseur}`}
                      >
                        <IonIcon color="success" icon={createOutline} />
                      </Link>
                      &nbsp;
                      <IonButton
                        fill="clear"
                        color="warning"
                        onClick={() => handleDelete(fournisseur.IdFournisseur)}
                      >
                        <IonIcon icon={trashOutline} />
                      </IonButton>
                    </>
                  )}
                </IonItem>
              ))}
            </IonList>
          </>
        )}
        <IonFab
          slot="fixed"
          vertical="bottom"
          horizontal="end"
          style={{ bottom: "2vh", right: "2.5vh" }}
        >
          <Link to={`/create-fournisseur`}>
            <IonFabButton color="success">
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </Link>
        </IonFab>
      </IonContent>
      <Menu />
    </IonPage>
  );
};
export default HomeFournisseur;
