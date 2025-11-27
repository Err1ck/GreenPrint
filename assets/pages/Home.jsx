import React from "react";
import Navbar from "../componentes/common/Navbar";
import "../componentes/common/Navbar.css";
function TestHomePage() {
    return (
        <>
            <Navbar navbarType={1} />;
            <Navbar navbarType={2} />;
        </>
    );
}

export default TestHomePage;
