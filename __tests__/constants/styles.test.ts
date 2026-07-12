import { Colors, globalStyles } from '../../constants/styles';

describe('constants/styles', () => {
  describe('Colors', () => {
    it('tiene todos los colores definidos', () => {
      expect(Colors.primary).toBe('#005063');
      expect(Colors.background).toBe('#fff');
      expect(Colors.inputBg).toBe('#EAE6F0');
      expect(Colors.textMain).toBe('#1a1a1a');
      expect(Colors.textSecondary).toBe('#666');
      expect(Colors.textLight).toBe('#444');
      expect(Colors.white).toBe('#fff');
      expect(Colors.logoBg).toBe('#f0f4f5');
    });
  });

  describe('globalStyles', () => {
    it('contiene todos los estilos esperados', () => {
      expect(globalStyles.container).toBeDefined();
      expect(globalStyles.form).toBeDefined();
      expect(globalStyles.inputWrapper).toBeDefined();
      expect(globalStyles.title).toBeDefined();
      expect(globalStyles.inputContainer).toBeDefined();
      expect(globalStyles.inputLabel).toBeDefined();
      expect(globalStyles.input).toBeDefined();
      expect(globalStyles.helperText).toBeDefined();
      expect(globalStyles.button).toBeDefined();
      expect(globalStyles.buttonText).toBeDefined();
      expect(globalStyles.linkContainer).toBeDefined();
      expect(globalStyles.linkText).toBeDefined();
      expect(globalStyles.linkTextBold).toBeDefined();
    });

    it('el container usa Colors.background', () => {
      expect(globalStyles.container.backgroundColor).toBe(Colors.background);
    });

    it('inputWrapper tiene marginBottom 20', () => {
      expect(globalStyles.inputWrapper.marginBottom).toBe(20);
    });

    it('button usa Colors.primary como backgroundColor', () => {
      expect(globalStyles.button.backgroundColor).toBe(Colors.primary);
    });

    it('buttonText usa Colors.white', () => {
      expect(globalStyles.buttonText.color).toBe(Colors.white);
    });
  });
});
