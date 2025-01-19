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
// import useAxiosPrivate from "../../hooks/useAxiosPrivate";
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
  const [categorieRevenu, setCategorieRevenu] = useState(null);
  const [categorieRevenus, setCategorieRevenus] = useState([]);
  const [sousCategorie, setSousCategorie] = useState(null);
  const [sousCategories, setSousCategories] = useState([]);
  const [recurrenceOption, setRecurrenceOption] = useState("");
  // Nouvel état pour suivre l'option de récurrence sélectionnée

  const [idFournisseur, setIdFournisseur] = useState(null);
  const [idCategorieRevenu, setIdCategorieRevenu] = useState(null);
  const [idSousCategorie, setIdSousCategorie] = useState(null);
  const [description, setDescription] = useState("");
  const [recurrente, setRecurrente] = useState(false);
  const history = useHistory();
  let userEmail;

  // Vérifier si le userEmail est présent dans le localStorage
  if (localStorage.getItem("userEmail")) {
    userEmail = localStorage.getItem("userEmail");
  }
  const [nomCategorie, setNomCategorie] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const currentDate = new Date().toISOString();
  const [dateRevenu, setDateRevenu] = useState(currentDate);
  const [dateLimite, setDateLimite] = useState(currentDate);
  // const [typeCompte, setTypeCompte] = useState("");

  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string | null>(
    null
  );
  const [fournisseurs, setFournisseurs] = useState([]);
  const [fournisseur, setFournisseur] = useState(null);

  const [montant, setMontant] = useState(null);
  // const [cash, setCash] = useState("");
  const [transactions, setTransactions] = useState([
    {
      moyen: "",
      idCpt: 0,
      amount: 0,
      typeCompte: "",
      compteOptions: [],
    },
  ]);
  // Initialisation avec une wallet par défaut
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  useEffect(() => {
    // Charger les catégories de dépenses depuis l'API
    axiosPrivate
      .get(`/categories-revenus/${userEmail}`)
      .then((response) => {
        setCategorieRevenus(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories de revenu:", error);
      });
    // Charger les catégories de dépenses depuis l'API
  }, []);

  const handleCategorieRevenu = (e) => {
    const selectedValue = e.target.value; // Nouvelle valeur sélectionnée
    setCategorieRevenu(selectedValue); // Mettre à jour la valeur dans l'état
  };

  useEffect(() => {
    axiosPrivate
      .get(`/fournisseurss/${categorieRevenu}/${userEmail}`)
      .then((response) => {
        console.log(response.data);
        setFournisseurs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching fournisseurs:", error);
      });
  }, [categorieRevenu]);

  const handleMoyen = (e, index) => {
    let typeCompte = "";
    const updatedTransactions = [...transactions];
    const moyen = e.detail.value!;
    updatedTransactions[index].moyen = moyen;
    setTransactions(updatedTransactions);
    if (moyen === "chèques") {
      typeCompte == "cheque";
    } else if (moyen === "virement_bancaire") {
      typeCompte = "compte_bancaire";
    } else if (moyen === "espèces") {
      typeCompte = "wallet_cash";
    } else if (moyen === "paiement_électronique") {
      typeCompte = "compte_electronique";
    }

    // Assurez-vous que typeCompte a une valeur avant d'exécuter la requête
    axiosPrivate
      .get(`/comptes/${userEmail}`)
      .then((response) => {
        const comptes = response.data;
        const updatedTransactions = [...transactions];
        updatedTransactions[index].compteOptions = comptes;
        setTransactions(updatedTransactions);
      })
      .catch((error) => {
        console.log("erreur dans l'api des comptes");
      });
  }; // Surveillez les changements de typeCompte et userEmail

  const handleWalletNameChange = (e, index) => {
    const idCompte = e.detail.value!;
    const updatedTransactions = [...transactions];
    updatedTransactions[index].idCpt = idCompte;
    setTransactions(updatedTransactions);
  };

  const handleWalletAmountChange = (e, index) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[index].amount = e.target.value;
    setTransactions(updatedTransactions);
  };

  const addNewWallet = () => {
    setTransactions([
      ...transactions,
      {
        moyen: "",
        idCpt: 0,
        amount: 0,
        typeCompte: "",
        compteOptions: [],
      },
    ]); // Ajout d'une nouvelle wallet à la liste existante
  };

  const removeWallet = (indexToRemove) => {
    setTransactions((prevWallets) => {
      // Filtrer les portefeuilles pour retirer celui avec l'index donné
      return prevWallets.filter(
        (transaction, index) => index !== indexToRemove
      );
    });
  };

  // Calculer la somme des montants dans les portefeuilles
  const sommeMontantsTransactions = transactions.reduce(
    (total, transaction) => total + parseInt(transaction.amount),
    0
  );

  // Vérifier si la somme des montants dépasse le montant initial
  const depasseMontantInitial =
    sommeMontantsTransactions < montant || sommeMontantsTransactions > montant;
  const [presentAlert] = useIonAlert();
  const declarer = () => {
    if (depasseMontantInitial) {
      presentAlert({
        header: "Alerte",
        subHeader: "Différence avec le montant initial",
        message:
          "La somme des montants des transactions ne correspond pas au montant total de votre dépense ! Veuillez vérifier les montants. Merci",
        buttons: ["Ok"],
      });
    } else {
      // Traitement pour déclarer
      console.log("Déclaré avec succès !");
      console.log(transactions);
    }
  };

  const handleDateChange = (event) => {
    setDateRevenu(event.detail.value);
  };
  const handleExpenseProviderChange = (e) => {
    const selectedValue = e.target.value;
    setFournisseur(selectedValue);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // useEffect(() => {
  //   axios
  //     .get(`/carte/compte/moyen${userEmail}`)
  //     .then((response) => {
  //       setCarteOptions(response.data);

  //     })
  //     .catch((error) => {
  //       console.log("erreur dans l'api des comptes");
  //     });
  // }, []); // Ajoutez également un tableau de dépendances vide pour exécuter cet effet uniquement une fois après le premier rendu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // const formdata = new FormData();
    // formdata.append("recurrence", recurrence);
    // formdata.append("dateLimite", dateLimite);
    // formdata.append("description", description);
    // formdata.append("dateRevenu", dateRevenu);
    // // formdata.append("categorieFournisseur", categorieFournisseur);
    // formdata.append("fournisseur", fournisseur);
    // formdata.append("categorieRevenu", categorieRevenu);
    // formdata.append("sousCategorie", sousCategorie);
    // formdata.append("transactions", transactions);
    // console.log(seuilCategorieReste);
    // console.log(seuilSousCategorieReste);

    try {
      await axiosPrivate.post("/revenu", {
        recurrente,
        recurrenceOption,
        description,
        dateRevenu,
        categorieRevenu,
        fournisseur,
        montant,
        transactions,
        userEmail,
      });
      console.log("succeeded");
      setRecurrente(false);
      setDateLimite("");
      setDescription("");
      setCategorieRevenu("");
      setTransactions([]);
      setSousCategorie("");
      setFournisseur("");

      setNomCategorie("");
      setMontant(null);
      setErrorMessage("");
      history.push("/revenus");
    } catch (error) {
      console.error("Error adding depense ye m3allem", error);
      setErrorMessage(
        "Une erreur s'est produite lors de l'ajout de la dépense. Veuillez réessayer."
      );
    }

    // depasseSousCategorie(onOK);
    declarer();
  };
  const handleRecurrenceOptionChange = (option: string) => {
    setRecurrenceOption(option);
  };
  const cattgoriesAndProviders = [
    {
      categoryName: "Catégorie 1",
      providers: ["Fournisseur 1", "Fournisseur 2", "Fournisseur 3"],
    },
    {
      categoryName: "Catégorie 2",
      providers: ["Fournisseur 4", "Fournisseur 5", "Fournisseur 6"],
    },
    // Ajoutez d'autres catégories et fournisseurs au besoin
  ];

  const handlePaymentModeChange = (mode: string) => {
    setSelectedPaymentMode(mode);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/revenus" />
          </IonButtons>
          <IonTitle>Déclarer un revenu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <Swiper>
        <SwiperSlide>
          <IonContent scrollY={true} className="ion-padding">
            <IonGrid fixed>
              <IonCard>
                <IonCardContent>
                  <IonItem lines="none" style={{ justifyContent: "flex-end" }}>
                    <IonToggle
                      color="success"
                      checked={recurrente}
                      onIonChange={(e) => setRecurrente(e.detail.checked)}
                    >
                      Récurrent
                    </IonToggle>
                  </IonItem>
                  {/* Afficher les options de récurrence uniquement si la récurrence est activée */}
                  {recurrente && (
                    <IonList>
                      <IonItem>
                        <IonLabel>Choisir la récurrence :</IonLabel>
                        <IonSelect
                          color="success"
                          value={recurrenceOption}
                          placeholder="Sélectionner la récurrence"
                          onIonChange={(e) =>
                            handleRecurrenceOptionChange(e.detail.value)
                          }
                        >
                          <IonSelectOption value="mois">
                            Chaque mois
                          </IonSelectOption>
                          <IonSelectOption value="3mois">
                            Chaque 3 mois
                          </IonSelectOption>
                          <IonSelectOption value="6mois">
                            Chaque 6 mois
                          </IonSelectOption>
                          <IonSelectOption value="an">
                            Chaque année
                          </IonSelectOption>
                        </IonSelect>
                      </IonItem>
                    </IonList>
                  )}
                </IonCardContent>
              </IonCard>

              <IonCard>
                <IonCardContent>
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
                    <IonLabel>Date de revenu:</IonLabel>
                    <IonDatetimeButton datetime="datetime"></IonDatetimeButton>

                    <IonModal keepContentsMounted={true} color="success">
                      <IonDatetime
                        color="success"
                        id="datetime"
                        presentation="date"
                        value={dateRevenu}
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
                    <IonLabel>Catégorie de revenu</IonLabel>
                    <IonSelect
                      color="success"
                      value={categorieRevenu} // Utilisation de la valeur contrôlée
                      placeholder="Sélectionner la catégorie"
                      onIonChange={(e) => handleCategorieRevenu(e)}
                    >
                      {categorieRevenus.map((category: any) => (
                        <IonSelectOption
                          key={category.IdCategorie}
                          value={category.IdCategorie}
                        >
                          {category.nomCategorie}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>

                  <IonList>
                    <IonItem>
                      <IonLabel>Fournisseur</IonLabel>
                      <IonSelect
                        color="success"
                        placeholder="Sélectionner le fournisseur de dépense"
                        value={fournisseur}
                        onIonChange={(e) => handleExpenseProviderChange(e)}
                      >
                        {fournisseurs.map((fournisseur, index) => (
                          <IonSelectOption
                            key={index}
                            value={fournisseur.IdFournisseur}
                          >
                            {fournisseur.nom}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>
              <SwiperButtonNext>
                Suivant <IonIcon icon={arrowForwardOutline} />
              </SwiperButtonNext>
            </IonGrid>
          </IonContent>
        </SwiperSlide>
        <SwiperSlide>
          <IonContent scrollY={true} className="ion-padding">
            <IonGrid fixed>
              <IonCard>
                <IonCardContent>
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
                      label={"­ Montant total:"}
                      type="number"
                      placeholder="Montant"
                      value={montant}
                      onIonChange={(e) => {
                        setMontant(e.detail.value);
                        console.log("Montant:", e.detail.value); // Ajoutez le console.log ici
                      }}
                    />
                    <IonNote slot="end" className="ion-margin-top">
                      Dinars
                    </IonNote>
                  </IonItem>

                  <div>
                    <IonItem className="ion-margin-top">
                      <IonLabel
                        style={{
                          borderRadius: "15px",
                        }}
                      >
                        Ajouter des transactions
                      </IonLabel>
                      <IonNote slot="end">
                        <IonButton
                          color="medium"
                          expand="block"
                          onClick={addNewWallet}
                          disabled={montant == sommeMontantsTransactions}
                        >
                          <IonIcon icon={add} />
                        </IonButton>
                      </IonNote>
                    </IonItem>

                    {transactions.map((transaction, index) => (
                      <div key={index}>
                        <>
                          <IonItem>
                            {" "}
                            <IonLabel style={{ color: "gray" }}>
                              Transaction {index + 1}
                            </IonLabel>
                            <IonButton
                              color="light"
                              expand="block"
                              onClick={() => removeWallet(index)}
                            >
                              <IonIcon icon={closeOutline} />
                            </IonButton>
                          </IonItem>
                        </>
                        <IonList>
                          <IonItem>
                            <IonLabel>Mode de revenu</IonLabel>
                            <IonSelect
                              color="success"
                              placeholder="Sélectionner le mode de paiement"
                              onIonChange={(e) => handleMoyen(e, index)}
                              value={transaction.moyen}
                            >
                              <IonSelectOption value="espèces">
                                Espèces
                              </IonSelectOption>

                              <IonSelectOption value="paiement_électronique">
                                Paiement électronique
                              </IonSelectOption>
                              <IonSelectOption value="virement_bancaire">
                                Virement bancaire
                              </IonSelectOption>
                              <IonSelectOption value="chèques">
                                Chèques
                              </IonSelectOption>
                            </IonSelect>
                          </IonItem>
                        </IonList>
                        <IonItem>
                          <IonLabel>Compte utilisé</IonLabel>
                          <IonSelect
                            value={transaction.idCpt}
                            color="success"
                            placeholder="Sélectionner le compte"
                            onIonChange={(e) =>
                              handleWalletNameChange(e, index)
                            }
                          >
                            {transaction.compteOptions.length > 0 ? (
                              // Mapper les options uniquement si le tableau compteOptions contient des éléments
                              transaction.compteOptions.map((option) => (
                                <IonSelectOption
                                  key={option.idCompte}
                                  value={option.idCompte}
                                >
                                  {option.nomCompte}
                                </IonSelectOption>
                              ))
                            ) : (
                              // Afficher un message d'indisponibilité si le tableau est vide
                              <IonSelectOption disabled>
                                Aucun compte disponible
                              </IonSelectOption>
                            )}
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
                            value={transaction.amount} // Utilisez le montant de la première wallet
                            onIonChange={(e) =>
                              handleWalletAmountChange(e, index)
                            }
                          />
                          <IonNote slot="end" className="ion-margin-top">
                            Dinars
                          </IonNote>
                        </IonItem>
                      </div>
                    ))}
                  </div>
                  {depasseMontantInitial && (
                    <p style={{ color: "red" }}>
                      La somme des transactions n'est pas la même que le montant
                      initial total !
                    </p>
                  )}
                  <p style={{ color: "red" }}>{errorMessage}</p>
                </IonCardContent>
              </IonCard>

              <IonButton
                color="success"
                size="large"
                fill="solid"
                shape="round"
                expand="block"
                onClick={(e) => {
                  handleSubmit(e);
                  // declarer();
                }}
                disabled={depasseMontantInitial}
                style={{ width: "100%", marginBottom: "5vh" }}
              >
                <IonIcon slot="end" icon={checkmarkSharp} />
                Déclarer
              </IonButton>
            </IonGrid>
          </IonContent>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default AddRevenu;
