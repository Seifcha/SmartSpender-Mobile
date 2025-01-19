import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  IonTextarea,
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonToggle,
  IonLabel,
  useIonAlert,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonCardHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonBackButton,
  IonNote,
  IonButtons,
  IonDatetime,
  IonModal,
  IonDatetimeButton,
  IonList,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import {
  add,
  cloudUploadOutline,
  checkmarkSharp,
  arrowForwardOutline,
  addOutline,
  closeOutline,
} from "ionicons/icons";
import "../intro.css";
import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS
import { axiosPrivate } from "../../api/axios";

const SwiperButtonNext = ({ children }: any) => {
  const swiper = useSwiper();
  return (
    <IonButton
      size="large"
      fill="solid"
      shape="round"
      expand="block"
      color="success"
      style={{ width: "100%" }}
      onClick={() => swiper.slideNext()}
    >
      {children}
    </IonButton>
  );
};

const AddRevenu: React.FC = () => {
  const [description, setDescription] = useState("");
  const [DeCompte, setDeCompte] = useState("");
  const history = useHistory();
  let userEmail;

  // Vérifier si le userEmail est présent dans le localStorage
  if (localStorage.getItem("userEmail")) {
    userEmail = localStorage.getItem("userEmail");
  }
  const [VersCompte, setVersCompte] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const currentDate = new Date().toISOString();
  const [dateTransfert, setDateTransfert] = useState(currentDate);

  const [compteOptions, setCompteOptions] = useState([]);

  const [montant, setMontant] = useState<number | null>(null);

  useEffect(() => {
    // Charger les catégories de dépenses depuis l'API
    axiosPrivate
      .get(`/comptes/${userEmail}`)
      .then((response) => {
        setCompteOptions(response.data);
      })
      .catch((error) => {
        console.log("erreur dans l'api des comptes");
      });
  }, []);

  const handleDateChange = (event) => {
    setDateTransfert(event.detail.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axiosPrivate.post("/transfert", {
        description,
        dateTransfert,
        montant,
        DeCompte,
        VersCompte,
        userEmail,
      });
      console.log("succeeded");

      setDescription("");
      setDateTransfert("");
      setDeCompte("");
      setVersCompte("");
      setMontant(null);
      setErrorMessage("");
      history.push("/transferts");
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "Une erreur s'est produite lors de l'ajout de la dépense. Veuillez réessayer."
        );
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/transferts" />
          </IonButtons>
          <IonTitle>Déclarer un transfert</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={true} className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center"></IonRow>

          <IonCard>
            <IonCardContent>
              {errorMessage && (
                <IonItem color="danger">
                  <IonLabel>{errorMessage}</IonLabel>
                </IonItem>
              )}
              <IonItem className="ion-margin-top">
                <IonTextarea
                  style={{
                    boxShadow:
                      "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  autoGrow={true}
                  mode="md"
                  labelPlacement="floating"
                  label={"­ Description:"}
                  color="success"
                  value={description}
                  onIonChange={(e) => setDescription(e.detail.value!)}
                />
              </IonItem>
              <IonItem className="ion-margin-top">
                <IonLabel>Date de transfert:</IonLabel>
                <IonDatetimeButton datetime="datetime"></IonDatetimeButton>

                <IonModal keepContentsMounted={true} color="success">
                  <IonDatetime
                    color="success"
                    id="datetime"
                    presentation="date"
                    value={dateTransfert}
                    onIonChange={handleDateChange}
                    max={new Date().toISOString()}
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

              <IonItem>
                <IonLabel>Du compte :</IonLabel>
                <IonSelect
                  color="success"
                  placeholder="Sélectionner le compte"
                  onIonChange={(e) => setDeCompte(e.detail.value!)}
                >
                  {compteOptions.map((option) => (
                    <IonSelectOption
                      key={option.idCompte}
                      value={option.idCompte}
                    >
                      {option.nomCompte}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem>
                <IonLabel>Vers compte :</IonLabel>
                <IonSelect
                  color="success"
                  placeholder="Sélectionner le compte"
                  onIonChange={(e) => setVersCompte(e.detail.value!)}
                >
                  {compteOptions.map((option) => (
                    <IonSelectOption
                      key={option.idCompte}
                      value={option.idCompte}
                    >
                      {option.nomCompte}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonInput
                  style={{
                    boxShadow:
                      "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  color="success"
                  labelPlacement="floating"
                  label={"­ Montant:"}
                  type="number"
                  placeholder="Montant"
                  value={montant ? montant.toString() : ""}
                  onIonChange={(e) => setMontant(parseFloat(e.detail.value!))}
                />
                <IonNote slot="end" className="ion-margin-top">
                  Dinars
                </IonNote>
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
            onClick={(e) => {
              handleSubmit(e);
            }}
            style={{ marginBottom: "16px" }}
          >
            <IonIcon slot="end" icon={checkmarkSharp} />
            Déclarer
          </IonButton>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default AddRevenu;
