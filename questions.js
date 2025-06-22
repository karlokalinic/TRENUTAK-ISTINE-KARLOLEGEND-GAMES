
// Baza pitanja organizirana po razinama i kategorijama

const GAME_QUESTIONS = {

    level1: [

        {

            id: 1,

            text: "Jesi li ikada ukrao nešto iz trgovine, bez obzira na vrijednost?",

            category: "moral",

            intensity: 1,

            followUp: "moral_theft"

        },

        {

            id: 2,

            text: "Jesi li ikada lagao na životopisu ili razgovoru za posao?",

            category: "work",

            intensity: 1,

            followUp: "work_lies"

        },

        {

            id: 3,

            text: "Jesi li ikada bio fizički agresivan prema nekome tko ti nije prijetio?",

            category: "violence",

            intensity: 2,

            followUp: "violence_unprovoked"

        },

        {

            id: 4,

            text: "Jesi li ikada poželio da ti roditelj umre?",

            category: "family",

            intensity: 3,

            followUp: "family_death_wish"

        },

        {

            id: 5,

            text: "Jesi li ikada namjerno oštetio tuđu imovinu iz osvete?",

            category: "moral",

            intensity: 2,

            followUp: "moral_revenge"

        },

        {

            id: 6,

            text: "Jesi li ikada uzeo novac koji nije bio tvoj, a nitko to nije primijetio?",

            category: "moral",

            intensity: 2,

            followUp: "moral_theft_money"

        }

    ],

    level2: [

        {

            id: 7,

            text: "Jesi li ikada prevario na ispitu ili važnom testu?",

            category: "education",

            intensity: 2,

            followUp: "education_cheating"

        },

        {

            id: 8,

            text: "Jesi li ikada rekao nekome da ga voliš, a nije bilo istina?",

            category: "relationships",

            intensity: 3,

            followUp: "relationships_fake_love"

        },

        {

            id: 9,

            text: "Jesi li ikada namjerno povrijedio životinje radi zabave?",

            category: "cruelty",

            intensity: 4,

            followUp: "cruelty_animals"

        },

        {

            id: 10,

            text: "Jesi li ikada masturbirao misleći na nekoga iz svoje obitelji?",

            category: "sexuality",

            intensity: 5,

            followUp: "sexuality_family"

        },

        {

            id: 11,

            text: "Jesi li ikada poželio da se tvoj najbolji prijatelj razboli?",

            category: "friendship",

            intensity: 3,

            followUp: "friendship_illness_wish"

        }

    ],

    level3: [

        {

            id: 12,

            text: "Jesi li ikada imao seksualnu fantaziju o maloljetnoj osobi?",

            category: "sexuality",

            intensity: 6,

            followUp: "sexuality_minor"

        },

        {

            id: 13,

            text: "Jesi li ikada pustio da netko drugi preuzme krivnju za nešto što si ti napravio?",

            category: "moral",

            intensity: 4,

            followUp: "moral_blame_shifting"

        },

        {

            id: 14,

            text: "Jesi li ikada htio fizički povrijediti nekoga koga voliš?",

            category: "violence",

            intensity: 5,

            followUp: "violence_loved_ones"

        },

        {

            id: 15,

            text: "Jesi li ikada razmotrijo mogućnost samoubojstva?",

            category: "mental_health",

            intensity: 5,

            followUp: "mental_suicide"

        }

    ],

    level4: [

        {

            id: 16,

            text: "Jesi li ikada bio nevjeran svom partneru/partnerici?",

            category: "relationships",

            intensity: 4,

            followUp: "relationships_infidelity"

        },

        {

            id: 17,

            text: "Jesi li ikada uzeo drogu teže od marihuane?",

            category: "drugs",

            intensity: 4,

            followUp: "drugs_hard"

        },

        {

            id: 18,

            text: "Jesi li ikada počinio kriminalno djelo za koje nisi uhvaćen?",

            category: "crime",

            intensity: 5,

            followUp: "crime_unsolved"

        }

    ],

    level5: [

        {

            id: 19,

            text: "Postoji li netko u tvom životu za kojeg bi svijet bio bolje mjesto kad bi umro?",

            category: "dark_thoughts",

            intensity: 6,

            followUp: "dark_death_wish"

        },

        {

            id: 20,

            text: "Jesi li ikada razmišljao o tome da povrijediš dijete?",

            category: "dark_thoughts",

            intensity: 7,

            followUp: "dark_child_harm"

        }

    ],

    level6: [

        {

            id: 21,

            text: "Koja je najgora stvar koju si ikada napravio u svom životu, a nikome je nisi rekao?",

            category: "confession",

            intensity: 8,

            followUp: "confession_worst"

        }

    ]

};

  

// Dramatični komentari voditelja

