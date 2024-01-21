export const formatPrice = price => {
  const [left, right] = `${price}`.split('.');
  return price <= 0 ? 'FREE' : `$${left}.${right.padEnd(2, '0')}`;
}
