export type Language = 'uz' | 'ru';

export interface Variant {
    colorUz: string;
    colorRu: string;
    images: string[];
}

export interface LocalizedData {
    title: string;
    description: string;
    characteristics: string[];
}

export interface Seller {
    name: string;
    logo: string;
    rating: number;
    reviewsCount: number;
    ordersCount: string;
    registrationDate: string;
    url: string;
}

export interface Product {
    id: number;
    price: string;
    costPrice?: string;
    category: string;
    image: string;
    uzumUrl: string;
    yandexUrl?: string;
    inStock: boolean;
    gallery?: string[];
    uz: LocalizedData;
    ru: LocalizedData;
    variants?: Variant[];
    seller?: Seller;
    source?: 'uzum' | 'china' | 'yandex' | 'direct';
    stockQuantity?: number;
    uzumId?: number;
    skuId?: number;
}

export const unifiedProducts: Product[] = [
    {
        id: 1,
        price: "62 250 so'm",
        category: "Go'zallik",
        image: "https://images.uzum.uz/d557qv3s2tab83s7uhe0/original.jpg",
        uzumUrl: "https://uzum.uz/ru/product/nabor-gubnykh-pomad-2178833",
        inStock: true,
        stockQuantity: 100,
        gallery: [
            "https://images.uzum.uz/d557qv3s2tab83s7uhe0/original.jpg",
            "https://images.uzum.uz/d4qbh6btqdhgicasmeug/original.jpg",
            "https://images.uzum.uz/d4qbh6gjsv1o95cgn0v0/original.jpg",
            "https://images.uzum.uz/d4qbh6rtqdhgicasmevg/original.jpg",
            "https://images.uzum.uz/d4qbh6js2taeh326shog/original.jpg"
        ],
        uz: {
            title: "Lana Del Rey lab bo'yog'i to'plami (4 rang)",
            description: "Lana Del Rey 4 ta rangli lab bo'yog'i to'plami - bu shunchaki kosmetika mahsuloti emas, balki qiyofa, kayfiyat va uslubni ta'kidlaydigan to'liq aksessuardir. To'plamga har kuni foydalanish uchun ham, kechki tadbirlar uchun ham mos tushadigan to'rtta universal rang kiradi. Har bir lab bo'yog'i yumshoq kremsi tuzilishga ega bo'lib, u tekis qatlamda surtiladi va lablarda og'irlik hissini keltirib chiqarmaydi. Namlantiruvchi komponentlar tufayli lab bo'yog'i kun davomida lablarni quritmaydi va chiroyli, parvarish qilingan ko'rinishni ta'minlaydi. Bardoshli pigment uzoq vaqt saqlanib qoladi, ovqatlanish va ichimliklardan keyin ham o'chib ketmaydi. To'plamning asosiy afzalliklaridan biri uning g'ayritabiiy qadog'idir: sigaret qutisi ko'rinishidagi zamonaviy kreativ quti. Bunday dizayn to'plamni nafaqat kosmetika vositasi, balki foto, video va sovg'alar uchun juda mos tushadigan moddiy elementga aylantiradi. Qadoqlash e'tiborni tortadi, yorqin, zamonaviy va standart kosmetik qutilardan ajralib turadi.",
            characteristics: [
                "To'plamga har qanday ko'rinish uchun 4 ta universal va ommabop soya kiradi",
                "Bardoshli pigment uzoq davom etadi va to'yinganlikni saqlaydi",
                "Kunduzgi va kechki pardoz uchun mos keladi",
                "Foto, video va kontent yaratish uchun ajoyib tanlov",
                "Qizlar va kosmetika ixlosmandlari uchun ideal sovg'a",
                "Kremsi yumshoq tuzilish oson surtiladi va lablarni og'irlashtirmaydi",
                "Namlantiruvchi formula lab terisini quritmaydi",
                "Zamonaviy sigaret qutisi ko'rinishidagi noyob qadoqlash boshqalardan ajralib turadi",
                "Yilni format sumkada yoki yo'lda olib yurish uchun qulay",
                "Har bir lab bo'yog'i gigienik tarzda qadoqlangan va ishonchli himoyalangan"
            ]
        },
        ru: {
            title: "Набор губных помад Lana Del Rey (4 цвета)",
            description: "Набор губных помад Lana Del Rey на 4 оттенка — это не просто косметический продукт, а полноценный аксессуар, который подчеркивает образ, настроение и стиль. В комплект входят четыре универсальных оттенка, идеально подходящих как для повседневного макияжа, так и для вечерних выходов. Каждая помада обладает мягкой кремовой текстурой, которая легко наносится, ложится ровным слоем и не создаёт тяжести на губах. Благодаря увлажняющим компонентам помада не сушит кожу губ, сохраняет комфорт на протяжении всего дня и обеспечивает естественный, ухоженный вид.",
            characteristics: [
                "В набор входит 4 универсальных и популярных оттенка для любого образа",
                "Стойкий пигмент держится долго и сохраняет насыщенность",
                "Подходит как для дневного, так и для вечернего макияжа",
                "Отличный выбор для фото, видео и создания контента",
                "Идеальный вариант для подарка девушкам и любительницам косметики",
                "Кремовая мягкая текстура легко наносится и не утяжеляет губы",
                "Увлажняющая формула не сушит кожу губ",
                "Уникальная упаковка в виде стильной сигаретной коробки выделяется среди других",
                "Компактный формат удобен для ношения в сумке или в дороге",
                "Каждая помада упакована гигиенично и надёжно защищена"
            ]
        }
    },
    {
        id: 2,
        price: "41 650 so'm",
        category: "Hazil",
        image: "https://images.uzum.uz/d3lk3rrq345l7k05k9dg/original.jpg",
        uzumUrl: "https://uzum.uz/ru/product/spider-box-derevyannyj-2025302?skuId=7185524",
        inStock: true,
        stockQuantity: 100,
        uz: {
            title: "Spider Box - Hazil quti (O'rgimchak)",
            description: "O'RGIMCHAK BILAN QUTI - HAZILLAR UCHUN IDEAL!\n😱 Kutilmagan syurpriz! Kimdir qutini ochsa, u yerdan o'rgimchak sakrab chiqadi va hissiyotlar bo'ronini keltirib chiqaradi.\n🎁 Do'stlar va oila uchun ajoyib sovg'a! Yaqinlaringizni xursand qilish va ularning qiziqarli reaktsiyasini ko'rish uchun ideal tanlov.\n🔨 Sifatli materiallar! Quti tabiiy yog'ochdan tayyorlangan, mustahkam va bardoshli.\n😂 Quvonch va kulgi! Har qanday partiyani, tug'ilgan kunni yoki oddiy kunni rang-barang qilishning ajoyib usuli.\n🕷 Haqiqiy o'rgimchak! Qora o'rgimchak shunchalik haqiqiy ko'rinadiki, u bir qarashda qo'rqitadi.\n✔ Mexanik ishlash printsipi! Batareyalar talab qilinmaydi - shunchaki qopqoqni oching.\n💡 Hamma uchun mos! Kattalar uchun ham, bolalar uchun ham qiziqarli o'yinchoq, do'stlar va hamkasblarning kayfiyatini ko'tarishning ajoyib usuli.\n📏 Hajmi: 10x6,5x7,5 sm\n🛒 Hoziroq buyurtma bering va quvonch ulashing!",
            characteristics: [
                "Ixcham o'lcham - ko'p joy egallamaydi",
                "Ekologik xavfsiz - zararsiz materiallardan tayyorlangan",
                "Yengil vazn - olib yurish va tashish uchun qulay",
                "Universal foydalanish - uy va ofis uchun mos keladi",
                "Zamonaviy dizayn - har qanday interyerni to'ldiradi",
                "Foydalanish oson - qulay va tushunarli boshqaruv",
                "Ko'p funktsiyali - har xil maqsadlar uchun mos keladi",
                "Ideal sovg'a - yaqinlar uchun ajoyib tanlov",
                "Bardoshli - mustahkam qurilish va sifatli ishlab chiqarish",
                "Sifatli material - uzoq muddatli foydalanish uchun mustahkam"
            ]
        },
        ru: {
            title: "Spider Box — деревянный ящик с пауком (Розыгрыш)",
            description: "КОРОБКА С ПАУКОМ – ИДЕАЛЬНА ДЛЯ РОЗЫГРЫШЕЙ!\n😱 Неожиданный сюрприз! Когда кто-то откроет коробку, оттуда выпрыгнет паук, вызвав бурю эмоций.\n🎁 Отличный подарок для друзей и семьи! Идеальный выбор, чтобы повеселить близких и увидеть их забавную реакцию.\n🔨 Качественные материалы! Коробка сделана из натурального дерева, прочная и долговечная.\n😂 Веселье и смех! Прекрасный способ разнообразить любую вечеринку, день рождения или обычный день.\n🕷 Реалистичный паук! Черный паук выглядит настолько правдоподобно, что пугает с первого взгляда.\n✔ Механический принцип работы! Не требует батареек – просто откройте крышку.\n💡 Подходит для всех! Веселая игрушка как для взрослых, так и для детей, отличный способ поднять настроение друзьям и коллегам.\n📏 Размер: 10x6.5x7.5 см\n🛒 Заказывайте прямо сейчас и дарите радость!",
            characteristics: [
                "Компактный размер – не занимает много места",
                "Экологическая безопасность – изготовлен из безвредных материалов",
                "Лёгкий вес – удобно носить и транспортировать",
                "Универсальное применение – подходит для дома и офиса",
                "Современный дизайн – дополняет любой интерьер",
                "Простота в использовании – удобное и понятное управление",
                "Многофункциональность – подходит для различных целей",
                "Идеальный подарок – отличный выбор для близких",
                "Долговечность – прочная конструкция и качественное производство",
                "Качественный материал – прочный для долгого использования"
            ]
        }
    },
    {
        id: 3,
        price: "67 500 so'm",
        category: "Sovg'a",
        image: "https://images.uzum.uz/d55t2f7njr2qv2v2clfg/original.jpg",
        uzumUrl: "https://uzum.uz/ru/product/snezhnyj-suvenir-na-2025331?skuId=7185689",
        inStock: true,
        stockQuantity: 100,
        uz: {
            title: "Qorli suvenir (Yangi yil sovg'asi + tungi chiroq)",
            description: "Sizning xonangiz uchun ajoyib dekor - \"Qor effekti bilan lampochka\" to'plami (DIY)! Ushbu to'plam yordamida siz o'z qo'llaringiz bilan qor effektli chiroq yaratishingiz mumkin. Bu nafaqat qiziqarli mashg'ulot, balki tayyor natija xonangizni shinam va romantik joyga aylantiradi.",
            characteristics: [
                "O'z qo'llaringiz bilan yig'ish uchun mo'ljallangan DIY to'plami",
                "Yorqin LED yoritgich va qor effekti bilan jihozlangan",
                "Ekologik xavfsiz materiallardan tayyorlangan",
                "Ixcham o'lchamlar: 15 sm x 7 sm x 3 sm",
                "Oddiy va qiziqarli yig'ish jarayoni",
                "Xonaga romantik va sehrli muhit qo'shadi",
                "Sovg'a uchun ideal tanlov",
                "Yaltiroq kukun va dekorativ elementlarni o'z ichiga oladi",
                "Foydalanuvchilar uchun ko'rsatmalar va video qo'llanma taqdim etiladi"
            ]
        },
        ru: {
            title: "Снежный сувенир (Ночник + набор)",
            description: "Отличный декор для вашей комнаты – набор \"Лампочка с эффектом снега\" (DIY)! С этим набором вы сможете создать лампу со снежным эффектом своими руками. Это не только увлекательное занятие, но и готовый результат преобразит вашу комнату в уютное и романтическое место.",
            characteristics: [
                "Набор DIY, созданный для сборки своими руками",
                "Оснащен яркой LED-подсветкой и эффектом снега",
                "Изготовлен из экологически безопасных материалов",
                "Компактные размеры: 15 см x 7 см x 3 см",
                "Простой и увлекательный процесс сборки",
                "Добавляет романтическую и волшебную атмосферу в комнату",
                "Идеальный выбор для подарка",
                "Включает сверкающий порошок и декоративные элементы",
                "Предоставляются инструкция и видео-руководство для пользователей"
            ]
        }
    },
    {
        id: 4,
        price: "67 500 so'm",
        category: "Avto",
        image: "https://images.uzum.uz/d3g62h8op562uss35umg/original.jpg",
        uzumUrl: "https://uzum.uz/ru/product/protivoskolzyaschij-silikonovyj-kovrik-2005362?skuId=7105001",
        inStock: true,
        stockQuantity: 100,
        uz: {
            title: "Avtomobil uchun sirpanmaydigan silikon gilamcha",
            description: "Avtomobil panelidagi sirpanmaydigan gilamcha - tartib va qulaylik uchun eng yaxshi yechim! 🚗 Ushbu universal sirpanishga qarshi gilamcha bilan avtomobilingizda doimo tartib bo'ladi. Telefon, kalitlar, kartalar va boshqa mayda-chuyda narsalar endi panelda sirpanib ketmaydi.\n✅ Afzalliklari:\n- Sirpanishga qarshi material - telefon va kalitlarni ishonchli mahkamlaydi.\n- Telefon uchun maxsus ushlab turgich - navigatsiya va qo'ng'iroqlar uchun qulay.\n- Avto-vizitka funksiyasi - to'xtash joyida telefon raqamingizni qoldiring.\n- Universal o'lcham - har qanday avtomobil paneliga mos keladi.\n- Oson tozalash - suv bilan yuvish kifoya.\n- Issiq va sovuqqa chidamlilik - erimaydi va yorilmaydi.\n- Egiluvchan va bardoshli - uzoq vaqt xizmat qiladi.",
            characteristics: [
                "Telefon uchun maxsus ushlab turgich bilan jihozlangan",
                "Material: yuqori sifatli sirpanmaydigan silikon",
                "Raqamni joylashtirish imkoniyati (avto-vizitka)",
                "Universal o'lcham - har qanday avto paneliga mos keladi",
                "Telefon, kalitlar, kartalar va mayda narsalarni qulay saqlaydi",
                "Issiq va sovuqqa chidamli - erimaydi va yorilmaydi",
                "G'amxo'rlik qilish oson - suv bilan yuvish mumkin",
                "Egiluvchan va bardoshli - uzoq muddatli foydalanish",
                "Yelim va mahkamlagichlarsiz o'rnatiladi",
                "Zamonaviy dizayn"
            ]
        },
        ru: {
            title: "Противоскользящий силиконовый коврик для авто",
            description: "Противоскользящий коврик на панель автомобиля – лучшее решение для порядка и удобства! 🚗 С этим универсальным антискользящим ковриком в вашем авто всегда будет порядок. Телефон, ключи, карты и другие мелочи больше не будут скользить по панели.\n✅ Преимущества:\n- Противоскользящий материал – надёжно фиксирует телефон и ключи.\n- Специальный держатель для телефона – удобно для навигации и звонков.\n- Функция авто-визитки – оставляйте номер телефона при парковке.\n- Универсальный размер – подходит для любой панели автомобиля.\n- Лёгкая очистка – достаточно промыть водой.\n- Устойчивость к жаре и холоду – не плавится и не трескается.\n- Гибкий и прочный – служит долго.",
            characteristics: [
                "Оснащён специальным держателем для телефона",
                "Материал: высококачественный противоскользящий силикон",
                "Возможность размещения номера (авто-визитка)",
                "Универсальный размер – подходит для любой панели авто",
                "Удобно хранит телефон, ключи, карты и мелкие предметы",
                "Устойчив к жаре и холоду – не плавится и не трескается",
                "Лёгкий в уходе – можно мыть водой",
                "Гибкий и прочный – долговечный в использовании",
                "Устанавливается без клея и креплений",
                "Современный дизайн"
            ]
        }
    },
    {
        id: 5,
        price: "87 120 so'm",
        category: "Aksesuarlar",
        image: "https://images.uzum.uz/d3nltu34eu2imgle78v0/original.jpg",
        uzumUrl: "https://uzum.uz/ru/product/karmannye-chasy-s-karamelnyj---10-2032991?skuId=7247952",
        inStock: true,
        stockQuantity: 100,
        uz: {
            title: "Cho'ntak soati (Antikvar uslub)",
            description: "Ushbu nafis zanjirli cho'ntak soati bilan uslub va nafosat muhitiga sho'ng'ing. Korpus bardoshli sink qotishmasidan qilingan, shishasi yuqori sifatli va tirnalishga chidamli. Kvars mexanizmi aniqlik va ishonchlilikka kafolat beradi. Old qopqog'idagi nafis naqsh va orqa qismidagi o'yma naqsh soatga vintaj jozibasini beradi. 80 sm uzunlikdagi zanjir tufayli soatni cho'ntagingizda yoki bo'yningizda taqish qulay.\n📦 To'plamda: soat + zanjir\n🔋 Batareya turi: AG4 yoki analogi\n📐 Olchamlari: 6×4,6×1,5 sm\n🎁 Ota, hamkasb, do'st yoki yubiley uchun ideal sovg'a.",
            characteristics: [
                "Antikvar uslubdagi oqlangan dizayn",
                "Sink qotishmasidan tayyorlangan mustahkam korpus",
                "Kvars mexanizmida ishlaydi, aniq harakat",
                "Yuqori sifatli shisha bilan jihozlangan",
                "Dekorativ naqshli old qopqoq",
                "Uzunligi 80 sm bo'lgan metall zanjir",
                "Cho'ntakda yoki bo'yinda taqish uchun mos",
                "Almashtiriladigan batareya (AG4 yoki analogi)",
                "Ixcham va yengil o'lcham (6×4,6×1,5 sm)",
                "Sovg'a uchun ajoyib qulaylik"
            ]
        },
        ru: {
            title: "Карманные часы в антикварном стиле (Классика)",
            description: "Погрузитесь в атмосферу стиля и утончённости с этими элегантными карманными часами на цепочке. Корпус изготовлен из прочного цинкового сплава, стекло – качественное и устойчивое к царапинам. Кварцевый механизм гарантирует точность и надёжность. Передняя крышка с изящным узором и гравировка на задней части придают часам винтажный шарм. Благодаря цепочке длиной 80 см часы удобно носить в кармане или на шее.\n📦 В комплекте: часы + цепочка\n🔋 Тип батарейки: AG4 или аналог\n📐 Размеры: 6×4.6×1.5 см\n🎁 Идеальный подарок для отца, коллеги, друга или на юбилей.",
            characteristics: [
                "Элегантный дизайн в антикварном стиле",
                "Прочный корпус из цинкового сплава",
                "Работает на кварцевом механизме, точный ход",
                "Оснащён качественным стеклом",
                "Передняя крышка с декоративным узором",
                "Металлическая цепочка длиной 80 см",
                "Подходит для ношения в кармане или на шее",
                "Сменная батарейка (AG4 или аналог)",
                "Компактный и лёгкий размер (6×4.6×1.5 см)",
                "Отличный вариант для подарка"
            ]
        }
    },
    {
        id: 6,
        price: "89 100 so'm",
        category: "Gadjetlar",
        image: "https://images.uzum.uz/d3u9frej76ol453ciji0/original.jpg",
        uzumUrl: "https://uzum.uz/ru/product/gf07-mini-gps-2056258?skuId=7325974",
        inStock: true,
        stockQuantity: 100,
        uz: {
            title: "GF-07 Mini GPS Tracker",
            description: "Kichik o'lcham, yengil vazn va tashish qulayligi. Yashirish oson bo'lgan qora korpus, transport vositalarini, o'smirlarni, turmush o'rtoqlarni, qariyalarni yoki aktivlarni kuzatish uchun ideal. Ichkarida ikkita kuchli magnit mavjud bo'lib, ular qo'shimcha o'rnatishsiz transport vositasiga osongina ulanadi. Sizga kerak bo'lgan narsa - real vaqt rejimida Internetda (Google xaritasi) kuzatishingiz va ko'rsatishingiz mumkin bo'lgan qurilmaga joylashtirish uchun ishlaydigan SIM-karta (bundan mustasno!). SIM-karta raqamini terish orqali sizi treker atrofidagi ovozni eshitishingiz mumkin, chiroqlar va shovqin yo'q.",
            characteristics: [
                "Mahsulot turi: Kuzatuv qurilmasi",
                "Tarmoq turi: GSM/GPRS",
                "Ish kuchlanishi: 3,4-4,2 V doimiy tok",
                "Chiqish quvvati: 5 V doimiy tok, 300-500 mA",
                "Batareya quvvati: 3,7 V 400 mA/soat litiy-ion batareya",
                "Aloqa chastotasi: 850/900/1800/1900 MGts",
                "Zaryadlash kirishi: Kirish AC110-220V 50/60Hz",
                "Saqlash harorati: -40 ℃ dan +85 ℃ gacha",
                "Ishlash harorati: -20 ℃ dan +55 ℃ gacha",
                "Kengaytirish kartalari: Mini TF karta",
                "Uzluksiz qo'ng'iroqlar: 150-180 minut",
                "Namlik diapazoni: kondensatsiyasiz 5%-95%",
                "GPRS: yuklash 60, TCP/IP"
            ]
        },
        ru: {
            title: "GF-07 Mini GPS Tracker (Магнитный)",
            description: "Небольшой размер, легкий вес и удобство переноски. Черная оболочка, которую легко спрятать, идеальное отслеживание транспортных средств, подростков, супругов, пожилых людей или активов. Внутри находятся два мощных магнита, которые легко крепятся к транспортному средству без дополнительной установки. Все, что вам нужно, это рабочая SIM-карта (исключая!) для вставки в устройство, которое вы можете отслеживать и отображать в Интернете в режиме реального времени (карта Google). Набрав номер SIM-карты, вы можете слышать звук вокруг трекера, ни огней, ни шума",
            characteristics: [
                "Тип товара: Устройство слежения",
                "Тип сети: GSM/GPRS",
                "Рабочее напряжение: 3,4-4,2 В постоянного тока",
                "Выходная мощность: 5 В постоянного тока, 300-500 мА",
                "Емкость аккумулятора: литий-ионный аккумулятор 3,7 В 400 мАч",
                "Частота связи: 850/900/1800/1900 МГц",
                "Вход для зарядки: Вход AC110-220V 50/60Hz",
                "Температура хранения: от -40℃ до +85℃",
                "Рабочая температура: от -20℃ до +55℃",
                "Карты расширения: Mini TF карта",
                "Непрерывные звонки: 150-180 мин.",
                "Диапазон влажности: 5%-95% без конденсации",
                "GPRS: загрузка 60, TCP/IP"
            ]
        }
    },
    {
        id: 7,
        price: "331 550 so'm",
        category: "Gadjetlar",
        image: "https://images.uzum.uz/d3p3fsbs2ta8m27e48gg/original.jpg",
        uzumUrl: "https://uzum.uz/ru/product/ruchka-s-videokameroj-2038777",
        inStock: true,
        stockQuantity: 100,
        gallery: [
            "https://images.uzum.uz/d3p3fsbs2ta8m27e48gg/original.jpg",
            "https://images.uzum.uz/d3p3fsbq345pkir6glog/original.jpg",
            "https://images.uzum.uz/d3p3fsbs2ta8m27e48g0/original.jpg",
            "https://images.uzum.uz/d3p3fsbq345pkir6glo0/original.jpg",
            "https://images.uzum.uz/d3p3fsb4eu2ogp30oqg0/original.jpg",
            "https://images.uzum.uz/d3p3fsbs2ta8m27e48fg/original.jpg",
            "https://images.uzum.uz/d3p3fsbq345pkir6glng/original.jpg"
        ],
        uz: {
            title: "Videokamera va diktafonli ruchka BPR 6",
            description: "Oddiy ruchka shaklidagi videokamera va diktafon. Ushbu ixcham qurilma yuqori sifatli audio va videolarni sezilmas holda yozib olish uchun mo'ljallangan. Ish, o'qish va kundalik hayotdagi muhim daqiqalarni yozib olish uchun juda mos keladi.",
            characteristics: [
                "Ixcham o'lchamlar va oddiy boshqaruv",
                "Ofis, o'qish, muzokaralar va kundalik hayot uchun mos keladi",
                "Ruchka ko'rinishidagi dizayn - sezilmas foydalanish",
                "Bitta qurilmada video, audio va foto",
                "USB orqali kompyuterga qulay ulanish"
            ]
        },
        ru: {
            title: "Ручка с видеокамерой и диктофоном BPR 6",
            description: "Видеокамера и диктофон в форме обычной ручки. Это компактное устройство предназначено для незаметной записи аудио и видео высокого качества. Идеально подходит для работы, учебы и фиксации важных моментов в повседневной жизни.",
            characteristics: [
                "Компактные размеры и простое управление",
                "Подходит для офиса, учебы, переговоров и повседневной жизни",
                "Дизайн в виде ручки — незаметное использование",
                "Видео, аудио и фото в одном устройстве",
                "Удобное подключение к ПК через USB"
            ]
        }
    },
    {
        id: 8,
        price: "13 500 so'm",
        category: "Hazil",
        image: "https://images.uzum.uz/d3lkr53q345l7k05kgg0/original.jpg",
        uzumUrl: "https://uzum.uz/ru/product/dollar-suvenir-nenastoyaschie-2025367?skuId=7185912",
        inStock: true,
        stockQuantity: 100,
        uz: {
            title: "Suvenir dollar (Ko'ngilochar)",
            description: "Mini-dollarlar - haqiqiy kupyuralarning miniatyuradagi original suveniri va nusxasi. O'yinlar, fotosessiyalar, dekoratsiya yoki g'ayritabiiy sovg'a sifatida ishlatiladi. Chop etish deformatsiyalanmaydigan bardoshli qog'ozda yuqori aniqlik bilan amalga oshiriladi. Mini-o'lcham ularni o'zingiz bilan olib yurishni osonlashtiradi. Bolalarni o'rgatish va kollektsiya qilish uchun mos keladi.",
            characteristics: [
                "Olchami: 3x1 sm",
                "Material: Yuqori sifatli qog'oz",
                "Dizayn: Haqiqiy dollar kupyuralarining miniatyura nusxasi",
                "To'plamda: 5, 10, 20, 50, 100 dollar",
                "Foydalanish: O'yinlar, fotosessiyalar, dekor, sovg'a",
                "Yuqori tafsilot: Aniq bosma va yorqin ranglar"
            ]
        },
        ru: {
            title: "Доллар сувенир (Купюра 100 USD)",
            description: "Мини-доллары – оригинальный сувенир и копия настоящих купюр в миниатюре. Используются для игр, фотосессий, декора или в качестве необычного подарка. Печать выполнена с высокой четкостью на прочной бумаге, которая не деформируется. Мини-размер позволяет легко носить их с собой. Подходит для обучения детей и коллекционирования.",
            characteristics: [
                "Размер: 3x1 см",
                "Материал: Высококачественная бумага",
                "Дизайн: Миниатюрная копия настоящих долларовых купюр",
                "В наборе: 5, 10, 20, 50, 100 долларов",
                "Применение: Игры, фотосессии, декор, подарок",
                "Высокая детализация: Четкая печать и яркие цвета"
            ]
        }
    },
    {
        id: 9,
        price: "44 100 so'm",
        category: "Kiyim",
        image: "https://images.uzum.uz/d3g6068n274tencldmv0/original.jpg",
        uzumUrl: "https://uzum.uz/ru/product/balaklava-sharfmaska-kapyushonsharf-belyj---5-2005361?skuId=7104998",
        inStock: true,
        stockQuantity: 100,
        uz: {
            title: "Balaklava - Taktik niqob (Oq)",
            description: "Balaklava - bu himoya va qulaylikning universal vositasi. U yuzni noqulay ob-havo sharoitidan ishonchli himoya qiladi. Sportchilar va faol dam olishni yaxshi ko'radiganlar uchun ideal. Terini bezovta qilmaydigan va mukammal shamollatishni ta'minlaydigan yuqori sifatli materialdan tayyorlangan.",
            characteristics: [
                "Material: Nafas oladigan, yumshoq va gipoallergen",
                "Universallik: Niqob, sharf, kapyushon yoki baff sifatida kiyish mumkin",
                "Himoya: Shamol, sovuq, chang va quyoshdan",
                "Foydalanish: Velosiped, mototsikl, yugurish, chang'i, hayking",
                "O'lchami: Uniseks (erkaklar, ayollar va bolalar uchun mos)",
                "Xususiyatlari: Tez quriydi, yengil va ixcham"
            ]
        },
        ru: {
            title: "Балаклава - Снуд тактический (Белая)",
            description: "Балаклава – это универсальное средство защиты и комфорта. Она надёжно защищает лицо от неблагоприятных погодных условий. Идеальна для спортсменов и любителей активного отдыха. Изготовлена из качественного материала, который не раздражает кожу и обеспечивает отличную вентиляцию.",
            characteristics: [
                "Материал: Дышащий, мягкий и гипоаллергенный",
                "Универсальность: Можно носить как маску, шарф, капюшон или бафф",
                "Защита: От ветра, холода, пыли и солнца",
                "Применение: Велосипед, мотоцикл, бег, лыжи, хайкинг",
                "Размер: Унисекс (подходит мужчинам, женщинам и детям)",
                "Особенности: Быстро сохнет, легкая и компактная"
            ]
        }
    },
    {
        id: 10,
        price: "775 030 so'm",
        category: "Gadjetlar",
        image: "https://images.uzum.uz/d55t1f7njr2qv2v2ckv0/original.jpg",
        uzumUrl: "https://uzum.uz/ru/product/umnye-ochki-s-2102090?skuId=7521019",
        inStock: true,
        stockQuantity: 100,
        uz: {
            title: "AI funksiyali aqlli ko'zoynak (Kamera, Bluetooth)",
            description: "GL ONE aqlli ko'zoynaklari - bu kamera, Bluetooth quloqchinlari va onlayn tarjimonni o'zida mujassam etgan sun'iy intellektga ega yuqori texnologiyali gadjet. Toza ovoz yozish uchun shovqinni kamiyatirish (EIS) mikrofonlari bilan jihozlangan. Qo'llarni ishlatmasdan kontent yaratish, musiqa tinglash va qo'ng'iroqlarga javob berish imkonini beradi. Fayllarni bir zumda almashish uchun ilova orqali smartfon bilan sinxronlanadi.",
            characteristics: [
                "Kamera: 8 MP HD",
                "Video: Full HD 1080p / 30 kadr/sek",
                "Ko'rish burchagi: 105°",
                "Batareya: 270 mA/soat",
                "Himoya: IP65 (namlik va changdan)",
                "Ulanish: Bluetooth + Wi-Fi",
                "Moslik: Android / iOS",
                "Ilova: LensMoo"
            ]
        },
        ru: {
            title: "Умные очки с функциями AI (Камера, Bluetooth)",
            description: "Смарт-очки GL ONE — это высокотехнологичный гаджет с искусственным интеллектом, сочетающий в себе камеру, Bluetooth-наушники и онлайн-переводчик. Оснащены микрофоном с шумоподавлением (EIS) для чистой записи звука. Позволяют снимать контент, слушать музыку и отвечать на звонки без использования рук. Синхронизируются со смартфоном через приложение для мгновенного обмена файлами.",
            characteristics: [
                "Камера: 8 МП HD",
                "Видео: Full HD 1080p / 30 fps",
                "Угол обзора: 105°",
                "Аккумулятор: 270 мАч",
                "Защита: IP65 (от влаги и пыли)",
                "Подключение: Bluetooth + Wi-Fi",
                "Совместимость: Android / iOS",
                "Приложение: LensMoo"
            ]
        }
    },
    {
        id: 11,
        price: "44 100 so'm",
        category: "Kiyim",
        image: "https://images.uzum.uz/d3g60a0op562uss35u90/original.jpg",
        uzumUrl: "https://uzum.uz/ru/product/balaklava-sharfmaska-kapyushonsharf-khaki---9-2005361?skuId=7105000",
        inStock: true,
        stockQuantity: 100,
        uz: {
            title: "Balaklava - Taktik niqob (Xaki)",
            description: "Xaki rangidagi taktik balaklava mukammal himoya va niqoblanishni ta'minlaydi. Yilning istalgan vaqtida foydalanish uchun mos keladi: qishda isitadi, yozda esa qizib ketish va changdan himoya qiladi. Uniseks modeli har qanday bosh o'lchamiga juda mos tushadi va uzoq vaqt kiyganda qulaylikni ta'minlaydi.",
            characteristics: [
                "Material: Nafas oladigan, yumshoq va gipoallergen",
                "Universallik: 4-si-1-da (niqob, sharf, kapyushon, baff)",
                "Himoya: Har mavsum uchun (sovuq, shamol, chang, ultrabinafsha nurlar)",
                "Dizayn: Taktik xaki rangi",
                "Foydalanish: Sport, turizm, motosport",
                "Parvarish: Tez quriydigan material"
            ]
        },
        ru: {
            title: "Балаклава - Снуд тактический (Хаки)",
            description: "Тактическая балаклава в цвете хаки обеспечивает превосходную защиту и маскировку. Подходит для использования в любое время года: зимой согревает, а летом защищает от перегрева и пыли. Модель унисекс идеально садится на любой размер головы, обеспечивая комфорт при длительном ношении.",
            characteristics: [
                "Материал: Дышащий, мягкий и гипоаллергенный",
                "Универсальность: 4-в-1 (маска, шарф, капюшон, бафф)",
                "Защита: Всесезонная (холод, ветер, пыль, УФ-лучи)",
                "Дизайн: Тактический цвет хаки",
                "Применение: Спорт, туризм, мотоспорт",
                "Уход: Быстросохнущий материал"
            ]
        }
    },
    {
        id: 12,
        price: "94 050 so'm",
        category: "Hobbi",
        image: "https://images.uzum.uz/d3honeon274ld4u69cpg/original.jpg",
        uzumUrl: "https://uzum.uz/ru/product/derevyannaya-khlopushka-dlya-2009792?skuId=7124394",
        inStock: true,
        stockQuantity: 100,
        uz: {
            title: "Kino Xlopushka (20x20 sm)",
            description: "Professional video kontent yaratish uchun ajralmas aksessuar. Ushbu yog'och xlopushka suratga olish jarayonini tashkil qilish hamda audio va video yo'llarini sinxronlashtirishga yordam beradi. Zamonaviy va amaliy dizayn uni studiya dekoratsiyasi yoki mavzuviy fotosessiyalar uchun ajoyib rekvizitga aylantiradi.",
            characteristics: [
                "Material: Bardoshli yuqori sifatli yog'och",
                "Olchami: 20 x 20 sm (ixcham)",
                "Yuzasi: Silliq, bo'r bilan yozish uchun mos",
                "Ovoz: Baland va aniq qarsak",
                "Maqsadi: Kinotasvirlar, fotosessiyalar, teatr",
                "Bardoshli: Ko'p marta foydalanish, tozalash oson"
            ]
        },
        ru: {
            title: "Деревянная хлопушка для кино (20x20 см)",
            description: "Незаменимый аксессуар для создания профессионального видеоконтента. Эта деревянная хлопушка помогает организовать процесс съёмки и синхронизировать аудио- и видеодорожки. Стильный и практичный дизайн делает её отличным реквизитом для декора студии или тематических фотосессий.",
            characteristics: [
                "Материал: Прочное высококачественное дерево",
                "Размер: 20 x 20 см (компактная)",
                "Поверхность: Гладкая, подходит для письма мелом",
                "Звук: Громкий и четкий хлопок",
                "Назначение: Киносъемки, фотосессии, театр",
                "Долговечность: Многоразовое использование, легко очищается"
            ]
        }
    },
];

