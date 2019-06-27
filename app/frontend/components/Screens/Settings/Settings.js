import React from "react";
import styled from "styled-components";
import Notifications from "./Notifications/Notifications";
import { settingsContainerStyle } from "./Settings.style";

const SettingsContainer = styled.div`
  ${settingsContainerStyle}
`;

const settings = () => (
  <SettingsContainer>
    <Notifications />
  </SettingsContainer>
);

export default settings;
