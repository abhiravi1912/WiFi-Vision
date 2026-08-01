"""
WiFi Vision — Data Schemas
Validation helpers for API request and response payloads.
"""
from typing import Optional


def validate_features(data: dict) -> tuple[bool, str]:
    """Validate a prediction request payload."""
    features = data.get('features')
    if features is None:
        return False, 'Missing "features" field.'
    if not isinstance(features, list):
        return False, '"features" must be a list of numbers.'
    if len(features) == 0:
        return False, '"features" list cannot be empty.'
    try:
        [float(f) for f in features]
    except (TypeError, ValueError):
        return False, 'All feature values must be numeric.'
    return True, ''


def validate_train_request(data: dict) -> tuple[bool, str]:
    """Validate a training request payload."""
    model_type = data.get('model_type', 'random_forest')
    valid_types = ['random_forest', 'svm', 'xgboost']
    if model_type not in valid_types:
        return False, f'model_type must be one of {valid_types}.'
    return True, ''
