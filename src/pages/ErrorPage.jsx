import React from "react";
import FuzzyText from "../components/ui/FuzzyText";
import "../styles/ErrorPage.css";

const ErrorPage = () => {
    return (
        <div className="error-page">
            <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true}>
                404
            </FuzzyText>
            <p className="error-message">
                Parece que la ruta que buscaste no existe...
            </p>

        </div>
    );
};

export default ErrorPage;
