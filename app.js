// Thay GEMINI_API_KEY bằng API key của bạn
const API_KEY = 'AIzaSyCpc730Drp4OOil3NjIElCqpjX3vpo2JtM';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const getSongBtn = document.getElementById('getSongBtn');
const songSuggestion = document.getElementById('songSuggestion');

function createSongItem(rank, songInfo, category) {
    return `
        <div class="song-info-item ${category.replace('/', '\\/')}">
            <div class="song-info-rank">${rank}</div>
            <div class="song-info-content">
                <div class="song-category">${category}</div>
                <div class="song-title">${songInfo.title}</div>
                <div class="song-artist">${songInfo.artist}</div>
                <div class="song-lyrics">${songInfo.chorus}</div>
            </div>
        </div>
    `;
}

function formatSongList(response) {
    try {
        // Lấy nội dung JSON từ response
        const content = response.candidates[0].content.parts[0].text;
        
        // Tìm và trích xuất phần JSON từ nội dung
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
        if (!jsonMatch) {
            throw new Error('Không tìm thấy JSON trong response');
        }
        
        const songData = JSON.parse(jsonMatch[1]);
        let formattedHtml = '';
        
        // Xử lý từng thể loại
        for (const [category, songs] of Object.entries(songData)) {
            formattedHtml += `<div class="category-title">${category}</div>`;
            songs.forEach((song, index) => {
                formattedHtml += createSongItem(index + 1, song, category);
            });
        }
        
        return formattedHtml;
    } catch (error) {
        console.error('Lỗi khi xử lý dữ liệu:', error);
        return '<div class="song-info-item"><div class="song-info-content"><div class="song-title">Có lỗi xảy ra khi tải danh sách bài hát</div></div></div>';
    }
}

async function getSongSuggestion() {
    const button = document.getElementById('getSongBtn');
    const resultDiv = document.getElementById('songSuggestion');
    
    try {
        button.disabled = true;
        button.innerHTML = '<div class="loading-spinner"></div>';
        resultDiv.innerHTML = '<div class="song-info-item"><div class="song-info-content"><div class="song-title">Đang tải danh sách...</div></div></div>';

// Generate random month (1-12)
const monthNumber = Math.floor(Math.random() * 12) + 1;

// Month names array in Vietnamese
const monthNames = ["tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6", "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12"];
const monthName = monthNames[monthNumber - 1]; // Array index is 0-based

// Generate random year (2020-2024)
const year = Math.floor(Math.random() * (2024 - 2020 + 1)) + 2020;

// Construct the modified prompt using template literals
const prompt = `Vui lòng cung cấp danh sách 10 bài hát karaoke phổ biến nhất trong ${monthName}/${year} cho mỗi thể loại (Nhạc Trẻ, Nhạc Trữ Tình/Bolero, Nhạc Remix). Mỗi bài hát cần có tên, ca sĩ và  **2 câu đầu bài hát**. Trả về kết quả dưới dạng JSON với cấu trúc như sau:
{
    "Nhạc Trẻ": [{"title": "", "artist": "", "chorus": ""}],
    "Nhạc Trữ Tình/Bolero": [{"title": "", "artist": "", "chorus": ""}],
    "Nhạc Remix": [{"title": "", "artist": "", "chorus": ""}]
}`;

console.log(prompt); // To see the generated prompt
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        resultDiv.innerHTML = formatSongList(data);
    } catch (error) {
        console.error('Error:', error);
        resultDiv.innerHTML = `
            <div class="song-info-item">
                <div class="song-info-content">
                    <div class="song-title">Có lỗi xảy ra</div>
                    <div class="song-artist">Vui lòng thử lại sau</div>
                </div>
            </div>
        `;
    } finally {
        button.disabled = false;
        button.innerHTML = '<span class="material-icons">auto_awesome</span>Xem danh sách';
    }
}

// Thêm hiệu ứng loading khi bấm nút
getSongBtn.addEventListener('click', getSongSuggestion); 