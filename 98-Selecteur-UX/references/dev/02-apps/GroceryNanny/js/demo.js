// Fictional demonstration, NOT extracted from an uploaded invoice or photograph.
export function demoCheck() {
  const rows = [
    ['Volvic 1,5 L',5,5,0.72,'ok'],
    ['Pago orange 20 cl',8,8,1.12,'ok'],
    ['Haribo Miami Pik',3,2,2.17,'missing'],
    ['Lait demi-écrémé 1 L',4,4,1.09,'ok'],
    ['Œufs — boîte de 6',2,2,2.49,'ok'],
    ['Pâtes penne 500 g',2,2,1.25,'ok'],
    ['Riz basmati 1 kg',2,2,2.80,'ok'],
    ['Tomates concassées 400 g',2,2,0.99,'ok'],
    ['Yaourts nature — pack de 4',2,2,1.85,'ok'],
    ['Beurre doux 250 g',2,2,2.35,'ok'],
    ['Pain de mie complet',2,2,1.69,'ok'],
    ['Café moulu 250 g',2,2,3.49,'ok'],
    ['Compote pomme — pack de 4',3,3,1.99,'ok'],
    ['Chocolat noir 100 g',3,3,1.39,'ok'],
    ['Jus de pomme 1 L',2,2,1.59,'ok'],
    ['Fromage râpé 200 g',2,null,1.89,'uncertain']
  ];
  return {
    order: { retailer: 'Marché Démo', country: 'FR', currency: 'EUR', order_number: 'DEMO-0046', delivery_date: '2026-08-11' },
    summary: { references: 16, commercial_items: 46, ok: 14, missing: 1, surplus: 0, wrong: 0, uncertain: 1, confirmed_claim: 2.17, potential_claim: 5.95, manual_time_seconds: 460, check_time_seconds: 31 },
    products: rows.map(([name,expected,detected,unit_price,status]) => ({ean: name === 'Haribo Miami Pik' ? '3103220034774' : null,name,expected,detected,unit_price,status,confidence:status==='uncertain'?0.56:status==='missing'?0.94:0.98}))
  };
}
