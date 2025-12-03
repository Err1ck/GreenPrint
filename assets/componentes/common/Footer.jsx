import LinkIcon from "../ui/LinkIcon";

function Footer({ footerType }) {
    return (
        <>
            {footerType === 1 && <LinkIcon name={"imagen2"} />}
            {footerType === 2 && (
                <div className="footer">
                    ©2025 GreenPrint.co, Todos los derechos reservados
                </div>
            )}
        </>
    );
}

export default Footer;
