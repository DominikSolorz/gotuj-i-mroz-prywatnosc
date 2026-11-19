# Gotuj i Mroź – budowa na Google Play

## Raz na komputerze
1. Zainstaluj Node.js LTS (nodejs.org) i Android Studio (developer.android.com/studio).
2. W tym folderze:
```
npm install
npx cap add android
npx cap sync android
npx cap open android
```
## W Android Studio
- Build > Generate Signed App Bundle > Android App Bundle (.aab).
- Utwórz klucz (keystore) i ZAPISZ go oraz hasła w bezpiecznym miejscu. Bez niego nie wydasz aktualizacji.
- Ikonę aplikacji ustaw: prawy klik na app/res > New > Image Asset (użyj store/icon-512.png).
- Zmiana wersji: android/app/build.gradle (versionCode, versionName).

## Google Play Console
1. Konto deweloperskie: 25 USD jednorazowo (play.google.com/console). Konto osobiste może wymagać testów zamkniętych (12 testerów przez 14 dni) przed publikacją – sprawdź aktualne zasady.
2. Utwórz aplikację, wgraj .aab.
3. Ikona: store/icon-512.png. Zrzuty ekranu zrób z emulatora lub telefonu (telefon + tablet). Grafika promocyjna 1024x500 – do zrobienia.
4. Polityka prywatności: wgraj store/polityka-prywatnosci.html na dowolny hosting (np. GitHub Pages) i podaj link.
5. Wypełnij ankietę treści (gra bez reklam, bez zbierania danych) i klasyfikację wiekową.

## Zmiany w grze
Edytuj www/index.html, potem `npx cap sync android` i zbuduj ponownie.
