'use client';

import { useState, useEffect } from 'react';
import { firestore } from './firebase';
import { Box, Stack, TextField, Typography, Modal, Button, Card, CardContent, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, getDocs, query, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity > 1) {
        await setDoc(docRef, { quantity: quantity - 1 });
      } else {
        await deleteDoc(docRef);
      }
    }
    await updateInventory();
  };

  const deleteItem = async (item) => {
    await deleteDoc(doc(collection(firestore, 'inventory'), item));
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: 'translate(-50%, -50%)' }}
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen} startIcon={<AddIcon />}>
        Add New Item
      </Button>
      <Box border="1px solid #333" width="80%">
        <Box width="100%" height="100px" bgcolor="#ADD8E6" alignItems="center" display="flex" justifyContent="center">
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>
      </Box>
      <Stack width="80%" spacing={2} sx={{ maxHeight: '400px', overflow: 'auto' }}>
        {
          inventory.map(({ name, quantity }) => (
            <Card key={name} sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', bgcolor: "#f0f0f0" }}>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{name}</Typography>
                <Typography variant="body2">Quantity: {quantity}</Typography>
              </CardContent>
              <Box>
                <IconButton onClick={() => addItem(name)} color="primary">
                  <AddIcon />
                  <Typography variant="body2" ml={1}>Add</Typography>
                </IconButton>
                <IconButton onClick={() => removeItem(name)} color="secondary">
                  <RemoveIcon />
                  <Typography variant="body2" ml={1}>Remove</Typography>
                </IconButton>
                <IconButton onClick={() => deleteItem(name)} color="error">
                  <DeleteIcon />
                  <Typography variant="body2" ml={1}>Delete</Typography>
                </IconButton>
              </Box>
            </Card>
          ))
        }
      </Stack>
    </Box>
  );
}
