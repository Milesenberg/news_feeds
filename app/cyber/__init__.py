from flask import Blueprint

cyber = Blueprint('cyber', __name__, template_folder='templates', static_folder='static')

from app.cyber import routes
