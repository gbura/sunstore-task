# Zadanie rekrutacyjne – Frontend Developer (sun.store)

## Kontekst

sun.store to marketplace B2B dla fotowoltaiki. Instalatorzy i dystrybutorzy w całej Europie kupują u nas panele, baterie i akcesoria. Strony z listami produktów to dla nas jednocześnie narzędzie pracy klientów i źródło ruchu z wyszukiwarek, więc muszą być szybkie, przyjazne dla SEO i wygodne w filtrowaniu.

## Zadanie

Zbuduj stronę listingu produktów na podstawie załączonego pliku `products.csv` (150 produktów w 3 kategoriach).

Użytkownik ma móc:

- filtrować po **kategorii**, **producencie** i **zakresie cen**,
- wyszukiwać po **nazwie, producencie i opisie**,
- filtrować albo sortować po **pojemności (kWh) lub mocy (W)**. Tych danych nie ma w osobnej kolumnie, sam zdecyduj, jak je pozyskać.

Nie potrzebujemy strony pojedynczego produktu, logowania ani panelu edycji.

## Wymagania techniczne

- **Nuxt 4, Vue 3 (Composition API), TypeScript w trybie strict.**
- **Dane serwowane przez endpoint w Nitro** (np. `/api/products`). Filtrowanie i wyszukiwanie odbywa się po stronie serwera. Bez bazy danych, dane czytasz bezpośrednio z pliku CSV.
- **Stan filtrów w URL.** Link z ustawionymi filtrami musi się wyrenderować po stronie serwera (SSR) z właściwymi wynikami, a przycisk „wstecz” w przeglądarce ma działać zgodnie z oczekiwaniami.
- **Podstawowe SEO:** tytuł i meta tagi zależne od wybranych filtrów.
- **UI:** możesz użyć dowolnej biblioteki komponentów (np. Vuetify, Nuxt UI). Nie oczekujemy autorskiego designu, tylko czytelnego i wygodnego interfejsu.
- **Wdrożenie** z publicznym linkiem (np. Vercel, Netlify, Cloudflare).

Testy automatyczne nie są wymagane (patrz sekcja „Dodatkowo” niżej).

## Dodatkowo (opcjonalnie)

Jeśli zmieścisz się w czasie i masz ochotę, możesz dodać:

- testy jednostkowe w **Vitest**, np. dla pozyskiwania kWh/W i logiki filtrowania,
- jeden scenariusz end-to-end w **Playwright**, np. ustawienie filtrów i sprawdzenie, że po odświeżeniu strony wyniki są takie same.

**To nie jest wymagane i nie obniża oceny, jeśli tego nie zrobisz.** Zajmij się tym tylko wtedy, gdy całość, łącznie z README, zmieści się w 5 godzinach. Wolimy dobrze przemyślany zakres podstawowy niż pospiesznie dopisane testy.

## README (ważniejsze niż dodatkowe funkcje)

W README opisz krótko:

1. Kluczowe decyzje i dlaczego je podjąłeś.
2. Jak pozyskałeś kWh/W i jakie przypadki brzegowe obsłużyłeś.
3. Jak podszedłbyś do indeksowania kombinacji filtrów w wyszukiwarkach (2–3 zdania, bez implementacji).
4. Czego celowo nie zrobiłeś i co zrobiłbyś dalej, mając więcej czasu.
5. Wynik Lighthouse dla strony listingu (wystarczy zrzut ekranu albo liczby).
6. Jak korzystałeś z AI: do czego, w których miejscach musiałeś poprawiać jego wynik i dlaczego.
7. Ile czasu realnie poświęciłeś.

## Czas

Zadanie powinno zająć około 3–4 godzin. **Jeśli przekroczysz 5 godzin, zatrzymaj się** i opisz w README, co zostało do zrobienia i jak byś to zrobił. To, co uznasz za najważniejsze, też jest dla nas informacją.

## AI

Możesz i zachęcamy, żeby korzystać z narzędzi AI, bo tak pracujemy na co dzień. Na kolejnym spotkaniu poprosimy Cię o omówienie rozwiązania i **o wprowadzenie niewielkiej zmiany w Twoim kodzie na żywo**, z użyciem Twoich narzędzi, w tym AI. Dobrze znaj więc każdą część swojego rozwiązania.

## Co przesyłasz

- link do repozytorium (publiczne albo z dostępem dla nas: [LOGIN GITHUB DO UZUPEŁNIENIA]),
- link do działającej aplikacji.

## Niejasności

Jeśli coś w zadaniu jest niejasne, podejmij decyzję i opisz ją w README albo napisz do nas. Obie drogi są w porządku.

Powodzenia!
