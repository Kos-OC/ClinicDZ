/**
 * Render a certificate by replacing all {{PLACEHOLDER}} keys in templateBody
 * with corresponding values from variables.
 * Unknown placeholders are left untouched.
 */
export function renderCertificate(templateBody, variables) {
  return templateBody.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return key in variables ? variables[key] : match;
  });
}