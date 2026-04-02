import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import GlobalStyle from "./style/globalStyles";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router";
import VisApp from "./visualization/VisApp";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalStyle />
      <RecoilRoot>
        <Routes>
          <Route path="/" element={<VisApp />} />
        </Routes>
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>,
);
