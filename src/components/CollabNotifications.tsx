import { useCollabNotifications } from "../hooks/useCollabNotifications";
import { addIcon, deleteIcon, closeMenu, myBoxOpenedMenu } from "../data";
import ImageProps from "../props/ImageProps";

interface CollabNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CollabNotifications({
  isOpen,
  onClose,
}: CollabNotificationsProps) {
  const { requests, respondToRequest, deleteNotification } =
    useCollabNotifications();

  if (!isOpen) return null;

  return (
    <div className="login-modal">
      <div className="modal-content">
        <section className="opened-login">
          <section className="opened-menu-logo">
            <ImageProps data={myBoxOpenedMenu} />
          </section>
          <section className="headerItem">Notifications</section>
          <section className="close-menu" onClick={onClose}>
            <ImageProps data={closeMenu} />
          </section>
        </section>

        {requests.length === 0 ? (
          <p>No new requests.</p>
        ) : (
          <ul className="collab-list">
            {requests.map((r) => (
              <li key={r._id} className="collab-item">
                {r.type === "incoming" ? (
                  <>
                    <span style={{ width: "80%" }}>
                      {r.email} invited you to collaborate.
                    </span>
                    <div className="action-buttons">
                      <button
                        onClick={() => respondToRequest(r._id, "accept")}
                        className="delete-btn"
                      >
                        <img src={addIcon[0].image} alt="Add" />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => respondToRequest(r._id, "reject")}
                      >
                        <img src={deleteIcon[0].image} alt="Delete" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span>
                      {r.email}{" "}
                      {r.status === "accepted" ? "accepted" : "rejected"} your
                      invite
                    </span>
                    <button onClick={() => deleteNotification(r._id)}>x</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
