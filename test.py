import re

testString = " yo? https://youtu.be/pL9o_BwSN-o?t=17 lol https://www.programiz.com/python-programming/methods/string/index"

text = re.sub(
    r'''(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))''', " ", testString)

print(text)
