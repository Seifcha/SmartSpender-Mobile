import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonLabel,
  IonItem,
  IonGrid,
  IonRow,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import moment from "moment";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewTransfert: React.FC = () => {
  const { id } = useParams();
  const [values, setValues] = useState({
    createdAt: "",
    dateTransfert: "",
    description: "",
    deCompteNom: "", // Nouveau champ pour le nom du compte
    versCompteNom: "", // Nouveau champ pour le nom du compte
    montant: null,
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://:9001/transfert/${id}`);
      const data = res.data;
      setValues({
        createdAt: data.createdAt,
        dateTransfert: data.dateTransfert,
        description: data.description,
        deCompteNom: data.deCompteNom, // Utilisation du nom du compte
        versCompteNom: data.versCompteNom, // Utilisation du nom du compte
        montant: data.montant,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const dateFormat = (date) => {
    moment.locale();
    return moment(date).format("YYYY/MM/DD");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/transferts" />
          </IonButtons>
          <IonTitle>Consulter un transfert</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={true} className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center"></IonRow>
          <IonCard>
            <IonCardContent>
              {values.description != "" && (
                <IonItem>
                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                    color="success"
                  >
                    Déscription
                  </IonLabel>

                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                  >
                    ­­{values.description}
                  </IonLabel>
                </IonItem>
              )}

              <IonItem>
                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                  color="success"
                >
                  Date de déclaration
                </IonLabel>

                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                >
                  {dateFormat(values.createdAt)}
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                  color="success"
                >
                  Date de transfert
                </IonLabel>

                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                >
                  {dateFormat(values.dateTransfert)}
                </IonLabel>
              </IonItem>
              {values.deCompteNom != "" && (
                <IonItem>
                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                    color="success"
                  >
                    Du compte
                  </IonLabel>

                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                  >
                    ­­{values.deCompteNom}
                  </IonLabel>
                </IonItem>
              )}

              {values.versCompteNom != "" && (
                <IonItem>
                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                    color="success"
                  >
                    Vers le compte
                  </IonLabel>

                  <IonLabel
                    style={{
                      borderRadius: "15px",
                      textAlign: "center",
                    }}
                    mode="md"
                    labelPlacement="floating"
                  >
                    {" "}
                    ­­{values.versCompteNom}
                  </IonLabel>
                </IonItem>
              )}

              <IonItem>
                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                  color="success"
                >
                  Montant transféré
                </IonLabel>

                <IonLabel
                  style={{
                    borderRadius: "15px",
                    textAlign: "center",
                  }}
                  mode="md"
                  labelPlacement="floating"
                >
                  ­­{values.montant} Dinars
                </IonLabel>
              </IonItem>
            </IonCardContent>
          </IonCard>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ViewTransfert;
