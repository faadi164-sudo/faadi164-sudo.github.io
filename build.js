'use strict';
/*
  Harf: free Arabic lessons for English and Urdu speakers.

  This one file holds all of the site's content and builds every page into the _site folder.
  GitHub Actions runs it automatically each time this file changes (see .github/workflows/pages.yml).

  Common edits:
  - Moving to your own domain: change SITE_URL below.
  - Google AdSense approved: put your publisher ID in ADSENSE_CLIENT, e.g. 'ca-pub-1234567890123456'.
  - Contact email: set CONTACT_EMAIL.
  - New words: add rows to TOPICS. New phrases: add rows to PHRASES. New lessons: add to LESSONS.
*/
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------- settings
const SITE_URL = 'https://faadi164-sudo.github.io';
const KOFI_URL = 'https://ko-fi.com/164fawad';
const ADSENSE_CLIENT = '';
const CONTACT_EMAIL = '';
const UPDATED = { en: '2 November 2026', ur: '۲ نومبر ۲۰۲۶' };
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

// ---------------------------------------------------------------- grammar lessons
// Order inspired by classic courses for non-Arabic speakers such as the Madinah books.
// All explanations and example sentences here are original.
const LESSONS = [
  {
    slug: 'lesson-1-this-is', key: 'هٰذَا',
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
    slug: 'lesson-2-that-is', key: 'ذٰلِكَ',
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
    slug: 'lesson-5-feminine', key: 'هٰذِهِ',
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
    slug: 'lesson-8-my-your', key: 'كِتَابِي',
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
];

// ---------------------------------------------------------------- interface text
const T = {
  en: {
    dir: 'ltr', brand: 'Harf', skip: 'Skip to content', navLabel: 'Sections',
    nav: { home: 'Home', alphabet: 'Alphabet', lessons: 'Lessons', vocabulary: 'Vocabulary', phrases: 'Phrases', quiz: 'Quiz' },
    switchLabel: 'اردو', switchTitle: 'یہ صفحہ اردو میں پڑھیں', switchLang: 'ur',
    about: 'About', contact: 'Contact', privacy: 'Privacy policy', support: 'Support Harf',
    listen: '🔊 Listen', sep: '›', prev: '← Previous', next: 'Next →',
    footer: 'Free Arabic lessons for English and Urdu speakers.',
  },
  ur: {
    dir: 'rtl', brand: 'حرف', skip: 'مواد پر جائیں', navLabel: 'حصے',
    nav: { home: 'صفحۂ اول', alphabet: 'حروفِ تہجی', lessons: 'اسباق', vocabulary: 'الفاظ', phrases: 'جملے', quiz: 'کوئز' },
    switchLabel: 'English', switchTitle: 'Read this page in English', switchLang: 'en',
    about: 'ہمارے بارے میں', contact: 'رابطہ', privacy: 'رازداری کی پالیسی', support: 'حرف کی مدد کریں',
    listen: '🔊 سنیں', sep: '‹', prev: '→ پچھلا', next: 'اگلا ←',
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

const FONTS = {
  en: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Noto+Naskh+Arabic:wght@400;600;700&family=Source+Sans+3:wght@400;600;700&display=swap',
  ur: 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Noto+Naskh+Arabic:wght@400;600;700&family=Source+Sans+3:wght@400;600;700&display=swap',
};
const FAVICON = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0d6b57"/><text x="32" y="46" font-size="38" text-anchor="middle" fill="#ffffff" font-family="serif">ح</text></svg>');

function layout(lang, o) {
  const t = T[lang];
  const self = link(lang, o.file);
  const other = link(t.switchLang, o.file);
  const navItems = [['index.html', 'home'], ['alphabet.html', 'alphabet'], ['lessons.html', 'lessons'], ['vocabulary.html', 'vocabulary'], ['phrases.html', 'phrases'], ['quiz.html', 'quiz']]
    .map(([f, k]) => `<a href="${link(lang, f)}"${o.section === k ? ' aria-current="page"' : ''}>${t.nav[k]}</a>`).join('');
  const ads = ADSENSE_CLIENT
    ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}" crossorigin="anonymous"></script>\n` : '';
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
${ads}</head>
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
      ['lessons.html', 'گرامر کے اسباق', `${n(LESSONS.length)} مختصر اسباق، پہلے جملے سے اپنے بارے میں بات کرنے تک۔`],
      ['vocabulary.html', 'الفاظ', `${n(TOPICS.length)} موضوعات میں روزمرہ کے ${n(totalWords)} الفاظ، سلام سے رنگوں تک، فلیش کارڈز کے ساتھ۔`],
      ['phrases.html', 'جملے', `ملنے جلنے، خریداری اور راستہ پوچھنے کے لیے ${n(PHRASES.length)} جملے۔`],
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
      ['lessons.html', 'Grammar lessons', `${LESSONS.length} short lessons, from your first sentence to talking about yourself.`],
      ['vocabulary.html', 'Vocabulary', `${totalWords} everyday words in ${TOPICS.length} topics, from greetings to colours, with flashcards.`],
      ['phrases.html', 'Phrases', `${PHRASES.length} sentences for meeting people, shopping and getting around.`],
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
  <div>
    <p class="eyebrow">${C.eyebrow}</p>
    <h1>${C.h1}</h1>
    <p class="lead">${C.lead}</p>
    <div class="row">
      <a class="btn primary" href="${link(lang, 'alphabet.html')}">${C.cta1}</a>
      <a class="btn" href="${link(lang, 'lessons.html')}">${C.cta2}</a>
    </div>
  </div>
  <div class="stats" id="stats" data-letters="28" data-words="${totalWords}">
    <div class="stat"><strong id="sLetters">${n(0)}/${n(28)}</strong><span>${C.s1}</span><div class="meter"><i id="mLetters"></i></div></div>
    <div class="stat"><strong id="sWords">${n(0)}/${n(totalWords)}</strong><span>${C.s2}</span><div class="meter"><i id="mWords"></i></div></div>
    <div class="stat"><strong id="sBest">–</strong><span>${C.s3}</span><div class="meter"><i id="mBest"></i></div></div>
  </div>
</section>
${urBox}
<section>
  <h2>${C.insideH}</h2>
  <div class="cards">
    ${C.cards.map(([f, h, p]) => `<a class="card" href="${link(lang, f)}"><h3>${h}</h3><p>${p}</p></a>`).join('\n    ')}
  </div>
</section>
<section class="split">
  <div>
    <h2>${C.howH}</h2>
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
    listenL: '🔊 حرف سنیں', listenW: '🔊 لفظ سنیں', learn: 'سیکھ لیا؟ نشان لگائیں',
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
    listenL: '🔊 Hear the letter', listenW: '🔊 Hear the word', learn: 'Mark as learned',
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

function lessonsPage(lang) {
  const ur = lang === 'ur';
  const list = LESSONS.map((l, i) => `<li><a href="${link(lang, l.slug + '.html')}"><span class="num">${num(lang, i + 1)}</span><span><strong>${fmt(l[lang].title)}</strong><p>${fmt(l[lang].short)}</p></span><span class="ar" lang="ar">${l.key}</span></a></li>`).join('\n  ');
  const C = ur ? {
    title: 'ابتدائی عربی گرامر کے اسباق | حرف', desc: 'اردو میں عربی گرامر کے آٹھ ابتدائی اسباق: هٰذَا، الـ، حروفِ جر، مذکر و مؤنث، اضافت اور ضمیریں، مثالوں اور آواز کے ساتھ۔',
    h1: 'ابتدائی عربی گرامر کے اسباق',
    lead: `${num(lang, LESSONS.length)} مختصر اسباق جو آپ کو پہلے جملے سے اپنے بارے میں بات کرنے تک لے جاتے ہیں۔ ان کی ترتیب غیر عرب طلبہ کے کلاسیکی نصاب، جیسے مدینہ یونیورسٹی کی مشہور کتب، کے انداز پر ہے: ایک وقت میں ایک قاعدہ، اور بہت سی مثالیں۔`,
    first: 'ابھی حروف نہیں پہچانتے؟ پہلے حروفِ تہجی سیکھ لیں۔',
  } : {
    title: 'Arabic grammar lessons for beginners | Harf', desc: 'Eight beginner Arabic grammar lessons: this and that, al-, prepositions, masculine and feminine, possession and pronouns, with examples and audio.',
    h1: 'Arabic grammar lessons for beginners',
    lead: `${LESSONS.length} short lessons that take you from your first sentence to talking about yourself. They follow the step-by-step order of classic courses for non-Arabic speakers, such as the well-known Madinah books: one small pattern at a time, with plenty of examples.`,
    first: 'Can’t read the letters yet? Start with the alphabet.',
  };
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], [null, T[lang].nav.lessons]])}
<h1>${C.h1}</h1>
<p class="lead">${C.lead}</p>
<p><a href="${link(lang, 'alphabet.html')}">${C.first}</a></p>
<ol class="lesson-list">
  ${list}
