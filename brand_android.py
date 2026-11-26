# Runs in GitHub Actions after `npx cap add android`: puts the LoopX icon + splash into the Android project.
import os, glob, re
from PIL import Image, ImageDraw
src = Image.open('icon-1024.png').convert('RGB')
BG = src.getpixel((4, 4)); HEX = '#%02X%02X%02X' % BG
res = 'android/app/src/main/res'
def save(img, folder, name):
    os.makedirs(folder, exist_ok=True)
    for old in glob.glob(f'{folder}/{name}.*'): os.remove(old)   # avoid duplicate resources (png vs webp)
    img.save(f'{folder}/{name}.png')
for d, m in {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}.items():
    folder = f'{res}/mipmap-{d}'
    L, F = int(48 * m), int(108 * m)
    sq = src.resize((L, L), Image.LANCZOS); save(sq, folder, 'ic_launcher')
    mask = Image.new('L', (L, L), 0); ImageDraw.Draw(mask).ellipse((0, 0, L - 1, L - 1), fill=255)
    rd = Image.new('RGBA', (L, L), (0, 0, 0, 0)); rd.paste(sq, (0, 0), mask); save(rd, folder, 'ic_launcher_round')
    fg = Image.new('RGB', (F, F), BG); k = int(F * 0.66); fg.paste(src.resize((k, k), Image.LANCZOS), ((F - k) // 2, (F - k) // 2)); save(fg, folder, 'ic_launcher_foreground')
os.makedirs(f'{res}/values', exist_ok=True)
open(f'{res}/values/ic_launcher_background.xml', 'w').write(f'<?xml version="1.0" encoding="utf-8"?>\n<resources><color name="ic_launcher_background">{HEX}</color></resources>\n')
# splash: solid colour + centred logo (no stretching)
for old in glob.glob(f'{res}/drawable*/splash.*'): os.remove(old)
save(src.resize((420, 420), Image.LANCZOS), f'{res}/drawable-nodpi', 'splash_logo')
os.makedirs(f'{res}/drawable', exist_ok=True)
open(f'{res}/drawable/splash.xml', 'w').write(f'<?xml version="1.0" encoding="utf-8"?>\n<layer-list xmlns:android="http://schemas.android.com/apk/res/android"><item><shape android:shape="rectangle"><solid android:color="{HEX}"/></shape></item><item android:gravity="center"><bitmap android:src="@drawable/splash_logo" android:gravity="center"/></item></layer-list>\n')
# Android 12+ system splash (only if the theme uses androidx Theme.SplashScreen)
p = f'{res}/values/styles.xml'
if os.path.exists(p):
    s = open(p).read()
    m = re.search(r'<style name="AppTheme\.NoActionBarLaunch"[^>]*parent="Theme\.SplashScreen"[^>]*>', s)
    if m:
        s = s[:m.end()] + f'<item name="windowSplashScreenBackground">{HEX}</item><item name="windowSplashScreenAnimatedIcon">@drawable/splash_logo</item>' + s[m.end():]
        open(p, 'w').write(s)
print('branding done', HEX)
