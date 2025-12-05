import LinkIcon from "../ui/LinkIcon";

function Footer({ footerType }) {
    return (
        <>
            {footerType === 1 && (
                <div className="footer1">
                    <div className="footer1-container">
                        <LinkIcon name={"imagen2"} />
                        <span className="info-username">DanielRoses</span>
                        <LinkIcon name={"icon37"} />
                    </div>
                </div>
            )}
            {footerType === 2 && (
                <div className="footer2">
                    ©2025 GreenPrint.co, Todos los derechos reservados
                </div>
            )}
        </>
    );
}

export default Footer;
