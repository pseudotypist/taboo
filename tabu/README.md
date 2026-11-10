# Tabu

İngilizce, Türkçe ve Çince oynanan tabu oyunu. Tek sayfalık bir web uygulaması: iPhone'da Safari ile açılır, "Ana Ekrana Ekle" ile uygulama gibi kullanılır ve internetsiz çalışır.

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
SEVİYE|english,5 taboo words|türkçe,5 yasak kelime|中文,5个禁词
```

- Alanlar `|` ile, kelimeler `,` ile ayrılır. Her dilde tam 6 öğe olmalı: ana kelime ve 5 yasak kelime.
- Üç dildeki ana kelime aynı kavram olmalı, çünkü oyunda birbirinin çevirisi olarak gösterilir. Yasak kelimelerin birebir çeviri olması gerekmez.
- Seviye A1, A2, B1 veya B2 olur. Başına `=` konursa (örneğin `=B1`) elle sabitlenmiş demektir.

Değişiklikten sonra kart dosyasını yeniden üret:

```bash
node tools/build-cards.mjs
```

Komuta CEFR-J kelime listesinin CSV dosyasının yolu verilirse, sabitlenmemiş kartların seviyesi o listeden yeniden okunur.

Yeni sürümü yayınladıktan sonra telefonun eski dosyaları tutmaması için `sw.js` içindeki `CACHE` adını değiştir (örneğin `tabu-v2`).

## Kaynak

İngilizce kelime seviyeleri: The CEFR-J Wordlist Version 1.5, compiled by Yukio Tono, Tokyo University of Foreign Studies.
