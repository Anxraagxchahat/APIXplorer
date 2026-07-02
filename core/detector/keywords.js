/**
 * Keyword dictionaries used by the detector rules.
 *
 * Each array contains signal terms that help classify URLs by pathname and
 * query parameters without coupling the logic to UI or scanning behavior.
 */

export const KEYWORDS = {
  product: ["product", "item", "sku", "variant", "detail"],
  search: ["search", "find", "query", "s"],
  cart: ["cart", "basket", "checkout"],
  offer: ["offer", "discount", "deal", "promo"],
  auth: ["auth", "login", "signin", "oauth", "token"],
  user: ["user", "account", "profile", "member"],
  order: ["order", "checkout", "purchase", "invoice"],
  payment: ["payment", "pay", "billing", "charge"],
  inventory: ["inventory", "stock", "availability", "warehouse"],
  review: ["review", "rating", "comment", "feedback"],
  graphql: ["graphql", "gql"],
  staticAsset: [".js", ".css", ".png", ".jpg", ".jpeg", ".svg", ".webp", ".ico", ".json", ".woff", ".woff2"],
};
