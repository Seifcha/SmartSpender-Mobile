from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import pandas as pd
from datetime import datetime, timedelta
from prophet import Prophet

# Configuration de CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def db_connection():
    try:
        conn = pymysql.connect(
            host='127.0.0.1',
            database='smartspender',
            user='root',
            password='',
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        return conn
    except pymysql.MySQLError as e:
        print(f"Error connecting to database: {e}")
        return None

@app.route('/prediction/<userEmail>', methods=['GET'])
def prediction(userEmail):
    conn = db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor()
    cursor.execute("SELECT      DATE_FORMAT(date, '%%Y-%%m-%%d %%H:%%i:%%s') AS formatted_date,      montant  FROM      depenses  WHERE      userEmail = %s", (userEmail,))
    depenses = [dict(date=row['formatted_date'], montant=row['montant']) for row in cursor.fetchall()]
    print (depenses[0])
# 'date': '2024-05-11T03:26:18.636Z'   === c doit etre comme ca  2024-05-19 10:15:00.000
    if not depenses:
        return jsonify({"error": "No expenses found for the user"}), 404

    # for row in depenses:
    #     row['date'] = datetime.strptime(row['date'],'ISO8601')
    print(type(depenses[0]['date']))

    df = pd.DataFrame(depenses)
  
    df['date'] = pd.to_datetime(df['date'].str.replace('T', ' ').str.replace('Z', ''))
    df=df.dropna()
    # df['date'] = pd.to_datetime(df['date'])
    df.rename(columns={'date':'ds','montant':'y'},inplace=True)    # df['ds'] = pd.to_datetime(df['ds'], errors='coerce')


    def predict_expenses(dataframe):
        start_year = dataframe['ds'].min().year
        end_year = dataframe['ds'].max().year

        school_holidays = [
            ("VACANCES D'AUTOMNE", "10-20", "11-05"),
            ("Vacances D'hivers", "02-23", "03-10"),
            ("Vacances de printemps", "04-26", "05-12")
        ]

        fixed_holidays = [
            ("Nouvel An", "01-01"),
            ("Révolution et Fête de la Jeunesse", "01-14"),
            ("Fête de l'Indépendance", "03-20"),
            ("Jour de la République", "07-25"),
            ("Fête des Femmes", "08-13"),
            ("Jour de l'Évacuation", "10-15"),
        ]

        holiday_dates = []
        for year in range(start_year, end_year + 1):
            for name, date in fixed_holidays:
                holiday_dates.append((name, datetime.strptime(f"{year}-{date}", "%Y-%m-%d")))

        def generate_individual_holidays(start_year, end_year, school_holidays):
            individual_holidays = []
            for year in range(start_year, end_year + 1):
                for name, start_date, end_date in school_holidays:
                    start = datetime.strptime(f"{year}-{start_date}", "%Y-%m-%d")
                    end = datetime.strptime(f"{year}-{end_date}", "%Y-%m-%d")
                    current = start
                    while current <= end:
                        individual_holidays.append((name, current.strftime("%Y-%m-%d")))
                        current += timedelta(days=1)
            return individual_holidays

        individual_holidays = generate_individual_holidays(start_year, end_year, school_holidays)
        holiday_dates.extend(individual_holidays)

        # Création d'un DataFrame à partir de la liste des vacances
        holiday_df = pd.DataFrame(holiday_dates, columns=['holiday', 'ds'])

        model_with_holidays = Prophet(holidays=holiday_df)
        model_with_holidays.fit(dataframe)

        # Génération des prédictions
        future = model_with_holidays.make_future_dataframe(periods=12, freq ='M', include_history=True)
        forecast = model_with_holidays.predict(future)
        forecast['yhat_upper'] = forecast['yhat_upper'].apply(lambda x: max(0, x) if x < 0 else x)
        forecast['yhat'] = forecast['yhat'].apply(lambda x: max(0, x) if x < 0 else x)
        forecast['yhat_lower'] = forecast['yhat_lower'].apply(lambda x: max(0, x) if x < 0 else x)
        today = pd.Timestamp.today()
        forecast_filtered = forecast[forecast['ds'] >= today]
        return forecast_filtered[['ds', 'yhat_upper']] #doit retourner toutes les colonnes

    predictions = predict_expenses(df)
    prediction_json = predictions.to_json(orient='split')

    update_query = "UPDATE users SET prediction = %s WHERE email = %s"
    cursor.execute(update_query, (prediction_json, userEmail))
    conn.commit()

    cursor.execute("SELECT prediction FROM users WHERE email = %s", (userEmail,))
    updated_prediction = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(updated_prediction), 200

    
if __name__ == '__main__':
    # Run the Flask app on port 9002
  app.run(debug=True, host='', port=9002)