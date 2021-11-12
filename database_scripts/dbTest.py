import sys
import getopt
import http.client
import urllib
import json

baseurl = "localhost"
port = 4000
conn = http.client.HTTPConnection(baseurl, port)
headers = {"Content-type": "application/x-www-form-urlencoded",
           "Accept": "text/plain"}


# params = urllib.parse.urlencode(
#     {'name': 'nath' + " " + 'ensmiff', 'email': 'nath' + "@" + 'ensmiff' + ".com"})

# conn.request("POST", "/api/users", params, headers)
# assignedUserID = "6189f1d49d8f19532da5a53a"

# conn.request("GET", """/api/users?where={"_id":\""""+assignedUserID+"""\"}""")
# response = conn.getresponse()
# data = response.read()
# d = json.loads(data)

# # Store all the user properties
# assignedUserName = str(d['data'][0]['name'])
# assignedUserEmail = str(d['data'][0]['email'])
# assignedUserDate = str(d['data'][0]['dateCreated'])

# # Append the new taskID to pending tasks
# assignedUserTasks = d['data'][0]['pendingTasks']
# assignedUserTasks = [str(x).replace('[','').replace(']','').replace("'",'').replace('"','') for x in assignedUserTasks]
# assignedUserTasks.append(taskID)

# # PUT in the user
# params = urllib.parse.urlencode({'_id': assignedUserID, 'name': assignedUserName, 'email': assignedUserEmail, 'dateCreated': assignedUserDate, 'pendingTasks': assignedUserTasks}, True)
# conn.request("PUT", "/api/users/"+assignedUserID, params, headers)
# response = conn.getresponse()
# data = response.read()
# d = json.loads(data)

# conn.request("GET","""/api/users?where={"_id":\""""++"""\"}""")
#             response = conn.getresponse()
#             data = response.read()
#             d = json.loads(data)


# assignedUserID = "6189ea37fc904f51a6324f89"
# assignedUserID = "6189f1d49d8f19532da5a53a"
assignedUserID = "6189f1fd3ab20a533d2fa70e"

assignedUserName = "bobba"

params = urllib.parse.urlencode(
    {'_id': assignedUserID, 'name': assignedUserName, 'email': "bob@bob.com"}, True)
conn.request("PUT", "/api/users/"+assignedUserID, params, headers)
response = conn.getresponse()
data = response.read()
d = json.loads(data)


print(d)
