import { Product, FAQ } from "./types";

// Placeholder product generator for homepage carousels
// These will be replaced with real Amazon affiliate products later
function makeProduct(title: string, price: string, rating: number, reviewCount: number, sizingNote?: string): Product {
  return {
    title,
    image: "https://m.media-amazon.com/images/I/placeholder.jpg",
    url: "https://www.amazon.com/dp/PLACEHOLDER",
    price,
    rating,
    reviewCount,
    sizingNote,
  };
}

export interface HomepageSection {
  id: string;
  title: string;
  description: string;
  slug: string;
  products: Product[];
}

// ─── BY SEASON ───────────────────────────────────────────
export const seasonSections: HomepageSection[] = [
  {
    id: "summer-dresses",
    title: "Summer Wedding Guest Dresses",
    description: "Light, breezy dresses perfect for outdoor summer weddings. Think flowy fabrics, bright colors, and flattering silhouettes that keep you cool and stylish.",
    slug: "summer-wedding-guest-dresses",
    products: [
      makeProduct("PRETTYGARDEN Women's Summer Floral Midi Dress", "$36.99", 4.5, 8234),
      makeProduct("MEROKEETY Women's Sleeveless Flowy Dress", "$33.99", 4.4, 6712),
      makeProduct("ANRABESS Women's Casual Loose Sundress", "$29.99", 4.3, 5421),
      makeProduct("BTFBM Women's V-Neck Summer Wrap Dress", "$34.99", 4.6, 9102),
      makeProduct("ECOWISH Women's Spaghetti Strap Midi Dress", "$28.99", 4.2, 4533),
      makeProduct("MITILLY Women's Boho Floral Print Maxi Dress", "$35.99", 4.5, 7821, "Runs small — size up"),
      makeProduct("ZESICA Women's Bohemian Floral Sundress", "$32.99", 4.4, 6109),
      makeProduct("Berydress Women's Cocktail A-Line Summer Dress", "$26.99", 4.3, 3890),
    ],
  },
  {
    id: "fall-dresses",
    title: "Fall Wedding Guest Dresses",
    description: "Rich colors and elegant styles for autumn celebrations. From jewel tones to long sleeves, find dresses that complement the season beautifully.",
    slug: "fall-wedding-guest-dresses",
    products: [
      makeProduct("GRACE KARIN Women's Long Sleeve Wrap Dress", "$38.99", 4.5, 7456),
      makeProduct("BELONGSCI Women's Elegant Bodycon Midi Dress", "$34.99", 4.4, 5823),
      makeProduct("PRETTYGARDEN Women's Fall Lantern Sleeve Dress", "$39.99", 4.6, 8901),
      makeProduct("MEROKEETY Women's Long Sleeve Midi Dress", "$36.99", 4.3, 6234),
      makeProduct("Verdusa Women's Satin V-Neck Slip Dress", "$29.99", 4.5, 4567),
      makeProduct("LILLUSORY Women's Knit Sweater Dress", "$42.99", 4.4, 3890),
      makeProduct("ANRABESS Women's Turtleneck Ribbed Midi Dress", "$35.99", 4.3, 5612, "True to size"),
      makeProduct("BTFBM Women's Autumn Wrap V-Neck Dress", "$37.99", 4.5, 7234),
    ],
  },
  {
    id: "spring-dresses",
    title: "Spring Wedding Guest Dresses",
    description: "Fresh and feminine dresses perfect for spring weddings. Pastels, florals, and elegant cuts that capture the spirit of the season.",
    slug: "spring-wedding-guest-dresses",
    products: [
      makeProduct("ECOWISH Women's Floral Print V-Neck Dress", "$31.99", 4.4, 6789),
      makeProduct("ZESICA Women's Wrap Ruffle Hem Midi Dress", "$35.99", 4.5, 8123),
      makeProduct("MITILLY Women's Floral Chiffon Maxi Dress", "$38.99", 4.3, 5456),
      makeProduct("MEROKEETY Women's Flutter Sleeve A-Line Dress", "$33.99", 4.6, 7890, "Runs large — size down"),
      makeProduct("Berydress Women's Cap Sleeve Cocktail Dress", "$27.99", 4.2, 4123),
      makeProduct("PRETTYGARDEN Women's Floral Ruffle Dress", "$36.99", 4.5, 9012),
      makeProduct("BELONGSCI Women's Bell Sleeve Wrap Dress", "$34.99", 4.4, 6345),
      makeProduct("GRACE KARIN Women's Floral Chiffon Dress", "$39.99", 4.5, 7678),
    ],
  },
  {
    id: "winter-dresses",
    title: "Winter Wedding Guest Dresses",
    description: "Sophisticated dresses for winter wedding celebrations. Velvet, long sleeves, and dark tones that are perfect for colder months.",
    slug: "winter-wedding-guest-dresses",
    products: [
      makeProduct("GRACE KARIN Women's Velvet Bodycon Midi Dress", "$42.99", 4.6, 8234),
      makeProduct("BTFBM Women's Long Sleeve Velvet Wrap Dress", "$44.99", 4.5, 6789),
      makeProduct("Verdusa Women's Elegant Satin Maxi Dress", "$39.99", 4.4, 5456),
      makeProduct("PRETTYGARDEN Women's Long Sleeve Knit Dress", "$37.99", 4.3, 7123),
      makeProduct("MEROKEETY Women's Mock Neck Midi Dress", "$35.99", 4.5, 8456, "True to size"),
      makeProduct("LILLUSORY Women's Elegant Bodycon Dress", "$41.99", 4.4, 4789),
      makeProduct("ANRABESS Women's Turtleneck Sweater Dress", "$38.99", 4.5, 6012),
      makeProduct("BELONGSCI Women's Satin Long Sleeve Dress", "$43.99", 4.6, 7345),
    ],
  },
];

