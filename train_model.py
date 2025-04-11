import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.linear_model import LinearRegression, Lasso, Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from xgboost import XGBRegressor
from sklearn.model_selection import cross_val_score
import joblib
import json

# Load the data
df = pd.read_csv('bhp.csv')

# Data cleaning
# Remove extreme outliers (like 200000 price_per_sqft)
df = df[df['price_per_sqft'] < 50000]

# Convert total_sqft to numeric (handling ranges if any)
def convert_sqft_to_num(x):
    if isinstance(x, str):
        tokens = x.split('-')
        if len(tokens) == 2:
            return (float(tokens[0]) + float(tokens[1])) / 2
        try:
            return float(x)
        except:
            return None
    return x

df['total_sqft'] = df['total_sqft'].apply(convert_sqft_to_num)
df = df.dropna(subset=['total_sqft'])

# Feature engineering
df['price_per_sqft'] = df['price'] * 100000 / df['total_sqft']

# Remove outliers by location and price_per_sqft
def remove_pps_outliers(df):
    df_out = pd.DataFrame()
    for key, subdf in df.groupby('location'):
        m = np.mean(subdf.price_per_sqft)
        st = np.std(subdf.price_per_sqft)
        reduced_df = subdf[(subdf.price_per_sqft > (m - st)) & (subdf.price_per_sqft <= (m + st))]
        df_out = pd.concat([df_out, reduced_df], ignore_index=True)
    return df_out

df = remove_pps_outliers(df)

# Remove properties where total_sqft/bhk is unrealistic (<300 sqft per room)
df = df[df['total_sqft'] / df['bhk'] >= 300]

# Drop unnecessary columns
df = df.drop(['size', 'price_per_sqft'], axis=1)

# Split into features and target
X = df.drop('price', axis=1)
y = df['price']

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define preprocessing for numerical and categorical features
numeric_features = ['total_sqft', 'bath', 'bhk']
numeric_transformer = Pipeline(steps=[('scaler', StandardScaler())])

categorical_features = ['location']
categorical_transformer = Pipeline(steps=[('onehot', OneHotEncoder(handle_unknown='ignore'))])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)])

# Define models to test
models = {
    'Linear Regression': LinearRegression(),
    'Lasso': Lasso(alpha=0.1),
    'Ridge': Ridge(alpha=1.0),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
    'XGBoost': XGBRegressor(n_estimators=100, random_state=42)
}

# Train and evaluate models
results = {}
for name, model in models.items():
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', model)
    ])
    
    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    # Cross-validation
    cv_scores = cross_val_score(pipeline, X_train, y_train, cv=5, scoring='r2')
    
    results[name] = {
        'MAE': mae,
        'RMSE': rmse,
        'R2': r2,
        'CV R2 Mean': np.mean(cv_scores),
        'CV R2 Std': np.std(cv_scores)
    }
    
    print(f"{name} - R2: {r2:.4f}, MAE: {mae:.2f}, RMSE: {rmse:.2f}")

# Convert results to DataFrame for comparison
results_df = pd.DataFrame(results).T
print("\nModel Comparison:")
print(results_df.sort_values('R2', ascending=False))

# Save the best model (XGBoost)
best_model = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', XGBRegressor(n_estimators=100, random_state=42))
])

best_model.fit(X_train, y_train)
joblib.dump(best_model, 'bangalore_housing_model.pkl')

# Save metadata
model_metadata = {
    'features': list(X.columns),
    'target': 'price',
    'model_type': 'XGBoost',
    'version': '1.0'
}

with open('model_metadata.json', 'w') as f:
    json.dump(model_metadata, f)

print("\nModel saved as 'bangalore_housing_model.pkl'")