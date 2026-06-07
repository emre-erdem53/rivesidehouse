// Statik pazarlama içeriği + HotelRunner mock verisi için kaynak.
// RoomType verisi hem genel site hem de DB seed + HotelRunner mock adapter tarafından kullanılır.

export type RoomContent = {
  invCode: string;
  slug: string;
  name: string;
  badge: string;
  shortDesc: string;
  description: string;
  basePrice: number;
  capacity: number;
  sizeSqm: number;
  bedType: string;
  heroImage: string;
  amenities: { icon: string; label: string }[];
};

export const rooms: RoomContent[] = [
  {
    invCode: "RTH-RIVERSIDE",
    slug: "riverside-deluxe",
    name: "Riverside Deluxe",
    badge: "Signature",
    shortDesc: "Nehir kıyısında, panoramik camlı imza tiny house.",
    description:
      "El işçiliği ahşap detaylarıyla bezeli, nehrin hemen kıyısında konumlanan imza tiny house'umuz. Tabandan tavana camları ile doğanın sislerini kapınıza davet eder; özel terası ve şömine sıcaklığıyla derin bir huzur sunar.",
    basePrice: 4200,
    capacity: 2,
    sizeSqm: 45,
    bedType: "King Size Yatak",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQPD7YaazZm8gRIJqolPVuWOdEdRlpWQASi-5FjYe4rymrF3buvkpBTGUh1ikyXktqFLhyxFfrZzagy9UVKigpWxy1QZibVrvYWiyRjq6wkBZl0VA1qv1tbT1SaOyFmo4j_JC7asyLi7eMwH2OAyif1e49n8G0s05VJjoPTDNiZFmKnaGFHB0ZVNiB_c2rpGldYV9MScvPKL8y-bGIYziKchwFDjUQBtqw5LwrL99dFZdUVefp8nemQmdI_9B6XpkGrROPCqkcOQg",
    amenities: [
      { icon: "square_foot", label: "45 m²" },
      { icon: "bed", label: "1 King Yatak" },
      { icon: "landscape", label: "Nehir Manzarası" },
      { icon: "bathtub", label: "Jakuzili Banyo" },
    ],
  },
  {
    invCode: "RTH-PANORAMA",
    slug: "panorama-suite",
    name: "Panorama Suite",
    badge: "Premium",
    shortDesc: "180 derece vadi manzaralı, geniş teraslı premium suit.",
    description:
      "Köşe konumuyla kesintisiz, tabandan tavana camlardan 180 derecelik vadi ve nehir manzarası sunan premium suitimiz. Minimalist lüksün ustalıkla harmanlandığı, geniş çevre terası ve özel espresso barı ile donatılmış bir kaçış noktası.",
    basePrice: 6500,
    capacity: 3,
    sizeSqm: 60,
    bedType: "Super King Yatak",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCvLJ9TWHfpMrB95SQqcbGMBxtOJq6ruM4fEbmM2B8Goi0dM83RPC9dyafcldZFMeSWe9d6RlDQzas1xSq60UH743cb2dWR_uH5ZzATWKTcGy-6tgwdPvxMDoykunTm33rJmhdLgaGEYlCv65Mm7p7_ZubgSh5XazWnPOkJgoQpqGnBA5MjVaRqwnaSSF57xNy7ueTgtWdBoVwmnF8DiEg8Eg9dILXRRkp5wR27kvr1KgagSdXZisn_F6CxIYTkyCx1SPTsL-uORIQ",
    amenities: [
      { icon: "square_foot", label: "60 m²" },
      { icon: "bed", label: "1 Super King" },
      { icon: "deck", label: "Çevre Terası" },
      { icon: "local_cafe", label: "Espresso Bar" },
    ],
  },
  {
    invCode: "RTH-FOREST",
    slug: "forest-cabin",
    name: "Forest Cabin",
    badge: "Secluded",
    shortDesc: "Çam ormanı içinde, mahremiyetin zirvesi tiny house.",
    description:
      "Tam bir mahremiyet için çam korusunun derinliklerine yerleştirilmiş bağımsız tiny house'umuz. Doğaya karışan koyu yakılmış ahşap dış cephesi ve özel şöminesi etrafında şekillenen sıcak, aydınlık iç mekanıyla zamanı unutturur.",
    basePrice: 3800,
    capacity: 2,
    sizeSqm: 35,
    bedType: "King Size Yatak",
    heroImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCCr0_mf7YMrRcR7Z5O896thOlMMpSlYACPfSOe3jLUPT85p0fhiTtFoHlwSqwgv7MErlZLg61mOFwHmrTgr-dgCoinWPAlCOmKUppoLFcluC1S-5wEThZEbTYmeL0bMJp-uXTrrE5EVSHFsbBs7CGfCamTkT_-XlMC945Rtz-pDQhTrpvz04UJ4nkuFoeTyPitfE7guWRHSkCP69HWW745_WaYoOdkqeGG7j5BzYAikYSiwU5gcmO2p9_WcZPUTTbfprx5WOq2tcA",
    amenities: [
      { icon: "square_foot", label: "35 m²" },
      { icon: "bed", label: "1 King Yatak" },
      { icon: "fireplace", label: "Odun Sobası" },
      { icon: "forest", label: "Özel Koru" },
    ],
  },
];