// ─── BY DRESS CODE ────────────────────────────────────────
export const dressCodeSections: HomepageSection[] = [
  {
    id: "black-tie-dresses",
    title: "Black Tie Wedding Guest Dresses",
    description: "Floor-length gowns and elegant formal dresses for the most upscale wedding celebrations. Look stunning in these sophisticated options.",
    slug: "black-tie-wedding-guest-dresses",
    products: [
      makeProduct("Ever-Pretty Women's Elegant V-Neck Floor Length Gown", "$52.99", 4.5, 12345),
      makeProduct("DRESSTELLS Women's Sequin Evening Gown", "$64.99", 4.6, 8901),
      makeProduct("Laorchid Women's Vintage Formal Floor Length Dress", "$48.99", 4.4, 6234),
      makeProduct("MUADRESS Women's Off-Shoulder Formal Maxi Gown", "$55.99", 4.5, 7567),
      makeProduct("Angel-fashions Women's Beaded Evening Dress", "$59.99", 4.3, 5890, "Runs small — size up"),
      makeProduct("GRACE KARIN Women's Sequin Long Evening Dress", "$56.99", 4.5, 9123),
      makeProduct("Ever-Pretty Women's A-Line Empire Waist Gown", "$49.99", 4.4, 11456),
      makeProduct("DRESSTELLS Women's Tulle Floor Length Gown", "$62.99", 4.6, 7789),
    ],
  },
  {
    id: "formal-dresses",
    title: "Formal Wedding Guest Dresses",
    description: "Polished, elegant dresses for formal wedding ceremonies. Choose from refined midi and maxi styles that exude grace.",
    slug: "formal-wedding-guest-dresses",
    products: [
      makeProduct("DRESSTELLS Women's Chiffon Formal Maxi Dress", "$45.99", 4.5, 8234),
      makeProduct("Ever-Pretty Women's Elegant Lace Evening Dress", "$48.99", 4.4, 7567),
      makeProduct("GRACE KARIN Women's Cap Sleeve Formal Dress", "$42.99", 4.6, 6890),
      makeProduct("MUADRESS Women's V-Neck Chiffon Bridesmaid Dress", "$39.99", 4.3, 9123),
      makeProduct("Verdusa Women's Satin One-Shoulder Formal Dress", "$44.99", 4.5, 5456),
      makeProduct("PRETTYGARDEN Women's Elegant Wrap Maxi Dress", "$41.99", 4.4, 7789),
      makeProduct("BTFBM Women's Satin Formal Midi Dress", "$43.99", 4.5, 6012, "True to size"),
      makeProduct("BELONGSCI Women's Elegant Pleated Formal Dress", "$46.99", 4.6, 8345),
    ],
  },
  {
    id: "semi-formal-dresses",
    title: "Semi-Formal Wedding Guest Dresses",
    description: "Versatile dresses that strike the perfect balance between dressy and relaxed. Ideal for most wedding celebrations.",
    slug: "semi-formal-wedding-guest-dresses",
    products: [
      makeProduct("PRETTYGARDEN Women's Wrap V-Neck Midi Dress", "$35.99", 4.5, 9876),
      makeProduct("MEROKEETY Women's A-Line Swing Midi Dress", "$33.99", 4.4, 7654),
      makeProduct("ECOWISH Women's Button Down Midi Dress", "$31.99", 4.3, 6543),
      makeProduct("BTFBM Women's Ruffle Hem Midi Dress", "$34.99", 4.5, 8765),
      makeProduct("ZESICA Women's Smocked Floral Midi Dress", "$36.99", 4.6, 5432),
      makeProduct("Berydress Women's A-Line Cap Sleeve Dress", "$28.99", 4.2, 4321),
      makeProduct("BELONGSCI Women's Tie Waist Midi Dress", "$37.99", 4.4, 7890),
      makeProduct("GRACE KARIN Women's Chiffon Midi Dress", "$39.99", 4.5, 6789),
    ],
  },
  {
    id: "cocktail-dresses",
    title: "Cocktail Wedding Guest Dresses",
    description: "Chic knee-length and midi cocktail dresses. Perfect for evening receptions and celebrations that call for something special.",
    slug: "cocktail-wedding-guest-dresses",
    products: [
      makeProduct("GRACE KARIN Women's Bodycon Cocktail Dress", "$32.99", 4.5, 11234),
      makeProduct("Berydress Women's Short Sleeve Cocktail Dress", "$27.99", 4.3, 8567),
      makeProduct("MSLG Women's Elegant Floral Lace Cocktail Dress", "$34.99", 4.4, 6890),
      makeProduct("oxiuly Women's Vintage Criss-Cross Cocktail Dress", "$29.99", 4.5, 9123),
      makeProduct("JASAMBAC Women's Ruched Bodycon Cocktail Dress", "$31.99", 4.6, 7456, "Runs small — size up"),
      makeProduct("Vfshow Women's Elegant Cocktail Party Dress", "$33.99", 4.4, 5789),
      makeProduct("HOMEYEE Women's Elegant Pencil Cocktail Dress", "$28.99", 4.3, 8012),
      makeProduct("DRESSTELLS Women's Short Cocktail Party Dress", "$35.99", 4.5, 6345),
    ],
  },
  {
    id: "casual-dresses",
    title: "Casual Wedding Guest Dresses",
    description: "Relaxed yet stylish dresses for casual and outdoor weddings. Comfortable enough to dance in, pretty enough to photograph beautifully.",
    slug: "casual-wedding-guest-dresses",
    products: [
      makeProduct("ANRABESS Women's Casual Loose Swing Dress", "$28.99", 4.4, 12345),
      makeProduct("MITILLY Women's Boho Floral Print Dress", "$26.99", 4.3, 9876),
      makeProduct("ZESICA Women's Casual Summer Midi Dress", "$29.99", 4.5, 7654),
      makeProduct("ECOWISH Women's V-Neck Casual Wrap Dress", "$27.99", 4.4, 8765),
      makeProduct("PRETTYGARDEN Women's Casual Flowy Midi Dress", "$31.99", 4.6, 6543),
      makeProduct("MEROKEETY Women's Casual Tiered Midi Dress", "$30.99", 4.3, 5432, "True to size"),
      makeProduct("BTFBM Women's Casual V-Neck Sundress", "$25.99", 4.2, 4321),
      makeProduct("Berydress Women's Casual A-Line Swing Dress", "$24.99", 4.4, 7890),
    ],
  },
];

