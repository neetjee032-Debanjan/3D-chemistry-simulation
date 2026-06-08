const ELEMENTS = [
{"z":1,"symbol":"H","name":"Hydrogen","mass":1.008,"group":1,"period":1,"block":"s","valence":1,"en":"2.20","ie":"1312","radius":"53","ox":"+1, -1","config":"1s1","neutrons":0,"color":16777215},
{"z":2,"symbol":"He","name":"Helium","mass":4.003,"group":18,"period":1,"block":"s","valence":0,"en":"—","ie":"2372","radius":"31","ox":"0","config":"1s2","neutrons":2,"color":14342847},
{"z":3,"symbol":"Li","name":"Lithium","mass":6.941,"group":1,"period":2,"block":"s","valence":1,"en":"0.98","ie":"520","radius":"167","ox":"+1","config":"1s2 2s1","neutrons":4,"color":13414655},
{"z":4,"symbol":"Be","name":"Beryllium","mass":9.012,"group":2,"period":2,"block":"s","valence":2,"en":"1.57","ie":"900","radius":"112","ox":"+2","config":"1s2 2s2","neutrons":5,"color":12779775},
{"z":5,"symbol":"B","name":"Boron","mass":10.811,"group":13,"period":2,"block":"p","valence":3,"en":"2.04","ie":"801","radius":"87","ox":"+3","config":"1s2 2s2 2p1","neutrons":6,"color":16758713},
{"z":6,"symbol":"C","name":"Carbon","mass":12.011,"group":14,"period":2,"block":"p","valence":4,"en":"2.55","ie":"1086","radius":"77","ox":"-4, +2, +4","config":"1s2 2s2 2p2","neutrons":6,"color":9474192},
{"z":7,"symbol":"N","name":"Nitrogen","mass":14.007,"group":15,"period":2,"block":"p","valence":5,"en":"3.04","ie":"1402","radius":"75","ox":"-3, +3, +5","config":"1s2 2s2 2p3","neutrons":7,"color":3166456},
{"z":8,"symbol":"O","name":"Oxygen","mass":15.999,"group":16,"period":2,"block":"p","valence":6,"en":"3.44","ie":"1314","radius":"73","ox":"-2, -1","config":"1s2 2s2 2p4","neutrons":8,"color":16714909},
{"z":9,"symbol":"F","name":"Fluorine","mass":18.998,"group":17,"period":2,"block":"p","valence":7,"en":"3.98","ie":"1681","radius":"64","ox":"-1","config":"1s2 2s2 2p5","neutrons":10,"color":9484368},
{"z":10,"symbol":"Ne","name":"Neon","mass":20.18,"group":18,"period":2,"block":"p","valence":0,"en":"—","ie":"2081","radius":"58","ox":"0","config":"1s2 2s2 2p6","neutrons":10,"color":11702261},
{"z":11,"symbol":"Na","name":"Sodium","mass":22.99,"group":1,"period":3,"block":"s","valence":1,"en":"0.93","ie":"496","radius":"186","ox":"+1","config":"1s2 2s2 2p6 3s1","neutrons":12,"color":11284210},
{"z":12,"symbol":"Mg","name":"Magnesium","mass":24.305,"group":2,"period":3,"block":"s","valence":2,"en":"1.31","ie":"738","radius":"160","ox":"+2","config":"1s2 2s2 2p6 3s2","neutrons":12,"color":9103359},
{"z":13,"symbol":"Al","name":"Aluminium","mass":26.982,"group":13,"period":3,"block":"p","valence":3,"en":"1.61","ie":"578","radius":"143","ox":"+3","config":"1s2 2s2 2p6 3s2 3p1","neutrons":14,"color":12566409},
{"z":14,"symbol":"Si","name":"Silicon","mass":28.086,"group":14,"period":3,"block":"p","valence":4,"en":"1.90","ie":"786","radius":"118","ox":"-4, +4","config":"1s2 2s2 2p6 3s2 3p2","neutrons":14,"color":15771808},
{"z":15,"symbol":"P","name":"Phosphorus","mass":30.974,"group":15,"period":3,"block":"p","valence":5,"en":"2.19","ie":"1012","radius":"111","ox":"-3, +3, +5","config":"1s2 2s2 2p6 3s2 3p3","neutrons":16,"color":16746496},
{"z":16,"symbol":"S","name":"Sulfur","mass":32.065,"group":16,"period":3,"block":"p","valence":6,"en":"2.58","ie":"1000","radius":"104","ox":"-2, +4, +6","config":"1s2 2s2 2p6 3s2 3p4","neutrons":16,"color":16777008},
{"z":17,"symbol":"Cl","name":"Chlorine","mass":35.453,"group":17,"period":3,"block":"p","valence":7,"en":"3.16","ie":"1251","radius":"99","ox":"-1, +1, +3, +5, +7","config":"1s2 2s2 2p6 3s2 3p5","neutrons":18,"color":2091017},
{"z":18,"symbol":"Ar","name":"Argon","mass":39.948,"group":18,"period":3,"block":"p","valence":0,"en":"—","ie":"1521","radius":"71","ox":"0","config":"1s2 2s2 2p6 3s2 3p6","neutrons":22,"color":8456675},
{"z":19,"symbol":"K","name":"Potassium","mass":39.098,"group":1,"period":4,"block":"s","valence":1,"en":"0.82","ie":"419","radius":"227","ox":"+1","config":"[Ar] 4s1","neutrons":20,"color":9384148},
{"z":20,"symbol":"Ca","name":"Calcium","mass":40.078,"group":2,"period":4,"block":"s","valence":2,"en":"1.00","ie":"590","radius":"197","ox":"+2","config":"[Ar] 4s2","neutrons":20,"color":4063231},
{"z":21,"symbol":"Sc","name":"Scandium","mass":44.956,"group":3,"period":4,"block":"d","valence":3,"en":"1.36","ie":"633","radius":"162","ox":"+3","config":"[Ar] 3d1 4s2","neutrons":24,"color":14818707},
{"z":22,"symbol":"Ti","name":"Titanium","mass":47.867,"group":4,"period":4,"block":"d","valence":4,"en":"1.54","ie":"659","radius":"147","ox":"+4","config":"[Ar] 3d2 4s2","neutrons":26,"color":13554390},
{"z":23,"symbol":"V","name":"Vanadium","mass":50.942,"group":5,"period":4,"block":"d","valence":5,"en":"1.63","ie":"650","radius":"134","ox":"+5","config":"[Ar] 3d3 4s2","neutrons":28,"color":14744426},
{"z":24,"symbol":"Cr","name":"Chromium","mass":51.996,"group":6,"period":4,"block":"d","valence":6,"en":"1.66","ie":"653","radius":"128","ox":"+3, +6","config":"[Ar] 3d5 4s1","neutrons":28,"color":13479955},
{"z":25,"symbol":"Mn","name":"Manganese","mass":54.938,"group":7,"period":4,"block":"d","valence":7,"en":"1.55","ie":"717","radius":"127","ox":"+2, +4, +7","config":"[Ar] 3d5 4s2","neutrons":30,"color":16762624},
{"z":26,"symbol":"Fe","name":"Iron","mass":55.845,"group":8,"period":4,"block":"d","valence":2,"en":"1.83","ie":"762","radius":"126","ox":"+2, +3","config":"[Ar] 3d6 4s2","neutrons":30,"color":14771251},
{"z":27,"symbol":"Co","name":"Cobalt","mass":58.933,"group":9,"period":4,"block":"d","valence":2,"en":"1.88","ie":"760","radius":"125","ox":"+2, +3","config":"[Ar] 3d7 4s2","neutrons":32,"color":10610206},
{"z":28,"symbol":"Ni","name":"Nickel","mass":58.693,"group":10,"period":4,"block":"d","valence":2,"en":"1.91","ie":"737","radius":"124","ox":"+2","config":"[Ar] 3d8 4s2","neutrons":31,"color":12065209},
{"z":29,"symbol":"Cu","name":"Copper","mass":63.546,"group":11,"period":4,"block":"d","valence":2,"en":"1.90","ie":"745","radius":"128","ox":"+1, +2","config":"[Ar] 3d10 4s1","neutrons":35,"color":13141043},
{"z":30,"symbol":"Zn","name":"Zinc","mass":65.38,"group":12,"period":4,"block":"d","valence":2,"en":"1.65","ie":"906","radius":"122","ox":"+2","config":"[Ar] 3d10 4s2","neutrons":35,"color":8220848},
{"z":31,"symbol":"Ga","name":"Gallium","mass":69.723,"group":13,"period":4,"block":"p","valence":3,"en":"1.81","ie":"579","radius":"136","ox":"+3","config":"[Ar] 3d10 4s2 4p1","neutrons":39,"color":16078534},
{"z":32,"symbol":"Ge","name":"Germanium","mass":72.63,"group":14,"period":4,"block":"p","valence":4,"en":"2.01","ie":"762","radius":"125","ox":"+2, +4","config":"[Ar] 3d10 4s2 4p2","neutrons":41,"color":10357186},
{"z":33,"symbol":"As","name":"Arsenic","mass":74.922,"group":15,"period":4,"block":"p","valence":5,"en":"2.18","ie":"947","radius":"114","ox":"-3, +3, +5","config":"[Ar] 3d10 4s2 4p3","neutrons":42,"color":6172483},
{"z":34,"symbol":"Se","name":"Selenium","mass":78.971,"group":16,"period":4,"block":"p","valence":6,"en":"2.55","ie":"941","radius":"103","ox":"-2, +4, +6","config":"[Ar] 3d10 4s2 4p4","neutrons":45,"color":13904667},
{"z":35,"symbol":"Br","name":"Bromine","mass":79.904,"group":17,"period":4,"block":"p","valence":7,"en":"2.96","ie":"1140","radius":"114","ox":"-1, +1, +5","config":"[Ar] 3d10 4s2 4p5","neutrons":45,"color":10942633},
{"z":36,"symbol":"Kr","name":"Krypton","mass":83.798,"group":18,"period":4,"block":"p","valence":0,"en":"3.00","ie":"1351","radius":"88","ox":"0, +2","config":"[Ar] 3d10 4s2 4p6","neutrons":48,"color":6079697},
{"z":37,"symbol":"Rb","name":"Rubidium","mass":85.468,"group":1,"period":5,"block":"s","valence":1,"en":"0.82","ie":"403","radius":"248","ox":"+1","config":"[Kr] 5s1","neutrons":48,"color":11700414},
{"z":38,"symbol":"Sr","name":"Strontium","mass":87.62,"group":2,"period":5,"block":"s","valence":2,"en":"0.95","ie":"549","radius":"215","ox":"+2","config":"[Kr] 5s2","neutrons":50,"color":13160320},
{"z":39,"symbol":"Y","name":"Yttrium","mass":88.906,"group":3,"period":5,"block":"d","valence":3,"en":"1.22","ie":"600","radius":"180","ox":"+3","config":"[Kr] 4d1 5s2","neutrons":50,"color":9466570},
{"z":40,"symbol":"Zr","name":"Zirconium","mass":91.224,"group":4,"period":5,"block":"d","valence":4,"en":"1.33","ie":"640","radius":"160","ox":"+4","config":"[Kr] 4d2 5s2","neutrons":51,"color":8679776},
{"z":41,"symbol":"Nb","name":"Niobium","mass":92.906,"group":5,"period":5,"block":"d","valence":5,"en":"1.6","ie":"652","radius":"146","ox":"+5","config":"[Kr] 4d4 5s1","neutrons":52,"color":8392031},
{"z":42,"symbol":"Mo","name":"Molybdenum","mass":95.95,"group":6,"period":5,"block":"d","valence":6,"en":"2.16","ie":"684","radius":"139","ox":"+6","config":"[Kr] 4d5 5s1","neutrons":54,"color":9266124},
{"z":43,"symbol":"Tc","name":"Technetium","mass":98,"group":7,"period":5,"block":"d","valence":7,"en":"1.9","ie":"702","radius":"136","ox":"+4, +7","config":"[Kr] 4d5 5s2","neutrons":55,"color":8072519},
{"z":44,"symbol":"Ru","name":"Ruthenium","mass":101.07,"group":8,"period":5,"block":"d","valence":2,"en":"2.2","ie":"710","radius":"134","ox":"+3, +4, +8","config":"[Kr] 4d7 5s1","neutrons":57,"color":10742909},
{"z":45,"symbol":"Rh","name":"Rhodium","mass":102.905,"group":9,"period":5,"block":"d","valence":3,"en":"2.28","ie":"720","radius":"134","ox":"+3","config":"[Kr] 4d8 5s1","neutrons":58,"color":10850635},
{"z":46,"symbol":"Pd","name":"Palladium","mass":106.42,"group":10,"period":5,"block":"d","valence":0,"en":"2.20","ie":"804","radius":"137","ox":"+2, +4","config":"[Kr] 4d10","neutrons":60,"color":12160560},
{"z":47,"symbol":"Ag","name":"Silver","mass":107.868,"group":11,"period":5,"block":"d","valence":1,"en":"1.93","ie":"731","radius":"144","ox":"+1","config":"[Kr] 4d10 5s1","neutrons":61,"color":13684784},
{"z":48,"symbol":"Cd","name":"Cadmium","mass":112.414,"group":12,"period":5,"block":"d","valence":2,"en":"1.69","ie":"868","radius":"151","ox":"+2","config":"[Kr] 4d10 5s2","neutrons":64,"color":14719232},
{"z":49,"symbol":"In","name":"Indium","mass":114.818,"group":13,"period":5,"block":"p","valence":3,"en":"1.78","ie":"558","radius":"156","ox":"+3","config":"[Kr] 4d10 5s2 5p1","neutrons":66,"color":15852860},
{"z":50,"symbol":"Sn","name":"Tin","mass":118.71,"group":14,"period":5,"block":"p","valence":4,"en":"1.96","ie":"708","radius":"145","ox":"+2, +4","config":"[Kr] 4d10 5s2 5p2","neutrons":69,"color":14676992},
{"z":51,"symbol":"Sb","name":"Antimony","mass":121.76,"group":15,"period":5,"block":"p","valence":5,"en":"2.05","ie":"834","radius":"133","ox":"-3, +3, +5","config":"[Kr] 4d10 5s2 5p3","neutrons":71,"color":7560244},
{"z":52,"symbol":"Te","name":"Tellurium","mass":127.6,"group":16,"period":5,"block":"p","valence":6,"en":"2.1","ie":"869","radius":"123","ox":"-2, +4, +6","config":"[Kr] 4d10 5s2 5p4","neutrons":76,"color":10283726},
{"z":53,"symbol":"I","name":"Iodine","mass":126.904,"group":17,"period":5,"block":"p","valence":7,"en":"2.66","ie":"1008","radius":"133","ox":"-1, +1, +5, +7","config":"[Kr] 4d10 5s2 5p5","neutrons":74,"color":9713664},
{"z":54,"symbol":"Xe","name":"Xenon","mass":131.293,"group":18,"period":5,"block":"p","valence":0,"en":"2.60","ie":"1170","radius":"108","ox":"0, +2, +4, +6","config":"[Kr] 4d10 5s2 5p6","neutrons":77,"color":4351664},
{"z":55,"symbol":"Cs","name":"Cesium","mass":132.905,"group":1,"period":6,"block":"s","valence":1,"en":"0.79","ie":"376","radius":"267","ox":"+1","config":"[Xe] 6s1","neutrons":78,"color":12202058},
{"z":56,"symbol":"Ba","name":"Barium","mass":137.327,"group":2,"period":6,"block":"s","valence":2,"en":"0.89","ie":"503","radius":"222","ox":"+2","config":"[Xe] 6s2","neutrons":81,"color":13557674},
{"z":57,"symbol":"La","name":"Lanthanum","mass":138.905,"group":3,"period":6,"block":"f","valence":3,"en":"1.10","ie":"538","radius":"187","ox":"+3","config":"[Xe] 5d1 6s2","neutrons":82,"color":13369344},
{"z":58,"symbol":"Ce","name":"Cerium","mass":140.116,"group":3,"period":6,"block":"f","valence":4,"en":"1.12","ie":"534","radius":"182","ox":"+3, +4","config":"[Xe] 4f1 5d1 6s2","neutrons":82,"color":13158657},
{"z":59,"symbol":"Pr","name":"Praseodymium","mass":140.908,"group":3,"period":6,"block":"f","valence":3,"en":"1.13","ie":"527","radius":"182","ox":"+3, +4","config":"[Xe] 4f3 6s2","neutrons":82,"color":12979353},
{"z":60,"symbol":"Nd","name":"Neodymium","mass":144.242,"group":3,"period":6,"block":"f","valence":3,"en":"1.14","ie":"533","radius":"181","ox":"+3","config":"[Xe] 4f4 6s2","neutrons":84,"color":12768024},
{"z":61,"symbol":"Pm","name":"Promethium","mass":145,"group":3,"period":6,"block":"f","valence":3,"en":"1.13","ie":"540","radius":"183","ox":"+3","config":"[Xe] 4f5 6s2","neutrons":84,"color":12556721},
{"z":62,"symbol":"Sm","name":"Samarium","mass":150.36,"group":3,"period":6,"block":"f","valence":3,"en":"1.17","ie":"544","radius":"180","ox":"+2, +3","config":"[Xe] 4f6 6s2","neutrons":88,"color":12345398},
{"z":63,"symbol":"Eu","name":"Europium","mass":151.964,"group":3,"period":6,"block":"f","valence":3,"en":"1.2","ie":"547","radius":"199","ox":"+2, +3","config":"[Xe] 4f7 6s2","neutrons":89,"color":12134061},
{"z":64,"symbol":"Gd","name":"Gadolinium","mass":157.25,"group":3,"period":6,"block":"f","valence":3,"en":"1.2","ie":"593","radius":"180","ox":"+3","config":"[Xe] 4f7 5d1 6s2","neutrons":93,"color":11922744},
{"z":65,"symbol":"Tb","name":"Terbium","mass":158.925,"group":3,"period":6,"block":"f","valence":3,"en":"1.1","ie":"565","radius":"177","ox":"+3, +4","config":"[Xe] 4f9 6s2","neutrons":94,"color":11711425},
{"z":66,"symbol":"Dy","name":"Dysprosium","mass":162.5,"group":3,"period":6,"block":"f","valence":3,"en":"1.22","ie":"573","radius":"178","ox":"+3","config":"[Xe] 4f10 6s2","neutrons":97,"color":11500106},
{"z":67,"symbol":"Ho","name":"Holmium","mass":164.93,"group":3,"period":6,"block":"f","valence":3,"en":"1.23","ie":"581","radius":"176","ox":"+3","config":"[Xe] 4f11 6s2","neutrons":98,"color":11288787},
{"z":68,"symbol":"Er","name":"Erbium","mass":167.259,"group":3,"period":6,"block":"f","valence":3,"en":"1.24","ie":"589","radius":"176","ox":"+3","config":"[Xe] 4f12 6s2","neutrons":99,"color":11077468},
{"z":69,"symbol":"Tm","name":"Thulium","mass":168.934,"group":3,"period":6,"block":"f","valence":3,"en":"1.25","ie":"597","radius":"175","ox":"+3","config":"[Xe] 4f13 6s2","neutrons":100,"color":10866149},
{"z":70,"symbol":"Yb","name":"Ytterbium","mass":173.045,"group":3,"period":6,"block":"f","valence":3,"en":"1.1","ie":"603","radius":"194","ox":"+2, +3","config":"[Xe] 4f14 6s2","neutrons":103,"color":10654830},
{"z":71,"symbol":"Lu","name":"Lutetium","mass":174.967,"group":3,"period":6,"block":"f","valence":3,"en":"1.27","ie":"524","radius":"174","ox":"+3","config":"[Xe] 4f14 5d1 6s2","neutrons":104,"color":10443511},
{"z":72,"symbol":"Hf","name":"Hafnium","mass":178.49,"group":4,"period":6,"block":"d","valence":4,"en":"1.3","ie":"659","radius":"159","ox":"+4","config":"[Xe] 4f14 5d2 6s2","neutrons":106,"color":10232192},
{"z":73,"symbol":"Ta","name":"Tantalum","mass":180.948,"group":5,"period":6,"block":"d","valence":5,"en":"1.5","ie":"761","radius":"146","ox":"+5","config":"[Xe] 4f14 5d3 6s2","neutrons":108,"color":10020873},
{"z":74,"symbol":"W","name":"Tungsten","mass":183.84,"group":6,"period":6,"block":"d","valence":6,"en":"2.36","ie":"770","radius":"139","ox":"+4, +5, +6","config":"[Xe] 4f14 5d4 6s2","neutrons":110,"color":9809530},
{"z":75,"symbol":"Re","name":"Rhenium","mass":186.207,"group":7,"period":6,"block":"d","valence":7,"en":"1.9","ie":"760","radius":"137","ox":"+4, +6, +7","config":"[Xe] 4f14 5d5 6s2","neutrons":111,"color":9598226},
{"z":76,"symbol":"Os","name":"Osmium","mass":190.23,"group":8,"period":6,"block":"d","valence":8,"en":"2.2","ie":"840","radius":"135","ox":"+4, +6, +8","config":"[Xe] 4f14 5d6 6s2","neutrons":114,"color":9386913},
{"z":77,"symbol":"Ir","name":"Iridium","mass":192.217,"group":9,"period":6,"block":"d","valence":9,"en":"2.20","ie":"880","radius":"136","ox":"+3, +4","config":"[Xe] 4f14 5d7 6s2","neutrons":115,"color":9175600},
{"z":78,"symbol":"Pt","name":"Platinum","mass":195.084,"group":10,"period":6,"block":"d","valence":10,"en":"2.28","ie":"870","radius":"138","ox":"+2, +4","config":"[Xe] 4f14 5d9 6s1","neutrons":117,"color":8964287},
{"z":79,"symbol":"Au","name":"Gold","mass":196.967,"group":11,"period":6,"block":"d","valence":1,"en":"2.54","ie":"890","radius":"144","ox":"+1, +3","config":"[Xe] 4f14 5d10 6s1","neutrons":118,"color":16765603},
{"z":80,"symbol":"Hg","name":"Mercury","mass":200.59,"group":12,"period":6,"block":"d","valence":2,"en":"2.00","ie":"1007","radius":"151","ox":"+1, +2","config":"[Xe] 4f14 5d10 6s2","neutrons":121,"color":13499434},
{"z":81,"symbol":"Tl","name":"Thallium","mass":204.383,"group":13,"period":6,"block":"p","valence":3,"en":"1.62","ie":"589","radius":"171","ox":"+1, +3","config":"[Xe] 4f14 5d10 6s2 6p1","neutrons":123,"color":15749195},
{"z":82,"symbol":"Pb","name":"Lead","mass":207.2,"group":14,"period":6,"block":"p","valence":4,"en":"2.33","ie":"716","radius":"175","ox":"+2, +4","config":"[Xe] 4f14 5d10 6s2 6p2","neutrons":125,"color":5721441},
{"z":83,"symbol":"Bi","name":"Bismuth","mass":208.98,"group":15,"period":6,"block":"p","valence":5,"en":"2.02","ie":"703","radius":"156","ox":"+3, +5","config":"[Xe] 4f14 5d10 6s2 6p3","neutrons":126,"color":12552266},
{"z":84,"symbol":"Po","name":"Polonium","mass":209,"group":16,"period":6,"block":"p","valence":6,"en":"2.0","ie":"812","radius":"168","ox":"-2, +2, +4, +6","config":"[Xe] 4f14 5d10 6s2 6p4","neutrons":125,"color":8329310},
{"z":85,"symbol":"At","name":"Astatine","mass":210,"group":17,"period":6,"block":"p","valence":7,"en":"2.2","ie":"920","radius":"150","ox":"-1, +1, +5, +7","config":"[Xe] 4f14 5d10 6s2 6p5","neutrons":125,"color":6489382},
{"z":86,"symbol":"Rn","name":"Radon","mass":222,"group":18,"period":6,"block":"p","valence":0,"en":"—","ie":"1037","radius":"120","ox":"0","config":"[Xe] 4f14 5d10 6s2 6p6","neutrons":136,"color":4278111},
{"z":87,"symbol":"Fr","name":"Francium","mass":223,"group":1,"period":7,"block":"s","valence":1,"en":"0.7","ie":"380","radius":"270","ox":"+1","config":"[Rn] 7s1","neutrons":136,"color":14233855},
{"z":88,"symbol":"Ra","name":"Radium","mass":226,"group":2,"period":7,"block":"s","valence":2,"en":"0.9","ie":"509","radius":"221","ox":"+2","config":"[Rn] 7s2","neutrons":138,"color":16730790},
{"z":89,"symbol":"Ac","name":"Actinium","mass":227,"group":3,"period":7,"block":"f","valence":3,"en":"1.1","ie":"499","radius":"188","ox":"+3","config":"[Rn] 6d1 7s2","neutrons":138,"color":11655023},
{"z":90,"symbol":"Th","name":"Thorium","mass":232.038,"group":3,"period":7,"block":"f","valence":4,"en":"1.3","ie":"587","radius":"180","ox":"+4","config":"[Rn] 6d2 7s2","neutrons":142,"color":11509276},
{"z":91,"symbol":"Pa","name":"Protactinium","mass":231.036,"group":3,"period":7,"block":"f","valence":5,"en":"1.5","ie":"568","radius":"161","ox":"+4, +5","config":"[Rn] 5f2 6d1 7s2","neutrons":140,"color":11363529},
{"z":92,"symbol":"U","name":"Uranium","mass":238.029,"group":3,"period":7,"block":"f","valence":6,"en":"1.38","ie":"598","radius":"156","ox":"+3, +4, +5, +6","config":"[Rn] 5f3 6d1 7s2","neutrons":146,"color":3421623},
{"z":93,"symbol":"Np","name":"Neptunium","mass":237,"group":3,"period":7,"block":"f","valence":5,"en":"1.36","ie":"605","radius":"155","ox":"+3, +4, +5, +6","config":"[Rn] 5f4 6d1 7s2","neutrons":144,"color":4440844},
{"z":94,"symbol":"Pu","name":"Plutonium","mass":244,"group":3,"period":7,"block":"f","valence":6,"en":"1.28","ie":"585","radius":"159","ox":"+3, +4, +5, +6","config":"[Rn] 5f6 7s2","neutrons":150,"color":5558779},
{"z":95,"symbol":"Am","name":"Americium","mass":243,"group":3,"period":7,"block":"f","valence":7,"en":"1.3","ie":"578","radius":"173","ox":"+3, +4, +5, +6","config":"[Rn] 5f7 7s2","neutrons":148,"color":6676714},
{"z":96,"symbol":"Cm","name":"Curium","mass":247,"group":3,"period":7,"block":"f","valence":8,"en":"1.3","ie":"581","radius":"174","ox":"+3","config":"[Rn] 5f7 6d1 7s2","neutrons":151,"color":7794649},
{"z":97,"symbol":"Bk","name":"Berkelium","mass":247,"group":3,"period":7,"block":"f","valence":9,"en":"1.3","ie":"601","radius":"170","ox":"+3, +4","config":"[Rn] 5f9 7s2","neutrons":150,"color":8912584},
{"z":98,"symbol":"Cf","name":"Californium","mass":251,"group":3,"period":7,"block":"f","valence":10,"en":"1.3","ie":"608","radius":"186","ox":"+2, +3","config":"[Rn] 5f10 7s2","neutrons":153,"color":10030523},
{"z":99,"symbol":"Es","name":"Einsteinium","mass":252,"group":3,"period":7,"block":"f","valence":11,"en":"1.3","ie":"619","radius":"186","ox":"+3","config":"[Rn] 5f11 7s2","neutrons":153,"color":11148468},
{"z":100,"symbol":"Fm","name":"Fermium","mass":257,"group":3,"period":7,"block":"f","valence":12,"en":"1.3","ie":"627","radius":"185","ox":"+2, +3","config":"[Rn] 5f12 7s2","neutrons":157,"color":12266413},
{"z":101,"symbol":"Md","name":"Mendelevium","mass":258,"group":3,"period":7,"block":"f","valence":13,"en":"1.3","ie":"635","radius":"186","ox":"+2, +3","config":"[Rn] 5f13 7s2","neutrons":157,"color":13384358},
{"z":102,"symbol":"No","name":"Nobelium","mass":259,"group":3,"period":7,"block":"f","valence":14,"en":"1.3","ie":"642","radius":"200","ox":"+2, +3","config":"[Rn] 5f14 7s2","neutrons":157,"color":14502303},
{"z":103,"symbol":"Lr","name":"Lawrencium","mass":266,"group":3,"period":7,"block":"d","valence":3,"en":"1.3","ie":"470","radius":"160","ox":"+3","config":"[Rn] 5f14 7s2 7p1","neutrons":163,"color":15620248},
{"z":104,"symbol":"Rf","name":"Rutherfordium","mass":267,"group":4,"period":7,"block":"d","valence":4,"en":"—","ie":"—","radius":"150","ox":"+4","config":"[Rn] 5f14 6d2 7s2","neutrons":163,"color":16738193},
{"z":105,"symbol":"Db","name":"Dubnium","mass":268,"group":5,"period":7,"block":"d","valence":5,"en":"—","ie":"—","radius":"—","ox":"+5","config":"[Rn] 5f14 6d3 7s2","neutrons":163,"color":15801063},
{"z":106,"symbol":"Sg","name":"Seaborgium","mass":269,"group":6,"period":7,"block":"d","valence":6,"en":"—","ie":"—","radius":"—","ox":"+6","config":"[Rn] 5f14 6d4 7s2","neutrons":163,"color":14863933},
{"z":107,"symbol":"Bh","name":"Bohrium","mass":270,"group":7,"period":7,"block":"d","valence":7,"en":"—","ie":"—","radius":"—","ox":"+7","config":"[Rn] 5f14 6d5 7s2","neutrons":163,"color":13926803},
{"z":108,"symbol":"Hs","name":"Hassium","mass":277,"group":8,"period":7,"block":"d","valence":8,"en":"—","ie":"—","radius":"—","ox":"+8","config":"[Rn] 5f14 6d6 7s2","neutrons":169,"color":12989673},
{"z":109,"symbol":"Mt","name":"Meitnerium","mass":278,"group":9,"period":7,"block":"d","valence":9,"en":"—","ie":"—","radius":"—","ox":"+9","config":"[Rn] 5f14 6d7 7s2","neutrons":169,"color":12052543},
{"z":110,"symbol":"Ds","name":"Darmstadtium","mass":281,"group":10,"period":7,"block":"d","valence":10,"en":"—","ie":"—","radius":"—","ox":"+10","config":"[Rn] 5f14 6d8 7s2","neutrons":171,"color":11115413},
{"z":111,"symbol":"Rg","name":"Roentgenium","mass":282,"group":11,"period":7,"block":"d","valence":11,"en":"—","ie":"—","radius":"—","ox":"+1, +3","config":"[Rn] 5f14 6d9 7s2","neutrons":171,"color":10178283},
{"z":112,"symbol":"Cn","name":"Copernicium","mass":285,"group":12,"period":7,"block":"d","valence":2,"en":"—","ie":"—","radius":"—","ox":"+2","config":"[Rn] 5f14 6d10 7s2","neutrons":173,"color":9241133},
{"z":113,"symbol":"Nh","name":"Nihonium","mass":286,"group":13,"period":7,"block":"p","valence":3,"en":"—","ie":"—","radius":"—","ox":"+1, +3","config":"[Rn] 5f14 6d10 7s2 7p1","neutrons":173,"color":8304303},
{"z":114,"symbol":"Fl","name":"Flerovium","mass":289,"group":14,"period":7,"block":"p","valence":4,"en":"—","ie":"—","radius":"—","ox":"+2, +4","config":"[Rn] 5f14 6d10 7s2 7p2","neutrons":175,"color":7367473},
{"z":115,"symbol":"Mc","name":"Moscovium","mass":290,"group":15,"period":7,"block":"p","valence":5,"en":"—","ie":"—","radius":"—","ox":"+1, +3, +5","config":"[Rn] 5f14 6d10 7s2 7p3","neutrons":175,"color":6430643},
{"z":116,"symbol":"Lv","name":"Livermorium","mass":293,"group":16,"period":7,"block":"p","valence":6,"en":"—","ie":"—","radius":"—","ox":"+2, +4, +6","config":"[Rn] 5f14 6d10 7s2 7p4","neutrons":177,"color":5493813},
{"z":117,"symbol":"Ts","name":"Tennessine","mass":294,"group":17,"period":7,"block":"p","valence":7,"en":"—","ie":"—","radius":"—","ox":"-1, +1, +3, +5","config":"[Rn] 5f14 6d10 7s2 7p5","neutrons":177,"color":4556983},
{"z":118,"symbol":"Og","name":"Oganesson","mass":294,"group":18,"period":7,"block":"p","valence":8,"en":"—","ie":"—","radius":"—","ox":"0","config":"[Rn] 5f14 6d10 7s2 7p6","neutrons":176,"color":3620153}
];
const bySymbol = Object.fromEntries(ELEMENTS.map(e=>[e.symbol,e]));
const select = document.getElementById("element-select");
select.innerHTML = ELEMENTS.map(e=>`<option value="${e.symbol}">${e.name} ${e.symbol} - Z${e.z}</option>`).join("");

