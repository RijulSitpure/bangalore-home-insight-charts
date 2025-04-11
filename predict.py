import joblib
import pandas as pd

# Load the model
model = joblib.load('bangalore_housing_model.pkl')

# Example prediction
def predict_price(location, total_sqft, bath, bhk):
    input_data = pd.DataFrame({
        'location': [location],
        'total_sqft': [total_sqft],
        'bath': [bath],
        'bhk': [bhk]
    })
    predicted_price = model.predict(input_data)[0]
    return predicted_price

# Test prediction
price = predict_price('Whitefield', 1500, 2, 3)
print(f"Predicted Price: ₹{price * 100000:.2f}")