import React from "react";
import { Routes, Route } from "react-router-dom";
import News from "./News/News";
import Searches from "./Searches/Searches";
import Account from "./Account/Account";
import Settings from "./Settings/Settings";
import Results from "./Results/Results";

const Screens = () => (
  <Routes>
    <Route path="/account" element={<Account />} />
    <Route path="/searches" element={<Searches />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/results" element={<Results />} />
    <Route path="/news" element={<News />} />
  </Routes>
);

export default Screens;
