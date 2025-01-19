import { Notification } from "../entities/Notification";
import Buffer from "buffer";
export interface INotificationInteractor {
  //   ajouterNotification(input: any);
  //   modifierNotification(
  //     id: number,
  //     nomCategorie: string,
  //     image: string,
  //     possedeFournisseurDepense: number,
  //     idCategoriesFournisseurSelected: number[]
  //   );

  getNotifications(userEmail: string);
  getNotification(id: number);
  // a voir si le promise est obligatoir ou non
  modifierVuNotification(id: number);
}
