import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { IoIosSync } from 'react-icons/io'; // Importando o ícone de spinner
import styles from './styles.module.scss';

export default function Banner() {
  const [bannerData, setBannerData] = useState({ url: '', text: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBannerData = async () => {
      setIsLoading(true);
      const db = getFirestore();
      const docRef = doc(db, "banner", "current");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBannerData(docSnap.data());
      } else {
        console.log("No such document!");
      }
      setIsLoading(false);
    };

    fetchBannerData();
  }, []);

  const Spinner = () => (
    <div className={styles.spinnerContainer}>
      <IoIosSync className={styles.spinnerIcon} />
    </div>
  );

  return (
    <div className={styles.imageBanner} style={{ backgroundImage: `url(${bannerData.url})` }}>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className={styles.textBanner}>
          <p>{bannerData.text}</p>
        </div>
      )}
    </div>
  );
}
