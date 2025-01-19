import { inject, injectable } from "inversify";
import { INotificationInteractor } from "../interfaces/INotificationInteractor";
import { INotificationRepository } from "../interfaces/INotificationRepository";
import { INTERFACE_TYPE } from "../utils";
// import { Buffer } from 'buffer';

@injectable()
export class NotificationInteractor implements INotificationInteractor {
  private repository: INotificationRepository;

  constructor(
    @inject(INTERFACE_TYPE.NotificationRepository)
    repository: INotificationRepository
  ) {
    this.repository = repository;
  }

  async getNotifications(userEmail: string) {
    return await this.repository.findAll(userEmail);
  }
  async getNotification(id: number) {
    return await this.repository.findById(id);
  }

  async modifierVuNotification(id: number) {
    const data = await this.repository.updateVu(id);
    return data;
  }
  //   async ajouterNotification(input: any) {
  //     const data = await this.repository.create(input);
  //     // faire des vérifications
  //     return { insertedCategoryId: data.IdCategorie };
  //   }
}
