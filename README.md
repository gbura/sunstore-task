# sun.store - listing produktów

Listing B2B zasilany plikiem `server/assets/products.csv`. Aplikacja używa Nuxt 4, Vue 3 i TypeScript w trybie strict.

## Uruchomienie

```bash
npm install
npm run dev
```

Build produkcyjny:

```bash
npm run build
npm run preview
```

Testy jednostkowe:

```bash
npm run test:unit
```

## Decyzje

- CSV jest odczytywany przez endpoint Nitro `/api/products`, bez bazy danych. Filtrowanie, wyszukiwanie, sortowanie i paginacja działają po stronie serwera.
- Filtry i paginacja są zapisane w query stringu. Strona pobiera wyniki przez `useFetch`, więc adres z filtrami renderuje wyniki i metadane SEO już przy SSR. Zmiany filtrów dodają wpis do historii przeglądarki; pole wyszukiwania jest opóźnione o 350 ms, żeby ograniczyć liczbę żądań.
- Zostawiłem niewielki, responsywny interfejs bez dodatkowej biblioteki komponentów. Lista ma paginację, sortowanie oraz stan pustych wyników i błędu.
- Testy Vitest sprawdzają odczytywanie mocy i pojemności oraz wyszukiwanie, filtry i sortowanie produktów. Testy podzieliłem na pozytywne [P] oraz negatywne [N].

## Pojemność i moc

`extractSpecs` szuka wartości najpierw w nazwie, a następnie w opisie produktu — dane specyfikacji nie są osobnymi kolumnami CSV. Rozpoznaje zapis z jednostkami `kWh`, `W`, `Wp` i `kW`, również bez odstępu oraz z przecinkiem dziesiętnym; `kW` przelicza na `W`. W dostarczonym zbiorze udało się odczytać pojemność dla 50/50 baterii i moc dla 50/50 paneli.

Jeśli w nazwie i opisie nie ma informacji o mocy lub pojemności, nie wyświetlamy tego parametru, ale produkt nadal jest widoczny w katalogu. Przy sortowaniu produkty z podaną wartością pojawiają się przed tymi, dla których jej brakuje. Wartości takie jak „10,5 kWh” zamieniamy na liczbę, żeby można je było poprawnie sortować. Nie wyciągamy mocy ani pojemności z samej liczby w nazwie produktu - musi jej towarzyszyć jednostka.

## Indeksowanie kombinacji filtrów

Nie chciałbym, żeby Google zapisywał w wynikach każdą możliwą wersję listy, np. wyniki wyszukiwania, każdy zakres cen i każdą stronę paginacji - takich adresów byłoby bardzo dużo, a wiele z nich pokazywałoby prawie to samo. Zamiast tego przygotowałbym osobne strony dla filtrów, których klienci faktycznie szukają, np. „panele NovaGrid”, z własnym tytułem i opisem. Pozostałe adresy wskazywałyby Google stronę główną danej kategorii albo informowały, żeby ich nie dodawał do wyników wyszukiwania.

## Lighthouse

Lighthouse 13.6, lokalny build produkcyjny (preset mobile): **Performance 100, Accessibility 100, Best Practices 100, SEO 100**. FCP 1,2 s, LCP 1,2 s, TBT 0 ms, CLS 0.

## Zakres i dalsze kroki

Celowo nie dodawałem stron szczegółów produktów, logowania, panelu edycji ani bazy danych - nie są potrzebne w tym zadaniu. W kolejnych krokach na pewno dodałbym brakujące strony.

Dodatkowo dodałbym animacje na stronie, aby sama strona zapadła w pamięci użytkownikowi i aby dodać trochę więcej interakcji z użytkownikiem.

W przyszłości warto by było również dokładniej przyjrzeć się wyciąganiu wartości z nazwy oraz opisu, ponieważ obecny regex sprawdza tylko kombinację liczba-jednostka.

Wraz z rozwojem projektu, możnaby zastanowić się nad zmianą architektury projektu i zmienić ją na domenową. Wydzielić `components`, `shared`, `types` oraz `constants` do oddzielnych plików, żeby móc je łatwo zmieniać oraz używać w globalnym scope.

## Wykorzystanie AI

AI pomogło przejrzeć strukturę projektu i wymagania, przeanalizować pokrycie danych w CSV, ustalić odpowiedni regex oraz wprowadzić poprawkę w ekstrakcji specyfikacji i przygotować dokumentację.

AI pomogło mi także stworzyć unikalny interfejs użytkownika bez zbędnego tracenia czasu na wymyślanie designu.

Testy jednostkowe powstały z pomocą AI, ja natomiast przeprowadziłem dokładne self-code-review oraz naniosłem poprawki - dodałem także test tagi [P] oraz [N], które oznaczają positive/negative case.

## Czas

Około 3,5 godziny wraz z testami jednostkowymi.
