import os
import pandas as pd
import re
import nltk
import time
nltk.download('punkt')

start = time.time()

dataPath = "./data/"
dir_list = os.listdir(dataPath)

csvData = list()
for file in dir_list:
    csvData.append(pd.read_csv(dataPath + file))

frequencyList = dict()
dfList = dict()

for idx, channelData in enumerate(csvData):
    filtered = pd.DataFrame(channelData).query(
        'AuthorID == 249653920081772544')['Content'].astype(str).tolist()

    frequency = nltk.FreqDist((' '.join(filtered)).split(' '))
    # max_frequency = max(frequency.values())

    # for word in frequency.keys():
    #     frequency[word] = frequency[word]/max_frequency
    blarg = [(k, v) for k, v in frequency.items()]
    newDf = pd.DataFrame(blarg, columns=['Word', 'Frequency'])

    frequencyList[dir_list[idx]] = blarg
    dfList[dir_list[idx]] = newDf

    newDf.to_csv('./data_out/' + dir_list[idx], index=False)

print(dfList[dir_list[0]])

end = time.time()
print(end - start)
