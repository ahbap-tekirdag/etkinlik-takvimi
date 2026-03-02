// Global değişkenler
let config = null;
let events = {};
let currentEventId = null;

// Gün isimleri
const gunIsimleri = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

// URL parametresinden ay bilgisini al
function getAyFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const ay = urlParams.get('ay');
    // Varsayılan olarak şubat
    return ay || '2026-subat';
}

// Config dosyasını yükle
async function loadConfig() {
    try {
        const ay = getAyFromUrl();
        const response = await fetch(`data/${ay}.json`);
        if (!response.ok) {
            throw new Error(`${ay}.json bulunamadı`);
        }
        config = await response.json();
        initializeApp();
    } catch (error) {
        console.error('Config yüklenemedi:', error);
        const gridElement = document.getElementById('calendar-grid');
        if (gridElement) {
            gridElement.innerHTML = '<p style="color: red; padding: 20px; grid-column: 1/-1;">Config dosyası yüklenemedi! URL parametresini kontrol edin: ?ay=2026-mart</p>';
        }
    }
}

// Uygulamayı başlat
function initializeApp() {
    // Sayfa başlığı
    document.getElementById('pageTitle').textContent = `Ahbap ${config.sehir} - ${config.ay} ${config.yil} Etkinlik Takvimi`;

    // Header
    document.getElementById('headerTitle').textContent = `${config.sehir} - ${config.ay} ${config.yil} Etkinlik Takvimi`;
    document.getElementById('headerSlogan').textContent = config.slogan;

    // Ay badge
    document.getElementById('monthBadge').textContent = `${config.ay} ${config.yil}`;

    // Aktif ay seçicisini highlight et
    const currentAy = getAyFromUrl();
    document.querySelectorAll('.month-link').forEach(link => {
        const linkAy = new URL(link.href).searchParams.get('ay');
        if (linkAy === currentAy) {
            link.classList.add('active');
        }
    });

    // PDF link
    const pdfLink = document.getElementById('pdfLink');
    if (config.pdfDosyasi) {
        pdfLink.href = config.pdfDosyasi;
        pdfLink.download = `Ahbap-${config.ay}-${config.yil}-Takvim.pdf`;
        pdfLink.style.display = 'flex';
    } else {
        pdfLink.style.display = 'none';
    }

    // Footer
    document.getElementById('footerText').textContent = config.footer;

    // Etkinlikleri events objesine dönüştür
    config.etkinlikler.forEach(etkinlik => {
        const gunStr = String(etkinlik.gun).padStart(2, '0');
        const ayNumarasi = ayiNumarayaCevir(config.ay);
        const calendarDate = `${config.yil}${ayNumarasi}${gunStr}`;
        const gunIsmi = getGunIsmi(etkinlik.gun);

        events[etkinlik.id] = {
            title: `${etkinlik.icon} ${etkinlik.baslik}`,
            date: `${etkinlik.gun} ${config.ay} ${config.yil} - ${gunIsmi}`,
            calendarDate: calendarDate,
            desc: etkinlik.detay,
            gif: etkinlik.gif
        };
    });

    // Takvimi oluştur
    buildCalendar();

    // Touch desteği ekle
    setupTouchSupport();
}

// Ay ismini numaraya çevir
function ayiNumarayaCevir(ay) {
    const aylar = {
        'Ocak': '01', 'Şubat': '02', 'Mart': '03', 'Nisan': '04',
        'Mayıs': '05', 'Haziran': '06', 'Temmuz': '07', 'Ağustos': '08',
        'Eylül': '09', 'Ekim': '10', 'Kasım': '11', 'Aralık': '12'
    };
    return aylar[ay] || '01';
}

// Günün ismini al
function getGunIsmi(gun) {
    // ayinIlkGunu: 1=Pazartesi, 7=Pazar
    const ilkGunIndex = config.ayinIlkGunu - 1; // 0-based index
    const gunIndex = (ilkGunIndex + gun - 1) % 7;
    return gunIsimleri[gunIndex];
}

