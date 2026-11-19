$r = Split-Path $PSScriptRoot -Parent
Add-Type -AssemblyName System.Drawing
function ToUri($path) {
  $img = [System.Drawing.Image]::FromFile($path); $w = 1280; $h = [int]($img.Height * $w / $img.Width)
  $bmp = New-Object System.Drawing.Bitmap $w, $h; $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.DrawImage($img, 0, 0, $w, $h); $g.Dispose(); $img.Dispose()
  $ms = New-Object IO.MemoryStream; $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Jpeg); $bmp.Dispose()
  "data:image/jpeg;base64," + [Convert]::ToBase64String($ms.ToArray())
}
$U = @{}
foreach ($n in "1-ladowanie", "2-ekran-glowny", "3-gra", "4-pauza", "5-ustawienia", "6-mapa-poziomow", "7-jak-grac", "8-koniec-poziomu") { $U[$n] = ToUri "$r\store\ui\$n.png" }

function Pins($list) { ($list | ForEach-Object { "<span class='pin' style='left:$($_[1])%;top:$($_[2])%'>$($_[0])</span>" }) -join "" }
function Legend($items) { "<ol>" + (($items | ForEach-Object { "<li><b>$($_[0])</b> $($_[1])</li>" }) -join "") + "</ol>" }
function Screen($id, $title, $lead, $pins, $legend) {
  "<section class='screen' id='s$id'><div class='shot'><img src='$($U[$id])' alt='$title'>$(Pins $pins)</div><div class='txt'><h3>$title</h3><p class='lead'>$lead</p>$(Legend $legend)</div></section>"
}

$s1 = Screen "1-ladowanie" "1. Ekran ładowania" "Pierwsze, co widzi gracz po dotknięciu ikony gry. Trwa około 2,6 sekundy, a dotknięcie ekranu go pomija." `
  @(@(1, 50, 46), @(2, 50, 64), @(3, 50, 69)) `
  @(@("Logo i nazwa gry:", "od razu wiadomo, co to za gra, wraz z kucharką i potrawami."), @("Pasek ładowania:", "pokazuje, że gra się uruchamia."), @("Napis pod paskiem:", "krótkie komunikaty (&bdquo;Rozpalamy garnki…&rdquo;, &bdquo;Gotowe!&rdquo;)."))
$s2 = Screen "2-ekran-glowny" "2. Ekran główny (menu)" "Tu gracz decyduje, co robić. Jeden duży przycisk do gry, reszta to cztery duże kafelki i ustawienia." `
  @(@(1, 74, 27), @(2, 63, 43), @(3, 86, 43), @(4, 63, 59), @(5, 86, 59), @(6, 74, 72), @(7, 25, 69)) `
  @(@("GRAJ / KONTYNUUJ:", "zaczyna grę albo wraca do ostatniego poziomu."), @("Poziomy:", "mapa wszystkich 50 poziomów."), @("Szkoła:", "8 lekcji gastronomii z quizami."), @("Przepisy:", "książka kucharska, nieodblokowane są zamknięte."), @("Jak grać:", "obrazkowa instrukcja w 5 krokach."), @("Ustawienia:", "trudność, dźwięk, muzyka, podpowiedzi, nauka."), @("Pasek stanu:", "ocena restauracji, poziom trudności, poziom i monety."))
$s3 = Screen "3-gra" "3. Panel gry" "Najważniejszy ekran. Wszystko, co jest potrzebne, jest naraz i podpisane, a niepotrzebne rzeczy są przyciemnione." `
  @(@(1, 40, 5), @(2, 30, 36), @(3, 56, 52), @(4, 30, 88), @(5, 80, 22), @(6, 66, 40), @(7, 80, 47), @(8, 80, 63), @(9, 92, 6), @(10, 42, 9.6)) `
  @(@("Pasek górny:", "kucharka z tytułem, monety, ocena ★, czas poziomu i pasek celu."), @("Restauracja:", "klienci stoją w kolejce przy ladzie. Nad głową: zamówienie i licznik, ile jeszcze czekają (do 3 minut)."), @("Jadalnia:", "obsłużeni goście siadają do stołów i jedzą."), @("Kuchnia:", "garnek gotuje, patelnia smaży, piekarnik piecze, mikrofalówka grzeje, zamrażarka mrozi. Właściwe urządzenie ma złotą ramkę."), @("Karta przepisu:", "co zrobić, w jakim urządzeniu i na którym jesteś kroku."), @("Ręka i kosz:", "co teraz trzymasz. Kosz odkłada lub wyrzuca."), @("Zakładki spiżarni:", "warzywa, owoce, mięso, nabiał, spiżarnia. Czerwona kropka pokazuje, gdzie jest potrzebny składnik."), @("Składniki:", "złap i przeciągnij do urządzenia albo dotknij. Potrzebne są na początku listy."), @("❓ 📖 ⏸:", "pomoc, książka kucharska i pauza z menu."), @("Zadanie dnia:", "dodatkowy cel z nagrodą."))
