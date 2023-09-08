import { forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={4} ref={ref} variant="filled" {...props} />;
});

const MySnackbar = (props: {
  parentIsOpen: any;
  parentSetIsOpen: any;
  message: string;
  severity: any;
}) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    props.parentSetIsOpen(false);
  };

  return (
    <Snackbar
      open={props.parentIsOpen}
      autoHideDuration={2500}
      onClose={handleClose}
    >
      <Alert
        severity={props.severity}
        sx={{ width: "80%" }}
        onClose={handleClose}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default MySnackbar;
