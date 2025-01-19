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
  IonAvatar,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import axios from "axios";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "./intro.css";

import {
  exitOutline,
  arrowForwardOutline,
  cloudUploadOutline,
  add,
  warning,
  document,
  globe,
  colorPalette,
  chevronUpCircle,
} from "ionicons/icons";
import register from "../../public/Register.png";

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
const EditProfil = () => {
  const [values, setValues] = useState({
    nom: "",
    prenom: "",
    adresse: "",
    phone: "",
    domaineTravail: "",
    posteTravail: "",
    photoProfil: null,
  });

  const history = useHistory();

  let userEmail;
  useEffect(() => {
    userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
      history.push("/login");
    }
    if (userEmail) {
      // Assurez-vous que userEmail est défini avant de faire l'appel
      axios
        .get(`http://:9001/user/${userEmail}`)
        .then((res) => {
          const data = res.data;
          console.log(data);
          setValues({
            ...values,
            nom: data.nom,
            prenom: data.prenom,
            adresse: data.adresse,
            domaineTravail: data.domaineTravail,
            posteTravail: data.posteTravail,
            phone: data.phone,
            photoProfil: data.photoProfil,
          });
        })
        .catch((err) => console.log(err));
    }
  }, []);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    console.log("changed");
  }, [values.photoProfil]);
  const errRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValues((prevValues) => ({
        ...prevValues,
        photoProfil: file,
      }));
      // Hide the image when a new file is selected
      // setImageHidden(true);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      nom,
      prenom,
      adresse,
      phone,
      domaineTravail,
      posteTravail,
      photoProfil,
    } = values;

    try {
      const formdata = new FormData();
      formdata.append("photoProfil", photoProfil);
      formdata.append("nom", nom);
      formdata.append("prenom", prenom);
      formdata.append("adresse", adresse);
      formdata.append("phone", phone);
      formdata.append("domaineTravail", domaineTravail);
      formdata.append("posteTravail", posteTravail);

      await axios.put(`http://:9001/user/${userEmail}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Modification réussie");
      setValues({
        nom: "",
        prenom: "",
        adresse: "",
        phone: "",
        domaineTravail: "",
        posteTravail: "",
        photoProfil: null,
      });
      setErrMsg("");
    } catch (error) {
      console.error("Erreur lors de la modification du profil", error);
      setErrMsg(
        "Une erreur s'est produite lors de la modification du profil. Veuillez réessayer."
      );
    }
  };

  const handleLogout = () => {
    // Logique de déconnexion
    // Après la déconnexion, remplacer l'URL par la page d'accueil
    // history.replace("/login");
    localStorage.removeItem("userEmail");
    history.push("/login");
  };

  const confirmDeclaration = () => {
    // Votre logique pour confirmer la déclaration
  };

  const [genreOption, setGenreOption] = useState(""); // Nouvel état pour suivre l'option de récurrence sélectionnée

  const handleGenreOptionChange = (option: string) => {
    setGenreOption(option);
  };
  const getImageSrc = (imageData, mimetype) => {
    if (imageData instanceof File) {
      // Si l'image est une instance de File, retourner une URL Object pour l'afficher
      return URL.createObjectURL(imageData);
    } else {
      // Sinon, traiter l'image comme avant
      const base64Prefix = `data:${mimetype};base64,`;
      return base64Prefix + imageData;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>

          <IonTitle>Profil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" scrollY={true}>
        {/* Les éléments suivants ne sont pas fixés */}
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <div className="ion-text-center ion-padding">
                <img
                  src={getImageSrc(values.photoProfil, "image/png")} // Assurez-vous que le type MIME est correct
                  alt="photo de profil"
                  style={{
                    width: "50%",
                    borderRadius: "50%",
                    border: "solid",
                  }}
                />
              </div>
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
                  {values.nom} {values.prenom}
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
                  value={values.nom}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      nom: e.target.value,
                    }))
                  }
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
                  value={values.prenom}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      prenom: e.target.value,
                    }))
                  }
                />
              </IonItem>

              <div className="ion-text-center ">
                <IonText
                  className="ion-justify-content-center ion-padding"
                  style={{
                    fontWeight: "bold",
                    fontSize: "1em",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                ></IonText>
              </div>
              <IonItem lines="none">
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
                  value={values.adresse}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      adresse: e.target.value,
                    }))
                  }
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
                  placeholder="75258966"
                  color="success"
                  className="input"
                  value={values.phone}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      phone: e.target.value,
                    }))
                  }
                />
              </IonItem>

              <div className="ion-text-center ">
                <IonText
                  className="ion-justify-content-center ion-padding"
                  style={{
                    fontWeight: "bold",
                    fontSize: "1em",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                ></IonText>
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
                  value={values.domaineTravail}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      domaineTravail: e.target.value,
                    }))
                  }
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
                  value={values.posteTravail}
                  onIonChange={(e) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      posteTravail: e.target.value,
                    }))
                  }
                />
              </IonItem>

              <div className="ion-text-center ">
                <IonText
                  className="ion-justify-content-center ion-padding"
                  style={{
                    fontWeight: "bold",
                    fontSize: "1em",
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                ></IonText>
              </div>
              <p
                style={{ color: "red" }}
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonText color="success">
          <p>{success}</p>
        </IonText>
        <IonButton
          color="success"
          size="large"
          fill="solid"
          shape="round"
          expand="block"
          className="add-button"
          onClick={handleSubmit} // Directly pass the handleSubmit function
          style={{ marginBottom: "16px" }}
        >
          Modifier
        </IonButton>
        <Link style={{ color: "white", textDecoration: "none" }} to="/login">
          <IonButton
            color="medium"
            size="large"
            fill="solid"
            shape="round"
            expand="block"
            className="add-button"
            style={{ marginBottom: "16px" }}
            onClick={handleLogout}
          >
            Se déconnecter
            <IonIcon icon={exitOutline} slot="end" />
          </IonButton>
        </Link>
      </IonContent>
    </IonPage>
  );
};
//le code de notif est envoyé à moi par messenger
export default EditProfil;
