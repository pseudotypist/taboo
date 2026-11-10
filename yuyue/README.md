# 于悦 için küçük sürpriz

Bu klasör oyundan bağımsızdır. HTML, CSS ve JavaScript ile hazırlanmıştır;
kurulum, npm veya derleme gerektirmez.

Tabu ana ekranındaki kalpli düğme bu sürprize bağlıdır. Düğmeye basınca
`../yuyue/?open=1` açılır ve doğrudan “Gerçekten sen misin?” onayı gelir.
Buradaki ilk düğmeye ayrıca tekrar basmak gerekmez. Sürprizin normal adresi
doğrudan açılırsa zarf ve ilk düğme de gösterilir.

## Düzenlemek

**Metinleri ve doğru cevabı `settings.js` dosyasından değiştir.**

```javascript
recipientName: "于悦",              // Sevgilinin adı
correctAnswer: "erdem",            // Doğru kabul edilecek cevap
finalMessage: "love you, beautiful!", // Son ekranda kalacak mesaj
signature: "Erdem",                // Mesajın altındaki imza
```

`copy` bölümünde buton, soru ve uyarıların tamamı bulunur. `{name}` yazan
yerlere isim otomatik olarak eklenir. Metinleri tırnakların içinde değiştir;
satır sonundaki virgülleri koru. `\n`, başlıkta yeni satır anlamına gelir.
Tabu ana ekranındaki düğme de aynı `recipientName` ve `copy.openButton`
ayarlarını kullanır; adı veya düğme metnini buradan değiştirmen yeterlidir.

`theme` bölümünden ana renkleri, `hearts` bölümünden kalp sayısını ve yağmurun
süresini ayarlayabilirsin. Daha ayrıntılı görünüm değişiklikleri `style.css`
dosyasında; sayfanın yapısı `index.html`, davranışı `app.js` içindedir.

## Akış

1. “Eğer sen 于悦 isen buraya tıkla” yazan kalpli buton.
2. “Gerçekten sen misin?” sorusu ve “Evet, benim” butonu.
3. “O zaman bana kanıtla” başlığı ve “Dünyanın en yakışıklı erkeğinin ismi nedir?” sorusu.
4. `erdem` cevabıyla kalp yağmuru ve İngilizce final mesajı.

Son mesaj, kalp yağmuru bittikten sonra ekranda kalır. İlk üç adım Çince'dir.
Yanlış ve boş cevaplar için de Çince mesajlar gösterilir. `Erdem`, `ERDEM` ve
başında/sonunda boşluk bulunan cevaplar kabul edilir. Enter tuşuyla da cevap verilebilir.

## Bilgisayarda açmak

`index.html` dosyasına çift tıklayabilirsin. Dört site dosyasını aynı klasörde
tut: `index.html`, `settings.js`, `style.css` ve `app.js`.

## GitHub Pages

Klasör deponun ana dizinindeki `yuyue/` konumunda durur. Mevcut Pages ayarları
(`main` ve `/ (root)`) yeterlidir. Adres:

https://pseudotypist.github.io/taboo/yuyue/

Değişiklik yaptıktan sonra ilgili dosyayı GitHub'daki `yuyue/` klasörüne aynı
adla yükle ve kaydet. GitHub Pages yeni sürümü yayımlar. Mac'te eski görünüm
kalırsa `Command + Shift + R` ile yenile.
