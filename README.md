# 🖱️ Mouse Pointer Sample

好きな画像をマウスカーソルに設定できる Chrome 拡張機能の雛形です。  
`cursor.png` を差し替えるだけで、オリジナルのカーソルを作れます。

---

## カスタマイズ方法

### 1. カーソル画像を用意する

- 形式: **PNG（背景透過）**
- サイズ: **128×128px 以内**
- `cursor.png` という名前で保存してこのフォルダに置く

### 2. ホットスポットを調整する

ホットスポットとは「クリックとして認識される点」の座標です。  
矢印なら先端、十字なら中心など、画像に合わせて `content.js` の以下の値を変更します。

```js
cursor: url("${cursorUrl}") 26 10, auto !important;
//                           ↑x ↑y  ← 画像内の座標（px）
```

---

## インストール手順

### 1. リポジトリをダウンロード

```bash
git clone https://github.com/yugo-yamamoto/mouse_pointer_sample.git
```

または [ZIP でダウンロード](https://github.com/yugo-yamamoto/mouse_pointer_sample/archive/refs/heads/master.zip) して解凍します。

### 2. Chrome に読み込む

1. Chrome のアドレスバーに `chrome://extensions` を入力して開く
2. 右上の **「デベロッパーモード」** トグルをオンにする
3. **「パッケージ化されていない拡張機能を読み込む」** をクリック
4. ダウンロードしたフォルダを選択

### 3. 動作確認

任意のページを開いてマウスを動かすとカスタムカーソルが反映されます。

---

## おまけ機能

ツールバーのアイコンをクリックすると ON/OFF を切り替えられます。

| トグル | 説明 |
|--------|------|
| カーソル | カーソル画像の適用を ON/OFF |
| ✨ キラキラ | マウス移動時のパーティクルエフェクトを ON/OFF |

---

## ファイル構成

```
mouse_pointer_sample/
├── manifest.json   # 拡張機能の設定
├── content.js      # カーソル変更・パーティクルのメインロジック
├── popup.html      # ON/OFF トグルのポップアップ UI
├── popup.js        # ポップアップのロジック
└── cursor.png      # ← ここを好きな画像に差し替える
```
