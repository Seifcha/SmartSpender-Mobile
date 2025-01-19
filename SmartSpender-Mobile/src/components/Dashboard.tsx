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
import "chartjs-adapter-date-fns";
import moment from "moment";

import React, { useState, useEffect } from "react";
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
  ArcElement,
  TimeScale,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale
);
import { de } from "date-fns/locale";

const Dashboard: React.FC = () => {
  const incomes = [
    { date: new Date("2024-03-27T00:00:00"), amount: 200 },
    { date: new Date("2024-07-28T00:00:00"), amount: 400 },
    { date: new Date("2025-08-29T00:00:00"), amount: 300 },
    { date: new Date("2025-09-27T00:00:00"), amount: 500 },
    { date: new Date("2025-10-28T00:00:00"), amount: 300 },
    { date: new Date("2026-03-29T00:00:00"), amount: 200 },
    { date: new Date("2026-06-27T00:00:00"), amount: 300 },
    { date: new Date("2027-02-28T00:00:00"), amount: 100 },
    { date: new Date("2028-01-29T00:00:00"), amount: 600 },
  ];

  // Fonction pour formater la date
  const dateFormat = (date) => {
    return moment(date).format("YYYY");
  };

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [timeRange, setTimeRange] = useState("1m"); // Par défaut à 1 mois

  useEffect(() => {
    console.log("Time range updated:", timeRange);
    const filteredData = incomes.filter((inc) => {
      const startDate = moment().subtract(1, timeRange);
      return moment(inc.date) >= startDate;
    });

    const newData = {
      labels: filteredData.map((inc) => moment(inc.date).format("YYYY-MM-DD")),
      datasets: [
        {
          fill: true,
          label: "Total d'argent",
          data: filteredData.map((inc) => {
            return { x: inc.date, y: inc.amount };
          }),
          borderColor: "rgba(102, 204, 102, 0.6 )",
          pointBackgroundColor: "rgba(102, 204, 102, 1)",
          pointBorderColor: "rgba(230,230,230,0.5)",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(102, 204, 102, 1)",
          hoverRadius: 8,
          backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              { offset: 0, color: "rgba(102, 204, 102, 0.8)" },
              { offset: 1, color: "rgba(255, 255, 255, 0.3)" },
            ],
          },
        },
      ],
    };

    // Récupérer le dernier point de données
    const lastDataPoint = newData.datasets[0].data.slice(-1)[0];
    // Récupérer l'avant-dernier point de données
    const secondToLastDataPoint = newData.datasets[0].data.slice(-2)[0];

    // Vérifier si la tendance est descendante
    const isDescending = lastDataPoint.y < secondToLastDataPoint.y;

    // Modifier la couleur de la ligne et des points en fonction de la tendance
    if (isDescending) {
      newData.datasets[0].borderColor = "rgba(255, 102, 0, 1)";
      newData.datasets[0].pointBackgroundColor = "rgba(245, 102, 0, 1)";
      newData.datasets[0].pointBorderColor = "rgba(245, 102, 0, 1)";
    }

    setChartData(newData);
  }, [timeRange]);

  const options = {
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
  };

  const handleTimeRangeChange = (range) => {
    console.log("Time range changed:", range);
    setTimeRange(range);
  };

  return (
    <>
      <div>
        <IonLabel>
          <IonText
            className="ion-justify-content-center ion-padding"
            style={{
              fontWeight: "bold",
              fontSize: "1em",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Total d'argent: 240 DT
          </IonText>
        </IonLabel>
      </div>
      <IonCard className="chart-card">
        <IonCardContent>
          <div>
            <Line
              data={chartData}
              options={{
                plugins: {
                  scales: {
                    x: {
                      type: "time",
                      time: {
                        unit: "day", // Spécifiez l'unité de temps ici, par exemple "day", "month", etc.
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: "rgba(230,230,230,0.8)",
                      font: {
                        size: 12,
                      },
                    },
                  },
                  y: {
                    ticks: {
                      color: "rgba(230,230,230,0.8)",
                      font: {
                        size: 12,
                      },
                    },
                    title: {
                      display: true,
                      text: "Dinars",
                      color: "rgba(230,230,230,0.8)",
                      font: {
                        size: 9,
                        weight: "bold",
                      },
                    },
                  },
                },

                tension: 0.4,
              }}
            />
          </div>
          <div>
            <IonButton onClick={() => handleTimeRangeChange("1m")}>
              30 days
            </IonButton>
            <IonButton onClick={() => handleTimeRangeChange("3m")}>
              3 months
            </IonButton>
            <IonButton onClick={() => handleTimeRangeChange("6m")}>
              6 months
            </IonButton>
            <IonButton onClick={() => handleTimeRangeChange("1y")}>
              1 year
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>

      <div>
        <IonLabel>
          <IonText
            className="ion-justify-content-center ion-padding"
            style={{
              fontWeight: "bold",
              fontSize: "1em",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Revenus:
          </IonText>
        </IonLabel>
      </div>
      <IonCard>
        <IonCardContent>
          <Bar
            data={{
              labels: [
                "categorie A",
                "categorie B",
                "categorie C",
                "categorie A",
                "categorie B",
                "categorie C",
              ],
              datasets: [
                {
                  label: "Revenus",
                  data: [200, 200, 1050, 200, 200, 1050],
                  backgroundColor: "rgba(102, 204, 102, 0.2)", // Lime fill color
                  borderColor: "rgba(102, 204, 102, 1)", // Lime line color
                  pointBackgroundColor: "rgba(102, 204, 102, 1)", // Lime point color
                  pointBorderColor: "#fff", // White point border color
                  pointHoverBackgroundColor: "#fff", // White point hover color
                  pointHoverBorderColor: "rgba(102, 204, 102, 1)", // Lime point hover border color
                },
              ],
            }}
            options={{
              scales: {
                x: {
                  ticks: {
                    color: "rgba(230,230,230,0.8)", // Lighter x-axis label color
                  },
                },
                y: {
                  ticks: {
                    color: "rgba(230,230,230,0.8)", // Lighter y-axis label color
                  },
                  title: {
                    display: true,
                    text: "Dinars", // Nommez l'axe Y comme "dinars"
                    color: "rgba(230,230,230,0.8)",
                    font: {
                      size: 9,
                      weight: "bold",
                    },
                  },
                },
              },
            }}
          />
        </IonCardContent>
      </IonCard>
      <div>
        <IonLabel>
          <IonText
            className="ion-justify-content-center ion-padding"
            style={{
              fontWeight: "bold",
              fontSize: "1em",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Dépenses:
          </IonText>
        </IonLabel>
      </div>
      <IonCard>
        <IonCardContent>
          <Bar
            data={{
              labels: ["categorie A", "categorie B", "categorie C"],
              datasets: [
                {
                  label: "Dépenses",
                  data: [800, 200, 1050],
                  backgroundColor: "rgba(255, 153, 0, 0.2)", // Orange fill color
                  borderColor: "rgba(255, 102, 0, 1)", // Orange line color
                  pointBackgroundColor: "rgba(255, 102, 0, 1)", // Orange point color
                  pointBorderColor: "#fff", // White point border color
                  pointHoverBackgroundColor: "#fff", // White point hover color
                  pointHoverBorderColor: "rgba(255, 102, 0, 1)", // Orange point hover border color
                },
              ],
            }}
            options={{
              scales: {
                x: {
                  ticks: {
                    color: "rgba(230,230,230,0.8)", // Lighter x-axis label color
                  },
                },
                y: {
                  ticks: {
                    color: "rgba(230,230,230,0.8)",
                    font: {
                      size: 12,
                    },
                  },
                  title: {
                    display: true,
                    text: "Dinars", // Nommez l'axe Y comme "dinars"
                    color: "rgba(230,230,230,0.8)",
                    font: {
                      size: 9,
                      weight: "bold",
                    },
                  },
                },
              },
            }}
          />
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default Dashboard;
