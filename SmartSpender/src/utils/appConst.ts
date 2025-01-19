export const INTERFACE_TYPE = {
  ProductRepository: Symbol.for("ProductRepository"),
  ProductInteractor: Symbol.for("ProductInteractor"),
  ProductController: Symbol.for("ProductController"),
  FournisseurRepository: Symbol.for("FournisseurRepository"),
  FournisseurInteractor: Symbol.for("FournisseurInteractor"),
  FournisseurController: Symbol.for("FournisseurController"),

  CategorieRevenuRepository: Symbol.for("CategorieRevenuRepository"), // Repository de catégorie de revenu
  CategorieRevenuInteractor: Symbol.for("CategorieRevenuInteractor"), // Interactor de catégorie de revenu
  CategorieRevenuController: Symbol.for("CategorieRevenuController"), // Controller de catégorie de revenu

  CategorieDepenseRepository: Symbol.for("CategorieDepenseRepository"), // Repository de catégorie de dépense
  CategorieDepenseInteractor: Symbol.for("CategorieDepenseInteractor"), // Interactor de catégorie de dépense
  CategorieDepenseController: Symbol.for("CategorieDepenseController"), // Controller de catégorie de dépense

  SousCategorieDepenseRepository: Symbol.for("SousCategorieDepenseRepository"),
  SousCategorieDepenseInteractor: Symbol.for("SousCategorieDepenseInteractor"),
  SousCategorieDepenseController: Symbol.for("SousCategorieDepenseController"),

  CategorieFournisseurRepository: Symbol.for("CategorieFournisseurRepository"),
  CategorieFournisseurInteractor: Symbol.for("CategorieFournisseurInteractor"),
  CategorieFournisseurController: Symbol.for("CategorieFournisseurController"),

  CategorieDepenseFournisseurRepository: Symbol.for(
    "CategorieDepenseFournisseurRepository"
  ), // Repository de catégorie de dépense
  CategorieDepenseFournisseurInteractor: Symbol.for(
    "CategorieDepenseFournisseurInteractor"
  ), // Interactor de catégorie de dépense
  CategorieDepenseFournisseurController: Symbol.for(
    "CategorieDepenseFournisseurController"
  ), // Controller de catégorie de dépense

  CategorieRevenuFournisseurRepository: Symbol.for(
    "CategorieRevenuFournisseurRepository"
  ), // Repository de catégorie de dépense
  CategorieRevenuFournisseurInteractor: Symbol.for(
    "CategorieRevenuFournisseurInteractor"
  ), // Interactor de catégorie de dépense
  CategorieRevenuFournisseurController: Symbol.for(
    "CategorieRevenuFournisseurController"
  ), // Controller de catégorie de dépense

  SeuilRepository: Symbol.for("SeuilRepository"),
  SeuilInteractor: Symbol.for("SeuilInteractor"),
  SeuilController: Symbol.for("SeuilController"),

  CompteRepository: Symbol.for("CompteRepository"),
  CompteInteractor: Symbol.for("CompteInteractor"),
  CompteController: Symbol.for("CompteController"),

  CarteRepository: Symbol.for("CarteRepository"),
  CarteInteractor: Symbol.for("CarteInteractor"),
  CarteController: Symbol.for("CarteController"),

  DepenseRepository: Symbol.for("DepenseRepository"),
  DepenseInteractor: Symbol.for("DepenseInteractor"),
  DepenseController: Symbol.for("DepenseController"),

  RevenuRepository: Symbol.for("RevenuRepository"),
  RevenuInteractor: Symbol.for("RevenuInteractor"),
  RevenuController: Symbol.for("RevenuController"),

  TransfertRepository: Symbol.for("TransfertRepository"),
  TransfertInteractor: Symbol.for("TransfertInteractor"),
  TransfertController: Symbol.for("TransfertController"),

  TransactionRepository: Symbol.for("TransactionRepository"),
  TransactionInteractor: Symbol.for("TransactionInteractor"),
  TransactionController: Symbol.for("TransactionController"),

  RegisterRepository: Symbol.for("RegisterRepository"),
  RegisterInteractor: Symbol.for("RegisterInteractor"),
  RegisterController: Symbol.for("RegisterController"),

  AuthRepository: Symbol.for("AuthRepository"),
  AuthInteractor: Symbol.for("AuthInteractor"),
  AuthController: Symbol.for("AuthController"),

  DashboardRepository: Symbol.for("DashboardRepository"),
  DashboardInteractor: Symbol.for("DashboardInteractor"),
  DashboardController: Symbol.for("DashboardController"),

  PasswordRepository: Symbol.for("PasswordRepository"),
  PasswordInteractor: Symbol.for("PasswordInteractor"),
  PasswordController: Symbol.for("PasswordController"),

  NotificationRepository: Symbol.for("NotificationRepository"),
  NotificationInteractor: Symbol.for("NotificationInteractor"),
  NotificationController: Symbol.for("NotificationController"),

  Mailer: Symbol.for("Mailer"),
  MessageBroker: Symbol.for("MessageBroker"),
};
