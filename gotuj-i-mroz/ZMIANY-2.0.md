# Gotuj i Mroź 2.0 (versionCode 2) – opis zmian

## Nowe
- **Kreator dań** (ekran główny ▶ Kreator dań): własny przepis = urządzenie + 2–4 składniki + nazwa + ikona + opis. Przykład: „Hot-dog z serem” (przycisk „Wczytaj przykład”). Podgląd na żywo: cena, kalorie (orientacyjnie), alergeny; ostrzeżenie, gdy taki przepis już istnieje.
- **Moje przepisy w grze**: goście zamawiają je (od poziomu 2, ok. 18% zamówień; wyłączane w Ustawieniach), a gra rozpoznaje je przy gotowaniu i płaci cenę przepisu.
- **Książka kucharska**: dotknięcie przepisu pokazuje kalorie, alergeny i składniki; „Zrób własną wersję” (np. z wbudowanego hot-doga); zakładki „⭐ Moje” i „🥫 Produkty”.
- **Karty produktów** (45 składników): kcal/100 g, alergeny, przechowywanie, mrożenie.
- **Udostępnianie**: kod `GM1:…` (kopiuj / „Wyślij…” / wklej i wczytaj). Działa bez internetu i bez uprawnień; nic nie jest wysyłane przez aplikację.
- **3 nowe lekcje** (razem 11): Mrożenie w praktyce, Zdrowy talerz, 14 alergenów w UE; więcej ciekawostek „Czy wiesz”.
- **Zapowiedź poziomu**: cel w zł, progi 1/2/3 gwiazdek, czas, nowe przepisy.
- **Jak grać**: 5 zasad od A do Z + „Powtórz samouczek”; samouczek na końcu podaje cel poziomu.

## Zgodność z Google Play
Bez zmian: offline, bez reklam, zakupów, analityki i nowych uprawnień; dane tylko w localStorage (nowy klucz `gotuj_i_mroz_moje`, klucz postępu `gotuj_i_mroz_v2` bez zmian – postęp z v1 zostaje). Grupa wiekowa 13+ bez zmian. Pole tekstowe kreatora jest czyszczone ze znaków HTML, import kodu jest walidowany (testy).

## Testy
`npm test` – 22 testy (postęp + spójność danych + kreator/import/odporność na złośliwe kody). Sprawdzono ręcznie w przeglądarce (poziom 1 z samouczkiem, poziom 6 z daniem własnym od zamówienia do zapłaty, kreator, import, udostępnianie, widok pionowy i poziomy). Nie sprawdzono na fizycznym telefonie (m.in. schowek/„Wyślij…” w WebView – jest zapasowe ręczne kopiowanie).

## Wydanie (robi właściciel)
1. Klucz: `gotuj-i-mroz/release-keys/` (`upload-keystore.jks` + `keystore.properties`, ten sam klucz co v1, odcisk SHA1 9C:90:EE:9C:…:8D:CD). Nie commitować (jest w .gitignore).
2. `npm ci && npx cap sync android && cd android && gradlew.bat bundleRelease` → `android/app/build/outputs/bundle/release/app-release.aab` (aktualnie versionCode 5, versionName 2.3 – patrz sekcje poniżej).
3. Play Console ▶ test wewnętrzny/zamknięty ▶ nowa wersja ▶ wgraj AAB ▶ notatki: „Kreator własnych dań, karty produktów z kaloriami i przechowywaniem, 3 nowe lekcje, zapowiedź poziomu.”
4. Opcjonalnie dopisz do opisu sklepu: „Kreator dań: wymyśl własny przepis (np. hot-dog) i wymień się kodem ze znajomymi” oraz „11 lekcji”. Opis „8 lekcji” w `store/opis-sklepu.md` jest już nieaktualny.
5. Polityka prywatności: dopisz, że własne przepisy też są zapisywane lokalnie na urządzeniu i że udostępnianie polega na ręcznym skopiowaniu tekstu przez użytkownika.
6. Dopiero po zgodzie: push do GitHuba (repo publiczne – bez `release-keys/`).

## Dopiski przed wydaniem (wersja 2.1, versionCode 3)
- **Sterowanie jednym dotknięciem**: składnik sam trafia do urządzenia z bieżącego zamówienia, gotowe danie samo idzie do klienta; przeciąganie jest opcjonalne (na dotyku wcześniej szybkie przeciągnięcie było po cichu anulowane).
- **Klimat kuchni**: imię szefa kuchni, danie dnia (+50%), kwestie klientów, dźwięki krojenia/skwierczenia/bulgotania, ocena szefa po zmianie.
- **Android**: przycisk „Wstecz” = pauza w grze / zamknięcie okna / w menu ostrzeżenie i dopiero drugi raz wyjście; komunikaty widoczne nad oknami; krótsze podpowiedzi (więcej miejsca na spiżarnię); czerwony pulsujący zegar poniżej 20 s.

## Sklep (do wdrożenia po zalogowaniu w Play Console)
- Nowe zrzuty telefonu (1920×1080, JPEG): `store/play/telefon-v2/` (menu, kolejka i przepis, zapowiedź zmiany, kreator dań x2, własny przepis z kaloriami i alergenami, karta produktu, lekcja o mrożeniu, raport szefa kuchni). Zrobione automatem z gry w emulacji telefonu.
- Nowy opis pełny: `store/opis-sklepu.md` (3398 znaków; kreator dań, 11 lekcji, sterowanie dotykiem, 45 składników).
- Polityka prywatności: dopisać zdanie o własnych przepisach zapisywanych lokalnie i o ręcznym udostępnianiu kodu (zmiana na stronie GitHub Pages wymaga pusha do publicznego repo).

