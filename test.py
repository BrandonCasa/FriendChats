from nltk import ngrams

sentence = 'this is a foo bar sentences and I want to ngramize it'

n = 6
sixgrams = ngrams(sentence.split(), n)

for grams in sixgrams:
    print(grams)
