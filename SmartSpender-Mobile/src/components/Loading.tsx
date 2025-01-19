import React from "react";
import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonSkeletonText,
  IonSpinner,
} from "@ionic/react";

const Menu: React.FC = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <IonList>
        <IonItem>
          <IonThumbnail slot="start">
            <IonSkeletonText animated={true}></IonSkeletonText>
          </IonThumbnail>
          <IonLabel>
            <h3>
              <IonSkeletonText
                animated={true}
                style={{ width: "80%" }}
              ></IonSkeletonText>
            </h3>
            <p>
              <IonSkeletonText
                animated={true}
                style={{ width: "60%" }}
              ></IonSkeletonText>
            </p>
            <p>
              <IonSkeletonText
                animated={true}
                style={{ width: "30%" }}
              ></IonSkeletonText>
            </p>
          </IonLabel>
        </IonItem>
      </IonList>
      <IonList>
        <IonItem>
          <IonThumbnail slot="start">
            <IonSkeletonText animated={true}></IonSkeletonText>
          </IonThumbnail>
          <IonLabel>
            <h3>
              <IonSkeletonText
                animated={true}
                style={{ width: "80%" }}
              ></IonSkeletonText>
            </h3>
            <p>
              <IonSkeletonText
                animated={true}
                style={{ width: "60%" }}
              ></IonSkeletonText>
            </p>
            <p>
              <IonSkeletonText
                animated={true}
                style={{ width: "30%" }}
              ></IonSkeletonText>
            </p>
          </IonLabel>
        </IonItem>
      </IonList>
      <IonList>
        <IonItem>
          <IonThumbnail slot="start">
            <IonSkeletonText animated={true}></IonSkeletonText>
          </IonThumbnail>
          <IonLabel>
            <h3>
              <IonSkeletonText
                animated={true}
                style={{ width: "80%" }}
              ></IonSkeletonText>
            </h3>
            <p>
              <IonSkeletonText
                animated={true}
                style={{ width: "60%" }}
              ></IonSkeletonText>
            </p>
            <p>
              <IonSkeletonText
                animated={true}
                style={{ width: "30%" }}
              ></IonSkeletonText>
            </p>
          </IonLabel>
        </IonItem>
      </IonList>
      <p>
        <IonSpinner color="success" /> Chargement du liste...
      </p>
    </div>
  );
};
export default Menu;
