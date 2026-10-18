'use strict';
/* =========================================================
   SOLEVA i18n — lightweight EN/AR dictionary + runtime.
   - No dependencies. Lookups via I18N.t(key) / I18N.tf(key, vars).
   - Persisted preference: localStorage 'soleva_lang' ('ar' | 'en').
   - apply() sets html[lang]/[dir] and swaps [data-i18n*] nodes;
     app.js re-renders its dynamic views on language change.
   ========================================================= */
const I18N = (() => {
  const LANGS = ['en', 'ar'];
  let lang = 'en';
  try { if (localStorage.getItem('soleva_lang') === 'ar') lang = 'ar'; } catch { }

  const DICT = {
    /* ---- top bar / header ---- */
    'bar.ship': { en: 'SOLEVA · MOVE DIFFERENT.', ar: 'سوليفا · تحرّك باختلاف.' },
    'nav.new': { en: 'New Arrivals', ar: 'وصل حديثًا' },
    'nav.men': { en: 'Men', ar: 'رجالي' },
    'nav.women': { en: 'Women', ar: 'نسائي' },
    'nav.sneakers': { en: 'Sneakers', ar: 'سنيكرز' },
    'nav.running': { en: 'Running', ar: 'الجري' },
    'nav.collections': { en: 'Collections', ar: 'التشكيلات' },
    'nav.categories': { en: 'Categories', ar: 'الفئات' },
    'nav.about': { en: 'About', ar: 'عن SOLEVA' },
    'a11y.search': { en: 'Search', ar: 'بحث' },
    'a11y.wishlist': { en: 'Wishlist', ar: 'المفضلة' },
    'a11y.bag': { en: 'Open bag', ar: 'فتح الحقيبة' },
    'a11y.bagd': { en: 'Shopping bag', ar: 'حقيبة التسوق' },
    'a11y.menu': { en: 'Open menu', ar: 'فتح القائمة' },
    'a11y.primary': { en: 'Primary', ar: 'القائمة الرئيسية' },
    'a11y.close': { en: 'Close', ar: 'إغلاق' },
    'a11y.closesearch': { en: 'Close search', ar: 'إغلاق البحث' },
    'a11y.closebag': { en: 'Close bag', ar: 'إغلاق الحقيبة' },
    'a11y.closefilters': { en: 'Close filters', ar: 'إغلاق الفلاتر' },
    'a11y.lang': { en: 'Switch language', ar: 'تغيير اللغة' },
    'a11y.skip': { en: 'Skip to content', ar: 'تخطَّ إلى المحتوى' },
    'a11y.searchd': { en: 'Search', ar: 'البحث' },
    'a11y.searchprod': { en: 'Search products', ar: 'ابحث عن منتج' },
    'a11y.breadcrumb': { en: 'Breadcrumb', ar: 'مسار التنقل' },
    'a11y.viewimg': { en: 'View image', ar: 'عرض الصورة' },
    'a11y.dec': { en: 'Decrease quantity', ar: 'تقليل الكمية' },
    'a11y.inc': { en: 'Increase quantity', ar: 'زيادة الكمية' },
    'card.togglewish': { en: 'Toggle wishlist', ar: 'إضافة/إزالة من المفضلة' },
    'a11y.prev': { en: 'Previous products', ar: 'المنتجات السابقة' },
    'a11y.next': { en: 'Next products', ar: 'المنتجات التالية' },

    /* ---- generic ---- */
    'gen.shop': { en: 'Shop now', ar: 'تسوّق الآن' },
    'gen.viewall': { en: 'View all', ar: 'عرض الكل' },
    'gen.explore': { en: 'Explore collections', ar: 'استكشف التشكيلات' },
    'gen.continue': { en: 'Continue shopping', ar: 'متابعة التسوق' },
    'gen.reset': { en: 'Reset filters', ar: 'مسح الفلاتر' },
    'gen.reset2': { en: 'Reset', ar: 'مسح' },
    'gen.new': { en: 'NEW', ar: 'جديد' },
    'gen.filters': { en: 'FILTERS', ar: 'الفلاتر' },
    'tools.filters': { en: 'Filters', ar: 'تصفية' },
    'gen.all': { en: 'All', ar: 'الكل' },
    'gen.any': { en: 'Any', ar: 'الكل' },
    'gen.sort': { en: 'Sort', ar: 'ترتيب' },
    'gen.home': { en: 'Home', ar: 'الرئيسية' },
    'gen.shopPage': { en: 'Shop', ar: 'المتجر' },
    'gen.for': { en: 'for', ar: 'عن' },
    'gen.gender.men': { en: 'Men', ar: 'رجالي' },
    'gen.gender.women': { en: 'Women', ar: 'نسائي' },
    'gen.gender.unisex': { en: 'Unisex', ar: 'للجنسين' },
    'gen.cat.running': { en: 'Running', ar: 'الجري' },
    'gen.cat.sneakers': { en: 'Sneakers', ar: 'سنيكرز' },
    'gen.cat.basketball': { en: 'Basketball', ar: 'كرة السلة' },
    'gen.cat.lifestyle': { en: 'Lifestyle', ar: 'لايف ستايل' },
    'gen.color.black': { en: 'Black', ar: 'أسود' },
    'gen.color.white': { en: 'White', ar: 'أبيض' },
    'gen.color.cream': { en: 'Cream', ar: 'كريمي' },
    'gen.brandline': { en: 'MOVE DIFFERENT.', ar: 'MOVE DIFFERENT.' },

    /* ---- hero ---- */
    'hero.title1': { en: 'Everyday', ar: 'أناقة' },
    'hero.title2': { en: 'form.', ar: 'كل يوم.' },
    'hero.lead': { en: 'Considered footwear for the everyday.', ar: 'أحذية مختارة لترافقك كل يوم.' },
    'hero.shopmen': { en: 'Shop Men', ar: 'تسوّق رجالي' },
    'hero.shopwomen': { en: 'Shop Women', ar: 'تسوّق نسائي' },

    /* ---- homepage sections ---- */
    'intro.h': { en: 'Footwear\nwithout\ncompromise.', ar: 'أحذية بلا\nتنازلات.' },
    'intro.p': { en: 'Built around movement, comfort, and contemporary design — for men and women.', ar: 'مبنية حول الحركة والراحة والتصميم العصري — للرجال والنساء.' },
    'cats.lab': { en: 'Shop by Style', ar: 'تسوّق حسب الستايل' },
    'style.kicker': { en: 'SOLEVA EDIT', ar: 'اختيارات سوليفا' },
    'style.sneakers': { en: 'Sneakers', ar: 'سنيكرز' },
    'style.sneakers.alt': { en: 'Minimal white sneaker concept', ar: 'تصميم مفاهيمي لحذاء أبيض بسيط' },
    'style.casual': { en: 'Casual', ar: 'كاجوال' },
    'style.casual.alt': { en: 'Brown casual sneaker concept', ar: 'تصميم مفاهيمي لحذاء كاجوال بني' },
    'style.running': { en: 'Running', ar: 'جري' },
    'style.running.alt': { en: 'Neutral running shoe concept', ar: 'تصميم مفاهيمي لحذاء جري بلون هادئ' },
    'style.lifestyle': { en: 'Lifestyle', ar: 'يومي' },
    'style.lifestyle.alt': { en: 'Lifestyle sneaker concept', ar: 'تصميم مفاهيمي لحذاء يومي' },
    'style.suede': { en: 'Suede', ar: 'شمواه' },
    'style.suede.alt': { en: 'Neutral suede sneaker concept', ar: 'تصميم مفاهيمي لحذاء شمواه بلون هادئ' },
    'style.highTop': { en: 'High Tops', ar: 'هاي توب' },
    'style.highTop.alt': { en: 'Black high-top concept', ar: 'تصميم مفاهيمي لحذاء أسود برقبة عالية' },
    'collection.kicker': { en: 'THE SOLEVA EDIT', ar: 'مختارات سوليفا' },
    'campaign.kicker': { en: 'SOLEVA COLLECTION', ar: 'تشكيلة سوليفا' },
    'campaign.h': { en: 'Timeless styles. Modern comfort.', ar: 'ستايل يدوم. وراحة عصرية.' },
    'campaign.cta': { en: 'Explore collection', ar: 'اكتشف التشكيلة' },
    'duo.h': { en: 'Two collections', ar: 'تشكيلتان' },
    'duo.sub': { en: 'One standard of craft — cut for every side of you.', ar: 'معيار واحد في الجودة — مصممة لكل جانب من شخصيتك.' },
    'duo.men.h': { en: "Men's Collection", ar: 'تشكيلة الرجال' },
    'duo.women.h': { en: "Women's Collection", ar: 'تشكيلة النساء' },
    'duo.men.cta': { en: 'Shop Now', ar: 'تسوّق الآن' },
    'duo.women.cta': { en: 'Shop Now', ar: 'تسوّقي الآن' },
    'duo.men.alt': { en: "Men's collection editorial footwear", ar: 'صورة تحريرية لأحذية تشكيلة الرجال' },
    'duo.women.alt': { en: "Women's collection editorial footwear", ar: 'صورة تحريرية لأحذية تشكيلة النساء' },
    'sec.new': { en: 'New Arrivals', ar: 'وصل حديثًا' },
    'sec.new.sub': { en: 'Explore footwear across the SOLEVA range.', ar: 'اكتشف الأحذية ضمن تشكيلة سوليفا.' },
    'catalog.photoNote': { en: 'Catalog visuals are AI-generated concepts for this portfolio demo, not verified photographs of actual stock. One style still uses an illustration. Any brand-like marks are inaccurate and imply no affiliation or product authenticity.', ar: 'صور الكتالوج تصورات مولّدة بالذكاء الاصطناعي لهذا العرض في ملف الأعمال، وليست صورًا موثّقة لمنتجات متاحة فعليًا. ما زال طراز واحد يستخدم رسمًا توضيحيًا. أي علامات شبيهة بشعارات تجارية غير دقيقة ولا تثبت ارتباطًا أو أصالة.' },
    'catalog.conceptAlt': { en: 'AI-generated concept illustration for', ar: 'رسم مفاهيمي مولّد بالذكاء الاصطناعي لـ' },
    'catalog.conceptPhotoAlt': { en: 'AI-generated concept photo for', ar: 'صورة مفاهيمية مولّدة بالذكاء الاصطناعي لـ' },
    'sec.popular': { en: 'More to explore', ar: 'اكتشف المزيد' },
    'sec.popular.sub': { en: 'Discover more from the SOLEVA range.', ar: 'اكتشف المزيد من تشكيلة سوليفا.' },
    'feat.kicker': { en: 'COLLECTION', ar: 'تشكيلة' },
    'feat.h': { en: 'Motion Pro', ar: 'موشن برو' },
    'feat.lead': { en: 'A SOLEVA basketball style.', ar: 'تصميم كرة سلة من سوليفا.' },
    'feat.p': { en: 'Explore the collection by category, color, and available sizes.', ar: 'استكشف التشكيلة حسب الفئة واللون والمقاسات المتاحة.' },
    'feat.cta': { en: 'Explore collection', ar: 'استكشف التشكيلة' },
    'about.h': { en: 'Designed for movement.', ar: 'مصممة للحركة.' },
    'about.p': { en: 'SOLEVA creates modern footwear built around movement, comfort, and everyday expression.', ar: 'تصنع SOLEVA أحذية عصرية مبنية حول الحركة والراحة والتعبير اليومي.' },
    'news.lab': { en: 'JOIN SOLEVA', ar: 'انضم إلى SOLEVA' },
    'news.h': { en: 'Stay close to SOLEVA.', ar: 'ابقَ على تواصل مع سوليفا.' },
    'news.sub': { en: 'Newsletter signup is not connected yet.', ar: 'التسجيل في النشرة البريدية غير متاح حاليًا.' },
    'news.ph': { en: 'Email address', ar: 'البريد الإلكتروني' },
    'news.btn': { en: 'Join us', ar: 'انضم إلينا' },
    'news.ok': { en: 'Newsletter signup is not connected yet.', ar: 'التسجيل في النشرة البريدية غير متاح حاليًا.' },
    'news.bad': { en: 'Please enter a valid email address.', ar: 'من فضلك أدخل بريدًا إلكترونيًا صحيحًا.' },
    'news.welcome': { en: 'Newsletter signup is not connected yet.', ar: 'التسجيل في النشرة البريدية غير متاح حاليًا.' },

    /* ---- cards / quick add ---- */
    'qa.label': { en: 'QUICK ADD', ar: 'إضافة سريعة' },
    'qa.addsize': { en: 'Add size', ar: 'أضف مقاس' },
    'img.of': { en: 'in', ar: '' },

    /* ---- shop ---- */
    'shop.all.title': { en: 'Shop All', ar: 'كل المنتجات' },
    'shop.all.desc': { en: 'Explore the complete SOLEVA collection.', ar: 'استكشف تشكيلة SOLEVA الكاملة.' },
    'shop.gender.desc': { en: 'Footwear for every side of you.', ar: 'أحذية لكل جانب من شخصيتك.' },
    'shop.search.title': { en: 'Search: “{q}”', ar: 'نتائج البحث: “{q}”' },
    'shop.search.desc': { en: 'Results for “{q}” across the full SOLEVA catalog.', ar: 'نتائج البحث عن “{q}” في تشكيلة SOLEVA الكاملة.' },
    'shop.desc.running': { en: 'Lightweight speed for daily miles.', ar: 'خفة وسرعة لكيلومترات يومك.' },
    'shop.desc.sneakers': { en: 'Court-inspired icons, reworked for the street.', ar: 'أيقونات الملعب، بروح الشارع.' },
    'shop.desc.basketball': { en: 'Built for lift-off and hard cuts.', ar: 'مصممة للانطلاق والتغيير السريع.' },
    'shop.desc.lifestyle': { en: 'Minimal silhouettes for every day.', ar: 'تصميمات بسيطة لكل يوم.' },
    'sort.featured': { en: 'Featured', ar: 'المميزة' },
    'sort.low': { en: 'Price: Low to High', ar: 'السعر: من الأقل للأعلى' },
    'sort.high': { en: 'Price: High to Low', ar: 'السعر: من الأعلى للأقل' },
    'sort.name': { en: 'Name: A to Z', ar: 'الاسم: أ → ي' },
    'f.category': { en: 'Category', ar: 'الفئة' },
    'f.gender': { en: 'Gender', ar: 'الفئة المستهدفة' },
    'f.size': { en: 'Size', ar: 'المقاس' },
    'f.price': { en: 'Price', ar: 'السعر' },
    'f.p.500': { en: 'E£500–649', ar: '500 – 649 ج.م' },
    'f.p.650': { en: 'E£650–799', ar: '650 – 799 ج.م' },
    'f.p.800': { en: 'E£800–899', ar: '800 – 899 ج.م' },
    'f.p.900': { en: 'E£900–1,000', ar: '900 – 1,000 ج.م' },
    'f.r.any': { en: 'Any', ar: 'الكل' },

    /* ---- product page ---- */
    'pdp.color': { en: 'COLOR', ar: 'اللون' },
    'pdp.size': { en: 'SIZE', ar: 'المقاس' },
    'pdp.qty': { en: 'QUANTITY', ar: 'الكمية' },
    'pdp.add': { en: 'Add to bag', ar: 'أضف إلى الحقيبة' },
    'pdp.buy': { en: 'Buy now', ar: 'اشترِ الآن' },
    'pdp.related': { en: 'You may also like', ar: 'قد يعجبك أيضًا' },
    'pdp.nofound': { en: 'PRODUCT NOT FOUND.', ar: 'المنتج غير موجود.' },
    'pdp.explore': { en: 'Explore products', ar: 'استكشف المنتجات' },
    'pdp.descT': { en: 'is a contemporary SOLEVA design for everyday wear.', ar: 'تصميم معاصر من سوليفا للاستخدام اليومي.' },

    /* ---- toasts ---- */
    'toast.selectsize': { en: 'PLEASE SELECT A SIZE.', ar: 'من فضلك اختر المقاس.' },
    'toast.added': { en: 'Added to bag.', ar: 'تمت الإضافة إلى حقيبتك.' },
    'toast.size': { en: 'Size {n} selected.', ar: 'تم اختيار المقاس {n}.' },
    'toast.removed': { en: 'Product removed.', ar: 'تمت إزالة المنتج.' },
    'toast.wishadd': { en: 'Added to wishlist.', ar: 'أُضيفت إلى المفضلة.' },
    'toast.wishrm': { en: 'Removed from wishlist.', ar: 'تمت الإزالة من المفضلة.' },
    'toast.required': { en: 'Please complete the required fields.', ar: 'من فضلك أكمل الحقول المطلوبة.' },
    'toast.confirmed': { en: 'Order confirmed.', ar: 'تم تأكيد الطلب.' },

    /* ---- search overlay ---- */
    'search.h': { en: 'WHAT ARE YOU LOOKING FOR?', ar: 'عمّ تبحث؟' },
    'search.ph': { en: 'Search products...', ar: 'ابحث عن منتج...' },
    'search.pop': { en: 'POPULAR', ar: 'الأكثر بحثًا' },
    'search.none': { en: 'NO PRODUCTS FOUND.', ar: 'لا توجد منتجات مطابقة.' },

    /* ---- cart ---- */
    'cart.title': { en: 'YOUR BAG', ar: 'حقيبتك' },
    'cart.empty': { en: 'YOUR BAG IS EMPTY.', ar: 'حقيبتك فارغة.' },
    'cart.size': { en: 'Size', ar: 'مقاس' },
    'cart.remove': { en: 'Remove', ar: 'إزالة' },
    'cart.subtotal': { en: 'Subtotal', ar: 'المجموع الفرعي' },
    'cart.shipping': { en: 'Shipping', ar: 'الشحن' },
    'cart.free': { en: 'Free', ar: 'مجاني' },
    'cart.total': { en: 'Total', ar: 'الإجمالي' },
    'cart.checkout': { en: 'Checkout', ar: 'إتمام الشراء' },

    /* ---- wishlist page ---- */
    'wish.title': { en: 'Wishlist', ar: 'المفضلة' },
    'wish.sub': { en: 'Saved pieces, ready when you are.', ar: 'قطعك المحفوظة، جاهزة متى ما احتجتها.' },
    'wish.empty': { en: 'YOUR WISHLIST IS EMPTY.', ar: 'قائمة المفضلة فارغة.' },
    'wish.empty2': { en: 'NO SAVED ITEMS YET.', ar: 'لا توجد عناصر محفوظة بعد.' },

    /* ---- checkout ---- */
    'co.title': { en: 'CHECKOUT', ar: 'إتمام الشراء' },
    'co.contact': { en: 'CONTACT', ar: 'بيانات التواصل' },
    'co.shipping': { en: 'SHIPPING', ar: 'بيانات الشحن' },
    'co.payment': { en: 'PAYMENT', ar: 'طريقة الدفع' },
    'co.email': { en: 'Email', ar: 'البريد الإلكتروني' },
    'co.fn': { en: 'First name', ar: 'الاسم الأول' },
    'co.ln': { en: 'Last name', ar: 'اسم العائلة' },
    'co.addr': { en: 'Address', ar: 'العنوان' },
    'co.city': { en: 'City', ar: 'المدينة' },
    'co.zip': { en: 'Postal code', ar: 'الرمز البريدي' },
    'co.phone': { en: 'Phone', ar: 'رقم الهاتف' },
    'co.summary': { en: 'ORDER SUMMARY', ar: 'ملخص الطلب' },
    'co.qty': { en: 'Qty', ar: 'الكمية' },
    'co.demo': { en: 'Demo checkout only. No order can be submitted from this site.', ar: 'صفحة تجريبية فقط. لا يمكن إرسال طلب من هذا الموقع.' },
    'co.demo.button': { en: 'Review details (demo only)', ar: 'مراجعة البيانات (تجريبي فقط)' },
    'co.errPre': { en: 'Please enter a valid', ar: 'برجاء إدخال' },
    'co.errSuf': { en: '.', ar: ' صحيحًا.' },
    'co.empty': { en: 'YOUR BAG IS EMPTY.', ar: 'حقيبتك فارغة.' },

    /* ---- page titles ---- */
    'title.home': { en: 'SOLEVA — Premium Footwear · Move Different', ar: 'SOLEVA — أحذية متميزة · MOVE DIFFERENT' },
    'title.shop': { en: 'Shop All — SOLEVA', ar: 'كل المنتجات — SOLEVA' },
    'title.product': { en: 'SOLEVA', ar: 'SOLEVA' },
    'title.wishlist': { en: 'Wishlist — SOLEVA', ar: 'المفضلة — SOLEVA' },
    'title.checkout': { en: 'Checkout — SOLEVA', ar: 'إتمام الشراء — SOLEVA' },

    /* ---- footer ---- */
    'fh.shop': { en: 'Shop', ar: 'تسوّق' },
    'fh.categories': { en: 'Categories', ar: 'الفئات' },
    'fh.help': { en: 'Help', ar: 'المساعدة' },
    'fh.company': { en: 'Company', ar: 'الشركة' },
    'fh.social': { en: 'Social', ar: 'تابعنا' },
    'ft.men': { en: 'Men', ar: 'رجالي' },
    'ft.women': { en: 'Women', ar: 'نسائي' },
    'ft.new': { en: 'New Arrivals', ar: 'وصل حديثًا' },
    'ft.all': { en: 'All Products', ar: 'جميع المنتجات' },
    'ft.cat.running': { en: 'Running', ar: 'الجري' },
    'ft.cat.sneakers': { en: 'Sneakers', ar: 'سنيكرز' },
    'ft.cat.basketball': { en: 'Basketball', ar: 'كرة السلة' },
    'ft.cat.lifestyle': { en: 'Lifestyle', ar: 'لايف ستايل' },
    'ft.shipping': { en: 'Shipping', ar: 'الشحن' },
    'ft.returns': { en: 'Returns & Exchanges', ar: 'الاستبدال والإرجاع' },
    'ft.faq': { en: 'FAQ', ar: 'الأسئلة الشائعة' },
    'ft.contact': { en: 'Contact', ar: 'تواصل معنا' },
    'ft.about': { en: 'About', ar: 'عن SOLEVA' },
    'ft.journal': { en: 'Journal', ar: 'المدونة' },
    'ft.careers': { en: 'Careers', ar: 'الوظائف' },
    'ft.privacy': { en: 'Privacy', ar: 'الخصوصية' },
    'ft.terms': { en: 'Terms', ar: 'الشروط والأحكام' },
    'ft.soc.ig': { en: 'Instagram', ar: 'إنستجرام' },
    'ft.soc.fb': { en: 'Facebook', ar: 'فيسبوك' },
    'ft.soc.tt': { en: 'TikTok', ar: 'تيك توك' },
    'ft.soc.x': { en: 'X', ar: 'إكس' },
    'ft.rights': { en: '© 2026 SOLEVA. ALL RIGHTS RESERVED.', ar: '© 2026 SOLEVA. جميع الحقوق محفوظة.' }
  };

  const $all = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = l => new Intl.NumberFormat(l === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US');
  let num = fmt(lang);

  const api = {
    get lang() { return lang; },
    t(k) { const e = DICT[k]; return e ? (e[lang] ?? e.en) : k; },
    tf(k, vars) { let s = api.t(k); for (const x in vars || {}) s = s.split('{' + x + '}').join(vars[x]); return s; },
    /* prices stay numeric; only the display changes */
    money(n) { return lang === 'ar' ? num.format(n) + ' ج.م' : 'E£' + num.format(n); },
    productWord(n) {
      if (lang !== 'ar') return n === 1 ? 'product' : 'products';
      return n === 1 ? 'منتج' : n === 2 ? 'منتجان' : (n >= 3 && n <= 10 ? 'منتجات' : 'منتجًا');
    },
    apply() {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      $all('[data-i18n]').forEach(e => { const v = api.t(e.dataset.i18n); if (v) e.textContent = v; });
      $all('[data-i18n-ph]').forEach(e => { e.placeholder = api.t(e.dataset.i18nPh); });
      $all('[data-i18n-aria]').forEach(e => { e.setAttribute('aria-label', api.t(e.dataset.i18nAria)); });
      $all('[data-i18n-alt]').forEach(e => { e.setAttribute('alt', api.t(e.dataset.i18nAlt)); });
      const tk = 'title.' + (document.body.dataset.page || 'home');
      if (DICT[tk]) document.title = api.t(tk);
    },
    set(l) {
      if (l === lang || !LANGS.includes(l)) return;
      lang = l;
      try { localStorage.setItem('soleva_lang', l); } catch { }
      num = fmt(lang);
      if (typeof window.__i18nRerender === 'function') {
        try { window.__i18nRerender(); } catch (e) { console.error(e); }
      } else api.apply();
    },
    toggle() { api.set(lang === 'en' ? 'ar' : 'en'); }
  };
  window.I18N = api;
  return api;
})();
