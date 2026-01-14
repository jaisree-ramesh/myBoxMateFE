import { useState } from "react";
import ImageProps from "../props/ImageProps";
import { addIcon, deleteIcon, closeMenu, myBoxOpenedMenu } from "../data";
import { useCollaborators } from "../hooks/useCollaborators";
import { useTranslation } from "react-i18next";

interface CollaboratorsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Collaborators({ isOpen, onClose }: CollaboratorsProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null); //  success message

  const { collaborators, loading, addCollaborator, removeCollaborator } =
    useCollaborators();

  if (!isOpen) return null;

  //  Handle invite button
  const handleAdd = async () => {
    if (!email) return;
    try {
      await addCollaborator(email);
      setEmail(""); // clear input
      setMessage("Invitation sent successfully ");
      // hide after 3s
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to send invite ");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="login-modal">
      <div className="modal-content">
        {/* Header */}
        <section className="opened-login">
          <section className="opened-menu-logo">
            <ImageProps data={myBoxOpenedMenu} />
          </section>
          <section className="headerItem">{t("collaborators")}</section>
          <section className="close-menu" onClick={onClose}>
            <ImageProps data={closeMenu} />
          </section>
        </section>

        {/* Collaborators List */}
        {collaborators.length === 0 ? (
          <p className="no-collab">{t("noCollaborators")}</p>
        ) : (
          <ul className="collab-list">
            {collaborators.map((c) => (
              <li key={c._id} className="collab-item">
                <span>{c.email}</span>
                <button
                  className="delete-btn"
                  onClick={() => removeCollaborator(c.email)}
                >
                  <ImageProps data={deleteIcon} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Add Collaborator */}
        <div className="add-collab">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="add-btn" disabled={loading} onClick={handleAdd}>
            <ImageProps data={addIcon} />
          </button>
        </div>

        {/*  Feedback Message */}
        {message && <p className="success-msg">{message}</p>}
      </div>
    </div>
  );
}
