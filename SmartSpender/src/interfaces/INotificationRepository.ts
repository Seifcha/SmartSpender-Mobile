import { Notification } from "../entities/Notification";
import Buffer from "buffer";
export interface INotificationRepository {
  //   create(categorie: Notification): Promise<Notification>;
  //   modifierNotification(
  //     id: number,
  //     nomCategorie: string,
  //     image: string,
  //     possedeFournisseurDepense: number
  //   );

  findAll(userEmail: string): Promise<Notification[]>;
  findById(id: number): Promise<Notification | null>;
  updateVu(id: number): Promise<Notification>;
}
