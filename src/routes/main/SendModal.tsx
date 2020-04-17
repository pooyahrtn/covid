import React from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  makeStyles,
  Theme,
  createStyles,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(0, 2, 2),
    },
    actionContainer: {
      display: 'flex',
    },
  })
);

interface SendModalProps {
  open: boolean;
  handleClose: () => void;
}
export default (props: SendModalProps) => {
  const { open, handleClose } = props;
  const classes = useStyles();
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition={true}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <h5 id="transition-modal-title">اتمام ضبط</h5>
          <p id="transition-modal-description">
            آیا صدای ضبط شده مورد تایید شماست؟
          </p>
          <div className={classes.actionContainer}>
            <Button variant="contained" color="primary">
              بله
            </Button>
            <Button onClick={handleClose}>خیر</Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};