const HOST_COMMENTS = {

    // Početni komentari

    intro: [

        "Dobrodošao u psihološki labirint tvoje duše. Ovdje nema mjesta lažima.",

        "Vidim ti strah u očima. To je dobro. Strah je prvi korak prema istini.",

        "21 pitanje stoji između tebe i pola milijuna kuna. Ali cijena istine je uvijek veća od novca."

    ],

  

    // Komentari na DA odgovore po kategorijama

    yes_responses: {

        moral: [

            "Ah, moral... Ta krhka granica između civilizacije i divljaštva. Prekršio si je.",

            "Svaki čin ima svoju cijenu. Pitanje je jesi li spreman platiti svoju.",

            "Savjest je ono što razlikuje ljude od životinja. Izgleda da si svoj dio ostavio iza sebe."

        ],

        family: [

            "Obitelj... Oni koji nas trebaju najviše voljeti i koje mi trebamo najviše voljeti. A ipak...",

            "Krv od krvi, meso od mesa. A ti si protiv njih okrenuo svoje najmračnije misli.",

            "Ljubav prema obitelji nije uvjetna. Osim, izgleda, u tvom slučaju."

        ],

        relationships: [

            "Ljubav je najčešća laž koju govorimo. Ti si to upravo potvrdio.",

            "Srce može biti najokrutniji dio ljudskog tijela. Tvoje je dokaz tome.",

            "Vjerojatno misliš da je to bilo opravdano. Oni koje si povrijedio misle drugačije."

        ],

        sexuality: [

            "Ah, seksualnost... Najskrivljeniji dio ljudske prirode. Tvoj je posebno zanimljiv.",

            "Što god se događa u tami tvoje spavaće sobe, svjetlo istine to sada razotkriva.",

            "Neki ljudi sanje o normalnim stvarima. Ti, očito, ne spadaš u tu kategoriju."

        ],

        violence: [

            "Nasilje je jezik koji svi razumiju, a ti ga, izgleda, tečno govoriš.",

            "Ruke koje mogu ljubiti mogu i raniti. Tvoje su odabrale raniti.",

            "Postoji tanka linija između misli i čina. Ti si tu liniju prešao."

        ],

        dark_thoughts: [

            "Ah, stigli smo do dna tvoje duše. Nije lijepo ono što vidim tamo.",

            "Neki ljudi imaju tamu u sebi. Ti imaš ponor.",

            "Ovo više nije igra, je li? Ovo je ispovijed."

        ]

    },

  

    // Komentari na NE odgovore

    no_responses: [

        "Hmm... Ili si iznimno čist, ili iznimno dobar lažljivac.",

        "Svaka čast... ako je istina. Sumnjam da jest.",

        "Možda si pametan i kontroliraš što otkrivvaš. Možda si samo dosadan.",

        "NE može biti najskuplja riječ koju ćeš ikad izgovoriti.",

        "Kažeš ne, ali tvoje oči govore drukčije.",

        "Čak i sveci imaju grijehe. Ti, očito, nisi svetac - niti grešnik."

    ],

  

    // Komentari na sporu reakciju (preko 3 sekunde)

    slow_response: [

        "Hm... Trebalo ti je vremena da razmisliš. Istina boli, zar ne?",

        "Oklijevanje je prvi znak laži. Ili drugi znak istine.",

        "Što duže čekaš, to je odgovor bolniji.",

        "Vrijeme otkriva sve. Upravo je otkrilo tvoju nelagodu.",

        "Šutnja govori glasnije od riječi. Tvoja je urlala."

    ],

  

    // Komentari na brzu reakciju (ispod 1 sekunde)

    fast_response: [

        "Brzo... Prebrzo. Ovaj odgovor si vježbao, zar ne?",

        "Refleks može biti saveznik ili neprijatelj. U tvom slučaju - izdajica.",

        "Ljudi koji brzo odgovaraju ili govore istinu ili su vješti lažljivci.",

        "Brzina može sakriti mnoge stvari. Ali ne pred ovim pitanjima."

    ],

  

    // Prijelazi između razina

    level_transitions: {

        level2: "Prva razina je završena. 25.000 kuna je u tvom džepu. Ali stvarna igra tek počinje...",

        level3: "100.000 kuna... Osjećam kako ti se dlan znoji. Možda je vrijeme da prestaneš?",

        level4: "200.000 kuna. Stigli smo do srži tvoje duše. Nadam se da je spremna.",

        level5: "350.000 kuna. Ovdje se odvojčaju junaci od kukavica. U koju kategoriju spadaš?",

        level6: "Poslednje pitanje. Pola milijuna kuna. Jedna istina između tebe i bogatstva."

    },

  

    // Završni komentari

    endings: {

        won: "Čestitam. Osvojio si 500.000 kuna, ali izgubio dio duše. Nadam se da je vrijedilo.",

        quit_early: "Pametno. Neki tajne bolje da ostanu skrivene. Uzmi novac i idi.",

        lost: "Laž te je koštala svega. Možda će te sljedeći put naučiti da istina, koliko god bolna, uvijek pobjeđuje."

    }

};

  

// Novčani iznosi po razinama

const MONEY_LEVELS = {

    level1: 10000,

    level2: 25000,

    level3: 100000,

    level4: 200000,

    level5: 350000,

    level6: 500000

};

  

// Kontekstni opisi pitanja

const QUESTION_CONTEXTS = {

    1: "Svatko je barem jednom bio u iskušenju...",

    2: "Konkurencija je žestoka, a posao potreban...",

    3: "Bijes može biti snažniji od razuma...",

    4: "Obiteljski odnosi nisu uvijek bajka...",

    5: "Osveta je jelo koje se služi hladno...",

    6: "Prilika čini lopova, kažu...",

    7: "Uspjeh po svaku cijenu?",

    8: "Ljubav ili laž - granica je tanka...",

    9: "Moć nad nemoćnima može biti opojni osjećaj...",

    10: "Tabui postoje da se krše...",

    11: "Ljubomora je zeleno-eyed čudovište...",

    12: "Najcrnje fantazije žive u najdubljim kutovima uma...",

    13: "Lakše je pustiti da drugi pate...",

    14: "Ljubav i mržnja su dvije strane iste medalje...",

    15: "Kada život postane nepodnošljiv...",

    16: "Iskušenja su svugdje oko nas...",

    17: "Bijeg od realnosti ima mnoge oblike...",

    18: "Pravila su tu da se krše, zar ne?",

    19: "Neki ljudi jednostavno troše prostor...",

    20: "Nevinost pobuđuje različite instinkte...",

    21: "Vrijeme je za konačnu ispovijed..."

};
