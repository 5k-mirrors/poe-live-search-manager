import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import SessionIdEditor from "./SessionIdEditor/SessionIdEditor";

export default () => {
  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        mb={3}
        justifyContent="space-between"
      >
        <Typography variant="h6" gutterBottom>
          {`Logged in as anonymus`}
        </Typography>
      </Box>
      <SessionIdEditor />
    </div>
  );
};
