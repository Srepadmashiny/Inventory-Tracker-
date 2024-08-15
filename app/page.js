'use client';

import { useState, useEffect } from 'react';
import { firestore, storage } from './firebase';
import { Box, Grid, TextField, Typography, Modal, Button, Card, CardContent, IconButton, Badge, Stack, CardMedia } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import html2canvas from 'html2canvas'; // Import html2canvas
import { collection, getDocs, query, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [file, setFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  // Function to update the inventory list
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

  // Function to add an item to the inventory
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

  // Function to remove an item from the inventory
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

  // Function to delete an item from the inventory
  const deleteItem = async (item) => {
    await deleteDoc(doc(collection(firestore, 'inventory'), item));
    await updateInventory();
  };

  // Function to handle image file change
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Function to upload image to Firebase Storage
  const uploadImage = async (file) => {
    try {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log('Uploaded Image URL:', url);
      setUploadedImageUrl(url);
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Error uploading image');
    }
  };

  // Function to handle image upload
  const handleImageUpload = async () => {
    if (file) {
      await uploadImage(file);
      setFile(null); // Clear file input after upload
    }
  };

  // Function to handle opening the modal
  const handleOpen = () => setOpen(true);

  // Function to handle closing the modal
  const handleClose = () => setOpen(false);

  // Function to export the list as a PNG
  const exportListAsPNG = async () => {
    const element = document.getElementById('inventory-list');
    if (element) {
      try {
        const canvas = await html2canvas(element);
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'inventory-list.png';
        link.click();
      } catch (error) {
        console.error('Error exporting list as PNG:', error);
      }
    }
  };

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Effect hook to load the inventory on component mount
  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" p={4} bgcolor="#f7f9fc">
      <Card sx={{ width: '100%', maxWidth: 1200, p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{ transform: 'translate(-50%, -50%)' }}
            width={400}
            bgcolor="white"
            borderRadius="8px"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <Typography variant="h6" fontWeight="bold">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                label="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
            <Typography variant="h6" fontWeight="bold" mt={2}>Upload Image</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <Button variant="contained" color="primary" onClick={handleImageUpload}>
                Upload Image
              </Button>
            </Stack>
            {uploadedImageUrl && (
              <CardMedia
                component="img"
                sx={{ mt: 2, maxHeight: 200, objectFit: 'cover' }}
                image={uploadedImageUrl}
                alt="Uploaded"
              />
            )}
          </Box>
        </Modal>

        <Card sx={{ backgroundColor: '#f8bbd0', textAlign: 'center', mb: 4 }}>
          <CardContent>
            <Typography variant="h3" fontWeight="bold" color="#333">
              Pantry Inventory
            </Typography>
          </CardContent>
        </Card>

        <Box display="flex" justifyContent="center" width="100%" mb={4}>
          <TextField
            variant="outlined"
            label="Search Items"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ maxWidth: '600px' }}
          />
        </Box>

        <Box display="flex" justifyContent="center" width="100%">
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpen}
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#3f51b5', // Primary blue color
              '&:hover': {
                bgcolor: '#303f9f', // Darker blue on hover
              },
              borderRadius: '25px', // Rounded corners
              padding: '10px 20px', // Padding for size
              textTransform: 'none', // Prevent text transformation
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add subtle shadow
            }}
          >
            Add New Item
          </Button>
        </Box>

        <Box display="flex" justifyContent="center" width="100%" mt={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={exportListAsPNG}
            sx={{
              bgcolor: '#4CAF50', // Green background
              '&:hover': {
                bgcolor: '#45a049', // Darker green on hover
              },
              borderRadius: '25px', // Rounded corners
              padding: '10px 20px', // Padding for size
              textTransform: 'none', // Prevent text transformation
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add subtle shadow
            }}
          >
            Export as PNG
          </Button>
        </Box>

        <Grid container spacing={4} sx={{ width: '100%', mt: 2 }} id="inventory-list">
          {filteredInventory.length > 0 ? (
            filteredInventory.map(({ name, quantity }) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      Quantity: {quantity}
                    </Typography>
                  </CardContent>
                  <Box
                    display="flex"
                    justifyContent="center"
                    sx={{ mt: 'auto' }}
                  >
                    <IconButton
                      onClick={() => addItem(name)}
                      color="primary"
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => removeItem(name)}
                      color="warning"
                    >
                      <RemoveIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => deleteItem(name)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" color="textSecondary" align="center">
                No items found
              </Typography>
            </Grid>
          )}
        </Grid>
      </Card>
    </Box>
  );
}


