// Meaning Wormhole dictionary data
// 179 curated seed words + trait patterns.
// This file is intentionally local so the app still works when external dictionaries are slow.

const TRAITS={
 simulate:{label:'頭の中で体験する',bridge:'「実際には今ここで起きていない場面を、頭の中で体験する」',re:/夢|想像|空想|映画|物語|シミュレーション/},
 aspire:{label:'未来を目指す',bridge:'「まだ実現していない未来の状態を思い描き、そこへ向かう」',re:/目標|願望|将来|夢|計画|理想/},
 openclose:{label:'開く・閉じる',bridge:'「必要なときに開いて、中のものを使い、終わったら閉じる」',re:/開閉|開く|閉じる|蓋|ふた|ファスナー|チャック|折りたた|折り畳|展開|収束|扇子|傘|蛇腹|筆箱|筆入れ|財布|鞄|かばん|ケース|箱/},
 portable:{label:'持ち運ぶ',bridge:'「使う場所まで持ち運び、必要なときだけ取り出す」',re:/携帯|持ち運|持参|可搬|ポータブル|手持ち|扇子|傘|カメラ|筆箱|筆入れ|財布|鞄|かばん|バッグ|ポーチ|ケース/},
 cover:{label:'覆う',bridge:'「広げた面で、何かを覆ったり遮ったりする」',re:/覆う|覆い|遮る|遮断|日除け|日よけ|雨除け|傘|屋根|皮膚/},
 protect:{label:'守る',bridge:'「外から来るものを弱めて、中を守る」',re:/保護|守る|防ぐ|防止|防御|遮蔽|傘|皮膚|城壁|ファイアウォール/},
 airflow:{label:'風を動かす',bridge:'「空気の流れをつくって、まわりの感じ方を変える」',re:/送風|風を起こ|風を送|あおぐ|扇ぐ|換気|扇子|扇風機/},
 cool:{label:'冷やす',bridge:'「熱を減らして、暑さをやわらげる」',re:/冷却|冷やす|涼|暑さ|扇子|冷蔵庫|エアコン/},
 wash:{label:'洗って落とす',bridge:'「いらないものや汚れを落として、整った状態に戻す」',re:/洗浄|洗う|汚れ|清潔|入浴|風呂|銭湯|洗濯機/},
 restore:{label:'回復する',bridge:'「減ったものを補って、もう一度使える状態に戻す」',re:/回復|疲労|休息|癒|再生|充電|休養|睡眠|銭湯|病院/},
 flow:{label:'流れる',bridge:'「中身が止まらず、場所から場所へ移っていく」',re:/流れる|流動|液体|血液|水分|河川|ジュース|インク|香水/},
 contain:{label:'中に入れる',bridge:'「中身をひとつの範囲に入れて、外へ散らばらないようにする」',re:/容器|収納|入れる|収容|格納|しまう|収める|保存|冷蔵庫|ボトル|箱|ケース|袋|筆箱|筆入れ|財布|鞄|かばん|ポーチ/},
 organize:{label:'整理してしまう',bridge:'「いくつかのものをまとめて、必要なときに取り出しやすくする」',re:/整理|収納|分類|仕分け|しまう|収める|格納|筆箱|筆入れ|工具箱|引き出し|本棚|財布|データベース|図書館/},
 mix:{label:'混ぜる',bridge:'「違うものを混ぜて、ひとつの新しい状態にする」',re:/混合|混ぜる|ブレンド|配合|料理|発酵|ジュース|香水|インク/},
 transform:{label:'形・状態を変える',bridge:'「使う前と後で、形や状態がはっきり変わる」',re:/変形|変化|変換|折りたた|展開|脱皮|発酵|料理|扇子|傘/},
 collect:{label:'集める',bridge:'「ばらばらのものを、いったん同じ場所へ集める」',re:/集める|集合|集積|集団|集まる|駅|港|学校|広場|図書館/},
 distribute:{label:'送り分ける',bridge:'「集まったものを、行き先ごとに分けて送り出す」',re:/分配|配布|配送|送り出|分岐|駅|港|郵便局|交差点/},
 connect:{label:'つなぐ',bridge:'「離れた点どうしをつないで、行き来できるようにする」',re:/接続|つなぐ|ネットワーク|通信|API|駅|インターネット|SNS/},
 branch:{label:'枝分かれする',bridge:'「一つの流れを、複数の行き先へ分ける」',re:/分岐|枝分かれ|経路|交差点|駅|血管|川/},
 filter:{label:'通す・止めるを選ぶ',bridge:'「全部は通さず、条件に合うものだけを通す」',re:/ろ過|濾過|フィルタ|選別|検査|改札|皮膚|ファイアウォール/},
 repeat:{label:'繰り返す',bridge:'「同じ流れを何度も繰り返して、状態を保ったり変えたりする」',re:/反復|繰り返|周期|毎日|習慣|祭り|儀式|洗濯機|睡眠/},
 record:{label:'残してあとで使う',bridge:'「その瞬間の情報を残し、あとから見返せるようにする」',re:/記録|保存|撮影|写真|カメラ|アーカイブ|図書館|記憶/},
 regulate:{label:'動きを調整する',bridge:'「動きすぎたり足りなかったりしないよう、ちょうどよく調整する」',re:/制御|調整|管理|規制|温度調節|交通整理|交差点|冷蔵庫/},
 exchange:{label:'受け渡す',bridge:'「片方からもう片方へ、何かを受け渡す」',re:/交換|取引|受け渡|販売|共有|銀行|市場|コンビニ|API/},
 grow:{label:'育つ',bridge:'「時間と環境の影響を受けながら、少しずつ変わっていく」',re:/成長|発達|育つ|教育|学習|進化|学校|森|温室|種/},
 separate:{label:'内と外を分ける',bridge:'「境目をつくって、内側と外側を分ける」',re:/境界|膜|内外|壁|皮膚|城壁|家|容器/},
 deviate:{label:'決まりから外れる',bridge:'「期待されているやり方や決まりから外れる」',re:/失礼|無礼|違反|逸脱|エラー|タブー|反則/},
 followrule:{label:'決まりに沿う',bridge:'「みんなが共有している決まりに沿って動く」',re:/礼儀|マナー|規則|ルール|プロトコル|校則|ドレスコード|敬語/},
 signal:{label:'意味を伝える',bridge:'「形や言葉そのものより、そこに込めた合図を相手へ伝える」',re:/挨拶|敬語|サイン|信号|合図|礼儀|失礼/},
 expandcompress:{label:'広がる・縮む',bridge:'「広がったり縮んだりしながら働く」',re:/広が|縮む|収縮|膨張|伸縮|扇子|傘|肺|蛇腹|アコーディオン|翼/},
 store:{label:'ためておく',bridge:'「今すぐ使わないものを、中にためてあとで使う」',re:/蓄積|貯蔵|備蓄|ためる|貯める|電池|ダム|種|脂肪|倉庫|記憶/},
 release:{label:'ためたものを出す',bridge:'「中にためたものを、必要なときに外へ出す」',re:/放出|排出|解放|噴出|発射|ダム|電池|汗腺|火山|スプレー/},
 absorb:{label:'吸いこむ',bridge:'「外にあるものを取りこんで、自分の中へ入れる」',re:/吸収|吸い込|吸着|スポンジ|根|肺|腸|掃除機|土壌/},
 reflect:{label:'はね返す',bridge:'「受けたものを、そのまま通さず別の方向へ返す」',re:/反射|反響|跳ね返|鏡|水面|壁|レーダー|エコー/},
 amplify:{label:'大きくする',bridge:'「小さな入力を、もっと大きな動きや信号にして返す」',re:/増幅|拡大|強める|アンプ|拡声器|レンズ|SNS|てこ/},
 dampen:{label:'弱める',bridge:'「強すぎるものを受け止めて、力を小さくする」',re:/減衰|緩衝|吸音|クッション|ダンパー|森|防波堤|耳栓/},
 sync:{label:'タイミングをそろえる',bridge:'「別々に動くもののタイミングを合わせる」',re:/同期|同調|リズム|時計|指揮者|信号機|心拍|メトロノーム/},
 stack:{label:'重ねる',bridge:'「同じ場所に順番に重ねて、まとまりをつくる」',re:/積層|重ねる|層|地層|本棚|スタック|サンドイッチ|年輪/},
 sort:{label:'分けて並べる',bridge:'「違いを見つけて、種類ごとに分けたり並べたりする」',re:/分類|選別|ソート|仕分け|図書館|郵便局|税関|ふるい/},
 switch:{label:'切り替える',bridge:'「条件に合わせて、動き方や行き先を切り替える」',re:/切替|切り替|スイッチ|信号機|ポイント|神経|分岐器|ルーター/},
 trigger:{label:'きっかけで動き出す',bridge:'「ある合図をきっかけに、次の動きが始まる」',re:/引き金|トリガー|反応|きっかけ|ドミノ|センサー|発芽|アラーム/},
 lock:{label:'動かないよう止める',bridge:'「勝手に動いたり開いたりしないよう固定する」',re:/固定|ロック|施錠|鍵|アンカー|ブレーキ|クリップ|関節/},
 balance:{label:'つり合いをとる',bridge:'「片方に偏りすぎないよう、ちょうどいい位置へ戻す」',re:/均衡|バランス|平衡|天秤|シーソー|自律神経|市場|サーモスタット/},
 pulse:{label:'一定の間隔で動く',bridge:'「止まらず、一定の間隔で動きを繰り返す」',re:/脈動|拍動|パルス|心臓|信号|波|点滅|メトロノーム/},
 rotate:{label:'回り続ける',bridge:'「中心のまわりを回りながら働く」',re:/回転|旋回|車輪|扇風機|歯車|惑星|洗濯機|渦/},
 orbit:{label:'中心のまわりを巡る',bridge:'「中心から離れすぎず、まわりを巡り続ける」',re:/公転|軌道|周回|惑星|衛星|電子|通勤|ルーティン/},
 support:{label:'下から支える',bridge:'「自分が土台になって、別のものが動いたり立ったりできるようにする」',re:/支持|支える|土台|柱|骨格|インフラ|根|サーバー/},
 wrap:{label:'包む',bridge:'「外側から包んで、中身をひとまとまりにする」',re:/包装|包む|ラップ|皮|殻|封筒|布団|雲/},
 peel:{label:'外側をはがす',bridge:'「外側の層を取り除いて、中にあるものを出す」',re:/剥離|はがす|皮むき|脱皮|開封|発掘|玉ねぎ|殻/},
 hatch:{label:'中から出てくる',bridge:'「閉じた中で準備して、ある時点で外へ出る」',re:/孵化|発芽|誕生|卵|種|繭|ポップアップ|展開/},
 pump:{label:'押し出して送る',bridge:'「力を加えて、中のものを別の場所へ押し出す」',re:/ポンプ|圧送|心臓|噴水|注射器|肺|水道|コンプレッサー/},
 migrate:{label:'場所を移す',bridge:'「環境や条件に合わせて、まとまって別の場所へ移る」',re:/移動|移住|渡り|迁移|引っ越し|渡り鳥|データ移行|遊牧/},
 copy:{label:'同じものを増やす',bridge:'「元の形や情報を保ちながら、もう一つ作る」',re:/複製|コピー|増殖|DNA|印刷|クローン|バックアップ|細胞分裂/},
 erase:{label:'跡を消す',bridge:'「残っているものを取り除いて、前の状態を見えなくする」',re:/消去|削除|消す|消しゴム|洗濯|忘却|リセット|漂白/},
 translate:{label:'別の形に言い換える',bridge:'「中身を保ちながら、別の表し方へ置き換える」',re:/翻訳|変換|通訳|エンコード|字幕|地図|楽譜|比喩/},
 substitute:{label:'代わりになる',bridge:'「本来そこにあるものの役目を、別のもので引き受ける」',re:/代替|代用|代理|置換|義手|代用品|プロキシ|影武者/},
 focus:{label:'一点に集める',bridge:'「ばらけたものを、一つの場所や目的へ集中させる」',re:/焦点|集中|集光|レンズ|会議|虫眼鏡|アンテナ|視線/},
 frame:{label:'見える範囲を決める',bridge:'「どこからどこまでを見るかを決めて、意味を切り取る」',re:/枠|フレーム|構図|窓|カメラ|額縁|編集|国境/},
 broadcast:{label:'一度に広く届ける',bridge:'「一つの場所から、たくさんの相手へ同時に届ける」',re:/放送|配信|拡散|SNS|ラジオ|スピーカー|花粉|種子散布/},
 recycle:{label:'使ったものを戻して使う',bridge:'「一度使ったものを、そのまま捨てず別の形でまた使う」',re:/再利用|循環|リサイクル|堆肥|血液循環|古着|再生紙|水循環/}
};
// 抽象タグは補助。具体的なふるまいの後で見る。

