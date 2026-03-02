# Ahbap Etkinlik Takvimi - Kullanım Kılavuzu

Bu takvim sistemi, farklı Ahbap şehir gruplarının kolayca kullanabilmesi için tasarlanmıştır. Kod bilgisi gerektirmez, sadece aylık JSON dosyalarını düzenlemeniz yeterlidir.

---

## Hızlı Başlangıç

1. Bu repoyu kendi GitHub hesabınıza **fork** edin
2. `data/` klasöründeki ay dosyalarını düzenleyin (örn: `2026-mart.json`)
3. GitHub Pages'i etkinleştirin
4. Takvim siteniz hazır!

---

## Yeni Sistem: Aylık Dosyalar

Artık her ay için ayrı bir JSON dosyası var. Bu sayede:
- Farklı ayları kolayca yönetebilirsiniz
- Geçmiş ve gelecek ayları arşivleyebilirsiniz
- Takvim otomatik olarak bugünün ayını açar
- Ok tuşları ile aylar arası geçiş yapabilirsiniz

### Dosya İsimlendirme

Format: `YILI-AY.json`

Örnekler:
- `2026-ocak.json`
- `2026-subat.json`
- `2026-mart.json`

**Önemli:** Türkçe karakterler kullanmayın (ö→o, ü→u, ş→s, ç→c)

---

## Ay Dosyasını Düzenleme

Her ay dosyası şu yapıya sahiptir:

```json
{
  "sehir": "Çanakkale",
  "ay": "Mart",
  "yil": 2026,
  "ayinIlkGunu": 7,
  "ayinGunSayisi": 31,
  "footer": "Ahbap Çanakkale Gönüllüleri",
  "slogan": "Sevginin ve gerçeğin peşindeyiz",
  "pdfDosyasi": "mart-takvim.pdf",
  "konum": "Çanakkale",
  "ozelGunler": [
    {
      "gun": 8,
      "tur": "ozel",
      "baslik": "Kadınlar Günü",
      "emoji": "👩",
      "renk": "#e91e63"
    }
  ],
  "etkinlikler": [
    {
      "id": "piknik",
      "gun": 15,
      "icon": "🧺",
      "baslik": "Bahar Pikniği",
      "kisa": "Doğayla iç içe bir gün",
      "detay": "Aileler ve çocuklarla birlikte parkta piknik yapacağız.",
      "gif": "https://media.giphy.com/..."
    }
  ]
}
```

### Gün Numaraları Tablosu

| Gün | Numara |
|-----|--------|
| Pazartesi | 1 |
| Salı | 2 |
| Çarşamba | 3 |
| Perşembe | 4 |
| Cuma | 5 |
| Cumartesi | 6 |
| Pazar | 7 |

**Örnek:** Mart 2026'nın 1'i Pazar günü başlıyor → `"ayinIlkGunu": 7`

---

## Özel Günler Ekleme

Resmi tatiller, özel günler vb. için `ozelGunler` dizisini kullanın:

```json
"ozelGunler": [
  {
    "gun": 23,
    "tur": "resmi",
    "baslik": "23 Nisan",
    "emoji": "🎈",
    "renk": "#e74c3c"
  },
  {
    "gun": 14,
    "tur": "ozel",
    "baslik": "Sevgililer Günü",
    "emoji": "💕",
    "renk": "#ff6b9d"
  }
]
```

**Özellikler:**
- `tur`: "resmi" veya "ozel"
- `renk`: HTML renk kodu (hex format)
- Takvimde sağ üst köşede ince italic yazı olarak görünür
- Mobilde sadece emoji, tablette kısaltma, masaüstünde tam metin gösterilir

---

## Etkinlik Ekleme

```json
"etkinlikler": [
  {
    "id": "piknik",
    "gun": 15,
    "icon": "🧺",
    "baslik": "Bahar Pikniği",
    "kisa": "Doğayla iç içe bir gün",
    "detay": "Aileler ve çocuklarla birlikte parkta piknik yapacağız. Herkes yanında yiyecek getirebilir.",
    "gif": "https://media.giphy.com/..."
  }
]
```

**Alanlar:**
- `id`: Benzersiz kimlik (Türkçe karakter yok)
- `gun`: Ayın kaçıncı günü
- `icon`: Emoji
- `baslik`: Etkinlik adı
- `kisa`: Takvimde görünen kısa açıklama
- `detay`: Modal'da görünen detaylı açıklama (çoklu satır için `\n` kullanın)
- `gif`: Opsiyonel - Giphy veya benzeri GIF linki

---

## PDF Dosyası

Her ay için farklı PDF ekleyebilirsiniz:

1. PDF dosyanızı ana klasöre yükleyin (örn: `mart-takvim.pdf`)
2. Ay dosyasında `"pdfDosyasi"` alanına yazın
3. PDF buton otomatik görünür

PDF yoksa: `"pdfDosyasi": ""`

---

## Yeni Ay Ekleme

1. `data/` klasöründe yeni dosya oluşturun: `2026-nisan.json`
2. Mevcut bir aydan kopyalayıp düzenleyin
3. Ay bilgilerini güncelleyin
4. Etkinlikleri ekleyin
5. Takvim otomatik olarak bu ayı bulup gösterecek

