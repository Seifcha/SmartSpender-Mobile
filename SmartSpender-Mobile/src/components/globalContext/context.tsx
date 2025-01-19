{wallets.map((wallet, index) => (
  <div key={index}>
    <IonItem>
      <IonList>
        <IonItem>
          <IonLabel>Mode de paiement</IonLabel>
          <IonSelect
            color="success"
            placeholder="Sélectionner le mode de paiement"
            value={wallet.name}
            onIonChange={(e) => handleWalletNameChange(e, index)}
          >
            <IonSelectOption value="espèces">Espèces</IonSelectOption>
            <IonSelectOption value="carte_bancaire">Carte bancaire</IonSelectOption>
            <IonSelectOption value="portefeuille_électronique">Portefeuille électronique</IonSelectOption>
            <IonSelectOption value="paiement_mobile">Paiement mobile</IonSelectOption>
            <IonSelectOption value="virement_bancaire">Virement bancaire</IonSelectOption>
            <IonSelectOption value="chèques">Chèques</IonSelectOption>
            <IonSelectOption value="monnaies_virtuelles">Monnaies virtuelles</IonSelectOption>
          </IonSelect>
        </IonItem>
        {wallet.name === "carte_bancaire" && (
          <IonItem>
            {/* Afficher les options de carte bancaire */}
            {/* Exemple : */}
            <IonLabel>Choisir une carte bancaire</IonLabel>
            {/* Ajoutez ici les composants pour sélectionner une carte bancaire */}
          </IonItem>
        )}
        {wallet.name === "portefeuille_électronique" && (
          <IonItem>
            {/* Afficher les options de portefeuille électronique */}
            {/* Exemple : */}
            <IonLabel>Choisir un portefeuille électronique</IonLabel>
            {/* Ajoutez ici les composants pour sélectionner un portefeuille électronique */}
          </IonItem>
        )}
        {/* Ajoutez d'autres conditions pour afficher les options spécifiques à chaque mode de paiement */}
      </IonList>
      |
      <IonInput
        type="number"
        placeholder="Montant"
        value={wallet.amount}
        onIonChange={(e) => handleWalletAmountChange(e, index)}
      />
      <IonNote slot="end" className="ion-margin-top">
        Dinars
        <IonButton
          color="warning"
          expand="block"
          onClick={() => removeWallet(index)}
        >
          <IonIcon icon={closeOutline} />
        </IonButton>
      </IonNote>
    </IonItem>
  </div>
))}
