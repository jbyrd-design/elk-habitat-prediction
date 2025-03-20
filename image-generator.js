// Generate synthetic elk habitat prediction images
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
const ctx = canvas.getContext('2d');

// Function to create a habitat suitability map
function createHabitatMap(gmuNumber) {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background (terrain)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#a5bfdd'); // Light blue (high elevation)
    gradient.addColorStop(0.3, '#b5c9a0'); // Light green (mid elevation)
    gradient.addColorStop(0.7, '#ddc9a0'); // Tan (lower elevation)
    gradient.addColorStop(1, '#c9b097'); // Brown (lowest elevation)
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw random habitat suitability areas
    const seed = gmuNumber * 10; // Use GMU number as seed for consistent randomness
    
    // High suitability areas (green)
    ctx.fillStyle = 'rgba(26, 150, 65, 0.7)';
    for (let i = 0; i < 5; i++) {
        drawRandomBlob(seed + i, 'high');
    }
    
    // Medium suitability areas (yellow)
    ctx.fillStyle = 'rgba(255, 255, 191, 0.7)';
    for (let i = 0; i < 7; i++) {
        drawRandomBlob(seed + 50 + i, 'medium');
    }
    
    // Low suitability areas (red)
    ctx.fillStyle = 'rgba(215, 25, 28, 0.7)';
    for (let i = 0; i < 4; i++) {
        drawRandomBlob(seed + 100 + i, 'low');
    }
    
    // Draw rivers/water features
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Main river
    const riverStartX = pseudoRandom(seed + 200) * canvas.width * 0.2;
    ctx.moveTo(riverStartX, 0);
    
    for (let y = 0; y < canvas.height; y += 20) {
        const x = riverStartX + Math.sin(y * 0.03) * 100 + pseudoRandom(seed + y) * 50;
        ctx.lineTo(x, y);
    }
    
    // Tributaries
    for (let i = 0; i < 3; i++) {
        const startY = pseudoRandom(seed + 300 + i) * canvas.height * 0.7;
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
    
    // Draw roads
    ctx.strokeStyle = '#7f8c8d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    // Main road
    const roadStartX = pseudoRandom(seed + 500) * canvas.width * 0.8 + canvas.width * 0.2;
    ctx.moveTo(roadStartX, canvas.height);
    
    for (let y = canvas.height; y > 0; y -= 20) {
        const x = roadStartX + Math.sin(y * 0.02) * 50 + pseudoRandom(seed + y + 600) * 30;
        ctx.lineTo(x, y);
    }
    
    // Side roads
    for (let i = 0; i < 2; i++) {
        const startY = pseudoRandom(seed + 700 + i) * canvas.height * 0.8;
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
    
    // Add GMU boundary
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.setLineDash([15, 5]);
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    ctx.setLineDash([]);
    
    // Add GMU label
    ctx.fillStyle = '#fff';
    ctx.fillRect(canvas.width - 120, 30, 90, 40);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width - 120, 30, 90, 40);
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`GMU ${gmuNumber}`, canvas.width - 75, 58);
    
    // Add legend
    drawLegend();
    
    // Return the image as data URL
    return canvas.toDataURL('image/png');
}