const SHELL_CAPACITY = [2,8,18,32,32,18,8];
function buildShells(z){ const occ=[]; let n=z; for(const c of SHELL_CAPACITY){ const take=Math.min(c,n); occ.push(take); n-=take; if(n<=0) break; } return occ; }
function fillElectronConfig(z){ return buildShells(z).map((n,i)=>`${i+1}${["s","p","d","f","g","h","i"][i]}${n}`).join(" "); }

class AtomRenderer{
  constructor(canvasId){
    this.canvas=document.getElementById(canvasId); if(!this.canvas) return;
    this.scene=new THREE.Scene(); this.scene.fog=new THREE.Fog(0x060a14,14,45);
    this.camera=new THREE.PerspectiveCamera(55,1,0.1,200); this.camera.position.set(0,0,10);
    this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,antialias:true,alpha:true});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,2)); this.renderer.setClearColor(0x000000,0);
    this.clock=new THREE.Clock(); this.spinning=true; this.showNucleus=true; this.root=new THREE.Group(); this.scene.add(this.root);
    this.rot={x:.2,y:.35}; this.drag={on:false,x:0,y:0}; this.electrons=[]; this.nucleus=null;
    const a=new THREE.AmbientLight(0xffffff,.85); this.scene.add(a);
    const l1=new THREE.DirectionalLight(0x8ddcff,1.8); l1.position.set(6,7,8); this.scene.add(l1);
    const l2=new THREE.DirectionalLight(0xffffff,.7); l2.position.set(-6,-4,5); this.scene.add(l2);
    const p=new THREE.PointLight(0x7c3aed,1.2,30); p.position.set(0,0,-10); this.scene.add(p);
    this.addEvents(); this.resize(); addEventListener("resize",()=>this.resize()); this.animate=this.animate.bind(this); requestAnimationFrame(this.animate);
  }
  resize(){ const w=this.canvas.clientWidth,h=this.canvas.clientHeight; this.renderer.setSize(w,h,false); this.camera.aspect=w/h; this.camera.updateProjectionMatrix(); }
  addEvents(){
    this.canvas.addEventListener("pointerdown",e=>{this.drag.on=true;this.drag.x=e.clientX;this.drag.y=e.clientY});
    addEventListener("pointerup",()=>this.drag.on=false);
    addEventListener("pointermove",e=>{ if(!this.drag.on) return; this.rot.y+=(e.clientX-this.drag.x)*.006; this.rot.x+=(e.clientY-this.drag.y)*.006; this.rot.x=Math.max(-1.2,Math.min(1.2,this.rot.x)); this.drag.x=e.clientX; this.drag.y=e.clientY; });
    this.canvas.addEventListener("wheel",e=>{ this.camera.position.z=Math.max(5.5,Math.min(22,this.camera.position.z+e.deltaY*.01)); e.preventDefault(); },{passive:false});
  }
  clear(){
    while(this.root.children.length>1){
      const o=this.root.children.pop();
      o.traverse?.(c=>{ c.geometry?.dispose?.(); if(c.material) Array.isArray(c.material)?c.material.forEach(m=>m.dispose?.()):c.material.dispose?.(); });
    }
    this.electrons=[]; this.nucleus=null;
  }
  build(sym){
    const el=bySymbol[sym]||bySymbol.H; this.clear();
    const shells=buildShells(el.z);
    const nucleus=new THREE.Group();
    const pMat=new THREE.MeshStandardMaterial({color:0xff4d4d,emissive:0x8a1d1d,emissiveIntensity:.8});
    const nMat=new THREE.MeshStandardMaterial({color:0xb9c0cc,emissive:0x3f4652,emissiveIntensity:.35});
    const pCount=Math.min(el.z,24), nCount=Math.min(el.neutrons||Math.round(el.mass-el.z),24);
    for(let i=0;i<pCount;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(.16,16,16),pMat); const a=i/pCount*Math.PI*2; const r=.25+Math.random()*.2; m.position.set(Math.cos(a)*r,Math.sin(a)*r,(Math.random()-.5)*.35); nucleus.add(m); }
    for(let i=0;i<nCount;i++){ const m=new THREE.Mesh(new THREE.SphereGeometry(.16,16,16),nMat); const a=i/nCount*Math.PI*2; const r=.25+Math.random()*.2; m.position.set(Math.cos(a)*r,Math.sin(a)*r,(Math.random()-.5)*.35); nucleus.add(m); }
    nucleus.add(new THREE.Mesh(new THREE.SphereGeometry(.8,28,28),new THREE.MeshBasicMaterial({color:el.color,transparent:true,opacity:.08})));
    this.root.add(nucleus); this.nucleus=nucleus;

    const shellColors=[0x00d4ff,0x7c3aed,0x10b981,0xf59e0b,0xef4444,0x38bdf8,0xa78bfa];
    shells.forEach((count,i)=>{
      const r=1.55+i*1.12, col=shellColors[i%shellColors.length];
      const g=new THREE.Group(); g.rotation.x=.25*i; g.rotation.y=.4*i;
      const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.015,10,140),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.32}));
      ring.rotation.x=Math.PI/2; g.add(ring);
      const tilt=new THREE.Group(); tilt.rotation.x=g.rotation.x; tilt.rotation.y=g.rotation.y; g.add(tilt);
      for(let k=0;k<count;k++){
        const e=new THREE.Mesh(new THREE.SphereGeometry(.1,14,14),new THREE.MeshStandardMaterial({color:0xffffff,emissive:col,emissiveIntensity:1.7}));
        e.userData={r,a:k/count*Math.PI*2,ph:Math.random()*Math.PI*2,s:.9/(i+1),tilt};
        tilt.add(e); this.electrons.push(e);
      }
      this.root.add(g);
    });
  }
  toggleSpin(){ this.spinning=!this.spinning; }
  toggleNucleus(){ this.showNucleus=!this.showNucleus; if(this.nucleus) this.nucleus.visible=this.showNucleus; }
  setView(v="default"){ if(v==="default"){this.rot.x=.2; this.rot.y=.35; this.camera.position.set(0,0,10)} if(v==="side"){this.rot.x=0; this.rot.y=Math.PI/2} if(v==="top"){this.rot.x=Math.PI/2.4; this.rot.y=0} }
  animate(){
    requestAnimationFrame(this.animate);
    const t=this.clock.getElapsedTime();
    if(this.spinning){ this.root.rotation.y+=.0025; this.root.rotation.x=Math.sin(t*.25)*.08; }
    this.electrons.forEach(e=>{ const d=e.userData, ang=d.a+t*d.s*2+d.ph; e.position.set(Math.cos(ang)*d.r,Math.sin(ang*1.05)*d.r*.28,Math.sin(ang)*d.r*.22); e.position.applyEuler(d.tilt.rotation); e.scale.setScalar(1+Math.sin(t*5+d.ph)*.08); });
    this.scene.rotation.x=this.rot.x; this.scene.rotation.y=this.rot.y;
    this.renderer.render(this.scene,this.camera);
  }
}

