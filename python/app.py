import os
import json
from flask import Flask, jsonify, render_template, request, send_from_directory, make_response, redirect, session, url_for
from flask_session import Session
import logging

logging.basicConfig(level=logging.DEBUG)

project_root = os.path.dirname(os.path.abspath(__file__))
template_dir = os.path.join(project_root, '..', 'views')
static_dir = os.path.join(project_root, '..', 'static')
public_dir = os.path.join(project_root, '..', 'public')

app = Flask(__name__, template_folder=template_dir, static_folder=public_dir)
app.secret_key = 'votre_cle_secrete_ici'

# Session configuration
app.config.update(
    SESSION_COOKIE_SECURE=False,  # Devrait être False pour le développement local sans HTTPS
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_PERMANENT=True,
    SESSION_TYPE='filesystem',
    SESSION_FILE_DIR=os.path.join(project_root, 'flask_session')
)
Session(app)


def read_device_data():
    account = session.get('account')
    app.logger.debug(f'Reading device data for account: {account}')
    if not account:
        app.logger.error('No account in session, unauthorized access attempted.')
        return []
    filepath = os.path.join(project_root, 'device_data.json')
    try:
        with open(filepath, 'r') as f:
            all_devices = json.load(f)
        app.logger.debug(f'All devices from file: {all_devices}')
        filtered_devices = [device for device in all_devices if device['account'].lower() == account.lower()]
        app.logger.debug(f'Filtered devices for account {account}: {filtered_devices}')
        return filtered_devices
    except Exception as e:
        app.logger.error(f'An unexpected error occurred: {str(e)}')
        return []


@app.route('/api/devices')
def get_devices():
    app.logger.debug(f'API /api/devices called, session: {session}')
    if 'account' not in session:
        app.logger.warning("Attempt to access /api/devices without account in session")
        return jsonify({'error': 'Unauthorized'}), 401
    devices = read_device_data()
    app.logger.debug(f'Devices fetched: {devices}')
    return jsonify(devices)

@app.route('/store_account', methods=['POST'])
def store_account():
    data = request.json
    account = data.get('account')
    if account:
        session['account'] = account
        app.logger.debug(f"Account {account} stored in session")
        return jsonify({'success': True})
    app.logger.error("Failed to store account, no account provided")
    return jsonify({'success': False}), 400

@app.route('/')
def home():
    return render_template('first_page.html')

@app.route('/connect_wallet')
def connect_wallet():
    return redirect(url_for('loader'))

@app.route('/loader')
def loader():
    return render_template('loader.html')


@app.route('/main')
def main_page():
    return render_template('home.html')

@app.route('/js/<path:filename>')
def send_js(filename):
    return send_from_directory(os.path.join(public_dir, 'js'), filename)

@app.route('/static/images/<path:filename>')
def send_image(filename):
    return send_from_directory(os.path.join(static_dir, 'images'), filename)

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.errorhandler(500)
def internal_error(error):
    return make_response(jsonify({'error': 'Internal server error'}), 500)

if __name__ == '__main__':
    app.run(debug=True)
