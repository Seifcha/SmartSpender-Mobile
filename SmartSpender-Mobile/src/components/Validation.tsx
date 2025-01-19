import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonGrid,
} from "@ionic/react";
import { checkmarkSharp } from "ionicons/icons";
import React, { useRef, useState } from "react";
import reset from "../../public/undraw_Forgot_password_re_hxwm-Photoroom.png-Photoroom.png";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";

const CodeValidation: React.FC = () => {
  const { id, token } = useParams<{ id: string; token: string }>();
  console.log("id: ", id);
  console.log("token:", token);

  const [code, setCode] = useState<string[]>(new Array(4).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    new Array(4).fill(null)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const history = useHistory();

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== "" && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyUp = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && index > 0 && code[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = code.join("");
    console.log("Entered code:", enteredCode);
    console.log("userid :", id);

    try {
      const response = await axios.post(
        `http://:9001/validate-reset-code/${id}/${token}`,
        {
          id,
          resetCode: enteredCode,
        }
      );

      if (response.data.valid) {
        history.push(`/reset-password/${id}/${token}`);
      } else {
        setErrorMessage("Code incorrect. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Error validating code", error);
      setErrorMessage("Erreur lors de la validation du code.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Code de vérification</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid fixed>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <div className="ion-margin-top ion-text-center">
                <IonLabel
                  style={{ borderRadius: "15px" }}
                  mode="md"
                  type="number"
                >
                  Entrer le code reçu par Email :
                </IonLabel>
                <IonRow className="ion-margin-top">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <IonCol size="3" className="otp-col" key={index}>
                      <IonInput
                        color="success"
                        style={{
                          width: "80px",
                          borderRadius: "25px",
                          borderTop: "solid",
                          borderRight: "solid",
                          borderLeft: "solid",
                          borderTopColor: "green",
                          borderRightColor: "green",
                          borderLeftColor: "green",
                          textAlign: "center",
                        }}
                        aria-label="OTP input"
                        className="otp-input"
                        mode="md"
                        type="text"
                        maxlength={1}
                        value={code[index]}
                        onIonChange={(e) =>
                          handleChange(index, e.detail.value!)
                        }
                        onKeyUp={(e) => handleKeyUp(index, e)}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                      />
                    </IonCol>
                  ))}
                </IonRow>
              </div>
              <div
                className="ion-text-center ion-padding ion-margin-top"
                style={{ height: "70%" }}
              >
                <img
                  src={reset}
                  alt="smartspender Logo"
                  style={{
                    width: "100%",
                    borderRadius: "10%",
                    marginBottom: "25px",
                  }}
                />
              </div>
              {errorMessage && (
                <p style={{ color: "red", textAlign: "center" }}>
                  {errorMessage}
                </p>
              )}
              <IonButton
                color="success"
                size="large"
                fill="solid"
                shape="round"
                expand="block"
                className="add-button"
                onClick={handleSubmit}
                style={{ marginBottom: "16px" }}
              >
                <IonIcon slot="end" icon={checkmarkSharp} />
                vérifier
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CodeValidation;