export const translations = {
    uz: {
        header: {
            quality: "Sifat",
        },
        hero: {
            title_start: "PRESENTBOX — ",
            title_highlight: "antiqa va trenddagi",
            title_end: " mahsulotlar makoni",
            guarantee: "Kafolat",
            quality: "Sifat",
            support: "24/7 Yordam",
            all_products: "Barcha tovarlar",
            special_offer: "Maxsus taklif",
            special_desc: "Eng sara sovg'alar faqat bizda!",
            coupon: {
                front_title: "Maxsus taklif",
                front_subtitle: "Yutuqli sovg'a",
                front_action: "Kuponni aylantiring",
                back_text: "Omadli mahsulotni xarid qiling va 7,000 dan 77,000 so'mgacha bo'lgan yutuqqa ega bo'ling",
            }
        },
        products: {
            popular_title: "Ommabop",
            popular_highlight: "tovarlar",
            details: "Batafsil",
            low_stock: "Tez orada tugaydi",
        },
        benefits: {
            delivery: "Tezkor yetkazib berish",
            quality: "Original sifat",
            payment: "Qulay to'lov",
            return: "10 kunlik qaytarish",
        },
        about: {
            title: "Nega aynan PresentBox?",
            text: "Biz shunchaki do'kon emasmiz – biz trendlar yaratuvchimiz! PresentBox'da siz nafaqat gadjetlarni, balki ijtimoiy tarmoqlarni portlatayotgan eng so'nggi va noodatiy mahsulotlarni topasiz. Biz har kuni dunyo bo'ylab eng qaynoq yangiliklarni kuzatib boramiz va ularni birinchilardan bo'lib O'zbekistonga olib kelamiz. Sifat, tezkor yetkazib berish va o'zgacha uslub – bu bizning tashrif qog'ozimiz.",
        },
        faq: [
            {
                question: "Buyurtmani qanday rasmiylashtirsam bo‘ladi?",
                answer: "Mahsulotni tanlab, “Savatga qo‘shish” tugmasini bosing. So‘ng savatga o‘ting, aloqa ma’lumotlaringizni to‘ldiring va qulay to‘lov usulini tanlab buyurtmani tasdiqlang. Jarayon bir necha daqiqa vaqt oladi."
            },
            {
                question: "Buyurtma berish uchun ro‘yxatdan o‘tish shartmi?",
                answer: "Yo‘q, ro‘yxatdan o‘tish majburiy emas. Siz mehmon sifatida ham buyurtma berishingiz mumkin."
            },
            {
                question: "Buyurtmani bekor qilish yoki o‘zgartirish mumkinmi?",
                answer: "Agar buyurtma hali yetkazib berishga topshirilmagan bo‘lsa, uni bekor qilish yoki o‘zgartirish mumkin. Buning uchun iloji boricha tezroq biz bilan bog‘lanishingizni so‘raymiz."
            },
            {
                question: "Qaysi hududlarga yetkazib beriladi?",
                answer: "Biz O‘zbekiston bo‘ylab yetkazib beramiz. Yirik shaharlarga yetkazib berish tezroq amalga oshiriladi, uzoq hududlarda esa yetkazish muddati biroz farq qilishi mumkin."
            },
            {
                question: "Belgilangan vaqtda yetkazib berish mumkinmi?",
                answer: "Ha, oldindan kelishilgan holda belgilangan sana yoki vaqt oralig‘ida yetkazib berish imkoniyati mavjud. Buyurtma berishda yoki operator bilan bog‘lanib ushbu talabni bildirishingiz mumkin."
            },
            {
                question: "Qanday to‘lov usullari mavjud?",
                answer: "Siz buyurtma uchun quyidagi usullar orqali to‘lov qilishingiz mumkin:\n- Naqd pul\n- Bank kartalari (Uzcard / Humo)\n- Onlayn to‘lov tizimlari"
            },
            {
                question: "Naqd pul bilan to‘lash mumkinmi?",
                answer: "Ha, albatta. Buyurtmani qabul qilganingizda kuryerga naqd pul bilan to‘lash imkoniyati mavjud."
            },
            {
                question: "Nuqsonli mahsulot kelsa nima qilaman?",
                answer: "Agar mahsulot nuqsonli yoki shikastlangan holatda yetib kelsa, darhol biz bilan bog‘laning. Biz vaziyatni o‘rganib chiqib, almashtirish yoki qaytarish masalasini tezkor hal qilamiz."
            },
            {
                question: "Sizlar bilan qanday bog‘lanish mumkin?",
                answer: "Biz bilan quyidagi usullar orqali bog‘lanishingiz mumkin:\n- Telefon orqali 77 045 45 47\n- Telegram orqali @mirobidusmonov\n\nOperatorlarimiz ish vaqtida sizning murojaatingizga tezkor javob beradi."
            }
        ],
        footer: {
            support_btn: "Texnik yordamga yozish",
            rights: "© 2025 PresentBox. Barcha huquqlar himoyalangan.",
        },
        admin: {
            dashboard: "Dashboard",
            products: "Mahsulotlar",
            all_products: "Barcha mahsulotlar",
            categories: "Kategoriyalar",
            uzum: "Uzum Market",
            yandex: "Yandex",
            china: "Xitoy",
            direct: "To'g'ridan-to'g'ri",
            management: "Boshqaruv",
            orders: "Buyurtmalar",
            customers: "Mijozlar",
            settings: "Sozlamalar",
            logout: "Chiqish",
            admin_panel: "Admin Panel",
            super_admin: "Super Admin",
            manage_account: "Akkauntni boshqarish",
            go_to_site: "Sahifaga o'tish",
            logout_system: "Tizimdan chiqish",
            loading: "Yuklanmoqda...",
            total_revenue: "Jami tushum",
            net_profit: "Sof foyda",
            today_sales: "Bugungi savdo",
            total_orders: "Jami buyurtmalar",
            shipping_orders: "Yetkazish jarayonida",
            order_status: "Buyurtmalar holati",
            new_orders: "Yangi buyurtmalar",
            accepted_orders: "Qabul qilingan",
            on_the_way: "Yo'lda",
            delivered_orders: "Muvaffaqiyatli topshirildi",
            cancelled_orders: "Bekor qilingan",
            products_list: "Mahsulotlar",
            total_products_count: "Jami {count} ta mahsulot",
            add_new: "Yangi qo'shish",
            search_placeholder: "Mahsulot nomini qidirish...",
            table: {
                image: "Rasm",
                name: "Nom",
                price: "Sotuv Narxi",
                cost: "Tan Narx",
                source: "Manba",
                stock: "Qoldiq",
                actions: "Amallar",
                category: "Kategoriya"
            },
            status: {
                syncing: "Yangilanmoqda...",
                refresh: "Yangilash",
                import: "Import qilish",
                save: "Saqlash",
                cancel: "Bekor qilish",
                changes_count: "{count} ta o'zgarish",
                no_products: "Ushbu bo'limda mahsulotlar yo'q",
                delete_confirm: "Haqiqatan ham o'chirmoqchimisiz?",
                error: "Xatolik yuz berdi",
                delete_confirm_order: "Haqiqatan ham bu buyurtmani butunlay o'chirib tashlamoqchimisiz?"
            },
            orders_page: {
                title: "Buyurtmalar",
                description: "Barcha tushgan buyurtmalar ro'yxati va holati",
                search_placeholder: "Qidirish (ID, Ism, Mahsulot)...",
                tabs: {
                    all: "Barchasi",
                    new: "Yangilar",
                    accepted: "Qabul qilindi",
                    shipping: "Yo'lda",
                    delivered: "Topshirildi",
                    cancelled: "Bekor qilindi"
                },
                table: {
                    id: "ID",
                    date: "Sana",
                    customer: "Mijoz",
                    product: "Mahsulot",
                    address: "Manzil",
                    price: "Narx",
                    status: "Holat",
                    actions: "Amal"
                },
                actions: {
                    accept: "Qabul qilish",
                    send: "Yuborish",
                    deliver: "Topshirish",
                    cancel: "Bekor qilish",
                    edit: "Buyurtmani o'zgartirish",
                    change_status: "Holatni o'zgartirish",
                    delete_perm: "Butunlay o'chirish"
                }
            },
            customers_page: {
                title: "Mijozlar",
                description: "Doimiy va yangi mijozlar tahlili",
                search_placeholder: "Qidirish...",
                stats: {
                    total: "Jami mijozlar",
                    delivered: "Topshirilgan mijozlar",
                    new: "Yangi mijozlar"
                },
                regions: "Hududlar bo'yicha",
                list_title: "Mijozlar ro'yxati",
                filters: {
                    all: "Barchasi",
                    most_spent: "Ko'p xarid qilgan",
                    most_frequent: "Ko'p buyurtma bergan"
                },
                table: {
                    customer: "Mijoz",
                    orders: "Buyurtmalar",
                    delivered: "Topshirilgan",
                    total_spent: "Jami summa"
                }
            },
            modals: {
                edit_order: {
                    title: "Buyurtmani o'zgartirish",
                    first_name: "Ism",
                    last_name: "Familiya",
                    phone: "Telefon",
                    telegram: "Telegram",
                    region: "Viloyat",
                    city: "Tuman / Shahar"
                },
                change_status: {
                    title: "Holatni o'zgartirish"
                },
                import_product: {
                    title: "Mahsulot import qilish",
                    subtitle: "Boshqa bo'limdan mahsulot nusxasini ko'chirish",
                    search_placeholder: "Import qilish uchun qidiring...",
                    no_results: "Mahsulotlar topilmadi",
                    already_imported: "Bor",
                    import_btn: "Import"
                }
            },
            unit_economics: "Unit Iqtisodiyot",
            currency: "so'm",
            form: {
                new_product: "Yangi mahsulot",
                new_product_desc: "Yangi tovarni tizimga kiritish",
                edit_product: "Mahsulotni tahrirlash",
                edit_product_desc: "Mahsulot ma'lumotlarini o'zgartirish",
                uz_section: "O'zbek tilida",
                ru_section: "Rus tilida",
                main_info: "Asosiy ma'lumotlar",
                title: "Mahsulot nomi",
                description: "Tavsif",
                characteristics: "Xususiyatlar (har bir qator yangi xususiyat)",
                characteristics_placeholder: "Masalan:\nSuv o'tkazmaydigan\nYengil",
                price: "Narx",
                price_placeholder: "Masalan: 120 000 so'm",
                cost_price: "Tan Narx (Asl narxi)",
                category: "Kategoriya",
                source: "Manba (Source)",
                image_url: "Asosiy Rasm URL",
                gallery: "Galereya (Qo'shimcha rasmlar)",
                add_image: "Rasm qo'shish",
                uzum_url: "Uzum Market URL",
                yandex_url: "Yandex Market URL",
                duplicate_error: "Bunday mahsulot allaqachon mavjud!",
                save: "Saqlash",
                back: "Orqaga"
            },
            categories_list: {
                gadjets: "Gadjetlar",
                beauty: "Go'zallik",
                auto: "Avto",
                home: "Uy",
                clothing: "Kiyim",
                gift: "Sovg'a",
                joke: "Hazil",
                accessories: "Aksessuarlar",
                hobby: "Hobbi"
            }
        },
        items: unifiedProducts.map(p => ({
            ...p,
            ...p.uz,
            fullDescription: p.uz.description,
            characteristics: p.uz.characteristics,
            variants: p.variants?.map(v => ({
                color: v.colorUz,
                images: v.images
            }))
        }))
    },
    ru: {
        header: {
            quality: "Качество",
        },
        hero: {
            title_start: "PRESENTBOX — ",
            title_highlight: "мир уникальных",
            title_end: " и трендовых товаров",
            guarantee: "Гарантия",
            quality: "Качество",
            support: "24/7 Поддержка",
            all_products: "Все товары",
            special_offer: "Спецпредложение",
            special_desc: "Лучшие подарки только у нас!",
            coupon: {
                front_title: "Спецпредложение",
                front_subtitle: "Призовой подарок",
                front_action: "Перевернуть купон",
                back_text: "Купите удачный товар и выиграйте от 7 000 до 77 000 сумов",
            }
        },
        products: {
            popular_title: "Популярные",
            popular_highlight: "товары",
            details: "Подробнее",
            low_stock: "Скоро закончится",
        },
        benefits: {
            delivery: "Быстрая доставка",
            quality: "Оригинальное качество",
            payment: "Удобная оплата",
            return: "Возврат 10 дней",
        },
        about: {
            title: "Почему именно PresentBox?",
            text: "Мы не просто магазин – мы создатели трендов! В PresentBox вы найдете не только гаджеты, но и самые последние и необычные товары, которые взрывают социальные сети. Мы ежедневно следим за самыми горячими новинками по всему миру и первыми привозим их в Узбекистан. Качество, быстрая доставка и уникальный стиль – это наша визитная карточка.",
        },
        faq: [
            {
                question: "Как оформить заказ?",
                answer: "Выберите товар и нажмите кнопку «Добавить в корзину». Затем перейдите в корзину, заполните контактные данные, выберите удобный способ оплаты и подтвердите заказ. Процесс займет всего несколько минут."
            },
            {
                question: "Обязательно ли регистрироваться для заказа?",
                answer: "Нет, регистрация не обязательна. Вы можете оформить заказ как гость."
            },
            {
                question: "Можно ли отменить или изменить заказ?",
                answer: "Если заказ еще не передан в службу доставки, его можно отменить или изменить. Для этого просим связаться с нами как можно скорее."
            },
            {
                question: "В какие регионы осуществляется доставка?",
                answer: "Мы доставляем по всему Узбекистану. В крупные города доставка осуществляется быстрее, в отдаленные районы сроки могут немного отличаться."
            },
            {
                question: "Можно ли заказать доставку к определенному времени?",
                answer: "Да, по предварительной договоренности возможна доставка в определенную дату или временной интервал. Вы можете сообщить об этом при оформлении заказа или связавшись с оператором."
            },
            {
                question: "Какие способы оплаты доступны?",
                answer: "Вы можете оплатить заказ следующими способами:\n- Наличные\n- Банковские карты (Uzcard / Humo)\n- Системы онлайн-платежей"
            },
            {
                question: "Можно ли оплатить наличными?",
                answer: "Да, конечно. Есть возможность оплатить наличными курьеру при получении заказа."
            },
            {
                question: "Что делать, если пришел бракованный товар?",
                answer: "Если товар пришел с дефектом или поврежденным, немедленно свяжитесь с нами. Мы изучим ситуацию и оперативно решим вопрос с заменой или возвратом."
            },
            {
                question: "Как с вами связаться?",
                answer: "Вы можете связаться с нами следующими способами:\n- По телефону 77 045 45 47\n- Через Telegram @mirobidusmonov\n\nНаши операторы оперативно ответят на ваше обращение в рабочее время."
            }
        ],
        footer: {
            support_btn: "Написать в техподдержку",
            rights: "© 2025 PresentBox. Все права защищены.",
        },
        admin: {
            dashboard: "Дашборд",
            products: "Продукты",
            all_products: "Все продукты",
            categories: "Категории",
            uzum: "Uzum Market",
            yandex: "Yandex",
            china: "Китай",
            direct: "Прямая продажа",
            management: "Управление",
            orders: "Заказы",
            customers: "Клиенты",
            settings: "Настройки",
            logout: "Выйти",
            admin_panel: "Админ панель",
            super_admin: "Супер Админ",
            manage_account: "Управление аккаунтом",
            go_to_site: "Перейти на сайт",
            logout_system: "Выйти из системы",
            loading: "Загрузка...",
            total_revenue: "Общая выручка",
            net_profit: "Чистая прибыль",
            today_sales: "Продажи сегодня",
            total_orders: "Всего заказов",
            shipping_orders: "В процессе доставки",
            order_status: "Статус заказов",
            new_orders: "Новые заказы",
            accepted_orders: "Принятые",
            on_the_way: "В пути",
            delivered_orders: "Успешно доставлено",
            cancelled_orders: "Отменено",
            products_list: "Продукты",
            total_products_count: "Всего {count} товаров",
            add_new: "Добавить новый",
            search_placeholder: "Поиск по названию...",
            table: {
                image: "Фото",
                name: "Название",
                price: "Цена продажи",
                cost: "Себестоимость",
                source: "Источник",
                stock: "Остаток",
                actions: "Действия",
                category: "Категория"
            },
            status: {
                syncing: "Обновление...",
                refresh: "Обновить",
                import: "Импорт",
                save: "Сохранить",
                cancel: "Отмена",
                changes_count: "{count} изменений",
                no_products: "В этом разделе нет товаров",
                delete_confirm: "Вы действительно хотите удалить?",
                error: "Произошла ошибка",
                delete_confirm_order: "Вы действительно хотите полностью удалить этот заказ?"
            },
            orders_page: {
                title: "Заказы",
                description: "Список и статус всех поступивших заказов",
                search_placeholder: "Поиск (ID, Имя, Продукт)...",
                tabs: {
                    all: "Все",
                    new: "Новые",
                    accepted: "Принятые",
                    shipping: "В пути",
                    delivered: "Доставлено",
                    cancelled: "Отменено"
                },
                table: {
                    id: "ID",
                    date: "Дата",
                    customer: "Клиент",
                    product: "Продукт",
                    address: "Адрес",
                    price: "Цена",
                    status: "Статус",
                    actions: "Действие"
                },
                actions: {
                    accept: "Принять",
                    send: "Отправить",
                    deliver: "Доставить",
                    cancel: "Отменить",
                    edit: "Изменить заказ",
                    change_status: "Изменить статус",
                    delete_perm: "Удалить навсегда"
                }
            },
            customers_page: {
                title: "Клиенты",
                description: "Анализ постоянных и новых клиентов",
                search_placeholder: "Поиск...",
                stats: {
                    total: "Всего клиентов",
                    delivered: "Клиенты с доставкой",
                    new: "Новые клиенты"
                },
                regions: "По регионам",
                list_title: "Список клиентов",
                filters: {
                    all: "Все",
                    most_spent: "Топ по расходам",
                    most_frequent: "Топ по заказам"
                },
                table: {
                    customer: "Клиент",
                    orders: "Заказы",
                    delivered: "Доставлено",
                    total_spent: "Общая сумма"
                }
            },
            modals: {
                edit_order: {
                    title: "Изменить заказ",
                    first_name: "Имя",
                    last_name: "Фамилия",
                    phone: "Телефон",
                    telegram: "Telegram",
                    region: "Область",
                    city: "Район / Город"
                },
                change_status: {
                    title: "Изменить статус"
                },
                import_product: {
                    title: "Импорт товара",
                    subtitle: "Копирование товара из другого раздела",
                    search_placeholder: "Поиск для импорта...",
                    no_results: "Товары не найдены",
                    already_imported: "Есть",
                    import_btn: "Импорт"
                }
            },
            unit_economics: "Юнит Экономика",
            currency: "сум",
            form: {
                new_product: "Новый товар",
                new_product_desc: "Добавление нового товара в систему",
                edit_product: "Редактирование товара",
                edit_product_desc: "Изменение информации о товаре",
                uz_section: "На узбекском",
                ru_section: "На русском",
                main_info: "Основная информация",
                title: "Название товара",
                description: "Описание",
                characteristics: "Характеристики (каждая с новой строки)",
                characteristics_placeholder: "Например:\nВодонепроницаемый\nЛегкий",
                price: "Цена",
                price_placeholder: "Например: 120 000 сум",
                cost_price: "Себестоимость (Оригинал)",
                category: "Категория",
                source: "Источник (Source)",
                image_url: "URL основного изображения",
                gallery: "Галерея (Доп. изображения)",
                add_image: "Добавить изображение",
                uzum_url: "URL Uzum Market",
                yandex_url: "URL Yandex Market",
                duplicate_error: "Такой товар уже существует!",
                save: "Сохранить",
                back: "Назад"
            },
            categories_list: {
                gadjets: "Гаджеты",
                beauty: "Красота",
                auto: "Авто",
                home: "Дом",
                clothing: "Одежда",
                gift: "Подарки",
                joke: "Приколы",
                accessories: "Аксессуары",
                hobby: "Хобби"
            }
        },
        items: unifiedProducts.map(p => ({
            ...p,
            ...p.ru,
            fullDescription: p.ru.description,
            characteristics: p.ru.characteristics,
            variants: p.variants?.map(v => ({
                color: v.colorRu,
                images: v.images
            }))
        }))
    }
};
