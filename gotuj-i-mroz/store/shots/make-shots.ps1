$r = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$h = [IO.File]::ReadAllText("$r\index.html", [Text.Encoding]::UTF8)
$js = [IO.File]::ReadAllText("$r\store\shots\demo-script.js", [Text.Encoding]::UTF8)
$h = $h.Replace("</body>", "<script>`n$js`n</script></body>")
[IO.File]::WriteAllText("$r\store\shots\demo.html", $h, (New-Object Text.UTF8Encoding $false))
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
function Shot($file, $hash, $w, $h2, $scale, $out) {
  $url = ("file:///" + ($r -replace '\\', '/') + "/store/shots/$file#$hash") -replace ' ', '%20'
  Start-Process $edge -ArgumentList "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=$scale", "--window-size=$w,$h2", "--virtual-time-budget=4000", "--screenshot=`"$out`"", $url -Wait -NoNewWindow 2>$null
}
$o = "$r\store\play"
New-Item -ItemType Directory -Force "$o\telefon", "$o\tablet-7", "$o\tablet-10" | Out-Null
# telefon 1920x1080
Shot "demo.html" "menu"   960 540 2 "$o\telefon\1-menu.png"
Shot "demo.html" "drag"   960 540 2 "$o\telefon\2-chwyc-i-wrzuc.png"
Shot "demo.html" "play2"  960 540 2 "$o\telefon\3-idealne-danie.png"
Shot "demo.html" "play4"  960 540 2 "$o\telefon\4-alergia-i-higiena.png"
Shot "demo.html" "school" 960 540 2 "$o\telefon\5-szkola-gastronomii.png"
Shot "demo.html" "map"    960 540 2 "$o\telefon\6-mapa-poziomow.png"
Shot "demo.html" "quiz"   960 540 2 "$o\telefon\7-pytanie-dnia.png"
Shot "demo.html" "end"    960 540 2 "$o\telefon\8-opinie-gosci.png"
# interfejs (do planszy układu)
New-Item -ItemType Directory -Force "$r\store\ui" | Out-Null
$u="$r\store\ui"
Shot "demo.html" "splash"   960 540 2 "$u\1-ladowanie.png"
Shot "demo.html" "menu"     960 540 2 "$u\2-ekran-glowny.png"
Shot "demo.html" "play1"    960 540 2 "$u\3-gra.png"
Shot "demo.html" "pause"    960 540 2 "$u\4-pauza.png"
Shot "demo.html" "settings" 960 540 2 "$u\5-ustawienia.png"
Shot "demo.html" "map"      960 540 2 "$u\6-mapa-poziomow.png"
Shot "demo.html" "how"      960 540 2 "$u\7-jak-grac.png"
Shot "demo.html" "end"      960 540 2 "$u\8-koniec-poziomu.png"
# tablet 7" 1920x1200
Shot "demo.html" "play1"  1280 800 1.5 "$o\tablet-7\1-kolejka-i-przepis.png"
Shot "demo.html" "play4"  1280 800 1.5 "$o\tablet-7\2-alergia-i-higiena.png"
Shot "demo.html" "school" 1280 800 1.5 "$o\tablet-7\3-szkola-gastronomii.png"
# tablet 10" 2560x1600
Shot "demo.html" "play1"  1280 800 2 "$o\tablet-10\1-kolejka-i-przepis.png"
Shot "demo.html" "play4"  1280 800 2 "$o\tablet-10\2-alergia-i-higiena.png"
Shot "demo.html" "school" 1280 800 2 "$o\tablet-10\3-szkola-gastronomii.png"
Shot "demo.html" "quiz"   1280 800 2 "$o\tablet-10\4-pytanie-dnia.png"
# grafika funkcji 1024x500
Shot "feature.html" "x" 1024 500 1 "$o\grafika-funkcji-1024x500.png"
Copy-Item "$r\store\icon-512.png" "$o\ikona-512.png" -Force
Get-ChildItem $o -Recurse -File | ForEach-Object { $_.FullName.Substring($o.Length + 1) + "  " + [int]($_.Length / 1KB) + " KB" }
