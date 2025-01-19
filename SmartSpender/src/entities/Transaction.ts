export class Transaction {
  constructor(
    public readonly idTransaction: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deleted: boolean,
    public readonly deletedAt: Date,
    public readonly montant: number,
    public readonly type: string,
    public readonly moyenPaiement: string,
    public readonly idDepense: number | null,
    public readonly idRevenu: number | null,
    public readonly idCompte: number,
    public readonly idCarte: number
  ) {}
}

// import React, { useState } from "react";
// import {
//   IonPage,
//   IonContent,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonCard,
//   IonCardContent,
//   IonToggle,
//   IonLabel,
//   IonItem,
//   IonInput,
//   IonButton,
//   IonIcon,
//   IonList,
//   IonCardHeader,
//   IonGrid,
//   IonRow,
//   IonCol,
//   IonBackButton,
//   IonButtons,
//   IonNote,
//   IonSelect,
//   IonSelectOption,
// } from "@ionic/react";
// import { useHistory } from "react-router-dom";
// import useAuth from "../../hooks/useAuth"; // Importez le hook useAuth
// import useAxiosPrivate from "../../hooks/useAxiosPrivate";
// import { cloudUploadOutline, checkmarkSharp } from "ionicons/icons";
// import "../ExploreContainer.css"; // Assurez-vous d'importer le fichier CSS
// import axios from "axios";

// const AddCategorieDepense: React.FC = () => {
//   const axiosPrivate = useAxiosPrivate();

//   const history = useHistory();
//   const userEmail = "Ahmed@abc.com";
//   const [nomCompte, setNomCompte] = useState("");
//   const [iban, setIban] = useState("");
//   const [typeCompte, setTypeCompte] = useState("");
//   const [status, setStatus] = useState("");
//   const [solde, setSolde] = useState(null);
//   const [creditLign, setCreditLign] = useState(null);
//   useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [file, setFile] = useState<File | undefined>();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!nomCompte.trim()) {
//       setErrorMessage("Veuillez remplir tous les champs.");
//       return;
//     }

//     let formData = new FormData();

//     formData.append("solde", solde);
//     formData.append("iban", iban);
//     formData.append("typeCompte", typeCompte);
//     formData.append("status", status);
//     formData.append("creditLign", creditLign);
//     formData.append("nomCompte", nomCompte);
//     formData.append("userEmail", userEmail);
//     try {
//       for (var key of formData.entries()) {
//         console.log(key[0] + ", " + key[1]);
//       }
//       const response = await axiosPrivate.post("/ajouter-compte", formData);
//       for (var key of formData.entries()) {
//         console.log(key[0] + ", " + key[1]);
//       }
//       console.log;
//       console.log(response.data);
//       setCreditLign(0);
//       setIban("");
//       setSolde(null);
//       setStatus("");
//       setTypeCompte("");

//       console.log("succeeded");
//       setNomCompte("");
//       setErrorMessage("");
//       history.push("/comptes");
//     } catch (error) {
//       console.error("Error adding categorie", error);
//       setErrorMessage(
//         "Une erreur s'est produite lors de l'ajout de la catégorie. Veuillez réessayer."
//       );
//     }
//   };
//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonButtons slot="start">
//             <IonBackButton defaultHref="/edit-categorie-depense" />
//           </IonButtons>
//           <IonTitle style={{ textAlign: "center" }}>Ajouter un compte</IonTitle>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent scrollY={true} className="ion-padding">
//         <IonGrid fixed>
//           <IonRow className="ion-justify-content-center"></IonRow>

//           <IonCard>
//             <IonCardContent>
//               <IonItem>
//                 <IonInput
//                   style={{
//                     boxShadow:
//                       "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
//                     borderRadius: "15px",
//                     textAlign: "center",
//                   }}
//                   mode="md"
//                   labelPlacement="floating"
//                   label={"­ Nom du compte:"}
//                   value={nomCompte}
//                   onIonChange={(e) => setNomCompte(e.detail.value!)}
//                   color="success"
//                 />
//               </IonItem>

//               <IonItem className="ion-margin-top">
//                 <IonInput
//                   style={{
//                     boxShadow:
//                       "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
//                     borderRadius: "15px",
//                     textAlign: "center",
//                   }}
//                   mode="md"
//                   labelPlacement="floating"
//                   label={"­ N° IBAN:"}
//                   value={iban}
//                   onIonChange={(e) => setIban(e.detail.value!)}
//                   color="success"
//                 />
//               </IonItem>

//               <IonList>
//                 <IonItem className="ion-margin-top">
//                   <IonLabel>Type de compte</IonLabel>
//                   <IonSelect
//                     color="success"
//                     placeholder="Sélectionner le type"
//                     value={typeCompte}
//                     onIonChange={(e) => setTypeCompte(e.detail.value!)}
//                   >
//                     <IonSelectOption value="wallet_cash">
//                       Wallet cash (Espèce)
//                     </IonSelectOption>
//                     <IonSelectOption value="compte_bancaire">
//                       Bancaire
//                     </IonSelectOption>
//                     <IonSelectOption value="compte_electronique">
//                       Electronique
//                     </IonSelectOption>
//                     <IonSelectOption value="compte_mobile">
//                       Mobile
//                     </IonSelectOption>
//                   </IonSelect>
//                 </IonItem>
//               </IonList>
//               <IonList>
//                 <IonItem className="ion-margin-top">
//                   <IonLabel>Status</IonLabel>
//                   <IonSelect
//                     color="success"
//                     placeholder="Sélectionner le status"
//                     value={status}
//                     onIonChange={(e) => setStatus(e.detail.value!)}
//                   >
//                     <IonSelectOption value="actif">Actif</IonSelectOption>
//                     <IonSelectOption value="fermé">Fermé</IonSelectOption>
//                     <IonSelectOption value="Gelé">Gelé</IonSelectOption>
//                   </IonSelect>
//                 </IonItem>
//               </IonList>
//               <IonItem className="ion-margin-top">
//                 <IonInput
//                   style={{
//                     boxShadow:
//                       "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
//                     borderRadius: "15px",
//                     textAlign: "center",
//                   }}
//                   mode="md"
//                   labelPlacement="floating"
//                   type="number"
//                   label={"­ Solde:"}
//                   value={solde}
//                   onIonChange={(e) => setSolde(e.detail.value)}
//                   color="success"
//                 />
//                 <IonNote slot="end">Dinars</IonNote>
//               </IonItem>
//               <IonItem className="ion-margin-top">
//                 <IonInput
//                   style={{
//                     boxShadow:
//                       "0 4px 6px -5px hsl(0, 0%, 40%), inset 2px 6px 10px -3px black, inset 0 1px 4px rgba(255, 255, 255, 0.5)",
//                     borderRadius: "15px",
//                     textAlign: "center",
//                   }}
//                   mode="md"
//                   labelPlacement="floating"
//                   type="number"
//                   label={"­ Ligne de crédit:"}
//                   color="success"
//                   value={creditLign}
//                   onIonChange={(e) => setCreditLign(e.detail.value!)}
//                 />
//                 <IonNote slot="end">Dinars</IonNote>
//               </IonItem>
//             </IonCardContent>
//           </IonCard>

//           <IonButton
//             color="success"
//             size="large"
//             fill="solid"
//             shape="round"
//             expand="block"
//             className="add-button"
//             onClick={handleSubmit}
//             style={{ marginBottom: "16px" }}
//           >
//             <IonIcon slot="end" icon={checkmarkSharp} />
//             Ajouter
//           </IonButton>
//         </IonGrid>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default AddCategorieDepense;
