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
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonBadge,
} from "@ionic/react";
import {
  shuffleOutline,
  trendingDownOutline,
  arrowForward,
  arrowBack,
  cashOutline,
  caretForwardOutline,
  trendingUpOutline,
  add,
  notificationsOutline,
} from "ionicons/icons";
import React, { useState, useEffect } from "react";
import transfert from "../../public/iconeSS.png";
import Menu from "./Menu";
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
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import moment from "moment";
ChartJS.register(
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title
);
//
import { MdNotificationsActive } from "react-icons/md";
const Home: React.FC = () => {
  const history = useHistory();
  let userEmail;

  const checkUserLoggedIn = () => {
    userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
      history.push("/login");
    }
  };
  console.log("userEmail", userEmail);
  useEffect(() => {
    checkUserLoggedIn(); // Vérification initiale lors du montage du composant

    const interval = setInterval(() => {
      checkUserLoggedIn(); // Vérification périodique
    }, 300); // Rafraîchir toutes les 0.3 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
  }, [history]); // Utilisation de useEffect avec history comme dépendance pour écouter les changements de route

  const [values, setValues] = useState([{ date: "", cumulative_balance: 0 }]);
  const [depenses, setDepenses] = useState([
    { nomCategorie: "", sommeMontant: 0, idCategorie: 0 },
  ]);
  const [revenus, setRevenus] = useState([
    { nomCategorie: "", sommeMontant: 0, idCategorie: 0 },
  ]);

  const [fournisseur, setFournisseur] = useState([
    { nom: "", sommeRevenu: 0, sommeDepense: 0, id: 0 },
  ]);

  const [categories, setCategories] = useState([]);
  const categoriesNotViewed = categories.filter((category) => category.vu != 0);

  useEffect(() => {
    if (userEmail) {
      fetchDataNotif();

      fetchData();
      fetchDataDepense();
      fetchDataRevenu();
      fetchDataFournisseurDepense();
      const intervalId = setInterval(() => {
        fetchData();
        fetchDataDepense();
        fetchDataRevenu();
        fetchDataFournisseurDepense();
      }, 1000); // Refresh every 0.75s

      return () => clearInterval(intervalId);
    }
  }, [userEmail]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://:9001/sommeMontant/${userEmail}`
      );
      const data = response.data;
      setValues(data); // Utilisez les données brutes reçues du backend
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchDataDepense = async () => {
    try {
      const response = await axios.get(
        `http://:9001/sommeDepense/${userEmail}`
      );
      const data = response.data;
      setDepenses(data); // Utilisez les données brutes reçues du backend
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchDataRevenu = async () => {
    try {
      const response = await axios.get(`http://:9001/sommeRevenu/${userEmail}`);
      const data = response.data;
      setRevenus(data); // Utilisez les données brutes reçues du backend
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataFournisseurDepense = async () => {
    try {
      const response = await axios.get(
        `http://:9001/sommeFournisseurs/${userEmail}`
      );
      const data = response.data;
      setFournisseur(data); // Utilisez les données brutes reçues du backend
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataNotif = async () => {
    try {
      const response = await axios.get(
        `http://:9001/notifications/${userEmail}`
      );
      setCategories(response.data);
      console.log(categories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  let ttArgent = 0;
  if (values[0] != undefined) {
    ttArgent = values[values.length - 1].cumulative_balance;
  }
  const dateFormat = (date) => {
    moment.locale(); // Définissez la langue de Moment.js si nécessaire
    return moment(date).add(2, "hours").format("YYYY/MM/DD, hh:mm "); // Formatage de date avec Moment.js
  };

  const chartData = {
    labels: values.map((val) => dateFormat(val.date)), // Utilisez directement la date brute
    datasets: [
      {
        fill: true,

        label: "Total d'argent",
        data: values.map((val) => val.cumulative_balance),

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
  const lastDataPoint = chartData.datasets[0].data.slice(-1)[0];
  // Récupérer l'avant-dernier point de données
  const secondToLastDataPoint = Math.max(...chartData.datasets[0].data);
  const halfMaxDataPoint = secondToLastDataPoint / 2;

  // Vérifier si la tendance est descendante
  const isDescending = lastDataPoint > halfMaxDataPoint;

  // Modifier la couleur de la ligne et des points en fonction de la tendance
  const newChartData = { ...chartData };
  if (!isDescending) {
    newChartData.datasets[0].borderColor = "rgba(255, 102, 0, 1)";
    newChartData.datasets[0].pointBackgroundColor = "rgba(245, 102, 0, 1)";
    newChartData.datasets[0].pointBorderColor = "rgba(245, 102, 0, 1)";
  } else {
    newChartData.datasets[0].borderColor = "rgba(102, 204, 102, 0.6)";
    newChartData.datasets[0].pointBackgroundColor = "rgba(102, 204, 102, 1)";
    newChartData.datasets[0].pointBorderColor = "rgba(230, 230, 230, 0.5)";
  }

  // Mise à jour des options de votre graphique (si nécessaire)
  const options = {
    animation: {
      duration: 3000,
      easing: "easeInOutQuart",
    },
  };
  const getColorFromId = (id) => {
    // Convertir l'ID en chaîne de caractères
    const idString = id.toString();

    // Initialiser les valeurs de couleur avec une somme basée sur les codes ASCII des caractères de l'ID
    let r = 0;
    let g = 0;
    let b = 0;
    for (let i = 0; i < idString.length; i++) {
      const charCode = idString.charCodeAt(i);
      r += charCode * 3;
      g += charCode * 7;
      b += charCode * 11;
    }

    // Assurer que les valeurs de couleur restent dans la plage de 0 à 255
    r = Math.floor(128 + 127 * Math.sin((id * 0.3 + 0) % (2 * Math.PI)));
    g = Math.floor(128 + 127 * Math.sin((id * 0.3 + 2) % (2 * Math.PI)));
    b = Math.floor(128 + 127 * Math.sin((id * 0.3 + 4) % (2 * Math.PI)));

    // Retourner un objet contenant les couleurs avec différentes opacités
    return {
      backgroundColor: `rgba(${r},${g},${b},0.2)`,
      borderColor: `rgba(${r},${g},${b},1)`,
      borderWidth: 1,
      hoverBackgroundColor: `rgba(${r},${g},${b},0.4)`,
      hoverBorderColor: `rgba(${r},${g},${b},1)`,
    };
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ textAlign: "center" }}>
            Explorez vos finances
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" scrollY={true}>
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Link
                  to="/transferts"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "18px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <IonButton
                    color="light"
                    size="large"
                    fill="solid"
                    shape="round"
                    expand="block"
                    style={{
                      borderRadius: "18px",
                      width: "100%",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center", // Alignement vertical au centre
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div>
                        <IonIcon
                          icon={shuffleOutline}
                          style={{ marginRight: "5px" }}
                          color="success"
                        />
                        Transfert
                      </div>
                    </div>
                    <div style={{ flexGrow: 1 }}></div> {/* Espace flexible */}
                    <IonIcon icon={caretForwardOutline} color="medium" />
                  </IonButton>
                </Link>
                <Link
                  to="/depenses"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "18px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <IonButton
                    color="light"
                    size="large"
                    fill="solid"
                    shape="round"
                    expand="block"
                    style={{
                      borderRadius: "18px",
                      width: "100%",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center", // Alignement vertical au centre
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div>
                        <IonIcon
                          icon={trendingDownOutline}
                          style={{ marginRight: "5px" }}
                          color="success"
                        />
                        Dépense
                      </div>
                    </div>
                    <div style={{ flexGrow: 1 }}></div> {/* Espace flexible */}
                    <IonIcon icon={caretForwardOutline} color="medium" />
                  </IonButton>
                </Link>
                <Link
                  to="/revenus"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "18px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <IonButton
                    color="light"
                    size="large"
                    fill="solid"
                    shape="round"
                    expand="block"
                    style={{
                      borderRadius: "18px",
                      width: "100%",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center", // Alignement vertical au centre
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div>
                        <IonIcon
                          icon={trendingUpOutline}
                          style={{ marginRight: "5px" }}
                          color="success"
                        />
                        Revenu
                      </div>
                    </div>
                    <div style={{ flexGrow: 1 }}></div> {/* Espace flexible */}
                    <IonIcon icon={caretForwardOutline} color="medium" />
                  </IonButton>
                </Link>
              </div>
              <hr />
            </IonCol>
          </IonRow>
        </IonGrid>
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
              Total d'argent: {ttArgent} Dinars
            </IonText>
          </IonLabel>
        </div>

        <IonCard className="chart-card">
          <IonCardContent>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "95.5vh", // kobr espace elli dayar b chart w l positionnement mte3o
                // height: "81vh", // surtout hedha kobr l espace elli dayar b chart
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                // overflow: "auto",
                overflow: "hidden", // Cache la barre de défilement
              }}
            >
              <div
                style={{
                  // transform: "rotate(-90deg)",
                  width: "90vh", // kobr chart fi had dheto
                  // height: "83vh",
                  // maxHeight: "200vh",
                  overflow: "hidden", // Cache la barre de défilement
                }}
              >
                <div
                  style={{
                    overflow: "hidden", // Cache la barre de défilement
                  }}
                >
                  <Line
                    data={chartData}
                    options={{
                      animation: {
                        duration: 1000,
                        easing: "easeOutCubic",
                        fill: true,
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
                      //
                      tension: 0.4,
                    }}
                  />
                </div>
              </div>
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
              Revenus par catégorie:
            </IonText>
          </IonLabel>
        </div>
        <IonCard>
          <IonCardContent>
            <Doughnut
              data={{
                labels: revenus.map((revenu) => revenu.nomCategorie),
                datasets: [
                  {
                    label: "Revenus",
                    data: revenus.map((revenu) => revenu.sommeMontant),
                    backgroundColor: revenus.map(
                      (revenu) =>
                        getColorFromId(revenu.idCategorie).backgroundColor
                    ),
                    borderColor: revenus.map(
                      (revenu) => getColorFromId(revenu.idCategorie).borderColor
                    ),
                    borderWidth: 1,
                    hoverBackgroundColor: revenus.map(
                      (revenu) =>
                        getColorFromId(revenu.idCategorie).hoverBackgroundColor
                    ),
                    hoverBorderColor: revenus.map(
                      (revenu) =>
                        getColorFromId(revenu.idCategorie).hoverBorderColor
                    ),
                  },
                ],
              }}
              options={{
                scales: {
                  x: {
                    grid: {
                      display: true,
                    },
                    ticks: {
                      display: false, // Masquer les étiquettes des échelles x
                    },
                  },
                  y: {
                    grid: {
                      display: true,
                    },
                    ticks: {
                      display: false, // Masquer les étiquettes des échelles y
                    },
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        return tooltipItem.raw + " DT"; // Ajoutez le suffixe ' DT' à chaque valeur
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
              Dépenses par catégorie:
            </IonText>
          </IonLabel>
        </div>
        <IonCard>
          <IonCardContent>
            {/* <Doughnut
              data={{
                labels: depenses.map((depense) => depense.nomCategorie),
                datasets: [
                  {
                    label: "Revenus",
                    data: depenses.map((depense) => depense.sommeMontant),
                    backgroundColor: [
                      "rgba(102, 204, 102, 0.2)",
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(255, 206, 86, 0.2)",
                      "rgba(75, 192, 192, 0.2)",
                      "rgba(153, 102, 255, 0.2)",
                      "rgba(255, 159, 64, 0.2)",
                    ],
                    borderColor: [
                      "rgba(102, 204, 102, 1)",
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                    hoverBackgroundColor: [
                      "rgba(102, 204, 102, 0.4)",
                      "rgba(255, 99, 132, 0.4)",
                      "rgba(54, 162, 235, 0.4)",
                      "rgba(255, 206, 86, 0.4)",
                      "rgba(75, 192, 192, 0.4)",
                      "rgba(153, 102, 255, 0.4)",
                      "rgba(255, 159, 64, 0.4)",
                    ],
                    hoverBorderColor: [
                      "rgba(102, 204, 102, 1)",
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
                    ],
                  },
                ],
              }}
              options={{
                scales: {
                  x: {
                    grid: {
                      display: true,
                    },
                    ticks: {
                      display: false, // Masquer les étiquettes des échelles x
                    },
                  },
                  y: {
                    grid: {
                      display: true,
                    },
                    ticks: {
                      display: false, // Masquer les étiquettes des échelles y
                    },
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        return tooltipItem.raw + " DT"; // Ajoutez le suffixe ' DT' à chaque valeur
                      },
                    },
                  },
                },
              }}
            /> */}
            <Doughnut
              data={{
                labels: depenses.map((depense) => depense.nomCategorie),
                datasets: [
                  {
                    label: "Revenus",
                    data: depenses.map((depense) => depense.sommeMontant),
                    backgroundColor: depenses.map(
                      (depense) =>
                        getColorFromId(depense.idCategorie).backgroundColor
                    ),
                    borderColor: depenses.map(
                      (depense) =>
                        getColorFromId(depense.idCategorie).borderColor
                    ),
                    borderWidth: 1,
                    hoverBackgroundColor: depenses.map(
                      (depense) =>
                        getColorFromId(depense.idCategorie).hoverBackgroundColor
                    ),
                    hoverBorderColor: depenses.map(
                      (depense) =>
                        getColorFromId(depense.idCategorie).hoverBorderColor
                    ),
                  },
                ],
              }}
              options={{
                scales: {
                  x: {
                    grid: {
                      display: true,
                    },
                    ticks: {
                      display: false, // Masquer les étiquettes des échelles x
                    },
                  },
                  y: {
                    grid: {
                      display: true,
                    },
                    ticks: {
                      display: false, // Masquer les étiquettes des échelles y
                    },
                  },
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        return tooltipItem.raw + " DT"; // Ajoutez le suffixe ' DT' à chaque valeur
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
              Dépenses et Revenus par Fournisseur:
            </IonText>
          </IonLabel>
        </div>
        <IonCard className="chart-card">
          <IonCardContent>
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "95.5vh", // kobr espace elli dayar b chart w l positionnement mte3o
                // height: "81vh", // surtout hedha kobr l espace elli dayar b chart
                // display: "flex",
                // justifyContent: "center",
                // alignItems: "center",
                // overflow: "auto",
                overflow: "hidden", // Cache la barre de défilement
              }}
            >
              <div
                style={{
                  // transform: "rotate(-90deg)",
                  width: "90vh", // kobr chart fi had dheto
                  // height: "83vh",
                  // maxHeight: "200vh",
                  overflow: "hidden", // Cache la barre de défilement
                }}
              >
                <div
                  style={{
                    overflow: "hidden", // Cache la barre de défilement
                  }}
                >
                  <Bar
                    data={{
                      labels: fournisseur.map(
                        (fournisseurr) => fournisseurr.nom
                      ),
                      datasets: [
                        {
                          label: "Revenus",
                          data: fournisseur.map(
                            (fournisseurr) => fournisseurr.sommeRevenu
                          ),
                          backgroundColor: "rgba(50, 205, 50, 0.25)", // Couleur de remplissage lime pour les revenus
                          borderColor: "rgba(50, 205, 50, 1)", // Couleur de la ligne lime pour les revenus
                          borderRadius: 10, // Arrondir les coins des barres
                        },
                        {
                          label: "Dépenses",
                          data: fournisseur.map(
                            (fournisseurr) => fournisseurr.sommeDepense
                          ),
                          backgroundColor: "rgba(255, 83, 73, 0.25)", // Couleur de remplissage orange-red pour les dépenses
                          borderColor: "rgba(204, 43, 33, 1)", // Couleur de la ligne plus foncée pour les dépenses
                          borderRadius: 10, // Arrondir les coins des barres
                        },
                      ],
                    }}
                    options={{
                      // indexAxis: "y", // Afficher les libellés sur l'axe des Y
                      scales: {
                        x: {
                          beginAtZero: true,
                          grid: {
                            display: true,
                          },
                          ticks: {
                            autoSkip: false,
                          },
                        },
                        y: {
                          beginAtZero: true,
                          grid: {
                            display: true,
                          },

                          ticks: {
                            autoSkip: true,
                            maxRotation: 90, // Rotation des libellés à 90 degrés
                            minRotation: 90, // Angle minimum de rotation des libellés
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

                      // layout: {
                      //   padding: {
                      //     left: 20, // Espacement à gauche pour les longs noms
                      //     right: 20, // Espacement à droite pour les longs noms
                      //   },
                      // },
                    }}
                  />
                </div>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
      *
      <IonFab
        slot="fixed"
        vertical="bottom"
        horizontal="end"
        style={{ bottom: "8vh", right: "2.5vh" }}
      >
        <Link to={`/Notifs`}>
          <IonFabButton color="success" id="cart-btn">
            <MdNotificationsActive size={27} /> {/* Ajustez la taille ici */}
          </IonFabButton>
          {categoriesNotViewed.length > 0 && (
            <IonBadge id="cart-badge" style={{ borderRadius: "45%" }}>
              {" "}
              <div>{categoriesNotViewed.length}</div>
            </IonBadge>
          )}
        </Link>
      </IonFab>
      <Menu />
    </IonPage>
  );
};

export default Home;
// import {
//   IonContent,
//   IonHeader,
//   IonPage,
//   IonTitle,
//   IonToolbar,
//   IonAvatar,
//   IonButton,
//   IonButtons,
//   IonCard,
//   IonCardContent,
//   IonItem,
//   IonIcon,
//   IonGrid,
//   IonRow,
//   IonCol,
// } from "@ionic/react";
// import {
//   shuffleOutline,
//   trendingDownOutline,
//   arrowForward,
//   arrowBack,
//   cashOutline,
//   caretForwardOutline,
//   trendingUpOutline,
// } from "ionicons/icons";
// import React from "react";
// import transfert from "../../public/iconeSS.png";
// import Menu from "./Menu";

// import {
//   Chart as ChartJS,
//   BarElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
// } from "chart.js";
// import { Bar, Line } from "react-chartjs-2";

// ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);

// const Home: React.FC = () => {
//   return (
//     <IonPage>
//       <Bar
//         data={{
//           labels: ["A", "B", "C"],
//           datasets: [
//             {
//               label: "revenu",
//               data: [200, -300, 450],
//               backgroundColor: "rgba(75, 192, 192, 0.2)", // Couleur de remplissage
//               borderColor: "rgba(75, 192, 192, 1)", // Couleur de la ligne
//             },
//           ],
//         }}
//       />
//     </IonPage>
//   );
// };
// export default Home;