## Wersja 2.2 (versionCode 4) – poprawki znalezione w audycie na prawdziwych dotknięciach
- **Błąd dotyku (istniał od wersji 1):** przycisk „+Nzł” w rogu kafelka składnika przechwytywał dotknięcie środka kafelka (Chrome/WebView przyciągają palec do najbliższego przycisku), więc zamiast wziąć składnik gra go kupowała. Teraz to tylko etykieta ceny; dotknięcie pustego kafelka kupuje automatycznie.
- Układ: pionowy ekran ma wyważone proporcje (klienci i urządzenia widoczne), więcej miejsca na spiżarnię w poziomie, pasek „Ręce wolne” chowa się, gdy nic nie trzymasz, większy przycisk ✖ w urządzeniu.
- Audyt: 9 rozmiarów ekranu (320×568 … 1024×768) bez przepełnień i błędów; test na dotyku przez cały samouczek i kilka zamówień; 47,7 kl./s przy 4× wolniejszym CPU.

## Wersja 2.3 (versionCode 5)
- **Kopia zapasowa / przywracanie** (Ustawienia w menu): cały postęp (poziomy, gwiazdki, monety, ulepszenia, lekcje, imię) i własne przepisy jako kod `GM2:…`. Działa bez internetu i bez serwera, więc deklaracje Play (brak zbierania danych, offline) zostają bez zmian. Pozwala przenieść grę na nowy telefon albo ją odzyskać po reinstalacji.
- **Dlaczego nie ma backendu:** serwer lub chmura oznaczałyby zbieranie danych, uprawnienie do internetu i zmianę deklaracji Data safety oraz polityki prywatności. Kod kopii jest bezpiecznym zamiennikiem.

## Wersja 2.4 (versionCode 6)
- Układ pionowy na bardzo małych ekranach (np. 320×568): spiżarnia nie wystaje już poza ekran (audyt na 320×568, 360×600, 360×640, 375×667).

## Wersja 2.5 (versionCode 7) – Pokój szefa
- **Pokój szefa** (menu główne): 19 osiągnięć (+25 zł każde, złote powiadomienie w grze), 5 wnętrz restauracji do kupienia za monety (Cegła, Miętowy bar, Cukiernia, Granatowe bistro, Złota gwiazdka – zmieniają wygląd całej sceny), 12 wyglądów szefa kuchni (widoczny w menu i nagłówku gry), statystyki gracza.
- **Efekty**: iskry przy idealnym daniu; muzyka zmienia tonację wraz z rozdziałem.
- **Ustawienia**: przełączniki wibracji i efektów ekranu (wstrząsy, konfetti, iskry); „Jak grać” pod okrągłym przyciskiem ❓ w menu.
- Wszystko zapisuje się lokalnie i wchodzi do kopii zapasowej (GM2). Testy: 31.
- Naprawiono w trakcie prac błąd kolizji nazwy `S.fx` (ustawienie efektów vs tablica efektów klientów), wychwycony testem; dodano test regresji.

## Wersja 3.0 (versionCode 8) – Kuchnia szefa
- **Nowy tryb „Kuchnia szefa”** (przycisk w menu): prawdziwa restauracja z salą, stolikami, kasjerką, kelnerem, wydawką i kuchnią. Goście wchodzą, zamawiają u kasjerki i siadają, szef gotuje, kelner niesie danie do stolika, gość je i płaci. Obsługa kasy (wydawanie reszty) jest opcjonalna i daje napiwek.
- **Szef chodzi po kuchni** i staje przy zlewie (mycie rąk z wodą i bąbelkami), desce, kuchence (patelnia, garnek) i piekarniku; składniki wylatują z jego ręki; do podania zakłada rękawiczki.
- **Kampania: 72 plansze, 72 przepisy** w 8 światach o różnym wyglądzie: bar, pizzeria, zupy, obiady i Śląsk, kuchnia azjatycka, wypieki, wegetariańska, kuchnia od zera. Każda plansza ma 3–5 różnych dań w menu; plansza trwa ok. 10–15 minut.
- **Nauka i rosnąca trudność (6 poziomów):** na początku widzisz przepis i zielone pola; wyżej ukryta lista składników, kolejność i zielone pole przy smażeniu, więcej podobnych składników do wyboru, węższe okna czasowe. Ograniczona liczba podpowiedzi (podświetlają i tłumaczą dlaczego) oraz 24 pytania szefa o bezpieczne gotowanie (75°C dla drobiu, higiena, ryż, olej, alergeny).
- **Grafika:** własne rysunki wszystkich 72 dań zamiast emotikon, postacie z twarzami i fryzurami, osiem motywów restauracji.
- **Telefon i tablet:** kamera przybliża kuchnię na małych ekranach, kafelki oczekujących gości na scenie, większe przyciski i osobne układy.
- Zapis w localStorage (klucz gotuj_i_mroz_k3), bez internetu, bez reklam i bez zbierania danych: deklaracje Google Play bez zmian.
- Testy: 44 (silnik gotowania, wszystkie przepisy, trudność, podpowiedzi, pytania, rysunki dań).
