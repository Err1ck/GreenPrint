// import './stimulus_bootstrap.js';
import React from "react";
import { createRoot } from "react-dom/client";
import TestHomePage from "./pages/Home";
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import "./styles/app.css";

// console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<TestHomePage />);
