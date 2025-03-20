# Elk Habitat Prediction System

A machine learning-based web application for predicting optimal elk hunting habitats in Colorado Game Management Units.

![Elk Habitat Prediction System]

## Overview

The Elk Habitat Prediction System is a sophisticated machine learning approach that identifies optimal elk hunting habitats in Colorado. By analyzing terrain, vegetation, and environmental factors, the system classifies areas by hunting suitability (high, medium, low) with remarkable accuracy (97.1%).

This project integrates multiple geospatial datasets including digital elevation models, satellite imagery, and historical harvest records to create a comprehensive prediction model for GMUs 12, 23, and 24, which are known for their significant elk populations and diverse terrain.

## Features

- **Comprehensive Data Integration**: Combines multiple geospatial datasets to create a holistic view of the landscape
- **Advanced Machine Learning**: Employs a Random Forest Classifier with 97.1% prediction accuracy
- **Interactive Map**: Explore habitat suitability across different Game Management Units
- **Detailed Analysis**: View feature importance, probability distributions, and spatial patterns
- **Research Documentation**: Complete methodology and findings available in the research paper section

## Key Findings

- Terrain characteristics, particularly slope (40.8% importance), play the dominant role in determining habitat suitability
- Vegetation metrics collectively form the second most influential category of predictors
- Elevation (12.3%) emerged as the third most significant individual feature
- Edge proximity (5.8%) confirms the importance of forest-meadow interfaces

## Pages

- **Home**: Project overview and key features
- **Methodology**: Detailed explanation of data sources, feature engineering, and model implementation
- **Results**: Comprehensive analysis of model performance and findings
- **Interactive Map**: Explore habitat suitability with customizable layers and location information
- **Research Paper**: Academic documentation of the project methodology and results

## Technology

This is a static HTML/CSS/JavaScript website with the following technologies:

- Bootstrap 5 for responsive design
- Canvas API for map and chart rendering
- Custom JavaScript for interactive elements

## Local Development

To run this website locally:

1. Clone the repository
2. Open `index.html` in your browser

No server or build process is required as this is a static website.

## Credits

This project was created as a demonstration of applying machine learning techniques to wildlife habitat prediction. All data sources are publicly available from various agencies including USGS, Colorado Parks & Wildlife, and the European Space Agency.
