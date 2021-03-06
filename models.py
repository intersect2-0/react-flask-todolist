from server import db
import datetime


class SiteUsers(db.Model):
    __tablename__ = 'siteusers'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True)
    email = db.Column(db.String(30), unique=True)
    password = db.Column(db.String(30))
    registered_on = db.Column(db.DateTime, default=datetime.datetime.now())
    todos = db.relationship('Todo', backref='user', lazy='dynamic')

    def is_authenticated(self):
        return True

    def is_anonymous(self):
        return False

    def is_active(self):
        return True

    def get_id(self):
        return str(self.id)

    def __repr__(self):
        return 'User: {}'.format(self.username)


class Todo(db.Model):
    __tablename__ = 'todos'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.UnicodeText)
    created_on = db.Column(db.DateTime, default=datetime.datetime.now)
    done = db.Column(db.Boolean, default=False)

    user_id = db.Column(db.Integer, db.ForeignKey('siteusers.id'))

    def __repr__(self):
        return self.text