export const colors = {
  primary: '#FF6B8A',       // メインピンク
  primaryLight: '#FFB3C1',  // 薄いピンク
  primaryDark: '#E84C6D',   // 濃いピンク
  secondary: '#FF9A76',     // コーラル/ピーチ
  accent: '#FFD6E0',        // アクセント淡ピンク
  background: '#FFF5F7',    // 背景
  surface: '#FFFFFF',       // カード背景
  surfaceWarm: '#FFF0F3',   // 温かみのあるサーフェス
  text: '#3D2C2C',          // メインテキスト
  textSecondary: '#8B6A6A', // サブテキスト
  textLight: '#B99B9B',     // 薄いテキスト
  border: '#FFD6E0',        // ボーダー
  success: '#4CAF82',       // 成功
  warning: '#FFB347',       // 警告
  error: '#FF6B6B',         // エラー
  disabled: '#D4B8BC',      // 無効
  shadow: 'rgba(255,107,138,0.15)',
  overlay: 'rgba(61,44,44,0.5)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 100,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: colors.text },
  h2: { fontSize: 22, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: 18, fontWeight: '600' as const, color: colors.text },
  h4: { fontSize: 16, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.text },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, color: colors.textSecondary },
  caption: { fontSize: 11, fontWeight: '400' as const, color: colors.textLight },
  button: { fontSize: 16, fontWeight: '600' as const },
};

export const shadow = {
  sm: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
