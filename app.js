// Thay GEMINI_API_KEY bằng API key của bạn
const API_KEY = 'AIzaSyAcVFMSkAQB0fEt6_dEjOFNdqj7V8_ZXc4';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const getSongBtn = document.getElementById('getSongBtn');
const songSuggestion = document.getElementById('songSuggestion');

function createSongInfoItem(icon, text) {
    return `
        <div class="song-info-item">
            <span class="material-icons">${icon}</span>
            ${text}
        </div>
    `;
}

function formatSongSuggestion(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    let html = '';

    lines.forEach(line => {
        if (line.startsWith('Tên bài hát:')) {
            html += createSongInfoItem('music_note', line);
        } else if (line.startsWith('Ca sĩ:')) {
            html += createSongInfoItem('person', line);
        } else if (line.startsWith('Thể loại:')) {
            html += createSongInfoItem('category', line);
        } else if (line.startsWith('Năm phát hành:')) {
            html += createSongInfoItem('calendar_today', line);
        } else if (line.startsWith('Lý do đề xuất:')) {
            html += createSongInfoItem('lightbulb', line);
        }
    });

    return html;
}

async function getSongSuggestion() {
    try {
        getSongBtn.disabled = true;
        songSuggestion.innerHTML = createSongInfoItem('hourglass_empty', 'Đang tìm kiếm bài hát phù hợp...');

        const prompt = `Hãy đề xuất một bài hát ngẫu nhiên bằng tiếng Việt. Trả về theo định dạng:
        Tên bài hát: [tên]
        Ca sĩ: [ca sĩ]
        Thể loại: [thể loại]
        Năm phát hành: [năm]
        Lý do đề xuất: [lý do ngắn gọn]`;

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
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Không thể kết nối với API');
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const suggestion = data.candidates[0].content.parts[0].text;
            songSuggestion.style.opacity = '0';
            setTimeout(() => {
                songSuggestion.innerHTML = formatSongSuggestion(suggestion);
                songSuggestion.style.opacity = '1';
            }, 200);
        } else {
            throw new Error('Không nhận được kết quả hợp lệ từ API');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        songSuggestion.innerHTML = createSongInfoItem('error', 'Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
        getSongBtn.disabled = false;
    }
}

// Thêm hiệu ứng loading khi bấm nút
getSongBtn.addEventListener('click', () => {
    const originalContent = getSongBtn.innerHTML;
    getSongBtn.innerHTML = `
        <span class="material-icons loading">sync</span>
        Đang tìm...
    `;
    getSongSuggestion().finally(() => {
        getSongBtn.innerHTML = originalContent;
    });
}); 