
from sklearn.metrics import r2_score, mean_absolute_percentage_error


from flask_cors import CORS
from flask import Flask
from flask import request
import pandas as pd
from flask_pymongo import pymongo
import re 


import statsmodels.api as sm
from pandas.tseries.offsets import DateOffset
from datetime import date
import json
import numpy as np

from werkzeug.utils import secure_filename
import os

app=Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER']='./static'
ALLOWED_EXTENSIONS={"csv"}

#*global
df = pd.DataFrame()
filename = ''
rmse = ''
accuracy = ''
MAPE = ''
regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def welcome():
  return 'welcome'

@app.route('/file_upload',methods=['POST'])
def file_upload():
  msg=''
  #checking file label 
  if 'file' not in request.files:
    msg="File not attached"
  #getting file in a var
  file=request.files.get('file')
  
  if file and allowed_file(file.filename):
    global filename
    filename = secure_filename(file.filename)
    file.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
    msg='file upload success'
  else:
    msg='select a csv file'
  return {'response':msg}  

@app.route('/pred_days',methods=['POST'])
def calc_days():
  data=request.get_json(force=True)
  days=int(data['days'])
  global filename
  path = './static/'+filename
  df = pd.read_csv(path, parse_dates=True, index_col='Date')
  df = df.dropna()

  model = sm.tsa.statespace.SARIMAX(
  df['Sales'], order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
  results = model.fit()
  df['forecast'] = results.predict(start=50, end=103, dynamic=True)
  predicted_sales1 = df['forecast'][50:103].to_numpy()
  predicted_sales2 = predicted_sales1.tolist()
  predicted_sales = json.dumps(predicted_sales2)

  actual_sales1 = df['Sales'][50:103].to_numpy()
  actual_sales2 = actual_sales1.tolist()
  actual_sales = json.dumps(actual_sales2)

  dates1 = list(df.index[50:103])
  dates2 = [str(date)[:-9] for date in dates1]
  dates = json.dumps(dates2)

    # to from difference >0,

  future_sales = []
  final = str(df.index[-1])[:-9].split('-')
  #[2022,10,13]
  final_date = date(int(final[0]), int(final[1]), int(final[2]))
  extra_days = days
  start = 0
  end = extra_days

  # *setting extra dates*********************
  future_dates = [df.index[-1]+DateOffset(days=x)
                  for x in range(0, extra_days+1)]
  future_date_df = pd.DataFrame(index=future_dates[1:], columns=df.columns)
  future_df = pd.concat([df, future_date_df])
  future_df['forecast'] = results.predict(
      start=start+105, end=105+end+1, dynamic=False)
  # ***************************

  future_sales1 = future_df['forecast'][105+start:].to_numpy()
  future_sales2 = future_sales1.tolist()
  future_sales = json.dumps(future_sales2)

  future_user_date1 = list(future_df.index[-days:])
  future_user_date2 = [str(date)[:-9] for date in future_user_date1]
  future_user_date = json.dumps(future_user_date2)

  # * rmse calculation
  mse = np.square(np.subtract(df['Sales'], df['forecast'])).mean()
  rmse_unparsed = np.sqrt(mse)
  global rmse
  rmse = json.dumps(rmse_unparsed)
  #***********************#

  # *accuracy calculation
  accuracy_unparsed = r2_score(df.Sales[70:103], df.forecast[70:103])
  accuracy_unparsed = str(accuracy_unparsed*100)[:5]+'%'
  global accuracy
  accuracy = json.dumps(accuracy_unparsed)
  # **************

  # * MAPE
  mape_unparsed = mean_absolute_percentage_error(
      df.Sales[70:103], df.forecast[70:103])
  global MAPE
  MAPE = json.dumps(mape_unparsed)

  resp = {'actual': actual_sales,'predicted': predicted_sales, 'dates': dates, 'future_user_date': future_user_date, 'future_sales': future_sales,'mape':MAPE,'rmse':rmse,'accuracy':accuracy}

  return resp


# @app.route('/specific_dates',methods=['POST'])
# def specific_dates():
#   data = request.get_json(force=True)
#   fromm = data['from']
#   to = data['to']

#   global filename
#   path = './static/'+filename
#   df = pd.read_csv(path, parse_dates=True, index_col='Date')
#   df = df.dropna()
#   # order(ar,i,ma)
#   model = sm.tsa.statespace.SARIMAX(
#       df['Sales'], order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
#   results = model.fit()
#   df['forecast'] = results.predict(start=50, end=103, dynamic=True)
#   #df->numpy->list->json
#   predicted_sales1 = df['forecast'][50:103].to_numpy()
#   predicted_sales2 = predicted_sales1.tolist()
#   predicted_sales = json.dumps(predicted_sales2)

#   actual_sales1 = df['Sales'][50:103].to_numpy()
#   actual_sales2 = actual_sales1.tolist()
#   actual_sales = json.dumps(actual_sales2)

#   dates1 = list(df.index[50:103])
#   #'12-12-12 00:00:00'
#   dates2 = [str(date)[:-9] for date in dates1]
#   dates = json.dumps(dates2)

#   # to from difference >0,
  
  
# # 
#   future_sales = []
#   final = str(df.index[-1])[:-9].split('-')
#   final_date = date(int(final[0]), int(final[1]), int(final[2]))
#   date_dict = {}
#   # * calculating difference in dates or future prediction
#   date_dict['from'] = (fromm.split('-'))
#   date_dict['to'] = (to.split('-'))

#   from_date = date(int(date_dict['from'][0]), int(
#       date_dict['from'][1]), int(date_dict['from'][2]))
#   to_date = date(int(date_dict['to'][0]), int(
#       date_dict['to'][1]), int(date_dict['to'][2]))
#   #diff slicing to front end
#   difference = (to_date-from_date).days
#   #extra , production of extra dates
#   extra_days = (to_date-final_date).days
#   #prediction start,new df start
#   start = extra_days-difference
#   end = extra_days
#   #end prediction
  
#   #df=pd.Dataframe()
#   #df=df['temp']

#   # *setting extra dates*********************
#   future_dates = [df.index[-1]+DateOffset(days=x) for x in range(0, extra_days+1)]
#   future_date_df = pd.DataFrame(index=future_dates[1:], columns=df.columns)
#   future_df = pd.concat([df, future_date_df])
#   future_df['forecast'] = results.predict(
#       start=start+105, end=105+end+1, dynamic=False)
#   # ***************************
#   #object
#   future_sales1 = future_df['forecast'][105+start:].to_numpy()
#   future_sales2 = future_sales1.tolist()
#   future_sales = json.dumps(future_sales2)
#   #role->index
#   future_user_date1 = list(future_df.index[-difference-1:])
#   future_user_date2 = [str(date)[:-9] for date in future_user_date1]
#   future_user_date = json.dumps(future_user_date2)

#   # * rmse calculation
#   mse = np.square(np.subtract(df['Sales'], df['forecast'])).mean()
#   rmse_unparsed = np.sqrt(mse)
#   global rmse
#   rmse = json.dumps(rmse_unparsed)
#   #***********************#

#   # *accuracy calculation
#   accuracy_unparsed = r2_score(df.Sales[70:103], df.forecast[70:103])
#   accuracy_unparsed = str(accuracy_unparsed*100)[:5]+'%'
#   global accuracy
#   accuracy = json.dumps(accuracy_unparsed)
#   # **************

#   # * MAPE
#   mape_unparsed = mean_absolute_percentage_error(
#       df.Sales[70:103], df.forecast[70:103])
#   global MAPE
#   MAPE = json.dumps(mape_unparsed)

#   resp = {'actual': actual_sales,'predicted': predicted_sales, 'dates': dates, 'future_user_date': future_user_date, 'future_sales': future_sales,'mape':MAPE,'rmse':rmse,'accuracy':accuracy}

#   return resp

# @app.route('/certain_date',methods=['POST'])
# def certain():
#   data = request.get_json(force=True)
#   custom_unparsed_date = data['date']

#   global filename
#   path = './static/'+filename
#   #change path
#     # df = pd.read_csv('./static/jessy.csv', parse_dates=True, index_col='Date')
# #**********************************************************************
#   df = pd.read_csv(path, parse_dates=True, index_col='Date')
#   df = df.dropna()
#   # * training
#   model = sm.tsa.statespace.SARIMAX(
#       df['Sales'], order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
#   results = model.fit()
#   final = str(df.index[-1])[:-9].split('-')
#   final_date = date(int(final[0]), int(final[1]), int(final[2]))
#   # * parsing into a date
#   date_dict = {}
#   date_dict['date'] = custom_unparsed_date.split('-')
#   # * finding length between last date to custom date
#   custom_parsed_date = date(int(date_dict['date'][0]), int(
#       date_dict['date'][1]), int(date_dict['date'][2]))
#   extra_days = (custom_parsed_date-final_date).days

#   # * adding the extra date
#   future_dates = [df.index[-1]+DateOffset(days=x)
#                   for x in range(0, extra_days+1)]
#   future_date_df = pd.DataFrame(index=future_dates[1:], columns=df.columns)
#   future_df = pd.concat([df, future_date_df])
#   future_df['forecast'] = results.predict(
#       start=105, end=105+extra_days+1, dynamic=False)
#   predicted_non_json_value = future_df['forecast'][-1]
#   predicted_value = json.dumps(predicted_non_json_value)

#   return {'sales_val': predicted_value}
  


 
  
  

if __name__ == '__main__':
    app.run(debug=True)  
    