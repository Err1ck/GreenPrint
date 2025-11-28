import React from "react";
import Navbar from "../componentes/common/Navbar";
import "../componentes/common/Navbar.css";
import MainSection from "../componentes/common/MainSection";
function TestHomePage() {
    return (
        <>
            <Navbar navbarType={1} />
            <Navbar navbarType={2} />
            <MainSection
                userName="DanielRoses"
                userProfileUrl="/perfil/danielroses"
                date="20 feb"
                time="14:32"
                text="Mi primer post en nuestra red social 😁🔥"
                // Si no quieres imagen, comenta esta línea:
                // postImage="/imagenes/foto-post.jpg"
                initialComments={0}
                initialRetweets={0}
                initialLike1={0}
                initialLike2={0}
            />
        </>
    );
}

export default TestHomePage;
