// Thay GEMINI_API_KEY bằng API key của bạn
const API_KEY = 'AIzaSyAcVFMSkAQB0fEt6_dEjOFNdqj7V8_ZXc4';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const getSongBtn = document.getElementById('getSongBtn');
const songSuggestion = document.getElementById('songSuggestion');

function createSongItem(rank, songInfo) {
    return `
        <div class="song-info-item">
            <div class="song-info-rank">#${rank}</div>
            <div class="song-info-content">
                <div class="song-title">${songInfo.title}</div>
                <div class="song-artist">${songInfo.artist}</div>
            </div>
        </div>
    `;
}

function formatSongList(text) {
    try {
        // Xử lý chuỗi JSON từ API
        const cleanJson = text.replace(/```json\n|\n```/g, '').trim();
        const songs = JSON.parse(cleanJson);
        
        if (!Array.isArray(songs) || songs.length !== 10) {
            throw new Error('Dữ liệu không đúng định dạng mảng 10 bài hát');
        }

        return songs.map((song, index) => createSongItem(index + 1, {
            title: song.title.trim(),
            artist: song.artist.trim()
        })).join('');
    } catch (error) {
        console.error('Lỗi khi xử lý dữ liệu:', error);
        return createSongItem(1, {
            title: 'Có lỗi xảy ra khi xử lý dữ liệu',
            artist: 'Vui lòng thử lại'
        });
    }
}

async function getSongSuggestion() {
    try {
        getSongBtn.disabled = true;
        songSuggestion.innerHTML = `
            <div class="song-info-item">
                <span class="material-icons">hourglass_empty</span>
                <div class="song-info-content">
                    <div class="song-title">Đang tải danh sách...</div>
                    <div class="song-artist">Vui lòng đợi trong giây lát</div>
                </div>
            </div>
        `;

        const prompt = `Trả về danh sách 10 bài hát karaoke tiếng Việt phổ biến nhất hiện nay.
        Format JSON:
        [
            {
                "title": "Tên bài hát",
                "artist": "Tên ca sĩ"
            }
        ]`;

        const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.2,
                    topK: 1,
                    topP: 1
                }
            })
        });

        if (!response.ok) {
            throw new Error('Không thể kết nối với API');
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            const suggestion = data.candidates[0].content.parts[0].text;
            songSuggestion.style.opacity = '0';
            setTimeout(() => {
                songSuggestion.innerHTML = formatSongList(suggestion);
                songSuggestion.style.opacity = '1';
            }, 200);
        } else {
            throw new Error('Không nhận được kết quả hợp lệ từ API');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        songSuggestion.innerHTML = `
            <div class="song-info-item">
                <span class="material-icons">error</span>
                <div class="song-info-content">
                    <div class="song-title">Có lỗi xảy ra: ${error.message}</div>
                    <div class="song-artist">Vui lòng thử lại sau</div>
                </div>
            </div>
        `;
    } finally {
        getSongBtn.disabled = false;
    }
}

// Thêm hiệu ứng loading khi bấm nút
getSongBtn.addEventListener('click', () => {
    const originalContent = getSongBtn.innerHTML;
    getSongBtn.innerHTML = `
        <span class="material-icons loading">sync</span>
        Đang tải...
    `;
    getSongSuggestion().finally(() => {
        getSongBtn.innerHTML = originalContent;
    });
}); 