export const formatPrice = price => {
  let [left, right] = `${price}`.split('.');
  right = right === undefined ? '0' : right;
  return price <= 0 ? 'FREE' : `$${left}.${right.padEnd(2, '0')}`;
}
