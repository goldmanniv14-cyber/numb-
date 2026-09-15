/**
 * NUMB — product data (preview site, no backend).
 * No prices, sizes, fabric specs, availability dates or stock counts are
 * included on purpose — none of that has been provided yet. Fill them in
 * here once confirmed; every page reads from this single file.
 *
 * images: paths are placeholders under assets/images/*.svg. Replace the
 * file at that path with a real photo (recommended: same filename, .jpg or
 * .webp) — see IMAGE REQUEST in README.md for the full shot list.
 */
window.NUMB_PRODUCTS = {
  nextDrop: [
    {
      id: 'cap-01',
      category: 'כובעים',
      name: 'כובע NUMB',
      tag: 'הדרופ הבא',
      status: 'coming-soon',
      images: [
        'assets/images/product-cap-1.svg',
        'assets/images/product-cap-2.svg'
      ],
      description:
        'כובע מהדרופ הבא של NUMB. מחיר, מידות וזמינות יתעדכנו כאן ברגע שיאושרו — אין עדיין תאריך השקה.'
    },
    {
      id: 'shorts-01',
      category: 'מכנסיים קצרים',
      name: 'מכנסיים קצרים NUMB',
      tag: 'הדרופ הבא',
      status: 'coming-soon',
      images: [
        'assets/images/product-shorts-1.svg',
        'assets/images/product-shorts-2.svg'
      ],
      description:
        'מכנסיים קצרים מהדרופ הבא של NUMB. מחיר, מידות וזמינות יתעדכנו כאן ברגע שיאושרו — אין עדיין תאריך השקה.'
    },
    {
      id: 'shirt-women-01',
      category: 'נשים',
      name: 'חולצת NUMB לנשים',
      tag: 'הדרופ הבא',
      status: 'coming-soon',
      images: [
        'assets/images/product-shirt-women-1.svg',
        'assets/images/product-shirt-women-2.svg'
      ],
      description:
        'חולצה מהדרופ הבא של NUMB, בקולקציית הנשים. מחיר, מידות וזמינות יתעדכנו כאן ברגע שיאושרו — אין עדיין תאריך השקה.'
    }
  ],

  /**
   * SAMPLE PLACEHOLDER — not a real past product. Demonstrates the
   * archive + "אזל מהמלאי" pattern only. Replace with real items from
   * previous drops (name, category, real photos) or remove if this is
   * NUMB's first drop.
   */
  archive: [
    {
      id: 'archive-sample-01',
      category: 'ארכיון (דוגמה)',
      name: 'פריט לדוגמה — דרופ קודם',
      tag: 'אזל מהמלאי',
      status: 'sold-out',
      isSample: true,
      images: ['assets/images/archive-sample-01.svg'],
      description:
        'זהו פריט לדוגמה בלבד, שנועד להמחיש איך ייראה ארכיון של דרופים קודמים עם סימון "אזל מהמלאי". יש להחליף אותו בפריטים אמיתיים מדרופים קודמים (או להסיר, אם זהו הדרופ הראשון של NUMB).'
    }
  ]
};

window.NUMB_ALL_PRODUCTS = window.NUMB_PRODUCTS.nextDrop.concat(window.NUMB_PRODUCTS.archive);