// ─── BY COLOR ────────────────────────────────────────
export const colorSections: HomepageSection[] = [
  {
    id: "black-dresses",
    title: "Black Wedding Guest Dresses",
    description: "Timeless and sophisticated, black dresses are always a safe and stylish choice for wedding celebrations.",
    slug: "black-wedding-guest-dresses",
    products: [
      makeProduct("DKNY Women's Elegant Black Sheath Dress", "$42.99", 4.5, 8901),
      makeProduct("Calvin Klein Women's Sleeveless Black Dress", "$44.99", 4.6, 7234),
      makeProduct("GRACE KARIN Women's Black Cocktail Dress", "$34.99", 4.4, 6567),
      makeProduct("PRETTYGARDEN Women's Black Wrap Midi Dress", "$36.99", 4.5, 5890),
      makeProduct("Verdusa Women's Black Satin Slip Dress", "$29.99", 4.3, 9123),
      makeProduct("BELONGSCI Women's Black Bodycon Dress", "$38.99", 4.5, 7456),
      makeProduct("BTFBM Women's Black V-Neck Midi Dress", "$35.99", 4.4, 4789, "True to size"),
      makeProduct("MEROKEETY Women's Black Ruffle Hem Dress", "$33.99", 4.3, 6012),
    ],
  },
  {
    id: "blue-dresses",
    title: "Blue Wedding Guest Dresses",
    description: "From royal blue to powder blue, these stunning blue dresses make a beautiful statement at any wedding ceremony.",
    slug: "blue-wedding-guest-dresses",
    products: [
      makeProduct("PRETTYGARDEN Women's Royal Blue Midi Dress", "$35.99", 4.5, 7890),
      makeProduct("GRACE KARIN Women's Dusty Blue Chiffon Dress", "$39.99", 4.4, 6123),
      makeProduct("ECOWISH Women's Light Blue Wrap Dress", "$31.99", 4.6, 8456),
      makeProduct("BTFBM Women's Navy Blue V-Neck Dress", "$34.99", 4.3, 5789),
      makeProduct("MEROKEETY Women's Baby Blue Midi Dress", "$33.99", 4.5, 7012),
      makeProduct("ZESICA Women's Cobalt Blue A-Line Dress", "$36.99", 4.4, 4345),
      makeProduct("Verdusa Women's Sapphire Satin Dress", "$38.99", 4.5, 6678, "Runs small — size up"),
      makeProduct("BELONGSCI Women's Slate Blue Formal Dress", "$41.99", 4.6, 8901),
    ],
  },
  {
    id: "navy-dresses",
    title: "Navy Wedding Guest Dresses",
    description: "Classic and universally flattering, navy dresses bring quiet elegance to every wedding occasion.",
    slug: "navy-wedding-guest-dresses",
    products: [
      makeProduct("GRACE KARIN Women's Navy Lace Cocktail Dress", "$38.99", 4.5, 9234),
      makeProduct("DRESSTELLS Women's Navy Chiffon Midi Dress", "$42.99", 4.4, 7567),
      makeProduct("PRETTYGARDEN Women's Navy Wrap Dress", "$35.99", 4.6, 5890),
      makeProduct("BELONGSCI Women's Navy Bodycon Midi Dress", "$37.99", 4.3, 8123),
      makeProduct("BTFBM Women's Navy V-Neck Formal Dress", "$36.99", 4.5, 6456),
      makeProduct("MEROKEETY Women's Navy Flutter Sleeve Dress", "$34.99", 4.4, 4789),
      makeProduct("Verdusa Women's Navy Satin Maxi Dress", "$41.99", 4.5, 7012, "True to size"),
      makeProduct("Ever-Pretty Women's Navy Lace Evening Dress", "$45.99", 4.6, 9345),
    ],
  },
  {
    id: "green-dresses",
    title: "Green Wedding Guest Dresses",
    description: "Emerald, sage, olive, and forest green — green dresses bring a fresh and nature-inspired look to any wedding.",
    slug: "green-wedding-guest-dresses",
    products: [
      makeProduct("PRETTYGARDEN Women's Emerald Green Midi Dress", "$36.99", 4.5, 8012),
      makeProduct("BTFBM Women's Sage Green Wrap Dress", "$34.99", 4.4, 6345),
      makeProduct("MEROKEETY Women's Olive Green A-Line Dress", "$33.99", 4.3, 7678),
      makeProduct("GRACE KARIN Women's Forest Green Cocktail Dress", "$39.99", 4.6, 5901),
      makeProduct("ECOWISH Women's Mint Green V-Neck Dress", "$31.99", 4.5, 4234, "Runs large — size down"),
      makeProduct("ZESICA Women's Hunter Green Maxi Dress", "$37.99", 4.4, 8567),
      makeProduct("Verdusa Women's Emerald Satin Slip Dress", "$35.99", 4.5, 6890),
      makeProduct("BELONGSCI Women's Dark Green Formal Dress", "$41.99", 4.6, 7123),
    ],
  },
  {
    id: "pink-dresses",
    title: "Pink Wedding Guest Dresses",
    description: "Romantic and feminine, pink dresses range from soft blush to vibrant hot pink — perfect for spring and summer weddings.",
    slug: "pink-wedding-guest-dresses",
    products: [
      makeProduct("PRETTYGARDEN Women's Blush Pink Midi Dress", "$35.99", 4.5, 9456),
      makeProduct("ECOWISH Women's Hot Pink Wrap Dress", "$32.99", 4.4, 7789),
      makeProduct("BTFBM Women's Dusty Rose V-Neck Dress", "$34.99", 4.6, 6012),
      makeProduct("MEROKEETY Women's Mauve Pink A-Line Dress", "$33.99", 4.3, 8345),
      makeProduct("GRACE KARIN Women's Coral Pink Cocktail Dress", "$38.99", 4.5, 5678),
      makeProduct("ZESICA Women's Salmon Pink Midi Dress", "$36.99", 4.4, 4901),
      makeProduct("Verdusa Women's Fuchsia Satin Dress", "$37.99", 4.5, 7234, "True to size"),
      makeProduct("BELONGSCI Women's Rose Pink Formal Dress", "$40.99", 4.6, 8567),
    ],
  },
  {
    id: "yellow-dresses",
    title: "Yellow Wedding Guest Dresses",
    description: "Bright and cheerful yellow dresses bring sunny energy to wedding celebrations. A bold and beautiful choice.",
    slug: "yellow-wedding-guest-dresses",
    products: [
      makeProduct("PRETTYGARDEN Women's Mustard Yellow Midi Dress", "$34.99", 4.4, 6789),
      makeProduct("ECOWISH Women's Lemon Yellow Sundress", "$29.99", 4.3, 5012),
      makeProduct("BTFBM Women's Golden Yellow Wrap Dress", "$33.99", 4.5, 7345),
      makeProduct("MEROKEETY Women's Pale Yellow A-Line Dress", "$32.99", 4.4, 4678),
      makeProduct("ZESICA Women's Sunflower Floral Midi Dress", "$35.99", 4.6, 8901),
      makeProduct("GRACE KARIN Women's Canary Yellow Cocktail Dress", "$37.99", 4.3, 6234),
      makeProduct("Berydress Women's Butter Yellow Dress", "$28.99", 4.2, 3567, "Runs small — size up"),
      makeProduct("BELONGSCI Women's Marigold Formal Dress", "$39.99", 4.5, 7890),
    ],
  },
  {
    id: "burgundy-dresses",
    title: "Burgundy Wedding Guest Dresses",
    description: "Deep, rich burgundy dresses are perfect for fall and winter weddings. This luxurious color flatters every skin tone.",
    slug: "burgundy-wedding-guest-dresses",
    products: [
      makeProduct("GRACE KARIN Women's Burgundy Lace Midi Dress", "$39.99", 4.5, 8901),
      makeProduct("DRESSTELLS Women's Wine Red Chiffon Dress", "$43.99", 4.6, 7234),
      makeProduct("PRETTYGARDEN Women's Burgundy Wrap Dress", "$36.99", 4.4, 5567),
      makeProduct("BTFBM Women's Maroon V-Neck Midi Dress", "$35.99", 4.5, 6890),
      makeProduct("BELONGSCI Women's Burgundy Bodycon Dress", "$38.99", 4.3, 9123),
      makeProduct("MEROKEETY Women's Dark Red Flutter Dress", "$34.99", 4.5, 4456),
      makeProduct("Verdusa Women's Burgundy Satin Maxi Dress", "$41.99", 4.4, 7789, "True to size"),
      makeProduct("Ever-Pretty Women's Burgundy Evening Gown", "$47.99", 4.6, 8012),
    ],
  },
  {
    id: "brown-dresses",
    title: "Brown Wedding Guest Dresses",
    description: "Warm and earthy, brown dresses offer a unique and chic alternative. From chocolate to terracotta, these tones are on trend.",
    slug: "brown-wedding-guest-dresses",
    products: [
      makeProduct("PRETTYGARDEN Women's Chocolate Brown Midi Dress", "$35.99", 4.4, 5678),
      makeProduct("BTFBM Women's Terracotta Wrap Dress", "$34.99", 4.5, 4901),
      makeProduct("MEROKEETY Women's Rust Brown A-Line Dress", "$33.99", 4.3, 7234),
      makeProduct("ECOWISH Women's Camel V-Neck Dress", "$31.99", 4.4, 3567),
      makeProduct("ZESICA Women's Coffee Brown Midi Dress", "$36.99", 4.6, 6890),
      makeProduct("GRACE KARIN Women's Mocha Cocktail Dress", "$38.99", 4.5, 5123),
      makeProduct("Verdusa Women's Bronze Satin Slip Dress", "$37.99", 4.4, 8456, "Runs small — size up"),
      makeProduct("BELONGSCI Women's Toffee Brown Formal Dress", "$40.99", 4.5, 4789),
    ],
  },
];