if (!TRAITS.rule) {
  TRAITS.rule = {label:'決まりがある', bridge:'「どう動くかを決めるルールがある」', re:/ルール|規則|規範|決まり|ゲーム|手順|制度/};
}

const TRAIT_WEIGHTS={simulate:14,aspire:14,expandcompress:14,organize:13,openclose:12,store:12,release:12,absorb:12,reflect:12,amplify:12,dampen:12,sync:12,sort:12,switch:12,trigger:12,balance:12,pulse:12,rotate:12,orbit:12,wrap:12,peel:12,hatch:12,pump:12,migrate:12,copy:12,erase:12,translate:12,substitute:12,focus:12,frame:12,broadcast:12,recycle:12,airflow:11,wash:11,restore:11,branch:11,filter:11,grow:11,flow:10,mix:10,collect:10,distribute:10,connect:10,record:10,contain:9,portable:9,protect:9,cover:8,repeat:8,regulate:8,exchange:8,transform:8,separate:5,signal:7,deviate:9,followrule:7};

const SEED_WORDS = [{"t":"扇子","d":"道具","tr":["expandcompress","openclose","portable","airflow","cool","transform"],"ab":["変化","境界"]},{"t":"傘","d":"道具","tr":["expandcompress","openclose","portable","cover","protect","transform"],"ab":["変化","境界"]},{"t":"扇風機","d":"道具","tr":["airflow","cool","regulate"],"ab":["変化"]},{"t":"冷蔵庫","d":"道具","tr":["cool","contain","organize","regulate","record"],"ab":["保存","境界"]},{"t":"財布","d":"道具","tr":["contain","organize","portable","openclose"],"ab":["保存","境界"]},{"t":"工具箱","d":"道具","tr":["contain","organize","portable","openclose"],"ab":["保存","境界"]},{"t":"引き出し","d":"家具","tr":["contain","organize","openclose"],"ab":["保存","境界"]},{"t":"本棚","d":"家具","tr":["contain","organize","record"],"ab":["保存","集合"]},{"t":"データベース","d":"情報","tr":["contain","organize","record","filter"],"ab":["保存","集合"]},{"t":"洗濯機","d":"道具","tr":["wash","repeat","regulate","transform"],"ab":["浄化","変化"]},{"t":"充電器","d":"技術","tr":["restore","exchange","regulate"],"ab":["回復","交換"]},{"t":"皮膚","d":"身体","tr":["cover","protect","filter","separate"],"ab":["境界","交換"]},{"t":"城壁","d":"建築","tr":["protect","separate","regulate"],"ab":["境界","規範"]},{"t":"家","d":"建築","tr":["cover","protect","contain","separate"],"ab":["境界","集合"]},{"t":"駅","d":"交通","tr":["collect","distribute","connect","branch"],"ab":["中継","集合"]},{"t":"港","d":"交通","tr":["collect","distribute","exchange","flow"],"ab":["中継","交換"]},{"t":"交差点","d":"交通","tr":["branch","regulate","connect"],"ab":["中継"]},{"t":"郵便局","d":"社会","tr":["collect","distribute","exchange","record"],"ab":["中継","交換"]},{"t":"血管","d":"身体","tr":["flow","connect","branch","distribute"],"ab":["流動","循環"]},{"t":"心臓","d":"身体","tr":["flow","distribute","restore","repeat"],"ab":["循環","回復"]},{"t":"川","d":"自然","tr":["flow","branch","connect"],"ab":["流動","循環"]},{"t":"森","d":"自然","tr":["collect","grow","connect","repeat"],"ab":["集合","成長"]},{"t":"学校","d":"社会","tr":["collect","grow","repeat","regulate"],"ab":["集合","成長","規範"]},{"t":"図書館","d":"情報","tr":["collect","record","contain","organize","exchange"],"ab":["保存","集合"]},{"t":"カメラ","d":"道具","tr":["record","portable","regulate"],"ab":["保存"]},{"t":"写真","d":"芸術","tr":["record","contain"],"ab":["保存"]},{"t":"インターネット","d":"技術","tr":["connect","distribute","exchange","flow"],"ab":["交換","中継"]},{"t":"API","d":"技術","tr":["connect","filter","exchange","regulate"],"ab":["交換","境界"]},{"t":"ファイアウォール","d":"技術","tr":["filter","protect","regulate","separate"],"ab":["境界","規範"]},{"t":"銭湯","d":"社会","tr":["wash","restore","collect","repeat"],"ab":["回復","浄化","集合"]},{"t":"睡眠","d":"身体","tr":["restore","repeat","regulate"],"ab":["回復","循環"]},{"t":"病院","d":"社会","tr":["restore","protect","regulate","collect"],"ab":["回復","集合"]},{"t":"脱皮","d":"生物","tr":["transform","separate","grow","repeat"],"ab":["変化","成長"]},{"t":"ジュース","d":"食","tr":["flow","mix","exchange"],"ab":["流動","交換"]},{"t":"梅干し","d":"食","tr":["store","transform","restore"],"ab":["保存","変化","回復"]},{"t":"香水","d":"道具","tr":["flow","mix","exchange"],"ab":["流動","交換"]},{"t":"インク","d":"道具","tr":["flow","mix","record"],"ab":["流動","保存"]},{"t":"料理","d":"食","tr":["mix","transform","repeat","regulate"],"ab":["変化"]},{"t":"発酵","d":"食","tr":["mix","transform","repeat","grow"],"ab":["変化","成長"]},{"t":"市場","d":"経済","tr":["collect","exchange","distribute","regulate"],"ab":["交換","集合"]},{"t":"銀行","d":"経済","tr":["collect","exchange","record","regulate"],"ab":["交換","保存"]},{"t":"コンビニ","d":"社会","tr":["collect","exchange","distribute","contain"],"ab":["交換","集合"]},{"t":"SNS","d":"情報","tr":["connect","exchange","distribute","record"],"ab":["交換","保存"]},{"t":"広場","d":"都市","tr":["collect","connect","exchange"],"ab":["集合"]},{"t":"温室","d":"建築","tr":["cover","contain","grow","regulate"],"ab":["境界","成長"]},{"t":"ロケット","d":"宇宙","tr":["distribute","regulate","transform"],"ab":["変化"]},{"t":"祭り","d":"文化","tr":["collect","repeat","record"],"ab":["集合","保存"]},{"t":"儀式","d":"文化","tr":["repeat","regulate","record"],"ab":["規範","保存"]},{"t":"マナー","d":"社会","tr":["followrule","signal","repeat"],"ab":["規範"]},{"t":"失礼","d":"社会","tr":["deviate","signal"],"ab":["規範","変化"]},{"t":"エラー","d":"技術","tr":["deviate","signal"],"ab":["規範","変化"]},{"t":"交通違反","d":"交通","tr":["deviate","followrule"],"ab":["規範","変化"]},{"t":"タブー","d":"文化","tr":["deviate","followrule","signal"],"ab":["規範","変化"]},{"t":"プロトコル","d":"技術","tr":["followrule","signal"],"ab":["規範"]},{"t":"校則","d":"社会","tr":["followrule","signal","repeat"],"ab":["規範"]},{"t":"ドレスコード","d":"文化","tr":["followrule","signal"],"ab":["規範"]},{"t":"敬語","d":"文化","tr":["followrule","signal","repeat"],"ab":["規範"]},{"t":"筆箱","d":"道具","tr":["contain","organize","portable","openclose"],"ab":["保存","境界"]},{"t":"肺","d":"身体","tr":["expandcompress","airflow","pump","absorb","repeat"],"ab":["循環","交換"]},{"t":"翼","d":"生物","tr":["expandcompress","airflow","support","switch"],"ab":["変化"]},{"t":"アコーディオン","d":"楽器","tr":["expandcompress","openclose","airflow"],"ab":["変化"]},{"t":"蛇腹","d":"構造","tr":["expandcompress","openclose","protect"],"ab":["変化","境界"]},{"t":"巣","d":"生物","tr":["contain","organize","protect","collect"],"ab":["集合","境界"]},{"t":"種","d":"生物","tr":["store","contain","hatch","grow"],"ab":["保存","成長"]},{"t":"卵","d":"生物","tr":["contain","protect","hatch","grow"],"ab":["境界","成長"]},{"t":"細胞","d":"身体","tr":["contain","filter","regulate","copy"],"ab":["境界","成長"]},{"t":"胃","d":"身体","tr":["contain","mix","transform","release"],"ab":["変化","境界"]},{"t":"腸","d":"身体","tr":["absorb","filter","flow","transform"],"ab":["交換","流動"]},{"t":"腎臓","d":"身体","tr":["filter","regulate","release"],"ab":["浄化","交換"]},{"t":"スポンジ","d":"道具","tr":["absorb","release","wash"],"ab":["交換","浄化"]},{"t":"根","d":"生物","tr":["absorb","support","grow","branch"],"ab":["成長","交換"]},{"t":"掃除機","d":"道具","tr":["absorb","collect","filter","contain"],"ab":["集合","浄化"]},{"t":"ダム","d":"建築","tr":["store","release","regulate","flow"],"ab":["保存","流動"]},{"t":"電池","d":"技術","tr":["store","release","exchange","restore"],"ab":["保存","交換"]},{"t":"火山","d":"自然","tr":["store","release","transform","trigger"],"ab":["変化"]},{"t":"汗腺","d":"身体","tr":["release","filter","regulate"],"ab":["交換"]},{"t":"鏡","d":"道具","tr":["reflect","frame"],"ab":["境界"]},{"t":"水面","d":"自然","tr":["reflect","flow","regulate"],"ab":["流動"]},{"t":"エコー","d":"自然","tr":["reflect","repeat","signal"],"ab":["循環"]},{"t":"拡声器","d":"技術","tr":["amplify","broadcast","signal"],"ab":["交換"]},{"t":"レンズ","d":"道具","tr":["focus","amplify","frame","transform"],"ab":["変化"]},{"t":"てこ","d":"道具","tr":["amplify","support","switch"],"ab":["変化"]},{"t":"クッション","d":"道具","tr":["dampen","protect","support"],"ab":["境界"]},{"t":"防波堤","d":"建築","tr":["dampen","protect","separate"],"ab":["境界"]},{"t":"耳栓","d":"道具","tr":["dampen","filter","protect"],"ab":["境界"]},{"t":"指揮者","d":"文化","tr":["sync","regulate","signal","focus"],"ab":["規範"]},{"t":"時計","d":"道具","tr":["sync","repeat","record"],"ab":["循環","保存"]},{"t":"メトロノーム","d":"道具","tr":["sync","pulse","repeat"],"ab":["循環"]},{"t":"地層","d":"自然","tr":["stack","record","contain"],"ab":["保存"]},{"t":"年輪","d":"自然","tr":["stack","record","grow"],"ab":["保存","成長"]},{"t":"サンドイッチ","d":"食","tr":["stack","contain","mix"],"ab":["集合"]},{"t":"税関","d":"社会","tr":["sort","filter","regulate"],"ab":["規範","境界"]},{"t":"ふるい","d":"道具","tr":["sort","filter","repeat"],"ab":["境界"]},{"t":"ルーター","d":"技術","tr":["switch","connect","distribute","filter"],"ab":["中継","交換"]},{"t":"神経","d":"身体","tr":["switch","signal","connect","pulse"],"ab":["中継","交換"]},{"t":"ドミノ","d":"遊び","tr":["trigger","repeat","distribute"],"ab":["変化"]},{"t":"センサー","d":"技術","tr":["trigger","signal","filter"],"ab":["交換"]},{"t":"アラーム","d":"技術","tr":["trigger","signal","repeat"],"ab":["交換"]},{"t":"鍵","d":"道具","tr":["lock","filter","protect","switch"],"ab":["境界"]},{"t":"アンカー","d":"道具","tr":["lock","support","dampen"],"ab":["境界"]},{"t":"ブレーキ","d":"交通","tr":["lock","dampen","regulate"],"ab":["規範"]},{"t":"天秤","d":"道具","tr":["balance","regulate","signal"],"ab":["規範"]},{"t":"自律神経","d":"身体","tr":["balance","regulate","sync","signal"],"ab":["循環"]},{"t":"サーモスタット","d":"技術","tr":["balance","regulate","trigger"],"ab":["循環"]},{"t":"波","d":"自然","tr":["pulse","flow","repeat","broadcast"],"ab":["循環","流動"]},{"t":"車輪","d":"道具","tr":["rotate","support","repeat"],"ab":["循環"]},{"t":"歯車","d":"技術","tr":["rotate","connect","sync","amplify"],"ab":["循環"]},{"t":"惑星","d":"宇宙","tr":["orbit","rotate","repeat","balance"],"ab":["循環"]},{"t":"衛星","d":"宇宙","tr":["orbit","signal","record","broadcast"],"ab":["循環","保存"]},{"t":"電子","d":"科学","tr":["orbit","flow","signal"],"ab":["流動"]},{"t":"骨格","d":"身体","tr":["support","protect","connect"],"ab":["境界"]},{"t":"インフラ","d":"社会","tr":["support","connect","distribute","regulate"],"ab":["中継","規範"]},{"t":"サーバー","d":"技術","tr":["support","store","connect","distribute"],"ab":["保存","中継"]},{"t":"殻","d":"生物","tr":["wrap","protect","peel","hatch"],"ab":["境界","成長"]},{"t":"封筒","d":"道具","tr":["wrap","contain","signal","portable"],"ab":["境界","交換"]},{"t":"布団","d":"道具","tr":["wrap","protect","restore"],"ab":["回復","境界"]},{"t":"雲","d":"自然","tr":["wrap","store","release","flow"],"ab":["流動"]},{"t":"玉ねぎ","d":"食","tr":["peel","stack","contain"],"ab":["集合"]},{"t":"発掘","d":"文化","tr":["peel","record","collect"],"ab":["保存"]},{"t":"発芽","d":"生物","tr":["hatch","trigger","grow"],"ab":["成長"]},{"t":"繭","d":"生物","tr":["wrap","contain","hatch","transform"],"ab":["変化","成長"]},{"t":"噴水","d":"建築","tr":["pump","release","flow","repeat"],"ab":["流動","循環"]},{"t":"注射器","d":"医療","tr":["pump","contain","release","filter"],"ab":["交換"]},{"t":"水道","d":"社会","tr":["pump","flow","distribute","regulate"],"ab":["流動","中継"]},{"t":"渡り鳥","d":"生物","tr":["migrate","sync","grow","navigate"],"ab":["循環","成長"]},{"t":"データ移行","d":"情報","tr":["migrate","copy","record","connect"],"ab":["保存","交換"]},{"t":"遊牧","d":"文化","tr":["migrate","grow","collect"],"ab":["成長","集合"]},{"t":"DNA","d":"身体","tr":["copy","record","store","translate"],"ab":["保存","成長"]},{"t":"印刷","d":"技術","tr":["copy","record","broadcast"],"ab":["保存"]},{"t":"バックアップ","d":"情報","tr":["copy","store","restore","record"],"ab":["保存","回復"]},{"t":"細胞分裂","d":"身体","tr":["copy","grow","repeat"],"ab":["成長","循環"]},{"t":"消しゴム","d":"道具","tr":["erase","regulate","restore"],"ab":["回復"]},{"t":"忘却","d":"心理","tr":["erase","regulate","transform"],"ab":["変化"]},{"t":"リセット","d":"情報","tr":["erase","restore","trigger"],"ab":["回復","変化"]},{"t":"翻訳","d":"文化","tr":["translate","signal","transform"],"ab":["交換","変化"]},{"t":"エンコード","d":"情報","tr":["translate","record","transform"],"ab":["保存","変化"]},{"t":"楽譜","d":"文化","tr":["translate","record","signal"],"ab":["保存"]},{"t":"比喩","d":"言語","tr":["translate","signal","frame"],"ab":["変化"]},{"t":"義手","d":"身体","tr":["substitute","support","connect","signal"],"ab":["回復"]},{"t":"プロキシ","d":"技術","tr":["substitute","connect","filter"],"ab":["中継"]},{"t":"影武者","d":"文化","tr":["substitute","protect","signal"],"ab":["規範"]},{"t":"会議","d":"社会","tr":["focus","collect","signal","regulate"],"ab":["集合","規範"]},{"t":"虫眼鏡","d":"道具","tr":["focus","amplify","frame"],"ab":["変化"]},{"t":"アンテナ","d":"技術","tr":["focus","broadcast","signal","absorb"],"ab":["交換"]},{"t":"窓","d":"建築","tr":["frame","filter","reflect","separate"],"ab":["境界"]},{"t":"額縁","d":"芸術","tr":["frame","contain","signal"],"ab":["境界"]},{"t":"編集","d":"情報","tr":["frame","sort","erase","record"],"ab":["保存","変化"]},{"t":"ラジオ","d":"技術","tr":["broadcast","signal","record"],"ab":["交換","保存"]},{"t":"花粉","d":"生物","tr":["broadcast","migrate","grow"],"ab":["成長"]},{"t":"種子散布","d":"生物","tr":["broadcast","migrate","grow"],"ab":["成長"]},{"t":"堆肥","d":"自然","tr":["recycle","transform","grow"],"ab":["成長","循環"]},{"t":"古着","d":"文化","tr":["recycle","substitute","record"],"ab":["保存"]},{"t":"再生紙","d":"技術","tr":["recycle","transform","record"],"ab":["保存","変化"]},{"t":"水循環","d":"自然","tr":["recycle","flow","repeat"],"ab":["循環","流動"]},{"t":"突然変異","d":"生物","tr":["deviate","transform","grow"],"ab":["変化","成長"]},{"t":"ノイズ","d":"情報","tr":["deviate","signal","dampen"],"ab":["規範","変化"]},{"t":"蜂の巣","d":"生物","tr":["collect","organize","grow","support"],"ab":["集合","成長"]},{"t":"地下鉄","d":"交通","tr":["collect","distribute","connect","branch"],"ab":["中継","集合"]},{"t":"宇宙船","d":"宇宙","tr":["contain","support","migrate","regulate"],"ab":["境界","変化"]},{"t":"ブラックホール","d":"宇宙","tr":["absorb","focus"],"ab":["集合"]},{"t":"図鑑","d":"情報","tr":["sort","record","contain","frame"],"ab":["保存","集合"]},{"t":"ジェット気流","d":"自然","tr":["airflow","flow","broadcast"],"ab":["流動"]},{"t":"台風","d":"自然","tr":["airflow","rotate","flow","release"],"ab":["流動","変化"]},{"t":"呼吸","d":"身体","tr":["airflow","repeat","expandcompress"],"ab":["循環"]},{"t":"太陽帆","d":"宇宙","tr":["expandcompress","reflect","migrate","cover"],"ab":["変化"]},{"t":"舞台幕","d":"文化","tr":["openclose","expandcompress","cover","signal"],"ab":["境界","変化"]},{"t":"帽子","d":"道具","tr":["wrap","cover","protect","portable"],"ab":["境界"]},{"t":"屋根","d":"建築","tr":["cover","protect","support"],"ab":["境界"]},{"t":"大気圏","d":"自然","tr":["wrap","protect","filter"],"ab":["境界"]},{"t":"映画","d":"芸術","tr":["simulate","frame","record"],"ab":["変化","保存"]},{"t":"小説","d":"芸術","tr":["simulate","frame","record"],"ab":["変化","保存"]},{"t":"想像","d":"心理","tr":["simulate","frame"],"ab":["変化"]},{"t":"目標","d":"心理","tr":["aspire","focus","grow"],"ab":["成長"]},{"t":"計画","d":"情報","tr":["aspire","record","regulate"],"ab":["成長","保存"]},{"t":"理想","d":"心理","tr":["aspire","focus"],"ab":["成長"]},{"t":"VR","d":"技術","tr":["simulate","frame"],"ab":["変化"]},{"t":"舞台","d":"文化","tr":["simulate","frame","signal"],"ab":["変化"]},{"t":"ゲーム","d":"遊び","tr":["simulate","trigger","rule"],"ab":["変化"]},{"t":"ロードマップ","d":"情報","tr":["aspire","record","focus"],"ab":["成長","保存"]}];

