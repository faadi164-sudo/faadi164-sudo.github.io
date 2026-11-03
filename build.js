'use strict';
/*
  Harf: free Arabic lessons for English and Urdu speakers.

  This one file holds all of the site's content and builds every page into the _site folder.
  GitHub Actions runs it automatically each time this file changes (see .github/workflows/pages.yml).

  Common edits:
  - Moving to your own domain: change SITE_URL below.
  - Google AdSense approved: put your publisher ID in ADSENSE_CLIENT, e.g. 'ca-pub-1234567890123456'.
  - Contact email: set CONTACT_EMAIL.
  - Visitor stats: put your Google Analytics 4 measurement ID in GA_ID, e.g. 'G-ABC123XYZ9'.
    To stop counting your own visits, open the site once on each device with ?notrack=1 (undo with ?notrack=0).
  - Google Search Console: put the content="..." code from its HTML-tag method in GSC_VERIFY.
  - New words: add rows to TOPICS. New phrases: add rows to PHRASES. New lessons: add to LESSONS.
*/
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------- settings
const SITE_URL = 'https://learnwithharf.com';
const KOFI_URL = 'https://ko-fi.com/164fawad';
const ADSENSE_CLIENT = '';
const CONTACT_EMAIL = '';
const GA_ID = 'G-DYRQWLHBQB';       // Google Analytics 4 measurement ID, e.g. 'G-ABC123XYZ9'
const GSC_VERIFY = '';  // Google Search Console verification code (only the content="..." value)
const UPDATED = { en: '3 November 2026', ur: '۳ نومبر ۲۰۲۶' };
const YEAR = '2026';
const OUT = path.join(__dirname, '_site');

// ---------------------------------------------------------------- letters
// c, slug, English name, Arabic name, Urdu name, sound, joins forward?, dots,
// English sound note, Urdu sound note, example word, transliteration, English meaning, Urdu meaning
function Lt(c, slug, en, ar, ur, tr, joins, dots, snd, sndUr, w, wt, we, wu) {
  return { c, slug, en, ar, ur, tr, joins, dots, snd, sndUr, w, wt, we, wu };
}
const LETTERS = [
  Lt('ا', 'alif', 'Alif', 'ألف', 'الف', 'a / aa', false, '',
    'A long “a” as in “father”. Alif also carries the hamza (ء), a short catch in the throat.',
    'لمبی «آ» کی آواز، جیسے «آم» میں۔ الف ہمزہ (ء) کو بھی سہارا دیتا ہے۔',
    'أَسَد', 'asad', 'lion', 'شیر'),
  Lt('ب', 'baa', 'Baa', 'باء', 'بے', 'b', true, '1b',
    'Like “b” in “bed”. Arabic has no “p”, so Arabic speakers often say “b” for it in foreign words.',
    'اردو کی «ب» جیسی آواز۔ عربی میں «پ» نہیں ہوتی، اس لیے عرب اکثر «پ» کو بھی «ب» بولتے ہیں۔',
    'بَاب', 'baab', 'door', 'دروازہ'),
  Lt('ت', 'taa', 'Taa', 'تاء', 'تے', 't', true, '2a',
    'A light “t” as in “ten”, with the tip of the tongue behind the top teeth.',
    'اردو کی نرم «ت» جیسی، زبان اوپر کے دانتوں کے پیچھے لگا کر۔ یہ «ٹ» نہیں ہے۔',
    'تَمْر', 'tamr', 'dates', 'کھجور'),
  Lt('ث', 'thaa', 'Thaa', 'ثاء', 'ثے', 'th', true, '3a',
    'Like “th” in “think”: put the tip of your tongue between your teeth and blow gently.',
    'انگریزی لفظ think کی «th» جیسی آواز: زبان کی نوک دانتوں کے درمیان رکھیں۔ اردو کی طرح اسے «س» نہ پڑھیں۔',
    'ثَلَاثَة', 'thalaatha', 'three', 'تین'),
  Lt('ج', 'jeem', 'Jeem', 'جيم', 'جیم', 'j', true, '1b',
    'Like “j” in “jam”. In Egypt it is said like the “g” in “go”.',
    'اردو کی «ج» جیسی آواز۔ مصر میں اسے «گ» کی طرح بولا جاتا ہے۔',
    'جَمَل', 'jamal', 'camel', 'اونٹ'),
  Lt('ح', 'hhaa', 'Ḥaa', 'حاء', 'حے', 'ḥ', true, '',
    'A strong, breathy “h” from the middle of the throat, as if you were fogging up a mirror. It is different from the soft ه.',
    'حلق کے درمیان سے نکلنے والی گہری اور کھردری «ہ»، جیسے شیشے پر بھاپ ڈالتے وقت۔ اردو میں اسے عام «ہ» پڑھا جاتا ہے، مگر عربی میں یہ بالکل الگ آواز ہے۔',
    'حَلِيب', 'ḥaliib', 'milk', 'دودھ'),
  Lt('خ', 'khaa', 'Khaa', 'خاء', 'خے', 'kh', true, '1a',
    'Like “ch” in Scottish “loch” or German “Bach”: a rough sound at the back of the mouth.',
    'اردو کی «خ» جیسی آواز۔',
    'خُبْز', 'khubz', 'bread', 'روٹی'),
  Lt('د', 'daal', 'Daal', 'دال', 'دال', 'd', false, '',
    'A light “d” as in “door”, with the tongue behind the top teeth.',
    'نرم «د»، زبان اوپر کے دانتوں کے پیچھے لگا کر۔ یہ «ڈ» نہیں ہے۔',
    'دَار', 'daar', 'home', 'گھر'),
  Lt('ذ', 'dhaal', 'Dhaal', 'ذال', 'ذال', 'dh', false, '1a',
    'Like “th” in “this”: the tongue between the teeth, with your voice on.',
    'انگریزی لفظ this کی «th» جیسی آواز: زبان دانتوں کے درمیان۔ اردو کی طرح اسے «ز» نہ پڑھیں۔',
    'ذَهَب', 'dhahab', 'gold', 'سونا'),
  Lt('ر', 'raa', 'Raa', 'راء', 'رے', 'r', false, '',
    'A tapped or lightly rolled “r”, as in Spanish “pero”.',
    'زبان کو ہلکا سا لرزا کر «ر»۔ یہ اردو کی «ر» جیسی ہے، «ڑ» نہیں۔',
    'رَجُل', 'rajul', 'man', 'آدمی'),
  Lt('ز', 'zaay', 'Zaay', 'زاي', 'زے', 'z', false, '1a',
    'Like “z” in “zoo”.',
    'اردو کی «ز» جیسی آواز۔',
    'زَيْت', 'zayt', 'oil', 'تیل'),
  Lt('س', 'seen', 'Seen', 'سين', 'سین', 's', true, '',
    'Like “s” in “sun”.',
    'اردو کی «س» جیسی آواز۔',
    'سَمَك', 'samak', 'fish', 'مچھلی'),
  Lt('ش', 'sheen', 'Sheen', 'شين', 'شین', 'sh', true, '3a',
    'Like “sh” in “ship”.',
    'اردو کی «ش» جیسی آواز۔',
    'شَمْس', 'shams', 'sun', 'سورج'),
  Lt('ص', 'saad', 'Ṣaad', 'صاد', 'صاد', 'ṣ', true, '',
    'A heavy “s”: say “s” with the back of your tongue raised, so the sound fills your mouth.',
    'بھاری «س»: زبان کی جڑ اوپر اٹھا کر منہ بھر کر بولیں۔ اردو میں اسے عام «س» پڑھا جاتا ہے، عربی میں نہیں۔',
    'صَدِيق', 'ṣadiiq', 'friend', 'دوست'),
  Lt('ض', 'daad', 'Ḍaad', 'ضاد', 'ضاد', 'ḍ', true, '1a',
    'A heavy “d”, said with the back of the tongue raised. Arabic is called “the language of ḍaad” because this sound is so rare.',
    'بھاری «د»، زبان کی جڑ اوپر اٹھا کر۔ عربی کو «لغۃ الضاد» کہتے ہیں کیونکہ یہ آواز بہت کم زبانوں میں ہے۔ اردو کی طرح اسے «ز» نہ پڑھیں۔',
    'ضَوْء', 'ḍaw’', 'light', 'روشنی'),
  Lt('ط', 'ttaa', 'Ṭaa', 'طاء', 'طوئے', 'ṭ', true, '',
    'A heavy “t”: a full, deep version of ت.',
    'بھاری «ت»، منہ بھر کر۔ اردو میں اسے عام «ت» پڑھا جاتا ہے، عربی میں نہیں۔',
    'طَالِب', 'ṭaalib', 'student', 'طالب علم'),
  Lt('ظ', 'zaa', 'Ẓaa', 'ظاء', 'ظوئے', 'ẓ', true, '1a',
    'A heavy “dh”: the “th” of “this”, said deep and full.',
    'بھاری «ذ»، یعنی this کی «th» منہ بھر کر۔ اردو کی طرح اسے «ز» نہ پڑھیں۔',
    'ظُهْر', 'ẓuhr', 'noon', 'دوپہر (ظہر)'),
  Lt('ع', 'ayn', 'ʿAyn', 'عين', 'عین', 'ʿ', true, '',
    'A tight sound from the middle of the throat, with no English match. Try saying “a” while gently squeezing your throat.',
    'حلق کے درمیان سے نکلنے والی دبی ہوئی آواز۔ اردو میں اسے اکثر «ا» پڑھ دیا جاتا ہے، مگر عربی میں یہ صاف سنائی دیتی ہے۔',
    'عَيْن', 'ʿayn', 'eye', 'آنکھ'),
  Lt('غ', 'ghayn', 'Ghayn', 'غين', 'غین', 'gh', true, '1a',
    'A gargled sound, like a French “r”.',
    'اردو کی «غ» جیسی آواز۔',
    'غُرْفَة', 'ghurfa', 'room', 'کمرہ'),
  Lt('ف', 'faa', 'Faa', 'فاء', 'فے', 'f', true, '1a',
    'Like “f” in “fish”. Arabic has no “v”.',
    'اردو کی «ف» جیسی آواز۔',
    'فِيل', 'fiil', 'elephant', 'ہاتھی'),
  Lt('ق', 'qaaf', 'Qaaf', 'قاف', 'قاف', 'q', true, '2a',
    'A “k” made further back, where the tongue meets the soft palate. Keep it different from ك.',
    'حلق کے قریب سے نکلنے والا «ق»، جو «ک» سے گہرا ہے۔ اسے «ک» نہ بنائیں۔',
    'قَلَم', 'qalam', 'pen', 'قلم'),
  Lt('ك', 'kaaf', 'Kaaf', 'كاف', 'کاف', 'k', true, '',
    'Like “k” in “kite”.',
    'اردو کی «ک» جیسی آواز۔ عربی میں اکیلی اور آخری شکل میں یہ ك لکھا جاتا ہے۔',
    'كِتَاب', 'kitaab', 'book', 'کتاب'),
  Lt('ل', 'laam', 'Laam', 'لام', 'لام', 'l', true, '',
    'Like “l” in “lamp”. Together with alif it forms the special shape لا (laa).',
    'اردو کی «ل» جیسی آواز۔ الف کے ساتھ مل کر یہ خاص شکل لا بناتا ہے۔',
    'لَيْل', 'layl', 'night', 'رات'),
  Lt('م', 'meem', 'Meem', 'ميم', 'میم', 'm', true, '',
    'Like “m” in “moon”.',
    'اردو کی «م» جیسی آواز۔',
    'مَاء', 'maa’', 'water', 'پانی'),
  Lt('ن', 'noon', 'Noon', 'نون', 'نون', 'n', true, '1a',
    'Like “n” in “noon”.',
    'اردو کی «ن» جیسی آواز۔',
    'نُور', 'nuur', 'light (glow)', 'نور، روشنی'),
  Lt('ه', 'haa', 'Haa', 'هاء', 'ہے', 'h', true, '',
    'A soft “h” as in “hat”. With two dots on top (ة), its end shape becomes taa marbuuṭa, which ends many feminine words.',
    'نرم «ہ»، جیسے «ہم» میں۔ اس کے اوپر دو نقطے لگ جائیں (ة) تو یہ «تاء مربوطہ» بن جاتی ہے، جو کئی مؤنث الفاظ کے آخر میں آتی ہے۔',
    'هِلَال', 'hilaal', 'crescent', 'ہلال (نیا چاند)'),
  Lt('و', 'waaw', 'Waaw', 'واو', 'واؤ', 'w / uu', false, '',
    'A “w” as in “wet”, or a long “oo” as in “moon”.',
    '«و» کی آواز، یا لمبی «او» جیسے «نور» میں۔',
    'وَرْد', 'ward', 'roses', 'گلاب'),
  Lt('ي', 'yaa', 'Yaa', 'ياء', 'یے', 'y / ii', true, '2b',
    'A “y” as in “yes”, or a long “ee” as in “see”.',
    '«ی» کی آواز، یا لمبی «ای» جیسے «تیر» میں۔ عربی میں آخر میں بھی اس کے نیچے دو نقطے ہوتے ہیں: ي۔',
    'يَد', 'yad', 'hand', 'ہاتھ'),
];
const LOOKALIKES = [
  ['baa', 'taa', 'thaa'], ['jeem', 'hhaa', 'khaa'], ['daal', 'dhaal'], ['raa', 'zaay'],
  ['seen', 'sheen'], ['saad', 'daad'], ['ttaa', 'zaa'], ['ayn', 'ghayn'], ['faa', 'qaaf'],
];

// ---------------------------------------------------------------- vocabulary
// Each word: [Arabic, transliteration, English meaning, Urdu meaning]
const TOPICS = [
  {
    slug: 'greetings', en: 'Greetings', ur: 'سلام و آداب',
    titleEn: 'Arabic greetings and polite words', titleUr: 'عربی میں سلام اور آداب کے الفاظ',
    introEn: 'Greetings come first in any Arabic conversation. {السلام عليكم} works everywhere, at any time of day, and always gets the reply {وعليكم السلام}.',
    introUr: 'عربی گفتگو سلام سے شروع ہوتی ہے۔ {السلام عليكم} دن کے ہر وقت اور ہر جگہ کہا جا سکتا ہے، اور اس کا جواب ہمیشہ {وعليكم السلام} ہوتا ہے۔',
    words: [
      ['السلام عليكم', 'as-salaamu ʿalaykum', 'Peace be upon you (hello)', 'آپ پر سلامتی ہو (سلام)'],
      ['وعليكم السلام', 'wa ʿalaykum as-salaam', 'And upon you be peace (reply)', 'اور آپ پر بھی سلامتی ہو (جواب)'],
      ['مرحبا', 'marḥaban', 'Hello, welcome', 'خوش آمدید، ہیلو'],
      ['صباح الخير', 'ṣabaaḥ al-khayr', 'Good morning', 'صبح بخیر'],
      ['مساء الخير', 'masaa’ al-khayr', 'Good evening', 'شام بخیر'],
      ['شكرا', 'shukran', 'Thank you', 'شکریہ'],
      ['عفوا', 'ʿafwan', 'You’re welcome', 'کوئی بات نہیں'],
      ['نعم', 'naʿam', 'Yes', 'جی ہاں'],
      ['لا', 'laa', 'No', 'نہیں'],
      ['مع السلامة', 'maʿa as-salaama', 'Goodbye', 'خدا حافظ'],
    ],
  },
  {
    slug: 'numbers', en: 'Numbers', ur: 'گنتی',
    titleEn: 'Numbers 1 to 10 in Arabic', titleUr: 'عربی میں ایک سے دس تک گنتی',
    introEn: 'Many Arab countries write numbers with their own digits (١ ٢ ٣), but they are read the same way. Learn the words for 1 to 10 first; bigger numbers are built from them.',
    introUr: 'کئی عرب ممالک میں گنتی کے لیے عربی ہندسے (١ ٢ ٣) استعمال ہوتے ہیں، جو اردو ہندسوں سے ملتے جلتے ہیں۔ پہلے ایک سے دس تک کے الفاظ یاد کریں؛ بڑی گنتی انہی سے بنتی ہے۔',
    words: [
      ['واحد', 'waaḥid', 'One (١)', 'ایک (١)'],
      ['اثنان', 'ithnaan', 'Two (٢)', 'دو (٢)'],
      ['ثلاثة', 'thalaatha', 'Three (٣)', 'تین (٣)'],
      ['أربعة', 'arbaʿa', 'Four (٤)', 'چار (٤)'],
      ['خمسة', 'khamsa', 'Five (٥)', 'پانچ (٥)'],
      ['ستة', 'sitta', 'Six (٦)', 'چھ (٦)'],
      ['سبعة', 'sabʿa', 'Seven (٧)', 'سات (٧)'],
      ['ثمانية', 'thamaaniya', 'Eight (٨)', 'آٹھ (٨)'],
      ['تسعة', 'tisʿa', 'Nine (٩)', 'نو (٩)'],
      ['عشرة', 'ʿashara', 'Ten (١٠)', 'دس (١٠)'],
    ],
  },
  {
    slug: 'family', en: 'Family', ur: 'خاندان',
    titleEn: 'Arabic words for family', titleUr: 'عربی میں خاندان کے الفاظ',
    introEn: 'Family words are some of the first you will hear. Grandfather ({جد}) and grandmother ({جدة}) are used for both sides of the family.',
    introUr: 'خاندان کے الفاظ سب سے پہلے سنائی دیتے ہیں۔ {جد} (دادا یا نانا) اور {جدة} (دادی یا نانی) دونوں طرف کے بزرگوں کے لیے استعمال ہوتے ہیں۔',
    words: [
      ['أب', 'ab', 'Father', 'والد، ابو'],
      ['أم', 'umm', 'Mother', 'والدہ، امی'],
      ['أخ', 'akh', 'Brother', 'بھائی'],
      ['أخت', 'ukht', 'Sister', 'بہن'],
      ['ابن', 'ibn', 'Son', 'بیٹا'],
      ['بنت', 'bint', 'Daughter', 'بیٹی'],
      ['جد', 'jadd', 'Grandfather', 'دادا، نانا'],
      ['جدة', 'jadda', 'Grandmother', 'دادی، نانی'],
      ['زوج', 'zawj', 'Husband', 'شوہر'],
      ['زوجة', 'zawja', 'Wife', 'بیوی'],
    ],
  },
  {
    slug: 'food', en: 'Food and drink', ur: 'کھانا پینا',
    titleEn: 'Arabic words for food and drink', titleUr: 'عربی میں کھانے پینے کے الفاظ',
    introEn: 'These words will get you through a café or a market. Across the Gulf, guests are welcomed with Arabic coffee ({قهوة}) and dates ({تمر}).',
    introUr: 'یہ الفاظ ہوٹل اور بازار میں کام آئیں گے۔ خلیجی ممالک میں مہمان کا استقبال عربی قہوے ({قهوة}) اور کھجور ({تمر}) سے کیا جاتا ہے۔',
    words: [
      ['ماء', 'maa’', 'Water', 'پانی'],
      ['خبز', 'khubz', 'Bread', 'روٹی'],
      ['تمر', 'tamr', 'Dates', 'کھجور'],
      ['قهوة', 'qahwa', 'Coffee', 'قہوہ، کافی'],
      ['شاي', 'shaay', 'Tea', 'چائے'],
      ['أرز', 'aruzz', 'Rice', 'چاول'],
      ['لحم', 'laḥm', 'Meat', 'گوشت'],
      ['دجاج', 'dajaaj', 'Chicken', 'مرغی'],
      ['حليب', 'ḥaliib', 'Milk', 'دودھ'],
      ['فاكهة', 'faakiha', 'Fruit', 'پھل'],
    ],
  },
  {
    slug: 'everyday', en: 'Everyday words', ur: 'روزمرہ الفاظ',
    titleEn: 'Everyday Arabic words', titleUr: 'روزمرہ کے عربی الفاظ',
    introEn: 'Common nouns you will see on signs and hear every day. Many of them, like {كتاب} and {قلم}, are also used in Urdu and Persian.',
    introUr: 'یہ عام الفاظ آپ کو روز سائن بورڈز پر نظر آئیں گے۔ ان میں سے کئی، جیسے {كتاب} اور {قلم}، اردو میں بھی استعمال ہوتے ہیں۔',
    words: [
      ['بيت', 'bayt', 'House', 'گھر'],
      ['مدرسة', 'madrasa', 'School', 'اسکول، مدرسہ'],
      ['سيارة', 'sayyaara', 'Car', 'گاڑی'],
      ['كتاب', 'kitaab', 'Book', 'کتاب'],
      ['قلم', 'qalam', 'Pen', 'قلم'],
      ['باب', 'baab', 'Door', 'دروازہ'],
      ['يوم', 'yawm', 'Day', 'دن'],
      ['عمل', 'ʿamal', 'Work', 'کام'],
      ['سوق', 'suuq', 'Market', 'بازار'],
      ['مسجد', 'masjid', 'Mosque', 'مسجد'],
    ],
  },
  {
    slug: 'days', en: 'Days of the week', ur: 'ہفتے کے دن',
    titleEn: 'Days of the week in Arabic', titleUr: 'عربی میں ہفتے کے دن',
    introEn: 'The Arabic week starts on Sunday, {الأحد}, “the first”. Most day names come from numbers: {الاثنين} is “the second” and {الخميس} “the fifth”. Friday, {الجمعة}, means “the gathering”.',
    introUr: 'عرب دنیا میں ہفتہ اتوار ({الأحد} یعنی «پہلا») سے شروع ہوتا ہے۔ زیادہ تر دنوں کے نام گنتی سے بنے ہیں: {الاثنين} یعنی «دوسرا» اور {الخميس} یعنی «پانچواں»۔ جمعہ ({الجمعة}) کا مطلب ہے «اکٹھا ہونا»۔',
    words: [
      ['الأحد', 'al-aḥad', 'Sunday', 'اتوار'],
      ['الاثنين', 'al-ithnayn', 'Monday', 'پیر'],
      ['الثلاثاء', 'ath-thulaathaa’', 'Tuesday', 'منگل'],
      ['الأربعاء', 'al-arbiʿaa’', 'Wednesday', 'بدھ'],
      ['الخميس', 'al-khamiis', 'Thursday', 'جمعرات'],
      ['الجمعة', 'al-jumuʿa', 'Friday', 'جمعہ'],
      ['السبت', 'as-sabt', 'Saturday', 'ہفتہ'],
    ],
  },
  {
    slug: 'colours', en: 'Colours', ur: 'رنگ',
    titleEn: 'Colours in Arabic', titleUr: 'عربی میں رنگوں کے نام',
    introEn: 'Most basic colours share one pattern: {أحمر}, {أزرق}, {أخضر}. They change shape for feminine nouns, which you will meet in the grammar lessons.',
    introUr: 'زیادہ تر بنیادی رنگ ایک ہی وزن پر آتے ہیں: {أحمر}، {أزرق}، {أخضر}۔ مؤنث اسموں کے ساتھ ان کی شکل بدل جاتی ہے، جو آپ گرامر کے اسباق میں دیکھیں گے۔',
    words: [
      ['أحمر', 'aḥmar', 'Red', 'لال، سرخ'],
      ['أزرق', 'azraq', 'Blue', 'نیلا'],
      ['أخضر', 'akhḍar', 'Green', 'ہرا، سبز'],
      ['أصفر', 'aṣfar', 'Yellow', 'پیلا'],
      ['أسود', 'aswad', 'Black', 'کالا'],
      ['أبيض', 'abyaḍ', 'White', 'سفید'],
      ['بني', 'bunnii', 'Brown', 'بھورا'],
      ['برتقالي', 'burtuqaalii', 'Orange', 'نارنجی'],
    ],
  },
  {
    slug: 'jobs', en: 'Jobs', ur: 'پیشے',
    titleEn: 'Arabic words for jobs and professions', titleUr: 'عربی میں پیشوں کے نام',
    introEn: 'Say what you do with {أنا} (I am) and the job: {أنا مهندس} (I am an engineer). These are the masculine forms; for a woman, add {ة}: {طبيبة}, {مدرسة}.',
    introUr: 'اپنا پیشہ بتانے کے لیے {أنا} (میں ہوں) کے بعد پیشہ لگائیں: {أنا مهندس} (میں انجینئر ہوں)۔ یہ مذکر شکلیں ہیں؛ عورت کے لیے {ة} لگائیں: {طبيبة}، {مدرسة}۔',
    words: [
      ['طبيب', 'ṭabiib', 'Doctor', 'ڈاکٹر'],
      ['ممرض', 'mumarriḍ', 'Nurse (man)', 'نرس (مرد)'],
      ['مدرس', 'mudarris', 'Teacher', 'استاد'],
      ['مهندس', 'muhandis', 'Engineer', 'انجینئر'],
      ['محاسب', 'muḥaasib', 'Accountant', 'اکاؤنٹنٹ'],
      ['سائق', 'saa’iq', 'Driver', 'ڈرائیور'],
      ['طباخ', 'ṭabbaakh', 'Cook', 'باورچی'],
      ['شرطي', 'shurṭii', 'Police officer', 'پولیس والا'],
      ['طالب', 'ṭaalib', 'Student', 'طالب علم'],
      ['عامل', 'ʿaamil', 'Worker', 'مزدور، کارکن'],
    ],
  },
  {
    slug: 'body', en: 'The body', ur: 'جسم',
    titleEn: 'Arabic words for parts of the body', titleUr: 'عربی میں جسم کے حصوں کے نام',
    introEn: 'Useful at the doctor’s: {عندي ألم في} (I have pain in) plus the body part. Many body words are feminine, such as {عين} (eye) and {يد} (hand), and some come in pairs.',
    introUr: 'ڈاکٹر کے پاس کام آتے ہیں: {عندي ألم في} (مجھے درد ہے) کے بعد جسم کا حصہ بتائیں۔ جسم کے کئی الفاظ مؤنث ہیں، جیسے {عين} (آنکھ) اور {يد} (ہاتھ)، اور کچھ جوڑوں میں ہوتے ہیں۔',
    words: [
      ['رأس', 'ra’s', 'Head', 'سر'],
      ['عين', 'ʿayn', 'Eye', 'آنکھ'],
      ['أذن', 'udhun', 'Ear', 'کان'],
      ['أنف', 'anf', 'Nose', 'ناک'],
      ['فم', 'fam', 'Mouth', 'منہ'],
      ['سن', 'sinn', 'Tooth', 'دانت'],
      ['يد', 'yad', 'Hand', 'ہاتھ'],
      ['رجل', 'rijl', 'Foot, leg', 'پاؤں، ٹانگ'],
      ['قلب', 'qalb', 'Heart', 'دل'],
      ['شعر', 'shaʿr', 'Hair', 'بال'],
    ],
  },
  {
    slug: 'places', en: 'Places and transport', ur: 'مقامات اور سواری',
    titleEn: 'Arabic words for places and transport', titleUr: 'عربی میں مقامات اور سواریوں کے نام',
    introEn: 'To ask the way, say {أين} (where) and the place: {أين المطار؟} (Where is the airport?). Add {من فضلك} (please) to be polite.',
    introUr: 'راستہ پوچھنے کے لیے {أين} (کہاں) کے بعد جگہ کا نام لگائیں: {أين المطار؟} (ہوائی اڈا کہاں ہے؟)۔ شائستگی کے لیے {من فضلك} (مہربانی) بھی کہیں۔',
    words: [
      ['طائرة', 'ṭaa’ira', 'Plane', 'ہوائی جہاز'],
      ['قطار', 'qiṭaar', 'Train', 'ٹرین'],
      ['حافلة', 'ḥaafila', 'Bus', 'بس'],
      ['دراجة', 'darraaja', 'Bicycle', 'سائیکل'],
      ['مطار', 'maṭaar', 'Airport', 'ہوائی اڈا'],
      ['مستشفى', 'mustashfaa', 'Hospital', 'ہسپتال'],
      ['مطعم', 'maṭʿam', 'Restaurant', 'ریستوران'],
      ['بنك', 'bank', 'Bank', 'بینک'],
      ['فندق', 'funduq', 'Hotel', 'ہوٹل'],
      ['شارع', 'shaariʿ', 'Street', 'سڑک، گلی'],
    ],
  },
  {
    slug: 'home', en: 'Around the home', ur: 'گھر کی چیزیں',
    titleEn: 'Arabic words for things at home', titleUr: 'عربی میں گھر کی چیزوں کے نام',
    introEn: 'Name what is around you: {هذا سرير} (This is a bed). Point at things in your own home and say their Arabic names out loud.',
    introUr: 'اپنے اردگرد کی چیزوں کے نام لیں: {هذا سرير} (یہ بستر ہے)۔ اپنے گھر میں چیزوں کی طرف اشارہ کر کے ان کے عربی نام بلند آواز سے کہیں۔',
    words: [
      ['غرفة', 'ghurfa', 'Room', 'کمرہ'],
      ['مطبخ', 'maṭbakh', 'Kitchen', 'باورچی خانہ'],
      ['سرير', 'sariir', 'Bed', 'بستر'],
      ['طاولة', 'ṭaawila', 'Table', 'میز'],
      ['كرسي', 'kursii', 'Chair', 'کرسی'],
      ['نافذة', 'naafidha', 'Window', 'کھڑکی'],
      ['مفتاح', 'miftaaḥ', 'Key', 'چابی'],
      ['ساعة', 'saaʿa', 'Clock, watch; hour', 'گھڑی؛ گھنٹہ'],
      ['هاتف', 'haatif', 'Phone', 'فون'],
      ['حديقة', 'ḥadiiqa', 'Garden', 'باغ'],
    ],
  },
];

// ---------------------------------------------------------------- phrases
// [Arabic, transliteration, English, Urdu, English note, Urdu note]
const PHRASES = [
  ['ما اسمك؟', 'masmuk?', 'What is your name?', 'آپ کا نام کیا ہے؟', 'To a woman: masmuki?', 'عورت سے: ما اسمكِ؟'],
  ['اسمي أحمد', 'ismii aḥmad', 'My name is Ahmad', 'میرا نام احمد ہے', '', ''],
  ['كيف حالك؟', 'kayfa ḥaaluk?', 'How are you?', 'آپ کیسے ہیں؟', 'To a woman: kayfa ḥaaluki?', 'عورت سے: كيف حالكِ؟'],
  ['بخير، الحمد لله', 'bikhayr, al-ḥamdu lillaah', 'Fine, praise be to God', 'ٹھیک ہوں، الحمد للہ', '', ''],
  ['من أين أنت؟', 'min ayna anta?', 'Where are you from?', 'آپ کہاں سے ہیں؟', 'To a woman: min ayna anti?', 'عورت سے: من أين أنتِ؟'],
  ['أنا من باكستان', 'anaa min baakistaan', 'I am from Pakistan', 'میں پاکستان سے ہوں', '', ''],
  ['بكم هذا؟', 'bikam haadhaa?', 'How much is this?', 'یہ کتنے کا ہے؟', '', ''],
  ['أريد هذا', 'uriidu haadhaa', 'I want this', 'مجھے یہ چاہیے', '', ''],
  ['أين المسجد؟', 'aynal-masjid?', 'Where is the mosque?', 'مسجد کہاں ہے؟', '', ''],
  ['أين الحمام؟', 'aynal-ḥammaam?', 'Where is the bathroom?', 'باتھ روم کہاں ہے؟', '', ''],
  ['كم الساعة؟', 'kamis-saaʿa?', 'What time is it?', 'کیا وقت ہوا ہے؟', '', ''],
  ['لا أفهم', 'laa afham', 'I don’t understand', 'میں نہیں سمجھا', '', ''],
  ['تكلم ببطء من فضلك', 'takallam bi-buṭ’ min faḍlak', 'Please speak slowly', 'براہِ مہربانی آہستہ بولیں', 'To a woman: takallamii bi-buṭ’ min faḍliki', 'عورت سے: تكلمي ببطء من فضلكِ'],
  ['هل تتكلم الإنجليزية؟', 'hal tatakallamul-injliiziyya?', 'Do you speak English?', 'کیا آپ انگریزی بولتے ہیں؟', 'To a woman: hal tatakallamiina…?', 'عورت سے: هل تتكلمين…؟'],
  ['من فضلك', 'min faḍlak', 'Please', 'براہِ مہربانی', 'To a woman: min faḍliki', 'عورت سے: من فضلكِ'],
  ['إن شاء الله', 'in shaa’ allaah', 'God willing', 'ان شاء اللہ', '', ''],
];

// ---------------------------------------------------------------- Quran
// Quran text: Tanzil Project (tanzil.net), quran-simple. Word meanings and translations are written for Harf.
const SURAHS = [
  { slug: 'al-fatiha', n: 1, name: 'الْفَاتِحَة', en: 'Al-Fatiha', ur: 'سورہ فاتحہ', meanEn: 'The Opening', meanUr: 'آغاز',
    introEn: 'Al-Fatiha, “The Opening”, is the first surah of the Quran. Muslims recite it in every rakʿah of every prayer, so it is the best place to start understanding the Quran.',
    introUr: 'سورہ فاتحہ یعنی «آغاز» قرآن کی پہلی سورت ہے۔ یہ ہر نماز کی ہر رکعت میں پڑھی جاتی ہے، اس لیے قرآن سمجھنے کا آغاز اسی سے کرنا بہترین ہے۔',
    v: [
      { w: [['بِسْمِ', 'bismi', 'In the name', 'نام سے'], ['اللَّهِ', 'llaahi', 'of Allah', 'اللہ کے'], ['الرَّحْمَٰنِ', 'r-raḥmaani', 'the Most Gracious', 'جو بڑا مہربان'], ['الرَّحِيمِ', 'r-raḥiim', 'the Most Merciful', 'نہایت رحم والا']],
        en: 'In the name of Allah, the Most Gracious, the Most Merciful.', ur: 'اللہ کے نام سے جو بڑا مہربان، نہایت رحم والا ہے۔' },
      { w: [['الْحَمْدُ', 'al-ḥamdu', 'All praise', 'تمام تعریف'], ['لِلَّهِ', 'lillaahi', 'is for Allah', 'اللہ کے لیے ہے'], ['رَبِّ', 'rabbi', 'Lord', 'رب'], ['الْعَالَمِينَ', 'l-ʿaalamiin', 'of all the worlds', 'تمام جہانوں کا']],
        en: 'All praise is for Allah, Lord of all the worlds.', ur: 'تمام تعریف اللہ کے لیے ہے جو تمام جہانوں کا رب ہے۔' },
      { w: [['الرَّحْمَٰنِ', 'ar-raḥmaani', 'the Most Gracious', 'بڑا مہربان'], ['الرَّحِيمِ', 'r-raḥiim', 'the Most Merciful', 'نہایت رحم والا']],
        en: 'The Most Gracious, the Most Merciful.', ur: 'جو بڑا مہربان، نہایت رحم والا ہے۔' },
      { w: [['مَالِكِ', 'maaliki', 'Master', 'مالک'], ['يَوْمِ', 'yawmi', 'of the Day', 'دن کا'], ['الدِّينِ', 'd-diin', 'of Judgement', 'جزا کے']],
        en: 'Master of the Day of Judgement.', ur: 'جزا کے دن کا مالک ہے۔' },
      { w: [['إِيَّاكَ', 'iyyaaka', 'You alone', 'صرف تیری'], ['نَعْبُدُ', 'naʿbudu', 'we worship', 'ہم عبادت کرتے ہیں'], ['وَإِيَّاكَ', 'wa-iyyaaka', 'and You alone', 'اور صرف تجھ سے'], ['نَسْتَعِينُ', 'nastaʿiin', 'we ask for help', 'ہم مدد مانگتے ہیں']],
        en: 'You alone we worship, and You alone we ask for help.', ur: 'ہم صرف تیری ہی عبادت کرتے ہیں اور صرف تجھ ہی سے مدد مانگتے ہیں۔' },
      { w: [['اهْدِنَا', 'ihdinaa', 'Guide us', 'ہمیں دکھا'], ['الصِّرَاطَ', 'ṣ-ṣiraaṭa', 'to the path', 'راستہ'], ['الْمُسْتَقِيمَ', 'l-mustaqiim', 'the straight', 'سیدھا']],
        en: 'Guide us to the straight path,', ur: 'ہمیں سیدھا راستہ دکھا،' },
      { w: [['صِرَاطَ', 'ṣiraaṭa', 'the path', 'راستہ'], ['الَّذِينَ', 'lladhiina', 'of those', 'ان لوگوں کا'], ['أَنْعَمْتَ', 'anʿamta', 'You have blessed', 'تو نے انعام کیا'], ['عَلَيْهِمْ', 'ʿalayhim', 'upon them', 'جن پر'], ['غَيْرِ', 'ghayri', 'not', 'نہ کہ'], ['الْمَغْضُوبِ', 'l-maghḍuubi', 'those who earned anger', 'جن پر غضب ہوا'], ['عَلَيْهِمْ', 'ʿalayhim', 'upon them', 'ان پر'], ['وَلَا', 'wa-laa', 'and not', 'اور نہ'], ['الضَّالِّينَ', 'ḍ-ḍaalliin', 'those who went astray', 'گمراہوں کا']],
        en: 'the path of those You have blessed, not of those who earned Your anger, nor of those who went astray.', ur: 'ان لوگوں کا راستہ جن پر تو نے انعام کیا، نہ ان کا جن پر غضب ہوا اور نہ گمراہوں کا۔' },
    ] },
  { slug: 'al-asr', n: 103, name: 'الْعَصْر', en: 'Al-Asr', ur: 'سورہ عصر', meanEn: 'Time', meanUr: 'زمانہ',
    introEn: 'Al-Asr, “Time”, is one of the shortest surahs. In three verses it sums up what saves a person from loss: faith, good deeds, and urging one another to truth and patience.',
    introUr: 'سورہ عصر یعنی «زمانہ» قرآن کی مختصر ترین سورتوں میں سے ہے۔ تین آیتوں میں یہ بتاتی ہے کہ انسان کو خسارے سے کیا بچاتا ہے: ایمان، نیک عمل، اور ایک دوسرے کو حق اور صبر کی تلقین۔',
    v: [
      { w: [['وَالْعَصْرِ', 'wal-ʿaṣr', 'By time', 'زمانے کی قسم']],
        en: 'By time,', ur: 'زمانے کی قسم،' },
      { w: [['إِنَّ', 'inna', 'Indeed', 'بے شک'], ['الْإِنْسَانَ', 'l-insaana', 'mankind', 'انسان'], ['لَفِي', 'lafii', 'is surely in', 'یقیناً میں ہے'], ['خُسْرٍ', 'khusr', 'loss', 'خسارے']],
        en: 'indeed, mankind is in loss,', ur: 'بے شک انسان خسارے میں ہے،' },
      { w: [['إِلَّا', 'illaa', 'except', 'سوائے'], ['الَّذِينَ', 'lladhiina', 'those who', 'ان لوگوں کے جو'], ['آمَنُوا', 'aamanuu', 'believe', 'ایمان لائے'], ['وَعَمِلُوا', 'wa-ʿamiluu', 'and do', 'اور عمل کیے'], ['الصَّالِحَاتِ', 'ṣ-ṣaaliḥaati', 'good deeds', 'نیک'], ['وَتَوَاصَوْا', 'wa-tawaaṣaw', 'and urge one another', 'اور ایک دوسرے کو تلقین کی'], ['بِالْحَقِّ', 'bil-ḥaqqi', 'to the truth', 'حق کی'], ['وَتَوَاصَوْا', 'wa-tawaaṣaw', 'and urge one another', 'اور ایک دوسرے کو تلقین کی'], ['بِالصَّبْرِ', 'biṣ-ṣabr', 'to patience', 'صبر کی']],
        en: 'except those who believe and do good deeds, and urge one another to the truth, and urge one another to patience.', ur: 'سوائے ان لوگوں کے جو ایمان لائے اور نیک عمل کیے، اور ایک دوسرے کو حق کی تلقین کی اور ایک دوسرے کو صبر کی تلقین کی۔' },
    ] },
  { slug: 'al-fil', n: 105, name: 'الْفِيل', en: 'Al-Fil', ur: 'سورہ فیل', meanEn: 'The Elephant', meanUr: 'ہاتھی',
    introEn: 'Al-Fil, “The Elephant”, recalls the people of the elephant, the army that came to destroy the Ka‘bah, and how Allah stopped them.',
    introUr: 'سورہ فیل یعنی «ہاتھی» ہاتھی والوں کا ذکر کرتی ہے، یعنی وہ لشکر جو کعبہ کو گرانے آیا تھا، اور بتاتی ہے کہ اللہ نے انہیں کیسے روکا۔',
    v: [
      { w: [['أَلَمْ', 'alam', 'Have … not', 'کیا نہیں'], ['تَرَ', 'tara', 'you seen', 'آپ نے دیکھا'], ['كَيْفَ', 'kayfa', 'how', 'کیسا'], ['فَعَلَ', 'faʿala', 'dealt', 'سلوک کیا'], ['رَبُّكَ', 'rabbuka', 'your Lord', 'آپ کے رب نے'], ['بِأَصْحَابِ', 'bi-aṣḥaabi', 'with the people', 'والوں کے ساتھ'], ['الْفِيلِ', 'l-fiil', 'of the elephant', 'ہاتھی']],
        en: 'Have you not seen how your Lord dealt with the people of the elephant?', ur: 'کیا آپ نے نہیں دیکھا کہ آپ کے رب نے ہاتھی والوں کے ساتھ کیا سلوک کیا؟' },
      { w: [['أَلَمْ', 'alam', 'Did … not', 'کیا نہیں'], ['يَجْعَلْ', 'yajʿal', 'He make', 'اس نے کر دیا'], ['كَيْدَهُمْ', 'kaydahum', 'their plan', 'ان کی چال کو'], ['فِي', 'fii', 'into', 'میں'], ['تَضْلِيلٍ', 'taḍliil', 'ruin', 'بربادی']],
        en: 'Did He not bring their plan to ruin?', ur: 'کیا اس نے ان کی چال کو برباد نہیں کر دیا؟' },
      { w: [['وَأَرْسَلَ', 'wa-arsala', 'And He sent', 'اور اس نے بھیجے'], ['عَلَيْهِمْ', 'ʿalayhim', 'against them', 'ان پر'], ['طَيْرًا', 'ṭayran', 'birds', 'پرندے'], ['أَبَابِيلَ', 'abaabiil', 'in flocks', 'جھنڈ کے جھنڈ']],
        en: 'And He sent against them birds in flocks,', ur: 'اور ان پر جھنڈ کے جھنڈ پرندے بھیجے،' },
      { w: [['تَرْمِيهِمْ', 'tarmiihim', 'striking them', 'جو ان پر پھینکتے تھے'], ['بِحِجَارَةٍ', 'bi-ḥijaaratin', 'with stones', 'پتھر'], ['مِنْ', 'min', 'of', 'کے'], ['سِجِّيلٍ', 'sijjiil', 'baked clay', 'پکی ہوئی مٹی']],
        en: 'striking them with stones of baked clay,', ur: 'جو ان پر پکی ہوئی مٹی کے پتھر پھینکتے تھے،' },
      { w: [['فَجَعَلَهُمْ', 'fa-jaʿalahum', 'so He made them', 'پھر اس نے انہیں کر دیا'], ['كَعَصْفٍ', 'ka-ʿaṣfin', 'like straw', 'بھوسے کی طرح'], ['مَأْكُولٍ', 'ma’kuul', 'eaten up', 'کھایا ہوا']],
        en: 'and He made them like eaten-up straw.', ur: 'پھر انہیں کھائے ہوئے بھوسے کی طرح کر دیا۔' },
    ] },
  { slug: 'quraysh', n: 106, name: 'قُرَيْش', en: 'Quraysh', ur: 'سورہ قریش', meanEn: 'The tribe of Quraysh', meanUr: 'قبیلہ قریش',
    introEn: 'Quraysh reminds the Prophet’s tribe of the safe trading journeys Allah gave them in winter and summer, and calls them to worship the Lord of the Ka‘bah.',
    introUr: 'سورہ قریش نبی ﷺ کے قبیلے کو سردی اور گرمی کے ان محفوظ تجارتی سفروں کی یاد دلاتی ہے جو اللہ نے انہیں عطا کیے، اور انہیں کعبہ کے رب کی عبادت کی دعوت دیتی ہے۔',
    v: [
      { w: [['لِإِيلَافِ', 'li-iilaafi', 'For the familiar security', 'مانوس رکھنے کی خاطر'], ['قُرَيْشٍ', 'quraysh', 'of Quraysh', 'قریش کو']],
        en: 'For the familiar security of Quraysh,', ur: 'قریش کو مانوس رکھنے کی خاطر،' },
      { w: [['إِيلَافِهِمْ', 'iilaafihim', 'their security', 'انہیں مانوس رکھنا'], ['رِحْلَةَ', 'riḥlata', 'in the journey', 'سفر سے'], ['الشِّتَاءِ', 'sh-shitaa’i', 'of winter', 'سردی کے'], ['وَالصَّيْفِ', 'waṣ-ṣayf', 'and summer', 'اور گرمی کے']],
        en: 'their security in the journeys of winter and summer,', ur: 'سردی اور گرمی کے سفر سے انہیں مانوس رکھنے کی خاطر،' },
      { w: [['فَلْيَعْبُدُوا', 'fal-yaʿbuduu', 'let them worship', 'تو انہیں چاہیے کہ عبادت کریں'], ['رَبَّ', 'rabba', 'the Lord', 'رب کی'], ['هَٰذَا', 'haadhaa', 'of this', 'اس'], ['الْبَيْتِ', 'l-bayt', 'House', 'گھر کے']],
        en: 'let them worship the Lord of this House,', ur: 'تو انہیں چاہیے کہ اس گھر (کعبہ) کے رب کی عبادت کریں،' },
      { w: [['الَّذِي', 'alladhii', 'who', 'جس نے'], ['أَطْعَمَهُمْ', 'aṭʿamahum', 'fed them', 'انہیں کھانا دیا'], ['مِنْ', 'min', 'against', 'میں'], ['جُوعٍ', 'juuʿin', 'hunger', 'بھوک'], ['وَآمَنَهُمْ', 'wa-aamanahum', 'and made them safe', 'اور انہیں امن دیا'], ['مِنْ', 'min', 'from', 'سے'], ['خَوْفٍ', 'khawf', 'fear', 'خوف']],
        en: 'who fed them against hunger and made them safe from fear.', ur: 'جس نے انہیں بھوک میں کھانا دیا اور خوف سے امن دیا۔' },
    ] },
  { slug: 'al-maun', n: 107, name: 'الْمَاعُون', en: 'Al-Ma‘un', ur: 'سورہ ماعون', meanEn: 'Small Kindnesses', meanUr: 'معمولی چیزیں',
    introEn: 'Al-Ma‘un, “Small Kindnesses”, warns against praying only for show while ignoring orphans, the poor and the simple help that people need from each other.',
    introUr: 'سورہ ماعون یعنی «معمولی چیزیں» اس رویے سے خبردار کرتی ہے کہ نماز صرف دکھاوے کے لیے پڑھی جائے، اور یتیموں، مسکینوں اور لوگوں کی چھوٹی چھوٹی ضرورتوں سے منہ موڑا جائے۔',
    v: [
      { w: [['أَرَأَيْتَ', 'ara’ayta', 'Have you seen', 'کیا آپ نے دیکھا'], ['الَّذِي', 'lladhii', 'the one who', 'اسے جو'], ['يُكَذِّبُ', 'yukadhdhibu', 'denies', 'جھٹلاتا ہے'], ['بِالدِّينِ', 'bid-diin', 'the Judgement', 'جزا کو']],
        en: 'Have you seen the one who denies the Judgement?', ur: 'کیا آپ نے اسے دیکھا جو جزا (کے دن) کو جھٹلاتا ہے؟' },
      { w: [['فَذَٰلِكَ', 'fa-dhaalika', 'That is', 'تو یہ وہی ہے'], ['الَّذِي', 'lladhii', 'the one who', 'جو'], ['يَدُعُّ', 'yaduʿʿu', 'pushes away', 'دھکے دیتا ہے'], ['الْيَتِيمَ', 'l-yatiim', 'the orphan', 'یتیم کو']],
        en: 'That is the one who pushes away the orphan,', ur: 'یہ وہی ہے جو یتیم کو دھکے دیتا ہے،' },
      { w: [['وَلَا', 'wa-laa', 'and does not', 'اور نہیں'], ['يَحُضُّ', 'yaḥuḍḍu', 'encourage', 'ترغیب دیتا'], ['عَلَىٰ', 'ʿalaa', 'to', 'پر'], ['طَعَامِ', 'ṭaʿaami', 'feeding', 'کھانا کھلانے'], ['الْمِسْكِينِ', 'l-miskiin', 'the poor', 'مسکین کو']],
        en: 'and does not encourage feeding the poor.', ur: 'اور مسکین کو کھانا کھلانے کی ترغیب نہیں دیتا۔' },
      { w: [['فَوَيْلٌ', 'fa-waylun', 'So woe', 'تو تباہی ہے'], ['لِلْمُصَلِّينَ', 'lil-muṣalliin', 'to those who pray', 'ان نمازیوں کے لیے']],
        en: 'So woe to those who pray,', ur: 'تو تباہی ہے ان نمازیوں کے لیے' },
      { w: [['الَّذِينَ', 'alladhiina', 'who', 'جو'], ['هُمْ', 'hum', 'they', 'وہ'], ['عَنْ', 'ʿan', 'of', 'سے'], ['صَلَاتِهِمْ', 'ṣalaatihim', 'their prayer', 'اپنی نماز'], ['سَاهُونَ', 'saahuun', 'are heedless', 'غافل ہیں']],
        en: 'who are heedless of their prayer,', ur: 'جو اپنی نماز سے غافل ہیں،' },
      { w: [['الَّذِينَ', 'alladhiina', 'who', 'جو'], ['هُمْ', 'hum', 'they', 'وہ'], ['يُرَاءُونَ', 'yuraa’uun', 'show off', 'دکھاوا کرتے ہیں']],
        en: 'who only want to be seen,', ur: 'جو صرف دکھاوا کرتے ہیں،' },
      { w: [['وَيَمْنَعُونَ', 'wa-yamnaʿuuna', 'and withhold', 'اور روکتے ہیں'], ['الْمَاعُونَ', 'l-maaʿuun', 'small kindnesses', 'برتنے کی معمولی چیزیں']],
        en: 'and refuse even small kindnesses.', ur: 'اور برتنے کی معمولی چیزیں بھی دینے سے انکار کرتے ہیں۔' },
    ] },
  { slug: 'al-kawthar', n: 108, name: 'الْكَوْثَر', en: 'Al-Kawthar', ur: 'سورہ کوثر', meanEn: 'Abundant Good', meanUr: 'خیرِ کثیر',
    introEn: 'Al-Kawthar, “Abundant Good”, is the shortest surah in the Quran: three short verses and only ten words.',
    introUr: 'سورہ کوثر یعنی «خیرِ کثیر» قرآن کی سب سے چھوٹی سورت ہے: تین مختصر آیتیں اور صرف دس الفاظ۔',
    v: [
      { w: [['إِنَّا', 'innaa', 'Indeed We', 'بے شک ہم نے'], ['أَعْطَيْنَاكَ', 'aʿṭaynaaka', 'have given you', 'آپ کو عطا کیا'], ['الْكَوْثَرَ', 'l-kawthar', 'al-Kawthar (abundant good)', 'کوثر (بہت بھلائی)']],
        en: 'Indeed, We have given you al-Kawthar (abundant good).', ur: 'بے شک ہم نے آپ کو کوثر (بہت بھلائی) عطا کی۔' },
      { w: [['فَصَلِّ', 'fa-ṣalli', 'So pray', 'پس نماز پڑھیں'], ['لِرَبِّكَ', 'li-rabbika', 'to your Lord', 'اپنے رب کے لیے'], ['وَانْحَرْ', 'wa-nḥar', 'and sacrifice', 'اور قربانی کریں']],
        en: 'So pray to your Lord and sacrifice.', ur: 'پس اپنے رب کے لیے نماز پڑھیں اور قربانی کریں۔' },
      { w: [['إِنَّ', 'inna', 'Indeed', 'بے شک'], ['شَانِئَكَ', 'shaani’aka', 'your enemy', 'آپ کا دشمن'], ['هُوَ', 'huwa', 'he is', 'وہی'], ['الْأَبْتَرُ', 'l-abtar', 'the one cut off', 'جڑ کٹا']],
        en: 'Indeed, it is your enemy who is cut off.', ur: 'بے شک آپ کا دشمن ہی جڑ کٹا (بے نام و نشان) ہے۔' },
    ] },
  { slug: 'al-kafirun', n: 109, name: 'الْكَافِرُون', en: 'Al-Kafirun', ur: 'سورہ کافرون', meanEn: 'The Disbelievers', meanUr: 'کافر',
    introEn: 'Al-Kafirun, “The Disbelievers”, draws a clear line in worship: the believer worships Allah alone, and each side keeps its own religion.',
    introUr: 'سورہ کافرون عبادت کے معاملے میں صاف حد کھینچتی ہے: مومن صرف اللہ کی عبادت کرتا ہے، اور ہر ایک کے لیے اس کا اپنا دین ہے۔',
    v: [
      { w: [['قُلْ', 'qul', 'Say', 'کہہ دیجیے'], ['يَا', 'yaa', 'O', 'اے'], ['أَيُّهَا', 'ayyuha', 'you', '(پکارنے کا لفظ)'], ['الْكَافِرُونَ', 'l-kaafiruun', 'disbelievers', 'کافرو']],
        en: 'Say: O disbelievers,', ur: 'کہہ دیجیے: اے کافرو!' },
      { w: [['لَا', 'laa', 'not', 'نہیں'], ['أَعْبُدُ', 'aʿbudu', 'I worship', 'میں عبادت کرتا'], ['مَا', 'maa', 'what', 'اس کی جس کی'], ['تَعْبُدُونَ', 'taʿbuduun', 'you worship', 'تم عبادت کرتے ہو']],
        en: 'I do not worship what you worship,', ur: 'میں اس کی عبادت نہیں کرتا جس کی تم عبادت کرتے ہو،' },
      { w: [['وَلَا', 'wa-laa', 'and not', 'اور نہ'], ['أَنْتُمْ', 'antum', 'you', 'تم'], ['عَابِدُونَ', 'ʿaabiduuna', 'are worshippers', 'عبادت کرنے والے ہو'], ['مَا', 'maa', 'of what', 'اس کی جس کی'], ['أَعْبُدُ', 'aʿbud', 'I worship', 'میں عبادت کرتا ہوں']],
        en: 'nor do you worship what I worship,', ur: 'اور نہ تم اس کی عبادت کرنے والے ہو جس کی میں عبادت کرتا ہوں،' },
      { w: [['وَلَا', 'wa-laa', 'and not', 'اور نہ'], ['أَنَا', 'anaa', 'I', 'میں'], ['عَابِدٌ', 'ʿaabidun', 'a worshipper', 'عبادت کرنے والا ہوں'], ['مَا', 'maa', 'of what', 'اس کی جس کی'], ['عَبَدْتُمْ', 'ʿabadtum', 'you have worshipped', 'تم نے عبادت کی']],
        en: 'nor will I worship what you have worshipped,', ur: 'اور نہ میں اس کی عبادت کرنے والا ہوں جس کی تم نے عبادت کی،' },
      { w: [['وَلَا', 'wa-laa', 'and not', 'اور نہ'], ['أَنْتُمْ', 'antum', 'you', 'تم'], ['عَابِدُونَ', 'ʿaabiduuna', 'are worshippers', 'عبادت کرنے والے ہو'], ['مَا', 'maa', 'of what', 'اس کی جس کی'], ['أَعْبُدُ', 'aʿbud', 'I worship', 'میں عبادت کرتا ہوں']],
        en: 'nor will you worship what I worship.', ur: 'اور نہ تم اس کی عبادت کرنے والے ہو جس کی میں عبادت کرتا ہوں۔' },
      { w: [['لَكُمْ', 'lakum', 'For you', 'تمہارے لیے'], ['دِينُكُمْ', 'diinukum', 'your religion', 'تمہارا دین'], ['وَلِيَ', 'wa-liya', 'and for me', 'اور میرے لیے'], ['دِينِ', 'diin', 'my religion', 'میرا دین']],
        en: 'For you is your religion, and for me is mine.', ur: 'تمہارے لیے تمہارا دین اور میرے لیے میرا دین۔' },
    ] },
  { slug: 'an-nasr', n: 110, name: 'النَّصْر', en: 'An-Nasr', ur: 'سورہ نصر', meanEn: 'Help', meanUr: 'مدد',
    introEn: 'An-Nasr, “Help”, speaks of Allah’s help and victory, and of people entering Islam in crowds. It teaches the right response: praise, and asking forgiveness.',
    introUr: 'سورہ نصر یعنی «مدد» اللہ کی مدد، فتح اور لوگوں کے فوج در فوج اسلام میں داخل ہونے کا ذکر کرتی ہے، اور سکھاتی ہے کہ اس پر تسبیح اور استغفار کیا جائے۔',
    v: [
      { w: [['إِذَا', 'idhaa', 'When', 'جب'], ['جَاءَ', 'jaa’a', 'comes', 'آ جائے'], ['نَصْرُ', 'naṣru', 'the help', 'مدد'], ['اللَّهِ', 'llaahi', 'of Allah', 'اللہ کی'], ['وَالْفَتْحُ', 'wal-fatḥ', 'and the victory', 'اور فتح']],
        en: 'When the help of Allah comes, and the victory,', ur: 'جب اللہ کی مدد اور فتح آ جائے،' },
      { w: [['وَرَأَيْتَ', 'wa-ra’ayta', 'and you see', 'اور آپ دیکھ لیں'], ['النَّاسَ', 'n-naasa', 'the people', 'لوگوں کو'], ['يَدْخُلُونَ', 'yadkhuluuna', 'entering', 'داخل ہوتے'], ['فِي', 'fii', 'into', 'میں'], ['دِينِ', 'diini', 'the religion', 'دین'], ['اللَّهِ', 'llaahi', 'of Allah', 'اللہ کے'], ['أَفْوَاجًا', 'afwaajaa', 'in crowds', 'فوج در فوج']],
        en: 'and you see people entering the religion of Allah in crowds,', ur: 'اور آپ لوگوں کو فوج در فوج اللہ کے دین میں داخل ہوتے دیکھ لیں،' },
      { w: [['فَسَبِّحْ', 'fa-sabbiḥ', 'then glorify', 'تو تسبیح کریں'], ['بِحَمْدِ', 'bi-ḥamdi', 'with the praise', 'حمد کے ساتھ'], ['رَبِّكَ', 'rabbika', 'of your Lord', 'اپنے رب کی'], ['وَاسْتَغْفِرْهُ ۚ', 'wa-staghfirhu', 'and ask His forgiveness', 'اور اس سے بخشش مانگیں'], ['إِنَّهُ', 'innahuu', 'indeed He', 'بے شک وہ'], ['كَانَ', 'kaana', 'is ever', 'ہے'], ['تَوَّابًا', 'tawwaabaa', 'accepting of repentance', 'بہت توبہ قبول کرنے والا']],
        en: 'then glorify your Lord with praise and ask His forgiveness. Indeed, He is ever accepting of repentance.', ur: 'تو اپنے رب کی حمد کے ساتھ اس کی تسبیح کریں اور اس سے بخشش مانگیں۔ بے شک وہ بہت توبہ قبول کرنے والا ہے۔' },
    ] },
  { slug: 'al-masad', n: 111, name: 'الْمَسَد', en: 'Al-Masad', ur: 'سورہ مسد', meanEn: 'Twisted Fibre', meanUr: 'بٹی ہوئی رسی',
    introEn: 'Al-Masad, “Twisted Fibre”, also called Al-Lahab, is about Abu Lahab, the Prophet’s uncle who fiercely opposed him, and his wife.',
    introUr: 'سورہ مسد یعنی «بٹی ہوئی رسی»، جسے سورہ لہب بھی کہتے ہیں، ابو لہب اور اس کی بیوی کے بارے میں ہے۔ ابو لہب نبی ﷺ کا چچا ہونے کے باوجود ان کا سخت مخالف تھا۔',
    v: [
      { w: [['تَبَّتْ', 'tabbat', 'Perish', 'ٹوٹ جائیں'], ['يَدَا', 'yadaa', 'the two hands', 'دونوں ہاتھ'], ['أَبِي', 'abii', 'of Abu', 'ابو'], ['لَهَبٍ', 'lahabin', 'Lahab', 'لہب کے'], ['وَتَبَّ', 'wa-tabb', 'and he perished', 'اور وہ ہلاک ہو گیا']],
        en: 'May the hands of Abu Lahab perish, and he has perished.', ur: 'ابو لہب کے دونوں ہاتھ ٹوٹ جائیں، اور وہ ہلاک ہو گیا۔' },
      { w: [['مَا', 'maa', 'did not', 'نہ'], ['أَغْنَىٰ', 'aghnaa', 'help', 'کام آیا'], ['عَنْهُ', 'ʿanhu', 'him', 'اس کے'], ['مَالُهُ', 'maaluhuu', 'his wealth', 'اس کا مال'], ['وَمَا', 'wa-maa', 'and what', 'اور جو'], ['كَسَبَ', 'kasab', 'he earned', 'اس نے کمایا']],
        en: 'His wealth did not help him, nor anything he earned.', ur: 'نہ اس کا مال اس کے کام آیا اور نہ وہ جو اس نے کمایا۔' },
      { w: [['سَيَصْلَىٰ', 'sa-yaṣlaa', 'he will burn', 'وہ عنقریب داخل ہوگا'], ['نَارًا', 'naaran', 'in a fire', 'آگ میں'], ['ذَاتَ', 'dhaata', 'of', 'والی'], ['لَهَبٍ', 'lahab', 'flames', 'شعلوں']],
        en: 'He will burn in a fire of blazing flames,', ur: 'وہ عنقریب شعلوں والی آگ میں داخل ہوگا،' },
      { w: [['وَامْرَأَتُهُ', 'wa-mra’atuhuu', 'and his wife', 'اور اس کی بیوی'], ['حَمَّالَةَ', 'ḥammaalata', 'the carrier', 'اٹھانے والی'], ['الْحَطَبِ', 'l-ḥaṭab', 'of firewood', 'لکڑیاں']],
        en: 'and his wife too, the carrier of firewood,', ur: 'اور اس کی بیوی بھی، جو لکڑیاں اٹھانے والی ہے،' },
      { w: [['فِي', 'fii', 'around', 'میں'], ['جِيدِهَا', 'jiidihaa', 'her neck', 'اس کی گردن'], ['حَبْلٌ', 'ḥablun', 'a rope', 'رسی ہے'], ['مِنْ', 'min', 'of', 'کی'], ['مَسَدٍ', 'masad', 'twisted fibre', 'بٹی ہوئی مونج']],
        en: 'with a rope of twisted fibre around her neck.', ur: 'اس کی گردن میں بٹی ہوئی مونج کی رسی ہے۔' },
    ] },
  { slug: 'al-ikhlas', n: 112, name: 'الْإِخْلَاص', en: 'Al-Ikhlas', ur: 'سورہ اخلاص', meanEn: 'Sincerity', meanUr: 'اخلاص',
    introEn: 'Al-Ikhlas, “Sincerity”, describes Allah in four short verses: One, needing no one, with no child and no equal.',
    introUr: 'سورہ اخلاص چار مختصر آیتوں میں اللہ کی صفات بیان کرتی ہے: وہ ایک ہے، کسی کا محتاج نہیں، نہ اس کی اولاد ہے اور نہ کوئی اس کے برابر ہے۔',
    v: [
      { w: [['قُلْ', 'qul', 'Say', 'کہہ دیجیے'], ['هُوَ', 'huwa', 'He is', 'وہ'], ['اللَّهُ', 'llaahu', 'Allah', 'اللہ'], ['أَحَدٌ', 'aḥad', 'the One', 'ایک ہے']],
        en: 'Say: He is Allah, the One.', ur: 'کہہ دیجیے: وہ اللہ ایک ہے۔' },
      { w: [['اللَّهُ', 'allaahu', 'Allah', 'اللہ'], ['الصَّمَدُ', 'ṣ-ṣamad', 'the Self-Sufficient, on whom all depend', 'بے نیاز، جس کے سب محتاج ہیں']],
        en: 'Allah, the Self-Sufficient, on whom all depend.', ur: 'اللہ بے نیاز ہے، سب اسی کے محتاج ہیں۔' },
      { w: [['لَمْ', 'lam', 'not', 'نہ'], ['يَلِدْ', 'yalid', 'He begets', 'اس نے جنا'], ['وَلَمْ', 'wa-lam', 'and not', 'اور نہ'], ['يُولَدْ', 'yuulad', 'was He born', 'وہ جنا گیا']],
        en: 'He has no child, and He was not born.', ur: 'نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے۔' },
      { w: [['وَلَمْ', 'wa-lam', 'and not', 'اور نہیں'], ['يَكُنْ', 'yakun', 'is', 'ہے'], ['لَهُ', 'lahuu', 'to Him', 'اس کا'], ['كُفُوًا', 'kufuwan', 'equal', 'ہمسر'], ['أَحَدٌ', 'aḥad', 'anyone', 'کوئی']],
        en: 'And there is none equal to Him.', ur: 'اور کوئی اس کا ہمسر نہیں۔' },
    ] },
  { slug: 'al-falaq', n: 113, name: 'الْفَلَق', en: 'Al-Falaq', ur: 'سورہ فلق', meanEn: 'Daybreak', meanUr: 'صبح',
    introEn: 'Al-Falaq, “Daybreak”, and An-Nas are the two surahs of seeking refuge (al-muʿawwidhatayn). Many Muslims recite them in the morning, in the evening and before sleep.',
    introUr: 'سورہ فلق یعنی «صبح» اور سورہ ناس کو معوذتین (پناہ کی دو سورتیں) کہا جاتا ہے۔ بہت سے مسلمان انہیں صبح، شام اور سونے سے پہلے پڑھتے ہیں۔',
    v: [
      { w: [['قُلْ', 'qul', 'Say', 'کہہ دیجیے'], ['أَعُوذُ', 'aʿuudhu', 'I seek refuge', 'میں پناہ مانگتا ہوں'], ['بِرَبِّ', 'bi-rabbi', 'in the Lord', 'رب کی'], ['الْفَلَقِ', 'l-falaq', 'of daybreak', 'صبح کے']],
        en: 'Say: I seek refuge in the Lord of daybreak', ur: 'کہہ دیجیے: میں صبح کے رب کی پناہ مانگتا ہوں' },
      { w: [['مِنْ', 'min', 'from', 'سے'], ['شَرِّ', 'sharri', 'the evil', 'شر'], ['مَا', 'maa', 'of what', 'اس کے جو'], ['خَلَقَ', 'khalaq', 'He created', 'اس نے پیدا کیا']],
        en: 'from the evil of what He has created,', ur: 'ہر اس چیز کے شر سے جو اس نے پیدا کی،' },
      { w: [['وَمِنْ', 'wa-min', 'and from', 'اور سے'], ['شَرِّ', 'sharri', 'the evil', 'شر'], ['غَاسِقٍ', 'ghaasiqin', 'of darkness', 'اندھیری رات کے'], ['إِذَا', 'idhaa', 'when', 'جب'], ['وَقَبَ', 'waqab', 'it settles', 'وہ چھا جائے']],
        en: 'and from the evil of darkness when it settles,', ur: 'اور اندھیری رات کے شر سے جب وہ چھا جائے،' },
      { w: [['وَمِنْ', 'wa-min', 'and from', 'اور سے'], ['شَرِّ', 'sharri', 'the evil', 'شر'], ['النَّفَّاثَاتِ', 'n-naffaathaati', 'of those who blow', 'پھونکنے والیوں کے'], ['فِي', 'fii', 'on', 'میں'], ['الْعُقَدِ', 'l-ʿuqad', 'knots', 'گرہوں']],
        en: 'and from the evil of those who blow on knots,', ur: 'اور گرہوں میں پھونکنے والیوں کے شر سے،' },
      { w: [['وَمِنْ', 'wa-min', 'and from', 'اور سے'], ['شَرِّ', 'sharri', 'the evil', 'شر'], ['حَاسِدٍ', 'ḥaasidin', 'of an envier', 'حسد کرنے والے کے'], ['إِذَا', 'idhaa', 'when', 'جب'], ['حَسَدَ', 'ḥasad', 'he envies', 'وہ حسد کرے']],
        en: 'and from the evil of an envier when he envies.', ur: 'اور حسد کرنے والے کے شر سے جب وہ حسد کرے۔' },
    ] },
  { slug: 'an-nas', n: 114, name: 'النَّاس', en: 'An-Nas', ur: 'سورہ ناس', meanEn: 'Mankind', meanUr: 'انسان',
    introEn: 'An-Nas, “Mankind”, is the last surah of the Quran. It asks Allah for protection from the whisperer who puts evil thoughts into people’s hearts.',
    introUr: 'سورہ ناس یعنی «انسان» قرآن کی آخری سورت ہے۔ اس میں اللہ سے اس وسوسہ ڈالنے والے سے پناہ مانگی گئی ہے جو لوگوں کے دلوں میں برے خیالات ڈالتا ہے۔',
    v: [
      { w: [['قُلْ', 'qul', 'Say', 'کہہ دیجیے'], ['أَعُوذُ', 'aʿuudhu', 'I seek refuge', 'میں پناہ مانگتا ہوں'], ['بِرَبِّ', 'bi-rabbi', 'in the Lord', 'رب کی'], ['النَّاسِ', 'n-naas', 'of mankind', 'لوگوں کے']],
        en: 'Say: I seek refuge in the Lord of mankind,', ur: 'کہہ دیجیے: میں لوگوں کے رب کی پناہ مانگتا ہوں،' },
      { w: [['مَلِكِ', 'maliki', 'the King', 'بادشاہ'], ['النَّاسِ', 'n-naas', 'of mankind', 'لوگوں کے']],
        en: 'the King of mankind,', ur: 'لوگوں کے بادشاہ کی،' },
      { w: [['إِلَٰهِ', 'ilaahi', 'the God', 'معبود'], ['النَّاسِ', 'n-naas', 'of mankind', 'لوگوں کے']],
        en: 'the God of mankind,', ur: 'لوگوں کے معبود کی،' },
      { w: [['مِنْ', 'min', 'from', 'سے'], ['شَرِّ', 'sharri', 'the evil', 'شر'], ['الْوَسْوَاسِ', 'l-waswaasi', 'of the whisperer', 'وسوسہ ڈالنے والے کے'], ['الْخَنَّاسِ', 'l-khannaas', 'who withdraws', 'جو پیچھے ہٹ جاتا ہے']],
        en: 'from the evil of the whisperer who withdraws,', ur: 'وسوسہ ڈالنے والے کے شر سے جو پیچھے ہٹ جاتا ہے،' },
      { w: [['الَّذِي', 'alladhii', 'who', 'جو'], ['يُوَسْوِسُ', 'yuwaswisu', 'whispers', 'وسوسہ ڈالتا ہے'], ['فِي', 'fii', 'into', 'میں'], ['صُدُورِ', 'ṣuduuri', 'the hearts', 'سینوں'], ['النَّاسِ', 'n-naas', 'of people', 'لوگوں کے']],
        en: 'who whispers into the hearts of people,', ur: 'جو لوگوں کے سینوں میں وسوسہ ڈالتا ہے،' },
      { w: [['مِنَ', 'mina', 'from among', 'میں سے'], ['الْجِنَّةِ', 'l-jinnati', 'the jinn', 'جنوں'], ['وَالنَّاسِ', 'wan-naas', 'and people', 'اور انسانوں']],
        en: 'from among the jinn and people.', ur: 'جنوں میں سے بھی اور انسانوں میں سے بھی۔' },
    ] },
];

// Words said in the prayer. Wordings differ slightly between traditions; these are widely used forms.
const PRAYER = [
  { en: 'Takbir', ur: 'تکبیر', whenEn: 'To start the prayer, and at each change of position', whenUr: 'نماز شروع کرتے وقت اور ہر رکن بدلتے وقت',
    a: 'اللَّهُ أَكْبَرُ', tr: 'allaahu akbar', mEn: 'Allah is the Greatest.', mUr: 'اللہ سب سے بڑا ہے۔' },
  { en: 'Opening praise (thanaa’)', ur: 'ثنا', whenEn: 'After the first takbir', whenUr: 'پہلی تکبیر کے بعد',
    a: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَٰهَ غَيْرُكَ', tr: 'subḥaanaka llaahumma wa-biḥamdika, wa-tabaaraka smuka, wa-taʿaalaa jadduka, wa-laa ilaaha ghayruk',
    mEn: 'Glory be to You, O Allah, and praise. Blessed is Your name, high is Your majesty, and there is no god but You.', mUr: 'اے اللہ! تو پاک ہے اور سب تعریف تیری ہے۔ تیرا نام بابرکت ہے، تیری شان بلند ہے اور تیرے سوا کوئی معبود نہیں۔' },
  { en: 'Seeking refuge (taʿawwudh)', ur: 'تعوذ', whenEn: 'Before reciting the Quran', whenUr: 'قرآن پڑھنے سے پہلے',
    a: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', tr: 'aʿuudhu billaahi mina sh-shayṭaani r-rajiim', mEn: 'I seek refuge in Allah from Satan, the rejected.', mUr: 'میں مردود شیطان سے اللہ کی پناہ مانگتا ہوں۔' },
  { en: 'Basmala', ur: 'تسمیہ', whenEn: 'Before Al-Fatiha', whenUr: 'سورہ فاتحہ سے پہلے',
    a: 'BASMALA', tr: 'bismi llaahi r-raḥmaani r-raḥiim', mEn: 'In the name of Allah, the Most Gracious, the Most Merciful.', mUr: 'اللہ کے نام سے جو بڑا مہربان، نہایت رحم والا ہے۔' },
  { en: 'In rukuʿ (bowing)', ur: 'رکوع میں', whenEn: 'While bowing, usually three times', whenUr: 'رکوع میں، عموماً تین بار',
    a: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', tr: 'subḥaana rabbiya l-ʿaẓiim', mEn: 'Glory be to my Lord, the Most Great.', mUr: 'پاک ہے میرا رب جو بڑی عظمت والا ہے۔' },
  { en: 'Rising from rukuʿ', ur: 'رکوع سے اٹھتے ہوئے', whenEn: 'While standing up from bowing', whenUr: 'رکوع سے سیدھے کھڑے ہوتے ہوئے',
    a: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ', tr: 'samiʿa llaahu liman ḥamidah', mEn: 'Allah hears the one who praises Him.', mUr: 'اللہ نے اس کی سن لی جس نے اس کی تعریف کی۔' },
  { en: 'Standing after rukuʿ', ur: 'رکوع کے بعد کھڑے ہو کر', whenEn: 'Once standing straight (also said without {وَ})', whenUr: 'سیدھے کھڑے ہو کر (بغیر {وَ} کے بھی کہا جاتا ہے)',
    a: 'رَبَّنَا وَلَكَ الْحَمْدُ', tr: 'rabbanaa wa-laka l-ḥamd', mEn: 'Our Lord, and to You belongs all praise.', mUr: 'اے ہمارے رب! اور سب تعریف تیرے ہی لیے ہے۔' },
  { en: 'In sujud (prostration)', ur: 'سجدے میں', whenEn: 'In each prostration, usually three times', whenUr: 'ہر سجدے میں، عموماً تین بار',
    a: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', tr: 'subḥaana rabbiya l-aʿlaa', mEn: 'Glory be to my Lord, the Most High.', mUr: 'پاک ہے میرا رب جو سب سے بلند ہے۔' },
  { en: 'Between the two prostrations', ur: 'دو سجدوں کے درمیان', whenEn: 'Sitting between the two prostrations', whenUr: 'دونوں سجدوں کے درمیان بیٹھ کر',
    a: 'رَبِّ اغْفِرْ لِي', tr: 'rabbi ghfir lii', mEn: 'My Lord, forgive me.', mUr: 'اے میرے رب! مجھے بخش دے۔' },
  { en: 'Tashahhud', ur: 'تشہد (التحیات)', whenEn: 'Sitting after the second rakʿah and at the end of the prayer', whenUr: 'دوسری رکعت کے بعد اور نماز کے آخر میں بیٹھ کر',
    a: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    tr: 'at-taḥiyyaatu lillaahi waṣ-ṣalawaatu waṭ-ṭayyibaat, as-salaamu ʿalayka ayyuha n-nabiyyu wa-raḥmatu llaahi wa-barakaatuh, as-salaamu ʿalaynaa wa-ʿalaa ʿibaadi llaahi ṣ-ṣaaliḥiin, ashhadu an laa ilaaha illa llaah, wa-ashhadu anna muḥammadan ʿabduhuu wa-rasuuluh',
    mEn: 'All greetings, prayers and good things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is no god but Allah, and I bear witness that Muhammad is His servant and messenger.',
    mUr: 'تمام آداب، تمام نمازیں اور تمام پاکیزہ باتیں اللہ ہی کے لیے ہیں۔ اے نبی! آپ پر سلام ہو اور اللہ کی رحمت اور اس کی برکتیں۔ ہم پر اور اللہ کے نیک بندوں پر سلام ہو۔ میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، اور میں گواہی دیتا ہوں کہ محمد اس کے بندے اور رسول ہیں۔' },
  { en: 'Durood (prayer for the Prophet ﷺ)', ur: 'درود شریف', whenEn: 'In the last sitting, after the tashahhud', whenUr: 'آخری قعدے میں تشہد کے بعد',
    a: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ. اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    tr: 'allaahumma ṣalli ʿalaa muḥammadin wa-ʿalaa aali muḥammad, kamaa ṣallayta ʿalaa ibraahiima wa-ʿalaa aali ibraahiim, innaka ḥamiidun majiid. allaahumma baarik ʿalaa muḥammadin wa-ʿalaa aali muḥammad, kamaa baarakta ʿalaa ibraahiima wa-ʿalaa aali ibraahiim, innaka ḥamiidun majiid',
    mEn: 'O Allah, send Your grace on Muhammad and on the family of Muhammad, as You sent Your grace on Ibrahim and on the family of Ibrahim; You are Praiseworthy, Glorious. O Allah, bless Muhammad and the family of Muhammad, as You blessed Ibrahim and the family of Ibrahim; You are Praiseworthy, Glorious.',
    mUr: 'اے اللہ! محمد اور آلِ محمد پر رحمت نازل فرما، جیسے تو نے ابراہیم اور آلِ ابراہیم پر رحمت نازل فرمائی، بے شک تو قابلِ تعریف، بزرگی والا ہے۔ اے اللہ! محمد اور آلِ محمد پر برکت نازل فرما، جیسے تو نے ابراہیم اور آلِ ابراہیم پر برکت نازل فرمائی، بے شک تو قابلِ تعریف، بزرگی والا ہے۔' },
  { en: 'Ending the prayer (taslim)', ur: 'سلام', whenEn: 'Turning the head to the right, then to the left', whenUr: 'پہلے دائیں، پھر بائیں طرف منہ پھیرتے ہوئے',
    a: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ', tr: 'as-salaamu ʿalaykum wa-raḥmatu llaah', mEn: 'Peace and the mercy of Allah be upon you.', mUr: 'آپ پر سلامتی اور اللہ کی رحمت ہو۔' },
];

// Common words of the Quran: [Arabic, transliteration, English, Urdu]
const QWORDS = [
  ['اللَّهُ', 'allaah', 'Allah', 'اللہ'],
  ['رَبٌّ', 'rabb', 'Lord', 'رب، پالنے والا'],
  ['إِلَٰهٌ', 'ilaah', 'god, one who is worshipped', 'معبود'],
  ['قَالَ', 'qaala', 'he said', 'اس نے کہا'],
  ['كَانَ', 'kaana', 'he was', 'وہ تھا'],
  ['آمَنُوا', 'aamanuu', 'they believed', 'وہ ایمان لائے'],
  ['كَفَرُوا', 'kafaruu', 'they disbelieved', 'انہوں نے انکار کیا'],
  ['عَمِلُوا', 'ʿamiluu', 'they did', 'انہوں نے عمل کیا'],
  ['يَعْلَمُونَ', 'yaʿlamuun', 'they know', 'وہ جانتے ہیں'],
  ['الَّذِينَ', 'alladhiina', 'those who', 'وہ لوگ جو'],
  ['النَّاسُ', 'an-naas', 'people, mankind', 'لوگ'],
  ['قَوْمٌ', 'qawm', 'a people, a nation', 'قوم'],
  ['نَفْسٌ', 'nafs', 'soul, self', 'جان، نفس'],
  ['قَلْبٌ', 'qalb', 'heart', 'دل'],
  ['رَسُولٌ', 'rasuul', 'messenger', 'رسول، پیغمبر'],
  ['كِتَابٌ', 'kitaab', 'book, scripture', 'کتاب'],
  ['آيَةٌ', 'aaya', 'sign, verse', 'نشانی، آیت'],
  ['يَوْمٌ', 'yawm', 'day', 'دن'],
  ['الْأَرْضُ', 'al-arḍ', 'the earth', 'زمین'],
  ['السَّمَاءُ', 'as-samaa’', 'the sky, heaven', 'آسمان'],
  ['شَيْءٌ', 'shay’', 'thing', 'چیز'],
  ['حَقٌّ', 'ḥaqq', 'truth, right', 'حق، سچ'],
  ['عِلْمٌ', 'ʿilm', 'knowledge', 'علم'],
  ['هُدًى', 'hudan', 'guidance', 'ہدایت'],
  ['رَحْمَةٌ', 'raḥma', 'mercy', 'رحمت'],
  ['عَذَابٌ', 'ʿadhaab', 'punishment', 'عذاب'],
  ['الْجَنَّةُ', 'al-janna', 'Paradise (the Garden)', 'جنت'],
  ['النَّارُ', 'an-naar', 'the Fire', 'آگ، دوزخ'],
  ['الصَّلَاةُ', 'aṣ-ṣalaah', 'prayer', 'نماز'],
  ['الزَّكَاةُ', 'az-zakaah', 'zakat (purifying charity)', 'زکوٰۃ'],
  ['خَيْرٌ', 'khayr', 'good; better', 'بھلائی؛ بہتر'],
  ['الْآخِرَةُ', 'al-aakhira', 'the Hereafter', 'آخرت'],
  ['الدُّنْيَا', 'ad-dunyaa', 'this world', 'دنیا'],
  ['سَبِيلٌ', 'sabiil', 'way, path', 'راستہ'],
  ['غَفُورٌ', 'ghafuur', 'Most Forgiving', 'بہت بخشنے والا'],
  ['رَحِيمٌ', 'raḥiim', 'Most Merciful', 'نہایت رحم والا'],
  ['عَلِيمٌ', 'ʿaliim', 'All-Knowing', 'سب کچھ جاننے والا'],
  ['حَكِيمٌ', 'ḥakiim', 'All-Wise', 'حکمت والا'],
  ['إِنَّ', 'inna', 'indeed, surely', 'بے شک'],
  ['لَا', 'laa', 'no, not', 'نہیں'],
];

// ---------------------------------------------------------------- Saudi Arabic
// [Saudi form, transliteration, English, Urdu, standard Arabic form if different]
const SAUDI = [
  { en: 'Greetings and polite words', ur: 'سلام اور آداب', items: [
    ['هلا والله', 'hala wallaah', 'Hello! (a warm welcome)', 'خوش آمدید! (گرم جوشی سے)', 'أهلًا وسهلًا'],
    ['وش لونك؟', 'wish loonak?', 'How are you? (to a man)', 'آپ کیسے ہیں؟ (مرد سے)', 'كيف حالك؟'],
    ['كيفك؟', 'keefak?', 'How are you? (to a man)', 'کیا حال ہے؟ (مرد سے)', 'كيف حالك؟'],
    ['الحمد لله، تمام', 'al-ḥamdu lillaah, tamaam', 'Fine, thank God', 'الحمد للہ، ٹھیک ہوں', 'الحمد لله، بخير'],
    ['يعطيك العافية', 'yaʿṭiik al-ʿaafya', 'Thanks for your effort (lit. God give you health)', 'اللہ آپ کو صحت دے (کام کرنے والے کا شکریہ)', ''],
    ['الله يعافيك', 'allaah yʿaafiik', 'And you too (the reply)', 'اللہ آپ کو بھی عافیت دے (جواب)', ''],
    ['مشكور', 'mashkuur', 'Thanks', 'شکریہ', 'شكرًا'],
    ['العفو', 'al-ʿafw', 'You’re welcome', 'کوئی بات نہیں', 'عفوًا'],
    ['تفضل', 'tfaḍḍal', 'Please, go ahead / here you are', 'جی، تشریف لائیں / یہ لیجیے', ''],
    ['أبشر', 'abshir', 'Sure, consider it done', 'جی ضرور، ابھی کر دیتا ہوں', ''],
    ['معليش', 'maʿleesh', 'Sorry / never mind', 'معاف کیجیے / کوئی بات نہیں', 'عذرًا'],
    ['مع السلامة', 'maʿa s-salaama', 'Goodbye', 'خدا حافظ', ''],
  ] },
  { en: 'Questions', ur: 'سوال', items: [
    ['وش؟', 'wish?', 'What?', 'کیا؟', 'ماذا؟'],
    ['وين؟', 'wayn?', 'Where?', 'کہاں؟', 'أين؟'],
    ['متى؟', 'mita?', 'When?', 'کب؟', ''],
    ['ليش؟', 'leesh?', 'Why?', 'کیوں؟', 'لماذا؟'],
    ['كم؟', 'kam?', 'How much? How many?', 'کتنا؟ کتنے؟', ''],
    ['مين؟', 'miin?', 'Who?', 'کون؟', 'من؟'],
    ['وش اسمك؟', 'wish ismak?', 'What’s your name? (to a man)', 'آپ کا نام کیا ہے؟ (مرد سے)', 'ما اسمك؟'],
    ['تبي شي؟', 'tibi shay?', 'Do you want anything? (to a man)', 'کچھ چاہیے؟ (مرد سے)', 'هل تريد شيئًا؟'],
  ] },
  { en: 'Taxi and directions', ur: 'ٹیکسی اور راستہ', items: [
    ['ودني … لو سمحت', 'waddinii … law samaḥt', 'Take me to … please', 'مجھے … لے چلیں، مہربانی', 'خذني إلى … من فضلك'],
    ['يمين', 'yamiin', 'Right', 'دائیں', ''],
    ['يسار', 'yasaar', 'Left', 'بائیں', ''],
    ['على طول', 'ʿala ṭuul', 'Straight on', 'سیدھا چلیں', 'إلى الأمام'],
    ['وقف هنا', 'wagif hina', 'Stop here', 'یہاں روک دیں', 'قف هنا'],
    ['بكم المشوار؟', 'bikam al-mishwaar?', 'How much is the ride?', 'کرایہ کتنا ہوگا؟', 'كم الأجرة؟'],
    ['قريب', 'gariib', 'Near', 'قریب', ''],
    ['بعيد', 'baʿiid', 'Far', 'دور', ''],
    ['الإشارة', 'al-ishaara', 'The traffic light', 'سگنل', ''],
  ] },
  { en: 'Shopping', ur: 'خریداری', items: [
    ['بكم هذا؟', 'bikam haadha?', 'How much is this?', 'یہ کتنے کا ہے؟', ''],
    ['غالي', 'ghaali', 'Expensive', 'مہنگا', ''],
    ['فيه خصم؟', 'fiih khaṣm?', 'Is there a discount?', 'کوئی رعایت ہے؟', 'هل يوجد خصم؟'],
    ['أبي هذا', 'abi haadha', 'I want this', 'مجھے یہ چاہیے', 'أريد هذا'],
    ['عندك …؟', 'ʿindak …?', 'Do you have …? (to a man)', 'کیا آپ کے پاس … ہے؟', 'هل عندك …؟'],
    ['كاش ولا شبكة؟', 'kaash walla shabaka?', 'Cash or card?', 'نقد یا کارڈ؟', 'نقدًا أم بالبطاقة؟'],
    ['الفاتورة لو سمحت', 'al-faatuura law samaḥt', 'The receipt, please', 'رسید دے دیں، مہربانی', ''],
  ] },
  { en: 'At work', ur: 'دفتر اور کام', items: [
    ['الدوام', 'ad-dawaam', 'Working hours, the work shift', 'ڈیوٹی کے اوقات', ''],
    ['متى يبدأ الدوام؟', 'mita yibda ad-dawaam?', 'When does work start?', 'ڈیوٹی کب شروع ہوتی ہے؟', ''],
    ['عندنا اجتماع', 'ʿindana jtimaaʿ', 'We have a meeting', 'ہماری میٹنگ ہے', ''],
    ['إجازة', 'ijaaza', 'Leave, holiday', 'چھٹی', ''],
    ['الراتب', 'ar-raatib', 'The salary', 'تنخواہ', ''],
    ['المدير', 'al-mudiir', 'The manager', 'منیجر', ''],
    ['خلصت؟', 'khallaṣt?', 'Have you finished? (to a man)', 'کام ختم کر لیا؟ (مرد سے)', 'هل انتهيت؟'],
    ['الحين', 'al-ḥiin', 'Now', 'ابھی', 'الآن'],
    ['بكرة', 'bukra', 'Tomorrow', 'کل (آنے والا)', 'غدًا'],
  ] },
  { en: 'Food and coffee', ur: 'کھانا اور قہوہ', items: [
    ['قهوة عربية', 'gahwa ʿarabiyya', 'Arabic coffee', 'عربی قہوہ', ''],
    ['شاهي', 'shaahi', 'Tea', 'چائے', 'شاي'],
    ['بدون سكر', 'biduun sukkar', 'Without sugar', 'چینی کے بغیر', ''],
    ['الحساب لو سمحت', 'al-ḥisaab law samaḥt', 'The bill, please', 'بل لے آئیں، مہربانی', ''],
  ] },
  { en: 'At the doctor', ur: 'ڈاکٹر کے پاس', items: [
    ['تعبان', 'taʿbaan', 'I’m tired / unwell (said by a man)', 'میں تھکا ہوا / بیمار ہوں (مرد)', 'أنا متعب'],
    ['عندي صداع', 'ʿindi ṣudaaʿ', 'I have a headache', 'میرے سر میں درد ہے', ''],
    ['وين الصيدلية؟', 'wayn aṣ-ṣaydaliyya?', 'Where is the pharmacy?', 'فارمیسی کہاں ہے؟', 'أين الصيدلية؟'],
    ['أبي موعد', 'abi mawʿid', 'I want an appointment', 'مجھے اپائنٹمنٹ چاہیے', 'أريد موعدًا'],
  ] },
];

// ---------------------------------------------------------------- graded reading
// Original short stories. Each sentence: w = [[Arabic word, English, Urdu], ...], plus transliteration and translations.
const STORIES = [
  { slug: 'in-the-classroom', level: 1, ar: 'فِي الْفَصْلِ', en: 'In the classroom', ur: 'کلاس روم میں', afterEn: 'after lessons 1–4', afterUr: 'سبق ۱ تا ۴ کے بعد',
    s: [
      { w: [['هٰذَا', 'this', 'یہ'], ['فَصْلٌ.', 'a classroom', 'ایک کلاس روم']], tr: 'haadhaa faṣlun.', en: 'This is a classroom.', ur: 'یہ ایک کلاس روم ہے۔' },
      { w: [['فِي', 'in', 'میں'], ['الْفَصْلِ', 'the classroom', 'کلاس روم'], ['مُدَرِّسٌ', 'a teacher', 'ایک استاد'], ['وَطَالِبٌ.', 'and a student', 'اور ایک طالب علم']], tr: 'fil-faṣli mudarrisun wa-ṭaalibun.', en: 'In the classroom there is a teacher and a student.', ur: 'کلاس روم میں ایک استاد اور ایک طالب علم ہیں۔' },
      { w: [['الْمُدَرِّسُ', 'the teacher', 'استاد'], ['مِنْ', 'from', 'سے'], ['مِصْرَ.', 'Egypt', 'مصر']], tr: 'al-mudarrisu min miṣra.', en: 'The teacher is from Egypt.', ur: 'استاد مصر سے ہیں۔' },
      { w: [['وَالطَّالِبُ', 'and the student', 'اور طالب علم'], ['مِنْ', 'from', 'سے'], ['بَاكِسْتَانَ.', 'Pakistan', 'پاکستان']], tr: 'waṭ-ṭaalibu min baakistaana.', en: 'And the student is from Pakistan.', ur: 'اور طالب علم پاکستان سے ہے۔' },
      { w: [['أَيْنَ', 'where', 'کہاں'], ['الْكِتَابُ؟', 'the book', 'کتاب']], tr: 'ayna l-kitaabu?', en: 'Where is the book?', ur: 'کتاب کہاں ہے؟' },
      { w: [['الْكِتَابُ', 'the book', 'کتاب'], ['عَلَى', 'on', 'پر'], ['الْمَكْتَبِ.', 'the desk', 'میز']], tr: 'al-kitaabu ʿala l-maktabi.', en: 'The book is on the desk.', ur: 'کتاب میز پر ہے۔' },
      { w: [['وَالْقَلَمُ', 'and the pen', 'اور قلم'], ['فِي', 'in', 'میں'], ['الْحَقِيبَةِ.', 'the bag', 'بستہ']], tr: 'wal-qalamu fil-ḥaqiibati.', en: 'And the pen is in the bag.', ur: 'اور قلم بستے میں ہے۔' },
    ],
    q: [
      { en: 'Where is the teacher from?', ur: 'استاد کہاں سے ہیں؟', a: 'مِنْ مِصْرَ', aEn: 'From Egypt.', aUr: 'مصر سے۔' },
      { en: 'Where is the pen?', ur: 'قلم کہاں ہے؟', a: 'فِي الْحَقِيبَةِ', aEn: 'In the bag.', aUr: 'بستے میں۔' },
    ] },
  { slug: 'my-family', level: 1, ar: 'عَائِلَتِي', en: 'My family', ur: 'میرا خاندان', afterEn: 'after lessons 1–8', afterUr: 'سبق ۱ تا ۸ کے بعد',
    s: [
      { w: [['اسْمِي', 'my name', 'میرا نام'], ['أَحْمَدُ.', 'Ahmad', 'احمد']], tr: 'ismii aḥmadu.', en: 'My name is Ahmad.', ur: 'میرا نام احمد ہے۔' },
      { w: [['أَنَا', 'I', 'میں'], ['مِنْ', 'from', 'سے'], ['لَاهُورَ.', 'Lahore', 'لاہور']], tr: 'anaa min laahuura.', en: 'I am from Lahore.', ur: 'میں لاہور سے ہوں۔' },
      { w: [['هٰذَا', 'this', 'یہ'], ['أَبِي،', 'my father', 'میرے ابو'], ['هُوَ', 'he', 'وہ'], ['طَبِيبٌ.', 'a doctor', 'ڈاکٹر']], tr: 'haadhaa abii, huwa ṭabiibun.', en: 'This is my father. He is a doctor.', ur: 'یہ میرے ابو ہیں۔ وہ ڈاکٹر ہیں۔' },
      { w: [['وَهٰذِهِ', 'and this', 'اور یہ'], ['أُمِّي،', 'my mother', 'میری امی'], ['هِيَ', 'she', 'وہ'], ['مُدَرِّسَةٌ.', 'a teacher (woman)', 'استانی']], tr: 'wa-haadhihi ummii, hiya mudarrisatun.', en: 'And this is my mother. She is a teacher.', ur: 'اور یہ میری امی ہیں۔ وہ استانی ہیں۔' },
      { w: [['أُخْتِي', 'my sister', 'میری بہن'], ['طَالِبَةٌ', 'a student (woman)', 'طالبہ'], ['فِي', 'at, in', 'میں'], ['الْجَامِعَةِ.', 'the university', 'یونیورسٹی']], tr: 'ukhtii ṭaalibatun fil-jaamiʿati.', en: 'My sister is a student at the university.', ur: 'میری بہن یونیورسٹی میں پڑھتی ہے۔' },
      { w: [['بَيْتُنَا', 'our house', 'ہمارا گھر'], ['كَبِيرٌ', 'big', 'بڑا'], ['وَجَمِيلٌ.', 'and beautiful', 'اور خوبصورت']], tr: 'baytunaa kabiirun wa-jamiilun.', en: 'Our house is big and beautiful.', ur: 'ہمارا گھر بڑا اور خوبصورت ہے۔' },
    ],
    q: [
      { en: 'What is Ahmad’s father’s job?', ur: 'احمد کے ابو کیا کام کرتے ہیں؟', a: 'هُوَ طَبِيبٌ', aEn: 'He is a doctor.', aUr: 'وہ ڈاکٹر ہیں۔' },
      { en: 'Where is Ahmad from?', ur: 'احمد کہاں سے ہے؟', a: 'مِنْ لَاهُورَ', aEn: 'From Lahore.', aUr: 'لاہور سے۔' },
    ] },
  { slug: 'a-day-at-work', level: 2, ar: 'يَوْمٌ فِي الْعَمَلِ', en: 'A day at work', ur: 'دفتر میں ایک دن', afterEn: 'after lesson 11', afterUr: 'سبق ۱۱ کے بعد',
    s: [
      { w: [['ذَهَبْتُ', 'I went', 'میں گیا'], ['إِلَى', 'to', 'کی طرف'], ['الْعَمَلِ', 'work', 'کام'], ['صَبَاحًا.', 'in the morning', 'صبح']], tr: 'dhahabtu ila l-ʿamali ṣabaaḥan.', en: 'I went to work in the morning.', ur: 'میں صبح کام پر گیا۔' },
      { w: [['دَخَلْتُ', 'I went into', 'میں داخل ہوا'], ['الْمَكْتَبَ', 'the office', 'دفتر'], ['وَجَلَسْتُ.', 'and I sat down', 'اور میں بیٹھ گیا']], tr: 'dakhaltu l-maktaba wa-jalastu.', en: 'I went into the office and sat down.', ur: 'میں دفتر میں داخل ہوا اور بیٹھ گیا۔' },
      { w: [['شَرِبْتُ', 'I drank', 'میں نے پیا'], ['الْقَهْوَةَ', 'the coffee', 'قہوہ'], ['مَعَ', 'with', 'کے ساتھ'], ['زَمِيلِي.', 'my colleague', 'میرا ساتھی']], tr: 'sharibtu l-qahwata maʿa zamiilii.', en: 'I drank coffee with my colleague.', ur: 'میں نے اپنے ساتھی کے ساتھ قہوہ پیا۔' },
      { w: [['كَتَبْنَا', 'we wrote', 'ہم نے لکھا'], ['تَقْرِيرًا', 'a report', 'ایک رپورٹ'], ['طَوِيلًا.', 'long', 'لمبی']], tr: 'katabnaa taqriiran ṭawiilan.', en: 'We wrote a long report.', ur: 'ہم نے ایک لمبی رپورٹ لکھی۔' },
      { w: [['ثُمَّ', 'then', 'پھر'], ['ذَهَبْنَا', 'we went', 'ہم گئے'], ['إِلَى', 'to', 'کی طرف'], ['الِاجْتِمَاعِ.', 'the meeting', 'میٹنگ']], tr: 'thumma dhahabnaa ila l-ijtimaaʿi.', en: 'Then we went to the meeting.', ur: 'پھر ہم میٹنگ میں گئے۔' },
      { w: [['خَرَجْتُ', 'I left', 'میں نکلا'], ['مِنَ', 'from', 'سے'], ['الْعَمَلِ', 'work', 'کام'], ['مَسَاءً.', 'in the evening', 'شام کو']], tr: 'kharajtu mina l-ʿamali masaa’an.', en: 'I left work in the evening.', ur: 'میں شام کو کام سے نکلا۔' },
    ],
    q: [
      { en: 'What did he drink, and who with?', ur: 'اس نے کیا پیا، اور کس کے ساتھ؟', a: 'الْقَهْوَةَ مَعَ زَمِيلِهِ', aEn: 'Coffee, with his colleague.', aUr: 'اپنے ساتھی کے ساتھ قہوہ۔' },
      { en: 'When did he leave work?', ur: 'وہ کام سے کب نکلا؟', a: 'مَسَاءً', aEn: 'In the evening.', aUr: 'شام کو۔' },
    ] },
  { slug: 'at-the-market', level: 2, ar: 'فِي السُّوقِ', en: 'At the market', ur: 'بازار میں', afterEn: 'after lesson 12', afterUr: 'سبق ۱۲ کے بعد',
    s: [
      { w: [['أَذْهَبُ', 'I go', 'میں جاتا ہوں'], ['إِلَى', 'to', 'کی طرف'], ['السُّوقِ', 'the market', 'بازار'], ['يَوْمَ', 'on the day of', 'کے دن'], ['الْجُمُعَةِ.', 'Friday', 'جمعہ']], tr: 'adh-habu ila s-suuqi yawma l-jumuʿati.', en: 'I go to the market on Fridays.', ur: 'میں جمعے کے دن بازار جاتا ہوں۔' },
      { w: [['أَشْتَرِي', 'I buy', 'میں خریدتا ہوں'], ['الْخُبْزَ', 'bread', 'روٹی'], ['وَالْفَاكِهَةَ.', 'and fruit', 'اور پھل']], tr: 'ashtarii l-khubza wal-faakihata.', en: 'I buy bread and fruit.', ur: 'میں روٹی اور پھل خریدتا ہوں۔' },
      { w: [['أَسْأَلُ', 'I ask', 'میں پوچھتا ہوں'], ['الْبَائِعَ:', 'the seller', 'دکاندار'], ['بِكَمْ', 'for how much', 'کتنے کا'], ['هٰذَا؟', 'this', 'یہ']], tr: 'as’alu l-baa’iʿa: bikam haadhaa?', en: 'I ask the seller, “How much is this?”', ur: 'میں دکاندار سے پوچھتا ہوں: «یہ کتنے کا ہے؟»' },
      { w: [['يَقُولُ:', 'he says', 'وہ کہتا ہے'], ['بِعَشَرَةِ', 'for ten', 'دس کا'], ['رِيَالَاتٍ.', 'riyals', 'ریال']], tr: 'yaquulu: bi-ʿasharati riyaalaatin.', en: 'He says, “Ten riyals.”', ur: 'وہ کہتا ہے: «دس ریال کا۔»' },
      { w: [['أَقُولُ:', 'I say', 'میں کہتا ہوں'], ['هٰذَا', 'this', 'یہ'], ['غَالٍ!', 'expensive', 'مہنگا']], tr: 'aquulu: haadhaa ghaalin!', en: 'I say, “That’s expensive!”', ur: 'میں کہتا ہوں: «یہ تو مہنگا ہے!»' },
      { w: [['يَضْحَكُ', 'laughs', 'ہنستا ہے'], ['الْبَائِعُ', 'the seller', 'دکاندار'], ['وَيَقُولُ:', 'and says', 'اور کہتا ہے'], ['بِثَمَانِيَةٍ.', 'for eight', 'آٹھ کا']], tr: 'yaḍḥaku l-baa’iʿu wa-yaquulu: bi-thamaaniyatin.', en: 'The seller laughs and says, “Eight, then.”', ur: 'دکاندار ہنس کر کہتا ہے: «چلیں، آٹھ کا۔»' },
    ],
    q: [
      { en: 'When does he go to the market?', ur: 'وہ بازار کب جاتا ہے؟', a: 'يَوْمَ الْجُمُعَةِ', aEn: 'On Fridays.', aUr: 'جمعے کے دن۔' },
      { en: 'What price did they agree on?', ur: 'آخر میں کتنی قیمت طے ہوئی؟', a: 'ثَمَانِيَةُ رِيَالَاتٍ', aEn: 'Eight riyals.', aUr: 'آٹھ ریال۔' },
    ] },
  { slug: 'at-the-doctor', level: 3, ar: 'عِنْدَ الطَّبِيبِ', en: 'At the doctor', ur: 'ڈاکٹر کے پاس', afterEn: 'after lessons 13–19', afterUr: 'سبق ۱۳ تا ۱۹ کے بعد',
    s: [
      { w: [['ذَهَبْتُ', 'I went', 'میں گیا'], ['إِلَى', 'to', 'کے پاس'], ['الطَّبِيبِ', 'the doctor', 'ڈاکٹر'], ['الْيَوْمَ.', 'today', 'آج']], tr: 'dhahabtu ila ṭ-ṭabiibi l-yawma.', en: 'I went to the doctor today.', ur: 'میں آج ڈاکٹر کے پاس گیا۔' },
      { w: [['قَالَ', 'said', 'کہا'], ['الطَّبِيبُ:', 'the doctor', 'ڈاکٹر نے'], ['مَاذَا', 'what', 'کیا'], ['بِكَ؟', 'with you', 'آپ کو']], tr: 'qaala ṭ-ṭabiibu: maadhaa bika?', en: 'The doctor said, “What’s wrong?”', ur: 'ڈاکٹر نے کہا: «آپ کو کیا تکلیف ہے؟»' },
      { w: [['قُلْتُ:', 'I said', 'میں نے کہا'], ['عِنْدِي', 'I have', 'مجھے ہے'], ['صُدَاعٌ،', 'a headache', 'سر درد'], ['وَلَمْ', 'and did not', 'اور نہیں'], ['أَنَمْ', 'I sleep', 'میں سویا'], ['جَيِّدًا.', 'well', 'ٹھیک سے']], tr: 'qultu: ʿindii ṣudaaʿun, wa-lam anam jayyidan.', en: 'I said, “I have a headache, and I didn’t sleep well.”', ur: 'میں نے کہا: «میرے سر میں درد ہے، اور میں ٹھیک سے نہیں سویا۔»' },
      { w: [['هَلْ', '(question word)', 'کیا'], ['عِنْدَكَ', 'you have', 'آپ کو'], ['حُمًّى؟', 'a fever', 'بخار']], tr: 'hal ʿindaka ḥummaa?', en: '“Do you have a fever?”', ur: '«کیا آپ کو بخار ہے؟»' },
      { w: [['لَا،', 'no', 'نہیں'], ['لَيْسَ', 'there is not', 'نہیں ہے'], ['عِنْدِي', 'I have', 'مجھے'], ['حُمًّى.', 'a fever', 'بخار']], tr: 'laa, laysa ʿindii ḥummaa.', en: '“No, I don’t have a fever.”', ur: '«نہیں، مجھے بخار نہیں ہے۔»' },
      { w: [['اِشْرَبْ', 'drink', 'پئیں'], ['مَاءً', 'water', 'پانی'], ['كَثِيرًا', 'a lot', 'بہت سا'], ['وَنَمْ', 'and sleep', 'اور سوئیں'], ['مُبَكِّرًا.', 'early', 'جلدی']], tr: 'ishrab maa’an kathiiran wa-nam mubakkiran.', en: '“Drink plenty of water and go to sleep early.”', ur: '«بہت سا پانی پئیں اور جلدی سوئیں۔»' },
      { w: [['سَتَكُونُ', 'you will be', 'آپ ہو جائیں گے'], ['بِخَيْرٍ', 'well', 'ٹھیک'], ['إِنْ', 'if', 'اگر'], ['شَاءَ', 'wills', 'چاہا'], ['اللَّهُ.', 'Allah', 'اللہ نے']], tr: 'sa-takuunu bi-khayrin in shaa’a llaah.', en: '“You will be well, God willing.”', ur: '«ان شاء اللہ آپ ٹھیک ہو جائیں گے۔»' },
    ],
    q: [
      { en: 'What was wrong with him?', ur: 'اسے کیا تکلیف تھی؟', a: 'عِنْدَهُ صُدَاعٌ', aEn: 'He had a headache and hadn’t slept well.', aUr: 'سر میں درد تھا اور وہ ٹھیک سے نہیں سویا تھا۔' },
      { en: 'What did the doctor tell him to do?', ur: 'ڈاکٹر نے اسے کیا کرنے کو کہا؟', a: 'اِشْرَبْ مَاءً كَثِيرًا وَنَمْ مُبَكِّرًا', aEn: 'Drink plenty of water and sleep early.', aUr: 'بہت سا پانی پیے اور جلدی سوئے۔' },
    ] },
  { slug: 'a-trip-to-makkah', level: 3, ar: 'رِحْلَةٌ إِلَى مَكَّةَ', en: 'A trip to Makkah', ur: 'مکہ کا سفر', afterEn: 'after lessons 18–24', afterUr: 'سبق ۱۸ تا ۲۴ کے بعد',
    s: [
      { w: [['سَنُسَافِرُ', 'we will travel', 'ہم سفر کریں گے'], ['إِلَى', 'to', 'کی طرف'], ['مَكَّةَ', 'Makkah', 'مکہ'], ['يَوْمَ', 'on the day of', 'کے دن'], ['الْخَمِيسِ.', 'Thursday', 'جمعرات']], tr: 'sa-nusaafiru ilaa makkata yawma l-khamiisi.', en: 'We will travel to Makkah on Thursday.', ur: 'ہم جمعرات کو مکہ کا سفر کریں گے۔' },
      { w: [['سَنَخْرُجُ', 'we will leave', 'ہم نکلیں گے'], ['مِنَ', 'from', 'سے'], ['الْبَيْتِ', 'the house', 'گھر'], ['فِي', 'at', 'پر'], ['السَّاعَةِ', 'the hour', 'بجے'], ['السَّادِسَةِ', 'sixth', 'چھ'], ['صَبَاحًا.', 'in the morning', 'صبح']], tr: 'sa-nakhruju mina l-bayti fis-saaʿati s-saadisati ṣabaaḥan.', en: 'We will leave home at six in the morning.', ur: 'ہم صبح چھ بجے گھر سے نکلیں گے۔' },
      { w: [['سَأَلَنِي', 'asked me', 'مجھ سے پوچھا'], ['ابْنِي:', 'my son', 'میرے بیٹے نے'], ['كَمْ', 'how many', 'کتنے'], ['سَاعَةً', 'hours', 'گھنٹے'], ['سَنُسَافِرُ؟', 'will we travel', 'ہم سفر کریں گے']], tr: 'sa’alanii bnii: kam saaʿatan sa-nusaafiru?', en: 'My son asked me, “How many hours will we travel?”', ur: 'میرے بیٹے نے مجھ سے پوچھا: «ہم کتنے گھنٹے سفر کریں گے؟»' },
      { w: [['قُلْتُ:', 'I said', 'میں نے کہا'], ['الطَّرِيقُ', 'the road', 'راستہ'], ['طَوِيلٌ،', 'is long', 'لمبا ہے'], ['لٰكِنَّنَا', 'but we', 'لیکن ہم'], ['سَنَصِلُ', 'will arrive', 'پہنچ جائیں گے'], ['قَبْلَ', 'before', 'سے پہلے'], ['الْعَصْرِ.', 'Asr (afternoon prayer)', 'عصر']], tr: 'qultu: aṭ-ṭariiqu ṭawiilun, laakinnanaa sa-naṣilu qabla l-ʿaṣri.', en: 'I said, “The road is long, but we will arrive before Asr.”', ur: 'میں نے کہا: «راستہ لمبا ہے، لیکن ہم عصر سے پہلے پہنچ جائیں گے۔»' },
      { w: [['سَأَلَتْ', 'asked', 'پوچھا'], ['بِنْتِي:', 'my daughter', 'میری بیٹی نے'], ['لِمَاذَا', 'why', 'کیوں'], ['نَذْهَبُ', 'are we going', 'ہم جا رہے ہیں'], ['إِلَى', 'to', 'کی طرف'], ['مَكَّةَ؟', 'Makkah', 'مکہ']], tr: 'sa’alat bintii: limaadhaa nadh-habu ilaa makkata?', en: 'My daughter asked, “Why are we going to Makkah?”', ur: 'میری بیٹی نے پوچھا: «ہم مکہ کیوں جا رہے ہیں؟»' },
      { w: [['قُلْتُ:', 'I said', 'میں نے کہا'], ['لِأَنَّنَا', 'because we', 'کیونکہ ہم'], ['سَنَعْتَمِرُ،', 'will perform umrah', 'عمرہ کریں گے'], ['إِنْ', 'if', 'اگر'], ['شَاءَ', 'wills', 'چاہا'], ['اللَّهُ.', 'Allah', 'اللہ نے']], tr: 'qultu: li-annanaa sa-naʿtamiru, in shaa’a llaah.', en: 'I said, “Because we will perform umrah, God willing.”', ur: 'میں نے کہا: «کیونکہ ان شاء اللہ ہم عمرہ کریں گے۔»' },
    ],
    q: [
      { en: 'When will they travel?', ur: 'وہ کب سفر کریں گے؟', a: 'يَوْمَ الْخَمِيسِ', aEn: 'On Thursday.', aUr: 'جمعرات کو۔' },
      { en: 'Why are they going to Makkah?', ur: 'وہ مکہ کیوں جا رہے ہیں؟', a: 'لِأَنَّهُمْ سَيَعْتَمِرُونَ', aEn: 'To perform umrah.', aUr: 'عمرہ کرنے کے لیے۔' },
    ] },
];

// ---------------------------------------------------------------- level test
// Letter questions use letter slugs; the others give options in Arabic or in both languages. The first option is the answer.
const LEVEL_QS = [
  { type: 'letter', big: 'baa', opts: ['baa', 'taa', 'thaa', 'noon'] },
  { type: 'letter', big: 'ayn', opts: ['ayn', 'ghayn', 'haa', 'jeem'] },
  { pEn: 'How do you read this word?', pUr: 'یہ لفظ کیسے پڑھیں گے؟', big: 'بَاب', latin: ['baab', 'naab', 'taab', 'baat'] },
  { pEn: 'What does this mean?', pUr: 'اس کا مطلب کیا ہے؟', big: 'هٰذَا كِتَابٌ', en: ['This is a book.', 'That is a pen.', 'Where is the book?', 'The book is big.'], ur: ['یہ کتاب ہے۔', 'وہ قلم ہے۔', 'کتاب کہاں ہے؟', 'کتاب بڑی ہے۔'] },
  { pEn: 'Which word means “this” before a feminine noun such as {سَيَّارَةٌ}?', pUr: '{سَيَّارَةٌ} جیسے مؤنث اسم سے پہلے «یہ» کے لیے کون سا لفظ آئے گا؟', ar: ['هٰذِهِ', 'هٰذَا', 'ذٰلِكَ', 'هُوَ'] },
  { pEn: 'What does this mean?', pUr: 'اس کا مطلب کیا ہے؟', big: 'الْقَلَمُ عَلَى الْمَكْتَبِ', en: ['The pen is on the desk.', 'The pen is in the bag.', 'The book is on the desk.', 'Where is the pen?'], ur: ['قلم میز پر ہے۔', 'قلم بستے میں ہے۔', 'کتاب میز پر ہے۔', 'قلم کہاں ہے؟'] },
  { pEn: 'How do you say “my house”?', pUr: '«میرا گھر» عربی میں کیسے کہیں گے؟', ar: ['بَيْتِي', 'بَيْتُكَ', 'بَيْتُهُ', 'الْبَيْتُ'] },
  { pEn: 'Which one means “The house is big”?', pUr: '«گھر بڑا ہے» کس کا مطلب ہے؟', ar: ['الْبَيْتُ كَبِيرٌ', 'الْبَيْتُ الْكَبِيرُ', 'بَيْتٌ كَبِيرٌ', 'بُيُوتٌ كَبِيرَةٌ'] },
  { pEn: 'What does this mean?', pUr: 'اس کا مطلب کیا ہے؟', big: 'ذَهَبْتُ إِلَى السُّوقِ', en: ['I went to the market.', 'I go to the market.', 'She went to the market.', 'We went to the market.'], ur: ['میں بازار گیا۔', 'میں بازار جاتا ہوں۔', 'وہ (خاتون) بازار گئی۔', 'ہم بازار گئے۔'] },
  { pEn: 'How do you say “We don’t understand”?', pUr: '«ہم نہیں سمجھتے» عربی میں کیسے کہیں گے؟', ar: ['لَا نَفْهَمُ', 'لَا أَفْهَمُ', 'لَا يَفْهَمُ', 'فَهِمْنَا'] },
];

// ---------------------------------------------------------------- grammar lessons
// Order inspired by classic courses for non-Arabic speakers such as the Madinah books.
// All explanations and example sentences here are original.
const LESSONS = [
  {
    slug: 'lesson-1-this-is', key: 'هٰذَا', video: 'lesson-1-this-is.mp4',
    en: {
      title: 'This is… and your first questions', short: 'Your first sentence. What is this? Who is this?',
      intro: 'Your first Arabic sentence needs no verb. To say “This is a book”, put {هٰذَا} (haadhaa, this) before a noun: {هٰذَا كِتَابٌ}. There is no word for “is” in sentences like this, and no word for “a”: the ending -un on {كِتَابٌ} already means “a book”.',
      points: [
        'Ask about things with {مَا هٰذَا؟} (maa haadhaa?, What is this?) and about people with {مَنْ هٰذَا؟} (man haadhaa?, Who is this?).',
        'Turn a sentence into a yes/no question by putting {أَ} (a-) in front: {أَهٰذَا بَيْتٌ؟} (a-haadhaa baytun?) means “Is this a house?”',
        'Answer with {نَعَمْ} (naʿam, yes) or {لَا} (laa, no).',
      ],
    },
    ur: {
      title: 'یہ… اور پہلے سوال', short: 'پہلا جملہ۔ یہ کیا ہے؟ یہ کون ہے؟',
      intro: 'عربی کا پہلا جملہ بغیر فعل کے بنتا ہے۔ «یہ کتاب ہے» کہنے کے لیے اسم سے پہلے {هٰذَا} (یہ) لگائیں: {هٰذَا كِتَابٌ}۔ ایسے جملوں میں «ہے» کے لیے کوئی لفظ نہیں ہوتا، اور «ایک» کے لیے بھی نہیں: {كِتَابٌ} کے آخر کی تنوین ہی «ایک کتاب» کا مطلب دیتی ہے۔',
      points: [
        'چیزوں کے بارے میں {مَا هٰذَا؟} (یہ کیا ہے؟) اور لوگوں کے بارے میں {مَنْ هٰذَا؟} (یہ کون ہے؟) سے پوچھیں۔',
        'کسی جملے کو ہاں یا نہیں والا سوال بنانے کے لیے شروع میں {أَ} لگائیں: {أَهٰذَا بَيْتٌ؟} یعنی «کیا یہ گھر ہے؟»',
        'جواب میں {نَعَمْ} (جی ہاں) یا {لَا} (نہیں) کہیں۔',
      ],
    },
    ex: [
      ['هٰذَا كِتَابٌ', 'haadhaa kitaabun', 'This is a book', 'یہ کتاب ہے'],
      ['هٰذَا قَلَمٌ', 'haadhaa qalamun', 'This is a pen', 'یہ قلم ہے'],
      ['مَا هٰذَا؟', 'maa haadhaa?', 'What is this?', 'یہ کیا ہے؟'],
      ['هٰذَا بَابٌ', 'haadhaa baabun', 'This is a door', 'یہ دروازہ ہے'],
      ['مَنْ هٰذَا؟', 'man haadhaa?', 'Who is this?', 'یہ کون ہے؟'],
      ['هٰذَا طَالِبٌ', 'haadhaa ṭaalibun', 'This is a student', 'یہ طالب علم ہے'],
      ['أَهٰذَا بَيْتٌ؟', 'a-haadhaa baytun?', 'Is this a house?', 'کیا یہ گھر ہے؟'],
      ['نَعَمْ، هٰذَا بَيْتٌ', 'naʿam, haadhaa baytun', 'Yes, this is a house', 'جی ہاں، یہ گھر ہے'],
      ['لَا، هٰذَا مَسْجِدٌ', 'laa, haadhaa masjidun', 'No, this is a mosque', 'نہیں، یہ مسجد ہے'],
    ],
    practice: [
      { en: 'How do you say “This is a key”? (key: {مِفْتَاحٌ})', ur: '«یہ چابی ہے» کیسے کہیں گے؟ (چابی: {مِفْتَاحٌ})', a: 'هٰذَا مِفْتَاحٌ', tr: 'haadhaa miftaaḥun' },
      { en: 'Ask “Who is this?”', ur: '«یہ کون ہے؟» پوچھیں۔', a: 'مَنْ هٰذَا؟', tr: 'man haadhaa?' },
      { en: 'Answer {أَهٰذَا قَلَمٌ؟} with “No, this is a book.”', ur: '{أَهٰذَا قَلَمٌ؟} کا جواب دیں: «نہیں، یہ کتاب ہے۔»', a: 'لَا، هٰذَا كِتَابٌ', tr: 'laa, haadhaa kitaabun' },
    ],
  },
  {
    slug: 'lesson-2-that-is', key: 'ذٰلِكَ', video: 'lesson-2-that-is.mp4',
    en: {
      title: 'That is…: near and far', short: 'Point to things near you and further away.',
      intro: 'Use {هٰذَا} for something near you and {ذٰلِكَ} (dhaalika, that) for something further away. The sentence pattern stays the same: {ذٰلِكَ نَجْمٌ}, “That is a star”.',
      points: [
        'Near: {هٰذَا}. Far: {ذٰلِكَ}.',
        'Questions work the same way: {مَا ذٰلِكَ؟} (What is that?) and {مَنْ ذٰلِكَ؟} (Who is that?).',
        'Both words are for masculine nouns. The feminine forms come in Lesson 5.',
      ],
    },
    ur: {
      title: 'وہ…: قریب اور دور', short: 'قریب اور دور کی چیزوں کی طرف اشارہ۔',
      intro: 'قریب کی چیز کے لیے {هٰذَا} اور دور کی چیز کے لیے {ذٰلِكَ} (وہ) استعمال کریں۔ جملے کی ترتیب وہی رہتی ہے: {ذٰلِكَ نَجْمٌ} یعنی «وہ ستارہ ہے»۔',
      points: [
        'قریب: {هٰذَا}۔ دور: {ذٰلِكَ}۔',
        'سوال بھی اسی طرح بنتے ہیں: {مَا ذٰلِكَ؟} (وہ کیا ہے؟) اور {مَنْ ذٰلِكَ؟} (وہ کون ہے؟)۔',
        'یہ دونوں الفاظ مذکر اسموں کے لیے ہیں۔ مؤنث شکلیں سبق ۵ میں آئیں گی۔',
      ],
    },
    ex: [
      ['ذٰلِكَ بَيْتٌ', 'dhaalika baytun', 'That is a house', 'وہ گھر ہے'],
      ['ذٰلِكَ نَجْمٌ', 'dhaalika najmun', 'That is a star', 'وہ ستارہ ہے'],
      ['هٰذَا قَمِيصٌ', 'haadhaa qamiiṣun', 'This is a shirt', 'یہ قمیص ہے'],
      ['مَا ذٰلِكَ؟', 'maa dhaalika?', 'What is that?', 'وہ کیا ہے؟'],
      ['ذٰلِكَ جَبَلٌ', 'dhaalika jabalun', 'That is a mountain', 'وہ پہاڑ ہے'],
      ['مَنْ ذٰلِكَ؟', 'man dhaalika?', 'Who is that?', 'وہ کون ہے؟'],
      ['ذٰلِكَ إِمَامٌ', 'dhaalika imaamun', 'That is an imam', 'وہ امام ہیں'],
      ['أَذٰلِكَ مَسْجِدٌ؟', 'a-dhaalika masjidun?', 'Is that a mosque?', 'کیا وہ مسجد ہے؟'],
    ],
    practice: [
      { en: 'Say “That is a mountain”.', ur: '«وہ پہاڑ ہے» کہیں۔', a: 'ذٰلِكَ جَبَلٌ', tr: 'dhaalika jabalun' },
      { en: 'Ask “What is that?”', ur: '«وہ کیا ہے؟» پوچھیں۔', a: 'مَا ذٰلِكَ؟', tr: 'maa dhaalika?' },
      { en: 'Near or far: {هٰذَا نَجْمٌ}?', ur: 'قریب یا دور: {هٰذَا نَجْمٌ}؟', a: 'هٰذَا', tr: 'haadhaa', noteEn: 'Near. For a star far away, you would say {ذٰلِكَ نَجْمٌ}.', noteUr: 'قریب۔ دور کے ستارے کے لیے {ذٰلِكَ نَجْمٌ} کہیں گے۔' },
    ],
  },
  {
    slug: 'lesson-3-the', key: 'الـ',
    en: {
      title: 'The (al-) and describing things', short: 'Make nouns definite and describe them. Sun and moon letters.',
      intro: 'Add {الـ} (al-) to the front of a noun to make it definite: {كِتَابٌ} (a book) becomes {الْكِتَابُ} (the book), and the -un ending shortens to -u. Put a describing word after a definite noun and you have a full sentence: {الْكِتَابُ جَدِيدٌ}, “The book is new”.',
      points: [
        'Definite noun + description = sentence: {الْبَيْتُ كَبِيرٌ} (The house is big). Again, there is no word for “is”.',
        'Sun letters: before {ت ث د ذ ر ز س ش ص ض ط ظ ل ن} the l of al- is silent and the next letter is doubled: {الشَّمْسُ} is ash-shamsu, not al-shamsu.',
        'Moon letters: before all the other letters you hear the l clearly: {الْقَمَرُ}, al-qamaru.',
      ],
    },
    ur: {
      title: 'الـ (معرفہ) اور صفت', short: 'اسم کو معرفہ بنائیں اور صفت لگائیں۔ حروفِ شمسیہ و قمریہ۔',
      intro: 'اسم کے شروع میں {الـ} لگانے سے وہ معرفہ (خاص) بن جاتا ہے: {كِتَابٌ} (کوئی کتاب) سے {الْكِتَابُ} (وہ کتاب)، اور آخر کی تنوین صرف پیش رہ جاتی ہے۔ معرفہ اسم کے بعد صفت لگائیں تو پورا جملہ بن جاتا ہے: {الْكِتَابُ جَدِيدٌ} یعنی «کتاب نئی ہے»۔',
      points: [
        'معرفہ اسم + صفت = جملہ: {الْبَيْتُ كَبِيرٌ} (گھر بڑا ہے)۔ یہاں بھی «ہے» کا کوئی لفظ نہیں۔',
        'حروفِ شمسیہ: {ت ث د ذ ر ز س ش ص ض ط ظ ل ن} سے پہلے الـ کا لام نہیں پڑھا جاتا اور اگلے حرف پر تشدید آ جاتی ہے: {الشَّمْسُ} کو «اش شمس» پڑھیں، «ال شمس» نہیں۔',
        'حروفِ قمریہ: باقی حروف سے پہلے لام صاف پڑھا جاتا ہے: {الْقَمَرُ}۔ قرآن مجید پڑھنے والے یہ قاعدہ پہلے سے جانتے ہیں۔',
      ],
    },
    ex: [
      ['الْكِتَابُ جَدِيدٌ', 'al-kitaabu jadiidun', 'The book is new', 'کتاب نئی ہے'],
      ['الْبَيْتُ كَبِيرٌ', 'al-baytu kabiirun', 'The house is big', 'گھر بڑا ہے'],
      ['الْقَلَمُ قَدِيمٌ', 'al-qalamu qadiimun', 'The pen is old', 'قلم پرانا ہے'],
      ['الْوَلَدُ صَغِيرٌ', 'al-waladu ṣaghiirun', 'The boy is small', 'لڑکا چھوٹا ہے'],
      ['الْقَمَرُ جَمِيلٌ', 'al-qamaru jamiilun', 'The moon is beautiful', 'چاند خوبصورت ہے'],
      ['الْمَاءُ بَارِدٌ', 'al-maa’u baaridun', 'The water is cold', 'پانی ٹھنڈا ہے'],
      ['الشَّمْسُ', 'ash-shamsu', 'the sun (sun letter: no l sound)', 'سورج (حرفِ شمسی: لام نہیں پڑھا جاتا)'],
      ['الرَّجُلُ', 'ar-rajulu', 'the man (sun letter)', 'آدمی (حرفِ شمسی)'],
    ],
    practice: [
      { en: 'Make it definite: {بَيْتٌ}', ur: 'معرفہ بنائیں: {بَيْتٌ}', a: 'الْبَيْتُ', tr: 'al-baytu' },
      { en: 'Sun or moon letter: {الْقَلَمُ}?', ur: 'شمسی یا قمری: {الْقَلَمُ}؟', a: 'الْقَلَمُ', tr: 'al-qalamu', noteEn: 'Moon letter: you hear the l.', noteUr: 'حرفِ قمری: لام صاف پڑھا جاتا ہے۔' },
      { en: 'Say “The house is big”.', ur: '«گھر بڑا ہے» کہیں۔', a: 'الْبَيْتُ كَبِيرٌ', tr: 'al-baytu kabiirun' },
    ],
  },
  {
    slug: 'lesson-4-where', key: 'أَيْنَ',
    en: {
      title: 'Where? In, on, from, to', short: 'Ask where things are and answer with prepositions.',
      intro: 'Ask {أَيْنَ؟} (ayna, where?) and answer with a preposition. After {فِي} (in), {عَلَى} (on), {مِنْ} (from) and {إِلَى} (to), the end of the noun changes from -u to -i: {الْبَيْتُ} becomes {فِي الْبَيْتِ} (in the house).',
      points: [
        '{أَيْنَ الْكِتَابُ؟} Where is the book? {الْكِتَابُ عَلَى الْمَكْتَبِ} The book is on the desk.',
        'This -i ending is called jarr. You will hear it in every Arabic sentence with a preposition.',
        'When al- comes after a vowel, its a- is not pronounced: {فِي الْبَيْتِ} is said fil-bayti.',
      ],
    },
    ur: {
      title: 'کہاں؟ میں، پر، سے، کی طرف', short: 'پوچھیں چیز کہاں ہے اور حروفِ جر سے جواب دیں۔',
      intro: '{أَيْنَ؟} (کہاں؟) سے پوچھیں اور حرفِ جر سے جواب دیں۔ {فِي} (میں)، {عَلَى} (پر)، {مِنْ} (سے) اور {إِلَى} (کی طرف) کے بعد اسم کے آخر کا پیش زیر میں بدل جاتا ہے: {الْبَيْتُ} سے {فِي الْبَيْتِ} (گھر میں)۔',
      points: [
        '{أَيْنَ الْكِتَابُ؟} کتاب کہاں ہے؟ {الْكِتَابُ عَلَى الْمَكْتَبِ} کتاب میز پر ہے۔',
        'حرفِ جر کے بعد آنے والی اس زیر کو «جر» کہتے ہیں۔ یہ ہر ایسے جملے میں سنائی دیتی ہے۔',
        'اگر الـ سے پہلے والا لفظ حرکت پر ختم ہو تو الـ کا الف نہیں پڑھا جاتا: {فِي الْبَيْتِ} کو «فِل بیتِ» پڑھیں۔',
      ],
    },
    ex: [
      ['أَيْنَ الْكِتَابُ؟', 'aynal-kitaabu?', 'Where is the book?', 'کتاب کہاں ہے؟'],
      ['الْكِتَابُ عَلَى الْمَكْتَبِ', 'al-kitaabu ʿalal-maktabi', 'The book is on the desk', 'کتاب میز پر ہے'],
      ['الْوَلَدُ فِي الْبَيْتِ', 'al-waladu fil-bayti', 'The boy is in the house', 'لڑکا گھر میں ہے'],
      ['الْقَلَمُ فِي الْحَقِيبَةِ', 'al-qalamu fil-ḥaqiibati', 'The pen is in the bag', 'قلم بیگ میں ہے'],
      ['أَنَا مِنْ بَاكِسْتَانَ', 'anaa min baakistaana', 'I am from Pakistan', 'میں پاکستان سے ہوں'],
      ['ذَهَبَ إِلَى الْمَسْجِدِ', 'dhahaba ilal-masjidi', 'He went to the mosque', 'وہ مسجد گیا'],
      ['أَيْنَ مُحَمَّدٌ؟', 'ayna muḥammadun?', 'Where is Muhammad?', 'محمد کہاں ہے؟'],
      ['هُوَ فِي السُّوقِ', 'huwa fis-suuqi', 'He is in the market', 'وہ بازار میں ہے'],
    ],
    practice: [
      { en: 'Say “The book is in the house”.', ur: '«کتاب گھر میں ہے» کہیں۔', a: 'الْكِتَابُ فِي الْبَيْتِ', tr: 'al-kitaabu fil-bayti' },
      { en: 'Ask “Where is the pen?”', ur: '«قلم کہاں ہے؟» پوچھیں۔', a: 'أَيْنَ الْقَلَمُ؟', tr: 'aynal-qalamu?' },
      { en: 'Fix the ending: {فِي الْمَسْجِدُ}', ur: 'آخر کی حرکت درست کریں: {فِي الْمَسْجِدُ}', a: 'فِي الْمَسْجِدِ', tr: 'fil-masjidi', noteEn: 'After a preposition the noun ends in -i.', noteUr: 'حرفِ جر کے بعد اسم کے آخر میں زیر آتی ہے۔' },
    ],
  },
  {
    slug: 'lesson-5-feminine', key: 'هٰذِهِ', video: 'lesson-5-feminine.mp4',
    en: {
      title: 'Feminine words: this and that', short: 'Masculine and feminine nouns, and the {ة} ending.',
      intro: 'Every Arabic noun is masculine or feminine. Most feminine nouns end in {ة} (taa marbuuṭa), like {سَيَّارَةٌ} (car) and {مَدْرَسَةٌ} (school). With feminine nouns, use {هٰذِهِ} (haadhihi) instead of {هٰذَا}, and {تِلْكَ} (tilka) instead of {ذٰلِكَ}.',
      points: [
        'Masculine: {هٰذَا كِتَابٌ}. Feminine: {هٰذِهِ سَيَّارَةٌ}.',
        'Describing words follow the noun: add {ة} to make them feminine. {الْبَيْتُ كَبِيرٌ}, but {الْمَدْرَسَةُ كَبِيرَةٌ}.',
        'A few feminine words have no {ة}, such as {شَمْسٌ} (sun) and {أُمٌّ} (mother). Learn them as you meet them.',
      ],
    },
    ur: {
      title: 'مؤنث الفاظ: یہ اور وہ', short: 'مذکر، مؤنث اور {ة} کا استعمال۔',
      intro: 'عربی میں ہر اسم مذکر یا مؤنث ہوتا ہے۔ زیادہ تر مؤنث اسم {ة} (تاء مربوطہ) پر ختم ہوتے ہیں، جیسے {سَيَّارَةٌ} (گاڑی) اور {مَدْرَسَةٌ} (اسکول)۔ مؤنث کے لیے {هٰذَا} کی جگہ {هٰذِهِ} اور {ذٰلِكَ} کی جگہ {تِلْكَ} استعمال کریں۔',
      points: [
        'مذکر: {هٰذَا كِتَابٌ}۔ مؤنث: {هٰذِهِ سَيَّارَةٌ}۔',
        'صفت بھی اسم کے مطابق بدلتی ہے؛ مؤنث کے لیے آخر میں {ة} لگائیں: {الْبَيْتُ كَبِيرٌ} مگر {الْمَدْرَسَةُ كَبِيرَةٌ}۔',
        'کچھ مؤنث الفاظ پر {ة} نہیں ہوتی، جیسے {شَمْسٌ} اور {أُمٌّ}۔ دلچسپ بات: اردو میں سورج مذکر ہے مگر عربی میں {شَمْسٌ} مؤنث ہے۔',
      ],
    },
    ex: [
      ['هٰذِهِ سَيَّارَةٌ', 'haadhihi sayyaaratun', 'This is a car', 'یہ گاڑی ہے'],
      ['هٰذِهِ مَدْرَسَةٌ', 'haadhihi madrasatun', 'This is a school', 'یہ اسکول ہے'],
      ['تِلْكَ نَافِذَةٌ', 'tilka naafidhatun', 'That is a window', 'وہ کھڑکی ہے'],
      ['هٰذِهِ طَالِبَةٌ', 'haadhihi ṭaalibatun', 'This is a (female) student', 'یہ طالبہ ہے'],
      ['مَنْ هٰذِهِ؟', 'man haadhihi?', 'Who is this (woman)?', 'یہ خاتون کون ہیں؟'],
      ['الْمَدْرَسَةُ كَبِيرَةٌ', 'al-madrasatu kabiiratun', 'The school is big', 'اسکول بڑا ہے'],
      ['السَّيَّارَةُ جَدِيدَةٌ', 'as-sayyaaratu jadiidatun', 'The car is new', 'گاڑی نئی ہے'],
      ['الشَّمْسُ حَارَّةٌ', 'ash-shamsu ḥaarratun', 'The sun is hot', 'سورج گرم ہے'],
    ],
    practice: [
      { en: 'Choose {هٰذَا} or {هٰذِهِ}: ___ {مَدْرَسَةٌ}', ur: '{هٰذَا} یا {هٰذِهِ}؟ ___ {مَدْرَسَةٌ}', a: 'هٰذِهِ مَدْرَسَةٌ', tr: 'haadhihi madrasatun', noteEn: '{مَدْرَسَةٌ} ends in {ة}, so it is feminine.', noteUr: '{مَدْرَسَةٌ} کے آخر میں {ة} ہے، اس لیے یہ مؤنث ہے۔' },
      { en: 'Make the describing word feminine: {السَّيَّارَةُ جَدِيدٌ}', ur: 'صفت کو مؤنث بنائیں: {السَّيَّارَةُ جَدِيدٌ}', a: 'السَّيَّارَةُ جَدِيدَةٌ', tr: 'as-sayyaaratu jadiidatun' },
      { en: 'Say “That is a window”.', ur: '«وہ کھڑکی ہے» کہیں۔', a: 'تِلْكَ نَافِذَةٌ', tr: 'tilka naafidhatun' },
    ],
  },
  {
    slug: 'lesson-6-whose', key: 'لِمَنْ',
    en: {
      title: 'Whose? Saying “of” (iḍaafa)', short: 'Join two nouns to show who owns what.',
      intro: 'To say “Muhammad’s book” or “the door of the house”, put two nouns side by side, the thing first and the owner second: {كِتَابُ مُحَمَّدٍ}, {بَابُ الْبَيْتِ}. This pairing is called iḍaafa. The first noun never takes al- or the -un ending, and the second noun ends in -i.',
      points: [
        'Thing first, owner second: {كِتَابُ الطَّالِبِ} is “the student’s book”, literally “book of the student”.',
        'The first word becomes definite on its own: {بَابُ الْبَيْتِ} means “the door of the house”, not “a door”.',
        'Ask “whose?” with {لِمَنْ}: {لِمَنْ هٰذَا الْقَلَمُ؟} Whose pen is this?',
      ],
    },
    ur: {
      title: 'کس کا؟ اضافت', short: 'دو اسم ملا کر بتائیں کہ چیز کس کی ہے۔',
      intro: '«محمد کی کتاب» یا «گھر کا دروازہ» کہنے کے لیے دو اسم ساتھ ساتھ رکھیں، پہلے چیز اور پھر مالک: {كِتَابُ مُحَمَّدٍ}، {بَابُ الْبَيْتِ}۔ اس ترکیب کو اضافت کہتے ہیں۔ پہلے اسم پر نہ الـ آتا ہے نہ تنوین، اور دوسرے اسم کے آخر میں زیر آتی ہے۔',
      points: [
        'یہ بالکل اردو کی اضافت جیسی ترکیب ہے: «کتابِ محمد» کی طرح عربی میں بھی پہلے چیز اور پھر مالک آتا ہے۔',
        'پہلا لفظ خود بخود معرفہ بن جاتا ہے: {بَابُ الْبَيْتِ} یعنی «گھر کا دروازہ»، کوئی بھی دروازہ نہیں۔',
        '«کس کا؟» پوچھنے کے لیے {لِمَنْ} کہیں: {لِمَنْ هٰذَا الْقَلَمُ؟} یہ قلم کس کا ہے؟',
      ],
    },
    ex: [
      ['كِتَابُ مُحَمَّدٍ', 'kitaabu muḥammadin', 'Muhammad’s book', 'محمد کی کتاب'],
      ['بَابُ الْبَيْتِ', 'baabul-bayti', 'the door of the house', 'گھر کا دروازہ'],
      ['قَلَمُ الْمُدَرِّسِ', 'qalamul-mudarrisi', 'the teacher’s pen', 'استاد کا قلم'],
      ['سَيَّارَةُ الطَّبِيبِ', 'sayyaaratuṭ-ṭabiibi', 'the doctor’s car', 'ڈاکٹر کی گاڑی'],
      ['مِفْتَاحُ السَّيَّارَةِ', 'miftaaḥus-sayyaarati', 'the car key', 'گاڑی کی چابی'],
      ['لِمَنْ هٰذَا الْقَلَمُ؟', 'liman haadhal-qalamu?', 'Whose pen is this?', 'یہ قلم کس کا ہے؟'],
      ['هٰذَا قَلَمُ حَامِدٍ', 'haadhaa qalamu ḥaamidin', 'This is Hamid’s pen', 'یہ حامد کا قلم ہے'],
      ['بَيْتُ اللّٰهِ', 'baytullaahi', 'the House of Allah (the Kaaba)', 'بیت اللہ (کعبہ)'],
    ],
    practice: [
      { en: 'Say “the door of the mosque”.', ur: '«مسجد کا دروازہ» کہیں۔', a: 'بَابُ الْمَسْجِدِ', tr: 'baabul-masjidi' },
      { en: 'What is wrong with {الْكِتَابُ مُحَمَّدٍ}?', ur: '{الْكِتَابُ مُحَمَّدٍ} میں کیا غلطی ہے؟', a: 'كِتَابُ مُحَمَّدٍ', tr: 'kitaabu muḥammadin', noteEn: 'The first noun in an iḍaafa never takes al-.', noteUr: 'اضافت کے پہلے اسم پر الـ نہیں آتا۔' },
      { en: 'Ask “Whose car is this?”', ur: '«یہ گاڑی کس کی ہے؟» پوچھیں۔', a: 'لِمَنْ هٰذِهِ السَّيَّارَةُ؟', tr: 'liman haadhihis-sayyaaratu?' },
    ],
  },
  {
    slug: 'lesson-7-pronouns', key: 'أَنَا',
    en: {
      title: 'I, you, he, she', short: 'Talk about yourself and other people.',
      intro: 'Pronouns work like {هٰذَا}: put one before a noun or describing word and you have a sentence. {أَنَا طَالِبٌ} means “I am a student”. Arabic has two words for “you”: {أَنْتَ} when you speak to a man and {أَنْتِ} when you speak to a woman.',
      points: [
        '{أَنَا} (anaa) I · {أَنْتَ} (anta) you, to a man · {أَنْتِ} (anti) you, to a woman · {هُوَ} (huwa) he · {هِيَ} (hiya) she',
        '{نَحْنُ} (naḥnu) we · {هُمْ} (hum) they',
        'The describing word matches the person: {هُوَ مَرِيضٌ} (he is ill), {هِيَ مَرِيضَةٌ} (she is ill).',
      ],
    },
    ur: {
      title: 'میں، آپ، وہ: ضمیریں', short: 'اپنے اور دوسروں کے بارے میں بات کریں۔',
      intro: 'ضمیریں بھی {هٰذَا} کی طرح کام کرتی ہیں: انہیں اسم یا صفت سے پہلے رکھیں تو جملہ بن جاتا ہے۔ {أَنَا طَالِبٌ} یعنی «میں طالب علم ہوں»۔ عربی میں «آپ» کے دو لفظ ہیں: مرد سے بات کرتے ہوئے {أَنْتَ} اور عورت سے بات کرتے ہوئے {أَنْتِ}۔',
      points: [
        '{أَنَا} میں · {أَنْتَ} آپ (مرد سے) · {أَنْتِ} آپ (عورت سے) · {هُوَ} وہ (مرد) · {هِيَ} وہ (عورت)',
        '{نَحْنُ} ہم · {هُمْ} وہ سب',
        'صفت شخص کے مطابق بدلتی ہے: {هُوَ مَرِيضٌ} (وہ بیمار ہے)، {هِيَ مَرِيضَةٌ} (وہ بیمار ہے)۔',
      ],
    },
    ex: [
      ['أَنَا طَالِبٌ', 'anaa ṭaalibun', 'I am a student', 'میں طالب علم ہوں'],
      ['أَنْتَ مُدَرِّسٌ', 'anta mudarrisun', 'You are a teacher (to a man)', 'آپ استاد ہیں (مرد سے)'],
      ['أَنْتِ طَبِيبَةٌ', 'anti ṭabiibatun', 'You are a doctor (to a woman)', 'آپ ڈاکٹر ہیں (خاتون سے)'],
      ['هُوَ مُهَنْدِسٌ', 'huwa muhandisun', 'He is an engineer', 'وہ انجینئر ہے'],
      ['هِيَ مُمَرِّضَةٌ', 'hiya mumarriḍatun', 'She is a nurse', 'وہ نرس ہے'],
      ['نَحْنُ مِنْ بَاكِسْتَانَ', 'naḥnu min baakistaana', 'We are from Pakistan', 'ہم پاکستان سے ہیں'],
      ['هُمْ فِي الْمَسْجِدِ', 'hum fil-masjidi', 'They are in the mosque', 'وہ سب مسجد میں ہیں'],
      ['أَنَا مَشْغُولٌ', 'anaa mashghuulun', 'I am busy', 'میں مصروف ہوں'],
    ],
    practice: [
      { en: 'Say “I am an engineer”.', ur: '«میں انجینئر ہوں» کہیں۔', a: 'أَنَا مُهَنْدِسٌ', tr: 'anaa muhandisun' },
      { en: 'Speaking to a woman, say “You are a student”.', ur: 'کسی خاتون سے کہیں: «آپ طالبہ ہیں»۔', a: 'أَنْتِ طَالِبَةٌ', tr: 'anti ṭaalibatun' },
      { en: 'Which pronoun? ___ {مُمَرِّضَةٌ} (She is a nurse.)', ur: 'کون سی ضمیر؟ ___ {مُمَرِّضَةٌ} (وہ نرس ہے)', a: 'هِيَ مُمَرِّضَةٌ', tr: 'hiya mumarriḍatun' },
    ],
  },
  {
    slug: 'lesson-8-my-your', key: 'كِتَابِي', video: 'lesson-8-my-your.mp4',
    en: {
      title: 'My, your, his, her', short: 'Add endings to say my, your, his and her.',
      intro: 'To say “my book” or “your house”, Arabic adds a short ending to the noun instead of using a separate word: {كِتَابِي} (my book), {كِتَابُكَ} (your book). A noun with one of these endings drops al- and the -un ending.',
      points: [
        '-ii my · -ka your, to a man · -ki your, to a woman · -hu his · -haa her · -naa our',
        'When {ة} gets an ending, it turns into an ordinary {ت}: {سَيَّارَةٌ} becomes {سَيَّارَتِي} (my car).',
        '{مَا اسْمُكَ؟} (What is your name?) uses the same ending: ism + -uka.',
      ],
    },
    ur: {
      title: 'میرا، آپ کا، اس کا', short: 'میرا، آپ کا اور اس کا کے لاحقے۔',
      intro: '«میری کتاب» یا «آپ کا گھر» کہنے کے لیے عربی میں الگ لفظ کے بجائے اسم کے آخر میں ایک چھوٹا سا لاحقہ لگتا ہے: {كِتَابِي} (میری کتاب)، {كِتَابُكَ} (آپ کی کتاب)۔ لاحقہ لگنے پر اسم سے الـ اور تنوین ہٹ جاتے ہیں۔',
      points: [
        '{ـِي} میرا · {ـكَ} آپ کا (مرد) · {ـكِ} آپ کا (عورت) · {ـهُ} اس کا (مرد) · {ـهَا} اس کا (عورت) · {ـنَا} ہمارا',
        'جب {ة} پر لاحقہ لگے تو وہ عام {ت} بن جاتی ہے: {سَيَّارَةٌ} سے {سَيَّارَتِي} (میری گاڑی)۔',
        '{مَا اسْمُكَ؟} (آپ کا نام کیا ہے؟) میں بھی یہی لاحقہ ہے: {اسْم} + {ـكَ}۔',
      ],
    },
    ex: [
      ['هٰذَا كِتَابِي', 'haadhaa kitaabii', 'This is my book', 'یہ میری کتاب ہے'],
      ['أَيْنَ بَيْتُكَ؟', 'ayna baytuka?', 'Where is your house? (to a man)', 'آپ کا گھر کہاں ہے؟'],
      ['مَا اسْمُكِ؟', 'masmuki?', 'What is your name? (to a woman)', 'آپ کا نام کیا ہے؟ (خاتون سے)'],
      ['هٰذَا قَلَمُهُ', 'haadhaa qalamuhu', 'This is his pen', 'یہ اس کا قلم ہے'],
      ['سَيَّارَتُهَا جَدِيدَةٌ', 'sayyaaratuhaa jadiidatun', 'Her car is new', 'اس کی گاڑی نئی ہے (خاتون)'],
      ['مَدْرَسَتُنَا كَبِيرَةٌ', 'madrasatunaa kabiiratun', 'Our school is big', 'ہمارا اسکول بڑا ہے'],
      ['اسْمِي أَحْمَدُ', 'ismii aḥmadu', 'My name is Ahmad', 'میرا نام احمد ہے'],
      ['أَبِي فِي الْبَيْتِ', 'abii fil-bayti', 'My father is at home', 'میرے ابو گھر پر ہیں'],
    ],
    practice: [
      { en: 'Say “my house”.', ur: '«میرا گھر» کہیں۔', a: 'بَيْتِي', tr: 'baytii' },
      { en: 'Say “her book”.', ur: '«اس (خاتون) کی کتاب» کہیں۔', a: 'كِتَابُهَا', tr: 'kitaabuhaa' },
      { en: 'Make “my car” from {سَيَّارَةٌ}.', ur: '{سَيَّارَةٌ} سے «میری گاڑی» بنائیں۔', a: 'سَيَّارَتِي', tr: 'sayyaaratii', noteEn: 'The {ة} turns into an ordinary {ت}.', noteUr: '{ة} عام {ت} بن جاتی ہے۔' },
    ],
  },
  {
    slug: 'lesson-9-adjectives', key: 'كَبِيرٌ', video: 'lesson-9-adjectives.mp4',
    en: {
      title: 'Describing things: a big house, the big house', short: 'Adjectives come after the noun and match it.',
      intro: 'In Arabic the describing word comes after the noun: {بَيْتٌ كَبِيرٌ} (baytun kabiirun) is “a big house”. The adjective copies the noun: if the noun has {الـ}, so does the adjective, and if the noun is feminine, the adjective takes {ـة} too.',
      points: [
        '{بَيْتٌ كَبِيرٌ} a big house · {الْبَيْتُ الْكَبِيرُ} the big house · {الْبَيْتُ كَبِيرٌ} the house is big',
        'The only difference between “the big house” and “the house is big” is the {الـ} on the adjective. Without it, you have a full sentence.',
        'For a feminine noun, add {ـة} to the adjective as well: {سَيَّارَةٌ جَدِيدَةٌ} (a new car), {الْمَدْرَسَةُ كَبِيرَةٌ} (the school is big).',
      ],
    },
    ur: {
      title: 'صفت: بڑا گھر، وہ بڑا گھر', short: 'صفت اسم کے بعد آتی ہے اور اسی کے مطابق بدلتی ہے۔',
      intro: 'عربی میں صفت اسم کے بعد آتی ہے: {بَيْتٌ كَبِيرٌ} یعنی «ایک بڑا گھر»۔ صفت اپنے اسم کی نقل کرتی ہے: اسم پر {الـ} ہو تو صفت پر بھی ہوگا، اور اسم مؤنث ہو تو صفت پر بھی {ـة} آئے گی۔',
      points: [
        '{بَيْتٌ كَبِيرٌ} ایک بڑا گھر · {الْبَيْتُ الْكَبِيرُ} وہ بڑا گھر · {الْبَيْتُ كَبِيرٌ} گھر بڑا ہے',
        '«وہ بڑا گھر» اور «گھر بڑا ہے» میں فرق صرف صفت پر {الـ} کا ہے۔ صفت پر {الـ} نہ ہو تو پورا جملہ بن جاتا ہے۔',
        'مؤنث اسم کی صفت پر بھی {ـة} لگائیں: {سَيَّارَةٌ جَدِيدَةٌ} (نئی گاڑی)، {الْمَدْرَسَةُ كَبِيرَةٌ} (اسکول بڑا ہے)۔',
      ],
    },
    ex: [
      ['بَيْتٌ كَبِيرٌ', 'baytun kabiirun', 'a big house', 'ایک بڑا گھر'],
      ['الْبَيْتُ الْكَبِيرُ', 'al-baytu l-kabiiru', 'the big house', 'وہ بڑا گھر'],
      ['الْبَيْتُ كَبِيرٌ', 'al-baytu kabiirun', 'The house is big.', 'گھر بڑا ہے۔'],
      ['قَلَمٌ جَدِيدٌ', 'qalamun jadiidun', 'a new pen', 'ایک نیا قلم'],
      ['السَّيَّارَةُ جَدِيدَةٌ', 'as-sayyaaratu jadiidatun', 'The car is new.', 'گاڑی نئی ہے۔'],
      ['هٰذَا طَالِبٌ مُجْتَهِدٌ', 'haadhaa ṭaalibun mujtahidun', 'This is a hard-working student.', 'یہ ایک محنتی طالب علم ہے۔'],
      ['الْمَاءُ بَارِدٌ', 'al-maa’u baaridun', 'The water is cold.', 'پانی ٹھنڈا ہے۔'],
      ['الْقَهْوَةُ حَارَّةٌ', 'al-qahwatu ḥaarratun', 'The coffee is hot.', 'قہوہ گرم ہے۔'],
    ],
    practice: [
      { en: 'Say “a small book”. Small is {صَغِيرٌ}.', ur: '«ایک چھوٹی کتاب» کہیں۔ چھوٹا: {صَغِيرٌ}۔', a: 'كِتَابٌ صَغِيرٌ', tr: 'kitaabun ṣaghiirun' },
      { en: 'Say “The book is small.”', ur: '«کتاب چھوٹی ہے» کہیں۔', a: 'الْكِتَابُ صَغِيرٌ', tr: 'al-kitaabu ṣaghiirun', noteEn: 'No {الـ} on the adjective, so it is a full sentence.', noteUr: 'صفت پر {الـ} نہیں، اس لیے یہ پورا جملہ ہے۔' },
      { en: 'Say “the new car”.', ur: '«وہ نئی گاڑی» کہیں۔', a: 'السَّيَّارَةُ الْجَدِيدَةُ', tr: 'as-sayyaaratu l-jadiidatu', noteEn: 'Both words take {الـ}, and the adjective takes {ـة} because {سَيَّارَة} is feminine.', noteUr: 'دونوں پر {الـ} ہے، اور {سَيَّارَة} مؤنث ہے اس لیے صفت پر بھی {ـة} ہے۔' },
    ],
  },
  {
    slug: 'lesson-10-plurals', key: 'هٰؤُلَاءِ', video: 'lesson-10-plurals.mp4',
    en: {
      title: 'More than one: plurals and “these”', short: 'Plurals with endings, broken plurals, and {هٰؤُلَاءِ}.',
      intro: 'Arabic makes plurals in two ways. Many words for people add an ending: {مُسْلِمٌ} becomes {مُسْلِمُونَ} (Muslim men) and {مُسْلِمَةٌ} becomes {مُسْلِمَاتٌ} (Muslim women). Most other words change their inside pattern instead, a bit like English man → men: {كِتَابٌ} becomes {كُتُبٌ} (books). To point at people, use {هٰؤُلَاءِ} (haa’ulaa’i, these).',
      points: [
        'Men: add {ـُونَ} (-uuna). {مُدَرِّسٌ} becomes {مُدَرِّسُونَ} (teachers).',
        'Women: change {ـَةٌ} to {ـَاتٌ} (-aat). {طَالِبَةٌ} becomes {طَالِبَاتٌ} (female students).',
        'Broken plurals have to be learned word by word: {بَيْتٌ} → {بُيُوتٌ} (houses), {قَلَمٌ} → {أَقْلَامٌ} (pens), {رَجُلٌ} → {رِجَالٌ} (men).',
        'The plural of a thing is treated as feminine singular: {هٰذِهِ كُتُبٌ} (these are books), not {هٰؤُلَاءِ}.',
      ],
    },
    ur: {
      title: 'ایک سے زیادہ: جمع اور «یہ سب»', short: 'لاحقے والی جمع، جمع مکسر اور {هٰؤُلَاءِ}۔',
      intro: 'عربی میں جمع دو طرح بنتی ہے۔ لوگوں کے لیے بہت سے الفاظ پر لاحقہ لگتا ہے: {مُسْلِمٌ} سے {مُسْلِمُونَ} (مسلمان مرد) اور {مُسْلِمَةٌ} سے {مُسْلِمَاتٌ} (مسلمان عورتیں)۔ زیادہ تر دوسرے الفاظ کی اندرونی شکل بدل جاتی ہے: {كِتَابٌ} سے {كُتُبٌ} (کتابیں)۔ لوگوں کی طرف اشارے کے لیے {هٰؤُلَاءِ} (یہ سب) استعمال کریں۔',
      points: [
        'مردوں کے لیے {ـُونَ} لگائیں: {مُدَرِّسٌ} سے {مُدَرِّسُونَ} (اساتذہ)۔',
        'عورتوں کے لیے {ـَةٌ} کو {ـَاتٌ} سے بدلیں: {طَالِبَةٌ} سے {طَالِبَاتٌ} (طالبات)۔',
        'جمع مکسر لفظ بہ لفظ یاد کرنی پڑتی ہے: {بَيْتٌ} سے {بُيُوتٌ} (گھر)، {قَلَمٌ} سے {أَقْلَامٌ} (قلم)، {رَجُلٌ} سے {رِجَالٌ} (مرد)۔',
        'بے جان چیزوں کی جمع واحد مؤنث کی طرح استعمال ہوتی ہے: {هٰذِهِ كُتُبٌ} (یہ کتابیں ہیں)، {هٰؤُلَاءِ} نہیں۔',
      ],
    },
    ex: [
      ['هٰؤُلَاءِ مُسْلِمُونَ', 'haa’ulaa’i muslimuuna', 'These are Muslims.', 'یہ مسلمان ہیں۔'],
      ['هٰؤُلَاءِ طَالِبَاتٌ', 'haa’ulaa’i ṭaalibaatun', 'These are (female) students.', 'یہ طالبات ہیں۔'],
      ['الْمُدَرِّسُونَ فِي الْفَصْلِ', 'al-mudarrisuuna fil-faṣli', 'The teachers are in the classroom.', 'اساتذہ کلاس میں ہیں۔'],
      ['هٰذِهِ كُتُبٌ', 'haadhihi kutubun', 'These are books.', 'یہ کتابیں ہیں۔'],
      ['الْبُيُوتُ كَبِيرَةٌ', 'al-buyuutu kabiiratun', 'The houses are big.', 'گھر بڑے ہیں۔'],
      ['أَيْنَ الْأَقْلَامُ؟', 'ayna l-aqlaamu?', 'Where are the pens?', 'قلم کہاں ہیں؟'],
      ['هٰؤُلَاءِ رِجَالٌ', 'haa’ulaa’i rijaalun', 'These are men.', 'یہ مرد ہیں۔'],
      ['الْمُسْلِمَاتُ فِي الْمَسْجِدِ', 'al-muslimaatu fil-masjidi', 'The Muslim women are in the mosque.', 'مسلمان خواتین مسجد میں ہیں۔'],
    ],
    practice: [
      { en: 'Make “engineers” (men) from {مُهَنْدِسٌ}.', ur: '{مُهَنْدِسٌ} سے «انجینئر» (مرد، جمع) بنائیں۔', a: 'مُهَنْدِسُونَ', tr: 'muhandisuuna' },
      { en: 'Make “nurses” (women) from {مُمَرِّضَةٌ}.', ur: '{مُمَرِّضَةٌ} سے «نرسیں» بنائیں۔', a: 'مُمَرِّضَاتٌ', tr: 'mumarriḍaatun' },
      { en: 'Say “These are houses.”', ur: '«یہ گھر ہیں» کہیں۔', a: 'هٰذِهِ بُيُوتٌ', tr: 'haadhihi buyuutun', noteEn: 'Houses are things, so use {هٰذِهِ}, not {هٰؤُلَاءِ}.', noteUr: 'گھر بے جان چیز ہے، اس لیے {هٰذِهِ} آئے گا، {هٰؤُلَاءِ} نہیں۔' },
    ],
  },
  {
    slug: 'lesson-11-past-tense', key: 'ذَهَبَ',
    en: {
      title: 'Talking about the past: I went, you went', short: 'Past tense verbs and their endings.',
      intro: 'A past tense verb starts from the “he” form, which is also how dictionaries list verbs: {ذَهَبَ} (dhahaba, he went). To change the person, add an ending: {ذَهَبْتُ} (dhahabtu) is “I went”. The ending already shows who did it, so you usually don’t need a separate word for “I” or “you”.',
      points: [
        '{ذَهَبَ} he went · {ذَهَبَتْ} she went · {ذَهَبْتَ} you went (man) · {ذَهَبْتِ} you went (woman) · {ذَهَبْتُ} I went · {ذَهَبْنَا} we went · {ذَهَبُوا} they went',
        'The verb often comes first in the sentence: {ذَهَبَ الْوَلَدُ إِلَى الْمَدْرَسَةِ} (The boy went to school).',
        'These verbs work the same way: {خَرَجَ} (went out), {دَخَلَ} (went in), {جَلَسَ} (sat), {كَتَبَ} (wrote), {فَتَحَ} (opened).',
      ],
    },
    ur: {
      title: 'ماضی کی بات: میں گیا، آپ گئے', short: 'فعل ماضی اور اس کے لاحقے۔',
      intro: 'فعل ماضی «وہ (مرد)» والی شکل سے شروع ہوتا ہے، اور لغت میں بھی فعل اسی شکل میں ملتا ہے: {ذَهَبَ} (وہ گیا)۔ کرنے والا بدلنے کے لیے آخر میں لاحقہ لگائیں: {ذَهَبْتُ} یعنی «میں گیا»۔ لاحقہ خود بتا دیتا ہے کہ کام کس نے کیا، اس لیے عموماً «میں» یا «آپ» الگ سے کہنے کی ضرورت نہیں ہوتی۔',
      points: [
        '{ذَهَبَ} وہ گیا · {ذَهَبَتْ} وہ گئی · {ذَهَبْتَ} آپ گئے (مرد) · {ذَهَبْتِ} آپ گئیں (عورت) · {ذَهَبْتُ} میں گیا · {ذَهَبْنَا} ہم گئے · {ذَهَبُوا} وہ سب گئے',
        'فعل عموماً جملے کے شروع میں آتا ہے: {ذَهَبَ الْوَلَدُ إِلَى الْمَدْرَسَةِ} (لڑکا اسکول گیا)۔',
        'یہ فعل بھی اسی طرح چلتے ہیں: {خَرَجَ} (باہر نکلا)، {دَخَلَ} (اندر گیا)، {جَلَسَ} (بیٹھا)، {كَتَبَ} (لکھا)، {فَتَحَ} (کھولا)۔',
      ],
    },
    ex: [
      ['ذَهَبْتُ إِلَى السُّوقِ', 'dhahabtu ila s-suuqi', 'I went to the market.', 'میں بازار گیا۔'],
      ['أَيْنَ ذَهَبْتَ؟', 'ayna dhahabta?', 'Where did you go? (to a man)', 'آپ کہاں گئے؟'],
      ['ذَهَبَتْ فَاطِمَةُ إِلَى الْجَامِعَةِ', 'dhahabat faaṭimatu ila l-jaamiʿati', 'Fatima went to the university.', 'فاطمہ یونیورسٹی گئی۔'],
      ['خَرَجْنَا مِنَ الْبَيْتِ', 'kharajnaa mina l-bayti', 'We left the house.', 'ہم گھر سے نکلے۔'],
      ['دَخَلَ الْمُدَرِّسُ الْفَصْلَ', 'dakhala l-mudarrisu l-faṣla', 'The teacher came into the classroom.', 'استاد کلاس میں داخل ہوئے۔'],
      ['جَلَسْتُ عَلَى الْكُرْسِيِّ', 'jalastu ʿala l-kursiyyi', 'I sat on the chair.', 'میں کرسی پر بیٹھا۔'],
      ['كَتَبُوا الدَّرْسَ', 'katabu d-darsa', 'They wrote the lesson.', 'انہوں نے سبق لکھا۔'],
      ['هَلْ فَتَحْتِ الْبَابَ؟', 'hal fataḥti l-baaba?', 'Did you open the door? (to a woman)', 'کیا آپ نے دروازہ کھولا؟ (خاتون سے)'],
    ],
    practice: [
      { en: 'Say “I wrote”.', ur: '«میں نے لکھا» کہیں۔', a: 'كَتَبْتُ', tr: 'katabtu' },
      { en: 'Say “she sat”.', ur: '«وہ (خاتون) بیٹھی» کہیں۔', a: 'جَلَسَتْ', tr: 'jalasat' },
      { en: 'Say “We went out.”', ur: '«ہم باہر نکلے» کہیں۔', a: 'خَرَجْنَا', tr: 'kharajnaa' },
    ],
  },
  {
    slug: 'lesson-12-present-tense', key: 'يَذْهَبُ',
    en: {
      title: 'Now and every day: I go, he goes', short: 'Present tense verbs, and how to say “not”.',
      intro: 'The present tense adds a letter at the front of the verb: {يَذْهَبُ} (yadh-habu) means “he goes” or “he is going”. That first letter tells you who: {أَ} for I, {تَ} for you or she, {يَ} for he, {نَ} for we. To say “not”, put {لَا} (laa) before the verb: {لَا أَفْهَمُ} (I don’t understand).',
      points: [
        '{أَذْهَبُ} I go · {تَذْهَبُ} you go (man), she goes · {تَذْهَبِينَ} you go (woman) · {يَذْهَبُ} he goes · {نَذْهَبُ} we go · {يَذْهَبُونَ} they go',
        'The middle vowel can change between past and present: {كَتَبَ} → {يَكْتُبُ} (writes), {جَلَسَ} → {يَجْلِسُ} (sits), {فَتَحَ} → {يَفْتَحُ} (opens). Learn each verb in both forms.',
        'Ask yes/no questions with {هَلْ}: {هَلْ تَتَكَلَّمُ الْعَرَبِيَّةَ؟} (Do you speak Arabic?)',
      ],
    },
    ur: {
      title: 'حال کی بات: میں جاتا ہوں، وہ جاتا ہے', short: 'فعل مضارع، اور «نہیں» کیسے کہیں۔',
      intro: 'فعل مضارع (حال) میں فعل کے شروع میں ایک حرف لگتا ہے: {يَذْهَبُ} یعنی «وہ جاتا ہے» یا «وہ جا رہا ہے»۔ یہ پہلا حرف بتاتا ہے کہ کون: {أَ} میں، {تَ} آپ یا وہ (عورت)، {يَ} وہ (مرد)، {نَ} ہم۔ «نہیں» کہنے کے لیے فعل سے پہلے {لَا} لگائیں: {لَا أَفْهَمُ} (میں نہیں سمجھتا)۔',
      points: [
        '{أَذْهَبُ} میں جاتا ہوں · {تَذْهَبُ} آپ جاتے ہیں (مرد)، وہ جاتی ہے · {تَذْهَبِينَ} آپ جاتی ہیں (عورت) · {يَذْهَبُ} وہ جاتا ہے · {نَذْهَبُ} ہم جاتے ہیں · {يَذْهَبُونَ} وہ سب جاتے ہیں',
        'ماضی اور مضارع میں درمیانی حرکت بدل سکتی ہے: {كَتَبَ} سے {يَكْتُبُ} (لکھتا ہے)، {جَلَسَ} سے {يَجْلِسُ} (بیٹھتا ہے)، {فَتَحَ} سے {يَفْتَحُ} (کھولتا ہے)۔ ہر فعل دونوں شکلوں میں یاد کریں۔',
        'ہاں یا نہیں والا سوال {هَلْ} سے پوچھیں: {هَلْ تَتَكَلَّمُ الْعَرَبِيَّةَ؟} (کیا آپ عربی بولتے ہیں؟)',
      ],
    },
    ex: [
      ['أَذْهَبُ إِلَى الْعَمَلِ', 'adh-habu ila l-ʿamali', 'I go to work.', 'میں کام پر جاتا ہوں۔'],
      ['يَكْتُبُ الطَّالِبُ الدَّرْسَ', 'yaktubu ṭ-ṭaalibu d-darsa', 'The student is writing the lesson.', 'طالب علم سبق لکھ رہا ہے۔'],
      ['هِيَ تَدْرُسُ فِي الْجَامِعَةِ', 'hiya tadrusu fil-jaamiʿati', 'She studies at the university.', 'وہ یونیورسٹی میں پڑھتی ہے۔'],
      ['نَشْرَبُ الشَّايَ', 'nashrabu sh-shaaya', 'We drink tea.', 'ہم چائے پیتے ہیں۔'],
      ['لَا أَفْهَمُ', 'laa afhamu', 'I don’t understand.', 'میں نہیں سمجھتا۔'],
      ['هَلْ تَتَكَلَّمُ الْعَرَبِيَّةَ؟', 'hal tatakallamu l-ʿarabiyyata?', 'Do you speak Arabic? (to a man)', 'کیا آپ عربی بولتے ہیں؟'],
      ['نَعَمْ، أَتَكَلَّمُ قَلِيلًا', 'naʿam, atakallamu qaliilan', 'Yes, I speak a little.', 'جی ہاں، تھوڑی سی بولتا ہوں۔'],
      ['مَاذَا تَفْعَلُ؟', 'maadhaa tafʿalu?', 'What are you doing? (to a man)', 'آپ کیا کر رہے ہیں؟'],
    ],
    practice: [
      { en: 'Say “I write”.', ur: '«میں لکھتا ہوں» کہیں۔', a: 'أَكْتُبُ', tr: 'aktubu' },
      { en: 'Say “We don’t understand.”', ur: '«ہم نہیں سمجھتے» کہیں۔', a: 'لَا نَفْهَمُ', tr: 'laa nafhamu' },
      { en: 'Ask a man “Do you drink coffee?” Coffee is {الْقَهْوَةَ}.', ur: 'کسی مرد سے پوچھیں: «کیا آپ قہوہ پیتے ہیں؟» قہوہ: {الْقَهْوَةَ}۔', a: 'هَلْ تَشْرَبُ الْقَهْوَةَ؟', tr: 'hal tashrabu l-qahwata?' },
    ],
  },
  {
    slug: 'lesson-13-i-have', key: 'عِنْدِي',
    en: {
      title: 'Having things: I have, you have', short: '{عِنْدَ} and {مَعَ} with the endings from Lesson 8.',
      intro: 'Arabic has no verb “to have”. Instead you say “at me is…”: {عِنْدِي كِتَابٌ} (ʿindii kitaabun) means “I have a book”. Add the endings you learned in Lesson 8 to {عِنْدَ} (ʿinda, at) to change the person.',
      points: [
        '{عِنْدِي} I have · {عِنْدَكَ} you have (man) · {عِنْدَكِ} you have (woman) · {عِنْدَهُ} he has · {عِنْدَهَا} she has · {عِنْدَنَا} we have',
        'Use {مَعِي} (maʿii, with me) for something you are carrying right now: {مَعِي قَلَمٌ} (I have a pen on me).',
        'Ask with {هَلْ}: {هَلْ عِنْدَكَ سَيَّارَةٌ؟} (Do you have a car?). Say “I don’t have” with {لَيْسَ}: {لَيْسَ عِنْدِي سَيَّارَةٌ}. The next lesson explains {لَيْسَ}.',
      ],
    },
    ur: {
      title: 'میرے پاس ہے: ملکیت کا اظہار', short: '{عِنْدَ} اور {مَعَ} کے ساتھ سبق ۸ والے لاحقے۔',
      intro: 'عربی میں «پاس ہونا» کے لیے کوئی فعل نہیں۔ اس کے بجائے کہتے ہیں «میرے پاس ہے»: {عِنْدِي كِتَابٌ} یعنی «میرے پاس ایک کتاب ہے»۔ سبق ۸ والے لاحقے {عِنْدَ} (پاس) کے ساتھ لگا کر شخص بدلیں۔',
      points: [
        '{عِنْدِي} میرے پاس · {عِنْدَكَ} آپ کے پاس (مرد) · {عِنْدَكِ} آپ کے پاس (عورت) · {عِنْدَهُ} اس کے پاس (مرد) · {عِنْدَهَا} اس کے پاس (عورت) · {عِنْدَنَا} ہمارے پاس',
        'جو چیز اس وقت آپ کے ساتھ ہو اس کے لیے {مَعِي} (میرے ساتھ) کہیں: {مَعِي قَلَمٌ} (اس وقت میرے پاس قلم ہے)۔',
        '{هَلْ} سے پوچھیں: {هَلْ عِنْدَكَ سَيَّارَةٌ؟} (کیا آپ کے پاس گاڑی ہے؟)۔ «نہیں ہے» کے لیے {لَيْسَ} لگائیں: {لَيْسَ عِنْدِي سَيَّارَةٌ}۔ {لَيْسَ} اگلے سبق میں تفصیل سے آئے گا۔',
      ],
    },
    ex: [
      ['عِنْدِي كِتَابٌ جَدِيدٌ', 'ʿindii kitaabun jadiidun', 'I have a new book.', 'میرے پاس ایک نئی کتاب ہے۔'],
      ['هَلْ عِنْدَكَ سَيَّارَةٌ؟', 'hal ʿindaka sayyaaratun?', 'Do you have a car? (to a man)', 'کیا آپ کے پاس گاڑی ہے؟'],
      ['نَعَمْ، عِنْدِي سَيَّارَةٌ', 'naʿam, ʿindii sayyaaratun', 'Yes, I have a car.', 'جی ہاں، میرے پاس گاڑی ہے۔'],
      ['عِنْدَهُ أَخٌ وَأُخْتٌ', 'ʿindahuu akhun wa-ukhtun', 'He has a brother and a sister.', 'اس کا ایک بھائی اور ایک بہن ہے۔'],
      ['عِنْدَهَا اجْتِمَاعٌ الْيَوْمَ', 'ʿindahaa ijtimaaʿun al-yawma', 'She has a meeting today.', 'آج اس کی میٹنگ ہے۔'],
      ['عِنْدَنَا ضُيُوفٌ', 'ʿindanaa ḍuyuufun', 'We have guests.', 'ہمارے ہاں مہمان آئے ہیں۔'],
      ['مَعِي قَلَمٌ، تَفَضَّلْ', 'maʿii qalamun, tafaḍḍal', 'I have a pen on me. Here you are.', 'میرے پاس قلم ہے، یہ لیجیے۔'],
      ['لَيْسَ عِنْدِي وَقْتٌ', 'laysa ʿindii waqtun', 'I don’t have time.', 'میرے پاس وقت نہیں ہے۔'],
    ],
    practice: [
      { en: 'Say “I have a question.” Question is {سُؤَالٌ}.', ur: '«میرا ایک سوال ہے» کہیں۔ سوال: {سُؤَالٌ}۔', a: 'عِنْدِي سُؤَالٌ', tr: 'ʿindii su’aalun' },
      { en: 'Ask a woman “Do you have a car?”', ur: 'کسی خاتون سے پوچھیں: «کیا آپ کے پاس گاڑی ہے؟»', a: 'هَلْ عِنْدَكِ سَيَّارَةٌ؟', tr: 'hal ʿindaki sayyaaratun?' },
      { en: 'Say “We have a big house.”', ur: '«ہمارے پاس ایک بڑا گھر ہے» کہیں۔', a: 'عِنْدَنَا بَيْتٌ كَبِيرٌ', tr: 'ʿindanaa baytun kabiirun' },
    ],
  },
  {
    slug: 'lesson-14-laysa', key: 'لَيْسَ',
    en: {
      title: 'Saying “is not”', short: 'Make a sentence negative with {لَيْسَ}.',
      intro: 'To say that something is not so, put {لَيْسَ} (laysa, is not) at the front of the sentence: {الْبَيْتُ كَبِيرٌ} (the house is big) becomes {لَيْسَ الْبَيْتُ كَبِيرًا} (the house is not big). Notice that the ending of the describing word changes from -un to -an.',
      points: [
        '{لَيْسَ} changes with the person: {لَسْتُ} I am not · {لَسْتَ} you are not (man) · {لَسْتِ} you are not (woman) · {لَيْسَ} he is not · {لَيْسَتْ} she is not · {لَسْنَا} we are not',
        'After {لَيْسَ} the describing word ends in -an: {لَسْتُ طَبِيبًا} (I am not a doctor). Words with {ـة} end in -atan: {لَيْسَتْ مَرِيضَةً} (she is not ill).',
        'Before “at”, “in” or “with” nothing changes: {لَيْسَ عِنْدِي وَقْتٌ} (I don’t have time), {لَيْسَ فِي الْبَيْتِ} (he is not at home).',
      ],
    },
    ur: {
      title: '«نہیں ہے» کہنا', short: '{لَيْسَ} سے جملے کو منفی بنائیں۔',
      intro: 'کسی بات کی نفی کے لیے جملے کے شروع میں {لَيْسَ} (نہیں ہے) لگائیں: {الْبَيْتُ كَبِيرٌ} (گھر بڑا ہے) سے {لَيْسَ الْبَيْتُ كَبِيرًا} (گھر بڑا نہیں ہے)۔ دیکھیں کہ صفت کے آخر میں دو پیش کی جگہ دو زبر آ گئے۔',
      points: [
        '{لَيْسَ} شخص کے ساتھ بدلتا ہے: {لَسْتُ} میں نہیں ہوں · {لَسْتَ} آپ نہیں ہیں (مرد) · {لَسْتِ} آپ نہیں ہیں (عورت) · {لَيْسَ} وہ نہیں ہے (مرد) · {لَيْسَتْ} وہ نہیں ہے (عورت) · {لَسْنَا} ہم نہیں ہیں',
        '{لَيْسَ} کے بعد صفت پر دو زبر آتے ہیں: {لَسْتُ طَبِيبًا} (میں ڈاکٹر نہیں ہوں)۔ {ـة} والے الفاظ میں بھی: {لَيْسَتْ مَرِيضَةً} (وہ بیمار نہیں ہے)۔',
        '«پاس»، «میں» یا «ساتھ» سے پہلے کچھ نہیں بدلتا: {لَيْسَ عِنْدِي وَقْتٌ} (میرے پاس وقت نہیں)، {لَيْسَ فِي الْبَيْتِ} (وہ گھر پر نہیں ہے)۔',
      ],
    },
    ex: [
      ['لَيْسَ الْبَيْتُ كَبِيرًا', 'laysa l-baytu kabiiran', 'The house is not big.', 'گھر بڑا نہیں ہے۔'],
      ['لَسْتُ مُدَرِّسًا', 'lastu mudarrisan', 'I am not a teacher.', 'میں استاد نہیں ہوں۔'],
      ['لَيْسَتْ هٰذِهِ سَيَّارَتِي', 'laysat haadhihi sayyaaratii', 'This is not my car.', 'یہ میری گاڑی نہیں ہے۔'],
      ['الْمُدِيرُ لَيْسَ فِي الْمَكْتَبِ', 'al-mudiiru laysa fil-maktabi', 'The manager is not in the office.', 'منیجر دفتر میں نہیں ہیں۔'],
      ['لَسْنَا مُتْعَبِينَ', 'lasnaa mutʿabiina', 'We are not tired.', 'ہم تھکے ہوئے نہیں ہیں۔'],
      ['هَلْ أَنْتَ مَرِيضٌ؟ لَا، لَسْتُ مَرِيضًا', 'hal anta mariiḍun? laa, lastu mariiḍan', 'Are you ill? No, I am not ill.', 'کیا آپ بیمار ہیں؟ نہیں، میں بیمار نہیں ہوں۔'],
      ['لَيْسَتِ الْقَهْوَةُ حَارَّةً', 'laysati l-qahwatu ḥaarratan', 'The coffee is not hot.', 'قہوہ گرم نہیں ہے۔'],
      ['لَيْسَ عِنْدَنَا خُبْزٌ', 'laysa ʿindanaa khubzun', 'We don’t have any bread.', 'ہمارے پاس روٹی نہیں ہے۔'],
    ],
    practice: [
      { en: 'Say “I am not a student.”', ur: '«میں طالب علم نہیں ہوں» کہیں۔', a: 'لَسْتُ طَالِبًا', tr: 'lastu ṭaaliban' },
      { en: 'Make this negative: {الْمَاءُ بَارِدٌ}', ur: 'اسے منفی بنائیں: {الْمَاءُ بَارِدٌ}', a: 'لَيْسَ الْمَاءُ بَارِدًا', tr: 'laysa l-maa’u baaridan', noteEn: '{بَارِدٌ} becomes {بَارِدًا} after {لَيْسَ}.', noteUr: '{لَيْسَ} کے بعد {بَارِدٌ} سے {بَارِدًا} بن جاتا ہے۔' },
      { en: 'Say “She is not at home.”', ur: '«وہ (خاتون) گھر پر نہیں ہے» کہیں۔', a: 'لَيْسَتْ فِي الْبَيْتِ', tr: 'laysat fil-bayti' },
    ],
  },
  {
    slug: 'lesson-15-dual', key: 'كِتَابَانِ',
    en: {
      title: 'Two of something: the dual', short: 'Arabic has a special form for exactly two.',
      intro: 'Arabic has a form just for two things. Add {ـَانِ} (-aani) to the word: {كِتَابٌ} (a book) becomes {كِتَابَانِ} (two books). For words ending in {ـة}, it turns into an ordinary {ت}: {سَيَّارَةٌ} becomes {سَيَّارَتَانِ} (two cars). You don’t need the word for “two”.',
      points: [
        'Point at two with {هٰذَانِ} (these two, masculine) and {هَاتَانِ} (these two, feminine): {هٰذَانِ قَلَمَانِ} (These are two pens).',
        'After {فِي}, {عَلَى}, {مِنْ} and other little words, {ـَانِ} becomes {ـَيْنِ} (-ayni): {فِي الْبَيْتَيْنِ} (in the two houses).',
        'Describing words take the same ending: {وَلَدَانِ صَغِيرَانِ} (two small boys).',
      ],
    },
    ur: {
      title: 'دو چیزیں: تثنیہ', short: 'عربی میں ٹھیک دو کے لیے الگ شکل ہوتی ہے۔',
      intro: 'عربی میں دو چیزوں کے لیے الگ شکل ہے جسے تثنیہ کہتے ہیں۔ لفظ کے آخر میں {ـَانِ} لگائیں: {كِتَابٌ} (ایک کتاب) سے {كِتَابَانِ} (دو کتابیں)۔ {ـة} والے الفاظ میں {ة} عام {ت} بن جاتی ہے: {سَيَّارَةٌ} سے {سَيَّارَتَانِ} (دو گاڑیاں)۔ «دو» کا لفظ الگ سے کہنے کی ضرورت نہیں۔',
      points: [
        'دو کی طرف اشارے کے لیے {هٰذَانِ} (یہ دونوں، مذکر) اور {هَاتَانِ} (یہ دونوں، مؤنث): {هٰذَانِ قَلَمَانِ} (یہ دو قلم ہیں)۔',
        '{فِي}، {عَلَى}، {مِنْ} جیسے چھوٹے الفاظ کے بعد {ـَانِ} کی جگہ {ـَيْنِ} آتا ہے: {فِي الْبَيْتَيْنِ} (دونوں گھروں میں)۔',
        'صفت پر بھی یہی لاحقہ لگتا ہے: {وَلَدَانِ صَغِيرَانِ} (دو چھوٹے لڑکے)۔',
      ],
    },
    ex: [
      ['كِتَابَانِ', 'kitaabaani', 'two books', 'دو کتابیں'],
      ['سَيَّارَتَانِ', 'sayyaarataani', 'two cars', 'دو گاڑیاں'],
      ['هٰذَانِ قَلَمَانِ', 'haadhaani qalamaani', 'These are two pens.', 'یہ دو قلم ہیں۔'],
      ['هَاتَانِ طَالِبَتَانِ', 'haataani ṭaalibataani', 'These are two (female) students.', 'یہ دو طالبات ہیں۔'],
      ['عِنْدِي أَخَوَانِ', 'ʿindii akhawaani', 'I have two brothers.', 'میرے دو بھائی ہیں۔'],
      ['الْوَلَدَانِ فِي الْحَدِيقَةِ', 'al-waladaani fil-ḥadiiqati', 'The two boys are in the garden.', 'دونوں لڑکے باغ میں ہیں۔'],
      ['جَلَسْتُ بَيْنَ الطَّالِبَيْنِ', 'jalastu bayna ṭ-ṭaalibayni', 'I sat between the two students.', 'میں دونوں طالب علموں کے درمیان بیٹھا۔'],
      ['هُمَا مُهَنْدِسَانِ', 'humaa muhandisaani', 'They (two) are engineers.', 'وہ دونوں انجینئر ہیں۔'],
    ],
    practice: [
      { en: 'Make “two doors” from {بَابٌ}.', ur: '{بَابٌ} سے «دو دروازے» بنائیں۔', a: 'بَابَانِ', tr: 'baabaani' },
      { en: 'Make “two schools” from {مَدْرَسَةٌ}.', ur: '{مَدْرَسَةٌ} سے «دو اسکول» بنائیں۔', a: 'مَدْرَسَتَانِ', tr: 'madrasataani', noteEn: 'The {ة} turns into {ت} before the ending.', noteUr: 'لاحقے سے پہلے {ة} عام {ت} بن جاتی ہے۔' },
      { en: 'Say “in the two cars”.', ur: '«دونوں گاڑیوں میں» کہیں۔', a: 'فِي السَّيَّارَتَيْنِ', tr: 'fis-sayyaaratayni' },
    ],
  },
  {
    slug: 'lesson-16-counting', key: 'كَمْ',
    en: {
      title: 'Counting things: how many?', short: 'Numbers 3 to 10 with nouns, and asking {كَمْ}.',
      intro: 'To ask “how many?”, use {كَمْ} (kam) with a singular noun ending in -an: {كَمْ كِتَابًا عِنْدَكَ؟} (How many books do you have?). To answer, put the number before a plural noun: {ثَلَاثَةُ كُتُبٍ} (three books).',
      points: [
        'Numbers 3 to 10 do something unusual: they take the opposite gender to the noun. With a masculine noun the number has {ـة}: {ثَلَاثَةُ أَقْلَامٍ} (three pens). With a feminine noun it doesn’t: {ثَلَاثُ سَيَّارَاتٍ} (three cars).',
        'One and two come after the noun: {كِتَابٌ وَاحِدٌ} (one book). Or simply use the dual from Lesson 15: {كِتَابَانِ} (two books).',
        'The noun after 3 to 10 is plural and ends in -in: {خَمْسَةُ رِجَالٍ} (five men), {سَبْعُ بَنَاتٍ} (seven girls).',
      ],
    },
    ur: {
      title: 'گنتی: کتنے؟', short: 'اسم کے ساتھ تین سے دس تک گنتی، اور {كَمْ} سے سوال۔',
      intro: '«کتنے؟» پوچھنے کے لیے {كَمْ} کے بعد واحد اسم دو زبر کے ساتھ لائیں: {كَمْ كِتَابًا عِنْدَكَ؟} (آپ کے پاس کتنی کتابیں ہیں؟)۔ جواب میں عدد پہلے اور جمع اسم بعد میں آتا ہے: {ثَلَاثَةُ كُتُبٍ} (تین کتابیں)۔',
      points: [
        'تین سے دس تک کے عدد ایک انوکھا کام کرتے ہیں: وہ اسم کی الٹی جنس لیتے ہیں۔ مذکر اسم کے ساتھ عدد پر {ـة} آتی ہے: {ثَلَاثَةُ أَقْلَامٍ} (تین قلم)۔ مؤنث اسم کے ساتھ نہیں آتی: {ثَلَاثُ سَيَّارَاتٍ} (تین گاڑیاں)۔',
        'ایک اور دو اسم کے بعد آتے ہیں: {كِتَابٌ وَاحِدٌ} (ایک کتاب)۔ یا سبق ۱۵ والا تثنیہ استعمال کریں: {كِتَابَانِ} (دو کتابیں)۔',
        'تین سے دس کے بعد اسم جمع ہوتا ہے اور اس کے آخر میں دو زیر آتے ہیں: {خَمْسَةُ رِجَالٍ} (پانچ مرد)، {سَبْعُ بَنَاتٍ} (سات لڑکیاں)۔',
      ],
    },
    ex: [
      ['كَمْ كِتَابًا عِنْدَكَ؟', 'kam kitaaban ʿindaka?', 'How many books do you have? (to a man)', 'آپ کے پاس کتنی کتابیں ہیں؟'],
      ['عِنْدِي ثَلَاثَةُ كُتُبٍ', 'ʿindii thalaathatu kutubin', 'I have three books.', 'میرے پاس تین کتابیں ہیں۔'],
      ['كَمْ وَلَدًا عِنْدَهُ؟', 'kam waladan ʿindahuu?', 'How many children does he have?', 'اس کے کتنے بچے ہیں؟'],
      ['عِنْدَهُ أَرْبَعَةُ أَوْلَادٍ', 'ʿindahuu arbaʿatu awlaadin', 'He has four children.', 'اس کے چار بچے ہیں۔'],
      ['فِي الْفَصْلِ عَشَرَةُ طُلَّابٍ', 'fil-faṣli ʿasharatu ṭullaabin', 'There are ten students in the class.', 'کلاس میں دس طالب علم ہیں۔'],
      ['اشْتَرَيْتُ خَمْسَ بُرْتُقَالَاتٍ', 'ishtaraytu khamsa burtuqaalaatin', 'I bought five oranges.', 'میں نے پانچ سنگترے خریدے۔'],
      ['الْأُسْبُوعُ سَبْعَةُ أَيَّامٍ', 'al-usbuuʿu sabʿatu ayyaamin', 'A week is seven days.', 'ہفتہ سات دن کا ہوتا ہے۔'],
      ['عِنْدِي ثَلَاثُ أَخَوَاتٍ', 'ʿindii thalaathu akhawaatin', 'I have three sisters.', 'میری تین بہنیں ہیں۔'],
    ],
    practice: [
      { en: 'Say “five pens”.', ur: '«پانچ قلم» کہیں۔', a: 'خَمْسَةُ أَقْلَامٍ', tr: 'khamsatu aqlaamin', noteEn: '{قَلَمٌ} is masculine, so the number takes {ـة}.', noteUr: '{قَلَمٌ} مذکر ہے، اس لیے عدد پر {ـة} آئی۔' },
      { en: 'Say “four cars”.', ur: '«چار گاڑیاں» کہیں۔', a: 'أَرْبَعُ سَيَّارَاتٍ', tr: 'arbaʿu sayyaaraatin', noteEn: '{سَيَّارَةٌ} is feminine, so the number has no {ـة}.', noteUr: '{سَيَّارَةٌ} مؤنث ہے، اس لیے عدد پر {ـة} نہیں۔' },
      { en: 'Ask a man “How many brothers do you have?”', ur: 'کسی مرد سے پوچھیں: «آپ کے کتنے بھائی ہیں؟»', a: 'كَمْ أَخًا عِنْدَكَ؟', tr: 'kam akhan ʿindaka?' },
    ],
  },
  {
    slug: 'lesson-17-commands', key: 'اِجْلِسْ',
    en: {
      title: 'Telling someone what to do', short: 'Commands such as sit down, write and open, and saying “don’t”.',
      intro: 'To give an instruction, start from the present tense and drop the first letter: {تَجْلِسُ} (you sit) becomes {اِجْلِسْ} (ijlis, sit down!). If the word would then begin with two consonants, add {ا} at the front, said “i” or “u”: {اُكْتُبْ} (uktub, write!). The last vowel disappears.',
      points: [
        'If the present tense has u in the middle, the command starts with u: {يَكْتُبُ} → {اُكْتُبْ}. Otherwise it starts with i: {يَجْلِسُ} → {اِجْلِسْ}, {يَفْتَحُ} → {اِفْتَحْ}.',
        'To a woman add {ـِي} (-ii): {اِجْلِسِي} (sit down), {اُكْتُبِي} (write). To a group add {ـُوا} (-uu): {اِجْلِسُوا}.',
        'To say “don’t”, use {لَا} with the present tense and drop the last vowel: {لَا تَذْهَبْ} (don’t go), {لَا تَتَكَلَّمْ} (don’t talk).',
      ],
    },
    ur: {
      title: 'حکم دینا: بیٹھیں، لکھیں، کھولیں', short: 'امر (حکم) کے فعل، اور «نہ کریں» کہنا۔',
      intro: 'حکم دینے کے لیے مضارع سے شروع کریں اور پہلا حرف ہٹا دیں: {تَجْلِسُ} (آپ بیٹھتے ہیں) سے {اِجْلِسْ} (بیٹھیں!)۔ اگر لفظ دو ساکن حروف سے شروع ہونے لگے تو شروع میں {ا} لگائیں، جسے زیر یا پیش سے پڑھتے ہیں: {اُكْتُبْ} (لکھیں!)۔ آخر کی حرکت ختم ہو جاتی ہے۔',
      points: [
        'اگر مضارع میں درمیانی حرف پر پیش ہو تو امر بھی پیش سے شروع ہوتا ہے: {يَكْتُبُ} سے {اُكْتُبْ}۔ ورنہ زیر سے: {يَجْلِسُ} سے {اِجْلِسْ}، {يَفْتَحُ} سے {اِفْتَحْ}۔',
        'عورت کو حکم دیتے ہوئے {ـِي} لگائیں: {اِجْلِسِي} (بیٹھیں)، {اُكْتُبِي} (لکھیں)۔ کئی لوگوں کے لیے {ـُوا}: {اِجْلِسُوا}۔',
        '«نہ کریں» کہنے کے لیے مضارع سے پہلے {لَا} لگائیں اور آخر کی حرکت ہٹا دیں: {لَا تَذْهَبْ} (نہ جائیں)، {لَا تَتَكَلَّمْ} (بات نہ کریں)۔',
      ],
    },
    ex: [
      ['اِجْلِسْ مِنْ فَضْلِكَ', 'ijlis min faḍlika', 'Sit down, please. (to a man)', 'براہِ مہربانی بیٹھیں۔'],
      ['اُكْتُبِ اسْمَكَ هُنَا', 'uktubi smaka hunaa', 'Write your name here. (to a man)', 'اپنا نام یہاں لکھیں۔'],
      ['اِفْتَحِ الْبَابَ', 'iftaḥi l-baaba', 'Open the door.', 'دروازہ کھولیں۔'],
      ['اِسْمَعْ يَا أَحْمَدُ', 'ismaʿ yaa aḥmadu', 'Listen, Ahmad.', 'سنو، احمد۔'],
      ['اِجْلِسِي يَا فَاطِمَةُ', 'ijlisii yaa faaṭimatu', 'Sit down, Fatima.', 'فاطمہ، بیٹھ جاؤ۔'],
      ['اُدْخُلُوا', 'udkhuluu', 'Come in. (to a group)', 'اندر آ جائیں۔ (کئی لوگوں سے)'],
      ['لَا تَذْهَبْ', 'laa tadh-hab', 'Don’t go. (to a man)', 'نہ جائیں۔'],
      ['لَا تَقْلَقْ', 'laa taqlaq', 'Don’t worry. (to a man)', 'فکر نہ کریں۔'],
    ],
    practice: [
      { en: 'Tell a man “Open the book.”', ur: 'کسی مرد سے کہیں: «کتاب کھولیں۔»', a: 'اِفْتَحِ الْكِتَابَ', tr: 'iftaḥi l-kitaaba' },
      { en: 'Tell a woman “Write.”', ur: 'کسی خاتون سے کہیں: «لکھیں۔»', a: 'اُكْتُبِي', tr: 'uktubii' },
      { en: 'Tell a man “Don’t sit here.”', ur: 'کسی مرد سے کہیں: «یہاں نہ بیٹھیں۔»', a: 'لَا تَجْلِسْ هُنَا', tr: 'laa tajlis hunaa' },
    ],
  },
  {
    slug: 'lesson-18-future', key: 'سَأَذْهَبُ',
    en: {
      title: 'Talking about the future', short: 'Will and won’t with {سَـ}, {سَوْفَ} and {لَنْ}.',
      intro: 'To talk about the future, add {سَـ} (sa-) to the front of a present tense verb: {أَذْهَبُ} (I go) becomes {سَأَذْهَبُ} (sa-adh-habu, I will go). {سَوْفَ} (sawfa), written as a separate word, means the same and often points a little further ahead: {سَوْفَ أُسَافِرُ} (I will travel).',
      points: [
        '{سَأَكْتُبُ} I will write · {سَتَكْتُبُ} you will write (man), she will write · {سَيَكْتُبُ} he will write · {سَنَكْتُبُ} we will write',
        'To say “will not”, use {لَنْ} (lan) and change the last vowel to -a: {لَنْ أَذْهَبَ} (I will not go), {لَنْ نَتَأَخَّرَ} (we won’t be late).',
        'Time words help: {غَدًا} (tomorrow), {بَعْدَ غَدٍ} (the day after tomorrow), {الْأُسْبُوعَ الْقَادِمَ} (next week).',
      ],
    },
    ur: {
      title: 'مستقبل کی بات', short: '{سَـ}، {سَوْفَ} اور {لَنْ} سے «گا» اور «نہیں گا»۔',
      intro: 'مستقبل کے لیے مضارع کے شروع میں {سَـ} لگائیں: {أَذْهَبُ} (میں جاتا ہوں) سے {سَأَذْهَبُ} (میں جاؤں گا)۔ {سَوْفَ} الگ لفظ کے طور پر بھی یہی مطلب دیتا ہے، اور اکثر کچھ دور کے مستقبل کے لیے آتا ہے: {سَوْفَ أُسَافِرُ} (میں سفر کروں گا)۔',
      points: [
        '{سَأَكْتُبُ} میں لکھوں گا · {سَتَكْتُبُ} آپ لکھیں گے (مرد)، وہ لکھے گی · {سَيَكْتُبُ} وہ لکھے گا · {سَنَكْتُبُ} ہم لکھیں گے',
        '«نہیں کروں گا» کے لیے {لَنْ} لگائیں اور آخری حرف پر زبر کر دیں: {لَنْ أَذْهَبَ} (میں نہیں جاؤں گا)، {لَنْ نَتَأَخَّرَ} (ہم دیر نہیں کریں گے)۔',
        'وقت کے الفاظ مدد دیتے ہیں: {غَدًا} (کل)، {بَعْدَ غَدٍ} (پرسوں)، {الْأُسْبُوعَ الْقَادِمَ} (اگلے ہفتے)۔',
      ],
    },
    ex: [
      ['سَأَذْهَبُ إِلَى مَكَّةَ غَدًا', 'sa-adh-habu ilaa makkata ghadan', 'I will go to Makkah tomorrow.', 'میں کل مکہ جاؤں گا۔'],
      ['سَنَزُورُكُمْ يَوْمَ الْجُمُعَةِ', 'sa-nazuurukum yawma l-jumuʿati', 'We will visit you on Friday.', 'ہم جمعے کو آپ سے ملنے آئیں گے۔'],
      ['سَيَبْدَأُ الدَّرْسُ بَعْدَ قَلِيلٍ', 'sa-yabda’u d-darsu baʿda qaliilin', 'The lesson will start shortly.', 'سبق تھوڑی دیر میں شروع ہوگا۔'],
      ['سَوْفَ أَتَعَلَّمُ الْعَرَبِيَّةَ', 'sawfa ataʿallamu l-ʿarabiyyata', 'I will learn Arabic.', 'میں عربی سیکھوں گا۔'],
      ['مَتَى سَتُسَافِرُ؟', 'mataa sa-tusaafiru?', 'When will you travel? (to a man)', 'آپ کب سفر کریں گے؟'],
      ['لَنْ أَتَأَخَّرَ', 'lan ata’akhkhara', 'I won’t be late.', 'میں دیر نہیں کروں گا۔'],
      ['لَنْ يَنْجَحَ الْكَسْلَانُ', 'lan yanjaḥa l-kaslaanu', 'The lazy one will not succeed.', 'سست آدمی کامیاب نہیں ہوگا۔'],
      ['سَتَكُونُ الْقَهْوَةُ جَاهِزَةً بَعْدَ دَقِيقَةٍ', 'sa-takuunu l-qahwatu jaahizatan baʿda daqiiqatin', 'The coffee will be ready in a minute.', 'قہوہ ایک منٹ میں تیار ہو جائے گا۔'],
    ],
    practice: [
      { en: 'Say “I will write.”', ur: '«میں لکھوں گا» کہیں۔', a: 'سَأَكْتُبُ', tr: 'sa-aktubu' },
      { en: 'Say “We will go tomorrow.”', ur: '«ہم کل جائیں گے» کہیں۔', a: 'سَنَذْهَبُ غَدًا', tr: 'sa-nadh-habu ghadan' },
      { en: 'Say “I will not go.”', ur: '«میں نہیں جاؤں گا» کہیں۔', a: 'لَنْ أَذْهَبَ', tr: 'lan adh-haba', noteEn: 'After {لَنْ} the last vowel becomes -a.', noteUr: '{لَنْ} کے بعد آخری حرف پر زبر آ جاتا ہے۔' },
    ],
  },
  {
    slug: 'lesson-19-did-not', key: 'لَمْ',
    en: {
      title: 'Saying “did not”', short: 'The negative past with {مَا} and {لَمْ}.',
      intro: 'There are two ways to say something did not happen. The simple one is {مَا} (maa) before a past tense verb: {مَا ذَهَبْتُ} (I didn’t go). The more formal one, used in writing and in the Quran, is {لَمْ} (lam) with the present tense and no final vowel: {لَمْ أَذْهَبْ} (I didn’t go).',
      points: [
        '{لَمْ أَكْتُبْ} I didn’t write · {لَمْ تَكْتُبْ} you didn’t write, she didn’t write · {لَمْ يَكْتُبْ} he didn’t write · {لَمْ نَكْتُبْ} we didn’t write',
        'You have already seen {لَمْ} in Surah Al-Ikhlas: {لَمْ يَلِدْ وَلَمْ يُولَدْ} (He has no child, and He was not born).',
        '{لَمْ} with {بَعْدُ} means “not yet”: {لَمْ يَصِلْ بَعْدُ} (he hasn’t arrived yet).',
      ],
    },
    ur: {
      title: '«نہیں کیا» کہنا', short: '{مَا} اور {لَمْ} سے ماضی کی نفی۔',
      intro: 'کسی کام کے نہ ہونے کو بیان کرنے کے دو طریقے ہیں۔ آسان طریقہ: ماضی کے فعل سے پہلے {مَا}: {مَا ذَهَبْتُ} (میں نہیں گیا)۔ زیادہ فصیح طریقہ، جو تحریر اور قرآن میں آتا ہے: {لَمْ} کے بعد مضارع، اور آخری حرف ساکن: {لَمْ أَذْهَبْ} (میں نہیں گیا)۔',
      points: [
        '{لَمْ أَكْتُبْ} میں نے نہیں لکھا · {لَمْ تَكْتُبْ} آپ نے نہیں لکھا، اس (خاتون) نے نہیں لکھا · {لَمْ يَكْتُبْ} اس نے نہیں لکھا · {لَمْ نَكْتُبْ} ہم نے نہیں لکھا',
        '{لَمْ} آپ سورہ اخلاص میں دیکھ چکے ہیں: {لَمْ يَلِدْ وَلَمْ يُولَدْ} (نہ اس کی کوئی اولاد ہے اور نہ وہ کسی کی اولاد ہے)۔',
        '{لَمْ} کے ساتھ {بَعْدُ} کا مطلب ہے «ابھی تک نہیں»: {لَمْ يَصِلْ بَعْدُ} (وہ ابھی تک نہیں پہنچا)۔',
      ],
    },
    ex: [
      ['مَا ذَهَبْتُ إِلَى الْعَمَلِ أَمْسِ', 'maa dhahabtu ila l-ʿamali amsi', 'I didn’t go to work yesterday.', 'میں کل کام پر نہیں گیا۔'],
      ['لَمْ أَفْهَمِ السُّؤَالَ', 'lam afhami s-su’aala', 'I didn’t understand the question.', 'میں سوال نہیں سمجھا۔'],
      ['لَمْ يَأْكُلْ شَيْئًا', 'lam ya’kul shay’an', 'He didn’t eat anything.', 'اس نے کچھ نہیں کھایا۔'],
      ['لَمْ تَنَمْ جَيِّدًا', 'lam tanam jayyidan', 'She didn’t sleep well.', 'وہ ٹھیک سے نہیں سوئی۔'],
      ['لَمْ نَشْرَبِ الشَّايَ', 'lam nashrabi sh-shaaya', 'We didn’t drink the tea.', 'ہم نے چائے نہیں پی۔'],
      ['هَلْ وَصَلَ الْمُدِيرُ؟ لَا، لَمْ يَصِلْ بَعْدُ', 'hal waṣala l-mudiiru? laa, lam yaṣil baʿdu', 'Has the manager arrived? No, not yet.', 'کیا منیجر پہنچ گئے؟ نہیں، ابھی نہیں پہنچے۔'],
      ['مَا كَتَبْتُ الْوَاجِبَ', 'maa katabtu l-waajiba', 'I didn’t do (write) the homework.', 'میں نے ہوم ورک نہیں لکھا۔'],
      ['لَمْ أَرَهُ الْيَوْمَ', 'lam arahu l-yawma', 'I haven’t seen him today.', 'میں نے آج اسے نہیں دیکھا۔'],
    ],
    practice: [
      { en: 'Say “I didn’t go” in two ways.', ur: '«میں نہیں گیا» دو طریقوں سے کہیں۔', a: 'مَا ذَهَبْتُ / لَمْ أَذْهَبْ', tr: 'maa dhahabtu / lam adh-hab' },
      { en: 'Say “He didn’t write” using {لَمْ}.', ur: '{لَمْ} کے ساتھ «اس نے نہیں لکھا» کہیں۔', a: 'لَمْ يَكْتُبْ', tr: 'lam yaktub' },
      { en: 'Say “She hasn’t arrived yet.”', ur: '«وہ (خاتون) ابھی تک نہیں پہنچی» کہیں۔', a: 'لَمْ تَصِلْ بَعْدُ', tr: 'lam taṣil baʿdu' },
    ],
  },
  {
    slug: 'lesson-20-questions', key: 'كَيْفَ',
    en: {
      title: 'Asking questions: when, how, why, which', short: 'All the main question words in one place.',
      intro: 'Arabic question words go at the start of the sentence, and the rest of the sentence stays as it is. You already know {مَا} (what), {مَنْ} (who), {أَيْنَ} (where), {كَمْ} (how many) and {هَلْ} (for yes/no questions). This lesson adds the rest.',
      points: [
        '{مَتَى} when · {كَيْفَ} how · {لِمَاذَا} why · {مَاذَا} what (before a verb) · {أَيُّ} which',
        'Use {مَا} before a noun and {مَاذَا} before a verb: {مَا اسْمُكَ؟} (What is your name?) but {مَاذَا تُرِيدُ؟} (What do you want?).',
        'Answer “why?” with {لِأَنَّ} (because) and an ending from Lesson 8: {لِأَنِّي مَشْغُولٌ} (because I am busy). Lesson 21 explains how this works.',
      ],
    },
    ur: {
      title: 'سوال پوچھنا: کب، کیسے، کیوں، کون سا', short: 'سوال کے تمام اہم الفاظ ایک جگہ۔',
      intro: 'عربی میں سوال کا لفظ جملے کے شروع میں آتا ہے اور باقی جملہ ویسا ہی رہتا ہے۔ آپ {مَا} (کیا)، {مَنْ} (کون)، {أَيْنَ} (کہاں)، {كَمْ} (کتنے) اور {هَلْ} (ہاں یا نہیں والا سوال) سیکھ چکے ہیں۔ اس سبق میں باقی الفاظ ہیں۔',
      points: [
        '{مَتَى} کب · {كَيْفَ} کیسے · {لِمَاذَا} کیوں · {مَاذَا} کیا (فعل سے پہلے) · {أَيُّ} کون سا',
        'اسم سے پہلے {مَا} اور فعل سے پہلے {مَاذَا}: {مَا اسْمُكَ؟} (آپ کا نام کیا ہے؟) مگر {مَاذَا تُرِيدُ؟} (آپ کیا چاہتے ہیں؟)۔',
        '«کیوں؟» کا جواب {لِأَنَّ} (کیونکہ) اور سبق ۸ والے لاحقے سے دیں: {لِأَنِّي مَشْغُولٌ} (کیونکہ میں مصروف ہوں)۔ سبق ۲۱ میں اس کی تفصیل ہے۔',
      ],
    },
    ex: [
      ['مَتَى تَبْدَأُ الصَّلَاةُ؟', 'mataa tabda’u ṣ-ṣalaatu?', 'When does the prayer start?', 'نماز کب شروع ہوتی ہے؟'],
      ['كَيْفَ حَالُكَ؟', 'kayfa ḥaaluka?', 'How are you? (to a man)', 'آپ کیسے ہیں؟'],
      ['لِمَاذَا تَأَخَّرْتَ؟', 'limaadhaa ta’akhkharta?', 'Why were you late? (to a man)', 'آپ کو دیر کیوں ہوئی؟'],
      ['لِأَنَّ الطَّرِيقَ مُزْدَحِمٌ', 'li-anna ṭ-ṭariiqa muzdaḥimun', 'Because the road is busy.', 'کیونکہ سڑک پر رش ہے۔'],
      ['مَاذَا تَفْعَلُ فِي الْمَسَاءِ؟', 'maadhaa tafʿalu fil-masaa’i?', 'What do you do in the evening? (to a man)', 'آپ شام کو کیا کرتے ہیں؟'],
      ['أَيُّ كِتَابٍ تُرِيدُ؟', 'ayyu kitaabin turiidu?', 'Which book do you want? (to a man)', 'آپ کو کون سی کتاب چاہیے؟'],
      ['مَنْ هٰذَا الرَّجُلُ؟', 'man haadha r-rajulu?', 'Who is this man?', 'یہ آدمی کون ہے؟'],
      ['كَيْفَ أَذْهَبُ إِلَى الْمَطَارِ؟', 'kayfa adh-habu ila l-maṭaari?', 'How do I get to the airport?', 'میں ہوائی اڈے کیسے جاؤں؟'],
    ],
    practice: [
      { en: 'Ask a man “When are you coming?” (you come: {تَأْتِي})', ur: 'کسی مرد سے پوچھیں: «آپ کب آ رہے ہیں؟» (آپ آتے ہیں: {تَأْتِي})', a: 'مَتَى تَأْتِي؟', tr: 'mataa ta’tii?' },
      { en: 'Ask a man “Why are you studying Arabic?” (you study: {تَدْرُسُ})', ur: 'کسی مرد سے پوچھیں: «آپ عربی کیوں پڑھ رہے ہیں؟» (آپ پڑھتے ہیں: {تَدْرُسُ})', a: 'لِمَاذَا تَدْرُسُ الْعَرَبِيَّةَ؟', tr: 'limaadhaa tadrusu l-ʿarabiyyata?' },
      { en: 'Ask a man “What do you want?”', ur: 'کسی مرد سے پوچھیں: «آپ کیا چاہتے ہیں؟»', a: 'مَاذَا تُرِيدُ؟', tr: 'maadhaa turiidu?' },
    ],
  },
  {
    slug: 'lesson-21-inna', key: 'إِنَّ',
    en: {
      title: 'Indeed, but, because', short: '{إِنَّ}, {لٰكِنَّ} and {لِأَنَّ} change the ending of the next noun.',
      intro: 'Some little words at the start of a sentence change the ending of the noun after them from -u to -a. The most common is {إِنَّ} (inna, indeed), which you will see again and again in the Quran: {إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ} (Indeed, Allah is Forgiving, Merciful). Its “sisters” work the same way.',
      points: [
        '{إِنَّ} indeed · {أَنَّ} that · {لٰكِنَّ} but · {لِأَنَّ} because · {كَأَنَّ} as if',
        'The noun after them ends in -a, and the rest of the sentence stays the same: {الْجَوُّ حَارٌّ} → {إِنَّ الْجَوَّ حَارٌّ} (Indeed, the weather is hot).',
        'They can take the endings from Lesson 8: {إِنَّهُ} (indeed he), {لٰكِنَّهَا} (but she), {لِأَنِّي} (because I), {لِأَنَّنَا} (because we).',
      ],
    },
    ur: {
      title: 'بے شک، لیکن، کیونکہ', short: '{إِنَّ}، {لٰكِنَّ} اور {لِأَنَّ} اگلے اسم کا آخر بدل دیتے ہیں۔',
      intro: 'جملے کے شروع میں آنے والے کچھ چھوٹے الفاظ اپنے بعد والے اسم کے آخر کو پیش سے زبر کر دیتے ہیں۔ سب سے عام {إِنَّ} (بے شک) ہے، جو قرآن میں بار بار آتا ہے: {إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ} (بے شک اللہ بخشنے والا، رحم کرنے والا ہے)۔ اس کی «بہنیں» بھی اسی طرح کام کرتی ہیں۔',
      points: [
        '{إِنَّ} بے شک · {أَنَّ} کہ · {لٰكِنَّ} لیکن · {لِأَنَّ} کیونکہ · {كَأَنَّ} گویا',
        'ان کے بعد اسم پر زبر آتا ہے اور باقی جملہ ویسا ہی رہتا ہے: {الْجَوُّ حَارٌّ} سے {إِنَّ الْجَوَّ حَارٌّ} (بے شک موسم گرم ہے)۔',
        'ان کے ساتھ سبق ۸ والے لاحقے بھی لگتے ہیں: {إِنَّهُ} (بے شک وہ)، {لٰكِنَّهَا} (لیکن وہ خاتون)، {لِأَنِّي} (کیونکہ میں)، {لِأَنَّنَا} (کیونکہ ہم)۔',
      ],
    },
    ex: [
      ['إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ', 'inna llaaha ghafuurun raḥiimun', 'Indeed, Allah is Forgiving, Merciful.', 'بے شک اللہ بخشنے والا، رحم کرنے والا ہے۔'],
      ['إِنَّ الْعِلْمَ نُورٌ', 'inna l-ʿilma nuurun', 'Indeed, knowledge is light.', 'بے شک علم روشنی ہے۔'],
      ['أَعْرِفُ أَنَّ الطَّرِيقَ طَوِيلٌ', 'aʿrifu anna ṭ-ṭariiqa ṭawiilun', 'I know that the road is long.', 'میں جانتا ہوں کہ راستہ لمبا ہے۔'],
      ['الْبَيْتُ صَغِيرٌ لٰكِنَّهُ جَمِيلٌ', 'al-baytu ṣaghiirun laakinnahuu jamiilun', 'The house is small, but it is beautiful.', 'گھر چھوٹا ہے لیکن خوبصورت ہے۔'],
      ['لَمْ أَذْهَبْ لِأَنِّي مَرِيضٌ', 'lam adh-hab li-annii mariiḍun', 'I didn’t go because I am ill.', 'میں نہیں گیا کیونکہ میں بیمار ہوں۔'],
      ['تَأَخَّرْنَا لِأَنَّ السَّيَّارَةَ تَعَطَّلَتْ', 'ta’akhkharnaa li-anna s-sayyaarata taʿaṭṭalat', 'We were late because the car broke down.', 'ہمیں دیر ہوئی کیونکہ گاڑی خراب ہو گئی۔'],
      ['كَأَنَّهُ أَسَدٌ', 'ka-annahuu asadun', 'He is like a lion (as if he were a lion).', 'گویا وہ شیر ہے۔'],
      ['إِنَّهَا طَبِيبَةٌ مَاهِرَةٌ', 'innahaa ṭabiibatun maahiratun', 'Indeed, she is a skilled doctor.', 'بے شک وہ ایک ماہر ڈاکٹر ہیں۔'],
    ],
    practice: [
      { en: 'Add {إِنَّ} to {الْوَقْتُ قَصِيرٌ}.', ur: '{الْوَقْتُ قَصِيرٌ} پر {إِنَّ} لگائیں۔', a: 'إِنَّ الْوَقْتَ قَصِيرٌ', tr: 'inna l-waqta qaṣiirun', noteEn: '{الْوَقْتُ} becomes {الْوَقْتَ}; {قَصِيرٌ} stays the same.', noteUr: '{الْوَقْتُ} سے {الْوَقْتَ} بنا؛ {قَصِيرٌ} ویسا ہی رہا۔' },
      { en: 'Say “because I am busy” (busy: {مَشْغُولٌ}).', ur: '«کیونکہ میں مصروف ہوں» کہیں (مصروف: {مَشْغُولٌ})۔', a: 'لِأَنِّي مَشْغُولٌ', tr: 'li-annii mashghuulun' },
      { en: 'Say “The car is old, but it is good.” (old: {قَدِيمَةٌ}, good: {جَيِّدَةٌ})', ur: '«گاڑی پرانی ہے لیکن اچھی ہے» کہیں (پرانی: {قَدِيمَةٌ}، اچھی: {جَيِّدَةٌ})۔', a: 'السَّيَّارَةُ قَدِيمَةٌ لٰكِنَّهَا جَيِّدَةٌ', tr: 'as-sayyaaratu qadiimatun laakinnahaa jayyidatun' },
    ],
  },
  {
    slug: 'lesson-22-comparing', key: 'أَكْبَرُ',
    en: {
      title: 'Comparing: bigger, the biggest', short: 'The {أَفْعَلُ} pattern for “-er” and “-est”.',
      intro: 'To compare, Arabic puts the describing word into the pattern {أَفْعَلُ} (afʿalu) and follows it with {مِنْ} (than): {كَبِيرٌ} (big) gives {أَكْبَرُ مِنْ} (bigger than). The same form is used for men, women and things, so it never takes {ـة}.',
      points: [
        '{كَبِيرٌ} → {أَكْبَرُ} bigger · {صَغِيرٌ} → {أَصْغَرُ} smaller · {قَرِيبٌ} → {أَقْرَبُ} nearer · {جَمِيلٌ} → {أَجْمَلُ} more beautiful',
        'For “the biggest”, put the same word before a singular noun: {أَكْبَرُ مَدِينَةٍ} (the biggest city). Or add {الْ}: {هُوَ الْأَكْبَرُ} (he is the eldest).',
        '{أَحْسَنُ} means better or best, and {أَكْثَرُ} more or most: {أَكْثَرُ مِنْ سَاعَةٍ} (more than an hour). You already know a famous one: {اللَّهُ أَكْبَرُ} (Allah is the Greatest).',
      ],
    },
    ur: {
      title: 'موازنہ: بڑا، سب سے بڑا', short: '«زیادہ» اور «سب سے» کے لیے {أَفْعَلُ} کا وزن۔',
      intro: 'موازنے کے لیے عربی صفت کو {أَفْعَلُ} کے وزن پر لاتی ہے، اور اس کے بعد {مِنْ} (سے) آتا ہے: {كَبِيرٌ} (بڑا) سے {أَكْبَرُ مِنْ} (سے بڑا)۔ یہ شکل مرد، عورت اور چیز سب کے لیے ایک ہی رہتی ہے، اس پر {ـة} نہیں لگتی۔',
      points: [
        '{كَبِيرٌ} سے {أَكْبَرُ} زیادہ بڑا · {صَغِيرٌ} سے {أَصْغَرُ} زیادہ چھوٹا · {قَرِيبٌ} سے {أَقْرَبُ} زیادہ قریب · {جَمِيلٌ} سے {أَجْمَلُ} زیادہ خوبصورت',
        '«سب سے بڑا» کے لیے یہی لفظ واحد اسم سے پہلے لائیں: {أَكْبَرُ مَدِينَةٍ} (سب سے بڑا شہر)۔ یا {الْ} لگائیں: {هُوَ الْأَكْبَرُ} (وہ سب سے بڑا ہے)۔',
        '{أَحْسَنُ} یعنی بہتر یا سب سے اچھا، اور {أَكْثَرُ} یعنی زیادہ: {أَكْثَرُ مِنْ سَاعَةٍ} (ایک گھنٹے سے زیادہ)۔ ایک مشہور مثال آپ پہلے سے جانتے ہیں: {اللَّهُ أَكْبَرُ} (اللہ سب سے بڑا ہے)۔',
      ],
    },
    ex: [
      ['الرِّيَاضُ أَكْبَرُ مِنْ جِدَّةَ', 'ar-riyaaḍu akbaru min jiddata', 'Riyadh is bigger than Jeddah.', 'ریاض جدہ سے بڑا ہے۔'],
      ['أَخِي أَصْغَرُ مِنِّي', 'akhii aṣgharu minnii', 'My brother is younger than me.', 'میرا بھائی مجھ سے چھوٹا ہے۔'],
      ['هٰذَا الطَّرِيقُ أَقْرَبُ', 'haadha ṭ-ṭariiqu aqrabu', 'This way is shorter (nearer).', 'یہ راستہ زیادہ قریب ہے۔'],
      ['الْقِطَارُ أَسْرَعُ مِنَ الْحَافِلَةِ', 'al-qiṭaaru asraʿu mina l-ḥaafilati', 'The train is faster than the bus.', 'ٹرین بس سے زیادہ تیز ہے۔'],
      ['هٰذَا أَحْسَنُ مَطْعَمٍ فِي الْمَدِينَةِ', 'haadhaa aḥsanu maṭʿamin fil-madiinati', 'This is the best restaurant in the city.', 'یہ شہر کا سب سے اچھا ریستوران ہے۔'],
      ['انْتَظَرْتُ أَكْثَرَ مِنْ سَاعَةٍ', 'intaẓartu akthara min saaʿatin', 'I waited more than an hour.', 'میں نے ایک گھنٹے سے زیادہ انتظار کیا۔'],
      ['هِيَ أَطْوَلُ طَالِبَةٍ فِي الْفَصْلِ', 'hiya aṭwalu ṭaalibatin fil-faṣli', 'She is the tallest student in the class.', 'وہ کلاس کی سب سے لمبی طالبہ ہے۔'],
      ['اللَّهُ أَكْبَرُ', 'allaahu akbar', 'Allah is the Greatest.', 'اللہ سب سے بڑا ہے۔'],
    ],
    practice: [
      { en: 'Make “more beautiful than” from {جَمِيلٌ}.', ur: '{جَمِيلٌ} سے «سے زیادہ خوبصورت» بنائیں۔', a: 'أَجْمَلُ مِنْ', tr: 'ajmalu min' },
      { en: 'Say “My house is bigger than your house.” (to a man)', ur: '«میرا گھر آپ کے گھر سے بڑا ہے» کہیں (مرد سے)۔', a: 'بَيْتِي أَكْبَرُ مِنْ بَيْتِكَ', tr: 'baytii akbaru min baytika' },
      { en: 'Say “the biggest city”.', ur: '«سب سے بڑا شہر» کہیں۔', a: 'أَكْبَرُ مَدِينَةٍ', tr: 'akbaru madiinatin' },
    ],
  },
  {
    slug: 'lesson-23-alladhi', key: 'الَّذِي',
    en: {
      title: 'Joining sentences: who, which, that', short: '{الَّذِي}, {الَّتِي} and {الَّذِينَ}.',
      intro: 'To describe a noun with a whole sentence, Arabic uses {الَّذِي} (alladhii) after a masculine noun and {الَّتِي} (allatii) after a feminine one: {الرَّجُلُ الَّذِي يَعْمَلُ هُنَا} (the man who works here). They come only after a noun with {الـ}. You met {الَّذِينَ} (those who) in Al-Fatiha and Al-Asr.',
      points: [
        '{الَّذِي} who, which (masculine) · {الَّتِي} who, which (feminine, and plural things) · {الَّذِينَ} who (plural people)',
        'After a noun without {الـ}, leave the word out: {رَجُلٌ يَعْمَلُ هُنَا} (a man who works here).',
        'If the noun is the object of the verb, add an ending that points back to it: {الْكِتَابُ الَّذِي قَرَأْتُهُ} (the book that I read, literally “that I read it”).',
      ],
    },
    ur: {
      title: 'جملے جوڑنا: جو، جس', short: '{الَّذِي}، {الَّتِي} اور {الَّذِينَ}۔',
      intro: 'کسی اسم کی وضاحت پورے جملے سے کرنی ہو تو مذکر اسم کے بعد {الَّذِي} اور مؤنث کے بعد {الَّتِي} آتا ہے: {الرَّجُلُ الَّذِي يَعْمَلُ هُنَا} (وہ آدمی جو یہاں کام کرتا ہے)۔ یہ صرف {الـ} والے اسم کے بعد آتے ہیں۔ {الَّذِينَ} (وہ لوگ جو) آپ سورہ فاتحہ اور سورہ عصر میں دیکھ چکے ہیں۔',
      points: [
        '{الَّذِي} جو (مذکر) · {الَّتِي} جو (مؤنث، اور بے جان چیزوں کی جمع) · {الَّذِينَ} جو (لوگوں کی جمع)',
        'اگر اسم پر {الـ} نہ ہو تو یہ لفظ نہیں آتا: {رَجُلٌ يَعْمَلُ هُنَا} (ایک آدمی جو یہاں کام کرتا ہے)۔',
        'اگر اسم فعل کا مفعول ہو تو فعل کے ساتھ ایک لاحقہ اسی کی طرف لوٹتا ہے: {الْكِتَابُ الَّذِي قَرَأْتُهُ} (وہ کتاب جو میں نے پڑھی، لفظی طور پر «جو میں نے اسے پڑھا»)۔',
      ],
    },
    ex: [
      ['الرَّجُلُ الَّذِي يَعْمَلُ هُنَا مِنْ مِصْرَ', 'ar-rajulu lladhii yaʿmalu hunaa min miṣra', 'The man who works here is from Egypt.', 'جو آدمی یہاں کام کرتا ہے وہ مصر سے ہے۔'],
      ['الْمَرْأَةُ الَّتِي تَتَكَلَّمُ طَبِيبَةٌ', 'al-mar’atu llatii tatakallamu ṭabiibatun', 'The woman who is speaking is a doctor.', 'جو خاتون بات کر رہی ہیں وہ ڈاکٹر ہیں۔'],
      ['أَيْنَ الْكِتَابُ الَّذِي اشْتَرَيْتَهُ؟', 'ayna l-kitaabu lladhii shtaraytahuu?', 'Where is the book that you bought? (to a man)', 'وہ کتاب کہاں ہے جو آپ نے خریدی؟'],
      ['هٰذِهِ السَّيَّارَةُ الَّتِي أُرِيدُهَا', 'haadhihi s-sayyaaratu llatii uriiduhaa', 'This is the car that I want.', 'یہ وہ گاڑی ہے جو مجھے چاہیے۔'],
      ['الطُّلَّابُ الَّذِينَ نَجَحُوا سُعَدَاءُ', 'aṭ-ṭullaabu lladhiina najaḥuu suʿadaa’u', 'The students who passed are happy.', 'جو طلبہ کامیاب ہوئے وہ خوش ہیں۔'],
      ['عِنْدِي صَدِيقٌ يَسْكُنُ فِي الرِّيَاضِ', 'ʿindii ṣadiiqun yaskunu fir-riyaaḍi', 'I have a friend who lives in Riyadh.', 'میرا ایک دوست ہے جو ریاض میں رہتا ہے۔'],
      ['الْبُيُوتُ الَّتِي فِي هٰذَا الشَّارِعِ جَدِيدَةٌ', 'al-buyuutu llatii fii haadha sh-shaariʿi jadiidatun', 'The houses on this street are new.', 'اس سڑک پر جو گھر ہیں وہ نئے ہیں۔'],
      ['الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ', 'alladhiina aamanuu wa-ʿamiluu ṣ-ṣaaliḥaati', 'those who believe and do good deeds (from Surah Al-Asr)', 'وہ لوگ جو ایمان لائے اور نیک عمل کیے (سورہ عصر سے)'],
    ],
    practice: [
      { en: 'Say “the teacher who teaches us” (teaches us: {يُدَرِّسُنَا}).', ur: '«وہ استاد جو ہمیں پڑھاتے ہیں» کہیں (ہمیں پڑھاتا ہے: {يُدَرِّسُنَا})۔', a: 'الْمُدَرِّسُ الَّذِي يُدَرِّسُنَا', tr: 'al-mudarrisu lladhii yudarrisunaa' },
      { en: 'Say “the car that I bought”.', ur: '«وہ گاڑی جو میں نے خریدی» کہیں۔', a: 'السَّيَّارَةُ الَّتِي اشْتَرَيْتُهَا', tr: 'as-sayyaaratu llatii shtaraytuhaa', noteEn: 'The noun is feminine, so {الَّتِي}; the ending {ـهَا} on the verb points back to the car.', noteUr: 'اسم مؤنث ہے اس لیے {الَّتِي}؛ فعل پر {ـهَا} گاڑی کی طرف لوٹتا ہے۔' },
      { en: 'Say “a man who works in a hospital” (hospital: {مُسْتَشْفًى}).', ur: '«ایک آدمی جو ہسپتال میں کام کرتا ہے» کہیں (ہسپتال: {مُسْتَشْفًى})۔', a: 'رَجُلٌ يَعْمَلُ فِي مُسْتَشْفًى', tr: 'rajulun yaʿmalu fii mustashfan', noteEn: 'There is no {الـ} on {رَجُلٌ}, so there is no {الَّذِي}.', noteUr: '{رَجُلٌ} پر {الـ} نہیں، اس لیے {الَّذِي} نہیں آیا۔' },
    ],
  },
  {
    slug: 'lesson-24-time', key: 'السَّاعَةُ',
    en: {
      title: 'Days and time: today, tomorrow, what time is it?', short: 'Yesterday and tomorrow, and telling the time.',
      intro: 'Ask the time with {كَمِ السَّاعَةُ؟} (kami s-saaʿatu?, What time is it?). The answer uses “the hour” and an order word: {السَّاعَةُ الثَّالِثَةُ} (as-saaʿatu th-thaalithatu) means “three o’clock”, literally “the third hour”.',
      points: [
        'Hours: {الْوَاحِدَةُ} 1 · {الثَّانِيَةُ} 2 · {الثَّالِثَةُ} 3 · {الرَّابِعَةُ} 4 · {الْخَامِسَةُ} 5 · {السَّادِسَةُ} 6 · {السَّابِعَةُ} 7 · {الثَّامِنَةُ} 8 · {التَّاسِعَةُ} 9 · {الْعَاشِرَةُ} 10',
        'Add {وَالنِّصْفُ} (and a half) or {وَالرُّبْعُ} (and a quarter): {السَّاعَةُ الْخَامِسَةُ وَالنِّصْفُ} (half past five). {إِلَّا رُبْعًا} means “quarter to”.',
        '{الْيَوْمَ} today · {أَمْسِ} yesterday · {غَدًا} tomorrow · {صَبَاحًا} in the morning · {مَسَاءً} in the evening. The days of the week are in the vocabulary section.',
      ],
    },
    ur: {
      title: 'دن اور وقت: آج، کل، کیا بجا ہے؟', short: 'گزرا اور آنے والا کل، اور وقت بتانا۔',
      intro: 'وقت پوچھنے کے لیے کہیں {كَمِ السَّاعَةُ؟} (کیا بجا ہے؟)۔ جواب میں «گھنٹہ» کے ساتھ ترتیبی عدد آتا ہے: {السَّاعَةُ الثَّالِثَةُ} یعنی «تین بجے ہیں»، لفظی طور پر «تیسرا گھنٹہ»۔',
      points: [
        'گھنٹے: {الْوَاحِدَةُ} ایک، {الثَّانِيَةُ} دو، {الثَّالِثَةُ} تین، {الرَّابِعَةُ} چار، {الْخَامِسَةُ} پانچ، {السَّادِسَةُ} چھ، {السَّابِعَةُ} سات، {الثَّامِنَةُ} آٹھ، {التَّاسِعَةُ} نو، {الْعَاشِرَةُ} دس',
        '{وَالنِّصْفُ} (ساڑھے) یا {وَالرُّبْعُ} (سوا) لگائیں: {السَّاعَةُ الْخَامِسَةُ وَالنِّصْفُ} (ساڑھے پانچ بجے)۔ {إِلَّا رُبْعًا} کا مطلب ہے «پونے»۔',
        '{الْيَوْمَ} آج · {أَمْسِ} گزرا ہوا کل · {غَدًا} آنے والا کل · {صَبَاحًا} صبح · {مَسَاءً} شام۔ ہفتے کے دن الفاظ کے حصے میں ہیں۔',
      ],
    },
    ex: [
      ['كَمِ السَّاعَةُ؟', 'kami s-saaʿatu?', 'What time is it?', 'کیا بجا ہے؟'],
      ['السَّاعَةُ الثَّالِثَةُ', 'as-saaʿatu th-thaalithatu', 'It’s three o’clock.', 'تین بجے ہیں۔'],
      ['السَّاعَةُ الْخَامِسَةُ وَالنِّصْفُ', 'as-saaʿatu l-khaamisatu wan-niṣfu', 'It’s half past five.', 'ساڑھے پانچ بجے ہیں۔'],
      ['السَّاعَةُ الْعَاشِرَةُ وَالرُّبْعُ', 'as-saaʿatu l-ʿaashiratu war-rubʿu', 'It’s quarter past ten.', 'سوا دس بجے ہیں۔'],
      ['السَّاعَةُ الثَّامِنَةُ إِلَّا رُبْعًا', 'as-saaʿatu th-thaaminatu illaa rubʿan', 'It’s quarter to eight.', 'پونے آٹھ بجے ہیں۔'],
      ['يَبْدَأُ الدَّوَامُ فِي السَّاعَةِ السَّابِعَةِ', 'yabda’u d-dawaamu fis-saaʿati s-saabiʿati', 'Work starts at seven o’clock.', 'ڈیوٹی سات بجے شروع ہوتی ہے۔'],
      ['زُرْتُهُ أَمْسِ', 'zurtuhuu amsi', 'I visited him yesterday.', 'میں کل (گزشتہ) اس سے ملنے گیا۔'],
      ['سَأُسَافِرُ يَوْمَ الْخَمِيسِ', 'sa-usaafiru yawma l-khamiisi', 'I will travel on Thursday.', 'میں جمعرات کو سفر کروں گا۔'],
    ],
    practice: [
      { en: 'Say “It’s four o’clock.”', ur: '«چار بجے ہیں» کہیں۔', a: 'السَّاعَةُ الرَّابِعَةُ', tr: 'as-saaʿatu r-raabiʿatu' },
      { en: 'Say “It’s half past nine.”', ur: '«ساڑھے نو بجے ہیں» کہیں۔', a: 'السَّاعَةُ التَّاسِعَةُ وَالنِّصْفُ', tr: 'as-saaʿatu t-taasiʿatu wan-niṣfu' },
      { en: 'Say “I went to the market yesterday.”', ur: '«میں کل بازار گیا تھا» کہیں۔', a: 'ذَهَبْتُ إِلَى السُّوقِ أَمْسِ', tr: 'dhahabtu ila s-suuqi amsi' },
    ],
  },
  {
    slug: 'lesson-25-kaana', key: 'كَانَ',
    en: {
      title: 'Was and were: {كَانَ}', short: 'Put a sentence into the past with kaana.',
      intro: 'To move a sentence like {الْجَوُّ حَارٌّ} (the weather is hot) into the past, put {كَانَ} (kaana, was) in front of it. The describing word then ends in -an instead of -un: {كَانَ الْجَوُّ حَارًّا} (the weather was hot).',
      points: [
        '{كُنْتُ} I was · {كُنْتَ} you were (m) · {كُنْتِ} you were (f) · {كَانَ} he was · {كَانَتْ} she was · {كُنَّا} we were · {كَانُوا} they were.',
        'The second part takes -an: {كَانَ الْمُدَرِّسُ مَرِيضًا} (the teacher was ill). Places with {فِي} do not change: {كُنْتُ فِي الْبَيْتِ}.',
        'For the future use {سَيَكُونُ} (will be): {سَيَكُونُ الْجَوُّ بَارِدًا} (the weather will be cold).',
      ],
    },
    ur: {
      title: 'تھا اور تھے: {كَانَ}', short: '{كَانَ} سے جملے کو ماضی میں بدلیں۔',
      intro: '{الْجَوُّ حَارٌّ} (موسم گرم ہے) جیسے جملے کو ماضی میں لانے کے لیے اس سے پہلے {كَانَ} (تھا) لگائیں۔ خبر کے آخر میں تنوینِ رفع کی جگہ تنوینِ نصب آ جاتی ہے: {كَانَ الْجَوُّ حَارًّا} (موسم گرم تھا)۔',
      points: [
        '{كُنْتُ} میں تھا · {كُنْتَ} تم تھے (مذکر) · {كُنْتِ} تم تھیں (مؤنث) · {كَانَ} وہ تھا · {كَانَتْ} وہ تھی · {كُنَّا} ہم تھے · {كَانُوا} وہ سب تھے۔',
        'خبر منصوب ہوتی ہے: {كَانَ الْمُدَرِّسُ مَرِيضًا} (استاد بیمار تھے)۔ {فِي} والی جگہ نہیں بدلتی: {كُنْتُ فِي الْبَيْتِ}۔',
        'مستقبل کے لیے {سَيَكُونُ} (ہوگا): {سَيَكُونُ الْجَوُّ بَارِدًا} (موسم ٹھنڈا ہوگا)۔',
      ],
    },
    ex: [
      ['كَانَ الْجَوُّ حَارًّا', 'kaana l-jawwu ḥaarran', 'The weather was hot.', 'موسم گرم تھا۔'],
      ['كُنْتُ مَرِيضًا أَمْسِ', 'kuntu mariiḍan amsi', 'I was ill yesterday.', 'میں کل بیمار تھا۔'],
      ['كَانَتِ الْمَدْرَسَةُ مُغْلَقَةً', 'kaanati l-madrasatu mughlaqatan', 'The school was closed.', 'اسکول بند تھا۔'],
      ['أَيْنَ كُنْتَ؟', 'ayna kunta?', 'Where were you?', 'تم کہاں تھے؟'],
      ['كُنْتُ فِي الْمَسْجِدِ', 'kuntu fil-masjidi', 'I was in the mosque.', 'میں مسجد میں تھا۔'],
      ['كُنَّا طُلَّابًا فِي الْجَامِعَةِ', 'kunnaa ṭullaaban fil-jaamiʿati', 'We were students at the university.', 'ہم یونیورسٹی میں طالب علم تھے۔'],
      ['سَيَكُونُ الْجَوُّ بَارِدًا غَدًا', 'sa-yakuunu l-jawwu baaridan ghadan', 'The weather will be cold tomorrow.', 'کل موسم ٹھنڈا ہوگا۔'],
    ],
    practice: [
      { en: 'Say “The door was open.”', ur: '«دروازہ کھلا تھا» کہیں۔', a: 'كَانَ الْبَابُ مَفْتُوحًا', tr: 'kaana l-baabu maftuuḥan' },
      { en: 'Say “She was a teacher.”', ur: '«وہ استانی تھی» کہیں۔', a: 'كَانَتْ مُدَرِّسَةً', tr: 'kaanat mudarrisatan' },
      { en: 'Say “We were at home.”', ur: '«ہم گھر پر تھے» کہیں۔', a: 'كُنَّا فِي الْبَيْتِ', tr: 'kunnaa fil-bayti' },
    ],
  },
  {
    slug: 'lesson-26-lan', key: 'لَنْ',
    en: {
      title: 'Will not: {لَنْ}', short: 'Say what will not happen.',
      intro: 'To say something will not happen, put {لَنْ} (lan) before the present verb and change its last vowel from -u to -a: {يَذْهَبُ} → {لَنْ يَذْهَبَ} (he will not go). Do not add {سَـ} after {لَنْ}.',
      points: [
        'Three ways to say “not” with verbs: {لَا أَشْرَبُ} I don’t drink (now or usually) · {لَمْ أَشْرَبْ} I didn’t drink · {لَنْ أَشْرَبَ} I won’t drink.',
        'Verbs that end in -uuna lose the -na: {يَذْهَبُونَ} → {لَنْ يَذْهَبُوا} (they will not go).',
        '{لَنْ} is strong and firm. You will hear it in promises: {لَنْ أَنْسَاكَ} (I will never forget you).',
      ],
    },
    ur: {
      title: 'نہیں کرے گا: {لَنْ}', short: 'بتائیں کہ آگے کیا نہیں ہوگا۔',
      intro: 'کسی کام کے آئندہ نہ ہونے کو بتانے کے لیے مضارع سے پہلے {لَنْ} لگائیں اور آخری پیش کو زبر سے بدل دیں: {يَذْهَبُ} ← {لَنْ يَذْهَبَ} (وہ نہیں جائے گا)۔ {لَنْ} کے بعد {سَـ} نہ لگائیں۔',
      points: [
        'فعل کی نفی کے تین طریقے: {لَا أَشْرَبُ} میں نہیں پیتا · {لَمْ أَشْرَبْ} میں نے نہیں پیا · {لَنْ أَشْرَبَ} میں نہیں پیوں گا۔',
        'جو افعال {ـونَ} پر ختم ہوں ان کا نون گر جاتا ہے: {يَذْهَبُونَ} ← {لَنْ يَذْهَبُوا} (وہ نہیں جائیں گے)۔',
        '{لَنْ} پختہ نفی ہے، وعدوں میں اکثر آتا ہے: {لَنْ أَنْسَاكَ} (میں تمہیں کبھی نہیں بھولوں گا)۔',
      ],
    },
    ex: [
      ['لَنْ أَذْهَبَ إِلَى السُّوقِ الْيَوْمَ', 'lan adhhaba ila s-suuqi l-yawma', 'I will not go to the market today.', 'میں آج بازار نہیں جاؤں گا۔'],
      ['لَنْ يَتَأَخَّرَ', 'lan yata’akhkhara', 'He will not be late.', 'وہ دیر نہیں کرے گا۔'],
      ['لَنْ نَنْسَاكَ', 'lan nansaaka', 'We will not forget you.', 'ہم تمہیں نہیں بھولیں گے۔'],
      ['لَا أَشْرَبُ الشَّايَ', 'laa ashrabu sh-shaaya', 'I don’t drink tea.', 'میں چائے نہیں پیتا۔'],
      ['لَمْ أَشْرَبِ الشَّايَ', 'lam ashrabi sh-shaaya', 'I did not drink the tea.', 'میں نے چائے نہیں پی۔'],
      ['لَنْ أَشْرَبَ الشَّايَ', 'lan ashraba sh-shaaya', 'I will not drink the tea.', 'میں چائے نہیں پیوں گا۔'],
      ['لَنْ يَحْضُرُوا الدَّرْسَ', 'lan yaḥḍuruu d-darsa', 'They will not attend the lesson.', 'وہ سبق میں حاضر نہیں ہوں گے۔'],
    ],
    practice: [
      { en: 'Say “I will not be late.”', ur: '«میں دیر نہیں کروں گا» کہیں۔', a: 'لَنْ أَتَأَخَّرَ', tr: 'lan ata’akhkhara' },
      { en: 'Say “She will not travel tomorrow.”', ur: '«وہ کل سفر نہیں کرے گی» کہیں۔', a: 'لَنْ تُسَافِرَ غَدًا', tr: 'lan tusaafira ghadan' },
      { en: 'Change {سَأَكْتُبُ} to “I will not write.”', ur: '{سَأَكْتُبُ} کو «میں نہیں لکھوں گا» میں بدلیں۔', a: 'لَنْ أَكْتُبَ', tr: 'lan aktuba' },
    ],
  },
  {
    slug: 'lesson-27-dont', key: 'لَا تَكْتُبْ',
    en: {
      title: 'Don’t! {لَا تَفْعَلْ}', short: 'Tell someone not to do something.',
      intro: 'To tell someone not to do something, put {لَا} before the “you” form of the present verb and make its ending silent: {تَكْتُبُ} → {لَا تَكْتُبْ} (don’t write). This is different from {لَا تَكْتُبُ} (you don’t write), which only describes.',
      points: [
        'To a man: {لَا تَجْلِسْ} · to a woman: {لَا تَجْلِسِي} · to a group: {لَا تَجْلِسُوا}.',
        'Add {مِنْ فَضْلِكَ} (please) to sound polite: {لَا تُدَخِّنْ مِنْ فَضْلِكَ} (please don’t smoke).',
        'Two you will often hear: {لَا تَخَفْ} (don’t be afraid) and {لَا تَحْزَنْ} (don’t be sad). The second appears in the Quran: {لَا تَحْزَنْ إِنَّ اللّٰهَ مَعَنَا}.',
      ],
    },
    ur: {
      title: 'ایسا نہ کرو! {لَا تَفْعَلْ}', short: 'کسی کو کسی کام سے روکیں۔',
      intro: 'کسی کو کسی کام سے روکنے کے لیے حاضر کے مضارع سے پہلے {لَا} لگائیں اور آخر ساکن کر دیں: {تَكْتُبُ} ← {لَا تَكْتُبْ} (مت لکھو)۔ یہ {لَا تَكْتُبُ} (تم نہیں لکھتے) سے مختلف ہے، جو صرف خبر دیتا ہے۔',
      points: [
        'مرد سے: {لَا تَجْلِسْ} · عورت سے: {لَا تَجْلِسِي} · جماعت سے: {لَا تَجْلِسُوا}۔',
        'شائستگی کے لیے {مِنْ فَضْلِكَ} (براہ کرم) لگائیں: {لَا تُدَخِّنْ مِنْ فَضْلِكَ} (براہ کرم سگریٹ نہ پئیں)۔',
        'دو عام جملے: {لَا تَخَفْ} (ڈرو مت) اور {لَا تَحْزَنْ} (غم نہ کرو)۔ دوسرا قرآن میں آیا ہے: {لَا تَحْزَنْ إِنَّ اللّٰهَ مَعَنَا}۔',
      ],
    },
    ex: [
      ['لَا تَتَأَخَّرْ', 'laa tata’akhkhar', 'Don’t be late.', 'دیر نہ کرو۔'],
      ['لَا تَتَكَلَّمْ فِي الْفَصْلِ', 'laa tatakallam fil-faṣli', 'Don’t talk in class.', 'کلاس میں باتیں نہ کرو۔'],
      ['لَا تَنْسَيْ كِتَابَكِ', 'laa tansay kitaabaki', 'Don’t forget your book (to a woman).', 'اپنی کتاب نہ بھولنا (عورت سے)۔'],
      ['لَا تَلْعَبُوا هُنَا', 'laa talʿabuu hunaa', 'Don’t play here (to a group).', 'یہاں مت کھیلو (جماعت سے)۔'],
      ['لَا تَخَفْ', 'laa takhaf', 'Don’t be afraid.', 'ڈرو مت۔'],
      ['لَا تَحْزَنْ', 'laa taḥzan', 'Don’t be sad.', 'غم نہ کرو۔'],
      ['لَا تَفْتَحِ النَّافِذَةَ مِنْ فَضْلِكَ', 'laa taftaḥi n-naafidhata min faḍlika', 'Please don’t open the window.', 'براہ کرم کھڑکی نہ کھولیں۔'],
    ],
    practice: [
      { en: 'Tell a man “Don’t sit here.”', ur: 'مرد سے کہیں «یہاں نہ بیٹھو»۔', a: 'لَا تَجْلِسْ هُنَا', tr: 'laa tajlis hunaa' },
      { en: 'Say “Don’t write on the door.”', ur: '«دروازے پر نہ لکھو» کہیں۔', a: 'لَا تَكْتُبْ عَلَى الْبَابِ', tr: 'laa taktub ʿala l-baabi' },
      { en: 'Tell a group “Don’t go.”', ur: 'جماعت سے کہیں «مت جاؤ»۔', a: 'لَا تَذْهَبُوا', tr: 'laa tadhhabuu' },
    ],
  },
  {
    slug: 'lesson-28-ordinals-days', key: 'الْأَوَّلُ',
    en: {
      title: 'First, second, third and the days of the week', short: 'Order words, and the seven days.',
      intro: 'Order words come after the noun, like adjectives, and match it: {الدَّرْسُ الْأَوَّلُ} (the first lesson), {الْحِصَّةُ الْأُولَى} (the first class). From “second” onwards they follow one pattern: {ثَانٍ}, {ثَالِثٌ}, {رَابِعٌ}.',
      points: [
        '{الْأَوَّلُ} 1st · {الثَّانِي} 2nd · {الثَّالِثُ} 3rd · {الرَّابِعُ} 4th · {الْخَامِسُ} 5th · {السَّادِسُ} 6th · {السَّابِعُ} 7th · {الثَّامِنُ} 8th · {التَّاسِعُ} 9th · {الْعَاشِرُ} 10th. For feminine nouns add {ـة}, but “first” becomes {الْأُولَى}.',
        'Days: {السَّبْتُ} Saturday · {الْأَحَدُ} Sunday · {الِاثْنَيْنِ} Monday · {الثُّلَاثَاءُ} Tuesday · {الْأَرْبِعَاءُ} Wednesday · {الْخَمِيسُ} Thursday · {الْجُمُعَةُ} Friday.',
        'Sunday to Thursday are named from numbers: {الْأَحَدُ} from one, {الِاثْنَيْنِ} from two, {الْخَمِيسُ} from five. {الْجُمُعَةُ} means “the gathering”.',
      ],
    },
    ur: {
      title: 'پہلا، دوسرا، تیسرا اور ہفتے کے دن', short: 'ترتیبی اعداد اور سات دن۔',
      intro: 'ترتیبی عدد صفت کی طرح اسم کے بعد آتا ہے اور اس سے مطابقت رکھتا ہے: {الدَّرْسُ الْأَوَّلُ} (پہلا سبق)، {الْحِصَّةُ الْأُولَى} (پہلا پیریڈ)۔ «دوسرا» سے آگے سب ایک ہی وزن پر ہیں: {ثَانٍ}، {ثَالِثٌ}، {رَابِعٌ}۔',
      points: [
        '{الْأَوَّلُ} پہلا · {الثَّانِي} دوسرا · {الثَّالِثُ} تیسرا · {الرَّابِعُ} چوتھا · {الْخَامِسُ} پانچواں · {السَّادِسُ} چھٹا · {السَّابِعُ} ساتواں · {الثَّامِنُ} آٹھواں · {التَّاسِعُ} نواں · {الْعَاشِرُ} دسواں۔ مؤنث کے لیے {ـة} لگائیں، مگر «پہلی» {الْأُولَى} ہے۔',
        'دن: {السَّبْتُ} ہفتہ · {الْأَحَدُ} اتوار · {الِاثْنَيْنِ} پیر · {الثُّلَاثَاءُ} منگل · {الْأَرْبِعَاءُ} بدھ · {الْخَمِيسُ} جمعرات · {الْجُمُعَةُ} جمعہ۔',
        'اتوار سے جمعرات تک کے نام اعداد سے بنے ہیں: {الْأَحَدُ} ایک سے، {الِاثْنَيْنِ} دو سے، {الْخَمِيسُ} پانچ سے۔ {الْجُمُعَةُ} کا مطلب ہے «اجتماع کا دن»۔',
      ],
    },
    ex: [
      ['الدَّرْسُ الْأَوَّلُ', 'ad-darsu l-awwalu', 'the first lesson', 'پہلا سبق'],
      ['الْحِصَّةُ الْأُولَى', 'al-ḥiṣṣatu l-uulaa', 'the first class (period)', 'پہلا پیریڈ'],
      ['الطَّابِقُ الثَّالِثُ', 'aṭ-ṭaabiqu th-thaalithu', 'the third floor', 'تیسری منزل'],
      ['السَّيَّارَةُ الثَّانِيَةُ', 'as-sayyaaratu th-thaaniyatu', 'the second car', 'دوسری گاڑی'],
      ['مَا الْيَوْمُ؟', 'ma l-yawmu?', 'What day is it today?', 'آج کون سا دن ہے؟'],
      ['الْيَوْمُ يَوْمُ الْأَحَدِ', 'al-yawmu yawmu l-aḥadi', 'Today is Sunday.', 'آج اتوار ہے۔'],
      ['الْجُمُعَةُ يَوْمُ عُطْلَةٍ', 'al-jumuʿatu yawmu ʿuṭlatin', 'Friday is a day off.', 'جمعہ چھٹی کا دن ہے۔'],
      ['أَنَا فِي الصَّفِّ الْخَامِسِ', 'ana fiṣ-ṣaffi l-khaamisi', 'I am in the fifth grade.', 'میں پانچویں جماعت میں ہوں۔'],
    ],
    practice: [
      { en: 'Say “the fourth lesson”.', ur: '«چوتھا سبق» کہیں۔', a: 'الدَّرْسُ الرَّابِعُ', tr: 'ad-darsu r-raabiʿu' },
      { en: 'Say “the first car”.', ur: '«پہلی گاڑی» کہیں۔', a: 'السَّيَّارَةُ الْأُولَى', tr: 'as-sayyaaratu l-uulaa' },
      { en: 'Say “Today is Thursday.”', ur: '«آج جمعرات ہے» کہیں۔', a: 'الْيَوْمُ يَوْمُ الْخَمِيسِ', tr: 'al-yawmu yawmu l-khamiisi' },
    ],
  },
  {
    slug: 'lesson-29-abu-akhu', key: 'أَبُو',
    en: {
      title: 'Father of, brother of: {أَبُو} and {أَخُو}', short: 'Short nouns that grow a long vowel.',
      intro: 'A few short nouns, such as {أَبٌ} (father), {أَخٌ} (brother) and {ذُو} (owner of), take a long vowel when another noun or a pronoun follows them: {أَبُو مُحَمَّدٍ} (Muhammad’s father), {أَخُوكَ} (your brother). The long vowel shows the word’s job in the sentence.',
      points: [
        'As the subject it ends in -uu: {هٰذَا أَبُو خَالِدٍ}. As the object it ends in -aa: {رَأَيْتُ أَبَا خَالِدٍ}. After a preposition it ends in -ii: {سَلَّمْتُ عَلَى أَبِي خَالِدٍ}.',
        'Many famous names use this pattern: {أَبُو بَكْرٍ}, {أَبُو هُرَيْرَةَ}. Arabs often call a man “father of” his eldest son.',
        '{ذُو} means “having” or “owner of”: {رَجُلٌ ذُو عِلْمٍ} (a man of knowledge). For a woman use {ذَاتُ}.',
      ],
    },
    ur: {
      title: 'باپ، بھائی: {أَبُو} اور {أَخُو}', short: 'وہ مختصر اسم جن میں حرفِ علت بڑھ جاتا ہے۔',
      intro: 'چند مختصر اسم، جیسے {أَبٌ} (باپ)، {أَخٌ} (بھائی) اور {ذُو} (والا)، جب کسی اسم یا ضمیر کی طرف مضاف ہوں تو ان کے آخر میں حرفِ علت آ جاتا ہے: {أَبُو مُحَمَّدٍ} (محمد کے والد)، {أَخُوكَ} (تمہارا بھائی)۔ یہی حرف جملے میں لفظ کا کردار بتاتا ہے۔',
      points: [
        'فاعل یا مبتدا ہو تو واو: {هٰذَا أَبُو خَالِدٍ}۔ مفعول ہو تو الف: {رَأَيْتُ أَبَا خَالِدٍ}۔ حرفِ جر کے بعد یا: {سَلَّمْتُ عَلَى أَبِي خَالِدٍ}۔',
        'بہت سے مشہور نام اسی طرز پر ہیں: {أَبُو بَكْرٍ}، {أَبُو هُرَيْرَةَ}۔ عرب اکثر آدمی کو اس کے بڑے بیٹے کے نام سے «ابو فلاں» کہتے ہیں۔',
        '{ذُو} کا مطلب ہے «والا»: {رَجُلٌ ذُو عِلْمٍ} (علم والا آدمی)۔ عورت کے لیے {ذَاتُ}۔',
      ],
    },
    ex: [
      ['هٰذَا أَبُو خَالِدٍ', 'haadhaa abuu khaalidin', 'This is Khalid’s father.', 'یہ خالد کے والد ہیں۔'],
      ['أَيْنَ أَخُوكَ؟', 'ayna akhuuka?', 'Where is your brother?', 'تمہارا بھائی کہاں ہے؟'],
      ['رَأَيْتُ أَبَاكَ فِي الْمَسْجِدِ', 'ra’aytu abaaka fil-masjidi', 'I saw your father in the mosque.', 'میں نے تمہارے والد کو مسجد میں دیکھا۔'],
      ['سَلَّمْتُ عَلَى أَخِيكَ', 'sallamtu ʿalaa akhiika', 'I greeted your brother.', 'میں نے تمہارے بھائی کو سلام کیا۔'],
      ['أَبُو بَكْرٍ صَدِيقُ النَّبِيِّ', 'abuu bakrin ṣadiiqu n-nabiyyi', 'Abu Bakr is the Prophet’s friend.', 'ابو بکرؓ نبی ﷺ کے دوست ہیں۔'],
      ['هُوَ رَجُلٌ ذُو عِلْمٍ', 'huwa rajulun dhuu ʿilmin', 'He is a man of knowledge.', 'وہ علم والا آدمی ہے۔'],
    ],
    practice: [
      { en: 'Say “This is your brother.”', ur: '«یہ تمہارا بھائی ہے» کہیں۔', a: 'هٰذَا أَخُوكَ', tr: 'haadhaa akhuuka' },
      { en: 'Say “I know your father.”', ur: '«میں تمہارے والد کو جانتا ہوں» کہیں۔', a: 'أَعْرِفُ أَبَاكَ', tr: 'aʿrifu abaaka' },
      { en: 'Say “I went with your brother.”', ur: '«میں تمہارے بھائی کے ساتھ گیا» کہیں۔', a: 'ذَهَبْتُ مَعَ أَخِيكَ', tr: 'dhahabtu maʿa akhiika' },
    ],
  },
  {
    slug: 'lesson-30-how-beautiful', key: 'مَا أَجْمَلَ',
    en: {
      title: 'How beautiful! {مَا أَجْمَلَ}', short: 'Show wonder and admiration.',
      intro: 'To say “How beautiful…!”, put {مَا} before the {أَفْعَلَ} form of the adjective, then the noun ending in -a: {مَا أَجْمَلَ الْمَسْجِدَ!} (How beautiful the mosque is!). With a pronoun: {مَا أَجْمَلَهُ!} (How beautiful it is!).',
      points: [
        'Make it from the adjective: {جَمِيلٌ} → {مَا أَجْمَلَ} · {كَبِيرٌ} → {مَا أَكْبَرَ} · {حَسَنٌ} → {مَا أَحْسَنَ} · {بَارِدٌ} → {مَا أَبْرَدَ}.',
        'The noun after it always ends in -a: {مَا أَطْيَبَ الطَّعَامَ!} (How delicious the food is!).',
        'Don’t confuse it with the question {مَا هٰذَا؟} (What is this?). The {أَفْعَلَ} shape after {مَا} tells you it is wonder, not a question.',
      ],
    },
    ur: {
      title: 'کتنا خوبصورت! {مَا أَجْمَلَ}', short: 'تعجب اور تعریف کا اظہار۔',
      intro: '«کتنا خوبصورت…!» کہنے کے لیے صفت کے {أَفْعَلَ} وزن سے پہلے {مَا} لگائیں، پھر اسم زبر کے ساتھ: {مَا أَجْمَلَ الْمَسْجِدَ!} (مسجد کتنی خوبصورت ہے!)۔ ضمیر کے ساتھ: {مَا أَجْمَلَهُ!} (یہ کتنا خوبصورت ہے!)۔',
      points: [
        'صفت سے بنائیں: {جَمِيلٌ} ← {مَا أَجْمَلَ} · {كَبِيرٌ} ← {مَا أَكْبَرَ} · {حَسَنٌ} ← {مَا أَحْسَنَ} · {بَارِدٌ} ← {مَا أَبْرَدَ}۔',
        'بعد والا اسم ہمیشہ منصوب ہوتا ہے: {مَا أَطْيَبَ الطَّعَامَ!} (کھانا کتنا مزیدار ہے!)۔',
        'اسے سوال {مَا هٰذَا؟} (یہ کیا ہے؟) سے نہ ملائیں۔ {مَا} کے بعد {أَفْعَلَ} کا وزن بتاتا ہے کہ یہ تعجب ہے، سوال نہیں۔',
      ],
    },
    ex: [
      ['مَا أَجْمَلَ الْحَدِيقَةَ!', 'maa ajmala l-ḥadiiqata!', 'How beautiful the garden is!', 'باغ کتنا خوبصورت ہے!'],
      ['مَا أَكْبَرَ هٰذَا الْبَيْتَ!', 'maa akbara haadha l-bayta!', 'How big this house is!', 'یہ گھر کتنا بڑا ہے!'],
      ['مَا أَبْرَدَ الْمَاءَ!', 'maa abrada l-maa’a!', 'How cold the water is!', 'پانی کتنا ٹھنڈا ہے!'],
      ['مَا أَحْسَنَ خَطَّكَ!', 'maa aḥsana khaṭṭaka!', 'How good your handwriting is!', 'تمہاری لکھائی کتنی اچھی ہے!'],
      ['مَا أَطْيَبَ هٰذَا الطَّعَامَ!', 'maa aṭyaba haadha ṭ-ṭaʿaama!', 'How delicious this food is!', 'یہ کھانا کتنا مزیدار ہے!'],
      ['مَا أَجْمَلَهَا!', 'maa ajmalahaa!', 'How beautiful she is!', 'وہ کتنی خوبصورت ہے!'],
    ],
    practice: [
      { en: 'Say “How big the mosque is!”', ur: '«مسجد کتنی بڑی ہے!» کہیں۔', a: 'مَا أَكْبَرَ الْمَسْجِدَ!', tr: 'maa akbara l-masjida!' },
      { en: 'Say “How cold the weather is!”', ur: '«موسم کتنا ٹھنڈا ہے!» کہیں۔', a: 'مَا أَبْرَدَ الْجَوَّ!', tr: 'maa abrada l-jawwa!' },
      { en: 'Say “How beautiful it is!” (masculine)', ur: '«یہ کتنا خوبصورت ہے!» (مذکر) کہیں۔', a: 'مَا أَجْمَلَهُ!', tr: 'maa ajmalahu!' },
    ],
  },
  {
    slug: 'lesson-31-an', key: 'أَنْ',
    en: {
      title: 'I want to…: {أَنْ} + verb', short: 'Join two verbs: want to, like to, can, must.',
      intro: 'To join two verbs, as in “I want to go”, put {أَنْ} (an, to) before the second verb and change its last vowel from -u to -a: {أُرِيدُ أَنْ أَذْهَبَ} (I want to go). Both verbs match the person: {يُرِيدُ أَنْ يَذْهَبَ} (he wants to go).',
      points: [
        'Verbs that often come before {أَنْ}: {أُرِيدُ} I want · {أُحِبُّ} I like · {أَسْتَطِيعُ} I can · {أُحَاوِلُ} I try · {يَجِبُ عَلَيَّ} I must.',
        'Verbs ending in -uuna lose the -na after {أَنْ}: {يُرِيدُونَ أَنْ يَنَامُوا} (they want to sleep).',
        '{يَجِبُ عَلَى} + person means “must”: {يَجِبُ عَلَيْكَ أَنْ تَدْرُسَ} (you must study).',
      ],
    },
    ur: {
      title: 'میں … چاہتا ہوں: {أَنْ} + فعل', short: 'دو فعل جوڑیں: چاہنا، پسند کرنا، سکنا، لازم ہونا۔',
      intro: '«میں جانا چاہتا ہوں» جیسے جملے میں دو فعل جوڑنے کے لیے دوسرے فعل سے پہلے {أَنْ} لگائیں اور اس کا آخری پیش زبر سے بدل دیں: {أُرِيدُ أَنْ أَذْهَبَ} (میں جانا چاہتا ہوں)۔ دونوں فعل ایک ہی شخص کے صیغے میں ہوتے ہیں: {يُرِيدُ أَنْ يَذْهَبَ} (وہ جانا چاہتا ہے)۔',
      points: [
        '{أَنْ} سے پہلے اکثر آنے والے افعال: {أُرِيدُ} میں چاہتا ہوں · {أُحِبُّ} مجھے پسند ہے · {أَسْتَطِيعُ} میں سکتا ہوں · {أُحَاوِلُ} میں کوشش کرتا ہوں · {يَجِبُ عَلَيَّ} مجھ پر لازم ہے۔',
        '{ـونَ} والے افعال کا نون {أَنْ} کے بعد گر جاتا ہے: {يُرِيدُونَ أَنْ يَنَامُوا} (وہ سونا چاہتے ہیں)۔',
        '{يَجِبُ عَلَى} کا مطلب ہے «لازم ہے»: {يَجِبُ عَلَيْكَ أَنْ تَدْرُسَ} (تمہیں پڑھنا چاہیے)۔',
      ],
    },
    ex: [
      ['أُرِيدُ أَنْ أَشْرَبَ الْمَاءَ', 'uriidu an ashraba l-maa’a', 'I want to drink water.', 'میں پانی پینا چاہتا ہوں۔'],
      ['هَلْ تَسْتَطِيعُ أَنْ تَكْتُبَ بِالْعَرَبِيَّةِ؟', 'hal tastaṭiiʿu an taktuba bil-ʿarabiyyati?', 'Can you write in Arabic?', 'کیا تم عربی میں لکھ سکتے ہو؟'],
      ['أُحِبُّ أَنْ أَقْرَأَ الْقِصَصَ', 'uḥibbu an aqra’a l-qiṣaṣa', 'I like to read stories.', 'مجھے کہانیاں پڑھنا پسند ہے۔'],
      ['يَجِبُ عَلَيْنَا أَنْ نُصَلِّيَ', 'yajibu ʿalaynaa an nuṣalliya', 'We must pray.', 'ہم پر نماز پڑھنا لازم ہے۔'],
      ['يُرِيدُ أَنْ يُسَافِرَ إِلَى الْمَدِينَةِ', 'yuriidu an yusaafira ila l-madiinati', 'He wants to travel to Madinah.', 'وہ مدینہ کا سفر کرنا چاہتا ہے۔'],
      ['يُرِيدُونَ أَنْ يَنَامُوا', 'yuriiduuna an yanaamuu', 'They want to sleep.', 'وہ سونا چاہتے ہیں۔'],
    ],
    practice: [
      { en: 'Say “I want to go to the mosque.”', ur: '«میں مسجد جانا چاہتا ہوں» کہیں۔', a: 'أُرِيدُ أَنْ أَذْهَبَ إِلَى الْمَسْجِدِ', tr: 'uriidu an adhhaba ila l-masjidi' },
      { en: 'Say “She wants to read.”', ur: '«وہ پڑھنا چاہتی ہے» کہیں۔', a: 'تُرِيدُ أَنْ تَقْرَأَ', tr: 'turiidu an taqra’a' },
      { en: 'Ask “Can you open the door?”', ur: 'پوچھیں «کیا تم دروازہ کھول سکتے ہو؟»', a: 'هَلْ تَسْتَطِيعُ أَنْ تَفْتَحَ الْبَابَ؟', tr: 'hal tastaṭiiʿu an taftaḥa l-baaba?' },
    ],
  },
  {
    slug: 'lesson-32-colours', key: 'أَحْمَرُ',
    en: {
      title: 'Colours: {أَحْمَرُ} and {حَمْرَاءُ}', short: 'Red, blue, green… for masculine and feminine.',
      intro: 'The main colour words have one form for masculine nouns and another for feminine nouns: {قَلَمٌ أَحْمَرُ} (a red pen) but {سَيَّارَةٌ حَمْرَاءُ} (a red car). Colour words never take the -un ending: say {أَحْمَرُ}, not “aḥmarun”.',
      points: [
        '{أَحْمَرُ / حَمْرَاءُ} red · {أَزْرَقُ / زَرْقَاءُ} blue · {أَخْضَرُ / خَضْرَاءُ} green · {أَصْفَرُ / صَفْرَاءُ} yellow · {أَبْيَضُ / بَيْضَاءُ} white · {أَسْوَدُ / سَوْدَاءُ} black.',
        'Ask about colour with {مَا لَوْنُ…؟}: {مَا لَوْنُ السَّيَّارَةِ؟} (What colour is the car?)',
        'Other colours are made by adding {ـيٌّ} to a thing: {بُنِّيٌّ} brown (from {بُنٌّ}, coffee beans), {رَمَادِيٌّ} grey (from {رَمَادٌ}, ash), {بُرْتُقَالِيٌّ} orange.',
      ],
    },
    ur: {
      title: 'رنگ: {أَحْمَرُ} اور {حَمْرَاءُ}', short: 'لال، نیلا، سبز… مذکر اور مؤنث کے لیے۔',
      intro: 'بنیادی رنگوں کی ایک شکل مذکر کے لیے اور دوسری مؤنث کے لیے ہوتی ہے: {قَلَمٌ أَحْمَرُ} (لال قلم) مگر {سَيَّارَةٌ حَمْرَاءُ} (لال گاڑی)۔ رنگوں پر تنوین نہیں آتی: {أَحْمَرُ} کہیں، «أَحْمَرٌ» نہیں۔',
      points: [
        '{أَحْمَرُ / حَمْرَاءُ} لال · {أَزْرَقُ / زَرْقَاءُ} نیلا · {أَخْضَرُ / خَضْرَاءُ} سبز · {أَصْفَرُ / صَفْرَاءُ} پیلا · {أَبْيَضُ / بَيْضَاءُ} سفید · {أَسْوَدُ / سَوْدَاءُ} کالا۔',
        'رنگ پوچھنے کے لیے {مَا لَوْنُ…؟}: {مَا لَوْنُ السَّيَّارَةِ؟} (گاڑی کس رنگ کی ہے؟)',
        'دوسرے رنگ کسی چیز کے نام پر {ـيٌّ} لگا کر بنتے ہیں: {بُنِّيٌّ} بھورا ({بُنٌّ} یعنی کافی کے دانے سے)، {رَمَادِيٌّ} سرمئی ({رَمَادٌ} یعنی راکھ سے)، {بُرْتُقَالِيٌّ} نارنجی۔',
      ],
    },
    ex: [
      ['قَلَمٌ أَحْمَرُ', 'qalamun aḥmaru', 'a red pen', 'لال قلم'],
      ['سَيَّارَةٌ حَمْرَاءُ', 'sayyaaratun ḥamraa’u', 'a red car', 'لال گاڑی'],
      ['السَّمَاءُ زَرْقَاءُ', 'as-samaa’u zarqaa’u', 'The sky is blue.', 'آسمان نیلا ہے۔'],
      ['الشَّجَرَةُ خَضْرَاءُ', 'ash-shajaratu khaḍraa’u', 'The tree is green.', 'درخت سبز ہے۔'],
      ['مَا لَوْنُ قَمِيصِكَ؟', 'maa lawnu qamiiṣika?', 'What colour is your shirt?', 'تمہاری قمیص کس رنگ کی ہے؟'],
      ['قَمِيصِي أَبْيَضُ', 'qamiiṣii abyaḍu', 'My shirt is white.', 'میری قمیص سفید ہے۔'],
    ],
    practice: [
      { en: 'Say “a black bag” ({حَقِيبَةٌ} is feminine).', ur: '«کالا بستہ» کہیں ({حَقِيبَةٌ} مؤنث ہے)۔', a: 'حَقِيبَةٌ سَوْدَاءُ', tr: 'ḥaqiibatun sawdaa’u' },
      { en: 'Say “The book is green.”', ur: '«کتاب سبز ہے» کہیں۔', a: 'الْكِتَابُ أَخْضَرُ', tr: 'al-kitaabu akhḍaru' },
      { en: 'Say “a yellow apple” ({تُفَّاحَةٌ} is feminine).', ur: '«پیلا سیب» کہیں ({تُفَّاحَةٌ} مؤنث ہے)۔', a: 'تُفَّاحَةٌ صَفْرَاءُ', tr: 'tuffaaḥatun ṣafraa’u' },
    ],
  },
  {
    slug: 'lesson-33-numbers-11-100', key: 'عِشْرُونَ',
    en: {
      title: 'Numbers 11 to 100', short: 'Eleven, twenty, twenty-five, a hundred.',
      intro: '11 is {أَحَدَ عَشَرَ} and 12 is {اثْنَا عَشَرَ}. For 13 to 19, join a unit to {عَشَرَ}: {ثَلَاثَةَ عَشَرَ} (13). After any number from 11 to 99 the noun is singular and ends in -an: {خَمْسَةَ عَشَرَ طَالِبًا} (15 students).',
      points: [
        'Tens: {عِشْرُونَ} 20 · {ثَلَاثُونَ} 30 · {أَرْبَعُونَ} 40 · {خَمْسُونَ} 50 · {سِتُّونَ} 60 · {سَبْعُونَ} 70 · {ثَمَانُونَ} 80 · {تِسْعُونَ} 90 · {مِائَةٌ} 100.',
        'For 21 to 99 say the unit first, then {وَ}, then the tens, just as Urdu says «پچیس»: {خَمْسَةٌ وَعِشْرُونَ} (25, “five and twenty”).',
        'After 100 the noun ends in -i: {مِائَةُ رِيَالٍ} (a hundred riyals). After a preposition the tens end in -iina: {بِعِشْرِينَ رِيَالًا} (for twenty riyals).',
      ],
    },
    ur: {
      title: 'گیارہ سے سو تک گنتی', short: 'گیارہ، بیس، پچیس، سو۔',
      intro: '۱۱ ہے {أَحَدَ عَشَرَ} اور ۱۲ ہے {اثْنَا عَشَرَ}۔ ۱۳ سے ۱۹ تک اکائی کو {عَشَرَ} سے جوڑیں: {ثَلَاثَةَ عَشَرَ} (۱۳)۔ ۱۱ سے ۹۹ تک کے کسی بھی عدد کے بعد اسم واحد اور منصوب ہوتا ہے: {خَمْسَةَ عَشَرَ طَالِبًا} (پندرہ طالب علم)۔',
      points: [
        'دہائیاں: {عِشْرُونَ} ۲۰ · {ثَلَاثُونَ} ۳۰ · {أَرْبَعُونَ} ۴۰ · {خَمْسُونَ} ۵۰ · {سِتُّونَ} ۶۰ · {سَبْعُونَ} ۷۰ · {ثَمَانُونَ} ۸۰ · {تِسْعُونَ} ۹۰ · {مِائَةٌ} ۱۰۰۔',
        '۲۱ سے ۹۹ تک پہلے اکائی، پھر {وَ}، پھر دہائی، بالکل اردو کے «پچیس» کی طرح: {خَمْسَةٌ وَعِشْرُونَ} (۲۵، «پانچ اور بیس»)۔',
        '۱۰۰ کے بعد اسم مجرور ہوتا ہے: {مِائَةُ رِيَالٍ} (سو ریال)۔ حرفِ جر کے بعد دہائی {ـِينَ} پر ختم ہوتی ہے: {بِعِشْرِينَ رِيَالًا} (بیس ریال میں)۔',
      ],
    },
    ex: [
      ['أَحَدَ عَشَرَ كَوْكَبًا', 'aḥada ʿashara kawkaban', 'eleven stars (Quran 12:4)', 'گیارہ ستارے (سورہ یوسف ۴)'],
      ['اثْنَا عَشَرَ شَهْرًا', 'ithnaa ʿashara shahran', 'twelve months', 'بارہ مہینے'],
      ['فِي الْفَصْلِ خَمْسَةَ عَشَرَ طَالِبًا', 'fil-faṣli khamsata ʿashara ṭaaliban', 'There are fifteen students in the class.', 'کلاس میں پندرہ طالب علم ہیں۔'],
      ['عُمْرِي عِشْرُونَ سَنَةً', 'ʿumrii ʿishruuna sanatan', 'I am twenty years old.', 'میری عمر بیس سال ہے۔'],
      ['الشَّهْرُ ثَلَاثُونَ يَوْمًا', 'ash-shahru thalaathuuna yawman', 'The month is thirty days long.', 'مہینہ تیس دن کا ہے۔'],
      ['بِخَمْسَةٍ وَعِشْرِينَ رِيَالًا', 'bi-khamsatin wa-ʿishriina riyaalan', 'for twenty-five riyals', 'پچیس ریال میں'],
      ['مِائَةُ رِيَالٍ', 'mi’atu riyaalin', 'a hundred riyals', 'سو ریال'],
    ],
    practice: [
      { en: 'Say “twelve students”.', ur: '«بارہ طالب علم» کہیں۔', a: 'اثْنَا عَشَرَ طَالِبًا', tr: 'ithnaa ʿashara ṭaaliban' },
      { en: 'Say “thirty riyals”.', ur: '«تیس ریال» کہیں۔', a: 'ثَلَاثُونَ رِيَالًا', tr: 'thalaathuuna riyaalan' },
      { en: 'Say “I am forty years old.”', ur: '«میری عمر چالیس سال ہے» کہیں۔', a: 'عُمْرِي أَرْبَعُونَ سَنَةً', tr: 'ʿumrii arbaʿuuna sanatan' },
    ],
  },
  {
    slug: 'lesson-34-before-after', key: 'قَبْلَ',
    en: {
      title: 'Before and after: {قَبْلَ} and {بَعْدَ}', short: 'Before the prayer, after the lesson, a week ago.',
      intro: '{قَبْلَ} (before) and {بَعْدَ} (after) work like {عِنْدَ}: the noun after them ends in -i. {قَبْلَ الصَّلَاةِ} means “before the prayer” and {بَعْدَ الدَّرْسِ} means “after the lesson”.',
      points: [
        'With pronouns: {قَبْلَهُ} before him · {بَعْدَكَ} after you · {قَبْلَنَا} before us.',
        'Before a verb add {أَنْ}: {قَبْلَ أَنْ تَنَامَ} (before you sleep), {بَعْدَ أَنْ أَكَلْتُ} (after I ate).',
        'Useful time phrases: {قَبْلَ الظُّهْرِ} before noon · {بَعْدَ الظُّهْرِ} in the afternoon · {بَعْدَ غَدٍ} the day after tomorrow · {قَبْلَ أُسْبُوعٍ} a week ago.',
      ],
    },
    ur: {
      title: 'پہلے اور بعد: {قَبْلَ} اور {بَعْدَ}', short: 'نماز سے پہلے، سبق کے بعد، ایک ہفتہ پہلے۔',
      intro: '{قَبْلَ} (پہلے) اور {بَعْدَ} (بعد) {عِنْدَ} کی طرح استعمال ہوتے ہیں: ان کے بعد والا اسم مجرور ہوتا ہے۔ {قَبْلَ الصَّلَاةِ} یعنی «نماز سے پہلے» اور {بَعْدَ الدَّرْسِ} یعنی «سبق کے بعد»۔',
      points: [
        'ضمیر کے ساتھ: {قَبْلَهُ} اس سے پہلے · {بَعْدَكَ} تمہارے بعد · {قَبْلَنَا} ہم سے پہلے۔',
        'فعل سے پہلے {أَنْ} لگائیں: {قَبْلَ أَنْ تَنَامَ} (سونے سے پہلے)، {بَعْدَ أَنْ أَكَلْتُ} (کھانے کے بعد)۔',
        'کام کے جملے: {قَبْلَ الظُّهْرِ} دوپہر سے پہلے · {بَعْدَ الظُّهْرِ} سہ پہر · {بَعْدَ غَدٍ} پرسوں · {قَبْلَ أُسْبُوعٍ} ایک ہفتہ پہلے۔',
      ],
    },
    ex: [
      ['أَتَوَضَّأُ قَبْلَ الصَّلَاةِ', 'atawaḍḍa’u qabla ṣ-ṣalaati', 'I make wudu before the prayer.', 'میں نماز سے پہلے وضو کرتا ہوں۔'],
      ['نَشْرَبُ الشَّايَ بَعْدَ الْغَدَاءِ', 'nashrabu sh-shaaya baʿda l-ghadaa’i', 'We drink tea after lunch.', 'ہم دوپہر کے کھانے کے بعد چائے پیتے ہیں۔'],
      ['جِئْتُ قَبْلَكَ', 'ji’tu qablaka', 'I came before you.', 'میں تم سے پہلے آیا۔'],
      ['اِغْسِلْ يَدَيْكَ قَبْلَ أَنْ تَأْكُلَ', 'ighsil yadayka qabla an ta’kula', 'Wash your hands before you eat.', 'کھانے سے پہلے ہاتھ دھوؤ۔'],
      ['سَأُسَافِرُ بَعْدَ غَدٍ', 'sa-usaafiru baʿda ghadin', 'I will travel the day after tomorrow.', 'میں پرسوں سفر کروں گا۔'],
      ['وَصَلْتُ قَبْلَ أُسْبُوعٍ', 'waṣaltu qabla usbuuʿin', 'I arrived a week ago.', 'میں ایک ہفتہ پہلے پہنچا۔'],
    ],
    practice: [
      { en: 'Say “after the lesson”.', ur: '«سبق کے بعد» کہیں۔', a: 'بَعْدَ الدَّرْسِ', tr: 'baʿda d-darsi' },
      { en: 'Say “before you sleep”.', ur: '«سونے سے پہلے» کہیں۔', a: 'قَبْلَ أَنْ تَنَامَ', tr: 'qabla an tanaama' },
      { en: 'Say “I came after him.”', ur: '«میں اس کے بعد آیا» کہیں۔', a: 'جِئْتُ بَعْدَهُ', tr: 'ji’tu baʿdahu' },
    ],
  },
  {
    slug: 'lesson-35-doer-done', key: 'كَاتِبٌ',
    en: {
      title: 'Writer and written: {فَاعِلٌ} and {مَفْعُولٌ}', short: 'Make the doer and the thing done from a root.',
      intro: 'From a three-letter root you can make the person who does the action on the pattern {فَاعِلٌ}, and the thing it is done to on the pattern {مَفْعُولٌ}. From k-t-b (writing) come {كَاتِبٌ} (writer) and {مَكْتُوبٌ} (written; a letter).',
      points: [
        '{فَاتِحٌ / مَفْتُوحٌ} opener / open · {صَانِعٌ / مَصْنُوعٌ} maker / made · {عَالِمٌ / مَعْلُومٌ} scholar / known · {سَامِعٌ / مَسْمُوعٌ} listener / heard.',
        'Many everyday words follow these patterns: {طَالِبٌ} student (one who seeks) · {جَالِسٌ} sitting · {مَشْرُوبٌ} a drink · {مَكْسُورٌ} broken.',
        'Urdu speakers already know many of them: {مَعْلُومٌ}, {مَشْهُورٌ}, {مَكْتُوبٌ}, {حَاكِمٌ}, {عَالِمٌ}.',
      ],
    },
    ur: {
      title: 'کاتب اور مکتوب: {فَاعِلٌ} اور {مَفْعُولٌ}', short: 'ایک مادے سے اسمِ فاعل اور اسمِ مفعول بنائیں۔',
      intro: 'تین حرفی مادے سے کام کرنے والے کے لیے {فَاعِلٌ} کا وزن اور جس پر کام ہو اس کے لیے {مَفْعُولٌ} کا وزن استعمال ہوتا ہے۔ ک ت ب (لکھنا) سے {كَاتِبٌ} (لکھنے والا) اور {مَكْتُوبٌ} (لکھا ہوا؛ خط) بنتے ہیں۔',
      points: [
        '{فَاتِحٌ / مَفْتُوحٌ} کھولنے والا / کھلا · {صَانِعٌ / مَصْنُوعٌ} بنانے والا / بنا ہوا · {عَالِمٌ / مَعْلُومٌ} جاننے والا / معلوم · {سَامِعٌ / مَسْمُوعٌ} سننے والا / سنا ہوا۔',
        'روزمرہ کے بہت سے الفاظ انہی اوزان پر ہیں: {طَالِبٌ} طالب علم (طلب کرنے والا) · {جَالِسٌ} بیٹھا ہوا · {مَشْرُوبٌ} مشروب · {مَكْسُورٌ} ٹوٹا ہوا۔',
        'اردو بولنے والے ان میں سے بہت سے پہلے ہی جانتے ہیں: {مَعْلُومٌ}، {مَشْهُورٌ}، {مَكْتُوبٌ}، {حَاكِمٌ}، {عَالِمٌ}۔',
      ],
    },
    ex: [
      ['الْبَابُ مَفْتُوحٌ', 'al-baabu maftuuḥun', 'The door is open.', 'دروازہ کھلا ہے۔'],
      ['هٰذَا الْكُرْسِيُّ مَصْنُوعٌ مِنَ الْخَشَبِ', 'haadha l-kursiyyu maṣnuuʿun mina l-khashabi', 'This chair is made of wood.', 'یہ کرسی لکڑی سے بنی ہے۔'],
      ['أَبِي كَاتِبٌ مَشْهُورٌ', 'abii kaatibun mashhuurun', 'My father is a famous writer.', 'میرے والد مشہور مصنف ہیں۔'],
      ['الْقَلَمُ مَكْسُورٌ', 'al-qalamu maksuurun', 'The pen is broken.', 'قلم ٹوٹا ہوا ہے۔'],
      ['الطَّالِبُ جَالِسٌ', 'aṭ-ṭaalibu jaalisun', 'The student is sitting.', 'طالب علم بیٹھا ہے۔'],
      ['اسْمُهُ مَكْتُوبٌ عَلَى الْبَابِ', 'ismuhu maktuubun ʿala l-baabi', 'His name is written on the door.', 'اس کا نام دروازے پر لکھا ہے۔'],
    ],
    practice: [
      { en: 'Make the “doer” from {ذَهَبَ} (go).', ur: '{ذَهَبَ} (جانا) سے اسمِ فاعل بنائیں۔', a: 'ذَاهِبٌ', tr: 'dhaahibun', noteEn: 'going / one who goes', noteUr: 'جانے والا' },
      { en: 'Make the “thing done” from {شَرِبَ} (drink).', ur: '{شَرِبَ} (پینا) سے اسمِ مفعول بنائیں۔', a: 'مَشْرُوبٌ', tr: 'mashruubun', noteEn: 'a drink (something drunk)', noteUr: 'مشروب (پی جانے والی چیز)' },
      { en: 'Say “The window is open.” ({نَافِذَةٌ} is feminine)', ur: '«کھڑکی کھلی ہے» کہیں ({نَافِذَةٌ} مؤنث ہے)۔', a: 'النَّافِذَةُ مَفْتُوحَةٌ', tr: 'an-naafidhatu maftuuḥatun' },
    ],
  },
  {
    slug: 'lesson-36-hijri-months', key: 'رَمَضَانُ',
    en: {
      title: 'The Islamic months', short: 'Muharram to Dhul-Hijjah, and saying dates.',
      intro: 'The Islamic year has twelve months that follow the moon. Each month starts when the new crescent, {الْهِلَالُ}, is seen. To say “in Ramadan”, use {فِي رَمَضَانَ} or {فِي شَهْرِ رَمَضَانَ}.',
      points: [
        '{مُحَرَّمٌ} · {صَفَرٌ} · {رَبِيعٌ الْأَوَّلُ} · {رَبِيعٌ الْآخِرُ} · {جُمَادَى الْأُولَى} · {جُمَادَى الْآخِرَةُ} · {رَجَبٌ} · {شَعْبَانُ} · {رَمَضَانُ} · {شَوَّالٌ} · {ذُو الْقَعْدَةِ} · {ذُو الْحِجَّةِ}',
        'Dates use order words from lesson 28: {الْيَوْمُ الْعَاشِرُ مِنْ مُحَرَّمٍ} (the tenth of Muharram).',
        'Notice {ذُو} from lesson 29: after {فِي} it becomes {ذِي}, as in {فِي ذِي الْحِجَّةِ}. In Saudi Arabia Hijri dates are marked with {هـ}.',
      ],
    },
    ur: {
      title: 'اسلامی مہینے', short: 'محرم سے ذوالحجہ تک، اور تاریخ بتانا۔',
      intro: 'اسلامی سال کے بارہ مہینے چاند کے حساب سے چلتے ہیں۔ ہر مہینہ نیا چاند، {الْهِلَالُ}، نظر آنے پر شروع ہوتا ہے۔ «رمضان میں» کہنے کے لیے {فِي رَمَضَانَ} یا {فِي شَهْرِ رَمَضَانَ}۔',
      points: [
        '{مُحَرَّمٌ} · {صَفَرٌ} · {رَبِيعٌ الْأَوَّلُ} · {رَبِيعٌ الْآخِرُ} · {جُمَادَى الْأُولَى} · {جُمَادَى الْآخِرَةُ} · {رَجَبٌ} · {شَعْبَانُ} · {رَمَضَانُ} · {شَوَّالٌ} · {ذُو الْقَعْدَةِ} · {ذُو الْحِجَّةِ}',
        'تاریخ میں سبق ۲۸ کے ترتیبی اعداد آتے ہیں: {الْيَوْمُ الْعَاشِرُ مِنْ مُحَرَّمٍ} (دس محرم)۔',
        'سبق ۲۹ کا {ذُو} یاد کریں: {فِي} کے بعد یہ {ذِي} بن جاتا ہے، جیسے {فِي ذِي الْحِجَّةِ}۔ سعودی عرب میں ہجری تاریخ کے ساتھ {هـ} لکھا جاتا ہے۔',
      ],
    },
    ex: [
      ['نَصُومُ فِي شَهْرِ رَمَضَانَ', 'naṣuumu fii shahri ramaḍaana', 'We fast in the month of Ramadan.', 'ہم رمضان کے مہینے میں روزے رکھتے ہیں۔'],
      ['عِيدُ الْفِطْرِ فِي شَوَّالٍ', 'ʿiidu l-fiṭri fii shawwaalin', 'Eid al-Fitr is in Shawwal.', 'عید الفطر شوال میں ہوتی ہے۔'],
      ['الْحَجُّ فِي ذِي الْحِجَّةِ', 'al-ḥajju fii dhi l-ḥijjati', 'Hajj is in Dhul-Hijjah.', 'حج ذوالحجہ میں ہوتا ہے۔'],
      ['رَأَيْنَا الْهِلَالَ', 'ra’aynaa l-hilaala', 'We saw the new crescent.', 'ہم نے نیا چاند دیکھا۔'],
      ['مُحَرَّمٌ أَوَّلُ شَهْرٍ فِي السَّنَةِ', 'muḥarramun awwalu shahrin fis-sanati', 'Muharram is the first month of the year.', 'محرم سال کا پہلا مہینہ ہے۔'],
      ['فِي أَيِّ شَهْرٍ نَحْنُ؟', 'fii ayyi shahrin naḥnu?', 'Which month are we in?', 'ہم کس مہینے میں ہیں؟'],
    ],
    practice: [
      { en: 'Say “in Rajab”.', ur: '«رجب میں» کہیں۔', a: 'فِي رَجَبٍ', tr: 'fii rajabin' },
      { en: 'Say “the first day of Ramadan”.', ur: '«رمضان کا پہلا دن» کہیں۔', a: 'الْيَوْمُ الْأَوَّلُ مِنْ رَمَضَانَ', tr: 'al-yawmu l-awwalu min ramaḍaana' },
      { en: 'Ask “Which month is Hajj in?”', ur: 'پوچھیں «حج کس مہینے میں ہے؟»', a: 'فِي أَيِّ شَهْرٍ الْحَجُّ؟', tr: 'fii ayyi shahrin al-ḥajju?' },
    ],
  },
  {
    slug: "lesson-37-past-all", key: "كَتَبُوا",
    en: {
      title: "The past tense for everyone: we, you all, they", short: "كَتَبْنَا، كَتَبْتُمْ، كَتَبُوا، كَتَبْنَ",
      intro: "Every past verb is built on the “he” form, such as {كَتَبَ} (he wrote), with an ending for each person. You met {كَتَبْتُ} (I wrote) in lesson 11; here is the full set.",
      points: ["Singular: {كَتَبْتُ} I · {كَتَبْتَ} you (m) · {كَتَبْتِ} you (f) · {كَتَبَ} he · {كَتَبَتْ} she.", "Plural: {كَتَبْنَا} we · {كَتَبْتُمْ} you all (m) · {كَتَبْتُنَّ} you all (f) · {كَتَبُوا} they (m) · {كَتَبْنَ} they (f).", "The alif at the end of {كَتَبُوا} is written but not pronounced. When the verb comes before its subject it stays singular: {ذَهَبَ الطُّلَّابُ} (the students went)."],
    },
    ur: {
      title: "سب کے لیے ماضی: ہم، تم سب، وہ سب", short: "كَتَبْنَا، كَتَبْتُمْ، كَتَبُوا، كَتَبْنَ",
      intro: "ہر ماضی کا فعل «وہ» کے صیغے، جیسے {كَتَبَ} (اس نے لکھا)، پر بنتا ہے اور ہر شخص کے لیے آخر میں علامت لگتی ہے۔ سبق ۱۱ میں آپ نے {كَتَبْتُ} (میں نے لکھا) سیکھا؛ یہاں پوری گردان ہے۔",
      points: ["واحد: {كَتَبْتُ} میں · {كَتَبْتَ} تم (مذکر) · {كَتَبْتِ} تم (مؤنث) · {كَتَبَ} وہ (مرد) · {كَتَبَتْ} وہ (عورت)۔", "جمع: {كَتَبْنَا} ہم · {كَتَبْتُمْ} تم سب (مذکر) · {كَتَبْتُنَّ} تم سب (مؤنث) · {كَتَبُوا} وہ سب (مذکر) · {كَتَبْنَ} وہ سب (مؤنث)۔", "{كَتَبُوا} کے آخر کا الف لکھا جاتا ہے، پڑھا نہیں جاتا۔ اگر فعل فاعل سے پہلے آئے تو واحد رہتا ہے: {ذَهَبَ الطُّلَّابُ} (طلبہ گئے)۔"],
    },
    ex: [["ذَهَبْنَا إِلَى الْمَسْجِدِ", "dhahabnaa ila l-masjidi", "We went to the mosque.", "ہم مسجد گئے۔"], ["هَلْ فَهِمْتُمُ الدَّرْسَ؟", "hal fahimtumu d-darsa?", "Did you all understand the lesson?", "کیا تم سب نے سبق سمجھا؟"], ["الطُّلَّابُ خَرَجُوا مِنَ الْفَصْلِ", "aṭ-ṭullaabu kharajuu mina l-faṣli", "The students left the class.", "طلبہ کلاس سے نکل گئے۔"], ["الْبَنَاتُ كَتَبْنَ الدَّرْسَ", "al-banaatu katabna d-darsa", "The girls wrote the lesson.", "لڑکیوں نے سبق لکھا۔"], ["ذَهَبَ الطُّلَّابُ إِلَى الْمَكْتَبَةِ", "dhahaba ṭ-ṭullaabu ila l-maktabati", "The students went to the library.", "طلبہ لائبریری گئے۔"], ["أَيْنَ جَلَسْتُمْ؟", "ayna jalastum?", "Where did you all sit?", "تم سب کہاں بیٹھے؟"]],
    practice: [{ en: "Say “We wrote the lesson.”", ur: "«ہم نے سبق لکھا» کہیں۔", a: "كَتَبْنَا الدَّرْسَ", tr: "katabnaa d-darsa" }, { en: "Say “They (m) went home.”", ur: "«وہ سب گھر گئے» کہیں۔", a: "ذَهَبُوا إِلَى الْبَيْتِ", tr: "dhahabuu ila l-bayti" }, { en: "Ask a group of men “Did you eat?”", ur: "مردوں کے گروہ سے پوچھیں «کیا تم نے کھانا کھایا؟»", a: "هَلْ أَكَلْتُمْ؟", tr: "hal akaltum?" }],
  },
  {
    slug: "lesson-38-present-all", key: "يَكْتُبُونَ",
    en: {
      title: "The present tense for everyone", short: "نَكْتُبُ، تَكْتُبُونَ، يَكْتُبُونَ، يَكْتُبْنَ",
      intro: "The present tense adds a letter at the start, and for some persons an ending too: {أَ} for I, {نَ} for we, {تَ} for you and she, {يَ} for he and they.",
      points: ["Singular: {أَكْتُبُ} I · {تَكْتُبُ} you (m) · {تَكْتُبِينَ} you (f) · {يَكْتُبُ} he · {تَكْتُبُ} she.", "Plural: {نَكْتُبُ} we · {تَكْتُبُونَ} you all (m) · {تَكْتُبْنَ} you all (f) · {يَكْتُبُونَ} they (m) · {يَكْتُبْنَ} they (f).", "{تَكْتُبُ} can mean “you write” or “she writes”; the sentence tells you which."],
    },
    ur: {
      title: "سب کے لیے مضارع", short: "نَكْتُبُ، تَكْتُبُونَ، يَكْتُبُونَ، يَكْتُبْنَ",
      intro: "مضارع کے شروع میں ایک حرف لگتا ہے اور بعض صیغوں میں آخر میں بھی: {أَ} میں کے لیے، {نَ} ہم کے لیے، {تَ} تم اور «وہ عورت» کے لیے، {يَ} «وہ مرد» اور «وہ سب» کے لیے۔",
      points: ["واحد: {أَكْتُبُ} میں · {تَكْتُبُ} تم (مذکر) · {تَكْتُبِينَ} تم (مؤنث) · {يَكْتُبُ} وہ (مرد) · {تَكْتُبُ} وہ (عورت)۔", "جمع: {نَكْتُبُ} ہم · {تَكْتُبُونَ} تم سب (مذکر) · {تَكْتُبْنَ} تم سب (مؤنث) · {يَكْتُبُونَ} وہ سب (مذکر) · {يَكْتُبْنَ} وہ سب (مؤنث)۔", "{تَكْتُبُ} کا مطلب «تم لکھتے ہو» بھی ہے اور «وہ لکھتی ہے» بھی؛ جملے سے پتا چلتا ہے۔"],
    },
    ex: [["مَاذَا تَدْرُسُونَ؟", "maadhaa tadrusuuna?", "What are you all studying?", "تم سب کیا پڑھ رہے ہو؟"], ["نَدْرُسُ اللُّغَةَ الْعَرَبِيَّةَ", "nadrusu l-lughata l-ʿarabiyyata", "We study the Arabic language.", "ہم عربی زبان پڑھتے ہیں۔"], ["الطُّلَّابُ يَلْعَبُونَ فِي الْمَلْعَبِ", "aṭ-ṭullaabu yalʿabuuna fil-malʿabi", "The students are playing in the playground.", "طلبہ میدان میں کھیل رہے ہیں۔"], ["الْأُمَّهَاتُ يَطْبُخْنَ الطَّعَامَ", "al-ummahaatu yaṭbukhna ṭ-ṭaʿaama", "The mothers are cooking the food.", "مائیں کھانا پکا رہی ہیں۔"], ["أَيْنَ تَسْكُنِينَ يَا فَاطِمَةُ؟", "ayna taskuniina yaa faaṭimatu?", "Where do you live, Fatima?", "فاطمہ، تم کہاں رہتی ہو؟"], ["هِيَ تَكْتُبُ رِسَالَةً", "hiya taktubu risaalatan", "She is writing a letter.", "وہ خط لکھ رہی ہے۔"]],
    practice: [{ en: "Say “We drink tea.”", ur: "«ہم چائے پیتے ہیں» کہیں۔", a: "نَشْرَبُ الشَّايَ", tr: "nashrabu sh-shaaya" }, { en: "Say “They (m) read the Quran.”", ur: "«وہ سب قرآن پڑھتے ہیں» کہیں۔", a: "يَقْرَءُونَ الْقُرْآنَ", tr: "yaqra’uuna l-qur’aana" }, { en: "Ask a woman “What do you want?”", ur: "عورت سے پوچھیں «تم کیا چاہتی ہو؟»", a: "مَاذَا تُرِيدِينَ؟", tr: "maadhaa turiidiina?" }],
  },
  {
    slug: "lesson-39-passive", key: "كُتِبَ",
    en: {
      title: "It was written: the passive", short: "Say what was done without saying who did it.",
      intro: "When you don’t say who did something, use the passive. In the past the vowels become u–i: {كَتَبَ} (he wrote) → {كُتِبَ} (it was written). In the present they become u–a: {يَكْتُبُ} → {يُكْتَبُ} (it is written).",
      points: ["{فُتِحَ الْبَابُ} the door was opened · {يُفْتَحُ الْبَابُ} the door is opened. The thing acted on becomes the subject and ends in -u.", "You will see the passive on signs and notices: {يُمْنَعُ التَّدْخِينُ} (smoking is forbidden), {أُغْلِقَ الْمَحَلُّ} (the shop was closed).", "In the Quran: {كُتِبَ عَلَيْكُمُ الصِّيَامُ} (fasting has been prescribed for you, 2:183)."],
    },
    ur: {
      title: "لکھا گیا: فعلِ مجہول", short: "کام بتائیں، کرنے والا نہیں۔",
      intro: "جب کام کرنے والے کا ذکر نہ کرنا ہو تو مجہول استعمال کریں۔ ماضی میں حرکات پیش اور زیر ہو جاتی ہیں: {كَتَبَ} (اس نے لکھا) ← {كُتِبَ} (لکھا گیا)۔ مضارع میں پیش اور زبر: {يَكْتُبُ} ← {يُكْتَبُ} (لکھا جاتا ہے)۔",
      points: ["{فُتِحَ الْبَابُ} دروازہ کھولا گیا · {يُفْتَحُ الْبَابُ} دروازہ کھولا جاتا ہے۔ جس پر کام ہوا وہ نائبِ فاعل بن کر مرفوع ہو جاتا ہے۔", "سائن بورڈز اور اعلانات میں مجہول عام ہے: {يُمْنَعُ التَّدْخِينُ} (سگریٹ نوشی منع ہے)، {أُغْلِقَ الْمَحَلُّ} (دکان بند کر دی گئی)۔", "قرآن میں: {كُتِبَ عَلَيْكُمُ الصِّيَامُ} (تم پر روزے فرض کیے گئے، البقرہ ۱۸۳)۔"],
    },
    ex: [["كُتِبَ الدَّرْسُ عَلَى السَّبُّورَةِ", "kutiba d-darsu ʿala s-sabbuurati", "The lesson was written on the board.", "سبق تختے پر لکھا گیا۔"], ["فُتِحَ الْبَابُ", "futiḥa l-baabu", "The door was opened.", "دروازہ کھولا گیا۔"], ["يُمْنَعُ التَّدْخِينُ", "yumnaʿu t-tadkhiinu", "Smoking is forbidden.", "سگریٹ نوشی منع ہے۔"], ["تُفْتَحُ الْمَكْتَبَةُ فِي السَّاعَةِ الثَّامِنَةِ", "tuftaḥu l-maktabatu fis-saaʿati th-thaaminati", "The library is opened at eight o’clock.", "لائبریری آٹھ بجے کھولی جاتی ہے۔"], ["وُلِدْتُ فِي لَاهُورَ", "wulidtu fii laahuura", "I was born in Lahore.", "میں لاہور میں پیدا ہوا۔"], ["كُتِبَ عَلَيْكُمُ الصِّيَامُ", "kutiba ʿalaykumu ṣ-ṣiyaamu", "Fasting has been prescribed for you. (2:183)", "تم پر روزے فرض کیے گئے۔ (البقرہ ۱۸۳)"]],
    practice: [{ en: "Say “The window was opened.”", ur: "«کھڑکی کھولی گئی» کہیں۔", a: "فُتِحَتِ النَّافِذَةُ", tr: "futiḥati n-naafidhatu" }, { en: "Make the passive of {شَرِبَ}.", ur: "{شَرِبَ} کا مجہول بنائیں۔", a: "شُرِبَ", tr: "shuriba", noteEn: "it was drunk", noteUr: "پیا گیا" }, { en: "Say “The book was read.”", ur: "«کتاب پڑھی گئی» کہیں۔", a: "قُرِئَ الْكِتَابُ", tr: "quri’a l-kitaabu" }],
  },
  {
    slug: "lesson-40-kull-baad", key: "كُلُّ",
    en: {
      title: "Every, all and some: {كُلُّ} and {بَعْضُ}", short: "Every day, all the students, some of them.",
      intro: "{كُلُّ} means “every” before a singular noun without al-: {كُلُّ يَوْمٍ} (every day). Before a plural or a noun with al- it means “all (of)”: {كُلُّ الطُّلَّابِ} (all the students). {بَعْضُ} means “some (of)”: {بَعْضُ الطُّلَّابِ} (some of the students).",
      points: ["Both work like possession (lesson 6): the noun after them ends in -i, and their own ending shows their role: {رَأَيْتُ كُلَّ الطُّلَّابِ}.", "With pronouns: {كُلُّهُمْ} all of them · {بَعْضُهُمْ} some of them · {كُلُّنَا} all of us.", "Useful phrases: {كُلَّ يَوْمٍ} every day · {كُلُّ شَيْءٍ} everything · {كُلُّ وَاحِدٍ} everyone."],
    },
    ur: {
      title: "ہر، سب اور کچھ: {كُلُّ} اور {بَعْضُ}", short: "ہر دن، سب طلبہ، ان میں سے کچھ۔",
      intro: "{كُلُّ} بغیر الـ کے واحد اسم سے پہلے «ہر» کے معنی دیتا ہے: {كُلُّ يَوْمٍ} (ہر دن)۔ جمع یا الـ والے اسم سے پہلے «سب»: {كُلُّ الطُّلَّابِ} (سب طلبہ)۔ {بَعْضُ} کا مطلب ہے «کچھ»: {بَعْضُ الطُّلَّابِ} (کچھ طلبہ)۔",
      points: ["دونوں اضافت کی طرح ہیں (سبق ۶): بعد والا اسم مجرور ہوتا ہے، اور ان کا اپنا اعراب جملے میں کردار کے مطابق بدلتا ہے: {رَأَيْتُ كُلَّ الطُّلَّابِ}۔", "ضمیر کے ساتھ: {كُلُّهُمْ} وہ سب · {بَعْضُهُمْ} ان میں سے کچھ · {كُلُّنَا} ہم سب۔", "کام کے جملے: {كُلَّ يَوْمٍ} ہر روز · {كُلُّ شَيْءٍ} ہر چیز · {كُلُّ وَاحِدٍ} ہر کوئی۔"],
    },
    ex: [["أَقْرَأُ الْقُرْآنَ كُلَّ يَوْمٍ", "aqra’u l-qur’aana kulla yawmin", "I read the Quran every day.", "میں ہر روز قرآن پڑھتا ہوں۔"], ["كُلُّ الطُّلَّابِ حَاضِرُونَ", "kullu ṭ-ṭullaabi ḥaaḍiruuna", "All the students are present.", "تمام طلبہ حاضر ہیں۔"], ["بَعْضُ الطُّلَّابِ غَائِبُونَ", "baʿḍu ṭ-ṭullaabi ghaa’ibuuna", "Some of the students are absent.", "کچھ طلبہ غیر حاضر ہیں۔"], ["كُلُّنَا نُحِبُّ الْعَرَبِيَّةَ", "kullunaa nuḥibbu l-ʿarabiyyata", "All of us love Arabic.", "ہم سب عربی سے محبت کرتے ہیں۔"], ["أَكَلْتُ بَعْضَ التُّفَّاحِ", "akaltu baʿḍa t-tuffaaḥi", "I ate some of the apples.", "میں نے کچھ سیب کھائے۔"], ["كُلُّ شَيْءٍ جَاهِزٌ", "kullu shay’in jaahizun", "Everything is ready.", "سب کچھ تیار ہے۔"]],
    practice: [{ en: "Say “every week”.", ur: "«ہر ہفتے» کہیں۔", a: "كُلَّ أُسْبُوعٍ", tr: "kulla usbuuʿin" }, { en: "Say “all the books”.", ur: "«سب کتابیں» کہیں۔", a: "كُلُّ الْكُتُبِ", tr: "kullu l-kutubi" }, { en: "Say “some of them”.", ur: "«ان میں سے کچھ» کہیں۔", a: "بَعْضُهُمْ", tr: "baʿḍuhum" }],
  },
  {
    slug: "lesson-41-ya", key: "يَا",
    en: {
      title: "Calling someone: {يَا}", short: "O Muhammad, Teacher!, O people.",
      intro: "To call someone, put {يَا} before the name: {يَا مُحَمَّدُ} (Muhammad!). A single name or title after {يَا} ends in -u with no -n: {يَا أُسْتَاذُ} (Teacher!).",
      points: ["If the name is two words joined by possession, the first ends in -a: {يَا عَبْدَ اللّٰهِ} · {يَا أَبَا خَالِدٍ} (from lesson 29).", "Before a noun with al- use {يَا أَيُّهَا} (m) or {يَا أَيَّتُهَا} (f): {يَا أَيُّهَا النَّاسُ} (O people), which is common in the Quran.", "With “my” the ending is often just -i: {يَا أَخِي} (my brother), {يَا رَبِّ} (O my Lord)."],
    },
    ur: {
      title: "کسی کو پکارنا: {يَا}", short: "اے محمد، استاد صاحب!، اے لوگو۔",
      intro: "کسی کو پکارنے کے لیے نام سے پہلے {يَا} لگائیں: {يَا مُحَمَّدُ} (اے محمد!)۔ {يَا} کے بعد اکیلا نام یا لقب بغیر تنوین کے پیش پر ختم ہوتا ہے: {يَا أُسْتَاذُ} (استاد صاحب!)۔",
      points: ["اگر نام مضاف ہو تو پہلا لفظ زبر پر ختم ہوتا ہے: {يَا عَبْدَ اللّٰهِ} · {يَا أَبَا خَالِدٍ} (سبق ۲۹)۔", "الـ والے اسم سے پہلے {يَا أَيُّهَا} (مذکر) یا {يَا أَيَّتُهَا} (مؤنث) آتا ہے: {يَا أَيُّهَا النَّاسُ} (اے لوگو)، جو قرآن میں بار بار آیا ہے۔", "«میرے» کے ساتھ اکثر صرف زیر رہ جاتی ہے: {يَا أَخِي} (میرے بھائی)، {يَا رَبِّ} (اے میرے رب)۔"],
    },
    ex: [["يَا مُحَمَّدُ، تَعَالَ هُنَا", "yaa muḥammadu, taʿaala hunaa", "Muhammad, come here.", "محمد، یہاں آؤ۔"], ["يَا أُسْتَاذُ، عِنْدِي سُؤَالٌ", "yaa ustaadhu, ʿindii su’aalun", "Teacher, I have a question.", "استاد صاحب، میرا ایک سوال ہے۔"], ["يَا عَبْدَ اللّٰهِ", "yaa ʿabda llaahi", "O Abdullah", "اے عبداللہ"], ["يَا أَيُّهَا الطُّلَّابُ، اِسْمَعُوا", "yaa ayyuha ṭ-ṭullaabu, ismaʿuu", "Students, listen!", "اے طلبہ، سنو!"], ["يَا أَيُّهَا النَّاسُ", "yaa ayyuha n-naasu", "O people (Quran)", "اے لوگو (قرآن)"], ["يَا رَبِّ", "yaa rabbi", "O my Lord", "اے میرے رب"]],
    practice: [{ en: "Say “Khalid, sit down.”", ur: "«خالد، بیٹھ جاؤ» کہیں۔", a: "يَا خَالِدُ، اِجْلِسْ", tr: "yaa khaalidu, ijlis" }, { en: "Say “O my brother”.", ur: "«اے میرے بھائی» کہیں۔", a: "يَا أَخِي", tr: "yaa akhii" }, { en: "Say “O believers”.", ur: "«اے ایمان والو» کہیں۔", a: "يَا أَيُّهَا الْمُؤْمِنُونَ", tr: "yaa ayyuha l-mu’minuuna" }],
  },
  {
    slug: "lesson-42-illa", key: "إِلَّا",
    en: {
      title: "Except: {إِلَّا}", short: "Everyone except Khalid; only one riyal.",
      intro: "{إِلَّا} means “except”. After a complete positive sentence the noun after it ends in -a: {حَضَرَ الطُّلَّابُ إِلَّا خَالِدًا} (the students came, except Khalid).",
      points: ["After a negative sentence {إِلَّا} means “only”, and the noun keeps its normal ending: {مَا عِنْدِي إِلَّا رِيَالٌ} (I have only a riyal).", "The testimony of faith uses it: {لَا إِلٰهَ إِلَّا اللّٰهُ} (there is no god except Allah).", "{غَيْرَ} also means “except”, and the noun after it ends in -i: {حَضَرَ الطُّلَّابُ غَيْرَ خَالِدٍ}."],
    },
    ur: {
      title: "سوائے: {إِلَّا}", short: "خالد کے سوا سب؛ صرف ایک ریال۔",
      intro: "{إِلَّا} کا مطلب ہے «سوائے»۔ مکمل مثبت جملے کے بعد مستثنیٰ منصوب ہوتا ہے: {حَضَرَ الطُّلَّابُ إِلَّا خَالِدًا} (خالد کے سوا سب طلبہ آئے)۔",
      points: ["منفی جملے کے بعد {إِلَّا} کا مطلب «صرف» ہوتا ہے اور اسم کا اعراب نہیں بدلتا: {مَا عِنْدِي إِلَّا رِيَالٌ} (میرے پاس صرف ایک ریال ہے)۔", "کلمۂ توحید میں یہی ہے: {لَا إِلٰهَ إِلَّا اللّٰهُ} (اللہ کے سوا کوئی معبود نہیں)۔", "{غَيْرَ} کا مطلب بھی «سوائے» ہے، اور اس کے بعد والا اسم مجرور ہوتا ہے: {حَضَرَ الطُّلَّابُ غَيْرَ خَالِدٍ}۔"],
    },
    ex: [["حَضَرَ الطُّلَّابُ إِلَّا خَالِدًا", "ḥaḍara ṭ-ṭullaabu illaa khaalidan", "The students came, except Khalid.", "خالد کے سوا سب طلبہ آئے۔"], ["قَرَأْتُ الْكِتَابَ إِلَّا صَفْحَةً", "qara’tu l-kitaaba illaa ṣafḥatan", "I read the book except one page.", "میں نے ایک صفحے کے سوا پوری کتاب پڑھی۔"], ["مَا عِنْدِي إِلَّا رِيَالٌ وَاحِدٌ", "maa ʿindii illaa riyaalun waaḥidun", "I have only one riyal.", "میرے پاس صرف ایک ریال ہے۔"], ["لَا إِلٰهَ إِلَّا اللّٰهُ", "laa ilaaha illa llaahu", "There is no god except Allah.", "اللہ کے سوا کوئی معبود نہیں۔"], ["الْمَحَلَّاتُ مَفْتُوحَةٌ إِلَّا يَوْمَ الْجُمُعَةِ", "al-maḥallaatu maftuuḥatun illaa yawma l-jumuʿati", "The shops are open except on Friday.", "دکانیں جمعہ کے سوا کھلی رہتی ہیں۔"], ["حَضَرَ الطُّلَّابُ غَيْرَ خَالِدٍ", "ḥaḍara ṭ-ṭullaabu ghayra khaalidin", "The students came, except Khalid.", "خالد کے علاوہ سب طلبہ آئے۔"]],
    practice: [{ en: "Say “I ate the apples except one.”", ur: "«میں نے ایک کے سوا سب سیب کھا لیے» کہیں۔", a: "أَكَلْتُ التُّفَّاحَ إِلَّا وَاحِدَةً", tr: "akaltu t-tuffaaḥa illaa waaḥidatan" }, { en: "Say “I have only a book.”", ur: "«میرے پاس صرف ایک کتاب ہے» کہیں۔", a: "مَا عِنْدِي إِلَّا كِتَابٌ", tr: "maa ʿindii illaa kitaabun" }, { en: "Say “Everyone came except Ali.”", ur: "«علی کے سوا سب آئے» کہیں۔", a: "حَضَرَ الْجَمِيعُ إِلَّا عَلِيًّا", tr: "ḥaḍara l-jamiiʿu illaa ʿaliyyan" }],
  },
  {
    slug: "lesson-43-sisters-of-inna", key: "لٰكِنَّ",
    en: {
      title: "But, as if, perhaps, if only: the sisters of {إِنَّ}", short: "لٰكِنَّ، كَأَنَّ، لَعَلَّ، لَيْتَ",
      intro: "Four words work exactly like {إِنَّ} (lesson 21): the noun after them ends in -a and the rest of the sentence stays as it was. {لٰكِنَّ} but · {كَأَنَّ} as if · {لَعَلَّ} perhaps, hopefully · {لَيْتَ} if only.",
      points: ["{الْبَيْتُ صَغِيرٌ لٰكِنَّ الْحَدِيقَةَ كَبِيرَةٌ} (the house is small but the garden is big).", "With pronouns: {لَعَلَّكَ} perhaps you · {كَأَنَّهُ} as if he · {لَيْتَنِي} if only I.", "{لَعَلَّ} can also come before a verb sentence: {لَعَلَّكُمْ تَتَّقُونَ} (so that you may be mindful of Allah, 2:183)."],
    },
    ur: {
      title: "لیکن، گویا، شاید، کاش: {إِنَّ} کی بہنیں", short: "لٰكِنَّ، كَأَنَّ، لَعَلَّ، لَيْتَ",
      intro: "چار الفاظ بالکل {إِنَّ} (سبق ۲۱) کی طرح عمل کرتے ہیں: بعد والا اسم منصوب ہوتا ہے اور باقی جملہ ویسا ہی رہتا ہے۔ {لٰكِنَّ} لیکن · {كَأَنَّ} گویا · {لَعَلَّ} شاید، امید ہے · {لَيْتَ} کاش۔",
      points: ["{الْبَيْتُ صَغِيرٌ لٰكِنَّ الْحَدِيقَةَ كَبِيرَةٌ} (گھر چھوٹا ہے لیکن باغ بڑا ہے)۔", "ضمیر کے ساتھ: {لَعَلَّكَ} شاید تم · {كَأَنَّهُ} گویا وہ · {لَيْتَنِي} کاش میں۔", "{لَعَلَّ} کے بعد فعلیہ جملہ بھی آ سکتا ہے: {لَعَلَّكُمْ تَتَّقُونَ} (تاکہ تم پرہیزگار بنو، البقرہ ۱۸۳)۔"],
    },
    ex: [["الْجَوُّ بَارِدٌ لٰكِنَّ الشَّمْسَ مُشْرِقَةٌ", "al-jawwu baaridun laakinna sh-shamsa mushriqatun", "The weather is cold but the sun is shining.", "موسم ٹھنڈا ہے لیکن دھوپ نکلی ہوئی ہے۔"], ["كَأَنَّ الْقَمَرَ مِصْبَاحٌ", "ka’anna l-qamara miṣbaaḥun", "It is as if the moon were a lamp.", "گویا چاند ایک چراغ ہے۔"], ["لَعَلَّ الْمُدَرِّسَ مَرِيضٌ", "laʿalla l-mudarrisa mariiḍun", "Perhaps the teacher is ill.", "شاید استاد بیمار ہیں۔"], ["لَعَلَّكَ بِخَيْرٍ", "laʿallaka bikhayrin", "I hope you are well.", "امید ہے آپ خیریت سے ہوں گے۔"], ["لَيْتَ الشَّبَابَ يَعُودُ", "layta sh-shabaaba yaʿuudu", "If only youth would return.", "کاش جوانی لوٹ آئے۔"], ["لَيْتَنِي ذَهَبْتُ مَعَكُمْ", "laytanii dhahabtu maʿakum", "I wish I had gone with you.", "کاش میں تمہارے ساتھ چلا جاتا۔"]],
    practice: [{ en: "Say “Perhaps the shop is open.”", ur: "«شاید دکان کھلی ہو» کہیں۔", a: "لَعَلَّ الْمَحَلَّ مَفْتُوحٌ", tr: "laʿalla l-maḥalla maftuuḥun" }, { en: "Say “The car is old but it is fast.”", ur: "«گاڑی پرانی ہے لیکن تیز ہے» کہیں۔", a: "السَّيَّارَةُ قَدِيمَةٌ لٰكِنَّهَا سَرِيعَةٌ", tr: "as-sayyaaratu qadiimatun laakinnahaa sariiʿatun" }, { en: "Say “If only I knew.”", ur: "«کاش میں جانتا» کہیں۔", a: "لَيْتَنِي أَعْرِفُ", tr: "laytanii aʿrifu" }],
  },
  {
    slug: "lesson-44-sisters-of-kaana", key: "صَارَ",
    en: {
      title: "Became, still: the sisters of {كَانَ}", short: "أَصْبَحَ، صَارَ، مَا زَالَ، لَيْسَ",
      intro: "Like {كَانَ} (lesson 25), these verbs make the second part end in -an: {صَارَ} became · {أَصْبَحَ} became (also: was in the morning) · {مَا زَالَ} is still · {لَيْسَ} is not (lesson 14).",
      points: ["{صَارَ الْمَاءُ ثَلْجًا} (the water became ice) · {أَصْبَحَ الْجَوُّ حَارًّا} (the weather became hot).", "{مَا زَالَ} means “is still”: {مَا زَالَ مَرِيضًا} (he is still ill). In the present it is {لَا يَزَالُ}.", "They change like any past verb: {صِرْتُ} I became · {أَصْبَحْنَا} we became · {مَا زِلْتُ} I am still."],
    },
    ur: {
      title: "ہو گیا، ابھی تک: {كَانَ} کی بہنیں", short: "أَصْبَحَ، صَارَ، مَا زَالَ، لَيْسَ",
      intro: "{كَانَ} (سبق ۲۵) کی طرح یہ افعال بھی خبر کو منصوب کرتے ہیں: {صَارَ} ہو گیا · {أَصْبَحَ} ہو گیا (صبح کے وقت ہوا) · {مَا زَالَ} ابھی تک ہے · {لَيْسَ} نہیں ہے (سبق ۱۴)۔",
      points: ["{صَارَ الْمَاءُ ثَلْجًا} (پانی برف بن گیا) · {أَصْبَحَ الْجَوُّ حَارًّا} (موسم گرم ہو گیا)۔", "{مَا زَالَ} یعنی «ابھی تک»: {مَا زَالَ مَرِيضًا} (وہ ابھی تک بیمار ہے)۔ مضارع میں {لَا يَزَالُ}۔", "ان کی گردان عام ماضی کی طرح ہے: {صِرْتُ} میں ہو گیا · {أَصْبَحْنَا} ہم ہو گئے · {مَا زِلْتُ} میں ابھی تک ہوں۔"],
    },
    ex: [["صَارَ الْمَاءُ ثَلْجًا", "ṣaara l-maa’u thaljan", "The water became ice.", "پانی برف بن گیا۔"], ["أَصْبَحَ الْجَوُّ حَارًّا", "aṣbaḥa l-jawwu ḥaarran", "The weather became hot.", "موسم گرم ہو گیا۔"], ["صَارَ أَخِي طَبِيبًا", "ṣaara akhii ṭabiiban", "My brother became a doctor.", "میرا بھائی ڈاکٹر بن گیا۔"], ["مَا زِلْتُ طَالِبًا", "maa ziltu ṭaaliban", "I am still a student.", "میں ابھی تک طالب علم ہوں۔"], ["لَا يَزَالُ الْمَحَلُّ مَفْتُوحًا", "laa yazaalu l-maḥallu maftuuḥan", "The shop is still open.", "دکان ابھی تک کھلی ہے۔"], ["لَيْسَ الطَّرِيقُ طَوِيلًا", "laysa ṭ-ṭariiqu ṭawiilan", "The road is not long.", "راستہ لمبا نہیں ہے۔"]],
    practice: [{ en: "Say “The sky became dark.”", ur: "«آسمان تاریک ہو گیا» کہیں۔", a: "أَصْبَحَتِ السَّمَاءُ مُظْلِمَةً", tr: "aṣbaḥati s-samaa’u muẓlimatan" }, { en: "Say “I became a teacher.”", ur: "«میں استاد بن گیا» کہیں۔", a: "صِرْتُ مُدَرِّسًا", tr: "ṣirtu mudarrisan" }, { en: "Say “He is still ill.”", ur: "«وہ ابھی تک بیمار ہے» کہیں۔", a: "مَا زَالَ مَرِيضًا", tr: "maa zaala mariiḍan" }],
  },
  {
    slug: "lesson-45-hollow-verbs", key: "قَالَ",
    en: {
      title: "Verbs with a long middle vowel: {قَالَ يَقُولُ}", short: "Say, sleep, sell, visit, stand.",
      intro: "Some verbs have a long vowel in the middle: {قَالَ} (he said), {نَامَ} (he slept), {بَاعَ} (he sold). The middle letter is really {و} or {ي}, and it shows in the present: {يَقُولُ}, {يَبِيعُ}, {يَنَامُ}.",
      points: ["The long aa becomes short when the next letter has no vowel: {قَالَ} but {قُلْتُ} (I said), {بِعْتُ} (I sold), {نِمْتُ} (I slept).", "Three types: {قَالَ يَقُولُ}, {زَارَ يَزُورُ} · {بَاعَ يَبِيعُ}, {عَاشَ يَعِيشُ} · {نَامَ يَنَامُ}, {خَافَ يَخَافُ}.", "Commands are short: {قُلْ} say! · {قُمْ} stand up! · {نَمْ} sleep! · {بِعْ} sell!"],
    },
    ur: {
      title: "درمیان میں حرفِ علت والے افعال: {قَالَ يَقُولُ}", short: "کہنا، سونا، بیچنا، ملنے جانا، کھڑا ہونا۔",
      intro: "بعض افعال کے درمیان میں الف ہوتا ہے: {قَالَ} (اس نے کہا)، {نَامَ} (وہ سویا)، {بَاعَ} (اس نے بیچا)۔ اصل میں یہ حرف {و} یا {ي} ہوتا ہے جو مضارع میں ظاہر ہوتا ہے: {يَقُولُ}، {يَبِيعُ}، {يَنَامُ}۔",
      points: ["اگلا حرف ساکن ہو تو الف گر جاتا ہے: {قَالَ} مگر {قُلْتُ} (میں نے کہا)، {بِعْتُ} (میں نے بیچا)، {نِمْتُ} (میں سویا)۔", "تین قسمیں: {قَالَ يَقُولُ}، {زَارَ يَزُورُ} · {بَاعَ يَبِيعُ}، {عَاشَ يَعِيشُ} · {نَامَ يَنَامُ}، {خَافَ يَخَافُ}۔", "امر مختصر ہوتا ہے: {قُلْ} کہو · {قُمْ} کھڑے ہو · {نَمْ} سو جاؤ · {بِعْ} بیچو۔"],
    },
    ex: [["قَالَ الْمُدَرِّسُ: اِجْلِسُوا", "qaala l-mudarrisu: ijlisuu", "The teacher said: Sit down.", "استاد نے کہا: بیٹھ جاؤ۔"], ["قُلْتُ لَهُ: شُكْرًا", "qultu lahu: shukran", "I said to him: Thank you.", "میں نے اس سے کہا: شکریہ۔"], ["يَبِيعُ التَّاجِرُ التَّمْرَ", "yabiiʿu t-taajiru t-tamra", "The merchant sells dates.", "تاجر کھجوریں بیچتا ہے۔"], ["نِمْتُ مُبَكِّرًا", "nimtu mubakkiran", "I slept early.", "میں جلدی سو گیا۔"], ["يَزُورُنَا جَدِّي كُلَّ أُسْبُوعٍ", "yazuurunaa jaddii kulla usbuuʿin", "My grandfather visits us every week.", "میرے دادا ہر ہفتے ہم سے ملنے آتے ہیں۔"], ["قُمْ لِلصَّلَاةِ", "qum liṣ-ṣalaati", "Get up for the prayer.", "نماز کے لیے اٹھو۔"]],
    practice: [{ en: "Say “I visited my friend.”", ur: "«میں اپنے دوست سے ملنے گیا» کہیں۔", a: "زُرْتُ صَدِيقِي", tr: "zurtu ṣadiiqii" }, { en: "Say “He says the truth.”", ur: "«وہ سچ کہتا ہے» کہیں۔", a: "يَقُولُ الْحَقَّ", tr: "yaquulu l-ḥaqqa" }, { en: "Tell a man “Sleep!”", ur: "مرد سے کہیں «سو جاؤ!»", a: "نَمْ", tr: "nam" }],
  },
  {
    slug: "lesson-46-defective-verbs", key: "مَشَى",
    en: {
      title: "Verbs ending in a vowel: {مَشَى}, {دَعَا}, {نَسِيَ}", short: "Walk, call, forget, stay.",
      intro: "Some verbs end in a long vowel: {مَشَى} (he walked), {دَعَا} (he called, prayed), {نَسِيَ} (he forgot). In the present they end in -ii, -uu or -aa: {يَمْشِي}, {يَدْعُو}, {يَنْسَى}.",
      points: ["Three types: {مَشَى يَمْشِي} · {دَعَا يَدْعُو} · {نَسِيَ يَنْسَى}, {بَقِيَ يَبْقَى}.", "The last vowel drops after {لَمْ}, after {لَا} for “don’t”, and in commands: {لَمْ يَنْسَ} (he didn’t forget) · {لَا تَنْسَ} (don’t forget) · {اِمْشِ} (walk!).", "With “I” the hidden letter returns: {مَشَيْتُ} I walked · {دَعَوْتُ} I called · {نَسِيتُ} I forgot."],
    },
    ur: {
      title: "آخر میں حرفِ علت والے افعال: {مَشَى}، {دَعَا}، {نَسِيَ}", short: "چلنا، پکارنا، بھولنا، رہنا۔",
      intro: "بعض افعال حرفِ علت پر ختم ہوتے ہیں: {مَشَى} (وہ چلا)، {دَعَا} (اس نے پکارا، دعا کی)، {نَسِيَ} (وہ بھول گیا)۔ مضارع میں ان کا آخر ی، و یا الف ہوتا ہے: {يَمْشِي}، {يَدْعُو}، {يَنْسَى}۔",
      points: ["تین قسمیں: {مَشَى يَمْشِي} · {دَعَا يَدْعُو} · {نَسِيَ يَنْسَى}، {بَقِيَ يَبْقَى}۔", "{لَمْ} کے بعد، نہی میں اور امر میں آخری حرفِ علت گر جاتا ہے: {لَمْ يَنْسَ} (وہ نہیں بھولا) · {لَا تَنْسَ} (مت بھولنا) · {اِمْشِ} (چلو!)۔", "«میں» کے صیغے میں اصل حرف لوٹ آتا ہے: {مَشَيْتُ} میں چلا · {دَعَوْتُ} میں نے پکارا · {نَسِيتُ} میں بھول گیا۔"],
    },
    ex: [["مَشَيْتُ إِلَى الْمَسْجِدِ", "mashaytu ila l-masjidi", "I walked to the mosque.", "میں پیدل مسجد گیا۔"], ["يَمْشِي جَدِّي كُلَّ صَبَاحٍ", "yamshii jaddii kulla ṣabaaḥin", "My grandfather walks every morning.", "میرے دادا ہر صبح چہل قدمی کرتے ہیں۔"], ["نَسِيتُ مِفْتَاحِي", "nasiitu miftaaḥii", "I forgot my key.", "میں اپنی چابی بھول گیا۔"], ["يَدْعُو اللّٰهَ", "yadʿu llaaha", "He prays to Allah.", "وہ اللہ سے دعا کرتا ہے۔"], ["لَا تَنْسَ وَاجِبَكَ", "laa tansa waajibaka", "Don’t forget your homework.", "اپنا ہوم ورک نہ بھولنا۔"], ["بَقِيتُ فِي الْبَيْتِ", "baqiitu fil-bayti", "I stayed at home.", "میں گھر پر رہا۔"]],
    practice: [{ en: "Say “I called my friend.”", ur: "«میں نے اپنے دوست کو بلایا» کہیں۔", a: "دَعَوْتُ صَدِيقِي", tr: "daʿawtu ṣadiiqii" }, { en: "Say “He did not forget.”", ur: "«وہ نہیں بھولا» کہیں۔", a: "لَمْ يَنْسَ", tr: "lam yansa" }, { en: "Tell a man “Walk slowly.”", ur: "مرد سے کہیں «آہستہ چلو»۔", a: "اِمْشِ بِبُطْءٍ", tr: "imshi bibuṭ’in" }],
  },
  {
    slug: "lesson-47-masdar", key: "كِتَابَةٌ",
    en: {
      title: "Reading, writing, going: the verbal noun", short: "The noun for the action itself.",
      intro: "Every verb has a noun for the action itself, like “writing” or “going”: {كَتَبَ} → {كِتَابَةٌ} (writing), {ذَهَبَ} → {ذَهَابٌ} (going), {قَرَأَ} → {قِرَاءَةٌ} (reading). For simple verbs the shape has to be learned, so learn each verb together with its verbal noun.",
      points: ["Common ones: {فَهْمٌ} understanding · {شُرْبٌ} drinking · {أَكْلٌ} eating · {نَوْمٌ} sleep · {خُرُوجٌ} going out · {جُلُوسٌ} sitting · {عَمَلٌ} work.", "Use it like any noun: {الْقِرَاءَةُ مُفِيدَةٌ} (reading is useful), {أُحِبُّ السِّبَاحَةَ} (I like swimming).", "It can replace {أَنْ} + verb from lesson 31: {أُرِيدُ الذَّهَابَ} means the same as {أُرِيدُ أَنْ أَذْهَبَ}."],
    },
    ur: {
      title: "پڑھنا، لکھنا، جانا: مصدر", short: "خود کام کا نام۔",
      intro: "ہر فعل کا ایک اسم ہوتا ہے جو خود کام کا نام ہے، جیسے «لکھنا» یا «جانا»: {كَتَبَ} ← {كِتَابَةٌ} (لکھنا)، {ذَهَبَ} ← {ذَهَابٌ} (جانا)، {قَرَأَ} ← {قِرَاءَةٌ} (پڑھنا)۔ ثلاثی افعال کے مصدر یاد کرنے پڑتے ہیں، اس لیے ہر فعل اس کے مصدر کے ساتھ یاد کریں۔",
      points: ["عام مصادر: {فَهْمٌ} سمجھنا · {شُرْبٌ} پینا · {أَكْلٌ} کھانا · {نَوْمٌ} نیند · {خُرُوجٌ} نکلنا · {جُلُوسٌ} بیٹھنا · {عَمَلٌ} کام۔", "اسے عام اسم کی طرح استعمال کریں: {الْقِرَاءَةُ مُفِيدَةٌ} (پڑھنا مفید ہے)، {أُحِبُّ السِّبَاحَةَ} (مجھے تیراکی پسند ہے)۔", "یہ سبق ۳۱ کے {أَنْ} + فعل کی جگہ آ سکتا ہے: {أُرِيدُ الذَّهَابَ} اور {أُرِيدُ أَنْ أَذْهَبَ} کا ایک ہی مطلب ہے۔"],
    },
    ex: [["الْقِرَاءَةُ مُفِيدَةٌ", "al-qiraa’atu mufiidatun", "Reading is useful.", "پڑھنا مفید ہے۔"], ["أُحِبُّ السِّبَاحَةَ", "uḥibbu s-sibaaḥata", "I like swimming.", "مجھے تیراکی پسند ہے۔"], ["الْكِتَابَةُ بِالْعَرَبِيَّةِ سَهْلَةٌ", "al-kitaabatu bil-ʿarabiyyati sahlatun", "Writing in Arabic is easy.", "عربی میں لکھنا آسان ہے۔"], ["النَّوْمُ مُبَكِّرًا مُفِيدٌ", "an-nawmu mubakkiran mufiidun", "Sleeping early is good for you.", "جلدی سونا فائدہ مند ہے۔"], ["أُرِيدُ الذَّهَابَ إِلَى السُّوقِ", "uriidu dh-dhahaaba ila s-suuqi", "I want to go to the market.", "میں بازار جانا چاہتا ہوں۔"], ["بَعْدَ الْأَكْلِ نَشْرَبُ الشَّايَ", "baʿda l-akli nashrabu sh-shaaya", "After eating we drink tea.", "کھانے کے بعد ہم چائے پیتے ہیں۔"]],
    practice: [{ en: "Give the verbal noun of {فَهِمَ}.", ur: "{فَهِمَ} کا مصدر بتائیں۔", a: "فَهْمٌ", tr: "fahmun" }, { en: "Say “Reading the Quran is easy.”", ur: "«قرآن پڑھنا آسان ہے» کہیں۔", a: "قِرَاءَةُ الْقُرْآنِ سَهْلَةٌ", tr: "qiraa’atu l-qur’aani sahlatun" }, { en: "Say “I like writing.”", ur: "«مجھے لکھنا پسند ہے» کہیں۔", a: "أُحِبُّ الْكِتَابَةَ", tr: "uḥibbu l-kitaabata" }],
  },
  {
    slug: "lesson-48-hal", key: "مُسْرِعًا",
    en: {
      title: "How did he come? Describing the state ({الْحَال})", short: "He came hurrying; I went on foot.",
      intro: "To say how someone did something, add a describing word ending in -an after the sentence: {جَاءَ الطَّالِبُ مُسْرِعًا} (the student came in a hurry). Grammarians call this the {حَال}, the state.",
      points: ["It matches the person in gender and number: {جَاءَتِ الْبِنْتُ مُسْرِعَةً} · {جَاءُوا مُسْرِعِينَ}.", "Many are doer forms from lesson 35: {رَاكِبًا} riding · {مَاشِيًا} on foot · {ضَاحِكًا} laughing · {جَالِسًا} sitting.", "Ask about it with {كَيْفَ}: {كَيْفَ جِئْتَ؟ جِئْتُ مَاشِيًا} (How did you come? I came on foot.)"],
    },
    ur: {
      title: "وہ کیسے آیا؟ حال", short: "وہ جلدی میں آیا؛ میں پیدل گیا۔",
      intro: "یہ بتانے کے لیے کہ کسی نے کام کس حالت میں کیا، جملے کے بعد ایک منصوب صفت لگائیں: {جَاءَ الطَّالِبُ مُسْرِعًا} (طالب علم جلدی جلدی آیا)۔ اسے {حَال} کہتے ہیں۔",
      points: ["حال مذکر مؤنث اور واحد جمع میں صاحبِ حال کے مطابق ہوتا ہے: {جَاءَتِ الْبِنْتُ مُسْرِعَةً} · {جَاءُوا مُسْرِعِينَ}۔", "اکثر حال سبق ۳۵ کے اسمِ فاعل ہوتے ہیں: {رَاكِبًا} سوار ہو کر · {مَاشِيًا} پیدل · {ضَاحِكًا} ہنستے ہوئے · {جَالِسًا} بیٹھ کر۔", "اس کے بارے میں {كَيْفَ} سے پوچھیں: {كَيْفَ جِئْتَ؟ جِئْتُ مَاشِيًا} (تم کیسے آئے؟ میں پیدل آیا۔)"],
    },
    ex: [["جَاءَ الطَّالِبُ مُسْرِعًا", "jaa’a ṭ-ṭaalibu musriʿan", "The student came in a hurry.", "طالب علم جلدی جلدی آیا۔"], ["رَجَعَتِ الْبِنْتُ فَرِحَةً", "rajaʿati l-bintu fariḥatan", "The girl came back happy.", "لڑکی خوش خوش واپس آئی۔"], ["ذَهَبْتُ إِلَى الْعَمَلِ مَاشِيًا", "dhahabtu ila l-ʿamali maashiyan", "I went to work on foot.", "میں پیدل کام پر گیا۔"], ["دَخَلَ الْأَطْفَالُ ضَاحِكِينَ", "dakhala l-aṭfaalu ḍaaḥikiina", "The children came in laughing.", "بچے ہنستے ہوئے اندر آئے۔"], ["أَكَلْتُ الطَّعَامَ جَالِسًا", "akaltu ṭ-ṭaʿaama jaalisan", "I ate the food sitting down.", "میں نے بیٹھ کر کھانا کھایا۔"], ["كَيْفَ جِئْتَ؟ جِئْتُ رَاكِبًا", "kayfa ji’ta? ji’tu raakiban", "How did you come? I came riding.", "تم کیسے آئے؟ میں سواری پر آیا۔"]],
    practice: [{ en: "Say “He came on foot.”", ur: "«وہ پیدل آیا» کہیں۔", a: "جَاءَ مَاشِيًا", tr: "jaa’a maashiyan" }, { en: "Say “She came back happy.”", ur: "«وہ خوش خوش واپس آئی» کہیں۔", a: "رَجَعَتْ فَرِحَةً", tr: "rajaʿat fariḥatan" }, { en: "Say “I drank the water standing.”", ur: "«میں نے کھڑے ہو کر پانی پیا» کہیں۔", a: "شَرِبْتُ الْمَاءَ قَائِمًا", tr: "sharibtu l-maa’a qaa’iman" }],
  },
  {
    slug: "lesson-49-form-2", key: "عَلَّمَ",
    en: {
      title: "Doubling the middle letter: {فَعَّلَ}", short: "عَلَّمَ، دَرَّسَ، نَظَّفَ، رَتَّبَ",
      intro: "Doubling the middle letter of a verb often means “make someone do it” or “do it thoroughly”: {عَلِمَ} (he knew) → {عَلَّمَ} (he taught, made someone know); {دَرَسَ} (he studied) → {دَرَّسَ} (he taught a subject). Present: {يُعَلِّمُ}, {يُدَرِّسُ}.",
      points: ["Pattern {فَعَّلَ يُفَعِّلُ}, verbal noun {تَفْعِيلٌ}: {تَعْلِيمٌ} education, {تَدْرِيسٌ} teaching.", "More: {نَظَّفَ} clean · {رَتَّبَ} arrange · {صَلَّى} pray · {سَلَّمَ} greet · {قَدَّمَ} offer, present.", "The doer starts with {مُـ}: {مُعَلِّمٌ} and {مُدَرِّسٌ} (teacher), words you already know."],
    },
    ur: {
      title: "درمیانی حرف مشدد: {فَعَّلَ}", short: "عَلَّمَ، دَرَّسَ، نَظَّفَ، رَتَّبَ",
      intro: "فعل کے درمیانی حرف پر شد لگانے سے اکثر «کسی سے کروانا» یا «خوب کرنا» کا مطلب پیدا ہوتا ہے: {عَلِمَ} (اس نے جانا) ← {عَلَّمَ} (اس نے سکھایا)؛ {دَرَسَ} (اس نے پڑھا) ← {دَرَّسَ} (اس نے پڑھایا)۔ مضارع: {يُعَلِّمُ}، {يُدَرِّسُ}۔",
      points: ["وزن {فَعَّلَ يُفَعِّلُ}، مصدر {تَفْعِيلٌ}: {تَعْلِيمٌ} تعلیم، {تَدْرِيسٌ} تدریس۔", "مزید: {نَظَّفَ} صاف کرنا · {رَتَّبَ} ترتیب دینا · {صَلَّى} نماز پڑھنا · {سَلَّمَ} سلام کرنا · {قَدَّمَ} پیش کرنا۔", "اسمِ فاعل {مُـ} سے شروع ہوتا ہے: {مُعَلِّمٌ} اور {مُدَرِّسٌ} (استاد)، جو آپ پہلے سے جانتے ہیں۔"],
    },
    ex: [["عَلَّمَنِي أَبِي الْقُرْآنَ", "ʿallamanii abii l-qur’aana", "My father taught me the Quran.", "میرے والد نے مجھے قرآن سکھایا۔"], ["يُدَرِّسُ الْعَرَبِيَّةَ فِي الْجَامِعَةِ", "yudarrisu l-ʿarabiyyata fil-jaamiʿati", "He teaches Arabic at the university.", "وہ یونیورسٹی میں عربی پڑھاتا ہے۔"], ["نَظَّفْتُ الْغُرْفَةَ", "naẓẓaftu l-ghurfata", "I cleaned the room.", "میں نے کمرہ صاف کیا۔"], ["رَتِّبْ كُتُبَكَ", "rattib kutubaka", "Arrange your books.", "اپنی کتابیں ترتیب سے رکھو۔"], ["قَدَّمَ لَنَا الْقَهْوَةَ", "qaddama lanaa l-qahwata", "He offered us coffee.", "اس نے ہمیں قہوہ پیش کیا۔"], ["التَّعْلِيمُ مُهِمٌّ", "at-taʿliimu muhimmun", "Education is important.", "تعلیم اہم ہے۔"]],
    practice: [{ en: "Say “I taught my son.”", ur: "«میں نے اپنے بیٹے کو سکھایا» کہیں۔", a: "عَلَّمْتُ ابْنِي", tr: "ʿallamtu bnii" }, { en: "Give the present of {نَظَّفَ}.", ur: "{نَظَّفَ} کا مضارع بتائیں۔", a: "يُنَظِّفُ", tr: "yunaẓẓifu" }, { en: "Give the doer of {دَرَّسَ}.", ur: "{دَرَّسَ} کا اسمِ فاعل بتائیں۔", a: "مُدَرِّسٌ", tr: "mudarrisun" }],
  },
  {
    slug: "lesson-50-form-4", key: "أَرْسَلَ",
    en: {
      title: "Adding {أَ}: {أَفْعَلَ}", short: "أَخْرَجَ، أَرْسَلَ، أَغْلَقَ، أَسْلَمَ",
      intro: "Adding {أَ} at the start also often means “make it happen”: {خَرَجَ} (he went out) → {أَخْرَجَ} (he took out); {دَخَلَ} (he entered) → {أَدْخَلَ} (he brought in). Present: {يُخْرِجُ}, {يُدْخِلُ}.",
      points: ["Pattern {أَفْعَلَ يُفْعِلُ}, verbal noun {إِفْعَالٌ}: {إِرْسَالٌ} sending, {إِسْلَامٌ} submission.", "More: {أَرْسَلَ} send · {أَغْلَقَ} close · {أَكْرَمَ} honour · {أَسْلَمَ} become Muslim · {أَحْسَنَ} do good.", "The doer starts with {مُـ}: {مُسْلِمٌ} Muslim (one who submits) · {مُحْسِنٌ} one who does good."],
    },
    ur: {
      title: "شروع میں {أَ}: {أَفْعَلَ}", short: "أَخْرَجَ، أَرْسَلَ، أَغْلَقَ، أَسْلَمَ",
      intro: "شروع میں {أَ} لگانے سے بھی اکثر «کروانا» کا مطلب آتا ہے: {خَرَجَ} (وہ نکلا) ← {أَخْرَجَ} (اس نے نکالا)؛ {دَخَلَ} (وہ داخل ہوا) ← {أَدْخَلَ} (اس نے داخل کیا)۔ مضارع: {يُخْرِجُ}، {يُدْخِلُ}۔",
      points: ["وزن {أَفْعَلَ يُفْعِلُ}، مصدر {إِفْعَالٌ}: {إِرْسَالٌ} بھیجنا، {إِسْلَامٌ} فرمانبرداری۔", "مزید: {أَرْسَلَ} بھیجنا · {أَغْلَقَ} بند کرنا · {أَكْرَمَ} عزت کرنا · {أَسْلَمَ} اسلام لانا · {أَحْسَنَ} نیکی کرنا۔", "اسمِ فاعل {مُـ} سے: {مُسْلِمٌ} مسلمان (فرمانبردار) · {مُحْسِنٌ} نیکی کرنے والا۔"],
    },
    ex: [["أَرْسَلْتُ رِسَالَةً إِلَى أُمِّي", "arsaltu risaalatan ilaa ummii", "I sent a letter to my mother.", "میں نے امی کو خط بھیجا۔"], ["أَغْلِقِ الْبَابَ مِنْ فَضْلِكَ", "aghliqi l-baaba min faḍlika", "Close the door, please.", "براہ کرم دروازہ بند کر دو۔"], ["أَخْرَجَ الْمُدَرِّسُ الْكِتَابَ مِنَ الْحَقِيبَةِ", "akhraja l-mudarrisu l-kitaaba mina l-ḥaqiibati", "The teacher took the book out of the bag.", "استاد نے بستے سے کتاب نکالی۔"], ["يُكْرِمُ الضَّيْفَ", "yukrimu ḍ-ḍayfa", "He honours the guest.", "وہ مہمان کی عزت کرتا ہے۔"], ["أَسْلَمَ كَثِيرٌ مِنَ النَّاسِ", "aslama kathiirun mina n-naasi", "Many people became Muslim.", "بہت سے لوگ مسلمان ہوئے۔"], ["إِنَّ اللّٰهَ يُحِبُّ الْمُحْسِنِينَ", "inna llaaha yuḥibbu l-muḥsiniina", "Allah loves those who do good. (2:195)", "بے شک اللہ نیکی کرنے والوں کو پسند کرتا ہے۔ (البقرہ ۱۹۵)"]],
    practice: [{ en: "Say “I closed the window.”", ur: "«میں نے کھڑکی بند کی» کہیں۔", a: "أَغْلَقْتُ النَّافِذَةَ", tr: "aghlaqtu n-naafidhata" }, { en: "Give the present of {أَرْسَلَ}.", ur: "{أَرْسَلَ} کا مضارع بتائیں۔", a: "يُرْسِلُ", tr: "yursilu" }, { en: "Give the verbal noun of {أَسْلَمَ}.", ur: "{أَسْلَمَ} کا مصدر بتائیں۔", a: "إِسْلَامٌ", tr: "islaamun" }],
  },
  {
    slug: "lesson-51-forms-5-6", key: "تَعَلَّمَ",
    en: {
      title: "Learning and cooperating: {تَفَعَّلَ} and {تَفَاعَلَ}", short: "تَعَلَّمَ، تَكَلَّمَ، تَعَاوَنَ، تَقَابَلَ",
      intro: "Adding {تَـ} to the doubled form gives a verb you do to or for yourself: {عَلَّمَ} (he taught) → {تَعَلَّمَ} (he learned). The pattern {تَفَاعَلَ} means doing something together: {تَعَاوَنَ} (they cooperated).",
      points: ["{تَفَعَّلَ يَتَفَعَّلُ}: {تَعَلَّمَ} learn · {تَكَلَّمَ} speak · {تَأَخَّرَ} be late · {تَوَضَّأَ} make wudu.", "{تَفَاعَلَ يَتَفَاعَلُ}: {تَعَاوَنَ} cooperate · {تَقَابَلَ} meet each other · {تَنَاوَلَ} have (a meal).", "You met several of these earlier: {يَتَأَخَّرُ}, {أَتَوَضَّأُ}, {تَتَكَلَّمُ}. Now you know their family."],
    },
    ur: {
      title: "سیکھنا اور تعاون: {تَفَعَّلَ} اور {تَفَاعَلَ}", short: "تَعَلَّمَ، تَكَلَّمَ، تَعَاوَنَ، تَقَابَلَ",
      intro: "مشدد وزن پر {تَـ} لگانے سے ایسا فعل بنتا ہے جو آدمی اپنے لیے کرتا ہے: {عَلَّمَ} (اس نے سکھایا) ← {تَعَلَّمَ} (اس نے سیکھا)۔ وزن {تَفَاعَلَ} مل کر کام کرنے کا مطلب دیتا ہے: {تَعَاوَنَ} (انہوں نے تعاون کیا)۔",
      points: ["{تَفَعَّلَ يَتَفَعَّلُ}: {تَعَلَّمَ} سیکھنا · {تَكَلَّمَ} بولنا · {تَأَخَّرَ} دیر کرنا · {تَوَضَّأَ} وضو کرنا۔", "{تَفَاعَلَ يَتَفَاعَلُ}: {تَعَاوَنَ} تعاون کرنا · {تَقَابَلَ} آپس میں ملنا · {تَنَاوَلَ} (کھانا) کھانا۔", "ان میں سے کئی پہلے آ چکے ہیں: {يَتَأَخَّرُ}، {أَتَوَضَّأُ}، {تَتَكَلَّمُ}۔ اب آپ ان کا خاندان جانتے ہیں۔"],
    },
    ex: [["تَعَلَّمْتُ الْعَرَبِيَّةَ فِي الْمَدِينَةِ", "taʿallamtu l-ʿarabiyyata fil-madiinati", "I learned Arabic in Madinah.", "میں نے عربی مدینہ میں سیکھی۔"], ["هَلْ تَتَكَلَّمُ الْعَرَبِيَّةَ؟", "hal tatakallamu l-ʿarabiyyata?", "Do you speak Arabic?", "کیا آپ عربی بولتے ہیں؟"], ["تَعَاوَنَ الطُّلَّابُ فِي الْعَمَلِ", "taʿaawana ṭ-ṭullaabu fil-ʿamali", "The students cooperated in the work.", "طلبہ نے کام میں ایک دوسرے کی مدد کی۔"], ["تَقَابَلْنَا فِي الْمَطَارِ", "taqaabalnaa fil-maṭaari", "We met at the airport.", "ہم ہوائی اڈے پر ملے۔"], ["تَنَاوَلْنَا الْعَشَاءَ مَعًا", "tanaawalnaa l-ʿashaa’a maʿan", "We had dinner together.", "ہم نے مل کر رات کا کھانا کھایا۔"], ["وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَى", "wa-taʿaawanuu ʿala l-birri wat-taqwaa", "Cooperate in goodness and piety. (5:2)", "نیکی اور تقویٰ میں ایک دوسرے کی مدد کرو۔ (المائدہ ۲)"]],
    practice: [{ en: "Say “I am learning Arabic.”", ur: "«میں عربی سیکھ رہا ہوں» کہیں۔", a: "أَتَعَلَّمُ الْعَرَبِيَّةَ", tr: "ataʿallamu l-ʿarabiyyata" }, { en: "Say “We cooperated.”", ur: "«ہم نے تعاون کیا» کہیں۔", a: "تَعَاوَنَّا", tr: "taʿaawannaa" }, { en: "Ask a woman “Do you speak Arabic?”", ur: "عورت سے پوچھیں «کیا آپ عربی بولتی ہیں؟»", a: "هَلْ تَتَكَلَّمِينَ الْعَرَبِيَّةَ؟", tr: "hal tatakallamiina l-ʿarabiyyata?" }],
  },
  {
    slug: "lesson-52-forms-8-10", key: "اِسْتَغْفَرَ",
    en: {
      title: "Meet, wait, ask forgiveness: {اِفْتَعَلَ} and {اِسْتَفْعَلَ}", short: "اِجْتَمَعَ، اِنْتَظَرَ، اِسْتَغْفَرَ، اِسْتَقْبَلَ",
      intro: "Two more common patterns. {اِفْتَعَلَ} adds {ت} after the first root letter: {جَمَعَ} (gather) → {اِجْتَمَعَ} (meet, get together). {اِسْتَفْعَلَ} adds {اِسْتَـ} and often means asking for something: {غَفَرَ} (forgive) → {اِسْتَغْفَرَ} (ask forgiveness).",
      points: ["{اِفْتَعَلَ}: {اِجْتَمَعَ} meet · {اِسْتَمَعَ} listen · {اِنْتَظَرَ} wait · {اِشْتَرَى} buy · {اِحْتَرَمَ} respect.", "{اِسْتَفْعَلَ}: {اِسْتَغْفَرَ} ask forgiveness · {اِسْتَقْبَلَ} welcome · {اِسْتَعْمَلَ} use · {اِسْتَطَاعَ} be able (lesson 31).", "The first alif is silent inside a sentence: {ثُمَّ اسْتَغْفَرَ} is read “thumma staghfara”."],
    },
    ur: {
      title: "ملنا، انتظار، مغفرت مانگنا: {اِفْتَعَلَ} اور {اِسْتَفْعَلَ}", short: "اِجْتَمَعَ، اِنْتَظَرَ، اِسْتَغْفَرَ، اِسْتَقْبَلَ",
      intro: "دو اور عام اوزان۔ {اِفْتَعَلَ} میں پہلے حرف کے بعد {ت} آتی ہے: {جَمَعَ} (جمع کرنا) ← {اِجْتَمَعَ} (جمع ہونا، ملنا)۔ {اِسْتَفْعَلَ} میں {اِسْتَـ} لگتا ہے اور اکثر «مانگنے» کا مطلب ہوتا ہے: {غَفَرَ} (معاف کرنا) ← {اِسْتَغْفَرَ} (مغفرت مانگنا)۔",
      points: ["{اِفْتَعَلَ}: {اِجْتَمَعَ} ملنا · {اِسْتَمَعَ} سننا · {اِنْتَظَرَ} انتظار کرنا · {اِشْتَرَى} خریدنا · {اِحْتَرَمَ} احترام کرنا۔", "{اِسْتَفْعَلَ}: {اِسْتَغْفَرَ} مغفرت مانگنا · {اِسْتَقْبَلَ} استقبال کرنا · {اِسْتَعْمَلَ} استعمال کرنا · {اِسْتَطَاعَ} سکنا (سبق ۳۱)۔", "جملے کے درمیان پہلا الف پڑھا نہیں جاتا: {ثُمَّ اسْتَغْفَرَ} کو «ثُمَّسْتَغْفَرَ» پڑھیں۔"],
    },
    ex: [["اِجْتَمَعَ الطُّلَّابُ فِي الْقَاعَةِ", "ijtamaʿa ṭ-ṭullaabu fil-qaaʿati", "The students gathered in the hall.", "طلبہ ہال میں جمع ہوئے۔"], ["اِنْتَظِرْنِي هُنَا", "intaẓirnii hunaa", "Wait for me here.", "یہاں میرا انتظار کرو۔"], ["اِشْتَرَيْتُ سَيَّارَةً جَدِيدَةً", "ishtaraytu sayyaaratan jadiidatan", "I bought a new car.", "میں نے نئی گاڑی خریدی۔"], ["أَسْتَغْفِرُ اللّٰهَ", "astaghfiru llaaha", "I ask Allah’s forgiveness.", "میں اللہ سے مغفرت مانگتا ہوں۔"], ["اِسْتَقْبَلَنَا فِي الْمَطَارِ", "istaqbalanaa fil-maṭaari", "He welcomed us at the airport.", "اس نے ہوائی اڈے پر ہمارا استقبال کیا۔"], ["أَسْتَعْمِلُ الْحَاسُوبَ كُلَّ يَوْمٍ", "astaʿmilu l-ḥaasuuba kulla yawmin", "I use the computer every day.", "میں روز کمپیوٹر استعمال کرتا ہوں۔"]],
    practice: [{ en: "Say “I listened to the lesson.”", ur: "«میں نے سبق سنا» کہیں۔", a: "اِسْتَمَعْتُ إِلَى الدَّرْسِ", tr: "istamaʿtu ila d-darsi" }, { en: "Say “We waited.”", ur: "«ہم نے انتظار کیا» کہیں۔", a: "اِنْتَظَرْنَا", tr: "intaẓarnaa" }, { en: "Give the present of {اِسْتَعْمَلَ}.", ur: "{اِسْتَعْمَلَ} کا مضارع بتائیں۔", a: "يَسْتَعْمِلُ", tr: "yastaʿmilu" }],
  },
  {
    slug: "lesson-53-purpose", key: "لِأَتَعَلَّمَ",
    en: {
      title: "In order to: {لِـ} and {لِكَيْ}", short: "I came to learn; we go to pray.",
      intro: "To say why you do something, put {لِـ} or {لِكَيْ} (in order to) before the present verb and end it in -a: {جِئْتُ لِأَتَعَلَّمَ} (I came to learn).",
      points: ["They work like {أَنْ}: {يَذْهَبُ لِيَعْمَلَ} (he goes to work). Verbs in -uuna lose the -na: {جَاءُوا لِيَدْرُسُوا}.", "A verbal noun ending in -an can also give the reason: {سَافَرَ طَلَبًا لِلْعِلْمِ} (he travelled seeking knowledge).", "Compare {لِأَنَّ} (because) + a sentence: {لَمْ أَحْضُرْ لِأَنِّي مَرِيضٌ} (I didn’t attend because I am ill)."],
    },
    ur: {
      title: "تاکہ: {لِـ} اور {لِكَيْ}", short: "میں سیکھنے آیا؛ ہم نماز پڑھنے جاتے ہیں۔",
      intro: "کام کا مقصد بتانے کے لیے مضارع سے پہلے {لِـ} یا {لِكَيْ} (تاکہ) لگائیں اور آخر زبر کریں: {جِئْتُ لِأَتَعَلَّمَ} (میں سیکھنے آیا)۔",
      points: ["یہ {أَنْ} کی طرح عمل کرتے ہیں: {يَذْهَبُ لِيَعْمَلَ} (وہ کام کرنے جاتا ہے)۔ {ـونَ} والے افعال کا نون گر جاتا ہے: {جَاءُوا لِيَدْرُسُوا}۔", "منصوب مصدر بھی وجہ بتا سکتا ہے: {سَافَرَ طَلَبًا لِلْعِلْمِ} (اس نے علم کی تلاش میں سفر کیا)۔", "موازنہ کریں: {لِأَنَّ} (کیونکہ) + جملہ: {لَمْ أَحْضُرْ لِأَنِّي مَرِيضٌ} (میں حاضر نہیں ہوا کیونکہ میں بیمار ہوں)۔"],
    },
    ex: [["جِئْتُ إِلَى السُّعُودِيَّةِ لِأَعْمَلَ", "ji’tu ila s-suʿuudiyyati li-aʿmala", "I came to Saudi Arabia to work.", "میں سعودی عرب کام کرنے آیا۔"], ["نَذْهَبُ إِلَى الْمَسْجِدِ لِنُصَلِّيَ", "nadhhabu ila l-masjidi li-nuṣalliya", "We go to the mosque to pray.", "ہم نماز پڑھنے مسجد جاتے ہیں۔"], ["اِقْرَأْ كَثِيرًا لِكَيْ تَتَعَلَّمَ", "iqra’ kathiiran likay tataʿallama", "Read a lot so that you learn.", "خوب پڑھو تاکہ سیکھو۔"], ["سَافَرَ طَلَبًا لِلْعِلْمِ", "saafara ṭalaban lil-ʿilmi", "He travelled seeking knowledge.", "اس نے علم کی تلاش میں سفر کیا۔"], ["لَمْ أَحْضُرْ لِأَنِّي كُنْتُ مَرِيضًا", "lam aḥḍur li’annii kuntu mariiḍan", "I didn’t attend because I was ill.", "میں حاضر نہیں ہوا کیونکہ میں بیمار تھا۔"], ["ذَهَبُوا إِلَى السُّوقِ لِيَشْتَرُوا طَعَامًا", "dhahabuu ila s-suuqi li-yashtaruu ṭaʿaaman", "They went to the market to buy food.", "وہ کھانا خریدنے بازار گئے۔"]],
    practice: [{ en: "Say “I study to learn.”", ur: "«میں سیکھنے کے لیے پڑھتا ہوں» کہیں۔", a: "أَدْرُسُ لِأَتَعَلَّمَ", tr: "adrusu li-ataʿallama" }, { en: "Say “He went to the market to buy dates.”", ur: "«وہ کھجوریں خریدنے بازار گیا» کہیں۔", a: "ذَهَبَ إِلَى السُّوقِ لِيَشْتَرِيَ تَمْرًا", tr: "dhahaba ila s-suuqi li-yashtariya tamran" }, { en: "Say “because I am tired” ({تَعْبَانُ}).", ur: "«کیونکہ میں تھکا ہوا ہوں» کہیں ({تَعْبَانُ})۔", a: "لِأَنِّي تَعْبَانُ", tr: "li’annii taʿbaanu" }],
  },
  {
    slug: "lesson-54-diptotes", key: "مَسَاجِدُ",
    en: {
      title: "Words without -un: {مَكَّةُ}, {أَحْمَدُ}, {مَسَاجِدُ}", short: "Names and plurals that never take tanween.",
      intro: "Some nouns never take the -un or -in endings, and after a preposition they end in -a instead of -i: {هٰذَا أَحْمَدُ} (not “aḥmadun”), {فِي مَكَّةَ} (in Makkah). Grammarians call them {مَمْنُوعٌ مِنَ الصَّرْفِ}.",
      points: ["Most names of cities and women: {مَكَّةُ}, {فَاطِمَةُ}, {زَيْنَبُ}; and men’s names on the pattern {أَفْعَلُ} or ending in {ـانُ}: {أَحْمَدُ}, {عُثْمَانُ}.", "Some plural shapes: {مَسَاجِدُ} mosques · {مَدَارِسُ} schools · {مَفَاتِيحُ} keys.", "Colours (lesson 32) and comparatives (lesson 22) are the same: {أَحْمَرُ}, {أَكْبَرُ}. With al- they behave normally again: {فِي الْمَسَاجِدِ}."],
    },
    ur: {
      title: "تنوین کے بغیر الفاظ: {مَكَّةُ}، {أَحْمَدُ}، {مَسَاجِدُ}", short: "وہ نام اور جمعیں جن پر تنوین نہیں آتی۔",
      intro: "بعض اسموں پر تنوین نہیں آتی اور حرفِ جر کے بعد ان پر زیر کی جگہ زبر آتا ہے: {هٰذَا أَحْمَدُ} («أَحْمَدٌ» نہیں)، {فِي مَكَّةَ} (مکہ میں)۔ انہیں {مَمْنُوعٌ مِنَ الصَّرْفِ} کہتے ہیں۔",
      points: ["اکثر شہروں اور عورتوں کے نام: {مَكَّةُ}، {فَاطِمَةُ}، {زَيْنَبُ}؛ اور {أَفْعَلُ} کے وزن پر یا {ـانُ} پر ختم ہونے والے مردوں کے نام: {أَحْمَدُ}، {عُثْمَانُ}۔", "بعض جمع کے اوزان: {مَسَاجِدُ} مسجدیں · {مَدَارِسُ} مدرسے · {مَفَاتِيحُ} چابیاں۔", "رنگ (سبق ۳۲) اور اسمِ تفضیل (سبق ۲۲) بھی ایسے ہی ہیں: {أَحْمَرُ}، {أَكْبَرُ}۔ الـ کے ساتھ یہ عام اسم کی طرح ہو جاتے ہیں: {فِي الْمَسَاجِدِ}۔"],
    },
    ex: [["ذَهَبْتُ إِلَى مَكَّةَ", "dhahabtu ilaa makkata", "I went to Makkah.", "میں مکہ گیا۔"], ["هٰذَا أَحْمَدُ", "haadhaa aḥmadu", "This is Ahmad.", "یہ احمد ہیں۔"], ["سَلَّمْتُ عَلَى فَاطِمَةَ", "sallamtu ʿalaa faaṭimata", "I greeted Fatima.", "میں نے فاطمہ کو سلام کیا۔"], ["فِي الْمَدِينَةِ مَسَاجِدُ كَثِيرَةٌ", "fil-madiinati masaajidu kathiiratun", "There are many mosques in Madinah.", "مدینہ میں بہت سی مسجدیں ہیں۔"], ["صَلَّيْتُ فِي مَسَاجِدَ كَثِيرَةٍ", "ṣallaytu fii masaajida kathiiratin", "I prayed in many mosques.", "میں نے بہت سی مسجدوں میں نماز پڑھی۔"], ["صَلَّيْتُ فِي الْمَسَاجِدِ", "ṣallaytu fil-masaajidi", "I prayed in the mosques.", "میں نے مسجدوں میں نماز پڑھی۔"]],
    practice: [{ en: "Say “from Makkah to Madinah”.", ur: "«مکہ سے مدینہ تک» کہیں۔", a: "مِنْ مَكَّةَ إِلَى الْمَدِينَةِ", tr: "min makkata ila l-madiinati" }, { en: "Say “I saw Zaynab.”", ur: "«میں نے زینب کو دیکھا» کہیں۔", a: "رَأَيْتُ زَيْنَبَ", tr: "ra’aytu zaynaba" }, { en: "Say “many schools”.", ur: "«بہت سے مدرسے» کہیں۔", a: "مَدَارِسُ كَثِيرَةٌ", tr: "madaarisu kathiiratun" }],
  },
  {
    slug: "lesson-55-qad", key: "قَدْ",
    en: {
      title: "Already, may: {قَدْ}", short: "The prayer has begun; it may rain.",
      intro: "{قَدْ} before a past verb means “already” or “indeed”: {قَدْ وَصَلَ الضُّيُوفُ} (the guests have arrived). Before a present verb it means “may” or “sometimes”: {قَدْ يَتَأَخَّرُ} (he may be late).",
      points: ["{لَقَدْ} is stronger: {لَقَدْ نَجَحْتُ!} (I really did pass!).", "You hear it in the iqama before the prayer: {قَدْ قَامَتِ الصَّلَاةُ} (the prayer has begun).", "Another way to stress an action is to repeat it as a verbal noun: {فَرِحْتُ فَرَحًا كَبِيرًا} (I was overjoyed; literally “I rejoiced a great rejoicing”)."],
    },
    ur: {
      title: "ہو چکا، ہو سکتا ہے: {قَدْ}", short: "نماز کھڑی ہو چکی؛ بارش ہو سکتی ہے۔",
      intro: "ماضی سے پہلے {قَدْ} کا مطلب ہے «ہو چکا» یا «یقیناً»: {قَدْ وَصَلَ الضُّيُوفُ} (مہمان پہنچ چکے ہیں)۔ مضارع سے پہلے «ہو سکتا ہے» یا «کبھی کبھی»: {قَدْ يَتَأَخَّرُ} (ہو سکتا ہے وہ دیر کرے)۔",
      points: ["{لَقَدْ} زیادہ زور دار ہے: {لَقَدْ نَجَحْتُ!} (میں واقعی کامیاب ہو گیا!)۔", "اقامت میں یہی آتا ہے: {قَدْ قَامَتِ الصَّلَاةُ} (نماز کھڑی ہو چکی)۔", "زور دینے کا ایک اور طریقہ فعل کے بعد اس کا مصدر لانا ہے: {فَرِحْتُ فَرَحًا كَبِيرًا} (میں بہت زیادہ خوش ہوا)۔"],
    },
    ex: [["قَدْ وَصَلَ الضُّيُوفُ", "qad waṣala ḍ-ḍuyuufu", "The guests have arrived.", "مہمان پہنچ چکے ہیں۔"], ["قَدْ قَامَتِ الصَّلَاةُ", "qad qaamati ṣ-ṣalaatu", "The prayer has begun.", "نماز کھڑی ہو چکی ہے۔"], ["قَدْ يَنْزِلُ الْمَطَرُ الْيَوْمَ", "qad yanzilu l-maṭaru l-yawma", "It may rain today.", "آج بارش ہو سکتی ہے۔"], ["لَقَدْ نَجَحْتُ فِي الِامْتِحَانِ", "laqad najaḥtu fil-imtiḥaani", "I really did pass the exam!", "میں امتحان میں کامیاب ہو گیا!"], ["فَرِحْتُ فَرَحًا كَبِيرًا", "fariḥtu faraḥan kabiiran", "I was overjoyed.", "میں بہت زیادہ خوش ہوا۔"], ["قَدْ أَفْلَحَ الْمُؤْمِنُونَ", "qad aflaḥa l-mu’minuuna", "The believers have succeeded. (23:1)", "یقیناً ایمان والے کامیاب ہو گئے۔ (المؤمنون ۱)"]],
    practice: [{ en: "Say “The lesson has begun.”", ur: "«سبق شروع ہو چکا ہے» کہیں۔", a: "قَدْ بَدَأَ الدَّرْسُ", tr: "qad bada’a d-darsu" }, { en: "Say “He may come tomorrow.”", ur: "«ہو سکتا ہے وہ کل آئے» کہیں۔", a: "قَدْ يَأْتِي غَدًا", tr: "qad ya’tii ghadan" }, { en: "Say “I really did learn!”", ur: "«میں نے واقعی سیکھ لیا!» کہیں۔", a: "لَقَدْ تَعَلَّمْتُ", tr: "laqad taʿallamtu" }],
  },
  {
    slug: "lesson-56-conditions", key: "إِذَا",
    en: {
      title: "If: {إِذَا}, {إِنْ} and {لَوْ}", short: "If he comes…; if you had studied…",
      intro: "{إِذَا} (if, when) is the everyday “if” for things that are likely, and it is followed by a past verb even about the future: {إِذَا جَاءَ أَحْمَدُ فَأَخْبِرْنِي} (if Ahmad comes, tell me).",
      points: ["{إِنْ} is a more formal “if”; both verbs take the silent ending: {إِنْ تَدْرُسْ تَنْجَحْ} (if you study, you will succeed).", "{لَوْ} is for things that did not or will not happen, and the answer starts with {لَـ}: {لَوْ دَرَسْتَ لَنَجَحْتَ} (if you had studied, you would have passed).", "When the answer is a command or a noun sentence it starts with {فَـ}: {إِذَا تَعِبْتَ فَنَمْ} (if you get tired, sleep)."],
    },
    ur: {
      title: "اگر: {إِذَا}، {إِنْ} اور {لَوْ}", short: "اگر وہ آئے…؛ اگر تم پڑھتے…",
      intro: "{إِذَا} (اگر، جب) روزمرہ کا «اگر» ہے جو متوقع باتوں کے لیے آتا ہے، اور مستقبل کے لیے بھی اس کے بعد ماضی آتا ہے: {إِذَا جَاءَ أَحْمَدُ فَأَخْبِرْنِي} (اگر احمد آئے تو مجھے بتانا)۔",
      points: ["{إِنْ} رسمی «اگر» ہے؛ دونوں فعل مجزوم ہوتے ہیں: {إِنْ تَدْرُسْ تَنْجَحْ} (اگر تم پڑھو گے تو کامیاب ہو گے)۔", "{لَوْ} ان باتوں کے لیے ہے جو نہیں ہوئیں یا نہیں ہوں گی، اور جواب {لَـ} سے شروع ہوتا ہے: {لَوْ دَرَسْتَ لَنَجَحْتَ} (اگر تم پڑھتے تو کامیاب ہو جاتے)۔", "جب جواب امر یا جملہ اسمیہ ہو تو {فَـ} سے شروع ہوتا ہے: {إِذَا تَعِبْتَ فَنَمْ} (اگر تھک جاؤ تو سو جاؤ)۔"],
    },
    ex: [["إِذَا جَاءَ أَحْمَدُ فَأَخْبِرْنِي", "idhaa jaa’a aḥmadu fa-akhbirnii", "If Ahmad comes, tell me.", "اگر احمد آئے تو مجھے بتانا۔"], ["إِذَا تَعِبْتَ فَنَمْ", "idhaa taʿibta fa-nam", "If you get tired, sleep.", "اگر تھک جاؤ تو سو جاؤ۔"], ["إِنْ تَدْرُسْ تَنْجَحْ", "in tadrus tanjaḥ", "If you study, you will succeed.", "اگر تم پڑھو گے تو کامیاب ہو گے۔"], ["لَوْ دَرَسْتَ لَنَجَحْتَ", "law darasta la-najaḥta", "If you had studied, you would have passed.", "اگر تم پڑھتے تو کامیاب ہو جاتے۔"], ["لَوْ كَانَ عِنْدِي مَالٌ لَحَجَجْتُ", "law kaana ʿindii maalun la-ḥajajtu", "If I had money, I would perform Hajj.", "اگر میرے پاس پیسہ ہوتا تو میں حج کرتا۔"], ["إِذَا جَاءَ نَصْرُ اللّٰهِ وَالْفَتْحُ", "idhaa jaa’a naṣru llaahi wal-fatḥu", "When the help of Allah and the victory come (110:1)", "جب اللہ کی مدد اور فتح آ جائے (النصر ۱)"]],
    practice: [{ en: "Say “If you are hungry, eat.” ({جُعْتَ})", ur: "«اگر بھوک لگے تو کھاؤ» کہیں ({جُعْتَ})۔", a: "إِذَا جُعْتَ فَكُلْ", tr: "idhaa juʿta fa-kul" }, { en: "Say “If it rains, I will stay at home.”", ur: "«اگر بارش ہوئی تو میں گھر پر رہوں گا» کہیں۔", a: "إِذَا نَزَلَ الْمَطَرُ بَقِيتُ فِي الْبَيْتِ", tr: "idhaa nazala l-maṭaru baqiitu fil-bayti" }, { en: "Say “If I were rich, I would travel.”", ur: "«اگر میں امیر ہوتا تو سفر کرتا» کہیں۔", a: "لَوْ كُنْتُ غَنِيًّا لَسَافَرْتُ", tr: "law kuntu ghaniyyan la-saafartu" }],
  },
  {
    slug: "lesson-57-doubled-verbs", key: "رَدَّ",
    en: {
      title: "Verbs with a shadda: {رَدَّ}, {ظَنَّ}, {أَحَبَّ}", short: "Reply, think, love, count, show.",
      intro: "Some verbs have the same second and third letter, written once with a shadda: {رَدَّ} (reply, return), {ظَنَّ} (think), {عَدَّ} (count). Present: {يَرُدُّ}, {يَظُنُّ}, {يَعُدُّ}.",
      points: ["When an ending that starts with a consonant is added, the two letters separate: {رَدَّ} but {رَدَدْتُ} (I replied), {ظَنَنْتُ} (I thought).", "More: {أَحَبَّ يُحِبُّ} love · {دَلَّ يَدُلُّ} show the way · {مَدَّ يَمُدُّ} stretch out · {شَدَّ يَشُدُّ} pull.", "The command keeps the shadda in everyday use: {رُدَّ} reply! · {دُلَّنِي} show me!"],
    },
    ur: {
      title: "شد والے افعال: {رَدَّ}، {ظَنَّ}، {أَحَبَّ}", short: "جواب دینا، سمجھنا، محبت کرنا، گننا، راستہ بتانا۔",
      intro: "بعض افعال کا دوسرا اور تیسرا حرف ایک ہوتا ہے جو شد کے ساتھ ایک بار لکھا جاتا ہے: {رَدَّ} (جواب دینا، لوٹانا)، {ظَنَّ} (گمان کرنا)، {عَدَّ} (گننا)۔ مضارع: {يَرُدُّ}، {يَظُنُّ}، {يَعُدُّ}۔",
      points: ["جب ایسی علامت لگے جو ساکن حرف سے شروع ہو تو دونوں حرف الگ ہو جاتے ہیں: {رَدَّ} مگر {رَدَدْتُ} (میں نے جواب دیا)، {ظَنَنْتُ} (میں نے سمجھا)۔", "مزید: {أَحَبَّ يُحِبُّ} محبت کرنا · {دَلَّ يَدُلُّ} راستہ بتانا · {مَدَّ يَمُدُّ} پھیلانا · {شَدَّ يَشُدُّ} کھینچنا۔", "روزمرہ امر میں شد باقی رہتی ہے: {رُدَّ} جواب دو! · {دُلَّنِي} مجھے راستہ بتاؤ!"],
    },
    ex: [["رَدَدْتُ عَلَى رِسَالَتِهِ", "radadtu ʿalaa risaalatihi", "I replied to his letter.", "میں نے اس کے خط کا جواب دیا۔"], ["ظَنَنْتُ أَنَّكَ مُسَافِرٌ", "ẓanantu annaka musaafirun", "I thought you were travelling.", "میں سمجھا کہ تم سفر پر ہو۔"], ["يُحِبُّ الْأَطْفَالُ الْحَلْوَى", "yuḥibbu l-aṭfaalu l-ḥalwaa", "Children love sweets.", "بچوں کو مٹھائی پسند ہے۔"], ["دُلَّنِي عَلَى الطَّرِيقِ مِنْ فَضْلِكَ", "dullanii ʿala ṭ-ṭariiqi min faḍlika", "Show me the way, please.", "براہ کرم مجھے راستہ بتا دیں۔"], ["عَدَدْتُ النُّقُودَ", "ʿadadtu n-nuquuda", "I counted the money.", "میں نے پیسے گنے۔"], ["مَدَّ يَدَهُ لِلسَّلَامِ", "madda yadahu lis-salaami", "He held out his hand to greet.", "اس نے سلام کے لیے ہاتھ بڑھایا۔"]],
    practice: [{ en: "Say “I loved the book.”", ur: "«مجھے کتاب پسند آئی» کہیں۔", a: "أَحْبَبْتُ الْكِتَابَ", tr: "aḥbabtu l-kitaaba" }, { en: "Give the present of {رَدَّ}.", ur: "{رَدَّ} کا مضارع بتائیں۔", a: "يَرُدُّ", tr: "yaruddu" }, { en: "Say “I thought it was easy.”", ur: "«میں نے اسے آسان سمجھا» کہیں۔", a: "ظَنَنْتُهُ سَهْلًا", tr: "ẓanantuhu sahlan" }],
  },
  {
    slug: "lesson-58-hamza-verbs", key: "أَكَلَ",
    en: {
      title: "Verbs with hamza: {أَكَلَ}, {أَخَذَ}, {سَأَلَ}", short: "Eat, take, ask, read, command.",
      intro: "Verbs with a hamza are mostly regular: {سَأَلَ يَسْأَلُ} (ask), {قَرَأَ يَقْرَأُ} (read), {أَكَلَ يَأْكُلُ} (eat). Only the seat of the hamza changes with the vowels around it.",
      points: ["Three short commands to memorise: {كُلْ} eat! · {خُذْ} take! · {مُرْ} order! (from {أَكَلَ}, {أَخَذَ}, {أَمَرَ}).", "With “I” in the present the two hamzas merge into {آ}: {آكُلُ} (I eat), {آخُذُ} (I take).", "The seat follows the vowels: {سَأَلَ} (on alif) · {سُئِلَ} (on ya, he was asked) · {يَقْرَءُونَ} (they read)."],
    },
    ur: {
      title: "ہمزہ والے افعال: {أَكَلَ}، {أَخَذَ}، {سَأَلَ}", short: "کھانا، لینا، پوچھنا، پڑھنا، حکم دینا۔",
      intro: "ہمزہ والے افعال زیادہ تر عام افعال کی طرح ہیں: {سَأَلَ يَسْأَلُ} (پوچھنا)، {قَرَأَ يَقْرَأُ} (پڑھنا)، {أَكَلَ يَأْكُلُ} (کھانا)۔ صرف ہمزہ کی کرسی آس پاس کی حرکات کے مطابق بدلتی ہے۔",
      points: ["تین مختصر امر یاد کر لیں: {كُلْ} کھاؤ · {خُذْ} لو · {مُرْ} حکم دو ({أَكَلَ}، {أَخَذَ}، {أَمَرَ} سے)۔", "«میں» کے مضارع میں دونوں ہمزہ مل کر {آ} بن جاتے ہیں: {آكُلُ} (میں کھاتا ہوں)، {آخُذُ} (میں لیتا ہوں)۔", "کرسی حرکات کے مطابق: {سَأَلَ} (الف پر) · {سُئِلَ} (یا پر، اس سے پوچھا گیا) · {يَقْرَءُونَ} (وہ پڑھتے ہیں)۔"],
    },
    ex: [["سَأَلْتُ الْمُدَرِّسَ سُؤَالًا", "sa’altu l-mudarrisa su’aalan", "I asked the teacher a question.", "میں نے استاد سے ایک سوال پوچھا۔"], ["كُلْ بِيَمِينِكَ", "kul biyamiinika", "Eat with your right hand.", "دائیں ہاتھ سے کھاؤ۔"], ["خُذْ هٰذَا الْكِتَابَ", "khudh haadha l-kitaaba", "Take this book.", "یہ کتاب لے لو۔"], ["آكُلُ التَّمْرَ كُلَّ يَوْمٍ", "aakulu t-tamra kulla yawmin", "I eat dates every day.", "میں روز کھجور کھاتا ہوں۔"], ["قَرَأْنَا سُورَةَ الْمُلْكِ", "qara’naa suurata l-mulki", "We read Surah al-Mulk.", "ہم نے سورہ ملک پڑھی۔"], ["يَأْمُرُنَا الْإِسْلَامُ بِالصِّدْقِ", "ya’murunaa l-islaamu biṣ-ṣidqi", "Islam commands us to be truthful.", "اسلام ہمیں سچ بولنے کا حکم دیتا ہے۔"]],
    practice: [{ en: "Tell a man “Take the key.”", ur: "مرد سے کہیں «چابی لے لو»۔", a: "خُذِ الْمِفْتَاحَ", tr: "khudhi l-miftaaḥa" }, { en: "Say “I eat bread.”", ur: "«میں روٹی کھاتا ہوں» کہیں۔", a: "آكُلُ الْخُبْزَ", tr: "aakulu l-khubza" }, { en: "Say “He asked me.”", ur: "«اس نے مجھ سے پوچھا» کہیں۔", a: "سَأَلَنِي", tr: "sa’alanii" }],
  },
  {
    slug: "lesson-59-dual-verbs", key: "يَكْتُبَانِ",
    en: {
      title: "Two people doing something: dual verbs", short: "كَتَبَا، يَكْتُبَانِ، أَنْتُمَا، هُمَا",
      intro: "When two people do something, the verb has its own ending: {كَتَبَا} (the two of them wrote), {يَكْتُبَانِ} (the two of them write). For two women: {كَتَبَتَا}, {تَكْتُبَانِ}.",
      points: ["You two: {كَتَبْتُمَا} (past) · {تَكْتُبَانِ} (present). Pronouns: {هُمَا} they two · {أَنْتُمَا} you two.", "After {أَنْ}, {لَنْ} and {لَمْ}, and in commands, the final -ni drops: {لَمْ يَكْتُبَا} · {اُكْتُبَا}.", "Their possessions: {كِتَابُهُمَا} the book of the two of them. For dual nouns, see lesson 15."],
    },
    ur: {
      title: "دو افراد کا کام: تثنیہ کے افعال", short: "كَتَبَا، يَكْتُبَانِ، أَنْتُمَا، هُمَا",
      intro: "جب دو افراد کوئی کام کریں تو فعل کی اپنی علامت ہوتی ہے: {كَتَبَا} (ان دونوں نے لکھا)، {يَكْتُبَانِ} (وہ دونوں لکھتے ہیں)۔ دو عورتوں کے لیے: {كَتَبَتَا}، {تَكْتُبَانِ}۔",
      points: ["تم دونوں: {كَتَبْتُمَا} (ماضی) · {تَكْتُبَانِ} (مضارع)۔ ضمیریں: {هُمَا} وہ دونوں · {أَنْتُمَا} تم دونوں۔", "{أَنْ}، {لَنْ}، {لَمْ} کے بعد اور امر میں آخری نون گر جاتا ہے: {لَمْ يَكْتُبَا} · {اُكْتُبَا}۔", "ملکیت: {كِتَابُهُمَا} ان دونوں کی کتاب۔ اسم کے تثنیہ کے لیے سبق ۱۵ دیکھیں۔"],
    },
    ex: [["الطَّالِبَانِ يَدْرُسَانِ", "aṭ-ṭaalibaani yadrusaani", "The two students are studying.", "دونوں طالب علم پڑھ رہے ہیں۔"], ["الْبِنْتَانِ كَتَبَتَا الدَّرْسَ", "al-bintaani katabataa d-darsa", "The two girls wrote the lesson.", "دونوں لڑکیوں نے سبق لکھا۔"], ["هَلْ أَنْتُمَا مُسْتَعِدَّانِ؟", "hal antumaa mustaʿiddaani?", "Are you two ready?", "کیا تم دونوں تیار ہو؟"], ["هُمَا أَخَوَانِ", "humaa akhawaani", "They are two brothers.", "وہ دونوں بھائی ہیں۔"], ["اِجْلِسَا هُنَا", "ijlisaa hunaa", "Sit here, you two.", "تم دونوں یہاں بیٹھو۔"], ["لَمْ يَحْضُرَا الدَّرْسَ", "lam yaḥḍuraa d-darsa", "The two of them didn’t attend the lesson.", "وہ دونوں سبق میں حاضر نہیں ہوئے۔"]],
    practice: [{ en: "Say “The two men went.”", ur: "«دونوں آدمی گئے» کہیں۔", a: "الرَّجُلَانِ ذَهَبَا", tr: "ar-rajulaani dhahabaa" }, { en: "Ask two people “What are you two doing?”", ur: "دو افراد سے پوچھیں «تم دونوں کیا کر رہے ہو؟»", a: "مَاذَا تَفْعَلَانِ؟", tr: "maadhaa tafʿalaani?" }, { en: "Say “The two of them did not write.”", ur: "«ان دونوں نے نہیں لکھا» کہیں۔", a: "لَمْ يَكْتُبَا", tr: "lam yaktubaa" }],
  },
  {
    slug: "lesson-60-place-tool-nouns", key: "مَكْتَبٌ",
    en: {
      title: "Place and tool words: {مَسْجِدٌ} and {مِفْتَاحٌ}", short: "The patterns behind mosque, office, kitchen and key.",
      intro: "Two patterns build hundreds of everyday words. {مَفْعَلٌ} or {مَفْعِلٌ} names the place of an action: {كَتَبَ} → {مَكْتَبٌ} (office, desk), {سَجَدَ} → {مَسْجِدٌ} (mosque, the place of prostration). {مِفْعَالٌ} or {مِفْعَلٌ} names the tool: {فَتَحَ} → {مِفْتَاحٌ} (key, the opener).",
      points: ["Places: {مَطْبَخٌ} kitchen ({طَبَخَ} cook) · {مَلْعَبٌ} playground ({لَعِبَ} play) · {مَطْعَمٌ} restaurant ({طَعِمَ} eat) · {مَدْرَسَةٌ} school ({دَرَسَ} study) · {مَطَارٌ} airport ({طَارَ} fly).", "Tools: {مِفْتَاحٌ} key · {مِقَصٌّ} scissors · {مِيزَانٌ} scales · {مِصْبَاحٌ} lamp · {مِكْنَسَةٌ} broom.", "Look back at lesson 1: {مَسْجِدٌ}, {مَكْتَبٌ} and {مِفْتَاحٌ} were among your first words. The root behind each word is the key to Arabic."],
    },
    ur: {
      title: "جگہ اور آلے کے نام: {مَسْجِدٌ} اور {مِفْتَاحٌ}", short: "مسجد، دفتر، باورچی خانہ اور چابی کے پیچھے اوزان۔",
      intro: "دو اوزان سے سیکڑوں روزمرہ الفاظ بنتے ہیں۔ {مَفْعَلٌ} یا {مَفْعِلٌ} کام کی جگہ کا نام ہے (اسمِ ظرف): {كَتَبَ} ← {مَكْتَبٌ} (دفتر، میز)، {سَجَدَ} ← {مَسْجِدٌ} (سجدے کی جگہ)۔ {مِفْعَالٌ} یا {مِفْعَلٌ} آلے کا نام ہے (اسمِ آلہ): {فَتَحَ} ← {مِفْتَاحٌ} (کھولنے کا آلہ، چابی)۔",
      points: ["جگہیں: {مَطْبَخٌ} باورچی خانہ ({طَبَخَ} پکانا) · {مَلْعَبٌ} کھیل کا میدان ({لَعِبَ} کھیلنا) · {مَطْعَمٌ} ریستوران ({طَعِمَ} کھانا) · {مَدْرَسَةٌ} مدرسہ ({دَرَسَ} پڑھنا) · {مَطَارٌ} ہوائی اڈا ({طَارَ} اڑنا)۔", "آلات: {مِفْتَاحٌ} چابی · {مِقَصٌّ} قینچی · {مِيزَانٌ} ترازو · {مِصْبَاحٌ} چراغ · {مِكْنَسَةٌ} جھاڑو۔", "سبق ۱ پر نظر ڈالیں: {مَسْجِدٌ}، {مَكْتَبٌ} اور {مِفْتَاحٌ} آپ کے پہلے الفاظ میں تھے۔ ہر لفظ کا مادہ ہی عربی کی کنجی ہے۔"],
    },
    ex: [["صَلَّيْنَا فِي الْمَسْجِدِ", "ṣallaynaa fil-masjidi", "We prayed in the mosque.", "ہم نے مسجد میں نماز پڑھی۔"], ["أُمِّي فِي الْمَطْبَخِ", "ummii fil-maṭbakhi", "My mother is in the kitchen.", "امی باورچی خانے میں ہیں۔"], ["تَغَدَّيْنَا فِي مَطْعَمٍ", "taghaddaynaa fii maṭʿamin", "We had lunch in a restaurant.", "ہم نے ایک ریستوران میں دوپہر کا کھانا کھایا۔"], ["وَصَلْنَا إِلَى الْمَطَارِ", "waṣalnaa ila l-maṭaari", "We arrived at the airport.", "ہم ہوائی اڈے پہنچے۔"], ["أَيْنَ الْمِفْتَاحُ؟", "ayna l-miftaaḥu?", "Where is the key?", "چابی کہاں ہے؟"], ["يَلْعَبُ الْأَوْلَادُ فِي الْمَلْعَبِ", "yalʿabu l-awlaadu fil-malʿabi", "The boys play in the playground.", "لڑکے میدان میں کھیلتے ہیں۔"]],
    practice: [{ en: "Make the place word from {جَلَسَ} (sit).", ur: "{جَلَسَ} (بیٹھنا) سے اسمِ ظرف بنائیں۔", a: "مَجْلِسٌ", tr: "majlisun", noteEn: "a sitting room, a council", noteUr: "بیٹھک، مجلس" }, { en: "Make the place word from {نَزَلَ} (stay, go down).", ur: "{نَزَلَ} (اترنا، ٹھہرنا) سے اسمِ ظرف بنائیں۔", a: "مَنْزِلٌ", tr: "manzilun", noteEn: "a home, a stopping place", noteUr: "گھر، منزل" }, { en: "Make the tool word from {نَشَرَ} (to saw).", ur: "{نَشَرَ} (آری چلانا) سے اسمِ آلہ بنائیں۔", a: "مِنْشَارٌ", tr: "minshaarun", noteEn: "a saw", noteUr: "آری" }],
  },
  {
    slug: "lesson-61-forms-3-7", key: "سَافَرَ",
    en: {
      title: "Doing it with someone, and things that just happen: Forms III and VII", short: "Travel, help, watch; it broke, it opened, it set off.",
      intro: "Form III puts a long a after the first root letter: {فَاعَلَ}. It often means doing something with or towards another person: {سَاعَدَ} (he helped), {شَاهَدَ} (he watched), {سَافَرَ} (he travelled). Form VII adds {اِنْـ} in front: {اِنْفَعَلَ}. It says that something happened to itself, without a doer: {كَسَرَ} (he broke) → {اِنْكَسَرَ} (it broke).",
      points: ["Form III: {فَاعَلَ} – {يُفَاعِلُ} – {مُفَاعَلَةٌ}. {سَاعَدَ يُسَاعِدُ مُسَاعَدَةٌ} help · {شَاهَدَ يُشَاهِدُ مُشَاهَدَةٌ} watch · {حَاوَلَ يُحَاوِلُ مُحَاوَلَةٌ} try · {نَاقَشَ يُنَاقِشُ مُنَاقَشَةٌ} discuss.", "Form VII: {اِنْفَعَلَ} – {يَنْفَعِلُ} – {اِنْفِعَالٌ}. It never takes an object: {اِنْفَتَحَ الْبَابُ} (the door came open) · {اِنْطَلَقَ} (set off) · {اِنْقَطَعَتِ الْكَهْرَبَاءُ} (the power went out).", "Compare: {كَسَرَ الْوَلَدُ الْقَلَمَ} (the boy broke the pen) → {اِنْكَسَرَ الْقَلَمُ} (the pen broke). For Forms II, IV, V, VI, VIII and X, see lessons 49 to 52."],
    },
    ur: {
      title: "کسی کے ساتھ کام، اور خود بخود ہونے والا کام: باب مُفاعَلہ اور اِنفِعال", short: "سفر، مدد، دیکھنا؛ ٹوٹ گیا، کھل گیا، روانہ ہو گیا۔",
      intro: "باب مُفاعَلہ (تیسرا باب) میں پہلے حرف کے بعد الف بڑھتا ہے: {فَاعَلَ}۔ اس میں اکثر کسی دوسرے کے ساتھ یا اس کی طرف کام کا مفہوم ہوتا ہے: {سَاعَدَ} (اس نے مدد کی)، {شَاهَدَ} (اس نے دیکھا)، {سَافَرَ} (اس نے سفر کیا)۔ باب اِنفِعال (ساتواں باب) کے شروع میں {اِنْـ} آتا ہے: {اِنْفَعَلَ}۔ یہ بتاتا ہے کہ کام خود بخود ہوا، کرنے والے کا ذکر نہیں: {كَسَرَ} (اس نے توڑا) ← {اِنْكَسَرَ} (ٹوٹ گیا)۔",
      points: ["باب مُفاعَلہ: {فَاعَلَ} – {يُفَاعِلُ} – {مُفَاعَلَةٌ}۔ {سَاعَدَ يُسَاعِدُ مُسَاعَدَةٌ} مدد کرنا · {شَاهَدَ يُشَاهِدُ مُشَاهَدَةٌ} دیکھنا · {حَاوَلَ يُحَاوِلُ مُحَاوَلَةٌ} کوشش کرنا · {نَاقَشَ يُنَاقِشُ مُنَاقَشَةٌ} بحث کرنا۔", "باب اِنفِعال: {اِنْفَعَلَ} – {يَنْفَعِلُ} – {اِنْفِعَالٌ}۔ یہ لازم ہوتا ہے، مفعول نہیں لیتا: {اِنْفَتَحَ الْبَابُ} (دروازہ کھل گیا) · {اِنْطَلَقَ} (روانہ ہوا) · {اِنْقَطَعَتِ الْكَهْرَبَاءُ} (بجلی چلی گئی)۔", "موازنہ کریں: {كَسَرَ الْوَلَدُ الْقَلَمَ} (لڑکے نے قلم توڑا) ← {اِنْكَسَرَ الْقَلَمُ} (قلم ٹوٹ گیا)۔ باقی ابواب کے لیے سبق ۴۹ سے ۵۲ دیکھیں۔"],
    },
    ex: [["سَافَرْتُ إِلَى الرِّيَاضِ", "saafartu ila r-riyaaḍi", "I travelled to Riyadh.", "میں نے ریاض کا سفر کیا۔"], ["سَاعَدَنِي صَدِيقِي", "saaʿadanii ṣadiiqii", "My friend helped me.", "میرے دوست نے میری مدد کی۔"], ["نُشَاهِدُ الْمُبَارَاةَ", "nushaahidu l-mubaaraata", "We are watching the match.", "ہم میچ دیکھ رہے ہیں۔"], ["حَاوِلْ مَرَّةً أُخْرَى", "ḥaawil marratan ukhraa", "Try again.", "دوبارہ کوشش کرو۔"], ["اِنْكَسَرَ الْقَلَمُ", "inkasara l-qalamu", "The pen broke.", "قلم ٹوٹ گیا۔"], ["اِنْطَلَقَ الْقِطَارُ", "inṭalaqa l-qiṭaaru", "The train set off.", "ٹرین روانہ ہو گئی۔"]],
    practice: [{ en: "Say “He helped his mother.”", ur: "«اس نے اپنی امی کی مدد کی» کہیں۔", a: "سَاعَدَ أُمَّهُ", tr: "saaʿada ummahu" }, { en: "Say “The door opened.” (Form VII of {فَتَحَ})", ur: "«دروازہ کھل گیا» کہیں ({فَتَحَ} کا باب اِنفِعال)۔", a: "اِنْفَتَحَ الْبَابُ", tr: "infataḥa l-baabu" }, { en: "Say “The power went out.”", ur: "«بجلی چلی گئی» کہیں۔", a: "اِنْقَطَعَتِ الْكَهْرَبَاءُ", tr: "inqaṭaʿati l-kahrabaa’u" }],
  },
  {
    slug: "lesson-62-waw-verbs", key: "وَصَلَ",
    en: {
      title: "Verbs that begin with {و}: {وَصَلَ يَصِلُ}", short: "Arrive, find, stop, put: the w drops in the present.",
      intro: "Some verbs have {و} as their first root letter. The past is regular: {وَصَلَ} (he arrived). In the present the {و} usually disappears: {يَصِلُ} (he arrives), {أَصِلُ} (I arrive). Grammarians call these verbs {الْمِثَالُ}.",
      points: ["Common ones: {وَصَلَ يَصِلُ} arrive · {وَجَدَ يَجِدُ} find · {وَقَفَ يَقِفُ} stand, stop · {وَضَعَ يَضَعُ} put · {وَعَدَ يَعِدُ} promise.", "Commands are very short: {قِفْ} (stop!), {ضَعْ} (put!). The stop signs on Saudi roads say {قِفْ}.", "The {و} stays in the past and in nouns from the same root: {وَصَلْتُ} (I arrived) · {مَوْعِدٌ} (appointment, from {وَعَدَ}) · {مَوْقِفٌ} (car park, stop, from {وَقَفَ}) · {وُصُولٌ} (arrival)."],
    },
    ur: {
      title: "{و} سے شروع ہونے والے افعال: {وَصَلَ يَصِلُ}", short: "پہنچنا، پانا، رکنا، رکھنا: مضارع میں واؤ گر جاتا ہے۔",
      intro: "کچھ افعال کا پہلا حرفِ اصلی {و} ہوتا ہے۔ ماضی عام قاعدے پر ہوتی ہے: {وَصَلَ} (وہ پہنچا)۔ مضارع میں عموماً {و} گر جاتا ہے: {يَصِلُ} (وہ پہنچتا ہے)، {أَصِلُ} (میں پہنچتا ہوں)۔ ان افعال کو {الْمِثَالُ} (مثال واوی) کہتے ہیں۔",
      points: ["عام افعال: {وَصَلَ يَصِلُ} پہنچنا · {وَجَدَ يَجِدُ} پانا · {وَقَفَ يَقِفُ} کھڑا ہونا، رکنا · {وَضَعَ يَضَعُ} رکھنا · {وَعَدَ يَعِدُ} وعدہ کرنا۔", "امر بہت مختصر ہوتا ہے: {قِفْ} (رکو!)، {ضَعْ} (رکھو!)۔ سعودی سڑکوں پر «اسٹاپ» کے نشان پر {قِفْ} لکھا ہوتا ہے۔", "ماضی میں اور اسی مادے کے اسماء میں {و} باقی رہتا ہے: {وَصَلْتُ} (میں پہنچا) · {مَوْعِدٌ} (ملاقات کا وقت، {وَعَدَ} سے) · {مَوْقِفٌ} (پارکنگ، اسٹاپ، {وَقَفَ} سے) · {وُصُولٌ} (آمد)۔"],
    },
    ex: [["وَصَلْتُ إِلَى الْمَطَارِ", "waṣaltu ila l-maṭaari", "I arrived at the airport.", "میں ہوائی اڈے پہنچ گیا۔"], ["مَتَى تَصِلُ الطَّائِرَةُ؟", "mataa taṣilu ṭ-ṭaa’iratu?", "When does the plane arrive?", "جہاز کب پہنچے گا؟"], ["وَجَدْتُ الْمِفْتَاحَ", "wajadtu l-miftaaḥa", "I found the key.", "مجھے چابی مل گئی۔"], ["لَا أَجِدُ قَلَمِي", "laa ajidu qalamii", "I can’t find my pen.", "مجھے اپنا قلم نہیں مل رہا۔"], ["ضَعِ الْكِتَابَ عَلَى الْمَكْتَبِ", "ḍaʿi l-kitaaba ʿala l-maktabi", "Put the book on the desk.", "کتاب میز پر رکھو۔"], ["قِفْ هُنَا", "qif hunaa", "Stop here.", "یہاں رکو۔"]],
    practice: [{ en: "Say “I promise you.” ({وَعَدَ})", ur: "«میں تم سے وعدہ کرتا ہوں» کہیں ({وَعَدَ})۔", a: "أَعِدُكَ", tr: "aʿiduka" }, { en: "Say “We arrived yesterday.”", ur: "«ہم کل پہنچے» کہیں۔", a: "وَصَلْنَا أَمْسِ", tr: "waṣalnaa amsi" }, { en: "Tell a man “Put the pen in the bag.”", ur: "ایک آدمی سے کہیں «قلم بستے میں رکھو»۔", a: "ضَعِ الْقَلَمَ فِي الْحَقِيبَةِ", tr: "ḍaʿi l-qalama fil-ḥaqiibati" }],
  },
  {
    slug: "lesson-63-la-none-at-all", key: "لَا رَيْبَ",
    en: {
      title: "None at all: {لَا} + noun", short: "No doubt, no problem, no god but Allah.",
      intro: "{لَا} before an indefinite noun denies the whole kind: {لَا شَكَّ} (no doubt at all). The noun takes a single fatha with no tanween: {لَا رَجُلَ فِي الْبَيْتِ} (there is no man at all in the house). You already know the greatest example: {لَا إِلٰهَ إِلَّا اللّٰهُ} (there is no god but Allah).",
      points: ["Everyday phrases: {لَا بَأْسَ} no problem, it’s fine · {لَا شَكَّ} no doubt · {لَا أَحَدَ} no one · {لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ} there is no power and no strength except with Allah.", "Surah al-Baqarah opens with it: {ذٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ} (that is the Book, there is no doubt in it).", "Compare with {لَيْسَ} (lesson 14): {لَيْسَ فِي الْبَيْتِ رَجُلٌ} (there isn’t a man in the house) is a plain statement; {لَا رَجُلَ فِي الْبَيْتِ} is stronger: not a single man."],
    },
    ur: {
      title: "بالکل نہیں: {لَا} + اسم", short: "کوئی شک نہیں، کوئی بات نہیں، اللہ کے سوا کوئی معبود نہیں۔",
      intro: "نکرہ اسم سے پہلے {لَا} پوری جنس کی نفی کرتا ہے: {لَا شَكَّ} (بالکل کوئی شک نہیں)۔ اسم پر ایک زبر آتا ہے، تنوین نہیں: {لَا رَجُلَ فِي الْبَيْتِ} (گھر میں کوئی بھی آدمی نہیں)۔ اس کی سب سے عظیم مثال آپ جانتے ہیں: {لَا إِلٰهَ إِلَّا اللّٰهُ} (اللہ کے سوا کوئی معبود نہیں)۔ اسے «لائے نفیِ جنس» کہتے ہیں۔",
      points: ["روزمرہ کے جملے: {لَا بَأْسَ} کوئی بات نہیں · {لَا شَكَّ} کوئی شک نہیں · {لَا أَحَدَ} کوئی نہیں · {لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ}۔", "سورۃ البقرہ اسی سے شروع ہوتی ہے: {ذٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ} (یہ وہ کتاب ہے جس میں کوئی شک نہیں)۔", "{لَيْسَ} (سبق ۱۴) سے موازنہ: {لَيْسَ فِي الْبَيْتِ رَجُلٌ} (گھر میں آدمی نہیں ہے) سادہ خبر ہے؛ {لَا رَجُلَ فِي الْبَيْتِ} زیادہ زور دار ہے: ایک بھی آدمی نہیں۔"],
    },
    ex: [["لَا بَأْسَ", "laa ba’sa", "No problem. / It’s fine.", "کوئی بات نہیں۔"], ["لَا شَكَّ فِي ذٰلِكَ", "laa shakka fii dhaalika", "There is no doubt about that.", "اس میں کوئی شک نہیں۔"], ["لَا طَالِبَ فِي الْفَصْلِ", "laa ṭaaliba fil-faṣli", "There is no student at all in the class.", "کلاس میں کوئی طالب علم نہیں۔"], ["لَا مَاءَ فِي الْكَأْسِ", "laa maa’a fil-ka’si", "There is no water in the glass.", "گلاس میں بالکل پانی نہیں۔"], ["لَا إِلٰهَ إِلَّا اللّٰهُ", "laa ilaaha illa llaahu", "There is no god but Allah.", "اللہ کے سوا کوئی معبود نہیں۔"], ["لَا رَيْبَ فِيهِ", "laa rayba fiihi", "There is no doubt in it.", "اس میں کوئی شک نہیں۔"]],
    practice: [{ en: "Say “There is no car in the street.”", ur: "«سڑک پر کوئی گاڑی نہیں» کہیں۔", a: "لَا سَيَّارَةَ فِي الشَّارِعِ", tr: "laa sayyaarata fish-shaariʿi" }, { en: "Say “There is no one in the house.” ({أَحَدَ})", ur: "«گھر میں کوئی نہیں» کہیں ({أَحَدَ})۔", a: "لَا أَحَدَ فِي الْبَيْتِ", tr: "laa aḥada fil-bayti" }, { en: "Someone apologises to you. Reply “No problem.”", ur: "کوئی آپ سے معذرت کرے۔ جواب دیں «کوئی بات نہیں»۔", a: "لَا بَأْسَ", tr: "laa ba’sa" }],
  },
  {
    slug: "lesson-64-nationality", key: "عَرَبِيٌّ",
    en: {
      title: "Saudi, Pakistani, Arabic: words ending in {ـِيٌّ}", short: "Where are you from? Nationalities and “related to” words.",
      intro: "Add {ـِيٌّ} to a place or thing to make a word meaning “from” or “related to” it: {بَاكِسْتَانُ} → {بَاكِسْتَانِيٌّ} (Pakistani), {مِصْرُ} → {مِصْرِيٌّ} (Egyptian). For a woman add {ـةٌ}: {بَاكِسْتَانِيَّةٌ}. This is called {النِّسْبَةُ}.",
      points: ["Drop {الـ} and a final {ـة} or {ـا} first: {السُّعُودِيَّةُ} → {سُعُودِيٌّ} · {مَكَّةُ} → {مَكِّيٌّ} · {أَمْرِيكَا} → {أَمْرِيكِيٌّ} · {الْهِنْدُ} → {هِنْدِيٌّ}.", "It works for any noun, not only places: {عَرَبٌ} → {عَرَبِيٌّ} (Arab, Arabic) · {إِسْلَامٌ} → {إِسْلَامِيٌّ} (Islamic) · {يَوْمٌ} → {يَوْمِيٌّ} (daily) · {هِجْرَةٌ} → {هِجْرِيٌّ} (Hijri).", "Languages use the feminine, because {لُغَةٌ} is feminine: {الْعَرَبِيَّةُ} Arabic · {الْأُرْدِيَّةُ} Urdu · {الْإِنْجِلِيزِيَّةُ} English. Plural for men: {بَاكِسْتَانِيُّونَ}; for women: {بَاكِسْتَانِيَّاتٌ}."],
    },
    ur: {
      title: "سعودی، پاکستانی، عربی: {ـِيٌّ} والے الفاظ", short: "آپ کہاں سے ہیں؟ قومیت اور نسبت کے الفاظ۔",
      intro: "کسی جگہ یا چیز کے آخر میں {ـِيٌّ} لگائیں تو «اس سے متعلق» یا «وہاں کا» کے معنی بنتے ہیں: {بَاكِسْتَانُ} ← {بَاكِسْتَانِيٌّ} (پاکستانی)، {مِصْرُ} ← {مِصْرِيٌّ} (مصری)۔ عورت کے لیے {ـةٌ} بڑھائیں: {بَاكِسْتَانِيَّةٌ}۔ اسے {النِّسْبَةُ} (اسمِ منسوب) کہتے ہیں۔ اردو کے «پاکستانی، عربی، اسلامی» اسی قاعدے سے آئے ہیں۔",
      points: ["پہلے {الـ} اور آخری {ـة} یا {ـا} ہٹا دیں: {السُّعُودِيَّةُ} ← {سُعُودِيٌّ} · {مَكَّةُ} ← {مَكِّيٌّ} · {أَمْرِيكَا} ← {أَمْرِيكِيٌّ} · {الْهِنْدُ} ← {هِنْدِيٌّ}۔", "یہ ہر اسم کے ساتھ ہوتا ہے، صرف جگہوں کے ساتھ نہیں: {عَرَبٌ} ← {عَرَبِيٌّ} (عرب، عربی) · {إِسْلَامٌ} ← {إِسْلَامِيٌّ} (اسلامی) · {يَوْمٌ} ← {يَوْمِيٌّ} (روزانہ) · {هِجْرَةٌ} ← {هِجْرِيٌّ} (ہجری)۔", "زبانوں کے لیے مؤنث آتا ہے کیونکہ {لُغَةٌ} مؤنث ہے: {الْعَرَبِيَّةُ} عربی · {الْأُرْدِيَّةُ} اردو · {الْإِنْجِلِيزِيَّةُ} انگریزی۔ مردوں کی جمع: {بَاكِسْتَانِيُّونَ}؛ عورتوں کی: {بَاكِسْتَانِيَّاتٌ}۔"],
    },
    ex: [["أَنَا بَاكِسْتَانِيٌّ", "anaa baakistaaniyyun", "I am Pakistani.", "میں پاکستانی ہوں۔"], ["هِيَ سُعُودِيَّةٌ", "hiya suʿuudiyyatun", "She is Saudi.", "وہ سعودی ہیں۔"], ["مِنْ أَيْنَ أَنْتَ؟", "min ayna anta?", "Where are you from?", "آپ کہاں سے ہیں؟"], ["أَتَكَلَّمُ الْعَرَبِيَّةَ وَالْأُرْدِيَّةَ", "atakallamu l-ʿarabiyyata wal-urdiyyata", "I speak Arabic and Urdu.", "میں عربی اور اردو بولتا ہوں۔"], ["هٰذَا طَعَامٌ هِنْدِيٌّ", "haadhaa ṭaʿaamun hindiyyun", "This is Indian food.", "یہ ہندوستانی کھانا ہے۔"], ["التَّقْوِيمُ الْهِجْرِيُّ", "at-taqwiimu l-hijriyyu", "the Hijri calendar", "ہجری کیلنڈر"]],
    practice: [{ en: "Make the word for “an Egyptian woman”.", ur: "«مصری عورت» کا لفظ بنائیں۔", a: "مِصْرِيَّةٌ", tr: "miṣriyyatun" }, { en: "Say “My friend is Turkish.” ({تُرْكِيَا})", ur: "«میرا دوست ترک ہے» کہیں ({تُرْكِيَا})۔", a: "صَدِيقِي تُرْكِيٌّ", tr: "ṣadiiqii turkiyyun" }, { en: "Make “daily” from {يَوْمٌ}.", ur: "{يَوْمٌ} سے «روزانہ» بنائیں۔", a: "يَوْمِيٌّ", tr: "yawmiyyun" }],
  },
  {
    slug: "lesson-65-let-him", key: "لِيَكْتُبْ",
    en: {
      title: "Let him…, let’s…: {لِـ} before a verb", short: "Instructions for someone who isn’t “you”.",
      intro: "To say “let him” or “let’s”, put {لِـ} before the present verb and give the verb the silent ending: {لِيَكْتُبْ} (let him write), {لِنَذْهَبْ} (let’s go). After {وَ} or {فَـ} the {لِـ} loses its vowel: {فَلْيَكْتُبْ}, {وَلْنَبْدَأْ}.",
      points: ["It gives instructions to someone absent, or to “us”: {لِيَدْخُلْ} let him come in · {لِتَجْلِسْ} let her sit · {لِنَقْرَأْ} let’s read. For “you”, use the ordinary command from lesson 17.", "A famous hadith: {فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ} (let him say something good or keep silent).", "To say “let him not”, use {لَا} with the silent ending: {لَا يَتَأَخَّرْ أَحَدٌ} (let no one be late), just like {لَا تَكْتُبْ} in lesson 27."],
    },
    ur: {
      title: "وہ کرے…، آؤ ہم کریں…: لامِ امر", short: "غائب اور «ہم» کے لیے حکم۔",
      intro: "«وہ کرے» یا «آؤ ہم کریں» کہنے کے لیے مضارع سے پہلے {لِـ} لگائیں اور فعل مجزوم کریں: {لِيَكْتُبْ} (وہ لکھے)، {لِنَذْهَبْ} (آؤ چلیں)۔ {وَ} یا {فَـ} کے بعد {لِـ} ساکن ہو جاتا ہے: {فَلْيَكْتُبْ}، {وَلْنَبْدَأْ}۔ اسے لامِ امر کہتے ہیں۔",
      points: ["یہ غائب یا متکلم (ہم) کو حکم دیتا ہے: {لِيَدْخُلْ} وہ اندر آئے · {لِتَجْلِسْ} وہ (عورت) بیٹھے · {لِنَقْرَأْ} آؤ پڑھیں۔ «تم» کے لیے سبق ۱۷ والا عام امر استعمال کریں۔", "مشہور حدیث: {فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ} (اسے چاہیے کہ بھلی بات کہے یا خاموش رہے)۔", "«وہ نہ کرے» کے لیے {لَا} اور مجزوم فعل: {لَا يَتَأَخَّرْ أَحَدٌ} (کوئی دیر نہ کرے)، بالکل سبق ۲۷ کے {لَا تَكْتُبْ} کی طرح۔"],
    },
    ex: [["لِنَذْهَبْ إِلَى الْمَسْجِدِ", "li-nadhhab ila l-masjidi", "Let’s go to the mosque.", "آؤ مسجد چلیں۔"], ["لِيَدْخُلِ الطُّلَّابُ", "li-yadkhuli ṭ-ṭullaabu", "Let the students come in.", "طلبہ اندر آ جائیں۔"], ["فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", "fal-yaqul khayran aw li-yaṣmut", "Let him say something good or keep silent.", "اسے چاہیے کہ بھلی بات کہے یا خاموش رہے۔"], ["لِنَبْدَأِ الدَّرْسَ", "li-nabda’i d-darsa", "Let’s start the lesson.", "آئیے سبق شروع کریں۔"], ["لِتَجْلِسْ فَاطِمَةُ هُنَا", "li-tajlis faaṭimatu hunaa", "Let Fatima sit here.", "فاطمہ یہاں بیٹھ جائیں۔"], ["لَا يَتَأَخَّرْ أَحَدٌ", "laa yata’akhkhar aḥadun", "Let no one be late.", "کوئی دیر نہ کرے۔"]],
    practice: [{ en: "Say “Let’s eat.”", ur: "«آؤ کھانا کھائیں» کہیں۔", a: "لِنَأْكُلْ", tr: "li-na’kul" }, { en: "Say “Let him read the book.”", ur: "«وہ کتاب پڑھے» کہیں۔", a: "لِيَقْرَأِ الْكِتَابَ", tr: "li-yaqra’i l-kitaaba" }, { en: "Say “Let’s travel tomorrow.”", ur: "«آؤ کل سفر کریں» کہیں۔", a: "لِنُسَافِرْ غَدًا", tr: "li-nusaafir ghadan" }],
  },
  {
    slug: "lesson-66-tamyiz", key: "عِلْمًا",
    en: {
      title: "More in what? Clarifying with {ـًا}", short: "Older in age, a kilo of meat, twenty students.",
      intro: "Some sentences are vague until you add one more word: {أَخِي أَكْثَرُ مِنِّي} (my brother is more than me)… more what? Add an indefinite noun ending in {ـًا}: {أَكْثَرُ مِنِّي عِلْمًا} (more than me in knowledge). This clarifying word is called {التَّمْيِيزُ}.",
      points: ["After comparisons (lesson 22): {أَكْبَرُ سِنًّا} older (in age) · {أَحْسَنُ خَطًّا} better handwriting · {أَشَدُّ حَرًّا} hotter.", "After measures and with “filling” verbs: {اِشْتَرَيْتُ كِيلُو لَحْمًا} (I bought a kilo of meat) · {اِمْتَلَأَ الْكَأْسُ مَاءً} (the glass filled with water). After a measure you can also say {كِيلُو لَحْمٍ}.", "After numbers 11 to 99 (lesson 33) and after {كَمْ} (lesson 20): {عِشْرُونَ طَالِبًا} · {أَحَدَ عَشَرَ كَوْكَبًا} (eleven stars, Surah Yusuf) · {كَمْ كِتَابًا قَرَأْتَ؟}"],
    },
    ur: {
      title: "کس چیز میں زیادہ؟ تمییز", short: "عمر میں بڑا، ایک کلو گوشت، بیس طلبہ۔",
      intro: "کچھ جملے ایک لفظ کے بغیر مبہم رہتے ہیں: {أَخِي أَكْثَرُ مِنِّي} (میرا بھائی مجھ سے زیادہ ہے)… کس چیز میں؟ آخر میں {ـًا} والا نکرہ اسم لگائیں: {أَكْثَرُ مِنِّي عِلْمًا} (علم میں مجھ سے زیادہ)۔ ابہام دور کرنے والے اس لفظ کو {التَّمْيِيزُ} کہتے ہیں۔",
      points: ["اسمِ تفضیل کے بعد (سبق ۲۲): {أَكْبَرُ سِنًّا} عمر میں بڑا · {أَحْسَنُ خَطًّا} لکھائی میں بہتر · {أَشَدُّ حَرًّا} زیادہ گرم۔", "ناپ تول کے بعد اور «بھرنے» والے افعال کے ساتھ: {اِشْتَرَيْتُ كِيلُو لَحْمًا} (میں نے ایک کلو گوشت خریدا) · {اِمْتَلَأَ الْكَأْسُ مَاءً} (گلاس پانی سے بھر گیا)۔ ناپ کے بعد اضافت بھی درست ہے: {كِيلُو لَحْمٍ}۔", "گیارہ سے ننانوے تک کے اعداد (سبق ۳۳) اور {كَمْ} (سبق ۲۰) کے بعد: {عِشْرُونَ طَالِبًا} · {أَحَدَ عَشَرَ كَوْكَبًا} (گیارہ ستارے، سورۃ یوسف) · {كَمْ كِتَابًا قَرَأْتَ؟}"],
    },
    ex: [["أَخِي أَكْبَرُ مِنِّي سِنًّا", "akhii akbaru minnii sinnan", "My brother is older than me.", "میرا بھائی عمر میں مجھ سے بڑا ہے۔"], ["هُوَ أَحْسَنُ مِنِّي خَطًّا", "huwa aḥsanu minnii khaṭṭan", "His handwriting is better than mine.", "اس کی لکھائی مجھ سے اچھی ہے۔"], ["الصَّيْفُ أَشَدُّ حَرًّا", "aṣ-ṣayfu ashaddu ḥarran", "Summer is hotter.", "گرمیاں زیادہ گرم ہوتی ہیں۔"], ["اِشْتَرَيْتُ كِيلُو لَحْمًا", "ishtaraytu kiiluu laḥman", "I bought a kilo of meat.", "میں نے ایک کلو گوشت خریدا۔"], ["اِمْتَلَأَ الْكَأْسُ مَاءً", "imtala’a l-ka’su maa’an", "The glass filled with water.", "گلاس پانی سے بھر گیا۔"], ["فِي الْفَصْلِ عِشْرُونَ طَالِبًا", "fil-faṣli ʿishruuna ṭaaliban", "There are twenty students in the class.", "کلاس میں بیس طلبہ ہیں۔"]],
    practice: [{ en: "Say “She is more knowledgeable than me.”", ur: "«وہ علم میں مجھ سے زیادہ ہیں» کہیں۔", a: "هِيَ أَكْثَرُ مِنِّي عِلْمًا", tr: "hiya aktharu minnii ʿilman" }, { en: "Say “I drank a glass of milk.”", ur: "«میں نے ایک گلاس دودھ پیا» کہیں۔", a: "شَرِبْتُ كَأْسًا حَلِيبًا", tr: "sharibtu ka’san ḥaliiban" }, { en: "Say “thirty books”.", ur: "«تیس کتابیں» کہیں۔", a: "ثَلَاثُونَ كِتَابًا", tr: "thalaathuuna kitaaban" }],
  },
  {
    slug: "lesson-67-absolute-object", key: "شُكْرًا",
    en: {
      title: "Thank you, very much: the verb’s own noun", short: "I slept deeply, we were overjoyed, two prostrations.",
      intro: "Arabic can follow a verb with its own verbal noun (lesson 47) ending in {ـًا}. On its own it adds emphasis: {فَرِحْتُ فَرَحًا} (I was really glad). With an adjective it tells you how: {فَرِحْتُ فَرَحًا كَبِيرًا} (I was overjoyed). This is called {الْمَفْعُولُ الْمُطْلَقُ}.",
      points: ["Three uses: emphasis, kind and number. {نَامَ نَوْمًا عَمِيقًا} (he slept a deep sleep) · {سَجَدَ سَجْدَتَيْنِ} (he made two prostrations) · {جَلَسَ جُلُوسَ الْمُعَلِّمِ} (he sat the way a teacher sits).", "A word like {كَثِيرًا} or {قَلِيلًا} can stand in for it: {شَكَرْتُهُ كَثِيرًا} (I thanked him a lot).", "Many everyday words are really this pattern with the verb left out: {شُكْرًا} thanks · {عَفْوًا} sorry, you’re welcome · {جِدًّا} very · {حَقًّا} truly · {سَمْعًا وَطَاعَةً} I hear and obey."],
    },
    ur: {
      title: "شکریہ، بہت: مفعولِ مطلق", short: "گہری نیند سویا، بہت خوش ہوئے، دو سجدے۔",
      intro: "عربی میں فعل کے بعد اسی کا مصدر (سبق ۴۷) {ـًا} کے ساتھ لایا جا سکتا ہے۔ اکیلا ہو تو تاکید کرتا ہے: {فَرِحْتُ فَرَحًا} (میں واقعی خوش ہوا)۔ صفت کے ساتھ ہو تو کیفیت بتاتا ہے: {فَرِحْتُ فَرَحًا كَبِيرًا} (میں بہت زیادہ خوش ہوا)۔ اسے {الْمَفْعُولُ الْمُطْلَقُ} کہتے ہیں۔",
      points: ["تین استعمال: تاکید، نوع اور تعداد۔ {نَامَ نَوْمًا عَمِيقًا} (وہ گہری نیند سویا) · {سَجَدَ سَجْدَتَيْنِ} (اس نے دو سجدے کیے) · {جَلَسَ جُلُوسَ الْمُعَلِّمِ} (وہ استاد کی طرح بیٹھا)۔", "{كَثِيرًا} یا {قَلِيلًا} جیسا لفظ اس کی جگہ آ سکتا ہے: {شَكَرْتُهُ كَثِيرًا} (میں نے اس کا بہت شکریہ ادا کیا)۔", "روزمرہ کے کئی الفاظ دراصل یہی ہیں، فعل محذوف ہے: {شُكْرًا} شکریہ · {عَفْوًا} معاف کیجیے، کوئی بات نہیں · {جِدًّا} بہت · {حَقًّا} واقعی · {سَمْعًا وَطَاعَةً} سنا اور مانا۔"],
    },
    ex: [["نِمْتُ نَوْمًا عَمِيقًا", "nimtu nawman ʿamiiqan", "I slept deeply.", "میں گہری نیند سویا۔"], ["فَرِحْنَا فَرَحًا كَبِيرًا", "fariḥnaa faraḥan kabiiran", "We were overjoyed.", "ہم بہت زیادہ خوش ہوئے۔"], ["مَشَى مَشْيًا سَرِيعًا", "mashaa mashyan sariiʿan", "He walked quickly.", "وہ تیز تیز چلا۔"], ["سَجَدَ الْمُصَلِّي سَجْدَتَيْنِ", "sajada l-muṣallii sajdatayni", "The worshipper made two prostrations.", "نمازی نے دو سجدے کیے۔"], ["شُكْرًا جَزِيلًا", "shukran jaziilan", "Thank you very much.", "بہت بہت شکریہ۔"], ["هٰذَا جَمِيلٌ جِدًّا", "haadhaa jamiilun jiddan", "This is very beautiful.", "یہ بہت خوبصورت ہے۔"]],
    practice: [{ en: "Say “I studied seriously.” ({دِرَاسَةً جَادَّةً})", ur: "«میں نے سنجیدگی سے پڑھا» کہیں ({دِرَاسَةً جَادَّةً})۔", a: "دَرَسْتُ دِرَاسَةً جَادَّةً", tr: "darastu diraasatan jaaddatan" }, { en: "Say “He ran fast.” ({جَرَى})", ur: "«وہ تیز دوڑا» کہیں ({جَرَى})۔", a: "جَرَى جَرْيًا سَرِيعًا", tr: "jaraa jaryan sariiʿan" }, { en: "How do you say “very” in Arabic?", ur: "عربی میں «بہت» کیسے کہتے ہیں؟", a: "جِدًّا", tr: "jiddan" }],
  },
  {
    slug: "lesson-68-reason-word", key: "اِحْتِرَامًا",
    en: {
      title: "Why? “Out of respect”: one word for the reason", short: "I stood out of respect; he travelled seeking knowledge.",
      intro: "A verbal noun ending in {ـًا} after a verb can give the reason for the action: {قُمْتُ احْتِرَامًا لِلْمُعَلِّمِ} (I stood up out of respect for the teacher). It answers {لِمَاذَا؟} (why?). It is called {الْمَفْعُولُ لِأَجْلِهِ}.",
      points: ["It is usually a feeling or an aim: {حُبًّا} out of love · {خَوْفًا} out of fear · {طَلَبًا} seeking · {رَغْبَةً} hoping for · {أَدَبًا} out of politeness.", "The same idea with {لِـ} (lesson 53): {سَافَرَ طَلَبًا لِلْعِلْمِ} = {سَافَرَ لِطَلَبِ الْعِلْمِ} (he travelled to seek knowledge).", "Don’t mix it up with lesson 67: {فَرِحْتُ فَرَحًا} repeats the verb’s own noun; {بَكَى خَوْفًا} (he cried out of fear) uses a different noun to give the reason."],
    },
    ur: {
      title: "کیوں؟ «احترام میں»: مفعولٌ لہ", short: "میں احترام میں کھڑا ہوا؛ اس نے علم کی تلاش میں سفر کیا۔",
      intro: "فعل کے بعد {ـًا} والا مصدر کام کی وجہ بتا سکتا ہے: {قُمْتُ احْتِرَامًا لِلْمُعَلِّمِ} (میں استاد کے احترام میں کھڑا ہوا)۔ یہ {لِمَاذَا؟} (کیوں؟) کا جواب ہے۔ اسے {الْمَفْعُولُ لِأَجْلِهِ} (مفعولٌ لہ) کہتے ہیں۔",
      points: ["یہ عموماً کوئی جذبہ یا مقصد ہوتا ہے: {حُبًّا} محبت میں · {خَوْفًا} ڈر سے · {طَلَبًا} تلاش میں · {رَغْبَةً} امید میں · {أَدَبًا} ادب کی وجہ سے۔", "یہی بات {لِـ} (سبق ۵۳) سے: {سَافَرَ طَلَبًا لِلْعِلْمِ} = {سَافَرَ لِطَلَبِ الْعِلْمِ} (اس نے علم کی تلاش میں سفر کیا)۔", "سبق ۶۷ سے فرق: {فَرِحْتُ فَرَحًا} میں فعل کا اپنا مصدر دہرایا گیا؛ {بَكَى خَوْفًا} (وہ ڈر سے رویا) میں دوسرا مصدر وجہ بتاتا ہے۔"],
    },
    ex: [["قُمْتُ احْتِرَامًا لِلْمُعَلِّمِ", "qumtu-ḥtiraaman lil-muʿallimi", "I stood up out of respect for the teacher.", "میں استاد کے احترام میں کھڑا ہوا۔"], ["سَافَرَ طَلَبًا لِلْعِلْمِ", "saafara ṭalaban lil-ʿilmi", "He travelled to seek knowledge.", "اس نے علم کی تلاش میں سفر کیا۔"], ["بَكَى الطِّفْلُ خَوْفًا", "bakaa ṭ-ṭiflu khawfan", "The child cried out of fear.", "بچہ ڈر کے مارے رویا۔"], ["أَتَعَلَّمُ الْعَرَبِيَّةَ حُبًّا لِلْقُرْآنِ", "ataʿallamu l-ʿarabiyyata ḥubban lil-qur’aani", "I learn Arabic out of love for the Quran.", "میں قرآن کی محبت میں عربی سیکھتا ہوں۔"], ["صُمْتُ رَغْبَةً فِي الْأَجْرِ", "ṣumtu raghbatan fil-ajri", "I fasted hoping for the reward.", "میں نے اجر کی امید میں روزہ رکھا۔"], ["سَكَتُّ أَدَبًا", "sakattu adaban", "I kept quiet out of politeness.", "میں ادب کی وجہ سے خاموش رہا۔"]],
    practice: [{ en: "Say “I came out of love for you.”", ur: "«میں تمہاری محبت میں آیا» کہیں۔", a: "جِئْتُ حُبًّا لَكَ", tr: "ji’tu ḥubban laka" }, { en: "Say “He ran out of fear.”", ur: "«وہ ڈر سے بھاگا» کہیں۔", a: "جَرَى خَوْفًا", tr: "jaraa khawfan" }, { en: "Say {سَافَرَ طَلَبًا لِلْعِلْمِ} with {لِـ} instead.", ur: "{سَافَرَ طَلَبًا لِلْعِلْمِ} کو {لِـ} کے ساتھ کہیں۔", a: "سَافَرَ لِطَلَبِ الْعِلْمِ", tr: "saafara li-ṭalabi l-ʿilmi" }],
  },
  {
    slug: "lesson-69-nima-bisa", key: "نِعْمَ",
    en: {
      title: "What an excellent…! {نِعْمَ} and {بِئْسَ}", short: "Praising and blaming in one word.",
      intro: "{نِعْمَ} means “what an excellent…” and {بِئْسَ} means “what a terrible…”. They do not change for tense or person. After them comes a noun with {الـ}, then the person or thing praised or blamed: {نِعْمَ الطَّالِبُ أَحْمَدُ} (what an excellent student Ahmad is!).",
      points: ["With a feminine noun you may add {ـتِ}: {نِعْمَتِ الْأُمُّ فَاطِمَةُ} or simply {نِعْمَ الْأُمُّ فَاطِمَةُ} (what an excellent mother Fatima is).", "The Quran uses it often: {حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ} (Allah is enough for us, and what an excellent Guardian) · {نِعْمَ الْمَوْلَىٰ وَنِعْمَ النَّصِيرُ}.", "{حَبَّذَا} (how lovely) works the same way: {حَبَّذَا الصِّدْقُ} (how lovely honesty is). {لَا حَبَّذَا} is its opposite."],
    },
    ur: {
      title: "کیا ہی اچھا…! {نِعْمَ} اور {بِئْسَ}", short: "ایک لفظ میں تعریف اور مذمت۔",
      intro: "{نِعْمَ} کا مطلب ہے «کیا ہی اچھا…» اور {بِئْسَ} کا «کیا ہی برا…»۔ یہ زمانے یا ضمیر کے ساتھ نہیں بدلتے۔ ان کے بعد {الـ} والا اسم آتا ہے، پھر وہ شخص یا چیز جس کی تعریف یا مذمت ہو: {نِعْمَ الطَّالِبُ أَحْمَدُ} (احمد کیا ہی اچھا طالب علم ہے!)۔ انہیں افعالِ مدح و ذم کہتے ہیں۔",
      points: ["مؤنث اسم کے ساتھ {ـتِ} لگا سکتے ہیں: {نِعْمَتِ الْأُمُّ فَاطِمَةُ} یا صرف {نِعْمَ الْأُمُّ فَاطِمَةُ} (فاطمہ کیا ہی اچھی ماں ہیں)۔", "قرآن میں بار بار آیا ہے: {حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ} (ہمیں اللہ کافی ہے اور وہ بہترین کارساز ہے) · {نِعْمَ الْمَوْلَىٰ وَنِعْمَ النَّصِيرُ}۔", "{حَبَّذَا} (کیا خوب) بھی اسی طرح آتا ہے: {حَبَّذَا الصِّدْقُ} (سچائی کیا خوب ہے)۔ اس کا الٹ {لَا حَبَّذَا} ہے۔"],
    },
    ex: [["نِعْمَ الصَّدِيقُ الْكِتَابُ", "niʿma ṣ-ṣadiiqu l-kitaabu", "What an excellent friend a book is!", "کتاب کیا ہی اچھا دوست ہے!"], ["نِعْمَ الطَّالِبُ أَحْمَدُ", "niʿma ṭ-ṭaalibu aḥmadu", "What an excellent student Ahmad is!", "احمد کیا ہی اچھا طالب علم ہے!"], ["نِعْمَ الْمَشْرُوبُ الْمَاءُ", "niʿma l-mashruubu l-maa’u", "What an excellent drink water is!", "پانی کیا ہی عمدہ مشروب ہے!"], ["بِئْسَ الْخُلُقُ الْكَذِبُ", "bi’sa l-khuluqu l-kadhibu", "What an evil trait lying is!", "جھوٹ کیا ہی بری عادت ہے!"], ["حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ", "ḥasbuna llaahu wa niʿma l-wakiilu", "Allah is enough for us, and He is the best Guardian.", "ہمیں اللہ کافی ہے اور وہ بہترین کارساز ہے۔"], ["حَبَّذَا الصِّدْقُ", "ḥabbadhaa ṣ-ṣidqu", "How lovely honesty is!", "سچائی کیا خوب ہے!"]],
    practice: [{ en: "Say “What an excellent friend Khalid is!”", ur: "«خالد کیا ہی اچھا دوست ہے!» کہیں۔", a: "نِعْمَ الصَّدِيقُ خَالِدٌ", tr: "niʿma ṣ-ṣadiiqu khaalidun" }, { en: "Say “What a bad habit laziness is!” ({الْعَادَةُ}, {الْكَسَلُ})", ur: "«سستی کیا ہی بری عادت ہے!» کہیں ({الْعَادَةُ}، {الْكَسَلُ})۔", a: "بِئْسَتِ الْعَادَةُ الْكَسَلُ", tr: "bi’sati l-ʿaadatu l-kasalu", noteEn: "{بِئْسَ الْعَادَةُ الْكَسَلُ} is also correct.", noteUr: "{بِئْسَ الْعَادَةُ الْكَسَلُ} بھی درست ہے۔" }, { en: "Say “How lovely knowledge is!” ({الْعِلْمُ})", ur: "«علم کیا خوب ہے!» کہیں ({الْعِلْمُ})۔", a: "حَبَّذَا الْعِلْمُ", tr: "ḥabbadha l-ʿilmu" }],
  },
  {
    slug: "lesson-70-almost-began", key: "كَادَ",
    en: {
      title: "Almost, began, perhaps: {كَادَ}, {بَدَأَ}, {عَسَى}", short: "I almost forgot; the rain began to fall; perhaps you’ll succeed.",
      intro: "Some verbs work like {كَانَ} (lesson 25), but what follows them is a present verb: {كَادَ الْقِطَارُ يَتَحَرَّكُ} (the train was about to move). {بَدَأَ} and {أَخَذَ} mean “began”: {أَخَذَ الطِّفْلُ يَبْكِي} (the child began to cry). {عَسَى} means “perhaps, it may be”: {عَسَى أَنْ تَنْجَحَ} (perhaps you will succeed).",
      points: ["Almost: {كَادَ يَكَادُ} + present verb, with no {أَنْ}: {كِدْتُ أَنْسَى} (I almost forgot). In the Quran: {يَكَادُ زَيْتُهَا يُضِيءُ} (its oil would almost glow).", "Began: {بَدَأَ}, {أَخَذَ}, {شَرَعَ}, {جَعَلَ} + present verb: {بَدَأَ يَكْتُبُ} (he started writing). {بَدَأَ} can also take a verbal noun: {بَدَأَ الْكِتَابَةَ}.", "Perhaps, may: {عَسَى} + {أَنْ} + verb: {عَسَى اللّٰهُ أَنْ يَشْفِيَهُ} (may Allah heal him). {لَعَلَّ} (lesson 43) has a similar meaning."],
    },
    ur: {
      title: "قریب تھا، شروع کیا، شاید: {كَادَ}، {بَدَأَ}، {عَسَى}", short: "میں بھولنے ہی والا تھا؛ بارش ہونے لگی؛ امید ہے تم کامیاب ہو گے۔",
      intro: "کچھ افعال {كَانَ} (سبق ۲۵) کی طرح عمل کرتے ہیں، لیکن ان کی خبر فعل مضارع ہوتی ہے: {كَادَ الْقِطَارُ يَتَحَرَّكُ} (ٹرین چلنے ہی والی تھی)۔ {بَدَأَ} اور {أَخَذَ} کا مطلب «شروع کیا، لگا»: {أَخَذَ الطِّفْلُ يَبْكِي} (بچہ رونے لگا)۔ {عَسَى} کا مطلب «شاید، امید ہے»: {عَسَى أَنْ تَنْجَحَ} (امید ہے تم کامیاب ہو گے)۔ انہیں افعالِ مقاربہ کہتے ہیں۔",
      points: ["قریب ہونا: {كَادَ يَكَادُ} + مضارع، بغیر {أَنْ}: {كِدْتُ أَنْسَى} (میں بھولنے ہی والا تھا)۔ قرآن میں: {يَكَادُ زَيْتُهَا يُضِيءُ} (قریب ہے کہ اس کا تیل خود روشن ہو جائے)۔", "شروع کرنا: {بَدَأَ}، {أَخَذَ}، {شَرَعَ}، {جَعَلَ} + مضارع: {بَدَأَ يَكْتُبُ} (وہ لکھنے لگا)۔ {بَدَأَ} کے بعد مصدر بھی آ سکتا ہے: {بَدَأَ الْكِتَابَةَ}۔", "امید: {عَسَى} + {أَنْ} + فعل: {عَسَى اللّٰهُ أَنْ يَشْفِيَهُ} (امید ہے اللہ اسے شفا دے)۔ {لَعَلَّ} (سبق ۴۳) کا مطلب بھی ملتا جلتا ہے۔"],
    },
    ex: [["كِدْتُ أَنْسَى الْمَوْعِدَ", "kidtu ansaa l-mawʿida", "I almost forgot the appointment.", "میں ملاقات کا وقت بھولنے ہی والا تھا۔"], ["كَادَ الْقِطَارُ يَتَحَرَّكُ", "kaada l-qiṭaaru yataḥarraku", "The train was about to move.", "ٹرین چلنے ہی والی تھی۔"], ["بَدَأَ الْمَطَرُ يَنْزِلُ", "bada’a l-maṭaru yanzilu", "The rain began to fall.", "بارش ہونے لگی۔"], ["أَخَذَ الطِّفْلُ يَبْكِي", "akhadha ṭ-ṭiflu yabkii", "The child began to cry.", "بچہ رونے لگا۔"], ["عَسَى أَنْ تَنْجَحَ", "ʿasaa an tanjaḥa", "Perhaps you will succeed.", "امید ہے تم کامیاب ہو گے۔"], ["يَكَادُ الْبَرْقُ يَخْطَفُ أَبْصَارَهُمْ", "yakaadu l-barqu yakhṭafu abṣaarahum", "The lightning almost snatches away their sight.", "قریب ہے کہ بجلی ان کی نگاہیں اچک لے۔"]],
    practice: [{ en: "Say “I almost fell.” ({سَقَطَ يَسْقُطُ})", ur: "«میں گرنے ہی والا تھا» کہیں ({سَقَطَ يَسْقُطُ})۔", a: "كِدْتُ أَسْقُطُ", tr: "kidtu asquṭu" }, { en: "Say “The students began to write.”", ur: "«طلبہ لکھنے لگے» کہیں۔", a: "بَدَأَ الطُّلَّابُ يَكْتُبُونَ", tr: "bada’a ṭ-ṭullaabu yaktubuuna" }, { en: "Say “Perhaps he will come.”", ur: "«شاید وہ آ جائے» کہیں۔", a: "عَسَى أَنْ يَأْتِيَ", tr: "ʿasaa an ya’tiya" }],
  },
  {
    slug: "lesson-71-two-objects", key: "أَعْطَى",
    en: {
      title: "Two objects: {أَعْطَى}, {ظَنَّ} and {وَجَدَ}", short: "I gave the boy a book; I found the door closed.",
      intro: "Some verbs take two objects, both with the object ending {ـَ} or {ـًا}. Giving verbs: {أَعْطَيْتُ الْوَلَدَ كِتَابًا} (I gave the boy a book). Thinking and finding verbs, where the two objects were once a sentence: {الدَّرْسُ سَهْلٌ} → {ظَنَنْتُ الدَّرْسَ سَهْلًا} (I thought the lesson easy).",
      points: ["Giving and naming: {أَعْطَى} give · {مَنَحَ} grant · {سَأَلَ} ask for · {أَلْبَسَ} dress · {سَمَّى} name: {سَمَّيْتُ ابْنِي مُحَمَّدًا} (I named my son Muhammad).", "Thinking and finding ({ظَنَّ وَأَخَوَاتُهَا}): {ظَنَّ} think · {حَسِبَ} reckon · {وَجَدَ} find · {عَلِمَ} know · {جَعَلَ} make: {أَلَمْ نَجْعَلِ الْأَرْضَ مِهَادًا} (have We not made the earth a resting place?).", "With a pronoun, the first object joins the verb: {أَعْطَيْتُهُ كِتَابًا} (I gave him a book) · {وَجَدْتُهُ مَشْغُولًا} (I found him busy)."],
    },
    ur: {
      title: "دو مفعول: {أَعْطَى}، {ظَنَّ} اور {وَجَدَ}", short: "میں نے لڑکے کو کتاب دی؛ میں نے دروازہ بند پایا۔",
      intro: "کچھ افعال دو مفعول لیتے ہیں اور دونوں منصوب ہوتے ہیں۔ دینے والے افعال: {أَعْطَيْتُ الْوَلَدَ كِتَابًا} (میں نے لڑکے کو کتاب دی)۔ سمجھنے اور پانے والے افعال، جن کے دونوں مفعول اصل میں مبتدا و خبر تھے: {الدَّرْسُ سَهْلٌ} ← {ظَنَنْتُ الدَّرْسَ سَهْلًا} (میں نے سبق کو آسان سمجھا)۔",
      points: ["دینا اور نام رکھنا: {أَعْطَى} دینا · {مَنَحَ} عطا کرنا · {سَأَلَ} مانگنا · {أَلْبَسَ} پہنانا · {سَمَّى} نام رکھنا: {سَمَّيْتُ ابْنِي مُحَمَّدًا} (میں نے اپنے بیٹے کا نام محمد رکھا)۔", "سمجھنا اور پانا ({ظَنَّ وَأَخَوَاتُهَا}): {ظَنَّ} گمان کرنا · {حَسِبَ} سمجھنا · {وَجَدَ} پانا · {عَلِمَ} جاننا · {جَعَلَ} بنانا: {أَلَمْ نَجْعَلِ الْأَرْضَ مِهَادًا} (کیا ہم نے زمین کو بچھونا نہیں بنایا؟)۔", "ضمیر ہو تو پہلا مفعول فعل سے جڑ جاتا ہے: {أَعْطَيْتُهُ كِتَابًا} (میں نے اسے کتاب دی) · {وَجَدْتُهُ مَشْغُولًا} (میں نے اسے مصروف پایا)۔"],
    },
    ex: [["أَعْطَيْتُ الْفَقِيرَ مَالًا", "aʿṭaytu l-faqiira maalan", "I gave the poor man some money.", "میں نے فقیر کو پیسے دیے۔"], ["أَعْطِنِي الْقَلَمَ", "aʿṭinii l-qalama", "Give me the pen.", "مجھے قلم دو۔"], ["ظَنَنْتُ الِامْتِحَانَ صَعْبًا", "ẓanantu l-imtiḥaana ṣaʿban", "I thought the exam was hard.", "میں نے امتحان کو مشکل سمجھا۔"], ["وَجَدْتُ الْبَابَ مُغْلَقًا", "wajadtu l-baaba mughlaqan", "I found the door closed.", "میں نے دروازہ بند پایا۔"], ["سَمَّيْتُ ابْنِي عَبْدَ اللّٰهِ", "sammaytu bnii ʿabda llaahi", "I named my son Abdullah.", "میں نے اپنے بیٹے کا نام عبداللہ رکھا۔"], ["أَلَمْ نَجْعَلِ الْأَرْضَ مِهَادًا", "alam najʿali l-arḍa mihaadan", "Have We not made the earth a resting place?", "کیا ہم نے زمین کو بچھونا نہیں بنایا؟"]],
    practice: [{ en: "Say “I gave my mother a gift.” ({هَدِيَّةً})", ur: "«میں نے اپنی امی کو تحفہ دیا» کہیں ({هَدِيَّةً})۔", a: "أَعْطَيْتُ أُمِّي هَدِيَّةً", tr: "aʿṭaytu ummii hadiyyatan" }, { en: "Say “I found the lesson easy.”", ur: "«میں نے سبق آسان پایا» کہیں۔", a: "وَجَدْتُ الدَّرْسَ سَهْلًا", tr: "wajadtu d-darsa sahlan" }, { en: "Say “I thought he was a teacher.”", ur: "«میں نے اسے استاد سمجھا» کہیں۔", a: "ظَنَنْتُهُ مُعَلِّمًا", tr: "ẓanantuhu muʿalliman" }],
  },
  {
    slug: "lesson-72-diminutive", key: "بُنَيَّ",
    en: {
      title: "Little words: the diminutive {فُعَيْلٌ}", short: "A hill, a booklet, my dear son, just before Maghrib.",
      intro: "Arabic makes something small, or dear, by changing its vowels to {فُعَيْلٌ}: {جَبَلٌ} (mountain) → {جُبَيْلٌ} (hill), {نَهْرٌ} (river) → {نُهَيْرٌ} (stream), {وَلَدٌ} (boy) → {وُلَيْدٌ} (little boy). This is called {التَّصْغِيرُ}.",
      points: ["Longer words follow {فُعَيْعِلٌ}: {دِرْهَمٌ} → {دُرَيْهِمٌ} (a small coin). A long vowel before the last letter turns into {يّ}: {كِتَابٌ} → {كُتَيِّبٌ} (booklet, a word you will see in every bookshop).", "{قَبْلَ} and {بَعْدَ} have diminutives too: {قُبَيْلَ الْمَغْرِبِ} (just before Maghrib) · {بُعَيْدَ الْعَصْرِ} (just after Asr).", "It also shows affection: {يَا بُنَيَّ} (my dear son), from {ابْنٌ}, as Luqman says to his son in the Quran: {يَا بُنَيَّ لَا تُشْرِكْ بِاللّٰهِ}. Many names are diminutives: {حُسَيْنٌ} from {حَسَنٌ}, {عُبَيْدٌ} from {عَبْدٌ}."],
    },
    ur: {
      title: "چھوٹے الفاظ: اسمِ تصغیر {فُعَيْلٌ}", short: "پہاڑی، کتابچہ، میرے پیارے بیٹے، مغرب سے ذرا پہلے۔",
      intro: "عربی میں کسی چیز کو چھوٹا یا پیارا بنانے کے لیے حرکات بدل کر {فُعَيْلٌ} کے وزن پر لاتے ہیں: {جَبَلٌ} (پہاڑ) ← {جُبَيْلٌ} (پہاڑی)، {نَهْرٌ} (نہر، دریا) ← {نُهَيْرٌ} (چھوٹی نہر)، {وَلَدٌ} (لڑکا) ← {وُلَيْدٌ} (ننھا لڑکا)۔ اسے {التَّصْغِيرُ} کہتے ہیں۔",
      points: ["لمبے الفاظ {فُعَيْعِلٌ} کے وزن پر: {دِرْهَمٌ} ← {دُرَيْهِمٌ} (چھوٹا سکہ)۔ آخری حرف سے پہلے لمبی آواز {يّ} بن جاتی ہے: {كِتَابٌ} ← {كُتَيِّبٌ} (کتابچہ، جو ہر کتب خانے میں نظر آتا ہے)۔", "{قَبْلَ} اور {بَعْدَ} کی بھی تصغیر ہے: {قُبَيْلَ الْمَغْرِبِ} (مغرب سے ذرا پہلے) · {بُعَيْدَ الْعَصْرِ} (عصر کے ذرا بعد)۔", "تصغیر پیار بھی ظاہر کرتی ہے: {يَا بُنَيَّ} (میرے پیارے بیٹے)، {ابْنٌ} سے، جیسے قرآن میں حضرت لقمان اپنے بیٹے سے کہتے ہیں: {يَا بُنَيَّ لَا تُشْرِكْ بِاللّٰهِ}۔ کئی نام تصغیر ہیں: {حُسَيْنٌ} ({حَسَنٌ} سے)، {عُبَيْدٌ} ({عَبْدٌ} سے)۔"],
    },
    ex: [["اِشْتَرَيْتُ كُتَيِّبًا صَغِيرًا", "ishtaraytu kutayyiban ṣaghiiran", "I bought a small booklet.", "میں نے ایک چھوٹا کتابچہ خریدا۔"], ["صَعِدْنَا الْجُبَيْلَ", "ṣaʿidna l-jubayla", "We climbed the hill.", "ہم پہاڑی پر چڑھے۔"], ["يَا بُنَيَّ، اِسْمَعْ كَلَامِي", "yaa bunayya, ismaʿ kalaamii", "My dear son, listen to what I say.", "میرے پیارے بیٹے، میری بات سنو۔"], ["وَصَلْنَا قُبَيْلَ الْمَغْرِبِ", "waṣalnaa qubayla l-maghribi", "We arrived just before Maghrib.", "ہم مغرب سے ذرا پہلے پہنچے۔"], ["يَجْرِي نُهَيْرٌ فِي الْوَادِي", "yajrii nuhayrun fil-waadii", "A stream runs through the valley.", "وادی میں ایک چھوٹی نہر بہتی ہے۔"], ["عِنْدِي دُرَيْهِمَاتٌ", "ʿindii durayhimaatun", "I have a few small coins.", "میرے پاس چند درہم ہیں۔"]],
    practice: [{ en: "Make the diminutive of {نَهْرٌ} (river).", ur: "{نَهْرٌ} (دریا) کی تصغیر بنائیں۔", a: "نُهَيْرٌ", tr: "nuhayrun", noteEn: "a stream", noteUr: "چھوٹی نہر" }, { en: "Make the diminutive of {وَلَدٌ} (boy).", ur: "{وَلَدٌ} (لڑکا) کی تصغیر بنائیں۔", a: "وُلَيْدٌ", tr: "wulaydun", noteEn: "a little boy", noteUr: "ننھا لڑکا" }, { en: "Say “just after Asr”.", ur: "«عصر کے ذرا بعد» کہیں۔", a: "بُعَيْدَ الْعَصْرِ", tr: "buʿayda l-ʿaṣri" }],
  },
  {
    slug: "lesson-73-broken-plurals", key: "أَقْلَامٌ",
    en: {
      title: "Broken plurals: the common patterns", short: "Pens, houses, men, ministers, keys: learn the shape, not each word.",
      intro: "Most Arabic nouns make their plural by changing their inside vowels (lesson 10). There are many patterns, but a handful cover most everyday words. Learn them as shapes: {قَلَمٌ} → {أَقْلَامٌ} follows {أَفْعَالٌ}; {بَيْتٌ} → {بُيُوتٌ} follows {فُعُولٌ}.",
      points: ["{أَفْعَالٌ}: {قَلَمٌ} → {أَقْلَامٌ} · {وَلَدٌ} → {أَوْلَادٌ} · {سُوقٌ} → {أَسْوَاقٌ} · {يَوْمٌ} → {أَيَّامٌ}. {فُعُولٌ}: {بَيْتٌ} → {بُيُوتٌ} · {دَرْسٌ} → {دُرُوسٌ} · {قَلْبٌ} → {قُلُوبٌ}.", "{فِعَالٌ}: {رَجُلٌ} → {رِجَالٌ} · {جَبَلٌ} → {جِبَالٌ} · {كَبِيرٌ} → {كِبَارٌ}. {فُعَلَاءُ} for people: {وَزِيرٌ} → {وُزَرَاءُ} (ministers) · {زَمِيلٌ} → {زُمَلَاءُ} (colleagues) · {عَالِمٌ} → {عُلَمَاءُ} (scholars).", "Longer words use {مَفَاعِلُ} or {مَفَاعِيلُ}, with no tanween (lesson 54): {مَكْتَبٌ} → {مَكَاتِبُ} · {مِفْتَاحٌ} → {مَفَاتِيحُ}. Plurals of things are treated as feminine singular: {الْبُيُوتُ كَبِيرَةٌ} (the houses are big)."],
    },
    ur: {
      title: "جمعِ مکسر: عام اوزان", short: "قلم، گھر، آدمی، وزراء، چابیاں: ہر لفظ نہیں، وزن یاد کریں۔",
      intro: "اکثر عربی اسماء کی جمع اندر کی حرکات بدل کر بنتی ہے (سبق ۱۰)۔ اوزان بہت ہیں، لیکن چند اوزان روزمرہ کے زیادہ تر الفاظ کا احاطہ کرتے ہیں۔ انہیں سانچوں کی طرح یاد کریں: {قَلَمٌ} ← {أَقْلَامٌ} وزن {أَفْعَالٌ} پر؛ {بَيْتٌ} ← {بُيُوتٌ} وزن {فُعُولٌ} پر۔",
      points: ["{أَفْعَالٌ}: {قَلَمٌ} ← {أَقْلَامٌ} · {وَلَدٌ} ← {أَوْلَادٌ} · {سُوقٌ} ← {أَسْوَاقٌ} · {يَوْمٌ} ← {أَيَّامٌ}۔ {فُعُولٌ}: {بَيْتٌ} ← {بُيُوتٌ} · {دَرْسٌ} ← {دُرُوسٌ} · {قَلْبٌ} ← {قُلُوبٌ}۔", "{فِعَالٌ}: {رَجُلٌ} ← {رِجَالٌ} · {جَبَلٌ} ← {جِبَالٌ} · {كَبِيرٌ} ← {كِبَارٌ}۔ افراد کے لیے {فُعَلَاءُ}: {وَزِيرٌ} ← {وُزَرَاءُ} · {زَمِيلٌ} ← {زُمَلَاءُ} (ساتھی) · {عَالِمٌ} ← {عُلَمَاءُ}۔", "لمبے الفاظ {مَفَاعِلُ} یا {مَفَاعِيلُ} کے وزن پر، بغیر تنوین (سبق ۵۴): {مَكْتَبٌ} ← {مَكَاتِبُ} · {مِفْتَاحٌ} ← {مَفَاتِيحُ}۔ غیر عاقل چیزوں کی جمع واحد مؤنث کی طرح چلتی ہے: {الْبُيُوتُ كَبِيرَةٌ} (گھر بڑے ہیں)۔"],
    },
    ex: [["هٰذِهِ أَقْلَامٌ جَدِيدَةٌ", "haadhihi aqlaamun jadiidatun", "These are new pens.", "یہ نئے قلم ہیں۔"], ["الْبُيُوتُ قَرِيبَةٌ مِنَ الْمَسْجِدِ", "al-buyuutu qariibatun mina l-masjidi", "The houses are near the mosque.", "گھر مسجد کے قریب ہیں۔"], ["فِي الْمَسْجِدِ رِجَالٌ كَثِيرُونَ", "fil-masjidi rijaalun kathiiruuna", "There are many men in the mosque.", "مسجد میں بہت سے آدمی ہیں۔"], ["اِجْتَمَعَ الْوُزَرَاءُ", "ijtamaʿa l-wuzaraa’u", "The ministers met.", "وزراء کا اجلاس ہوا۔"], ["زُمَلَائِي فِي الْعَمَلِ لُطَفَاءُ", "zumalaa’ii fil-ʿamali luṭafaa’u", "My colleagues at work are kind.", "دفتر میں میرے ساتھی مہربان ہیں۔"], ["أَيْنَ الْمَفَاتِيحُ؟", "ayna l-mafaatiiḥu?", "Where are the keys?", "چابیاں کہاں ہیں؟"]],
    practice: [{ en: "Give the plural of {بَابٌ} (door) on the pattern {أَفْعَالٌ}.", ur: "{بَابٌ} (دروازہ) کی جمع {أَفْعَالٌ} کے وزن پر بنائیں۔", a: "أَبْوَابٌ", tr: "abwaabun" }, { en: "Give the plural of {مَلِكٌ} (king) on the pattern {فُعُولٌ}.", ur: "{مَلِكٌ} (بادشاہ) کی جمع {فُعُولٌ} کے وزن پر بنائیں۔", a: "مُلُوكٌ", tr: "muluukun" }, { en: "Give the plural of {مَسْجِدٌ}.", ur: "{مَسْجِدٌ} کی جمع بتائیں۔", a: "مَسَاجِدُ", tr: "masaajidu" }],
  },
  {
    slug: "lesson-74-when-while-since", key: "عِنْدَمَا",
    en: {
      title: "When, while, since: {عِنْدَمَا}, {لَمَّا}, {بَيْنَمَا}, {مُنْذُ}", short: "Joining two events in time.",
      intro: "{عِنْدَمَا} means “when” and joins two sentences: {عِنْدَمَا وَصَلْتُ نِمْتُ} (when I arrived, I slept). It works for the past, the present and habits: {أَشْرَبُ الْقَهْوَةَ عِنْدَمَا أَسْتَيْقِظُ} (I drink coffee when I wake up). To ask “when?”, use {مَتَى} (lesson 20) instead.",
      points: ["{لَمَّا} + past verb means “when, once”, and is common in stories: {لَمَّا رَأَى الْأَسَدَ هَرَبَ} (when he saw the lion, he ran away). With a silent present verb it means “not yet”: {لَمَّا يَصِلْ} (he hasn’t arrived yet).", "{بَيْنَمَا} means “while”, for something going on when something else happened: {بَيْنَمَا كُنْتُ أَقْرَأُ رَنَّ الْهَاتِفُ} (while I was reading, the phone rang). It can also mean “whereas”.", "{مُنْذُ} means “since” or “for” a period: {أَسْكُنُ هُنَا مُنْذُ سَنَتَيْنِ} (I have lived here for two years) · {مُنْذُ الصَّبَاحِ} (since the morning). Arabic uses the present here, where English says “have lived”."],
    },
    ur: {
      title: "جب، جبکہ، سے: {عِنْدَمَا}، {لَمَّا}، {بَيْنَمَا}، {مُنْذُ}", short: "دو واقعات کو وقت کے لحاظ سے جوڑنا۔",
      intro: "{عِنْدَمَا} کا مطلب «جب» ہے اور یہ دو جملے جوڑتا ہے: {عِنْدَمَا وَصَلْتُ نِمْتُ} (جب میں پہنچا تو سو گیا)۔ یہ ماضی، حال اور عادت سب کے لیے آتا ہے: {أَشْرَبُ الْقَهْوَةَ عِنْدَمَا أَسْتَيْقِظُ} (جب میں جاگتا ہوں تو قہوہ پیتا ہوں)۔ سوال «کب؟» کے لیے {مَتَى} (سبق ۲۰) استعمال کریں۔",
      points: ["{لَمَّا} + ماضی کا مطلب «جب» ہے، کہانیوں میں عام ہے: {لَمَّا رَأَى الْأَسَدَ هَرَبَ} (جب اس نے شیر دیکھا تو بھاگ گیا)۔ مجزوم مضارع کے ساتھ اس کا مطلب «ابھی تک نہیں»: {لَمَّا يَصِلْ} (وہ ابھی تک نہیں پہنچا)۔", "{بَيْنَمَا} کا مطلب «جبکہ، اس دوران کہ»: {بَيْنَمَا كُنْتُ أَقْرَأُ رَنَّ الْهَاتِفُ} (میں پڑھ رہا تھا کہ فون بجا)۔ اس کا مطلب «حالانکہ» بھی ہو سکتا ہے۔", "{مُنْذُ} کا مطلب «سے» (کسی وقت سے یا کتنی مدت سے): {أَسْكُنُ هُنَا مُنْذُ سَنَتَيْنِ} (میں دو سال سے یہاں رہتا ہوں) · {مُنْذُ الصَّبَاحِ} (صبح سے)۔ اردو کی طرح عربی بھی یہاں مضارع استعمال کرتی ہے۔"],
    },
    ex: [["عِنْدَمَا وَصَلْتُ إِلَى الْبَيْتِ نِمْتُ", "ʿindamaa waṣaltu ila l-bayti nimtu", "When I got home, I slept.", "جب میں گھر پہنچا تو سو گیا۔"], ["أَشْرَبُ الْقَهْوَةَ عِنْدَمَا أَسْتَيْقِظُ", "ashrabu l-qahwata ʿindamaa astayqiẓu", "I drink coffee when I wake up.", "جب میں جاگتا ہوں تو قہوہ پیتا ہوں۔"], ["لَمَّا رَأَى الْأَسَدَ هَرَبَ", "lammaa ra’a l-asada haraba", "When he saw the lion, he ran away.", "جب اس نے شیر دیکھا تو بھاگ گیا۔"], ["بَيْنَمَا كُنْتُ أَقْرَأُ رَنَّ الْهَاتِفُ", "baynamaa kuntu aqra’u ranna l-haatifu", "While I was reading, the phone rang.", "میں پڑھ رہا تھا کہ فون بجا۔"], ["أَتَعَلَّمُ الْعَرَبِيَّةَ مُنْذُ سَنَةٍ", "ataʿallamu l-ʿarabiyyata mundhu sanatin", "I have been learning Arabic for a year.", "میں ایک سال سے عربی سیکھ رہا ہوں۔"], ["لَمْ أَرَهُ مُنْذُ الصَّبَاحِ", "lam arahu mundhu ṣ-ṣabaaḥi", "I haven’t seen him since the morning.", "میں نے صبح سے اسے نہیں دیکھا۔"]],
    practice: [{ en: "Say “When the teacher came in, we stood up.”", ur: "«جب استاد اندر آئے تو ہم کھڑے ہو گئے» کہیں۔", a: "عِنْدَمَا دَخَلَ الْمُعَلِّمُ قُمْنَا", tr: "ʿindamaa dakhala l-muʿallimu qumnaa" }, { en: "Say “I have lived in Riyadh for a month.”", ur: "«میں ایک مہینے سے ریاض میں رہتا ہوں» کہیں۔", a: "أَسْكُنُ فِي الرِّيَاضِ مُنْذُ شَهْرٍ", tr: "askunu fi r-riyaaḍi mundhu shahrin" }, { en: "Say “While I was eating, my friend arrived.”", ur: "«میں کھانا کھا رہا تھا کہ میرا دوست آ گیا» کہیں۔", a: "بَيْنَمَا كُنْتُ آكُلُ وَصَلَ صَدِيقِي", tr: "baynamaa kuntu aakulu waṣala ṣadiiqii" }],
  },
  {
    slug: "lesson-75-hatta", key: "حَتَّى",
    en: {
      title: "Until, so that, even: {حَتَّى}", short: "Wait until he comes; study so that you pass; even me.",
      intro: "{حَتَّى} has three common meanings. Before a noun it means “until” or “up to”, and the noun ends in -i: {اِنْتَظَرْتُ حَتَّى الْمَسَاءِ} (I waited until the evening). Before a present verb it means “until” or “so that”, and the verb ends in -a: {اُدْرُسْ حَتَّى تَنْجَحَ} (study so that you pass).",
      points: ["Until (with a noun): {مِنَ الصَّبَاحِ حَتَّى الْمَسَاءِ} (from morning until evening). Surah al-Qadr ends with it: {سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ} (peace it is until the break of dawn).", "Until / so that (with a verb ending in -a, as after {أَنْ} in lesson 31): {اِنْتَظِرْ حَتَّى يَأْتِيَ} (wait until he comes). After a past verb it simply means “until”: {مَشَيْنَا حَتَّى وَصَلْنَا} (we walked until we arrived).", "Even: {جَاءَ النَّاسُ حَتَّى الْأَطْفَالُ} (the people came, even the children) · {حَتَّى أَنَا} (even me)."],
    },
    ur: {
      title: "تک، تاکہ، یہاں تک کہ: {حَتَّى}", short: "اس کے آنے تک انتظار کرو؛ پڑھو تاکہ کامیاب ہو؛ میں بھی۔",
      intro: "{حَتَّى} کے تین عام معنی ہیں۔ اسم سے پہلے «تک» اور اسم مجرور: {اِنْتَظَرْتُ حَتَّى الْمَسَاءِ} (میں نے شام تک انتظار کیا)۔ مضارع سے پہلے «یہاں تک کہ» یا «تاکہ» اور فعل منصوب: {اُدْرُسْ حَتَّى تَنْجَحَ} (پڑھو تاکہ کامیاب ہو جاؤ)۔",
      points: ["تک (اسم کے ساتھ): {مِنَ الصَّبَاحِ حَتَّى الْمَسَاءِ} (صبح سے شام تک)۔ سورۃ القدر اسی پر ختم ہوتی ہے: {سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ} (وہ رات سلامتی ہے طلوعِ فجر تک)۔", "یہاں تک کہ / تاکہ (منصوب فعل کے ساتھ، جیسے سبق ۳۱ میں {أَنْ} کے بعد): {اِنْتَظِرْ حَتَّى يَأْتِيَ} (اس کے آنے تک انتظار کرو)۔ ماضی کے ساتھ صرف «یہاں تک کہ»: {مَشَيْنَا حَتَّى وَصَلْنَا} (ہم چلتے رہے یہاں تک کہ پہنچ گئے)۔", "بھی، حتیٰ کہ: {جَاءَ النَّاسُ حَتَّى الْأَطْفَالُ} (لوگ آئے، حتیٰ کہ بچے بھی) · {حَتَّى أَنَا} (میں بھی)۔"],
    },
    ex: [["اِنْتَظَرْتُكَ حَتَّى الْمَسَاءِ", "intaẓartuka ḥatta l-masaa’i", "I waited for you until the evening.", "میں نے شام تک تمہارا انتظار کیا۔"], ["نَعْمَلُ مِنَ الصَّبَاحِ حَتَّى الْعَصْرِ", "naʿmalu mina ṣ-ṣabaaḥi ḥatta l-ʿaṣri", "We work from morning until Asr.", "ہم صبح سے عصر تک کام کرتے ہیں۔"], ["اِنْتَظِرْ حَتَّى يَأْتِيَ أَبُوكَ", "intaẓir ḥattaa ya’tiya abuuka", "Wait until your father comes.", "اپنے والد کے آنے تک انتظار کرو۔"], ["اُدْرُسْ جَيِّدًا حَتَّى تَنْجَحَ", "udrus jayyidan ḥattaa tanjaḥa", "Study well so that you pass.", "اچھی طرح پڑھو تاکہ کامیاب ہو جاؤ۔"], ["مَشَيْنَا حَتَّى وَصَلْنَا", "mashaynaa ḥattaa waṣalnaa", "We walked until we arrived.", "ہم چلتے رہے یہاں تک کہ پہنچ گئے۔"], ["سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ", "salaamun hiya ḥattaa maṭlaʿi l-fajri", "Peace it is until the break of dawn.", "وہ رات سلامتی ہے طلوعِ فجر تک۔"]],
    practice: [{ en: "Say “I will stay until Friday.”", ur: "«میں جمعہ تک رہوں گا» کہیں۔", a: "سَأَبْقَى حَتَّى يَوْمِ الْجُمُعَةِ", tr: "sa-abqaa ḥattaa yawmi l-jumuʿati" }, { en: "Say “Eat so that you grow strong.” ({تَقْوَى})", ur: "«کھاؤ تاکہ طاقتور بنو» کہیں ({تَقْوَى})۔", a: "كُلْ حَتَّى تَقْوَى", tr: "kul ḥattaa taqwaa" }, { en: "Say “even me”.", ur: "«میں بھی» ({حَتَّى} کے ساتھ) کہیں۔", a: "حَتَّى أَنَا", tr: "ḥattaa anaa" }],
  },
  {
    slug: "lesson-76-whoever-whatever", key: "مَنْ جَدَّ",
    en: {
      title: "Whoever, whatever, wherever: {مَنْ}, {مَا}, {أَيْنَمَا}, {كُلَّمَا}", short: "Whoever strives finds; whatever you sow you reap.",
      intro: "Words like {مَنْ} (whoever) and {مَا} (whatever) can start an “if” sentence, like {إِنْ} in lesson 56. Both present verbs then take the silent ending: {مَنْ يَدْرُسْ يَنْجَحْ} (whoever studies will succeed). With past verbs the endings don’t show: {مَنْ جَدَّ وَجَدَ} (whoever strives, finds), a famous proverb.",
      points: ["{مَنْ} whoever · {مَا} whatever · {مَتَى} whenever · {أَيْنَمَا} wherever · {كَيْفَمَا} however: {أَيْنَمَا تَذْهَبْ أَذْهَبْ مَعَكَ} (wherever you go, I’ll go with you).", "In the Quran: {فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ} (whoever does an atom’s weight of good will see it) · {وَمَا تَفْعَلُوا مِنْ خَيْرٍ يَعْلَمْهُ اللّٰهُ} (whatever good you do, Allah knows it).", "{كُلَّمَا} (every time) is different: it takes past verbs and no silent ending, and the meaning can be past or present: {كُلَّمَا زُرْتُهُ فَرِحَ} (every time I visit him, he is happy)."],
    },
    ur: {
      title: "جو بھی، جہاں بھی: {مَنْ}، {مَا}، {أَيْنَمَا}، {كُلَّمَا}", short: "جو کوشش کرے وہ پائے؛ جو بوؤ گے وہی کاٹو گے۔",
      intro: "{مَنْ} (جو بھی) اور {مَا} (جو کچھ) جیسے الفاظ سبق ۵۶ کے {إِنْ} کی طرح شرط کا جملہ شروع کر سکتے ہیں۔ تب دونوں مضارع مجزوم ہوتے ہیں: {مَنْ يَدْرُسْ يَنْجَحْ} (جو پڑھے گا وہ کامیاب ہو گا)۔ ماضی کے ساتھ اعراب ظاہر نہیں ہوتا: {مَنْ جَدَّ وَجَدَ} (جس نے کوشش کی اس نے پایا)، مشہور کہاوت۔ انہیں اسمائے شرط کہتے ہیں۔",
      points: ["{مَنْ} جو بھی · {مَا} جو کچھ · {مَتَى} جب بھی · {أَيْنَمَا} جہاں بھی · {كَيْفَمَا} جیسے بھی: {أَيْنَمَا تَذْهَبْ أَذْهَبْ مَعَكَ} (تم جہاں جاؤ گے میں تمہارے ساتھ جاؤں گا)۔", "قرآن میں: {فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ} (جو ذرہ برابر نیکی کرے گا وہ اسے دیکھ لے گا) · {وَمَا تَفْعَلُوا مِنْ خَيْرٍ يَعْلَمْهُ اللّٰهُ} (تم جو نیکی کرو گے اللہ اسے جانتا ہے)۔", "{كُلَّمَا} (جب جب، ہر بار) مختلف ہے: اس کے ساتھ ماضی آتی ہے اور جزم نہیں ہوتا، مطلب ماضی یا حال دونوں ہو سکتا ہے: {كُلَّمَا زُرْتُهُ فَرِحَ} (میں جب بھی اس سے ملنے جاتا ہوں وہ خوش ہوتا ہے)۔"],
    },
    ex: [["مَنْ يَدْرُسْ يَنْجَحْ", "man yadrus yanjaḥ", "Whoever studies will succeed.", "جو پڑھے گا وہ کامیاب ہو گا۔"], ["مَنْ جَدَّ وَجَدَ", "man jadda wajada", "Whoever strives, finds.", "جس نے کوشش کی اس نے پایا۔"], ["مَا تَزْرَعْ تَحْصُدْ", "maa tazraʿ taḥṣud", "Whatever you sow, you will reap.", "جو بوؤ گے وہی کاٹو گے۔"], ["أَيْنَمَا تَذْهَبْ أَذْهَبْ مَعَكَ", "aynamaa tadhhab adhhab maʿaka", "Wherever you go, I’ll go with you.", "تم جہاں جاؤ گے میں تمہارے ساتھ جاؤں گا۔"], ["مَتَى تَأْتِ أُكْرِمْكَ", "mataa ta’ti ukrimka", "Whenever you come, I’ll host you generously.", "تم جب بھی آؤ گے میں تمہاری خاطر تواضع کروں گا۔"], ["كُلَّمَا زُرْتُهُ فَرِحَ", "kullamaa zurtuhu fariḥa", "Every time I visit him, he is happy.", "میں جب بھی اس سے ملنے جاتا ہوں وہ خوش ہوتا ہے۔"]],
    practice: [{ en: "Say “Whoever is patient will win.” ({يَصْبِرْ}, {يَفُزْ})", ur: "«جو صبر کرے گا وہ کامیاب ہو گا» کہیں ({يَصْبِرْ}، {يَفُزْ})۔", a: "مَنْ يَصْبِرْ يَفُزْ", tr: "man yaṣbir yafuz" }, { en: "Say “Wherever you sit, I’ll sit.”", ur: "«تم جہاں بیٹھو گے میں بیٹھوں گا» کہیں۔", a: "أَيْنَمَا تَجْلِسْ أَجْلِسْ", tr: "aynamaa tajlis ajlis" }, { en: "Say “Every time he came, he brought a gift.”", ur: "«وہ جب بھی آیا تحفہ لایا» کہیں۔", a: "كُلَّمَا جَاءَ أَحْضَرَ هَدِيَّةً", tr: "kullamaa jaa’a aḥḍara hadiyyatan" }],
  },
  {
    slug: "lesson-77-himself-all-both", key: "نَفْسُهُ",
    en: {
      title: "Himself, all, both: {نَفْسُ}, {كُلُّ}, {كِلَا}", short: "Emphasis words that strengthen a noun.",
      intro: "To stress a noun, Arabic adds {نَفْسُ} (self) with a pronoun that matches it: {جَاءَ الْمُدِيرُ نَفْسُهُ} (the manager himself came). The emphasis word copies the noun’s ending: {قَابَلْتُ الْمُدِيرَ نَفْسَهُ} (I met the manager himself). This is called {التَّوْكِيدُ}; {عَيْنُ} can be used the same way.",
      points: ["{نَفْسُ} before a noun means “the same”: {فِي نَفْسِ الْيَوْمِ} (on the same day). With {بِـ} it means “by myself”: {كَتَبْتُهُ بِنَفْسِي} (I wrote it myself).", "All: {كُلُّ} after the noun with a pronoun: {حَضَرَ الطُّلَّابُ كُلُّهُمْ} (the students all came) · {قَرَأْتُ الْكِتَابَ كُلَّهُ} (I read the whole book). {جَمِيعًا} on its own means “all together”: {اِجْلِسُوا جَمِيعًا} (sit down, all of you). See lesson 40 for {كُلُّ} before a noun.", "Both: {كِلَا} (masculine) and {كِلْتَا} (feminine) with a pronoun: {نَجَحَ الطَّالِبَانِ كِلَاهُمَا} (both students passed) · {رَأَيْتُ الطَّالِبَيْنِ كِلَيْهِمَا} (I saw both students)."],
    },
    ur: {
      title: "خود، سب، دونوں: {نَفْسُ}، {كُلُّ}، {كِلَا}", short: "اسم پر زور دینے والے الفاظ۔",
      intro: "کسی اسم پر زور دینے کے لیے عربی میں {نَفْسُ} (خود) اور مطابق ضمیر لگاتے ہیں: {جَاءَ الْمُدِيرُ نَفْسُهُ} (مینیجر خود آئے)۔ تاکید والا لفظ اسم کا اعراب لیتا ہے: {قَابَلْتُ الْمُدِيرَ نَفْسَهُ} (میں خود مینیجر سے ملا)۔ اسے {التَّوْكِيدُ} کہتے ہیں؛ {عَيْنُ} بھی اسی طرح آتا ہے۔",
      points: ["اسم سے پہلے {نَفْسُ} کا مطلب «وہی»: {فِي نَفْسِ الْيَوْمِ} (اسی دن)۔ {بِـ} کے ساتھ «خود»: {كَتَبْتُهُ بِنَفْسِي} (میں نے اسے خود لکھا)۔", "سب: اسم کے بعد {كُلُّ} اور ضمیر: {حَضَرَ الطُّلَّابُ كُلُّهُمْ} (سب طلبہ آئے) · {قَرَأْتُ الْكِتَابَ كُلَّهُ} (میں نے پوری کتاب پڑھی)۔ اکیلا {جَمِيعًا} کا مطلب «سب مل کر»: {اِجْلِسُوا جَمِيعًا} (سب بیٹھ جاؤ)۔ اسم سے پہلے {كُلُّ} کے لیے سبق ۴۰ دیکھیں۔", "دونوں: مذکر کے لیے {كِلَا}، مؤنث کے لیے {كِلْتَا}، ضمیر کے ساتھ: {نَجَحَ الطَّالِبَانِ كِلَاهُمَا} (دونوں طالب علم کامیاب ہوئے) · {رَأَيْتُ الطَّالِبَيْنِ كِلَيْهِمَا} (میں نے دونوں طالب علموں کو دیکھا)۔"],
    },
    ex: [["جَاءَ الْمُدِيرُ نَفْسُهُ", "jaa’a l-mudiiru nafsuhu", "The manager himself came.", "مینیجر خود آئے۔"], ["قَابَلْتُ الْوَزِيرَ نَفْسَهُ", "qaabaltu l-waziira nafsahu", "I met the minister himself.", "میں خود وزیر سے ملا۔"], ["طَبَخْتُ الطَّعَامَ بِنَفْسِي", "ṭabakhtu ṭ-ṭaʿaama bi-nafsii", "I cooked the food myself.", "میں نے کھانا خود پکایا۔"], ["وُلِدْنَا فِي نَفْسِ الْيَوْمِ", "wulidnaa fii nafsi l-yawmi", "We were born on the same day.", "ہم ایک ہی دن پیدا ہوئے۔"], ["قَرَأْتُ الْكِتَابَ كُلَّهُ", "qara’tu l-kitaaba kullahu", "I read the whole book.", "میں نے پوری کتاب پڑھی۔"], ["نَجَحَ الطَّالِبَانِ كِلَاهُمَا", "najaḥa ṭ-ṭaalibaani kilaahumaa", "Both students passed.", "دونوں طالب علم کامیاب ہوئے۔"]],
    practice: [{ en: "Say “I did it myself.”", ur: "«میں نے یہ خود کیا» کہیں۔", a: "فَعَلْتُهُ بِنَفْسِي", tr: "faʿaltuhu bi-nafsii" }, { en: "Say “The students all came.”", ur: "«سب طلبہ آئے» کہیں۔", a: "حَضَرَ الطُّلَّابُ كُلُّهُمْ", tr: "ḥaḍara ṭ-ṭullaabu kulluhum" }, { en: "Say “Both girls came.”", ur: "«دونوں لڑکیاں آئیں» کہیں۔", a: "جَاءَتِ الْبِنْتَانِ كِلْتَاهُمَا", tr: "jaa’ati l-bintaani kiltaahumaa" }],
  },
  {
    slug: "lesson-78-oaths-anna", key: "لَأَفْعَلَنَّ",
    en: {
      title: "I will surely…: oaths and the strong {ـَنَّ}", short: "By Allah, I will surely help you.",
      intro: "To make a promise or oath about the future really strong, Arabic puts {لَـ} before a present verb and {ـَنَّ} at its end: {لَأَذْهَبَنَّ} (I will surely go). It usually follows an oath: {وَاللّٰهِ لَأُسَاعِدَنَّكَ} (by Allah, I will surely help you). This ending is called {نُونُ التَّوْكِيدِ}.",
      points: ["The verb before {ـَنَّ} ends in -a: {يَكْتُبُ} → {لَيَكْتُبَنَّ} (he will surely write). Speaking to a group, it becomes {ـُنَّ}: {ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ} (then you will surely be asked that Day about the blessings).", "It also strengthens “don’t”: {لَا تَيْأَسَنَّ} (don’t ever despair). In the Quran: {وَلَا تَقُولَنَّ لِشَيْءٍ إِنِّي فَاعِلٌ ذٰلِكَ غَدًا} (never say of anything, “I will do that tomorrow”).", "A lighter form is written with tanween: {لَنَسْفَعًا بِالنَّاصِيَةِ} (Surah al-ʿAlaq) and {وَلَيَكُونًا مِنَ الصَّاغِرِينَ} (Surah Yusuf). Now you know why these words look unusual in the Mushaf."],
    },
    ur: {
      title: "میں ضرور…: قسم اور نونِ تاکید {ـَنَّ}", short: "اللہ کی قسم، میں ضرور تمہاری مدد کروں گا۔",
      intro: "مستقبل کے وعدے یا قسم کو بہت مضبوط کرنے کے لیے مضارع سے پہلے {لَـ} اور آخر میں {ـَنَّ} لگاتے ہیں: {لَأَذْهَبَنَّ} (میں ضرور جاؤں گا)۔ یہ عموماً قسم کے بعد آتا ہے: {وَاللّٰهِ لَأُسَاعِدَنَّكَ} (اللہ کی قسم، میں ضرور تمہاری مدد کروں گا)۔ اس نون کو {نُونُ التَّوْكِيدِ} کہتے ہیں۔",
      points: ["{ـَنَّ} سے پہلے فعل مفتوح ہوتا ہے: {يَكْتُبُ} ← {لَيَكْتُبَنَّ} (وہ ضرور لکھے گا)۔ جماعت کے لیے {ـُنَّ}: {ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ} (پھر اس دن تم سے نعمتوں کے بارے میں ضرور پوچھا جائے گا)۔", "نہی کو بھی مضبوط کرتا ہے: {لَا تَيْأَسَنَّ} (ہرگز مایوس نہ ہونا)۔ قرآن میں: {وَلَا تَقُولَنَّ لِشَيْءٍ إِنِّي فَاعِلٌ ذٰلِكَ غَدًا} (کسی کام کے بارے میں ہرگز نہ کہنا کہ میں کل یہ کروں گا)۔", "ہلکا نون تنوین کی شکل میں لکھا جاتا ہے: {لَنَسْفَعًا بِالنَّاصِيَةِ} (سورۃ العلق) اور {وَلَيَكُونًا مِنَ الصَّاغِرِينَ} (سورۃ یوسف)۔ اب آپ جانتے ہیں کہ مصحف میں یہ الفاظ ایسے کیوں لکھے ہیں۔"],
    },
    ex: [["وَاللّٰهِ لَأُسَاعِدَنَّكَ", "wallaahi la-usaaʿidannaka", "By Allah, I will surely help you.", "اللہ کی قسم، میں ضرور تمہاری مدد کروں گا۔"], ["لَأَزُورَنَّكَ غَدًا", "la-azuurannaka ghadan", "I will surely visit you tomorrow.", "میں کل ضرور تم سے ملنے آؤں گا۔"], ["لَيَنْجَحَنَّ الْمُجْتَهِدُ", "la-yanjaḥanna l-mujtahidu", "The hard worker will surely succeed.", "محنتی ضرور کامیاب ہو گا۔"], ["ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ", "thumma la-tus’alunna yawma’idhin ʿani n-naʿiimi", "Then you will surely be asked that Day about the blessings.", "پھر اس دن تم سے نعمتوں کے بارے میں ضرور پوچھا جائے گا۔"], ["لَا تَيْأَسَنَّ", "laa tay’asanna", "Don’t ever despair.", "ہرگز مایوس نہ ہونا۔"], ["وَلَا تَقُولَنَّ لِشَيْءٍ إِنِّي فَاعِلٌ ذٰلِكَ غَدًا", "wa laa taquulanna li-shay’in innii faaʿilun dhaalika ghadan", "Never say of anything, “I will do that tomorrow.”", "کسی کام کے بارے میں ہرگز نہ کہنا کہ میں کل یہ کروں گا۔"]],
    practice: [{ en: "Say “By Allah, I will surely write.”", ur: "«اللہ کی قسم، میں ضرور لکھوں گا» کہیں۔", a: "وَاللّٰهِ لَأَكْتُبَنَّ", tr: "wallaahi la-aktubanna" }, { en: "Say “I will surely study.”", ur: "«میں ضرور پڑھوں گا» کہیں۔", a: "لَأَدْرُسَنَّ", tr: "la-adrusanna" }, { en: "Say “He will surely come.”", ur: "«وہ ضرور آئے گا» کہیں۔", a: "لَيَأْتِيَنَّ", tr: "la-ya’tiyanna" }],
  },
];

// ---------------------------------------------------------------- interface text
const T = {
  en: {
    dir: 'ltr', brand: 'Harf', skip: 'Skip to content', navLabel: 'Sections',
    nav: { home: 'Home', alphabet: 'Alphabet', lessons: 'Lessons', stories: 'Stories', vocabulary: 'Vocabulary', quran: 'Quran', phrases: 'Phrases', quiz: 'Quiz' },
    switchLabel: 'اردو', switchTitle: 'یہ صفحہ اردو میں پڑھیں', switchLang: 'ur',
    about: 'About', contact: 'Contact', privacy: 'Privacy policy', support: 'Support Harf',
    listen: 'Listen', sep: '›', prev: '← Previous', next: 'Next →',
    footer: 'Free Arabic lessons for English and Urdu speakers.',
  },
  ur: {
    dir: 'rtl', brand: 'حرف', skip: 'مواد پر جائیں', navLabel: 'حصے',
    nav: { home: 'صفحۂ اول', alphabet: 'حروفِ تہجی', lessons: 'اسباق', stories: 'کہانیاں', vocabulary: 'الفاظ', quran: 'قرآن', phrases: 'جملے', quiz: 'کوئز' },
    switchLabel: 'English', switchTitle: 'Read this page in English', switchLang: 'en',
    about: 'ہمارے بارے میں', contact: 'رابطہ', privacy: 'رازداری کی پالیسی', support: 'حرف کی مدد کریں',
    listen: 'سنیں', sep: '‹', prev: '→ پچھلا', next: 'اگلا ←',
    footer: 'اردو اور انگریزی بولنے والوں کے لیے مفت عربی اسباق۔',
  },
};

// ---------------------------------------------------------------- helpers
const TW = '\u0640';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// {Arabic} -> Arabic span, [latin] -> left-to-right span
const fmt = (s) => esc(s)
  .replace(/\{([^}]+)\}/g, (m, t) => `<span class="ar${t.length <= 24 ? ' nw' : ''}" lang="ar">${t}</span>`)
  .replace(/\[([^\]]+)\]/g, '<span class="latin" dir="ltr">$1</span>');
const ud = (n) => String(n).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
const num = (lang, n) => (lang === 'ur' ? ud(n) : String(n));
const ord = (n) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
const link = (lang, file) => (lang === 'en' ? file : file === 'index.html' ? 'ur.html' : 'ur-' + file);
const pageUrl = (file) => SITE_URL + '/' + (file === 'index.html' ? '' : file);
const say = (lang, text, label) => `<button class="btn sm" type="button" data-say="${esc(text)}">${label || T[lang].listen}</button>`;
const totalWords = TOPICS.reduce((n, t) => n + t.words.length, 0);
const deckTotal = totalWords + QWORDS.length;
// Pictures for vocabulary flashcards and the picture quiz, in the same order as each topic's words.
const dots = (n) => '●'.repeat(Math.min(n, 5)) + (n > 5 ? ' ' + '●'.repeat(n - 5) : '');
const PICS = {
  greetings: ['👋', '🤝', '😊', '🌅', '🌙', '🙏', '🙂', '✅', '❌', '👋'],
  numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(dots),
  family: ['👨', '👩', '👦', '👧', '👦', '👧', '👴', '👵', '🤵', '👰'],
  food: ['💧', '🍞', '🌴', '☕', '🍵', '🍚', '🥩', '🍗', '🥛', '🍎'],
  everyday: ['🏠', '🏫', '🚗', '📕', '🖊️', '🚪', '📅', '💼', '🛒', '🕌'],
  colours: ['🔴', '🔵', '🟢', '🟡', '⚫', '⚪', '🟤', '🟠'],
  jobs: ['🧑‍⚕️', '🩺', '👨‍🏫', '👷', '🧮', '🚖', '🧑‍🍳', '👮', '🎓', '🛠️'],
  body: ['', '👁️', '👂', '👃', '👄', '🦷', '✋', '🦶', '❤️', '💇'],
  places: ['✈️', '🚆', '🚌', '🚲', '🛫', '🏥', '🍽️', '🏦', '🏨', '🛣️'],
  home: ['', '🍳', '🛏️', '', '🪑', '🪟', '🔑', '⏰', '📱', '🌳'],
};
TOPICS.forEach((t) => { const p = PICS[t.slug]; if (p) t.words.forEach((w, k) => { if (p[k]) w[4] = p[k]; }); });
// Picture quiz: skip pictures that stand for more than one word in the list.
const PIC_QUIZ = (() => {
  const all = TOPICS.flatMap((t) => (['family', 'food', 'everyday', 'colours', 'jobs', 'body', 'places', 'home'].includes(t.slug) ? t.words.filter((w) => w[4]) : []));
  const count = {}; all.forEach((w) => { count[w[4]] = (count[w[4]] || 0) + 1; });
  return all.filter((w) => count[w[4]] === 1);
})();
const arNum = (n) => String(n).replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
const BASMALA = SURAHS[0].v[0].w.map((x) => x[0]).join(' ');
PRAYER.forEach((p) => { if (p.a === 'BASMALA') p.a = BASMALA; });
const surahWords = (s) => s.v.reduce((n, v) => n + v.w.length, 0);

const translit = (() => {
// Transliterate fully vowelled Arabic into the Latin style used on Harf. Shared by build.js (copied in) and tests.
const MAP = { 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'ḥ', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 'ṣ', 'ض': 'ḍ', 'ط': 'ṭ', 'ظ': 'ẓ', 'ع': 'ʿ', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h' };
const SUN = new Set('تثدذرزسشصضطظلن'.split(''));
const HAMZA = new Set(['ء', 'أ', 'إ', 'ؤ', 'ئ']);
const FATHA = 'َ', DAMMA = 'ُ', KASRA = 'ِ', SUKUN = 'ْ', SHADDA = 'ّ', TF = 'ً', TD = 'ٌ', TK = 'ٍ', DAGGER = 'ٰ', MADDA = 'ٓ';
const isMark = (c) => /[ً-ٰٟ]/.test(c);

function clusters(word) {
  const out = [];
  for (const ch of word.replace(/ـ/g, '')) {
    if (isMark(ch)) { if (out.length) out[out.length - 1].m.push(ch); }
    else out.push({ b: ch, m: [] });
  }
  return out;
}

function translit(word) {
  const cs = clusters(word.replace(/[،؛؟.!?:,"«»()]/g, ''));
  let out = '';
  let prev = ''; // last short vowel written: a, i, u, or '' (also 'an' for tanween fatha)
  for (let i = 0; i < cs.length; i++) {
    const { b, m } = cs[i];
    const has = (x) => m.includes(x);
    const shadda = has(SHADDA);
    let v = has(FATHA) ? 'a' : has(DAMMA) ? 'u' : has(KASRA) ? 'i' : '';
    const tan = has(TF) ? 'an' : has(TD) ? 'un' : has(TK) ? 'in' : '';
    const dag = has(DAGGER);
    // definite article: alif + lam (no vowel) at the start, or after a one-letter prefix with a vowel
    if (b === 'ا' && m.length === 0 && cs[i + 1] && cs[i + 1].b === 'ل' && !cs[i + 1].m.some((x) => x === SHADDA || x === FATHA || x === DAMMA || x === KASRA) && cs[i + 2] && (i === 0 || prev)) {
      const nx = cs[i + 2];
      if (SUN.has(nx.b) && nx.m.includes(SHADDA)) {
        out += (i === 0 ? 'a' : '') + (MAP[nx.b]) + '-';
        // write the sun letter once; its doubling was done here
        nx.m = nx.m.filter((x) => x !== SHADDA);
        i += 1; prev = ''; continue;
      }
      out += (i === 0 ? 'a' : '') + 'l-'; i += 1; prev = ''; continue;
    }
    // li + al-: لِلْبَيْتِ -> lil-bayti, لِلشِّتَاءِ -> lish-shitaa'i
    if (i === 0 && b === 'ل' && v === 'i' && cs.length > 2 && cs[1].b === 'ل' && cs[1].m.every((x) => x === SUKUN)) {
      const nx = cs[2];
      if (SUN.has(nx.b) && nx.m.includes(SHADDA)) { out += 'li' + MAP[nx.b] + '-'; nx.m = nx.m.filter((x) => x !== SHADDA); i += 1; prev = ''; continue; }
      if (cs[1].m.includes(SUKUN)) { out += 'lil-'; i += 1; prev = ''; continue; }
    }
    if (b === 'ا') {
      if (m.length === 0) { if (i === 0) out += 'a'; else if (prev === 'a') out += 'a'; prev = ''; continue; } // long aa; silent otherwise
      if (i === 0) { out += v || ''; prev = v; continue; } // hamzat wasl or initial alif with a vowel
      out += v; prev = v; continue;
    }
    if (b === 'آ') { out += (i === 0 ? '' : '’') + 'aa'; prev = ''; continue; }
    if (b === 'ى') { if (prev === 'a' || !prev) out += 'a'; else if (prev === 'i') out += 'i'; prev = ''; continue; }
    if (b === 'و' || b === 'ي') {
      const ch = b === 'و' ? 'w' : 'y';
      if (shadda) { out += ch + ch + v + tan; prev = tan ? '' : v; continue; }
      if (v || tan) { out += ch + v + tan; prev = tan ? '' : v; continue; }
      // no vowel: long vowel after matching short vowel, otherwise a glide (aw / ay)
      if (b === 'و' && prev === 'u') { out += 'u'; prev = ''; continue; }
      if (b === 'ي' && prev === 'i') { out += 'i'; prev = ''; continue; }
      out += ch; prev = ''; continue;
    }
    if (b === 'ة') {
      if (v || tan) { out += 't' + v + tan; prev = ''; continue; }
      out += 'a'; prev = ''; continue;
    }
    let cons;
    if (HAMZA.has(b)) cons = (i === 0 || out.endsWith('-') ? '' : '’'); else if (MAP[b]) cons = MAP[b]; else { out += b; prev = ''; continue; }
    out += cons + (shadda && cons ? cons : '');
    if (dag) { out += 'aa'; prev = ''; continue; }
    out += v + tan;
    prev = tan ? '' : v;
    if (tan === 'an') prev = ''; // the following alif is silent
  }
  return out.replace(/al-lah/g, 'allaah').replace(/allah/g, 'allaah').replace(/llah/g, 'llaah').replace(/allaahh/g, 'allaah');
}
  return translit;
})();

// ---------------------------------------------------------------- classic tales (data/ folder)
// data/lexicon.txt:  token | English | Urdu | root letters (or -) | origin note EN | origin note UR
// data/classics/*.txt:  "=== slug | level | Arabic title | English title | Urdu title | about EN | about UR" then "arabic | english | urdu" lines.
const PUNCT = /[،؛؟.!?:,"«»()]/g;
const stripP = (w) => w.replace(PUNCT, '');
const baseForm = (w) => stripP(w).replace(/[ً-ٰٟـ]/g, '');
const stemKey = (w) => baseForm(w).replace(/^[وف]?[بلك]?(?:ال)?/, '').replace(/[ةهى]$/, '');
function loadClassics() {
  const dir = path.join(__dirname, 'data');
  const lines = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split(/\r?\n/) : []);
  const lex = new Map();
  for (const ln of lines(path.join(dir, 'lexicon.txt'))) {
    if (!ln.trim() || ln.startsWith('#')) continue;
    const [t, en, ur, root, oen, our] = ln.split('|').map((x) => x.trim());
    lex.set(t, { en, ur, root: root && root !== '-' ? root : '', oen: oen || '', our: our || '' });
  }
  const byRoot = new Map();
  for (const [t, e] of lex) if (e.root) { if (!byRoot.has(e.root)) byRoot.set(e.root, []); byRoot.get(e.root).push(t); }
  const tales = [];
  const cdir = path.join(dir, 'classics');
  const files = fs.existsSync(cdir) ? fs.readdirSync(cdir).filter((f) => f.endsWith('.txt')).sort() : [];
  const missing = new Set();
  for (const f of files) {
    let cur = null;
    for (const ln of lines(path.join(cdir, f))) {
      if (!ln.trim() || ln.startsWith('#')) continue;
      if (ln.startsWith('===')) {
        const [slug, level, ar, en, ur, srcEn, srcUr] = ln.slice(3).split('|').map((x) => x.trim());
        cur = { slug, level: +level, ar, en, ur, srcEn: srcEn || '', srcUr: srcUr || '', s: [] };
        tales.push(cur);
        continue;
      }
      const [ar, en, ur] = ln.split('|').map((x) => x.trim());
      const w = ar.split(/\s+/).map((raw) => {
        const a = stripP(raw), e = lex.get(a);
        if (!e) { missing.add(a); return { raw, a, tr: translit(a), en: '?', ur: '?', root: '', oen: '', our: '', rel: '' }; }
        const seenK = new Set([stemKey(a)]);
        const rel = e.root ? (byRoot.get(e.root) || []).filter((t) => { const k = stemKey(t); if (seenK.has(k)) return false; seenK.add(k); return true; }).slice(0, 3).map((t) => ({ a: t, en: lex.get(t).en, ur: lex.get(t).ur })) : [];
        return { raw, a, tr: translit(a), en: e.en, ur: e.ur, root: e.root, oen: e.oen, our: e.our, rel };
      });
      cur.s.push({ w, tr: w.map((x) => x.tr).join(' '), en, ur });
    }
  }
  if (missing.size && process.env.HARF_ALLOW_MISSING !== '1') {
    fs.writeFileSync(path.join(__dirname, 'missing-words.txt'), [...missing].join('\n') + '\n');
    throw new Error(`${missing.size} words are missing from data/lexicon.txt (listed in missing-words.txt)`);
  }
  return tales;
}
let CLASSICS = [];
const LEVELS = {
  en: { 1: 'Level 1: very short and simple', 2: 'Level 2: everyday sentences', 3: 'Level 3: longer tales' },
  ur: { 1: 'درجہ ۱: بہت مختصر اور آسان', 2: 'درجہ ۲: روزمرہ جملے', 3: 'درجہ ۳: لمبی کہانیاں' },
};

const FONTS = {
  en: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Amiri:ital,wght@0,400;0,700&family=Noto+Naskh+Arabic:wght@400;600;700&family=Aref+Ruqaa:wght@700&family=Reem+Kufi:wght@500;700&family=Source+Sans+3:wght@400;600;700&display=swap',
  ur: 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Amiri:ital,wght@0,400;0,700&family=Noto+Naskh+Arabic:wght@400;600;700&family=Aref+Ruqaa:wght@700&family=Reem+Kufi:wght@500;700&family=Source+Sans+3:wght@400;600;700&display=swap',
};
const PATTERN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72"><g fill="none" stroke="#e3ac45" stroke-width="1" stroke-opacity=".30"><rect x="18" y="18" width="36" height="36"/><rect x="18" y="18" width="36" height="36" transform="rotate(45 36 36)"/><circle cx="36" cy="36" r="9"/><path d="M0 0l9 9M72 0l-9 9M0 72l9-9M72 72l-9-9" stroke-opacity=".22"/></g></svg>';
const PATTERN = 'url("data:image/svg+xml,' + encodeURIComponent(PATTERN_SVG) + '")';
const STAR_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><g fill="#c9973a"><rect x="9" y="9" width="22" height="22"/><rect x="9" y="9" width="22" height="22" transform="rotate(45 20 20)"/></g><circle cx="20" cy="20" r="5.5" fill="none" stroke="#fffaf0" stroke-width="1.6"/></svg>';
const STAR = 'url("data:image/svg+xml,' + encodeURIComponent(STAR_SVG) + '")';
const ROSETTE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g fill="none" stroke="#f3d58a" stroke-width="1"><g stroke-opacity=".55"><rect x="45" y="45" width="110" height="110"/><rect x="45" y="45" width="110" height="110" transform="rotate(45 100 100)"/></g><g stroke-opacity=".35"><rect x="62" y="62" width="76" height="76" transform="rotate(22.5 100 100)"/><rect x="62" y="62" width="76" height="76" transform="rotate(67.5 100 100)"/><circle cx="100" cy="100" r="92"/><circle cx="100" cy="100" r="86"/><circle cx="100" cy="100" r="36"/></g></g></svg>';
const ROSETTE = 'url("data:image/svg+xml,' + encodeURIComponent(ROSETTE_SVG) + '")';
const SPK = 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#000"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/></svg>') + '")';
const FAVICON = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0d6b57"/><text x="32" y="46" font-size="38" text-anchor="middle" fill="#ffffff" font-family="serif">ح</text></svg>');

function layout(lang, o) {
  const t = T[lang];
  const self = link(lang, o.file);
  const other = link(t.switchLang, o.file);
  const navItems = [['index.html', 'home'], ['alphabet.html', 'alphabet'], ['lessons.html', 'lessons'], ['stories.html', 'stories'], ['vocabulary.html', 'vocabulary'], ['quran.html', 'quran'], ['phrases.html', 'phrases'], ['quiz.html', 'quiz']]
    .map(([f, k]) => `<a href="${link(lang, f)}"${o.section === k ? ' aria-current="page"' : ''}>${t.nav[k]}</a>`).join('');
  const ads = ADSENSE_CLIENT
    ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>\n` : '';
  const verify = GSC_VERIFY ? `<meta name="google-site-verification" content="${esc(GSC_VERIFY)}">\n` : '';
  const analytics = GA_ID
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>try{var q=location.search;if(/[?&]notrack=1/.test(q))localStorage.setItem('harf-notrack','1');if(/[?&]notrack=0/.test(q))localStorage.removeItem('harf-notrack');if(localStorage.getItem('harf-notrack')==='1')window['ga-disable-${GA_ID}']=true;}catch(e){}
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>\n` : '';
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${t.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="canonical" href="${pageUrl(self)}">
<link rel="alternate" hreflang="en" href="${pageUrl(link('en', o.file))}">
<link rel="alternate" hreflang="ur" href="${pageUrl(link('ur', o.file))}">
<link rel="alternate" hreflang="x-default" href="${pageUrl(link('en', o.file))}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${t.brand}">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${pageUrl(self)}">
<meta property="og:locale" content="${lang === 'ur' ? 'ur_PK' : 'en_GB'}">
<link rel="icon" href="${FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${esc(FONTS[lang])}">
<link rel="stylesheet" href="style.css">
${verify}${analytics}${ads}</head>
<body>
<a class="skip" href="#main">${t.skip}</a>
<header class="top">
  <div class="wrap bar">
    <a class="brand" href="${link(lang, 'index.html')}"><span class="ar" lang="ar">حَرْف</span>${lang === 'en' ? '<b>Harf</b>' : ''}</a>
    <nav class="tabs" aria-label="${t.navLabel}">${navItems}</nav>
    <a class="lang" href="${other}" hreflang="${t.switchLang}" lang="${t.switchLang}" title="${esc(t.switchTitle)}">${t.switchLabel}</a>
  </div>
</header>
<main id="main" class="wrap">
${o.body}
</main>
<footer>
  <div class="wrap foot">
    <p><strong>${t.brand}</strong> · ${t.footer}</p>
    <nav class="foot-links" aria-label="${t.about}">
      <a href="${link(lang, 'about.html')}">${t.about}</a>
      <a href="${link(lang, 'contact.html')}">${t.contact}</a>
      <a href="${link(lang, 'privacy.html')}">${t.privacy}</a>
      <a href="${KOFI_URL}">${t.support}</a>
    </nav>
    <p class="small">© ${num(lang, YEAR)} ${t.brand}</p>
  </div>
</footer>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script src="app.js" defer></script>
</body>
</html>
`;
}

const crumbs = (lang, items) => `<p class="crumbs">${items.map(([f, label]) => (f ? `<a href="${link(lang, f)}">${label}</a>` : `<span>${label}</span>`)).join(' <span class="sep" aria-hidden="true">›</span> ')}</p>`;

function supportBox(lang) {
  const ur = lang === 'ur';
  return `<section class="box support">
  <p>${ur ? '<strong>حرف سب کے لیے مفت ہے۔</strong> اگر یہ آپ کے کام آئے تو ایک چھوٹا سا تحفہ نئے اسباق بنانے میں مدد دیتا ہے۔' : '<strong>Harf is free for everyone.</strong> If it helps you, a small tip keeps new lessons coming.'}</p>
  <a class="btn primary" href="${KOFI_URL}">${T[lang].support}</a>
</section>`;
}

// ---------------------------------------------------------------- pages
const CARD_GLYPH = { 'alphabet.html': 'أ ب ت', 'writing.html': 'قَلَم', 'lessons.html': 'نَحْو', 'classic-tales.html': 'حِكَايَات', 'reading.html': 'قِصَص', 'vocabulary.html': 'كَلِمَات', 'quran.html': 'قُرْآن', 'phrases.html': 'جُمَل', 'saudi-arabic.html': 'هَلَا', 'quiz.html': 'اِخْتِبَار' };
function homePage(lang) {
  const ur = lang === 'ur';
  const n = (v) => num(lang, v);
  const C = ur ? {
    title: 'حرف: اردو میں مفت عربی سیکھیں', desc: 'اردو بولنے والوں کے لیے مفت عربی: حروفِ تہجی، گرامر کے اسباق، الفاظ، جملے اور کوئز، ہر لفظ کی آواز کے ساتھ۔',
    eyebrow: 'مفت · بغیر سائن اپ · اردو اور انگریزی',
    h1: 'مفت عربی سیکھیں، ایک ایک حرف کر کے',
    lead: `حرف آپ کو عربی پہلے حرف سے سکھاتا ہے۔ ${n(28)} حروف اور ان کی بدلتی شکلیں سیکھیں، گرامر کے مختصر اسباق پڑھیں، فلیش کارڈز سے الفاظ یاد کریں اور کوئز سے خود کو جانچیں۔ ہر عربی لفظ کی آواز سنی جا سکتی ہے۔`,
    cta1: 'حروفِ تہجی سے شروع کریں', cta2: 'اسباق دیکھیں',
    s1: 'سیکھے گئے حروف', s2: 'یاد کیے گئے الفاظ', s3: 'بہترین کوئز',
    insideH: 'یہاں آپ کیا سیکھیں گے',
    cards: [
      ['alphabet.html', 'حروفِ تہجی', `تمام ${n(28)} حروف، ان کی چاروں شکلیں، تلفظ کی رہنمائی اور ہر حرف کی ایک مثال۔`],
      ['writing.html', 'لکھنے کی مشق', 'ہر حرف اسکرین پر انگلی سے لکھیں، یا مفت ورک شیٹس پرنٹ کریں۔'],
      ['lessons.html', 'گرامر کے اسباق', `${n(LESSONS.length)} مختصر اسباق، پہلے جملے سے افعال، گنتی اور وقت بتانے تک۔`],
      ...(CLASSICS.length ? [['classic-tales.html', 'کلاسیکی کہانیاں', `${n(CLASSICS.length)} پرانی حکایتیں، لفظ بہ لفظ ترجمے، تلفظ اور لفظ کے ماخذ کے ساتھ۔`]] : []),
      ['reading.html', 'آسان کہانیاں', `${n(STORIES.length)} مختصر کہانیاں اعراب کے ساتھ؛ ہر لفظ پر ٹیپ کر کے مطلب دیکھیں۔`],
      ['vocabulary.html', 'الفاظ', `${n(TOPICS.length)} موضوعات میں روزمرہ کے ${n(totalWords)} الفاظ، سلام سے پیشوں اور جسم تک، فلیش کارڈز کے ساتھ۔`],
      ['quran.html', 'قرآنی عربی', `سورہ فاتحہ اور ${n(SURAHS.length - 1)} مختصر سورتیں لفظ بہ لفظ، نماز کے اذکار اور قرآن کے ${n(QWORDS.length)} عام الفاظ۔`],
      ['phrases.html', 'جملے', `ملنے جلنے، خریداری اور راستہ پوچھنے کے لیے ${n(PHRASES.length)} جملے۔`],
      ['saudi-arabic.html', 'سعودی بول چال', `سعودی عرب میں روزمرہ استعمال ہونے والے ${n(SAUDI.reduce((k, g) => k + g.items.length, 0))} جملے: دفتر، دکان، ٹیکسی اور ڈاکٹر۔`],
      ['quiz.html', 'کوئز', 'حروف اور الفاظ پر دس مختصر سوال، ہر بار نیا سیٹ۔'],
    ],
    howH: 'حرف سے کیسے سیکھیں',
    steps: [
      'روزانہ تین حروف سیکھیں۔ دس دن میں پوری الف بے یاد ہو جائے گی۔',
      'پھر ہر ہفتے گرامر کا ایک سبق اور ساتھ میں الفاظ کا ایک موضوع سیکھیں۔',
      'ہر لفظ پر «سنیں» دبائیں اور اونچی آواز میں دہرائیں۔ بولنے سے یاد رہتا ہے۔',
      'جو سیکھ لیں اسے نشان زد کریں اور ہر ہفتے کوئز دیں۔ آپ کی پیش رفت اسی براؤزر میں محفوظ رہتی ہے۔',
    ],
    whichH: 'یہ کون سی عربی ہے؟',
    which: 'حرف جدید فصیح عربی ({الفصحى}) سکھاتا ہے، جو پوری عرب دنیا میں کتابوں، خبروں اور رسمی گفتگو کی زبان ہے۔ یہ مراکش سے خلیج تک سمجھی جاتی ہے، اور سعودی یا مصری لہجہ سیکھنے سے پہلے بہترین بنیاد ہے۔',
  } : {
    title: 'Harf: Learn Arabic Free in English and Urdu', desc: 'Learn Arabic free: the alphabet with audio, beginner grammar lessons, vocabulary flashcards, everyday phrases and quizzes. In English and Urdu, no sign-up.',
    eyebrow: 'Free · No sign-up · English and Urdu',
    h1: 'Learn Arabic for free, one letter at a time',
    lead: 'Harf teaches Arabic from the very first letter. Learn the 28 letters and how they change shape, follow short grammar lessons, build vocabulary with flashcards and test yourself with quizzes. Every Arabic word has audio.',
    cta1: 'Start with the alphabet', cta2: 'Go to the lessons',
    s1: 'Letters learned', s2: 'Words known', s3: 'Best quiz',
    insideH: 'What you can learn here',
    cards: [
      ['alphabet.html', 'Alphabet', 'All 28 letters with their four shapes, pronunciation tips and an example word for each.'],
      ['writing.html', 'Writing practice', 'Trace every letter on screen with your finger, or print free tracing worksheets.'],
      ['lessons.html', 'Grammar lessons', `${LESSONS.length} short lessons, from your first sentence to verbs, numbers and telling the time.`],
      ...(CLASSICS.length ? [['classic-tales.html', 'Classic tales', `${CLASSICS.length} old fables and folk tales with word-by-word translation, pronunciation and word origins.`]] : []),
      ['reading.html', 'Easy stories', `${STORIES.length} short vowelled stories; tap any word to see what it means.`],
      ['vocabulary.html', 'Vocabulary', `${totalWords} everyday words in ${TOPICS.length} topics, from greetings to jobs and the body, with flashcards.`],
      ['quran.html', 'Quranic Arabic', `Al-Fatiha and ${SURAHS.length - 1} short surahs word by word, the words of the prayer and ${QWORDS.length} common Quran words.`],
      ['phrases.html', 'Phrases', `${PHRASES.length} sentences for meeting people, shopping and getting around.`],
      ['saudi-arabic.html', 'Saudi Arabic', `${SAUDI.reduce((k, g) => k + g.items.length, 0)} phrases Saudis use every day: at work, in shops, in taxis and at the doctor.`],
      ['quiz.html', 'Quiz', 'Ten quick questions on letters and words, with a new set every time.'],
    ],
    howH: 'How to use Harf',
    steps: [
      'Learn three letters a day. In ten days you will know the whole alphabet.',
      'Then take one grammar lesson a week, and learn one vocabulary topic alongside it.',
      'Press Listen on every word and say it out loud. Speaking helps you remember.',
      'Mark what you have learned and take the quiz each week. Your progress is saved in this browser.',
    ],
    whichH: 'Which Arabic is this?',
    which: 'Harf teaches Modern Standard Arabic ({الفصحى}, fuṣḥā), the Arabic of books, news and formal speech across the Arab world. It is understood from Morocco to the Gulf, and it is the best base before you pick up a dialect such as Saudi or Egyptian Arabic.',
  };
  const urBox = ur ? `<section class="box">
  <h2>اردو بولنے والوں کے لیے</h2>
  <p>آپ عربی رسم الخط پہلے ہی پڑھ سکتے ہیں، اس لیے آپ کا آدھا سفر طے ہو چکا ہے۔ اصل فرق تلفظ کا ہے: ${fmt('{ث ح ذ ص ض ط ظ ع ق}')} عربی میں اردو سے مختلف بولے جاتے ہیں۔ ہر حرف کے صفحے پر یہ فرق تفصیل سے بتایا گیا ہے۔</p>
</section>` : '';
  const body = `<section class="hero">
  <div class="hero-text">
    <p class="eyebrow">${C.eyebrow}</p>
    <h1>${C.h1}</h1>
    <p class="lead">${C.lead}</p>
    <div class="row">
      <a class="btn gold" href="${link(lang, 'alphabet.html')}">${C.cta1}</a>
      <a class="btn ghost" href="${link(lang, 'lessons.html')}">${C.cta2}</a>
    </div>
    <p class="hero-note"><a href="${link(lang, 'level-test.html')}">${ur ? 'معلوم نہیں کہاں سے شروع کریں؟ دو منٹ کا لیول ٹیسٹ دیں ←' : 'Not sure where to start? Take the two-minute level test →'}</a></p>
  </div>
  <div class="mihrab" aria-hidden="true">
    <div class="mihrab-in"><span class="calli" lang="ar">اِقْرَأْ</span><small>${ur ? 'پڑھیے' : 'Read'}</small></div>
  </div>
</section>
<div class="stats" id="stats" data-letters="28" data-words="${deckTotal}">
  <div class="stat"><strong id="sLetters">${n(0)}/${n(28)}</strong><span>${C.s1}</span><div class="meter"><i id="mLetters"></i></div></div>
  <div class="stat"><strong id="sWords">${n(0)}/${n(deckTotal)}</strong><span>${C.s2}</span><div class="meter"><i id="mWords"></i></div></div>
  <div class="stat"><strong id="sBest">–</strong><span>${C.s3}</span><div class="meter"><i id="mBest"></i></div></div>
</div>
${urBox}
<section>
  <h2 class="orn">${C.insideH}</h2>
  <div class="cards">
    ${C.cards.map(([f, h, p]) => `<a class="card${f === 'alphabet.html' || f === 'classic-tales.html' ? ' wide' : ''}" href="${link(lang, f)}"><span class="cg" lang="ar" aria-hidden="true">${CARD_GLYPH[f] || ''}</span><h3>${h}</h3><p>${p}</p><span class="go" aria-hidden="true">${ur ? '←' : '→'}</span></a>`).join('\n    ')}
  </div>
</section>
<section class="split">
  <div>
    <h2 class="orn">${C.howH}</h2>
    <ol class="steps">${C.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
  </div>
  <div>
    <h2>${C.whichH}</h2>
    <p>${fmt(C.which)}</p>
  </div>
</section>
${supportBox(lang)}`;
  return layout(lang, { file: 'index.html', section: 'home', title: C.title, desc: C.desc, body });
}

function letterName(lang, x) { return lang === 'ur' ? x.ur : x.en; }

function alphabetPage(lang) {
  const ur = lang === 'ur';
  const grid = LETTERS.map((x) => `<a class="lt" href="${link(lang, 'letter-' + x.slug + '.html')}" data-slug="${x.slug}"><span class="ar" lang="ar">${x.c}</span><small>${letterName(lang, x)}</small></a>`).join('\n    ');
  const bySlug = (s) => LETTERS.find((x) => x.slug === s);
  const groups = LOOKALIKES.map((g) => `<li><span class="ar" lang="ar">${g.map((s) => bySlug(s).c).join(' · ')}</span><span>${g.map((s) => letterName(lang, bySlug(s))).join(ur ? '، ' : ', ')}</span></li>`).join('');
  const vowels = [['بَ', 'ba', 'zabar / fatḥa', 'زبر (فتحہ)'], ['بِ', 'bi', 'zer / kasra', 'زیر (کسرہ)'], ['بُ', 'bu', 'pesh / ḍamma', 'پیش (ضمہ)']]
    .map(([a, tr, en, u]) => `<div class="ex-row"><span class="ar" lang="ar">${a}</span><span class="info"><span class="tr latin">${tr}</span><span class="mean">${ur ? u : en.split(' / ')[1]}</span></span>${say(lang, a)}</div>`).join('');
  const C = ur ? {
    title: 'عربی حروفِ تہجی: تمام ۲۸ حروف | حرف', desc: 'عربی کے تمام ۲۸ حروف، ان کی شکلیں اور درست تلفظ، اردو میں۔ ہر حرف کی آواز سنیں۔',
    h1: 'عربی حروفِ تہجی: تمام ۲۸ حروف',
    lead: 'عربی دائیں سے بائیں لکھی جاتی ہے، بالکل اردو کی طرح۔ زیادہ تر حروف اگلے حرف سے جڑتے ہیں اور لفظ میں اپنی جگہ کے مطابق شکل بدلتے ہیں: اکیلے، شروع میں، درمیان میں یا آخر میں۔ کسی بھی حرف پر ٹیپ کر کے اس کا سبق کھولیں۔',
    diffH: 'اردو سے کیا فرق ہے', diff: 'عربی میں ۲۸ حروف ہیں۔ اردو کے {پ ٹ چ ڈ ڑ ژ گ ے} عربی میں نہیں ہوتے۔ عربی میں «ک» کو {ك}، «ی» کو {ي} اور «ہ» کو {ه} لکھا جاتا ہے۔',
    joinH: 'چھ حروف جو آگے نہیں جڑتے', join: '{ا د ذ ر ز و} اپنے سے پہلے حرف سے جڑتے ہیں لیکن بعد والے سے کبھی نہیں۔ مثلاً {دار} (گھر) میں {ا} کے بعد {ر} الگ سے شروع ہوتا ہے۔',
    likeH: 'ملتے جلتے حروف', like: 'کئی حروف کی شکل ایک جیسی ہے اور فرق صرف نقطوں کا ہے۔ انہیں گروپ کی صورت میں یاد کریں:',
    vowH: 'حرکات: زبر، زیر، پیش', vow: 'عربی میں عام طور پر صرف حروف لکھے جاتے ہیں۔ چھوٹی آوازیں حرکات سے ظاہر ہوتی ہیں۔ قرآن مجید اور ابتدائی کتابوں میں حرکات لکھی ہوتی ہیں، اخبارات میں عموماً نہیں۔',
  } : {
    title: 'The Arabic alphabet: all 28 letters with audio | Harf', desc: 'All 28 letters of the Arabic alphabet with their shapes, pronunciation and audio. Tap any letter for a full lesson.',
    h1: 'The Arabic alphabet: all 28 letters',
    lead: 'Arabic is written from right to left. Most letters join to the letter that follows and change shape depending on where they sit in a word: alone, at the start, in the middle or at the end. Tap a letter to open its lesson.',
    diffH: '', diff: '',
    joinH: 'Six letters that never join forward', join: '{ا د ذ ر ز و} connect to the letter before them but never to the letter after. When one of them appears in a word, the next letter starts fresh, as in {دار} (daar, home).',
    likeH: 'Letters that look alike', like: 'Many letters share a shape and differ only in their dots. Learn them in groups:',
    vowH: 'Short vowels', vow: 'Arabic usually writes only consonants and long vowels. Short vowels are small marks above or below a letter. Beginner books and the Qur’an show them; newspapers usually don’t.',
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], [null, T[lang].nav.alphabet]])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
<div class="letters">
    ${grid}
</div>
<p><a class="btn" href="${link(lang, 'writing.html')}">${ur ? '🖨 حروف لکھنے کی مفت ورک شیٹس' : '🖨 Free printable tracing worksheets'}</a></p>
${C.diff ? `<section><h2>${C.diffH}</h2><p class="prose">${fmt(C.diff)}</p></section>` : ''}
<section><h2>${C.joinH}</h2><p class="prose">${fmt(C.join)}</p></section>
<section><h2>${C.likeH}</h2><p class="prose">${C.like}</p><ul class="groups">${groups}</ul></section>
<section><h2>${C.vowH}</h2><p class="prose">${C.vow}</p><div class="ex narrow">${vowels}</div></section>`;
  return layout(lang, { file: 'alphabet.html', section: 'alphabet', title: C.title, desc: C.desc, body });
}

function dotsText(lang, d) {
  const en = { '': 'No dots.', '1a': 'One dot above.', '1b': 'One dot below.', '2a': 'Two dots above.', '2b': 'Two dots below.', '3a': 'Three dots above.' };
  const urT = { '': 'کوئی نقطہ نہیں۔', '1a': 'اوپر ایک نقطہ۔', '1b': 'نیچے ایک نقطہ۔', '2a': 'اوپر دو نقطے۔', '2b': 'نیچے دو نقطے۔', '3a': 'اوپر تین نقطے۔' };
  return (lang === 'ur' ? urT : en)[d];
}

function letterPage(lang, i) {
  const ur = lang === 'ur';
  const x = LETTERS[i];
  const prev = LETTERS[i - 1], next = LETTERS[i + 1];
  const forms = x.joins ? [x.c, x.c + TW, TW + x.c + TW, TW + x.c] : [x.c, x.c, TW + x.c, TW + x.c];
  const labels = ur ? ['اکیلا', 'شروع میں', 'درمیان میں', 'آخر میں'] : ['Alone', 'Start', 'Middle', 'End'];
  const group = LOOKALIKES.find((g) => g.includes(x.slug));
  const similar = group ? group.filter((s) => s !== x.slug).map((s) => LETTERS.find((y) => y.slug === s)) : [];
  const simHtml = similar.length
    ? similar.map((y) => `<a href="${link(lang, 'letter-' + y.slug + '.html')}"><span class="ar" lang="ar">${y.c}</span> ${letterName(lang, y)}</a>`).join(ur ? '، ' : ', ')
    : (ur ? 'کوئی قریبی ملتا جلتا حرف نہیں۔' : 'No close look-alikes.');
  const C = ur ? {
    title: `عربی حرف ${x.c} (${x.ar}): تلفظ، شکلیں اور مثال | حرف`,
    desc: `عربی حرف ${x.c} (${x.ar}) سیکھیں: درست تلفظ، چاروں شکلیں اور آواز کے ساتھ مثال، اردو میں۔`,
    h1: `عربی حرف <span class="ar" lang="ar">${x.c}</span> (${x.ar})`,
    lead: `${fmt('{' + x.ar + '}')} عربی حروفِ تہجی کا حرف نمبر ${ud(i + 1)} ہے۔ اردو میں اسے «${x.ur}» کہتے ہیں۔`,
    sndH: 'تلفظ', snd: x.sndUr,
    formsH: 'چار شکلیں',
    join: x.joins
      ? `${fmt('{' + x.c + '}')} اپنے بعد والے حرف سے جڑتا ہے، اس لیے اس کی چار شکلیں ہیں۔ یہاں جوڑ کی جگہ لکیر (${fmt('{ـ}')}) سے دکھائی گئی ہے۔`
      : `${fmt('{' + x.c + '}')} اپنے بعد والے حرف سے کبھی نہیں جڑتا۔ اس کی شروع والی شکل اکیلی شکل جیسی ہے، اور اگلا حرف الگ سے شروع ہوتا ہے۔`,
    dotsH: 'پہچان', simH: 'ان سے الگ پہچانیں', exH: 'مثال', mean: x.wu,
    listenL: 'حرف سنیں', listenW: 'لفظ سنیں', learn: 'سیکھ لیا؟ نشان لگائیں',
    quiz: 'سارے حروف ہو گئے؟ کوئز دیں ←',
  } : {
    title: `Arabic letter ${x.en} (${x.c}): sound, shapes and example | Harf`,
    desc: `Learn the Arabic letter ${x.en} (${x.c}): how to pronounce it, its four shapes, and an example word with audio.`,
    h1: `The Arabic letter ${x.en} <span class="ar" lang="ar">${x.c}</span>`,
    lead: `${esc(x.en)} (${fmt('{' + x.ar + '}')}) is the ${ord(i + 1)} letter of the Arabic alphabet. It is pronounced <strong>${esc(x.tr)}</strong>.`,
    sndH: 'How to say it', snd: x.snd,
    formsH: 'Its four shapes',
    join: x.joins
      ? `${esc(x.en)} joins to the letter after it, so it has four shapes. The line (${fmt('{ـ}')}) shows where it connects to the letters around it.`
      : `${esc(x.en)} never joins to the letter after it. Its start shape is the same as its alone shape, and the next letter starts fresh.`,
    dotsH: 'How to spot it', simH: 'Don’t confuse it with', exH: 'Example word', mean: x.we,
    listenL: 'Hear the letter', listenW: 'Hear the word', learn: 'Mark as learned',
    quiz: 'Finished the alphabet? Take the quiz →',
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], ['alphabet.html', T[lang].nav.alphabet], [null, ur ? x.ur : x.en]])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
<div class="letter-top">
  <div class="big-letter ar" lang="ar">${x.c}</div>
  <div>
    <h2>${C.sndH}</h2>
    <p>${fmt(C.snd)}</p>
    <div class="row">
      ${say(lang, x.c, C.listenL)}
      ${say(lang, x.w, C.listenW)}
      <button class="btn" type="button" id="learn" data-slug="${x.slug}" aria-pressed="false">${C.learn}</button>
    </div>
  </div>
</div>
<section>
  <h2>${C.formsH}</h2>
  <div class="forms">${forms.map((f, k) => `<div><span class="ar" lang="ar">${f}</span><small>${labels[k]}</small></div>`).join('')}</div>
  <p class="note">${C.join}</p>
</section>
<section>
  <h2>${ur ? 'لکھنے کی مشق' : 'Practise writing'}</h2>
  <p class="note">${ur ? 'سرمئی حرف کے اوپر انگلی یا ماؤس سے لکھیں۔ عربی دائیں سے بائیں لکھی جاتی ہے۔' : 'Trace over the grey letter with your finger or mouse. Arabic is written from right to left.'}</p>
  <div class="trace" data-forms="${esc(forms.join('|'))}">
    <div class="chips" role="group" aria-label="${C.formsH}">${labels.map((l, k) => `<button class="chip" type="button" data-f="${k}" aria-pressed="${k === 0}">${l}</button>`).join('')}</div>
    <canvas class="pad" aria-label="${ur ? 'لکھنے کی جگہ' : 'Writing pad'}"></canvas>
    <div class="row"><button class="btn" type="button" data-act="clear">${ur ? 'صاف کریں' : 'Clear'}</button><button class="btn" type="button" data-act="guide" aria-pressed="true">${ur ? 'رہنما حرف چھپائیں' : 'Hide guide'}</button><a class="btn" href="${link(lang, 'writing.html')}?l=${x.slug}">${ur ? '🖨 پرنٹ کے لیے ورک شیٹ' : '🖨 Printable worksheet'}</a></div>
  </div>
</section>
<div class="facts">
  <div class="fact"><h3>${C.dotsH}</h3><p>${dotsText(lang, x.dots)}</p></div>
  <div class="fact"><h3>${C.simH}</h3><p>${simHtml}</p></div>
  <div class="fact"><h3>${C.exH}</h3><p class="example"><span class="ar" lang="ar">${x.w}</span><span><span class="latin">${esc(x.wt)}</span><br>${esc(C.mean)}</span></p></div>
</div>
<nav class="pager" aria-label="${ur ? 'حروف' : 'Letters'}">
  ${prev ? `<a class="btn" href="${link(lang, 'letter-' + prev.slug + '.html')}">${T[lang].prev}: <span class="ar" lang="ar">${prev.c}</span></a>` : '<span></span>'}
  ${next ? `<a class="btn" href="${link(lang, 'letter-' + next.slug + '.html')}">${T[lang].next.replace(/[→←]/, '').trim()}: <span class="ar" lang="ar">${next.c}</span> ${ur ? '←' : '→'}</a>` : `<a class="btn primary" href="${link(lang, 'quiz.html')}">${C.quiz}</a>`}
</nav>`;
  return layout(lang, { file: 'letter-' + x.slug + '.html', section: 'alphabet', title: C.title, desc: C.desc, body });
}

function writingPage(lang) {
  const ur = lang === 'ur';
  const lab = ur ? ['اکیلا', 'شروع میں', 'درمیان میں', 'آخر میں', 'اکیلا / شروع میں', 'آخر / درمیان میں'] : ['Alone', 'Start', 'Middle', 'End', 'Alone / start', 'End / middle'];
  const sections = LETTERS.map((x) => {
    const forms = x.joins ? [[x.c, lab[0]], [x.c + TW, lab[1]], [TW + x.c + TW, lab[2]], [TW + x.c, lab[3]]] : [[x.c, lab[4]], [TW + x.c, lab[5]]];
    const rows = forms.map(([f, l], k) => `<div class="ws-row f${k}"><span class="ws-label">${l}</span><div class="ws-cells" dir="rtl"><span class="ws-model ar" lang="ar">${f}</span>${`<span class="ws-trace ar" lang="ar">${f}</span>`.repeat(6)}</div></div>`).join('');
    return `<section class="ws" data-slug="${x.slug}"><h2 class="ws-h"><span class="ar" lang="ar">${x.c}</span> ${letterName(lang, x)}</h2>${rows}</section>`;
  }).join('\n');
  const opts = LETTERS.map((x) => `<option value="${x.slug}">${x.c}  ${letterName(lang, x)}</option>`).join('');
  const C = ur ? {
    title: 'عربی حروف لکھنے کی مشق: مفت پرنٹ ایبل ورک شیٹس | حرف', desc: 'عربی حروفِ تہجی کی مفت ٹریسنگ ورک شیٹس: پورے حروف یا کسی ایک حرف کی چاروں شکلیں پرنٹ کریں۔ بچوں اور بڑوں دونوں کے لیے۔',
    h1: 'عربی حروف لکھنے کی ورک شیٹس',
    lead: 'یہ صفحہ پرنٹ کریں اور سرمئی حروف کے اوپر قلم سے لکھیں۔ ہر سطر میں پہلا (گہرا) حرف نمونہ ہے؛ عربی دائیں سے بائیں لکھی جاتی ہے۔ کوئی ایک حرف چنیں تو اس کی چاروں شکلوں کی مشق ملے گی۔',
    pick: 'حرف', all: 'تمام حروف', print: '🖨 پرنٹ کریں', screen: 'اسکرین پر لکھنے کی مشق کے لیے کسی بھی حرف کا صفحہ کھولیں۔',
  } : {
    title: 'Arabic alphabet tracing worksheets: free and printable | Harf', desc: 'Free Arabic alphabet tracing worksheets. Print the whole alphabet, or all four shapes of one letter. For children and adults.',
    h1: 'Arabic letter tracing worksheets',
    lead: 'Print this page and trace over the grey letters with a pen. The first, darker letter in each row is the model; Arabic is written from right to left. Pick one letter to practise all four of its shapes.',
    pick: 'Letter', all: 'All letters', print: '🖨 Print', screen: 'To practise on screen, open any letter’s page and trace with your finger.',
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], ['alphabet.html', T[lang].nav.alphabet], [null, ur ? 'لکھنے کی مشق' : 'Writing practice']])}
<h1>${C.h1}</h1>
<p class="lead no-print">${C.lead}</p>
<div class="row no-print ws-controls">
  <label>${C.pick} <select id="wsel"><option value="">${C.all}</option>${opts}</select></label>
  <button class="btn primary" type="button" id="wprint">${C.print}</button>
</div>
<p class="note no-print">${C.screen}</p>
<div id="ws" class="ws-all">
${sections}
</div>`;
  return layout(lang, { file: 'writing.html', section: 'alphabet', title: C.title, desc: C.desc, body });
}

// ---------------------------------------------------------------- lesson pictures (original line drawings)
const ICONS = {
  book: '<path class="s" d="M14 12h30a6 6 0 0 1 6 6v34H20a6 6 0 0 1-6-6z"/><path d="M14 46a6 6 0 0 1 6-6h30"/><path class="g" d="M24 19h18v8H24z"/>',
  books: '<g transform="translate(-6 6) scale(.8)"><path class="s" d="M14 12h30a6 6 0 0 1 6 6v34H20a6 6 0 0 1-6-6z"/><path d="M14 46a6 6 0 0 1 6-6h30"/></g><g transform="translate(10 2) scale(.8)"><path class="s" d="M14 12h30a6 6 0 0 1 6 6v34H20a6 6 0 0 1-6-6z"/><path d="M14 46a6 6 0 0 1 6-6h30"/><path class="g" d="M24 19h18v8H24z"/></g><g transform="translate(24 10) scale(.6)"><path class="s" d="M14 12h30a6 6 0 0 1 6 6v34H20a6 6 0 0 1-6-6z"/><path d="M14 46a6 6 0 0 1 6-6h30"/></g>',
  pen: '<g transform="rotate(-40 32 32)"><rect class="s" x="27" y="6" width="10" height="38" rx="2"/><path class="g" d="M27 44h10l-5 11z"/><path d="M27 14h10"/></g>',
  penBroken: '<g transform="rotate(-40 32 32)"><path class="s" d="M27 6h10v16l-3 2-3-2-4 2z"/><path class="s" d="M27 30l4-2 3 2 3-2v16H27z"/><path class="g" d="M27 44h10l-5 11z"/></g>',
  house: '<path class="s" d="M13 30 32 14l19 16v22H13z"/><path d="M8 34 32 12l24 22"/><path class="g" d="M27 52V42a5 5 0 0 1 10 0v10z"/><rect x="17" y="34" width="7" height="7"/><rect x="40" y="34" width="7" height="7"/>',
  mosque: '<path class="s" d="M12 52V35h32v17z"/><path class="g" d="M14 35c0-9 6-14 14-18 8 4 14 9 14 18z"/><path d="M28 17v-5"/><circle cx="28" cy="10" r="1.6"/><rect class="s" x="48" y="20" width="7" height="32"/><path class="g" d="M47 20l4.5-9 4.5 9z"/><path class="g" d="M24 52v-7a4 4 0 0 1 8 0v7z"/><path d="M6 52h54"/>',
  door: '<rect class="s" x="18" y="8" width="28" height="47" rx="2"/><path d="M22 14h20v16H22zM22 35h20v16H22z" stroke-opacity=".5"/><circle class="g" cx="40" cy="33" r="2.6"/><path d="M10 55h44"/>',
  doorOpen: '<rect x="18" y="8" width="28" height="47" rx="1"/><path class="g" d="M19 9h26v45H19z" opacity=".35"/><path class="s" d="M18 8l13 5v47l-13-5z"/><circle class="g" cx="27" cy="35" r="1.8"/><path d="M10 55h44"/>',
  key: '<circle class="g" cx="19" cy="32" r="10"/><circle cx="19" cy="32" r="3.2"/><path d="M29 32h27M48 32v8M55 32v6"/>',
  desk: '<path class="s" d="M6 24h52v6H6z"/><path d="M11 30v24M53 30v24"/><rect class="s" x="34" y="30" width="16" height="14"/><path class="g" d="M38 36h8v3h-8z"/>',
  bed: '<path d="M8 20v34M56 36v18"/><path class="s" d="M8 38h48v9H8z"/><rect class="g" x="12" y="30" width="13" height="8" rx="3"/><path class="s" d="M27 33h29v5H27z"/>',
  chair: '<path class="s" d="M20 6h24v26H20z"/><path d="M26 13h12M26 19h12M26 25h12" stroke-opacity=".5"/><path class="g" d="M20 6h24v4H20z"/><path class="s" d="M14 32h36l-4 8H18z"/><path d="M18 40v16M46 40v16M23 40v11M41 40v11"/>',
  star: '<path class="g" d="M32 7l6.6 15.6 16.9 1.5-12.8 11.2 3.8 16.6L32 43.1l-14.5 8.8 3.8-16.6L8.5 24.1l16.9-1.5z"/>',
  moon: '<path class="g" d="M38 8a24 24 0 1 0 18 38A19 19 0 1 1 38 8z"/><circle class="g" cx="16" cy="14" r="1.5"/><circle class="g" cx="22" cy="24" r="1"/>',
  sun: '<circle class="g" cx="32" cy="32" r="11"/><path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M15 49l6-6M43 21l6-6"/>',
  mountain: '<path class="s" d="M3 54 24 18l12 18 7-9 18 27z"/><path class="g" d="M24 18l-6 10 6-3 6 3z"/><path class="g" d="M43 27l-4 5 4-1.5 4 1.5z"/>',
  cup: '<path class="s" d="M14 22h30l-3 30H17z"/><path d="M44 28h4a6 6 0 0 1 0 12h-6"/><path class="g" d="M16.4 28h25.2l-.7 7H17.1z"/><path d="M10 55h38"/>',
  tea: '<path class="s" d="M14 26h30l-3 26H17z"/><path d="M44 31h4a5 5 0 0 1 0 10h-5"/><path class="g" d="M16 31h26l-.6 6H16.6z"/><path d="M23 20c-2-3 2-5 0-9M31 20c-2-3 2-5 0-9M39 20c-2-3 2-5 0-9" stroke-opacity=".6"/><path d="M10 55h40"/>',
  cat: '<path class="s" d="M22 55c-7 0-9-9-7-17 1.5-6 6-10 6-10l-1-12 8 7h8l8-7-1 12s4.5 4 6 10c2 8 0 17-7 17z"/><circle class="g" cx="27" cy="29" r="2.2"/><circle class="g" cx="37" cy="29" r="2.2"/><path d="M32 33v2M29 36l3-1 3 1"/><path d="M42 53c9 1 13-5 10-11"/>',
  bag: '<rect class="s" x="12" y="22" width="40" height="32" rx="4"/><path d="M24 22v-6a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6"/><path class="g" d="M12 32h40v5H12z"/><path d="M30 34.5h4"/>',
  car: '<path class="s" d="M5 44v-9l7-3 7-11h24l9 11 7 3v9z"/><path d="M21 24l-5 8h14v-8zM34 24v8h15l-7-8z"/><circle class="g" cx="18" cy="45" r="5.5"/><circle class="g" cx="46" cy="45" r="5.5"/>',
  window: '<path class="s" d="M14 54V27a18 18 0 0 1 36 0v27z"/><path d="M32 9v45M14 34h36"/><path class="g" d="M10 54h44v4H10z"/>',
  tree: '<path d="M32 56V34M32 44l-6-6M32 40l6-6"/><circle class="s" cx="32" cy="24" r="16"/><circle class="g" cx="25" cy="22" r="2.6"/><circle class="g" cx="38" cy="28" r="2.6"/><circle class="g" cx="35" cy="15" r="2.6"/><path d="M20 56h24"/>',
  palm: '<path d="M33 56c-2-12-1-24 1-34"/><path class="s" d="M34 22c-8-6-18-5-24 1 8-1 16 0 24-1zM34 22c8-7 18-6 23 0-8-1-15 0-23 0zM34 22c-3-8-1-14 5-17-1 6-3 11-5 17zM34 22c-6 2-12 8-13 14 5-5 9-9 13-14zM34 22c6 2 11 7 12 13-4-5-8-9-12-13z"/><circle class="g" cx="32" cy="26" r="2.2"/><circle class="g" cx="36" cy="26" r="2.2"/><path d="M22 56h22"/>',
  man: '<path class="s" d="M19 57l3-25a10 10 0 0 1 20 0l3 25z"/><circle class="s" cx="32" cy="15" r="7.5"/><path class="g" d="M23.5 13a8.5 8.5 0 0 1 17 0v2h-17z"/><path class="g" d="M24 12h16v2.5H24z"/><path d="M32 30v14"/>',
  woman: '<path class="s" d="M18 57l4-24a10 10 0 0 1 20 0l4 24z"/><path class="g" d="M22.5 17a9.5 9.5 0 0 1 19 0v5c0 4-4.5 8-9.5 8s-9.5-4-9.5-8z"/><circle class="s" cx="32" cy="18" r="5.5"/>',
  boy: '<g transform="translate(8 15) scale(.75)"><path class="s" d="M19 57l3-25a10 10 0 0 1 20 0l3 25z"/><circle class="s" cx="32" cy="15" r="7.5"/><path class="g" d="M24.5 13a7.5 7.5 0 0 1 15 0z"/></g>',
  girl: '<g transform="translate(8 15) scale(.75)"><path class="s" d="M18 57l4-24a10 10 0 0 1 20 0l4 24z"/><path class="g" d="M22.5 17a9.5 9.5 0 0 1 19 0v5c0 4-4.5 8-9.5 8s-9.5-4-9.5-8z"/><circle class="s" cx="32" cy="18" r="5.5"/></g>',
  apple: '<path class="g" d="M32 22c-6-4-18-3-18 11 0 12 9 20 14 19 2 0 3-1 4-1s2 1 4 1c5 1 14-7 14-19 0-14-12-15-18-11z"/><path d="M32 22c0-5 2-9 6-11"/><path class="s" d="M34 16c4-4 9-3 10-1-3 3-7 3-10 1z"/>',
  plane: '<path class="s" d="M7 38l45-15c4-1.4 6 3.6 2 5.4L13 45z"/><path class="g" d="M27 31l-7-14h6l14 9z"/><path class="g" d="M25 41l5 12h5l1-15z"/><path class="g" d="M8 38l-3-9h4l6 6z"/>',
  ball: '<circle class="s" cx="32" cy="33" r="19"/><path class="g" d="M32 24l7 5-2.7 8h-8.6L25 29z"/><path d="M32 24v-10M39 29l9-4M36.3 37l6 7M27.7 37l-6 7M25 29l-9-4"/>',
  building: '<rect class="s" x="16" y="6" width="32" height="50"/><path d="M16 18h32M16 30h32M16 42h32" stroke-opacity=".45"/><path class="g" d="M16 18h32v12H16z" opacity=".55"/><rect x="21" y="9" width="6" height="6"/><rect x="37" y="9" width="6" height="6"/><rect x="21" y="21" width="6" height="6"/><rect x="37" y="21" width="6" height="6"/><rect x="21" y="33" width="6" height="6"/><rect x="37" y="33" width="6" height="6"/><path class="g" d="M28 56v-9h8v9z"/><path d="M8 56h48"/>',
  calendar: '<rect class="s" x="10" y="14" width="44" height="40" rx="4"/><path class="g" d="M10 18a4 4 0 0 1 4-4h36a4 4 0 0 1 4 4v7H10z"/><path d="M21 9v9M43 9v9"/><g stroke="none" fill="currentColor"><circle cx="18" cy="33" r="2"/><circle cx="27" cy="33" r="2"/><circle cx="36" cy="33" r="2"/><circle cx="45" cy="33" r="2"/><circle cx="18" cy="43" r="2"/><circle cx="27" cy="43" r="2"/><circle cx="45" cy="43" r="2"/></g><circle class="g" cx="36" cy="43" r="4"/>',
  paper: '<path class="s" d="M16 8h24l10 10v38H16z"/><path d="M40 8v10h10M22 28h22M22 36h22M22 44h14"/>',
  school: '<path class="s" d="M8 56V28h48v28z"/><path class="g" d="M4 30 32 12l28 18z"/><circle class="s" cx="32" cy="23" r="4"/><path class="g" d="M27 56V44h10v12z"/><rect x="13" y="35" width="8" height="8"/><rect x="43" y="35" width="8" height="8"/>',
  flower: '<path d="M32 56V34M32 46c-6 0-9-4-10-8 5 0 9 3 10 8zM32 42c6 0 9-4 10-8-5 0-9 3-10 8z"/><g class="g"><circle cx="32" cy="16" r="6"/><circle cx="42" cy="22" r="6"/><circle cx="38" cy="33" r="6"/><circle cx="26" cy="33" r="6"/><circle cx="22" cy="22" r="6"/></g><circle class="s" cx="32" cy="25" r="5"/>',
  food: '<path class="s" d="M6 40h52a26 13 0 0 1-52 0z"/><path class="g" d="M14 40c2-10 34-10 36 0z"/><path d="M24 30c-2-3 2-5 0-8M32 29c-2-3 2-5 0-8M40 30c-2-3 2-5 0-8" stroke-opacity=".6"/><path d="M4 54h56"/>',
  no: '<circle cx="50" cy="50" r="10" fill="#fff" stroke="var(--bad)" stroke-width="3"/><path d="M43 57l14-14" stroke="var(--bad)" stroke-width="3"/>',
  arrow: '<path d="M8 32h40M38 22l10 10-10 10" stroke-width="3"/>',
  kaaba: '<path d="M6 56h52" stroke-opacity=".5"/><path class="s" d="M12 22l20-7 20 7v28l-20 7-20-7z" style="fill:#1d2724"/><path d="M12 22l20 7 20-7M32 29v28" stroke="#3a4a44"/><path class="g" d="M12 28l20 7 20-7v5l-20 7-20-7z"/><path class="g" d="M37 42l6-2v11l-6 2z"/>',
  rain: '<path class="s" d="M17 40a9 9 0 0 1 1-18 13 13 0 0 1 25 1 8.5 8.5 0 0 1 3 17z"/><path d="M22 46l-3 7M32 46l-3 7M42 46l-3 7" stroke="#5b8fd6"/>',
  hand: '<path class="s" d="M20 56V30a4 4 0 0 1 8 0v-14a4 4 0 0 1 8 0v12a4 4 0 0 1 8 0v4a4 4 0 0 1 8 0v12c0 8-6 12-14 12H20z"/><path class="g" d="M14 10c0 4 4 4 4 8M8 16c0 4 4 4 4 8" stroke-opacity=".7"/>',
};
const clockIcon = (h, m) => {
  const a = (deg, len) => { const r = (deg - 90) * Math.PI / 180; return `${(32 + len * Math.cos(r)).toFixed(1)} ${(32 + len * Math.sin(r)).toFixed(1)}`; };
  const ticks = Array.from({ length: 12 }, (_, k) => `M${a(k * 30, 19)}L${a(k * 30, k % 3 ? 21 : 23)}`).join('');
  return `<circle class="g" cx="32" cy="32" r="26"/><circle class="s" cx="32" cy="32" r="22.5"/><path d="${ticks}"/><path d="M32 32L${a(((h % 12) + m / 60) * 30, 12)}" stroke-width="3.2"/><path d="M32 32L${a(m * 6, 17)}"/><circle cx="32" cy="32" r="2" fill="currentColor"/>`;
};
// A picture is a list of [icon, x, y, scale]; a string is one full-size icon.
function picSvg(spec) {
  const parts = typeof spec === 'string' ? [[spec, 0, 0, 1]] : spec;
  const inner = parts.map(([ic, x = 0, y = 0, k = 1]) => {
    let style = '';
    if (ic.includes('@')) { const [name, col] = ic.split('@'); ic = name; style = col.startsWith('g:') ? `--gfill:${col.slice(2)}` : `--fill:${col}`; }
    const body = ic.startsWith('clock:') ? clockIcon(...ic.slice(6).split(':').map(Number))
      : ic.startsWith('num:') ? `<g transform="translate(32 32)"><rect class="g" x="-21" y="-21" width="42" height="42"/><rect class="g" x="-21" y="-21" width="42" height="42" transform="rotate(45)"/><circle class="s" r="17"/></g><text x="32" y="${ic.length > 6 ? 39 : 41}" text-anchor="middle" font-family="Amiri, serif" font-weight="700" font-size="${ic.length > 6 ? 17 : 22}" fill="currentColor" stroke="none">${ic.slice(4)}</text>`
      : ICONS[ic];
    if (!body) throw new Error('missing icon ' + ic);
    const g = x || y || k !== 1 || style;
    return g ? `<g${x || y || k !== 1 ? ` transform="translate(${x} ${y}) scale(${k})"` : ''}${style ? ` style="${style}"` : ''}>${body}</g>` : body;
  }).join('');
  return `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
}
const two = (ic, k = .62) => [[ic, -4, 12, k], [ic, 26, 12, k]];
const three = (ic, k = .5) => [[ic, -2, 4, k], [ic, 30, 4, k], [ic, 14, 32, k]];
// [picture, Arabic, English, Urdu]
const LESSON_PICS = {
  'lesson-1-this-is': [['book', 'هٰذَا كِتَابٌ', 'This is a book.', 'یہ کتاب ہے۔'], ['pen', 'هٰذَا قَلَمٌ', 'This is a pen.', 'یہ قلم ہے۔'], ['house', 'هٰذَا بَيْتٌ', 'This is a house.', 'یہ گھر ہے۔'], ['mosque', 'هٰذَا مَسْجِدٌ', 'This is a mosque.', 'یہ مسجد ہے۔'], ['door', 'هٰذَا بَابٌ', 'This is a door.', 'یہ دروازہ ہے۔'], ['key', 'هٰذَا مِفْتَاحٌ', 'This is a key.', 'یہ چابی ہے۔'], ['desk', 'هٰذَا مَكْتَبٌ', 'This is a desk.', 'یہ میز ہے۔'], ['chair', 'هٰذَا كُرْسِيٌّ', 'This is a chair.', 'یہ کرسی ہے۔']],
  'lesson-2-that-is': [['star', 'ذٰلِكَ نَجْمٌ', 'That is a star.', 'وہ ستارہ ہے۔'], ['moon', 'ذٰلِكَ قَمَرٌ', 'That is a moon.', 'وہ چاند ہے۔'], ['mountain', 'ذٰلِكَ جَبَلٌ', 'That is a mountain.', 'وہ پہاڑ ہے۔'], ['mosque', 'ذٰلِكَ مَسْجِدٌ', 'That is a mosque.', 'وہ مسجد ہے۔']],
  'lesson-3-the': [['book', 'الْكِتَابُ جَدِيدٌ', 'The book is new.', 'کتاب نئی ہے۔'], ['penBroken', 'الْقَلَمُ مَكْسُورٌ', 'The pen is broken.', 'قلم ٹوٹا ہوا ہے۔'], ['doorOpen', 'الْبَابُ مَفْتُوحٌ', 'The door is open.', 'دروازہ کھلا ہے۔'], ['cup', 'الْمَاءُ بَارِدٌ', 'The water is cold.', 'پانی ٹھنڈا ہے۔']],
  'lesson-4-where': [[[['desk', 0, 8, 1], ['book', 8, 9, .4]], 'الْكِتَابُ عَلَى الْمَكْتَبِ', 'The book is on the desk.', 'کتاب میز پر ہے۔'], [[['chair', 0, 0, 1], ['cat', 19, 33, .42]], 'الْقِطُّ تَحْتَ الْكُرْسِيِّ', 'The cat is under the chair.', 'بلی کرسی کے نیچے ہے۔'], [[['bag', 0, 4, 1], ['pen', 10, -10, .55]], 'الْقَلَمُ فِي الْحَقِيبَةِ', 'The pen is in the bag.', 'قلم بستے میں ہے۔'], [[['house', 0, 0, 1], ['man', 34, 26, .45]], 'الْمُدَرِّسُ أَمَامَ الْبَيْتِ', 'The teacher is in front of the house.', 'استاد گھر کے سامنے ہیں۔']],
  'lesson-5-feminine': [['car', 'هٰذِهِ سَيَّارَةٌ', 'This is a car.', 'یہ گاڑی ہے۔'], ['clock:10:10', 'هٰذِهِ سَاعَةٌ', 'This is a clock.', 'یہ گھڑی ہے۔'], ['window', 'هٰذِهِ نَافِذَةٌ', 'This is a window.', 'یہ کھڑکی ہے۔'], ['bag', 'هٰذِهِ حَقِيبَةٌ', 'This is a bag.', 'یہ بستہ ہے۔'], ['tree', 'هٰذِهِ شَجَرَةٌ', 'This is a tree.', 'یہ درخت ہے۔'], ['apple', 'هٰذِهِ تُفَّاحَةٌ', 'This is an apple.', 'یہ سیب ہے۔']],
  'lesson-6-whose': [[[['car', 6, 10, .8], ['key', -6, -8, .55]], 'مِفْتَاحُ السَّيَّارَةِ', 'the car key', 'گاڑی کی چابی'], ['mosque', 'بَابُ الْمَسْجِدِ', 'the door of the mosque', 'مسجد کا دروازہ'], [[['man', -8, 4, .9], ['book', 30, 22, .5]], 'كِتَابُ الْمُدَرِّسِ', 'the teacher’s book', 'استاد کی کتاب'], [[['house', 0, 0, 1], ['key', 30, 34, .4]], 'لِمَنْ هٰذَا الْبَيْتُ؟', 'Whose is this house?', 'یہ گھر کس کا ہے؟']],
  'lesson-7-pronouns': [['boy', 'أَنَا طَالِبٌ', 'I am a student.', 'میں طالب علم ہوں۔'], ['man', 'هُوَ مُدَرِّسٌ', 'He is a teacher.', 'وہ استاد ہیں۔'], ['woman', 'هِيَ طَبِيبَةٌ', 'She is a doctor.', 'وہ ڈاکٹر ہیں۔'], [[['boy', -12, 0, 1], ['boy', 12, 0, 1]], 'نَحْنُ طُلَّابٌ', 'We are students.', 'ہم طالب علم ہیں۔']],
  'lesson-8-my-your': [['book', 'هٰذَا كِتَابِي', 'This is my book.', 'یہ میری کتاب ہے۔'], ['pen', 'هٰذَا قَلَمُكَ', 'This is your pen.', 'یہ تمہارا قلم ہے۔'], ['house', 'هٰذَا بَيْتُهُ', 'This is his house.', 'یہ اس کا گھر ہے۔'], ['car', 'هٰذِهِ سَيَّارَتُهَا', 'This is her car.', 'یہ اس کی گاڑی ہے۔']],
  'lesson-9-adjectives': [[[['house', -4, 4, .95], ['house', 40, 30, .4]], 'بَيْتٌ كَبِيرٌ وَبَيْتٌ صَغِيرٌ', 'a big house and a small house', 'بڑا گھر اور چھوٹا گھر'], ['car', 'سَيَّارَةٌ جَدِيدَةٌ', 'a new car', 'نئی گاڑی'], ['tea', 'شَايٌ حَارٌّ', 'hot tea', 'گرم چائے'], ['mountain', 'جَبَلٌ عَالٍ', 'a high mountain', 'اونچا پہاڑ']],
  'lesson-10-plurals': [['books', 'كُتُبٌ', 'books', 'کتابیں'], [three('pen', .55), 'أَقْلَامٌ', 'pens', 'قلم (جمع)'], [three('star'), 'نُجُومٌ', 'stars', 'ستارے'], [[['boy', -14, 0, 1], ['boy', 0, 0, 1], ['boy', 14, 0, 1]], 'هٰؤُلَاءِ طُلَّابٌ', 'These are students.', 'یہ طالب علم ہیں۔']],
  'lesson-11-past-tense': [[[['man', -12, 4, .85], ['arrow', 14, 0, .45], ['mosque', 30, 18, .55]], 'ذَهَبَ إِلَى الْمَسْجِدِ', 'He went to the mosque.', 'وہ مسجد گیا۔'], [[['paper', -4, 0, 1], ['pen', 18, 10, .7]], 'كَتَبَ الدَّرْسَ', 'He wrote the lesson.', 'اس نے سبق لکھا۔'], ['cup', 'شَرِبَ الْمَاءَ', 'He drank the water.', 'اس نے پانی پیا۔'], ['apple', 'أَكَلَ التُّفَّاحَةَ', 'He ate the apple.', 'اس نے سیب کھایا۔']],
  'lesson-12-present-tense': [['book', 'يَقْرَأُ الْكِتَابَ', 'He reads the book.', 'وہ کتاب پڑھتا ہے۔'], ['tea', 'يَشْرَبُ الشَّايَ', 'He drinks tea.', 'وہ چائے پیتا ہے۔'], [[['bed', 0, 8, 1], ['moon', 34, -2, .4]], 'يَنَامُ', 'He sleeps.', 'وہ سوتا ہے۔'], [[['paper', -4, 0, 1], ['pen', 18, 10, .7]], 'تَكْتُبُ الدَّرْسَ', 'She writes the lesson.', 'وہ سبق لکھتی ہے۔']],
  'lesson-13-i-have': [['car', 'عِنْدِي سَيَّارَةٌ', 'I have a car.', 'میرے پاس گاڑی ہے۔'], ['cat', 'عِنْدَنَا قِطٌّ', 'We have a cat.', 'ہمارے پاس بلی ہے۔'], ['key', 'عِنْدَهُ مِفْتَاحٌ', 'He has a key.', 'اس کے پاس چابی ہے۔'], ['bag', 'عِنْدَهَا حَقِيبَةٌ', 'She has a bag.', 'اس کے پاس بستہ ہے۔']],
  'lesson-14-laysa': [[[['key', 0, 0, 1], ['no', 0, 0, 1]], 'لَيْسَ هٰذَا قَلَمًا', 'This is not a pen.', 'یہ قلم نہیں ہے۔'], [[['door', 0, 0, 1], ['no', 0, 0, 1]], 'لَيْسَ الْبَابُ مَفْتُوحًا', 'The door is not open.', 'دروازہ کھلا نہیں ہے۔'], [[['cup', 0, 0, 1], ['no', 0, 0, 1]], 'لَيْسَ الْمَاءُ حَارًّا', 'The water is not hot.', 'پانی گرم نہیں ہے۔']],
  'lesson-15-dual': [[two('book'), 'كِتَابَانِ', 'two books', 'دو کتابیں'], [two('pen'), 'قَلَمَانِ', 'two pens', 'دو قلم'], [two('car', .55), 'سَيَّارَتَانِ', 'two cars', 'دو گاڑیاں'], [two('house'), 'بَيْتَانِ', 'two houses', 'دو گھر']],
  'lesson-16-counting': [[three('book'), 'ثَلَاثَةُ كُتُبٍ', 'three books', 'تین کتابیں'], [[['apple', -4, -2, .5], ['apple', 28, -2, .5], ['apple', -4, 30, .5], ['apple', 28, 30, .5]], 'أَرْبَعُ تُفَّاحَاتٍ', 'four apples', 'چار سیب'], [[['star', -2, -2, .42], ['star', 21, -2, .42], ['star', 42, -2, .42], ['star', 8, 30, .42], ['star', 32, 30, .42]], 'خَمْسَةُ نُجُومٍ', 'five stars', 'پانچ ستارے'], [[['boy', -14, 0, 1], ['boy', 14, 0, 1]], 'كَمْ طَالِبًا؟', 'How many students?', 'کتنے طالب علم؟']],
  'lesson-17-commands': [[[['paper', -4, 0, 1], ['pen', 18, 10, .7]], 'اُكْتُبْ', 'Write!', 'لکھو!'], ['book', 'اِقْرَأْ', 'Read!', 'پڑھو!'], ['doorOpen', 'اِفْتَحِ الْبَابَ', 'Open the door!', 'دروازہ کھولو!'], ['chair', 'اِجْلِسْ', 'Sit down!', 'بیٹھو!']],
  'lesson-18-future': [['plane', 'سَأُسَافِرُ بِالطَّائِرَةِ', 'I will travel by plane.', 'میں ہوائی جہاز سے سفر کروں گا۔'], ['bag', 'سَأَذْهَبُ إِلَى السُّوقِ', 'I will go to the market.', 'میں بازار جاؤں گا۔'], ['calendar', 'سَأَزُورُكَ غَدًا', 'I will visit you tomorrow.', 'میں کل تم سے ملنے آؤں گا۔'], [[['bed', 0, 8, 1], ['moon', 34, -2, .4]], 'سَيَنَامُ مُبَكِّرًا', 'He will sleep early.', 'وہ جلدی سوئے گا۔']],
  'lesson-19-did-not': [[[['tea', 0, 0, 1], ['no', 0, 0, 1]], 'لَمْ أَشْرَبِ الشَّايَ', 'I did not drink the tea.', 'میں نے چائے نہیں پی۔'], [[['paper', 0, 0, 1], ['no', 0, 0, 1]], 'لَمْ يَكْتُبِ الدَّرْسَ', 'He did not write the lesson.', 'اس نے سبق نہیں لکھا۔'], [[['apple', 0, 0, 1], ['no', 0, 0, 1]], 'لَمْ آكُلِ التُّفَّاحَةَ', 'I did not eat the apple.', 'میں نے سیب نہیں کھایا۔']],
  'lesson-20-questions': [['sun', 'كَيْفَ الْجَوُّ؟', 'How is the weather?', 'موسم کیسا ہے؟'], ['clock:1:30', 'مَتَى الصَّلَاةُ؟', 'When is the prayer?', 'نماز کب ہے؟'], ['books', 'كَمْ كِتَابًا عِنْدَكَ؟', 'How many books do you have?', 'تمہارے پاس کتنی کتابیں ہیں؟'], ['mosque', 'أَيْنَ الْمَسْجِدُ؟', 'Where is the mosque?', 'مسجد کہاں ہے؟']],
  'lesson-21-inna': [['sun', 'إِنَّ الْجَوَّ جَمِيلٌ', 'The weather is truly lovely.', 'یقیناً موسم خوشگوار ہے۔'], ['mosque', 'إِنَّ الْمَسْجِدَ كَبِيرٌ', 'The mosque is truly big.', 'یقیناً مسجد بڑی ہے۔'], ['book', 'إِنَّ الْكِتَابَ مُفِيدٌ', 'The book is truly useful.', 'یقیناً کتاب مفید ہے۔']],
  'lesson-22-comparing': [[[['mountain', -2, 0, 1], ['house', 40, 36, .32]], 'الْجَبَلُ أَكْبَرُ مِنَ الْبَيْتِ', 'The mountain is bigger than the house.', 'پہاڑ گھر سے بڑا ہے۔'], [[['plane', -2, -6, .7], ['car', 26, 30, .5]], 'الطَّائِرَةُ أَسْرَعُ مِنَ السَّيَّارَةِ', 'The plane is faster than the car.', 'ہوائی جہاز گاڑی سے تیز ہے۔'], [[['sun', -6, -2, .85], ['moon', 34, 30, .45]], 'الشَّمْسُ أَكْبَرُ مِنَ الْقَمَرِ', 'The sun is bigger than the moon.', 'سورج چاند سے بڑا ہے۔']],
  'lesson-23-alladhi': [[[['man', -10, 0, 1], ['book', 30, 26, .5]], 'الرَّجُلُ الَّذِي يَقْرَأُ', 'the man who is reading', 'وہ آدمی جو پڑھ رہا ہے'], [[['girl', -10, 0, 1], ['pen', 28, 24, .55]], 'الْبِنْتُ الَّتِي تَكْتُبُ', 'the girl who is writing', 'وہ لڑکی جو لکھ رہی ہے'], [[['car', 0, 0, 1], ['key', 38, 6, .35]], 'السَّيَّارَةُ الَّتِي اشْتَرَيْتُهَا', 'the car that I bought', 'وہ گاڑی جو میں نے خریدی']],
  'lesson-24-time': [['clock:3:0', 'السَّاعَةُ الثَّالِثَةُ', 'three o’clock', 'تین بجے'], ['clock:5:30', 'الْخَامِسَةُ وَالنِّصْفُ', 'half past five', 'ساڑھے پانچ'], ['clock:10:15', 'الْعَاشِرَةُ وَالرُّبْعُ', 'quarter past ten', 'سوا دس'], ['clock:7:45', 'الثَّامِنَةُ إِلَّا رُبْعًا', 'quarter to eight', 'پونے آٹھ']],
  'lesson-25-kaana': [['sun', 'كَانَ الْجَوُّ حَارًّا', 'The weather was hot.', 'موسم گرم تھا۔'], ['doorOpen', 'كَانَ الْبَابُ مَفْتُوحًا', 'The door was open.', 'دروازہ کھلا تھا۔'], ['school', 'كَانَتِ الْمَدْرَسَةُ مُغْلَقَةً', 'The school was closed.', 'اسکول بند تھا۔'], ['mosque', 'كُنْتُ فِي الْمَسْجِدِ', 'I was in the mosque.', 'میں مسجد میں تھا۔']],
  'lesson-26-lan': [[[['tea', 0, 0, 1], ['no', 0, 0, 1]], 'لَنْ أَشْرَبَ الشَّايَ', 'I will not drink the tea.', 'میں چائے نہیں پیوں گا۔'], [[['clock:8:0', 0, 0, 1], ['no', 0, 0, 1]], 'لَنْ أَتَأَخَّرَ', 'I will not be late.', 'میں دیر نہیں کروں گا۔'], [[['plane', 0, 0, 1], ['no', 0, 0, 1]], 'لَنْ أُسَافِرَ غَدًا', 'I will not travel tomorrow.', 'میں کل سفر نہیں کروں گا۔']],
  'lesson-27-dont': [[[['chair', 0, 0, 1], ['no', 0, 0, 1]], 'لَا تَجْلِسْ هُنَا', 'Don’t sit here.', 'یہاں نہ بیٹھو۔'], [[['window', 0, 0, 1], ['no', 0, 0, 1]], 'لَا تَفْتَحِ النَّافِذَةَ', 'Don’t open the window.', 'کھڑکی نہ کھولو۔'], [[['ball', 0, 0, 1], ['no', 0, 0, 1]], 'لَا تَلْعَبُوا هُنَا', 'Don’t play here.', 'یہاں مت کھیلو۔'], [[['door', 0, 0, 1], ['pen', 18, 14, .5], ['no', 0, 0, 1]], 'لَا تَكْتُبْ عَلَى الْبَابِ', 'Don’t write on the door.', 'دروازے پر نہ لکھو۔']],
  'lesson-28-ordinals-days': [['building', 'الطَّابِقُ الثَّالِثُ', 'the third floor', 'تیسری منزل'], ['book', 'الدَّرْسُ الْأَوَّلُ', 'the first lesson', 'پہلا سبق'], ['calendar', 'الْيَوْمُ يَوْمُ الْخَمِيسِ', 'Today is Thursday.', 'آج جمعرات ہے۔'], ['mosque', 'يَوْمُ الْجُمُعَةِ', 'Friday', 'جمعہ کا دن']],
  'lesson-29-abu-akhu': [[[['man', -10, 0, 1], ['boy', 14, 0, 1]], 'هٰذَا أَبُو خَالِدٍ', 'This is Khalid’s father.', 'یہ خالد کے والد ہیں۔'], [[['boy', -12, 0, 1], ['boy', 12, 0, 1]], 'هٰذَا أَخُوكَ', 'This is your brother.', 'یہ تمہارا بھائی ہے۔'], [[['man', -10, 0, 1], ['mosque', 26, 22, .55]], 'رَأَيْتُ أَبَاكَ فِي الْمَسْجِدِ', 'I saw your father in the mosque.', 'میں نے تمہارے والد کو مسجد میں دیکھا۔'], [[['man', -10, 0, 1], ['books', 26, 24, .55]], 'رَجُلٌ ذُو عِلْمٍ', 'a man of knowledge', 'علم والا آدمی']],
  'lesson-30-how-beautiful': [[[['palm', -10, 0, .9], ['flower', 30, 20, .6]], 'مَا أَجْمَلَ الْحَدِيقَةَ!', 'How beautiful the garden is!', 'باغ کتنا خوبصورت ہے!'], ['mountain', 'مَا أَكْبَرَ الْجَبَلَ!', 'How big the mountain is!', 'پہاڑ کتنا بڑا ہے!'], ['cup', 'مَا أَبْرَدَ الْمَاءَ!', 'How cold the water is!', 'پانی کتنا ٹھنڈا ہے!'], ['food', 'مَا أَطْيَبَ الطَّعَامَ!', 'How delicious the food is!', 'کھانا کتنا مزیدار ہے!']],

  'lesson-31-an': [['cup', 'أُرِيدُ أَنْ أَشْرَبَ', 'I want to drink.', 'میں پینا چاہتا ہوں۔'], ['plane', 'أُرِيدُ أَنْ أُسَافِرَ', 'I want to travel.', 'میں سفر کرنا چاہتا ہوں۔'], ['book', 'أُحِبُّ أَنْ أَقْرَأَ', 'I like to read.', 'مجھے پڑھنا پسند ہے۔'], [[['bed', 0, 8, 1], ['moon', 34, -2, .4]], 'يُرِيدُ أَنْ يَنَامَ', 'He wants to sleep.', 'وہ سونا چاہتا ہے۔']],
  'lesson-32-colours': [['car@#e05a4e', 'سَيَّارَةٌ حَمْرَاءُ', 'a red car', 'لال گاڑی'], ['pen@#5b8fd6', 'قَلَمٌ أَزْرَقُ', 'a blue pen', 'نیلا قلم'], ['book@#5fae7a', 'كِتَابٌ أَخْضَرُ', 'a green book', 'سبز کتاب'], ['apple@g:#f2cf3c', 'تُفَّاحَةٌ صَفْرَاءُ', 'a yellow apple', 'پیلا سیب'], ['bag@#2b2f2e', 'حَقِيبَةٌ سَوْدَاءُ', 'a black bag', 'کالا بستہ'], ['house@#ffffff', 'بَيْتٌ أَبْيَضُ', 'a white house', 'سفید گھر']],
  'lesson-33-numbers-11-100': [['num:١١', 'أَحَدَ عَشَرَ', 'eleven', 'گیارہ'], ['num:١٢', 'اثْنَا عَشَرَ', 'twelve', 'بارہ'], ['num:٢٠', 'عِشْرُونَ', 'twenty', 'بیس'], ['num:٢٥', 'خَمْسَةٌ وَعِشْرُونَ', 'twenty-five', 'پچیس'], ['num:١٠٠', 'مِائَةٌ', 'a hundred', 'سو'], ['calendar', 'ثَلَاثُونَ يَوْمًا', 'thirty days', 'تیس دن']],
  'lesson-34-before-after': [['hand', 'اِغْسِلْ يَدَيْكَ قَبْلَ الْأَكْلِ', 'Wash your hands before eating.', 'کھانے سے پہلے ہاتھ دھوؤ۔'], ['mosque', 'قَبْلَ الصَّلَاةِ', 'before the prayer', 'نماز سے پہلے'], ['tea', 'بَعْدَ الْغَدَاءِ', 'after lunch', 'دوپہر کے کھانے کے بعد'], ['calendar', 'بَعْدَ غَدٍ', 'the day after tomorrow', 'پرسوں']],
  'lesson-35-doer-done': [[[['man', -10, 0, 1], ['paper', 30, 24, .5]], 'كَاتِبٌ', 'a writer', 'لکھنے والا'], ['paper', 'مَكْتُوبٌ', 'written; a letter', 'لکھا ہوا؛ خط'], ['doorOpen', 'مَفْتُوحٌ', 'open (opened)', 'کھلا ہوا'], ['penBroken', 'مَكْسُورٌ', 'broken', 'ٹوٹا ہوا'], ['cup', 'مَشْرُوبٌ', 'a drink', 'مشروب'], ['chair', 'مَصْنُوعٌ مِنَ الْخَشَبِ', 'made of wood', 'لکڑی سے بنا ہوا']],
  'lesson-36-hijri-months': [['moon', 'الْهِلَالُ', 'the new crescent', 'نیا چاند'], [[['moon', -4, 0, .8], ['star', 34, 4, .4], ['star', 40, 30, .3]], 'رَمَضَانُ', 'Ramadan', 'رمضان'], ['kaaba', 'ذُو الْحِجَّةِ', 'Dhul-Hijjah, the month of Hajj', 'ذوالحجہ، حج کا مہینہ'], ['calendar', 'مُحَرَّمٌ أَوَّلُ شَهْرٍ', 'Muharram is the first month.', 'محرم پہلا مہینہ ہے۔']],
  "lesson-37-past-all": [[[["boy", -14, 0, 1], ["boy", 0, 0, 1], ["boy", 14, 0, 1], ["mosque", 36, 30, 0.45]], "ذَهَبُوا إِلَى الْمَسْجِدِ", "They went to the mosque.", "وہ سب مسجد گئے۔"], [[["girl", -14, 0, 1], ["girl", 8, 0, 1], ["paper", 38, 26, 0.45]], "كَتَبْنَ الدَّرْسَ", "They (f) wrote the lesson.", "انہوں نے (لڑکیوں نے) سبق لکھا۔"], ["food", "أَكَلْنَا الطَّعَامَ", "We ate the food.", "ہم نے کھانا کھایا۔"], [[["school", 0, 0, 1]], "خَرَجُوا مِنَ الْمَدْرَسَةِ", "They left the school.", "وہ اسکول سے نکلے۔"]],
  "lesson-38-present-all": [[[["boy", -14, 0, 1], ["boy", 0, 0, 1], ["boy", 14, 0, 1], ["ball", 36, 34, 0.4]], "يَلْعَبُونَ", "They are playing.", "وہ کھیل رہے ہیں۔"], [[["woman", -12, 0, 1], ["woman", 10, 0, 1], ["food", 30, 34, 0.45]], "يَطْبُخْنَ الطَّعَامَ", "They (f) are cooking.", "وہ کھانا پکا رہی ہیں۔"], ["tea", "نَشْرَبُ الشَّايَ", "We drink tea.", "ہم چائے پیتے ہیں۔"], [[["woman", -10, 0, 1], ["paper", 30, 24, 0.5]], "هِيَ تَكْتُبُ رِسَالَةً", "She is writing a letter.", "وہ خط لکھ رہی ہے۔"]],
  "lesson-39-passive": [[[["paper", -4, 0, 1], ["pen", 18, 10, 0.7]], "كُتِبَ الدَّرْسُ", "The lesson was written.", "سبق لکھا گیا۔"], ["doorOpen", "فُتِحَ الْبَابُ", "The door was opened.", "دروازہ کھولا گیا۔"], ["window", "فُتِحَتِ النَّافِذَةُ", "The window was opened.", "کھڑکی کھولی گئی۔"], [[["school", 0, 0, 1], ["no", 0, 0, 1]], "أُغْلِقَتِ الْمَدْرَسَةُ", "The school was closed.", "اسکول بند کر دیا گیا۔"]],
  "lesson-40-kull-baad": [["books", "كُلُّ الْكُتُبِ", "all the books", "سب کتابیں"], [[["apple", -4, 10, 0.55], ["apple", 26, 10, 0.55]], "بَعْضُ التُّفَّاحِ", "some of the apples", "کچھ سیب"], ["calendar", "كُلَّ يَوْمٍ", "every day", "ہر روز"], [[["boy", -14, 0, 1], ["boy", 0, 0, 1], ["boy", 14, 0, 1]], "كُلُّهُمْ طُلَّابٌ", "All of them are students.", "وہ سب طالب علم ہیں۔"]],
  "lesson-41-ya": [["boy", "يَا خَالِدُ", "Khalid!", "اے خالد!"], [[["man", -10, 0, 1], ["book", 30, 26, 0.5]], "يَا أُسْتَاذُ", "Teacher!", "استاد صاحب!"], [[["boy", -14, 0, 1], ["boy", 0, 0, 1], ["boy", 14, 0, 1]], "يَا أَيُّهَا الطُّلَّابُ", "O students!", "اے طلبہ!"], ["kaaba", "يَا رَبِّ", "O my Lord!", "اے میرے رب!"]],
  "lesson-42-illa": [[[["boy", -14, 0, 1], ["boy", 0, 0, 1], ["boy", 14, 0, 1], ["no", 0, 0, 1]], "حَضَرُوا إِلَّا خَالِدًا", "They came, except Khalid.", "خالد کے سوا سب آئے۔"], [[["apple", -4, -2, 0.5], ["apple", 28, -2, 0.5], ["apple", -4, 30, 0.5], ["apple", 28, 30, 0.5], ["no", 0, 0, 1]], "إِلَّا وَاحِدَةً", "except one", "ایک کے سوا"], ["book", "مَا عِنْدِي إِلَّا كِتَابٌ", "I have only a book.", "میرے پاس صرف ایک کتاب ہے۔"], ["calendar", "إِلَّا يَوْمَ الْجُمُعَةِ", "except on Friday", "جمعہ کے سوا"]],
  "lesson-43-sisters-of-inna": [[[["house", -4, 22, 0.55], ["tree", 22, 0, 1]], "الْبَيْتُ صَغِيرٌ لٰكِنَّ الشَّجَرَةَ كَبِيرَةٌ", "The house is small but the tree is big.", "گھر چھوٹا ہے لیکن درخت بڑا ہے۔"], ["moon", "كَأَنَّ الْقَمَرَ مِصْبَاحٌ", "As if the moon were a lamp.", "گویا چاند ایک چراغ ہے۔"], [[["bed", 0, 8, 1]], "لَعَلَّهُ مَرِيضٌ", "Perhaps he is ill.", "شاید وہ بیمار ہے۔"], ["car", "قَدِيمَةٌ لٰكِنَّهَا سَرِيعَةٌ", "Old, but fast.", "پرانی لیکن تیز۔"]],
  "lesson-44-sisters-of-kaana": [["cup@#d6ecff", "صَارَ الْمَاءُ ثَلْجًا", "The water became ice.", "پانی برف بن گیا۔"], ["sun", "أَصْبَحَ الْجَوُّ حَارًّا", "The weather became hot.", "موسم گرم ہو گیا۔"], [[["boy", -16, 0, 1], ["arrow", 18, 10, 0.45], ["man", 22, 0, 0.75]], "صَارَ الطِّفْلُ رَجُلًا", "The child became a man.", "بچہ مرد بن گیا۔"], ["doorOpen", "لَا يَزَالُ الْمَحَلُّ مَفْتُوحًا", "The shop is still open.", "دکان ابھی تک کھلی ہے۔"]],
  "lesson-45-hollow-verbs": [[[["man", -10, 0, 1], ["book", 30, 26, 0.5]], "قَالَ الْمُدَرِّسُ", "The teacher said…", "استاد نے کہا…"], ["palm", "يَبِيعُ التَّاجِرُ التَّمْرَ", "The merchant sells dates.", "تاجر کھجوریں بیچتا ہے۔"], [[["bed", 0, 8, 1], ["moon", 34, -2, 0.4]], "نِمْتُ مُبَكِّرًا", "I slept early.", "میں جلدی سو گیا۔"], ["mosque", "قُمْ لِلصَّلَاةِ", "Get up for the prayer.", "نماز کے لیے اٹھو۔"]],
  "lesson-46-defective-verbs": [[[["man", -12, 4, 0.85], ["arrow", 14, 0, 0.45], ["mosque", 30, 18, 0.55]], "مَشَيْتُ إِلَى الْمَسْجِدِ", "I walked to the mosque.", "میں پیدل مسجد گیا۔"], [[["key", 0, 0, 1], ["no", 0, 0, 1]], "نَسِيتُ مِفْتَاحِي", "I forgot my key.", "میں اپنی چابی بھول گیا۔"], ["house", "بَقِيتُ فِي الْبَيْتِ", "I stayed at home.", "میں گھر پر رہا۔"], ["kaaba", "يَدْعُو اللّٰهَ", "He prays to Allah.", "وہ اللہ سے دعا کرتا ہے۔"]],
  "lesson-47-masdar": [["book", "الْقِرَاءَةُ", "reading", "پڑھنا"], [[["paper", -4, 0, 1], ["pen", 18, 10, 0.7]], "الْكِتَابَةُ", "writing", "لکھنا"], [[["bed", 0, 8, 1], ["moon", 34, -2, 0.4]], "النَّوْمُ", "sleep", "نیند"], ["food", "الْأَكْلُ", "eating", "کھانا"], ["cup", "الشُّرْبُ", "drinking", "پینا"], ["ball", "اللَّعِبُ", "playing", "کھیلنا"]],
  "lesson-48-hal": [[[["boy", -14, 0, 1], ["arrow", 16, 8, 0.5]], "جَاءَ مُسْرِعًا", "He came in a hurry.", "وہ جلدی جلدی آیا۔"], ["girl", "رَجَعَتْ فَرِحَةً", "She came back happy.", "وہ خوش خوش واپس آئی۔"], [[["man", -12, 4, 0.85], ["arrow", 14, 0, 0.45], ["building", 34, 18, 0.45]], "ذَهَبْتُ مَاشِيًا", "I went on foot.", "میں پیدل گیا۔"], ["car", "جِئْتُ رَاكِبًا", "I came riding.", "میں سواری پر آیا۔"]],
  "lesson-49-form-2": [[[["man", -14, 0, 1], ["boy", 10, 0, 1], ["book", 36, 30, 0.4]], "عَلَّمَنِي أَبِي", "My father taught me.", "میرے والد نے مجھے سکھایا۔"], ["school", "يُدَرِّسُ فِي الْمَدْرَسَةِ", "He teaches at the school.", "وہ اسکول میں پڑھاتا ہے۔"], ["books", "رَتِّبْ كُتُبَكَ", "Arrange your books.", "اپنی کتابیں ترتیب سے رکھو۔"], ["tea", "قَدَّمَ لَنَا الْقَهْوَةَ", "He offered us coffee.", "اس نے ہمیں قہوہ پیش کیا۔"]],
  "lesson-50-form-4": [[[["paper", -4, 0, 1], ["arrow", 24, 14, 0.5]], "أَرْسَلْتُ رِسَالَةً", "I sent a letter.", "میں نے خط بھیجا۔"], ["door", "أَغْلِقِ الْبَابَ", "Close the door.", "دروازہ بند کرو۔"], [[["bag", 0, 10, 0.9], ["book", 14, -8, 0.5]], "أَخْرَجَ الْكِتَابَ", "He took out the book.", "اس نے کتاب نکالی۔"], ["mosque", "أَسْلَمَ", "He became Muslim.", "وہ مسلمان ہوا۔"]],
  "lesson-51-forms-5-6": [[[["boy", -12, 0, 1], ["book", 28, 24, 0.5]], "تَعَلَّمْتُ الْعَرَبِيَّةَ", "I learned Arabic.", "میں نے عربی سیکھی۔"], [[["man", -12, 0, 1], ["man", 12, 0, 1]], "تَكَلَّمْنَا", "We talked.", "ہم نے بات کی۔"], [[["boy", -14, 0, 1], ["boy", 0, 0, 1], ["boy", 14, 0, 1]], "تَعَاوَنَ الطُّلَّابُ", "The students cooperated.", "طلبہ نے تعاون کیا۔"], ["food", "تَنَاوَلْنَا الْعَشَاءَ", "We had dinner.", "ہم نے رات کا کھانا کھایا۔"]],
  "lesson-52-forms-8-10": [[[["boy", -14, 0, 1], ["boy", 0, 0, 1], ["boy", 14, 0, 1], ["building", 38, 22, 0.4]], "اِجْتَمَعَ الطُّلَّابُ", "The students gathered.", "طلبہ جمع ہوئے۔"], ["clock:4:0", "اِنْتَظِرْنِي", "Wait for me.", "میرا انتظار کرو۔"], ["car", "اِشْتَرَيْتُ سَيَّارَةً", "I bought a car.", "میں نے گاڑی خریدی۔"], [[["plane", -4, -4, 0.7], ["man", 24, 14, 0.7]], "اِسْتَقْبَلَنَا فِي الْمَطَارِ", "He welcomed us at the airport.", "اس نے ہوائی اڈے پر ہمارا استقبال کیا۔"]],
  "lesson-53-purpose": [[[["plane", -4, -4, 0.7], ["building", 30, 14, 0.6]], "جِئْتُ لِأَعْمَلَ", "I came to work.", "میں کام کرنے آیا۔"], ["mosque", "لِنُصَلِّيَ", "in order to pray", "نماز پڑھنے کے لیے"], ["book", "لِكَيْ تَتَعَلَّمَ", "so that you learn", "تاکہ تم سیکھو"], ["bag", "لِيَشْتَرُوا طَعَامًا", "to buy food", "کھانا خریدنے کے لیے"]],
  "lesson-54-diptotes": [["kaaba", "فِي مَكَّةَ", "in Makkah", "مکہ میں"], [[["mosque", -2, 4, 0.5], ["mosque", 30, 4, 0.5], ["mosque", 14, 32, 0.5]], "مَسَاجِدُ", "mosques", "مسجدیں"], [[["key", -2, 4, 0.5], ["key", 30, 4, 0.5], ["key", 14, 32, 0.5]], "مَفَاتِيحُ", "keys", "چابیاں"], [[["school", -2, 4, 0.5], ["school", 30, 4, 0.5], ["school", 14, 32, 0.5]], "مَدَارِسُ", "schools", "مدرسے"]],
  "lesson-55-qad": [["mosque", "قَدْ قَامَتِ الصَّلَاةُ", "The prayer has begun.", "نماز کھڑی ہو چکی ہے۔"], ["rain", "قَدْ يَنْزِلُ الْمَطَرُ", "It may rain.", "بارش ہو سکتی ہے۔"], [[["paper", -4, 0, 1], ["star", 26, 26, 0.5]], "لَقَدْ نَجَحْتُ", "I really did pass!", "میں کامیاب ہو گیا!"], [[["man", -12, 0, 1], ["man", 12, 0, 1]], "قَدْ وَصَلَ الضُّيُوفُ", "The guests have arrived.", "مہمان پہنچ چکے ہیں۔"]],
  "lesson-56-conditions": [[[["rain", -4, -6, 0.7], ["house", 22, 22, 0.6]], "إِذَا نَزَلَ الْمَطَرُ", "If it rains…", "اگر بارش ہوئی…"], [[["bed", 0, 8, 1], ["moon", 34, -2, 0.4]], "إِذَا تَعِبْتَ فَنَمْ", "If you get tired, sleep.", "اگر تھک جاؤ تو سو جاؤ۔"], [[["book", -4, 0, 1], ["star", 30, 28, 0.45]], "إِنْ تَدْرُسْ تَنْجَحْ", "If you study, you will succeed.", "اگر تم پڑھو گے تو کامیاب ہو گے۔"], ["kaaba", "لَوْ كَانَ عِنْدِي مَالٌ لَحَجَجْتُ", "If I had money, I would perform Hajj.", "اگر میرے پاس پیسہ ہوتا تو میں حج کرتا۔"]],
  "lesson-57-doubled-verbs": [[[["paper", -4, 0, 1], ["arrow", 24, 14, 0.5]], "رَدَدْتُ عَلَى رِسَالَتِهِ", "I replied to his letter.", "میں نے اس کے خط کا جواب دیا۔"], ["num:١٢٣", "عَدَدْتُ النُّقُودَ", "I counted the money.", "میں نے پیسے گنے۔"], ["hand", "مَدَّ يَدَهُ", "He held out his hand.", "اس نے ہاتھ بڑھایا۔"], [[["man", -12, 4, 0.85], ["arrow", 14, 0, 0.45], ["mosque", 30, 18, 0.55]], "دُلَّنِي عَلَى الطَّرِيقِ", "Show me the way.", "مجھے راستہ بتاؤ۔"]],
  "lesson-58-hamza-verbs": [[[["boy", -12, 0, 1], ["man", 12, 0, 1]], "سَأَلْتُ الْمُدَرِّسَ", "I asked the teacher.", "میں نے استاد سے پوچھا۔"], ["food", "كُلْ بِيَمِينِكَ", "Eat with your right hand.", "دائیں ہاتھ سے کھاؤ۔"], [[["book", -4, -4, 0.8], ["hand", 22, 18, 0.6]], "خُذْ هٰذَا الْكِتَابَ", "Take this book.", "یہ کتاب لے لو۔"], ["palm", "آكُلُ التَّمْرَ", "I eat dates.", "میں کھجور کھاتا ہوں۔"]],
  "lesson-59-dual-verbs": [[[["boy", -14, 0, 1], ["boy", 8, 0, 1], ["book", 36, 30, 0.4]], "الطَّالِبَانِ يَدْرُسَانِ", "The two students are studying.", "دونوں طالب علم پڑھ رہے ہیں۔"], [[["girl", -14, 0, 1], ["girl", 8, 0, 1], ["paper", 38, 26, 0.45]], "الْبِنْتَانِ كَتَبَتَا", "The two girls wrote.", "دونوں لڑکیوں نے لکھا۔"], [[["man", -12, 0, 1], ["man", 12, 0, 1]], "هُمَا أَخَوَانِ", "They are two brothers.", "وہ دونوں بھائی ہیں۔"], [[["chair", -4, 10, 0.6], ["chair", 28, 10, 0.6]], "اِجْلِسَا هُنَا", "Sit here, you two.", "تم دونوں یہاں بیٹھو۔"]],
  "lesson-60-place-tool-nouns": [["mosque", "مَسْجِدٌ", "a mosque (place of prostration)", "مسجد (سجدے کی جگہ)"], ["desk", "مَكْتَبٌ", "a desk, an office", "میز، دفتر"], ["key", "مِفْتَاحٌ", "a key (opener)", "چابی (کھولنے کا آلہ)"], ["plane", "مَطَارٌ", "an airport (place of flying)", "ہوائی اڈا (اڑنے کی جگہ)"], ["school", "مَدْرَسَةٌ", "a school (place of study)", "مدرسہ (پڑھنے کی جگہ)"], ["ball", "مَلْعَبٌ", "a playground (place of play)", "کھیل کا میدان"]],
  "lesson-61-forms-3-7": [["plane", "سَافَرَ أَبِي", "My father travelled.", "میرے والد نے سفر کیا۔"], [[["man", -10, 0, 1], ["boy", 14, 0, 1]], "سَاعَدَ الْأَبُ ابْنَهُ", "The father helped his son.", "باپ نے اپنے بیٹے کی مدد کی۔"], ["ball", "نُشَاهِدُ الْمُبَارَاةَ", "We are watching the match.", "ہم میچ دیکھ رہے ہیں۔"], ["penBroken", "اِنْكَسَرَ الْقَلَمُ", "The pen broke.", "قلم ٹوٹ گیا۔"], ["doorOpen", "اِنْفَتَحَ الْبَابُ", "The door came open.", "دروازہ کھل گیا۔"]],
  "lesson-62-waw-verbs": [["plane", "وَصَلَتِ الطَّائِرَةُ", "The plane arrived.", "جہاز پہنچ گیا۔"], ["key", "وَجَدْتُ الْمِفْتَاحَ", "I found the key.", "مجھے چابی مل گئی۔"], [[["desk", 0, 8, 1], ["book", 8, 9, .4]], "ضَعِ الْكِتَابَ عَلَى الْمَكْتَبِ", "Put the book on the desk.", "کتاب میز پر رکھو۔"], ["hand", "قِفْ!", "Stop!", "رکو!"], ["car", "أَيْنَ الْمَوْقِفُ؟", "Where is the car park?", "پارکنگ کہاں ہے؟"]],
  "lesson-63-la-none-at-all": [[[["cup", 0, 0, 1], ["no", 0, 0, 1]], "لَا مَاءَ فِي الْكَأْسِ", "There is no water in the glass.", "گلاس میں بالکل پانی نہیں۔"], [[["car", 0, 0, 1], ["no", 0, 0, 1]], "لَا سَيَّارَةَ فِي الشَّارِعِ", "There is no car in the street.", "سڑک پر کوئی گاڑی نہیں۔"], [[["school", 0, 0, 1], ["no", 0, 0, 1]], "لَا طَالِبَ فِي الْمَدْرَسَةِ", "There is no student at the school.", "اسکول میں کوئی طالب علم نہیں۔"], ["book", "لَا رَيْبَ فِيهِ", "There is no doubt in it.", "اس میں کوئی شک نہیں۔"]],
  "lesson-64-nationality": [["man", "أَنَا بَاكِسْتَانِيٌّ", "I am Pakistani.", "میں پاکستانی ہوں۔"], ["woman", "هِيَ سُعُودِيَّةٌ", "She is Saudi.", "وہ سعودی ہیں۔"], ["book", "كِتَابٌ عَرَبِيٌّ", "an Arabic book", "عربی کتاب"], ["food", "طَعَامٌ هِنْدِيٌّ", "Indian food", "ہندوستانی کھانا"], ["calendar", "التَّقْوِيمُ الْهِجْرِيُّ", "the Hijri calendar", "ہجری کیلنڈر"]],
  "lesson-65-let-him": [["mosque", "لِنَذْهَبْ إِلَى الْمَسْجِدِ", "Let’s go to the mosque.", "آؤ مسجد چلیں۔"], ["food", "لِنَأْكُلْ", "Let’s eat.", "آؤ کھانا کھائیں۔"], ["book", "لِنَقْرَأْ", "Let’s read.", "آؤ پڑھیں۔"], ["doorOpen", "لِيَدْخُلِ الطُّلَّابُ", "Let the students come in.", "طلبہ اندر آ جائیں۔"], [[["girl", -10, 0, 1], ["chair", 26, 22, .55]], "لِتَجْلِسْ هُنَا", "Let her sit here.", "وہ یہاں بیٹھ جائیں۔"]],
  "lesson-66-tamyiz": [[[["man", -10, 0, 1], ["boy", 14, 0, 1]], "أَبِي أَكْبَرُ مِنِّي سِنًّا", "My father is older than me.", "میرے والد عمر میں مجھ سے بڑے ہیں۔"], [[["paper", -4, 0, 1], ["pen", 18, 10, .7]], "هُوَ أَحْسَنُ مِنِّي خَطًّا", "His handwriting is better than mine.", "اس کی لکھائی مجھ سے اچھی ہے۔"], ["sun", "الصَّيْفُ أَشَدُّ حَرًّا", "Summer is hotter.", "گرمیاں زیادہ گرم ہوتی ہیں۔"], ["cup", "اِمْتَلَأَ الْكَأْسُ مَاءً", "The glass filled with water.", "گلاس پانی سے بھر گیا۔"], ["books", "ثَلَاثُونَ كِتَابًا", "thirty books", "تیس کتابیں"]],
  "lesson-67-absolute-object": [[[["bed", 0, 8, 1], ["moon", 34, -2, .4]], "نِمْتُ نَوْمًا عَمِيقًا", "I slept deeply.", "میں گہری نیند سویا۔"], [[["man", -12, 4, .85], ["arrow", 14, 0, .45]], "مَشَى مَشْيًا سَرِيعًا", "He walked quickly.", "وہ تیز تیز چلا۔"], ["hand", "شُكْرًا جَزِيلًا", "Thank you very much.", "بہت بہت شکریہ۔"], ["flower", "جَمِيلٌ جِدًّا", "very beautiful", "بہت خوبصورت"]],
  "lesson-68-reason-word": [[[["boy", -12, 0, 1], ["man", 12, 0, 1]], "قُمْتُ احْتِرَامًا لِلْمُعَلِّمِ", "I stood up out of respect for the teacher.", "میں استاد کے احترام میں کھڑا ہوا۔"], [[["plane", -4, -6, .7], ["books", 26, 26, .55]], "سَافَرَ طَلَبًا لِلْعِلْمِ", "He travelled to seek knowledge.", "اس نے علم کی تلاش میں سفر کیا۔"], [[["boy", 0, 0, 1], ["cat", 32, 30, .45]], "بَكَى الطِّفْلُ خَوْفًا", "The child cried out of fear.", "بچہ ڈر کے مارے رویا۔"], ["moon", "صُمْتُ رَغْبَةً فِي الْأَجْرِ", "I fasted hoping for the reward.", "میں نے اجر کی امید میں روزہ رکھا۔"]],
  "lesson-69-nima-bisa": [["book", "نِعْمَ الصَّدِيقُ الْكِتَابُ", "What an excellent friend a book is!", "کتاب کیا ہی اچھا دوست ہے!"], ["cup", "نِعْمَ الْمَشْرُوبُ الْمَاءُ", "What an excellent drink water is!", "پانی کیا ہی عمدہ مشروب ہے!"], [[["boy", -10, 0, 1], ["book", 30, 24, .5]], "نِعْمَ الطَّالِبُ أَحْمَدُ", "What an excellent student Ahmad is!", "احمد کیا ہی اچھا طالب علم ہے!"], [[["bed", 0, 8, 1], ["clock:11:0", 34, -4, .4]], "بِئْسَتِ الْعَادَةُ الْكَسَلُ", "What a bad habit laziness is!", "سستی کیا ہی بری عادت ہے!"]],
  "lesson-70-almost-began": [["rain", "بَدَأَ الْمَطَرُ يَنْزِلُ", "The rain began to fall.", "بارش ہونے لگی۔"], [[["paper", -4, 0, 1], ["pen", 18, 10, .7]], "بَدَأَ يَكْتُبُ", "He started writing.", "وہ لکھنے لگا۔"], ["plane", "كَادَتِ الطَّائِرَةُ تُقْلِعُ", "The plane was about to take off.", "جہاز اڑنے ہی والا تھا۔"], ["calendar", "كِدْتُ أَنْسَى الْمَوْعِدَ", "I almost forgot the appointment.", "میں ملاقات کا وقت بھولنے ہی والا تھا۔"]],
  "lesson-71-two-objects": [[[["hand", -6, 6, .85], ["apple", 26, -4, .5]], "أَعْطَيْتُ الْوَلَدَ تُفَّاحَةً", "I gave the boy an apple.", "میں نے لڑکے کو سیب دیا۔"], ["door", "وَجَدْتُ الْبَابَ مُغْلَقًا", "I found the door closed.", "میں نے دروازہ بند پایا۔"], ["paper", "ظَنَنْتُ الدَّرْسَ سَهْلًا", "I thought the lesson was easy.", "میں نے سبق کو آسان سمجھا۔"], [[["man", -10, 0, 1], ["boy", 14, 0, 1]], "سَمَّيْتُ ابْنِي مُحَمَّدًا", "I named my son Muhammad.", "میں نے اپنے بیٹے کا نام محمد رکھا۔"]],
  "lesson-72-diminutive": [[[["mountain", -4, 0, .95], ["mountain", 38, 34, .4]], "جَبَلٌ وَجُبَيْلٌ", "a mountain and a hill", "پہاڑ اور پہاڑی"], [[["book", -4, 4, .95], ["book", 38, 32, .4]], "كِتَابٌ وَكُتَيِّبٌ", "a book and a booklet", "کتاب اور کتابچہ"], [[["tree", -4, 0, .95], ["tree", 38, 32, .45]], "شَجَرَةٌ وَشُجَيْرَةٌ", "a tree and a shrub", "درخت اور جھاڑی"], [[["man", -10, 0, 1], ["boy", 14, 0, 1]], "يَا بُنَيَّ", "My dear son!", "میرے پیارے بیٹے!"], ["clock:5:45", "قُبَيْلَ الْمَغْرِبِ", "just before Maghrib", "مغرب سے ذرا پہلے"]],
  "lesson-73-broken-plurals": [[three("pen", .55), "أَقْلَامٌ", "pens", "قلم (جمع)"], [three("house"), "بُيُوتٌ", "houses", "گھر (جمع)"], [[["man", -14, 0, 1], ["man", 0, 0, 1], ["man", 14, 0, 1]], "رِجَالٌ", "men", "آدمی (جمع)"], [two("mountain"), "جِبَالٌ", "mountains", "پہاڑ (جمع)"], [three("key"), "مَفَاتِيحُ", "keys", "چابیاں"], [three("tree"), "أَشْجَارٌ", "trees", "درخت (جمع)"]],
  "lesson-74-when-while-since": [[[["bed", 0, 8, 1], ["moon", 34, -2, .4]], "عِنْدَمَا وَصَلْتُ نِمْتُ", "When I arrived, I slept.", "جب میں پہنچا تو سو گیا۔"], [[["tea", -2, 4, .8], ["sun", 30, -4, .5]], "أَشْرَبُ الشَّايَ عِنْدَمَا أَسْتَيْقِظُ", "I drink tea when I wake up.", "جب میں جاگتا ہوں تو چائے پیتا ہوں۔"], ["book", "بَيْنَمَا كُنْتُ أَقْرَأُ", "while I was reading", "جب میں پڑھ رہا تھا"], ["calendar", "مُنْذُ سَنَةٍ", "for a year", "ایک سال سے"], ["sun", "مُنْذُ الصَّبَاحِ", "since the morning", "صبح سے"]],
  "lesson-75-hatta": [[[["sun", -6, -2, .7], ["arrow", 14, 14, .4], ["moon", 34, 30, .45]], "مِنَ الصَّبَاحِ حَتَّى الْمَسَاءِ", "from morning until evening", "صبح سے شام تک"], [[["man", -12, 4, .85], ["arrow", 14, 0, .45], ["house", 30, 18, .55]], "مَشَيْنَا حَتَّى وَصَلْنَا", "We walked until we arrived.", "ہم چلتے رہے یہاں تک کہ پہنچ گئے۔"], ["book", "اُدْرُسْ حَتَّى تَنْجَحَ", "Study so that you pass.", "پڑھو تاکہ کامیاب ہو جاؤ۔"], ["calendar", "حَتَّى يَوْمِ الْجُمُعَةِ", "until Friday", "جمعہ تک"]],
  "lesson-76-whoever-whatever": [[[["boy", -10, 0, 1], ["book", 30, 24, .5]], "مَنْ يَدْرُسْ يَنْجَحْ", "Whoever studies will succeed.", "جو پڑھے گا وہ کامیاب ہو گا۔"], ["tree", "مَا تَزْرَعْ تَحْصُدْ", "Whatever you sow, you will reap.", "جو بوؤ گے وہی کاٹو گے۔"], [[["man", -12, 0, 1], ["man", 12, 0, 1]], "أَيْنَمَا تَذْهَبْ أَذْهَبْ مَعَكَ", "Wherever you go, I’ll go with you.", "تم جہاں جاؤ گے میں تمہارے ساتھ جاؤں گا۔"], [[["house", 0, 0, 1], ["man", 34, 26, .45]], "كُلَّمَا زُرْتُهُ فَرِحَ", "Every time I visit him, he is happy.", "میں جب بھی اس سے ملنے جاتا ہوں وہ خوش ہوتا ہے۔"]],
  "lesson-77-himself-all-both": [["man", "جَاءَ الْمُدِيرُ نَفْسُهُ", "The manager himself came.", "مینیجر خود آئے۔"], ["food", "طَبَخْتُ الطَّعَامَ بِنَفْسِي", "I cooked the food myself.", "میں نے کھانا خود پکایا۔"], ["book", "قَرَأْتُ الْكِتَابَ كُلَّهُ", "I read the whole book.", "میں نے پوری کتاب پڑھی۔"], [[["boy", -12, 0, 1], ["boy", 12, 0, 1]], "نَجَحَ الطَّالِبَانِ كِلَاهُمَا", "Both students passed.", "دونوں طالب علم کامیاب ہوئے۔"], ["calendar", "فِي نَفْسِ الْيَوْمِ", "on the same day", "اسی دن"]],
  "lesson-78-oaths-anna": [["hand", "وَاللّٰهِ لَأُسَاعِدَنَّكَ", "By Allah, I will surely help you.", "اللہ کی قسم، میں ضرور تمہاری مدد کروں گا۔"], ["calendar", "لَأَزُورَنَّكَ غَدًا", "I will surely visit you tomorrow.", "میں کل ضرور تم سے ملنے آؤں گا۔"], [[["paper", -4, 0, 1], ["pen", 18, 10, .7]], "لَأَكْتُبَنَّ", "I will surely write.", "میں ضرور لکھوں گا۔"], [[["boy", -8, 0, 1], ["star", 30, -2, .45]], "لَيَنْجَحَنَّ الْمُجْتَهِدُ", "The hard worker will surely succeed.", "محنتی ضرور کامیاب ہو گا۔"]],
};
function picBoard(lang, slug) {
  const items = LESSON_PICS[slug];
  if (!items) return '';
  const ur = lang === 'ur';
  return `<section>
  <h2>${ur ? 'تصویروں سے سیکھیں' : 'Learn with pictures'}</h2>
  <p class="note">${ur ? 'تصویر پر ٹیپ کریں اور جملہ سنیں۔' : 'Tap a picture to hear the sentence.'}</p>
  <div class="pics">
  ${items.map(([p, a, en, u]) => `<button class="pic" type="button" data-say="${esc(a)}">${picSvg(p)}<span class="ar" lang="ar">${a}</span><span class="mean">${esc(ur ? u : en)}</span></button>`).join('\n  ')}
  </div>
</section>`;
}

function lessonsPage(lang) {
  const ur = lang === 'ur';
  const item = (l, i) => `<li><a href="${link(lang, l.slug + '.html')}"><span class="num">${num(lang, i + 1)}</span><span><strong>${fmt(l[lang].title)}</strong><p>${fmt(l[lang].short)}</p></span><span class="ar" lang="ar">${l.key}</span></a></li>`;
  const parts = ur
    ? [[0, 8, 'حصہ اول: پہلے جملے'], [8, 16, 'حصہ دوم: صفت، گنتی اور روزمرہ کے افعال'], [16, 24, 'حصہ سوم: حکم، مستقبل، وجہ اور وقت'], [24, 32, 'حصہ چہارم: تھا، نہیں کرے گا، نہی، تعجب، خواہش اور رنگ'], [32, 36, 'حصہ پنجم: بڑی گنتی، پہلے اور بعد، اوزان اور اسلامی مہینے'], [36, 42, 'حصہ ششم: پوری گردان، مجہول، کل و بعض، ندا اور استثناء'], [42, 48, 'حصہ ہفتم: إنّ اور کان کی بہنیں، معتل افعال، مصدر اور حال'], [48, 54, 'حصہ ہشتم: مزید فیہ کے ابواب، مقصد اور غیر منصرف'], [54, 60, 'حصہ نہم: قد، شرط، مضاعف و مہموز، تثنیہ اور اسمِ ظرف و آلہ'], [60, 66, 'حصہ دہم: مفاعلہ و انفعال، مثال واوی، لائے نفیِ جنس، نسبت، لامِ امر اور تمییز'], [66, 72, 'حصہ یازدہم: مفعولِ مطلق و مفعولٌ لہ، مدح و ذم، افعالِ مقاربہ، دو مفعول اور تصغیر'], [72, 78, 'حصہ دوازدہم: جمعِ مکسر، جب اور جبکہ، حتّیٰ، اسمائے شرط، تاکید اور قسم']]
    : [[0, 8, 'Part 1: First sentences'], [8, 16, 'Part 2: Describing, counting and everyday verbs'], [16, 24, 'Part 3: Instructions, the future, reasons and time'], [24, 32, 'Part 4: Was, will not, don’t, wonder, wanting and colours'], [32, 36, 'Part 5: Big numbers, before and after, word patterns and the Islamic months'], [36, 42, 'Part 6: Full verb tables, the passive, every and some, calling and except'], [42, 48, 'Part 7: Sisters of inna and kaana, weak verbs, verbal nouns and state'], [48, 54, 'Part 8: Verb forms II to X, purpose and words without tanween'], [54, 60, 'Part 9: Qad, conditions, special verbs, the dual and place and tool words'], [60, 66, 'Part 10: Forms III and VII, w-verbs, “none at all”, nationalities, “let him” and clarifying words'], [66, 72, 'Part 11: How and why words, praise and blame, almost and began, two objects and little words'], [72, 78, 'Part 12: Broken plurals, when and while, until, whoever, emphasis and oaths']];
  const list = parts.filter(([a]) => a < LESSONS.length).map(([a, b, h], k) => `<h2 class="part-h">${h}</h2>
<ol class="lesson-list">
  ${LESSONS.slice(a, k === parts.length - 1 ? LESSONS.length : b).map((l, i) => item(l, a + i)).join('\n  ')}
</ol>`).join('\n');
  const C = ur ? {
    title: 'ابتدائی عربی گرامر کے اسباق | حرف', desc: `اردو میں عربی گرامر کے ${ud(LESSONS.length)} ابتدائی اسباق: هٰذَا، الـ، حروفِ جر، مذکر و مؤنث، اضافت، ضمیریں، صفت، جمع، ماضی، مضارع، امر، مستقبل، گنتی اور وقت، مثالوں اور آواز کے ساتھ۔`,
    h1: 'ابتدائی عربی گرامر کے اسباق',
    lead: `${num(lang, LESSONS.length)} مختصر اسباق جو آپ کو پہلے جملے سے افعال، گنتی اور وقت بتانے تک لے جاتے ہیں۔ ان کی ترتیب غیر عرب طلبہ کے کلاسیکی نصاب، جیسے مدینہ یونیورسٹی کی مشہور کتب، کے انداز پر ہے: ایک وقت میں ایک قاعدہ، اور بہت سی مثالیں۔`,
    first: 'ابھی حروف نہیں پہچانتے؟ پہلے حروفِ تہجی سیکھ لیں۔',
  } : {
    title: 'Arabic grammar lessons for beginners | Harf', desc: `${LESSONS.length} beginner Arabic grammar lessons: this and that, al-, prepositions, masculine and feminine, possession, pronouns, adjectives, plurals, verbs, the future, numbers and time, with examples and audio.`,
    h1: 'Arabic grammar lessons for beginners',
    lead: `${LESSONS.length} short lessons that take you from your first sentence to verbs, numbers and telling the time. They follow the step-by-step order of classic courses for non-Arabic speakers, such as the well-known Madinah books: one small pattern at a time, with plenty of examples.`,
    first: 'Can’t read the letters yet? Start with the alphabet.',
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], [null, T[lang].nav.lessons]])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
<p><a href="${link(lang, 'alphabet.html')}">${C.first}</a></p>
${list}
<section class="box" style="margin-top:28px"><p>${ur ? `اسباق کے ساتھ پڑھنے کی مشق کے لیے <a href="${link(lang, 'reading.html')}">آسان عربی کہانیاں</a> پڑھیں۔` : `Practise reading alongside the lessons with our <a href="${link(lang, 'stories.html')}">Arabic stories</a>.`}</p></section>`;
  return layout(lang, { file: 'lessons.html', section: 'lessons', title: C.title, desc: C.desc, body });
}

function lessonPage(lang, i) {
  const ur = lang === 'ur';
  const l = LESSONS[i], L = l[lang];
  const prev = LESSONS[i - 1], next = LESSONS[i + 1];
  const C = ur ? { label: 'سبق', ex: 'مثالیں', pts: 'اہم نکات', pr: 'مشق', prHint: 'جواب دیکھنے کے لیے سوال پر ٹیپ کریں۔', quiz: 'سارے اسباق ہو گئے؟ کوئز دیں ←' }
    : { label: 'Lesson', ex: 'Examples', pts: 'Key points', pr: 'Practice', prHint: 'Tap a question to see the answer.', quiz: 'Finished the lessons? Take the quiz →' };
  const n = num(lang, i + 1);
  const title = `${C.label} ${n}: ${L.title}`;
  const plainTitle = title.replace(/[{}]/g, '');
  const examples = l.ex.map(([a, tr, en, u]) => `<div class="ex-row"><span class="ar" lang="ar">${a}</span><span class="info"><span class="tr latin">${esc(tr)}</span><span class="mean">${esc(ur ? u : en)}</span></span>${say(lang, a)}</div>`).join('\n  ');
  const practice = l.practice.map((p) => {
    const note = ur ? p.noteUr : p.noteEn;
    return `<details class="practice"><summary>${fmt(ur ? p.ur : p.en)}</summary><div class="ans"><span class="ar" lang="ar">${p.a}</span> <span class="latin">${esc(p.tr)}</span> ${say(lang, p.a)}${note ? `<p class="note">${fmt(note)}</p>` : ''}</div></details>`;
  }).join('\n');
  const desc = ur ? `${plainTitle}۔ ${L.short.replace(/[{}]/g, '')} اردو میں وضاحت، مثالیں، آواز اور مشق۔`
    : `${plainTitle}. ${L.short.replace(/[{}]/g, '')} Clear explanation, examples with audio and practice.`;
  const videoHtml = l.video
    ? `<div class="lesson-video"><video src="/videos/${l.video}" controls preload="none" width="100%" style="border-radius:10px;max-width:640px;display:block;margin:0 auto 1.5rem"></video></div>`
    : '';
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], ['lessons.html', T[lang].nav.lessons], [null, `${C.label} ${n}`]])}
<p class="eyebrow">${C.label} ${n}${ur ? '،' : ' ·'} <span class="ar" lang="ar">${l.key}</span></p>
<h1>${fmt(L.title)}</h1>
${videoHtml}<p class="lead">${fmt(L.intro)}</p>
${picBoard(lang, l.slug)}
<section>
  <h2>${C.ex}</h2>
  <div class="ex">
  ${examples}
  </div>
</section>
<section>
  <h2>${C.pts}</h2>
  <ul class="points prose">${L.points.map((p) => `<li>${fmt(p)}</li>`).join('')}</ul>
</section>
<section>
  <h2>${C.pr}</h2>
  <p class="note">${C.prHint}</p>
  ${practice}
</section>
<nav class="pager" aria-label="${C.label}">
  ${prev ? `<a class="btn" href="${link(lang, prev.slug + '.html')}">${T[lang].prev}</a>` : '<span></span>'}
  ${next ? `<a class="btn primary" href="${link(lang, next.slug + '.html')}">${T[lang].next}</a>` : `<a class="btn primary" href="${link(lang, 'quiz.html')}">${C.quiz}</a>`}
</nav>`;
  return layout(lang, { file: l.slug + '.html', section: 'lessons', title: plainTitle + (ur ? ' | حرف' : ' | Harf'), desc, body });
}

function vocabularyPage(lang) {
  const ur = lang === 'ur';
  const cards = TOPICS.map((t) => `<a class="card" href="${link(lang, 'vocab-' + t.slug + '.html')}"><h3>${ur ? t.ur : t.en}</h3><p><span class="ar" lang="ar">${t.words.slice(0, 3).map((w) => w[0]).join(' · ')}</span></p><p>${ur ? `${ud(t.words.length)} الفاظ` : `${t.words.length} words`}</p></a>`).join('\n    ');
  const C = ur ? {
    title: 'موضوع کے لحاظ سے عربی الفاظ | حرف', desc: 'روزمرہ کے عربی الفاظ اردو معنی کے ساتھ: سلام، گنتی، خاندان، کھانا، ہفتے کے دن اور رنگ، فلیش کارڈز اور آواز کے ساتھ۔',
    h1: 'موضوع کے لحاظ سے عربی الفاظ',
    lead: 'سلام اور گنتی سے شروع کریں، پھر اپنی ضرورت کے موضوعات چنیں۔ ہر موضوع میں فلیش کارڈز اور آواز کے ساتھ الفاظ کی مکمل فہرست ہے۔',
  } : {
    title: 'Arabic vocabulary by topic | Harf', desc: 'Everyday Arabic words by topic: greetings, numbers, family, food, days of the week and colours, with flashcards and audio.',
    h1: 'Arabic vocabulary by topic',
    lead: 'Start with greetings and numbers, then pick the topics you need. Each topic has flashcards and a full word list with audio.',
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], [null, T[lang].nav.vocabulary]])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
<div class="cards">
    ${cards}
</div>`;
  return layout(lang, { file: 'vocabulary.html', section: 'vocabulary', title: C.title, desc: C.desc, body });
}

// Flashcards plus the full word list. Words: [Arabic, transliteration, English, Urdu]
function deckHtml(lang, slug, words) {
  const ur = lang === 'ur';
  const C = ur ? { ar: 'عربی', tr: 'رومن تلفظ', m: 'مطلب', flip: 'پلٹنے کے لیے ٹیپ کریں', prev: 'پچھلا', next: 'اگلا', known: 'یاد ہے؟ نشان لگائیں', listen: 'سنیں', list: 'تمام الفاظ' }
    : { ar: 'Arabic', tr: 'Pronunciation', m: 'Meaning', flip: 'Tap or press Space to flip', prev: 'Previous', next: 'Next', known: 'Mark as known', listen: 'Listen', list: 'All words' };
  const pics = words.some((w) => w[4]);
  const rows = words.map(([a, tr, en, u, pic]) => {
    const m = ur ? u : en;
    return `<tr data-ar="${esc(a)}" data-tr="${esc(tr)}" data-m="${esc(m)}" data-key="${esc(slug + '|' + a)}"${pic ? ` data-pic="${esc(pic)}"` : ''}>${pics ? `<td class="pic" aria-hidden="true">${pic || ''}</td>` : ''}<td class="a"><span class="ar" lang="ar">${a}</span></td><td class="latin">${esc(tr)}</td><td>${esc(m)}</td><td>${say(lang, a)}</td></tr>`;
  }).join('\n      ');
  return `<div class="cardzone">
  <div class="flash" id="flash" tabindex="0" role="button" aria-label="${ur ? 'کارڈ پلٹیں' : 'Flip card'}">
    <div class="flash-in">
      <div class="face front"><span class="fpic" id="fPic" aria-hidden="true"></span><span class="ar" lang="ar" id="fAr"></span><span class="hint">${C.flip}</span></div>
      <div class="face back"><span class="ar small" lang="ar" id="fAr2"></span><span class="tr latin" id="fTr"></span><span class="mean" id="fM"></span></div>
    </div>
  </div>
  <div class="row spread controls">
    <div class="row"><button class="btn" type="button" id="prev">${ur ? '→ ' + C.prev : '← ' + C.prev}</button><button class="btn" type="button" id="next">${ur ? C.next + ' ←' : C.next + ' →'}</button></div>
    <span class="counter" id="count"></span>
    <div class="row"><button class="btn" type="button" id="say">${C.listen}</button><button class="btn" type="button" id="known">${C.known}</button></div>
  </div>
</div>
<h2>${C.list}</h2>
<div class="tbl">
  <table class="words">
    <thead><tr>${pics ? '<th><span class="sr">🖼</span></th>' : ''}<th>${C.ar}</th><th>${C.tr}</th><th>${C.m}</th><th><span class="sr">${C.listen}</span></th></tr></thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</div>`;
}

function topicPage(lang, i) {
  const ur = lang === 'ur';
  const t = TOPICS[i];
  const prev = TOPICS[i - 1], next = TOPICS[i + 1];
  const title = ur ? t.titleUr : t.titleEn;
  const desc = ur ? `${t.titleUr}: ${ud(t.words.length)} الفاظ اردو معنی، رومن تلفظ، آواز اور فلیش کارڈز کے ساتھ۔`
    : `${t.titleEn}: ${t.words.length} words with meanings, pronunciation, audio and flashcards.`;
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], ['vocabulary.html', T[lang].nav.vocabulary], [null, ur ? t.ur : t.en]])}
<h1>${title}</h1>
<p class="lead">${fmt(ur ? t.introUr : t.introEn)}</p>
${deckHtml(lang, t.slug, t.words)}
<nav class="pager" aria-label="${T[lang].nav.vocabulary}">
  ${prev ? `<a class="btn" href="${link(lang, 'vocab-' + prev.slug + '.html')}">${T[lang].prev}: ${ur ? prev.ur : prev.en}</a>` : '<span></span>'}
  ${next ? `<a class="btn primary" href="${link(lang, 'vocab-' + next.slug + '.html')}">${ur ? 'اگلا' : 'Next'}: ${ur ? next.ur + ' ←' : next.en + ' →'}</a>` : `<a class="btn primary" href="${link(lang, 'quiz.html')}">${ur ? 'کوئز دیں ←' : 'Take the quiz →'}</a>`}
</nav>`;
  return layout(lang, { file: 'vocab-' + t.slug + '.html', section: 'vocabulary', title: title + (ur ? ' | حرف' : ' | Harf'), desc, body });
}

function phrasesPage(lang) {
  const ur = lang === 'ur';
  const list = PHRASES.map(([a, tr, en, u, ne, nu]) => {
    const note = ur ? nu : ne;
    return `<div class="ph"><span class="ar" lang="ar">${a}</span><span class="tr latin">${esc(tr)}</span><span class="mean">${esc(ur ? u : en)}${note ? ` · <em>${fmt(ur ? note.replace(/^عورت سے: (.+)$/, 'عورت سے: {$1}') : note)}</em>` : ''}</span>${say(lang, a)}</div>`;
  }).join('\n  ');
  const C = ur ? {
    title: 'روزمرہ کے عربی جملے اردو ترجمے کے ساتھ | حرف', desc: 'روزمرہ کے عربی جملے اردو ترجمے اور آواز کے ساتھ: تعارف، خریداری، راستہ پوچھنا اور شکریہ۔',
    h1: 'روزمرہ کے عربی جملے',
    lead: 'ملنے جلنے، خریداری اور راستہ پوچھنے کے لیے کارآمد جملے۔ یہ جملے کسی مرد سے بات کرنے کی شکل میں ہیں؛ نوٹ میں بتایا گیا ہے کہ عورت سے بات کرتے ہوئے کیا بدلتا ہے۔',
  } : {
    title: 'Everyday Arabic phrases with audio | Harf', desc: 'Useful everyday Arabic phrases with pronunciation and audio: introductions, shopping, asking the way and saying thanks.',
    h1: 'Everyday Arabic phrases',
    lead: 'Useful sentences for meeting people, shopping and getting around. They are written for speaking to a man; the note says what changes when you speak to a woman.',
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], [null, T[lang].nav.phrases]])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
<div class="phr">
  ${list}
</div>
<section class="box" style="margin-top:28px">
  <p>${ur ? `سعودی عرب میں رہتے ہیں؟ وہاں لوگ روزمرہ میں سعودی لہجہ بولتے ہیں۔ <a href="${link(lang, 'saudi-arabic.html')}">سعودی بول چال کے جملے سیکھیں ←</a>` : `Living in Saudi Arabia? People there speak their own dialect day to day. <a href="${link(lang, 'saudi-arabic.html')}">Learn Saudi Arabic for daily life →</a>`}</p>
</section>`;
  return layout(lang, { file: 'phrases.html', section: 'phrases', title: C.title, desc: C.desc, body });
}

function quizPage(lang) {
  const ur = lang === 'ur';
  const data = {
    letters: LETTERS.map((x) => [x.c, ur ? x.ur : x.en]),
    words: TOPICS.flatMap((t) => t.words.map((w) => [w[0], ur ? w[3] : w[2]])),
    quran: QWORDS.map((w) => [w[0], ur ? w[3] : w[2]]),
    pics: PIC_QUIZ.map((w) => [w[4], w[0]]),
  };
  const C = ur ? {
    title: 'عربی کوئز: حروف، الفاظ اور تصویریں | حرف', desc: 'عربی حروف، الفاظ، تصویروں اور قرآنی الفاظ پر مفت کوئز۔ دس سوال، ہر بار نیا سیٹ۔',
    h1: 'عربی کوئز', lead: 'حروف، الفاظ، تصویروں یا قرآنی الفاظ پر دس سوال۔ اوپر سے قسم چنیں؛ ہر بار نیا سیٹ آتا ہے۔',
    modes: [['mixed', 'ملا جلا'], ['letters', 'صرف حروف'], ['words', 'صرف الفاظ'], ['pics', 'تصویریں'], ['quran', 'قرآنی الفاظ']],
  } : {
    title: 'Arabic quiz: letters, words and pictures | Harf', desc: 'A free Arabic quiz on letters, words, pictures and Quran words. Ten questions, a new set every time.',
    h1: 'Arabic quiz', lead: 'Ten questions on letters, words, pictures or Quran words. Pick a type below; you get a new set every time.',
    modes: [['mixed', 'Mixed'], ['letters', 'Letters only'], ['words', 'Words only'], ['pics', 'Pictures'], ['quran', 'Quran words']],
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], [null, T[lang].nav.quiz]])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
<div class="chips" id="qmode" role="group" aria-label="${ur ? 'کوئز کی قسم' : 'Quiz type'}">
  ${C.modes.map(([m, label], k) => `<button class="chip" type="button" data-m="${m}" aria-pressed="${k === 0}">${label}</button>`).join('')}
</div>
<div class="quiz" id="quizbox" aria-live="polite"></div>
<script type="application/json" id="quiz-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
  return layout(lang, { file: 'quiz.html', section: 'quiz', title: C.title, desc: C.desc, body });
}

// ---------------------------------------------------------------- Quran pages
const QURAN_NOTE = {
  en: 'Quran text from the <a href="https://tanzil.net">Tanzil Project</a>. Word meanings and translations are written by Harf to help learners; they are not a full translation or tafsir. The Listen button uses your device’s voice for single words. It is not a recitation, so listen to a qari for proper tajweed.',
  ur: 'قرآن کا متن <a href="https://tanzil.net">تنزیل پروجیکٹ</a> سے لیا گیا ہے۔ الفاظ کے معانی اور ترجمہ حرف نے سیکھنے والوں کی مدد کے لیے لکھے ہیں؛ یہ مکمل ترجمہ یا تفسیر نہیں۔ «سنیں» کا بٹن آپ کے آلے کی مشینی آواز میں الگ الگ لفظ سناتا ہے؛ یہ تلاوت نہیں، اس لیے درست تجوید کے لیے کسی قاری کی تلاوت سنیں۔',
};

function verseHtml(lang, v, k) {
  const ur = lang === 'ur';
  const tiles = v.w.map(([a, tr, en, u]) => `<button class="w" type="button" data-say="${esc(a)}"><span class="ar" lang="ar">${a}</span><span class="tr latin">${esc(tr)}</span><span class="m"${ur ? '' : ' dir="ltr"'}>${esc(ur ? u : en)}</span></button>`).join('');
  return `<section class="verse" id="v${k}">
  <p class="ayah ar" lang="ar">${v.w.map((x) => x[0]).join(' ')} <span class="anum">${arNum(k)}</span></p>
  <div class="wbw" dir="rtl">${tiles}</div>
  <p class="vmean"><span class="vn">${num(lang, k)}.</span> ${esc(ur ? v.ur : v.en)}</p>
</section>`;
}

function quranPage(lang) {
  const ur = lang === 'ur';
  const n = (v) => num(lang, v);
  const cards = SURAHS.map((s) => `<a class="card" href="${link(lang, 'quran-' + s.slug + '.html')}"><h3>${ur ? s.ur : 'Surah ' + s.en}</h3><p><span class="ar" lang="ar">${s.name}</span></p><p>${ur ? `${s.meanUr}، ${n(s.v.length)} آیات` : `${s.meanEn} · ${s.v.length} verses`}</p></a>`).join('\n    ');
  const C = ur ? {
    title: 'قرآنی عربی: لفظ بہ لفظ ترجمہ اور نماز کے الفاظ | حرف', desc: 'سورہ فاتحہ اور آخری سورتوں کا لفظ بہ لفظ اردو ترجمہ، نماز میں پڑھے جانے والے اذکار کا مطلب، اور قرآن کے عام الفاظ فلیش کارڈز کے ساتھ۔',
    h1: 'قرآنی عربی: جو پڑھتے ہیں اسے سمجھیں',
    lead: 'ہم روزانہ نماز میں سورہ فاتحہ اور چھوٹی سورتیں پڑھتے ہیں۔ یہاں ہر لفظ کا مطلب الگ الگ سیکھیں، تاکہ اگلی بار پڑھتے ہوئے آپ جانتے ہوں کہ کیا کہہ رہے ہیں۔',
    sH: 'سورتیں لفظ بہ لفظ', moreH: 'نماز اور عام الفاظ',
    prayer: ['quran-prayer-words.html', 'نماز کے اذکار', 'تکبیر سے سلام تک: نماز میں پڑھی جانے والی ہر دعا، تلفظ اور اردو ترجمے کے ساتھ۔'],
    common: ['quran-common-words.html', 'قرآن کے عام الفاظ', `قرآن میں بار بار آنے والے ${n(QWORDS.length)} الفاظ، فلیش کارڈز اور کوئز کے ساتھ۔`],
    howH: 'کیسے سیکھیں',
    how: ['ایک وقت میں ایک آیت لیں۔ ہر لفظ پر ٹیپ کر کے اس کی آواز سنیں اور اس کا مطلب پڑھیں۔', 'پھر پوری آیت کا ترجمہ پڑھیں اور دیکھیں کہ الفاظ کیسے جڑتے ہیں۔', 'اگلی نماز میں انہی معانی کو ذہن میں رکھ کر پڑھیں۔'],
    start: 'سورہ فاتحہ سے شروع کریں',
  } : {
    title: 'Quranic Arabic: word-by-word meanings and prayer words | Harf', desc: 'Understand what you recite: Al-Fatiha and the short surahs word by word, the words of the prayer with meanings, and common Quran words with flashcards.',
    h1: 'Quranic Arabic: understand what you recite',
    lead: 'Many of us recite Al-Fatiha and the short surahs every day without knowing what each word means. Learn them here word by word, so that next time you pray you know what you are saying.',
    sH: 'Surahs word by word', moreH: 'Prayer and common words',
    prayer: ['quran-prayer-words.html', 'Words of the prayer', 'From the takbir to the salam: everything said in the prayer, with pronunciation and meaning.'],
    common: ['quran-common-words.html', 'Common Quran words', `${QWORDS.length} words that appear again and again in the Quran, with flashcards and a quiz.`],
    howH: 'How to use these pages',
    how: ['Take one verse at a time. Tap each word to hear it and read its meaning.', 'Then read the meaning of the whole verse and see how the words fit together.', 'In your next prayer, recite it with those meanings in mind.'],
    start: 'Start with Al-Fatiha',
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], [null, T[lang].nav.quran]])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
<p><a class="btn primary" href="${link(lang, 'quran-al-fatiha.html')}">${C.start}</a></p>
<section>
  <h2>${C.sH}</h2>
  <div class="cards">
    ${cards}
  </div>
</section>
<section>
  <h2>${C.moreH}</h2>
  <div class="cards">
    ${[C.prayer, C.common].map(([f, h, p]) => `<a class="card" href="${link(lang, f)}"><h3>${h}</h3><p>${p}</p></a>`).join('\n    ')}
  </div>
</section>
<section class="box">
  <h2>${C.howH}</h2>
  <ol class="steps">${C.how.map((x) => `<li>${x}</li>`).join('')}</ol>
</section>
<p class="note">${QURAN_NOTE[lang]}</p>`;
  return layout(lang, { file: 'quran.html', section: 'quran', title: C.title, desc: C.desc, body });
}

function surahPage(lang, i) {
  const ur = lang === 'ur';
  const s = SURAHS[i], prev = SURAHS[i - 1], next = SURAHS[i + 1];
  const nV = s.v.length, nW = surahWords(s);
  const title = ur ? `${s.ur} لفظ بہ لفظ ترجمہ اور تلفظ` : `Surah ${s.en} word by word: meaning and pronunciation`;
  const desc = ur ? `${s.ur} (${s.meanUr}) کا لفظ بہ لفظ اردو ترجمہ، رومن تلفظ اور ہر آیت کا مطلب۔ ${ud(nV)} آیات، ${ud(nW)} الفاظ۔`
    : `Surah ${s.en} (${s.meanEn}) word by word: the meaning and pronunciation of every word, and the meaning of each verse. ${nV} verses, ${nW} words.`;
  const eyebrow = ur ? `سورت ${ud(s.n)}، ${ud(nV)} آیات، ${ud(nW)} الفاظ` : `Surah ${s.n} · ${nV} verses · ${nW} words`;
  const name = (x) => (ur ? x.ur : x.en);
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], ['quran.html', T[lang].nav.quran], [null, name(s)]])}
<p class="eyebrow">${eyebrow}</p>
<h1>${title}</h1>
<p class="lead">${fmt(ur ? s.introUr : s.introEn)}</p>
<p class="row"><a class="btn" href="https://quran.com/${s.n}" target="_blank" rel="noopener">${ur ? 'Quran.com پر تلاوت سنیں' : 'Listen to a recitation on Quran.com ↗'}</a><span class="note">${ur ? 'کسی بھی لفظ پر ٹیپ کر کے اس کی آواز سنیں۔' : 'Tap any word to hear it on its own.'}</span></p>
<p class="surah-name ar" lang="ar">سُورَةُ ${s.name}</p>
${s.n === 1 ? '' : `<p class="basmala ar" lang="ar">${BASMALA}</p>`}
${s.v.map((v, k) => verseHtml(lang, v, k + 1)).join('\n')}
<p class="note">${QURAN_NOTE[lang]}</p>
<nav class="pager" aria-label="${T[lang].nav.quran}">
  ${prev ? `<a class="btn" href="${link(lang, 'quran-' + prev.slug + '.html')}">${T[lang].prev}: ${name(prev)}</a>` : `<a class="btn" href="${link(lang, 'quran.html')}">${T[lang].prev}: ${T[lang].nav.quran}</a>`}
  ${next ? `<a class="btn primary" href="${link(lang, 'quran-' + next.slug + '.html')}">${ur ? 'اگلا: ' + name(next) + ' ←' : 'Next: ' + name(next) + ' →'}</a>` : `<a class="btn primary" href="${link(lang, 'quran-prayer-words.html')}">${ur ? 'اگلا: نماز کے اذکار ←' : 'Next: words of the prayer →'}</a>`}
</nav>`;
  return layout(lang, { file: 'quran-' + s.slug + '.html', section: 'quran', title: title + (ur ? ' | حرف' : ' | Harf'), desc, body });
}

function prayerPage(lang) {
  const ur = lang === 'ur';
  const rows = PRAYER.map((p, k) => `<div class="pw">
  <h3><span class="vn">${num(lang, k + 1)}.</span> ${ur ? p.ur : p.en}</h3>
  <span class="when">${fmt(ur ? p.whenUr : p.whenEn)}</span>
  <span class="ar" lang="ar">${p.a}</span>
  <span class="tr latin">${esc(p.tr)}</span>
  <span class="mean">${esc(ur ? p.mUr : p.mEn)}</span>
  <span>${say(lang, p.a)}</span>
</div>`).join('\n');
  const C = ur ? {
    title: 'نماز کے اذکار ترجمے کے ساتھ: ثنا، تشہد، درود | حرف', desc: 'نماز میں پڑھے جانے والے تمام اذکار عربی متن، رومن تلفظ اور اردو ترجمے کے ساتھ: تکبیر، ثنا، رکوع و سجود کی تسبیح، تشہد، درود اور سلام۔',
    h1: 'نماز کے اذکار اور ان کا مطلب',
    lead: 'تکبیر سے سلام تک، نماز میں جو کچھ پڑھا جاتا ہے، ترتیب سے۔ مختلف مسالک میں الفاظ میں معمولی فرق ہو سکتا ہے؛ یہاں عام طور پر پڑھی جانے والی صورتیں دی گئی ہیں۔ نماز کے احکام کے لیے کسی معتبر عالم سے رجوع کریں۔',
    fat: 'سورہ فاتحہ کا لفظ بہ لفظ ترجمہ دیکھیں ←',
  } : {
    title: 'Words of the prayer with meaning: thanaa’, tashahhud, durood | Harf', desc: 'Everything said in the Muslim prayer with Arabic text, pronunciation and meaning: takbir, opening praise, the words of rukuʿ and sujud, tashahhud, durood and salam.',
    h1: 'Words of the prayer and what they mean',
    lead: 'Everything said in the prayer, in order, from the takbir to the salam. Wordings differ slightly between schools; these are widely used forms. For the rules of prayer, ask a scholar you trust.',
    fat: 'See Al-Fatiha word by word →',
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], ['quran.html', T[lang].nav.quran], [null, ur ? 'نماز کے اذکار' : 'Words of the prayer']])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
<p><a href="${link(lang, 'quran-al-fatiha.html')}">${C.fat}</a></p>
<div class="pws">
${rows}
</div>
<nav class="pager" aria-label="${T[lang].nav.quran}">
  <a class="btn" href="${link(lang, 'quran.html')}">${T[lang].prev}: ${T[lang].nav.quran}</a>
  <a class="btn primary" href="${link(lang, 'quran-common-words.html')}">${ur ? 'اگلا: قرآن کے عام الفاظ ←' : 'Next: common Quran words →'}</a>
</nav>`;
  return layout(lang, { file: 'quran-prayer-words.html', section: 'quran', title: C.title, desc: C.desc, body });
}

function quranWordsPage(lang) {
  const ur = lang === 'ur';
  const C = ur ? {
    title: 'قرآن کے عام الفاظ اردو معنی کے ساتھ | حرف', desc: `قرآن میں بار بار آنے والے ${ud(QWORDS.length)} الفاظ اردو معنی، رومن تلفظ، آواز اور فلیش کارڈز کے ساتھ۔`,
    h1: 'قرآن کے عام الفاظ',
    lead: 'یہ الفاظ قرآن میں بار بار آتے ہیں۔ انہیں یاد کر لیں تو تلاوت کے دوران بہت سی آیات کا مطلب پہچاننے لگیں گے۔ فلیش کارڈز سے مشق کریں، پھر کوئز میں «قرآنی الفاظ» چن کر خود کو جانچیں۔',
    quiz: 'قرآنی الفاظ کا کوئز دیں ←',
  } : {
    title: 'Common Quran words with meanings | Harf', desc: `${QWORDS.length} words that appear again and again in the Quran, with meanings, pronunciation, audio and flashcards.`,
    h1: 'Common words of the Quran',
    lead: 'These words come up again and again in the Quran. Once you know them, you will start to recognise the meaning of many verses as you recite. Practise with the flashcards, then pick “Quran words” in the quiz to test yourself.',
    quiz: 'Take the Quran words quiz →',
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], ['quran.html', T[lang].nav.quran], [null, C.h1]])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
${deckHtml(lang, 'quran', QWORDS)}
<nav class="pager" aria-label="${T[lang].nav.quran}">
  <a class="btn" href="${link(lang, 'quran-prayer-words.html')}">${T[lang].prev}: ${ur ? 'نماز کے اذکار' : 'words of the prayer'}</a>
  <a class="btn primary" href="${link(lang, 'quiz.html')}">${C.quiz}</a>
</nav>`;
  return layout(lang, { file: 'quran-common-words.html', section: 'quran', title: C.title, desc: C.desc, body });
}

function saudiPage(lang) {
  const ur = lang === 'ur';
  const total = SAUDI.reduce((k, g) => k + g.items.length, 0);
  const groups = SAUDI.map((g) => `<section>
  <h2>${ur ? g.ur : g.en}</h2>
  <div class="phr">
  ${g.items.map(([a, tr, en, u, msa]) => `<div class="ph"><span class="ar" lang="ar">${a}</span><span class="tr latin">${esc(tr)}</span><span class="mean">${esc(ur ? u : en)}${msa ? ` · <em>${ur ? 'فصیح عربی' : 'Standard Arabic'}: ${fmt('{' + msa + '}')}</em>` : ''}</span>${say(lang, a)}</div>`).join('\n  ')}
  </div>
</section>`).join('\n');
  const C = ur ? {
    title: 'سعودی عربی بول چال: روزمرہ کے جملے اردو ترجمے کے ساتھ | حرف', desc: `سعودی عرب میں روزمرہ بولے جانے والے ${ud(total)} جملے اردو ترجمے اور آواز کے ساتھ: سلام، دفتر، خریداری، ٹیکسی اور ڈاکٹر۔`,
    h1: 'سعودی عربی: روزمرہ بول چال',
    lead: 'سعودی عرب میں لوگ روزمرہ زندگی میں کتابوں والی فصیح عربی کے بجائے اپنا لہجہ بولتے ہیں۔ یہ وہ جملے ہیں جو آپ دفتر، دکان اور ٹیکسی میں روز سنیں گے۔ جہاں فصیح عربی مختلف ہے، وہ بھی ساتھ لکھی ہے۔',
    tipsH: 'سننے میں کیا فرق ہے',
    tips: ['بہت سے سعودی {ق} کو «گ» بولتے ہیں: {قهوة} (قہوہ) «گہوہ» سنائی دیتا ہے۔', 'ریاض اور مشرقی صوبے میں «میں چاہتا ہوں» کے لیے {أبي} (ابی) بولتے ہیں، جبکہ جدہ اور مکہ میں {أبغى} (ابغا)۔', 'یہ جملے مرد سے بات کرنے کی شکل میں ہیں۔ عورت سے بات کرتے ہوئے آخر کی آواز بدل جاتی ہے: {كيفك} علاقے کے لحاظ سے «کیفِک» یا «کیفِچ» بولا جاتا ہے۔'],
    base: 'بنیاد مضبوط کرنی ہے؟ پہلے فصیح عربی کے روزمرہ جملے دیکھیں ←',
  } : {
    title: 'Saudi Arabic phrases for daily life, with audio | Harf', desc: `${total} everyday Saudi Arabic phrases with pronunciation and audio: greetings, work, shopping, taxis and the doctor.`,
    h1: 'Saudi Arabic for daily life',
    lead: 'In daily life Saudis speak their own dialect, not the standard Arabic of books. These are phrases you will hear every day at work, in shops and in taxis. Where standard Arabic is different, it is shown too.',
    tipsH: 'What sounds different',
    tips: ['Many Saudis say {ق} like a hard g: {قهوة} (coffee) sounds like “gahwa”.', 'In Riyadh and the Eastern Province “I want” is {أبي} (abi); in Jeddah and Makkah it is {أبغى} (abgha).', 'These phrases are for speaking to a man. Speaking to a woman the ending changes too: {كيفك} becomes “keefik” or “keefich”, depending on the region.'],
    base: 'Want a solid base first? See everyday phrases in standard Arabic →',
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], ['phrases.html', T[lang].nav.phrases], [null, ur ? 'سعودی بول چال' : 'Saudi Arabic']])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
<section class="box">
  <h2>${C.tipsH}</h2>
  <ul class="points">${C.tips.map((x) => `<li>${fmt(x)}</li>`).join('')}</ul>
</section>
${groups}
<p><a href="${link(lang, 'phrases.html')}">${C.base}</a></p>`;
  return layout(lang, { file: 'saudi-arabic.html', section: 'phrases', title: C.title, desc: C.desc, body });
}

// ---------------------------------------------------------------- reading and level test
const plain = (w) => w.replace(/[،.؟!:]/g, '');

function storiesPage(lang) {
  const ur = lang === 'ur';
  const n = (v) => num(lang, v);
  const lv = (k) => (ur ? 'درجہ ' + n(k) : 'Level ' + k);
  const byLevel = [1, 2, 3].map((k) => [k, CLASSICS.filter((t) => t.level === k)]).filter(([, a]) => a.length);
  const taleCard = (t) => `<a class="card tcard" href="${link(lang, 'tale-' + t.slug + '.html')}"><p class="eyebrow">${lv(t.level)}${ur ? '، ' : ' · '}${n(t.s.length)} ${ur ? 'جملے' : 'sentences'}</p><h3>${ur ? t.ur : t.en}</h3><p><span class="ar" lang="ar">${t.ar}</span></p></a>`;
  const C = ur ? {
    title: 'عربی کہانیاں: لفظ بہ لفظ ترجمے کے ساتھ | حرف', desc: `${n(CLASSICS.length + STORIES.length)} اعراب والی عربی کہانیاں، ہر لفظ کا مطلب، تلفظ، مادہ اور جملوں کا اردو ترجمہ۔`,
    h1: 'عربی کہانیاں', lead: 'کہانیاں پڑھنا عربی سیکھنے کا سب سے خوشگوار طریقہ ہے۔ ہر کہانی اعراب کے ساتھ ہے؛ کسی بھی لفظ پر ٹیپ کریں تو اس کی آواز، مطلب، تلفظ اور مادہ نظر آئے گا۔',
    cl: ['کلاسیکی کہانیاں', `ایسوپ کی حکایات، کلیلہ و دمنہ، الف لیلہ، جحا کے لطیفے اور لوک کہانیاں: ${n(CLASSICS.length)} کہانیاں آسان عربی میں۔`],
    ez: ['آسان کہانیاں', `اسباق کے ساتھ پڑھنے کے لیے ${n(STORIES.length)} مختصر کہانیاں: کلاس روم، خاندان، بازار اور سفر۔`],
    start: 'یہاں سے شروع کریں', all: 'تمام کہانیاں دیکھیں ←', how: 'کہانیوں سے کیسے سیکھیں',
    steps: ['پہلے پوری کہانی سنیں، پھر ہر جملہ خود اونچی آواز میں پڑھیں۔', 'جو لفظ نہ آئے اس پر ٹیپ کریں؛ ترجمہ آخر میں دیکھیں۔', 'روز ایک کہانی پڑھیں اور اگلے دن اسے دوبارہ پڑھیں۔'],
  } : {
    title: 'Arabic stories with word-by-word translation | Harf', desc: `${CLASSICS.length + STORIES.length} vowelled Arabic stories with the meaning, pronunciation and root of every word, and sentence translations.`,
    h1: 'Arabic stories', lead: 'Reading stories is the most enjoyable way to learn Arabic. Every story is fully vowelled; tap any word to hear it and see its meaning, pronunciation and root.',
    cl: ['Classic tales', `Aesop’s fables, Kalila wa Dimna, the Arabian Nights, Juha jokes and folk tales: ${CLASSICS.length} stories in simple Arabic.`],
    ez: ['Easy stories', `${STORIES.length} short stories to read alongside the lessons: the classroom, family, the market and travel.`],
    start: 'Start here', all: 'See all the tales →', how: 'How to learn with stories',
    steps: ['Listen to the whole story first, then read each sentence aloud yourself.', 'Tap any word you don’t know; check the translation only at the end.', 'Read one story a day, and read it again the next day.'],
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], [null, T[lang].nav.stories]])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
<section>
  <div class="cards">
    <a class="card wide" href="${link(lang, 'classic-tales.html')}"><span class="cg" lang="ar" aria-hidden="true">حِكَايَات</span><h3>${C.cl[0]}</h3><p>${C.cl[1]}</p><span class="go" aria-hidden="true">${ur ? '←' : '→'}</span></a>
    <a class="card wide" href="${link(lang, 'reading.html')}"><span class="cg" lang="ar" aria-hidden="true">قِصَص</span><h3>${C.ez[0]}</h3><p>${C.ez[1]}</p><span class="go" aria-hidden="true">${ur ? '←' : '→'}</span></a>
  </div>
</section>
${byLevel.map(([k, a]) => `<section>
  <h2 class="orn">${C.start}: ${lv(k)}</h2>
  <p class="note">${LEVELS[lang][k]}</p>
  <div class="cards">
    ${a.slice(0, 4).map(taleCard).join('\n    ')}
  </div>
</section>`).join('\n')}
<p class="row center"><a class="btn primary" href="${link(lang, 'classic-tales.html')}">${C.all}</a></p>
<section class="box" style="margin-top:32px"><h2>${C.how}</h2><ol class="steps">${C.steps.map((x) => `<li>${x}</li>`).join('')}</ol></section>
${supportBox(lang)}`;
  return layout(lang, { file: 'stories.html', section: 'stories', title: C.title, desc: C.desc, body });
}

function readingPage(lang) {
  const ur = lang === 'ur';
  const cards = STORIES.map((st) => `<a class="card" href="${link(lang, 'reading-' + st.slug + '.html')}"><p class="eyebrow">${ur ? 'درجہ ' + ud(st.level) + '، ' + st.afterUr : 'Level ' + st.level + ' · ' + st.afterEn}</p><h3>${ur ? st.ur : st.en}</h3><p><span class="ar" lang="ar">${st.ar}</span></p></a>`).join('\n    ');
  const C = ur ? {
    title: 'آسان عربی کہانیاں: پڑھنے کی مشق | حرف', desc: 'ابتدائی طلبہ کے لیے آسان عربی کہانیاں اعراب کے ساتھ۔ ہر لفظ پر ٹیپ کر کے اس کا مطلب دیکھیں اور آواز سنیں۔',
    h1: 'آسان عربی کہانیاں', lead: 'اعراب والی مختصر کہانیاں، اسباق کی ترتیب سے۔ کسی بھی لفظ پر ٹیپ کریں تو اس کی آواز اور مطلب سامنے آ جائے گا۔ پہلے خود پڑھنے کی کوشش کریں، پھر ترجمہ دیکھیں۔',
  } : {
    title: 'Easy Arabic stories for beginners: graded reading | Harf', desc: 'Short, fully vowelled Arabic stories for beginners. Tap any word to hear it and see its meaning, with translations and questions.',
    h1: 'Easy Arabic stories', lead: 'Short, fully vowelled stories that follow the lessons. Tap any word to hear it and see what it means. Try reading on your own first, then check the translation.',
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], ['stories.html', T[lang].nav.stories], [null, C.h1]])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
<div class="cards">
    ${cards}
</div>
${CLASSICS.length ? `<section class="box" style="margin-top:28px"><h2>${ur ? 'کلاسیکی کہانیاں' : 'Classic tales'}</h2><p>${ur ? `${num(lang, CLASSICS.length)} پرانی کہانیاں لفظ بہ لفظ ترجمے، تلفظ اور لفظ کے مادے کے ساتھ۔ <a href="${link(lang, 'classic-tales.html')}">کلاسیکی کہانیاں پڑھیں ←</a>` : `${CLASSICS.length} old tales with word-by-word translation, pronunciation and word origins. <a href="${link(lang, 'classic-tales.html')}">Read the classic tales →</a>`}</p></section>` : ''}`;
  return layout(lang, { file: 'reading.html', section: 'stories', title: C.title, desc: C.desc, body });
}

function storyPage(lang, i) {
  const ur = lang === 'ur';
  const st = STORIES[i], next = STORIES[i + 1];
  const text = st.s.map((x) => x.w.map((w) => w[0]).join(' ')).join(' ');
  const sents = st.s.map((x) => `<p class="st"><span class="ar" lang="ar">${x.w.map(([a, en, u]) => `<button class="rw" type="button" data-w="${esc(plain(a))}" data-m="${esc(ur ? u : en)}">${a}</button>`).join(' ')}</span><span class="st-tr latin">${esc(x.tr)}</span><span class="st-m">${esc(ur ? x.ur : x.en)}</span></p>`).join('\n  ');
  const qs = st.q.map((q) => `<details class="practice"><summary>${esc(ur ? q.ur : q.en)}</summary><div class="ans"><span class="ar" lang="ar">${q.a}</span> <span>${esc(ur ? q.aUr : q.aEn)}</span></div></details>`).join('\n');
  const C = ur ? { listen: 'پوری کہانی سنیں', showTr: 'تلفظ دکھائیں', showM: 'ترجمہ دکھائیں', tap: 'کسی لفظ پر ٹیپ کریں تو اس کا مطلب یہاں نظر آئے گا۔', qH: 'سوال', qHint: 'جواب دیکھنے کے لیے سوال پر ٹیپ کریں۔', all: 'تمام کہانیاں' }
    : { listen: 'Listen to the story', showTr: 'Show pronunciation', showM: 'Show translation', tap: 'Tap a word to see its meaning here.', qH: 'Questions', qHint: 'Tap a question to see the answer.', all: 'All stories' };
  const title = ur ? `آسان عربی کہانی: ${st.ur}` : `Easy Arabic story: ${st.en}`;
  const desc = ur ? `${st.ur} (${st.ar}): ابتدائی طلبہ کے لیے اعراب والی آسان عربی کہانی، ہر لفظ کے معنی، آواز اور ترجمے کے ساتھ۔`
    : `${st.en} (${st.ar}): a short, fully vowelled Arabic story for beginners, with the meaning of every word, audio and translation.`;
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], ['stories.html', T[lang].nav.stories], ['reading.html', ur ? 'آسان کہانیاں' : 'Easy stories'], [null, ur ? st.ur : st.en]])}
<p class="eyebrow">${ur ? 'درجہ ' + ud(st.level) + '، ' + st.afterUr : 'Level ' + st.level + ' · ' + st.afterEn}</p>
<h1>${ur ? st.ur : st.en} <span class="ar" lang="ar">${st.ar}</span></h1>
<div class="row story-tools">${say(lang, text, C.listen)}<button class="btn" type="button" data-tog="show-tr" aria-pressed="false">${C.showTr}</button><button class="btn" type="button" data-tog="show-m" aria-pressed="false">${C.showM}</button></div>
<div class="story" id="story">
  ${sents}
</div>
<p class="gloss" id="gloss" aria-live="polite">${C.tap}</p>
<section>
  <h2>${C.qH}</h2>
  <p class="note">${C.qHint}</p>
  ${qs}
</section>
<nav class="pager" aria-label="${C.all}">
  <a class="btn" href="${link(lang, 'reading.html')}">${C.all}</a>
  ${next ? `<a class="btn primary" href="${link(lang, 'reading-' + next.slug + '.html')}">${ur ? 'اگلی: ' + next.ur + ' ←' : 'Next: ' + next.en + ' →'}</a>` : `<a class="btn primary" href="${link(lang, 'quran.html')}">${ur ? 'اب قرآنی عربی آزمائیں ←' : 'Now try Quranic Arabic →'}</a>`}
</nav>`;
  return layout(lang, { file: 'reading-' + st.slug + '.html', section: 'stories', title: title + (ur ? ' | حرف' : ' | Harf'), desc, body });
}


function classicsPage(lang) {
  const ur = lang === 'ur';
  const n = (v) => num(lang, v);
  const cards = CLASSICS.map((t, i) => `<a class="card tcard" href="${link(lang, 'tale-' + t.slug + '.html')}" data-lv="${t.level}" data-q="${esc((t.en + ' ' + t.ur + ' ' + t.ar).toLowerCase())}"><p class="eyebrow">${ur ? 'درجہ ' + n(t.level) : 'Level ' + t.level}${ur ? '، ' : ' · '}${n(t.s.length)} ${ur ? 'جملے' : 'sentences'}</p><h3>${ur ? t.ur : t.en}</h3><p><span class="ar" lang="ar">${t.ar}</span></p></a>`).join('\n    ');
  const C = ur ? {
    title: 'کلاسیکی عربی کہانیاں: لفظ بہ لفظ ترجمہ | حرف', desc: `${ud(CLASSICS.length)} کلاسیکی کہانیاں اعراب کے ساتھ، ہر لفظ کا مطلب، تلفظ، جملوں کا ترجمہ اور لفظ کا مادہ۔ مبتدی سے متوسط تک۔`,
    h1: 'کلاسیکی عربی کہانیاں', lead: `کلیلہ و دمنہ کی حکایتوں، الف لیلہ کے قصوں، جحا کے لطیفوں اور دوسری پرانی کہانیوں کا آسان عربی میں اپنا بیان، ${n(CLASSICS.length)} کہانیاں۔ ہر لفظ پر ٹیپ کریں تو اس کا مطلب اور تلفظ سامنے آئے گا؛ لفظ کا مادہ اور ماخذ دیکھنے کا اختیار بھی ہے۔`,
    all: 'تمام', search: 'کہانی تلاش کریں', none: 'کوئی کہانی نہیں ملی۔', easy: 'مختصر مشقی کہانیاں بھی دیکھیں ←',
    note: 'یہ کہانیاں قدیم اور عوامی روایات پر مبنی ہیں؛ عبارت اور ترجمہ حرف نے سیکھنے والوں کے لیے اپنے الفاظ میں لکھا ہے۔',
  } : {
    title: 'Classic Arabic stories with word-by-word translation | Harf', desc: `${CLASSICS.length} classic tales in vowelled Arabic with the meaning and pronunciation of every word, sentence translations and word origins. Beginner to intermediate.`,
    h1: 'Classic Arabic stories', lead: `${CLASSICS.length} retellings of old fables, tales from the Arabian Nights, Juha jokes and other traditional stories, in simple Arabic. Tap any word to hear it and see its meaning and pronunciation. You can also turn on word origins to see each word’s root.`,
    all: 'All', search: 'Search stories', none: 'No stories found.', easy: 'See the short practice stories too →',
    note: 'These tales come from old, traditional sources. The Arabic text and translations are written by Harf for learners.',
  };
  const chips = [['', C.all], ['1', (ur ? 'درجہ ' : 'Level ') + n(1)], ['2', (ur ? 'درجہ ' : 'Level ') + n(2)], ['3', (ur ? 'درجہ ' : 'Level ') + n(3)]];
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], ['stories.html', T[lang].nav.stories], [null, C.h1]])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
<div class="tfilter" id="tf"><div class="chips" role="group" aria-label="${ur ? 'درجہ' : 'Level'}">${chips.map(([v, l], k) => `<button class="chip" type="button" data-lv="${v}" aria-pressed="${k === 0}">${l}</button>`).join('')}</div>
<input class="tsearch" id="tsearch" type="search" placeholder="${C.search}" aria-label="${C.search}"></div>
<p class="note">${LEVELS[lang][1]}${ur ? '۔ ' : '. '}${LEVELS[lang][2]}${ur ? '۔ ' : '. '}${LEVELS[lang][3]}${ur ? '۔' : '.'}</p>
<div class="cards" id="tcards">
    ${cards}
</div>
<p class="note" id="tnone" hidden>${C.none}</p>
<p><a href="${link(lang, 'reading.html')}">${C.easy}</a></p>
<p class="note">${C.note}</p>`;
  return layout(lang, { file: 'classic-tales.html', section: 'stories', title: C.title, desc: C.desc, body });
}

function classicPage(lang, i) {
  const ur = lang === 'ur';
  const n = (v) => num(lang, v);
  const t = CLASSICS[i], prev = CLASSICS[i - 1], next = CLASSICS[i + 1];
  const text = t.s.map((x) => x.w.map((w) => w.a).join(' ')).join(' ');
  const sents = t.s.map((x) => {
    const words = x.w.map((w) => `<button class="rw" type="button" data-w="${esc(w.a)}" data-m="${esc(ur ? w.ur : w.en)}" data-tr="${esc(w.tr)}"${w.root ? ` data-root="${esc(w.root)}"` : ''}${(ur ? w.our : w.oen) ? ` data-o="${esc(ur ? w.our : w.oen)}"` : ''}${w.rel && w.rel.length ? ` data-rel="${esc(w.rel.map((r) => r.a + '=' + (ur ? r.ur : r.en)).join(';;'))}"` : ''}>${esc(w.raw)}</button>`).join(' ');
    return `<div class="st"><span class="ar" lang="ar">${words}</span><span class="st-tr latin">${esc(x.tr)}</span><span class="st-m">${esc(ur ? x.ur : x.en)}</span><button class="btn sm st-play" type="button" data-say="${esc(x.w.map((w) => w.a).join(' '))}" aria-label="${T[lang].listen}"></button></div>`;
  }).join('\n  ');
  const C = ur ? { listen: 'پوری کہانی سنیں', showTr: 'تلفظ دکھائیں', showM: 'جملوں کا ترجمہ', showO: 'لفظ کا مادہ اور ماخذ', tap: 'کسی لفظ پر ٹیپ کریں تو اس کی آواز اور مطلب یہاں نظر آئے گا۔ «لفظ کا مادہ اور ماخذ» آن کریں تو مادہ اور اسی مادے کے دوسرے الفاظ بھی ملیں گے۔', all: 'تمام کہانیاں', about: 'اس کہانی کے بارے میں', lvl: 'درجہ' }
    : { listen: 'Listen to the tale', showTr: 'Show pronunciation', showM: 'Show sentence translation', showO: 'Word origins', tap: 'Tap a word to hear it and see its meaning here. Turn on “Word origins” to see its root and related words.', all: 'All tales', about: 'About this tale', lvl: 'Level' };
  const title = ur ? `کلاسیکی عربی کہانی: ${t.ur}` : `Classic Arabic story: ${t.en}`;
  const desc = ur ? `${t.ur} (${t.ar}): اعراب والی آسان عربی کہانی، ہر لفظ کا مطلب، تلفظ اور جملوں کا اردو ترجمہ۔`
    : `${t.en} (${t.ar}): a classic tale in vowelled Arabic with the meaning and pronunciation of every word and sentence translations.`;
  const links = [prev && ['<', prev], next && ['>', next]];
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], ['stories.html', T[lang].nav.stories], ['classic-tales.html', ur ? 'کلاسیکی کہانیاں' : 'Classic tales'], [null, ur ? t.ur : t.en]])}
<p class="eyebrow">${C.lvl} ${n(t.level)}${ur ? '، ' : ' · '}${n(i + 1)}/${n(CLASSICS.length)}</p>
<h1>${ur ? t.ur : t.en} <span class="ar" lang="ar">${t.ar}</span></h1>
<div class="row story-tools">${say(lang, text, C.listen)}<button class="btn" type="button" data-tog="show-tr" aria-pressed="false">${C.showTr}</button><button class="btn" type="button" data-tog="show-m" aria-pressed="false">${C.showM}</button><button class="btn" type="button" data-tog="show-o" aria-pressed="false">${C.showO}</button></div>
<div class="story" id="story">
  ${sents}
</div>
<p class="gloss" id="gloss" aria-live="polite">${C.tap}</p>
${(ur ? t.srcUr : t.srcEn) ? `<section class="box"><h2>${C.about}</h2><p>${esc(ur ? t.srcUr : t.srcEn)}</p></section>` : ''}
<nav class="pager" aria-label="${C.all}">
  ${prev ? `<a class="btn" href="${link(lang, 'tale-' + prev.slug + '.html')}">${T[lang].prev}: ${esc(ur ? prev.ur : prev.en)}</a>` : `<a class="btn" href="${link(lang, 'classic-tales.html')}">${C.all}</a>`}
  ${next ? `<a class="btn primary" href="${link(lang, 'tale-' + next.slug + '.html')}">${ur ? 'اگلی: ' + esc(next.ur) + ' ←' : 'Next: ' + esc(next.en) + ' →'}</a>` : `<a class="btn primary" href="${link(lang, 'classic-tales.html')}">${C.all}</a>`}
</nav>`;
  return layout(lang, { file: 'tale-' + t.slug + '.html', section: 'stories', title: title + (ur ? ' | حرف' : ' | Harf'), desc, body });
}

function levelPage(lang) {
  const ur = lang === 'ur';
  const L = (slug) => LETTERS.find((x) => x.slug === slug);
  const qs = LEVEL_QS.map((q) => {
    if (q.type === 'letter') return { p: ur ? 'یہ کون سا حرف ہے؟' : 'Which letter is this?', big: L(q.big).c, bigAr: true, opts: q.opts.map((x) => letterName(lang, L(x))), optAr: false };
    const p = fmt(ur ? q.pUr : q.pEn);
    if (q.latin) return { p, big: q.big, bigAr: true, opts: q.latin, optAr: false, latin: true };
    if (q.ar) return { p, big: '', bigAr: false, opts: q.ar, optAr: true };
    return { p, big: q.big, bigAr: true, opts: ur ? q.ur : q.en, optAr: false };
  }).map((q) => Object.assign(q, { ans: q.opts[0] }));
  const res = ur ? [
    { min: 0, h: 'حروفِ تہجی سے شروع کریں', p: 'روزانہ تین حروف سیکھیں؛ دس دن میں آپ عربی پڑھنے لگیں گے۔ ہر حرف کے صفحے پر لکھنے کی مشق بھی ہے۔', href: link(lang, 'alphabet.html'), cta: 'حروفِ تہجی کھولیں' },
    { min: 4, h: 'سبق ۱ سے شروع کریں', p: 'آپ حروف پہچانتے ہیں۔ اب گرامر کے اسباق شروع سے کریں اور ساتھ ساتھ حروف دہراتے رہیں۔', href: link(lang, 'lesson-1-this-is.html'), cta: 'سبق ۱ کھولیں' },
    { min: 7, h: 'سبق ۹ سے آگے بڑھیں', p: 'آپ کی بنیاد اچھی ہے۔ صفت، جمع اور افعال کے اسباق کریں، اور ساتھ میں آسان کہانیاں پڑھیں۔', href: link(lang, 'lesson-9-adjectives.html'), cta: 'سبق ۹ کھولیں' },
    { min: 9, h: 'بہت خوب! پڑھنے کی مشق کریں', p: 'آسان کہانیاں پڑھیں اور قرآنی عربی کے حصے میں سورتوں کا لفظ بہ لفظ ترجمہ سیکھیں۔', href: link(lang, 'reading.html'), cta: 'آسان کہانیاں کھولیں' },
  ] : [
    { min: 0, h: 'Start with the alphabet', p: 'Learn three letters a day and you will be reading in ten days. Each letter page has writing practice too.', href: link(lang, 'alphabet.html'), cta: 'Open the alphabet' },
    { min: 4, h: 'Start at Lesson 1', p: 'You can read the letters. Begin the grammar lessons from the start and keep reviewing the alphabet as you go.', href: link(lang, 'lesson-1-this-is.html'), cta: 'Open Lesson 1' },
    { min: 7, h: 'Move on from Lesson 9', p: 'You have a good base. Work through adjectives, plurals and verbs, and read the easy stories alongside.', href: link(lang, 'lesson-9-adjectives.html'), cta: 'Open Lesson 9' },
    { min: 9, h: 'Excellent! Practise your reading', p: 'Read the easy stories, and learn the short surahs word by word in the Quranic Arabic section.', href: link(lang, 'reading.html'), cta: 'Open the easy stories' },
  ];
  const data = { qs, res, done: ur ? 'آپ کا نتیجہ' : 'Your result', again: ur ? 'دوبارہ ٹیسٹ دیں' : 'Take the test again', next: ur ? 'اگلا ←' : 'Next →', of: ur ? 'میں سے' : 'of' };
  const C = ur ? {
    title: 'عربی لیول ٹیسٹ: کہاں سے شروع کریں؟ | حرف', desc: 'دس سوالوں کا مفت عربی لیول ٹیسٹ۔ دو منٹ میں جانیں کہ آپ کو حروفِ تہجی سے شروع کرنا ہے یا اسباق سے۔',
    h1: 'کہاں سے شروع کریں؟', lead: 'دس مختصر سوال، حروف سے افعال تک۔ کوئی جواب نہ آئے تو فکر نہ کریں، کوئی بھی چن کر آگے بڑھیں۔ آخر میں آپ کو بتایا جائے گا کہ کہاں سے شروع کریں۔',
  } : {
    title: 'Arabic level test: where should I start? | Harf', desc: 'A free ten-question Arabic level test. Find out in two minutes whether to start with the alphabet or the lessons.',
    h1: 'Where should I start?', lead: 'Ten quick questions, from letters to verbs. Don’t worry if you don’t know an answer; just pick one and move on. At the end you’ll see where to start.',
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], [null, C.h1]])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
<div class="quiz" id="lvlbox" aria-live="polite"></div>
<script type="application/json" id="lvl-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
  return layout(lang, { file: 'level-test.html', section: '', title: C.title, desc: C.desc, body });
}

function aboutPage(lang) {
  const ur = lang === 'ur';
  const body = ur ? `${crumbs(lang, [['index.html', T[lang].nav.home], [null, T[lang].about]])}
<h1>حرف کے بارے میں</h1>
<div class="prose">
<p class="lead">عربی میں «حرف» کا مطلب ہے letter۔ حرف عربی سیکھنے کی ایک مفت ویب سائٹ ہے، جو اردو اور انگریزی بولنے والوں کے لیے بنائی گئی ہے جو بالکل شروع سے عربی سیکھنا چاہتے ہیں۔</p>
<h2>یہاں کیا ملے گا</h2>
<p>مکمل حروفِ تہجی اور ہر حرف کی چاروں شکلیں، گرامر کے ابتدائی اسباق، روزمرہ کے الفاظ، کارآمد جملے اور مختصر کوئز۔ ہر عربی لفظ آپ کے آلے کی عربی آواز میں سنا جا سکتا ہے۔</p>
<h2>ہم کون سی عربی سکھاتے ہیں</h2>
<p>جدید فصیح عربی (${fmt('{الفصحى}')})، جو کتابوں، خبروں اور رسمی گفتگو میں استعمال ہوتی ہے اور پوری عرب دنیا میں سمجھی جاتی ہے۔ ہمارے گرامر کے اسباق کی ترتیب مدینہ یونیورسٹی کی کتب جیسے کلاسیکی نصاب سے متاثر ہے، مگر حرف پر تمام وضاحتیں اور مثالیں ہماری اپنی لکھی ہوئی ہیں۔</p>
<h2>رومن تلفظ کیسے پڑھیں</h2>
<p>${fmt('[aa]، [ii] اور [uu] لمبی آوازیں ہیں۔ [ḥ]، [ṣ]، [ḍ]، [ṭ] اور [ẓ] بھاری آوازیں ہیں جو منہ کے پچھلے حصے سے نکلتی ہیں۔ [ʿ] حرف {ع} ہے اور [’] ہمزہ {ء}۔')}</p>
<h2>سب کے لیے مفت</h2>
<p>حرف پر نہ کوئی سائن اپ ہے نہ کوئی فیس۔ اگر یہ آپ کے کام آئے تو آپ <a href="${KOFI_URL}">ہمارے Ko-fi صفحے</a> پر نئے اسباق کے لیے مدد کر سکتے ہیں۔</p>
</div>` : `${crumbs(lang, [['index.html', T[lang].nav.home], [null, T[lang].about]])}
<h1>About Harf</h1>
<div class="prose">
<p class="lead">Harf (${fmt('{حرف}')}) means “letter” in Arabic. It is a free website for learning Arabic, written for English and Urdu speakers who are starting from zero.</p>
<h2>What you will find here</h2>
<p>The full alphabet with the four shapes of every letter, beginner grammar lessons, everyday vocabulary, useful phrases and quick quizzes. Every Arabic word can be played aloud with your device’s built-in Arabic voice.</p>
<h2>Which Arabic we teach</h2>
<p>Modern Standard Arabic (${fmt('{الفصحى}')}, fuṣḥā), the Arabic of books, news and formal speech, understood across the Arab world. Our grammar lessons follow the order of classic courses such as the Madinah books, but every explanation and example on Harf is our own.</p>
<h2>How we write pronunciation</h2>
<p>We spell Arabic sounds with English letters to help you read: aa, ii and uu are long vowels; ḥ, ṣ, ḍ, ṭ and ẓ are heavy sounds made deeper in the mouth; ʿ is the letter ${fmt('{ع}')} and ’ is a short catch in the throat, the hamza ${fmt('{ء}')}.</p>
<h2>Free for everyone</h2>
<p>Harf has no sign-up and no paid plan. If it helps you, you can support new lessons on <a href="${KOFI_URL}">our Ko-fi page</a>.</p>
</div>`;
  const title = ur ? 'حرف کے بارے میں | حرف' : 'About Harf | Harf';
  const desc = ur ? 'حرف اردو اور انگریزی بولنے والوں کے لیے عربی سیکھنے کی ایک مفت ویب سائٹ ہے۔' : 'Harf is a free website for learning Arabic, written for English and Urdu speakers starting from zero.';
  return layout(lang, { file: 'about.html', section: '', title, desc, body });
}

function contactPage(lang) {
  const ur = lang === 'ur';
  const email = CONTACT_EMAIL
    ? (ur ? `<p>ای میل: <a href="mailto:${CONTACT_EMAIL}"><span class="latin">${CONTACT_EMAIL}</span></a></p>` : `<p>Email: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>`)
    : '';
  const body = ur ? `${crumbs(lang, [['index.html', T[lang].nav.home], [null, T[lang].contact]])}
<h1>رابطہ</h1>
<div class="prose">
<p class="lead">کوئی غلطی نظر آئی، یا کسی نئے موضوع پر سبق چاہیے؟ ہمیں ضرور بتائیں۔</p>
${email}<p>آپ <a href="${KOFI_URL}">ہمارے Ko-fi صفحے</a> کے ذریعے بھی پیغام بھیج سکتے ہیں۔</p>
<p>ہم ہر پیغام پڑھتے ہیں اور غلطیاں جلد از جلد درست کرتے ہیں۔</p>
</div>` : `${crumbs(lang, [['index.html', T[lang].nav.home], [null, T[lang].contact]])}
<h1>Contact</h1>
<div class="prose">
<p class="lead">Found a mistake, or want a lesson on a topic we don’t cover yet? We’d like to hear from you.</p>
${email}<p>You can also send us a message through <a href="${KOFI_URL}">our Ko-fi page</a>.</p>
<p>We read every message and fix mistakes as quickly as we can.</p>
</div>`;
  return layout(lang, { file: 'contact.html', section: '', title: ur ? 'رابطہ | حرف' : 'Contact | Harf', desc: ur ? 'حرف سے رابطہ کریں: غلطی کی نشاندہی یا نئے سبق کی تجویز۔' : 'Contact Harf to report a mistake or suggest a new lesson.', body });
}

function privacyPage(lang) {
  const ur = lang === 'ur';
  const ADS = 'https://www.google.com/settings/ads';
  const PARTNER = 'https://policies.google.com/technologies/partner-sites';
  const body = ur ? `${crumbs(lang, [['index.html', T[lang].nav.home], [null, T[lang].privacy]])}
<h1>رازداری کی پالیسی</h1>
<div class="prose">
<p class="note">آخری تبدیلی: ${UPDATED.ur}</p>
<p>حرف عربی سیکھنے کی ایک مفت ویب سائٹ ہے۔ یہ صفحہ بتاتا ہے کہ اسے استعمال کرتے وقت کون سی معلومات جمع ہوتی ہیں۔</p>
<h2>ہم کیا محفوظ کرتے ہیں</h2>
<p>حرف پر کوئی اکاؤنٹ نہیں، اور ہم آپ کا نام یا ای میل نہیں مانگتے۔ آپ کی پیش رفت (سیکھے گئے حروف، یاد کیے گئے الفاظ اور کوئز کا بہترین اسکور) صرف آپ کے اپنے براؤزر کی لوکل اسٹوریج میں محفوظ ہوتی ہے۔ یہ ہم تک کبھی نہیں پہنچتی، اور آپ براؤزر کا ڈیٹا صاف کر کے اسے کسی بھی وقت مٹا سکتے ہیں۔</p>
<h2>آواز</h2>
<p>تلفظ آپ کے آلے کی اپنی ٹیکسٹ ٹو اسپیچ آواز سے چلایا جاتا ہے۔ کوئی آواز یا متن ہمیں نہیں بھیجا جاتا۔</p>
<h2>ہم کون سی سروسز استعمال کرتے ہیں</h2>
<p>یہ ویب سائٹ GitHub Pages پر ہوسٹ ہے، جو سیکیورٹی کے لیے آپ کا IP ایڈریس جیسی تکنیکی معلومات ریکارڈ کر سکتا ہے۔ فونٹس Google Fonts سے لوڈ ہوتے ہیں، جسے صفحہ کھلنے پر آپ کا IP ایڈریس ملتا ہے۔ تفصیل کے لیے GitHub اور Google کی رازداری کی پالیسیاں دیکھیں۔</p>
<h2>وزٹرز کے اعداد و شمار</h2>
<p>حرف وزٹس گننے اور یہ جاننے کے لیے کہ کون سے صفحات زیادہ مفید ہیں، Google Analytics استعمال کرتا ہے۔ یہ کوکیز کے ذریعے دیکھے گئے صفحات، آپ کا اندازاً مقام اور آلے کی قسم جیسی معلومات جمع کرتا ہے۔ ان معلومات سے آپ کی شناخت نہیں کی جاتی۔ آپ اسے <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out add-on</a> یا براؤزر کی سیٹنگز سے روک سکتے ہیں۔</p>
<h2>اشتہارات</h2>
<p>حرف پر Google AdSense کے اشتہارات دکھائے جا سکتے ہیں۔ Google سمیت تیسرے فریق کے ادارے کوکیز استعمال کرتے ہیں تاکہ اس ویب سائٹ اور دوسری ویب سائٹس پر آپ کے پچھلے وزٹس کی بنیاد پر اشتہارات دکھائیں۔ Google کی اشتہاری کوکیز اسے اور اس کے شراکت داروں کو یہ سہولت دیتی ہیں۔ آپ <a href="${ADS}">Google کی اشتہاری سیٹنگز</a> میں ذاتی نوعیت کے اشتہارات بند کر سکتے ہیں، اور <a href="https://www.aboutads.info">aboutads.info</a> پر مزید جان سکتے ہیں۔ Google ہماری جیسی ویب سائٹس سے ملنے والا ڈیٹا کیسے استعمال کرتا ہے، یہ <a href="${PARTNER}">یہاں</a> پڑھیں۔</p>
<h2>بچے</h2>
<p>حرف ہر عمر کے طلبہ کے لیے موزوں ہے اور جان بوجھ کر کسی سے ذاتی معلومات جمع نہیں کرتا۔</p>
<h2>تبدیلیاں اور رابطہ</h2>
<p>اگر یہ پالیسی بدلی تو ہم اوپر دی گئی تاریخ بدل دیں گے۔ کوئی سوال ہو تو <a href="${link(lang, 'contact.html')}">رابطے کا صفحہ</a> دیکھیں۔</p>
</div>` : `${crumbs(lang, [['index.html', T[lang].nav.home], [null, T[lang].privacy]])}
<h1>Privacy policy</h1>
<div class="prose">
<p class="note">Last updated: ${UPDATED.en}</p>
<p>Harf is a free website for learning Arabic. This page explains what information is collected when you use it.</p>
<h2>What we store</h2>
<p>Harf has no accounts and never asks for your name or email. Your progress (letters learned, words known and your best quiz score) is saved only in your own browser, using local storage. It never reaches us, and you can delete it at any time by clearing your browser data.</p>
<h2>Audio</h2>
<p>Pronunciation is played by your device’s built-in text-to-speech voice. No audio or text is sent to us.</p>
<h2>Services we use</h2>
<p>The site is hosted on GitHub Pages, which may record technical data such as your IP address for security. Fonts are loaded from Google Fonts, which receives your IP address when a page loads. See the GitHub and Google privacy policies for details.</p>
<h2>Visitor statistics</h2>
<p>Harf uses Google Analytics to count visits and see which pages are most useful. It uses cookies to collect information such as the pages you view, your approximate location and the type of device you use. This information is not used to identify you. You can block it with the <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out add-on</a> or your browser settings.</p>
<h2>Advertising</h2>
<p>Harf may show ads from Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your previous visits to this website and other websites. Google’s use of advertising cookies enables it and its partners to serve ads to you based on those visits. You can opt out of personalised advertising in <a href="${ADS}">Google’s Ads Settings</a>, and learn more at <a href="https://www.aboutads.info">aboutads.info</a>. Read <a href="${PARTNER}">how Google uses data from sites that use its services</a>.</p>
<h2>Children</h2>
<p>Harf is suitable for learners of all ages and does not knowingly collect personal information from anyone.</p>
<h2>Changes and contact</h2>
<p>If this policy changes, we will update the date at the top of this page. Questions? See our <a href="${link(lang, 'contact.html')}">contact page</a>.</p>
</div>`;
  return layout(lang, { file: 'privacy.html', section: '', title: ur ? 'رازداری کی پالیسی | حرف' : 'Privacy policy | Harf', desc: ur ? 'حرف کون سی معلومات جمع کرتا ہے اور اشتہارات کی کوکیز کیسے کام کرتی ہیں۔' : 'What information Harf collects, and how advertising cookies work on this site.', body });
}

function notFoundPage() {
  const body = `<h1>Page not found</h1>
<p class="lead">This page doesn’t exist. Try the <a href="index.html">home page</a> or the <a href="alphabet.html">alphabet</a>.</p>
<p class="lead" lang="ur" dir="rtl" style="font-family:var(--urdu)">یہ صفحہ موجود نہیں۔ <a href="ur.html">اردو صفحۂ اول</a> پر جائیں۔</p>`;
  // The 404 page can be served at any path, so links must start from the site root.
  return layout('en', { file: '404.html', section: '', title: 'Page not found | Harf', desc: 'This page does not exist.', body })
    .replace(/<link rel="(canonical|alternate)"[^>]*>\n/g, '')
    .replace(/<meta property="og:url"[^>]*>\n/, '')
    .replace('href="ur-404.html"', 'href="ur.html"')
    .replace(/(href|src)="(?!https?:|data:|#|\/|mailto:)([^"]+)"/g, '$1="/$2"');
}

// ---------------------------------------------------------------- shared files
const STYLE_CSS = String.raw`:root{
  /* Layout: sticky header with section tabs; one reading column with cards and grids. Arabic always in Naskh; Urdu interface in Nastaliq. */
  --bg:#f5f6f2; --surface:#ffffff; --ink:#17231f; --muted:#5b6964;
  --accent:#0d6b57; --accent-soft:#e2f0eb; --gold:#a8720f; --line:#dde2da;
  --good:#1f7a3f; --bad:#b3362c;
  --display:"Fraunces", Georgia, serif;
  --body:"Source Sans 3", "Segoe UI", system-ui, sans-serif;
  --arabic:"Noto Naskh Arabic", "Amiri", "Traditional Arabic", serif;
  --urdu:"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Noto Naskh Arabic", serif;
  color-scheme:light;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --bg:#0f1513; --surface:#18211e; --ink:#e7eee9; --muted:#9aa9a3;
    --accent:#4cc3a3; --accent-soft:#1d3a32; --gold:#e3ac45; --line:#2a3632;
    --good:#5fcf87; --bad:#ef7b70; color-scheme:dark;
  }
}
:root[data-theme="dark"]{
  --bg:#0f1513; --surface:#18211e; --ink:#e7eee9; --muted:#9aa9a3;
  --accent:#4cc3a3; --accent-soft:#1d3a32; --gold:#e3ac45; --line:#2a3632;
  --good:#5fcf87; --bad:#ef7b70; color-scheme:dark;
}
html[lang="ur"]{--display:var(--urdu)}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--bg);color:var(--ink);font-family:var(--body);font-size:17px;line-height:1.6}
html[lang="ur"] body{font-family:var(--urdu);font-size:16px;line-height:2.2}
h1,h2,h3{font-family:var(--display);font-weight:700;line-height:1.2;text-wrap:balance;margin:0 0 .45em}
html[lang="ur"] h1,html[lang="ur"] h2,html[lang="ur"] h3{line-height:2.1}
h1{font-size:clamp(28px,4vw,42px)}
h2{font-size:24px}
h3{font-size:19px}
html[lang="ur"] h1{font-size:clamp(24px,3.4vw,34px)}
html[lang="ur"] h2{font-size:21px}
html[lang="ur"] h3{font-size:17px}
p{margin:0 0 1em}
a{color:var(--accent)}
.ar{font-family:var(--arabic);direction:rtl;unicode-bidi:isolate;line-height:1.8;font-weight:400}
.latin{font-family:var(--body);direction:ltr;unicode-bidi:isolate}
p .ar,li .ar,summary .ar,em .ar{font-size:1.2em;line-height:1.4}
em .ar{font-style:normal}
.nw{white-space:nowrap}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
button{font:inherit;cursor:pointer}
:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
.wrap{max-width:1080px;margin:0 auto;padding:0 20px}
.skip{position:absolute;inset-inline-start:-9999px}
.skip:focus{inset-inline-start:12px;top:12px;background:var(--surface);padding:8px 12px;z-index:30}
.small{font-size:13px}

header.top{position:sticky;top:0;z-index:10;background:var(--bg);border-bottom:1px solid var(--line)}
.bar{display:flex;align-items:center;gap:12px;padding:8px 0;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:8px;text-decoration:none;color:var(--ink)}
.brand .ar{font-size:28px;color:var(--accent);font-weight:700;line-height:1.4}
.brand b{font-family:var(--display);font-size:22px}
nav.tabs{display:flex;gap:2px;flex-wrap:wrap;margin-inline-start:auto}
nav.tabs a{padding:5px 11px;border-radius:999px;text-decoration:none;color:var(--muted);font-weight:600}
nav.tabs a:hover{color:var(--ink)}
nav.tabs a[aria-current="page"]{background:var(--accent);color:var(--bg)}
.lang{border:1px solid var(--line);border-radius:999px;padding:3px 12px;text-decoration:none;color:var(--ink);font-weight:600;background:var(--surface)}
.lang:hover{border-color:var(--accent)}
html[lang="en"] .lang{font-family:var(--urdu);line-height:2}
html[lang="ur"] .lang{font-family:var(--body);line-height:1.8}

main.wrap{padding-top:28px;padding-bottom:56px}
section{margin:0 0 40px}
.crumbs{font-size:14px;color:var(--muted);margin:0 0 12px}
.crumbs a{color:var(--muted)}
.crumbs .sep{font-family:var(--body);padding:0 2px}
.lead{font-size:19px;color:var(--muted);max-width:66ch}
html[lang="ur"] .lead{font-size:17px}
.eyebrow{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:8px}
html[lang="ur"] .eyebrow{letter-spacing:0;text-transform:none;font-size:14px}
.prose{max-width:70ch}
.prose h2{margin-top:1.4em}
.note{font-size:15px;color:var(--muted)}

.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.stat{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px}
.stat strong{display:block;font-family:var(--display);font-size:26px;font-variant-numeric:tabular-nums;line-height:1.5}
.stat span{color:var(--muted);font-size:14px}
.meter{height:6px;background:var(--line);border-radius:6px;margin-top:8px;overflow:hidden}
.meter i{display:block;height:100%;background:var(--accent);width:0}

.row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.row.center{justify-content:center}
.row.spread{justify-content:space-between}
.btn{display:inline-block;border:1px solid var(--line);background:var(--surface);color:var(--ink);padding:7px 15px;border-radius:10px;font-weight:600;text-decoration:none;line-height:1.6}
.btn:hover{border-color:var(--accent)}
.btn.primary{background:var(--accent);border-color:var(--accent);color:var(--bg)}
.btn.on{background:var(--accent-soft);border-color:var(--accent);color:var(--accent)}
.btn.sm{padding:3px 10px;font-size:14px}
.btn[disabled]{opacity:.5;cursor:default}
.btn .ar{line-height:1.2}

.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:14px}
.card{display:block;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:18px;text-decoration:none;color:var(--ink)}
a.card:hover{border-color:var(--accent)}
.card h3{margin-bottom:6px;color:var(--accent)}
.card p{margin:0;color:var(--muted)}
.card p .ar{font-size:22px;color:var(--ink)}
.box{background:var(--surface);border:1px solid var(--line);border-inline-start:4px solid var(--gold);border-radius:12px;padding:18px 20px;margin:0 0 36px}
.box p:last-child{margin-bottom:0}
.support{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
.support p{margin:0;max-width:60ch}
.split{display:grid;grid-template-columns:1fr 1fr;gap:32px}
.steps{padding-inline-start:22px;margin:0}
.steps li{margin-bottom:8px}

.letters{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px;direction:rtl;margin-bottom:36px}
.lt{position:relative;display:block;text-align:center;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:6px 6px 8px;text-decoration:none;color:var(--ink)}
.lt:hover{border-color:var(--accent)}
.lt.done{border-color:var(--accent);background:var(--accent-soft)}
.lt.done::after{content:"✓";position:absolute;top:4px;left:8px;color:var(--accent);font-weight:700;font-size:13px}
.lt .ar{display:block;font-size:40px;line-height:1.6}
.lt small{display:block;color:var(--muted);font-size:13px;unicode-bidi:plaintext;line-height:1.8}
.groups{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
.groups li{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:8px 14px;display:grid}
.groups .ar{font-size:26px}
.groups span:last-child{color:var(--muted);font-size:14px}

.letter-top{display:grid;grid-template-columns:200px 1fr;gap:28px;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:20px 24px;margin-bottom:28px}
.big-letter{font-size:130px;line-height:1.4;text-align:center;color:var(--accent)}
.letter-top h2{font-size:20px}
.forms{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:4px 0 10px;max-width:640px}
.forms div{border:1px solid var(--line);border-radius:10px;padding:6px;text-align:center;background:var(--surface)}
.forms .ar{font-size:38px;display:block;line-height:1.7}
.forms small{color:var(--muted);font-size:13px}
.facts{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:12px;margin:0 0 8px}
.fact{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px 16px}
.fact h3{font-size:14px;color:var(--muted);font-family:var(--body);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
html[lang="ur"] .fact h3{font-family:var(--urdu);text-transform:none;letter-spacing:0}
.fact p{margin:0}
.fact .ar{font-size:24px}
.example{display:flex;gap:14px;align-items:center}
.example > .ar{font-size:36px}
.pager{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:18px;margin-top:28px}

.lesson-list{list-style:none;padding:0;margin:0 0 28px;display:grid;gap:10px}
.part-h{margin-top:8px}
.lesson-list a{display:grid;grid-template-columns:44px 1fr auto;gap:14px;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:12px 18px;text-decoration:none;color:var(--ink)}
.lesson-list a:hover{border-color:var(--accent)}
.lesson-list .num{font-family:var(--display);font-size:26px;color:var(--gold);text-align:center}
.lesson-list > li > a > .ar{font-size:26px;color:var(--accent)}
.lesson-list p{margin:0;color:var(--muted);font-size:15px}
.points li{margin-bottom:10px}
.ex{display:grid;gap:8px;max-width:760px}
.ex.narrow{max-width:520px}
.ex-row{display:grid;grid-template-columns:minmax(150px,240px) 1fr auto;gap:4px 18px;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:6px 16px}
.ex-row .ar{font-size:26px;text-align:right}
.ex-row .info{display:grid;line-height:1.45}
html[lang="ur"] .ex-row .info{line-height:1.9}
.ex-row .tr{color:var(--gold);font-weight:600;justify-self:start}
.ex-row .mean{color:var(--muted)}
details.practice{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:10px 16px;margin-bottom:8px;max-width:760px}
details.practice summary{cursor:pointer;font-weight:600}
details.practice .ans{margin-top:6px;display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}
details.practice .ans > .ar{font-size:26px}
details.practice .ans .note{flex-basis:100%;margin:0}

.tbl{overflow-x:auto;margin:0 0 24px}
table.words{width:100%;border-collapse:collapse;background:var(--surface);border:1px solid var(--line)}
.words th,.words td{padding:8px 14px;border-bottom:1px solid var(--line);text-align:start;vertical-align:middle}
.words th{font-size:14px;color:var(--muted);font-weight:600;background:var(--bg)}
.words td.a .ar{font-size:24px}
.words tbody tr{cursor:pointer}
.words tr.cur td{background:var(--accent-soft)}
.words tr.is-known td.a::after{content:" ✓";color:var(--good);font-size:15px}

.cardzone{max-width:560px;margin:0 0 32px}
.flash{perspective:1200px;height:250px;cursor:pointer;border-radius:18px}
.flash-in{position:relative;width:100%;height:100%;transition:transform .5s;transform-style:preserve-3d}
.flash.flipped .flash-in{transform:rotateY(180deg)}
.face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:18px;border:1px solid var(--line);background:var(--surface);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center}
.face.back{transform:rotateY(180deg);background:var(--accent-soft);border-color:var(--accent)}
.face .ar{font-size:52px}
.face .ar.small{font-size:30px}
.face .tr{font-size:19px;color:var(--gold);font-weight:600}
.face .mean{font-size:24px;font-family:var(--display);margin-top:4px}
.face .hint{position:absolute;bottom:10px;font-size:13px;color:var(--muted)}
.fpic{font-size:44px;line-height:1.2;color:var(--accent);letter-spacing:2px}
.fpic:empty{display:none}
.words td.pic{font-size:24px;text-align:center;width:52px;color:var(--accent);white-space:nowrap}
.qbig.pic{font-size:72px;line-height:1.3}
.controls{margin-top:12px}
.counter{font-variant-numeric:tabular-nums;color:var(--muted)}

.phr{display:grid;gap:10px;max-width:820px}
.ph{display:grid;grid-template-columns:1fr auto;gap:0 16px;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:10px 16px}
.ph .ar{font-size:28px;text-align:right}
.ph .tr{color:var(--gold);font-weight:600}
.ph .mean{color:var(--muted)}
.ph .btn{grid-column:2;grid-row:1 / span 3}

.chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
.chip{border:1px solid var(--line);background:transparent;color:var(--muted);padding:5px 14px;border-radius:999px;font-weight:600}
.chip[aria-pressed="true"]{border-color:var(--accent);color:var(--accent);background:var(--accent-soft)}
.quiz{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:24px;max-width:640px}
.qprompt{font-size:15px;color:var(--muted);margin:0 0 6px}
.qbig{font-size:58px;text-align:center;margin:6px 0 16px;line-height:1.6}
.qbig.txt{font-family:var(--display);font-size:28px}
.qmsg{text-align:center;color:var(--muted)}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.opt{border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:12px;padding:8px 10px;font-weight:600;min-height:54px}
.opt .ar{font-size:26px}
.opt.right{border-color:var(--good);color:var(--good);background:var(--accent-soft)}
.opt.wrong{border-color:var(--bad);color:var(--bad)}
.qfoot{display:flex;justify-content:space-between;align-items:center;margin-top:16px;gap:10px;flex-wrap:wrap}
.score{font-family:var(--display);font-size:20px;font-variant-numeric:tabular-nums}

.surah-name{font-size:30px;text-align:center;margin:18px 0 0;color:var(--accent);font-weight:600}
.basmala{font-size:28px;text-align:center;margin:0 0 18px}
.verse{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:12px 18px 14px;margin:0 0 14px}
.ayah{font-size:32px;line-height:2.1;margin:0 0 8px;text-align:right}
.anum{display:inline-flex;align-items:center;justify-content:center;min-width:36px;height:36px;padding:0 4px;border:1.5px solid var(--gold);border-radius:50%;color:var(--gold);font-size:18px;line-height:1;vertical-align:middle}
.wbw{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px}
.w{display:flex;flex-direction:column;align-items:center;border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:10px;padding:2px 10px 8px;min-width:74px;max-width:180px;text-align:center}
.w:hover{border-color:var(--accent)}
.w .ar{font-size:26px;line-height:1.8}
.w .tr{font-size:13px;color:var(--gold);font-weight:600;line-height:1.3}
.w .m{font-size:13px;color:var(--muted);line-height:1.35;margin-top:2px}
html[lang="ur"] .w .m{line-height:2}
.vmean{margin:0;max-width:75ch}
.vn{color:var(--gold);font-weight:700}
.pws{display:grid;gap:12px;max-width:860px}
.pw{display:grid;gap:2px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 18px}
.pw h3{margin:0;font-size:18px}
.pw .when{font-size:14px;color:var(--muted)}
.pw > .ar{font-size:27px;line-height:2;text-align:right}
.pw .tr{color:var(--gold);font-weight:600;line-height:1.6}
.pw .mean{margin-bottom:6px}

.pad{display:block;width:100%;max-width:560px;height:260px;background:var(--surface);border:1px solid var(--line);border-radius:14px;touch-action:none;cursor:crosshair;margin:4px 0 12px}
.ws-controls select{font:inherit;padding:4px 8px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink);margin-inline-start:6px}
.ws{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:6px 14px 10px;margin:0 0 10px;break-inside:avoid}
.ws-h{font-size:17px;margin:0}
.ws-h .ar{font-size:24px;color:var(--accent)}
.ws-row{display:flex;align-items:center;gap:10px;border-bottom:1.5px dashed var(--line)}
.ws-label{width:92px;flex:none;font-size:12px;color:var(--muted);line-height:1.5}
.ws-cells{display:flex;flex-wrap:wrap;gap:4px 10px;flex:1}
.ws-model,.ws-trace{font-size:52px;line-height:1.55;min-width:58px;text-align:center}
.ws-model{color:var(--ink)}
.ws-trace{color:#c3cbc7;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ws-all .ws-row:not(.f0){display:none}
#ws.one .ws{display:none}
#ws.one .ws.on{display:block}
#ws.one .ws-row{min-height:96px}
@media print{
  header.top,footer,.no-print,.crumbs,.toast,.skip{display:none!important}
  body{background:#fff;color:#000}
  main.wrap{padding:0;max-width:none}
  h1{font-size:22px}
  .ws{border:0;border-bottom:1px solid #ccc;border-radius:0;padding:4px 0}
}

.story-tools{margin-bottom:12px}
.story{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:12px 20px;max-width:820px}
.st{display:grid;margin:0 0 8px}
.st > .ar{font-size:30px;line-height:2.1;text-align:right}
.rw{border:0;background:none;padding:0 2px;margin:0;font:inherit;color:inherit;border-radius:6px;cursor:pointer;line-height:inherit}
.rw:hover,.rw.on{background:var(--accent-soft);color:var(--accent)}
.st-tr{color:var(--gold);font-weight:600;font-size:15px}
.st-m{color:var(--muted)}
.story:not(.show-tr) .st-tr,.story:not(.show-m) .st-m{display:none}
.gloss{position:sticky;bottom:12px;z-index:5;background:var(--ink);color:var(--bg);border-radius:12px;padding:8px 16px;max-width:820px;margin:12px 0 28px}
.gloss .ar{font-size:24px;line-height:1.5}
h1 .ar{font-size:.85em;color:var(--accent);margin-inline-start:8px}

/* Islamic geometric design: star pattern, mihrab arch, calligraphy, gold accents */
.hero{position:relative;display:grid;grid-template-columns:1.35fr 1fr;gap:28px;align-items:center;margin:0 0 20px;padding:44px 40px;border-radius:24px;color:#f3efe2;overflow:hidden;
  background:radial-gradient(120% 140% at 85% 20%,#14866c 0%,#0d6b57 38%,#08423a 100%);box-shadow:0 18px 40px -22px rgba(8,66,58,.7)}
.hero::before{content:"";position:absolute;inset:0;background-image:__PAT__;background-size:72px 72px;opacity:.9;pointer-events:none;-webkit-mask-image:linear-gradient(100deg,transparent 15%,#000 85%);mask-image:linear-gradient(100deg,transparent 15%,#000 85%)}
html[lang="ur"] .hero::before{-webkit-mask-image:linear-gradient(260deg,transparent 15%,#000 85%);mask-image:linear-gradient(260deg,transparent 15%,#000 85%)}
.hero::after{content:"";position:absolute;inset:10px;border:1px solid rgba(227,172,69,.45);border-radius:16px;pointer-events:none}
.hero > *{position:relative;z-index:1}
.hero h1{color:#fff;margin-bottom:.35em}
.hero .eyebrow{color:#e3ac45}
.hero .lead{color:#dce9e2;font-size:18px}
html[lang="ur"] .hero .lead{font-size:16px}
.hero .ar{color:#ffe8b0}
.hero-note{margin:14px 0 0;font-size:15px}
.hero-note a{color:#f3d58a}
.btn.gold{background:#e3ac45;border-color:#e3ac45;color:#2a1c02}
.btn.gold:hover{background:#f0bd5c}
.btn.ghost{background:transparent;border-color:rgba(255,255,255,.55);color:#fff}
.btn.ghost:hover{background:rgba(255,255,255,.12);border-color:#fff}
.mihrab{justify-self:center;width:min(300px,100%);aspect-ratio:3/4;padding:7px;border-radius:999px 999px 18px 18px;background:linear-gradient(180deg,#f3d58a,#b57b16);box-shadow:0 14px 30px -12px rgba(0,0,0,.5)}
.mihrab-in{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border-radius:999px 999px 12px 12px;border:2px solid rgba(8,66,58,.35);
  background:radial-gradient(90% 70% at 50% 28%,#115f4e 0%,#08423a 75%);position:relative;overflow:hidden}
.mihrab-in::before{content:"";position:absolute;inset:0;background-image:__PAT__;background-size:54px 54px;opacity:.7}
.mihrab-in > *{position:relative}
.calli{font-family:"Aref Ruqaa","Noto Naskh Arabic",serif;font-weight:700;font-size:92px;line-height:1.35;color:#f6d98f;text-shadow:0 3px 0 rgba(0,0,0,.35),0 0 24px rgba(243,213,138,.35);direction:rtl}
.mihrab-in small{font-size:14px;letter-spacing:.2em;text-transform:uppercase;color:#bcd9cf}
html[lang="ur"] .mihrab-in small{letter-spacing:0;text-transform:none;font-size:16px}
.stats{margin:0 0 36px}
.stat{border-top:3px solid var(--gold)}
h2.orn{display:flex;align-items:center;gap:14px}
h2.orn::before,h2.orn::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--gold))}
h2.orn::after{background:linear-gradient(270deg,transparent,var(--gold))}
h2.orn{text-align:center}
h2.orn > span{display:none}
.split h2.orn{justify-content:flex-start}
.split h2.orn::before{display:none}
.cards .card{position:relative;overflow:hidden;border-radius:16px}
.cards .card::after{content:"";position:absolute;inset-inline-end:-26px;top:-26px;width:72px;height:72px;background-image:__PAT__;background-size:36px 36px;opacity:.55;transform:rotate(12deg);transition:opacity .2s,transform .3s}
a.card:hover::after{opacity:1;transform:rotate(30deg) scale(1.1)}
header.top{border-bottom:0;box-shadow:0 1px 0 var(--line)}
header.top::after{content:"";display:block;height:4px;background-image:__PAT__;background-size:36px 36px;background-color:#0d6b57;background-position:center}
footer{position:relative;border-top:0;padding-top:34px}
footer::before{content:"";position:absolute;inset-inline:0;top:0;height:10px;background-color:#0d6b57;background-image:__PAT__;background-size:36px 36px}
.brand .ar{font-family:"Aref Ruqaa","Noto Naskh Arabic",serif;font-size:32px}
@media (max-width:820px){
  .hero{grid-template-columns:1fr;padding:32px 22px}
  .mihrab{width:210px;order:-1}
  .calli{font-size:64px}
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]) .cards .card::after{opacity:.35}
}

.tfilter{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:10px}
.tfilter .chips{margin:0}
.tsearch{font:inherit;padding:6px 12px;border:1px solid var(--line);border-radius:999px;background:var(--surface);color:var(--ink);min-width:200px}
.tcard[hidden]{display:none}
.tcard .eyebrow{margin-bottom:4px}
.st-play{justify-self:start;margin:2px 0 6px}
.og{display:inline-block;margin-top:4px;margin-inline-end:12px;color:#d7e6df;font-size:15px}
.og .ar{color:#ffe8b0}
.gloss .latin{color:#f3d58a;font-size:15px}

footer{border-top:1px solid var(--line);padding:22px 0 34px;color:var(--muted);font-size:14px}
.foot p{margin:0 0 6px}
.foot-links{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:6px}
.foot-links a{color:var(--muted)}
.toast{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:10px 16px;border-radius:10px;font-size:14px;display:none;z-index:40;max-width:90vw}
.toast.show{display:block}

@media (max-width:820px){
  .split,.letter-top{grid-template-columns:1fr}
  .big-letter{font-size:100px}
}
@media (max-width:520px){
  .forms{grid-template-columns:repeat(2,1fr)}
  .ex-row{grid-template-columns:1fr auto}
  .ex-row .ar{grid-column:1 / -1}
  .opts{grid-template-columns:1fr}
  .lesson-list a{grid-template-columns:36px 1fr}
  .lesson-list > li > a > .ar{display:none}
  nav.tabs{order:3;width:100%;margin-inline-start:0;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}
  nav.tabs a{white-space:nowrap}
  .ayah{font-size:27px}
  .w{min-width:64px}
  .lang{margin-inline-start:auto}
}
@media (prefers-reduced-motion: reduce){ .flash-in{transition:none} }
/* ================= Harf premium layer: parchment, emerald and gold-leaf ================= */
:root{
  --bg:#f7f2e7; --surface:#fffdf8; --ink:#16241f; --muted:#5d6a63;
  --accent:#0b5d4b; --accent-2:#08463a; --accent-soft:#e7f0ea; --gold:#9a6d14; --gold-2:#c9973a; --gold-3:#ecd08a;
  --line:#e6dcc6; --line-2:#d9caa6;
  --shadow:0 1px 2px rgba(70,48,10,.05),0 10px 28px -14px rgba(70,48,10,.22);
  --shadow-lg:0 2px 4px rgba(70,48,10,.06),0 24px 50px -22px rgba(40,30,10,.38);
  --arabic:"Amiri","Noto Naskh Arabic","Traditional Arabic",serif;
  --display:"Fraunces",Georgia,serif;
}
@media (prefers-color-scheme: dark){
  :root:not([data-theme="light"]){
    --bg:#0b1412; --surface:#121e1a; --ink:#ece7da; --muted:#a3ada6; --accent:#5cc7a8; --accent-2:#3aa889; --accent-soft:#16302a;
    --gold:#e0b45a; --gold-2:#d3a24a; --gold-3:#f0d595; --line:#25332e; --line-2:#3a4a42;
    --shadow:0 1px 2px rgba(0,0,0,.3),0 10px 28px -14px rgba(0,0,0,.6); --shadow-lg:0 24px 50px -22px rgba(0,0,0,.7);
  }
}
body{background-color:var(--bg);background-image:radial-gradient(1200px 600px at 50% -200px,rgba(201,151,58,.10),transparent 70%);background-repeat:no-repeat;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}
::selection{background:rgba(201,151,58,.28)}
h1,h2,h3{letter-spacing:-.01em;font-variation-settings:"SOFT" 50,"WONK" 0}
html[lang="ur"] h1,html[lang="ur"] h2,html[lang="ur"] h3{letter-spacing:0}
h1{font-weight:600}
.ar{font-feature-settings:"kern","liga","calt"}
a{text-decoration-color:rgba(11,93,75,.35);text-underline-offset:3px}
a:hover{text-decoration-color:currentColor}

/* Header */
header.top{background:rgba(247,242,231,.86);-webkit-backdrop-filter:saturate(1.4) blur(14px);backdrop-filter:saturate(1.4) blur(14px);box-shadow:none;border-bottom:1px solid var(--line)}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) header.top{background:rgba(11,20,18,.86)}}
header.top::after{height:3px;background:linear-gradient(90deg,transparent,var(--gold-2) 20%,var(--gold-3) 50%,var(--gold-2) 80%,transparent);opacity:.85}
.bar{padding:10px 0;gap:18px}
.brand{gap:10px}
.brand::before{content:"";width:34px;height:34px;flex:none;background:__STAR__ center/contain no-repeat;filter:drop-shadow(0 2px 3px rgba(120,80,10,.25))}
.brand .ar{font-size:30px;color:var(--accent);line-height:1.2;margin-top:-4px}
.brand b{font-size:23px;font-weight:600;letter-spacing:.01em}
nav.tabs{gap:4px}
nav.tabs a{position:relative;padding:6px 12px;border-radius:8px;color:var(--muted);font-weight:600;font-size:15.5px;transition:color .15s,background .15s}
nav.tabs a:hover{color:var(--accent);background:rgba(11,93,75,.06)}
nav.tabs a[aria-current="page"]{background:transparent;color:var(--accent)}
nav.tabs a[aria-current="page"]::after{content:"";position:absolute;left:50%;bottom:-2px;width:7px;height:7px;transform:translateX(-50%) rotate(45deg);background:var(--gold-2);border-radius:1px}
.lang{border-color:var(--line-2);padding:4px 14px;background:transparent;transition:all .15s}
.lang:hover{background:var(--accent);border-color:var(--accent);color:#fff}

/* Buttons */
.btn{border-radius:10px;border-color:var(--line-2);padding:8px 16px;box-shadow:0 1px 0 rgba(255,255,255,.6) inset,0 1px 2px rgba(70,48,10,.06);transition:transform .12s,box-shadow .15s,border-color .15s,background .15s}
.btn:hover{border-color:var(--gold-2);transform:translateY(-1px);box-shadow:0 6px 14px -8px rgba(70,48,10,.35)}
.btn:active{transform:none}
.btn.primary{background:linear-gradient(180deg,#0f6e59,#0a5242);border-color:#09493b;color:#fff;box-shadow:0 1px 0 rgba(255,255,255,.18) inset,0 8px 18px -10px rgba(8,70,58,.7)}
.btn.primary:hover{background:linear-gradient(180deg,#127b63,#0b5b49);border-color:#09493b}
.btn.gold{background:linear-gradient(180deg,#f2cf7c,#d39f3c);border-color:#b98524;color:#2a1b02;box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 10px 22px -10px rgba(150,100,20,.8)}
.btn.gold:hover{background:linear-gradient(180deg,#f7da92,#dcab4a)}
.btn.ghost{border-color:rgba(243,213,138,.55);color:#fbf3dd;box-shadow:none}
.btn.ghost:hover{background:rgba(243,213,138,.12);border-color:#f3d58a}
.btn.on,.btn[aria-pressed="true"]{background:var(--accent-soft);border-color:var(--accent);color:var(--accent)}
[data-say]::before,#say::before{content:"";display:inline-block;width:1.05em;height:1.05em;margin-inline-end:.45em;vertical-align:-.17em;background:currentColor;-webkit-mask:__SPK__ center/contain no-repeat;mask:__SPK__ center/contain no-repeat}
html[dir="rtl"] [data-say]::before,html[dir="rtl"] #say::before{transform:scaleX(-1)}
.chip{border-color:var(--line-2);transition:all .15s}
.chip:hover{border-color:var(--gold-2);color:var(--ink)}
.chip[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:#fff}

/* Hero: illuminated panel */
.hero{padding:56px 52px;border-radius:28px;gap:40px;
  background:radial-gradient(90% 120% at 82% 18%,#15876b 0%,#0c654f 34%,#073d33 78%,#052c25 100%);
  box-shadow:0 30px 60px -30px rgba(5,44,37,.85),0 0 0 1px rgba(201,151,58,.35)}
.hero::before{opacity:.55;background-size:64px 64px}
.hero::after{inset:12px;border:1px solid rgba(236,208,138,.5);border-radius:20px;
  background:__STAR__ 10px 10px/18px no-repeat,__STAR__ calc(100% - 10px) 10px/18px no-repeat,__STAR__ 10px calc(100% - 10px)/18px no-repeat,__STAR__ calc(100% - 10px) calc(100% - 10px)/18px no-repeat;
  box-shadow:inset 0 0 0 5px rgba(5,44,37,.0),inset 0 0 0 6px rgba(236,208,138,.18)}
.hero h1{font-size:clamp(34px,4.6vw,54px);line-height:1.08;font-weight:600;letter-spacing:-.02em;text-shadow:0 2px 18px rgba(0,0,0,.25)}
html[lang="ur"] .hero h1{font-size:clamp(28px,3.6vw,40px);line-height:1.9}
.hero .eyebrow{display:inline-flex;align-items:center;gap:10px;color:var(--gold-3);letter-spacing:.14em;font-size:12px}
.hero .eyebrow::before{content:"";width:28px;height:1px;background:linear-gradient(90deg,transparent,var(--gold-3))}
.hero .lead{color:#d6e7df;font-size:18.5px;line-height:1.7;max-width:56ch}
.hero .row{gap:12px;margin-top:6px}
.hero .btn{padding:11px 22px;font-size:16.5px;border-radius:12px}
.hero-note a{color:var(--gold-3);text-decoration-color:rgba(236,208,138,.4)}
.mihrab{width:min(320px,100%);padding:3px;background:linear-gradient(160deg,#fbe7ad,#c9973a 40%,#8a5d10 70%,#e9c46f);box-shadow:0 30px 50px -20px rgba(0,0,0,.65),0 0 0 6px rgba(236,208,138,.12),0 0 60px rgba(243,213,138,.18)}
.mihrab-in{border:0;background:__ROSETTE__ center 40%/88% no-repeat,radial-gradient(80% 60% at 50% 38%,#127160 0%,#0a4b3e 55%,#052c25 100%)}
.mihrab-in::before{opacity:.25}
.mihrab-in::after{content:"";position:absolute;inset:12px;border:1px solid rgba(236,208,138,.55);border-radius:999px 999px 8px 8px;pointer-events:none}
.calli{font-size:104px;color:#f7dc94;background:linear-gradient(180deg,#fff1c4 10%,#e8bd5c 55%,#b8862a 95%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;text-shadow:none;filter:drop-shadow(0 4px 6px rgba(0,0,0,.45))}
.mihrab-in small{color:var(--gold-3);letter-spacing:.32em;font-size:12px;opacity:.9}
.mihrab-in small::before,.mihrab-in small::after{content:"◆";font-size:7px;margin:0 10px;vertical-align:2px;opacity:.8}

/* Stats */
.stats{gap:14px;margin-top:-6px}
.stat{position:relative;border:1px solid var(--line);border-top:0;border-radius:16px;padding:18px 20px 16px;background:linear-gradient(180deg,var(--surface),var(--surface));box-shadow:var(--shadow);overflow:hidden}
.stat::before{content:"";position:absolute;inset:0 0 auto;height:3px;background:linear-gradient(90deg,var(--gold-2),var(--gold-3),var(--gold-2))}
.stat::after{content:"";position:absolute;inset-inline-end:16px;top:16px;width:22px;height:22px;background:__STAR__ center/contain no-repeat;opacity:.9}
.stat strong{font-size:30px;font-weight:600;color:var(--accent)}
.stat span{font-size:14px;letter-spacing:.02em}
.meter{height:5px;background:var(--accent-soft)}
.meter i{background:linear-gradient(90deg,var(--accent),#1a9a7c)}

/* Ornamental section headings */
h2.orn{gap:18px;font-weight:600;font-size:28px;margin-bottom:22px}
html[lang="ur"] h2.orn{font-size:23px}
h2.orn::before{height:14px;background:__STAR__ right center/14px no-repeat,linear-gradient(90deg,transparent,var(--gold-2)) left center/calc(100% - 22px) 1px no-repeat}
h2.orn::after{height:14px;background:__STAR__ left center/14px no-repeat,linear-gradient(270deg,transparent,var(--gold-2)) right center/calc(100% - 22px) 1px no-repeat}
html[dir="rtl"] h2.orn::before{background:__STAR__ left center/14px no-repeat,linear-gradient(270deg,transparent,var(--gold-2)) right center/calc(100% - 22px) 1px no-repeat}
html[dir="rtl"] h2.orn::after{background:__STAR__ right center/14px no-repeat,linear-gradient(90deg,transparent,var(--gold-2)) left center/calc(100% - 22px) 1px no-repeat}

/* Cards */
.cards{gap:18px}
.card{border-radius:18px;border-color:var(--line);box-shadow:var(--shadow);transition:transform .2s ease,box-shadow .2s ease,border-color .2s}
.cards .card::after{content:"";inset:0 0 auto;top:0;inset-inline-end:auto;width:100%;height:3px;background:linear-gradient(90deg,var(--gold-2),var(--gold-3),var(--gold-2));background-image:linear-gradient(90deg,var(--gold-2),var(--gold-3),var(--gold-2));transform:scaleX(0);transform-origin:center;opacity:1;transition:transform .3s ease;left:0}
a.card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);border-color:var(--line-2)}
a.card:hover::after{transform:scaleX(1);opacity:1}
.card h3{font-weight:600;font-size:20px}
.card .cg{display:block;font-family:"Aref Ruqaa","Amiri",serif;font-weight:700;font-size:30px;line-height:1.5;color:var(--gold-2);direction:rtl;text-align:end;margin:-6px 0 2px;opacity:.95;transition:color .2s}
a.card:hover .cg{color:var(--gold)}
.card .go{display:block;margin-top:12px;color:var(--gold-2);font-weight:700;transition:transform .2s}
a.card:hover .go{transform:translateX(4px)}
html[dir="rtl"] a.card:hover .go{transform:translateX(-4px)}
.card:has(.cg){padding:20px 22px 18px}

/* Tale cards */
.tcard{display:flex;flex-direction:column}
.tcard .eyebrow{font-size:11px;letter-spacing:.12em;color:var(--gold)}
.tcard h3{font-size:19px;line-height:1.25;margin-bottom:auto;padding-bottom:10px}
.tcard p:last-child{margin-top:8px;padding-top:10px;border-top:1px solid var(--line);text-align:end}
.tcard p .ar{font-size:25px;color:var(--accent);line-height:1.6}
.tsearch{padding:8px 16px;border-color:var(--line-2);box-shadow:var(--shadow)}
.tsearch:focus{outline:none;border-color:var(--gold-2);box-shadow:0 0 0 4px rgba(201,151,58,.18)}

/* Boxes and support banner */
.box{border-radius:16px;border-color:var(--line);border-inline-start:3px solid var(--gold-2);box-shadow:var(--shadow)}
.box.support{position:relative;overflow:hidden;border:0;color:#f4efe0;padding:26px 30px;background:radial-gradient(100% 160% at 100% 0%,#13806a,#0a5242 50%,#063a30)}
.box.support::before{content:"";position:absolute;inset:0;background-image:__PAT__;background-size:60px 60px;opacity:.35;pointer-events:none}
.box.support::after{content:"";position:absolute;inset:8px;border:1px solid rgba(236,208,138,.4);border-radius:11px;pointer-events:none}
.box.support > *{position:relative;z-index:1}
.box.support strong{color:var(--gold-3)}
.box.support .btn.primary{background:linear-gradient(180deg,#f2cf7c,#d39f3c);border-color:#b98524;color:#2a1b02}

/* Lists, letters, rows */
.lesson-list a,.ex-row,.ph,.pw,.verse,.fact,.groups li,.lt,.quiz,.letter-top,details.practice,.forms div{border-color:var(--line);box-shadow:var(--shadow)}
.lesson-list a{border-radius:16px;transition:transform .15s,box-shadow .2s,border-color .2s}
.lesson-list a:hover{transform:translateY(-2px);box-shadow:var(--shadow-lg);border-color:var(--gold-2)}
.lesson-list .num{display:grid;place-items:center;width:44px;height:44px;font-size:18px;font-weight:700;color:#fff;background:__STAR__ center/contain no-repeat;text-shadow:0 1px 2px rgba(80,50,0,.5)}
.lesson-list > li > a > .ar{font-size:28px}
.lt{border-radius:14px;transition:transform .15s,box-shadow .2s,border-color .2s}
.lt:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg);border-color:var(--gold-2)}
.lt .ar{font-size:44px;color:var(--accent)}
.lt.done{background:linear-gradient(180deg,var(--accent-soft),var(--surface))}
.big-letter{color:var(--accent);text-shadow:0 6px 24px rgba(11,93,75,.15)}
.letter-top{border-radius:20px;background:radial-gradient(60% 120% at 0% 50%,rgba(201,151,58,.08),transparent 70%),var(--surface)}
.anum{border-color:var(--gold-2);background:radial-gradient(circle,rgba(201,151,58,.12),transparent 70%)}
.surah-name{font-family:"Aref Ruqaa","Amiri",serif;font-size:38px}
.verse{border-radius:18px}
.w{border-radius:12px;background:var(--surface)}
.w:hover{border-color:var(--gold-2)}
.flash .face{border-radius:22px;box-shadow:var(--shadow-lg)}
.face .ar{color:var(--accent)}
.face.back{background:linear-gradient(180deg,var(--accent-soft),var(--surface))}
table.words{border-radius:14px;overflow:hidden;box-shadow:var(--shadow);border-color:var(--line)}
.words th{background:linear-gradient(180deg,#f3ecdc,#efe6d2);color:var(--gold);letter-spacing:.03em}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .words th{background:var(--surface)}}
.quiz{border-radius:20px}
.opt{border-radius:14px;background:var(--surface);transition:all .15s}
.opt:hover{border-color:var(--gold-2)}
.crumbs{font-size:13.5px;letter-spacing:.01em}
.crumbs a{text-decoration-color:var(--line-2)}
.eyebrow{letter-spacing:.12em;font-size:12px}
h1 .ar{font-family:"Aref Ruqaa","Amiri",serif;font-weight:700;color:var(--gold-2)}

/* Reading pages: manuscript-style reader */
.story-tools{gap:8px;margin:18px 0 16px;padding:6px;background:var(--surface);border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow);width:fit-content;max-width:100%}
.story-tools .btn{border:0;box-shadow:none;background:transparent;padding:7px 14px;font-size:15px}
.story-tools .btn:hover{background:var(--accent-soft);transform:none}
.story-tools .btn.sm{background:linear-gradient(180deg,#0f6e59,#0a5242);color:#fff;font-size:15px;padding:7px 16px}
.story-tools .btn[aria-pressed="true"]{background:var(--accent-soft);color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.story{position:relative;max-width:860px;padding:40px 48px 28px;border-radius:6px;border:1px solid var(--line-2);
  background:radial-gradient(120% 80% at 50% 0%,#fffdf6,#fbf5e6 70%,#f5ecd6);box-shadow:var(--shadow-lg)}
.story::before{content:"";position:absolute;inset:10px;border:1px solid rgba(201,151,58,.55);outline:1px solid rgba(201,151,58,.25);outline-offset:4px;pointer-events:none;border-radius:2px}
.story::after{content:"";position:absolute;left:50%;top:-11px;width:22px;height:22px;transform:translateX(-50%);background:__STAR__ center/contain no-repeat}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .story{background:radial-gradient(120% 80% at 50% 0%,#17251f,#121e1a 70%)}}
.st{grid-template-columns:1fr auto;column-gap:14px;align-items:start;padding:12px 0;margin:0}
.st + .st{border-top:1px dashed rgba(201,151,58,.35)}
.st > .ar{grid-column:1;font-size:31px;line-height:2.15;color:var(--ink)}
.st > .st-tr,.st > .st-m{grid-column:1}
.st-tr{text-align:right;direction:ltr;color:var(--gold)}
.st-m{font-size:16px;line-height:1.55;padding-top:2px}
html[lang="ur"] .st-m{line-height:2.1}
.st-play{grid-column:2;grid-row:1;align-self:center;justify-self:end;margin:0;width:38px;height:38px;padding:0;border-radius:50%;display:inline-grid;place-items:center;color:var(--accent);border-color:var(--line-2);background:var(--surface)}
.st-play::before{margin:0!important;width:17px!important;height:17px!important}
.st-play:hover{background:var(--accent);color:#fff;border-color:var(--accent)}
.rw{padding:0 3px;border-radius:6px;transition:background .12s,color .12s}
.rw:hover,.rw.on{background:rgba(201,151,58,.18);color:var(--accent);box-shadow:inset 0 -2px 0 var(--gold-2)}
.gloss{max-width:860px;border-radius:16px;padding:12px 20px;color:#f4efe0;border:1px solid rgba(236,208,138,.45);
  background:linear-gradient(180deg,rgba(9,72,59,.97),rgba(5,44,37,.97));-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 18px 40px -16px rgba(0,0,0,.55)}
.gloss .ar{color:var(--gold-3);font-size:28px}

/* Pager */
.pager{border-top:0;position:relative;padding-top:26px}
.pager::before{content:"";position:absolute;top:0;left:0;right:0;height:14px;background:__STAR__ center/14px no-repeat,linear-gradient(90deg,transparent,var(--gold-2),transparent) center/100% 1px no-repeat}

/* Footer: emerald with gold */
footer{margin-top:40px;padding:56px 0 40px;color:#c9d9d2;background:radial-gradient(80% 140% at 50% 0%,#0c5a49,#073a31 60%,#052a23);border-top:0}
footer::before{height:6px;background-color:transparent;background-image:linear-gradient(90deg,#8a5d10,#ecd08a 30%,#c9973a 50%,#ecd08a 70%,#8a5d10)}
footer::after{content:"";position:absolute;inset:6px 0 0;background-image:__PAT__;background-size:64px 64px;opacity:.25;pointer-events:none;-webkit-mask-image:linear-gradient(180deg,#000,transparent 85%);mask-image:linear-gradient(180deg,#000,transparent 85%)}
.foot{position:relative;z-index:1;text-align:center;display:grid;justify-items:center;gap:6px}
.foot::before{content:"حَرْف";font-family:"Aref Ruqaa","Amiri",serif;font-weight:700;font-size:44px;line-height:1.3;background:linear-gradient(180deg,#fff1c4,#d8a94d);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.foot strong{color:#fbf3dd}
.foot-links{justify-content:center;gap:22px;margin:8px 0}
.foot-links a{color:var(--gold-3);text-decoration:none;font-weight:600}
.foot-links a:hover{color:#fff;text-decoration:underline}
.foot .small{opacity:.7}
.toast{background:#073a31;color:#f4efe0;border:1px solid rgba(236,208,138,.4);border-radius:12px}

@media (max-width:820px){
  .hero{padding:40px 24px 34px;gap:22px;text-align:center}
  .hero .row{justify-content:center}
  .hero .eyebrow{justify-content:center}
  .hero .eyebrow::before{display:none}
  .hero .lead{margin-inline:auto}
  .mihrab{width:200px}
  .calli{font-size:70px}
  .story{padding:30px 22px 20px}
  .st > .ar{font-size:27px}
}
@media (max-width:520px){
  .bar{gap:8px 12px;padding:8px 0 0}
  nav.tabs{padding:4px 0 10px;-webkit-mask-image:linear-gradient(90deg,#000 85%,transparent);mask-image:linear-gradient(90deg,#000 85%,transparent)}
  html[dir="rtl"] nav.tabs{-webkit-mask-image:linear-gradient(270deg,#000 85%,transparent);mask-image:linear-gradient(270deg,#000 85%,transparent)}
  nav.tabs a[aria-current="page"]::after{bottom:0}
  .stats{grid-template-columns:1fr 1fr 1fr;gap:8px}
  .stat{padding:14px 12px}
  .stat strong{font-size:21px}
  .stat::after{display:none}
  .stat span{font-size:12.5px}
  h2.orn{font-size:23px;gap:10px}
  .story-tools{width:100%}
  .story-tools .btn{font-size:14px;padding:6px 10px}
  .st-play{width:34px;height:34px}
}

/* Home card grid: two featured cards make a clean 4 x 3 layout */
.card:has(.cg){display:flex;flex-direction:column}
.card .go{margin-top:auto;padding-top:12px}
@media (min-width:900px){
  .cards:has(> .card.wide){grid-template-columns:repeat(4,1fr)}
  .card.wide{grid-column:span 2;color:#f4efe0;border-color:transparent;background:radial-gradient(120% 160% at 100% 0%,#13806a,#0a5242 55%,#063a30);overflow:hidden}
  .card.wide::before{content:"";position:absolute;inset-inline-end:-40px;top:50%;width:220px;height:220px;transform:translateY(-50%);background:__ROSETTE__ center/contain no-repeat;opacity:.7;pointer-events:none}
  .card.wide h3{color:#fff;font-size:24px}
  .card.wide p{color:#cfe1d9;max-width:34ch}
  .card.wide .cg{color:var(--gold-3);font-size:40px;direction:inherit;text-align:start;position:relative;margin-bottom:6px}
  .card.wide .go{color:var(--gold-3)}
  a.card.wide:hover .cg{color:#fff1c4}
}

@media (max-width:620px){
  .cards:has(> .card .cg){grid-template-columns:1fr 1fr;gap:10px}
  .card:has(.cg){padding:14px 14px 12px;border-radius:14px}
  .card .cg{font-size:24px;margin:-4px 0 0}
  .card:has(.cg) h3{font-size:16.5px;margin-bottom:4px}
  .card:has(.cg) p{font-size:13.5px;line-height:1.45}
  html[lang="ur"] .card:has(.cg) p{line-height:2}
  .card .go{display:none}
  .card.wide{grid-column:1 / -1;color:#f4efe0;border-color:transparent;background:radial-gradient(120% 160% at 100% 0%,#13806a,#0a5242 55%,#063a30)}
  .card.wide h3{color:#fff}.card.wide p{color:#cfe1d9}.card.wide .cg{color:var(--gold-3)}
}
html[lang="ur"] .hero .lead{line-height:2.35;font-size:16.5px}
html[lang="ur"] .hero .eyebrow{font-size:14px;letter-spacing:0}

/* Lesson picture boards */
.pics{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;max-width:900px}
.pic{display:grid;justify-items:center;gap:2px;padding:16px 12px 14px;background:var(--surface);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow);color:var(--ink);text-align:center;transition:transform .15s,box-shadow .2s,border-color .2s}
.pic[data-say]::before{display:none}
.pic:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg);border-color:var(--gold-2)}
.pic svg{width:104px;height:104px;color:var(--accent);margin-bottom:6px;padding:8px;border-radius:50%;background:radial-gradient(circle,rgba(201,151,58,.12),transparent 70%);overflow:visible}
.pic svg .s{fill:var(--fill,var(--accent-soft))}
.pic svg .g{fill:var(--gfill,var(--gold-3));stroke:var(--gold)}
.pic .ar{font-size:24px;line-height:1.7}
.pic .mean{font-size:14px;color:var(--muted);line-height:1.4}
html[lang="ur"] .pic .mean{line-height:2}
.pic:active svg{transform:scale(.96)}
@media (min-width:521px){.pics:has(> .pic:nth-child(6):last-child),.pics:has(> .pic:nth-child(3):last-child){grid-template-columns:repeat(3,1fr);max-width:690px}}
@media (max-width:520px){.pics{grid-template-columns:1fr 1fr;gap:10px}.pic svg{width:84px;height:84px}.pic .ar{font-size:21px}}
@media (prefers-reduced-motion: reduce){ .card,.btn,.lt,.lesson-list a{transition:none} a.card:hover,.btn:hover{transform:none} }
`;

const APP_JS = String.raw`(function () {
  'use strict';
  var doc = document;
  var L = doc.documentElement.lang === 'ur' ? 'ur' : 'en';
  var S = L === 'ur' ? {
    noVoice: 'آپ کے آلے میں عربی آواز نہیں ملی۔ ٹیکسٹ ٹو اسپیچ کی سیٹنگز میں عربی شامل کریں۔',
    noAudio: 'اس براؤزر میں آواز دستیاب نہیں۔',
    learned: '✓ سیکھ لیا', markLearned: 'سیکھ لیا؟ نشان لگائیں',
    known: '✓ یاد ہے', markKnown: 'یاد ہے؟ نشان لگائیں',
    score: 'اسکور', next: 'اگلا ←', finished: 'مکمل', youScored: 'آپ کا اسکور',
    again: 'نیا سیٹ', question: 'سوال', hideGuide: 'رہنما حرف چھپائیں', showGuide: 'رہنما حرف دکھائیں', root: 'مادہ', origin: 'ماخذ', related: 'اسی مادے سے',
    q1: 'یہ کون سا حرف ہے؟', q2: 'یہ حرف تلاش کریں:', q3: 'اس کا مطلب کیا ہے؟', q4: 'اسے عربی میں کیسے کہیں گے؟', q5: 'تصویر کے لیے صحیح لفظ چنیں:',
    great: 'بہت خوب! اب کوئی نیا موضوع آزمائیں۔', good: 'اچھی پیش رفت۔ فلیش کارڈز دہرائیں اور دوبارہ کوشش کریں۔', keep: 'ہمت نہ ہاریں۔ حروف دہرائیں اور پھر کوشش کریں۔'
  } : {
    noVoice: 'No Arabic voice found. Add Arabic in your device’s text-to-speech settings.',
    noAudio: 'Audio isn’t available in this browser.',
    learned: '✓ Learned', markLearned: 'Mark as learned',
    known: '✓ Known', markKnown: 'Mark as known',
    score: 'Score', next: 'Next →', finished: 'Finished', youScored: 'You scored',
    again: 'Try another set', question: 'Question', hideGuide: 'Hide guide', showGuide: 'Show guide', root: 'Root', origin: 'Origin', related: 'Same root',
    q1: 'Which letter is this?', q2: 'Find the letter called…', q3: 'What does this mean?', q4: 'How do you say this in Arabic?', q5: 'Which word matches the picture?',
    great: 'Excellent work. Try a new topic next.', good: 'Good progress. Review the flashcards and go again.', keep: 'Keep going. Practise the alphabet, then try again.'
  };
  function N(x) { x = String(x); return L === 'ur' ? x.replace(/[0-9]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.charAt(+d); }) : x; }
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var store = {
    get: function (k, d) { try { var v = window.localStorage.getItem('harf_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { window.localStorage.setItem('harf_' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var toastTimer;
  function toast(msg) {
    var t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3500);
  }

  var arVoice = null;
  function pickVoice() {
    try { var v = window.speechSynthesis.getVoices(); arVoice = null; for (var i = 0; i < v.length; i++) { if (/^ar/i.test(v[i].lang)) { arVoice = v[i]; break; } } } catch (e) {}
  }
  try { pickVoice(); window.speechSynthesis.onvoiceschanged = pickVoice; } catch (e) {}
  function speak(text) {
    try {
      if (!('speechSynthesis' in window)) throw 0;
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA'; u.rate = 0.8; if (arVoice) u.voice = arVoice;
      window.speechSynthesis.speak(u);
      if (!arVoice) setTimeout(function () { pickVoice(); if (!arVoice) toast(S.noVoice); }, 600);
    } catch (e) { toast(S.noAudio); }
  }
  doc.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-say]') : null;
    if (b) { e.preventDefault(); e.stopPropagation(); speak(b.getAttribute('data-say')); }
  }, true);

  function has(a, x) { return a.indexOf(x) > -1; }
  function toggle(a, x) { var i = a.indexOf(x); if (i > -1) a.splice(i, 1); else a.push(x); return a; }

  var learned = store.get('letters', []);
  var lb = $('#learn');
  if (lb) {
    var slug = lb.getAttribute('data-slug');
    var paintL = function () { var on = has(learned, slug); lb.textContent = on ? S.learned : S.markLearned; lb.classList.toggle('on', on); lb.setAttribute('aria-pressed', on ? 'true' : 'false'); };
    paintL();
    lb.addEventListener('click', function () { toggle(learned, slug); store.set('letters', learned); paintL(); });
  }
  $$('.lt[data-slug]').forEach(function (a) { if (has(learned, a.getAttribute('data-slug'))) a.classList.add('done'); });

  var st = $('#stats');
  if (st) {
    var known0 = store.get('known', []), best0 = store.get('best', null);
    var tl = +st.getAttribute('data-letters'), tw = +st.getAttribute('data-words');
    $('#sLetters').textContent = N(learned.length) + '/' + N(tl);
    $('#mLetters').style.width = Math.min(100, learned.length / tl * 100) + '%';
    $('#sWords').textContent = N(known0.length) + '/' + N(tw);
    $('#mWords').style.width = Math.min(100, known0.length / tw * 100) + '%';
    $('#sBest').textContent = best0 === null ? '–' : N(best0) + '/' + N(10);
    $('#mBest').style.width = best0 === null ? '0' : (best0 * 10) + '%';
  }

  var fc = $('#flash');
  if (fc) {
    var rows = $$('tr[data-ar]');
    var deck = rows.map(function (r) { return { ar: r.getAttribute('data-ar'), tr: r.getAttribute('data-tr'), m: r.getAttribute('data-m'), key: r.getAttribute('data-key'), pic: r.getAttribute('data-pic') || '', row: r }; });
    var known = store.get('known', []);
    var idx = 0;
    var render = function () {
      var w = deck[idx];
      fc.classList.remove('flipped');
      $('#fPic').textContent = w.pic; $('#fAr').textContent = w.ar; $('#fAr2').textContent = w.ar; $('#fTr').textContent = w.tr; $('#fM').textContent = w.m;
      $('#count').textContent = N(idx + 1) + '/' + N(deck.length);
      var k = has(known, w.key), kb = $('#known');
      kb.textContent = k ? S.known : S.markKnown; kb.classList.toggle('on', k);
      deck.forEach(function (d, i) { d.row.classList.toggle('cur', i === idx); d.row.classList.toggle('is-known', has(known, d.key)); });
    };
    var flip = function () { fc.classList.toggle('flipped'); };
    fc.addEventListener('click', flip);
    fc.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } });
    $('#prev').addEventListener('click', function () { idx = (idx - 1 + deck.length) % deck.length; render(); });
    $('#next').addEventListener('click', function () { idx = (idx + 1) % deck.length; render(); });
    $('#say').addEventListener('click', function () { speak(deck[idx].ar); });
    $('#known').addEventListener('click', function () { toggle(known, deck[idx].key); store.set('known', known); render(); });
    rows.forEach(function (r, i) { r.addEventListener('click', function () { idx = i; render(); fc.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }); });
    render();
  }


  var trc = $('.trace');
  if (trc) {
    var forms = trc.getAttribute('data-forms').split('|'), fi = 0, guide = true, strokes = [], cur = null;
    var cv = $('canvas', trc), cx = cv.getContext('2d');
    var cssv = function (n) { return getComputedStyle(doc.documentElement).getPropertyValue(n).trim(); };
    var draw = function () {
      var w = cv.clientWidth, h = cv.clientHeight, base = h * 0.68;
      cx.clearRect(0, 0, w, h);
      cx.strokeStyle = cssv('--line'); cx.lineWidth = 1.5; cx.setLineDash([6, 6]);
      cx.beginPath(); cx.moveTo(10, base); cx.lineTo(w - 10, base); cx.stroke(); cx.setLineDash([]);
      if (guide) { cx.fillStyle = cssv('--line'); cx.font = Math.round(h * 0.72) + 'px "Noto Naskh Arabic", serif'; cx.textAlign = 'center'; try { cx.direction = 'rtl'; } catch (e) {} cx.fillText(forms[fi], w / 2, base); }
      cx.strokeStyle = cssv('--accent'); cx.lineWidth = Math.max(6, h / 32); cx.lineCap = 'round'; cx.lineJoin = 'round';
      strokes.forEach(function (st) { cx.beginPath(); cx.moveTo(st[0][0], st[0][1]); for (var i = 1; i < st.length; i++) cx.lineTo(st[i][0], st[i][1]); if (st.length === 1) cx.lineTo(st[0][0] + 0.1, st[0][1]); cx.stroke(); });
    };
    var fit = function () { var r = cv.getBoundingClientRect(), d = window.devicePixelRatio || 1; cv.width = Math.round(r.width * d); cv.height = Math.round(r.height * d); cx.setTransform(d, 0, 0, d, 0, 0); draw(); };
    var pos = function (e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.addEventListener('pointerdown', function (e) { e.preventDefault(); cur = [pos(e)]; strokes.push(cur); try { cv.setPointerCapture(e.pointerId); } catch (x) {} draw(); });
    cv.addEventListener('pointermove', function (e) { if (!cur) return; cur.push(pos(e)); draw(); });
    var stop = function () { cur = null; };
    cv.addEventListener('pointerup', stop); cv.addEventListener('pointercancel', stop);
    $$('[data-f]', trc).forEach(function (b) {
      b.addEventListener('click', function () {
        fi = +b.getAttribute('data-f'); strokes = [];
        $$('[data-f]', trc).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        draw();
      });
    });
    $('[data-act="clear"]', trc).addEventListener('click', function () { strokes = []; draw(); });
    var gb = $('[data-act="guide"]', trc);
    gb.addEventListener('click', function () { guide = !guide; gb.textContent = guide ? S.hideGuide : S.showGuide; gb.setAttribute('aria-pressed', guide ? 'true' : 'false'); draw(); });
    window.addEventListener('resize', fit);
    fit();
    try { doc.fonts.load('100px "Noto Naskh Arabic"').then(draw); } catch (e) {}
  }

  var wsel = $('#wsel');
  if (wsel) {
    var wbox = $('#ws');
    var showWs = function (v) {
      wbox.className = v ? 'one' : 'ws-all';
      $$('.ws', wbox).forEach(function (sec) { sec.classList.toggle('on', sec.getAttribute('data-slug') === v); });
      try { history.replaceState(null, '', v ? '?l=' + v : location.pathname); } catch (e) {}
    };
    var wm = /[?&]l=([a-z]+)/.exec(location.search);
    if (wm && $('.ws[data-slug="' + wm[1] + '"]')) wsel.value = wm[1];
    showWs(wsel.value);
    wsel.addEventListener('change', function () { showWs(wsel.value); });
    $('#wprint').addEventListener('click', function () { window.print(); });
  }


  var story = $('#story');
  if (story) {
    var gl = $('#gloss'), curW = null;
    var showGloss = function (b) {
      var h = '<span class="ar" lang="ar">' + esc(b.getAttribute('data-w')) + '</span>';
      var tr = b.getAttribute('data-tr'); if (tr) h += ' <span class="latin">' + esc(tr) + '</span>';
      h += ' — ' + esc(b.getAttribute('data-m'));
      if (story.classList.contains('show-o')) {
        var root = b.getAttribute('data-root'), og = b.getAttribute('data-o'), rel = b.getAttribute('data-rel'), x = '';
        if (root) x += '<span class="og">' + S.root + ': <span class="ar" lang="ar">' + esc(root.split(' ').join(' - ')) + '</span></span>';
        if (og) x += '<span class="og">' + S.origin + ': ' + esc(og) + '</span>';
        if (rel) x += '<span class="og">' + S.related + ': ' + rel.split(';;').map(function (r) { var p = r.split('='); return '<span class="ar" lang="ar">' + esc(p[0]) + '</span> ' + esc(p[1] || ''); }).join(' · ') + '</span>';
        if (x) h += '<br>' + x;
      }
      gl.innerHTML = h;
    };
    $$('.rw', story).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.rw.on', story).forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on'); curW = b;
        speak(b.getAttribute('data-w'));
        showGloss(b);
      });
    });
    $$('[data-tog]').forEach(function (t) {
      t.addEventListener('click', function () {
        var c = t.getAttribute('data-tog'), on = !story.classList.contains(c);
        story.classList.toggle(c, on); t.setAttribute('aria-pressed', on ? 'true' : 'false'); t.classList.toggle('on', on);
        if (curW) showGloss(curW);
      });
    });
  }

  var tf = $('#tf');
  if (tf) {
    var lvSel = '', qSel = '';
    var applyF = function () {
      var shown = 0;
      $$('.tcard').forEach(function (c) {
        var ok = (!lvSel || c.getAttribute('data-lv') === lvSel) && (!qSel || c.getAttribute('data-q').indexOf(qSel) > -1);
        c.hidden = !ok; if (ok) shown++;
      });
      $('#tnone').hidden = shown > 0;
    };
    $$('.chip', tf).forEach(function (b) {
      b.addEventListener('click', function () {
        lvSel = b.getAttribute('data-lv');
        $$('.chip', tf).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        applyF();
      });
    });
    $('#tsearch').addEventListener('input', function (e) { qSel = e.target.value.trim().toLowerCase(); applyF(); });
  }

  var lv = $('#lvlbox');
  if (lv) {
    var LD = JSON.parse($('#lvl-data').textContent), li = 0, lsc = 0;
    var mix = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var showL = function () {
      if (li >= LD.qs.length) {
        var r = LD.res.filter(function (x) { return lsc >= x.min; }).pop();
        lv.innerHTML = '<p class="qprompt">' + LD.done + '</p><p class="qbig txt">' + N(lsc) + '/' + N(LD.qs.length) + '</p><h2>' + r.h + '</h2><p>' + r.p + '</p><div class="row"><a class="btn primary" href="' + r.href + '">' + r.cta + '</a><button class="btn" type="button" id="lagain">' + LD.again + '</button></div>';
        $('#lagain').addEventListener('click', function () { li = 0; lsc = 0; showL(); });
        return;
      }
      var q = LD.qs[li], answered = false;
      var counter = L === 'ur' ? N(LD.qs.length) + ' ' + LD.of + ' ' + N(li + 1) : N(li + 1) + ' ' + LD.of + ' ' + LD.qs.length;
      var opts = mix(q.opts).map(function (o) { return '<button class="opt" type="button" data-v="' + esc(o) + '">' + (q.optAr ? '<span class="ar" lang="ar">' + esc(o) + '</span>' : q.latin ? '<span class="latin">' + esc(o) + '</span>' : esc(o)) + '</button>'; }).join('');
      lv.innerHTML = '<p class="qprompt">' + counter + (L === 'ur' ? '، ' : ' · ') + q.p + '</p>' + (q.big ? '<p class="qbig ar" lang="ar">' + esc(q.big) + '</p>' : '') + '<div class="opts">' + opts + '</div><div class="qfoot"><span></span><button class="btn" id="lnext" type="button" disabled>' + LD.next + '</button></div>';
      $$('.opt', lv).forEach(function (b) {
        b.addEventListener('click', function () {
          if (answered) return; answered = true;
          var ok = b.getAttribute('data-v') === q.ans; if (ok) lsc++;
          $$('.opt', lv).forEach(function (x) { if (x.getAttribute('data-v') === q.ans) x.classList.add('right'); });
          if (!ok) b.classList.add('wrong');
          var n = $('#lnext'); n.disabled = false; n.focus();
        });
      });
      $('#lnext').addEventListener('click', function () { li++; showL(); });
    };
    showL();
  }

  var qb = $('#quizbox');
  if (qb) {
    var data = JSON.parse($('#quiz-data').textContent);
    var mode = 'mixed', qs = [], qi = 0, score = 0, answered = false;
    var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var makeQ = function (type) {
      var pick;
      if (type === 'pic') {
        pick = shuffle(data.pics).slice(0, 4);
        return { p: S.q5, big: pick[0][0], bigPic: true, opts: pick.map(function (x) { return x[1]; }), ans: pick[0][1], optAr: true };
      }
      if (type === 'letter') {
        pick = shuffle(data.letters).slice(0, 4);
        return Math.random() < 0.5
          ? { p: S.q1, big: pick[0][0], bigAr: true, opts: pick.map(function (l) { return l[1]; }), ans: pick[0][1], optAr: false }
          : { p: S.q2, big: pick[0][1], bigAr: false, opts: pick.map(function (l) { return l[0]; }), ans: pick[0][0], optAr: true };
      }
      pick = shuffle(type === 'quran' ? data.quran : data.words).slice(0, 4);
      return Math.random() < 0.5
        ? { p: S.q3, big: pick[0][0], bigAr: true, opts: pick.map(function (w) { return w[1]; }), ans: pick[0][1], optAr: false }
        : { p: S.q4, big: pick[0][1], bigAr: false, opts: pick.map(function (w) { return w[0]; }), ans: pick[0][0], optAr: true };
    };
    var renderQ;
    var start = function () {
      qs = [];
      for (var i = 0; i < 10; i++) qs.push(makeQ(mode === 'letters' ? 'letter' : mode === 'words' ? 'word' : mode === 'quran' ? 'quran' : mode === 'pics' ? 'pic' : (i % 2 ? 'word' : 'letter')));
      qi = 0; score = 0; renderQ();
    };
    renderQ = function () {
      if (qi >= qs.length) {
        var best = store.get('best', null);
        if (best === null || score > best) store.set('best', score);
        var msg = score >= 8 ? S.great : score >= 5 ? S.good : S.keep;
        qb.innerHTML = '<p class="qprompt">' + S.finished + '</p><p class="qbig txt">' + S.youScored + ' ' + N(score) + '/' + N(10) + '</p><p class="qmsg">' + msg + '</p><div class="row center"><button class="btn primary" id="again" type="button">' + S.again + '</button></div>';
        $('#again').addEventListener('click', start);
        return;
      }
      var q = qs[qi]; answered = false;
      var opts = shuffle(q.opts).map(function (o) { return '<button class="opt" type="button" data-v="' + esc(o) + '">' + (q.optAr ? '<span class="ar" lang="ar">' + esc(o) + '</span>' : esc(o)) + '</button>'; }).join('');
      var counter = L === 'ur' ? N(10) + ' میں سے ' + N(qi + 1) : N(qi + 1) + ' of 10';
      qb.innerHTML = '<p class="qprompt">' + S.question + ' ' + counter + (L === 'ur' ? '، ' : ' · ') + q.p + '</p>' +
        '<p class="qbig ' + (q.bigPic ? 'pic' : q.bigAr ? 'ar' : 'txt') + '"' + (q.bigAr ? ' lang="ar"' : '') + '>' + esc(q.big) + '</p>' +
        '<div class="opts">' + opts + '</div>' +
        '<div class="qfoot"><span class="score">' + S.score + ' ' + N(score) + '</span><button class="btn" id="qnext" type="button" disabled>' + S.next + '</button></div>';
      $$('.opt', qb).forEach(function (b) {
        b.addEventListener('click', function () {
          if (answered) return; answered = true;
          var ok = b.getAttribute('data-v') === q.ans; if (ok) score++;
          $$('.opt', qb).forEach(function (x) { if (x.getAttribute('data-v') === q.ans) x.classList.add('right'); });
          if (!ok) b.classList.add('wrong');
          $('.score', qb).textContent = S.score + ' ' + N(score);
          var n = $('#qnext'); n.disabled = false; n.focus();
        });
      });
      $('#qnext').addEventListener('click', function () { qi++; renderQ(); });
    };
    $$('#qmode .chip').forEach(function (b) {
      b.addEventListener('click', function () {
        mode = b.getAttribute('data-m');
        $$('#qmode .chip').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        start();
      });
    });
    start();
  }
})();
`;

// ---------------------------------------------------------------- build
function build() {
  CLASSICS = loadClassics();
  const files = {};
  const pages = [];
  const add = (lang, file, html) => { const f = link(lang, file); files[f] = html; pages.push(f); };
  for (const lang of ['en', 'ur']) {
    add(lang, 'index.html', homePage(lang));
    add(lang, 'alphabet.html', alphabetPage(lang));
    LETTERS.forEach((x, i) => add(lang, 'letter-' + x.slug + '.html', letterPage(lang, i)));
    add(lang, 'writing.html', writingPage(lang));
    add(lang, 'lessons.html', lessonsPage(lang));
    LESSONS.forEach((l, i) => add(lang, l.slug + '.html', lessonPage(lang, i)));
    add(lang, 'stories.html', storiesPage(lang));
    add(lang, 'reading.html', readingPage(lang));
    STORIES.forEach((x, i) => add(lang, 'reading-' + x.slug + '.html', storyPage(lang, i)));
    if (CLASSICS.length) { add(lang, 'classic-tales.html', classicsPage(lang)); CLASSICS.forEach((x, i) => add(lang, 'tale-' + x.slug + '.html', classicPage(lang, i))); }
    add(lang, 'level-test.html', levelPage(lang));
    add(lang, 'vocabulary.html', vocabularyPage(lang));
    TOPICS.forEach((t, i) => add(lang, 'vocab-' + t.slug + '.html', topicPage(lang, i)));
    add(lang, 'quran.html', quranPage(lang));
    SURAHS.forEach((x, i) => add(lang, 'quran-' + x.slug + '.html', surahPage(lang, i)));
    add(lang, 'quran-prayer-words.html', prayerPage(lang));
    add(lang, 'quran-common-words.html', quranWordsPage(lang));
    add(lang, 'phrases.html', phrasesPage(lang));
    add(lang, 'saudi-arabic.html', saudiPage(lang));
    add(lang, 'quiz.html', quizPage(lang));
    add(lang, 'about.html', aboutPage(lang));
    add(lang, 'contact.html', contactPage(lang));
    add(lang, 'privacy.html', privacyPage(lang));
  }
  files['404.html'] = notFoundPage();
  files['style.css'] = STYLE_CSS.replace(/__PAT__/g, PATTERN).replace(/__STAR__/g, STAR).replace(/__ROSETTE__/g, ROSETTE).replace(/__SPK__/g, SPK);
  files['app.js'] = APP_JS;
  files['googleba7aa79e24dbfa47.html'] = 'google-site-verification: googleba7aa79e24dbfa47.html'; // Google Search Console ownership, keep this
  files['robots.txt'] = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
  files['sitemap.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + pages.map((f) => `  <url><loc>${pageUrl(f)}</loc></url>`).join('\n') + '\n</urlset>\n';
  if (ADSENSE_CLIENT) files['ads.txt'] = `google.com, ${ADSENSE_CLIENT.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`;
  return files;
}

if (require.main === module) {
  const files = build();
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(OUT, name), content);
  // Copy videos folder into _site
  const videosIn = path.join(__dirname, 'videos');
  if (fs.existsSync(videosIn)) {
    const videosOut = path.join(OUT, 'videos');
    fs.mkdirSync(videosOut, { recursive: true });
    for (const f of fs.readdirSync(videosIn)) fs.copyFileSync(path.join(videosIn, f), path.join(videosOut, f));
  }
  console.log(`Built ${Object.keys(files).length} files into _site`);
}

module.exports = { build };