// ─── BY BODY TYPE ────────────────────────────────────────
export const bodyTypeSections: HomepageSection[] = [
  {
    id: "plus-size-dresses",
    title: "Plus Size Wedding Guest Dresses",
    description: "Gorgeous dresses designed to flatter curves beautifully. Available in extended sizes with comfortable, confidence-boosting fits.",
    slug: "plus-size-wedding-guest-dresses",
    products: [
      makeProduct("Pinup Fashion Women's Plus Size Lace Midi Dress", "$39.99", 4.5, 9234),
      makeProduct("POSESHE Women's Plus Size Wrap Maxi Dress", "$42.99", 4.4, 7567),
      makeProduct("Nemidor Women's Plus Size Cocktail Dress", "$36.99", 4.6, 5890),
      makeProduct("Hanna Nikole Women's Plus Size Lace Dress", "$38.99", 4.3, 8123),
      makeProduct("GRACE KARIN Plus Size V-Neck Midi Dress", "$41.99", 4.5, 6456, "True to size"),
      makeProduct("Allegrace Women's Plus Size Floral Maxi Dress", "$35.99", 4.4, 4789),
      makeProduct("IN'VOLAND Women's Plus Size Wrap Dress", "$37.99", 4.5, 7012),
      makeProduct("Kiyonna Women's Plus Size Lace Cocktail Dress", "$44.99", 4.6, 9345),
    ],
  },
  {
    id: "petite-dresses",
    title: "Petite Wedding Guest Dresses",
    description: "Perfectly proportioned dresses for petite frames. These styles are designed to flatter shorter heights without overwhelming your figure.",
    slug: "petite-wedding-guest-dresses",
    products: [
      makeProduct("PRETTYGARDEN Petite Women's Wrap Midi Dress", "$34.99", 4.5, 6789),
      makeProduct("MEROKEETY Petite Women's A-Line Dress", "$32.99", 4.4, 5012),
      makeProduct("GRACE KARIN Petite Women's Cocktail Dress", "$37.99", 4.3, 8345),
      makeProduct("BTFBM Petite Women's V-Neck Midi Dress", "$33.99", 4.6, 4678),
      makeProduct("ECOWISH Petite Women's Floral Wrap Dress", "$30.99", 4.5, 7901),
      makeProduct("BELONGSCI Petite Women's Tie Waist Dress", "$35.99", 4.4, 3234),
      makeProduct("Verdusa Petite Women's Satin Midi Dress", "$36.99", 4.5, 6567, "True to size — petite fit"),
      makeProduct("ZESICA Petite Women's Smocked Midi Dress", "$34.99", 4.3, 5890),
    ],
  },
  {
    id: "maternity-dresses",
    title: "Maternity Wedding Guest Dresses",
    description: "Beautiful and comfortable dresses designed with growing bumps in mind. Look stunning while staying comfortable all day.",
    slug: "maternity-wedding-guest-dresses",
    products: [
      makeProduct("HELLO MIZ Maternity Wrap Midi Dress", "$29.99", 4.5, 7234),
      makeProduct("Bearsland Women's Maternity V-Neck Dress", "$26.99", 4.4, 5567),
      makeProduct("Ekouaer Maternity Sleeveless Maxi Dress", "$28.99", 4.3, 8890),
      makeProduct("AMPOSH Maternity Ruched Side Midi Dress", "$31.99", 4.6, 4123),
      makeProduct("CareGabi Maternity Bodycon Midi Dress", "$27.99", 4.5, 6456, "Size up for third trimester"),
      makeProduct("Smallshow Women's Maternity Nursing Dress", "$25.99", 4.4, 9789),
      makeProduct("OUGES Maternity Floral Wrap Maxi Dress", "$32.99", 4.5, 3012),
      makeProduct("Liu & Qu Maternity Chiffon Formal Dress", "$34.99", 4.3, 7345),
    ],
  },
];

