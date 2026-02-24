export const guides = [
  {
    slug: 'ses-resume-writing',
    keyword: 'SES 職務経歴書 書き方',
    title: 'SES職務経歴書の書き方完全ガイド【実務ベース例文付き】',
    description:
      'SES職務経歴書で評価されるポイント、書く順番、実績の言語化、テンプレートをまとめて解説。',
    updatedAt: '2026-02-24',
    readingMinutes: 8,
    sections: [
      {
        heading: 'SES職務経歴書で見られる3つの観点',
        body: '採用側は「担当範囲」「再現性」「成果」を見ています。担当した工程を明確にし、同様の現場で再現できる根拠を示し、定量的な結果を添えると評価されやすくなります。',
      },
      {
        heading: '書くべき項目と順番',
        body: '基本情報、技術スタック、案件概要、担当工程、課題と対応、成果の順で書くと読み手の理解が速くなります。案件ごとにフォーマットを統一すると比較されやすくなります。',
      },
      {
        heading: '採用側に伝わる実績の書き方',
        body: '「課題→行動→結果」の3点で簡潔に記載します。例: テスト工数の偏りを課題とし、ケース設計を見直し、工数を20%削減した、のように書くと伝わります。',
      },
      {
        heading: 'そのまま使える記載テンプレート',
        body: '案件名、期間、体制、役割、使用技術、担当工程、成果を固定項目として記載し、案件ごとの差分だけを更新する運用にすると効率的です。',
      },
      {
        heading: '提出前チェックリスト',
        body: '抽象語の多用、誤字脱字、定量情報の不足を最終確認します。面談で深掘りされる箇所は補足メモを作り、回答の一貫性を確保します。',
      },
    ],
    relatedSlugs: ['ses-skillsheet-template', 'ses-interview-prep'],
  },
  {
    slug: 'ses-skillsheet-template',
    keyword: 'SES スキルシート テンプレ',
    title: 'SESスキルシートテンプレート｜通過率を上げる書き方',
    description:
      'SESスキルシートで必須の項目、NG例、技術別アピール例、更新ルールを実務向けに整理。',
    updatedAt: '2026-02-24',
    readingMinutes: 7,
    sections: [
      {
        heading: 'スキルシートの目的',
        body: '面談前に「この人が現場で何を再現できるか」を伝えるための資料です。技術名の羅列ではなく、どの工程でどう使ったかを示すことが重要です。',
      },
      {
        heading: '必須項目テンプレート',
        body: '技術要素、経験年数、担当工程、チーム規模、成果をセットで記載します。最低限この5点がそろうと判断しやすい資料になります。',
      },
      {
        heading: 'NG例（抽象的・定量性なし）',
        body: '「Java経験あり」のみでは評価されません。API開発件数、障害対応件数、改善率など、数値か具体的行動で補強してください。',
      },
      {
        heading: '技術別の実務アピール例',
        body: 'Reactなら画面改修の規模、TypeScriptなら型導入で防いだ不具合、Node.jsならAPI運用で改善した指標を示すと具体性が上がります。',
      },
      {
        heading: '更新頻度の目安',
        body: '案件終了時、月次レビュー時、面談前の3タイミングで更新すると、常に最新の状態を保てます。',
      },
    ],
    relatedSlugs: ['ses-resume-writing', 'ses-project-selection'],
  },
  {
    slug: 'ses-interview-prep',
    keyword: 'SES 面談 対策',
    title: 'SES面談対策チェックリスト｜質問例と回答の作り方',
    description:
      'SES面談で聞かれる質問、回答フレーム、逆質問、当日準備をチェックリスト形式で解説。',
    updatedAt: '2026-02-24',
    readingMinutes: 6,
    sections: [
      {
        heading: '面談で評価されるポイント',
        body: '技術適合だけでなく、コミュニケーション、課題解決姿勢、立ち上がり速度が見られます。現場での再現性を短く説明できる準備が必要です。',
      },
      {
        heading: 'よく聞かれる質問10選',
        body: '得意技術、苦手技術、直近案件の役割、トラブル対応、改善経験などが頻出です。回答は実例ベースで、曖昧な一般論を避けます。',
      },
      {
        heading: '回答を組み立てるフレーム',
        body: '結論→背景→行動→結果の順に話すと伝達が安定します。1回答は30〜60秒でまとめ、深掘りに備えて補足を用意します。',
      },
      {
        heading: '逆質問で差をつける',
        body: '開発体制、レビュー運用、技術負債対応、オンボーディングを確認すると、参画後のミスマッチを減らせます。',
      },
      {
        heading: '前日/当日の確認リスト',
        body: '職務経歴書とスキルシートの整合、通信環境、回答メモ、面談ログ記録用テンプレートを事前に準備します。',
      },
    ],
    relatedSlugs: ['ses-resume-writing', 'ses-skillsheet-template'],
  },
  {
    slug: 'ses-project-selection',
    keyword: 'SES 案件 選び方',
    title: 'SES案件の選び方｜失敗しない判断基準7つ',
    description: 'SES案件選定で見るべき指標、避けたい案件、確認質問をチェックリストで解説。',
    updatedAt: '2026-02-24',
    readingMinutes: 7,
    sections: [
      { heading: '案件選びで見るべき指標', body: '単価、工程、技術、体制、働き方を同じ軸で比較します。' },
      { heading: '成長につながる案件の特徴', body: 'レビュー文化、明確な役割、技術的裁量がある現場は経験値が積み上がりやすいです。' },
      { heading: '避けたい案件パターン', body: '要件が曖昧で責任分界が不明確な案件は、疲弊しやすく実績化もしづらくなります。' },
      { heading: '提案時に確認すべき質問', body: '期待役割、評価基準、オンボーディング、体制を確認し、ミスマッチを防ぎます。' },
      { heading: '判断チェックシート', body: '比較項目を点数化し、感覚で決めない運用にすると失敗を減らせます。' },
    ],
    relatedSlugs: ['ses-rate-negotiation', 'ses-project-comparison'],
  },
  {
    slug: 'ses-rate-negotiation',
    keyword: 'SES 単価 交渉',
    title: 'SES単価交渉のポイント｜準備から交渉フレーズまで',
    description: 'SES単価交渉で使える準備手順、根拠作り、フレーズ、失敗時のリカバリを整理。',
    updatedAt: '2026-02-24',
    readingMinutes: 6,
    sections: [
      { heading: '交渉前にそろえる根拠データ', body: '担当範囲、成果、稼働安定性、代替性の低さを証明できる材料を準備します。' },
      { heading: '伝える順番', body: '実績、再現性、市場水準の順で伝えると、価格議論が感情論になりにくくなります。' },
      { heading: '使える交渉フレーズ', body: '「現在の担当範囲と成果に対して、次契約では単価見直しを相談したいです」と簡潔に始めます。' },
      { heading: '断られた時の次アクション', body: '再評価タイミングを合意し、必要条件を明文化して次回交渉に備えます。' },
      { heading: '交渉ログテンプレ', body: '交渉日、提示額、先方理由、次回条件を残し、改善サイクルを作ります。' },
    ],
    relatedSlugs: ['ses-project-selection', 'ses-interview-log-usage'],
  },
  {
    slug: 'ses-growth-projects',
    keyword: 'SES 成長できる 案件',
    title: 'SESで成長できる案件の特徴｜技術が積み上がる現場の見分け方',
    description: 'SESで成長しやすい案件の特徴、現場確認ポイント、継続判断の基準を解説。',
    updatedAt: '2026-02-24',
    readingMinutes: 6,
    sections: [
      { heading: '成長案件の共通点', body: '目標が明確でフィードバックが早い現場は学習速度が上がります。' },
      { heading: '技術負債が少ない現場のサイン', body: 'レビュー運用、テスト整備、リリース手順が定義されているか確認します。' },
      { heading: '参画前ヒアリング項目', body: '体制、役割、期待成果、保守比率を確認し、実務での伸びしろを判断します。' },
      { heading: '3か月で評価する基準', body: '任される範囲が広がっているか、改善提案が通るかを評価軸にします。' },
      { heading: '継続/離脱の判断軸', body: '学習機会、報酬、働き方の3点で継続可否を決めるとブレにくくなります。' },
    ],
    relatedSlugs: ['ses-project-selection', 'ses-career-path'],
  },
  {
    slug: 'ses-achievement-appeal',
    keyword: 'SES 実績 アピール',
    title: 'SES実績アピールの作り方｜面談で刺さる実績の言語化',
    description: 'SES実績を面談で伝わる形に変える方法を、定量化と例文ベースで解説。',
    updatedAt: '2026-02-24',
    readingMinutes: 6,
    sections: [
      { heading: '実績は課題・行動・結果で書く', body: '読み手が価値を判断しやすい順に並べると伝達効率が上がります。' },
      { heading: '数字がない実績を定量化する方法', body: '件数、期間、影響範囲、再発率など間接指標で定量化します。' },
      { heading: '技術別アピール例文', body: '技術名だけでなく、何を改善したかまで書くことで評価されやすくなります。' },
      { heading: '30秒自己紹介に落とし込む', body: '強みを1つに絞り、代表実績を1件添えて話すと印象に残ります。' },
      { heading: '再利用できるフォーマット', body: '職務経歴書、スキルシート、面談回答で共通利用できる形で保存します。' },
    ],
    relatedSlugs: ['ses-resume-writing', 'ses-interview-prep'],
  },
  {
    slug: 'ses-career-path',
    keyword: 'SES キャリアパス',
    title: 'SESキャリア設計の考え方｜1年後に差がつく行動計画',
    description: 'SESエンジニア向けに、目標設定、優先スキル、月次レビューの進め方を解説。',
    updatedAt: '2026-02-24',
    readingMinutes: 7,
    sections: [
      { heading: '目標設定の手順', body: '到達したい役割から逆算し、四半期単位で行動目標へ分解します。' },
      { heading: 'スキル優先順位づけ', body: '市場価値、実務機会、学習コストの3軸で優先順位を決めます。' },
      { heading: '実務経験の積み方', body: '案件選定時に経験したい工程を明示し、役割獲得を狙います。' },
      { heading: '月次レビューのやり方', body: '行動、成果、課題、次月計画を固定フォーマットで振り返ります。' },
      { heading: 'キャリアシートへの反映', body: '積み上げた実績を定期的に転記して、常に提出可能な状態を維持します。' },
    ],
    relatedSlugs: ['ses-growth-projects', 'ses-project-comparison'],
  },
  {
    slug: 'ses-project-comparison',
    keyword: 'SES 案件 比較',
    title: 'SES案件比較チェックリスト｜提案案件を迷わず選ぶ',
    description: 'SES案件を比較する際の評価項目、重みづけ、テンプレートを実務向けに紹介。',
    updatedAt: '2026-02-24',
    readingMinutes: 6,
    sections: [
      { heading: '比較項目', body: '技術、単価、体制、勤務形態、将来性を同一フォーマットで並べます。' },
      { heading: '重みづけの決め方', body: '短期収入か中長期成長かを先に決めると判断がぶれません。' },
      { heading: '失敗しやすい比較パターン', body: '単価だけで決める、情報不足で判断する、締切に追われる判断は避けます。' },
      { heading: '比較表テンプレ', body: '項目ごとに5段階評価し、総合点と懸念点を併記します。' },
      { heading: '最終判断フロー', body: '点数、懸念、将来性の順で確認し、納得度の高い選択を行います。' },
    ],
    relatedSlugs: ['ses-project-selection', 'ses-career-path'],
  },
  {
    slug: 'ses-interview-log-usage',
    keyword: 'SES 面談ログ',
    title: 'SES面談ログの活用法｜通過率を上げる振り返り手順',
    description: 'SES面談ログを次回改善につなげるための記録項目、分析手順、反映方法を解説。',
    updatedAt: '2026-02-24',
    readingMinutes: 6,
    sections: [
      { heading: '面談ログに残すべき項目', body: '質問、回答、反応、評価懸念、次回改善を最低限記録します。' },
      { heading: '不通過理由のパターン化', body: '技術不足、説明不足、ミスマッチを分類し、再発防止に使います。' },
      { heading: '改善アクションへの落とし込み', body: '改善は1回の面談で1〜2点に絞ると効果検証しやすくなります。' },
      { heading: '次回面談への反映テンプレ', body: '改善項目を自己紹介、実績説明、逆質問に割り当てて準備します。' },
      { heading: '月次で見る通過率', body: '通過率を追うことで、改善施策の有効性を判断できます。' },
    ],
    relatedSlugs: ['ses-interview-prep', 'ses-rate-negotiation'],
  },
];

export const guideMap = Object.fromEntries(guides.map((guide) => [guide.slug, guide]));
