
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from predict import predict_price
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/predict', methods=['POST'])
def api_predict():
    data = request.json
    try:
        # Extract features from the request
        location = data.get('location', '')
        total_sqft = float(data.get('area', 0))
        bath = int(data.get('bathrooms', 0))
        bhk = int(data.get('bedrooms', 0))
        
        # Predict using our ML model
        predicted_price = predict_price(location, total_sqft, bath, bhk)
        
        # Return the prediction
        return jsonify({
            'predicted_price': float(predicted_price) * 100000,  # Convert to actual price
            'status': 'success'
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

@app.route('/api/model_metadata', methods=['GET'])
def get_model_metadata():
    # Read the model metadata
    with open('model_metadata.json', 'r') as f:
        metadata = json.load(f)
    
    return jsonify(metadata)

@app.route('/api/locations', methods=['GET'])
def get_locations():
    try:
        # Read the CSV to extract available locations
        df = pd.read_csv('bhp.csv')
        locations = sorted(df['location'].unique().tolist())
        return jsonify({
            'locations': locations,
            'status': 'success'
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
