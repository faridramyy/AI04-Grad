  import { EMOTION_MAPPING } from '../utilities/emotionConfig.js';
import { getRecommendations } from '../utilities/helpers.js';
import open from 'open';

export const showForm = (req, res) => {
  let form = `<h2>🎵 Music Mood Selector</h2><form method="POST" action="/recommend">`;
  Object.entries(EMOTION_MAPPING).forEach(([key, val], i) => {
    form += `<input type="radio" name="emotion" value="${key}" id="${key}" ${i === 0 ? 'checked' : ''}>
             <label for="${key}">${key.toUpperCase()} - ${val.description}</label><br>`;
  });
  form += `<br><button type="submit">Get Recommendations</button></form>`;
  res.send(form);
};

export const handleRecommendation = async (req, res) => {
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
};
