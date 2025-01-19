import React, { useState, useEffect, useRef } from "react";
import { AxiosError } from "axios";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonGrid,
  IonRow,
  IonCol,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  IonCardTitle,
  IonCardSubtitle,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonItem,
  IonInput,
  IonFabButton,
  IonIcon,
  IonFab,
  IonList,
  IonSelectOption,
  IonLabel,
  IonSelect,
  IonDatetimeButton,
  IonDatetime,
  IonModal,
  IonNote,
  IonAlert,
} from "@ionic/react";
import axios from "axios";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "./intro.css";
import register from "../../public/Register.png";

import {
  arrowForwardOutline,
  cloudUploadOutline,
  add,
  warning,
  document,
  globe,
  colorPalette,
  chevronUpCircle,
} from "ionicons/icons";
import { Link, useHistory } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
const SwiperButtonNext = ({ children }: any) => {
  const swiper = useSwiper();
  return (
    <IonFab
      slot="fixed"
      vertical="bottom"
      horizontal="end"
      style={{ marginBottom: "400px", marginRight: "20px" }}
      onClick={() => swiper.slideNext()}
    >
      {children}
      <IonFabButton color="success" className="ion-fab-buttonn">
        <IonIcon icon={arrowForwardOutline} />
      </IonFabButton>
    </IonFab>
  );
};
const CustomSwiper = () => {
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const history = useHistory();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [adresse, setAdresse] = useState("");
  const [phone, setPhone] = useState("");
  const [domaineTravail, setDomaineTravail] = useState("");
  const [posteTravail, setPosteTravail] = useState("");
  const currentDate = new Date().toISOString();
  const [dateNaissance, setDateNaissance] = useState(currentDate);
  const [userEmail, setUserEmail] = useState("");
  const [nomCompte, setNomCompte] = useState("");
  const [iban, setIban] = useState("");
  const [typeCompte, setTypeCompte] = useState("wallet_cash");
  const [status, setStatus] = useState("");
  const [solde, setSolde] = useState(null);
  const [creditLign, setCreditLign] = useState(0);
  const [tauxInteret, setTauxInteret] = useState(0);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [pwd, matchPwd]);

  const handleDateChange = (event) => {
    setDateNaissance(event.detail.value);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = PWD_REGEX.test(pwd);
    if (!v) {
      setErrMsg("entrée invalide");
      return;
    }
    const formdata = new FormData();

    // Ajouter les données du formulaire au formdata
    formdata.append("photo", file);
    formdata.append("nom", nom);
    formdata.append("prenom", prenom);
    formdata.append("genre", genreOption);
    formdata.append("dateNaissance", dateNaissance);
    formdata.append("adresse", adresse);
    formdata.append("phone", phone);
    formdata.append("domaineTravail", domaineTravail);
    formdata.append("posteTravail", posteTravail);
    formdata.append("userEmail", userEmail);
    formdata.append("mdp", pwd);
    for (var key of formdata.entries()) {
      console.log(key[0] + ", " + key[1]);
    }
    try {
      // Envoyer les données à l'API
      const response = await axios.post("http://:9001/register", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const formData = new FormData();
      formData.append("solde", solde);
      formData.append("nomCompte", nomCompte);
      formData.append("userEmail", userEmail);
      formData.append("typeCompte", typeCompte);
      formData.append("status", status);
      formData.append("creditLign", creditLign);
      formData.append("tauxInteret", tauxInteret);
      formData.append("iban", iban);

      // Ajouter les données des wallets au formdata
      // wallets.forEach((wallet, index) => {
      //   formdata.append(`wallets[${index}][name]`, wallet.name);
      //   formdata.append(`wallets[${index}][amount]`, wallet.amount);
      // });
      for (var key of formdata.entries()) {
        console.log(key[0] + ", " + key[1]);
      }
      const response2 = await axiosPrivate.post("/ajouter-compte", formData);
      for (var key of formData.entries()) {
        console.log(key[0] + ", " + key[1]);
      }
      // Traiter la réponse de l'API
      console.log("Réponse de l'API :", response.data);

      setAdresse("");
      setMatchPwd("");
      setDateNaissance(null);
      setDomaineTravail("");
      setGenreOption(null);
      setPwd("");
      setNom("");
      setPhone(""), setUserEmail("");
      setPosteTravail("");
      setWallets([]);
      history.push(`/login`);
    } catch (err: AxiosError) {
      if (!err?.response) {
        setErrMsg("le serveur ne répond pas");
      } else if (err.response?.status === 409) {
        setErrMsg("Cet email est déjà utilisé");
      } else {
        setErrMsg("l'inscription a échoué");
      }
    }
  };

  const [file, setFile] = useState<File | undefined>();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const [genre, setGenre] = useState(false);
  const [cash, setCash] = useState("");
  const [wallets, setWallets] = useState([]);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);

  const handleCashChange = (e) => {
    setCash(e.target.value);
  };

  const handleWalletNameChange = (e, index) => {
    const updatedWallets = [...wallets];
    updatedWallets[index].name = e.target.value;
    setWallets(updatedWallets);
  };

  const handleWalletAmountChange = (e, index) => {
    const updatedWallets = [...wallets];
    updatedWallets[index].amount = e.target.value;
    setWallets(updatedWallets);
  };

  const addNewWallet = () => {
    setWallets([...wallets, { name: "", amount: "" }]);
  };

  const confirmDeclaration = () => {
    // Votre logique pour confirmer la déclaration
  };

  const [genreOption, setGenreOption] = useState(""); // Nouvel état pour suivre l'option de récurrence sélectionnée

  const handleGenreOptionChange = (option: string) => {
    setGenreOption(option);
  };
  return (
    <Swiper>
      <SwiperSlide>
        <IonPage>
          <IonContent className="ion-padding" scrollY={true}>
            {/* Les éléments suivants ne sont pas fixés */}
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                  <div className="ion-text-center ">
                    <IonText
                      className="ion-justify-content-center ion-padding"
                      style={{
                        fontWeight: "bold",
                        fontSize: "1em",
                        fontStyle: "italic",
                        textAlign: "center",
                      }}
                    >
                      Inscrivez-vous pour une expérience de gestion des dépenses
                      tunisienne exceptionnelle !
                    </IonText>
                  </div>
                  <IonItem className="ion-margin-top">
                    <IonInput
                      style={{
                        borderRadius: "15px",
                      }}
                      mode="md"
                      type="text"
                      labelPlacement="floating"
                      label="Nom:"
                      placeholder="Smart"
                      color="success"
                      className="input"
                      value={nom}
                      onIonChange={(e) => setNom(e.detail.value!)}
                    />
                  </IonItem>
                  <IonItem className="ion-margin-top">
                    <IonInput
                      style={{
                        borderRadius: "15px",
                      }}
                      mode="md"
                      labelPlacement="floating"
                      label="Prénom:"
                      type="text"
                      color="success"
                      placeholder="Spender"
                      className="input"
                      value={prenom}
                      onIonChange={(e) => setPrenom(e.detail.value!)}
                    />
                  </IonItem>

                  <IonList className="ion-margin-top" color="success">
                    <IonItem>
                      <IonLabel>Genre :</IonLabel>
                      <IonSelect
                        color="success"
                        value={genreOption}
                        placeholder="Sélectionner genre"
                        onIonChange={(e) =>
                          handleGenreOptionChange(e.detail.value)
                        }
                      >
                        <IonSelectOption value="Homme" color="success">
                          HOMME
                        </IonSelectOption>
                        <IonSelectOption value="Femme" color="success">
                          FEMME
                        </IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonList>
                  <IonItem className="ion-margin-top">
                    <IonLabel>Date de naissance:</IonLabel>
                    <IonDatetimeButton datetime="datetime"></IonDatetimeButton>

                    <IonModal keepContentsMounted={true} color="success">
                      <IonDatetime
                        color="success"
                        id="datetime"
                        presentation="date"
                        value={dateNaissance}
                        onIonChange={handleDateChange}
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
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
          <SwiperButtonNext></SwiperButtonNext>
        </IonPage>
      </SwiperSlide>

      <SwiperSlide>
        <IonPage>
          <IonContent className="ion-padding" scrollY={true}>
            {/* Les éléments suivants ne sont pas fixés */}
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                  <div className="ion-text-center ">
                    <IonText
                      className="ion-justify-content-center ion-padding"
                      style={{
                        fontWeight: "bold",
                        fontSize: "1em",
                        fontStyle: "italic",
                        textAlign: "center",
                      }}
                    >
                      Vivez le meilleur voyage vers une gestion financière
                      optimale !
                    </IonText>
                  </div>
                  <IonItem lines="none" className="ion-margin-top">
                    <IonLabel position="stacked">
                      Importer une photo de profil
                    </IonLabel>
                    <label className="file-input-label">
                      <IonButton color="medium" size="small">
                        <IonIcon icon={cloudUploadOutline} slot="start" />
                        Choisir une <br /> photo de profil
                      </IonButton>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        className="file-input"
                      />
                    </label>
                  </IonItem>

                  <IonItem className="ion-margin-top">
                    <IonInput
                      style={{
                        borderRadius: "15px",
                      }}
                      mode="md"
                      labelPlacement="floating"
                      label="Adresse:"
                      type="text"
                      placeholder="Avenue Habib Bourguiba - 2080 Ariana - Tunisie"
                      color="success"
                      className="input"
                      value={adresse}
                      onIonChange={(e) => setAdresse(e.detail.value!)}
                    />
                  </IonItem>
                  <IonItem className="ion-margin-top">
                    <IonInput
                      style={{
                        borderRadius: "15px",
                      }}
                      mode="md"
                      type="tel"
                      labelPlacement="floating"
                      label="Téléphone:"
                      placeholder="99999999"
                      color="success"
                      className="input"
                      value={phone}
                      onIonChange={(e) => setPhone(e.detail.value!)}
                    />
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
          <SwiperButtonNext></SwiperButtonNext>
        </IonPage>
      </SwiperSlide>
      <SwiperSlide>
        <IonPage>
          <IonContent className="ion-padding" scrollY={true}>
            {/* Les éléments suivants ne sont pas fixés */}
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                  <div className="ion-text-center ">
                    <IonText
                      className="ion-justify-content-center ion-padding"
                      style={{
                        fontWeight: "bold",
                        fontSize: "1em",
                        fontStyle: "italic",
                        textAlign: "center",
                      }}
                    >
                      Découvrez une nouvelle façon de suivre vos dépenses avec
                      facilité !
                    </IonText>
                  </div>
                  <IonItem className="ion-margin-top">
                    <IonInput
                      style={{
                        borderRadius: "15px",
                      }}
                      mode="md"
                      labelPlacement="floating"
                      label="Domaine de travail:"
                      type="text"
                      color="success"
                      className="input"
                      placeholder="Médecine "
                      value={domaineTravail}
                      onIonChange={(e) => setDomaineTravail(e.detail.value!)}
                    />
                  </IonItem>
                  <IonItem className="ion-margin-top">
                    <IonInput
                      style={{
                        borderRadius: "15px",
                      }}
                      mode="md"
                      type="email"
                      labelPlacement="floating"
                      label="Poste de travail:"
                      placeholder="Médecin Généraliste"
                      color="success"
                      className="input"
                      value={posteTravail}
                      onIonChange={(e) => setPosteTravail(e.detail.value!)}
                    />
                  </IonItem>
                  <div className="ion-margin-top">
                    <IonLabel
                      style={{
                        borderRadius: "15px",
                      }}
                      mode="md"
                      type="number"
                    >
                      Entrer votre wallet-cash primaire
                    </IonLabel>
                    <div>
                      <IonItem>
                        <IonInput
                          style={{
                            borderRadius: "15px",
                            textAlign: "center",
                          }}
                          mode="md"
                          labelPlacement="floating"
                          label={"­ Nom :"}
                          value={nomCompte}
                          onIonChange={(e) => setNomCompte(e.detail.value!)}
                          color="success"
                        />
                        |
                        <IonInput
                          style={{
                            borderRadius: "15px",
                            textAlign: "center",
                          }}
                          mode="md"
                          labelPlacement="floating"
                          type="number"
                          label={"­ Solde:"}
                          value={solde}
                          onIonChange={(e) => setSolde(e.detail.value)}
                          color="success"
                        />
                        <IonNote slot="end" className="ion-margin-top">
                          Dinars
                        </IonNote>
                      </IonItem>
                    </div>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
          <SwiperButtonNext></SwiperButtonNext>
        </IonPage>
      </SwiperSlide>

      <SwiperSlide>
        <IonPage>
          <IonContent className="ion-padding" scrollY={false}>
            {/* Les éléments suivants ne sont pas fixés */}
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
                  <div className="ion-text-center ">
                    <IonText
                      className="ion-justify-content-center ion-padding"
                      style={{
                        fontWeight: "bold",
                        fontSize: "1em",
                        fontStyle: "italic",
                        textAlign: "center",
                      }}
                    >
                      L'équipe de Smart-Spender vous souhaite une bonne
                      expérience!
                    </IonText>
                  </div>
                  <p
                    style={{ color: "red" }}
                    ref={errRef}
                    className={errMsg ? "errmsg" : "offscreen"}
                    aria-live="assertive"
                  >
                    {errMsg}
                  </p>
                  <IonItem className="ion-margin-top">
                    <IonInput
                      style={{
                        borderRadius: "15px",
                      }}
                      mode="md"
                      type="email"
                      labelPlacement="floating"
                      label="E-mail:"
                      placeholder="exemple@email.com"
                      color="success"
                      className="input"
                      value={userEmail}
                      onIonChange={(e) => setUserEmail(e.detail.value!)}
                    />
                  </IonItem>

                  <IonItem className="ion-margin-top">
                    <IonInput
                      style={{
                        borderRadius: "15px",
                      }}
                      mode="md"
                      labelPlacement="floating"
                      label="Mot de passe:"
                      type="password"
                      color="success"
                      className="input"
                      value={pwd}
                      onIonChange={(e) => setPwd(e.detail.value!)}
                    />
                  </IonItem>
                  <p
                    className={
                      validMatch ? "instructions valid" : "instructions invalid"
                    }
                  >
                    {!validMatch ? (
                      <>Les mots de passe ne correspondent pas.</>
                    ) : (
                      <>Correspondance du mot de passe.</>
                    )}
                  </p>
                  <IonItem className="ion-margin-top">
                    <IonInput
                      style={{
                        borderRadius: "15px",
                      }}
                      mode="md"
                      labelPlacement="floating"
                      label="Confirmer mot de passe:"
                      type="password"
                      color="success"
                      className="input"
                      value={matchPwd}
                      onIonChange={(e) => setMatchPwd(e.detail.value!)}
                      aria-invalid={validMatch ? "false" : "true"}
                    />
                  </IonItem>
                  <p
                    className={
                      validPwd ? "instructions valid" : "instructions invalid"
                    }
                  >
                    {!validPwd ? (
                      <>
                        Le mot de passe doit comporter entre 8 et 24 caractères
                        et inclure au moins une lettre majuscule, une lettre
                        minuscule, un chiffre et un caractère spécial parmi !,
                        @, #, $, %.
                      </>
                    ) : (
                      <p style={{ color: "#6bd26b" }}>Mot de passe valide.</p>
                    )}
                  </p>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
          <IonFab
            slot="fixed"
            vertical="bottom"
            horizontal="end"
            style={{ marginBottom: "400px", marginRight: "20px" }}
            onClick={handleSubmit}
          >
            <IonFabButton color="success" className="ion-fab-buttonn">
              <IonIcon icon={arrowForwardOutline} />
            </IonFabButton>
          </IonFab>
        </IonPage>
      </SwiperSlide>
    </Swiper>
  );
};

export default CustomSwiper;
