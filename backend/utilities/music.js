import express from 'express';
import open from 'open';
import ytmusicInit from 'ytmusic-api';
import bodyParser from 'body-parser';



// ======================
// EMOTION MAPPING
// ======================
const EMOTION_MAPPING = {
  happy: {
    query: 'happy upbeat',
    genres: ['Pop', 'Dance', 'Arabic Pop', 'Khaleeji'],
    description: 'Upbeat, cheerful tracks'
  },
  sad: {
    query: 'sad mellow',
    genres: ['Acoustic', 'Arabic Slow', 'R&B', 'Soft Rock'],
    description: 'Mellow, introspective songs'
  },
  angry: {
    query: 'intense aggressive',
    genres: ['Metal', 'Arabic Rock', 'Rap', 'Alternative'],
    description: 'Intense, high-energy music'
  },
  neutral: {
    query: 'chill relaxing',
    genres: ['Jazz', 'Arabic Instrumental', 'Chill', 'Lo-fi'],
    description: 'Balanced, easy-listening tracks'
  },
  fear: {
    query: 'dark suspenseful',
    genres: ['Ambient', 'Arabic Tarab', 'Soundtrack', 'Dark Wave'],
    description: 'Dark, suspenseful atmosphere'
  },
  surprise: {
    query: 'unexpected dynamic',
    genres: ['Eclectic', 'Arabic Fusion', 'Electronic', 'Funk'],
    description: 'Unexpected, dynamic compositions'
  }
};

// ======================
// INIT YTMusic
// ======================
let ytmusicClient;
(async function initialize() {
  const YTMusic = ytmusicInit.default;
  ytmusicClient = new YTMusic();
  await ytmusicClient.initialize();
  console.log('✅ YouTube Music API ready');
})();

// ======================
// UTILS
// ======================
function parseDuration(duration) {
  const parts = duration.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

async function getRecommendations(emotion, limit = 3) {
  const config = EMOTION_MAPPING[emotion.toLowerCase()];
  if (!config) return [];

  const { query, genres } = config;
  const tracks = [];

  for (const genre of genres) {
    if (tracks.length >= limit) break;

    try {
      const searchQuery = `${genre} ${query}`;
      console.log(`🔍 Searching: ${searchQuery}`);
      const results = await ytmusicClient.search(searchQuery, 'songs', 10);

      for (const track of results) {
        if (tracks.length >= limit) break;

        const duration = track.duration;
        if (!duration || parseDuration(duration) < 180 || parseDuration(duration) > 300) continue;

        const artists = track.artists.map(a => a.name).join(', ');
        const title = track.title.toLowerCase();
        const isEnglish = [...title].some(c => c.charCodeAt(0) < 128);
        const isArabic = [...title].some(c => c >= '\u0600' && c <= '\u06FF');

        if (isEnglish || isArabic) {
          tracks.push({
            name: track.title,
            artist: artists,
            url: `https://music.youtube.com/watch?v=${track.videoId}`,
            videoId: track.videoId,
            genre,
            duration
          });
        }
      }
    } catch (err) {
      console.warn(`⚠️ Error with genre ${genre}:`, err.message);
    }
  }

  return tracks.slice(0, limit);
}

// ======================
// MIDDLEWARE
// ======================
app.use(bodyParser.urlencoded({ extended: true }));

// ======================
// ROUTES
// ======================
app.get('/', (req, res) => {
  let form = `<h2>🎵 Music Mood Selector</h2><form method="POST" action="/recommend">`;
  Object.entries(EMOTION_MAPPING).forEach(([key, val], i) => {
    form += `<input type="radio" name="emotion" value="${key}" id="${key}" ${i === 0 ? 'checked' : ''}>
             <label for="${key}">${key.toUpperCase()} - ${val.description}</label><br>`;
  });
  form += `<br><button type="submit">Get Recommendations</button></form>`;
  res.send(form);
});

app.post('/recommend', async (req, res) => {
  const emotion = req.body.emotion;
  if (!emotion || !EMOTION_MAPPING[emotion]) {
    return res.send('❌ Invalid emotion selected.');
  }

  const tracks = await getRecommendations(emotion);
  if (!tracks.length) return res.send('⚠️ No tracks found.');

  const first = tracks[0];
  await open(first.url);

  let html = `<h2>🎯 Emotion: ${emotion.toUpperCase()}</h2>`;
  html += `<p><strong>Description:</strong> ${EMOTION_MAPPING[emotion].description}</p>`;
  html += `<h3>Top Recommendations:</h3><ul>`;
  tracks.forEach((track, i) => {
    html += `<li><strong>${i + 1}. ${track.name}</strong> by ${track.artist} 
             (${track.genre}, ${track.duration})<br>
             <a href="${track.url}" target="_blank">▶️ Play</a></li><br>`;
  });
  html += `</ul><br><a href="/">🔙 Back</a>`;

  res.send(html);
});

