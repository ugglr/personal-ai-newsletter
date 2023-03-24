import { useState } from "react";
import styles from "./Card.module.css";

const Card: React.FC<{
  value: string;
  onDelete: () => Promise<void>;
}> = ({ value, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <div className={styles.card}>
      <p>{value}</p>

      <div>
        <button
          type="button"
          onClick={() => setShowConfirm((current) => !current)}
        >
          delete
        </button>
        {showConfirm && (
          <button className={styles.redButton} type="button" onClick={onDelete}>
            Confirm?
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
