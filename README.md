# RAZVOJ MOBILNE APLIKACIJE ZA PREPOZNAVANJE GRAĐEVINSKIH PROBLEMA PRIMJENOM UMJETNE INTELIGENCIJE - FRONTEND

**Završni rad**<br>
Autor: David Kokalović<br>
Mentor: izv. prof. dr. sc. Nikola Tanković<br>
Sveučilište Jurja Dobrile u Puli, Fakultet informatike

---

## Sažetak

Vođen idejom olakšavanja prepoznavanja i rješavanja građevinskih problema u kućanstvu te povezivanja korisnika s odgovarajućim majstorima, izradio sam web aplikaciju "TataMata". Korisnik fotografira problem (npr. vlagu, pukotinu, oštećenje) i po potrebi doda kratak opis, nakon čega umjetna inteligencija analizira fotografiju te predlaže vjerojatnu dijagnozu, preporučeno rješenje i okvirnu procjenu troška, uz preporuku majstora/firmi koje rade u odgovarajućoj kategoriji. Aplikacija se sastoji od tri razine pristupa ovisno o ulozi korisnika: klijent, obrtnik (majstor) i administrator. Backend dio (Node.js/Express, MongoDB, integracija s Claude AI) izradio sam samostalno - repozitorij [tatamata-zavrsni-backend](https://github.com/dkokalovi/tatamata-zavrsni-backend) - kao i pripadajući frontend (Vue 3) opisan u ovom dokumentu. Na kraju mogu zaključiti da sam prilično zadovoljan s izrađenim funkcionalnostima, no u sljedećoj nadogradnji svakako bi trebalo dodati izravnu komunikaciju (chat) između korisnika i majstora nakon izraženog interesa, kako bi se dogovaranje posla u potpunosti moglo obaviti kroz samu aplikaciju, umjesto oslanjanja na telefon ili email naveden uz profil majstora.

## Funkcionalnosti

* **Neautorizirani korisnici:** Prijava ili registracija (kao klijent ili kao obrtnik)
* **Klijenti:** Prijava problema fotografijom uz opcionalan opis, AI dijagnoza problema s preporučenim rješenjem i procjenom troška, preporuka majstora/firmi prema kategoriji problema, izražavanje interesa za odabranog majstora, ocjenjivanje majstora nakon završenog posla, uvid u povijest vlastitih prijava i njihovo brisanje, uređivanje vlastitog profila i promjena lozinke
* **Obrtnici (majstori):** Sve funkcionalnosti kao i klijenti, uz mogućnost samostalne registracije vlastitog obrta (naziv, kontakt, kategorije rada) bez potrebe da ga doda administrator - obrt se odmah pojavljuje među preporukama za odgovarajuću kategoriju problema
* **Administrator:** Pregled svih registriranih korisnika, svih prijavljenih analiza i svih izraženih interesa, ručno dodavanje i brisanje firmi, promjena statusa interesa (na čekanju / kontaktirano / završeno), pregled statistike (broj korisnika, analiza po kategoriji, interesa po statusu, prosječna ocjena majstora), pretraga i sortiranje podataka po stupcima, filtriranje analiza po kategoriji i razdoblju, izvoz podataka u CSV format

## Demo računi

Registracija je otvorena svima, bez potrebe za pristupnim kodom.

**Admin** -> email: `admin@tatamata.hr`, lozinka: `lozinka123`<br>
**Korisnik** -> email: `davidovic@gmail.com`, lozinka: `lozinka123`

**Web aplikacija:** https://tatamata-zavrsni-frontend.netlify.app<br>
**Dokumentacija:** [priložena dokumentacija završnog rada](https://github.com/dkokalovi/tatamata-zavrsni-frontend/blob/main/docs/zavrsni-rad.pdf)