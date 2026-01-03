export interface DemoStep {
  user: string;
  agent: string;
  action?: string;
  tools?: string[];
  links?: { label: string; url: string }[];
}

export interface DemoScenario {
  id: string;
  title: string;
  triggerQuestion: string;
  triggerQuestions?: string[]; // Optional additional triggers for other languages
  steps: DemoStep[];
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: '01_overtourism',
    title: '解決過度觀光：從使用者感受出發的在地避人建議',
    triggerQuestion: '淺草寺這裡人潮多到有點不舒服，附近有沒有人少一點，但也能感受江戶風情的地方？',
    triggerQuestions: [
      'Senso-ji is so crowded it\'s uncomfortable. Are there any less crowded spots nearby that still have that Edo-period vibe?',
      '浅草寺は混雑していて少し不快なのですが、近くに人が少なめで江戸の風情を感じられる場所はありますか？'
    ],
    steps: [
      {
        user: '淺草寺這裡人潮多到有點不舒服，附近有沒有人少一點，但也能感受江戶風情的地方？',
        agent: '非常理解您的感受，淺草地區在假日的人潮確實會影響旅遊品質。\n\n若您想避開人潮並深入感受江戶下町氛圍，我根據專家知識庫為您精選了三個方案：\n\n---\n\n### 🏮 推薦方案 A：今戶神社 (Imado Jinja)\n*   特色：避開主幹道的深度在地選擇，以「招財貓」發源地聞名。\n*   交通：步行或體驗在地人力車即可抵達。\n\n### ⛩️ 推薦方案 B：根津神社 (Nezu Jinja)\n*   特色：擁有壯觀的千本鳥居，氛圍極其寧靜優雅。\n*   交通：搭乘地鐵轉乘約 15 分鐘。\n\n### 🚋 推薦方案 C：柴又帝釋天 (Shibamata Taishakuten)\n*   特色：完美的懷舊老街參道，步調悠閒，適合深度慢遊。\n*   交通：搭乘京成線電車前往。\n\n---\n\n請問您對哪一個方案比較有興趣？我可以為您提供更詳細的路線指引。',
        tools: ['專家知識庫 (Expert Knowledge)', '步行導航']
      },
      {
        user: '去根津神社轉乘會很麻煩嗎？我怕在車站迷路。',
        agent: '別擔心！根津神社的轉乘非常單純。我會為您標註最簡單的轉乘月台編號與出口資訊，確保您不會在車站迷路。\n\n此外，如果您想先在淺草附近試試，要不要先幫您查詢往 今戶神社 的人力車搭乘點與預估費用？這是一個非常具有在地風情的移動方式。',
        action: '切換至步行/人力車推薦模式'
      }
    ]
  },
  {
    id: '02_disruption',
    title: '應對交通中斷：專家知識引導的最優決策',
    triggerQuestion: '我要從東京車站去東京都廳看夜景，但聽說中央線現在大誤點，該怎麼辦？',
    triggerQuestions: [
      'I\'m going to the Tokyo Metropolitan Government Building for the night view, but I heard the Chuo Line is delayed. What should I do?',
      '東京駅から東京都庁へ夜景を見に行きたいのですが、中央線が大幅に遅れていると聞きました。どうすればいいですか？'
    ],
    steps: [
      {
        user: '我要從東京車站去東京都廳看夜景，但聽說中央線現在大誤點，該怎麼辦？',
        agent: '收到！系統偵測到目前 JR 中央快速線 確實發生人員事故，導致大規模延誤。\n\n為了不耽誤您的夜景行程，我強烈建議您改用以下專家備選方案：\n\n1.  改搭路線：地鐵 丸之內線 (Marunouchi Line)\n2.  上車車站：東京站 (M17)\n3.  下車車站：西新宿站 (M07)\n\n這條路線完全不受 JR 延誤影響，且轉乘路徑更為直接。',
        tools: ['實時交通監控 (L2 Status)', '專家轉乘策略']
      },
      {
        user: '為什麼是去西新宿站，而不是新宿站？',
        agent: '這正是 BambiGO 的專家建議精髓：\n\n*   避免複雜結構：JR 新宿站是著名的「迷宮」，出口極其複雜，推著行李或不熟路況的人極易走錯方向。\n*   距離優勢：西新宿站 的結構簡單許多。從該站出口步行前往東京都廳的實際距離，其實比從新宿站出來還要更短、更順暢。\n\n選擇西新宿站，預計能幫您節省至少 10-15 分鐘 的找路與步行時間。',
        action: '顯示西新宿站最佳出口地圖'
      }
    ]
  },
  {
    id: '03_handsfree',
    title: '實踐空手觀光：動態解決行李寄放難題',
    triggerQuestion: '我剛從成田機場到淺草，但飯店下午才能進房，淺草站的置物櫃還有位子嗎？',
    triggerQuestions: [
      'I\'m just arrived at Asakusa from Narita Airport, but I can\'t check into my hotel until this afternoon. Are there any lockers available at Asakusa Station?',
      '成田空港から浅草に着いたばかりですが、ホテルのチェックインは午後からです。浅草駅のロッカーは空いていますか？'
    ],
    steps: [
      {
        user: '我剛從成田機場到淺草，但飯店下午才能進房，淺草站的置物櫃還有位子嗎？',
        agent: '淺草站作為觀光大站，置物櫃的稼動率非常高，特別是在中午時段。\n\n您可以先透過下方的實時連結即時確認站內各區域的空位狀態：',
        links: [{ label: '東京 Metro 置物櫃實時狀態 (淺草站)', url: 'https://www.tokyometro.jp/lang_tw/index.html' }]
      },
      {
        user: '天啊，網頁顯示站內全部客滿了，我不想拖著大行李逛街。',
        agent: '請別擔心！這正是發揮 BambiGO 空手觀光 (Hands-free Travel) 精神的時候。針對淺草站滿櫃的情況，我為您提供兩個最佳備案：\n\n### 🎒 備案一：Ecbo Cloak 在地寄放\n預約附近的合作咖啡廳或商店空間寄放行李，費用與置物櫃相仿，但空間更充裕。\n\n### 🚚 備案二：LUGGAGENT 行李當日配送\n直接由專業團隊在車站收件，將行李直送您的飯店。您可以直接開始輕鬆逛街，行李會準時出現在飯店大廳。\n\n您想嘗試預約哪一種服務？',
        links: [
          { label: 'Ecbo Cloak 預約連結', url: 'https://cloak.ecbo.io/zh-TW' },
          { label: 'LUGGAGENT 服務連結', url: 'https://luggagent.com/zh-TW' }
        ],
        tools: ['第三方服務整合 (Service Integration)']
      }
    ]
  },
  {
    id: '04_accessibility',
    title: '無障礙路線規劃：推嬰兒車的最佳出入口決策',
    triggerQuestion: '我推著嬰兒車要去上野動物園，請問搭到上野站要從哪個出口出來最方便？',
    triggerQuestions: [
      'I\'m going to Ueno Zoo with a stroller. Which exit at Ueno Station is the most convenient?',
      'ベビーカーで上野動物園に行きたいのですが、上野駅のどの出口が一番便利ですか？'
    ],
    steps: [
      {
        user: '我推著嬰兒車要去上野動物園，請問搭到上野站要從哪個出口出來最方便？',
        agent: '帶著嬰兒車同行，最重要的是避開階梯與漫長的電梯排隊。根據 ODPT 設施數據 與專家路線建議，您的最佳選擇是：\n\n📍 「JR 上野站 - 公園口 (Park Exit)」\n\n這是上野站針對無障礙需求設計最友善的出口。',
        tools: ['ODPT 設施數據 (Amenity Data)']
      },
      {
        user: '那個出口出來就有電梯或斜坡嗎？',
        agent: '是的，選擇 公園口 的優勢在於：\n\n*   ✅ 完全零高低差：公園口改建後，出口層即與外部公園地面切齊，您完全不需要尋找電梯或搬運嬰兒車。\n*   ✅ 直達動物園：出站後只需穿過行人徒步區即可進入上野恩賜公園，步行約 5 分鐘內即可抵達動物園入口。\n\n這比從其他出口找電梯要快上至少 10 分鐘，且體驗更為輕鬆。',
        action: '標註育嬰室與哺乳室位置'
      }
    ]
  }
];
