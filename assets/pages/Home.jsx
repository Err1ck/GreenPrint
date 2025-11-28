import React from "react";
import Navbar from "../componentes/common/Navbar";
import "../componentes/common/Navbar.css";
import MainSection from "../componentes/common/MainSection";
function TestHomePage() {
    return (
        <>
            {/* <Navbar navbarType={1} />
            <Navbar navbarType={2} /> */}
            <MainSection
                userName="DanielRoses"
                userProfileUrl="/perfil/danielroses"
                avatarSrc="/imagenes/daniel-avatar.jpg"
                date="20 feb"
                time="14:32"
                initialText="Mi primer post en nuestra red social 😁🔥"
                // Si no quieres imagen, comenta esta línea:
                // postImage="/imagenes/foto-post.jpg"
                initialComments={5}
                initialRetweets={2}
                initialLike1={10}
                initialLike2={3}
            />
        </>
    );
}

export default TestHomePage;
