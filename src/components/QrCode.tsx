import QRCode from "react-qr-code";

type QrCodeProps = {
  value: string;
};

function QrCode({ value }: QrCodeProps) {
  return (
    <section
      style={{
        height: "auto",
        margin: "0 auto",
        maxWidth: 64,
        width: "100%",
      }}
    >
      <QRCode
        size={256}
        style={{
          height: "auto",
          maxWidth: "100%",
          width: "100%",
        }}
        value={value}
        viewBox={`0 0 256 256`}
      />
    </section>
  );
}

export default QrCode;
