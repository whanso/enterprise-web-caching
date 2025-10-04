import { NextFunction, Request, Response } from "express";

// securityHeaders.js
export function securityHeaders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Content-Security-Policy (CSP)
  // Controls which sources can load content (scripts, styles, images, etc.)
  // Helps prevent XSS attacks by locking down allowed origins.
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' ajax.googleapis.com; style-src 'self'; img-src 'self'; frame-ancestors 'none'"
  );

  // Strict-Transport-Security (HSTS)
  // Forces browsers to only connect over HTTPS for the given time (2 years here).
  // "includeSubDomains" applies to all subdomains, "preload" allows entry into browser preload lists.
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // X-Content-Type-Options
  // Prevents MIME-sniffing; forces the browser to respect the Content-Type header.
  // Mitigates certain injection attacks.
  res.setHeader("X-Content-Type-Options", "nosniff");

  // X-Frame-Options
  // Prevents the site from being embedded in an <iframe>.
  // Protects against clickjacking attacks.
  res.setHeader("X-Frame-Options", "DENY");

  // Referrer-Policy
  // Controls how much referrer information is sent in requests.
  // "no-referrer" ensures nothing is leaked to external sites.
  res.setHeader("Referrer-Policy", "no-referrer");

  // Permissions-Policy (formerly Feature-Policy)
  // Controls access to powerful APIs like camera, microphone, and geolocation.
  // Here, all are disabled.
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), camera=(), microphone=(), payment=()"
  );

  // Cross-Origin-Resource-Policy (CORP)
  // Restricts which sites can load your resources.
  // "same-origin" means only your own site can request them.
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");

  // Cross-Origin-Opener-Policy (COOP)
  // Ensures a top-level document has its own browsing context group.
  // Helps isolate your site from cross-origin windows.
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

  // Cross-Origin-Embedder-Policy (COEP)
  // Ensures that cross-origin resources must explicitly grant permission to be loaded.
  // Required for advanced features like SharedArrayBuffer.
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

  // Cache-Control
  // Prevents sensitive content from being cached locally or by proxies.
  // Useful for banking, dashboards, and authenticated pages.
  // res.setHeader("Cache-Control", "no-store");
  next();
}
