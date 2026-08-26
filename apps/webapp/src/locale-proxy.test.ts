/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { proxy } from './locale-proxy';

describe('The locale proxy middleware handler', () => {
  describe('When requesting a path with an existing locale', () => {
    it('should set the locale cookie and pass through', () => {
      const request = new NextRequest('https://sentryguard.org/fr/faq');

      const response = proxy(request);

      expect(response.status).toBe(200);
      expect(response.cookies.get('locale')?.value).toBe('fr');
    });
  });

  describe('When requesting the root path without locale', () => {
    it('should redirect to the default locale', () => {
      const request = new NextRequest('https://sentryguard.org/');

      const response = proxy(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('https://sentryguard.org/en');
    });
  });

  describe('When requesting with accept-language fr', () => {
    it('should redirect to /fr', () => {
      const request = new NextRequest('https://sentryguard.org/faq', {
        headers: {
          'accept-language': 'fr-FR,fr;q=0.9',
        },
      });

      const response = proxy(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('https://sentryguard.org/fr/faq');
    });
  });
});
