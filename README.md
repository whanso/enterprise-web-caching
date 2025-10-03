# Enterprise Web Caching

The purpose of this repository is to explore caching methods for a web server.

- Caching for:
  1. The web server
  2. The CDN

# Web Server and CDN Caching

This cheatsheet provides essential information about web server and CDN caching.

## Cache-Control Headers

`Cache-Control` is an HTTP header that specifies caching policies in both client requests and server responses.

- `public`: The response may be cached by any cache.
  - **Example:** A blog post that is the same for all users.
- `private`: The response is for a single user and must not be cached by a shared cache.
  - **Example:** A user's account page.
- `no-cache`: The client must revalidate with the server before using a cached response.
  - **Example:** A resource that needs to be fresh, but you want to avoid re-downloading it if it hasn't changed.
- `no-store`: The cache must not store any part of the request or response.
  - **Example:** Sensitive data, such as a bank account balance.
- `max-age=<seconds>`: The maximum amount of time that a resource is considered fresh.
  - **Example:** A static asset, such as an image or CSS file, that doesn't change often.
- `s-maxage=<seconds>`: Similar to `max-age`, but it applies to shared caches (e.g., CDNs).
  - **Example:** A news article that can be cached by a CDN for a short period of time.
- `must-revalidate`: The cache must revalidate stale resources with the origin server.
  - **Example:** A resource that must be fresh, such as a stock price.
- `proxy-revalidate`: Similar to `must-revalidate`, but it applies to shared caches.
  - **Example:** A resource that must be fresh, but only for shared caches.
- `stale-while-revalidate=<seconds>`: The cache can serve a stale response while it revalidates in the background.
  - **Example:** A social media feed, where it's acceptable to show slightly out-of-date content while fresh content is being fetched.

## ETag Headers

`ETag` (entity tag) is an HTTP header that provides a unique identifier for a resource. It is used to determine if a resource has changed between requests.

When a client makes a request, the server can include an `ETag` header in the response. The client can then store the `ETag` and include it in subsequent requests in an `If-None-Match` header. If the `ETag` matches, the server can respond with a `304 Not Modified` status code, which tells the client that it can use its cached version of the resource.

## Last-Modified Headers

`Last-Modified` is an HTTP header that indicates the date and time at which the origin server believes the resource was last modified.

When a client makes a request, the server can include a `Last-Modified` header in the response. The client can then store the `Last-Modified` date and include it in subsequent requests in an `If-Modified-Since` header. If the resource has not been modified since the specified date, the server can respond with a `304 Not Modified` status code.

## CDN Caching

A Content Delivery Network (CDN) is a network of servers that are distributed geographically and work together to provide fast delivery of Internet content.

CDNs cache content in multiple locations around the world. When a user requests content, the CDN serves it from the location that is closest to the user. This reduces latency and improves performance.

CDNs use the same caching headers as web servers to determine how to cache content. You can also configure caching rules in your CDN to control how content is cached.
