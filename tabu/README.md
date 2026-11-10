# Tabu

İngilizce, Türkçe ve Çince oynanan tabu oyunu. Tek sayfalık bir web uygulaması: iPhone'da Safari ile açılır, "Ana Ekrana Ekle" ile uygulama gibi kullanılır ve internetsiz çalışır.

12 kategoride 50'şer kart, toplam **600 kart** bulunur. Çince ana kelimelerin ve
beş yasak kelimenin tamamında ton işaretli pinyin gösterilir. Diğer dillerde
oynarken Çince çevirisi açılırsa ana kelimenin pinyin okunuşu da görünür.

Ana menüde 于悦 için kalpli bir sürpriz düğmesi de vardır. Sürpriz dosyaları
deponun ayrı `yuyue/` klasöründedir. İsim, cevap ve mesajlar `yuyue/settings.js`
dosyasından düzenlenir; ana menüdeki düğme de aynı ayarları kullanır.

## Bilgisayarda çalıştırma

```bash
python3 -m http.server 8765
```

Sonra tarayıcıda `http://localhost:8765` adresini aç. Dosyaya çift tıklayarak açmak yerine sunucu kullan; offline desteği ancak böyle çalışır.

## iPhone'a kurma

1. Klasörü HTTPS üzerinden yayınla (örneğin GitHub Pages).
2. Adresi iPhone'da Safari ile aç.
3. Paylaş düğmesi → "Ana Ekrana Ekle".
4. Uygulamayı internet varken bir kez aç; sonrasında internetsiz de açılır.

## Kart ekleme ve düzeltme

Kartlar `data/` klasöründe, kategori başına bir dosyada durur. Her satır bir karttır:

```
SEVİYE|english,5 taboo words|türkçe,5 yasak kelime|中文,5个禁词|pinyin,5 taboo readings
```

- Alanlar `|` ile, kelimeler `,` ile ayrılır. Her dilde tam 6 öğe olmalı: ana kelime ve 5 yasak kelime.
- Beşinci sütunda Çince ana kelimenin ve beş yasak kelimenin pinyin karşılıkları aynı sırayla yer alır. Tonlar işaretle yazılır; heceler boşlukla ayrılır. Nötr ton işaretsizdir. `一` ve `不` için sözlük tonları (`yī`, `bù`) kullanılır; konuşma sırasında oluşan ton değişimleri gösterilmez.
- Eski dört sütunlu satırlar da okunabilir; bu satırlardaki kartlarda pinyin gösterilmez.
- Üç dildeki ana kelime aynı kavram olmalı, çünkü oyunda birbirinin çevirisi olarak gösterilir. Yasak kelimelerin birebir çeviri olması gerekmez.
- Seviye A1, A2, B1 veya B2 olur. Başına `=` konursa (örneğin `=B1`) elle sabitlenmiş demektir.

Değişiklikten sonra kart dosyasını yeniden üret:

```bash
node tools/build-cards.mjs
```

Komuta CEFR-J kelime listesinin CSV dosyasının yolu verilirse, sabitlenmemiş kartların seviyesi o listeden yeniden okunur.

Yeni sürümü yayınlamadan önce telefonun eski dosyaları tutmaması için `sw.js` içindeki `CACHE` adını değiştir (örneğin `tabu-v2`).

Site `data/*.txt` dosyalarını doğrudan okumaz; üretilmiş `cards.js` dosyasını
yükler. Veri değişiklikleriyle birlikte yeni `cards.js` dosyası da GitHub'a
yüklenmelidir. Üretilmiş oyun dosyaları GitHub Pages üzerinde ayrıca derleme gerektirmeden çalışır.

## Kaynak

Mevcut İngilizce seviye etiketlerinin kaynağı: The CEFR-J Wordlist Version 1.5,
compiled by Yukio Tono, Tokyo University of Foreign Studies. Yeni kartlarda
yaklaşık A1–B2 seviyeleri kullanılmıştır; Çince için HSK etiketi verilmemiştir.
