// Example sentences and a learning tip for each vocabulary topic (Nov 2026), keyed by topic slug.
// s: [[Arabic, transliteration, English, Urdu]]; tip: [EN, UR]

const VOCAB_MORE = {
  greetings: {
    s: [
      ['السَّلَامُ عَلَيْكُمْ، كَيْفَ حَالُكَ؟', 'as-salaamu ʿalaykum, kayfa ḥaaluk?', 'Peace be upon you, how are you?', 'السلام علیکم، آپ کیسے ہیں؟'],
      ['بِخَيْرٍ، شُكْرًا، وَأَنْتَ؟', 'bi-khayr, shukran, wa anta?', 'Fine, thank you, and you?', 'ٹھیک ہوں، شکریہ، اور آپ؟'],
      ['صَبَاحَ الْخَيْرِ يَا أُسْتَاذُ', 'ṣabaaḥa l-khayri yaa ustaadh', 'Good morning, teacher', 'صبح بخیر، استاد جی'],
      ['مَرْحَبًا بِكَ فِي بَيْتِنَا', 'marḥaban bika fii baytinaa', 'Welcome to our home', 'ہمارے گھر میں خوش آمدید'],
      ['شُكْرًا جَزِيلًا. عَفْوًا!', 'shukran jaziilan. ʿafwan!', 'Thank you very much. You’re welcome!', 'بہت شکریہ۔ کوئی بات نہیں!'],
    ],
    tip: ['The reply to “ṣabaaḥ al-khayr” is “ṣabaaḥ an-nuur” (morning of light), and to “masaa’ al-khayr” it is “masaa’ an-nuur”. Practise by greeting your family in Arabic every morning for a week.', '«صباح الخیر» کا جواب «صباح النور» (روشن صبح) اور «مساء الخیر» کا جواب «مساء النور» ہے۔ ایک ہفتہ روز صبح گھر والوں کو عربی میں سلام کر کے مشق کریں۔'],
  },
  numbers: {
    s: [
      ['عِنْدِي ثَلَاثَةُ إِخْوَةٍ', 'ʿindii thalaathatu ikhwa', 'I have three brothers', 'میرے تین بھائی ہیں'],
      ['الصَّلَوَاتُ خَمْسٌ فِي الْيَوْمِ', 'aṣ-ṣalawaatu khamsun fil-yawm', 'There are five prayers in a day', 'دن میں پانچ نمازیں ہیں'],
      ['فِي الْأُسْبُوعِ سَبْعَةُ أَيَّامٍ', 'fil-usbuuʿi sabʿatu ayyaam', 'There are seven days in a week', 'ہفتے میں سات دن ہیں'],
      ['كَمْ عُمْرُكَ؟ عُمْرِي عَشْرُ سَنَوَاتٍ', 'kam ʿumruk? ʿumrii ʿashru sanawaat', 'How old are you? I am ten years old', 'آپ کی عمر کیا ہے؟ میری عمر دس سال ہے'],
      ['اِثْنَانِ وَاثْنَانِ أَرْبَعَةٌ', 'ithnaani wa-thnaani arbaʿa', 'Two and two are four', 'دو اور دو چار'],
    ],
    tip: ['Arabic numbers 3 to 10 take the opposite gender to the noun they count, so “three brothers” is “thalaathatu ikhwa” with the -a ending. Do not worry about this at first; learn the words, then the rule. Count your steps or prayer beads in Arabic to fix them in memory.', 'عربی میں ۳ سے ۱۰ تک کی گنتی معدود کی الٹ جنس میں آتی ہے، اسی لیے «تین بھائی» «ثلاثة إخوة» ہے۔ شروع میں اس کی فکر نہ کریں؛ پہلے الفاظ، پھر قاعدہ۔ سیڑھیاں یا تسبیح کے دانے عربی میں گن کر یاد پکا کریں۔'],
  },
  family: {
    s: [
      ['هٰذَا أَبِي وَهٰذِهِ أُمِّي', 'haadhaa abii wa haadhihi ummii', 'This is my father and this is my mother', 'یہ میرے والد ہیں اور یہ میری والدہ'],
      ['لِي أَخٌ وَأُخْتَانِ', 'lii akhun wa ukhtaan', 'I have a brother and two sisters', 'میرا ایک بھائی اور دو بہنیں ہیں'],
      ['جَدِّي يَقْرَأُ الْقُرْآنَ', 'jaddii yaqra’u l-qur’aan', 'My grandfather reads the Quran', 'میرے دادا قرآن پڑھتے ہیں'],
      ['اِبْنِي فِي الْمَدْرَسَةِ', 'ibnii fil-madrasa', 'My son is at school', 'میرا بیٹا اسکول میں ہے'],
      ['زَوْجَتِي طَبِيبَةٌ', 'zawjatii ṭabiiba', 'My wife is a doctor', 'میری بیوی ڈاکٹر ہیں'],
    ],
    tip: ['Add -ii to a word to say “my”: ab → abii (my father), umm → ummii (my mother). Words ending in ة change it to t before endings: zawja → zawjatii (my wife). Draw your family tree and label it in Arabic.', 'کسی لفظ کے آخر میں «ـي» لگانے سے «میرا» بنتا ہے: أب ← أبي، أم ← أمي۔ «ة» پر ختم ہونے والے الفاظ میں یہ «ت» بن جاتی ہے: زوجة ← زوجتي۔ اپنا شجرہ بنا کر عربی نام لکھیں۔'],
  },
  food: {
    s: [
      ['أُرِيدُ كُوبًا مِنَ الشَّايِ مِنْ فَضْلِكَ', 'uriidu kuuban mina sh-shaay min faḍlik', 'I would like a cup of tea, please', 'مجھے ایک کپ چائے چاہیے، مہربانی'],
      ['نُفْطِرُ عَلَى التَّمْرِ وَالْمَاءِ', 'nufṭiru ʿala t-tamri wal-maa’', 'We break the fast with dates and water', 'ہم کھجور اور پانی سے افطار کرتے ہیں'],
      ['الْخُبْزُ طَازَجٌ', 'al-khubzu ṭaazaj', 'The bread is fresh', 'روٹی تازہ ہے'],
      ['أُحِبُّ الْأَرُزَّ مَعَ الدَّجَاجِ', 'uḥibbu l-aruzza maʿa d-dajaaj', 'I love rice with chicken', 'مجھے مرغی کے ساتھ چاول پسند ہیں'],
      ['بِكَمْ كِيلُو الْفَاكِهَةِ؟', 'bikam kiilu l-faakiha?', 'How much is a kilo of fruit?', 'ایک کلو پھل کتنے کا ہے؟'],
    ],
    tip: ['“Uriidu” (I want) plus a food word is the most useful sentence in a café or market. Add “min faḍlik” (please). In the Gulf, coffee is served in small cups; shake the cup gently when you have had enough.', '«أريد» (مجھے چاہیے) کے ساتھ کھانے کا نام ہوٹل اور بازار کا سب سے کارآمد جملہ ہے۔ ساتھ «من فضلك» کہیں۔ خلیج میں قہوہ چھوٹی پیالیوں میں دیا جاتا ہے؛ بس کرنی ہو تو پیالی ہلکا سا ہلا دیں۔'],
  },
  everyday: {
    s: [
      ['هٰذَا كِتَابٌ جَدِيدٌ', 'haadhaa kitaabun jadiid', 'This is a new book', 'یہ نئی کتاب ہے'],
      ['أَيْنَ الْقَلَمُ؟', 'ayna l-qalam?', 'Where is the pen?', 'قلم کہاں ہے؟'],
      ['ذَهَبْتُ إِلَى السُّوقِ', 'dhahabtu ila s-suuq', 'I went to the market', 'میں بازار گیا'],
      ['الْمَسْجِدُ قَرِيبٌ مِنَ الْبَيْتِ', 'al-masjidu qariibun mina l-bayt', 'The mosque is near the house', 'مسجد گھر کے قریب ہے'],
      ['اِفْتَحِ الْبَابَ مِنْ فَضْلِكَ', 'iftaḥi l-baaba min faḍlik', 'Open the door, please', 'دروازہ کھولیں، مہربانی'],
    ],
    tip: ['Many of these words are already in Urdu: kitaab, qalam, masjid, madrasa, ʿamal. Listen for the Arabic pronunciation, which is often sharper: the q in qalam comes from deep in the throat.', 'ان میں سے کئی الفاظ اردو میں پہلے سے ہیں: کتاب، قلم، مسجد، مدرسہ، عمل۔ عربی تلفظ پر دھیان دیں جو اکثر زیادہ واضح ہوتا ہے: «قلم» کا ق حلق کی گہرائی سے نکلتا ہے۔'],
  },
  days: {
    s: [
      ['الْيَوْمُ يَوْمُ الْجُمُعَةِ', 'al-yawmu yawmu l-jumuʿa', 'Today is Friday', 'آج جمعہ ہے'],
      ['أَصُومُ يَوْمَ الِاثْنَيْنِ وَالْخَمِيسِ', 'aṣuumu yawma l-ithnayni wal-khamiis', 'I fast on Monday and Thursday', 'میں پیر اور جمعرات کو روزہ رکھتا ہوں'],
      ['الْعُطْلَةُ يَوْمَ السَّبْتِ', 'al-ʿuṭlatu yawma s-sabt', 'The holiday is on Saturday', 'چھٹی ہفتے کو ہے'],
      ['نَلْتَقِي يَوْمَ الْأَحَدِ إِنْ شَاءَ اللّٰهُ', 'naltaqii yawma l-aḥadi in shaa’ allaah', 'We will meet on Sunday, God willing', 'ہم اتوار کو ملیں گے، ان شاء اللہ'],
      ['أَمْسِ كَانَ الثُّلَاثَاءَ', 'amsi kaana th-thulaathaa’', 'Yesterday was Tuesday', 'کل منگل تھا'],
    ],
    tip: ['The Prophet ﷺ used to fast on Mondays and Thursdays (Sunan at-Tirmidhi 745), so many Muslims know al-ithnayn and al-khamiis already. Say today’s day in Arabic every morning.', 'نبی ﷺ پیر اور جمعرات کا روزہ رکھتے تھے (ترمذی ۷۴۵)، اس لیے بہت سے لوگ «الاثنین» اور «الخمیس» پہلے سے جانتے ہیں۔ ہر صبح آج کا دن عربی میں کہیں۔'],
  },
  colours: {
    s: [
      ['السَّمَاءُ زَرْقَاءُ', 'as-samaa’u zarqaa’', 'The sky is blue', 'آسمان نیلا ہے'],
      ['عِنْدِي سَيَّارَةٌ بَيْضَاءُ', 'ʿindii sayyaaratun bayḍaa’', 'I have a white car', 'میرے پاس سفید گاڑی ہے'],
      ['الْعَلَمُ أَخْضَرُ', 'al-ʿalamu akhḍar', 'The flag is green', 'جھنڈا سبز ہے'],
      ['هٰذَا قَلَمٌ أَحْمَرُ', 'haadhaa qalamun aḥmar', 'This is a red pen', 'یہ لال قلم ہے'],
      ['التُّفَّاحَةُ صَفْرَاءُ', 'at-tuffaaḥatu ṣafraa’', 'The apple is yellow', 'سیب پیلا ہے'],
    ],
    tip: ['With feminine words the colour changes: aḥmar → ḥamraa’, azraq → zarqaa’, abyaḍ → bayḍaa’, akhḍar → khaḍraa’. Name the colours of things you see on the way to work or school.', 'مؤنث الفاظ کے ساتھ رنگ بدل جاتا ہے: أحمر ← حمراء، أزرق ← زرقاء، أبيض ← بيضاء، أخضر ← خضراء۔ راستے میں نظر آنے والی چیزوں کے رنگ عربی میں بولیں۔'],
  },
  jobs: {
    s: [
      ['أَنَا مُحَاسِبٌ فِي شَرِكَةٍ', 'anaa muḥaasibun fii sharika', 'I am an accountant in a company', 'میں ایک کمپنی میں اکاؤنٹنٹ ہوں'],
      ['أَخِي مُهَنْدِسٌ', 'akhii muhandis', 'My brother is an engineer', 'میرا بھائی انجینئر ہے'],
      ['الطَّبِيبُ فِي الْمُسْتَشْفَى', 'aṭ-ṭabiibu fil-mustashfaa', 'The doctor is in the hospital', 'ڈاکٹر ہسپتال میں ہے'],
      ['مَا عَمَلُكَ؟', 'maa ʿamaluk?', 'What is your job?', 'آپ کیا کام کرتے ہیں؟'],
      ['أُخْتِي مُدَرِّسَةٌ', 'ukhtii mudarrisa', 'My sister is a teacher', 'میری بہن استانی ہیں'],
    ],
    tip: ['“Maa ʿamaluk?” (what is your work?) is one of the first questions people ask in the Gulf. Practise your own answer with “anaa” plus your job, and add “fii” and the place: anaa mudarrisun fii madrasa.', '«ما عملك؟» (آپ کا کام کیا ہے؟) خلیج میں ابتدائی سوالوں میں سے ہے۔ «أنا» کے ساتھ اپنا پیشہ اور «في» کے ساتھ جگہ بتانے کی مشق کریں: أنا مدرس في مدرسة۔'],
  },
  body: {
    s: [
      ['عِنْدِي أَلَمٌ فِي رَأْسِي', 'ʿindii alamun fii ra’sii', 'I have a headache (pain in my head)', 'میرے سر میں درد ہے'],
      ['اِغْسِلْ يَدَيْكَ', 'ighsil yadayk', 'Wash your hands', 'اپنے ہاتھ دھوئیں'],
      ['عَيْنَاهُ سَوْدَاوَانِ', 'ʿaynaahu sawdaawaan', 'His eyes are black', 'اس کی آنکھیں کالی ہیں'],
      ['أَسْنَانُكَ بَيْضَاءُ', 'asnaanuka bayḍaa’', 'Your teeth are white', 'آپ کے دانت سفید ہیں'],
      ['قَلْبُهَا طَيِّبٌ', 'qalbuhaa ṭayyib', 'She has a kind heart', 'اس کا دل اچھا ہے'],
    ],
    tip: ['Body parts that come in pairs have a dual ending: yad → yadaan (two hands), ʿayn → ʿaynaan (two eyes). In @@how-to-perform-wudu-step-by-step.html|wudu@@ you wash many of these parts; name each one in Arabic as you wash it.', 'جوڑوں میں آنے والے اعضاء کی تثنیہ ہوتی ہے: يد ← يدان (دو ہاتھ)، عين ← عينان (دو آنکھیں)۔ @@how-to-perform-wudu-step-by-step.html|وضو@@ میں ان میں سے کئی اعضاء دھوئے جاتے ہیں؛ دھوتے ہوئے ہر ایک کا عربی نام لیں۔'],
  },
  places: {
    s: [
      ['أَيْنَ الْمَطَارُ مِنْ فَضْلِكَ؟', 'ayna l-maṭaaru min faḍlik?', 'Where is the airport, please?', 'ہوائی اڈا کہاں ہے، مہربانی؟'],
      ['أَذْهَبُ إِلَى الْعَمَلِ بِالْحَافِلَةِ', 'adh-habu ila l-ʿamali bil-ḥaafila', 'I go to work by bus', 'میں بس سے کام پر جاتا ہوں'],
      ['الْفُنْدُقُ فِي هٰذَا الشَّارِعِ', 'al-funduqu fii haadha sh-shaariʿ', 'The hotel is on this street', 'ہوٹل اس سڑک پر ہے'],
      ['الْمَطْعَمُ مُغْلَقٌ الْيَوْمَ', 'al-maṭʿamu mughlaqun al-yawm', 'The restaurant is closed today', 'ریستوران آج بند ہے'],
      ['سَافَرْتُ بِالطَّائِرَةِ إِلَى جِدَّةَ', 'saafartu biṭ-ṭaa’irati ilaa jidda', 'I travelled to Jeddah by plane', 'میں ہوائی جہاز سے جدہ گیا'],
    ],
    tip: ['“bi-” plus a vehicle means “by”: bil-ḥaafila (by bus), bil-qiṭaar (by train), bis-sayyaara (by car). Read the Arabic on road signs and shop fronts; many signs use these exact words.', 'سواری سے پہلے «بـ» لگانے سے «سے» کا مطلب بنتا ہے: بالحافلة (بس سے)، بالقطار (ٹرین سے)، بالسيارة (گاڑی سے)۔ سڑک کے بورڈ اور دکانوں کے نام عربی میں پڑھیں؛ بہت سے بورڈز پر یہی الفاظ ہوتے ہیں۔'],
  },
  home: {
    s: [
      ['الْمِفْتَاحُ عَلَى الطَّاوِلَةِ', 'al-miftaaḥu ʿala ṭ-ṭaawila', 'The key is on the table', 'چابی میز پر ہے'],
      ['أُمِّي فِي الْمَطْبَخِ', 'ummii fil-maṭbakh', 'My mother is in the kitchen', 'امی باورچی خانے میں ہیں'],
      ['اِفْتَحِ النَّافِذَةَ', 'iftaḥi n-naafidha', 'Open the window', 'کھڑکی کھولیں'],
      ['كَمِ السَّاعَةُ الْآنَ؟', 'kami s-saaʿatu l-aan?', 'What time is it now?', 'اب کیا وقت ہوا ہے؟'],
      ['الْأَطْفَالُ يَلْعَبُونَ فِي الْحَدِيقَةِ', 'al-aṭfaalu yalʿabuuna fil-ḥadiiqa', 'The children are playing in the garden', 'بچے باغ میں کھیل رہے ہیں'],
    ],
    tip: ['Stick small labels with the Arabic name on things around your home: the door, the window, the fridge. Seeing the word many times a day is one of the easiest ways to learn it.', 'گھر کی چیزوں پر عربی نام کے چھوٹے لیبل لگائیں: دروازہ، کھڑکی، فریج۔ دن میں کئی بار لفظ دیکھنا یاد کرنے کا سب سے آسان طریقہ ہے۔'],
  },
};

module.exports = { VOCAB_MORE };
