import os
import pandas as pd

dataPath = "./data/"
dir_list = os.listdir(dataPath)

csvData = list()
for file in dir_list:
    csvData.append(pd.read_csv(dataPath + file))

for idx, channelData in enumerate(csvData):
    # Remove useless columns
    csvData[idx] = channelData.drop(columns=['Attachments', 'Reactions'])

    for idy, message in enumerate(channelData):
        # Remove URLs
        if "https://" in message["Content"]:
            message["Content"].splice()
