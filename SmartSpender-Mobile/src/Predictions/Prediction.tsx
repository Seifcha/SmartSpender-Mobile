import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonItem,
  IonIcon,
  IonGrid,
  IonRow,
  IonText,
  IonLabel,
  IonCol,
} from "@ionic/react";
import {
  shuffleOutline,
  trendingDownOutline,
  arrowForward,
  arrowBack,
  cashOutline,
  caretForwardOutline,
  trendingUpOutline,
  colorFill,
} from "ionicons/icons";
import React, { useState, useEffect } from "react";
import moment from "moment";
import transfert from "../../public/iconeSS.png";
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import Menu from "../components/Menu";
import { Line, Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";
import axios from "axios";
ChartJS.register(
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);
import myPredData from "./myPred.json";
type PredData = {
  ds: string;
  yhat: number;
  yhat_upper: number;
  yhat_lower: number;
};
import { ImArrowUpRight, ImArrowDownRight } from "react-icons/im";

const Prediction: React.FC = () => {
  const dateFormat = (date) => {
    moment.locale(); // Définissez la langue de Moment.js si nécessaire
    return moment(date).add(2, "hours").format("YYYY/MM/DD"); // Formatage de date avec Moment.js
  };
  const [predData, setPredData] = useState<PredData[]>([]);

  const [error, setError] = useState<string | null>(null);
  let userEmail;

  // Vérifier si le userEmail est présent dans le localStorage
  if (localStorage.getItem("userEmail")) {
    userEmail = localStorage.getItem("userEmail");
  }
  useEffect(() => {
    if (userEmail) {
      fetchData();

      const intervalId = setInterval(() => {
        fetchData();
      }, 100000); // Refresh every 0.75s

      return () => clearInterval(intervalId);
    }
  }, [userEmail]);
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://:9002/prediction/${userEmail}`);
      const data = response.data;
      console.log(data); // Vérifiez le format de la réponse

      // Convertir la chaîne JSON en objet JavaScript
      const predictionData = JSON.parse(data.prediction);
      console.log(predictionData); // Vérifiez l'objet JavaScript résultant

      // Extraire les données et les colonnes
      const dataArray = predictionData.data;
      const columns = predictionData.columns;

      // Créer un tableau de données avec les colonnes appropriées
      const formattedData = dataArray.map((entry) => {
        return Object.fromEntries(
          columns.map((col, index) => [col, entry[index]])
        );
      });

      console.log(formattedData); // Vérifiez les données formatées

      // Utiliser les données formatées
      setValues(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const [status, setStatus] = useState(false);
  const [values, setValues] = useState([]);
  if (values[0] > values[values.length - 1]) {
    setStatus(true);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ textAlign: "center" }}>
            Graphique de prédiction
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" scrollY={true}>
        <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "105vh",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "auto",
            }}
          >
            <div
              style={{
                transform: "rotate(-90deg)",
                width: "85vh",
                height: "100vh",
                // maxHeight: "200vh",
                overflow: "auto",
              }}
            >
              <IonText
                style={{
                  textAlign: "center",
                  marginRight: "20px",
                  margin: 0,
                }}
              >
                ­ ­ ­ Voici la prédiction de vos dépenses: ­­­ ­ ­ ­
              </IonText>
              {/* <IonButton onClick={handlePrediction}>Prédire</IonButton> */}
              {values.length > 0 && (
                <Line
                  data={{
                    labels: values.map((val) => {
                      return dateFormat(val.ds);
                    }),

                    datasets: [
                      {
                        label: "Prédictions",
                        data: values.map((val) => {
                          return val.yhat_upper;
                        }),
                        backgroundColor: "rgba(102, 204, 102, 0.2)", // Lime fill color
                        borderColor: "rgba(102, 204, 102, 1)", // Lime line color
                        pointBackgroundColor: "rgba(102, 204, 102, 1)", // Lime point color
                        pointBorderColor: "#fff", // White point border color
                        pointHoverBackgroundColor: "#fff", // White point hover color
                        pointHoverBorderColor: "rgba(102, 204, 102, 1)", // Lime point hover border color
                        // borderColor: Utils.CHART_COLORS.blue,
                        // backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue),
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    animation: {
                      duration: 1000,
                      easing: "easeOutQuint",
                    },

                    scales: {
                      x: {
                        ticks: {
                          color: "rgba(230,230,230,0.8)",
                          font: {
                            size: 12, // Ajuster la taille de la police pour les étiquettes x
                          },
                        },
                      },
                      y: {
                        ticks: {
                          callback: function (value, index, values) {
                            return value + " DT"; // Ajoutez le suffixe ' DT' à chaque valeur
                          },
                          color: "rgba(230,230,230,0.8)",
                          font: {
                            size: 12, // Ajuster la taille de la police pour les étiquettes y
                          },
                        },
                      },
                    },
                    tension: 0.4,
                    plugins: {
                      filler: {
                        propagate: false,
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </IonCol>
      </IonContent>
      <Menu />
    </IonPage>
  );
};

export default Prediction;
