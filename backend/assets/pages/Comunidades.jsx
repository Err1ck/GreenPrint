import Navbar from "../componentes/common/Navbar";
import "../styles/Comunidades.css";

function ComunidadesPage() {
    return (
        <>
            <div className="navbarLeft-content">
                <Navbar navbarType={1} />
            </div>
            <div className="main-layout-container">
                <div className="spacer-left"></div>
                <main className="main-content"></main>
                <div className="spacer-right"></div>
            </div>
            <div className="navbarRight-content">
                <Navbar navbarType={2} />
            </div>
        </>
    );
}

export default ComunidadesPage;