$s4 = Screen "4-pauza" "4. Pauza" "Po dotknięciu ⏸ gra się zatrzymuje. Gracz może wrócić, zajrzeć do ustawień albo wyjść do menu." `
  @(@(1, 51, 52), @(2, 38, 61), @(3, 49, 61), @(4, 60, 61)) `
  @(@("Wróć do gry:", "wznawia dokładnie w tym miejscu."), @("Ustawienia:", "zmiana trudności i dźwięku w trakcie gry."), @("Jak grać:", "przypomnienie instrukcji."), @("Wyjdź do menu:", "kończy bieżący poziom i wraca na ekran główny."))
$s5 = Screen "5-ustawienia" "5. Ustawienia" "Trzy poziomy trudności i proste przełączniki. Każdy może dopasować grę do siebie." `
  @(@(1, 82, 18), @(2, 78, 35), @(3, 78, 43), @(4, 78, 52), @(5, 78, 61), @(6, 78, 69), @(7, 78, 78), @(8, 50, 88)) `
  @(@("Poziom trudności:", "Łatwy (więcej czasu, bez mycia rąk i alergii), Normalny, Trudny (krócej, więcej klientów)."), @("Dźwięki:", "kliknięcia, monety, urządzenia."), @("Muzyka:", "spokojna muzyka w tle."), @("Podpowiedzi:", "pokazuj składniki w zamówieniach."), @("Tryb nauki:", "lekcje i pytanie dnia."), @("Poradnik:", "pokaż pierwszy poradnik jeszcze raz."), @("Postęp w grze:", "reset po dwukrotnym dotknięciu, żeby nie zrobić tego przez przypadek."), @("Gotowe:", "wraca do poprzedniego ekranu."))
$s6 = Screen "6-mapa-poziomow" "6. Mapa poziomów" "50 poziomów w 5 rozdziałach. Gwiazdki pokazują, jak dobrze poszło." `
  @(@(1, 52, 10), @(2, 28, 19), @(3, 27, 26), @(4, 61, 50), @(5, 78, 50)) `
  @(@("Postęp:", "ile poziomów ukończono i do którego jesteś odblokowana."), @("Rozdział:", "Bar mleczny, Restauracja rodzinna, Bistro, Restauracja z gwiazdką, Mistrzostwa kuchni."), @("Poziom z gwiazdkami:", "można go zagrać ponownie, żeby zdobyć więcej gwiazdek."), @("Obecny poziom:", "podświetlony na pomarańczowo."), @("Zamknięte poziomy:", "odblokowują się po zaliczeniu poprzedniego."))
$s7 = Screen "7-jak-grac" "7. Jak grać" "Krótka instrukcja obrazkowa zamiast długiego tekstu. Dostępna z menu i z pauzy." `
  @(@(1, 50, 30), @(2, 50, 52)) `
  @(@("5 kroków obrazkami:", "zobacz zamówienie, chwyć składnik, wrzuć do urządzenia, podaj klientowi, zapłata."), @("Trzy wskazówki:", "czas klienta, idealne dania, zadanie dnia. Z pauzy można też zobaczyć, gdzie co jest."))
$s8 = Screen "8-koniec-poziomu" "8. Koniec poziomu" "Gracz od razu widzi wynik i przycisk, co dalej. Pod spodem są nowe przepisy, opinie gości i sklepik z ulepszeniami." `
  @(@(1, 50, 16), @(2, 50, 26), @(3, 50, 33), @(4, 45, 41), @(5, 58, 41), @(6, 50, 49), @(7, 50, 72)) `
  @(@("Gwiazdki:", "1 do 3 w zależności od zarobku względem celu."), @("Wyniki:", "zarobek, cel, obsłużeni, stracone, ocena, incydenty."), @("Ciekawostka:", "krótka wiedza z gastronomii."), @("Następny poziom:", "największy przycisk, na samej górze."), @("Mapa poziomów:", "wybór innego poziomu."), @("Nowe przepisy:", "co się odblokowało."), @("Opinie gości:", "krótkie komentarze zależne od przebiegu poziomu."))

