import os
import numpy as np
import tensorflow as tf
tf.get_logger().setLevel('ERROR')
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.models import Model
from tensorflow.keras.applications import DenseNet201
from gtts import gTTS
import translators as ts
import json

MAX_LENGTH = 34
TOKENIZER_PATH = os.path.join(os.path.dirname(__file__), "tokenizer.pkl")
IMAGE_PATH = os.path.join(os.path.dirname(os.getcwd()), "polygot-vision/public/image.jpg")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.h5")
model = load_model(MODEL_PATH)

import pickle
with open(TOKENIZER_PATH, 'rb') as handle:
    tokenizer = pickle.load(handle)

feature_extractor = DenseNet201()
feature_extractor = Model(inputs=feature_extractor.input, outputs=feature_extractor.layers[-2].output)

def translate_text(text, target_language):
    """Translate the given text into the target language."""
    translated_text = ts.translate_text(text,from_language="en" ,to_language=target_language)
    return translated_text  

def generate_audio(text, language, filename):
    """Generate an audio file from the text."""
    tts = gTTS(text=text, lang=language, slow=False)
    audio_path = os.path.join(os.path.dirname(os.getcwd()), f"polygot-vision/public/{filename}.mp3")
    tts.save(audio_path)

def extract_image_features(image_path):
    img_size = 224  
    img = load_img(image_path, target_size=(img_size, img_size))
    img = img_to_array(img) / 255.0 
    img = np.expand_dims(img, axis=0)   
    features = feature_extractor.predict(img,verbose=0)
    return features

def predict_caption(model, features, tokenizer, max_length):
    in_text = "startseq"
    for i in range(max_length):
        sequence = tokenizer.texts_to_sequences([in_text])[0]
        sequence = pad_sequences([sequence], maxlen=max_length)
        y_pred = model.predict([features, sequence], verbose=0)
        y_pred = np.argmax(y_pred)
        word = next((w for w, idx in tokenizer.word_index.items() if idx == y_pred), None)
        if word is None:
            break
        in_text += " " + word
        if word == "endseq":
            break
    return in_text.replace("startseq", "").replace("endseq", "").strip()

def generate_caption_for_image():
    image_path = os.path.join(os.path.dirname(__file__), IMAGE_PATH)
    if not os.path.exists(image_path):
        print(f"Image {IMAGE_PATH} not found in {image_path}")
        return
    features = extract_image_features(image_path)

    english_caption = predict_caption(model, features, tokenizer, MAX_LENGTH)
    hindi_caption = (translate_text(english_caption, "hi"))
    japanese_caption = (translate_text(english_caption, "ja"))
    generate_audio(english_caption,"en","english")
    generate_audio(hindi_caption, "hi", "hindi")
    generate_audio(japanese_caption, "ja", "japanese")
    result={
        "english":english_caption,
        "hindi":hindi_caption,
        "japanese":japanese_caption
    }
    print(json.dumps(result))

if __name__ == "__main__":
    generate_caption_for_image()
