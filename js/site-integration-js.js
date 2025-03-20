// site-integration.js - Master script for integrating all components of the Elk Habitat Prediction website

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Site integration script loaded');
  
  // Detect current page
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop() || 'index.html';
  
  console.log('Current page:', pageName);
  
  // Apply common functionality across all pages
  initializeCommonFunctionality();
  
  // Apply page-specific initialization
  switch(pageName) {
    case 'index.html':
    case '':
      initializeHomePage();
      break;
    case 'methodology.html':
      initializeMethodologyPage();
      break;
    case 'results.html':
      initializeResultsPage();
      break;
    case 'interactive-map.html':
      initializeInteractiveMapPage();
      break;
    case 'research-paper.html':
      initializeResearchPaperPage();
      break;
  }
});

// Initialize functionality common to all pages
function initializeCommonFunctionality() {
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#') return;
      
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Initialize scroll animations
  initializeScrollAnimations();
  
  // Initialize Bootstrap components if available
  if (typeof bootstrap !== 'undefined') {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.forEach(popoverTriggerEl => {
      new bootstrap.Popover(popoverTriggerEl);
    });
  }
}

// Initialize scroll animations
function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animatedElements.length > 0) {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      animatedElements.forEach(element => {
        observer.observe(element);
      });
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      animatedElements.forEach(element => {
        element.classList.add('fade-in');
      });
    }
  }
}

