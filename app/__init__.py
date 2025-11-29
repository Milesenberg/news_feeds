from flask import Flask

def create_app():
    app = Flask(__name__)

    from app.main.routes import main
    from app.news.routes import news

    app.register_blueprint(main)
    app.register_blueprint(news, url_prefix='/news')

    return app
