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
Shot "demo.html" "menu"  960 540 2 "$o\telefon\1-menu.png"
Shot "demo.html" "play1" 960 540 2 "$o\telefon\2-kolejka-i-przepis.png"
Shot "demo.html" "play2" 960 540 2 "$o\telefon\3-idealne-danie.png"
Shot "demo.html" "play3" 960 540 2 "$o\telefon\4-danie-szefa.png"
Shot "demo.html" "end"   960 540 2 "$o\telefon\5-opinie-gosci.png"
Shot "demo.html" "book"  960 540 2 "$o\telefon\6-ksiazka-kucharska.png"
# tablet 7" 1920x1200
Shot "demo.html" "play1" 1280 800 1.5 "$o\tablet-7\1-kolejka-i-przepis.png"
Shot "demo.html" "play2" 1280 800 1.5 "$o\tablet-7\2-idealne-danie.png"
Shot "demo.html" "end"   1280 800 1.5 "$o\tablet-7\3-opinie-gosci.png"
# tablet 10" 2560x1600
Shot "demo.html" "play1" 1280 800 2 "$o\tablet-10\1-kolejka-i-przepis.png"
Shot "demo.html" "play3" 1280 800 2 "$o\tablet-10\2-danie-szefa.png"
Shot "demo.html" "menu"  1280 800 2 "$o\tablet-10\3-menu.png"
Shot "demo.html" "book"  1280 800 2 "$o\tablet-10\4-ksiazka-kucharska.png"
# grafika funkcji 1024x500
Shot "feature.html" "x" 1024 500 1 "$o\grafika-funkcji-1024x500.png"
Copy-Item "$r\store\icon-512.png" "$o\ikona-512.png" -Force
Get-ChildItem $o -Recurse -File | ForEach-Object { $_.FullName.Substring($o.Length + 1) + "  " + [int]($_.Length / 1KB) + " KB" }