// ─── BY STYLE ────────────────────────────────────────
export const styleSections: HomepageSection[] = [
  {
    id: "long-dresses",
    title: "Long Wedding Guest Dresses",
    description: "Elegant floor-length and maxi dresses that make a dramatic entrance. Perfect for formal and black-tie weddings.",
    slug: "long-wedding-guest-dresses",
    products: [
      makeProduct("Ever-Pretty Women's Elegant Long Evening Gown", "$46.99", 4.5, 11234),
      makeProduct("DRESSTELLS Women's Chiffon Long Formal Dress", "$49.99", 4.6, 8567),
      makeProduct("GRACE KARIN Women's Floor Length Evening Dress", "$44.99", 4.4, 6890),
      makeProduct("MUADRESS Women's V-Neck Long Bridesmaid Dress", "$42.99", 4.5, 9123),
      makeProduct("Verdusa Women's Satin Long Maxi Dress", "$38.99", 4.3, 5456),
      makeProduct("PRETTYGARDEN Women's Long Flowy Maxi Dress", "$39.99", 4.5, 7789),
      makeProduct("BTFBM Women's Long Wrap Maxi Dress", "$41.99", 4.4, 4012, "Runs long — check length"),
      makeProduct("BELONGSCI Women's Elegant Long Formal Dress", "$47.99", 4.6, 8345),
    ],
  },
  {
    id: "midi-dresses",
    title: "Midi Wedding Guest Dresses",
    description: "The most versatile wedding guest length. Midi dresses hit below the knee and work perfectly for any dress code.",
    slug: "midi-wedding-guest-dresses",
    products: [
      makeProduct("PRETTYGARDEN Women's V-Neck Midi Dress", "$35.99", 4.5, 10234),
      makeProduct("MEROKEETY Women's Ruffle Hem Midi Dress", "$33.99", 4.4, 8567),
      makeProduct("BTFBM Women's Wrap Front Midi Dress", "$34.99", 4.6, 6890),
      makeProduct("ECOWISH Women's Button Down Midi Dress", "$31.99", 4.3, 9123),
      makeProduct("GRACE KARIN Women's A-Line Midi Dress", "$38.99", 4.5, 5456),
      makeProduct("ZESICA Women's Smocked Midi Dress", "$36.99", 4.4, 7789),
      makeProduct("BELONGSCI Women's Tie Waist Midi Dress", "$37.99", 4.5, 4012, "True to size"),
      makeProduct("Verdusa Women's Satin V-Neck Midi Dress", "$39.99", 4.6, 8345),
    ],
  },
  {
    id: "maxi-dresses",
    title: "Maxi Wedding Guest Dresses",
    description: "Flowing maxi dresses that are effortlessly elegant. These ankle-length styles are comfortable and chic for any season.",
    slug: "maxi-wedding-guest-dresses",
    products: [
      makeProduct("PRETTYGARDEN Women's Floral Maxi Dress", "$37.99", 4.5, 9234),
      makeProduct("MITILLY Women's Boho Print Maxi Dress", "$35.99", 4.4, 7567),
      makeProduct("MEROKEETY Women's Flowy Maxi Dress", "$36.99", 4.3, 5890),
      makeProduct("BTFBM Women's V-Neck Wrap Maxi Dress", "$38.99", 4.6, 8123),
      makeProduct("ECOWISH Women's Spaghetti Strap Maxi Dress", "$33.99", 4.5, 6456),
      makeProduct("ZESICA Women's Bohemian Maxi Dress", "$39.99", 4.4, 4789),
      makeProduct("GRACE KARIN Women's Chiffon Maxi Dress", "$42.99", 4.5, 7012, "Runs small — size up"),
      makeProduct("Verdusa Women's Satin Maxi Slip Dress", "$37.99", 4.3, 9345),
    ],
  },
  {
    id: "floral-dresses",
    title: "Floral Wedding Guest Dresses",
    description: "Beautiful floral print dresses perfect for garden and outdoor weddings. Fresh, feminine, and always in style.",
    slug: "floral-wedding-guest-dresses",
    products: [
      makeProduct("PRETTYGARDEN Women's Floral Wrap Midi Dress", "$36.99", 4.5, 11456),
      makeProduct("ECOWISH Women's Floral V-Neck Midi Dress", "$32.99", 4.6, 8789),
      makeProduct("MITILLY Women's Boho Floral Maxi Dress", "$35.99", 4.4, 6012),
      makeProduct("MEROKEETY Women's Floral Ruffle Dress", "$34.99", 4.3, 9345),
      makeProduct("ZESICA Women's Floral Smocked Midi Dress", "$37.99", 4.5, 5678),
      makeProduct("BTFBM Women's Floral Wrap V-Neck Dress", "$33.99", 4.4, 7901),
      makeProduct("GRACE KARIN Women's Floral Chiffon Dress", "$39.99", 4.5, 4234, "True to size"),
      makeProduct("Berydress Women's Floral A-Line Dress", "$28.99", 4.3, 6567),
    ],
  },
  {
    id: "modest-dresses",
    title: "Modest Wedding Guest Dresses",
    description: "Elegant dresses with longer hemlines and higher necklines. Modest styles that are beautiful, fashionable, and appropriate.",
    slug: "modest-wedding-guest-dresses",
    products: [
      makeProduct("GRACE KARIN Women's Modest Midi Dress with Sleeves", "$39.99", 4.5, 8234),
      makeProduct("PRETTYGARDEN Women's High Neck Midi Dress", "$36.99", 4.4, 6567),
      makeProduct("DRESSTELLS Women's Modest Chiffon Maxi Dress", "$42.99", 4.6, 4890),
      makeProduct("BTFBM Women's Long Sleeve Modest Dress", "$35.99", 4.3, 7123),
      makeProduct("MEROKEETY Women's Mock Neck Midi Dress", "$34.99", 4.5, 9456),
      makeProduct("BELONGSCI Women's Modest A-Line Midi Dress", "$38.99", 4.4, 5789),
      makeProduct("ZESICA Women's High Neck Long Sleeve Dress", "$37.99", 4.5, 3012, "True to size"),
      makeProduct("Ever-Pretty Women's Modest Long Evening Dress", "$44.99", 4.6, 8345),
    ],
  },
  {
    id: "long-sleeve-dresses",
    title: "Long Sleeve Wedding Guest Dresses",
    description: "Stylish long sleeve dresses for cooler weather weddings. These elegant options keep you warm while looking amazing.",
    slug: "long-sleeve-wedding-guest-dresses",
    products: [
      makeProduct("PRETTYGARDEN Women's Long Sleeve Wrap Dress", "$37.99", 4.5, 9567),
      makeProduct("GRACE KARIN Women's Long Sleeve Midi Dress", "$41.99", 4.4, 7890),
      makeProduct("BTFBM Women's Long Sleeve V-Neck Dress", "$35.99", 4.6, 6123),
      makeProduct("MEROKEETY Women's Long Sleeve A-Line Dress", "$34.99", 4.3, 8456),
      makeProduct("BELONGSCI Women's Long Sleeve Tie Waist Dress", "$39.99", 4.5, 4789, "Runs small — size up"),
      makeProduct("LILLUSORY Women's Long Sleeve Sweater Dress", "$42.99", 4.4, 7012),
      makeProduct("ANRABESS Women's Long Sleeve Ribbed Dress", "$36.99", 4.5, 5345),
      makeProduct("Verdusa Women's Long Sleeve Satin Dress", "$40.99", 4.3, 8678),
    ],
  },
];

