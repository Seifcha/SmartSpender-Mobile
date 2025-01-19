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
const AddDepense: React.FC = () => {
  const [categorieDepense, setCategorieDepense] = useState(null);
  const [categorieDepenses, setCategorieDepenses] = useState([]);
  const [sousCategorie, setSousCategorie] = useState(null);
  const [sousCategories, setSousCategories] = useState([]);
  const [recurrenceOption, setRecurrenceOption] = useState("");
  // Nouvel état pour suivre l'option de récurrence sélectionnée
  const [description, setDescription] = useState("");
  const [recurrente, setRecurrente] = useState(false);
  const history = useHistory();
  // let userEmail;
  // useEffect(() => {
  //   userEmail = localStorage.getItem("userEmail");
  //   if (!userEmail) {
  //     // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
  //     history.push("/login");
  //   }
  // }, []);

  const [userEmail, setUserEmail] = useState(null);
  const [nomCategorie, setNomCategorie] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const currentDate = new Date().toISOString();
  const [dateDepense, setDateDepense] = useState(currentDate);
  const [dateLimite, setDateLimite] = useState(currentDate);
  // const [typeCompte, setTypeCompte] = useState("");

  const [fournisseurs, setFournisseurs] = useState([]);
  const [fournisseur, setFournisseur] = useState(null);

  const [montant, setMontant] = useState(null);
  // const [cash, setCash] = useState("");
  const [transactions, setTransactions] = useState([
    {
      moyen: "",
      idCpt: null,
      idCrt: null,
      amount: 0,
      typeCompte: "",
      compteOptions: [],
      carteOptions: [],
    },
  ]);
  // Initialisation avec une wallet par défaut
  useEffect(() => {
    const checkUserLoggedIn = () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        history.push("/login");
      } else {
        setUserEmail(email);
      }
    };

    checkUserLoggedIn();

    const interval = setInterval(() => {
      checkUserLoggedIn();
    }, 300);

    return () => clearInterval(interval);
  }, [history]);

  useEffect(() => {
    if (userEmail) {
      // Charger les catégories de dépenses depuis l'API seulement si userEmail est défini
      axiosPrivate
        .get(`/categories-depenses/${userEmail}`)
        .then((response) => {
          setCategorieDepenses(response.data);
        })
        .catch((error) => {
          console.error("Error fetching categories de dépenses:", error);
        });
    }
  }, [userEmail]); // Ajouter userEmail comme dépendan

  const handleCategorieDepense = (e) => {
    const selectedValue = e.target.value; // Nouvelle valeur sélectionnée
    setCategorieDepense(selectedValue); // Mettre à jour la valeur dans l'état

    axiosPrivate
      .get(`/sous-categories-depenses/${userEmail}/${selectedValue}`) // Utiliser la nouvelle valeur sélectionnée
      .then((response) => {
        setSousCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories de dépenses:", error);
      });
  };
  useEffect(() => {
    if (categorieDepense) {
      axiosPrivate
        .get(`/fournisseurs/${categorieDepense}/${userEmail}`)
        .then((response) => {
          setFournisseurs(response.data);
        })
        .catch((error) => {
          console.error("Error fetching fournisseurs:", error);
        });
    }
  }, [categorieDepense, userEmail]);

  const handleSubcategoryChange = (e) => {
    setSousCategorie(e.detail.value);
  };

  const handleMoyen = (e, index) => {
    let typeCompte = "";
    const updatedTransactions = [...transactions];
    const moyen = e.detail.value!;
    updatedTransactions[index].moyen = moyen;
    setTransactions(updatedTransactions);

    if (
      moyen === "carte_bancaire" ||
      moyen === "chèques" ||
      moyen === "virement_bancaire"
    ) {
      typeCompte = "compte_bancaire";
    } else if (moyen === "espèces") {
      typeCompte = "wallet_cash";
    } else if (moyen === "paiement_électronique") {
      typeCompte = "compte_electronique";
    }

    if (typeCompte) {
      // Assurez-vous que typeCompte a une valeur avant d'exécuter la requête
      axiosPrivate
        .get(`/compte/${typeCompte}/${userEmail}`)
        .then((response) => {
          const comptes = response.data;
          const updatedTransactions = [...transactions];
          updatedTransactions[index].compteOptions = comptes;
          setTransactions(updatedTransactions);
        })
        .catch((error) => {
          console.log("erreur dans l'api des comptes");
        });
    }
  }; // Surveillez les changements de typeCompte et userEmail

  const handleWalletNameChange = (e, index) => {
    const idCompte = e.detail.value!;
    const updatedTransactions = [...transactions];
    updatedTransactions[index].idCpt = idCompte;
    setTransactions(updatedTransactions);

    if (idCompte) {
      axiosPrivate
        .get(`/carte/${idCompte}/${userEmail}`)
        .then((response) => {
          const cartes = response.data;
          const updatedTransactions = [...transactions];
          updatedTransactions[index].carteOptions = cartes;
          setTransactions(updatedTransactions);
        })
        .catch((error) => {
          console.log("erreur dans l'api des cartes");
        });
    }
  };

  const handleCarteName = (e, index) => {
    const updatedTransactions = [...transactions];
    const idCarte = e.target.value;
    updatedTransactions[index].idCrt = idCarte;
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
        idCpt: null,
        idCrt: null,
        amount: 0,
        typeCompte: "",
        compteOptions: [],
        carteOptions: [],
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
    (total, transaction) => total + parseFloat(transaction.amount),
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

  const [seuilCategorieReste, setSeuilCategorieReste] = useState(null);
  const [seuilSousCategorieReste, setSeuilSousCategorieReste] = useState(null);
  const [depasseCategorieSeuil, setDepasseCategorieSeuil] = useState(false);
  const [depasseSousCategorieSeuil, setDepasseSousCategorieSeuil] =
    useState(false);

  useEffect(() => {
    if (categorieDepense) {
      axiosPrivate
        .get(`/seuilsRestes/${categorieDepense}/${userEmail}`)
        .then((response) => {
          setSeuilCategorieReste(response.data);
        })
        .catch((error) => {
          console.error(
            "Error fetching seuils restants de la catégorie:",
            error
          );
        });
    }
  }, [categorieDepense, userEmail]);
  useEffect(() => {
    if (sousCategorie) {
      axiosPrivate
        .get(`/seuilsRestesSousCategorie/${sousCategorie}/${userEmail}`)
        .then((response) => {
          setSeuilSousCategorieReste(response.data);
        })
        .catch((error) => {
          console.error(
            "Error fetching seuils restants de la sous-catégorie:",
            error
          );
        });
    }
  }, [sousCategorie, userEmail]);

  useEffect(() => {
    if (seuilSousCategorieReste) {
      const depasseSeuilSousCategorie = seuilSousCategorieReste.some(
        (seuil) => seuil < montant
      );
      setDepasseSousCategorieSeuil(depasseSeuilSousCategorie);
    }
  }, [seuilSousCategorieReste, montant]);

  useEffect(() => {
    if (seuilCategorieReste) {
      const depasseSeuilCategorie = seuilCategorieReste.some(
        (seuil) => seuil < montant
      );
      setDepasseCategorieSeuil(depasseSeuilCategorie);
    }
  }, [seuilCategorieReste, montant]);

  const handleDateChange = (event) => {
    setDateDepense(event.detail.value);
  };
  const handleExpenseProviderChange = (e) => {
    const selectedValue = e.target.value;
    setFournisseur(selectedValue);
  };

  const handleRecurrenceOptionChange = (option: string) => {
    setRecurrenceOption(option);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const depasseCategorie = (onOk: () => void) => {
      if (depasseCategorieSeuil) {
        presentAlert({
          header: "Alerte",
          subHeader: "Dépassement du seuil de catégorie défini",
          message:
            "En déclarant cette dépense, vous dépasserez le seuil que vous avez défini pour cette catégorie.",
          buttons: [
            {
              text: "Annuler",
              role: "cancel",
            },
            {
              text: "Continuer",
              handler: onOk,
            },
          ],
        });
      } else if (depasseSousCategorieSeuil) {
        presentAlert({
          header: "Alerte",
          subHeader: "Dépassement du seuil de sous-catégorie défini",
          message:
            "En déclarant cette dépense, vous dépasserez le seuil que vous avez défini pour cette sous-catégorie.",
          buttons: [
            {
              text: "Annuler",
              role: "cancel",
            },
            {
              text: "Continuer",
              handler: onOk,
            },
          ],
        });
      } else {
        onOk(); // Appeler directement la fonction onOk si aucun seuil n'est dépassé
      }
    };
    const onOK = async () => {
      try {
        await axiosPrivate.post("/depense", {
          recurrente,
          recurrenceOption,
          description,
          dateDepense,
          categorieDepense,
          sousCategorie,
          fournisseur,
          montant,
          transactions,
          userEmail,
        });
        console.log("succeeded");
        setRecurrente(false);
        setDateLimite("");
        setDescription("");
        setCategorieDepense("");
        setTransactions([]);
        setSousCategorie("");
        setFournisseur("");

        setNomCategorie("");
        setMontant(null);
        setErrorMessage("");
        history.push("/depenses");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errorMessage
        ) {
          setErrorMessage(error.response.data.errorMessage);
        } else {
          setErrorMessage(
            "Une erreur s'est produite lors de l'ajout de la dépense. Veuillez réessayer."
          );
        }
      }
    };
    depasseCategorie(onOK);
    // depasseSousCategorie(onOK);
    declarer();
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/depenses" />
          </IonButtons>
          <IonTitle>Déclarer une dépense</IonTitle>
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
                      Récurrente
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
                    <IonLabel>Date de dépense:</IonLabel>
                    <IonDatetimeButton datetime="datetime"></IonDatetimeButton>

                    <IonModal keepContentsMounted={true} color="success">
                      <IonDatetime
                        color="success"
                        id="datetime"
                        presentation="date"
                        value={dateDepense}
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
                    <IonLabel>Catégorie de dépense</IonLabel>
                    <IonSelect
                      color="success"
                      value={categorieDepense} // Utilisation de la valeur contrôlée
                      placeholder="Sélectionner la catégorie"
                      onIonChange={(e) => handleCategorieDepense(e)}
                    >
                      {categorieDepenses.map((category: any) => (
                        <IonSelectOption
                          key={category.IdCategorie}
                          value={category.IdCategorie}
                        >
                          {category.nomCategorie}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                  {categorieDepense && (
                    <IonItem>
                      <IonLabel>Sous-catégorie de dépense</IonLabel>
                      <IonSelect
                        value={sousCategorie}
                        placeholder="Sélectionner la sous-catégorie"
                        onIonChange={handleSubcategoryChange}
                      >
                        {sousCategories.map((subcategory: any) => (
                          <IonSelectOption
                            key={subcategory.IdSousCategorie}
                            value={subcategory.IdSousCategorie}
                          >
                            {subcategory.nomSousCategorie}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </IonItem>
                  )}
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
                      <IonButton
                        color="medium"
                        expand="block"
                        onClick={addNewWallet}
                        disabled={montant == sommeMontantsTransactions}
                      >
                        <IonIcon icon={add} />
                      </IonButton>
                    </IonItem>

                    {transactions.map((transaction, index) => (
                      <div key={index}>
                        <>
                          <IonItem>
                            <IonNote slot="end">
                              {" "}
                              <IonButton
                                color="light"
                                onClick={() => removeWallet(index)}
                              >
                                <IonIcon icon={closeOutline} />
                              </IonButton>
                            </IonNote>
                            <h4 style={{ color: "gray" }}>
                              Transaction {index + 1}
                            </h4>
                          </IonItem>
                        </>
                        <IonList>
                          <IonItem>
                            <IonLabel>Mode de paiement</IonLabel>
                            <IonSelect
                              color="success"
                              placeholder="Sélectionner le mode de paiement"
                              onIonChange={(e) => handleMoyen(e, index)}
                              value={transaction.moyen}
                            >
                              <IonSelectOption value="espèces">
                                Espèces
                              </IonSelectOption>
                              <IonSelectOption value="carte_bancaire">
                                Carte bancaire
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

                        {transactions[index].moyen === "carte_bancaire" && (
                          <IonItem>
                            <IonLabel>Sélectionner la carte</IonLabel>
                            <IonSelect
                              color="success"
                              placeholder="Sélectionner la carte"
                              value={transaction.idCrt}
                              onIonChange={(e) => handleCarteName(e, index)}
                            >
                              {transaction.carteOptions.map((option) => (
                                <IonSelectOption
                                  key={option.idCarte}
                                  value={option.idCarte}
                                >
                                  {option.numCarte}
                                </IonSelectOption>
                              ))}
                            </IonSelect>
                          </IonItem>
                        )}

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
                      initial total
                    </p>
                  )}
                  <p style={{ color: "red" }}>
                    {" "}
                    {errorMessage &&
                      "le montant de la dépense dépasse le budget du compte"}
                  </p>
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

export default AddDepense;