const SENSES = {
  '夢': [
    {id:'sleep', label:'寝ているときに見る夢', note:'眠っている間の映像・体験',
      traits:['simulate','frame'], domain:'心理'},
    {id:'goal', label:'将来の夢・目標', note:'願いや、なりたい未来',
      traits:['aspire','focus','grow'], domain:'心理'}
  ],
  '橋': [
    {id:'structure', label:'川や谷にかかる橋', note:'向こう側へ渡るための構造物',
      traits:['connect','support'], domain:'建築'},
    {id:'metaphor', label:'人や物事をつなぐ橋', note:'関係をつくる比喩',
      traits:['connect','exchange'], domain:'社会'}
  ]
};

const RELATION_LABELS = {
  synonym:'同じ・近い意味',
  similar:'似た意味',
  broader:'上位概念',
  narrower:'下位概念',
  usedFor:'用途',
  property:'性質',
  capableOf:'動き',
  action:'受ける動き',
  partOf:'全体',
  hasPart:'部分',
  antonym:'反対',
  location:'場所',
  causes:'原因・結果',
  madeOf:'材料',
  createdBy:'作られ方',
  related:'関連',
  dictionary:'辞書リンク'
};

const RELATION_GROUPS = [
  {id:'meaning', label:'意味', types:['synonym','similar']},
  {id:'kind', label:'種類', types:['broader','narrower']},
  {id:'use', label:'用途', types:['usedFor']},
  {id:'property', label:'性質', types:['property']},
  {id:'action', label:'動き', types:['capableOf','action']},
  {id:'part', label:'部分・全体', types:['partOf','hasPart','madeOf']},
  {id:'opposite', label:'反対', types:['antonym']},
  {id:'related', label:'関連', types:['location','causes','createdBy','related','dictionary']}
];

const EXAMPLES = ['扇子','傘','帽子','銭湯','学校','駅','森','筆箱','夢','橋'];

window.MW_DATA = {
  TRAITS, TRAIT_WEIGHTS, SEED_WORDS, SENSES,
  RELATION_LABELS, RELATION_GROUPS, EXAMPLES
};
