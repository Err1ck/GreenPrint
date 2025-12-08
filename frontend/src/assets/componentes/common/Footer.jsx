import LinkIcon from "../ui/LinkIcon";

function Footer({ footerType }) {
  return (
    <>
      {footerType === 1 && (
        <div className="footer1">
          <div className="footer1-container">
            <LinkIcon name={"imagen2"} />
            <span className="info-username">DanielRoses</span>
            <LinkIcon name={"exit"} />
          </div>
        </div>
      )}
      {footerType === 2 && (
        <div className="footer2">
          <div>©2025 GreenPrint.co,</div>
          <div>Todos los derechos reservados</div>
        </div>
      )}
    </>
  );
}

export default Footer;