// Initialize home page
function initializeHomePage() {
  console.log('Initializing home page');
  
  // Generate and set the hero background image if image generator is available
  if (typeof createElkHeroImage === 'function') {
    const heroImage = createElkHeroImage();
    document.querySelector('.hero').style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${heroImage}')`;
  }
  
  // Generate feature importance chart if available
  if (typeof createFeatureImportanceChart === 'function') {
    const chartCanvas = document.getElementById('featureImportanceChart');
    if (chartCanvas) {
      const featureImportanceImg = createFeatureImportanceChart();
      const ctx = chartCanvas.getContext('2d');
      const img = new Image();
      img.onload = function() {
        ctx.drawImage(img, 0, 0, chartCanvas.width, chartCanvas.height);
      };
      img.src = featureImportanceImg;
    }
  }
  
  // Generate GMU maps if available
  const gmuMapIds = ['gmu12Map', 'gmu23Map', 'gmu24Map'];
  if (typeof createHabitatMap === 'function') {
    gmuMapIds.forEach((mapId, index) => {
      const gmuNumber = [12, 23, 24][index];
      const canvas = document.getElementById(mapId);
      
      if (canvas) {
        const mapImg = createHabitatMap(gmuNumber);
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = function() {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = mapImg;
      }
    });
  }
}

// Initialize methodology page
function initializeMethodologyPage() {
  console.log('Initializing methodology page');
  
  // Set the methodology header background if image generator is available
  if (typeof createElkHeroImage === 'function') {
    const bgImage = createElkHeroImage();
    document.querySelector('.methodology-header').style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${bgImage}')`;
  }
  
  // Initialize methodology diagrams if the function exists
  if (typeof createMethodologyDiagrams === 'function') {
    createMethodologyDiagrams();
  }
}

// Initialize results page
function initializeResultsPage() {
  console.log('Initializing results page');
  
  // Set the results header background if image generator is available
  if (typeof createElkHeroImage === 'function') {
    const bgImage = createElkHeroImage();
    document.querySelector('.results-header').style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${bgImage}')`;
  }
  
  // Generate feature importance chart if available
  if (typeof createFeatureImportanceChart === 'function') {
    const chartCanvas = document.getElementById('featureImportanceChart');
    if (chartCanvas) {
      const featureImportanceImg = createFeatureImportanceChart();
      const ctx = chartCanvas.getContext('2d');
      const img = new Image();
      img.onload = function() {
        ctx.drawImage(img, 0, 0, chartCanvas.width, chartCanvas.height);
      };
      img.src = featureImportanceImg;
    }
  }
  
  // Generate GMU maps if available
  const gmuMapIds = ['gmu12Map', 'gmu23Map', 'gmu24Map'];
  if (typeof createHabitatMap === 'function') {
    gmuMapIds.forEach((mapId, index) => {
      const gmuNumber = [12, 23, 24][index];
      const canvas = document.getElementById(mapId);
      
      if (canvas) {
        const mapImg = createHabitatMap(gmuNumber);
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = function() {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = mapImg;
      }
    });
  }
  
  // Create additional results charts
  createResultsCharts();
}

// Create charts for the results page
function createResultsCharts() {
  // Check if canvas elements exist
  const canvasIds = [
    'crossValidationChart',
    'categoryImportanceChart',
    'probabilityDistributionChart'
  ];
  
  canvasIds.forEach(id => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw chart based on ID
    switch(id) {
      case 'crossValidationChart':
        drawCrossValidationChart(ctx, canvas.width, canvas.height);
        break;
      case 'categoryImportanceChart':
        drawCategoryImportanceChart(ctx, canvas.width, canvas.height);
        break;
      case 'probabilityDistributionChart':
        drawProbabilityDistributionChart(ctx, canvas.width, canvas.height);
        break;
    }
  });
}

// Draw cross validation chart
function drawCrossValidationChart(ctx, width, height) {
  // Background
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, width, height);
  
  // Define chart area
  const padding = 40;
  const chartLeft = padding;
  const chartRight = width - padding;
  const chartTop = padding;
  const chartBottom = height - padding;
  const chartWidth = chartRight - chartLeft;
  const chartHeight = chartBottom - chartTop;
  
  // Draw axes
  ctx.beginPath();
  ctx.moveTo(chartLeft, chartTop);
  ctx.lineTo(chartLeft, chartBottom);
  ctx.lineTo(chartRight, chartBottom);
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw data points - cross validation accuracy across 5 folds
  const folds = 5;
  const barWidth = chartWidth / (folds * 2);
  const accuracies = [0.968, 0.972, 0.969, 0.973, 0.975];
  
  for (let i = 0; i < folds; i++) {
    const accuracy = accuracies[i];
    const barHeight = chartHeight * accuracy;
    const barX = chartLeft + (i * chartWidth / folds) + barWidth / 2;
    const barY = chartBottom - barHeight;
    
    // Draw bar
    ctx.fillStyle = '#3498db';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Draw confidence interval
    const ciLow = accuracy - 0.01;
    const ciHigh = accuracy + 0.01;
    const ciLowY = chartBottom - (chartHeight * ciLow);
    const ciHighY = chartBottom - (chartHeight * ciHigh);
    
    // CI line
    ctx.beginPath();
    ctx.moveTo(barX + barWidth / 2, ciLowY);
    ctx.lineTo(barX + barWidth / 2, ciHighY);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // CI caps
    ctx.beginPath();
    ctx.moveTo(barX + barWidth / 2 - 5, ciLowY);
    ctx.lineTo(barX + barWidth / 2 + 5, ciLowY);
    ctx.moveTo(barX + barWidth / 2 - 5, ciHighY);
    ctx.lineTo(barX + barWidth / 2 + 5, ciHighY);
    ctx.stroke();
    
    // Draw accuracy label
    ctx.fillStyle = '#2c3e50';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText((accuracy * 100).toFixed(1) + '%', barX + barWidth / 2, barY - 10);
    
    // Draw fold label
    ctx.fillText('Fold ' + (i + 1), barX + barWidth / 2, chartBottom + 15);
  }
  
  // Draw axes labels
  ctx.fillStyle = '#2c3e50';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Cross-Validation Fold', chartLeft + chartWidth / 2, chartBottom + 30);
  
  ctx.save();
  ctx.translate(chartLeft - 25, chartTop + chartHeight / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Accuracy', 0, 0);
  ctx.restore();
  
  // Draw title
  ctx.fillStyle = '#2c3e50';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Cross-Validation Accuracy', width / 2, 20);
}

// Draw category importance chart
function drawCategoryImportanceChart(ctx, width, height) {
  // Background
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, width, height);
  
  // Draw pie chart of feature categories
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;
  
  // Feature importance categories
  const categories = [
    { name: 'Terrain', value: 60.3, color: '#3498db' },
    { name: 'Vegetation', value: 23.9, color: '#2ecc71' },
    { name: 'Distance', value: 5.4, color: '#e74c3c' },
    { name: 'Other', value: 10.4, color: '#95a5a6' }
  ];
  
  // Draw pie slices
  let startAngle = 0;
  categories.forEach(category => {
    const sliceAngle = (category.value / 100) * Math.PI * 2;
    
    // Draw slice
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = category.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw label line and text
    const midAngle = startAngle + sliceAngle / 2;
    const labelRadius = radius * 1.2;
    const labelX = centerX + Math.cos(midAngle) * labelRadius;
    const labelY = centerY + Math.sin(midAngle) * labelRadius;
    
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(midAngle) * radius, centerY + Math.sin(midAngle) * radius);
    ctx.lineTo(labelX, labelY);
    ctx.strokeStyle = category.color;
    ctx.stroke();
    
    // Draw text
    ctx.fillStyle = '#2c3e50';
    ctx.font = '12px Arial';
    ctx.textAlign = midAngle < Math.PI ? 'left' : 'right';
    ctx.fillText(`${category.name}: ${category.value}%`, 
                 midAngle < Math.PI ? labelX + 5 : labelX - 5, 
                 labelY);
    
    startAngle += sliceAngle;
  });
  
  // Draw title
  ctx.fillStyle = '#2c3e50';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Feature Importance by Category', width / 2, 20);
}

