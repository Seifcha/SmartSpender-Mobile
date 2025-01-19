import React from "react";
import axios from "axios";
import { IonButton, IonIcon } from "@ionic/react";
import { trashOutline, createOutline } from "ionicons/icons";

export const DeleteCategorieTransfert = ({ id, onDelete }) => {
  let userEmail;

  // Vérifier si le userEmail est présent dans le localStorage
  if (localStorage.getItem("userEmail")) {
    userEmail = localStorage.getItem("userEmail");
  }
  const handleDelete = async () => {
    try {
      await axios.delete(`http://:9001/transfert/${id}`);
      onDelete(id); // Appeler la fonction de mise à jour après la suppression réussie
    } catch (error) {
      console.error("Error deleting transfert:", error);
    }
  };
  //

  return (
    <IonButton
      fill="clear"
      color="warning"
      onClick={() => {
        handleDelete();
      }}
    >
      <IonIcon icon={trashOutline} />
    </IonButton>
  );
};

export default DeleteCategorieTransfert;
