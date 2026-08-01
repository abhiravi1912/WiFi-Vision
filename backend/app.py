"""
WiFi Vision — Flask Backend Application
Main entry point for the REST API server.
"""
from flask import Flask
from flask_cors import CORS
from config import Config
from database import Database
from routes.status import status_bp
from routes.csi import csi_bp
from routes.activity import activity_bp
from routes.system import system_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for React frontend
    CORS(app, origins=Config.CORS_ORIGINS)

    # Initialize database
    db = Database(Config.DATABASE_PATH)
    db.initialize()
    app.config['db'] = db

    # Register Blueprints
    app.register_blueprint(status_bp, url_prefix='/api')
    app.register_blueprint(csi_bp, url_prefix='/api')
    app.register_blueprint(activity_bp, url_prefix='/api')
    app.register_blueprint(system_bp, url_prefix='/api')

    @app.route('/')
    def index():
        return {
            'name': 'WiFi Vision API',
            'version': '1.0.0',
            'status': 'running',
            'documentation': '/api/status',
        }

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
