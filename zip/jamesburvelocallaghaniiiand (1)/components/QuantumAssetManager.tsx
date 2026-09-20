import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Alert,
} from '@mui/material';

interface QuantumAsset {
  id: string;
  name: string;
  type: 'qubit' | 'register' | 'circuit';
  state: string;
  entanglementLinks: string[];
}

const initialQuantumAssets: QuantumAsset[] = [
  { id: 'q1', name: 'Qubit Alpha', type: 'qubit', state: '0.707|0> + 0.707i|1>', entanglementLinks: ['q2', 'q3'] },
  { id: 'q2', name: 'Qubit Beta', type: 'qubit', state: '0.707|0> - 0.707i|1>', entanglementLinks: ['q1'] },
  { id: 'q3', name: 'Qubit Gamma', type: 'qubit', state: '1|0>', entanglementLinks: ['q1'] },
  { id: 'r1', name: 'Register 1', type: 'register', state: 'Superposition', entanglementLinks: ['q1', 'q2', 'c1'] },
  { id: 'c1', name: 'Circuit Omega', type: 'circuit', state: 'Entangled', entanglementLinks: ['r1'] },
];

export const QuantumAssetManager: React.FC = () => {
  const [assets, setAssets] = useState<QuantumAsset[]>(initialQuantumAssets);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'qubit' | 'register' | 'circuit'>('qubit');
  const [newState, setNewState] = useState('|0>');

  const handleAddAsset = () => {
    if (!newName) return;
    const newAsset: QuantumAsset = {
      id: `q_${Date.now()}`,
      name: newName,
      type: newType,
      state: newState,
      entanglementLinks: []
    };
    setAssets([...assets, newAsset]);
    setNewName('');
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
            Quantum Asset & Entanglement Manager
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            High-coherence quantum qubit topologies, topological braids, and state registers
          </Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
          Register Quantum Asset
        </Button>
      </Box>

      <Grid container spacing={3}>
        {assets.map((asset) => (
          <Grid item xs={12} md={4} key={asset.id}>
            <Card sx={{ bgcolor: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              <CardHeader
                title={asset.name}
                subheader={`Type: ${asset.type.toUpperCase()}`}
                subheaderTypographyProps={{ color: 'cyan' }}
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: 'gray', mb: 1 }}>
                  State Vector:
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', color: '#34d399', bgcolor: 'rgba(0,0,0,0.3)', p: 1, borderRadius: 1 }}>
                  {asset.state}
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray', mt: 2 }}>
                  Entangled Nodes: {asset.entanglementLinks.length > 0 ? asset.entanglementLinks.join(', ') : 'None'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Quantum Asset</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, minWidth: 320 }}>
          <TextField
            label="Asset Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Initial Quantum State"
            value={newState}
            onChange={(e) => setNewState(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddAsset} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuantumAssetManager;