export const experiences = [
  {
    icon: "restaurant",
    title: "Yerel Lezzetler",
    desc: "Bölgenin en taze malzemeleriyle hazırlanan, geleneksel Karadeniz mutfağının modern yorumları.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDbrqWf9VvfIsNVm9C-e38mDtqGRGTTAnHNloRYYqY5uuttzmCjqiqv4SXuQ2_9rV7EeSlUdyfZ9XT7t82Ua8OzOvJxdSYE7ya8yRhnLK_1GAKCICRq3yGZDPYOk2FL5LlScpaa0nlEvInJRDpaYbLWAeCskLpAfoT9OA7AU-VJrrTnnJaQX70c7oArmiONaFJT9yQEw9WpCZAuotuRlxi3qEKVjPtB0GW-GB1DH5QzpNAzjfVany8e2HrVinAkWmOGnSd52R9tmQo",
  },
  {
    icon: "spa",
    title: "Nehir Kenarı Wellness",
    desc: "Nehrin sesi eşliğinde, doğanın şifalı bitkileri ve dağ kaynak sularıyla yenilenme zamanı.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCs6yBOgMQvj71CIC9NKrrLx_3s_1smbzxreStb-9fjen7afCEWYhFhtKKS2LB-_yeSbiVn8Z5gAJDtlQtekLB0sQEYFtyAHbv1bMob0w84k-27LQERs1Wiln98BdV47d8LokiYlNh6EPWYxmWiabt6wLdGP0JQxwVr5rgC1cIF13-Y6ORjMBVNnTxbuKT1V_2-QRGp0GMdl9AXUGc3dHXX2seVSLId90ZVPfwMMQ7bE_-CCc5aSdl_XKNr3nQI6xEMJjItP-30NuM",
  },
  {
    icon: "hiking",
    title: "Doğa Yürüyüşleri",
    desc: "Rehber eşliğinde nehir yolları boyunca, endemik bitkiler ve gizli şelaleler arasında bir keşif.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCxv3sVN9c_YgZn42LlPQ6wQmWX1Phw3T7S7XInjnxLB5cUchXBtDieijlNLc94_ZGkkJrPtt40g-yCMtru3nxhsf2rQMxjuCRSNPW1RXcTTRGhrXNHskpdg_P2BHQ7xuScml0OMCHeWA5lsRzgV-nSdu33SPsRYnhkceUyKFb9FMO2k01FZHPoOYeTaCzV21FQDSBHOzIT_Yli2SziWizuvGnyY8TkEkhS1Ev-KORWKDo-wmNBnya4ZP5-8SRQSyOYsLu1Do3L2u4",
  },
];

export const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBfxTTjzR2dp9GZ0GO-ovajHYqsNCkHQ8wH1yZtOzGhkjwzgMDn5tYrDBKhy3UuniQkB4M5K3FI3IKX2dVOn1kAZPpekoBjrCOvmMtx3YYU_Wf4d6tfPjccRsTmpmP1IbKrA4nWv3gkirx3Y1_Wk_yJJWeSJrtZNdOa2rrUMN4GJdLIrr0_e7ns8vEVIdNttqc-ux_T5-4F9JS0atIVhlSpt3sAaF_ZtVXUB2wjCd6CkaiDdu0eJ4H50y-IrToddIYdlItQ3aCutPE";
