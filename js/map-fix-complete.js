// Fix for interactive map functionality
// This script ensures proper loading of map components in production environment

// Wait for all resources to be fully loaded
window.addEventListener('load', function() {
  console.log("Window fully loaded, initializing map...");
  
  // Create interactive map with delay to ensure DOM is ready
  setTimeout(function() {
    initializeInteractiveMap();
  }, 500);
});

function initializeInteractiveMap() {
  // Get map container
  const mapCanvas = document.getElementById('mapCanvas');
  
  if (!mapCanvas) {
    console.error("Map canvas element not found!");
    return;
  }
  
  console.log("Map canvas found, dimensions:", mapCanvas.clientWidth, "x", mapCanvas.clientHeight);
  
  try {
    // Clear any existing content
    mapCanvas.innerHTML = '';
    
    // Create canvas for the map
    const canvas = document.createElement('canvas');
    canvas.width = mapCanvas.clientWidth || 800;
    canvas.height = mapCanvas.clientHeight || 600;
    
    // Ensure canvas has proper dimensions
    if (canvas.width < 100 || canvas.height < 100) {
      canvas.width = 800;
      canvas.height = 600;
      console.warn("Canvas dimensions too small, using defaults:", canvas.width, "x", canvas.height);
    }
    
    // Append canvas to container
    mapCanvas.appendChild(canvas);
    
    // Get drawing context
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Could not get canvas context!");
      return;
    }
    
    console.log("Canvas created and appended successfully");
    
    // Draw initial map
    drawMap(ctx, canvas.width, canvas.height);
    
    // Add click event listener to the canvas
    canvas.addEventListener('click', function(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Get location info based on click coordinates
      const info = getLocationInfo(x, y, canvas.width, canvas.height);
      
      // Update location info display
      const locationInfo = document.getElementById('locationInfo');
      if (locationInfo) {
        locationInfo.innerHTML = `
          <div class="row">
            <div class="col-md-6">
              <p><strong>Coordinates:</strong> ${info.lat}°N, ${info.lng}°W</p>
              <p><strong>Elevation:</strong> ${info.elevation} meters</p>
              <p><strong>Slope:</strong> ${info.slope}°</p>
              <p><strong>Aspect:</strong> ${info.aspect}</p>
            </div>
            <div class="col-md-6">
              <p><strong>Habitat Suitability:</strong> <span class="badge bg-${info.suitabilityColor}">${info.suitability}</span></p>
              <p><strong>Vegetation Density:</strong> ${info.vegetation}</p>
              <p><strong>Distance to Water:</strong> ${info.waterDistance} meters</p>
              <p><strong>Distance to Roads:</strong> ${info.roadDistance} meters</p>
            </div>
          </div>
        `;
      }
      
      // Draw marker at clicked location
      drawMap(ctx, canvas.width, canvas.height);
      drawMarker(ctx, x, y);
    });
    
    // Set up map controls
    setupMapControls();
    
    console.log("Interactive map initialization complete");
  } catch (error) {
    console.error("Error initializing map:", error);
  }
}

// Draw the map based on current settings
function drawMap(ctx, width, height) {
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Get current GMU selection
  const gmuSelect = document.getElementById('gmuSelect');
  const selectedGMU = gmuSelect ? gmuSelect.value : 'all';
  
  // Get layer visibility settings
  const habitatLayer = document.getElementById('habitatLayer');
  const showHabitat = habitatLayer ? habitatLayer.checked : true;
  
  const probabilityLayer = document.getElementById('probabilityLayer');
  const showProbability = probabilityLayer ? probabilityLayer.checked : false;
  
  const roadsLayer = document.getElementById('roadsLayer');
  const showRoads = roadsLayer ? roadsLayer.checked : true;
  
  const waterLayer = document.getElementById('waterLayer');
  const showWater = waterLayer ? waterLayer.checked : true;
  
  const landOwnershipLayer = document.getElementById('landOwnershipLayer');
  const showLandOwnership = landOwnershipLayer ? landOwnershipLayer.checked : false;
  
  // Get base map selection
  const terrainMap = document.getElementById('terrainMap');
  const satelliteMap = document.getElementById('satelliteMap');
  const topoMap = document.getElementById('topoMap');
  
  let baseMap = 'terrain';
  if (satelliteMap && satelliteMap.checked) baseMap = 'satellite';
  if (topoMap && topoMap.checked) baseMap = 'topo';
  
  // Draw base map
  drawBaseMap(ctx, width, height, baseMap);
  
  // Draw GMU boundaries
  drawGMUBoundaries(ctx, width, height, selectedGMU);
  
  // Draw layers based on visibility settings
  if (showWater) drawWaterFeatures(ctx, width, height, selectedGMU);
  if (showRoads) drawRoads(ctx, width, height, selectedGMU);
  if (showLandOwnership) drawLandOwnership(ctx, width, height, selectedGMU);
  if (showHabitat) drawHabitatSuitability(ctx, width, height, selectedGMU);
  if (showProbability) drawProbabilityHeatmap(ctx, width, height, selectedGMU);
  
  // Draw legend
  drawMapLegend(ctx, width, height);
}

