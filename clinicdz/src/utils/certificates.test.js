import { renderCertificate } from './certificates';

describe('renderCertificate', () => {
  it('replaces all known placeholders', () => {
    const body = 'Bonjour {{NOM}}, vous avez {{AGE}} ans.';
    const vars = { NOM: 'Ali', AGE: '30' };
    expect(renderCertificate(body, vars)).toBe('Bonjour Ali, vous avez 30 ans.');
  });

  it('leaves unknown placeholders untouched', () => {
    const body = 'Bonjour {{NOM}}, diagnose: {{INCONNUE}}.';
    const vars = { NOM: 'Ali' };
    expect(renderCertificate(body, vars)).toBe('Bonjour Ali, diagnose: {{INCONNUE}}.');
  });

  it('handles empty variables object', () => {
    const body = 'Bonjour {{NOM}}, date: {{DATE}}';
    expect(renderCertificate(body, {})).toBe('Bonjour {{NOM}}, date: {{DATE}}');
  });

  it('replaces multiple occurrences of same placeholder', () => {
    const body = '{{NOM}} -- {{NOM}} -- {{NOM}}';
    const vars = { NOM: 'Sara' };
    expect(renderCertificate(body, vars)).toBe('Sara -- Sara -- Sara');
  });
});