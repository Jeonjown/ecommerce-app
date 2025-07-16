export function generateSku(
  productName: string,
  option1?: string | null,
  option2?: string | null,
  option3?: string | null
): string {
  const base = productName.trim().toUpperCase().replace(/\s+/g, '-');

  const options = [option1, option2, option3]
    .filter((o) => o && o.trim())
    .map((o) => o!.trim().toUpperCase().replace(/\s+/g, '-'));

  const randomSuffix = Math.floor(1000 + Math.random() * 9000); // e.g., 4567

  return [base, ...options, randomSuffix].join('-');
}
