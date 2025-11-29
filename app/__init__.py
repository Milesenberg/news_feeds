from flask import Flask

def create_app():
    app = Flask(__name__)

    from app.main.routes import main
    from app.news.routes import news
    from app.sequencer.routes import sequencer

    app.register_blueprint(main)
    app.register_blueprint(news, url_prefix='/news')
    app.register_blueprint(sequencer, url_prefix='/sequencer')

    return app
