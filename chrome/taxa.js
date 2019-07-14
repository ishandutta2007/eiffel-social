const taxaIds = {
  "Acanthodes": 157017,
  "Acheroraptor": 283585,
  "Acheroraptor temertyorum": 283586,
  "Acipenser": 35128,
  "Acmeodon": 40232,
  "Acritohippus": 42985,
  "Acrocanthosaurus": 38597,
  "Actinopterygii": 265718,
  "Adocidae": 54275,
  "Adocus": 37652,
  "Aelurodon": 41190,
  "Aelurodon montanensis": 83320,
  "Albertosaurus": 38607,
  "Alligatoridae": 38421,
  "Allosaurus": 38590,
  "Alphadon": 39947,
  "Alvarezsauroidea": 162354,
  "Amia": 56535,
  "Amiidae": 56536,
  "Amiiformes": 35190,
  "Ammonitida": 84931,
  "Ammonoidea": 14505,
  "Amniota": 53189,
  "Amphibia": 36319,
  "Amphicoelias": 53180,
  "Anas": 67686,
  "Anchura": 9472,
  "Anconodon": 39824,
  "Anemia": 55510,
  "Angiospermae": 54885,
  "Anisonchus oligistus": 44105,
  "Ankylosauria": 147920,
  "Ankylosauridae": 38831,
  "Ankylosaurus": 38837,
  "Antilocapra": 42721,
  "Antilocapridae": 42720,
  "Anura": 150288,
  "Anuri": 97112,
  "Anzu": 290022,
  "Anzu wyliei": 290023,
  "Apatosaurus": 38665,
  "Aphronorus orieli": 44179,
  "Aplodontidae": 120602,
  "Aporrhaidae": 53504,
  "Apternodus": 40516,
  "Apternodus baladontus": 44193,
  "Aquilops americanus": 310996,
  "Araucarioxylon": 161941,
  "Archaeotriakis": 34639,
  "Archosauria": 38215,
  "Arctocyonidae": 42198,
  "Arctodus": 41308,
  "Arctoryctes": 40433,
  "Ardynomys": 41426,
  "Ardynomys occidentalis": 44311,
  "Argaliatherium robustum": 319843,
  "Articulata": 129759,
  "Artiodactyla": 87634,
  "Arvicola": 41738,
  "Aspideretes": 37675,
  "Aspideretes lancensis": 65790,
  "Aspideretoides": 67335,
  "Astandes": 9506,
  "Asteroidea": 31341,
  "Atira": 8578,
  "Atractosteus": 63032,
  "Avaceratops": 55538,
  "Aves": 162965,
  "Avisaurus archibaldi": 64064,
  "Axestemys": 67300,
  "Azhdarchidae": 81005,
  "Baculites": 14603,
  "Baculitidae": 59287,
  "Baenidae": 37627,
  "Bairdia": 23919,
  "Basilemys": 37655,
  "Bathygenys alpha": 44476,
  "Batoidea": 63195,
  "Batrachichnus": 378349,
  "Batrachosauroididae": 37359,
  "Belemnites": 15843,
  "Belemnitida": 15832,
  "Belonostomus": 35244,
  "Bison": 42751,
  "Bisonalveus": 40274,
  "Bivalvia": 16005,
  "Borealosuchus": 110899,
  "Boremys": 37638,
  "Bovidae": 42742,
  "Brachiodontes": 64227,
  "Brachiopoda": 26322,
  "Brachyceratops montanensis": 63895,
  "Brachychampsa": 53185,
  "Brachygaulus leistneri": 365907,
  "Brachygaulus nicholsi": 365906,
  "Brachylophosaurus": 38757,
  "Brodavis": 232962,
  "Brontotheridae": 43027,
  "Buccinidae": 59409,
  "Bullopsis": 11912,
  "Cactocrinus": 31717,
  "Caenagnathidae": 54544,
  "Calippus": 42990,
  "Callianassidae": 66316,
  "Camarasaurus": 38697,
  "Camelidae": 42513,
  "Camelops": 42520,
  "Campeloma": 118610,
  "Camptosauridae": 54189,
  "Candona": 236965,
  "Canidae": 41189,
  "Canis": 41198,
  "Cardium": 17448,
  "Carnivora": 36905,
  "Carpolestes": 40744,
  "Carpolestidae": 40741,
  "Cassidae": 59582,
  "Castor": 41539,
  "Castoridae": 41534,
  "Catopsalis": 39829,
  "Caudata": 53229,
  "Cavellina": 24712,
  "Celtis": 53532,
  "Centetodon": 40395,
  "Centrosaurus": 38854,
  "Cephalopoda": 12315,
  "Cerasinops": 110946,
  "Ceratodus": 54495,
  "Ceratodus nirumbee": 366090,
  "Ceratomorpha": 93969,
  "Ceratopsia": 338633,
  "Ceratopsidae": 38851,
  "Cercidiphyllum": 54608,
  "Cervus": 42666,
  "Chadrolagus": 42171,
  "Chamops segnis": 54233,
  "Champsosauri": 308820,
  "Champsosauridae": 37785,
  "Champsosaurus": 37786,
  "Chelydridae": 37704,
  "Chirostenotes": 38555,
  "Chondrichthyes": 34422,
  "Chordata": 33815,
  "Choristodera": 37784,
  "Chriacus calenancus": 45078,
  "Cimexomys": 39784,
  "Cimexomys minor": 45108,
  "Cimolestes": 40235,
  "Cimolomys": 39855,
  "Cimolomys clarki": 45124,
  "Cladophlebis": 56111,
  "Claosaurus annectens": 54239,
  "Cleiothyridina": 29176,
  "Clioscaphites": 14697,
  "Coelurosauria": 53940,
  "Coleoptera": 69148,
  "Colodon": 43107,
  "Composita": 29181,
  "Compsemys": 37641,
  "Condylarthra": 42197,
  "Coniopteris": 56101,
  "Copedelphys": 39956,
  "Corbicula": 17504,
  "Corbula": 18441,
  "Corbula monmouthensis": 59865,
  "Coriops": 35354,
  "Coronosauria": 52819,
  "Crania": 26603,
  "Crassatellina": 17519,
  "Cretorectolobus": 34582,
  "Cricetidae": 41724,
  "Crinoidea": 31590,
  "Crocodilia": 36582,
  "Crocodilomorphi": 53401,
  "Crocodylia": 38309,
  "Crocodylidae": 38435,
  "Crocodyliformes": 252987,
  "Crocodylomorpha": 209376,
  "Crossopterygidae": 90691,
  "Crotalus": 38159,
  "Crustacea": 82629,
  "Cryptodira": 37622,
  "Cryptorhytis": 10998,
  "Cuspidaria": 18727,
  "Cycadaceae": 54571,
  "Cycadeoidea": 56270,
  "Cycadopsida": 54800,
  "Cylindrodon": 41428,
  "Cylindrodontidae": 41424,
  "Cynomys": 41496,
  "Cyprinidae": 64192,
  "Daspletosaurus": 38608,
  "Decapoda": 22304,
  "Deinonychosauria": 57260,
  "Deinonychus": 38562,
  "Deinonychus antirrhopus": 54555,
  "Delphyodontos": 34797,
  "Dermatemydidae": 37651,
  "Deroceras": 291005,
  "Desmatotherium kayi": 45608,
  "Diceratherium": 43198,
  "Diceratherium radtkei": 293756,
  "Dicromyocrinus": 32138,
  "Didelphidae": 39945,
  "Didelphodon": 40007,
  "Didelphodon vorax": 45711,
  "Didymictis": 40973,
  "Diettertia montanensis": 56093,
  "Dilophodon": 43093,
  "Dimetropus": 378410,
  "Dinosauria": 52775,
  "Diplodocidae": 319108,
  "Diplodocus": 38669,
  "Diptera": 70527,
  "Domnina": 40467,
  "Drepanocheilus": 9785,
  "Drepanochilus": 132023,
  "Dromaeosauridae": 38561,
  "Dromaeosaurus": 38566,
  "Dromopus": 378358,
  "Dryophyllum": 55983,
  "Echinodermata": 30739,
  "Ectocion": 42261,
  "Edgarosaurus": 170732,
  "Edgarosaurus muddi": 170733,
  "Edmontosaurus": 38761,
  "Elasmosauridae": 38175,
  "Ellipsoscapha": 11933,
  "Emarginachelys cretacea": 172850,
  "Emydidae": 37714,
  "Enantiornithes": 53286,
  "Enchodus": 35564,
  "Entelodontidae": 42365,
  "Entoptychus": 41653,
  "Eokainaster": 31491,
  "Eotitanops": 43038,
  "Epoicotherium": 43672,
  "Eporeodon": 42493,
  "Equidae": 42984,
  "Equisetaceae": 54757,
  "Equisetum": 55064,
  "Equus": 42996,
  "Erethizon": 42139,
  "Eubaena": 37631,
  "Eucrossorhinus": 95308,
  "Eumetria": 29282,
  "Eumys": 41772,
  "Euoplocephalus": 38838,
  "Eutheria": 182911,
  "Eutrephoceras": 13198,
  "Felidae": 41045,
  "Felis": 41055,
  "Ficus": 9857,
  "Filicopsida": 54002,
  "Galeamopus": 319102,
  "Gastropoda": 8304,
  "Gingerichia geoteretes": 246761,
  "Ginkgo": 55067,
  "Glaucomys": 41500,
  "Glyptopleura": 23206,
  "Glyptops": 37625,
  "Glyptosaurus montanus": 173020,
  "Glyptostrobus": 55253,
  "Gobiconodon": 39757,
  "Gobiconodon ostromi": 46675,
  "Gomphotheriidae": 43240,
  "Goniasteridae": 53913,
  "Goniomya": 18744,
  "Gorgosaurus": 53193,
  "Gregorymys": 41655,
  "Gryphaea": 16691,
  "Gryposaurus": 53014,
  "Gulo": 41112,
  "Gymnospermae": 83627,
  "Gypsonictops": 40255,
  "Habrosaurus": 37414,
  "Habrosaurus dilatus": 67757,
  "Hadrosauria": 65943,
  "Hadrosauridae": 38755,
  "Haplaletes": 42248,
  "Haresiceras": 14966,
  "Helaletes": 43109,
  "Helaletes nanus": 46822,
  "Helix": 116599,
  "Helodermoides": 38003,
  "Helodermoides tuberculatus": 173019,
  "Helopanoplia": 67666,
  "Hemiaster": 33391,
  "Hemiptera": 94230,
  "Herpetotherium": 39965,
  "Herpetotherium fuzax": 46891,
  "Hesperocyon": 41217,
  "Hesperocyon gregarius": 46911,
  "Hesperosaurus mjosi": 68159,
  "Heteraletes": 43110,
  "Heteraletes leotanus": 46947,
  "Hiodontidae": 180145,
  "Hipparion (Nannippus)": 104804,
  "Hippotherium isonesum": 47040,
  "Holocephali": 34760,
  "Homacodontidae": 100755,
  "Homo": 40901,
  "Homotherium": 41056,
  "Hoplochelys": 37658,
  "Hoploparia": 22484,
  "Hoploscaphites": 15015,
  "Hulettia": 35015,
  "Hyaenodon": 40917,
  "Hybodontidae": 210086,
  "Hybodontidae": 210086,
  "Hybodus": 34498,
  "Hymenoptera": 70707,
  "Hyolitha": 7629,
  "Hypertragulidae": 42589,
  "Hypotodus": 34611,
  "Hypsilophodontidae": 38734,
  "Hyrachyus douglassi": 47273,
  "Hyracodon": 43155,
  "Hyracodontidae": 43144,
  "Icthyosarcolites": 308425,
  "Ictops intermedius": 47346,
  "Ictops major": 47347,
  "Ictops montanus": 47348,
  "Ictops tenuis": 47349,
  "Inoceramidae": 60714,
  "Inoceramus": 16727,
  "Insecta": 56637,
  "Insectivora": 40337,
  "Insectivorae": 96014,
  "Ischyrhiza": 34688,
  "Ischyromys": 41399,
  "Ischyromys douglassi": 47378,
  "Jeletzkytes": 15050,
  "Jeletzkytes criptonodosus": 145446,
  "Joanellia": 22287,
  "Juglandaceae": 54584,
  "Labidolemur": 40247,
  "Lacertilia": 37832,
  "Lagomorpha": 42151,
  "Lagurus": 41793,
  "Leidyosuchus": 38448,
  "Lemmiscus": 41799,
  "Lepidasterella": 31383,
  "Lepisosteidae": 63030,
  "Lepisosteus": 35150,
  "Leporidae": 42163,
  "Leptacodon": 40499,
  "Leptauchenia": 42496,
  "Leptictis": 40260,
  "Leptoceratops": 38849,
  "Leptomeryx": 42607,
  "Leptomeryx evansi": 47588,
  "Leptomeryx speciosus": 47597,
  "Leptoreodon": 42576,
  "Leptotragulus": 42577,
  "Leptotragulus profectus": 47630,
  "Lepus": 42176,
  "Limnenetes": 42497,
  "Limnocythere": 98337,
  "Lissamphibia": 67351,
  "Lisserpeton": 37381,
  "Lissodus": 34501,
  "Listracanthus": 151730,
  "Litomylus dissentaneus": 47732,
  "Lonchidion": 56537,
  "Longiclava": 5592,
  "Loxolophus nordicus": 47793,
  "Lymnaea": 83642,
  "Lynx": 41058,
  "Macrotarsius": 40814,
  "Mactra": 17859,
  "Magnoliopsida": 55217,
  "Mahonia": 157336,
  "Maiasaura": 38765,
  "Mammalia": 36651,
  "Mammut": 43274,
  "Mammuthus": 43266,
  "Mammutidae": 43273,
  "Marmota": 41502,
  "Marsupialia": 39937,
  "Mastodon (Trilophodon) floridanus": 47934,
  "Megacerops": 43043,
  "Megalagus": 42178,
  "Megalagus turgidus": 48005,
  "Megalonyx": 43603,
  "Megatylopus": 42532,
  "Melvius": 58870,
  "Meniscoessus": 39832,
  "Merychippus": 43009,
  "Merychyus": 42499,
  "Merycodus": 42730,
  "Merycoidodon": 42502,
  "Merycoidodon culbertsonii": 48303,
  "Merycoidodontidae": 42488,
  "Mesodma": 39815,
  "Mesogaulus": 41474,
  "Mesohippus": 43010,
  "Mesoreodon chelonyx": 48409,
  "Metasequoia": 55255,
  "Metatheria": 39936,
  "Metengonoceras": 15196,
  "Metoicoceras": 15197,
  "Micrabaciidae": 105043,
  "Microtus": 41810,
  "Microvenator": 38532,
  "Microvenator celer": 65860,
  "Mimatuta morgoth": 48620,
  "Mimotricentes": 42211,
  "Miohippus": 43011,
  "Modiola": 77219,
  "Mollusca": 7805,
  "Monosaulax": 41549,
  "Montanamus bjorki": 48804,
  "Mosasauridae": 38049,
  "Mosasaurus": 36402,
  "Multituberculata": 39779,
  "Mustela": 41139,
  "Myalina": 16826,
  "Mylagaulidae": 41468,
  "Mylagaulus": 41476,
  "Myledaphus": 34808,
  "Myliobatiformes": 34720,
  "Myrmecoboides montanensis": 48922,
  "Mytonolagus": 42179,
  "Mytonomys": 41406,
  "Nannodectes intermedius": 48974,
  "Nanodelphys hunti": 48981,
  "Naomichelys": 63172,
  "Nautilus dekayi": 122370,
  "Necrocarcinus": 22565,
  "Nelumbites": 54072,
  "Neocardioceras": 15230,
  "Neogastroplites": 15236,
  "Neohipparion": 43013,
  "Neoplagiaulax": 39817,
  "Neotoma": 41822,
  "Neurankylidae": 37637,
  "Niglarodon": 41460,
  "Nodosauridae": 38817,
  "Nodosaurus": 38823,
  "Nucula": 16082,
  "Nuculana": 16083,
  "Nyssidium": 55903,
  "Ocajila makpiyahe": 49261,
  "Odocoileus": 42682,
  "Odontaspidae": 117650,
  "Odontaspis": 34620,
  "Oligoryctes cameronensis": 49303,
  "Oligoscalops": 40435,
  "Ondatra": 41826,
  "Oohkotokia horneri": 257758,
  "Orectolobidae": 63015,
  "Oreodontidae": 106434,
  "Oreohelix": 135545,
  "Oreonetes": 42506,
  "Ornithischia": 91106,
  "Ornithomimidae": 38539,
  "Ornithomimosauria": 55491,
  "Ornithomimus": 38544,
  "Ornithomimus grandis": 57588,
  "Ornithopoda": 38713,
  "Ornithothoraces": 64115,
  "Ornithurae": 137276,
  "Orodromeus": 64337,
  "Osteichthyes": 34881,
  "Ostracoda": 22826,
  "Ostrea": 16870,
  "Oviraptoridae": 38557,
  "Ovis": 42816,
  "Pachycephalidae": 186402,
  "Pachycephalosauria": 91118,
  "Pachycephalosauridae": 38783,
  "Pachycephalosaurus": 38786,
  "Pachymelania": 132511,
  "Pachyteuthis": 15881,
  "Paciculus": 41829,
  "Pagiophyllum": 288230,
  "Palaechthon": 40727,
  "Palaeogale sectoria": 49652,
  "Palaeolagus": 42184,
  "Palaeolagus burkei": 49655,
  "Palaeomerycidae": 42624,
  "Palaeonisciformes": 34963,
  "Palaeosyops fontinalis": 49693,
  "Palaeosyops paludosus": 49706,
  "Palatobaena": 37633,
  "Palmichnium": 164715,
  "Panopea": 18482,
  "Pantodonta": 165637,
  "Pantolestidae": 40271,
  "Paracryptodira": 153035,
  "Paradjidaumo": 41632,
  "Paramylodon": 43642,
  "Parapuzosia bradyi": 341065,
  "Parectypodus": 39818,
  "Pareumys": 41432,
  "Parictis": 41320,
  "Parictis major": 50001,
  "Paromomys": 40317,
  "Paronychodon": 38565,
  "Patellidae": 61636,
  "Peckemys": 212694,
  "Pectinidae": 61660,
  "Pelycodus": 40765,
  "Peradectes": 39981,
  "Peratherium": 39982,
  "Perissodactyla": 42980,
  "Peromyscus": 41837,
  "Peyeria": 34698,
  "Phelopteria": 16917,
  "Phenacodus": 42288,
  "Phenacomys": 41838,
  "Pholadomya": 18795,
  "Physa": 91741,
  "Picrodus": 40711,
  "Pinna": 16400,
  "Pinus": 55062,
  "Placenticeras": 15403,
  "Plagioglypta": 8185,
  "Planorbis": 61805,
  "Plantae": 54311,
  "Platanites": 55905,
  "Platanus": 53335,
  "Platecarpus": 36406,
  "Platycrinites": 31827,
  "Plesiadapis": 40738,
  "Plesiadapis anceps": 50429,
  "Plesiadapis churchilli": 50430,
  "Plesiadapis praecursor": 50440,
  "Plesiosauria": 36454,
  "Plesiosauridae": 38173,
  "Plethodon": 37390,
  "Plicatolamna": 95307,
  "Pliohippus": 43019,
  "Podozamites": 277344,
  "Poebrotherium": 42547,
  "Polychaeta": 7022,
  "Polycotylidae": 100152,
  "Polypodiopsida": 196331,
  "Populus": 55955,
  "Populus genetrix": 55303,
  "Presbyornis": 39622,
  "Primates": 40700,
  "Pristidae": 63612,
  "Proboscidea": 43230,
  "Procamelus": 42549,
  "Promerycochoerus": 50808,
  "Pronothodectes matthewi": 50864,
  "Propalaeosinopa": 40289,
  "Proscalopidae": 40432,
  "Proscalops": 40436,
  "Prosciurus": 41450,
  "Prosphyracephala rubiensis": 291198,
  "Proteidae": 37354,
  "Protentomodon": 40240,
  "Protocardia": 18121,
  "Protocardium": 61928,
  "Protoceras": 42581,
  "Protohippus": 43020,
  "Protoplatyrhina": 34701,
  "Protoreodon": 42487,
  "Protoscaphirhynchus squamosus": 67750,
  "Protospermophilus": 41520,
  "Protungulatum": 40211,
  "Protungulatum gorgun": 51117,
  "Protungulatum sloani": 51119,
  "Psammorhynchus longipinnis": 94892,
  "Pseudhipparion": 43022,
  "Pseudocylindrodon": 41433,
  "Pseudocylindrodon medius": 51175,
  "Pseudomelania": 10352,
  "Psittacotherium": 40619,
  "Pteria": 16981,
  "Pteridopsida": 263811,
  "Pterosauria": 38461,
  "Ptilodus": 39820,
  "Ptychotrygon": 34704,
  "Pugnoides": 28844,
  "Purgatorius ceratops": 51267,
  "Purgatorius unio": 51270,
  "Quereuxia": 208155,
  "Rana": 37481,
  "Rangifer": 42688,
  "Ranidae": 37478,
  "Reptilia": 36322,
  "Reticulariina": 29595,
  "Rhinobatidae": 63019,
  "Rhinocerotidae": 43187,
  "Rhipidistia": 90692,
  "Richardoestesia": 58873,
  "Richardoestesia gilmorei": 58874,
  "Rodentia": 147571,
  "Salamandridae": 37393,
  "Sansabella": 23548,
  "Sauria": 57278,
  "Saurischia": 38505,
  "Sauropelta": 38827,
  "Sauropoda": 38653,
  "Sauroposeidon": 66616,
  "Sauropterygia": 38164,
  "Saurornitholestes": 38567,
  "Scapherpeton": 37383,
  "Scapherpetonidae": 37380,
  "Scaphiopus": 37454,
  "Scaphites": 15603,
  "Scaphitidae": 95940,
  "Scaphopoda": 8166,
  "Sequoia": 55068,
  "Serpentes": 38069,
  "Serrifusus": 11667,
  "Solenoceras": 15640,
  "Sorex": 40486,
  "Spermophilus": 41528,
  "Sphaerotholus buchholtzae": 67683,
  "Spirifer": 29638,
  "Spirorbis": 7229,
  "Spurimus": 41452,
  "Squalicorax": 34633,
  "Squamaria": 27991,
  "Squamata": 36379,
  "Stegoceras": 38787,
  "Stegosaurus": 38814,
  "Stenotholus kohleri": 53215,
  "Stibarus": 42379,
  "Struthiomimus": 38545,
  "Stygimoloch": 38788,
  "Stygimys kuszmauli": 51835,
  "Stygiochelys": 67758,
  "Subhyracodon": 43225,
  "Subhyracodon occidentale": 104777,
  "Succinea": 91734,
  "Suuwassea": 57363,
  "Suuwassea emilieae": 57364,
  "Sylvilagus": 42193,
  "Symmetrodonta": 39862,
  "Synaptomys": 41881,
  "Synechodus": 34673,
  "Taeniolabis": 39835,
  "Talpidae": 40398,
  "Tamiasciurus": 41530,
  "Tancredia": 18304,
  "Tapiridae": 43129,
  "Tapocyon robustus": 52074,
  "Taricha": 37409,
  "Taxidea": 41175,
  "Taxodiaceae": 54798,
  "Teleoceras": 43226,
  "Tellina": 18314,
  "Tellina sulcata": 106347,
  "Telmatherium vallidens": 52148,
  "Tempskya": 207953,
  "Tenontosaurus": 38741,
  "Tenontosaurus tilleti": 251660,
  "Tenontosaurus tilletti": 52887,
  "Teredo": 18510,
  "Terminonaris": 93884,
  "Tessarolax": 10572,
  "Testudinata": 106739,
  "Testudines": 56475,
  "Testudinidae": 37739,
  "Testudo": 37744,
  "Tetonius rex": 52194,
  "Tetrapoda": 53190,
  "Theria": 39860,
  "Theropoda": 38513,
  "Thescelesaurus": 357851,
  "Thescelosauridae": 64386,
  "Thescelosaurus": 38742,
  "Thomomys": 41671,
  "Titanoides": 40572,
  "Titanoides primaevus": 52347,
  "Torosaurus": 38861,
  "Trachytriton": 10598,
  "Tricentes": 52422,
  "Triceratops": 38862,
  "Triceratops ingens": 66024,
  "Triconodonta": 39745,
  "Trilobita": 19100,
  "Trionychidae": 37674,
  "Trionyx": 37682,
  "Troodon": 38572,
  "Troodontidae": 54468,
  "Tullochelys": 319458,
  "Turritella": 10637,
  "Typha": 252000,
  "Tyrannosauridae": 38606,
  "Tyrannosauroidea": 58837,
  "Tyrannosaurus": 38613,
  "Tyrannosaurus rex": 54833,
  "Ugrosaurus olsoni": 66017,
  "Undichna": 108502,
  "Unio": 62726,
  "Unionidae": 62728,
  "Ursidae": 41301,
  "Ursus": 41331,
  "Ursus arctos": 52604,
  "Vanikoropsis": 10656,
  "Varanidae": 38035,
  "Veniella": 18387,
  "Vertebrata": 179042,
  "Viviparus": 68006,
  "Vulpes": 41248,
  "Wannaganosuchus": 38434,
  "Wilsoneumys": 41889,
  "Xenophora": 10685,
  "Xenotherium unicum": 52722,
  "Zamites": 54570,
  "Zapodidae": 41700,
  "Zapus": 41719,
  "Zephyrosaurus": 38743,
};