const atomRenderer = new AtomRenderer("atom-canvas");

function updateInfo(el){
  document.getElementById("chip-name").textContent = el.name;
  document.getElementById("chip-config").textContent = el.config;
  document.getElementById("info").innerHTML = `
    <div class="row"><span class="label">Symbol</span><span class="value">${el.symbol}</span></div>
    <div class="row"><span class="label">Atomic Number</span><span class="value">${el.z}</span></div>
    <div class="row"><span class="label">Atomic Mass</span><span class="value">${el.mass} u</span></div>
    <div class="row"><span class="label">Protons</span><span class="value">${el.z}</span></div>
    <div class="row"><span class="label">Neutrons</span><span class="value">${el.neutrons}</span></div>
    <div class="row"><span class="label">Electrons</span><span class="value">${el.z}</span></div>
    <div class="row"><span class="label">Electron Config</span><span class="value" style="font-family:monospace;font-size:12px">${el.config}</span></div>
    <div class="row"><span class="label">Valence</span><span class="value">${el.valence}</span></div>
    <div class="row"><span class="label">Electronegativity</span><span class="value">${el.en}</span></div>
    <div class="row"><span class="label">Ionization Energy</span><span class="value">${el.ie} kJ/mol</span></div>
    <div class="row"><span class="label">Atomic Radius</span><span class="value">${el.radius} pm</span></div>
    <div class="row"><span class="label">Oxidation States</span><span class="value">${el.ox}</span></div>`;
  const shells=buildShells(el.z);
  document.getElementById("shells").innerHTML =
    shells.map((n,i)=>`<div class="row"><span class="label">Shell ${i+1}</span><span class="value">${n} e⁻</span></div>`).join("") +
    `<div class="row"><span class="label">Auto Config</span><span class="value" style="font-family:monospace;font-size:12px">${fillElectronConfig(el.z)}</span></div>`;
}

function loadElement(){
  const el = bySymbol[select.value] || bySymbol.H;
  atomRenderer.build(el.symbol);
  updateInfo(el);
}

select.addEventListener("change", loadElement);
document.getElementById("toggle-spin").onclick = () => atomRenderer.toggleSpin();
document.getElementById("toggle-nucleus").onclick = () => atomRenderer.toggleNucleus();
document.getElementById("reset-view").onclick = () => atomRenderer.setView("default");
select.value = "H";
loadElement();