$html = @"
<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gotuj i Mroź – układ interfejsu i stan prac</title>
<style>
:root{--bg:#fbf3e4;--ink:#2b1a12;--card:#fff;--line:#e8d5b5;--acc:#e8602c;--ok:#2e8b57;--warn:#c2410c;--todo:#6b4428}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,"Segoe UI",Roboto,sans-serif}
header{background:linear-gradient(135deg,#8f3d2d,#5c1f1a);color:#fff3d6;padding:34px max(16px,env(safe-area-inset-left)) 26px}
header h1{margin:0 0 6px;font:900 clamp(28px,5vw,44px)/1.1 Georgia,serif}
header p{margin:0;max-width:760px;opacity:.92}
main{max-width:1180px;margin:0 auto;padding:0 max(16px,env(safe-area-inset-left)) 60px}
h2{font:800 26px/1.2 Georgia,serif;margin:42px 0 12px}
.flow{display:flex;flex-wrap:wrap;gap:8px;align-items:stretch}
.flow .st{flex:1 1 150px;background:var(--card);border:2px solid var(--line);border-radius:14px;padding:12px;min-width:140px}
.flow .st b{display:block;font-size:15px}.flow .st small{color:#6b5a4d}
.flow .ar{align-self:center;font-size:22px;opacity:.5}
.screen{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:22px;align-items:start;margin:26px 0;background:var(--card);border:2px solid var(--line);border-radius:18px;padding:16px}
@media(max-width:860px){.screen{grid-template-columns:1fr}}
.shot{position:relative;border-radius:12px;overflow:hidden;border:1px solid var(--line)}
.shot img{display:block;width:100%;height:auto}
.pin{position:absolute;transform:translate(-50%,-50%);width:26px;height:26px;border-radius:50%;background:var(--acc);color:#fff;font-weight:900;font-size:13px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.5)}
.txt h3{margin:0 0 4px;font:800 22px Georgia,serif}.lead{margin:0 0 10px;color:#5b463a}
.txt ol{margin:0;padding-left:22px}.txt li{margin:4px 0}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}
.box{background:var(--card);border:2px solid var(--line);border-radius:16px;padding:14px 16px}
.box h3{margin:0 0 8px;font:800 19px Georgia,serif}
.box ul{margin:0;padding:0;list-style:none}.box li{padding:5px 0 5px 28px;position:relative;border-bottom:1px dashed var(--line)}.box li:last-child{border:0}
.box li::before{position:absolute;left:0;top:5px}
.done li::before{content:"✅"}.todo li::before{content:"🔲"}.warn li::before{content:"⚠️"}
.warn li small{display:block;color:#6b5a4d}
.note{background:#fff0c9;border-radius:12px;padding:10px 14px;margin:12px 0;font-size:14px}
footer{text-align:center;color:#8a6a55;font-size:13px;padding:20px}
</style></head><body>
<header><h1>Gotuj i Mroź</h1><p>Układ interfejsu, przebieg uruchomienia gry i stan prac. Numerowane kropki na zrzutach pokazują, co jest czym. Zrzuty pochodzą z działającej gry.</p></header>
<main>
<h2>Jak wygląda uruchomienie gry</h2>
<div class="flow">
<div class="st"><b>1. Ikona</b><small>gracz dotyka ikony na telefonie</small></div><span class="ar">➜</span>
<div class="st"><b>2. Ekran ładowania</b><small>logo, nazwa, pasek, ok. 2,6 s</small></div><span class="ar">➜</span>
<div class="st"><b>3. Ekran główny</b><small>Graj, Poziomy, Szkoła, Przepisy, Jak grać, Ustawienia</small></div><span class="ar">➜</span>
<div class="st"><b>4. Pierwszy poziom</b><small>poradnik krok po kroku (omlet)</small></div><span class="ar">➜</span>
<div class="st"><b>5. Gra</b><small>panel gry, pauza w każdej chwili</small></div><span class="ar">➜</span>
<div class="st"><b>6. Koniec poziomu</b><small>gwiazdki, wynik, następny poziom, mapa</small></div>
</div>
<div class="note">Gra zapamiętuje poziom, gwiazdki, ustawienia i ulepszenia na telefonie. Po ponownym uruchomieniu wraca na ekran główny z przyciskiem &bdquo;Kontynuuj&rdquo;.</div>
<h2>Ekrany</h2>
$s1$s2$s3$s4$s5$s6$s7$s8
<h2>Co jest zrobione, a co nie</h2>
<div class="cols">
<div class="box done"><h3>Zrobione</h3><ul>
<li>Ekran ładowania z logo i paskiem</li><li>Ekran główny z dużym przyciskiem Graj</li><li>50 poziomów w 5 rozdziałach i mapa z gwiazdkami</li>
<li>Trzy poziomy trudności: Łatwy, Normalny, Trudny</li><li>Pauza i ustawienia (dźwięk, muzyka, podpowiedzi, nauka, reset)</li>
<li>Panel gry: klienci, jadalnia ze stołami, 5 narysowanych urządzeń, karta przepisu, spiżarnia</li>
<li>Poradnik pierwszego zamówienia i obrazkowa instrukcja</li><li>72 przepisy, 46 składników, własne dania</li>
<li>Przeciąganie lub dotykanie, animowana ręka z podpowiedzią</li><li>Zadania dnia, godzina szczytu i happy hour, monety i konfetti</li>
<li>Szkoła gastronomii: 8 lekcji z quizami</li><li>Zapis postępu na telefonie</li>
<li>Plik AAB do Google Play, zrzuty ekranu, grafika funkcji, opis i polityka prywatności</li></ul></div>
<div class="box todo"><h3>Jeszcze nie zrobione albo ograniczone</h3><ul>
<li>Publikacja w Google Play: konto czeka na weryfikację tożsamości, status przedsiębiorcy i telefon (to zrobi właścicielka konta)</li>
<li>Test na prawdziwych telefonach i tabletach (gra była sprawdzana w przeglądarce)</li>
<li>Możliwy test zamknięty (12 testerów przez 14 dni) dla konta prywatnego</li>
<li>Grafika: jedzenie to emoji, a postaci i tło są rysowane kodem, bez ilustracji od grafika</li>
<li>Muzyka i dźwięki są proste, bez lektora i bez nagranych efektów</li>
<li>Tylko język polski</li><li>Brak osiągnięć, rankingu i zapisu w chmurze</li>
<li>Poziomy 22–50: trudność jest szacowana, trzeba ją dostroić po grach testerów</li></ul></div>
</div>
<h2>Co użytkownik może marudzić (i co z tym zrobić)</h2>
<div class="box warn"><ul>
<li>&bdquo;Za dużo rzeczy naraz na małym ekranie&rdquo;<small>Napisy i ikony są małe na telefonach z ekranem poniżej 6 cali. Można dodać tryb dużych przycisków.</small></li>
<li>&bdquo;Przeciąganie nie działa&rdquo;<small>Na dotyku trzeba chwilę przytrzymać, zanim zaczniesz przeciągać. Zwykłe dotknięcie działa zawsze, ale warto to powiedzieć w poradniku.</small></li>
<li>&bdquo;Nie wiem, co robić po poradniku&rdquo;<small>Poradnik jest jeden, ale przycisk ❓ pokazuje instrukcję i gdzie co jest. Można dodać krótkie podpowiedzi przy pierwszych poziomach.</small></li>
<li>&bdquo;Za trudne na wyższych poziomach&rdquo;<small>Jest poziom Łatwy. Poziomy 22–50 wymagają testów graczy i dostrojenia.</small></li>
<li>&bdquo;Mycie rąk i alergie mnie denerwują&rdquo;<small>Działają tylko na poziomie Normalnym i Trudnym, a Tryb nauki można wyłączyć w ustawieniach.</small></li>
<li>&bdquo;Emoji wyglądają inaczej niż na zrzutach&rdquo;<small>Na starszych Androidach ikony jedzenia będą wyglądać inaczej. Pełne rysunki rozwiązałyby ten problem.</small></li>
<li>&bdquo;Muzyka jest monotonna&rdquo;<small>Muzyka jest generowana. Można ją wyłączyć w ustawieniach.</small></li>
<li>&bdquo;Zgubiłam postęp po odinstalowaniu&rdquo;<small>Zapis jest tylko na telefonie. Zapis w chmurze to osobna, większa funkcja.</small></li>
</ul></div>
</main><footer>Gotuj i Mroź · wersja 1.0 · plansza interfejsu</footer></body></html>
"@
[IO.File]::WriteAllText("$r\store\interfejs.html", $html, (New-Object Text.UTF8Encoding $false))
(Get-Item "$r\store\interfejs.html").Length
