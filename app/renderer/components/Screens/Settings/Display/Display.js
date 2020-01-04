import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ResultsListLimit from "./ResultsListLimit/ResultsListLimit";

const display = () => (
  <Box>
    <Typography variant="h6">Display</Typography>
    <ResultsListLimit />
  </Box>
);

export default display;
