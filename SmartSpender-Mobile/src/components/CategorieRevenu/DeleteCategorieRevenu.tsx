import React, { useEffect } from "react";
import axios from "axios";
import { IonButton, IonIcon } from "@ionic/react";
import { trashOutline, createOutline } from "ionicons/icons";

export const DeleteCategorieRevenu = ({ id, onDelete }) => {
  let userEmail;
  useEffect(() => {
    userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      // Si l'utilisateur n'est pas connecté, redirigez-le vers la page de connexion
      history.push("/login");
    }
  }, []);
  const handleDelete = async () => {
    try {
      await axios.delete(`http://:9001/categories-revenus/${id}`);
      onDelete(id); // Appeler la fonction de mise à jour après la suppression réussie
    } catch (error) {
      console.error("Error deleting category:", error);
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

export default DeleteCategorieRevenu;
