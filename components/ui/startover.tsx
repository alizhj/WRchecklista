'use client';

import { Button, Modal, Typography } from '@mui/material';
import Box from '@mui/material/Box';

export default function StartOver({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#ffbde1',
    border: '2px solid #600336',
    borderRadius: '16px',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
  };

  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h4" component="h2">
          Säkert?
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Är du säker på att du vill börja om? <br />
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: '#600336',
            borderRadius: '50px',
            mt: 2,
            cursor: 'pointer',
            color: '#fff',
            p: 1,
          }}
          onClick={() => {
            localStorage.clear();
            window.location.reload();
            onClose();
          }}
        >
          Starta om Weekly Revolt
        </Button>
        <Button
          variant="contained"
          sx={{
            background: '#600336',
            borderRadius: '50px',
            mt: 2,
            cursor: 'pointer',
            color: '#fff',
            p: 1,
          }}
          onClick={onClose}
        >
          Nej, jag vill inte börja om
        </Button>
      </Box>
    </Modal>
  );
}
