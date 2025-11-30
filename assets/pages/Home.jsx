import React from "react";
import Navbar from "../componentes/common/Navbar";
import "../componentes/common/Navbar.css";
import "../styles/Home.css";
import MainSection from "../componentes/common/MainSection";
function TestHomePage() {
    return (
        <>
            <div className="navbarLeft-content">
                <Navbar navbarType={1} />
            </div>
            <div className="main-layout-container">
                <div className="spacer-left"></div>
                <main className="main-content">
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
                </main>
                <div className="spacer-right"></div>
            </div>
            <div className="navbarRight-content">
                <Navbar navbarType={2} />
            </div>
        </>
    );
}

export default TestHomePage;
