import time
import sys
import webbrowser
from ytmusicapi import YTMusic

# ======================
# 1. YOUTUBE MUSIC CLIENT SETUP (Anonymous)
# ======================

print("🔍 Setting up YouTube Music in anonymous mode...")

try:
    ytmusic = YTMusic()
    print("✅ YouTube Music setup successful (anonymous access)")
except Exception as e:
    print(f"❌ YouTube Music setup failed: {str(e)}")
    sys.exit(1)

# ======================
# 2. EMOTION → GENRE + QUERY MAPPING
# ======================

EMOTION_MAPPING = {
    'happy': {
        'query': "happy upbeat",
        'genres': ["Pop", "Dance", "Arabic Pop", "Khaleeji"],
        'description': "Upbeat, cheerful tracks"
    },
    'sad': {
        'query': "sad mellow",
        'genres': ["Acoustic", "Arabic Slow", "R&B", "Soft Rock"],
        'description': "Mellow, introspective songs"
    },
    'angry': {
        'query': "intense aggressive",
        'genres': ["Metal", "Arabic Rock", "Rap", "Alternative"],
        'description': "Intense, high-energy music"
    },
    'neutral': {
        'query': "chill relaxing",
        'genres': ["Jazz", "Arabic Instrumental", "Chill", "Lo-fi"],
        'description': "Balanced, easy-listening tracks"
    },
    'fear': {
        'query': "dark suspenseful",
        'genres': ["Ambient", "Arabic Tarab", "Soundtrack", "Dark Wave"],
        'description': "Dark, suspenseful atmosphere"
    },
    'surprise': {
        'query': "unexpected dynamic",
        'genres': ["Eclectic", "Arabic Fusion", "Electronic", "Funk"],
        'description': "Unexpected, dynamic compositions"
    }
}

# ======================
# 3. RECOMMENDATION ENGINE
# ======================
def parse_duration(duration_str):
    """Convert '3:45' or '1:02:30' into seconds"""
    parts = list(map(int, duration_str.split(':')))
    if len(parts) == 2:
        return parts[0] * 60 + parts[1]
    elif len(parts) == 3:
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
    return 0

def get_recommendations(emotion, limit=3):
    """Return a list of tracks matching the emotion with high popularity and valid duration"""
    emotion = emotion.lower()
    if emotion not in EMOTION_MAPPING:
        print(f"❌ Unknown emotion '{emotion}'. Choose from: {list(EMOTION_MAPPING.keys())}")
        return []

    data = EMOTION_MAPPING[emotion]
    tracks = []

    for genre in data['genres']:
        if len(tracks) >= limit:
            break

        query = f"{genre} {data['query']}"
        print(f"\n🔎 Searching for popular {emotion} songs in {genre}...")

        try:
            results = ytmusic.search(query, filter="songs", limit=10)

            for track in results:
                if len(tracks) >= limit:
                    break

                duration_str = track.get('duration')
                if not duration_str:
                    continue

                duration_sec = parse_duration(duration_str)
                if not (180 <= duration_sec <= 300):  # 3 to 5 minutes
                    continue

                artists = ", ".join(artist['name'] for artist in track['artists'])
                title = track['title'].lower()

                is_english = any(c.isascii() for c in title)
                is_arabic = any('\u0600' <= c <= '\u06FF' for c in title) or any('\u0600' <= c <= '\u06FF' for c in artists)

                if is_english or is_arabic:
                    tracks.append({
                        "name": track['title'],
                        "artist": artists,
                        "url": f"https://music.youtube.com/watch?v={track['videoId']}",
                        "videoId": track['videoId'],
                        "genre": genre,
                        "duration": duration_str
                    })

        except Exception as e:
            print(f"⚠️ Couldn't fetch {genre} tracks: {str(e)}")
            continue

    return tracks[:limit]

# ======================
# 4. USER INTERFACE & PLAYBACK
# ======================

def show_emotion_menu():
    """Display emotion choices and return user selection"""
    print("\n🎵 MUSIC MOOD SELECTOR 🎵")
    print("=======================")
    print("Select your current mood and we'll recommend popular English/Arabic songs")
    for i, emotion in enumerate(EMOTION_MAPPING.keys(), 1):
        print(f"{i}. {emotion.capitalize()} - {EMOTION_MAPPING[emotion]['description']}")
    
    while True:
        try:
            choice = int(input("\nSelect an emotion (1-6): "))
            if 1 <= choice <= len(EMOTION_MAPPING):
                return list(EMOTION_MAPPING.keys())[choice-1]
            print("❌ Please enter a number between 1 and 6")
        except ValueError:
            print("❌ Invalid input. Please enter a number.")

def play_first_track(tracks):
    """Open the first recommended track in browser"""
    if not tracks:
        return
    
    first_track = tracks[0]
    print(f"\n🎧 Now playing: {first_track['name']} - {first_track['artist']}")
    print(f"   Genre: {first_track['genre']}")
    webbrowser.open(first_track['url'])

# ======================
# 5. MAIN FUNCTION
# ======================

def main():
    # Let user choose emotion
    emotion = show_emotion_menu()
    
    print(f"\n🎯 Emotion selected: {emotion.upper()}")
    desc = EMOTION_MAPPING[emotion]['description']
    print(f"🎵 Description: {desc}")
    
    # Get recommendations
    print("\n⏳ Finding the best English/Arabic songs for you...")
    tracks = get_recommendations(emotion, limit=3)

    print(f"\n===== RECOMMENDED TRACKS ({emotion.upper()}) =====")
    if not tracks:
        print("⚠️ No suitable recommendations found. Try another emotion.")
        return

    for i, track in enumerate(tracks, 1):
        print(f"\n{i}. {track['name']} - {track['artist']}")
        print(f"   Genre: {track['genre']}")
        print(f"   🔗 {track['url']}")
    
    # Automatically play the first track
    play_first_track(tracks)

# ======================
# 6. EXECUTION ENTRY POINT
# ======================

if __name__ == "__main__":
    main()