// Function to draw random blob shapes for habitat areas
function drawRandomBlob(seed, type) {
    const centerX = pseudoRandom(seed) * (canvas.width - 200) + 100;
    const centerY = pseudoRandom(seed + 1) * (canvas.height - 200) + 100;
    
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

// Draw legend
function drawLegend() {
    // Legend background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(20, canvas.height - 130, 180, 110);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, canvas.height - 130, 180, 110);
    
    // Legend title
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Habitat Suitability', 30, canvas.height - 105);
    
    // Legend items
    ctx.font = '14px Arial';
    
    // High suitability
    ctx.fillStyle = 'rgba(26, 150, 65, 0.7)';
    ctx.fillRect(30, canvas.height - 90, 20, 20);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(30, canvas.height - 90, 20, 20);
    ctx.fillStyle = '#000';
    ctx.fillText('High', 60, canvas.height - 75);
    
    // Medium suitability
    ctx.fillStyle = 'rgba(255, 255, 191, 0.7)';
    ctx.fillRect(30, canvas.height - 60, 20, 20);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(30, canvas.height - 60, 20, 20);
    ctx.fillStyle = '#000';
    ctx.fillText('Medium', 60, canvas.height - 45);
    
    // Low suitability
    ctx.fillStyle = 'rgba(215, 25, 28, 0.7)';
    ctx.fillRect(30, canvas.height - 30, 20, 20);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(30, canvas.height - 30, 20, 20);
    ctx.fillStyle = '#000';
    ctx.fillText('Low', 60, canvas.height - 15);
}

// Simple pseudo-random number generator with seed
function pseudoRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Create feature importance chart
function createFeatureImportanceChart() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Chart title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Feature Importance in Elk Habitat Prediction Model', canvas.width / 2, 40);
    
    // Feature importance data
    const features = [
        { name: 'Slope', value: 40.8, color: '#3498db' },
        { name: 'NDVI', value: 13.7, color: '#2ecc71' },
        { name: 'Elevation', value: 12.3, color: '#9b59b6' },
        { name: 'Elevation Category', value: 6.2, color: '#34495e' },
        { name: 'Edge Proximity', value: 5.8, color: '#f1c40f' },
        { name: 'NDMI', value: 4.4, color: '#1abc9c' },
        { name: 'Distance to Water', value: 1.9, color: '#e67e22' },
        { name: 'Distance to Roads', value: 1.8, color: '#e74c3c' },
        { name: 'Distance to Access', value: 1.7, color: '#95a5a6' },
        { name: 'Other Features', value: 11.4, color: '#7f8c8d' }
    ];
    
    // Sort features by importance
    features.sort((a, b) => b.value - a.value);
    
    // Chart dimensions
    const chartTop = 100;
    const chartBottom = 500;
    const chartLeft = 200;
    const chartRight = 700;
    const chartHeight = chartBottom - chartTop;
    const barSpacing = chartHeight / features.length;
    const barHeight = barSpacing * 0.6;
    
    // Draw bars
    for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const barWidth = (feature.value / 50) * (chartRight - chartLeft); // Scale to max 50%
        const barY = chartTop + i * barSpacing;
        
        // Draw bar
        ctx.fillStyle = feature.color;
        ctx.fillRect(chartLeft, barY, barWidth, barHeight);
        
        // Draw feature name
        ctx.fillStyle = '#2c3e50';
        ctx.font = '14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(feature.name, chartLeft - 10, barY + barHeight / 2 + 5);
        
        // Draw percentage
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${feature.value}%`, chartLeft + barWidth + 10, barY + barHeight / 2 + 5);
    }
    
    // Draw axes
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(chartLeft, chartTop - 20);
    ctx.lineTo(chartLeft, chartBottom + 20);
    ctx.stroke();
    
    // X-axis title
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Importance (%)', (chartLeft + chartRight) / 2, chartBottom + 50);
    
    // Return the image as data URL
    return canvas.toDataURL('image/png');
}

// Create elk hero image
function createElkHeroImage() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create gradient background representing mountain landscape
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#2980b9'); // Sky blue
    gradient.addColorStop(0.4, '#6ab7ff'); // Light blue
    gradient.addColorStop(0.4, '#e5e5e5'); // Snow line
    gradient.addColorStop(0.5, '#7f8c8d'); // Mountain gray
    gradient.addColorStop(0.7, '#27ae60'); // Forest green
    gradient.addColorStop(1, '#2ecc71'); // Meadow green
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw mountains
    ctx.fillStyle = '#7f8c8d';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.5);
    
    // First mountain range
    for (let x = 0; x <= canvas.width; x += 50) {
        const y = canvas.height * 0.5 - Math.sin(x * 0.01) * 100 - Math.random() * 50;
        ctx.lineTo(x, y);
    }
    
    ctx.lineTo(canvas.width, canvas.height * 0.7);
    ctx.lineTo(0, canvas.height * 0.7);
    ctx.closePath();
    ctx.fill();
    
    // Draw snow caps
    ctx.fillStyle = '#e5e5e5';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.5);
    
    for (let x = 0; x <= canvas.width; x += 50) {
        const y = canvas.height * 0.5 - Math.sin(x * 0.01) * 100 - Math.random() * 50;
        ctx.lineTo(x, y);
    }
    
    ctx.lineTo(canvas.width, canvas.height * 0.45);
    ctx.lineTo(0, canvas.height * 0.45);
    ctx.closePath();
    ctx.fill();
    
    // Draw forest silhouette
    ctx.fillStyle = '#27ae60';
    
    for (let x = 0; x < canvas.width; x += 30) {
        const baseHeight = canvas.height * 0.7 + Math.sin(x * 0.05) * 20;
        const treeHeight = 50 + Math.random() * 30;
        
        // Draw tree
        ctx.beginPath();
        ctx.moveTo(x, baseHeight);
        ctx.lineTo(x + 15, baseHeight - treeHeight);
        ctx.lineTo(x + 30, baseHeight);
        ctx.closePath();
        ctx.fill();
    }
    
    // Draw elk silhouette
    ctx.fillStyle = '#000';
    
    // Body
    ctx.beginPath();
    ctx.ellipse(canvas.width * 0.3, canvas.height * 0.8, 100, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Neck
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.4, canvas.height * 0.78);
    ctx.lineTo(canvas.width * 0.45, canvas.height * 0.65);
    ctx.lineTo(canvas.width * 0.38, canvas.height * 0.7);
    ctx.closePath();
    ctx.fill();
    
    // Head
    ctx.beginPath();
    ctx.ellipse(canvas.width * 0.45, canvas.height * 0.63, 25, 15, -0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Antlers
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#000';
    
    // Left antler
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.43, canvas.height * 0.61);
    ctx.lineTo(canvas.width * 0.38, canvas.height * 0.53);
    
    // Left antler tines
    ctx.moveTo(canvas.width * 0.4, canvas.height * 0.56);
    ctx.lineTo(canvas.width * 0.37, canvas.height * 0.54);
    
    ctx.moveTo(canvas.width * 0.39, canvas.height * 0.55);
    ctx.lineTo(canvas.width * 0.36, canvas.height * 0.52);
    
    // Right antler
    ctx.moveTo(canvas.width * 0.47, canvas.height * 0.61);
    ctx.lineTo(canvas.width * 0.52, canvas.height * 0.53);
    
    // Right antler tines
    ctx.moveTo(canvas.width * 0.5, canvas.height * 0.56);
    ctx.lineTo(canvas.width * 0.53, canvas.height * 0.54);
    
    ctx.moveTo(canvas.width * 0.51, canvas.height * 0.55);
    ctx.lineTo(canvas.width * 0.54, canvas.height * 0.52);
    
    ctx.stroke();
    
    // Legs
    ctx.lineWidth = 8;
    
    // Front legs
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.25, canvas.height * 0.82);
    ctx.lineTo(canvas.width * 0.25, canvas.height * 0.95);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.35, canvas.height * 0.82);
    ctx.lineTo(canvas.width * 0.35, canvas.height * 0.95);
    ctx.stroke();
    
    // Back legs
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.2, canvas.height * 0.82);
    ctx.lineTo(canvas.width * 0.18, canvas.height * 0.95);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.3, canvas.height * 0.82);
    ctx.lineTo(canvas.width * 0.28, canvas.height * 0.95);
    ctx.stroke();
    
    // Add title overlay with semi-transparent background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, canvas.height * 0.3, canvas.width, canvas.height * 0.2);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Elk Habitat Prediction System', canvas.width / 2, canvas.height * 0.4);
    
    ctx.font = '24px Arial';
    ctx.fillText('Using Machine Learning to Predict Optimal Hunting Habitats', canvas.width / 2, canvas.height * 0.45);
    
    // Return the image as data URL
    return canvas.toDataURL('image/png');
}

// Export functions
window.createHabitatMap = createHabitatMap;
window.createFeatureImportanceChart = createFeatureImportanceChart;
window.createElkHeroImage = createElkHeroImage;