---

## Dinamik Özellikler

### Otomatik Ay Açma
- Takvim bugünün tarihine göre otomatik olarak ilgili ayı açar
- URL'de `?ay=2026-mart` parametresi ile istediğiniz ayı açabilirsiniz

### Ay Arası Geçiş
- Ok tuşları ile aylar arası geçiş yapın
- Son satırda bir sonraki ayın ilk günleri otomatik gösterilir (etkinlik varsa)

### Responsive Tasarım
- Masaüstü: Tam detaylar
- Tablet: Orta seviye detay
- Mobil: Optimize edilmiş görünüm

### Satır Optimizasyonu
- Takvim sadece gerekli satırları gösterir
- Nisan gibi kısa aylar 5 satır, Mart gibi uzun aylar 6 satır

---

## GitHub Pages ile Yayınlama

1. GitHub'da repo ayarlarına gidin (Settings)
2. Sol menüden "Pages" seçin
3. Source: "Deploy from a branch" seçin
4. Branch: "main" ve "/ (root)" seçin
5. Save'e tıklayın
6. Birkaç dakika içinde siteniz yayında olacak:
   `https://KULLANICI_ADINIZ.github.io/REPO_ADINIZ/`

---

## Sık Kullanılan Emojiler

| Etkinlik Türü | Emoji |
|---------------|-------|
| Kitap/Okuma | 📚 📖 📕 |
| Gönüllü/Tanışma | 🤝 👋 🙋 |
| Hayvan | 🐱 🐕 🐾 |
| El işi/Örgü | 🧶 🪡 ✂️ |
| Oyun/Eğlence | 🎮 🎲 🎯 |
| Yemek | 🍽️ 🥘 ☕ |
| Doğa/Çevre | 🌳 🌻 ♻️ 🌱 |
| Müzik | 🎵 🎸 🎤 |
| Spor | ⚽ 🏃 🚴 |
| Eğitim | 🎓 ✏️ 💡 |
| Özel Günler | 💕 🎈 🌙 🎭 👩 |

---

## Örnek: Tam Bir Ay Dosyası

```json
{
  "sehir": "Çanakkale",
  "ay": "Mart",
  "yil": 2026,
  "ayinIlkGunu": 7,
  "ayinGunSayisi": 31,
  "footer": "Ahbap Çanakkale Gönüllüleri",
  "slogan": "Sevginin ve gerçeğin peşindeyiz",
  "pdfDosyasi": "mart-takvim.pdf",
  "konum": "Çanakkale",
  "ozelGunler": [
    {
      "gun": 8,
      "tur": "ozel",
      "baslik": "Kadınlar Günü",
      "emoji": "👩",
      "renk": "#e91e63"
    },
    {
      "gun": 21,
      "tur": "resmi",
      "baslik": "Nevruz Bayramı",
      "emoji": "🌸",
      "renk": "#4caf50"
    }
  ],
  "etkinlikler": [
    {
      "id": "temizlik",
      "gun": 7,
      "icon": "🌳",
      "baslik": "Çevre Temizliği",
      "kisa": "Sahillerimizi temizleyelim",
      "detay": "Çanakkale sahillerinde çevre temizliği yapacağız. Eldiven ve poşetler bizden!\n\nBuluşma: 10:00 Sahil",
      "gif": "https://media.giphy.com/media/..."
    },
    {
      "id": "cocuk",
      "gun": 14,
      "icon": "🎨",
      "baslik": "Çocuklarla Resim",
      "kisa": "Minik ressamlarla buluşma",
      "detay": "Çocuklarla birlikte resim yapacağız. Tüm malzemeler hazır olacak.",
      "gif": ""
    }
  ]
}
```

---

## İpuçları

1. **Detaylı Açıklamalar:** `detay` alanında `\n` kullanarak satır atlayabilirsiniz
2. **GIF Seçimi:** Giphy'den GIF seçerken "Share" → "Copy GIF Link" kullanın
3. **Renk Seçimi:** HTML renk kodları için [colorhunt.co](https://colorhunt.co) kullanabilirsiniz
4. **Yedekleme:** Her değişiklikten önce dosyanızı yedekleyin
5. **Test Etme:** Değişiklikten sonra mutlaka sitenizi kontrol edin

---

## Sorun Giderme

### Takvim görünmüyor
- JSON dosya adını kontrol edin (Türkçe karakter var mı?)
- JSON formatı doğru mu? (virgüller, tırnaklar)
- Konsol hatalarını kontrol edin (F12)

### Etkinlik görünmüyor
- `gun` değeri doğru mu?
- `etkinlikler` dizisi içinde mi?
- `id` benzersiz mi?

### PDF açılmıyor
- Dosya adı JSON'daki ile aynı mı?
- PDF dosyası yüklendi mi?

---

## Yardım

Sorularınız için:
- Ahbap Tekirdağ ekibine ulaşın
- GitHub'da issue açın: [github.com/ahbap-tekirdag/etkinlik-takvimi](https://github.com/ahbap-tekirdag/etkinlik-takvimi)

---

Sevginin ve gerçeğin peşindeyiz! 💚
