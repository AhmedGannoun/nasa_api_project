import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  CardMedia 
} from '@mui/material';
import './App.css';

const rovers = {
  Curiosity: [
    "Front Hazard Avoidance Camera",
    "Rear Hazard Avoidance Camera",
    "Mast Camera",
    "Chemistry and Camera Complex",
    "Mars Hand Lens Imager",
    "Mars Descent Imager",
    "Navigation Camera"
  ],
  Opportunity: [
    "Front Hazard Avoidance Camera",
    "Rear Hazard Avoidance Camera",
    "Navigation Camera",
    "Panoramic Camera",
    "Miniature Thermal Emission Spectrometer (Mini-TES)"
  ],
  Spirit: [
    "Front Hazard Avoidance Camera",
    "Rear Hazard Avoidance Camera",
    "Navigation Camera",
    "Panoramic Camera",
    "Miniature Thermal Emission Spectrometer (Mini-TES)"
  ]
};

const App = () => {
  const [selectedRover, setSelectedRover] = useState('Curiosity');
  const [selectedCamera, setSelectedCamera] = useState('');
  const [date, setDate] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (selectedRover && selectedCamera && date) {
      const cameraAbbreviations = {
        "Front Hazard Avoidance Camera": "FHAZ",
        "Rear Hazard Avoidance Camera": "RHAZ",
        "Mast Camera": "MAST",
        "Chemistry and Camera Complex": "CHEMCAM",
        "Mars Hand Lens Imager": "MAHLI",
        "Mars Descent Imager": "MARDI",
        "Navigation Camera": "NAVCAM",
        "Panoramic Camera": "PANCAM",
        "Miniature Thermal Emission Spectrometer (Mini-TES)": "MINITES"
      };

      const cameraAbbreviation = cameraAbbreviations[selectedCamera];

      axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/${selectedRover}/photos`, {
        params: {
          earth_date: date,
          camera: cameraAbbreviation,
          api_key: 'DEMO_KEY' // Replace with your actual NASA API key
        }
      })
      .then(response => {
        setImages(response.data.photos);
      })
      .catch(error => {
        console.error("There was an error fetching the images!", error);
      });
    }
  }, [selectedRover, selectedCamera, date]);

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Ema rover app
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box my={4}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Rover</InputLabel>
            <Select value={selectedRover} onChange={e => setSelectedRover(e.target.value)}>
              {Object.keys(rovers).map(rover => (
                <MenuItem key={rover} value={rover}>{rover}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Camera</InputLabel>
            <Select value={selectedCamera} onChange={e => setSelectedCamera(e.target.value)}>
              <MenuItem value="">Select a camera</MenuItem>
              {rovers[selectedRover].map(camera => (
                <MenuItem key={camera} value={camera}>{camera}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Select Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setDate(date)}
            disabled={!selectedRover || !selectedCamera || !date}
          >
            Fetch Photos
          </Button>
        </Box>
        <Grid container spacing={3}>
          {images.length > 0 ? (
            images.map(image => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                <Card>
                  <CardMedia
                    component="img"
                    alt="Mars Rover"
                    height="200"
                    image={image.img_src}
                  />
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6">No images found for the selected criteria.</Typography>
          )}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
