import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import ImageProps from "../props/ImageProps";
import { myBoxOpenedMenu, closeMenu } from "../data";

interface ISupportProps {
  isOpen: boolean;
  onClose: () => void;
}

const Support = (props: ISupportProps) => {
  if (!props.isOpen) return null;

  const { t } = useTranslation();
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICEID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATEID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLICKEY;

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = async () => {
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
          time: new Date().toLocaleString(),
        },
        publicKey,
      );
      alert(t("supportSuccess"));
      props.onClose();
    } catch (error) {
      alert(t("supportError"));
    }
  };

  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(!form.email || !form.subject || !form.message);
  }, [form.email, form.subject, form.message]);

  return (
    <div className="login-modal">
      <div className="modal-content">
        <section className="opened-login">
          <section className="opened-menu-logo">
            <ImageProps data={myBoxOpenedMenu} />
          </section>
          <h2>{t("supportTitle")}</h2>
          <section className="close-menu" onClick={props.onClose}>
            <ImageProps data={closeMenu} />
          </section>
        </section>

        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <input
            type="text"
            name="name"
            placeholder={t("name")}
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder={t("email")}
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="subject"
            placeholder={t("subject")}
            value={form.subject}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder={t("message")}
            value={form.message}
            onChange={handleChange}
            required
            style={{ minHeight: "100px" }}
          />

          <div
            style={{
              display: "flex",
              gap: "1rem",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <>
              <button type="button" disabled={isDisabled} onClick={handleSend}>
                {t("send")}
              </button>
            </>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Support;
