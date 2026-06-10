# IZVESTAJ TESTIRANJA - Black Hornets Racing Website

**Datum:** 12.03.2026.
**Okruzenje:** Lokalni razvoj (XAMPP - Apache 2.4.58, PHP 8.2.12, MariaDB 10.4.32)
**URL:** http://blackhornets.local

---

## SADRZAJ

1. [Pregled javnih stranica](#1-pregled-javnih-stranica)
2. [CSS i JS resursi](#2-css-i-js-resursi)
3. [Slike i vizuelni elementi](#3-slike-i-vizuelni-elementi)
4. [Admin panel](#4-admin-panel)
5. [API endpointi](#5-api-endpointi)
6. [Forme i obrada podataka](#6-forme-i-obrada-podataka)
7. [Navigacija i linkovi](#7-navigacija-i-linkovi)
8. [Bezbednost](#8-bezbednost)
9. [Rezime pronadjenih problema](#9-rezime-pronadjenih-problema)

---

## 1. PREGLED JAVNIH STRANICA

Svih 12 javnih stranica se uspesno ucitava (HTTP 200):

| Stranica | URL | Status | Velicina |
|----------|-----|--------|----------|
| Pocetna | `/public/index.html` | 200 OK | 31.651 B |
| O nama | `/public/pages/about.html` | 200 OK | 8.653 B |
| Tim | `/public/pages/team.html` | 200 OK | 5.438 B |
| Projekti | `/public/pages/projects.html` | 200 OK | 9.467 B |
| Detalji projekta | `/public/pages/project-details.html` | 200 OK | 4.580 B |
| Blog | `/public/pages/blog.html` | 200 OK | 2.348 B |
| Blog clanak | `/public/pages/blog-post.html` | 200 OK | 3.302 B |
| Galerija | `/public/pages/gallery.html` | 200 OK | 7.616 B |
| Sponzori | `/public/pages/sponsors.html` | 200 OK | 13.752 B |
| Dogadjaji | `/public/pages/events.html` | 200 OK | 4.001 B |
| Kontakt | `/public/pages/contact.html` | 200 OK | 7.301 B |
| Prijava | `/public/pages/apply.html` | 200 OK | 12.993 B |

---

## 2. CSS I JS RESURSI

### CSS fajlovi - svi rade (14 fajlova)

| Fajl | Status | Velicina |
|------|--------|----------|
| `style.css` | 200 OK | 34.973 B |
| `header.css` | 200 OK | 7.993 B |
| `footer.css` | 200 OK | 2.443 B |
| `about.css` | 200 OK | 13.590 B |
| `teams.css` | 200 OK | 30.469 B |
| `projects.css` | 200 OK | 20.008 B |
| `project-details.css` | 200 OK | 5.550 B |
| `blog.css` | 200 OK | 9.181 B |
| `blog-post.css` | 200 OK | 13.855 B |
| `gallery.css` | 200 OK | 19.355 B |
| `sponsors.css` | 200 OK | 27.785 B |
| `events.css` | 200 OK | 5.445 B |
| `contact.css` | 200 OK | 11.610 B |
| `apply.css` | 200 OK | 18.206 B |

Svi eksterni CDN resursi (Font Awesome, AOS, Bootstrap, Lightbox2, Leaflet) takodje rade.

### JS fajlovi - svi rade (13 fajlova)

| Fajl | Status | Velicina |
|------|--------|----------|
| `header-footer.js` | 200 OK | 74.530 B |
| `main.js` | 200 OK | 6.624 B |
| `about.js` | 200 OK | 8.084 B |
| `teams.js` | 200 OK | 26.686 B |
| `projects.js` | 200 OK | 11.593 B |
| `project-details.js` | 200 OK | 2.374 B |
| `blog.js` | 200 OK | 7.499 B |
| `blog-post.js` | 200 OK | 15.482 B |
| `gallery.js` | 200 OK | 2.618 B |
| `sponsors.js` | 200 OK | 13.133 B |
| `events.js` | 200 OK | 1.548 B |
| `contact.js` | 200 OK | 4.351 B |
| `apply.js` | 200 OK | 6.429 B |

### PROBLEM: events.html stranica

- **Nedostaje `header-footer.js`** — stranica nema header ni footer jer JS nije ukljucen
- **Nedostaje `header.css`** — stilovi za header nece raditi cak i kad se JS doda

---

## 3. SLIKE I VIZUELNI ELEMENTI

### Slike koje rade (7 slika)

| Slika | Status |
|-------|--------|
| `Stiker_crni.png` (logo) | 200 OK |
| `Tipografija_belo.png` (header logo) | 200 OK |
| `W logo.png` (beli logo) | 200 OK |
| `pexels-bertellifotografia-2467506.jpg` (about) | 200 OK |
| `1f.png`, `2f.png`, `3f.png` (sponzori) | 200 OK |

### Slike koje NEDOSTAJU - 13 fajlova sa 404 greskom

| Referencirana u | Putanja slike | Problem |
|-----------------|---------------|---------|
| `project-details.html` | `/public/assets/images/projects/project1-large.jpg` | Folder `projects/` ne postoji |
| `project-details.html` | `/public/assets/images/projects/project1-thumb1.jpg` | Folder `projects/` ne postoji |
| `project-details.html` | `/public/assets/images/projects/project1-thumb2.jpg` | Folder `projects/` ne postoji |
| `project-details.html` | `/public/assets/images/projects/project1-thumb3.jpg` | Folder `projects/` ne postoji |
| `project-details.html` | `/public/assets/images/projects/project1-thumb4.jpg` | Folder `projects/` ne postoji |
| `project-details.html` | `/public/assets/images/team/member1.jpg` | Folder `team/` ne postoji |
| `sponsors.html` | `/public/assets/images/brochure/page10.jpg` | Pogresno ime (postoji `page1.jpg`) |
| `sponsors.html` | `/public/assets/images/brochure/page20.jpg` | Pogresno ime (postoji `page2.jpg`) |
| `sponsors.html` | `/public/assets/images/brochure/page30.jpg` | Pogresno ime (postoji `page3.jpg`) |
| `sponsors.html` | `/public/assets/images/brochure/page40.jpg` | Pogresno ime (postoji `page4.jpg`) |
| `sponsors.html` | `/public/assets/images/brochure/page50.jpg` | Pogresno ime (postoji `page5.jpg`) |
| `sponsors.html` | `/public/assets/images/brochure/page60.jpg` | Pogresno ime (postoji `page6.jpg`) |
| `events.html` | `/public/assets/images/events/event1.jpg` | Folder `events/` ne postoji |

### Dodatni vizuelni problemi

- **`sponsors.html`** — slika `f4.png` ima razmak ispred putanje u `src` atributu (` /public/assets/images/f4.png`), sto uzrokuje **403 Forbidden** gresku
- **`04a..jpg`** — ime fajla ima duplu tacku, verovatno greska u nazivu
- **Nijedna stranica nema favicon** deklarisan u HTML-u

---

## 4. ADMIN PANEL

### Prijava (Login)

| Provera | Rezultat |
|---------|----------|
| Login stranica ucitavanje | 200 OK |
| CSS (login.css) | 200 OK |
| Prijava sa admin/admin123 | USPESNO — vraca `{"status":"success"}` |
| Sesija (PHPSESSID) | Pravilno postavljena |
| Odjava (logout) | RADI — brise sesiju i kolacic |

### Admin stranice koje RADE bez gresaka (11 stranica)

| Stranica | Status | Napomena |
|----------|--------|----------|
| `manage_members.php` | 200 OK | Prikazuje clanove tima |
| `add_user.php` | 200 OK | Forma za dodavanje korisnika |
| `applications_list.php` | 200 OK | Lista prijava (prazna) |
| `add-edit-post.php` | 200 OK | Dvojezicna forma (SR/EN) |
| `manage-projects.php` | 200 OK | Upravljanje projektima |
| `add-edit-project.php` | 200 OK | Forma za projekte |
| `manage-gallery.php` | 200 OK | Upravljanje galerijom |
| `manage-sponsors.php` | 200 OK | Upravljanje sponzorima |
| `add-edit-sponsor.php` | 200 OK | Forma za sponzore |
| `messages.php` | 200 OK | Poruke sa kontakt forme |
| `reports.php` | 200 OK | Izvestaji tima |

### Admin stranice sa GRESKAMA (4 stranice)

#### dashboard.php — FATALNA GRESKA
- **Greska:** `Fatal error: Table 'blackhornets.posts' doesn't exist` (linija 169)
- **Uzrok:** Tabela `posts` ne postoji u bazi. Baza ima `blog_posts` tabelu ali kod koristi `posts`.
- **Uticaj:** Dashboard se delimicno ucitava (statistika radi) ali puca na delu za upravljanje vestima.

#### posts.php — FATALNA GRESKA
- **Greska:** `Fatal error: Table 'blackhornets.posts' doesn't exist` (linija 8)
- **Uzrok:** Isti problem — tabela `posts` ne postoji.
- **Uticaj:** Stranica se uopste ne ucitava, prikazuje samo gresku.

#### edit_profile.php — SQL GRESKA + 17 UPOZORENJA
- **SQL greska:** `Unknown column 't.projects' in 'field list'`
- **PHP upozorenja:** 17 upozorenja — `Undefined variable $user_data` i `Trying to access array offset on null`
- **Uzrok:** SQL upit referencira kolonu `t.projects` koja ne postoji u tabeli `team_members`.
- **Uticaj:** Stranica se ucitava ali sva polja profila su prazna.

#### team_dashboard.php — REDIREKCIJA NA NEPOSTOJECU STRANICU
- **Ponasanje:** Redirectuje na `unauthorized.php` koja ne postoji (404)
- **Uzrok:** Admin uloga nema pristup team dashboard-u, a fallback stranica nedostaje.

### Greska u autentifikaciji (redirect putanja)
- Kada neautorizovan korisnik pokusa da pristupi stranicama u `/admin/pages/`, redirect ide na `login.php` (relativna putanja) sto se razresava na `/admin/pages/login.php` — koja ne postoji (404).
- **Ispravna putanja:** `../login.php`

---

## 5. API ENDPOINTI

| Endpoint | Status | Odgovor | Problem |
|----------|--------|---------|---------|
| `GET /api/posts/read.php` | 200 | FATALNA GRESKA | Tabela `posts` ne postoji |
| `GET /api/posts/read.php?id=1` | 200 | FATALNA GRESKA | Tabela `posts` ne postoji |
| `GET /api/projects/read.php` | 200 | `{"success":true,"data":[],"count":0}` | Razmak pre JSON-a |
| `GET /api/gallery/read.php` | 200 | `{"success":true,"data":[...],"count":1}` | Razmak pre JSON-a |
| `GET /api/sponsors/read.php` | 200 | `{"success":true,"data":[],"count":0}` | Razmak pre JSON-a |
| `GET /api/team/read.php` | 200 | Pun JSON sa 3 clana | Radi bez gresaka |
| `GET /api/posts/categories.php` | 404 | Ne postoji | Blog filter nece raditi |

### Problem sa razmakom u JSON odgovorima
- Fajlovi `database.php`, `projects/read.php`, `gallery/read.php` i `sponsors/read.php` imaju razmak posle zatvarajuceg `?>` taga, sto dodaje beli prostor ispred JSON odgovora.

### Nekonzistentna struktura API odgovora
- Team endpoint koristi `{success, members, organized_data}` umesto standardnog `{success, data, count}` formata koji ostali endpointi koriste.

---

## 6. FORME I OBRADA PODATAKA

### Kontakt forma (contact.php)
- **Status:** RADI
- **Test:** POST sa name, email, subject, message
- **Odgovor:** `{"status":"success","message":"Thank you! Your message has been sent successfully."}`
- **Podaci se cuvaju u bazi** — provereno kroz admin panel (messages.php)

### Forma za prijavu (apply.php)
- **Status:** DELIMICNO RADI
- **Validacija:** Radi ispravno — proverava sva obavezna polja
- **Problem:** Nekonzistentna imena polja — koristi camelCase za vecinu (`firstName`, `lastName`, `studentId`) ali snake_case za `academic_year`
- **Upload:** Zahteva PDF fajl za CV, sto je ispravno ponasanje
- **Napomena:** Kompletno testiranje zahteva upload fajla kroz browser

### Login forma (process_login.php)
- **Status:** RADI
- **Odgovor:** `{"status":"success","message":"Login successful","redirect":"pages/dashboard.php"}`
- **Sesija:** Pravilno se kreira

---

## 7. NAVIGACIJA I LINKOVI

### Problemi sa linkovima na index.html

| Link | Problem |
|------|---------|
| `href="/pages/blog.html"` | Nedostaje `/public` prefiks — nekonzistentno sa ostalim putanjama |
| `href="/pages/blog-post.htm"` | **Greska u kucanju** — `.htm` umesto `.html` — vraca 404 |
| `href="pages/blog-post.html?id=${post.id}"` | JS template literal u HTML-u — prikazuje se doslovno |

### Root URL problem
- `http://blackhornets.local/` vraca **403 Forbidden** umesto 200
- Sadrzaj stranice se prikazuje (jer ErrorDocument sluzi index.html), ali status kod je pogresan
- Utice na SEO i alate koji proveravaju status kodove

### events.html
- Svi linkovi su `href="#"` — placeholder-i bez stvarne navigacije

---

## 8. BEZBEDNOST

### Dobro implementirano
- Bezbednosni zaglavlja prisutna: `X-Frame-Options`, `X-XSS-Protection`, `X-Content-Type-Options`
- Lozinke hasovane sa bcrypt
- Upload direktorijumi zasticeni `.htaccess` fajlovima
- SecureFileUpload klasa sa visestrukom validacijom

### Problemi
- **Server info izlozen** — zaglavlja otkrivaju `PHP/8.2.12` i `Apache/2.4.58`
- **PHP greske prikazane** — fatalne greske otkrivaju potpune putanje fajlova na serveru
- **SQL injection rizik** — `posts/read.php` koristi string interpolaciju za `id` parametar umesto prepared statements
- **Duplirani .htaccess blokovi** — `public/.htaccess` ima dupliran `mod_expires` i `mod_deflate` sadrzaj

---

## 9. REZIME PRONADJENIH PROBLEMA

### KRITICNI (moraju se resiti)

| # | Problem | Lokacija | Opis |
|---|---------|----------|------|
| 1 | Tabela `posts` ne postoji u bazi | Baza podataka | Kod koristi `posts` a u bazi postoji `blog_posts`. Dashboard, posts.php i posts API ne rade |
| 2 | events.html nema header-footer.js | `events.html` | Stranica nema navigaciju ni footer |
| 3 | events.html nema header.css | `events.html` | Stilovi header-a nedostaju |
| 4 | Pogresan redirect pri neautorizovanom pristupu | `auth_check.php` | Redirect na `login.php` umesto `../login.php` — zavrsava na 404 |
| 5 | 13 slika nedostaje (404) | Vise stranica | Folderi `projects/`, `team/`, `events/` ne postoje; brosura ima pogresna imena |
| 6 | Posts API potpuno ne radi | `/api/posts/read.php` | Fatalna greska — tabela ne postoji |

### SREDNJI PRIORITET

| # | Problem | Lokacija | Opis |
|---|---------|----------|------|
| 7 | edit_profile.php SQL greska | `edit_profile.php` | Kolona `t.projects` ne postoji — profil ostaje prazan |
| 8 | team_dashboard.php nedostaje unauthorized.php | `team_dashboard.php` | Redirect na nepostojecu stranicu |
| 9 | Greska u kucanju — `blog-post.htm` | `index.html` | Link ka blog clanku ima `.htm` umesto `.html` |
| 10 | Razmak ispred src atributa slike f4.png | `sponsors.html` | Uzrokuje 403 gresku za sliku |
| 11 | categories.php API ne postoji | `/api/posts/` | Blog filter kategorija nece raditi |
| 12 | Razmak pre JSON odgovora | Vise API fajlova | Beli prostor pre JSON-a zbog `?>` sa razmakom |
| 13 | Root URL vraca 403 umesto 200 | `.htaccess` | Pocetna stranica ima pogresan HTTP status |

### NIZAK PRIORITET

| # | Problem | Lokacija | Opis |
|---|---------|----------|------|
| 14 | Nema favicon-a | Sve stranice | Nijedna stranica nema deklarisan favicon |
| 15 | Server info izlozen u zaglavljima | Apache konfiguracija | Prikazuje verzije PHP-a i Apache-a |
| 16 | Nekonzistentna imena polja u apply.php | `apply.php` | Mesavina camelCase i snake_case |
| 17 | Nekonzistentna struktura API odgovora | `/api/team/read.php` | Razlicit format od ostalih endpointa |
| 18 | Duplirani blokovi u public/.htaccess | `public/.htaccess` | mod_expires i mod_deflate duplirani |
| 19 | Fajl `04a..jpg` ima duplu tacku u imenu | `assets/images/` | Verovatno greska u imenovanju |
| 20 | SQL injection rizik u posts API | `/api/posts/read.php` | String interpolacija umesto prepared statements |

---

## STATISTIKA TESTIRANJA

| Kategorija | Testirano | Radi | Ima problem |
|------------|-----------|------|-------------|
| Javne stranice | 12 | 12 | 2 (vizuelni/funkcionalni problemi) |
| CSS fajlovi | 14 | 14 | 0 |
| JS fajlovi | 13 | 13 | 0 |
| Slike | 20 | 7 | 13 (404) |
| Admin stranice | 15 | 11 | 4 |
| API endpointi | 7 | 5 | 2 (fatalna greska + nedostaje) |
| Forme | 3 | 3 | 0 (validacija radi) |

**Ukupno pronadjenih problema: 20**
- Kriticnih: 6
- Srednjeg prioriteta: 7
- Niskog prioriteta: 7