// Draw probability distribution chart
function drawProbabilityDistributionChart(ctx, width, height) {
  // Background
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, width, height);
  
  // Define chart area
  const padding = 40;
  const chartLeft = padding;
  const chartRight = width - padding;
  const chartTop = padding;
  const chartBottom = height - padding;
  const chartWidth = chartRight - chartLeft;
  const chartHeight = chartBottom - chartTop;
  
  // Draw axes
  ctx.beginPath();
  ctx.moveTo(chartLeft, chartBottom);
  ctx.lineTo(chartRight, chartBottom);
  ctx.strokeStyle = '#2c3e50';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw y-axis
  ctx.beginPath();
  ctx.moveTo(chartLeft, chartTop);
  ctx.lineTo(chartLeft, chartBottom);
  ctx.stroke();
  
  // Define distribution data - probability values from 0.5 to 1.0
  const binCount = 10;
  const binWidth = chartWidth / binCount;
  
  // Distribution for high suitability class
  const highDistribution = [5, 8, 12, 18, 25, 30, 22, 15, 10, 5];
  const mediumDistribution = [4, 10, 20, 25, 22, 18, 12, 7, 4, 2];
  const lowDistribution = [3, 7, 15, 25, 30, 22, 15, 8, 4, 1];
  
  // Find max height for scaling
  const maxHeight = Math.max(
    ...highDistribution,
    ...mediumDistribution,
    ...lowDistribution
  );
  
  // Draw distributions
  const classes = [
    { name: 'High', data: highDistribution, color: '#1a9641' },
    { name: 'Medium', data: mediumDistribution, color: '#ffffbf' },
    { name: 'Low', data: lowDistribution, color: '#d7191c' }
  ];
  
  // Draw bins for each class - as line graphs
  classes.forEach((cls, classIndex) => {
    ctx.beginPath();
    
    for (let i = 0; i < binCount; i++) {
      const binHeight = (cls.data[i] / maxHeight) * chartHeight;
      const x = chartLeft + (i * binWidth) + (binWidth / 2);
      const y = chartBottom - binHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.strokeStyle = cls.color;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add points at each data point
    for (let i = 0; i < binCount; i++) {
      const binHeight = (cls.data[i] / maxHeight) * chartHeight;
      const x = chartLeft + (i * binWidth) + (binWidth / 2);
      const y = chartBottom - binHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = cls.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  });
  
  // Draw x-axis labels
  for (let i = 0; i <= binCount; i += 2) {
    const x = chartLeft + (i * binWidth);
    const probability = 0.5 + (i / binCount) * 0.5;
    
    ctx.fillStyle = '#2c3e50';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(probability.toFixed(1), x, chartBottom + 15);
  }
  
  // Draw legend
  const legendY = chartTop + 10;
  const legendX = chartLeft + chartWidth - 120;
  
  classes.forEach((cls, i) => {
    const y = legendY + (i * 20);
    
    // Line
    ctx.beginPath();
    ctx.moveTo(legendX, y);
    ctx.lineTo(legendX + 20, y);
    ctx.strokeStyle = cls.color;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Point
    ctx.beginPath();
    ctx.arc(legendX + 10, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = cls.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Text
    ctx.fillStyle = '#2c3e50';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(cls.name, legendX + 30, y + 4);
  });
  
  // Draw axes labels
  ctx.fillStyle = '#2c3e50';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Prediction Probability', chartLeft + chartWidth / 2, chartBottom + 30);
  
  ctx.save();
  ctx.translate(chartLeft - 25, chartTop + chartHeight / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Frequency', 0, 0);
  ctx.restore();
  
  // Draw title
  ctx.fillStyle = '#2c3e50';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Prediction Probability Distribution', width / 2, 20);
}

// Initialize interactive map page
// Updated initializeInteractiveMapPage function for site-integration.js
// Replace the existing function with this one

function initializeInteractiveMapPage() {
  console.log('Initializing interactive map page');
  
  // Set the map header background if image generator is available
  if (typeof createElkHeroImage === 'function') {
    const bgImage = createElkHeroImage();
    const mapHeader = document.querySelector('.map-header');
    if (mapHeader) {
      mapHeader.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${bgImage}')`;
    }
  }
  
  // Initialize interactive map with a slight delay to ensure DOM is ready
  if (typeof initializeInteractiveMap === 'function') {
    setTimeout(initializeInteractiveMap, 500);
  } else {
    console.error('Interactive map initialization function not found. Check if map-fix-complete.js is properly loaded.');
    
    // Fallback implementation - create a simple message if map can't be initialized
    const mapCanvas = document.getElementById('mapCanvas');
    if (mapCanvas) {
      mapCanvas.innerHTML = `
        <div class="alert alert-warning text-center p-5">
          <h4>Map Initialization Error</h4>
          <p>The interactive map could not be initialized. Please make sure all required scripts are properly loaded.</p>
          <p>Check your browser's console for more details.</p>
        </div>
      `;
    }
  }
}