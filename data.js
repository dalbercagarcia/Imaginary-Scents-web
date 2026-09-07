/* ============================================================
   IMAGINARY SCENTS — BASE DE DATOS
   ------------------------------------------------------------
   PARA CAMBIAR UN PRECIO: busca la fragancia y cambia el numero.
   Ejemplo:  p:{3:50, 5:85, 10:120}   ->   3ml S/50, 5ml S/85, 10ml S/120
   PARA OCULTAR UNA FRAGANCIA: escribe  off:true  dentro de sus llaves.
   NO borres las comas ni las llaves.
   ============================================================ */

const WHATSAPP = "51946078711";        // <-- TU NUMERO AQUI (codigo pais + numero, sin +, sin espacios)
const TIKTOK   = "https://www.tiktok.com/@imaginaryscents";
const FACEBOOK = "";                    // opcional: pega el link de tu pagina

/* perfiles: floral | citrica | amaderada | oriental | fougere | gourmand
   est: calor | frio | todo                                             */

const PRODUCTOS = [
/* ---------- NICHO ---------- */
{id:"acqua-il-profumo",m:"Acqua di Parma",n:"Il Profumo",col:"nicho",perf:["citrica","amaderada"],est:"calor",
 d:"Limón, bergamota y piña que abren frescos y luminosos; el neroli y el ylang-ylang le dan un corazón floral con carácter italiano, y el vetiver, el musgo y el cuero cierran con una elegancia sobria que lo aleja de lo común.",
 q:"Para el que viaja ligero, viste con clase sin esfuerzo y huele a que siempre sabe a dónde va 🍋🌸", p:{5:30,10:50}},

{id:"amouage-enclave",m:"Amouage",n:"Enclave",col:"nicho",perf:["oriental","amaderada"],est:"todo",
 d:"Menta y especias que despiertan al instante, con un corazón de incienso y pachulí que le da peso y misterio. El ládano y el cuero cierran con carácter, sin pedir permiso.",
 q:"Para el que no sigue tendencias porque ya tiene estilo propio 🖤🌿🔥", p:{3:50,5:85,10:120}},

{id:"tauer-desierto-marroqui",m:"Andy Tauer",n:"L'Air du Désert Marocain",col:"nicho",perf:["oriental","amaderada"],est:"frio",
 d:"Cilantro, comino y lavanda abren con una aridez especiada que evoca la tierra caliente del desierto; el ládano y el jazmín envuelven como el calor de la arena al caer el sol, y el ámbar con cedro, vetiver y musgo de roble construyen una base profunda que se funde con la piel.",
 q:"Para quien lleva alma de explorador y no teme cargar una fragancia que deja huella antes de salir de la habitación 🏜🌑", p:{3:65,5:100,10:195}},

{id:"bdk-gris-charnel",m:"BDK Parfums",n:"Gris Charnel Extrait",col:"nicho",perf:["amaderada","oriental"],est:"todo",
 d:"Té negro y cardamomo que abren frescos y limpios; el iris y el vetiver le dan esa textura gris, sofisticada, casi mineral, y la vainilla con la tonka aterrizan todo en algo cálido sin volverse dulce.",
 q:"Para el que prefiere que su perfume hable bajo pero se recuerde largo 🫖🌫🤍", p:{3:55,5:70,10:120}},

{id:"creed-millesime",m:"Creed",n:"Millésime Impérial",col:"nicho",perf:["citrica","amaderada"],est:"calor",
 d:"Sal de mar y notas afrutadas que abren como brisa en cubierta; limón siciliano, bergamota y mandarina lo llenan de luz mediterránea, y el almizcle con notas marinas cierra limpio y elegante sin necesidad de explicarse.",
 q:"Para el que pasa los veranos bien y huele a que la vida le trata como se merece 🌊🍋🤍", p:{3:50,5:80,10:150}},

{id:"creed-green-irish-tweed",m:"Creed",n:"Green Irish Tweed",col:"nicho",perf:["fougere","amaderada"],est:"calor",
 d:"Iris y verbena que abren verdes y frescos como campo mojado por la mañana; las hojas de violeta sostienen ese corazón limpio, y el ámbar gris con el sándalo cierran suave y cálido sin perder la frescura.",
 q:"Para el que tiene clase sin esfuerzo y huele a que siempre ha sabido quién es 🌿🤍☀️", p:{3:50,5:80,10:150}},

{id:"creed-absolu-aventus",m:"Creed",n:"Absolu Aventus",col:"nicho",perf:["citrica","amaderada"],est:"todo",
 d:"Piña, grosellas negras y bergamota abren con una explosión frutal llena de energía; cardamomo, canela y jengibre suben la temperatura, y el vetiver con el pachulí cierran terroso y sofisticado.",
 q:"Para el que siempre está listo para lo que venga y huele a éxito sin tener que decirlo 🍍⚡🪵", p:{3:68,5:110,10:210}},

{id:"essential-bois-imperial",m:"Essential Parfums",n:"Bois Impérial",col:"nicho",perf:["amaderada","fougere"],est:"todo",
 d:"Madera seca, albahaca fresca y un toque de timur que pica justo. El ambroxan y el pachulí lo anclan en algo cálido y limpio a la vez. Funciona en todas las estaciones sin perder la coherencia.",
 q:"Para el que no necesita mucho para ocupar el espacio 🌿🪵✨", p:{3:55,5:65,10:100}},

{id:"gisada-ambassador",m:"Gisada",n:"Ambassador Men",col:"nicho",perf:["citrica","amaderada"],est:"todo",
 d:"Mandarina y manzana que entran frescas, con cardamomo y pimienta dándole carácter desde el inicio. El mango y la lavanda equilibran, y la teca con vetiver y ámbar cierran con una calidez que dura.",
 q:"Para el que siempre está bien presentado sin parecer que se esforzó 🍊🌿🤵🏻", p:{3:35,5:45,10:75}},

{id:"lp-summer-hammer",m:"Lorenzo Pazzaglia",n:"Summer Hammer",col:"nicho",perf:["citrica","gourmand"],est:"calor",
 d:"Mango, piña, coco y un toque de ron blanco que estallan en frescura tropical; leche de coco, flores blancas y notas marinas envuelven como brisa de mar, y el almizcle con sándalo y ámbar deja una calidez suave al caer la tarde.",
 q:"Para quien disfruta el sol, la playa y el buen vivir sin dejar de verse impecable 🌊🥥", p:{3:60,5:95,10:180}},

{id:"lp-sungria",m:"Lorenzo Pazzaglia",n:"Sun-Gria",col:"nicho",perf:["gourmand","citrica"],est:"calor",
 d:"Estalla como una copa de sangría al sol: naranja sanguina, canela y jengibre chispean con energía festiva; uvas, vino tinto y durazno envuelven en una sensualidad frutal, y el azúcar moreno con vainilla, tonka y ámbar deja una estela dulce y magnética.",
 q:"Para quien vive las fiestas al aire libre con copa en mano y deja estela por donde pasa 🍷✨", p:{3:60,5:100,10:190}},

{id:"lp-black-sea",m:"Lorenzo Pazzaglia",n:"Black Sea",col:"nicho",perf:["citrica","amaderada"],est:"calor",
 d:"Sal, notas ozónicas y bergamota golpean como brisa fría sobre acantilados; el ylang-ylang y la flor de azahar suavizan con un toque floral casi hipnótico, y el ámbar gris con algas y musgo de roble deja una estela mineral y sofisticada.",
 q:"Para el hombre de presencia serena, que prefiere el poder discreto antes que gritar para ser notado 🌊🖤", p:{3:62,5:100,10:195}},

{id:"crivelli-oud-maracuja",m:"Maison Crivelli",n:"Oud Maracujá",col:"nicho",perf:["oriental","amaderada"],est:"frio",
 d:"Maracuyá y azafrán abren con una tensión frutal y especiada que no se espera; la rosa turca añade elegancia antes de que el oud y el pachulí lleven todo a territorio oscuro, y el cuero con ládano y vainilla cierran densos y memorables.",
 q:"Para el que no teme lo inesperado y huele a que su historia es más interesante que la de los demás 🥭🌹🖤", p:{2:63,3:90,5:150}},

{id:"margiela-fireplace",m:"Maison Margiela",n:"By the Fireplace",col:"nicho",perf:["gourmand","oriental"],est:"frio",
 d:"Clavo y pimienta rosa que abren especiados y cálidos; la castaña y el gaiac llevan directo a una chimenea encendida con lluvia afuera, y la vainilla con cachemira y bálsamo de Perú cierra suave, ahumado y acogedor.",
 q:"Para el que valora los momentos tranquilos y entiende que el mejor plan a veces es no tener ninguno 🔥🌰🤍", p:{3:30,5:40,10:70}},

{id:"margiela-jazz-club",m:"Maison Margiela",n:"Jazz Club",col:"nicho",perf:["oriental","gourmand"],est:"frio",
 d:"Neroli y pimienta rosa abren con elegancia discreta; el ron y el vetiver de Java le dan ese carácter oscuro y ahumado que huele a sala pequeña con música en vivo, y el tabaco con vainilla y styrax cierra cálido y envolvente.",
 q:"Para el que prefiere los bares con historia a las discotecas con luces 🎷🥃🖤", p:{3:30,5:40,10:70}},

{id:"mfk-grand-soir",m:"MFK",n:"Grand Soir",col:"nicho",perf:["oriental","gourmand"],est:"frio",
 d:"Naranja y ládano que abren con calidez; la lavanda y el benjuí suavizan el camino, y el ámbar con vainilla y tonka cierran como una noche de invierno bien aprovechada.",
 q:"Para el que disfruta la temporada fría con una copa en mano y sin apuro 🍂🌙🥂", p:{3:59,5:95,10:185}},

{id:"nasomatto-baraonda",m:"Nasomatto",n:"Baraonda",col:"nicho",perf:["oriental","amaderada"],est:"frio",
 d:"Whisky y madera que calientan desde adentro, almizcle que se pega a la piel como segunda ropa, y una rosa que aparece apenas, solo para recordarte que hay algo más detrás.",
 q:"Para el que llega a donde quiere llegar y huele así de bien mientras lo hace 🥃🌹🖤", p:{1:30,2:50,3:70}},

{id:"nasomatto-pardon",m:"Nasomatto",n:"Pardon",col:"nicho",perf:["gourmand","oriental"],est:"frio",
 d:"Flores que abren suave y ceden rápido ante el chocolate oscuro, la canela y la tonka. El oud y el sándalo cierran con peso y permanencia, para noches donde el perfume se siente más que se huele.",
 q:"Para el que se viste de oscuro, habla poco y deja huella 🍫🕯🖤", p:{1:30,2:50,3:70}},

{id:"nasomatto-blamage",m:"Nasomatto",n:"Blamage",col:"nicho",perf:["amaderada","fougere"],est:"todo",
 d:"Abedul y maderas blancas que abren limpios y secos; el almizcle los envuelve con calidez discreta y el cuero aparece al fondo con carácter, sin gritar. Minimalista en apariencia, complejo en piel.",
 q:"Para el que dice poco y se recuerda mucho 🤍🪵🖤", p:{1:30,2:50,3:70}},

{id:"orto-terroni",m:"Orto Parisi",n:"Terroni",col:"nicho",perf:["amaderada","oriental"],est:"frio",
 d:"Frambuesa que abre jugosa y oscura; el abedul y el benjuí la llevan a terreno más denso, y el gaiac, el vetiver y el musgo cierran con tierra húmeda y madera pesada. La tonka y la vainilla redondean sin suavizar demasiado.",
 q:"Para el que disfruta lo intenso y entiende que un buen perfume no pide permiso 🍓🌲🖤", p:{2:35,3:50,5:85}},

{id:"pdm-sedley",m:"Parfums de Marly",n:"Sedley",col:"nicho",perf:["fougere","citrica"],est:"calor",
 d:"Menta, limón y toronja que abren con una frescura que despierta; la lavanda y el romero le dan cuerpo herbal y el franquincienso lo eleva con discreta profundidad. El ambroxan y la cachemira cierran suave y duradero.",
 q:"Para el que madruga con estilo y huele a que el día ya está ganado antes de empezar 🌿🍋✨", p:{3:35,5:55,10:105}},

{id:"pdm-althair",m:"Parfums de Marly",n:"Althaïr",col:"nicho",perf:["gourmand","oriental"],est:"frio",
 d:"Canela y cardamomo que abren cálidos y especiados; la flor de azahar los suaviza antes de que la vainilla bourbon y el elemi lleven todo a un territorio cremoso, y el praliné con almendras caramelizadas y tonka cierra goloso y sofisticado.",
 q:"Para el que disfruta los placeres sin culpa y huele a que la vida le sabe dulce 🍂🍬✨", p:{3:36,5:57,10:110}},

{id:"pdm-carlisle",m:"Parfums de Marly",n:"Carlisle",col:"nicho",perf:["oriental","floral"],est:"frio",
 d:"Azafrán y nuez moscada que abren con misterio especiado; la manzana verde refresca un instante antes de que la rosa y la davana añadan carácter, y el pachulí con vainilla y opopónaco cierran oscuro y con mucha personalidad.",
 q:"Para el que elige un perfume como elige todo lo demás: con convicción 🍎🌹🖤", p:{3:36,5:60,10:110}},

{id:"pdm-oajan",m:"Parfums de Marly",n:"Oajan",col:"nicho",perf:["gourmand","oriental"],est:"frio",
 d:"Canela, miel y osmanto que abren dulces como una noche junto al fuego; el benjuí y el ámbar gris calientan el corazón con densidad envolvente, y la vainilla con tonka y almizcle cierra cremosa y adictiva.",
 q:"Para el que entiende que hay fragancias que son un abrazo 🍯🕯🤎", p:{3:40,5:65,10:115}},

{id:"sospiro-vibrato",m:"Sospiro",n:"Vibrato",col:"nicho",perf:["citrica","floral"],est:"calor",
 d:"Pomelo y bergamota que abren brillantes; el jazmín y la magnolia los elevan con naturalidad, y el jengibre le da ese pulso vivo que lo distingue. El cedro, el ámbar y la raíz de lirio cierran suave y elegante.",
 q:"Para el que se arregla para él mismo y deja estela sin proponérselo 🍋🌸✨", p:{3:45,5:65,10:120}},

{id:"sospiro-il-padrino",m:"Sospiro",n:"Il Padrino",col:"nicho",perf:["oriental","gourmand"],est:"frio",
 d:"Grosellas negras y amaretto que abren con dulzura oscura; la bergamota los afina antes de que el ámbar, el pachulí y el sándalo tomen el control, y la vainilla con benjuí y ládano cierra cálido y envolvente.",
 q:"Para el que entra a cualquier lugar como si ya fuera suyo 🍇🥃🍂", p:{3:45,5:65,10:120}},

{id:"xerjoff-alexandria-2",m:"Xerjoff",n:"Alexandria II",col:"nicho",perf:["oriental","floral"],est:"frio",
 d:"Canela y palisandro que abren con el calor que piden los días fríos; la lavanda y la manzana equilibran sin restarle peso, la rosa y el lirio del valle sostienen un corazón elegante, y el oud con sándalo y vainilla cierran denso y duradero.",
 q:"Para el que se viste para el frío con la misma elegancia con la que huele 🍂🌹🪵", p:{3:75,5:95,10:150}},

{id:"xerjoff-alexandria-3",m:"Xerjoff",n:"Alexandria III",col:"nicho",perf:["oriental","floral"],est:"frio",
 d:"Lavanda y canela que abren con el calor justo para los días fríos; la rosa y el lirio del valle dan elegancia, y el oud laosiano con el tailandés cierran con una profundidad que pocas fragancias alcanzan. Ámbar, sándalo y vainilla completan algo opulento.",
 q:"Para el que entiende que un buen perfume es el último detalle que lo define todo 🍂🌹🪵", p:{3:65,5:107}},

{id:"xerjoff-tony-iommi",m:"Xerjoff",n:"Tony Iommi Monkey Special",col:"nicho",perf:["oriental","gourmand"],est:"frio",
 d:"Ron y maracuyá que abren con una energía que no esperabas; el geranio y la bergamota los refinan antes de que el cuero, la canela y la rosa de Bulgaria le den carácter, y el caramelo con tonka y ámbar gris cierran cálido y oscuro.",
 q:"Para el que tiene personalidad propia y deja una impresión que no se borra fácil 🎸🥃🖤", p:{3:45,5:65,10:120}},

{id:"xerjoff-torino-21",m:"Xerjoff",n:"Torino 21",col:"nicho",perf:["fougere","citrica"],est:"calor",
 d:"Menta, limón y albahaca que abren como aire fresco de mañana; el romero y la lavanda le dan cuerpo herbal sin perder ligereza, y el jazmín con las grosellas añaden un toque jugoso que lo hace difícil de soltar.",
 q:"Para el que arranca el día con energía y huele tan fresco como se ve 🌿🍋☀️", p:{3:45,5:65,10:120}},

{id:"xerjoff-accento-overdose",m:"Xerjoff",n:"Accento Overdose",col:"nicho",perf:["floral","fougere"],est:"calor",
 d:"Frutas y acordes verdes que abren brillantes; los aldehídos les dan ese aire clásico que pocas fragancias logran. El jazmín egipcio, la rosa y el lirio del valle forman un corazón floral que no se disculpa por serlo, y el eucalipto con pino cierran como brisa de bosque.",
 q:"Para el que lleva flores sin parecer dulce y deja una estela que la gente recuerda 🌸🌿✨", p:{3:45,5:65,10:120}},

{id:"xerjoff-naxos",m:"Xerjoff",n:"Naxos",col:"nicho",perf:["gourmand","oriental"],est:"frio",
 d:"Bergamota y lavanda que abren limpios, hasta que la miel, la canela y el jazmín sambac lo vuelven cálido y adictivo. Las hojas de tabaco con vainilla y tonka cierran con esa dulzura ahumada que pide frío afuera y buena compañía adentro.",
 q:"Para el que siempre huele a que tiene todo bajo control 🍂🍯🌿", p:{3:45,5:65,10:120}},

{id:"xerjoff-renaissance",m:"Xerjoff",n:"Renaissance",col:"nicho",perf:["citrica","amaderada"],est:"calor",
 d:"Limón de Amalfi, tangerina y bergamota que abren brillantes y llenos de vida; la menta y el lirio del valle refrescan el corazón con elegancia, y el cedro, el pachulí y el ámbar cierran con una base suave que lo mantiene interesante hasta el final.",
 q:"Para el que estrena cada día con actitud y huele a que tiene muy claro quién es 🍋🌸☀️", p:{3:45,5:65,10:120}},

/* ---------- DISEÑADOR ---------- */
{id:"azzaro-most-wanted",m:"Azzaro",n:"The Most Wanted Parfum",col:"disenador",perf:["oriental","gourmand"],est:"frio",
 d:"Jengibre que abre con un golpe de calidez especiada, las maderas lo sostienen con solidez y la vainilla cierra suave, dulce y adictivo. Simple en estructura, efectivo en piel.",
 q:"Para el que sabe que lo sencillo, bien llevado, siempre gana 🪵🤎", p:{5:45,10:65}},

{id:"bvlgari-tygar",m:"Bvlgari",n:"Tygar",col:"disenador",perf:["citrica","amaderada"],est:"todo",
 d:"La toronja estalla con una frescura cítrica y vibrante; el jengibre y el almizcle ambreta aportan calidez especiada con sensualidad limpia, y el ambroxan con vetiver y pachulí ancla todo en una profundidad seca y magnética.",
 q:"Para el que no teme destacar y entiende que un buen perfume no pide permiso 🖤🍊", p:{3:55,5:85,10:160}},

{id:"ck-eternity",m:"Calvin Klein",n:"Eternity EDT",col:"disenador",perf:["fougere","floral"],est:"calor",
 d:"Lavanda, bergamota y mandarina que abren frescos y sin pretensiones; un corazón floral y herbal generoso que huele a jardín en su mejor momento, y una base de sándalo, vetiver y ámbar que lo ancla con calidez duradera.",
 q:"Para el que tiene estilo propio desde hace años y huele tan bien hoy como siempre 🌿🍋", p:{10:30}},

{id:"chanel-bleu-parfum",m:"Chanel",n:"Bleu de Chanel Parfum",col:"disenador",perf:["amaderada","citrica"],est:"todo",
 d:"Limón, menta y bergamota que abren limpios y directos; la lavanda y la piña le dan un corazón fresco con carácter, y el sándalo, el cedro y el iso E super cierran con esa calidez maderada que se funde en piel y no se va.",
 q:"Para el que entiende que hay fragancias que simplemente no fallan 🤍🪵✨", p:{3:35,5:45,10:75}},

{id:"dior-homme-sport",m:"Dior",n:"Homme Sport",col:"disenador",perf:["citrica","amaderada"],est:"calor",
 d:"Limón y bergamota que abren con energía y frescura; la pimienta rosa y el elemi le dan un giro especiado que lo aleja de lo predecible, y las maderas con ámbar y franquincienso cierran con una sobriedad elegante que dura.",
 q:"Para el que entrena, se ducha, se viste bien y sale listo para lo que sea 🍋⚡🤍", p:{3:25,5:35,10:50}},

{id:"dior-homme-intense",m:"Dior",n:"Homme Intense (2011)",col:"disenador",perf:["floral","amaderada"],est:"frio",
 d:"Lavanda que abre serena y segura; el iris y la pera le dan un corazón suave y sofisticado, y el cedro con el vetiver cierran seco, limpio y con mucho carácter. Pocas notas, mucha presencia.",
 q:"Para el que no necesita llamar la atención porque ya la tiene 🌿🖤🪵", p:{3:35,5:45,10:75}},

{id:"dior-sauvage-elixir",m:"Dior",n:"Sauvage Elixir",col:"disenador",perf:["oriental","amaderada"],est:"frio",
 d:"Canela, cardamomo y nuez moscada que abren con una intensidad especiada que no pide permiso; la lavanda equilibra un instante, y el sándalo, el vetiver de Haití y el pachulí cierran profundo, oscuro y animal.",
 q:"Para el que llena el espacio antes de hablar y huele a que las reglas las pone él 🌶🪵🖤", p:{3:55,5:75,10:100}},

{id:"dior-homme-cologne",m:"Dior",n:"Homme Cologne (2013)",col:"disenador",perf:["citrica","fougere"],est:"calor",
 d:"Bergamota de Calabria que abre brillante y sin rodeos; la flor de pomelo lo mantiene fresco y luminoso, y el almizcle cierra limpio, casi como piel lavada. Minimalista, sofisticado y hecho para el calor.",
 q:"Para el que no necesita más que una buena camisa blanca y oler así 🍋☀️🤍", p:{3:45,5:60,10:75}},

{id:"dior-eau-sauvage",m:"Dior",n:"Eau Sauvage Parfum",col:"disenador",perf:["fougere","citrica"],est:"todo",
 d:"Bergamota, cidra y petit grain que abren con esa frescura clásica que nunca envejece; la lavanda y el vetiver le dan un corazón sobrio, y la mirra con musgo de roble y pachulí cierran con una profundidad que lo aleja de cualquier colonia común.",
 q:"Para el que entiende que la elegancia verdadera no caduca 🍋🌿🖤", p:{3:40,5:55,10:70}},

{id:"dior-oud-ispahan",m:"Dior",n:"Oud Ispahan",col:"disenador",perf:["oriental","amaderada"],est:"frio",
 d:"Rosa y madera que abren con una riqueza inmediata; el humo y la mirra le dan ese carácter oriental que envuelve como incienso en una habitación cerrada, y la resina cierra densa, oscura y persistente.",
 q:"Para el que entiende que hay perfumes que son una declaración, no un accesorio 🌹🪵🖤", p:{3:55,5:90,10:150}},

{id:"givenchy-society-ambree",m:"Givenchy",n:"Gentleman Society Ambrée",col:"disenador",perf:["oriental","amaderada"],est:"frio",
 d:"Nuez moscada y bayas de enebro que abren con especias discretas; el lirio y el vetiver de Madagascar le dan un corazón elegante y terroso, y el tabaco con vainilla de Madagascar y bálsamo de Perú cierran cálido y con mucha clase.",
 q:"Para el que sabe comportarse en cualquier mesa y huele a que llegó para quedarse 🍂🌿🤎", p:{5:35,10:50}},

{id:"givenchy-society-edp",m:"Givenchy",n:"Gentleman Society EDP",col:"disenador",perf:["amaderada","oriental"],est:"frio",
 d:"Cardamomo y salvia que abren limpios y especiados; el narciso y el vetiver le dan un corazón sofisticado con ese filo terroso que lo distingue, y el palo santo con cedro y vainilla cierran cálido, ahumado y duradero.",
 q:"Para el que se viste bien porque se respeta, no porque quiera impresionar 🌿🪵🤍", p:{5:35,10:50}},

{id:"hermes-terre",m:"Hermès",n:"Terre d'Hermès EDT",col:"disenador",perf:["amaderada","citrica"],est:"todo",
 d:"Naranja y toronja que abren cítricos y limpios; la pimienta y el sílex le meten un filo mineral inconfundible, y el vetiver con cedro y pachulí cierran terroso y seco. Huele a tierra mojada después del sol.",
 q:"Para el que tiene los pies en la tierra y huele a que construye cosas que duran 🌍🍊🪵", p:{5:35,10:50}},

{id:"hermes-eau-givree",m:"Hermès",n:"Eau Givrée",col:"disenador",perf:["citrica","amaderada"],est:"calor",
 d:"Cidra que abre helada y brillante; las bayas de enebro y el timur le dan un pulso fresco con ese toque eléctrico que despierta, y las notas minerales con madera cierran limpio y seco como brisa de montaña.",
 q:"Para el que prefiere el aire fresco a cualquier perfume recargado 🧊🌿☀️", p:{5:35,10:50}},

{id:"kenzo-homme-intense",m:"Kenzo",n:"Kenzo Homme Intense",col:"disenador",perf:["amaderada","citrica"],est:"calor",
 d:"Notas marinas y pimienta rosa que abren frescas con un toque especiado; el higo y la hoja de higuera le dan ese carácter verde y jugoso que lo hace único, y el sándalo con akigalawood y pachulí cierran con una base maderada con personalidad.",
 q:"Para el que disfruta el aire libre y huele a que tiene vida interesante 🌊🌿🪵", p:{5:35,10:50}},

{id:"kenzo-homme-edt",m:"Kenzo",n:"Kenzo Homme EDT",col:"disenador",perf:["amaderada","citrica"],est:"calor",
 d:"Notas marinas y nuez moscada que abren con brisa fresca y un toque especiado; el pino y el pachulí le dan un corazón verde y selvático, y el sándalo con el cedro cierran suave y maderado. Huele a costa con bosque cerca.",
 q:"Para el que prefiere el mar a la ciudad y siempre tiene un plan al aire libre 🌊🌲☀️", p:{5:35,10:50}},

{id:"loewe-esencia",m:"Loewe",n:"Esencia EDP",col:"disenador",perf:["fougere","amaderada"],est:"todo",
 d:"Lavanda y musgo que abren con una elegancia sobria y sin prisa; el vetiver le da carácter terroso y el sándalo cierra cálido, suave y muy bien puesto. Clásico en esencia, moderno en piel.",
 q:"Para el que huele igual de bien un lunes de trabajo que un sábado de noche 🌿🤍🪵", p:{5:55,10:70}},

{id:"loewe-cobalt",m:"Loewe",n:"Cobalt",col:"disenador",perf:["amaderada","fougere"],est:"todo",
 d:"Salvia y grosellas negras que abren con frescura y carácter frutal; la pimienta rosa y el clavo le meten filo especiado, y el incienso con vetiver y tonka cierran con una profundidad que no esperabas en una fragancia tan versátil.",
 q:"Para el que huele a que cada elección que hace tiene un porqué 🫐🌿✨", p:{5:55,10:70}},

{id:"loewe-man",m:"Loewe",n:"Man EDP",col:"disenador",perf:["amaderada","citrica"],est:"todo",
 d:"Cardamomo, bergamota y mandarina que abren frescos y especiados; el sándalo, el cedro y el ciprés construyen un corazón maderado con carácter, y el almizcle blanco con pachulí cierran limpio y muy cercano a la piel.",
 q:"Para el que siempre huele bien y hace que acercarse a él valga la pena 🍊🌿🤍", p:{5:55,10:70}},

{id:"lv-imagination",m:"Louis Vuitton",n:"Imagination",col:"disenador",perf:["citrica","amaderada"],est:"calor",
 d:"Cidra, bergamota y naranja siciliana que abren brillantes y llenas de luz; el neroli y la canela de Ceylán calientan el corazón con elegancia especiada, y el té negro con gaiac y franquincienso cierran con una profundidad serena.",
 q:"Para el que viaja con estilo y entiende que la sofisticación no necesita gritar ✈️🍊🪵", p:{3:60,5:110,10:180}},

{id:"montblanc-explorer-platinum",m:"Montblanc",n:"Explorer Platinum",col:"disenador",perf:["fougere","amaderada"],est:"calor",
 d:"Hojas de violeta que abren frescas y verdes; la esclarea le da un corazón limpio con ese toque herbal y ligeramente ahumado, y el cedro cierra seco, elegante y sin excesos. Minimalista por diseño, efectivo en piel.",
 q:"Para el que confía en lo que lleva puesto y huele a que tiene todo resuelto 🌿🤍🪵", p:{5:35,10:50}},

{id:"prada-lhomme",m:"Prada",n:"L'Homme",col:"disenador",perf:["floral","amaderada"],est:"todo",
 d:"La frescura del neroli se combina con los matices especiados de la pimienta negra y el cardamomo, mientras el iris, la violeta y el geranio aportan un carácter refinado sobre una base cálida de ámbar, cedro, sándalo y pachulí.",
 q:"Para quien viste con elegancia sin esfuerzo y siempre deja impresión de buen gusto ✨🍃", p:{5:35,10:60}},

{id:"prada-lhomme-intense",m:"Prada",n:"L'Homme Intense",col:"disenador",perf:["floral","oriental"],est:"todo",
 d:"La majestuosidad del iris se funde con un corazón cálido de ámbar y pachulí, reposando sobre una base adictiva de haba tonka, cuero y sándalo que proyecta una seguridad imponente.",
 q:"Para quien disfruta la vida nocturna con un estilo impecable ✨🌙🍃", p:{5:40,10:70}},

{id:"tomford-lost-cherry",m:"Tom Ford",n:"Lost Cherry",col:"disenador",perf:["gourmand","floral"],est:"frio",
 d:"Cereza negra y licor que abren oscuros e irresistibles; la almendra amarga les da un filo sofisticado, y la rosa turca con jazmín sambac añaden una sensualidad que no se disculpa. La vainilla, la canela y el clavo cierran especiados y adictivos.",
 q:"Para el que sabe que lo mejor siempre tiene un lado oscuro 🍒🖤✨", p:{2:53,3:79,5:125}},

{id:"tomford-tobacco-vanille",m:"Tom Ford",n:"Tobacco Vanille",col:"disenador",perf:["gourmand","oriental"],est:"frio",
 d:"Hojas de tabaco y especias que abren con un calor inmediato, casi como entrar a una tabaquería antigua, y un corazón de vainilla, cacao y haba tonka que lo convierte en algo goloso sin perder elegancia. Frutas secas y madera cierran denso y rico.",
 q:"Para el que entiende que un buen perfume es la firma que deja en cada lugar 🚬🍫🤎", p:{3:55,5:90,10:165}},

{id:"versace-eros-flame",m:"Versace",n:"Eros Flame",col:"disenador",perf:["oriental","gourmand"],est:"todo",
 d:"Mandarina, pimienta de Madagascar y romero que abren con energía y carácter; la rosa y el geranio equilibran el corazón sin quitarle fuerza, y la vainilla con tonka, sándalo y musgo de roble cierran cálido, denso y muy seductor.",
 q:"Para el que entra a una habitación y cambia la temperatura sin decir una palabra 🔥🍊🖤", p:{5:28,10:50}},

{id:"ysl-myslf",m:"Yves Saint Laurent",n:"MYSLF Le Parfum",col:"disenador",perf:["oriental","floral"],est:"todo",
 d:"Pimienta negra que abre con filo y actitud; la flor de azahar lo suaviza con una masculinidad que lo hace interesante, y la vainilla bourbon con ámbar y pachulí cierran cálido, sensual y duradero.",
 q:"Para el que no necesita etiquetas y huele a que las normas las escribe él 🖤🌸✨", p:{5:45,10:65}},

/* ---------- ÁRABES ---------- */
{id:"arabiyat-marwa",m:"Arabiyat",n:"Marwa",col:"arabe",perf:["citrica","amaderada"],est:"calor",
 d:"Bergamota de Calabria, lima ácida y naranja siciliana irradian luminosidad cítrica; el jengibre nigeriano, la canela de Ceylán y el neroli de Túnez elevan con calidez especiada de raíces orientales, y el ambroxan con té negro, olíbano y gaiac cierra ahumado y magnético.",
 q:"Para quien lleva el mundo en su mirada y una historia interesante en cada lugar que pisa 🌍✨", p:{10:30}},

{id:"french-avenue-azzure-aoud",m:"French Avenue",n:"Azzure Aoud",col:"arabe",perf:["oriental","amaderada"],est:"frio",
 d:"Maracuyá, rosa y azafrán que abren con una riqueza frutal y especiada; el oud y el pachulí toman el control con presencia oriental, y el cuero con ládano, sándalo y vainilla cierran oscuro, opulento y duradero.",
 q:"Para el que aprecia lo exótico y entiende que un buen oud no es para cualquiera 🌹🪵🖤", p:{10:30}},

{id:"kok-royal-amber",m:"King of Kings",n:"Royal Amber",col:"arabe",perf:["oriental","citrica"],est:"todo",
 d:"Mango, bergamota y jengibre que abren jugosos y vibrantes; un corazón de frutas frescas con cardamomo, canela y clavo que añaden calidez especiada, y el ámbar con vainilla bourbon y almizcle blanco cierran suave, dulce y cercano a la piel.",
 q:"Para el que disfruta lo bueno sin disculparse 👑🥭✨", p:{10:30}},

{id:"rasasi-hawas-highness",m:"Rasasi",n:"Hawas Highness",col:"arabe",perf:["citrica","amaderada"],est:"calor",
 d:"Cítricos, notas especiadas y ámbar arrancan con energía y carácter; el jazmín, la violeta y la rosa aportan una elegancia floral envolvente, y el cedro con vetiver y pachulí asientan todo en una base amaderada, seca y de buena duración.",
 q:"Para quien llega a cualquier lugar y sin decir nada ya es el centro de atención 👑🌸", p:{10:40}},

{id:"rayhaan-cal-tiger",m:"Rayhaan",n:"Cal Cologne Edition Tiger",col:"arabe",perf:["oriental","floral"],est:"frio",
 d:"Clavo y nuez moscada que abren con especias orientales que no piden disculpas; la leche y la rosa suavizan el corazón con una cremosidad inesperada, y el incienso con ládano y ámbar cierran denso, misterioso y envolvente.",
 q:"Para el que lleva su fragancia como un ritual y entiende que oler bien es respeto propio 🐯🌹🪔", p:{10:30}},
];