// Takvimi oluştur
function buildCalendar() {
    const container = document.getElementById('calendarDays');
    container.innerHTML = '';

    // Ayın ilk gününden önceki boş günler
    const boslukSayisi = config.ayinIlkGunu - 1; // Pazartesi=1, yani 0 boşluk; Pazar=7, yani 6 boşluk

    for (let i = 0; i < boslukSayisi; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        container.appendChild(emptyDay);
    }

    // Etkinlikleri gün bazında indexle
    const etkinlikMap = {};
    config.etkinlikler.forEach(etkinlik => {
        etkinlikMap[etkinlik.gun] = etkinlik;
    });

    // Ayın günleri
    for (let gun = 1; gun <= config.ayinGunSayisi; gun++) {
        const dayDiv = document.createElement('div');
        const gunIndex = (boslukSayisi + gun - 1) % 7;

        // Cumartesi (5) veya Pazar (6) kontrolü
        let dayClass = 'day';
        if (gunIndex === 5) dayClass += ' saturday';
        if (gunIndex === 6) dayClass += ' sunday';

        const etkinlik = etkinlikMap[gun];
        if (etkinlik) {
            dayClass += ' has-event';
        }

        dayDiv.className = dayClass;

        // Gün numarası
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = gun;
        dayDiv.appendChild(dayNumber);

        // Etkinlik varsa ekle
        if (etkinlik) {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.onclick = () => openModal(etkinlik.id);

            eventDiv.innerHTML = `
                <div class="event-title"><span class="event-icon">${etkinlik.icon}</span> ${etkinlik.baslik}</div>
                <div class="event-desc">${etkinlik.kisa}</div>
            `;

            dayDiv.appendChild(eventDiv);
        }

        container.appendChild(dayDiv);
    }

    // Ay sonundaki boş günler (7'nin katına tamamla)
    const toplamGun = boslukSayisi + config.ayinGunSayisi;
    const kalanBosluk = (7 - (toplamGun % 7)) % 7;

    for (let i = 0; i < kalanBosluk; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'day empty';
        container.appendChild(emptyDay);
    }
}

// Touch desteği
function setupTouchSupport() {
    document.querySelectorAll('.event').forEach(el => {
        el.addEventListener('touchend', function(e) {
            e.preventDefault();
            const onclickAttr = this.getAttribute('onclick');
            if (onclickAttr) {
                const match = onclickAttr.match(/openModal\('(\w+)'\)/);
                if (match) {
                    openModal(match[1]);
                }
            }
        });
    });

    document.getElementById('modalOverlay').addEventListener('touchend', function(e) {
        if (e.target === this) closeModal();
    });

    document.querySelector('.modal-close').addEventListener('touchend', function(e) {
        e.preventDefault();
        closeModal();
    });
}

// Modal fonksiyonları
function openModal(eventId) {
    currentEventId = eventId;
    const event = events[eventId];
    document.getElementById('modalTitle').textContent = event.title;
    document.getElementById('modalDate').textContent = event.date;
    document.getElementById('modalDesc').textContent = event.desc;

    const animDiv = document.getElementById('modalAnimation');
    animDiv.innerHTML = event.gif ? `<div class="modal-gif"><img src="${event.gif}" alt="Etkinlik animasyonu"></div>` : '';

    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(e) {
    if (!e || e.target === document.getElementById('modalOverlay')) {
        document.getElementById('modalOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Google Calendar'a ekle
function addToGoogleCalendar() {
    if (!currentEventId) return;
    const event = events[currentEventId];
    const title = encodeURIComponent(event.title.replace(/[^\w\sığüşöçİĞÜŞÖÇ&-]/g, ''));
    const details = encodeURIComponent(event.desc);
    const location = encodeURIComponent(config.konum);
    const startDate = event.calendarDate;
    const endDate = event.calendarDate;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
    window.open(url, '_blank');
}

// Tüm etkinlikleri takvime ekle (.ics dosyası)
function addAllToCalendar() {
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Ahbap ${config.sehir}//${config.ay} ${config.yil} Etkinlikleri//TR
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

    Object.values(events).forEach(event => {
        const title = event.title.replace(/[^\w\sığüşöçİĞÜŞÖÇ&-]/g, '').trim();
        const desc = event.desc.replace(/\n/g, '\\n');
        icsContent += `BEGIN:VEVENT
DTSTART;VALUE=DATE:${event.calendarDate}
DTEND;VALUE=DATE:${event.calendarDate}
SUMMARY:${title}
DESCRIPTION:${desc}
LOCATION:${config.konum}
END:VEVENT
`;
    });

    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Ahbap-${config.ay}-${config.yil}-Etkinlikler.ics`;
    link.click();
    URL.revokeObjectURL(link.href);
}

// Event listeners
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// Sayfa yüklendiğinde config'i yükle
document.addEventListener('DOMContentLoaded', loadConfig);