// Draw base map
function drawBaseMap(ctx, width, height, type) {
  let gradient;
  
  switch (type) {
    case 'satellite':
      // Simulate satellite imagery
      gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#2c3e50');
      gradient.addColorStop(0.3, '#34495e');
      gradient.addColorStop(0.7, '#2c3e50');
      gradient.addColorStop(1, '#1a2530');
      break;
      
    case 'topo':
      // Simulate topographic map
      gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#f5f5f5');
      gradient.addColorStop(0.3, '#e8e8e8');
      gradient.addColorStop(0.7, '#f0f0f0');
      gradient.addColorStop(1, '#e0e0e0');
      break;
      
    default: // terrain
      // Simulate terrain map
      gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#a5bfdd'); // Light blue (high elevation)
      gradient.addColorStop(0.3, '#b5c9a0'); // Light green (mid elevation)
      gradient.addColorStop(0.7, '#ddc9a0'); // Tan (lower elevation)
      gradient.addColorStop(1, '#c9b097'); // Brown (lowest elevation)
      break;
  }
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add texture to the base map
  if (type === 'topo') {
    // Add contour lines for topo map
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < 20; i++) {
      const y = i * height / 20;
      ctx.beginPath();
      ctx.moveTo(0, y);
      
      for (let x = 0; x < width; x += 10) {
        const offset = Math.sin(x * 0.01) * 5 + Math.sin(x * 0.02 + i) * 3;
        ctx.lineTo(x, y + offset);
      }
      
      ctx.stroke();
    }
  }
}

// Draw GMU boundaries
function drawGMUBoundaries(ctx, width, height, selectedGMU) {
  // Define GMU boundaries (simplified for demonstration)
  const gmus = {
    '12': { x: width * 0.1, y: height * 0.1, w: width * 0.35, h: height * 0.35 },
    '23': { x: width * 0.55, y: height * 0.1, w: width * 0.35, h: height * 0.35 },
    '24': { x: width * 0.3, y: height * 0.55, w: width * 0.4, h: height * 0.35 }
  };
  
  // Set up styling for boundaries
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 5]);
  
  // Draw all GMUs or just the selected one
  if (selectedGMU === 'all') {
    // Draw all GMUs
    for (const gmu in gmus) {
      const bounds = gmus[gmu];
      ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
      
      // Add GMU label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(bounds.x + bounds.w - 60, bounds.y + 10, 50, 30);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.strokeRect(bounds.x + bounds.w - 60, bounds.y + 10, 50, 30);
      
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`GMU ${gmu}`, bounds.x + bounds.w - 35, bounds.y + 30);
    }
  } else {
    // Draw only the selected GMU
    const bounds = gmus[selectedGMU];
    if (bounds) {
      ctx.strokeRect(bounds.x, bounds.y, bounds.w, bounds.h);
      
      // Add GMU label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(bounds.x + bounds.w - 60, bounds.y + 10, 50, 30);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.strokeRect(bounds.x + bounds.w - 60, bounds.y + 10, 50, 30);
      
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`GMU ${selectedGMU}`, bounds.x + bounds.w - 35, bounds.y + 30);
    }
  }
  
  // Reset line dash
  ctx.setLineDash([]);
}