</ol>`;
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
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], ['lessons.html', T[lang].nav.lessons], [null, `${C.label} ${n}`]])}
<p class="eyebrow">${C.label} ${n} · <span class="ar" lang="ar">${l.key}</span></p>
<h1>${fmt(L.title)}</h1>
<p class="lead">${fmt(L.intro)}</p>
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

function topicPage(lang, i) {
  const ur = lang === 'ur';
  const t = TOPICS[i];
  const prev = TOPICS[i - 1], next = TOPICS[i + 1];
  const C = ur ? { ar: 'عربی', tr: 'رومن تلفظ', m: 'مطلب', flip: 'پلٹنے کے لیے ٹیپ کریں', prev: 'پچھلا', next: 'اگلا', known: 'یاد ہے؟ نشان لگائیں', listen: '🔊 سنیں', list: 'تمام الفاظ' }
    : { ar: 'Arabic', tr: 'Pronunciation', m: 'Meaning', flip: 'Tap or press Space to flip', prev: 'Previous', next: 'Next', known: 'Mark as known', listen: '🔊 Listen', list: 'All words' };
  const rows = t.words.map(([a, tr, en, u]) => {
    const m = ur ? u : en;
    return `<tr data-ar="${esc(a)}" data-tr="${esc(tr)}" data-m="${esc(m)}" data-key="${esc(t.slug + '|' + a)}"><td class="a"><span class="ar" lang="ar">${a}</span></td><td class="latin">${esc(tr)}</td><td>${esc(m)}</td><td>${say(lang, a)}</td></tr>`;
  }).join('\n      ');
  const title = ur ? t.titleUr : t.titleEn;
  const desc = ur ? `${t.titleUr}: ${ud(t.words.length)} الفاظ اردو معنی، رومن تلفظ، آواز اور فلیش کارڈز کے ساتھ۔`
    : `${t.titleEn}: ${t.words.length} words with meanings, pronunciation, audio and flashcards.`;
  const body = `${crumbs(lang, [['index.html', T[lang].nav.home], ['vocabulary.html', T[lang].nav.vocabulary], [null, ur ? t.ur : t.en]])}
