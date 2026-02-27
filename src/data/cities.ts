export interface City {
  name: string;
  lat: number;
  lng: number;
  region?: string;
  connections: string[];
}

export const cities: City[] = [
  // Kvemo Kartli & Tbilisi
  { name: 'Tbilisi', lat: 41.7151, lng: 44.8271, region: 'Tbilisi', connections: ['Mtskheta', 'Rustavi', 'Gardabani', 'Marneuli', 'Sagarejo'] },
  { name: 'Rustavi', lat: 41.5495, lng: 45.0360, region: 'Kvemo Kartli', connections: ['Tbilisi', 'Gardabani', 'Marneuli'] },
  { name: 'Gardabani', lat: 41.4622, lng: 45.0947, region: 'Kvemo Kartli', connections: ['Rustavi', 'Tbilisi'] },
  { name: 'Marneuli', lat: 41.4750, lng: 44.8100, region: 'Kvemo Kartli', connections: ['Tbilisi', 'Rustavi', 'Bolnisi', 'Tetritskaro'] },
  { name: 'Bolnisi', lat: 41.4472, lng: 44.5389, region: 'Kvemo Kartli', connections: ['Marneuli', 'Dmanisi'] },
  { name: 'Dmanisi', lat: 41.3333, lng: 44.2000, region: 'Kvemo Kartli', connections: ['Bolnisi', 'Tsalka'] },
  { name: 'Tetritskaro', lat: 41.5500, lng: 44.4667, region: 'Kvemo Kartli', connections: ['Marneuli', 'Tsalka', 'Manglisi'] },
  { name: 'Manglisi', lat: 41.7000, lng: 44.3833, region: 'Kvemo Kartli', connections: ['Tetritskaro', 'Tsalka', 'Mtskheta'] },
  { name: 'Tsalka', lat: 41.6000, lng: 44.0833, region: 'Kvemo Kartli', connections: ['Dmanisi', 'Tetritskaro', 'Manglisi', 'Ninotsminda'] },

  // Abkhazia
  { name: 'Sokhumi', lat: 43.0015, lng: 41.0234, region: 'Abkhazia', connections: ['New Athos', 'Gulripshi'] },
  { name: 'Gagra', lat: 43.3288, lng: 40.2239, region: 'Abkhazia', connections: ['Pitsunda', 'Bzyb', 'Gudauta'] },
  { name: 'Gudauta', lat: 43.1055, lng: 40.6207, region: 'Abkhazia', connections: ['Gagra', 'New Athos'] },
  { name: 'Ochamchire', lat: 42.7122, lng: 41.4686, region: 'Abkhazia', connections: ['Gulripshi', 'Tkvarcheli', 'Gali', 'Mokvi'] },
  { name: 'Tkvarcheli', lat: 42.8500, lng: 41.6833, region: 'Abkhazia', connections: ['Ochamchire', 'Baghmarani'] },
  { name: 'Gali', lat: 42.6333, lng: 41.7333, region: 'Abkhazia', connections: ['Ochamchire', 'Zugdidi'] },
  { name: 'Pitsunda', lat: 43.1667, lng: 40.3333, region: 'Abkhazia', connections: ['Gagra', 'Bzyb'] },
  { name: 'New Athos', lat: 43.0833, lng: 40.8167, region: 'Abkhazia', connections: ['Gudauta', 'Sokhumi'] },
  { name: 'Bzyb', lat: 43.2167, lng: 40.3333, region: 'Abkhazia', connections: ['Gagra', 'Pitsunda'] },
  { name: 'Gulripshi', lat: 43.1000, lng: 41.3833, region: 'Abkhazia', connections: ['Sokhumi', 'Ochamchire', 'Mokvi', 'Baghmarani'] },
  { name: 'Mokvi', lat: 42.7167, lng: 41.5167, region: 'Abkhazia', connections: ['Gulripshi', 'Ochamchire'] },
  { name: 'Baghmarani', lat: 42.8333, lng: 41.6833, region: 'Abkhazia', connections: ['Gulripshi', 'Tkvarcheli'] },

  // South Ossetia
  { name: 'Tskhinvali', lat: 42.2256, lng: 43.9700, region: 'South Ossetia', connections: ['Gori', 'Java', 'Nikozi', 'Eredvi', 'Kornisi', 'Khetagurovo', 'Tamarasheni', 'Prisi', 'Satikari'] },
  { name: 'Java', lat: 42.4000, lng: 43.9333, region: 'South Ossetia', connections: ['Tskhinvali', 'Dzau', 'Kvaisi', 'Kekhvi (South Ossetia)'] },
  { name: 'Kvaisi', lat: 42.5167, lng: 43.6333, region: 'South Ossetia', connections: ['Oni', 'Java'] },
  { name: 'Kornisi', lat: 42.2667, lng: 43.8167, region: 'South Ossetia', connections: ['Tskhinvali', 'Znauri'] },
  { name: 'Leningori', lat: 42.1333, lng: 44.4833, region: 'South Ossetia', connections: ['Dusheti', 'Tsinagar'] },
  { name: 'Znauri', lat: 42.1833, lng: 43.7667, region: 'South Ossetia', connections: ['Kornisi', 'Khetagurovo'] },
  { name: 'Eredvi', lat: 42.1833, lng: 43.9167, region: 'South Ossetia', connections: ['Tskhinvali', 'Vanati'] },
  { name: 'Dzau', lat: 42.4500, lng: 43.9333, region: 'South Ossetia', connections: ['Java'] },
  { name: 'Khetagurovo', lat: 42.2333, lng: 43.8167, region: 'South Ossetia', connections: ['Znauri', 'Tskhinvali'] },
  { name: 'Kekhvi (South Ossetia)', lat: 42.2833, lng: 43.9833, region: 'South Ossetia', connections: ['Java', 'Tamarasheni'] },
  { name: 'Kvemo Achabeti', lat: 42.2333, lng: 43.8500, region: 'South Ossetia', connections: ['Tamarasheni', 'Zemo Achabeti'] },
  { name: 'Zemo Achabeti', lat: 42.2500, lng: 43.8500, region: 'South Ossetia', connections: ['Kvemo Achabeti'] },
  { name: 'Tamarasheni', lat: 42.2167, lng: 43.9667, region: 'South Ossetia', connections: ['Tskhinvali', 'Kekhvi (South Ossetia)', 'Kvemo Achabeti'] },
  { name: 'Nikozi', lat: 42.2000, lng: 43.9667, region: 'South Ossetia', connections: ['Tskhinvali', 'Zemo Nikozi'] }, // Link to Gori is via Zemo Nikozi or direct? Tskhinvali->Nikozi->Gori logic.
  { name: 'Prisi', lat: 42.2333, lng: 43.9667, region: 'South Ossetia', connections: ['Tskhinvali', 'Zemo Prisi'] },
  { name: 'Satikari', lat: 42.2167, lng: 43.9667, region: 'South Ossetia', connections: ['Tskhinvali', 'Zemo Satikari'] },
  { name: 'Tsinagar', lat: 42.2333, lng: 43.9667, region: 'South Ossetia', connections: ['Leningori', 'Zemo Tsinagar'] },
  { name: 'Vanati', lat: 42.2167, lng: 43.9667, region: 'South Ossetia', connections: ['Eredvi', 'Zemo Vanati'] },
  { name: 'Zemo Nikozi', lat: 42.2000, lng: 43.9667, region: 'South Ossetia', connections: ['Nikozi', 'Gori'] },
  { name: 'Zemo Prisi', lat: 42.2333, lng: 43.9667, region: 'South Ossetia', connections: ['Prisi'] },
  { name: 'Zemo Satikari', lat: 42.2167, lng: 43.9667, region: 'South Ossetia', connections: ['Satikari'] },
  { name: 'Zemo Tsinagar', lat: 42.2333, lng: 43.9667, region: 'South Ossetia', connections: ['Tsinagar'] },
  { name: 'Zemo Vanati', lat: 42.2167, lng: 43.9667, region: 'South Ossetia', connections: ['Vanati'] },

  // Kakheti
  { name: 'Telavi', lat: 41.9192, lng: 45.4736, region: 'Kakheti', connections: ['Akhmeta', 'Tsinandali', 'Gurjaani', 'Pshaveli', 'Kvareli'] },
  { name: 'Gurjaani', lat: 41.7439, lng: 45.8000, region: 'Kakheti', connections: ['Telavi', 'Sagarejo', 'Sighnaghi', 'Tsnori', 'Tsinandali'] },
  { name: 'Sagarejo', lat: 41.7361, lng: 45.3300, region: 'Kakheti', connections: ['Tbilisi', 'Gurjaani'] },
  { name: 'Dedoplistskaro', lat: 41.4667, lng: 46.1167, region: 'Kakheti', connections: ['Sighnaghi', 'Tsnori'] },
  { name: 'Lagodekhi', lat: 41.8167, lng: 46.2667, region: 'Kakheti', connections: ['Tsnori', 'Kvareli'] },
  { name: 'Sighnaghi', lat: 41.6167, lng: 45.9167, region: 'Kakheti', connections: ['Gurjaani', 'Tsnori', 'Dedoplistskaro'] },
  { name: 'Tsnori', lat: 41.6167, lng: 45.9667, region: 'Kakheti', connections: ['Sighnaghi', 'Gurjaani', 'Lagodekhi', 'Dedoplistskaro'] },
  { name: 'Kvareli', lat: 41.9500, lng: 45.8167, region: 'Kakheti', connections: ['Lagodekhi', 'Telavi', 'Akhmeta'] },
  { name: 'Tsinandali', lat: 41.9000, lng: 45.5667, region: 'Kakheti', connections: ['Telavi', 'Gurjaani'] },
  { name: 'Akhmeta', lat: 42.0333, lng: 45.2000, region: 'Kakheti', connections: ['Telavi', 'Tianeti', 'Kvareli'] },
  { name: 'Pshaveli', lat: 42.0167, lng: 45.4833, region: 'Kakheti', connections: ['Telavi', 'Omalo'] },
  { name: 'Omalo', lat: 42.3833, lng: 45.6333, region: 'Kakheti', connections: ['Pshaveli', 'Shatili'] },
  { name: 'Shatili', lat: 42.6667, lng: 45.1667, region: 'Kakheti', connections: ['Omalo', 'Dusheti'] },

  // Mtskheta-Mtianeti
  { name: 'Mtskheta', lat: 41.8450, lng: 44.7200, region: 'Mtskheta-Mtianeti', connections: ['Tbilisi', 'Dusheti', 'Kaspi', 'Manglisi'] },
  { name: 'Dusheti', lat: 42.0833, lng: 44.7000, region: 'Mtskheta-Mtianeti', connections: ['Mtskheta', 'Ananuri', 'Tianeti', 'Leningori', 'Shatili'] },
  { name: 'Tianeti', lat: 42.1167, lng: 44.9667, region: 'Mtskheta-Mtianeti', connections: ['Dusheti', 'Akhmeta'] },
  { name: 'Ananuri', lat: 42.1667, lng: 44.7000, region: 'Mtskheta-Mtianeti', connections: ['Dusheti', 'Pasanauri'] },
  { name: 'Pasanauri', lat: 42.3500, lng: 44.6833, region: 'Mtskheta-Mtianeti', connections: ['Ananuri', 'Gudauri'] },
  { name: 'Gudauri', lat: 42.4833, lng: 44.4833, region: 'Mtskheta-Mtianeti', connections: ['Pasanauri', 'Stepantsminda'] },
  { name: 'Stepantsminda', lat: 42.6500, lng: 44.6500, region: 'Mtskheta-Mtianeti', connections: ['Gudauri'] },

  // Samtskhe-Javakheti
  { name: 'Akhaltsikhe', lat: 41.6396, lng: 42.9826, region: 'Samtskhe-Javakheti', connections: ['Borjomi', 'Aspindza', 'Khulo'] },
  { name: 'Aspindza', lat: 41.5667, lng: 43.2500, region: 'Samtskhe-Javakheti', connections: ['Akhaltsikhe', 'Akhalkalaki'] },
  { name: 'Borjomi', lat: 41.8500, lng: 43.4000, region: 'Samtskhe-Javakheti', connections: ['Khashuri', 'Akhaltsikhe', 'Bakuriani', 'Tsaghveri'] },
  { name: 'Bakuriani', lat: 41.7333, lng: 43.4833, region: 'Samtskhe-Javakheti', connections: ['Borjomi', 'Tsaghveri', 'Akhalkalaki'] },
  { name: 'Tsaghveri', lat: 41.8000, lng: 43.4833, region: 'Samtskhe-Javakheti', connections: ['Borjomi', 'Bakuriani'] },
  { name: 'Ninotsminda', lat: 41.2667, lng: 43.5833, region: 'Samtskhe-Javakheti', connections: ['Akhalkalaki', 'Tsalka'] },
  { name: 'Akhalkalaki', lat: 41.4000, lng: 43.4833, region: 'Samtskhe-Javakheti', connections: ['Aspindza', 'Ninotsminda', 'Bakuriani'] },

  // Shida Kartli
  { name: 'Gori', lat: 41.9844, lng: 44.1125, region: 'Shida Kartli', connections: ['Kaspi', 'Kareli', 'Tskhinvali', 'Zemo Nikozi'] },
  { name: 'Kaspi', lat: 41.9194, lng: 44.4231, region: 'Shida Kartli', connections: ['Mtskheta', 'Gori'] },
  { name: 'Khashuri', lat: 41.9931, lng: 43.6021, region: 'Shida Kartli', connections: ['Kareli', 'Surami', 'Borjomi'] },
  { name: 'Surami', lat: 42.0167, lng: 43.5500, region: 'Shida Kartli', connections: ['Khashuri', 'Zestaponi'] },
  { name: 'Kareli', lat: 42.0167, lng: 43.9000, region: 'Shida Kartli', connections: ['Gori', 'Khashuri'] },

  // Imereti
  { name: 'Kutaisi', lat: 42.2500, lng: 42.7000, region: 'Imereti', connections: ['Zestaponi', 'Samtredia', 'Tkibuli', 'Khoni', 'Baghdati', 'Terjola', 'Tskaltubo'] }, // Tskaltubo not in original list but added conn in theory. Remove Tskaltubo from conn if not in list.
  { name: 'Samtredia', lat: 42.1531, lng: 42.3358, region: 'Imereti', connections: ['Kutaisi', 'Abasha', 'Vani', 'Khoni', 'Lanchkhuti'] },
  { name: 'Tkibuli', lat: 42.3500, lng: 42.9833, region: 'Imereti', connections: ['Kutaisi', 'Ambrolauri'] },
  { name: 'Chiatura', lat: 42.2897, lng: 43.2936, region: 'Imereti', connections: ['Zestaponi', 'Sachkhere'] },
  { name: 'Zestaponi', lat: 42.1100, lng: 43.0400, region: 'Imereti', connections: ['Surami', 'Kutaisi', 'Baghdati', 'Chiatura', 'Kharagauli', 'Terjola'] },
  { name: 'Terjola', lat: 42.1833, lng: 43.0000, region: 'Imereti', connections: ['Zestaponi', 'Kutaisi'] },
  { name: 'Vani', lat: 42.0833, lng: 42.5167, region: 'Imereti', connections: ['Samtredia', 'Baghdati', 'Chokhatauri'] },
  { name: 'Baghdati', lat: 42.0667, lng: 42.8167, region: 'Imereti', connections: ['Kutaisi', 'Zestaponi', 'Vani'] },
  { name: 'Kharagauli', lat: 42.0167, lng: 43.2000, region: 'Imereti', connections: ['Zestaponi'] },
  { name: 'Sachkhere', lat: 42.3333, lng: 43.4000, region: 'Imereti', connections: ['Chiatura', 'Oni'] },
  { name: 'Khoni', lat: 42.3167, lng: 42.4167, region: 'Imereti', connections: ['Samtredia', 'Kutaisi', 'Martvili'] },
  { name: 'Abasha', lat: 42.2000, lng: 42.2000, region: 'Imereti', connections: ['Samtredia', 'Senaki'] },

  // Samegrelo-Zemo Svaneti
  { name: 'Zugdidi', lat: 42.5126, lng: 41.8709, region: 'Samegrelo-Zemo Svaneti', connections: ['Khobi', 'Tsalenjikha', 'Jvari', 'Anaklia', 'Gali'] },
  { name: 'Senaki', lat: 42.2706, lng: 42.0644, region: 'Samegrelo-Zemo Svaneti', connections: ['Abasha', 'Poti', 'Khobi', 'Martvili', 'Chkhorotsku (Samegrelo)'] },
  { name: 'Poti', lat: 42.1466, lng: 41.6710, region: 'Samegrelo-Zemo Svaneti', connections: ['Senaki', 'Lanchkhuti', 'Ureki'] },
  { name: 'Anaklia', lat: 42.4000, lng: 41.5667, region: 'Samegrelo-Zemo Svaneti', connections: ['Zugdidi', 'Ganmukhuri'] },
  { name: 'Ganmukhuri', lat: 42.3500, lng: 41.7167, region: 'Samegrelo-Zemo Svaneti', connections: ['Anaklia'] },
  { name: 'Jvari', lat: 42.7167, lng: 42.0500, region: 'Samegrelo-Zemo Svaneti', connections: ['Zugdidi', 'Tsalenjikha', 'Mestia', 'Chkhorotsku (Samegrelo)'] },
  { name: 'Tsalenjikha', lat: 42.5833, lng: 42.0667, region: 'Samegrelo-Zemo Svaneti', connections: ['Zugdidi', 'Jvari', 'Chkhorotsku (Samegrelo)'] },
  { name: 'Chkhorotsku (Samegrelo)', lat: 42.5167, lng: 42.1167, region: 'Samegrelo-Zemo Svaneti', connections: ['Senaki', 'Martvili', 'Tsalenjikha', 'Jvari'] },
  { name: 'Martvili', lat: 42.4167, lng: 42.3667, region: 'Samegrelo-Zemo Svaneti', connections: ['Senaki', 'Khoni', 'Chkhorotsku (Samegrelo)'] },
  { name: 'Khobi', lat: 42.3167, lng: 41.9000, region: 'Samegrelo-Zemo Svaneti', connections: ['Senaki', 'Zugdidi'] },
  { name: 'Mestia', lat: 43.0500, lng: 42.7167, region: 'Samegrelo-Zemo Svaneti', connections: ['Jvari', 'Lentekhi (Samegrelo)'] },
  { name: 'Lentekhi (Samegrelo)', lat: 42.7833, lng: 42.7167, region: 'Samegrelo-Zemo Svaneti', connections: ['Mestia', 'Tsageri'] }, // Connect to Tsageri directly

  // Guria
  { name: 'Ozurgeti', lat: 41.9244, lng: 42.0006, region: 'Guria', connections: ['Lanchkhuti', 'Chokhatauri', 'Kobuleti', 'Ureki'] },
  { name: 'Lanchkhuti', lat: 42.0833, lng: 42.0333, region: 'Guria', connections: ['Samtredia', 'Poti', 'Ozurgeti'] },
  { name: 'Chokhatauri', lat: 42.0167, lng: 42.3167, region: 'Guria', connections: ['Samtredia', 'Ozurgeti', 'Vani'] },
  { name: 'Ureki', lat: 41.9833, lng: 41.7667, region: 'Guria', connections: ['Poti', 'Ozurgeti', 'Kobuleti'] },

  // Adjara
  { name: 'Batumi', lat: 41.6168, lng: 41.6367, region: 'Adjara', connections: ['Chakvi', 'Keda'] },
  { name: 'Kobuleti', lat: 41.8200, lng: 41.7750, region: 'Adjara', connections: ['Ureki', 'Chakvi', 'Ozurgeti'] },
  { name: 'Chakvi', lat: 41.7167, lng: 41.7333, region: 'Adjara', connections: ['Kobuleti', 'Batumi'] },
  { name: 'Keda', lat: 41.6000, lng: 41.9500, region: 'Adjara', connections: ['Batumi', 'Shuakhevi'] },
  { name: 'Shuakhevi', lat: 41.6333, lng: 42.1833, region: 'Adjara', connections: ['Keda', 'Khulo'] },
  { name: 'Khulo', lat: 41.6500, lng: 42.3167, region: 'Adjara', connections: ['Shuakhevi', 'Akhaltsikhe'] },

  // Racha-Lechkhumi and Kvemo Svaneti
  { name: 'Ambrolauri', lat: 42.5167, lng: 43.1500, region: 'Racha-Lechkhumi and Kvemo Svaneti', connections: ['Tkibuli', 'Oni', 'Tsageri'] },
  { name: 'Oni', lat: 42.5833, lng: 43.4500, region: 'Racha-Lechkhumi and Kvemo Svaneti', connections: ['Ambrolauri', 'Sachkhere', 'Kvaisi'] },
  { name: 'Tsageri', lat: 42.6500, lng: 42.7667, region: 'Racha-Lechkhumi and Kvemo Svaneti', connections: ['Kutaisi', 'Ambrolauri', 'Lentekhi (Racha)'] },
  { name: 'Lentekhi (Racha)', lat: 42.7833, lng: 42.7167, region: 'Racha-Lechkhumi and Kvemo Svaneti', connections: ['Tsageri'] }
];