// Draw water features
function drawWaterFeatures(ctx, width, height, selectedGMU) {
  ctx.strokeStyle = '#3498db';
  ctx.lineWidth = 2;
  ctx.beginPath();
  
  // Generate a seed based on the GMU
  const seed = selectedGMU === 'all' ? 123 : parseInt(selectedGMU) * 10;
  
  // Main river
  const riverStartX = pseudoRandom(seed + 200) * width * 0.2;
  ctx.moveTo(riverStartX, 0);
  
  for (let y = 0; y < height; y += 20) {
    const x = riverStartX + Math.sin(y * 0.03) * 100 + pseudoRandom(seed + y) * 50;
    ctx.lineTo(x, y);
  }
  
  // Tributaries
  for (let i = 0; i < 3; i++) {
    const startY = pseudoRandom(seed + 300 + i) * height * 0.7;
    const startX = riverStartX + Math.sin(startY * 0.03) * 100 + pseudoRandom(seed + startY) * 50;
    
    ctx.moveTo(startX, startY);
    
    const direction = pseudoRandom(seed + 400 + i) > 0.5 ? 1 : -1;
    for (let j = 0; j < 10; j++) {
      const x = startX + direction * j * 30 + pseudoRandom(seed + startY + j) * 20;
      const y = startY - j * 15 - pseudoRandom(seed + startX + j) * 10;
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
}

// Draw roads
function drawRoads(ctx, width, height, selectedGMU) {
  ctx.strokeStyle = '#7f8c8d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  // Generate a seed based on the GMU
  const seed = selectedGMU === 'all' ? 456 : parseInt(selectedGMU) * 20;
  
  // Main road
  const roadStartX = pseudoRandom(seed + 500) * width * 0.8 + width * 0.2;
  ctx.moveTo(roadStartX, height);
  
  for (let y = height; y > 0; y -= 20) {
    const x = roadStartX + Math.sin(y * 0.02) * 50 + pseudoRandom(seed + y + 600) * 30;
    ctx.lineTo(x, y);
  }
  
  // Side roads
  for (let i = 0; i < 2; i++) {
    const startY = pseudoRandom(seed + 700 + i) * height * 0.8;
    const startX = roadStartX + Math.sin(startY * 0.02) * 50 + pseudoRandom(seed + startY + 600) * 30;
    
    ctx.moveTo(startX, startY);
    
    const direction = pseudoRandom(seed + 800 + i) > 0.5 ? 1 : -1;
    for (let j = 0; j < 15; j++) {
      const x = startX + direction * j * 25 + pseudoRandom(seed + startY + j + 900) * 15;
      const y = startY + (pseudoRandom(seed + startX + j + 1000) - 0.5) * 30;
      ctx.lineTo(x, y);
    }
  }
  
  ctx.stroke();
}

// Draw land ownership
function drawLandOwnership(ctx, width, height, selectedGMU) {
  // Generate a seed based on the GMU
  const seed = selectedGMU === 'all' ? 789 : parseInt(selectedGMU) * 30;
  
  // Define land ownership types with colors
  const ownershipTypes = [
    { name: 'Public', color: 'rgba(144, 238, 144, 0.4)' },  // Light green
    { name: 'Private', color: 'rgba(255, 182, 193, 0.4)' }, // Light pink
    { name: 'State', color: 'rgba(173, 216, 230, 0.4)' }    // Light blue
  ];
  
  // Create random land ownership areas
  for (let i = 0; i < 5; i++) {
    const centerX = pseudoRandom(seed + i * 10) * width;
    const centerY = pseudoRandom(seed + i * 20) * height;
    const size = 100 + pseudoRandom(seed + i * 30) * 150;
    const ownershipType = ownershipTypes[Math.floor(pseudoRandom(seed + i * 40) * ownershipTypes.length)];
    
    ctx.fillStyle = ownershipType.color;
    ctx.beginPath();
    
    // Create irregular polygon for land area
    const points = 6;
    for (let j = 0; j <= points; j++) {
      const angle = (j / points) * Math.PI * 2;
      const radius = size * (0.7 + pseudoRandom(seed + i * 50 + j) * 0.6);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (j === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Add label
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(ownershipType.name, centerX, centerY);
  }
}

// Draw habitat suitability
function drawHabitatSuitability(ctx, width, height, selectedGMU) {
  // Generate a seed based on the GMU
  const seed = selectedGMU === 'all' ? 123 : parseInt(selectedGMU) * 10;
  
  // High suitability areas (green)
  ctx.fillStyle = 'rgba(26, 150, 65, 0.7)';
  for (let i = 0; i < 5; i++) {
    drawRandomBlob(ctx, seed + i, 'high', width, height);
  }
  
  // Medium suitability areas (yellow)
  ctx.fillStyle = 'rgba(255, 255, 191, 0.7)';
  for (let i = 0; i < 7; i++) {
    drawRandomBlob(ctx, seed + 50 + i, 'medium', width, height);
  }
  
  // Low suitability areas (red)
  ctx.fillStyle = 'rgba(215, 25, 28, 0.7)';
  for (let i = 0; i < 4; i++) {
    drawRandomBlob(ctx, seed + 100 + i, 'low', width, height);
  }
}

// Draw probability heatmap
function drawProbabilityHeatmap(ctx, width, height, selectedGMU) {
  // Generate a seed based on the GMU
  const seed = selectedGMU === 'all' ? 456 : parseInt(selectedGMU) * 20;
  
  // Create a gradient for the heatmap
  const gradient = ctx.createRadialGradient(
    width / 2, height / 2, 10,
    width / 2, height / 2, width / 2
  );
  gradient.addColorStop(0, 'rgba(255, 0, 0, 0.7)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.5)');
  gradient.addColorStop(1, 'rgba(0, 255, 0, 0.3)');
  
  // Draw heatmap points
  for (let i = 0; i < 10; i++) {
    const centerX = pseudoRandom(seed + i * 10) * width;
    const centerY = pseudoRandom(seed + i * 20) * height;
    const radius = 50 + pseudoRandom(seed + i * 30) * 100;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

// Draw map legend
function drawMapLegend(ctx, width, height) {
  // Legend background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillRect(20, height - 150, 180, 130);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.strokeRect(20, height - 150, 180, 130);
  
  // Legend title
  ctx.fillStyle = '#000';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Habitat Suitability', 30, height - 130);
  
  // Legend items
  ctx.font = '12px Arial';
  
  // High suitability
  ctx.fillStyle = 'rgba(26, 150, 65, 0.7)';
  ctx.fillRect(30, height - 115, 20, 20);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(30, height - 115, 20, 20);
  ctx.fillStyle = '#000';
  ctx.fillText('High', 60, height - 100);
  
  // Medium suitability
  ctx.fillStyle = 'rgba(255, 255, 191, 0.7)';
  ctx.fillRect(30, height - 85, 20, 20);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(30, height - 85, 20, 20);
  ctx.fillStyle = '#000';
  ctx.fillText('Medium', 60, height - 70);
  
  // Low suitability
  ctx.fillStyle = 'rgba(215, 25, 28, 0.7)';
  ctx.fillRect(30, height - 55, 20, 20);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(30, height - 55, 20, 20);
  ctx.fillStyle = '#000';
  ctx.fillText('Low', 60, height - 40);
}

// Draw marker at clicked location
function drawMarker(ctx, x, y) {
  // Draw outer circle
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw inner circle
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#e74c3c';
  ctx.fill();
}

// Function to draw random blob shapes for habitat areas
function drawRandomBlob(ctx, seed, type, width, height) {
  const centerX = pseudoRandom(seed) * (width - 200) + 100;
  const centerY = pseudoRandom(seed + 1) * (height - 200) + 100;
  
  let size;
  if (type === 'high') {
    ctx.fillStyle = 'rgba(26, 150, 65, 0.7)';
    size = 80 + pseudoRandom(seed + 2) * 60;
  } else if (type === 'medium') {
    ctx.fillStyle = 'rgba(255, 255, 191, 0.7)';
    size = 60 + pseudoRandom(seed + 3) * 50;
  } else {
    ctx.fillStyle = 'rgba(215, 25, 28, 0.7)';
    size = 40 + pseudoRandom(seed + 4) * 40;
  }
  
  ctx.beginPath();
  const points = 8;
  
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const radius = size * (0.7 + pseudoRandom(seed + i + 5) * 0.6);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  ctx.closePath();
  ctx.fill();
}

// Simple pseudo-random number generator with seed
function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Function to get location information based on click coordinates
function getLocationInfo(x, y, width, height) {
  // Calculate relative coordinates in the viewport
  const relativeX = x / width;
  const relativeY = y / height;
  
  // Calculate lat/long (approximate for demonstration)
  const lat = 40.5 - relativeY;
  const lng = -106.8 + relativeX;
  
  // Generate plausible elevation value based on position
  const elevation = 2000 + Math.round((1 - relativeY) * 1500);
  
  // Calculate slope based on position
  const slope = Math.round(5 + relativeX * 25);
  
  // Determine aspect based on position
  const aspects = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"];
  const aspectIndex = Math.floor(relativeX * 8);
  const aspect = aspects[aspectIndex];
  
  // Determine habitat suitability based on position
  let suitability, suitabilityColor;
  const suitabilityValue = pseudoRandom((x * 100) + (y * 100));
  if (suitabilityValue > 0.7) {
    suitability = "High";
    suitabilityColor = "success";
  } else if (suitabilityValue > 0.4) {
    suitability = "Medium";
    suitabilityColor = "warning";
  } else {
    suitability = "Low";
    suitabilityColor = "danger";
  }
  
  // Generate vegetation density value
  const vegetation = Math.round(suitabilityValue * 100) + "%";
  
  // Generate distances
  const waterDistance = Math.round(100 + pseudoRandom(x + y * 2) * 900);
  const roadDistance = Math.round(50 + pseudoRandom(x * 2 + y) * 1500);
  
  return {
    lat: lat.toFixed(4),
    lng: lng.toFixed(4),
    elevation,
    slope,
    aspect,
    suitability,
    suitabilityColor,
    vegetation,
    waterDistance,
    roadDistance
  };
}

// Function to set up map controls
function setupMapControls() {
  // Set up GMU selection change event
  const gmuSelect = document.getElementById('gmuSelect');
  if (gmuSelect) {
    gmuSelect.addEventListener('change', function() {
      const mapCanvas = document.getElementById('mapCanvas');
      if (mapCanvas) {
        const canvas = mapCanvas.querySelector('canvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            drawMap(ctx, canvas.width, canvas.height);
          }
        }
      }
    });
  }
  
  // Set up layer visibility toggle events
  const layerControls = [
    'habitatLayer', 'probabilityLayer', 'roadsLayer', 
    'waterLayer', 'landOwnershipLayer'
  ];
  
  layerControls.forEach(controlId => {
    const control = document.getElementById(controlId);
    if (control) {
      control.addEventListener('change', function() {
        const mapCanvas = document.getElementById('mapCanvas');
        if (mapCanvas) {
          const canvas = mapCanvas.querySelector('canvas');
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              drawMap(ctx, canvas.width, canvas.height);
            }
          }
        }
      });
    }
  });
  
  // Set up base map selection events
  const baseMapControls = ['terrainMap', 'satelliteMap', 'topoMap'];
  
  baseMapControls.forEach(controlId => {
    const control = document.getElementById(controlId);
    if (control) {
      control.addEventListener('change', function() {
        const mapCanvas = document.getElementById('mapCanvas');
        if (mapCanvas) {
          const canvas = mapCanvas.querySelector('canvas');
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              drawMap(ctx, canvas.width, canvas.height);
            }
          }
        }
      });
    }
  });
  
  // Set up reset button
  const resetBtn = document.getElementById('resetMapBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      // Reset all controls
      if (gmuSelect) gmuSelect.value = 'all';
      
      // Reset checkboxes
      document.getElementById('habitatLayer').checked = true;
      document.getElementById('probabilityLayer').checked = false;
      document.getElementById('roadsLayer').checked = true;
      document.getElementById('waterLayer').checked = true;
      document.getElementById('landOwnershipLayer').checked = false;
      
      // Reset radio buttons
      document.getElementById('terrainMap').checked = true;
      
      // Redraw map
      const mapCanvas = document.getElementById('mapCanvas');
      if (mapCanvas) {
        const canvas = mapCanvas.querySelector('canvas');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            drawMap(ctx, canvas.width, canvas.height);
          }
        }
      }
      
      // Reset location info
      const locationInfo = document.getElementById('locationInfo');
      if (locationInfo) {
        locationInfo.innerHTML = '<p>Click on the map to see detailed information about a specific location.</p>';
      }
    });
  }
}