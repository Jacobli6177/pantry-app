'use client'
import { useState, useEffect } from "react";
import { firestore } from '@/firebase';
import axios from 'axios';
import Image from "next/image";
import { Box, Button, Modal, Stack, TextField, Typography, AppBar, Toolbar, Snackbar, Alert, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { collection, query, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [recipes, setRecipes] = useState([]);

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

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
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

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchRecipes = async () => {
    const apiKey = process.env.NEXT_PUBLIC_RECIPE_API_KEY;
    const ingredients = inventory.map(item => item.name).join(',');

    setLoadingRecipes(true);

    try {
      if (ingredients.trim() === '') {
        setSnackbarMessage('No items in your pantry to find recipes.');
        setSnackbarSeverity('info');
        setSnackbarOpen(true);
        return;
      }

      const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${apiKey}`);

      if (response.data.length === 0) {
        setSnackbarMessage('No recipes found with the current ingredients.');
        setSnackbarSeverity('info');
      } else {
        setSnackbarMessage('Recipes successfully loaded!');
        setSnackbarSeverity('success');
        setRecipes(response.data);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setSnackbarMessage('Error fetching recipes.');
      setSnackbarSeverity('error');
      setRecipes([]);
    } finally {
      setLoadingRecipes(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Filtered inventory based on search query
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        backgroundColor: '#808080',
        padding: 4,
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pantry Inventory
          </Typography>
          <Button color="inherit">Home</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Contact</Button>
        </Toolbar>
      </AppBar>

      <Box
        width="100%"
        flex="1"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <h1> Welcome to the Pantry</h1>
        <h4> To get started add an item to the inventory</h4>
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: "translate(-50%, -50%)"
            }}
          >
            <Typography variant="h6">Adding Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value)
                }}
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
        <Box display="flex" width="800px" justifyContent="space-between" mb={3}>
          <Button
            variant="contained"
            onClick={handleOpen}
          >
            Add New Item
          </Button>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search for your item"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginLeft: 2 }}
          />
        </Box>
        <Box border="1px solid #333" width="800px" borderRadius={2} bgcolor="white" boxShadow={2}>
          <Box
            width="100%"
            height="60px"
            bgcolor="#ADD8E6"
            display="flex"
            alignContent="center"
            justifyContent="center"
            borderTopLeftRadius={2}
            borderTopRightRadius={2}
          >
            <Typography variant="h4" color="#333" display="flex" alignItems="center">
              Inventory Items
            </Typography>
          </Box>
          <Stack width="100%" height="300px" spacing={2} overflow="auto" padding={2}>
            {filteredInventory.map(({ name, quantity }) => (
              <Box
                key={name}
                width="100%"
                minHeight="80px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor='#f0f0f0'
                padding={2}
                borderRadius={1}
                boxShadow={1}
              >
                <Typography
                  variant="h5"
                  color="#0000FF"
                  textAlign="center"
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography
                  variant="h5"
                  color="#333"
                  textAlign="center"
                >
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      addItem(name);
                    }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      removeItem(name);
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
        {/* Recipe Suggestions Section */}
        <Box width="60%" p={2} bgcolor="white" borderRadius={4} boxShadow={2} mt={4} mb={4}>
          <Typography variant="h4" spacing={2} mb={2} fontWeight={'bold'}>
            🧾Suggested Recipes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchRecipes}
            disabled={loadingRecipes}
            spacing={2}
            mb={2}
          >
            {loadingRecipes ? 'Loading Recipes...' : 'Get Recipes'}
          </Button>
          {loadingRecipes && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          )}
          <List>
            {recipes.map((recipe) => (
              <ListItem key={recipe.id} sx={{ mb: 1 }}>
                <ListItemText
                  primary={recipe.title}
                  secondary={`Missing Ingredients: ${recipe.missedIngredientCount}`}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  href={`https://spoonacular.com/recipes/${recipe.title.replace(/ /g, '-')}-${recipe.id}`}
                  target="_blank"
                >
                  View Recipe
                </Button>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
      <Box
        width="100%"
        bgcolor="#333"
        color="white"
        padding={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="body1">
          &copy; 2024 Pantry Inventory. All rights reserved.
        </Typography>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