<h1>${title}</h1>
<p class="lead">${fmt(ur ? t.introUr : t.introEn)}</p>
<div class="cardzone">
  <div class="flash" id="flash" tabindex="0" role="button" aria-label="${ur ? 'کارڈ پلٹیں' : 'Flip card'}">
    <div class="flash-in">
      <div class="face front"><span class="ar" lang="ar" id="fAr"></span><span class="hint">${C.flip}</span></div>
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
    <thead><tr><th>${C.ar}</th><th>${C.tr}</th><th>${C.m}</th><th><span class="sr">${C.listen}</span></th></tr></thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</div>
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
</div>`;
  return layout(lang, { file: 'phrases.html', section: 'phrases', title: C.title, desc: C.desc, body });
}

function quizPage(lang) {
  const ur = lang === 'ur';
  const data = {
    letters: LETTERS.map((x) => [x.c, ur ? x.ur : x.en]),
    words: TOPICS.flatMap((t) => t.words.map((w) => [w[0], ur ? w[3] : w[2]])),
  };
  const C = ur ? {
    title: 'عربی کوئز: حروف اور الفاظ | حرف', desc: 'عربی حروف اور الفاظ پر مفت کوئز۔ دس سوال، ہر بار نیا سیٹ۔',
    h1: 'عربی کوئز: حروف اور الفاظ', lead: 'حرف کے حروف اور الفاظ پر دس سوال۔ ہر بار نیا سیٹ۔',
    modes: [['mixed', 'ملا جلا'], ['letters', 'صرف حروف'], ['words', 'صرف الفاظ']],
  } : {
    title: 'Arabic quiz: letters and words | Harf', desc: 'A free Arabic quiz on letters and words. Ten questions, a new set every time.',
    h1: 'Arabic quiz: letters and words', lead: 'Ten questions on the letters and words from Harf. You get a new set every time.',
    modes: [['mixed', 'Mixed'], ['letters', 'Letters only'], ['words', 'Words only']],
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

.hero{display:grid;grid-template-columns:1.4fr 1fr;gap:28px;align-items:center;margin-bottom:36px}
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

.lesson-list{list-style:none;padding:0;margin:0;display:grid;gap:10px}
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

footer{border-top:1px solid var(--line);padding:22px 0 34px;color:var(--muted);font-size:14px}
.foot p{margin:0 0 6px}
.foot-links{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:6px}
.foot-links a{color:var(--muted)}
.toast{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:10px 16px;border-radius:10px;font-size:14px;display:none;z-index:40;max-width:90vw}
.toast.show{display:block}

@media (max-width:820px){
  .hero,.split,.letter-top{grid-template-columns:1fr}
  .big-letter{font-size:100px}
}
@media (max-width:520px){
  .forms{grid-template-columns:repeat(2,1fr)}
  .ex-row{grid-template-columns:1fr auto}
  .ex-row .ar{grid-column:1 / -1}
  .opts{grid-template-columns:1fr}
  .lesson-list a{grid-template-columns:36px 1fr}
  .lesson-list > li > a > .ar{display:none}
  nav.tabs{order:3;width:100%;margin-inline-start:0}
  .lang{margin-inline-start:auto}
}
@media (prefers-reduced-motion: reduce){ .flash-in{transition:none} }
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
    again: 'نیا سیٹ', question: 'سوال',
    q1: 'یہ کون سا حرف ہے؟', q2: 'یہ حرف تلاش کریں:', q3: 'اس کا مطلب کیا ہے؟', q4: 'اسے عربی میں کیسے کہیں گے؟',
    great: 'بہت خوب! اب کوئی نیا موضوع آزمائیں۔', good: 'اچھی پیش رفت۔ فلیش کارڈز دہرائیں اور دوبارہ کوشش کریں۔', keep: 'ہمت نہ ہاریں۔ حروف دہرائیں اور پھر کوشش کریں۔'
  } : {
    noVoice: 'No Arabic voice found. Add Arabic in your device’s text-to-speech settings.',
    noAudio: 'Audio isn’t available in this browser.',
    learned: '✓ Learned', markLearned: 'Mark as learned',
    known: '✓ Known', markKnown: 'Mark as known',
    score: 'Score', next: 'Next →', finished: 'Finished', youScored: 'You scored',
    again: 'Try another set', question: 'Question',
    q1: 'Which letter is this?', q2: 'Find the letter called…', q3: 'What does this mean?', q4: 'How do you say this in Arabic?',
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
    var deck = rows.map(function (r) { return { ar: r.getAttribute('data-ar'), tr: r.getAttribute('data-tr'), m: r.getAttribute('data-m'), key: r.getAttribute('data-key'), row: r }; });
    var known = store.get('known', []);
    var idx = 0;
    var render = function () {
      var w = deck[idx];
      fc.classList.remove('flipped');
      $('#fAr').textContent = w.ar; $('#fAr2').textContent = w.ar; $('#fTr').textContent = w.tr; $('#fM').textContent = w.m;
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

  var qb = $('#quizbox');
  if (qb) {
    var data = JSON.parse($('#quiz-data').textContent);
    var mode = 'mixed', qs = [], qi = 0, score = 0, answered = false;
    var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var makeQ = function (type) {
      var pick;
      if (type === 'letter') {
        pick = shuffle(data.letters).slice(0, 4);
        return Math.random() < 0.5
          ? { p: S.q1, big: pick[0][0], bigAr: true, opts: pick.map(function (l) { return l[1]; }), ans: pick[0][1], optAr: false }
          : { p: S.q2, big: pick[0][1], bigAr: false, opts: pick.map(function (l) { return l[0]; }), ans: pick[0][0], optAr: true };
      }
      pick = shuffle(data.words).slice(0, 4);
      return Math.random() < 0.5
        ? { p: S.q3, big: pick[0][0], bigAr: true, opts: pick.map(function (w) { return w[1]; }), ans: pick[0][1], optAr: false }
        : { p: S.q4, big: pick[0][1], bigAr: false, opts: pick.map(function (w) { return w[0]; }), ans: pick[0][0], optAr: true };
    };
    var renderQ;
    var start = function () {
      qs = [];
      for (var i = 0; i < 10; i++) qs.push(makeQ(mode === 'letters' ? 'letter' : mode === 'words' ? 'word' : (i % 2 ? 'word' : 'letter')));
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
      qb.innerHTML = '<p class="qprompt">' + S.question + ' ' + counter + ' · ' + q.p + '</p>' +
        '<p class="qbig ' + (q.bigAr ? 'ar' : 'txt') + '"' + (q.bigAr ? ' lang="ar"' : '') + '>' + esc(q.big) + '</p>' +
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
  const files = {};
  const pages = [];
  const add = (lang, file, html) => { const f = link(lang, file); files[f] = html; pages.push(f); };
  for (const lang of ['en', 'ur']) {
    add(lang, 'index.html', homePage(lang));
    add(lang, 'alphabet.html', alphabetPage(lang));
    LETTERS.forEach((x, i) => add(lang, 'letter-' + x.slug + '.html', letterPage(lang, i)));
    add(lang, 'lessons.html', lessonsPage(lang));
    LESSONS.forEach((l, i) => add(lang, l.slug + '.html', lessonPage(lang, i)));
    add(lang, 'vocabulary.html', vocabularyPage(lang));
    TOPICS.forEach((t, i) => add(lang, 'vocab-' + t.slug + '.html', topicPage(lang, i)));
    add(lang, 'phrases.html', phrasesPage(lang));
    add(lang, 'quiz.html', quizPage(lang));
    add(lang, 'about.html', aboutPage(lang));
    add(lang, 'contact.html', contactPage(lang));
    add(lang, 'privacy.html', privacyPage(lang));
  }
  files['404.html'] = notFoundPage();
  files['style.css'] = STYLE_CSS;
  files['app.js'] = APP_JS;
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
  console.log(`Built ${Object.keys(files).length} files into _site`);
}

module.exports = { build };
