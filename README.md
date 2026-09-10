# 意味ワームホール — 関係でたどる辞書

静的HTMLだけで動く辞書＋言葉銀河です。ビルド不要です。

## ファイル
- `index.html` — UI
- `styles.css` — デザイン
- `js/data.js` — 179語の安定した性質辞典・性質パターン
- `js/providers.js` — Wiktionary / Wikipedia / ConceptNet 接続
- `js/engine.js` — 辞書統合・性質判定・関連語スコア
- `js/galaxy.js` — 性質の近さによる銀河配置
- `js/app.js` — UI

## 外部データの役割
- Wiktionary: 意味、辞書内リンク、検索候補
- ConceptNet: Synonym / IsA / PartOf / UsedFor / CapableOf / HasProperty / Antonym などの関係
- ConceptNet Numberbatch: 追加の関連語
- WordNet: ConceptNet の edge dataset が WordNet 由来の場合、WordNet として出典表示
- Wikipedia: 未登録の候補語を一括で説明取得し、性質推定の補助に使用

## 銀河のルール
共通する性質が0個の言葉は表示しません。
中心からの距離は主に「共通する性質の重なり」で決めます。ConceptNetの関連度や直接関係は補助点です。

## 公開
このフォルダをそのまま Vercel / Netlify / GitHub Pages に置けます。
ローカルで確認する場合は簡易HTTPサーバー推奨:
`python -m http.server 8000`