// ─── BY VENUE ────────────────────────────────────────
export const venueSections: HomepageSection[] = [
  {
    id: "beach-dresses",
    title: "Beach Wedding Guest Dresses",
    description: "Light, flowy dresses perfect for seaside ceremonies. These breezy styles look stunning against the ocean backdrop.",
    slug: "beach-wedding-guest-dresses",
    products: [
      makeProduct("PRETTYGARDEN Women's Beach Flowy Maxi Dress", "$34.99", 4.5, 10234),
      makeProduct("ECOWISH Women's Beach Wrap Midi Dress", "$31.99", 4.4, 8567),
      makeProduct("MITILLY Women's Boho Beach Maxi Dress", "$35.99", 4.3, 6890),
      makeProduct("ZESICA Women's Tropical Print Midi Dress", "$33.99", 4.6, 9123),
      makeProduct("BTFBM Women's Beach V-Neck Sundress", "$29.99", 4.5, 5456, "True to size"),
      makeProduct("MEROKEETY Women's Chiffon Beach Dress", "$36.99", 4.4, 7789),
      makeProduct("ANRABESS Women's Casual Beach Maxi Dress", "$32.99", 4.5, 4012),
      makeProduct("Berydress Women's Light Beach Dress", "$27.99", 4.3, 8345),
    ],
  },
  {
    id: "garden-party-dresses",
    title: "Garden Party Wedding Guest Dresses",
    description: "Romantic and feminine dresses for outdoor garden weddings. Florals, pastels, and flowing silhouettes that complement natural settings.",
    slug: "garden-party-wedding-guest-dresses",
    products: [
      makeProduct("PRETTYGARDEN Women's Floral Garden Dress", "$36.99", 4.5, 8901),
      makeProduct("ECOWISH Women's Floral Midi Garden Dress", "$33.99", 4.4, 7234),
      makeProduct("MITILLY Women's Romantic Floral Maxi Dress", "$37.99", 4.6, 5567),
      makeProduct("ZESICA Women's Smocked Floral Garden Dress", "$35.99", 4.3, 8890),
      makeProduct("MEROKEETY Women's Flutter Sleeve Garden Dress", "$34.99", 4.5, 6123),
      makeProduct("BTFBM Women's Pastel V-Neck Midi Dress", "$32.99", 4.4, 4456),
      makeProduct("GRACE KARIN Women's Chiffon Garden Dress", "$39.99", 4.5, 7789, "Runs large — size down"),
      makeProduct("BELONGSCI Women's Floral Tea Length Dress", "$38.99", 4.3, 9012),
    ],
  },
  {
    id: "indian-wedding-dresses",
    title: "Indian Wedding Guest Dresses",
    description: "Vibrant, colorful dresses and outfits perfect for Indian wedding celebrations. Think rich fabrics, bright colors, and elegant embellishments.",
    slug: "indian-wedding-guest-dresses",
    products: [
      makeProduct("GRACE KARIN Women's Embellished Maxi Dress", "$44.99", 4.5, 6789),
      makeProduct("Ever-Pretty Women's Sequin V-Neck Gown", "$49.99", 4.4, 8012),
      makeProduct("DRESSTELLS Women's Embroidered Formal Dress", "$46.99", 4.6, 5345),
      makeProduct("PRETTYGARDEN Women's Jewel Tone Maxi Dress", "$39.99", 4.3, 7678),
      makeProduct("BTFBM Women's Rich Colored Wrap Dress", "$36.99", 4.5, 4901),
      makeProduct("Verdusa Women's Satin Embellished Dress", "$42.99", 4.4, 6234),
      makeProduct("MUADRESS Women's Bright Chiffon Gown", "$45.99", 4.5, 8567, "True to size"),
      makeProduct("BELONGSCI Women's Vibrant Formal Maxi Dress", "$43.99", 4.6, 3890),
    ],
  },
];

