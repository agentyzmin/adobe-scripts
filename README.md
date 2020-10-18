# Різні скрипти для програм Adobe

## Adobe Illustrator

### convert-shape-to-json.jsx
Переводить фігури у JSON для використання у скриптах та екстеншенах Adobe.

[Завантажити](https://github.com/agentyzmin/adobe-scripts/blob/master/Ai/convert-shape-to-json.jsx)


### create-artboard-by-selected-v1.jsx
Скрипт створює артборди по виділених об’єктах.

[Завантажити](https://github.com/agentyzmin/adobe-scripts/blob/master/AI/create-artboard-by-selected-v1.jsx)


### export-pdf-dwg-eps-v1.jsx
Скрипт для швидкого збережння файлу у різних форматах:
- PDF (всі артборди в одному файлі)
- PDF (кожен артборд в окремому файлі)
- EPS (всі артборди в одному файлі)
- EPS (кожен артборд в окремому файлі)
- DWG

Додаткові налаштування:
- переведення всіх шрифтів у криві
- переведення контурів в об’єкти
- збереження всіх файлів в окрему папку (за замовченням папка називатиметься по назві файлу)

<img src="https://github.com/agentyzmin/adobe-scripts/raw/master/AI/export-pdf-dwg-eps-v1.png" width="400">

[Завантажити](https://github.com/agentyzmin/adobe-scripts/blob/master/AI/export-pdf-dwg-eps-v1.jsx)


### Color Proof Maker
Скрипт, який генерує варіанти кольорів для цифрового друку у CMYK для виділеного об’єкта. Палітра зберігається у окремий шар.

Налаштування
`STEP` — крок зміни кольору;
`QV` — границі від фарби, наприклад, для фарби `15` границі в `10` будуть `5` та `25`.


<img src="https://github.com/agentyzmin/adobe-scripts/raw/master/AI/color-proof-maker-v1.gif" width="400">

[Завантажити](https://github.com/agentyzmin/adobe-scripts/blob/master/AI/color-proof-maker-v1.jsx)





### Транслітератор A3
Скрипт для транслітерації топонімів зоснований на [онлайновому транслітераторі](http://translit.a3.kyiv.ua). Постійно копіювати текст з браузера незручно, то чому б не перенести транслітератор безпосередньо у Ілюстратор та Індизайн.

[![Скрипт для транслітерації в Adobe Illustrator](http://img.youtube.com/vi/0NphpSzBg2Q/0.jpg)](http://www.youtube.com/watch?v=0NphpSzBg2Q "Скрипт для транслітерації в Adobe Illustrator")

Як працює: обираєте текст, запускаєте скрипт. Працює з точковим текстом, текстовими фреймами, текстом на кривих.

[Завантажити](https://raw.githubusercontent.com/agentyzmin/a3-tools/master/a3_translit/scripts/A3%20Translit%20(AI).jsx)



### Транслітератор КМУ 2010

За тим же принципом тільки з використанням офіційної транслітерації українського алфавіту латиницею затвердженої [постановою](https://zakon.rada.gov.ua/laws/show/55-2010-%D0%BF) Кабінету Міністрів України №55 від 27 січня 2010 р.

[Завантажити](https://raw.githubusercontent.com/agentyzmin/a3-tools/master/a3_translit/scripts/Translit%20KMU%202010%20(AI).jsx)





## Adobe InDesign

### Транслітератор А3

Те ж саме як в Adobe Illustrator. Як працює: обираєте текстовий фрейм, запускаєте скрипт.

[![Скрипт для транслітерації в Adobe InDesign](http://img.youtube.com/vi/8m3ksfNvGlg/0.jpg)](http://www.youtube.com/watch?v=8m3ksfNvGlg "Скрипт для транслітерації в Adobe InDesign")

[Завантажити](https://raw.githubusercontent.com/agentyzmin/a3-tools/master/a3_translit/scripts/A3%20Translit%20(ID).jsx)


### Транслітератор КМУ 2010

Те ж саме як в Adobe Illustrator. Як працює: обираєте текстовий фрейм, запускаєте скрипт.

[Завантажити](https://raw.githubusercontent.com/agentyzmin/a3-tools/master/a3_translit/scripts/Translit%20KMU%202010%20(ID).jsx)







# **Як інсталювати скрипти**

## **Adobe Illustrator**

Збережіть скрипт .jsx у папку:
* для Mac OS: Applications\Adobe Illustrator 2020\Presets\en_GB\Scripts
* для Windows: C:\Program Files\Adobe\Adobe Illustrator 2020\Presets\en_US\Scripts

«2020» — версія встановленої програми.
«en_GB» — код встановленої мови, тому файл якщо у вас Ілюстратор не англійською.

## **Adobe InDesign**

Відкрийте панель скриптів Window > Utilities > Scripts, тоді клацніть правою кнопкою миші на папках Application чи User. Краще використати папку User для ваших скриптів (папка Application зробить доступними вскрити для всіх користувачів на цьому комп’ютері, але для цього потрібні права адміністратора). Щоб відкрити папку, у контектному меню оберіть Reveal in Finder (чи Reveal для Windows).

![Reveal in Finder](https://indesignsecrets.com/wp-content/uploads/2017/10/revealinfinder_new.jpeg)

