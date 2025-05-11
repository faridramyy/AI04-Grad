import { EMOTION_MAPPING } from './emotionConfig.js';
import ytmusicInit from 'ytmusic-api';

const YTMusic = ytmusicInit.default;
const ytmusicClient = new YTMusic();
await ytmusicClient.initialize();

function parseDuration(duration) {
  const parts = duration.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

export async function getRecommendations(emotion, limit = 3) {
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