// ─── HOMEPAGE FAQS ────────────────────────────────────────
export const homepageFaqs: FAQ[] = [
  {
    question: "What should I wear as a wedding guest?",
    answer: "The best wedding guest dress depends on the dress code, venue, and season. For formal weddings, choose a floor-length or midi dress in an elegant fabric. For casual weddings, a pretty sundress or flowy midi works perfectly. Always check the invitation for dress code guidance and consider the venue — a beach wedding calls for lighter fabrics than a ballroom event.",
  },
  {
    question: "What colors should I avoid as a wedding guest?",
    answer: "The main color to avoid is white, cream, or ivory — anything that could be mistaken for a bridal gown. Some couples also prefer guests avoid wearing all-black to their wedding. Very bright neon colors or overly flashy outfits that might distract from the bride should also be reconsidered. When in doubt, opt for jewel tones, pastels, or rich earth tones.",
  },
  {
    question: "Is it OK to wear black to a wedding?",
    answer: "Yes, black is generally acceptable for most weddings, especially for evening or formal events. A chic black cocktail dress or elegant black gown is a classic and sophisticated choice. However, for very casual daytime or outdoor weddings, you might want to opt for something more colorful. If you're unsure, you can always add colorful accessories to brighten up a black dress.",
  },
  {
    question: "What is cocktail attire for a wedding?",
    answer: "Cocktail attire means a dress that falls at or just above the knee to mid-calf (midi length). It's dressier than casual but not as formal as black tie. Think elegant fabrics like silk, chiffon, or lace in solid colors or tasteful prints. Pair with heels or dressy flats and elegant jewelry. A well-fitted cocktail dress is one of the most versatile options for wedding guest attire.",
  },
  {
    question: "Can I wear a long dress to a casual wedding?",
    answer: "Absolutely! A flowy maxi dress in a casual fabric like cotton or jersey is perfect for casual weddings. The key is choosing relaxed silhouettes and fabrics that don't look overly formal. Pair it with flat sandals or wedges rather than formal heels to keep the look appropriately casual and comfortable.",
  },
  {
    question: "What should I wear to a beach wedding?",
    answer: "For a beach wedding, choose light, breathable fabrics like chiffon, cotton, or linen. Flowy midi or maxi dresses work beautifully. Avoid heavy fabrics and overly structured styles. Opt for flat sandals, wedges, or block heels that won't sink in the sand. Bright colors, tropical prints, and pastels all work wonderfully for seaside celebrations.",
  },
  {
    question: "How much should I spend on a wedding guest dress?",
    answer: "A great wedding guest dress doesn't have to break the bank. Amazon offers beautiful options ranging from $25 to $60 that look much more expensive than their price tag. The key is focusing on fit and fabric quality rather than brand names. Many of the most popular wedding guest dresses on Amazon are under $40 and have thousands of positive reviews.",
  },
  {
    question: "What should I wear to a fall wedding?",
    answer: "Fall weddings call for rich, warm colors like burgundy, emerald green, rust, navy, and plum. Long sleeves or three-quarter sleeves are perfect for cooler weather. Fabrics like velvet, satin, and chiffon add a seasonal elegance. Midi and maxi lengths work well, and you can layer with a stylish wrap or shawl for outdoor ceremonies.",
  },
];
